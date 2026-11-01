import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { playClick } from '../hooks/useSoundFX';
import { SeriesMark } from './Poster';
import HamburgerMenu, { type PageId } from './HamburgerMenu';
import PersistentPageSwitcher from './PersistentPageSwitcher';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId, targetId?: string) => void;
  onOpenResume: () => void;
  onOpenHelp: () => void;
  sound: boolean;
  onToggleSound: () => void;
  onOpenLockManager?: () => void;
  onOpenIntro?: () => void;
  onOpenProfileChooser?: () => void;
}

export default function Navbar({
  activePage,
  onNavigate,
  onOpenResume,
  onOpenHelp,
  sound,
  onToggleSound,
  onOpenLockManager,
  onOpenIntro,
  onOpenProfileChooser,
}: NavbarProps) {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  // Update background styling on scroll, but NEVER hide the navbar
  useMotionValueEvent(scrollY, 'change', (y) => {
    setSolid(y > 20);
  });

  const navLinks: { id: PageId; label: string; icon: string }[] = [
    { id: 'home', label: 'Series', icon: '🎬' },
    { id: 'creative', label: 'Creative', icon: '🎨' },
    { id: 'developer', label: 'Developer', icon: '💻' },
    { id: 'recruiter', label: 'Recruiter', icon: '👔' },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
        solid
          ? 'bg-[#0A0C10]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/60'
          : 'bg-gradient-to-b from-[#0A0C10]/95 via-[#0A0C10]/70 to-transparent border-b border-white/5'
      }`}
    >
      <div className="gutter flex h-16 items-center justify-between gap-3 sm:gap-4 md:h-[70px]">
        {/* Left Side: Hamburger Menu + Persistent Switcher + Series Mark */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* 3-Line Hamburger Menu Button & Slide-out Drawer */}
          <HamburgerMenu
            isOpen={hamburgerOpen}
            onToggle={() => setHamburgerOpen((prev) => !prev)}
            activePage={activePage}
            onNavigate={onNavigate}
            onOpenHelp={onOpenHelp}
            isSoundOn={sound}
            onToggleSound={onToggleSound}
            onOpenLockManager={onOpenLockManager}
            onOpenIntro={onOpenIntro}
            onOpenProfileChooser={onOpenProfileChooser}
          />

          {/* Persistent Page Switcher (Matching User Reference: Character Thumbnail + Gold Border + ▼) */}
          <PersistentPageSwitcher
            activePage={activePage}
            onSelectPage={(p) => onNavigate(p)}
            onOpenProfileChooser={onOpenProfileChooser}
          />

          {/* Series Mark Brand link */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-[18px] sm:text-[20px] ml-1 hidden md:inline-flex cursor-pointer hover:opacity-90 transition"
            aria-label="Return to Series Home"
          >
            <SeriesMark />
          </button>
        </div>

        {/* Center: Desktop Navigation Pills for the 4 Modes */}
        <nav className="hidden lg:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] p-1 shadow-inner backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  playClick();
                  onNavigate(link.id);
                }}
                className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wider transition cursor-pointer ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-full border border-white/15 bg-white/10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Audio FX Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={sound ? 'Mute cinematic sounds' : 'Unmute cinematic sounds'}
            title={sound ? 'Sound FX Enabled' : 'Sound FX Muted'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-xs text-white/70 transition hover:border-white/25 hover:text-white hover:bg-white/5 cursor-pointer shadow-sm"
          >
            {sound ? '🔊' : '🔇'}
          </button>

          {/* Navigation Guide / Help Button */}
          <button
            type="button"
            onClick={() => {
              playClick();
              onOpenHelp();
            }}
            aria-label="Navigation guide and keyboard shortcuts"
            title="Navigation Guide & Shortcuts [?]"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-xs font-mono font-bold text-white/70 transition hover:border-white/25 hover:text-white hover:bg-white/5 cursor-pointer shadow-sm"
          >
            ?
          </button>

          {/* Quick Resume Button */}
          <button
            type="button"
            onClick={() => {
              playClick();
              onOpenResume();
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:border-white/30 hover:bg-white/10 cursor-pointer shadow-sm"
          >
            <span className="text-sm">📄</span>
            <span className="hidden xs:inline">Resume</span>
          </button>

          {/* Quick Contact Button */}
          <button
            type="button"
            onClick={() => onNavigate('home', 'contact')}
            className="rounded-xl border border-[#E50920]/60 bg-[#E50920]/20 px-3.5 py-1.5 text-xs font-bold tracking-wider text-[#ff4d64] transition hover:bg-[#E50920]/30 hover:border-[#E50920] cursor-pointer shadow-sm"
          >
            CONTACT
          </button>
        </div>
      </div>
    </header>
  );
}
