import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { profile, characterAssets } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE, Magnetic, Particles } from './fx';
import { SeriesMark } from './Poster';

export default function FinalCTA({
  onReplay,
  onSwitchToRecruiter,
}: {
  onReplay: () => void;
  onSwitchToRecruiter?: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.2'] });
  const spacing = useTransform(scrollYProgress, [0, 1], ['0.5em', '0.02em']);
  const blur = useTransform(scrollYProgress, [0, 1], ['blur(14px)', 'blur(0px)']);
  const opacity = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  const ctas = [
    { label: "Let's Build", href: `mailto:${profile.email}?subject=${encodeURIComponent("Let's build something")}`, primary: true },
    { label: 'LinkedIn', href: profile.links.linkedin, primary: false },
    { label: 'GitHub', href: profile.links.github, primary: false },
    { label: 'Email', href: `mailto:${profile.email}`, primary: false },
  ];

  return (
    <section id="contact" ref={ref} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_60%,rgba(229,9,32,0.18),transparent_70%)] pointer-events-none" />
      <Particles count={36} />

      {/* Approachable Calm City Avatar */}
      <motion.div
        className="relative mb-6"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl bg-[#11131A]">
          <motion.img
            src={characterAssets.calmCity.src}
            alt={characterAssets.calmCity.alt}
            className="w-full h-full object-cover object-top"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#E50920] text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow">
          UK Ready
        </span>
      </motion.div>

      <motion.p
        className="relative mb-4 text-[11px] font-bold uppercase tracking-[0.5em] text-crimson-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        The Next Episode
      </motion.p>

      <motion.h2
        className="relative font-display leading-[0.88] text-bone"
        style={{ fontSize: 'clamp(3.2rem, 12vw, 11rem)', letterSpacing: spacing, filter: blur, opacity }}
      >
        TO BE CONTINUED…
      </motion.h2>

      <motion.div
        className="relative mt-8"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
      >
        <p className="font-sans text-2xl font-bold tracking-[0.16em] text-bone sm:text-3xl">
          {profile.displayName.toUpperCase()}
        </p>
        <p className="mt-2 text-xs font-semibold tracking-[0.3em] text-[#38bdf8] sm:text-sm">
          DATA ANALYST & DATA SCIENTIST • HERTFORDSHIRE, UK
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="relative mt-10 flex flex-wrap justify-center gap-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.08, delayChildren: 0.3 }}
      >
        {ctas.map((c) => (
          <motion.div
            key={c.label}
            variants={{ hidden: { opacity: 0, y: 20, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } } }}
          >
            <Magnetic>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                className={`flex min-h-12 items-center gap-2 rounded-xl px-7 text-sm font-bold tracking-[0.12em] transition cursor-pointer ${
                  c.primary
                    ? 'bg-[#E50920] text-white shadow-[0_0_50px_rgba(229,9,32,0.45)] hover:bg-[#ff2438]'
                    : 'border border-white/20 bg-white/5 text-bone hover:border-white/40 hover:bg-white/10'
                }`}
              >
                {c.primary && <span>▶</span>}
                {c.label.toUpperCase()}
                {!c.primary && <span className="text-mist">↗</span>}
              </a>
            </Magnetic>
          </motion.div>
        ))}

        {onSwitchToRecruiter && (
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } } }}
          >
            <Magnetic>
              <button
                type="button"
                onClick={onSwitchToRecruiter}
                className="flex min-h-12 items-center gap-2 rounded-xl border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-6 text-sm font-bold tracking-[0.12em] text-[#38bdf8] hover:bg-[#38bdf8]/20 transition cursor-pointer"
              >
                <span>👔</span>
                <span>RECRUITER DOSSIER</span>
              </button>
            </Magnetic>
          </motion.div>
        )}
      </motion.div>

      <div className="relative mt-14 flex flex-wrap justify-center gap-6 text-xs font-semibold tracking-[0.2em] text-smoke">
        <button type="button" onClick={() => scrollTo(0, { offset: 0 })} className="hover:text-bone cursor-pointer">
          ↺ BACK TO TOP
        </button>
        <button type="button" onClick={onReplay} className="hover:text-bone cursor-pointer">
          ▶ REPLAY OPENING
        </button>
      </div>

      <footer className="absolute inset-x-0 bottom-0 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
        <div className="mb-2 text-base">
          <SeriesMark />
        </div>
        <p className="text-[11px] leading-relaxed text-smoke">
          © {new Date().getFullYear()} {profile.displayName}. Engineered for excellence across United Kingdom and international opportunities.
        </p>
      </footer>
    </section>
  );
}
