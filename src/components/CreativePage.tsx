import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { characterAssets } from '../data/portfolio';
import { playClick } from '../hooks/useSoundFX';
import { EASE } from './fx';

interface CreativePageProps {
  onNavigateHome: () => void;
  onNavigateProfessional: () => void;
  onOpenProfileChooser?: () => void;
  onSelectProject?: (p: any) => void;
}

interface ChapterNav {
  id: string;
  num: string;
  title: string;
  icon: string;
}

const chapters: ChapterNav[] = [
  { id: 'creative-01', num: '01', title: 'Where It Began', icon: '🎨' },
  { id: 'creative-02', num: '02', title: '100+ Stories in Colours', icon: '🖼️' },
  { id: 'creative-03', num: '03', title: 'Artificial Intelligence', icon: '🧠' },
  { id: 'creative-04', num: '04', title: 'Becoming an AI Engineer', icon: '⚙️' },
  { id: 'creative-05', num: '05', title: 'Entrepreneurship Vision', icon: '💡' },
  { id: 'creative-06', num: '06', title: 'Where Art Meets Tech', icon: '✨' },
  { id: 'creative-final', num: '✦', title: 'Still Being Created', icon: '🚀' },
];

type ArtCategory = 'all' | 'landscapes' | 'abstract' | 'expressive' | 'studies';

interface PaintingItem {
  id: number;
  code: string;
  category: ArtCategory;
  categoryLabel: string;
  title: string;
  medium: string;
  palette: string[];
  dimensions: string;
  status: 'archived' | 'curated';
  desc: string;
}

// Representative curation of Giridhar's 100+ Original Paintings Collection
// Real placeholders ready for his actual canvas photo uploads
const samplePaintings: PaintingItem[] = [
  {
    id: 1,
    code: 'GGR-CANVAS-001',
    category: 'landscapes',
    categoryLabel: 'Landscapes & Nature',
    title: 'Golden Horizon Across the Fields',
    medium: 'Original Canvas • Acrylic & Texture',
    palette: ['#D6AD62', '#854D0E', '#166534', '#0F172A'],
    dimensions: '24 × 36 in',
    status: 'curated',
    desc: 'Inspired by rural tranquility, sunset over open meadows, and the peaceful transitions of dusk.',
  },
  {
    id: 2,
    code: 'GGR-CANVAS-002',
    category: 'abstract',
    categoryLabel: 'Abstract & Emotion',
    title: 'Surge of Midnight Emotion',
    medium: 'Original Canvas • Mixed Palette',
    palette: ['#E50920', '#1E1B4B', '#312E81', '#F8FAFC'],
    dimensions: '30 × 40 in',
    status: 'curated',
    desc: 'An exploration of inner fire, resolute determination, and intense contrasts between dark and light.',
  },
  {
    id: 3,
    code: 'GGR-CANVAS-003',
    category: 'expressive',
    categoryLabel: 'Expressive Brushwork',
    title: 'Whispering Winds in the Grove',
    medium: 'Original Canvas • Oil on Canvas',
    palette: ['#065F46', '#047857', '#A7F3D0', '#111827'],
    dimensions: '20 × 28 in',
    status: 'curated',
    desc: 'Dynamic, sweeping brushstrokes depicting movement through natural canopies and morning mist.',
  },
  {
    id: 4,
    code: 'GGR-CANVAS-004',
    category: 'studies',
    categoryLabel: 'Sketches & Studies',
    title: 'Silent Temple Tower at Dawn',
    medium: 'Original Canvas • Charcoal & Wash',
    palette: ['#78716C', '#44403C', '#E7E5E4', '#0C0A09'],
    dimensions: '18 × 24 in',
    status: 'curated',
    desc: 'Delicate structural contours capturing ancient architecture illuminated by early golden sunbeams.',
  },
  {
    id: 5,
    code: 'GGR-CANVAS-005',
    category: 'abstract',
    categoryLabel: 'Abstract & Emotion',
    title: 'The Unyielding Flame',
    medium: 'Original Canvas • Acrylic Impasto',
    palette: ['#DC2626', '#EA580C', '#FBBF24', '#171717'],
    dimensions: '28 × 36 in',
    status: 'curated',
    desc: 'Textured layers embodying resilience, the refusal to surrender, and unwavering passion.',
  },
  {
    id: 6,
    code: 'GGR-CANVAS-006',
    category: 'landscapes',
    categoryLabel: 'Landscapes & Nature',
    title: 'Country Road After Monsoon',
    medium: 'Original Canvas • Layered Acrylic',
    palette: ['#047857', '#D97706', '#1E293B', '#F1F5F9'],
    dimensions: '24 × 32 in',
    status: 'curated',
    desc: 'Wet reflection on village pathways, rich earthy aromas, and the calm that settles after rainfall.',
  },
  {
    id: 7,
    code: 'GGR-CANVAS-007',
    category: 'expressive',
    categoryLabel: 'Expressive Brushwork',
    title: 'Rhythm of the Open Sky',
    medium: 'Original Canvas • Expressionist Wash',
    palette: ['#0284C7', '#0369A1', '#E0F2FE', '#0F172A'],
    dimensions: '30 × 30 in',
    status: 'curated',
    desc: 'Broad, fluid strokes capturing the infinite expanse of blue and the sensation of absolute freedom.',
  },
  {
    id: 8,
    code: 'GGR-CANVAS-008',
    category: 'studies',
    categoryLabel: 'Sketches & Studies',
    title: 'Geometry of Light and Shadow',
    medium: 'Original Canvas • Fine Ink & Gouache',
    palette: ['#52525B', '#27272A', '#FAFAFA', '#18181B'],
    dimensions: '16 × 20 in',
    status: 'curated',
    desc: 'A precise study in tonal values, geometric form, and how light carves silhouettes in empty space.',
  },
];

export default function CreativePage({
  onNavigateHome,
  onNavigateProfessional,
  onOpenProfileChooser,
}: CreativePageProps) {
  const [activeChapter, setActiveChapter] = useState<string>('creative-01');
  const [activeCategory, setActiveCategory] = useState<ArtCategory>('all');
  const [selectedArtwork, setSelectedArtwork] = useState<PaintingItem | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    document.title = 'Giridhar Reddy Goddilla | The Mind That Creates';
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!selectedArtwork) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedArtwork(null);
        setIsZoomed(false);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = samplePaintings.findIndex((p) => p.id === selectedArtwork.id);
        const next = samplePaintings[(currentIndex + 1) % samplePaintings.length];
        setSelectedArtwork(next);
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = samplePaintings.findIndex((p) => p.id === selectedArtwork.id);
        const prev = samplePaintings[(currentIndex - 1 + samplePaintings.length) % samplePaintings.length];
        setSelectedArtwork(prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArtwork]);

  // Update active chapter on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 240;
      for (let i = chapters.length - 1; i >= 0; i--) {
        const el = document.getElementById(chapters[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveChapter(chapters[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToChapter = (id: string) => {
    playClick();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const filteredPaintings = useMemo(() => {
    if (activeCategory === 'all') return samplePaintings;
    return samplePaintings.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="relative min-h-screen bg-[#08090D] text-[#F5F5F5] selection:bg-[#ffb547] selection:text-[#08090D]">
      {/* Ambient artistic studio lighting */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, #ffb54720, transparent 60%), radial-gradient(ellipse 60% 40% at 10% 80%, #38bdf815, transparent 70%)',
        }}
        aria-hidden
      />

      {/* Sticky Top Chapter Progress Strip */}
      <div className="sticky top-16 md:top-[70px] z-40 bg-[#0A0C10]/90 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto rail">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ffb547] animate-pulse" />
            <span className="uppercase tracking-wider text-white/70">STUDIO & INNOVATION</span>
            <span className="text-white/30">•</span>
            <span className="text-[#ffb547] font-semibold">7 CHAPTERS</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {chapters.map((ch) => {
              const isActive = activeChapter === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => scrollToChapter(ch.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#ffb547] text-[#08090D] font-bold shadow-lg shadow-[#ffb547]/30 scale-105'
                      : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/5'
                  }`}
                  aria-label={`Jump to Chapter ${ch.num}: ${ch.title}`}
                >
                  <span className="text-[11px] opacity-80">{ch.icon}</span>
                  <span className="hidden sm:inline font-bold">{ch.num}</span>
                  <span className="inline sm:hidden">{ch.num}</span>
                  <span className="hidden lg:inline">{ch.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-28">
        {/* Navigation Breadcrumb / Return */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              playClick();
              if (onOpenProfileChooser) onOpenProfileChooser();
            }}
            className="flex items-center gap-2 text-white/60 hover:text-white transition cursor-pointer group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>All Profiles (Three Sides)</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-white/40">Switch profile:</span>
            <button
              type="button"
              onClick={() => {
                playClick();
                onNavigateHome();
              }}
              className="px-2.5 py-0.5 rounded border border-[#E50920]/40 bg-[#E50920]/10 text-red-300 hover:bg-[#E50920]/20 transition cursor-pointer"
            >
              Personal →
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                onNavigateProfessional();
              }}
              className="px-2.5 py-0.5 rounded border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/20 transition cursor-pointer"
            >
              Professional (Recruiter) →
            </button>
          </div>
        </div>

        {/* HERO HEADER: THE MIND THAT CREATES */}
        <header className="mb-20 sm:mb-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ffb547]/40 bg-[#ffb547]/10 text-[#ffb547] font-mono text-xs uppercase tracking-widest mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ffb547] animate-ping" />
            CREATIVE IDENTITY & INNOVATION STUDIO
          </div>

          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight text-white leading-none mb-4">
            THE MIND THAT CREATES.
          </h1>

          <p className="font-mono text-xs sm:text-sm tracking-widest text-[#ffb547] font-semibold uppercase mb-10 max-w-2xl mx-auto">
            A CANVAS OF IMAGINATION. A FUTURE OF POSSIBILITIES.
          </p>

          {/* Signature Creative Visual — Studio Innovation Workspace with Paintings & AI */}
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square rounded-3xl overflow-hidden ring-2 ring-[#ffb547]/40 shadow-2xl shadow-[#ffb547]/25 mb-10 bg-[#11131A] group">
            <img
              src={characterAssets.walking.src}
              alt="Giridhar Reddy Goddilla - Creative Studio Workspace with Paintings, AI & Passions"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition duration-700"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
              <span className="font-mono text-[10px] tracking-wider uppercase text-white/90 bg-black/70 px-3 py-1 rounded-full border border-white/15 backdrop-blur-sm">
                GIRIDHAR REDDY GODDILLA • CREATIVE STUDIO
              </span>
            </div>
          </div>

          {/* Introduction Quote Box */}
          <div className="relative max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl text-left">
            <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#08090D] border border-white/15 text-[11px] font-mono text-white/50">
              PROLOGUE
            </div>
            <p className="text-lg sm:text-xl font-medium text-white leading-relaxed mb-4">
              I am <span className="text-[#ffb547]">Giridhar Reddy Goddilla</span>.
            </p>
            <p className="text-sm sm:text-base text-[#A3A6B0] leading-relaxed mb-4">
              Beyond the person people see, there is another side of me — a side driven by imagination, creativity, curiosity, and the desire to build something meaningful.
            </p>
            <p className="text-sm sm:text-base text-[#A3A6B0] leading-relaxed mb-4">
              For me, creativity has never been limited to one form. It lives in colours, paintings, ideas, technology, experiments, and the possibilities of tomorrow.
            </p>
            <p className="font-serif italic text-lg text-[#F5F5F5] border-l-2 border-[#ffb547] pl-4 mt-6">
              &ldquo;This is the story of the things I create, the things I explore, and the future I dream of building.&rdquo;
            </p>
          </div>
        </header>

        {/* CHAPTER 01: WHERE MY CREATIVE JOURNEY BEGAN */}
        <section
          id="creative-01"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ffb547] font-bold">
              CHAPTER 01
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">🎨</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-6">
            WHERE MY CREATIVE JOURNEY BEGAN.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans">
              <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                My relationship with creativity began in childhood.
              </p>
              <p>
                Painting was never just an occasional hobby for me. It became something I genuinely loved.
              </p>
              <p>
                There is something magical about starting with a blank canvas and slowly transforming it into something meaningful. A simple brushstroke can change an entire painting. A combination of colours can create a feeling that words sometimes cannot explain.
              </p>
              <p>
                Over time, that childhood passion became an important part of who I am.
              </p>
              <div className="p-4 rounded-xl border border-[#ffb547]/30 bg-[#ffb547]/10 text-white font-serif text-lg leading-snug">
                <span className="text-[#ffb547] font-display text-2xl block mb-1">
                  I HAVE PAINTED MORE THAN 100 PAINTINGS.
                </span>
                &ldquo;Each painting represents time, patience, imagination, experimentation, and a little piece of my creative journey.&rdquo;
              </div>
              <p>
                Some creations come from inspiration. Some come from imagination. Others simply happen when I allow myself to experiment.
              </p>
              <p className="italic text-white">
                I don&apos;t believe creativity always needs a perfect plan. Sometimes, the best ideas begin with a blank canvas and the courage to make the first stroke.
              </p>
            </div>

            <div className="md:col-span-5">
              {/* Artist Studio Palette Card */}
              <div className="rounded-2xl border border-white/10 bg-[#11131A] p-5 shadow-2xl relative overflow-hidden">
                <div className="h-52 rounded-xl bg-gradient-to-br from-[#2a1b08] via-[#1a1205] to-[#0A0C10] flex flex-col justify-end p-5 relative overflow-hidden border border-[#ffb547]/30">
                  <div className="absolute top-4 right-4 text-3xl opacity-75">🖌️</div>
                  <div className="relative z-10">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-[#ffb547]/40 text-[#ffb547] font-mono text-[10px] uppercase tracking-wider mb-2">
                      Studio Origins
                    </span>
                    <h3 className="font-display text-xl text-white">The Blank Canvas & First Stroke</h3>
                    <p className="text-xs text-white/70 font-sans mt-1">
                      Pure pigments, tactile textures, deliberate layers, and endless patience.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="block text-white/40 text-[10px]">CREATIONS</span>
                    <span className="text-[#ffb547] font-bold text-sm">100+ Artworks</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="block text-white/40 text-[10px]">CORE MEDIUM</span>
                    <span className="text-white font-medium">Fine Canvas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 02: MORE THAN A HUNDRED STORIES IN COLOURS (GALLERY & LIGHTBOX) */}
        <section
          id="creative-02"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-[#ffb547]/30 bg-gradient-to-b from-[#ffb547]/[0.05] via-white/[0.02] to-transparent relative overflow-hidden shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ffb547] font-bold">
              CHAPTER 02 • ART GALLERY
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">🖼️</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-3">
            MORE THAN A HUNDRED STORIES IN COLOURS.
          </h2>

          <div className="max-w-3xl space-y-3 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans mb-8">
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
              Every painting has its own identity. Some are about colours. Some are about details. Some are about emotions. And some are simply expressions of imagination.
            </p>
            <p>
              My collection of 100+ paintings is something I want to preserve and showcase as a dedicated part of my creative identity.
            </p>
            <p>
              I want this gallery to represent more than finished artwork. I want visitors to discover the journey behind the canvas, appreciate the details, and see how my creativity has evolved.
            </p>
            <p className="font-serif italic text-white text-base sm:text-lg pt-1">
              &ldquo;For me, art is not about counting how many paintings I have completed. It is about never losing the curiosity to create another one.&rdquo;
            </p>
          </div>

          {/* Banner: 100+ PAINTINGS. COUNTLESS IDEAS. ONE CREATIVE JOURNEY */}
          <div className="p-4 sm:p-5 rounded-2xl border border-[#ffb547]/30 bg-[#ffb547]/10 text-center mb-8">
            <p className="font-display text-xl sm:text-3xl text-white tracking-wider">
              100+ PAINTINGS. COUNTLESS IDEAS. ONE CREATIVE JOURNEY.
            </p>
            <p className="font-mono text-xs text-[#ffb547] uppercase tracking-widest mt-1">
              Authentic Archive • Curated Canvases Ready for Full Artwork Scans
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-mono text-white/40 mr-1">Filter Collection:</span>
            {[
              { id: 'all', label: 'All Curated Slots (100+)' },
              { id: 'landscapes', label: 'Landscapes & Nature' },
              { id: 'abstract', label: 'Abstract & Emotion' },
              { id: 'expressive', label: 'Expressive Brushwork' },
              { id: 'studies', label: 'Sketches & Studies' },
            ].map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playClick();
                    setActiveCategory(tab.id as ArtCategory);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                    active
                      ? 'bg-[#ffb547] text-[#08090D] font-bold shadow-md shadow-[#ffb547]/30'
                      : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Gallery Masonry / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPaintings.map((painting) => (
              <motion.div
                key={painting.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group rounded-2xl border border-white/10 bg-[#11131A] p-4 shadow-xl hover:border-[#ffb547]/40 hover:shadow-2xl transition cursor-pointer flex flex-col justify-between"
                onClick={() => {
                  playClick();
                  setSelectedArtwork(painting);
                }}
              >
                <div>
                  {/* Canvas Texture Frame Placeholder */}
                  <div className="relative h-48 w-full rounded-xl overflow-hidden mb-3 border border-white/10 flex flex-col justify-between p-3.5 bg-gradient-to-br from-[#181a22] via-[#0f1118] to-[#08090D]">
                    {/* Simulated Canvas Texture Overlay */}
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(${painting.palette[0]} 1px, transparent 1px)`,
                        backgroundSize: '12px 12px',
                      }}
                    />

                    {/* Top Tag */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-white/70 border border-white/10">
                        {painting.code}
                      </span>
                      <span className="text-xs">🖼️</span>
                    </div>

                    {/* Palette Swatches */}
                    <div className="relative z-10 flex items-center gap-1.5">
                      {painting.palette.map((c, i) => (
                        <span
                          key={i}
                          className="h-3 w-3 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>

                    {/* Hover Click Hint */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-mono text-white gap-1.5 z-20">
                      <span>Click to Inspect</span>
                      <span>🔍</span>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#ffb547] block mb-1">
                    {painting.categoryLabel}
                  </span>
                  <h3 className="font-display text-lg text-white group-hover:text-[#ffb547] transition">
                    {painting.title}
                  </h3>
                  <p className="text-xs text-[#A3A6B0] line-clamp-2 mt-1 leading-relaxed">
                    {painting.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/50">
                  <span>{painting.dimensions}</span>
                  <span className="text-[#ffb547] group-hover:translate-x-1 transition-transform">
                    Expand →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Genuine Artwork Upload Notice */}
          <div className="mt-8 p-4 rounded-xl border border-white/10 bg-white/[0.02] text-center text-xs font-mono text-white/50">
            <span className="text-[#ffb547] font-semibold mr-1">✦ Truth in Artistry:</span>
            No stock imagery is claimed as original work. Slots are reserved for Giridhar&apos;s real 100+ acrylic and canvas paintings.
          </div>
        </section>

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {selectedArtwork && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
              onClick={() => {
                setSelectedArtwork(null);
                setIsZoomed(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="relative max-w-4xl w-full rounded-3xl border border-white/15 bg-[#11131A] p-6 sm:p-8 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArtwork(null);
                    setIsZoomed(false);
                  }}
                  className="absolute top-5 right-5 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition cursor-pointer z-20"
                  aria-label="Close Lightbox"
                >
                  ✕
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  {/* Artwork Preview Canvas */}
                  <div className="md:col-span-7">
                    <div
                      className={`relative w-full rounded-2xl border border-white/15 overflow-hidden flex flex-col justify-between p-6 transition-all ${
                        isZoomed ? 'h-96 scale-105' : 'h-80 sm:h-96'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${selectedArtwork.palette[0]}33, #0A0C10 90%)`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs px-3 py-1 rounded-full bg-black/70 border border-white/10 text-white/80">
                          {selectedArtwork.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsZoomed(!isZoomed)}
                          className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-white/80 hover:text-white transition"
                        >
                          {isZoomed ? 'Reset Scale 🔍' : 'Zoom Canvas 🔎'}
                        </button>
                      </div>

                      <div className="text-center py-6">
                        <span className="text-5xl block mb-2 opacity-80">🎨</span>
                        <span className="font-display text-xl text-white block">
                          Original Painting by Giridhar
                        </span>
                        <span className="font-mono text-xs text-white/50 block mt-1">
                          {selectedArtwork.medium}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {selectedArtwork.palette.map((color, idx) => (
                            <span
                              key={idx}
                              className="h-4 w-4 rounded-full border border-black/50 shadow"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-xs text-white/60">
                          {selectedArtwork.dimensions}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Artwork Metadata */}
                  <div className="md:col-span-5 space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#ffb547]/10 border border-[#ffb547]/30 text-[#ffb547] font-mono text-xs uppercase tracking-wider font-semibold">
                      {selectedArtwork.categoryLabel}
                    </span>

                    <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide">
                      {selectedArtwork.title}
                    </h3>

                    <p className="text-sm text-[#A3A6B0] leading-relaxed">
                      {selectedArtwork.desc}
                    </p>

                    <div className="space-y-2 pt-2 text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex justify-between">
                        <span className="text-white/40">COLLECTION:</span>
                        <span className="text-white font-medium">100+ Original Paintings</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex justify-between">
                        <span className="text-white/40">STATUS:</span>
                        <span className="text-[#ffb547] font-medium">Catalogued Artwork</span>
                      </div>
                    </div>

                    {/* Lightbox Navigation Buttons */}
                    <div className="pt-4 flex items-center justify-between border-t border-white/10">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const currentIndex = samplePaintings.findIndex(
                              (p) => p.id === selectedArtwork.id
                            );
                            const prev =
                              samplePaintings[
                                (currentIndex - 1 + samplePaintings.length) % samplePaintings.length
                              ];
                            setSelectedArtwork(prev);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-white transition cursor-pointer"
                        >
                          ← Previous
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const currentIndex = samplePaintings.findIndex(
                              (p) => p.id === selectedArtwork.id
                            );
                            const next =
                              samplePaintings[(currentIndex + 1) % samplePaintings.length];
                            setSelectedArtwork(next);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-white transition cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>

                      <span className="text-[11px] font-mono text-white/40">
                        ESC to close
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CHAPTER 03: ARTIFICIAL INTELLIGENCE */}
        <section
          id="creative-03"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-sky-500/30 bg-gradient-to-b from-sky-500/[0.05] via-transparent to-transparent relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-sky-400 font-bold">
              CHAPTER 03
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">🧠</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-6">
            A NEW WORLD THAT FASCINATES ME — ARTIFICIAL INTELLIGENCE.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans">
              <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                While painting allows me to express imagination through colours, Artificial Intelligence opens an entirely different world of possibilities.
              </p>
              <p className="text-sky-300 font-medium">
                I am extremely passionate about AI.
              </p>
              <p>
                What fascinates me is the ability of technology to transform ideas, solve problems, explore possibilities, and create things that once seemed unimaginable.
              </p>
              <p>
                AI is not just another technology that interests me. It is a field I genuinely want to understand, explore, and become a part of.
              </p>
              <p>
                I enjoy discovering how artificial intelligence works, what it can achieve, and how it might shape the future.
              </p>
              <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/10 text-white font-serif italic text-base sm:text-lg">
                &ldquo;The more I explore this world, the more curious I become. I want to keep learning, experimenting, understanding new technologies, and discovering what I can build with them.&rdquo;
              </div>
            </div>

            <div className="md:col-span-5">
              {/* Neural Systems Visual Card */}
              <div className="rounded-2xl border border-sky-500/30 bg-[#11131A] p-5 shadow-2xl space-y-3">
                <div className="h-44 rounded-xl bg-gradient-to-br from-[#0c2340] via-[#081426] to-[#0A0C10] flex flex-col justify-end p-5 relative overflow-hidden border border-sky-500/30">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative z-10">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-950/80 border border-sky-500/40 text-sky-300 font-mono text-[10px] uppercase tracking-wider mb-2">
                      Frontier Curiosity
                    </span>
                    <h3 className="font-display text-xl text-white">Intelligent Systems & Insight</h3>
                    <p className="text-xs text-white/70 font-sans mt-1">
                      Algorithmic discovery, problem-solving architectures, and future possibilities.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="block text-white/40 text-[10px]">FOCUS</span>
                    <span className="text-sky-300 font-medium">Deep Exploration</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="block text-white/40 text-[10px]">PHILOSOPHY</span>
                    <span className="text-white font-medium">Forward-Looking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 04: THE DREAM OF BECOMING AN AI ENGINEER */}
        <section
          id="creative-04"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ffb547] font-bold">
              CHAPTER 04
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">⚙️</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-3">
            THE DREAM OF BECOMING AN AI ENGINEER.
          </h2>

          <div className="inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-white/60 mb-6">
            ASPIRATIONAL GOAL • LEARNING PATHWAY
          </div>

          <div className="space-y-4 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans max-w-3xl mb-8">
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
              One of my biggest future ambitions is to become an AI Engineer.
            </p>
            <p>
              I know that reaching this goal requires continuous learning, dedication, practical experience, patience, and persistent self-improvement.
            </p>
            <p>
              I want to build the knowledge and skills required to work with intelligent systems and meaningful technology.
            </p>
            <p>
              I don&apos;t want to simply watch the future unfold. I want to understand it, contribute to it, and eventually help build it.
            </p>
            <div className="p-4 rounded-xl border border-white/15 bg-white/[0.03] text-[#D6AD62] font-serif italic text-base sm:text-lg">
              &ldquo;For me, becoming an AI Engineer is not just about earning a title. It is about becoming capable of turning complex ideas into useful solutions.&rdquo;
            </div>
            <p className="font-mono text-xs text-white/50 pt-1">
              This is a journey I am excited to pursue.
            </p>
          </div>

          {/* Pillars of the Aspirational Path */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-white/10 bg-[#11131A]">
              <span className="font-mono text-xs text-sky-400 block mb-1">01 / FOUNDATIONS</span>
              <h4 className="font-display text-lg text-white mb-1">Intelligent Logic</h4>
              <p className="text-xs text-[#A3A6B0] leading-relaxed">
                Mastering mathematical models, data pipelines, and machine intelligence principles.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-white/10 bg-[#11131A]">
              <span className="font-mono text-xs text-[#ffb547] block mb-1">02 / CRAFT</span>
              <h4 className="font-display text-lg text-white mb-1">Practical Construction</h4>
              <p className="text-xs text-[#A3A6B0] leading-relaxed">
                Building hands-on projects, rigorous experimentation, and understanding complex architectures.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-white/10 bg-[#11131A]">
              <span className="font-mono text-xs text-emerald-400 block mb-1">03 / HORIZON</span>
              <h4 className="font-display text-lg text-white mb-1">Real-World Impact</h4>
              <p className="text-xs text-[#A3A6B0] leading-relaxed">
                Solving tangible problems that empower people, streamline systems, and elevate everyday life.
              </p>
            </div>
          </div>
        </section>

        {/* CHAPTER 05: FROM IMAGINATION TO ENTREPRENEURSHIP */}
        <section
          id="creative-05"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.04] to-transparent relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
              CHAPTER 05
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">💡</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-3">
            FROM IMAGINATION TO ENTREPRENEURSHIP.
          </h2>

          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 mb-6">
            LONG-TERM VISION • VENTURE ASPIRATION
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans">
              <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                There is another dream that lives alongside my passion for creativity and technology.
              </p>
              <p className="text-amber-200 font-medium">
                One day, I want to build my own company.
              </p>
              <p>
                I want to create something of my own — something that begins with an idea, grows through hard work, and eventually becomes something meaningful.
              </p>
              <p>
                The thought of building, experimenting, solving problems, and creating opportunities excites me.
              </p>
              <p>
                I don&apos;t know every detail of what that future will look like yet. But I know that I want to keep learning, developing ideas, taking opportunities, and working towards that vision.
              </p>
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-white font-serif italic text-base sm:text-lg">
                &ldquo;I believe great things begin with the courage to imagine something that does not yet exist.&rdquo;
              </div>
            </div>

            <div className="md:col-span-5">
              {/* Studio Workspace Atmosphere */}
              <div className="rounded-2xl border border-amber-500/30 bg-[#11131A] p-5 shadow-2xl space-y-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-mono text-[10px] text-amber-400 block mb-1">01 / INCEPTION</span>
                  <span className="text-xs font-semibold text-white block">From Idea to Prototype</span>
                  <span className="text-[11px] text-white/50">Transforming blank thoughts into working reality.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-mono text-[10px] text-amber-400 block mb-1">02 / RESILIENCE</span>
                  <span className="text-xs font-semibold text-white block">Patient Foundation</span>
                  <span className="text-[11px] text-white/50">Building steadily through hard work and iteration.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-mono text-[10px] text-amber-400 block mb-1">03 / VALUE</span>
                  <span className="text-xs font-semibold text-white block">Meaningful Purpose</span>
                  <span className="text-[11px] text-white/50">Empowering others through enduring solutions.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 06: WHERE ART MEETS TECHNOLOGY */}
        <section
          id="creative-06"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-r from-[#ffb547]/[0.05] via-[#11131A] to-sky-500/[0.05] relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D6AD62] font-bold">
              CHAPTER 06
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">✨</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-6">
            WHERE ART MEETS TECHNOLOGY.
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans mb-8">
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
              Painting and Artificial Intelligence may appear to belong to two different worlds.
            </p>
            <p className="font-serif italic text-lg text-[#ffb547]">
              &ldquo;But for me, they share something important: imagination.&rdquo;
            </p>
          </div>

          {/* Three Dimensional Synthesis Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="p-6 rounded-2xl border border-[#ffb547]/30 bg-gradient-to-b from-[#ffb547]/10 to-transparent">
              <span className="text-2xl block mb-2">🎨</span>
              <h4 className="font-display text-xl text-white mb-2">ART TEACHES ME</h4>
              <p className="text-xs sm:text-sm text-[#A3A6B0] leading-relaxed">
                To think creatively, experiment without fear, observe subtle nuances, and express complex emotion.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-sky-500/30 bg-gradient-to-b from-sky-500/10 to-transparent">
              <span className="text-2xl block mb-2">⚡</span>
              <h4 className="font-display text-xl text-white mb-2">TECHNOLOGY CHALLENGES ME</h4>
              <p className="text-xs sm:text-sm text-[#A3A6B0] leading-relaxed">
                To understand deep systems, explore new horizons, and transform ideas into practical outcomes.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent">
              <span className="text-2xl block mb-2">🚀</span>
              <h4 className="font-display text-xl text-white mb-2">ENTREPRENEURSHIP UNITES</h4>
              <p className="text-xs sm:text-sm text-[#A3A6B0] leading-relaxed">
                Brings those two worlds together through the burning desire to create something genuinely meaningful.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-black/40 text-center">
            <p className="text-sm sm:text-base text-white font-serif italic">
              &ldquo;I want to keep exploring the relationship between creativity and technology. I want to remain an artist at heart while growing into the world of artificial intelligence and innovation.&rdquo;
            </p>
          </div>
        </section>

        {/* FINAL CHAPTER: THE JOURNEY IS STILL BEING CREATED */}
        <section
          id="creative-final"
          className="mb-16 scroll-mt-28 p-8 sm:p-12 rounded-3xl border border-[#ffb547]/40 bg-gradient-to-b from-[#1f1708] via-[#11131A] to-[#08090D] relative overflow-hidden shadow-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffb547]/10 border border-[#ffb547]/30 text-[#ffb547] font-mono text-xs uppercase tracking-widest mb-6">
            ✦ EPILOGUE
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-white tracking-wide mb-8">
            THE JOURNEY IS STILL BEING CREATED.
          </h2>

          <div className="max-w-2xl mx-auto space-y-4 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans mb-10 text-left">
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
              I have already filled more than a hundred canvases. But I know there are countless ideas still waiting to be explored.
            </p>
            <p>
              There are new things to learn, technologies to understand, projects to build, and dreams to pursue.
            </p>
            <p>
              I don&apos;t want creativity to become something I did only in the past. I want it to remain a part of everything I do.
            </p>

            <div className="space-y-2 pt-2">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                <span className="text-lg">🎨</span>
                <span className="text-white">The artist in me will always look for a new canvas.</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                <span className="text-lg">🧠</span>
                <span className="text-white">The curious mind in me will always look for a new possibility.</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                <span className="text-lg">🚀</span>
                <span className="text-white">And the ambitious side of me will always look for something meaningful to build.</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 text-center space-y-3 mt-8">
              <p className="font-display text-2xl sm:text-3xl text-white tracking-wider">
                I AM NOT DONE CREATING.
              </p>
              <p className="font-serif italic text-lg sm:text-xl text-[#ffb547]">
                &ldquo;MY BEST IDEAS ARE STILL WAITING TO BE DISCOVERED.&rdquo;
              </p>
              <p className="font-mono text-xs text-white/60 uppercase tracking-widest pt-2">
                — GIRIDHAR REDDY GODDILLA
              </p>
            </div>
          </div>

          {/* CREATIVE CLOSING LINE */}
          <div className="pt-6 border-t border-white/10 max-w-xl mx-auto">
            <p className="font-display text-2xl sm:text-3xl text-white tracking-widest mb-2">
              THIS IS WHAT I CAN BECOME.
            </p>
            <p className="text-xs sm:text-sm font-mono text-[#ffb547] tracking-wider uppercase">
              Inspired by imagination. Powered by curiosity. Building towards tomorrow.
            </p>
          </div>

          {/* Cross-Profile Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                playClick();
                onNavigateHome();
              }}
              className="px-6 py-3 rounded-full bg-[#E50920] text-white font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition cursor-pointer shadow-lg shadow-[#E50920]/20"
            >
              Explore Personal Profile (The Man Behind It All) →
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                onNavigateProfessional();
              }}
              className="px-6 py-3 rounded-full bg-white/[0.06] border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/[0.1] transition cursor-pointer"
            >
              View Professional Dossier (Recruiter) →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
