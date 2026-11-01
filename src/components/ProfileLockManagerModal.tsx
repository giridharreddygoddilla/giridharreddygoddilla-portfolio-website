import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { viewerProfiles, type ProfileId } from '../data/portfolio';
import {
  getAllLockStates,
  setProfileLock,
  removeProfilePassword,
  isOwnerAuthenticated,
  isOwnerPassphraseInitialized,
  initializeOwnerPassphrase,
  authenticateOwner,
  logoutOwner,
  type ProfileLockState,
} from '../services/lockManager';
import { playClick } from '../hooks/useSoundFX';

interface ProfileLockManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLockStateChange?: () => void;
}

export default function ProfileLockManagerModal({
  isOpen,
  onClose,
  onLockStateChange,
}: ProfileLockManagerModalProps) {
  const [isAuth, setIsAuth] = useState(isOwnerAuthenticated());
  const [hasPassphrase, setHasPassphrase] = useState(isOwnerPassphraseInitialized());
  const [passphraseInput, setPassphraseInput] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Profile management state
  const [locks, setLocks] = useState<Record<ProfileId, ProfileLockState>>(getAllLockStates());
  const [activeEditingId, setActiveEditingId] = useState<ProfileId | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const refreshLocks = () => {
    setLocks(getAllLockStates());
    onLockStateChange?.();
  };

  const handleOwnerAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!hasPassphrase) {
      if (passphraseInput.length < 6) {
        setAuthError('Passphrase must be at least 6 characters.');
        return;
      }
      if (passphraseInput !== confirmPassphrase) {
        setAuthError('Passphrases do not match.');
        return;
      }
      const res = await initializeOwnerPassphrase(passphraseInput);
      if (res.success) {
        setIsAuth(true);
        setHasPassphrase(true);
        setPassphraseInput('');
        setConfirmPassphrase('');
        playClick();
      } else {
        setAuthError(res.error || 'Failed to initialize passphrase.');
      }
    } else {
      const res = await authenticateOwner(passphraseInput);
      if (res.success) {
        setIsAuth(true);
        setPassphraseInput('');
        playClick();
      } else {
        setAuthError(res.error || 'Invalid passphrase.');
      }
    }
  };

  const handleToggleLock = async (id: ProfileId) => {
    playClick();
    const current = locks[id];

    if (!current.hasPassword && !current.isLocked) {
      // Must set a password first
      setActiveEditingId(id);
      setActionMessage({
        text: `Please set a password before locking ${viewerProfiles.find((p) => p.id === id)?.name}.`,
        type: 'error',
      });
      return;
    }

    const res = await setProfileLock(id, !current.isLocked);
    if (res.success) {
      refreshLocks();
      setActionMessage({
        text: `${viewerProfiles.find((p) => p.id === id)?.name} is now ${!current.isLocked ? 'LOCKED' : 'UNLOCKED'}.`,
        type: 'success',
      });
    } else {
      setActionMessage({ text: res.error || 'Operation failed.', type: 'error' });
    }
  };

  const handleSavePassword = async (id: ProfileId) => {
    if (!newPassword.trim()) return;
    const res = await setProfileLock(id, true, newPassword.trim());
    if (res.success) {
      playClick();
      refreshLocks();
      setNewPassword('');
      setActiveEditingId(null);
      setActionMessage({
        text: `Password successfully updated and lock activated for ${viewerProfiles.find((p) => p.id === id)?.name}.`,
        type: 'success',
      });
    } else {
      setActionMessage({ text: res.error || 'Failed to set password.', type: 'error' });
    }
  };

  const handleRemovePassword = (id: ProfileId) => {
    playClick();
    removeProfilePassword(id);
    refreshLocks();
    setActiveEditingId(null);
    setActionMessage({
      text: `Password removed and lock deactivated for ${viewerProfiles.find((p) => p.id === id)?.name}.`,
      type: 'success',
    });
  };

  const handleLogout = () => {
    playClick();
    logoutOwner();
    setIsAuth(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        {/* Backdrop */}
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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25 }}
          className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-[#0C0E14] p-6 sm:p-8 shadow-2xl text-white"
          role="dialog"
          aria-modal="true"
          aria-label="Profile Lock Manager"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg">
                🔐
              </span>
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#E50920]">
                  OWNER CONTROLS
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Profile Lock Manager</h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playClick();
                onClose();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
              aria-label="Close Profile Lock Manager"
            >
              ✕
            </button>
          </div>

          {/* STEP 1: Owner Authentication Screen */}
          {!isAuth ? (
            <div className="mt-6 max-w-md mx-auto py-4">
              <div className="text-center mb-6">
                <span className="text-3xl block mb-2">🛡️</span>
                <h3 className="text-lg font-bold">
                  {hasPassphrase ? 'Owner Authentication' : 'Initialize Owner Security'}
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  {hasPassphrase
                    ? 'Enter your Owner Passphrase to access the profile lock controls.'
                    : 'Create a master Owner Passphrase to protect your lock management controls.'}
                </p>
              </div>

              <form onSubmit={handleOwnerAuth} className="space-y-4">
                <div>
                  <label
                    htmlFor="owner-passphrase-input"
                    className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1"
                  >
                    Owner Passphrase
                  </label>
                  <input
                    id="owner-passphrase-input"
                    type="password"
                    value={passphraseInput}
                    onChange={(e) => setPassphraseInput(e.target.value)}
                    placeholder="Enter owner passphrase"
                    autoFocus
                    className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#E50920] focus:outline-none focus:ring-1 focus:ring-[#E50920]"
                  />
                </div>

                {!hasPassphrase && (
                  <div>
                    <label
                      htmlFor="confirm-passphrase-input"
                      className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1"
                    >
                      Confirm Passphrase
                    </label>
                    <input
                      id="confirm-passphrase-input"
                      type="password"
                      value={confirmPassphrase}
                      onChange={(e) => setConfirmPassphrase(e.target.value)}
                      placeholder="Repeat passphrase"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#E50920] focus:outline-none focus:ring-1 focus:ring-[#E50920]"
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
                  className="w-full rounded-xl bg-[#E50920] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#b80718] transition cursor-pointer shadow-md"
                >
                  {hasPassphrase ? 'Unlock Manager →' : 'Initialize & Save Passphrase'}
                </button>
              </form>
            </div>
          ) : (
            /* STEP 2: Authenticated Lock Management Dashboard */
            <div className="mt-6">
              {/* Top Banner & Status Message */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs text-white/60">
                <span>Manage independent cryptographic access locks for each profile experience.</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[11px] font-mono text-white/50 hover:text-white transition underline"
                >
                  Log out Owner
                </button>
              </div>

              {actionMessage && (
                <div
                  className={`mt-4 rounded-xl p-3 text-xs flex items-center justify-between border ${
                    actionMessage.type === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-[#E50920]/40 bg-[#E50920]/15 text-[#ff5268]'
                  }`}
                >
                  <span>{actionMessage.text}</span>
                  <button
                    type="button"
                    onClick={() => setActionMessage(null)}
                    className="text-white/60 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Four Profiles Grid */}
              <div className="mt-6 space-y-4">
                {viewerProfiles.map((p) => {
                  const state = locks[p.id];
                  const isEditing = activeEditingId === p.id;

                  return (
                    <div
                      key={p.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 transition hover:border-white/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Profile Info */}
                        <div className="flex items-center gap-3.5">
                          <span
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: p.color }}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white">{p.name}</h4>
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                  state.isLocked
                                    ? 'bg-[#E50920]/20 text-[#ff4d64] border border-[#E50920]/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {state.isLocked ? '🔒 LOCKED' : '🔓 PUBLIC'}
                              </span>
                            </div>
                            <p className="text-xs text-white/50 mt-0.5">{p.blurb}</p>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Toggle Lock Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleLock(p.id)}
                            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase transition cursor-pointer border ${
                              state.isLocked
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                                : 'border-[#E50920]/40 bg-[#E50920]/10 text-[#ff4d64] hover:bg-[#E50920]/20'
                            }`}
                          >
                            {state.isLocked ? 'Unlock Profile' : 'Lock Profile'}
                          </button>

                          {/* Edit / Change Password */}
                          <button
                            type="button"
                            onClick={() => {
                              playClick();
                              setActiveEditingId(isEditing ? null : p.id);
                              setNewPassword('');
                            }}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                          >
                            {isEditing ? 'Cancel' : state.hasPassword ? 'Change Password' : 'Set Password'}
                          </button>

                          {/* Remove Password */}
                          {state.hasPassword && (
                            <button
                              type="button"
                              onClick={() => handleRemovePassword(p.id)}
                              title="Remove password and unlock"
                              className="rounded-xl border border-white/10 p-1.5 text-xs text-white/40 hover:text-[#ff4d64] hover:border-[#E50920]/30 transition cursor-pointer"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Password Creation / Change Form */}
                      {isEditing && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center gap-2.5">
                          <div className="relative flex-1 w-full">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder={`Enter new password for ${p.name}`}
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
                            onClick={() => handleSavePassword(p.id)}
                            disabled={!newPassword.trim()}
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

              {/* Security & Deployment Notice */}
              <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-[11px] text-white/50 leading-relaxed space-y-1">
                <span className="font-mono uppercase font-bold text-white/70 block mb-1">
                  Security Architecture &amp; Backend Integration
                </span>
                <p>
                  Passwords are encrypted client-side using PBKDF2 with SHA-256 (100,000 iterations + random salt per profile). Rate limiting enforces a 30-second lockout after 5 consecutive failed attempts.
                </p>
                <p>
                  For full server-side Row Level Security (RLS) preventing asset inspection prior to authorization, connect Supabase using the supplied SQL migration: <code className="text-[#D6AD62]">supabase/migrations/20261101_profile_locks.sql</code>.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
