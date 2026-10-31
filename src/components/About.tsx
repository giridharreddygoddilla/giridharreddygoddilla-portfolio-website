import { useState } from 'react';
import { motion } from 'framer-motion';
import { education, experience, profile, characterAssets } from '../data/portfolio';
import { EASE, SectionHeading, Tilt } from './fx';
import { playClick } from '../hooks/useSoundFX';

export default function About() {
  const [useArt, setUseArt] = useState(true);

  const facts = [
    { k: 'Postgraduate', v: 'MSc Data Science', s: `${education[0].school} (UK)` },
    { k: 'Industry Track', v: `${experience[0].role}, ${experience[0].company}`, s: `${experience[0].place} · Oct–Nov 2025` },
    { k: 'Daily Stack', v: 'Python & SQL', s: 'Power BI, Tableau, PySpark, Scikit-learn' },
    { k: 'Location', v: profile.location, s: 'Eligible to work in UK • Actively Interviewing' },
  ];

  return (
    <>
      <SectionHeading kicker="The Screenplay" title="The Full Story" />
      <div className="gutter grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        {/* Left Column: Visual Portrait */}
        <motion.div
          className="mx-auto w-full max-w-md lg:max-w-none"
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <Tilt max={5} className="rounded-2xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
              {useArt ? (
                /* Seated Executive Portrait (Anime illustration) */
                <motion.img
                  src={characterAssets.seated.src}
                  alt={characterAssets.seated.alt}
                  className="w-full h-full object-cover object-center"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                />
              ) : (
                /* Authentic Real Photo */
                <img
                  src="/assets/profile-real-clean.webp"
                  alt={profile.fullName}
                  className="w-full h-full object-cover object-top"
                />
              )}

              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

              {/* Bottom Card Label */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between z-10">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.28em] text-[#ff3d5a] uppercase">THE PILOT EPISODE</p>
                  <p className="font-display text-3xl leading-none text-bone">{profile.displayName}</p>
                </div>
                <button
                  onClick={() => {
                    playClick();
                    setUseArt((v) => !v);
                  }}
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white/90 border border-white/15 transition cursor-pointer"
                >
                  {useArt ? '📸 View Real' : '🎨 View Art'}
                </button>
              </div>
            </div>
          </Tilt>
        </motion.div>

        {/* Right Column: Editorial Bio */}
        <div>
          <motion.p
            className="font-serif text-[clamp(1.4rem,2.6vw,2.1rem)] italic leading-[1.3] text-bone"
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            &ldquo;Data is not just numbers on a spreadsheet — it is the digital exhaust of human behavior, operations, and commerce. My mission is to translate raw data into clear, actionable business strategies.&rdquo;
          </motion.p>
          <p className="mt-4 text-sm font-semibold text-gold">— {profile.fullName}</p>

          <motion.dl
            className="mt-8 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.08 }}
          >
            {facts.map((f) => (
              <motion.div
                key={f.k}
                className="bg-ink-2 p-5"
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              >
                <dt className="text-[10px] font-bold uppercase tracking-[0.28em] text-smoke">{f.k}</dt>
                <dd className="mt-2 text-base font-semibold text-bone">{f.v}</dd>
                <dd className="mt-0.5 text-xs text-mist">{f.s}</dd>
              </motion.div>
            ))}
          </motion.dl>

          <div className="mt-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-smoke">Core Strategic Pillars</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <span key={i} className="glass rounded-full px-3.5 py-1.5 text-xs font-medium text-bone border border-white/10">
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
