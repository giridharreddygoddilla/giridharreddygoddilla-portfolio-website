/**
 * Profile Lock Manager Service
 *
 * Provides cryptographic password management, rate-limiting, and lock control
 * for all 4 portfolio profile experiences:
 *   - Giridhar (Cinematic Series)
 *   - Recruiter (Executive Dossier)
 *   - Developer / Analyst (Engineering Workstation)
 *   - Creative (Editorial Storytelling)
 *
 * ARCHITECTURAL NOTICE (Client-Side Gate vs. Server-Side Protection):
 * In a static Vite client deployment, this service acts as a visitor-facing cryptographic access gate:
 * content components are unmounted and never rendered in the DOM until authentication succeeds.
 *
 * For full end-to-end data confidentiality where raw JSON/asset bundles must not be transmitted over the wire
 * prior to authentication, use the provided Supabase backend migration (`supabase/migrations/20261101_profile_locks.sql`)
 * which enforces server-side Row Level Security (RLS) and server-evaluated password verification via `pgcrypto`.
 */

import type { ProfileId } from '../data/portfolio';

export interface ProfileLockState {
  isLocked: boolean;
  hasPassword: boolean;
}

interface StoredLockData {
  isLocked: boolean;
  saltHex?: string;
  hashHex?: string;
  iterations?: number;
}

interface AttemptTracker {
  count: number;
  lockoutUntil: number;
}

const STORAGE_KEY_PREFIX = 'giridhar_lock_';
const SESSION_UNLOCKED_PREFIX = 'giridhar_unlocked_';
const OWNER_STORAGE_KEY = 'giridhar_owner_auth';
const OWNER_SESSION_KEY = 'giridhar_owner_session';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30 * 1000; // 30 seconds
const PBKDF2_ITERATIONS = 100000;

// In-memory rate limiting tracker
const attemptMap: Map<string, AttemptTracker> = new Map();

/** Convert BufferSource to Hex */
function buf2hex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Convert Hex to Uint8Array */
function hex2buf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/** Cryptographic PBKDF2 hash using Web Crypto API */
async function hashPassword(password: string, salt: Uint8Array, iterations = PBKDF2_ITERATIONS): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'HMAC', hash: 'SHA-256', length: 256 },
    true,
    ['sign']
  );

  const rawKey = await crypto.subtle.exportKey('raw', key);
  return buf2hex(rawKey);
}

/** Read profile lock from local storage */
function readLock(id: ProfileId): StoredLockData {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
    if (raw) return JSON.parse(raw);
  } catch {
    /* storage unavailable */
  }
  return { isLocked: false };
}

/** Write profile lock to local storage */
function writeLock(id: ProfileId, data: StoredLockData): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, JSON.stringify(data));
  } catch {
    /* storage unavailable */
  }
}

/** Check if profile is currently locked */
export function getProfileLockState(id: ProfileId): ProfileLockState {
  const data = readLock(id);
  return {
    isLocked: !!data.isLocked && !!data.hashHex,
    hasPassword: !!data.hashHex,
  };
}

/** Get lock states for all 4 profiles */
export function getAllLockStates(): Record<ProfileId, ProfileLockState> {
  const profiles: ProfileId[] = ['giridhar', 'recruiter', 'developer', 'creative'];
  const res = {} as Record<ProfileId, ProfileLockState>;
  profiles.forEach((p) => {
    res[p] = getProfileLockState(p);
  });
  return res;
}

/** Check if current visitor has already unlocked this profile in active session */
export function isProfileSessionUnlocked(id: ProfileId): boolean {
  const state = getProfileLockState(id);
  if (!state.isLocked) return true; // not locked, always allowed
  try {
    return sessionStorage.getItem(`${SESSION_UNLOCKED_PREFIX}${id}`) === 'unlocked';
  } catch {
    return false;
  }
}

/** Mark profile as unlocked for current visitor session */
export function markProfileSessionUnlocked(id: ProfileId): void {
  try {
    sessionStorage.setItem(`${SESSION_UNLOCKED_PREFIX}${id}`, 'unlocked');
  } catch {
    /* storage unavailable */
  }
}

/** Verify visitor password with cryptographic hashing and rate limiting */
export async function unlockProfileWithPassword(
  id: ProfileId,
  passwordInput: string
): Promise<{
  success: boolean;
  error?: string;
  remainingAttempts?: number;
  lockoutSeconds?: number;
}> {
  const now = Date.now();
  const tracker = attemptMap.get(id) || { count: 0, lockoutUntil: 0 };

  // Check active lockout
  if (tracker.lockoutUntil > now) {
    const remainingSec = Math.ceil((tracker.lockoutUntil - now) / 1000);
    return {
      success: false,
      error: `Too many failed attempts. Please wait ${remainingSec}s before retrying.`,
      lockoutSeconds: remainingSec,
    };
  }

  const data = readLock(id);
  if (!data.isLocked || !data.hashHex || !data.saltHex) {
    // Not locked
    markProfileSessionUnlocked(id);
    return { success: true };
  }

  const salt = hex2buf(data.saltHex);
  const iterations = data.iterations || PBKDF2_ITERATIONS;
  const computedHash = await hashPassword(passwordInput, salt, iterations);

  if (computedHash === data.hashHex) {
    // Success: reset rate limit & record session unlock
    attemptMap.delete(id);
    markProfileSessionUnlocked(id);
    return { success: true };
  }

  // Failure: increment attempt count
  tracker.count += 1;
  if (tracker.count >= MAX_ATTEMPTS) {
    tracker.lockoutUntil = now + LOCKOUT_MS;
    tracker.count = 0;
    attemptMap.set(id, tracker);
    return {
      success: false,
      error: `Incorrect password. Locked out for 30 seconds due to repeated failed attempts.`,
      lockoutSeconds: 30,
    };
  }

  attemptMap.set(id, tracker);
  const remaining = MAX_ATTEMPTS - tracker.count;
  return {
    success: false,
    error: `Incorrect password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    remainingAttempts: remaining,
  };
}

/**
 * Owner Management: Set or remove password and toggle lock status.
 * Can be called ONLY after owner authentication.
 */
export async function setProfileLock(
  id: ProfileId,
  isLocked: boolean,
  newPassword?: string
): Promise<{ success: boolean; error?: string }> {
  const current = readLock(id);

  if (newPassword !== undefined && newPassword.trim().length > 0) {
    if (newPassword.trim().length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const saltHex = buf2hex(salt.buffer);
    const hashHex = await hashPassword(newPassword.trim(), salt);
    writeLock(id, {
      isLocked,
      saltHex,
      hashHex,
      iterations: PBKDF2_ITERATIONS,
    });
    return { success: true };
  }

  // Toggling lock with existing password
  if (isLocked && !current.hashHex) {
    return {
      success: false,
      error: 'Cannot lock profile without setting a password first.',
    };
  }

  writeLock(id, {
    ...current,
    isLocked,
  });
  return { success: true };
}

/** Owner Management: Completely remove password and unlock profile */
export function removeProfilePassword(id: ProfileId): { success: boolean } {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`);
    sessionStorage.removeItem(`${SESSION_UNLOCKED_PREFIX}${id}`);
  } catch {
    /* storage unavailable */
  }
  return { success: true };
}

/** Owner Authentication: Check if owner is signed in for this session */
export function isOwnerAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(OWNER_SESSION_KEY) === 'authenticated';
  } catch {
    return false;
  }
}

/** Owner Authentication: Check if an owner passphrase has been initialized */
export function isOwnerPassphraseInitialized(): boolean {
  try {
    return !!localStorage.getItem(OWNER_STORAGE_KEY);
  } catch {
    return false;
  }
}

/** Owner Authentication: Initialize or set owner master passphrase */
export async function initializeOwnerPassphrase(passphrase: string): Promise<{ success: boolean; error?: string }> {
  if (passphrase.trim().length < 6) {
    return { success: false, error: 'Owner passphrase must be at least 6 characters.' };
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = buf2hex(salt.buffer);
  const hashHex = await hashPassword(passphrase.trim(), salt);
  try {
    localStorage.setItem(OWNER_STORAGE_KEY, JSON.stringify({ saltHex, hashHex, iterations: PBKDF2_ITERATIONS }));
    sessionStorage.setItem(OWNER_SESSION_KEY, 'authenticated');
    return { success: true };
  } catch {
    return { success: false, error: 'Storage access failed.' };
  }
}

/** Owner Authentication: Authenticate owner with master passphrase */
export async function authenticateOwner(passphrase: string): Promise<{ success: boolean; error?: string }> {
  try {
    const raw = localStorage.getItem(OWNER_STORAGE_KEY);
    if (!raw) {
      return { success: false, error: 'Owner passphrase not initialized yet.' };
    }
    const data = JSON.parse(raw);
    const salt = hex2buf(data.saltHex);
    const hashHex = await hashPassword(passphrase.trim(), salt, data.iterations || PBKDF2_ITERATIONS);

    if (hashHex === data.hashHex) {
      sessionStorage.setItem(OWNER_SESSION_KEY, 'authenticated');
      return { success: true };
    }
    return { success: false, error: 'Invalid owner passphrase.' };
  } catch {
    return { success: false, error: 'Authentication failed.' };
  }
}

/** Owner Authentication: Log out owner */
export function logoutOwner(): void {
  try {
    sessionStorage.removeItem(OWNER_SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
}
