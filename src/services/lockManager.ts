/**
 * Server-Backed Profile Security & Lock Manager Client
 *
 * All lock states, password verifications, owner authentication, HTTP-only sessions,
 * rate limiting, and OTP recovery run strictly server-side via Vercel Functions (`/api/*`)
 * backed by persistent Supabase PostgreSQL storage.
 *
 * Neither localStorage nor sessionStorage is used as a security mechanism.
 */

import type { ProfileId } from '../data/portfolio';

export interface ProfileLockState {
  isLocked: boolean;
  hasPassword: boolean;
  unlocked: boolean;
  sessionVersion?: number;
  updatedAt?: string;
}

export interface RecoveryProviderStatus {
  emailConfigured: boolean;
  smsConfigured: boolean;
  missingEmailVars: string[];
  missingSmsVars: string[];
}

export interface OwnerSecurityStatus {
  emailVerified: boolean;
  phoneVerified: boolean;
  maskedEmail: string | null;
  maskedPhone: string | null;
  emailProviderConfigured: boolean;
  smsProviderConfigured: boolean;
  missingEmailVars: string[];
  missingSmsVars: string[];
  backupCodesRemaining: number;
}

export interface SecurityAuditItem {
  event_type: string;
  profile_id: string | null;
  channel: string | null;
  success: boolean;
  created_at: string;
}

export interface OwnerAuthState {
  backendConfigured: boolean;
  missingDatabaseVars?: string[];
  authenticated: boolean;
  ownerInitialized: boolean;
  bootstrapConfigured: boolean;
  recoveryStatus?: {
    emailVerified: boolean;
    phoneVerified: boolean;
    maskedEmail?: string | null;
    maskedPhone?: string | null;
    backupCodesRemaining?: number;
    backupCodesConfigured?: boolean;
  };
  recoveryProviders?: RecoveryProviderStatus;
}

const DEFAULT_STATES: Record<ProfileId, ProfileLockState> = {
  giridhar: { isLocked: false, hasPassword: false, unlocked: true },
  recruiter: { isLocked: false, hasPassword: false, unlocked: true },
  creative: { isLocked: false, hasPassword: false, unlocked: true },
};

// In-memory snapshot mirrored strictly from server responses (never authoritative; server enforces every request)
let serverSnapshot: Record<ProfileId, ProfileLockState> = { ...DEFAULT_STATES };
let backendConfiguredFlag = true;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function subscribeLockStates(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isSecurityBackendConfigured(): boolean {
  return backendConfiguredFlag;
}

export function getProfileLockState(id: ProfileId): ProfileLockState {
  return serverSnapshot[id] || DEFAULT_STATES[id];
}

export function getAllLockStates(): Record<ProfileId, ProfileLockState> {
  return {
    giridhar: { ...serverSnapshot.giridhar },
    recruiter: { ...serverSnapshot.recruiter },
    creative: { ...serverSnapshot.creative },
  };
}

export function isProfileSessionUnlocked(id: ProfileId): boolean {
  const state = getProfileLockState(id);
  return !state.isLocked || state.unlocked;
}

async function apiJson<T>(url: string, init?: RequestInit): Promise<{ status: number; data: T }> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });
  let data: T;
  try {
    data = (await res.json()) as T;
  } catch {
    data = {} as T;
  }
  return { status: res.status, data };
}

/** Fetch globally synchronized lock states & current visitor cookie unlock states from server */
export async function syncProfileLockStates(): Promise<{
  backendConfigured: boolean;
  profiles: Record<ProfileId, ProfileLockState>;
}> {
  try {
    const { status, data } = await apiJson<{
      backendConfigured?: boolean;
      profiles?: Partial<Record<ProfileId, ProfileLockState>>;
    }>('/api/profiles/status', { method: 'GET' });

    if (status === 200 && data?.profiles) {
      backendConfiguredFlag = data.backendConfigured !== false;
      serverSnapshot = {
        giridhar: data.profiles.giridhar || DEFAULT_STATES.giridhar,
        recruiter: data.profiles.recruiter || DEFAULT_STATES.recruiter,
        creative: data.profiles.creative || DEFAULT_STATES.creative,
      };
      notifyListeners();
      return { backendConfigured: backendConfiguredFlag, profiles: getAllLockStates() };
    }
  } catch {
    /* Network or local Vite dev without API proxy */
  }
  return { backendConfigured: backendConfiguredFlag, profiles: getAllLockStates() };
}

/** Verify server-side access authorization before rendering any profile content (protects direct URLs) */
export async function verifyServerProfileAccess(
  profileId: ProfileId
): Promise<{ authorized: boolean; locked: boolean; error?: string }> {
  try {
    const { status, data } = await apiJson<{
      authorized?: boolean;
      locked?: boolean;
      error?: string;
    }>(`/api/profile-content?profileId=${encodeURIComponent(profileId)}`, { method: 'GET' });

    if (status === 401 && data.locked) {
      serverSnapshot = {
        ...serverSnapshot,
        [profileId]: {
          ...serverSnapshot[profileId],
          isLocked: true,
          unlocked: false,
        },
      };
      notifyListeners();
      return { authorized: false, locked: true, error: data.error };
    }

    if (status === 200 && data.authorized) {
      serverSnapshot = {
        ...serverSnapshot,
        [profileId]: {
          ...serverSnapshot[profileId],
          isLocked: Boolean(data.locked),
          unlocked: true,
        },
      };
      notifyListeners();
      return { authorized: true, locked: Boolean(data.locked) };
    }
  } catch {
    /* Fallback only if static local preview without API functions */
  }

  const cached = getProfileLockState(profileId);
  return { authorized: !cached.isLocked || cached.unlocked, locked: cached.isLocked };
}

/** Verify visitor password on server via bcrypt and receive HTTP-only session cookie */
export async function unlockProfileWithPassword(
  profileId: ProfileId,
  password: string
): Promise<{
  success: boolean;
  error?: string;
  remainingAttempts?: number;
  lockoutSeconds?: number;
}> {
  const { data } = await apiJson<{
    success?: boolean;
    error?: string;
    remainingAttempts?: number;
    lockoutSeconds?: number;
  }>('/api/profiles/unlock', {
    method: 'POST',
    body: JSON.stringify({ profileId, password }),
  });

  if (data.success) {
    await syncProfileLockStates();
    return { success: true };
  }

  return {
    success: false,
    error: data.error || 'Incorrect password. Access denied.',
    remainingAttempts: data.remainingAttempts,
    lockoutSeconds: data.lockoutSeconds,
  };
}

/** Owner Auth: Check server-side owner session & infrastructure readiness */
export async function fetchOwnerAuthState(): Promise<OwnerAuthState> {
  const { data } = await apiJson<OwnerAuthState>('/api/owner/auth', { method: 'GET' });
  return {
    backendConfigured: Boolean(data.backendConfigured),
    missingDatabaseVars: data.missingDatabaseVars || [],
    authenticated: Boolean(data.authenticated),
    ownerInitialized: Boolean(data.ownerInitialized),
    bootstrapConfigured: Boolean(data.bootstrapConfigured),
    recoveryStatus: data.recoveryStatus,
    recoveryProviders: data.recoveryProviders,
  };
}

/** Owner Auth: Initialize owner security (requires OWNER_BOOTSTRAP_SECRET) or sign in */
export async function authenticateOwnerOnServer(params: {
  action: 'initialize' | 'login';
  password: string;
  bootstrapSecret?: string;
}): Promise<{ success: boolean; error?: string; lockoutSeconds?: number }> {
  const { data } = await apiJson<{
    success?: boolean;
    error?: string;
    lockoutSeconds?: number;
  }>('/api/owner/auth', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return {
    success: Boolean(data.success),
    error: data.error,
    lockoutSeconds: data.lockoutSeconds,
  };
}

/** Owner Auth: Sign out & revoke HTTP-only owner session on server */
export async function logoutOwnerOnServer(): Promise<void> {
  await apiJson('/api/owner/auth', { method: 'DELETE' });
}

/** Owner Dashboard: Load lock states, security status & recent audit events */
export async function fetchOwnerDashboard(): Promise<{
  profiles: Record<ProfileId, ProfileLockState>;
  securityStatus: OwnerSecurityStatus;
  recentAudit: SecurityAuditItem[];
} | null> {
  const { status, data } = await apiJson<{
    profiles?: Record<ProfileId, ProfileLockState>;
    securityStatus?: OwnerSecurityStatus;
    recentAudit?: SecurityAuditItem[];
  }>('/api/owner/locks', { method: 'GET' });

  if (status !== 200 || !data.profiles || !data.securityStatus) {
    return null;
  }

  await syncProfileLockStates();
  return {
    profiles: data.profiles,
    securityStatus: data.securityStatus,
    recentAudit: data.recentAudit || [],
  };
}

/** Owner Action: Set/change password, toggle lock, remove password, or generate backup codes */
export async function mutateOwnerLock(payload: {
  action: 'set_password' | 'toggle_lock' | 'remove_password' | 'generate_backup_codes';
  profileId?: ProfileId;
  password?: string;
  isLocked?: boolean;
}): Promise<{ success: boolean; error?: string; backupCodes?: string[]; message?: string }> {
  const { data } = await apiJson<{
    success?: boolean;
    error?: string;
    backupCodes?: string[];
    message?: string;
  }>('/api/owner/locks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (data.success) {
    await syncProfileLockStates();
  }

  return {
    success: Boolean(data.success),
    error: data.error,
    backupCodes: data.backupCodes,
    message: data.message,
  };
}

/** Owner OTP & Backup Code Recovery API */
export async function callOwnerRecovery(payload: {
  action:
    | 'request_channel_verification'
    | 'confirm_channel_verification'
    | 'request_reset_otp'
    | 'complete_reset_with_otp'
    | 'complete_reset_with_backup_code';
  channel?: 'email' | 'sms';
  targetProfileId?: ProfileId | 'owner';
  otp?: string;
  newPassword?: string;
  backupCode?: string;
}): Promise<{
  success: boolean;
  error?: string;
  message?: string;
  cooldownSeconds?: number;
  missingVars?: string[];
  backupCodesRemaining?: number;
}> {
  const { data } = await apiJson<{
    success?: boolean;
    error?: string;
    message?: string;
    cooldownSeconds?: number;
    missingVars?: string[];
    backupCodesRemaining?: number;
  }>('/api/owner/recovery', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (data.success) {
    await syncProfileLockStates();
  }

  return {
    success: Boolean(data.success),
    error: data.error,
    message: data.message,
    cooldownSeconds: data.cooldownSeconds,
    missingVars: data.missingVars,
    backupCodesRemaining: data.backupCodesRemaining,
  };
}
