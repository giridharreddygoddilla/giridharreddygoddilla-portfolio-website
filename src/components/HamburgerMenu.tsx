import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClick } from '../hooks/useSoundFX';

export type PageId = 'home' | 'creative' | 'developer' | 'recruiter';

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  activePage: PageId;
  onNavigate: (page: PageId, targetId?: string) => void;
  onOpenHelp: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onOpenLockManager?: () => void;
  onOpenIntro?: () => void;
  onOpenProfileChooser?: () => void;
}

export default function HamburgerMenu({
  isOpen,
  onToggle,
  activePage,
  onNavigate,
  onOpenHelp,
  isSoundOn,
  onToggleSound,
  onOpenLockManager,
  onOpenIntro,
  onOpenProfileChooser,
}: HamburgerMenuProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playClick();
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  const navItems: { id: PageId; label: string; icon: string; desc: string }[] = [
    { id: 'home', label: 'Home (Series)', icon: '🎬', desc: 'The full cinematic narrative documentary' },
    { id: 'creative', label: 'Creative', icon: '🎨', desc: 'Visual identity, design philosophy & storytelling' },
    { id: 'developer', label: 'Developer', icon: '💻', desc: 'ML pipelines, PySpark clusters & GitHub repos' },
    { id: 'recruiter', label: 'Recruiter', icon: '👔', desc: 'Executive dossier, verified facts & 1-click resume' },
  ];

  return (
    <>
      {/* Three-Line Hamburger Button */}
      <button
        type="button"
        onClick={() => {
          playClick();
          onToggle();
        }}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white hover:border-white/25 hover:bg-white/10 transition cursor-pointer"
      >
        <span
          className={`h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${
            isOpen ? 'translate-y-2 rotate-45' : ''
          }`}
        />
        <span
          className={`h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${
            isOpen ? '-translate-y-2 -rotate-45' : ''
          }`}
        />
      </button>

      {/* Slide-in Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[120]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                playClick();
                onToggle();
              }}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            />

            {/* Side Drawer Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative flex h-full w-[340px] max-w-[85vw] flex-col border-r border-white/10 bg-[#0C0E14] p-6 shadow-2xl"
              role="dialog"
              aria-label="Navigation drawer"
            >
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#E50920]">
                    NAVIGATION MENU
                  </span>
                  <div className="font-display text-2xl tracking-wide text-white">GIRIDHAR REDDY</div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onToggle();
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition cursor-pointer text-sm"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Primary Pages List */}
              <div className="mt-6 flex-1 overflow-y-auto pr-1 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-2 px-2 font-bold">
                  PRIMARY EXPERIENCES
                </span>

                {navItems.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        playClick();
                        onNavigate(item.id);
                        onToggle();
                      }}
                      className={`flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-left transition cursor-pointer ${
                        isActive
                          ? 'border border-[#E50920]/40 bg-[#E50920]/15 text-white shadow-md'
                          : 'border border-transparent text-white/75 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{item.label}</span>
                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E50920] animate-pulse" />
                          )}
                        </div>
                        <p className="truncate text-xs text-white/40 mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}

                {/* Section Shortcuts */}
                <div className="pt-4 mt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-2 px-2 font-bold">
                    QUICK SECTIONS
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      onNavigate('home', 'about');
                      onToggle();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <span>📖</span>
                    <span>About Me (The Story)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      onNavigate('home', 'originals');
                      onToggle();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <span>⭐</span>
                    <span>Featured Originals</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      onNavigate('home', 'contact');
                      onToggle();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <span>✉️</span>
                    <span>Contact / Let&apos;s Build</span>
                  </button>
                </div>

                {/* System Controls */}
                <div className="pt-4 mt-4 border-t border-white/5 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-2 px-2 font-bold">
                    CONTROLS &amp; EXPERIENCES
                  </span>

                  {onOpenProfileChooser && (
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        onOpenProfileChooser();
                        onToggle();
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>👥</span>
                        <span>All 4 Profiles (Chooser)</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#D6AD62]">Entry</span>
                    </button>
                  )}

                  {onOpenIntro && (
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        onOpenIntro();
                        onToggle();
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🎬</span>
                        <span>Watch Cinematic Intro</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#E50920]">Optional</span>
                    </button>
                  )}

                  {onOpenLockManager && (
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        onOpenLockManager();
                        onToggle();
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-white/90 hover:text-white bg-[#E50920]/10 hover:bg-[#E50920]/20 border border-[#E50920]/30 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🔐</span>
                        <span className="font-semibold text-white">PROFILE LOCK MANAGER</span>
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#E50920] text-white font-bold">
                        OWNER
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onOpenHelp();
                      onToggle();
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>💡</span>
                      <span>How to Navigate / Shortcuts</span>
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                      [?]
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onToggleSound();
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>{isSoundOn ? '🔊' : '🔇'}</span>
                      <span>Cinematic Sound Effects</span>
                    </span>
                    <span className={`text-[10px] font-bold font-mono ${isSoundOn ? 'text-[#46e3a8]' : 'text-white/40'}`}>
                      {isSoundOn ? 'ON' : 'MUTED'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Drawer Bottom Footer */}
              <div className="mt-auto border-t border-white/10 pt-4 text-[11px] text-white/40 flex items-center justify-between">
                <span>📍 Luton & London, UK</span>
                <span className="text-[#D6AD62] font-mono">MSc 2026</span>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
