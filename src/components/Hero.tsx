import { useRef } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { certifications, profile, projects, characterAssets, type ProfileId } from '../data/portfolio';
import { useFinePointer } from '../hooks/useMedia';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { playClick } from '../hooks/useSoundFX';
import { EASE, Magnetic, Particles } from './fx';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } };
const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE } },
};

export default function Hero({
  onPlay,
  onResume,
  profileId,
  onSwitchToRecruiter,
}: {
  onPlay: () => void;
  onResume: () => void;
  profileId?: ProfileId;
  onSwitchToRecruiter?: () => void;
}) {
  void profileId;
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const { scrollTo } = useSmoothScroll();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-24%']);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // pointer parallax (desktop)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 18 });
  const py = useSpring(my, { stiffness: 60, damping: 18 });
  const imgRotY = useTransform(px, [-1, 1], [-3, 3]);
  const imgRotX = useTransform(py, [-1, 1], [2.5, -2.5]);
  const imgShiftX = useTransform(px, [-1, 1], [-8, 8]);
  const glowX = useTransform(px, [-1, 1], ['-5%', '5%']);

  const meta = [
    'MSc Data Science (UK)',
    'Victoria Solutions Alum',
    `${projects.length} Flagship Projects`,
    `${certifications.length} Credentials`,
  ];

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden bg-ink pt-20 lg:pt-0"
      onPointerMove={(e) => {
        if (!fine) return;
        mx.set((e.clientX / window.innerWidth) * 2 - 1);
        my.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      {/* Cinematic atmosphere */}
      <motion.div aria-hidden className="absolute inset-0 pointer-events-none" style={{ x: glowX }}>
        <div className="absolute right-[-10%] top-[-10%] h-[90vh] w-[80vw] rounded-full bg-[radial-gradient(closest-side,rgba(229,9,32,0.28),rgba(229,9,32,0.05)_55%,transparent)] blur-2xl lg:right-[-4%] lg:w-[60vw]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(214,173,98,0.16),transparent)] blur-2xl" />
      </motion.div>
      <Particles className="z-[1]" />

      {/* Visual Portrait Container */}
      <motion.div
        className="relative lg:absolute inset-x-0 z-[2] flex h-[55svh] sm:h-[62svh] items-center justify-center lg:bottom-0 lg:left-auto lg:right-[3vw] lg:top-16 lg:h-auto lg:w-[52vw] xl:right-[5vw] xl:w-[46vw]"
        style={{ y: imgY, scale: imgScale, opacity: fade }}
      >
        <motion.div
          className="relative h-full w-full max-w-[480px] lg:max-w-none lg:h-[84vh] flex items-center justify-center p-4 lg:p-8"
          style={{ rotateY: imgRotY, rotateX: imgRotX, x: imgShiftX, transformPerspective: 1200 }}
        >
          {/* Animated Character Art with subtle Ken Burns breathing motion */}
          <div className="relative w-full max-w-[440px] aspect-[4/5] rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#181B24] to-[#08090D] shadow-[0_25px_80px_rgba(0,0,0,0.85)] group">
            <motion.img
              src={characterAssets.hero.src}
              alt={characterAssets.hero.alt}
              className="w-full h-full object-cover object-top"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-[10px] text-[#D6AD62] uppercase tracking-wider block font-bold">
                  Signature Identity
                </span>
                <span className="font-sans font-bold text-white text-sm">GIRIDHAR REDDY</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] text-[#38bdf8] border border-white/10">
                Anime Film Series
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Hero Typography & CTAs */}
      <div className="gutter relative z-[3] flex min-h-[100svh] flex-col justify-center pb-16 pt-8 lg:w-[62vw] lg:pb-24 lg:pt-20">
        <motion.div variants={container} initial="hidden" animate="show" style={{ y: textY, opacity: fade }}>
          {/* Studio Tag & Badges */}
          <motion.div variants={item} className="mb-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-[#E50920]">
              {profile.originalLabel}
            </span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-xs text-[#D6AD62]">SEASON 2026</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono text-white/80">
              UK Ready
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={item}
            className="font-display text-[clamp(3.8rem,9vw,8.5rem)] font-normal leading-[0.9] tracking-wide text-bone"
          >
            {profile.firstName}
            <span className="block text-[0.45em] tracking-[0.14em] text-white/50">
              REDDY GODDILLA
            </span>
          </motion.h1>

          {/* Role designation */}
          <motion.div variants={item} className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm text-[#38bdf8]">
            <span className="font-bold">Data Analyst & Data Scientist</span>
            <span className="text-white/30">•</span>
            <span className="text-[#A3A6B0]">MSc Data Science @ Univ. of Hertfordshire (UK)</span>
          </motion.div>

          {/* Intro synopsis */}
          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-[#A3A6B0]"
          >
            Bridging production machine learning (97.32% accuracy LightGBM), big data PySpark pipelines, and high-impact Power BI & Tableau dashboards. Turning complex datasets into actionable business decisions.
          </motion.p>

          {/* Metadata badges */}
          <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-smoke">
            {meta.map((m, i) => (
              <span key={m} className="flex items-center gap-2">
                {i > 0 && <span className="text-white/20">•</span>}
                <span className="text-white/80">{m}</span>
              </span>
            ))}
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onPlay();
                }}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#E50920] px-6 text-sm font-bold tracking-wider text-white shadow-lg shadow-[#E50920]/30 transition hover:bg-[#ff2438] cursor-pointer"
              >
                <span>▶</span>
                <span>PLAY INTRO</span>
              </button>
            </Magnetic>

            {onSwitchToRecruiter && (
              <Magnetic>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onSwitchToRecruiter();
                  }}
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-5 text-sm font-semibold text-[#38bdf8] hover:bg-[#38bdf8]/20 transition cursor-pointer"
                >
                  <span>👔</span>
                  <span>RECRUITER DOSSIER</span>
                </button>
              </Magnetic>
            )}

            <Magnetic>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onResume();
                }}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-bone hover:border-white/40 hover:bg-white/10 transition cursor-pointer"
              >
                <span>📄</span>
                <span>RESUME</span>
              </button>
            </Magnetic>

            <Magnetic>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  scrollTo('#originals', { offset: -64 });
                }}
                className="inline-flex h-12 items-center gap-1.5 rounded-xl border border-white/10 px-4 text-xs font-medium text-[#A3A6B0] hover:text-white hover:border-white/25 transition cursor-pointer"
              >
                <span>EXPLORE WORK</span>
                <span>↓</span>
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
