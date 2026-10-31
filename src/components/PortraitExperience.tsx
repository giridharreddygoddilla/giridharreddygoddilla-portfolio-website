import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { profile, characterAssets } from '../data/portfolio';
import { useFinePointer } from '../hooks/useMedia';
import { EASE, SectionHeading } from './fx';
import { playClick } from '../hooks/useSoundFX';

export default function PortraitExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const [artMode, setArtMode] = useState<'anime' | 'photo'>('anime');

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 70, damping: 20 });
  const py = useSpring(my, { stiffness: 70, damping: 20 });

  const rotY = useTransform(px, [-1, 1], [-6, 6]);
  const rotX = useTransform(py, [-1, 1], [5, -5]);
  const glowX = useTransform(px, [-1, 1], ['-12%', '12%']);
  const glowY = useTransform(py, [-1, 1], ['-12%', '12%']);

  return (
    <div className="relative overflow-hidden py-12 md:py-20" ref={ref}>
      <SectionHeading kicker="Cinematic Spotlight" title="The Identity" />

      <div className="gutter grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Editorial Storytelling */}
        <div className="order-2 lg:order-1 lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <p className="font-sans text-xs font-bold tracking-[0.34em] text-crimson-2 uppercase">
              Profile Spotlight • Season 2026
            </p>
            <h3 className="mt-2 font-display text-4xl tracking-wide text-bone sm:text-6xl">
              {profile.fullName}
            </h3>
            <p className="mt-1 font-serif text-xl italic text-gold sm:text-2xl">
              Data Analyst & MSc Data Science Scholar
            </p>

            <blockquote className="mt-6 border-l-2 border-crimson pl-4 font-serif text-lg italic leading-relaxed text-bone/90 sm:text-xl">
              &ldquo;You can force data to confess anything… but real analysts don&rsquo;t torture data — they understand it, respect it, and reveal the truth within.&rdquo;
            </blockquote>

            <p className="mt-6 text-sm leading-relaxed text-mist sm:text-base">
              Operating at the intersection of business acumen and statistical rigor. From building high-accuracy machine learning classifiers to orchestrating distributed PySpark pipelines and designing executive Power BI dashboards, every analysis is grounded in actionable commercial clarity.
            </p>

            {/* Quick stats pills */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-ink-2/80 p-4 backdrop-blur">
                <span className="font-display text-3xl text-bone">UK</span>
                <p className="mt-1 text-[11px] font-bold tracking-wider text-mist uppercase">Location</p>
                <p className="text-xs text-smoke">Luton &amp; London</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-ink-2/80 p-4 backdrop-blur">
                <span className="font-display text-3xl text-crimson-2">MSc</span>
                <p className="mt-1 text-[11px] font-bold tracking-wider text-mist uppercase">Data Science</p>
                <p className="text-xs text-smoke">Univ of Hertfordshire</p>
              </div>
              <div className="col-span-2 rounded-xl border border-white/10 bg-ink-2/80 p-4 backdrop-blur sm:col-span-1">
                <span className="font-display text-3xl text-gold">97.3%</span>
                <p className="mt-1 text-[11px] font-bold tracking-wider text-mist uppercase">Precision Benchmark</p>
                <p className="text-xs text-smoke">ML &amp; NLP Pipeline</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="glass inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-bone hover:bg-white/15 cursor-pointer"
              >
                <span>Connect on LinkedIn</span> ↗
              </a>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="glass inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-mist hover:text-bone hover:bg-white/15 cursor-pointer"
              >
                <span>Explore GitHub</span> ↗
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Column: 3D Cinematic Portrait Experience with Art/Photo Switcher */}
        <div
          className="order-1 flex justify-center lg:order-2 lg:col-span-6"
          onPointerMove={(e) => {
            if (!fine || !ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
            my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
          }}
        >
          <motion.div
            className="relative flex h-[480px] w-full max-w-[420px] items-center justify-center sm:h-[580px] lg:h-[620px]"
            style={{ rotateY: rotY, rotateX: rotX, transformPerspective: 1200 }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            {/* Atmospheric Background Glow */}
            <motion.div
              aria-hidden
              className="absolute -inset-4 rounded-3xl opacity-70 blur-3xl pointer-events-none"
              style={{
                x: glowX,
                y: glowY,
                background: 'radial-gradient(circle at 50% 40%, rgba(229,9,32,0.35), rgba(214,173,98,0.18) 50%, transparent 75%)',
              }}
            />

            {/* Cinematic Frame */}
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-ink-3 via-ink-2 to-ink shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
              {/* Top controls: metadata badge and switcher */}
              <div className="absolute left-4 top-4 right-4 z-30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-ink/80 px-3 py-1 backdrop-blur-md">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-crimson" />
                  <span className="font-sans text-[10px] font-bold tracking-widest text-bone uppercase">
                    MASTER RECORD
                  </span>
                </div>

                <div className="flex items-center gap-1 p-0.5 rounded-full bg-ink/85 backdrop-blur-md border border-white/15">
                  <button
                    onClick={() => {
                      playClick();
                      setArtMode('anime');
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition cursor-pointer ${
                      artMode === 'anime' ? 'bg-[#E50920] text-white shadow' : 'text-mist hover:text-white'
                    }`}
                  >
                    🎨 Anime
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      setArtMode('photo');
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition cursor-pointer ${
                      artMode === 'photo' ? 'bg-[#38bdf8] text-[#08090D] font-bold shadow' : 'text-mist hover:text-white'
                    }`}
                  >
                    📸 Real
                  </button>
                </div>
              </div>

              {/* The Image Display */}
              {artMode === 'anime' ? (
                /* Confident Arms-Crossed Anime Portrait */
                <motion.img
                  key="anime-portrait"
                  src={characterAssets.confident.src}
                  alt={characterAssets.confident.alt}
                  className="w-full h-full object-cover object-top"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                />
              ) : (
                /* Authentic Real Photo Cutout */
                <motion.img
                  key="real-portrait"
                  src="/assets/portrait-720.webp"
                  srcSet="/assets/portrait-420.webp 420w, /assets/portrait-720.webp 720w, /assets/portrait-1100.webp 1100w"
                  sizes="(max-width: 640px) 380px, 480px"
                  alt="Giridhar Reddy Goddilla"
                  className="absolute inset-x-0 bottom-0 mx-auto h-[105%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] [mask-image:linear-gradient(to_bottom,black_75%,transparent_99%)]"
                  initial={{ filter: 'brightness(0.7) blur(8px)', scale: 1.05 }}
                  animate={{ filter: 'brightness(1) blur(0px)', scale: 1 }}
                  transition={{ duration: 0.8, ease: EASE }}
                />
              )}

              {/* Ambient lighting overlays */}
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />

              {/* Bottom Card Ribbon */}
              <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-ink-2/90 p-5 backdrop-blur-md">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-sans text-[11px] font-bold tracking-[0.25em] text-crimson-2 uppercase">
                      VERIFIED IDENTITY
                    </p>
                    <p className="font-display text-2xl tracking-wide text-bone">
                      GIRIDHAR REDDY
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-mist">
                      2024–2026
                    </span>
                    <p className="mt-1 text-[10px] font-medium text-smoke">
                      HERTFORDSHIRE, UK
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
