import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { skillCategories, skillEvidence, characterAssets, type Skill } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';

const HUES = ['#ff3d5a', '#4cc9ff', '#46e3a8', '#ffb547', '#b98bff', '#ff8a5c', '#7ee0ff'];

export default function Skills() {
  const [cat, setCat] = useState(0);
  const category = skillCategories[cat];
  const hue = HUES[cat % HUES.length];

  return (
    <>
      <SectionHeading
        kicker="Capabilities"
        title="My Skill Universe"
        aside={<p className="max-w-xs text-sm text-mist">Hover or tap any skill card to inspect the real projects where it was applied.</p>}
      />

      <div className="gutter grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
        {/* Left Column: Developer Workspace & Category Tabs */}
        <div className="flex flex-col gap-6">
          {/* Developer Workspace Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#181B24] shadow-xl group">
            <div className="aspect-[16/10] overflow-hidden">
              <motion.img
                src={characterAssets.developer.src}
                alt={characterAssets.developer.alt}
                className="w-full h-full object-cover object-center"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <div className="p-3.5 bg-gradient-to-t from-[#11131A] via-[#11131A]/95 to-transparent">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#38bdf8] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#38bdf8] font-bold">
                  Workstation Environment
                </span>
              </div>
              <p className="text-xs text-white/80 mt-1 font-sans">
                Python ETL · PySpark Clusters · Machine Learning & BI
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="rail -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0" role="tablist" aria-label="Skill categories">
            {skillCategories.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={i === cat}
                onClick={() => setCat(i)}
                className={`group relative shrink-0 rounded-xl px-4 py-3 text-left transition lg:px-5 cursor-pointer ${
                  i === cat ? 'text-bone bg-white/[0.08] ring-1 ring-white/15' : 'text-smoke hover:text-bone hover:bg-white/[0.03]'
                }`}
              >
                {i === cat && (
                  <motion.span
                    layoutId="skill-bar"
                    className="absolute bottom-2 left-0 top-2 hidden w-[3px] rounded lg:block"
                    style={{ background: hue }}
                  />
                )}
                <span className="relative block font-display text-xl tracking-wide lg:text-2xl">{c.title}</span>
                <span className="relative hidden text-xs text-smoke lg:block mt-0.5">
                  {c.skills.length} skills · {c.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Skill Cards Grid */}
        <div className="min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div key={category.id} initial="hidden" animate="show" exit="exit" transition={{ staggerChildren: 0.04 }}>
              <motion.div
                className="mb-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 pb-3"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }}
              >
                <div>
                  <h3 className="font-sans text-lg font-bold text-bone">{category.title}</h3>
                  <p className="text-xs text-mist">{category.subtitle}</p>
                </div>
                <span className="text-xs font-mono text-smoke">{category.skills.length} Verified Proficiencies</span>
              </motion.div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {category.skills.map((s) => (
                  <SkillCard key={s.name} skill={s} hue={hue} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function SkillCard({ skill, hue }: { skill: Skill; hue: string }) {
  const [open, setOpen] = useState(false);
  const evidence = skillEvidence[skill.name];

  return (
    <motion.button
      type="button"
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
      }}
      whileHover={{ y: -4 }}
      className="group relative flex min-h-[148px] flex-col overflow-hidden rounded-xl bg-ink-2 p-4 text-left ring-1 ring-white/10 transition-shadow duration-300 hover:ring-white/20 cursor-pointer"
      style={{ boxShadow: open ? `0 14px 40px -10px ${hue}44, 0 0 0 1px ${hue}55` : undefined }}
    >
      <div aria-hidden className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition duration-500 group-hover:opacity-50" style={{ background: hue }} />

      <motion.span
        className="relative flex h-11 w-11 items-center justify-center rounded-lg font-display text-xl tracking-wide"
        style={{ background: `${hue}1f`, color: hue, boxShadow: `inset 0 0 0 1px ${hue}55` }}
        animate={open ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        aria-hidden
      >
        {skill.mono}
      </motion.span>

      <span className="relative mt-4 flex items-center gap-1.5 text-sm font-semibold text-bone">
        {skill.name}
        {skill.note && (
          <span className="rounded px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-ink" style={{ background: hue }}>
            {skill.note}
          </span>
        )}
      </span>

      <AnimatePresence initial={false}>
        {evidence && open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-2 text-[11px] text-[#A3A6B0] border-t border-white/5 pt-1.5"
          >
            <span className="font-mono text-[9px] text-[#D6AD62] uppercase block font-bold mb-0.5">Applied in:</span>
            <span className="line-clamp-2 text-white/90">{evidence.join(', ')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
