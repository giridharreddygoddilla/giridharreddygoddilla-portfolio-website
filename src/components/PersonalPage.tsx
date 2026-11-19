import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { characterAssets } from '../data/portfolio';
import { playClick } from '../hooks/useSoundFX';
import { EASE } from './fx';

import type { ProfileId } from '../data/portfolio';

interface PersonalPageProps {
  profileId?: ProfileId;
  onNavigateProfessional: () => void;
  onNavigateCreative: () => void;
  onOpenProfileChooser?: () => void;
  onOpenResume?: () => void;
}

interface ChapterNav {
  id: string;
  num: string;
  title: string;
  icon: string;
}

const chapters: ChapterNav[] = [
  { id: 'chapter-01', num: '01', title: 'Roots That Never Fade', icon: '🌾' },
  { id: 'chapter-02', num: '02', title: 'Faith That Guides Me', icon: '🪔' },
  { id: 'chapter-03', num: '03', title: 'Mindset Refuses to Give Up', icon: '⚔️' },
  { id: 'chapter-04', num: '04', title: 'The Game Is More Than A Game', icon: '🏏' },
  { id: 'chapter-05', num: '05', title: 'The Freedom of Two Wheels', icon: '🏍️' },
  { id: 'chapter-06', num: '06', title: 'Love for the Open Road', icon: '🚗' },
  { id: 'chapter-07', num: '07', title: 'Discipline Is A Lifestyle', icon: '💪' },
  { id: 'chapter-08', num: '08', title: 'The Little Things', icon: '⌚' },
  { id: 'chapter-final', num: '✦', title: 'One Life. Countless Experiences', icon: '✨' },
];

export default function PersonalPage({
  onNavigateProfessional,
  onNavigateCreative,
  onOpenProfileChooser,
}: PersonalPageProps) {
  const [activeChapter, setActiveChapter] = useState<string>('chapter-01');
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<'re350' | 'ns200'>('re350');

  useEffect(() => {
    document.title = 'Giridhar Reddy Goddilla | The Man Behind It All';
  }, []);

  // Update active chapter indicator on scroll
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

  return (
    <div className="relative min-h-screen bg-[#08090D] text-[#F5F5F5] selection:bg-[#E50920] selection:text-white">
      {/* Background ambient documentary lighting */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, #E5092025, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 70%, #D6AD6218, transparent 70%)',
        }}
        aria-hidden
      />

      {/* Sticky Top Chapter Progress Strip */}
      <div className="sticky top-16 md:top-[70px] z-40 bg-[#0A0C10]/90 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto rail">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E50920] animate-pulse" />
            <span className="uppercase tracking-wider text-white/70">AUTOBIOGRAPHY</span>
            <span className="text-white/30">•</span>
            <span className="text-[#D6AD62] font-semibold">9 CHAPTERS</span>
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
                      ? 'bg-[#E50920] text-white font-bold shadow-lg shadow-[#E50920]/30 scale-105'
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
                onNavigateProfessional();
              }}
              className="px-2.5 py-0.5 rounded border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/20 transition cursor-pointer"
            >
              Professional (Recruiter) →
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                onNavigateCreative();
              }}
              className="px-2.5 py-0.5 rounded border border-[#ffb547]/30 bg-[#ffb547]/10 text-[#ffb547] hover:bg-[#ffb547]/20 transition cursor-pointer"
            >
              Creative →
            </button>
          </div>
        </div>

        {/* HERO HEADER: THE MAN BEHIND IT ALL */}
        <header className="mb-20 sm:mb-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E50920]/40 bg-[#E50920]/10 text-[#E50920] font-mono text-xs uppercase tracking-widest mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E50920] animate-ping" />
            PERSONAL IDENTITY & AUTOBIOGRAPHY
          </div>

          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight text-white leading-none mb-4">
            THE MAN BEHIND IT ALL.
          </h1>

          <p className="font-mono text-xs sm:text-sm tracking-widest text-[#D6AD62] font-semibold uppercase mb-10 max-w-2xl mx-auto">
            ROOTED IN TRADITION. BUILT BY PASSION. DRIVEN BY PURPOSE.
          </p>

          {/* Signature Character Visual */}
          <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-3xl overflow-hidden ring-2 ring-[#E50920]/40 shadow-2xl shadow-[#E50920]/20 mb-10 bg-[#11131A]">
            <img
              src={characterAssets.hero.src}
              alt="Giridhar Reddy Goddilla - Personal Character Portrait"
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-2 inset-x-0 text-center">
              <span className="font-mono text-[10px] tracking-wider uppercase text-white/80 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                GIRIDHAR REDDY GODDILLA
              </span>
            </div>
          </div>

          {/* Introduction Quote Box */}
          <div className="relative max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl text-left">
            <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#08090D] border border-white/15 text-[11px] font-mono text-white/50">
              PROLOGUE
            </div>
            <p className="text-lg sm:text-xl font-medium text-white leading-relaxed mb-4">
              I am <span className="text-[#D6AD62]">Giridhar Reddy Goddilla</span>.
            </p>
            <p className="text-sm sm:text-base text-[#A3A6B0] leading-relaxed mb-4">
              A person with a simple heart, a restless spirit, a strong belief in himself, and an endless curiosity about life.
            </p>
            <p className="text-sm sm:text-base text-[#A3A6B0] leading-relaxed mb-4">
              I believe that a person&apos;s identity is not defined by just what they achieve, but also by what they believe in, where they come from, what they love, and how they choose to live.
            </p>
            <p className="text-sm sm:text-base text-[#A3A6B0] leading-relaxed mb-4">
              My journey is a combination of tradition and ambition, adventure and peace, discipline and freedom.
            </p>
            <p className="font-serif italic text-lg text-[#F5F5F5] border-l-2 border-[#E50920] pl-4 mt-6">
              &ldquo;This is my personal world.&rdquo;
            </p>
          </div>
        </header>

        {/* CHAPTER 01: ROOTS THAT NEVER FADE */}
        <section
          id="chapter-01"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D6AD62] font-bold">
              CHAPTER 01
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">🌾</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-6">
            ROOTS THAT NEVER FADE.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans">
              <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                No matter how far life takes me, I will always have a special place in my heart for village life.
              </p>
              <p>
                There is something beautiful about the simplicity of the countryside — the open fields, fresh air, peaceful surroundings, familiar faces, and the feeling of belonging.
              </p>
              <p>
                I love the beauty of a life that doesn&apos;t always need to be complicated.
              </p>
              <p>
                For me, village life represents something more than a place. It represents my roots, my connection to simplicity, and the values I never want to lose.
              </p>
              <div className="p-4 rounded-xl border border-[#D6AD62]/20 bg-[#D6AD62]/5 text-[#D6AD62] font-serif italic text-base sm:text-lg">
                &ldquo;I believe that no matter how high we climb, we should never forget where we started.&rdquo;
              </div>
            </div>

            <div className="md:col-span-5">
              {/* Illustrative Countryside Card */}
              <div className="rounded-2xl border border-white/10 bg-[#11131A] p-5 shadow-2xl relative overflow-hidden">
                <div className="h-44 sm:h-52 rounded-xl bg-gradient-to-br from-[#1a3826] via-[#102219] to-[#0A0C10] flex flex-col justify-end p-5 relative overflow-hidden border border-emerald-500/20">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4ade80_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative z-10">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] uppercase tracking-wider mb-2">
                      Rural Serenity
                    </span>
                    <h3 className="font-display text-xl text-white">The Open Fields & Simplicity</h3>
                    <p className="text-xs text-white/70 font-sans mt-1">
                      Unfiltered air, golden harvests, calm roads, and grounded humility.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="block text-white/40 text-[10px]">ATMOSPHERE</span>
                    <span className="text-white font-medium">Peaceful & Pure</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="block text-white/40 text-[10px]">CORE VALUE</span>
                    <span className="text-[#D6AD62] font-medium">Grounded Roots</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 02: FAITH THAT GUIDES ME */}
        <section
          id="chapter-02"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-[#D6AD62]/[0.04] to-transparent relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D6AD62] font-bold">
              CHAPTER 02
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">🪔</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-6">
            FAITH THAT GUIDES ME.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 order-2 md:order-1">
              {/* Devotional Ambiance Card */}
              <div className="rounded-2xl border border-[#D6AD62]/20 bg-[#11131A] p-5 shadow-2xl relative overflow-hidden">
                <div className="h-44 sm:h-52 rounded-xl bg-gradient-to-br from-[#3b240a] via-[#1f1305] to-[#0A0C10] flex flex-col justify-end p-5 relative overflow-hidden border border-[#D6AD62]/30">
                  <div className="absolute top-4 right-4 text-3xl opacity-80 animate-pulse">🪔</div>
                  <div className="relative z-10">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-[#D6AD62]/40 text-[#D6AD62] font-mono text-[10px] uppercase tracking-wider mb-2">
                      Spiritual Devotion
                    </span>
                    <h3 className="font-display text-xl text-white">Sacred Traditions & Inner Strength</h3>
                    <p className="text-xs text-white/70 font-sans mt-1">
                      Warm diya light, sacred temple echoes, reflective silence, and gratitude.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="block text-white/40 text-[10px]">ANCHOR</span>
                    <span className="text-white font-medium">Inner Peace</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="block text-white/40 text-[10px]">FOUNDATION</span>
                    <span className="text-[#D6AD62] font-medium">Hindu Values</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 order-1 md:order-2 space-y-4 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans">
              <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                My Hindu identity and devotion are an important part of who I am.
              </p>
              <p>
                Faith gives me a sense of connection, strength, gratitude, and inner peace.
              </p>
              <p>
                I believe in keeping my values close, respecting traditions, and finding strength in devotion.
              </p>
              <p>
                In a world that never stops moving, spirituality reminds me to pause, reflect, and remain grounded.
              </p>
              <p className="border-l-2 border-[#D6AD62] pl-4 text-white italic">
                My beliefs are personal, and they are a meaningful part of my journey.
              </p>
            </div>
          </div>
        </section>

        {/* CHAPTER 03: A MINDSET THAT REFUSES TO GIVE UP */}
        <section
          id="chapter-03"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-[#E50920]/20 bg-gradient-to-b from-[#E50920]/[0.05] to-transparent relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#E50920] font-bold">
              CHAPTER 03
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">⚔️</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-6">
            A MINDSET THAT REFUSES TO GIVE UP.
          </h2>

          <div className="max-w-3xl space-y-5 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans">
            <p className="text-white font-mono text-xs tracking-widest uppercase">
              I have always believed in one thing:
            </p>
            <div className="font-display text-4xl sm:text-6xl text-[#E50920] tracking-wide">
              NEVER GIVE UP.
            </div>

            <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
              I see myself as a warrior — not because life is always easy, but because I believe in continuing even when things become difficult.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <span className="text-xs font-mono text-[#D6AD62] block mb-1">01 / CHALLENGE</span>
                <p className="text-xs sm:text-sm text-white font-medium">Every challenge is an opportunity to become stronger.</p>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <span className="text-xs font-mono text-[#D6AD62] block mb-1">02 / SETBACK</span>
                <p className="text-xs sm:text-sm text-white font-medium">Every setback is a reason to learn.</p>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <span className="text-xs font-mono text-[#D6AD62] block mb-1">03 / NEW DAY</span>
                <p className="text-xs sm:text-sm text-white font-medium">Every new day is another opportunity to move forward.</p>
              </div>
            </div>

            <p>
              I believe in myself, my dreams, and the possibilities that lie ahead.
            </p>
            <p className="text-white font-medium">
              I would rather keep trying, keep learning, and keep growing than give up on something that matters to me.
            </p>
          </div>
        </section>

        {/* CHAPTER 04: THE GAME IS MORE THAN A GAME */}
        <section
          id="chapter-04"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D6AD62] font-bold">
              CHAPTER 04
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">🏏</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-6">
            THE GAME IS MORE THAN A GAME.
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans mb-8">
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
              Sports have a special place in my life.
            </p>
            <p>
              Cricket is not just a sport I enjoy watching. It is something I genuinely love.
            </p>
          </div>

          {/* Featured Cards: Virat Kohli & RCB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* VIRAT KOHLI FEATURE */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-[#11131A] to-[#0A0C10] p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] tracking-wider uppercase font-bold">
                  ICON OF INSPIRATION
                </span>
                <span className="text-2xl">👑</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide mb-2">
                VIRAT KOHLI
              </h3>
              <p className="text-sm text-[#A3A6B0] leading-relaxed mb-4">
                And when it comes to cricket, there is one name I admire with all my heart — <span className="text-white font-semibold">VIRAT KOHLI</span>.
              </p>
              <p className="text-xs sm:text-sm text-[#D6AD62] leading-relaxed italic border-l-2 border-[#D6AD62] pl-3">
                &ldquo;His passion, intensity, determination, discipline, and refusal to surrender inspire me.&rdquo;
              </p>
            </div>

            {/* RCB FEATURE */}
            <div className="rounded-2xl border border-[#E50920]/40 bg-gradient-to-br from-[#E50920]/20 via-[#11131A] to-[#0A0C10] p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E50920]/30 text-red-200 border border-[#E50920]/50 font-mono text-[10px] tracking-wider uppercase font-bold">
                  DIE-HARD DEVOTION
                </span>
                <span className="text-2xl">🦁</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide mb-2">
                ROYAL CHALLENGERS BENGALURU
              </h3>
              <p className="text-sm text-[#A3A6B0] leading-relaxed mb-4">
                I am a die-hard <span className="text-white font-semibold">RCB</span> fan. RCB is more than just a team I support. It is an emotion I enjoy being part of.
              </p>
              <p className="text-xs sm:text-sm text-red-200 leading-relaxed italic border-l-2 border-[#E50920] pl-3">
                &ldquo;The excitement, the atmosphere, the unforgettable moments, and the belief — that&apos;s what makes the experience special.&rdquo;
              </p>
            </div>
          </div>

          {/* Beyond Cricket: Football, Chess, F1 */}
          <div className="mt-8">
            <h4 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4">
              BEYOND CRICKET — ENERGY, MINDFULNESS & VELOCITY
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="text-2xl mb-2">⚽</div>
                <h5 className="font-display text-lg text-white mb-1">FOOTBALL</h5>
                <p className="text-xs text-[#A3A6B0] leading-relaxed">
                  Brings raw energy, team chemistry, tempo, and the electric thrill of every goal.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="text-2xl mb-2">♟️</div>
                <h5 className="font-display text-lg text-white mb-1">CHESS</h5>
                <p className="text-xs text-[#A3A6B0] leading-relaxed">
                  Challenges the mind, demands forward calculation, tactical patience, and quiet mastery.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="text-2xl mb-2">🏎️</div>
                <h5 className="font-display text-lg text-white mb-1">FORMULA 1</h5>
                <p className="text-xs text-[#A3A6B0] leading-relaxed">
                  Brings together speed, engineering precision, cutting-edge technology, and fierce competition.
                </p>
              </div>
            </div>
            <p className="font-mono text-xs text-center text-white/50 mt-4">
              Different games, different experiences, but one common feeling: <span className="text-white font-semibold">passion</span>.
            </p>
          </div>
        </section>

        {/* CHAPTER 05: THE FREEDOM OF TWO WHEELS */}
        <section
          id="chapter-05"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D6AD62] font-bold">
              CHAPTER 05
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">🏍️</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-3">
            THE FREEDOM OF TWO WHEELS.
          </h2>

          <p className="text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans mb-8">
            Motorcycles are an important part of my lifestyle. I own two motorcycles that represent different sides of my riding passion:
          </p>

          {/* Motorcycle Selector Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => {
                playClick();
                setSelectedMotorcycle('re350');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-2 ${
                selectedMotorcycle === 're350'
                  ? 'bg-[#D6AD62] text-[#08090D] shadow-lg shadow-[#D6AD62]/20'
                  : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] border border-white/10'
              }`}
            >
              <span>👑</span>
              <span>ROYAL ENFIELD 350</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClick();
                setSelectedMotorcycle('ns200');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-2 ${
                selectedMotorcycle === 'ns200'
                  ? 'bg-[#E50920] text-white shadow-lg shadow-[#E50920]/20'
                  : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] border border-white/10'
              }`}
            >
              <span>⚡</span>
              <span>BAJAJ PULSAR NS200</span>
            </button>
          </div>

          {/* Motorcycle Showcase Container */}
          <AnimatePresence mode="wait">
            {selectedMotorcycle === 're350' ? (
              <motion.div
                key="re350"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="rounded-2xl border border-[#D6AD62]/30 bg-gradient-to-br from-[#1a1508] via-[#11131A] to-[#0A0C10] p-6 sm:p-8 shadow-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6AD62]/10 border border-[#D6AD62]/30 text-[#D6AD62] font-mono text-[10px] tracking-wider uppercase font-semibold">
                      AUTHENTIC MACHINE 01 • OWNED
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl text-white tracking-wide">
                      ROYAL ENFIELD 350
                    </h3>
                    <p className="text-base text-white font-medium leading-relaxed">
                      There is something timeless about the Royal Enfield experience.
                    </p>
                    <p className="text-sm text-[#A3A6B0] leading-relaxed">
                      Its classic character, the feeling of the ride, and the connection between the road and the rider make every journey memorable.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="block text-white/40 text-[10px]">CHARACTER</span>
                        <span className="text-[#D6AD62] font-semibold">Timeless Classic Thump</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="block text-white/40 text-[10px]">EXPERIENCE</span>
                        <span className="text-white font-semibold">Soulful Road Connection</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5">
                    {/* Placeholder Frame Ready for User's Real Photo */}
                    <div className="h-56 sm:h-64 rounded-2xl border-2 border-dashed border-[#D6AD62]/40 bg-black/40 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
                      <div className="text-4xl mb-3 opacity-80 group-hover:scale-110 transition-transform">🏍️</div>
                      <span className="font-mono text-xs text-[#D6AD62] font-bold uppercase tracking-wider mb-1">
                        Giridhar&apos;s Royal Enfield 350
                      </span>
                      <p className="text-[11px] text-white/50 max-w-[200px] leading-tight">
                        Reserved frame ready for Giridhar&apos;s original motorcycle photograph
                      </p>
                      <span className="mt-3 inline-block px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[9px] font-mono text-white/60">
                        100% Truthful • No Fake Stock Imagery
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="ns200"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="rounded-2xl border border-[#E50920]/40 bg-gradient-to-br from-[#1f0a0d] via-[#11131A] to-[#0A0C10] p-6 sm:p-8 shadow-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50920]/20 border border-[#E50920]/40 text-red-300 font-mono text-[10px] tracking-wider uppercase font-semibold">
                      AUTHENTIC MACHINE 02 • OWNED
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl text-white tracking-wide">
                      BAJAJ PULSAR NS200
                    </h3>
                    <p className="text-base text-white font-medium leading-relaxed">
                      The NS200 represents another side of my motorcycle passion — energetic, sporty, and exciting.
                    </p>
                    <p className="text-sm text-[#A3A6B0] leading-relaxed">
                      Two different personalities. One common love: motorcycles.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="block text-white/40 text-[10px]">CHARACTER</span>
                        <span className="text-[#E50920] font-semibold">Aggressive Streetfighter</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="block text-white/40 text-[10px]">EXPERIENCE</span>
                        <span className="text-white font-semibold">Instant Throttle Surge</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5">
                    {/* Placeholder Frame Ready for User's Real Photo */}
                    <div className="h-56 sm:h-64 rounded-2xl border-2 border-dashed border-[#E50920]/50 bg-black/40 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
                      <div className="text-4xl mb-3 opacity-80 group-hover:scale-110 transition-transform">⚡</div>
                      <span className="font-mono text-xs text-red-300 font-bold uppercase tracking-wider mb-1">
                        Giridhar&apos;s Pulsar NS200
                      </span>
                      <p className="text-[11px] text-white/50 max-w-[200px] leading-tight">
                        Reserved frame ready for Giridhar&apos;s original motorcycle photograph
                      </p>
                      <span className="mt-3 inline-block px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[9px] font-mono text-white/60">
                        100% Truthful • No Fake Stock Imagery
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center font-serif italic text-base sm:text-lg text-[#F5F5F5] mt-8">
            &ldquo;For me, riding is about enjoying the journey, discovering places, and experiencing the freedom of the open road.&rdquo;
          </p>
        </section>

        {/* CHAPTER 06: THE LOVE FOR THE OPEN ROAD & DREAM CAR */}
        <section
          id="chapter-06"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D6AD62] font-bold">
              CHAPTER 06
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">🚗</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-6">
            THE LOVE FOR THE OPEN ROAD.
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans mb-10">
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
              Travelling and adventure bring out another side of me.
            </p>
            <p>
              I love exploring places, discovering different surroundings, experiencing new moments, and stepping outside my usual routine.
            </p>
            <p>
              I believe some memories are best created outside our comfort zones.
            </p>
            <p>
              Whether it is a road trip, an unfamiliar destination, or an unexpected adventure, I enjoy the experience of discovering something new.
            </p>
            <p>
              And when it comes to automobiles, my heart has a special place for classic machines.
            </p>
          </div>

          {/* DEDICATED DREAM CAR FEATURE: 1969 FORD MUSTANG GT FASTBACK */}
          <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-[#261505] via-[#11131A] to-[#08090D] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs tracking-wider uppercase font-bold">
                ASPIRATIONAL RETRO AUTOMOBILE • DREAM CAR
              </span>
              <span className="font-mono text-xs text-white/50">NOT CURRENTLY OWNED</span>
            </div>

            <h3 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-2">
              1969 FORD MUSTANG GT FASTBACK.
            </h3>

            <p className="text-sm sm:text-base text-[#D6AD62] leading-relaxed mb-4 font-serif italic">
              A timeless classic that represents my love for old-school automotive design and the character of retro cars.
            </p>

            <p className="text-sm text-[#A3A6B0] leading-relaxed max-w-2xl mb-6">
              I appreciate machines with history, personality, and individuality — the rumble of an American V8, the sculpted fastback roofline, and the raw soul of 1960s mechanical engineering.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="block text-white/40 text-[10px]">ERA</span>
                <span className="text-white font-semibold">1969 Vintage</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="block text-white/40 text-[10px]">SILHOUETTE</span>
                <span className="text-white font-semibold">GT Fastback</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="block text-white/40 text-[10px]">AESTHETIC</span>
                <span className="text-[#D6AD62] font-semibold">Retro Muscle</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="block text-white/40 text-[10px]">STATUS</span>
                <span className="text-amber-300 font-semibold">Lifelong Dream Car</span>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 07: DISCIPLINE IS A LIFESTYLE */}
        <section
          id="chapter-07"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D6AD62] font-bold">
              CHAPTER 07
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">💪</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-6">
            DISCIPLINE IS A LIFESTYLE.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans">
              <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                The gym is another important part of my life.
              </p>
              <p>
                I enjoy fitness, training, challenging myself, and working towards becoming stronger.
              </p>
              <p>
                For me, fitness is not just about appearance. It is about discipline, consistency, patience, and self-improvement.
              </p>
              <div className="p-4 rounded-xl border border-white/15 bg-white/[0.03] text-white font-serif italic text-base sm:text-lg">
                &ldquo;I believe that becoming stronger is a journey that happens one day at a time.&rdquo;
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-[#11131A] p-5 shadow-2xl space-y-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="font-mono text-xs text-white/50">01 / DISCIPLINE</span>
                  <span className="text-xs font-semibold text-white">Non-negotiable habit</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="font-mono text-xs text-white/50">02 / CONSISTENCY</span>
                  <span className="text-xs font-semibold text-white">Showing up every day</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="font-mono text-xs text-white/50">03 / PATIENCE</span>
                  <span className="text-xs font-semibold text-[#D6AD62]">Progress takes time</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="font-mono text-xs text-white/50">04 / FOCUS</span>
                  <span className="text-xs font-semibold text-white">Self-improvement first</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 08: THE LITTLE THINGS THAT MAKE ME ME */}
        <section
          id="chapter-08"
          className="mb-24 sm:mb-32 scroll-mt-28 p-6 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D6AD62] font-bold">
              CHAPTER 08
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xl">⌚</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide mb-6">
            THE LITTLE THINGS THAT MAKE ME ME.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {/* Watch Collecting */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#11131A] shadow-xl">
              <div className="text-3xl mb-3">⌚</div>
              <h3 className="font-display text-xl text-white mb-2">WATCH COLLECTOR</h3>
              <p className="text-xs sm:text-sm text-[#A3A6B0] leading-relaxed">
                I am a watch collector. I love the character, design, craftsmanship, and individuality of watches.
              </p>
            </div>

            {/* Solitude */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#11131A] shadow-xl">
              <div className="text-3xl mb-3">🌌</div>
              <h3 className="font-display text-xl text-white mb-2">PEACE IN SOLITUDE</h3>
              <p className="text-xs sm:text-sm text-[#A3A6B0] leading-relaxed">
                I genuinely enjoy my own company. Not every moment needs to be filled with noise. Spending time with yourself is the best way to understand yourself.
              </p>
            </div>

            {/* Family */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#11131A] shadow-xl">
              <div className="text-3xl mb-3">❤️</div>
              <h3 className="font-display text-xl text-white mb-2">FAMILY ANCHOR</h3>
              <p className="text-xs sm:text-sm text-[#A3A6B0] leading-relaxed">
                Above everything, family holds a special place in my heart. The people who make life meaningful and the connections we build are things I value deeply.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CHAPTER: ONE LIFE. COUNTLESS EXPERIENCES */}
        <section
          id="chapter-final"
          className="mb-16 scroll-mt-28 p-8 sm:p-12 rounded-3xl border border-[#D6AD62]/40 bg-gradient-to-b from-[#1c1508] via-[#11131A] to-[#08090D] relative overflow-hidden shadow-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6AD62]/10 border border-[#D6AD62]/30 text-[#D6AD62] font-mono text-xs uppercase tracking-widest mb-6">
            ✦ EPILOGUE
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-white tracking-wide mb-8">
            ONE LIFE. COUNTLESS EXPERIENCES.
          </h2>

          <div className="max-w-2xl mx-auto space-y-3 text-sm sm:text-base text-[#A3A6B0] leading-relaxed font-sans mb-10 text-left">
            <p className="text-white text-base sm:text-lg font-medium text-center mb-6">
              I am a combination of many things.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <span className="text-lg">🌾</span>
                <span>A village-life admirer with a love for adventure.</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <span className="text-lg">🪔</span>
                <span>A devotional soul with ambitious dreams.</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <span className="text-lg">🏏</span>
                <span>A cricket enthusiast who lives for Kohli and RCB.</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <span className="text-lg">🏍️</span>
                <span>A motorcycle lover with a passion for classic cars.</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <span className="text-lg">💪</span>
                <span>A gym enthusiast who believes in discipline.</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <span className="text-lg">⌚</span>
                <span>A watch collector who appreciates the little details.</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <span className="text-lg">❤️</span>
                <span>A person who loves family but also enjoys his own company.</span>
              </div>
            </div>

            <p className="pt-6 text-white text-base sm:text-lg leading-relaxed text-center font-medium">
              I don&apos;t want to live a life defined by just one interest or one identity. I want to experience, explore, learn, travel, create memories, and keep becoming a better version of myself.
            </p>

            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 text-center space-y-3 mt-8">
              <p className="font-display text-xl sm:text-2xl text-white tracking-wider">
                THIS IS NOT JUST MY PROFILE.
              </p>
              <p className="font-serif italic text-base sm:text-lg text-[#D6AD62]">
                &ldquo;THIS IS THE LIFE I LOVE, THE VALUES I CARRY, AND THE PERSON I AM BECOMING.&rdquo;
              </p>
              <p className="font-mono text-xs text-white/60 uppercase tracking-widest pt-2">
                — GIRIDHAR REDDY GODDILLA
              </p>
            </div>
          </div>

          {/* PERSONAL CLOSING LINE */}
          <div className="pt-6 border-t border-white/10 max-w-xl mx-auto">
            <p className="font-display text-2xl sm:text-3xl text-white tracking-widest mb-2">
              THIS IS WHO I AM.
            </p>
            <p className="text-xs sm:text-sm font-mono text-[#D6AD62] tracking-wider uppercase">
              Rooted in my values. Driven by my passions. Living my own story.
            </p>
          </div>

          {/* Cross-Profile Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                playClick();
                onNavigateCreative();
              }}
              className="px-6 py-3 rounded-full bg-[#ffb547] text-[#08090D] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition cursor-pointer shadow-lg shadow-[#ffb547]/20"
            >
              Explore Creative Profile (The Mind That Creates) →
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
