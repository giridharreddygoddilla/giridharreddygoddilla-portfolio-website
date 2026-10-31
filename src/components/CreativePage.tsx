import { motion } from 'framer-motion';
import { profile, characterAssets, projects, Project } from '../data/portfolio';
import { playClick } from '../hooks/useSoundFX';

interface CreativePageProps {
  onSelectProject: (p: Project) => void;
  onNavigateHome: () => void;
  onNavigateDeveloper: () => void;
}

export default function CreativePage({
  onSelectProject,
  onNavigateHome,
  onNavigateDeveloper,
}: CreativePageProps) {

  const creativeProjects = projects.filter((p) =>
    ['deliveroo-operational-analytics', 'uber-trip-analysis', 'sales-anomaly-detection'].includes(p.id)
  );

  const galleryPanels = [
    {
      title: 'The Workstation',
      subtitle: 'Where logic meets aesthetic precision',
      img: characterAssets.developer.src,
      alt: 'Developer Workstation',
      mood: 'Dual monitors, coding interface, cool ambient blue glow',
    },
    {
      title: 'The Urban Journey',
      subtitle: 'Walking forward with architectural clarity',
      img: characterAssets.walking.src,
      alt: 'Urban Walking',
      mood: 'Modern city architecture, golden hour light, relaxed posture',
    },
    {
      title: 'The Executive Studio',
      subtitle: 'Calm confidence, grounded in evidence',
      img: characterAssets.confident.src,
      alt: 'Executive Studio',
      mood: 'Studio waist-up portrait, warm rim lighting, focused demeanor',
    },
    {
      title: 'The Strategic Session',
      subtitle: 'Deep contemplation before the first line of code',
      img: characterAssets.seated.src,
      alt: 'Seated Strategy',
      mood: 'Office atmosphere, thoughtful posture, warm architectural lamp',
    },
  ];

  const designPrinciples = [
    {
      num: '01',
      title: 'Signal Over Noise',
      desc: 'Eliminating arbitrary ornamentation, glowing distractions, and decorative clutter. Every pixel and color hue must earn its place by serving clarity and comprehension.',
    },
    {
      num: '02',
      title: 'Cognitive Ergonomics',
      desc: 'Structuring complex dashboards and visual interfaces so the human mind absorbs critical KPIs in milliseconds without cognitive friction or confusion.',
    },
    {
      num: '03',
      title: 'Narrative Motion',
      desc: 'Purpose-driven animation that clarifies spatial context, guides the viewer’s eye through analytical milestones, and never hijacks reading velocity.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#08090D] text-[#F5F5F5] pt-24 pb-28">
      {/* CREATIVE HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-white/50">
          <button
            type="button"
            onClick={() => {
              playClick();
              onNavigateHome();
            }}
            className="hover:text-white transition cursor-pointer flex items-center gap-1"
          >
            <span>← Return to Series</span>
          </button>
          <span>/</span>
          <span className="text-[#D6AD62]">Creative Direction</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Typography */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-[#D6AD62] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#D6AD62] font-bold">
                CREATIVE DIRECTION & STORYTELLING
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal leading-[0.92] tracking-wide text-white">
              TURNING COMPLEX DATA INTO <span className="text-[#D6AD62]">COMPELLING STORIES</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#A3A6B0] leading-relaxed max-w-2xl font-sans">
              Beyond formulas and algorithms lies the craft of communication. I bridge analytical rigor
              with high-end editorial presentation — transforming multidimensional datasets into intuitive,
              cinematic visual narratives that inform and inspire.
            </p>

            <div className="mt-8 flex flex-wrap gap-2 text-xs font-mono">
              {['Data Storytelling', 'Information Architecture', 'Editorial Design', 'Cognitive Clarity'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-white/80"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  const el = document.getElementById('manifesto');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#D6AD62] hover:bg-[#e0bc75] text-[#08090D] font-bold text-sm tracking-wider transition cursor-pointer shadow-lg shadow-[#D6AD62]/20"
              >
                EXPLORE MANIFESTO ↓
              </button>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  onNavigateDeveloper();
                }}
                className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition cursor-pointer"
              >
                VIEW DEVELOPER CODE →
              </button>
            </div>
          </div>

          {/* Hero Artwork Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden border border-[#D6AD62]/30 bg-gradient-to-b from-[#181B24] to-[#08090D] shadow-2xl group">
              <motion.img
                src={characterAssets.walking.src}
                alt={characterAssets.walking.alt}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-transparent opacity-85" />

              <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#D6AD62] uppercase tracking-wider block font-bold">
                    Visual Identity
                  </span>
                  <p className="font-display text-2xl text-white">THE CREATIVE ODYSSEY</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-white/10 font-mono text-[10px] text-white/80 border border-white/15">
                  Art Direction
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE CREATIVE MANIFESTO */}
      <section id="manifesto" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#181B24] via-[#11131A] to-[#08090D] p-8 sm:p-12 md:p-16 shadow-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-[#E50920] block mb-3 font-bold">
            THE PHILOSOPHY
          </span>

          <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl italic text-white/95 leading-snug">
            &ldquo;Raw data without narrative is merely digital noise. Real creative intelligence lies in
            finding the human signal, structuring the chaos, and crafting visual experiences that illuminate
            truth and inspire decisive action.&rdquo;
          </blockquote>

          <p className="mt-6 text-sm sm:text-base text-[#D6AD62] font-semibold">— Giridhar Reddy Goddilla</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-10 border-t border-white/10">
            {designPrinciples.map((p) => (
              <div key={p.num} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="font-mono text-2xl font-bold text-[#D6AD62] block mb-2">{p.num}</span>
                <h3 className="font-bold text-base text-white mb-2">{p.title}</h3>
                <p className="text-xs text-[#A3A6B0] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISUAL IDENTITY GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#38bdf8] font-bold">
              PORTFOLIO ARTWORK
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide mt-1">
              THE ART DIRECTION GALLERY
            </h2>
          </div>
          <span className="font-mono text-xs text-[#A3A6B0] hidden sm:inline">
            4 Signature Character Scenes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryPanels.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#181B24] shadow-xl flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.alt}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-transparent opacity-80" />
              </div>

              <div className="p-4 bg-[#11131A] border-t border-white/5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-[#D6AD62] transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#A3A6B0] mt-1 leading-snug">{item.subtitle}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-white/50">
                  {item.mood}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CREATIVE DATA STORYTELLING SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff3d5a] font-bold">
              CASE STUDIES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide mt-1">
              DATA STORYTELLING IN ACTION
            </h2>
          </div>
          <span className="font-mono text-xs text-[#A3A6B0] hidden sm:inline">
            Aesthetic & Architectural Breakdown
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {creativeProjects.map((p, idx) => (
            <div
              key={p.id}
              className="rounded-2xl border border-white/10 bg-[#181B24]/80 p-6 flex flex-col justify-between hover:border-white/20 transition group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#D6AD62] font-mono mb-2">
                  <span>STORY #{idx + 1}</span>
                  <span>{p.year}</span>
                </div>

                <h3 className="font-bold text-lg text-white group-hover:text-[#38bdf8] transition">
                  {p.title}
                </h3>

                <p className="text-xs text-[#A3A6B0] mt-2.5 leading-relaxed">{p.logline}</p>

                {/* Key visual takeaway */}
                <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="font-mono text-[10px] text-white/50 uppercase block font-bold mb-1">
                    Design Highlight
                  </span>
                  <span className="text-xs text-white/85 leading-snug">
                    {p.features[0] || 'Interactive dynamic visualization and KPI decomposition.'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onSelectProject(p);
                  }}
                  className="text-xs font-semibold text-[#E50920] hover:text-[#ff3d5a] flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Case Study</span>
                  <span>→</span>
                </button>

                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-white/50 hover:text-white"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CREATIVE CONTACT FINALE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#181B24] to-[#11131A] p-10 sm:p-14 shadow-2xl">
          <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#D6AD62]/60 shadow-xl mb-6 bg-[#08090D]">
            <img
              src={characterAssets.calmCity.src}
              alt={characterAssets.calmCity.alt}
              className="w-full h-full object-cover object-top"
            />
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-[#D6AD62] font-bold">
            LET&apos;S COLLABORATE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide mt-2">
            HAVE AN AMBITIOUS PROJECT IN MIND?
          </h2>
          <p className="mt-3 text-sm text-[#A3A6B0] max-w-lg mx-auto leading-relaxed">
            Whether you need executive dashboards that communicate with authority or predictive machine learning
            presented with elegance, I am ready to build.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${profile.email}?subject=Creative%20Collaboration`}
              className="px-6 py-3 rounded-xl bg-[#E50920] hover:bg-[#ff2438] text-white font-bold text-sm tracking-wider transition cursor-pointer shadow-lg shadow-[#E50920]/25"
            >
              ✉️ START A CONVERSATION
            </a>

            <button
              type="button"
              onClick={() => {
                playClick();
                onNavigateHome();
              }}
              className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition cursor-pointer"
            >
              🎬 WATCH MAIN SERIES
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
