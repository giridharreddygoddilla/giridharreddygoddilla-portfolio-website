import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { sectionMeta, viewerProfiles, type ProfileId, type SectionId } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { isSoundEnabled, playClick, setSoundEnabled } from '../hooks/useSoundFX';
import { SeriesMark } from './Poster';
import { ProfileAvatar } from './ProfileSelector';
import { EASE } from './fx';

export default function Navbar({
  order,
  profileId,
  onSwitch,
}: {
  order: SectionId[];
  profileId: ProfileId;
  onSwitch: (id: ProfileId) => void;
}) {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [active, setActive] = useState<string>('top');
  const [sound, setSound] = useState(isSoundEnabled());
  const { scrollTo } = useSmoothScroll();
  const menuRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(y > 400 && y > prev && !menu && !mobileNav);
  });

  useEffect(() => {
    if (profileId === 'recruiter') return;
    const ids = ['top', ...order];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [order, profileId]);

  useEffect(() => {
    if (!menu) return;
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [menu]);

  const go = (id: string) => {
    playClick();
    setMobileNav(false);
    scrollTo(`#${id}`, { offset: id === 'top' ? 0 : -64 });
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
    if (next) playClick();
  };

  const current = viewerProfiles.find((p) => p.id === profileId)!;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[60]"
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div
        className={`gutter flex h-16 items-center justify-between gap-4 transition-[background,backdrop-filter] duration-500 md:h-[72px] ${
          solid || mobileNav ? 'bg-ink/85 backdrop-blur-xl border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="flex items-center gap-6 lg:gap-8">
          <button
            type="button"
            onClick={() => go('top')}
            className="text-[20px] sm:text-[22px] cursor-pointer"
            aria-label="Back to top"
          >
            <SeriesMark />
          </button>

          {profileId !== 'recruiter' && (
            <nav className="hidden items-center gap-5 lg:flex" aria-label="Sections">
              <NavLink label="Home" active={active === 'top'} onClick={() => go('top')} />
              {order.map((id) => (
                <NavLink key={id} label={sectionMeta[id].nav} active={active === id} onClick={() => go(id)} />
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Recruiter / Series Mode Toggle Pill */}
          {profileId === 'recruiter' ? (
            <button
              type="button"
              onClick={() => {
                playClick();
                onSwitch('giridhar');
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E50920]/40 bg-[#E50920]/15 px-3 py-1 text-xs font-semibold text-[#ff3d5a] transition hover:bg-[#E50920]/25 cursor-pointer"
            >
              <span>🎬</span>
              <span>Cinematic Series</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                playClick();
                onSwitch('recruiter');
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-3 py-1 text-xs font-semibold text-[#38bdf8] transition hover:bg-[#38bdf8]/20 cursor-pointer"
            >
              <span>👔</span>
              <span>Recruiter Dossier</span>
            </button>
          )}

          {/* Audio toggle button */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={sound ? 'Mute cinematic sounds' : 'Unmute cinematic sounds'}
            title={sound ? 'Sound FX Enabled' : 'Sound FX Muted'}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/10 text-xs text-mist transition hover:border-white/30 hover:text-bone hover:bg-white/5 cursor-pointer"
          >
            {sound ? '🔊' : '🔇'}
          </button>

          <button
            type="button"
            onClick={() => go('contact')}
            className="hidden rounded-full border border-white/15 px-3.5 py-1 text-xs font-semibold tracking-[0.12em] text-bone transition hover:border-crimson-2 hover:text-crimson-2 sm:block cursor-pointer"
          >
            CONTACT
          </button>

          {/* Profile Switcher dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                playClick();
                setMenu((m) => !m);
              }}
              aria-haspopup="menu"
              aria-expanded={menu}
              aria-label={`Viewing as ${current.name}. Switch profile`}
              className="flex items-center gap-1.5 rounded-lg p-1 hover:bg-white/5 transition cursor-pointer"
            >
              <ProfileAvatar id={profileId} size="sm" />
              <motion.span animate={{ rotate: menu ? 180 : 0 }} className="text-[9px] text-mist">
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {menu && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="absolute right-0 top-12 w-64 origin-top-right rounded-xl border border-white/10 bg-ink-2/95 p-2 shadow-2xl backdrop-blur-xl z-50"
                >
                  <p className="px-3 pb-2 pt-1 text-[10px] font-semibold tracking-[0.24em] text-smoke">
                    WHO&apos;S WATCHING?
                  </p>
                  {viewerProfiles.map((p) => (
                    <button
                      key={p.id}
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        playClick();
                        setMenu(false);
                        onSwitch(p.id);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs transition cursor-pointer ${
                        p.id === profileId ? 'bg-white/10 text-bone' : 'text-mist hover:bg-white/5 hover:text-bone'
                      }`}
                    >
                      <ProfileAvatar id={p.id} size="sm" />
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold">{p.name}</span>
                          {p.id === 'recruiter' && (
                            <span className="text-[9px] px-1 rounded bg-[#38bdf8]/20 text-[#38bdf8] font-mono">
                              Fast Track
                            </span>
                          )}
                        </div>
                        <p className="truncate text-[10px] text-smoke">{p.blurb}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger menu toggle */}
          {profileId !== 'recruiter' && (
            <button
              type="button"
              onClick={() => {
                playClick();
                setMobileNav((o) => !o);
              }}
              aria-label="Toggle navigation"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-sm text-bone lg:hidden cursor-pointer"
            >
              {mobileNav ? '✕' : '☰'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNav && profileId !== 'recruiter' && (
          <motion.nav
            aria-label="Mobile Navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-white/10 bg-ink-2/95 px-6 py-4 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => go('top')}
                className={`text-left text-sm font-semibold py-1.5 cursor-pointer ${active === 'top' ? 'text-crimson' : 'text-bone'}`}
              >
                Home
              </button>
              {order.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => go(id)}
                  className={`text-left text-sm font-semibold py-1.5 cursor-pointer ${active === id ? 'text-crimson' : 'text-mist hover:text-bone'}`}
                >
                  {sectionMeta[id].nav}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-xs font-semibold tracking-wider uppercase transition cursor-pointer ${
        active ? 'text-bone' : 'text-mist hover:text-bone'
      }`}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-crimson"
          transition={{ duration: 0.35, ease: EASE }}
        />
      )}
    </button>
  );
}
