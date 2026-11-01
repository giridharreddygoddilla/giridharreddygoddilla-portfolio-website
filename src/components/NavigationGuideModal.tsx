import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClick } from '../hooks/useSoundFX';

interface NavigationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationGuideModal({ isOpen, onClose }: NavigationGuideModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'H', desc: 'Go to Home / The Series' },
    { key: 'D', desc: 'Go to Developer Workstation' },
    { key: 'R', desc: 'Go to Recruiter Dossier' },
    { key: 'M', desc: 'Toggle Cinematic Sound FX' },
    { key: '?', desc: 'Open this Navigation Guide' },
    { key: 'Esc', desc: 'Close open dialogs & menus' },
  ];

  const modes = [
    {
      icon: '🎬',
      title: 'Home (The Series)',
      desc: 'Cinematic streaming documentary format with narrative episodes, interactive sound, and showcase projects.',
    },
    {
      icon: '🎨',
      title: 'Creative Page',
      desc: 'Visual storytelling, character artwork, design philosophy, case studies, and editorial identity (no academic distractions).',
    },
    {
      icon: '💻',
      title: 'Developer Page',
      desc: 'Deep technical architecture, LightGBM fraud detection ML system, PySpark pipelines, interactive code tabs & live GitHub repos.',
    },
    {
      icon: '👔',
      title: 'Recruiter Dossier',
      desc: 'High-density, ATS-tailored executive dossier with hard metrics, core skills taxonomy, and one-click PDF resume download.',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25 }}
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0C0E14] p-6 sm:p-8 shadow-2xl text-white"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Guide & Keyboard Shortcuts"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#E50920]">
                NAVIGATION GUIDE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">How to Navigate This Portfolio</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                playClick();
                onClose();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
              aria-label="Close guide"
            >
              ✕
            </button>
          </div>

          {/* Section: 4 Distinct Experiences */}
          <div className="mt-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#D6AD62] mb-3">
              1. Four Tailored Experiences
            </h3>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              Use the persistent switcher at the top-left (thumbnail + ▼ arrow) or the 3-line hamburger menu to freely navigate between 4 dedicated perspectives:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {modes.map((m) => (
                <div key={m.title} className="rounded-xl border border-white/5 bg-white/[0.03] p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{m.icon}</span>
                    <span className="font-semibold text-xs sm:text-sm text-white">{m.title}</span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Keyboard Shortcuts */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#38bdf8] mb-3">
              2. Fast Keyboard Shortcuts
            </h3>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              Power users can jump instantly using physical keyboard shortcuts:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {shortcuts.map((sc) => (
                <div
                  key={sc.key}
                  className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] p-2.5"
                >
                  <kbd className="min-w-[28px] text-center font-mono text-xs font-bold px-2 py-1 rounded bg-white/10 border border-white/15 text-[#E50920]">
                    {sc.key}
                  </kbd>
                  <span className="text-[11px] text-white/80 leading-snug">{sc.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Audio Experience */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#46e3a8] mb-2">
              3. Cinematic Audio & Cursor
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Web Audio API delivers subtle tactile clicks and cinematic swells. Toggle audio anytime with the speaker icon <span className="text-white">🔊</span> in the top navigation bar or drawer.
              <br />
              Standard native operating-system cursors (arrow, hand pointer, text selection) are maintained throughout for predictable ergonomics.
            </p>
          </div>

          {/* Bottom Button */}
          <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={() => {
                playClick();
                onClose();
              }}
              className="rounded-xl bg-[#E50920] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#b80718] transition cursor-pointer"
            >
              Got It, Let&apos;s Explore
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
