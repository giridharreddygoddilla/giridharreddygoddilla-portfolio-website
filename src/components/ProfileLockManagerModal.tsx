import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { viewerProfiles, type ProfileId } from '../data/portfolio';
import {
  authenticateOwnerOnServer,
  callOwnerRecovery,
  fetchOwnerAuthState,
  fetchOwnerDashboard,
  logoutOwnerOnServer,
  mutateOwnerLock,
  type OwnerAuthState,
  type OwnerSecurityStatus,
  type ProfileLockState,
  type SecurityAuditItem,
} from '../services/lockManager';
import { playClick } from '../hooks/useSoundFX';

interface ProfileLockManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLockStateChange?: () => void;
}

type ManagerTab = 'locks' | 'recovery' | 'status';

export default function ProfileLockManagerModal({
  isOpen,
  onClose,
  onLockStateChange,
}: ProfileLockManagerModalProps) {
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState<OwnerAuthState | null>(null);
  const [activeTab, setActiveTab] = useState<ManagerTab>('locks');

  // Auth form
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bootstrapSecret, setBootstrapSecret] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Forgot owner password mode (before sign-in)
  const [ownerRecoveryOpen, setOwnerRecoveryOpen] = useState(false);
  const [ownerRecoveryMethod, setOwnerRecoveryMethod] = useState<'email' | 'sms' | 'backup'>('email');
  const [ownerOtpSent, setOwnerOtpSent] = useState(false);
  const [ownerOtpCode, setOwnerOtpCode] = useState('');
  const [ownerBackupCode, setOwnerBackupCode] = useState('');
  const [ownerNewPass, setOwnerNewPass] = useState('');

  // Authenticated dashboard state
  const [locks, setLocks] = useState<Record<ProfileId, ProfileLockState> | null>(null);
  const [securityStatus, setSecurityStatus] = useState<OwnerSecurityStatus | null>(null);
  const [recentAudit, setRecentAudit] = useState<SecurityAuditItem[]>([]);
  const [activeEditingId, setActiveEditingId] = useState<ProfileId | null>(null);
  const [newProfilePassword, setNewProfilePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [generatedBackupCodes, setGeneratedBackupCodes] = useState<string[] | null>(null);

  // Recovery tab state
  const [verifyChannel, setVerifyChannel] = useState<'email' | 'sms' | null>(null);
  const [verifyOtpInput, setVerifyOtpInput] = useState('');
  const [resetTarget, setResetTarget] = useState<ProfileId>('recruiter');
  const [resetChannel, setResetChannel] = useState<'email' | 'sms' | 'backup'>('email');
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [resetOtpCode, setResetOtpCode] = useState('');
  const [resetBackupInput, setResetBackupInput] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');

  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const state = await fetchOwnerAuthState();
      setAuthState(state);
      if (state.backendConfigured && state.authenticated) {
        const dash = await fetchOwnerDashboard();
        if (dash) {
          setLocks(dash.profiles);
          setSecurityStatus(dash.securityStatus);
          setRecentAudit(dash.recentAudit);
        }
      }
    } catch {
      setAuthError('Unable to reach server security endpoints.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setNotice(null);
    setAuthError(null);
    setGeneratedBackupCodes(null);
    loadAll();
  }, [isOpen, loadAll]);

  if (!isOpen) return null;

  const refreshDashboard = async () => {
    const dash = await fetchOwnerDashboard();
    if (dash) {
      setLocks(dash.profiles);
      setSecurityStatus(dash.securityStatus);
      setRecentAudit(dash.recentAudit);
    }
    onLockStateChange?.();
  };

  const handleOwnerAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState || submitting) return;
    setAuthError(null);

    if (!authState.ownerInitialized) {
      if (passwordInput.trim().length < 8) {
        setAuthError('Owner password must be at least 8 characters.');
        return;
      }
      if (passwordInput !== confirmPassword) {
        setAuthError('Passwords do not match.');
        return;
      }
      if (!bootstrapSecret.trim()) {
        setAuthError('Enter the server OWNER_BOOTSTRAP_SECRET to initialize owner access.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await authenticateOwnerOnServer({
        action: authState.ownerInitialized ? 'login' : 'initialize',
        password: passwordInput.trim(),
        bootstrapSecret: authState.ownerInitialized ? undefined : bootstrapSecret.trim(),
      });
      if (res.success) {
        playClick();
        setPasswordInput('');
        setConfirmPassword('');
        setBootstrapSecret('');
        await loadAll();
      } else {
        setAuthError(res.error || 'Authentication failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOwnerForgotRequestOtp = async () => {
    if (ownerRecoveryMethod === 'backup') return;
    setAuthError(null);
    setSubmitting(true);
    try {
      const res = await callOwnerRecovery({
        action: 'request_reset_otp',
        channel: ownerRecoveryMethod,
        targetProfileId: 'owner',
      });
      if (res.success) {
        setOwnerOtpSent(true);
        setNotice({ text: res.message || 'Recovery OTP sent.', type: 'success' });
      } else {
        setAuthError(res.error || 'Failed to send OTP.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOwnerForgotComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    try {
      const res =
        ownerRecoveryMethod === 'backup'
          ? await callOwnerRecovery({
              action: 'complete_reset_with_backup_code',
              targetProfileId: 'owner',
              backupCode: ownerBackupCode.trim(),
              newPassword: ownerNewPass.trim(),
            })
          : await callOwnerRecovery({
              action: 'complete_reset_with_otp',
              channel: ownerRecoveryMethod,
              targetProfileId: 'owner',
              otp: ownerOtpCode.trim(),
              newPassword: ownerNewPass.trim(),
            });

      if (res.success) {
        playClick();
        setOwnerRecoveryOpen(false);
        setOwnerOtpSent(false);
        setOwnerOtpCode('');
        setOwnerBackupCode('');
        setOwnerNewPass('');
        setNotice({ text: res.message || 'Owner password updated. Sign in with your new password.', type: 'success' });
      } else {
        setAuthError(res.error || 'Owner recovery failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLock = async (id: ProfileId) => {
    if (!locks) return;
    playClick();
    const current = locks[id];
    if (!current.hasPassword && !current.isLocked) {
      setActiveEditingId(id);
      setNotice({
        text: `Set a password for ${viewerProfiles.find((p) => p.id === id)?.name} before locking it.`,
        type: 'error',
      });
      return;
    }

    const res = await mutateOwnerLock({
      action: 'toggle_lock',
      profileId: id,
      isLocked: !current.isLocked,
    });
    if (res.success) {
      await refreshDashboard();
      setNotice({
        text: `${viewerProfiles.find((p) => p.id === id)?.name} is now ${!current.isLocked ? 'LOCKED (existing visitor sessions revoked)' : 'UNLOCKED'}.`,
        type: 'success',
      });
    } else {
      setNotice({ text: res.error || 'Failed to update lock status.', type: 'error' });
    }
  };

  const handleSaveProfilePassword = async (id: ProfileId) => {
    if (newProfilePassword.trim().length < 6) {
      setNotice({ text: 'Profile password must be at least 6 characters.', type: 'error' });
      return;
    }
    const res = await mutateOwnerLock({
      action: 'set_password',
      profileId: id,
      password: newProfilePassword.trim(),
      isLocked: true,
    });
    if (res.success) {
      playClick();
      setNewProfilePassword('');
      setActiveEditingId(null);
      await refreshDashboard();
      setNotice({
        text: `Password saved with bcrypt and lock enabled for ${viewerProfiles.find((p) => p.id === id)?.name}. Previous visitor sessions revoked.`,
        type: 'success',
      });
    } else {
      setNotice({ text: res.error || 'Failed to update password.', type: 'error' });
    }
  };

  const handleRemoveProfilePassword = async (id: ProfileId) => {
    playClick();
    const res = await mutateOwnerLock({
      action: 'remove_password',
      profileId: id,
    });
    if (res.success) {
      setActiveEditingId(null);
      await refreshDashboard();
      setNotice({
        text: `Password removed and ${viewerProfiles.find((p) => p.id === id)?.name} unlocked.`,
        type: 'success',
      });
    } else {
      setNotice({ text: res.error || 'Failed to remove password.', type: 'error' });
    }
  };

  const handleGenerateBackupCodes = async () => {
    playClick();
    const res = await mutateOwnerLock({ action: 'generate_backup_codes' });
    if (res.success && res.backupCodes) {
      setGeneratedBackupCodes(res.backupCodes);
      await refreshDashboard();
      setNotice({ text: res.message || 'Backup recovery codes generated.', type: 'success' });
    } else {
      setNotice({ text: res.error || 'Failed to generate backup codes.', type: 'error' });
    }
  };

  const handleRequestChannelVerify = async (channel: 'email' | 'sms') => {
    setNotice(null);
    const res = await callOwnerRecovery({ action: 'request_channel_verification', channel });
    if (res.success) {
      setVerifyChannel(channel);
      setVerifyOtpInput('');
      setNotice({ text: res.message || 'Verification OTP sent.', type: 'success' });
    } else {
      setNotice({ text: res.error || 'Failed to send verification OTP.', type: 'error' });
    }
  };

  const handleConfirmChannelVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyChannel) return;
    const res = await callOwnerRecovery({
      action: 'confirm_channel_verification',
      channel: verifyChannel,
      otp: verifyOtpInput.trim(),
    });
    if (res.success) {
      playClick();
      setVerifyChannel(null);
      setVerifyOtpInput('');
      await refreshDashboard();
      setNotice({ text: res.message || 'Channel verified.', type: 'success' });
    } else {
      setNotice({ text: res.error || 'Verification failed.', type: 'error' });
    }
  };

  const handleRequestProfileResetOtp = async () => {
    if (resetChannel === 'backup') return;
    setNotice(null);
    const res = await callOwnerRecovery({
      action: 'request_reset_otp',
      channel: resetChannel,
      targetProfileId: resetTarget,
    });
    if (res.success) {
      setResetOtpSent(true);
      setNotice({ text: res.message || 'Reset OTP sent.', type: 'success' });
    } else {
      setNotice({ text: res.error || 'Failed to send reset OTP.', type: 'error' });
    }
  };

  const handleCompleteProfileReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    const res =
      resetChannel === 'backup'
        ? await callOwnerRecovery({
            action: 'complete_reset_with_backup_code',
            targetProfileId: resetTarget,
            backupCode: resetBackupInput.trim(),
            newPassword: resetNewPass.trim(),
          })
        : await callOwnerRecovery({
            action: 'complete_reset_with_otp',
            channel: resetChannel,
            targetProfileId: resetTarget,
            otp: resetOtpCode.trim(),
            newPassword: resetNewPass.trim(),
          });

    if (res.success) {
      playClick();
      setResetOtpSent(false);
      setResetOtpCode('');
      setResetBackupInput('');
      setResetNewPass('');
      await refreshDashboard();
      setNotice({ text: res.message || 'Profile password reset.', type: 'success' });
    } else {
      setNotice({ text: res.error || 'Password reset failed.', type: 'error' });
    }
  };

  const handleLogout = async () => {
    playClick();
    await logoutOwnerOnServer();
    setLocks(null);
    setSecurityStatus(null);
    await loadAll();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25 }}
          className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-[#0C0E14] p-6 sm:p-8 shadow-2xl text-white"
          role="dialog"
          aria-modal="true"
          aria-label="Owner Security Manager"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg">
                🔐
              </span>
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#E50920]">
                  OWNER-ONLY SECURITY
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Profile Security Manager</h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playClick();
                onClose();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
              aria-label="Close Security Manager"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs font-mono text-white/50">
              Checking server security status...
            </div>
          ) : !authState?.backendConfigured ? (
            /* Honest Backend Configuration Checklist when Supabase Env Vars aren't yet provisioned */
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 p-5 text-xs text-amber-100 leading-relaxed">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-2">
                  Server Database Setup Required for Global Lock Sync
                </p>
                <p className="text-white/80">
                  Real cross-device password protection, HTTP-only sessions, and OTP recovery require a persistent database backend. Client-side storage is intentionally disabled so locks cannot be bypassed.
                </p>
                <div className="mt-3 space-y-1 font-mono text-[11px] text-amber-200">
                  <p>1. Run SQL migration: <code>supabase/migrations/20261118_security_system.sql</code></p>
                  <p>
                    2. Add Vercel Env Vars:{' '}
                    <code>{(authState?.missingDatabaseVars || ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']).join(', ')}</code>,{' '}
                    <code>OWNER_BOOTSTRAP_SECRET</code>
                  </p>
                  <p>
                    3. Optional OTP Providers: <code>RESEND_API_KEY</code>, <code>OTP_EMAIL_FROM</code>, <code>OWNER_RECOVERY_EMAIL</code> (Email) and <code>TWILIO_ACCOUNT_SID</code>, <code>TWILIO_AUTH_TOKEN</code>, <code>TWILIO_FROM_NUMBER</code>, <code>OWNER_RECOVERY_PHONE</code> (SMS)
                  </p>
                </div>
              </div>
            </div>
          ) : !authState.authenticated ? (
            /* STEP 1: Owner Authentication / Bootstrap / Owner Recovery */
            <div className="mt-6 max-w-md mx-auto py-2">
              {!ownerRecoveryOpen ? (
                <>
                  <div className="text-center mb-6">
                    <span className="text-3xl block mb-2">🛡️</span>
                    <h3 className="text-lg font-bold">
                      {authState.ownerInitialized ? 'Owner Authentication' : 'Initialize Owner Security'}
                    </h3>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      {authState.ownerInitialized
                        ? 'Sign in with your owner password to manage profile locks, passwords, and OTP recovery.'
                        : 'First-time setup requires your server OWNER_BOOTSTRAP_SECRET and a strong owner password (8+ chars).'}
                    </p>
                  </div>

                  {notice && (
                    <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                      {notice.text}
                    </div>
                  )}

                  <form onSubmit={handleOwnerAuthSubmit} className="space-y-4">
                    {!authState.ownerInitialized && (
                      <div>
                        <label
                          htmlFor="owner-bootstrap-input"
                          className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1"
                        >
                          Server Bootstrap Secret
                        </label>
                        <input
                          id="owner-bootstrap-input"
                          type="password"
                          value={bootstrapSecret}
                          onChange={(e) => setBootstrapSecret(e.target.value)}
                          placeholder="OWNER_BOOTSTRAP_SECRET from Vercel"
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#E50920] focus:outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="owner-passphrase-input"
                        className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1"
                      >
                        Owner Password
                      </label>
                      <input
                        id="owner-passphrase-input"
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Enter owner password"
                        autoFocus
                        className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#E50920] focus:outline-none"
                      />
                    </div>

                    {!authState.ownerInitialized && (
                      <div>
                        <label
                          htmlFor="confirm-passphrase-input"
                          className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1"
                        >
                          Confirm Owner Password
                        </label>
                        <input
                          id="confirm-passphrase-input"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat owner password"
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#E50920] focus:outline-none"
                        />
                      </div>
                    )}

                    {authError && (
                      <p className="text-xs text-[#ff5268] bg-[#E50920]/10 border border-[#E50920]/30 rounded-xl p-2.5">
                        {authError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-xl bg-[#E50920] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#b80718] transition cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {submitting
                        ? 'Verifying...'
                        : authState.ownerInitialized
                        ? 'Sign In to Security Manager →'
                        : 'Initialize Owner Access'}
                    </button>

                    {authState.ownerInitialized && (
                      <button
                        type="button"
                        onClick={() => {
                          setOwnerRecoveryOpen(true);
                          setAuthError(null);
                        }}
                        className="w-full text-center text-xs text-white/50 hover:text-white transition pt-1 cursor-pointer"
                      >
                        Forgot owner password? Use OTP or Backup Code Recovery
                      </button>
                    )}
                  </form>
                </>
              ) : (
                /* Owner Recovery Flow (Email OTP / SMS OTP / Backup Code) */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold">Owner Account Recovery</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setOwnerRecoveryOpen(false);
                        setAuthError(null);
                      }}
                      className="text-xs text-white/50 hover:text-white cursor-pointer"
                    >
                      ← Back to Sign In
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['email', 'sms', 'backup'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setOwnerRecoveryMethod(m);
                          setOwnerOtpSent(false);
                          setAuthError(null);
                        }}
                        className={`rounded-xl py-2 font-semibold border transition cursor-pointer ${
                          ownerRecoveryMethod === m
                            ? 'border-[#E50920] bg-[#E50920]/20 text-white'
                            : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
                        }`}
                      >
                        {m === 'email' ? 'Email OTP' : m === 'sms' ? 'SMS OTP' : 'Backup Code'}
                      </button>
                    ))}
                  </div>

                  {ownerRecoveryMethod !== 'backup' && (
                    <button
                      type="button"
                      onClick={handleOwnerForgotRequestOtp}
                      disabled={submitting}
                      className="w-full rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 py-2 text-xs font-semibold text-white transition cursor-pointer"
                    >
                      Send 6-Digit {ownerRecoveryMethod.toUpperCase()} OTP (5-min expiry)
                    </button>
                  )}

                  {(ownerRecoveryMethod === 'backup' || ownerOtpSent) && (
                    <form onSubmit={handleOwnerForgotComplete} className="space-y-3">
                      {ownerRecoveryMethod === 'backup' ? (
                        <input
                          type="text"
                          value={ownerBackupCode}
                          onChange={(e) => setOwnerBackupCode(e.target.value)}
                          placeholder="Backup code (e.g. A1B2-C3D4)"
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 font-mono"
                        />
                      ) : (
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={ownerOtpCode}
                          onChange={(e) => setOwnerOtpCode(e.target.value)}
                          placeholder="6-digit single-use OTP"
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 font-mono tracking-widest"
                        />
                      )}

                      <input
                        type="password"
                        value={ownerNewPass}
                        onChange={(e) => setOwnerNewPass(e.target.value)}
                        placeholder="New owner password (8+ characters)"
                        className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30"
                      />

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-xl bg-[#E50920] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#b80718] transition cursor-pointer"
                      >
                        Reset Owner Password & Revoke Old Sessions
                      </button>
                    </form>
                  )}

                  {authError && (
                    <p className="text-xs text-[#ff5268] bg-[#E50920]/10 border border-[#E50920]/30 rounded-xl p-2.5">
                      {authError}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* STEP 2: Authenticated Owner Security Manager */
            <div className="mt-5">
              {/* Navigation Tabs + Sign Out */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'locks', label: 'Profile Locks' },
                    { id: 'recovery', label: 'OTP & Recovery' },
                    { id: 'status', label: 'Security Status' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        playClick();
                        setActiveTab(tab.id as ManagerTab);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[11px] font-mono text-white/50 hover:text-white underline cursor-pointer"
                >
                  Sign Out Owner
                </button>
              </div>

              {notice && (
                <div
                  className={`mt-4 rounded-xl p-3 text-xs flex items-center justify-between border ${
                    notice.type === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-[#E50920]/40 bg-[#E50920]/15 text-[#ff5268]'
                  }`}
                >
                  <span>{notice.text}</span>
                  <button type="button" onClick={() => setNotice(null)} className="text-white/60 hover:text-white ml-2">
                    ✕
                  </button>
                </div>
              )}

              {/* TAB 1: INDEPENDENT PROFILE LOCKS */}
              {activeTab === 'locks' && locks && (
                <div className="mt-5 space-y-4">
                  <p className="text-xs text-white/55">
                    Configure independent bcrypt-hashed passwords for each profile. Changes synchronize globally across devices and immediately revoke active sessions for the modified profile. Saved passwords are never displayed.
                  </p>

                  {viewerProfiles.map((p) => {
                    const state = locks[p.id];
                    const isEditing = activeEditingId === p.id;

                    return (
                      <div
                        key={p.id}
                        className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 transition hover:border-white/20"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-white">{p.name}</h4>
                                <span
                                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                    state?.isLocked
                                      ? 'bg-[#E50920]/20 text-[#ff4d64] border border-[#E50920]/30'
                                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  }`}
                                >
                                  {state?.isLocked ? '🔒 LOCKED' : '🔓 PUBLIC'}
                                </span>
                              </div>
                              <p className="text-xs text-white/50 mt-0.5">{p.blurb}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleLock(p.id)}
                              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase transition cursor-pointer border ${
                                state?.isLocked
                                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                                  : 'border-[#E50920]/40 bg-[#E50920]/10 text-[#ff4d64] hover:bg-[#E50920]/20'
                              }`}
                            >
                              {state?.isLocked ? 'Unlock' : 'Lock'}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                playClick();
                                setActiveEditingId(isEditing ? null : p.id);
                                setNewProfilePassword('');
                              }}
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                            >
                              {isEditing ? 'Cancel' : state?.hasPassword ? 'Change Password' : 'Set Password'}
                            </button>

                            {state?.hasPassword && (
                              <button
                                type="button"
                                onClick={() => handleRemoveProfilePassword(p.id)}
                                title="Remove password & unlock"
                                className="rounded-xl border border-white/10 p-1.5 text-xs text-white/40 hover:text-[#ff4d64] hover:border-[#E50920]/30 transition cursor-pointer"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>

                        {isEditing && (
                          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center gap-2.5">
                            <div className="relative flex-1 w-full">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={newProfilePassword}
                                onChange={(e) => setNewProfilePassword(e.target.value)}
                                placeholder={`New password for ${p.name} (6+ chars)`}
                                className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 pr-14 text-xs text-white placeholder-white/30 focus:border-[#E50920] focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/50 hover:text-white"
                              >
                                {showPassword ? 'HIDE' : 'SHOW'}
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleSaveProfilePassword(p.id)}
                              disabled={newProfilePassword.trim().length < 6}
                              className="w-full sm:w-auto rounded-xl bg-[#E50920] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#b80718] transition disabled:opacity-50 cursor-pointer shrink-0"
                            >
                              Save &amp; Lock
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: OTP VERIFICATION, PROFILE PASSWORD RESET & BACKUP CODES */}
              {activeTab === 'recovery' && securityStatus && (
                <div className="mt-5 space-y-5">
                  {/* Ownership Verification for Email & SMS */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D6AD62]">
                      1. Verify Private Recovery Channels
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">Recovery Email</span>
                          <span className={securityStatus.emailVerified ? 'text-emerald-400 font-mono text-[10px]' : 'text-amber-300 font-mono text-[10px]'}>
                            {securityStatus.emailVerified ? 'VERIFIED' : 'UNVERIFIED'}
                          </span>
                        </div>
                        <p className="text-white/50 mt-1 font-mono text-[11px]">
                          {securityStatus.maskedEmail || 'Not configured in env'}
                        </p>
                        {!securityStatus.emailProviderConfigured && (
                          <p className="text-[10px] text-amber-300 mt-1">
                            Missing: {securityStatus.missingEmailVars.join(', ')}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRequestChannelVerify('email')}
                          disabled={!securityStatus.emailProviderConfigured}
                          className="mt-2.5 w-full rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 py-1.5 text-[11px] font-semibold disabled:opacity-40 cursor-pointer"
                        >
                          {securityStatus.emailVerified ? 'Re-verify Email OTP' : 'Verify Email Ownership'}
                        </button>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">Recovery Phone (SMS)</span>
                          <span className={securityStatus.phoneVerified ? 'text-emerald-400 font-mono text-[10px]' : 'text-amber-300 font-mono text-[10px]'}>
                            {securityStatus.phoneVerified ? 'VERIFIED' : 'UNVERIFIED'}
                          </span>
                        </div>
                        <p className="text-white/50 mt-1 font-mono text-[11px]">
                          {securityStatus.maskedPhone || 'Not configured in env'}
                        </p>
                        {!securityStatus.smsProviderConfigured && (
                          <p className="text-[10px] text-amber-300 mt-1">
                            Missing: {securityStatus.missingSmsVars.join(', ')}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRequestChannelVerify('sms')}
                          disabled={!securityStatus.smsProviderConfigured}
                          className="mt-2.5 w-full rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 py-1.5 text-[11px] font-semibold disabled:opacity-40 cursor-pointer"
                        >
                          {securityStatus.phoneVerified ? 'Re-verify SMS OTP' : 'Verify Phone Ownership'}
                        </button>
                      </div>
                    </div>

                    {verifyChannel && (
                      <form onSubmit={handleConfirmChannelVerify} className="pt-2 flex gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={verifyOtpInput}
                          onChange={(e) => setVerifyOtpInput(e.target.value)}
                          placeholder={`Enter 6-digit ${verifyChannel.toUpperCase()} OTP`}
                          className="flex-1 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs text-white font-mono tracking-widest"
                        />
                        <button
                          type="submit"
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white cursor-pointer"
                        >
                          Confirm
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Individual Profile Password Reset via OTP or Backup Code */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38bdf8]">
                      2. Reset Individual Profile Password via OTP / Backup Code
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <select
                        value={resetTarget}
                        onChange={(e) => setResetTarget(e.target.value as ProfileId)}
                        className="rounded-xl border border-white/15 bg-[#12151f] px-3 py-2 text-white"
                      >
                        {viewerProfiles.map((p) => (
                          <option key={p.id} value={p.id}>
                            Target: {p.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={resetChannel}
                        onChange={(e) => {
                          setResetChannel(e.target.value as 'email' | 'sms' | 'backup');
                          setResetOtpSent(false);
                        }}
                        className="rounded-xl border border-white/15 bg-[#12151f] px-3 py-2 text-white"
                      >
                        <option value="email">Via Verified Email OTP</option>
                        <option value="sms">Via Verified SMS OTP</option>
                        <option value="backup">Via Single-Use Backup Code</option>
                      </select>
                    </div>

                    {resetChannel !== 'backup' && (
                      <button
                        type="button"
                        onClick={handleRequestProfileResetOtp}
                        className="w-full rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 py-2 text-xs font-semibold text-white cursor-pointer"
                      >
                        Send 6-Digit Reset OTP via {resetChannel.toUpperCase()}
                      </button>
                    )}

                    {(resetChannel === 'backup' || resetOtpSent) && (
                      <form onSubmit={handleCompleteProfileReset} className="space-y-2.5">
                        {resetChannel === 'backup' ? (
                          <input
                            type="text"
                            value={resetBackupInput}
                            onChange={(e) => setResetBackupInput(e.target.value)}
                            placeholder="Backup recovery code (e.g. A1B2-C3D4)"
                            className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs text-white font-mono"
                          />
                        ) : (
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={resetOtpCode}
                            onChange={(e) => setResetOtpCode(e.target.value)}
                            placeholder="Enter 6-digit single-use OTP"
                            className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs text-white font-mono tracking-widest"
                          />
                        )}

                        <input
                          type="password"
                          value={resetNewPass}
                          onChange={(e) => setResetNewPass(e.target.value)}
                          placeholder="New profile password (6+ characters)"
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs text-white"
                        />

                        <button
                          type="submit"
                          className="w-full rounded-xl bg-[#E50920] hover:bg-[#b80718] py-2 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
                        >
                          Reset Selected Profile Password
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Backup Recovery Codes */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                          3. Single-Use Backup Recovery Codes
                        </h3>
                        <p className="text-[11px] text-white/50 mt-0.5">
                          Remaining codes: <strong className="text-white">{securityStatus.backupCodesRemaining}</strong> (stored as bcrypt hashes)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerateBackupCodes}
                        className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 cursor-pointer"
                      >
                        Generate New Codes
                      </button>
                    </div>

                    {generatedBackupCodes && (
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                        <p className="text-[11px] text-amber-200 mb-2">
                          Copy and store these codes now. They will never be displayed again:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs text-white">
                          {generatedBackupCodes.map((c) => (
                            <span key={c} className="rounded bg-black/40 px-2.5 py-1.5 text-center border border-white/10">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: BASIC SECURITY STATUS & RECENT AUDIT LOG */}
              {activeTab === 'status' && securityStatus && (
                <div className="mt-5 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                      <span className="text-[10px] font-mono uppercase text-white/40">Database Sync</span>
                      <div className="mt-1 font-bold text-emerald-300">Supabase Postgres Connected</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                      <span className="text-[10px] font-mono uppercase text-white/40">Password Hashing</span>
                      <div className="mt-1 font-bold text-white">bcrypt (cost 12) + HTTP-only cookies</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                      <span className="text-[10px] font-mono uppercase text-white/40">Email OTP Provider</span>
                      <div className={`mt-1 font-bold ${securityStatus.emailProviderConfigured ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {securityStatus.emailProviderConfigured ? 'Resend Configured' : 'Needs Env Vars'}
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                      <span className="text-[10px] font-mono uppercase text-white/40">SMS OTP Provider</span>
                      <div className={`mt-1 font-bold ${securityStatus.smsProviderConfigured ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {securityStatus.smsProviderConfigured ? 'Twilio Configured' : 'Needs Env Vars'}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-white/50 mb-2.5">
                      Recent Security Events
                    </h4>
                    {recentAudit.length === 0 ? (
                      <p className="text-white/40">No security events recorded yet.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {recentAudit.map((ev, i) => (
                          <li key={i} className="flex items-center justify-between text-[11px] border-b border-white/5 pb-1.5 last:border-0">
                            <span className="font-mono text-white/80">
                              {ev.event_type} {ev.profile_id ? `(${ev.profile_id})` : ''}
                            </span>
                            <span className={ev.success ? 'text-emerald-400 font-mono' : 'text-[#ff5268] font-mono'}>
                              {ev.success ? 'OK' : 'DENIED'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
