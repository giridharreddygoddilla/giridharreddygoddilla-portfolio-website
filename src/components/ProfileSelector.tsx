import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { profile, viewerProfiles, characterAssets, type ProfileId } from '../data/portfolio';
import { playClick } from '../hooks/useSoundFX';
import { EASE } from './fx';

export function ProfileAvatar({ id, size = 'lg' }: { id: ProfileId; size?: 'sm' | 'lg' }) {
  const p = viewerProfiles.find((v) => v.id === id)!;
  const box = size === 'lg' ? 'h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-xl' : 'h-8 w-8 rounded-md';

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
      className={`relative block overflow-hidden ${box} ring-1 ring-white/10 shadow-lg`}
      style={{
        background: `linear-gradient(145deg, ${p.color}33, #08090d 120%)`,
        border: `1px solid ${p.color}44`,
      }}
    >
      <img
        src={imageSrc}
        alt={`${p.name} profile`}
        className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </span>
  );
}

export default function ProfileSelector({ onPick }: { onPick: (id: ProfileId) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center overflow-y-auto bg-ink px-4 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
      transition={{ duration: 0.7, ease: EASE }}
      role="dialog"
      aria-label="Who's watching?"
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(229,9,32,0.18),transparent_70%)]" />

      <motion.h2
        className="relative mb-3 text-center font-sans text-3xl font-medium tracking-tight text-bone sm:text-5xl"
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        Who&apos;s watching?
      </motion.h2>

      <motion.p
        className="relative mb-10 text-center font-sans text-xs tracking-widest text-mist uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        Select a profile to customize your viewing experience
      </motion.p>

      <motion.ul
        className="relative grid grid-cols-2 gap-6 sm:flex sm:gap-8"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
      >
        {viewerProfiles.map((p) => (
          <motion.li
            key={p.id}
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
          >
            <button
              type="button"
              onClick={() => selectProfile(p.id)}
              className="group flex flex-col items-center gap-3 text-center cursor-pointer"
            >
              <span className="relative rounded-xl ring-2 ring-transparent transition duration-300 group-hover:scale-105 group-hover:ring-bone group-focus-visible:ring-bone">
                <ProfileAvatar id={p.id} />
                {p.id === 'recruiter' && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-[#38bdf8] px-2 py-0.5 text-[9px] font-bold tracking-[0.16em] text-[#08090D] shadow">
                    DOSSIER
                  </span>
                )}
                {p.id === 'giridhar' && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-crimson px-2 py-0.5 text-[9px] font-bold tracking-[0.18em] text-white shadow">
                    SERIES
                  </span>
                )}
              </span>
              <span className="font-sans text-sm font-medium text-mist transition group-hover:text-bone sm:text-base">
                {p.name}
              </span>
              <span className="max-w-[9.5rem] text-[11px] leading-snug text-smoke">{p.blurb}</span>
            </button>
          </motion.li>
        ))}
      </motion.ul>

      <p className="relative mt-12 max-w-md text-center text-xs leading-relaxed text-smoke">
        Every profile explores the verified journey of {profile.displayName} — tailored for your focus.
      </p>
    </motion.div>
  );
}
