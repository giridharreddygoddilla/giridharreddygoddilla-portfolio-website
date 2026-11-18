import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { profile, viewerProfiles, characterAssets, type ProfileId } from '../data/portfolio';
import { playClick } from '../hooks/useSoundFX';
import { getAllLockStates, subscribeLockStates } from '../services/lockManager';
import { EASE } from './fx';

export function ProfileAvatar({ id, size = 'lg' }: { id: ProfileId; size?: 'sm' | 'lg' }) {
  const p = viewerProfiles.find((v) => v.id === id) ?? viewerProfiles[0];
  const box =
    size === 'lg'
      ? 'h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36 rounded-2xl'
      : 'h-8 w-8 rounded-lg';

  // Exact image mapping:
  // PERSONAL -> existing hero image
  // PROFESSIONAL -> original real photograph (matching the Professional profile)
  // CREATIVE -> existing walking image
  const imageMap: Record<ProfileId, string> = {
    giridhar: characterAssets.hero.src,
    recruiter: profile.recruiterPhoto.src,
    creative: characterAssets.walking.src,
  };

  const imageSrc = imageMap[id];
  const isOriginalPhoto = id === 'recruiter';

  return (
    <span
      className={`relative block overflow-hidden ${box} ring-1 ring-white/15 shadow-2xl bg-[#11131A]`}
      style={{
        background: isOriginalPhoto ? '#11131A' : `linear-gradient(145deg, ${p.color}33, #08090d 120%)`,
        border: `1.5px solid ${p.color}55`,
      }}
    >
      <img
        src={imageSrc}
        alt={`${p.name} profile`}
        className={`w-full h-full transition duration-500 group-hover:scale-105 ${
          isOriginalPhoto ? 'object-contain' : 'object-cover object-top'
        }`}
      />
      {!isOriginalPhoto && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
      )}
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
  const [lockStates, setLockStates] = useState(getAllLockStates);

  useEffect(() => {
    return subscribeLockStates(() => setLockStates(getAllLockStates()));
  }, []);

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
    giridhar: { text: 'PERSONAL', bg: 'bg-[#E50920]', color: 'text-white' },
    recruiter: { text: 'PROFESSIONAL', bg: 'bg-[#38bdf8]', color: 'text-[#08090D]' },
    creative: { text: 'CREATIVE', bg: 'bg-[#ffb547]', color: 'text-[#08090D]' },
  };

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden bg-[#08090D] px-3 sm:px-6 py-4 sm:py-10 md:py-14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: EASE }}
      role="dialog"
      aria-label="Three Sides. One Story. Select a profile"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(75%_50%_at_50%_0%,rgba(229,9,32,0.18),transparent_70%)] pointer-events-none"
      />

      <div className="relative max-w-4xl w-full flex flex-col items-center my-auto">
        {/* Main Landing Page Heading */}
        <motion.div
          className="text-center mb-4 sm:mb-8 md:mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#E50920] block mb-1 sm:mb-2">
            GIRIDHAR REDDY GODDILLA — THE JOURNEY
          </span>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl tracking-wide text-white font-normal leading-tight">
            THREE SIDES. ONE STORY.
          </h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/65 max-w-lg mx-auto leading-snug sm:leading-relaxed">
            One identity. Three dimensions. Countless ways to discover.
          </p>
        </motion.div>

        {/* Three Profiles: Compact 2-Col Grid on Mobile (Row 1: PERSONAL + PROFESSIONAL, Row 2: CREATIVE), 1 Horizontal 3-Col Row on Desktop */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 md:gap-6 w-full"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
          }}
        >
          {viewerProfiles.map((p, index) => {
            const tag = tags[p.id];
            const lockState = lockStates[p.id];
            const isThirdCard = index === 2;

            return (
              <motion.div
                key={p.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                className={`flex ${
                  isThirdCard
                    ? 'col-span-2 w-[calc(50%-6px)] sm:w-[calc(50%-10px)] mx-auto md:col-span-1 md:w-full md:mx-0'
                    : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectProfile(p.id)}
                  className="group relative flex flex-col items-center justify-between w-full rounded-2xl border border-white/10 bg-[#11131A]/90 p-3 sm:p-5 md:p-6 text-center transition-all duration-300 hover:border-white/25 hover:bg-[#181B24] hover:shadow-2xl hover:shadow-black/70 cursor-pointer"
                >
                  {/* Top Tag & Lock Badge */}
                  <div className="w-full flex items-center justify-between gap-1 mb-2 sm:mb-3 text-[9px] sm:text-[10px] font-mono">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${tag.bg} ${tag.color} shadow-sm truncate`}
                    >
                      {tag.text}
                    </span>
                    {lockState.isLocked && (
                      <span
                        className="flex items-center gap-0.5 text-[#ff4d64] font-bold bg-[#E50920]/15 px-1.5 py-0.5 rounded-full border border-[#E50920]/30 shrink-0"
                        title="Protected by password"
                      >
                        <span>🔒</span>
                        <span className="hidden sm:inline">LOCKED</span>
                      </span>
                    )}
                  </div>

                  {/* Profile Image with Hover Ring */}
                  <div className="relative my-1 sm:my-2">
                    <span className="relative rounded-2xl ring-2 ring-transparent transition duration-300 group-hover:scale-105 group-hover:ring-white/40 block">
                      <ProfileAvatar id={p.id} size="lg" />
                    </span>
                  </div>

                  {/* Profile Title & Description */}
                  <div className="mt-2.5 sm:mt-4 w-full flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-display text-lg sm:text-2xl text-white tracking-wide group-hover:text-[#D6AD62] transition duration-200 leading-none">
                        {p.name}
                      </h2>
                      <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-white/60 leading-snug">
                        {p.blurb}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-3 sm:mt-5 w-full pt-2 sm:pt-3 border-t border-white/5">
                      <span className="inline-flex items-center justify-center gap-1 w-full rounded-xl border border-white/15 bg-white/5 px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white group-hover:border-[#E50920] group-hover:bg-[#E50920] transition duration-200 shadow-sm whitespace-nowrap">
                        <span>Enter Experience</span>
                        <span className="text-xs sm:text-sm">→</span>
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
          className="mt-4 sm:mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs"
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
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-white tracking-wider uppercase transition cursor-pointer shadow-md hover:border-white/30"
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
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-white/40 hover:text-white transition px-2.5 py-1 cursor-pointer font-mono"
            >
              <span>🔐</span>
              <span>Owner Lock Manager</span>
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
