import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { characterAssets } from '../data/portfolio';
import { playClick } from '../hooks/useSoundFX';
import { getProfileLockState } from '../services/lockManager';

export type PageId = 'home' | 'creative' | 'developer' | 'recruiter';

interface PersistentPageSwitcherProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  onOpenProfileChooser?: () => void;
}

export default function PersistentPageSwitcher({
  activePage,
  onSelectPage,
  onOpenProfileChooser,
}: PersistentPageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: Event) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const pages: { id: PageId; name: string; tag: string; icon: string; desc: string; color: string }[] = [
    {
      id: 'home',
      name: 'Home',
      tag: 'THE SERIES',
      icon: '🎬',
      desc: 'Cinematic episodic narrative & flagship projects',
      color: '#E50920',
    },
    {
      id: 'creative',
      name: 'Creative',
      tag: 'ART & STORY',
      icon: '🎨',
      desc: 'Design philosophy, visual identity & editorial narrative',
      color: '#ffb547',
    },
    {
      id: 'developer',
      name: 'Developer',
      tag: 'CODE & ML',
      icon: '💻',
      desc: 'Production ML, PySpark big data & GitHub repositories',
      color: '#46e3a8',
    },
    {
      id: 'recruiter',
      name: 'Recruiter',
      tag: 'EXECUTIVE DOSSIER',
      icon: '👔',
      desc: 'High-density candidate profile & 1-click resume download',
      color: '#38bdf8',
    },
  ];

  const currentPage = pages.find((p) => p.id === activePage) ?? pages[0];

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* 
        Persistent Switcher Control:
        Direct visual match to uploaded reference screenshot:
        Small rounded-square character thumbnail + gold border + downward triangle arrow ▼
      */}
      <button
        type="button"
        onClick={() => {
          playClick();
          setIsOpen((prev) => !prev);
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Current page: ${currentPage.name}. Click to switch page`}
        className="group flex items-center gap-2 p-1 pl-1 pr-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition cursor-pointer shadow-sm"
      >
        {/* Small thumbnail with gold border (from reference screenshot) */}
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border-[1.5px] border-[#D6AD62]/80 bg-[#11131A] shadow shrink-0">
          <img
            src={characterAssets.thumbnail.src}
            alt={characterAssets.thumbnail.alt}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
          />
        </div>

        {/* Current Page Tag & Downward Triangle Arrow */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold tracking-wider text-white hidden xs:inline">
            {currentPage.name.toUpperCase()}
          </span>
          <span
            className={`text-[9px] text-[#A3A6B0] group-hover:text-white transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            ▼
          </span>
        </div>
      </button>

      {/* Floating Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-12 z-50 w-72 max-w-[calc(100vw-24px)] origin-top-left rounded-2xl border border-white/15 bg-[#11131A]/95 p-2 shadow-2xl backdrop-blur-2xl"
          >
            <div className="px-3 py-2 border-b border-white/5 mb-1 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#D6AD62]">
                SELECT EXPERIENCE
              </span>
              <span className="text-[10px] text-white/40 font-mono">4 PAGES</span>
            </div>

            <div className="space-y-1">
              {pages.map((p) => {
                const isSelected = activePage === p.id;
                const mappedProfileId = p.id === 'home' ? 'giridhar' : p.id;
                const lockState = getProfileLockState(mappedProfileId);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      onSelectPage(p.id);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition cursor-pointer ${
                      isSelected
                        ? 'border border-white/15 bg-white/10 shadow-sm'
                        : 'border border-transparent hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xl mt-0.5">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{p.name}</span>
                          {lockState.isLocked && (
                            <span className="text-[10px]" title="Password protected">
                              🔒
                            </span>
                          )}
                        </div>
                        <span
                          className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded"
                          style={{
                            color: p.color,
                            backgroundColor: `${p.color}18`,
                          }}
                        >
                          {p.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A3A6B0] mt-0.5 leading-snug truncate">
                        {p.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {onOpenProfileChooser && (
              <div className="mt-1.5 pt-1.5 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onOpenProfileChooser();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/5 transition"
                >
                  <span className="flex items-center gap-2">
                    <span>👥</span>
                    <span>All 4 Profiles (Chooser)</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#D6AD62]">Switch</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
