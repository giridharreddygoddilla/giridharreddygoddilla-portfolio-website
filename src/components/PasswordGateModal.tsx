import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileAvatar } from './ProfileSelector';
import { viewerProfiles, type ProfileId } from '../data/portfolio';
import { unlockProfileWithPassword } from '../services/lockManager';
import { playClick } from '../hooks/useSoundFX';

interface PasswordGateModalProps {
  profileId: ProfileId | null;
  onSuccess: (id: ProfileId) => void;
  onCancel: () => void;
}

export default function PasswordGateModal({
  profileId,
  onSuccess,
  onCancel,
}: PasswordGateModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lockoutSec, setLockoutSec] = useState<number>(0);

  const profile = viewerProfiles.find((p) => p.id === profileId);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSec <= 0) return;
    const interval = setInterval(() => {
      setLockoutSec((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSec]);

  // Handle Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playClick();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  if (!profileId || !profile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || lockoutSec > 0 || isVerifying) return;

    setIsVerifying(true);
    setError(null);

    try {
      const res = await unlockProfileWithPassword(profileId, password.trim());
      if (res.success) {
        playClick();
        onSuccess(profileId);
      } else {
        setError(res.error || 'Incorrect password.');
        if (res.lockoutSeconds) {
          setLockoutSec(res.lockoutSeconds);
        }
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playClick();
            onCancel();
          }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#0C0E14] p-6 sm:p-8 shadow-2xl text-white"
          role="dialog"
          aria-modal="true"
          aria-label={`Enter password to access ${profile.name}`}
        >
          {/* Top subtle glow */}
          <div
            className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: profile.color }}
          />

          {/* Profile Identity Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <ProfileAvatar id={profileId} size="lg" />
              <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#E50920] text-xs shadow-lg border border-white/20">
                🔒
              </span>
            </div>

            <span
              className="font-mono text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1"
              style={{
                color: profile.color,
                backgroundColor: `${profile.color}15`,
                border: `1px solid ${profile.color}30`,
              }}
            >
              LOCKED EXPERIENCE
            </span>

            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              Unlock {profile.name}
            </h2>
            <p className="text-xs text-white/60 mt-1 max-w-xs">{profile.blurb}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="profile-password-input"
                className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1.5"
              >
                Access Password
              </label>

              <div className="relative">
                <input
                  id="profile-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={lockoutSec > 0 || isVerifying}
                  placeholder="Enter profile password"
                  autoFocus
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 pr-12 text-sm text-white placeholder-white/30 focus:border-[#E50920] focus:outline-none focus:ring-1 focus:ring-[#E50920] transition disabled:opacity-50 font-sans"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-white/50 hover:text-white transition px-1 py-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-[#E50920]/40 bg-[#E50920]/15 p-3 text-xs text-[#ff5268] flex items-start gap-2"
              >
                <span className="text-sm">⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Lockout Notification */}
            {lockoutSec > 0 && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-center justify-between">
                <span>Rate limit lockout active</span>
                <span className="font-mono font-bold">{lockoutSec}s</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={!password.trim() || lockoutSec > 0 || isVerifying}
                className="w-full rounded-xl bg-[#E50920] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#b80718] transition cursor-pointer shadow-lg shadow-[#E50920]/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verifying...' : 'Unlock & Continue →'}
              </button>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  onCancel();
                }}
                className="w-full rounded-xl border border-white/10 bg-transparent py-2.5 text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition cursor-pointer"
              >
                ← Return to Profile Chooser
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
