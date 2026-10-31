import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { seasons, characterAssets } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';
import EpisodeCard from './EpisodeCard';
import { RailButtons } from './Rail';

export default function Seasons() {
  const [active, setActive] = useState(seasons.length - 2);
  const season = seasons[active];
  const rail = useRef<HTMLDivElement>(null);

  return (
    <>
      <SectionHeading
        kicker={`${seasons.length} Seasons`}
        title="My Journey"
        aside={<p className="max-w-xs text-sm text-mist">Every stage of the career roadmap, framed as a season — select one to inspect its episodes.</p>}
      />

      {/* Season Journey Banner with Walking Illustration */}
      <div className="gutter mb-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#181B24] via-[#11131A] to-[#181B24] p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#D6AD62] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#D6AD62] font-bold">
                Career Trajectory • 2019 – Present
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              From Computer Science Foundations to UK Data Science & Industry
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#A3A6B0] leading-relaxed">
              Tracking the evolution across Lovely Professional University (Punjab), FOURP Technology (Chennai), E-Box (Bengaluru), Victoria Solutions (London), and MSc Data Science at the University of Hertfordshire.
            </p>
          </div>

          <div className="shrink-0 w-32 sm:w-40 aspect-square rounded-xl overflow-hidden border border-white/15 bg-[#08090D] shadow-lg">
            <motion.img
              src={characterAssets.walking.src}
              alt={characterAssets.walking.alt}
              className="w-full h-full object-cover object-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>

      {/* Season Selector Pills */}
      <div className="rail gutter mb-8 flex gap-2 overflow-x-auto" role="tablist" aria-label="Seasons">
        {seasons.map((s, i) => (
          <button
            key={s.number}
            role="tab"
            aria-selected={i === active}
            type="button"
            onClick={() => {
              setActive(i);
              rail.current?.scrollTo({ left: 0, behavior: 'smooth' });
            }}
            className={`relative shrink-0 rounded-full px-4 py-2.5 text-left transition cursor-pointer ${
              i === active ? 'text-ink' : 'text-mist hover:text-bone'
            }`}
          >
            {i === active && (
              <motion.span
                layoutId="season-pill"
                className="absolute inset-0 rounded-full bg-bone"
                transition={{ duration: 0.45, ease: EASE }}
              />
            )}
            <span className="relative block text-[10px] font-bold tracking-[0.24em]">
              SEASON {String(s.number).padStart(2, '0')}
            </span>
            <span className="relative block whitespace-nowrap text-sm font-semibold">{s.title}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={season.number}
          initial={{ opacity: 0, x: 30, filter: 'blur(6px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -30, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div className="gutter mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="font-display text-4xl tracking-wide text-bone sm:text-5xl">
              <span className="text-outline mr-3">S{String(season.number).padStart(2, '0')}</span>
              {season.title}
            </h3>
            <span className="text-sm text-mist">
              {season.period} · {season.episodes.length} {season.episodes.length === 1 ? 'Episode' : 'Episodes'}
            </span>
          </div>
          <p className="gutter max-w-3xl text-[15px] leading-relaxed text-bone/75">{season.synopsis}</p>

          <div className="group/rail relative">
            <div ref={rail} className="rail gutter flex snap-x snap-mandatory gap-4 overflow-x-auto py-8 [perspective:1200px]">
              {season.episodes.map((e, i) => (
                <EpisodeCard key={e.code} episode={e} index={i} />
              ))}
            </div>
            <RailButtons rail={rail} />
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
