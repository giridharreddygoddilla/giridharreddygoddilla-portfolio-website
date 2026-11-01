import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { profile, viewerProfiles, characterAssets, type ProfileId } from '../data/portfolio';
import { playClick } from '../hooks/useSoundFX';
import { getProfileLockState } from '../services/lockManager';
import { EASE } from './fx';

export function ProfileAvatar({ id, size = 'lg' }: { id: ProfileId; size?: 'sm' | 'lg' }) {
  const p = viewerProfiles.find((v) => v.id === id)!;
  const box = size === 'lg' ? 'h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-2xl' : 'h-8 w-8 rounded-lg';

  // Map each profile to an anime character illustration
  const imageMap: Record<ProfileId, string> = {
    giridhar: characterAssets.hero.src,
    recruiter: characterAssets.confident.src,
    developer: characterAssets.developer.src,
    creative: characterAssets.walking.src,
  };

  const imageSrc = imageMap[id];

  return (
    <span
      className={`relative block overflow-hidden ${box} ring-1 ring-white/15 shadow-2xl`}
      style={{
        background: `linear-gradient(145deg, ${p.color}33, #08090d 120%)`,
        border: `1.5px solid ${p.color}55`,
      }}
    >
      <img
        src={imageSrc}
        alt={`${p.name} profile`}
        className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
    </span>
  );
}

interface ProfileSelectorProps {
  onPick: (id: ProfileId) => void;
  onWatchIntro?: () => void;
  onOpenLockManager?: () => void;
}

export default function ProfileSelector({
  onPick,
  onWatchIntro,
  onOpenLockManager,
}: ProfileSelectorProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') {
        playClick();
        onPick('giridhar');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onPick]);

  const selectProfile = (id: ProfileId) => {
    playClick();
    onPick(id);
  };

  const tags: Record<ProfileId, { text: string; bg: string; color: string }> = {
    giridhar: { text: 'SERIES', bg: 'bg-[#E50920]', color: 'text-white' },
    recruiter: { text: 'DOSSIER', bg: 'bg-[#38bdf8]', color: 'text-[#08090D]' },
    developer: { text: 'CODE & ML', bg: 'bg-[#46e3a8]', color: 'text-[#08090D]' },
    creative: { text: 'STORYTELLING', bg: 'bg-[#ffb547]', color: 'text-[#08090D]' },
  };

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center overflow-y-auto bg-[#08090D] px-4 py-12 sm:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: EASE }}
      role="dialog"
      aria-label="Select an experience to begin"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(75%_50%_at_50%_0%,rgba(229,9,32,0.18),transparent_70%)] pointer-events-none"
      />

      <div className="relative max-w-5xl w-full flex flex-col items-center">
        {/* Cinematic Eyebrow & Title */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#E50920] block mb-2">
            GIRIDHAR REDDY GODDILLA — THE SERIES
          </span>
          <h1 className="font-display text-4xl sm:text-6xl tracking-wide text-white font-normal">
            SELECT YOUR EXPERIENCE
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-white/60 max-w-lg mx-auto leading-relaxed">
            Four tailored perspectives into verified data science engineering, production machine learning, and executive analytics.
          </p>
        </motion.div>

        {/* Four Profiles: Balanced 1-Row Composition on Desktop (md:grid-cols-4), 2-Col on Tablet, 1-Col on Mobile */}
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 w-full"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
          }}
        >
          {viewerProfiles.map((p) => {
            const tag = tags[p.id];
            const lockState = getProfileLockState(p.id);

            return (
              <motion.div
                key={p.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                className="flex"
              >
                <button
                  type="button"
                  onClick={() => selectProfile(p.id)}
                  className="group relative flex flex-col items-center justify-between w-full rounded-2xl border border-white/10 bg-[#11131A]/90 p-5 sm:p-6 text-center transition-all duration-300 hover:border-white/25 hover:bg-[#181B24] hover:shadow-2xl hover:shadow-black/70 cursor-pointer"
                >
                  {/* Top Lock Badge or Tag */}
                  <div className="w-full flex items-center justify-between mb-3 text-[10px] font-mono">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${tag.bg} ${tag.color} shadow-sm`}
                    >
                      {tag.text}
                    </span>
                    {lockState.isLocked && (
                      <span
                        className="flex items-center gap-1 text-[#ff4d64] font-bold bg-[#E50920]/15 px-2 py-0.5 rounded-full border border-[#E50920]/30"
                        title="Protected by password"
                      >
                        <span>🔒</span>
                        <span>LOCKED</span>
                      </span>
                    )}
                  </div>

                  {/* Character Avatar with Glow Ring */}
                  <div className="relative my-2">
                    <span className="relative rounded-2xl ring-2 ring-transparent transition duration-300 group-hover:scale-105 group-hover:ring-white/40 block">
                      <ProfileAvatar id={p.id} size="lg" />
                    </span>
                  </div>

                  {/* Profile Title & Blurb */}
                  <div className="mt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl text-white tracking-wide group-hover:text-[#D6AD62] transition duration-200">
                        {p.name}
                      </h3>
                      <p className="mt-1.5 text-xs text-white/50 leading-snug line-clamp-2">
                        {p.blurb}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-5 w-full pt-3 border-t border-white/5">
                      <span className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-white group-hover:border-[#E50920] group-hover:bg-[#E50920] transition duration-200 shadow-sm">
                        <span>Enter Experience</span>
                        <span className="text-sm">→</span>
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Optional Experiences Footer: Watch Cinematic Intro & Lock Manager */}
        <motion.div
          className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {onWatchIntro && (
            <button
              type="button"
              onClick={() => {
                playClick();
                onWatchIntro();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-xs font-semibold text-white tracking-wider uppercase transition cursor-pointer shadow-md hover:border-white/30"
            >
              <span>🎬</span>
              <span>Watch Cinematic Intro</span>
            </button>
          )}

          {onOpenLockManager && (
            <button
              type="button"
              onClick={() => {
                playClick();
                onOpenLockManager();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition px-3 py-1 cursor-pointer font-mono"
            >
              <span>🔐</span>
              <span>Owner Lock Manager</span>
            </button>
          )}
        </motion.div>

        <p className="mt-8 text-center text-[11px] text-white/30 max-w-sm font-sans">
          Every profile explores the verified career of {profile.displayName} — tailored for recruiters, engineers, and creative directors.
        </p>
      </div>
    </motion.div>
  );
}
