import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { type ProfileId, type Project } from './data/portfolio';
import { SmoothScrollProvider, useSmoothScroll } from './hooks/smoothScroll';
import OpeningSequence from './components/OpeningSequence';
import ProfileSelector from './components/ProfileSelector';
import Navbar from './components/Navbar';
import type { PageId } from './components/HamburgerMenu';
import NavigationGuideModal from './components/NavigationGuideModal';
import PasswordGateModal from './components/PasswordGateModal';
import ProfileLockManagerModal from './components/ProfileLockManagerModal';
import { EASE } from './components/fx';
import { isSoundEnabled, playClick, setSoundEnabled } from './hooks/useSoundFX';
import {
  syncProfileLockStates,
  verifyServerProfileAccess,
} from './services/lockManager';

// Profile experiences & overlays are code-split and loaded ONLY after server authorization
const PersonalPage = lazy(() => import('./components/PersonalPage'));
const RecruiterDossier = lazy(() => import('./components/RecruiterDossier'));
const CreativePage = lazy(() => import('./components/CreativePage'));
const PlayIntro = lazy(() => import('./components/PlayIntro'));
const ProjectModal = lazy(() => import('./components/ProjectModal'));
const ResumeModal = lazy(() => import('./components/ResumeModal'));

type Stage = 'opening' | 'profiles' | 'home';

function profileToPage(profileId: ProfileId): PageId {
  if (profileId === 'recruiter') return 'recruiter';
  if (profileId === 'creative') return 'creative';
  return 'home';
}

function pageToProfile(pageId: PageId): ProfileId {
  if (pageId === 'recruiter') return 'recruiter';
  if (pageId === 'creative') return 'creative';
  return 'giridhar';
}

function getHashTargetProfile(): ProfileId | null {
  try {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'professional' || hash === 'recruiter') return 'recruiter';
    if (hash === 'creative') return 'creative';
    if (hash === 'personal' || hash === 'series' || hash === 'home') return 'giridhar';
  } catch {
    /* window unavailable */
  }
  return null;
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <Series />
    </SmoothScrollProvider>
  );
}

function Series() {
  // Always start on 'profiles' until server-side access check authorizes any direct hash target
  const [stage, setStage] = useState<Stage>('profiles');
  const [profileId, setProfileId] = useState<ProfileId>('giridhar');
  const [activePage, setActivePage] = useState<PageId>('home');
  const [checkingAccess, setCheckingAccess] = useState<boolean>(() => Boolean(getHashTargetProfile()));

  const [playing, setPlaying] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [lockManagerOpen, setLockManagerOpen] = useState(false);
  const [pendingLockedProfile, setPendingLockedProfile] = useState<ProfileId | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [sound, setSound] = useState(isSoundEnabled());

  const { lock, unlock } = useSmoothScroll();

  useEffect(() => {
    if (stage === 'home') return;
    lock();
    return unlock;
  }, [stage, lock, unlock]);

  useEffect(() => {
    if (stage === 'profiles') {
      document.title = 'Giridhar Reddy Goddilla | The Journey';
    } else if (activePage === 'home') {
      document.title = 'Giridhar Reddy Goddilla | The Man Behind It All';
    } else if (activePage === 'creative') {
      document.title = 'Giridhar Reddy Goddilla | The Mind That Creates';
    } else if (activePage === 'recruiter') {
      document.title = 'Giridhar Reddy Goddilla | Professional Profile';
    }
  }, [stage, activePage]);

  const toggleSound = useCallback(() => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
    if (next) playClick();
  }, [sound]);

  // Synchronize global lock states from persistent backend + protect direct URL loads
  useEffect(() => {
    let active = true;

    const initSecurity = async () => {
      await syncProfileLockStates();
      const hashTarget = getHashTargetProfile();
      if (!active) return;

      if (hashTarget) {
        const access = await verifyServerProfileAccess(hashTarget);
        if (!active) return;

        if (access.authorized) {
          setProfileId(hashTarget);
          setActivePage(profileToPage(hashTarget));
          setStage('home');
        } else {
          // Direct URL to a locked profile cannot bypass protection
          setStage('profiles');
          setPendingLockedProfile(hashTarget);
        }
      }
      setCheckingAccess(false);
    };

    initSecurity();

    const handleFocusSync = () => {
      syncProfileLockStates();
    };
    window.addEventListener('focus', handleFocusSync);
    return () => {
      active = false;
      window.removeEventListener('focus', handleFocusSync);
    };
  }, []);

  // Server-enforced navigation between the 3 primary profiles with history support
  const handleNavigate = useCallback(
    async (page: PageId, targetId?: string, pushHistory = true) => {
      const pId = pageToProfile(page);

      const access = await verifyServerProfileAccess(pId);
      if (!access.authorized) {
        setPendingLockedProfile(pId);
        return;
      }

      setActivePage(page);
      setProfileId(pId);

      try {
        if (pushHistory) {
          const hash = page === 'home' ? 'personal' : page === 'recruiter' ? 'professional' : page;
          window.history.pushState({ page, pId }, '', `#${hash}`);
        }
      } catch {
        /* history unavailable */
      }

      if (stage !== 'home') {
        setStage('home');
      }

      if (page === 'home' && targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    },
    [stage],
  );

  // Profile picker with server-side lock check
  const attemptPickProfile = useCallback(async (id: ProfileId) => {
    const access = await verifyServerProfileAccess(id);
    if (!access.authorized) {
      setPendingLockedProfile(id);
      return;
    }

    setProfileId(id);
    const targetPage = profileToPage(id);
    setActivePage(targetPage);

    try {
      const hash = targetPage === 'home' ? 'personal' : targetPage === 'recruiter' ? 'professional' : targetPage;
      window.history.pushState({ page: targetPage, id }, '', `#${hash}`);
    } catch {
      /* history unavailable */
    }

    window.scrollTo(0, 0);
    setStage('home');
  }, []);

  // Return to Profile Chooser
  const openProfileChooser = useCallback(() => {
    try {
      window.history.pushState({ stage: 'profiles' }, '', '#profiles');
    } catch {
      /* history unavailable */
    }
    window.scrollTo(0, 0);
    syncProfileLockStates();
    setStage('profiles');
  }, []);

  // Listen to browser Back / Forward buttons (popstate) with server verification
  useEffect(() => {
    const handlePopState = () => {
      const target = getHashTargetProfile();
      if (!target) {
        syncProfileLockStates();
        setStage('profiles');
      } else {
        handleNavigate(profileToPage(target), undefined, false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleNavigate]);

  // Global physical keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Never intercept keystrokes with modifier keys (Ctrl+C, Cmd+C, Ctrl+V, etc.)
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        playClick();
        handleNavigate('recruiter');
      } else if (e.key === 'h' || e.key === 'H') {
        playClick();
        handleNavigate('home');
      } else if (e.key === 'm' || e.key === 'M') {
        toggleSound();
      } else if (e.key === '?') {
        playClick();
        setHelpOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigate, toggleSound]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const closeIntro = useCallback(() => setPlaying(false), []);
  const closeProject = useCallback(() => setProject(null), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);
  const closeHelp = useCallback(() => setHelpOpen(false), []);

  return (
    <LayoutGroup>
      <div className="grain" aria-hidden />

      {/* Opening sequence is optional; triggered explicitly via Watch Cinematic Intro */}
      <AnimatePresence>
        {stage === 'opening' && (
          <OpeningSequence key="opening" onDone={() => setStage('profiles')} />
        )}
      </AnimatePresence>

      {/* Root First Screen: Three-Profile Selector (suppressed briefly only while verifying a direct hash URL) */}
      <AnimatePresence>
        {stage === 'profiles' && !checkingAccess && (
          <ProfileSelector
            key="profiles"
            onPick={attemptPickProfile}
            onWatchIntro={() => setStage('opening')}
            onOpenLockManager={() => setLockManagerOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Main Experience View — Mounted & Code-Split ONLY AFTER Server Authorization */}
      {stage === 'home' && (
        <motion.div
          initial={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <Navbar
            activePage={activePage}
            onNavigate={handleNavigate}
            onOpenResume={() => setResumeOpen(true)}
            onOpenHelp={() => setHelpOpen(true)}
            sound={sound}
            onToggleSound={toggleSound}
            onOpenLockManager={() => setLockManagerOpen(true)}
            onOpenIntro={() => setStage('opening')}
            onOpenProfileChooser={openProfileChooser}
          />

          <Suspense
            fallback={
              <div className="min-h-screen bg-[#08090D] flex items-center justify-center text-xs font-mono text-white/40">
                Loading experience...
              </div>
            }
          >
            {/* Profile 1: PERSONAL — Cinematic Digital Autobiography */}
            {activePage === 'home' && (
              <main>
                <PersonalPage
                  profileId={profileId}
                  onNavigateProfessional={() => handleNavigate('recruiter')}
                  onNavigateCreative={() => handleNavigate('creative')}
                  onOpenProfileChooser={openProfileChooser}
                  onOpenResume={() => setResumeOpen(true)}
                />
              </main>
            )}

            {/* Profile 2: PROFESSIONAL — 100% UNTOUCHED & STRICTLY PROTECTED */}
            {activePage === 'recruiter' && (
              <RecruiterDossier
                onSelectProject={setProject}
                onOpenResumeModal={() => setResumeOpen(true)}
                onSwitchToCinematic={() => handleNavigate('home')}
              />
            )}

            {/* Profile 3: CREATIVE — 100+ Painting Gallery & AI Innovation Studio */}
            {activePage === 'creative' && (
              <CreativePage
                onSelectProject={setProject}
                onNavigateHome={() => handleNavigate('home')}
                onNavigateProfessional={() => handleNavigate('recruiter')}
                onOpenProfileChooser={openProfileChooser}
              />
            )}
          </Suspense>
        </motion.div>
      )}

      {/* Visitor Password Gate for Server-Locked Profiles */}
      <PasswordGateModal
        profileId={pendingLockedProfile}
        onSuccess={(unlockedId) => {
          setPendingLockedProfile(null);
          attemptPickProfile(unlockedId);
        }}
        onCancel={() => {
          setPendingLockedProfile(null);
        }}
      />

      {/* Owner-Only Security Manager Modal */}
      <ProfileLockManagerModal
        isOpen={lockManagerOpen}
        onClose={() => setLockManagerOpen(false)}
        onLockStateChange={() => {
          syncProfileLockStates();
          setToast('Security configuration synchronized.');
        }}
      />

      {/* Overlays and Modals */}
      <Suspense fallback={null}>
        <AnimatePresence>{playing && <PlayIntro key="intro" onClose={closeIntro} />}</AnimatePresence>
        <AnimatePresence>
          {project && <ProjectModal key="project" project={project} onClose={closeProject} onSwitch={setProject} />}
        </AnimatePresence>
        <AnimatePresence>{resumeOpen && <ResumeModal key="resume" onClose={closeResume} />}</AnimatePresence>
      </Suspense>

      <NavigationGuideModal isOpen={helpOpen} onClose={closeHelp} />

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="glass fixed bottom-6 left-1/2 z-[150] w-[min(92vw,420px)] -translate-x-1/2 rounded-xl px-5 py-3 text-center text-xs sm:text-sm text-bone shadow-2xl border border-white/15"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
