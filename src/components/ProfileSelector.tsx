import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { profile, viewerProfiles, type ProfileId } from '../data/portfolio';
import { playClick } from '../hooks/useSoundFX';
import { EASE } from './fx';

export function ProfileAvatar({ id, size = 'lg' }: { id: ProfileId; size?: 'sm' | 'lg' }) {
  const p = viewerProfiles.find((v) => v.id === id)!;
  const box = size === 'lg' ? 'h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-xl' : 'h-8 w-8 rounded-md';
  if (id === 'giridhar') {
    return (
      <span className={`relative block overflow-hidden ${box} ring-1 ring-white/10`} style={{ background: 'radial-gradient(circle at 50% 30%, #7a0f24, #1a0509)' }}>
        <img src="/assets/portrait-420.webp" alt="Giridhar profile" className="absolute inset-x-0 bottom-0 mx-auto h-[120%] w-auto max-w-none object-cover object-top" />
      </span>
    );
  }
  const glyph = { recruiter: '💼', developer: '</>', creative: '✦' }[id];
  return (
    <span
      className={`relative flex items-center justify-center overflow-hidden font-display text-bone ${box} ring-1 ring-white/10`}
      style={{ background: `linear-gradient(145deg, ${p.color}33, #08090d 120%)`, border: `1px solid ${p.color}44` }}
    >
      <span className={size === 'lg' ? 'text-3xl sm:text-4xl' : 'text-xs'}>{glyph}</span>
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
        Select a viewer profile to customize your experience
      </motion.p>
      <motion.ul
        className="relative grid grid-cols-2 gap-6 sm:flex sm:gap-8"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
      >
        {viewerProfiles.map((p) => (
          <motion.li key={p.id} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}>
            <button type="button" onClick={() => selectProfile(p.id)} data-cursor="play" className="group flex flex-col items-center gap-3 text-center">
              <span className="relative rounded-xl ring-2 ring-transparent transition duration-300 group-hover:scale-105 group-hover:ring-bone group-focus-visible:ring-bone">
                <ProfileAvatar id={p.id} />
                {p.id === 'giridhar' && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-crimson px-2 py-0.5 text-[9px] font-bold tracking-[0.18em] text-white">MAIN</span>
                )}
              </span>
              <span className="font-sans text-sm font-medium text-mist transition group-hover:text-bone sm:text-base">{p.name}</span>
              <span className="max-w-[9rem] text-[11px] leading-snug text-smoke">{p.blurb}</span>
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
