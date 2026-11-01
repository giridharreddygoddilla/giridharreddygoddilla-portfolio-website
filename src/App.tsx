import { lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { viewerProfiles, type ProfileId, type Project, type SectionId } from './data/portfolio';
import { SmoothScrollProvider, useSmoothScroll } from './hooks/smoothScroll';
import OpeningSequence from './components/OpeningSequence';
import ProfileSelector from './components/ProfileSelector';
import Navbar from './components/Navbar';
import type { PageId } from './components/HamburgerMenu';
import Hero from './components/Hero';
import ContinueWatching from './components/ContinueWatching';
import Scene from './components/Scene';
import About from './components/About';
import PortraitExperience from './components/PortraitExperience';
import Seasons from './components/Seasons';
import Originals from './components/Originals';
import TopPicks from './components/TopPicks';
import Skills from './components/Skills';
import Achievements from './components/Achievements';
import ResumeSection from './components/ResumeViewer';
import RecruiterDossier from './components/RecruiterDossier';
import CreativePage from './components/CreativePage';
import DeveloperPage from './components/DeveloperPage';
import NavigationGuideModal from './components/NavigationGuideModal';
import PasswordGateModal from './components/PasswordGateModal';
import ProfileLockManagerModal from './components/ProfileLockManagerModal';
import FinalCTA from './components/FinalCTA';
import { EASE } from './components/fx';
import { isSoundEnabled, playClick, setSoundEnabled } from './hooks/useSoundFX';
import { isProfileSessionUnlocked } from './services/lockManager';

// Overlays are loaded on demand
const PlayIntro = lazy(() => import('./components/PlayIntro'));
const ProjectModal = lazy(() => import('./components/ProjectModal'));
const ResumeModal = lazy(() => import('./components/ResumeModal'));

type Stage = 'opening' | 'profiles' | 'home';

const STORAGE_KEY = 'giridhar-series-profile';

function profileToPage(profileId: ProfileId): PageId {
  if (profileId === 'recruiter') return 'recruiter';
  if (profileId === 'developer') return 'developer';
  if (profileId === 'creative') return 'creative';
  return 'home';
}

function pageToProfile(pageId: PageId): ProfileId {
  if (pageId === 'recruiter') return 'recruiter';
  if (pageId === 'developer') return 'developer';
  if (pageId === 'creative') return 'creative';
  return 'giridhar';
}

function getInitialStage(): Stage {
  try {
    const hash = window.location.hash.replace('#', '');
    if (['series', 'home', 'recruiter', 'developer', 'creative'].includes(hash)) {
      return 'home';
    }
  } catch {
    /* window unavailable */
  }
  // Root URL immediately displays the four-profile selection screen
  return 'profiles';
}

function getInitialProfile(): ProfileId {
  try {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'recruiter') return 'recruiter';
    if (hash === 'developer') return 'developer';
    if (hash === 'creative') return 'creative';
  } catch {
    /* window unavailable */
  }
  return 'giridhar';
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <Series />
    </SmoothScrollProvider>
  );
}

function Series() {
  const [stage, setStage] = useState<Stage>(getInitialStage);
  const [profileId, setProfileId] = useState<ProfileId>(getInitialProfile);
  const [activePage, setActivePage] = useState<PageId>(profileToPage(getInitialProfile()));

  const [playing, setPlaying] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [lockManagerOpen, setLockManagerOpen] = useState(false);
  const [pendingLockedProfile, setPendingLockedProfile] = useState<ProfileId | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [sound, setSound] = useState(isSoundEnabled());

  const { lock, unlock } = useSmoothScroll();

  const currentProfile = viewerProfiles.find((p) => p.id === profileId) ?? viewerProfiles[0];
  const order = currentProfile.order;

  useEffect(() => {
    if (stage === 'home') return;
    lock();
    return unlock;
  }, [stage, lock, unlock]);

  const toggleSound = useCallback(() => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
    if (next) playClick();
  }, [sound]);

  // Navigate between the 4 primary experiences with history support
  const handleNavigate = useCallback(
    (page: PageId, targetId?: string, pushHistory = true) => {
      const pId = pageToProfile(page);

      // Check if target profile is locked
      if (!isProfileSessionUnlocked(pId)) {
        setPendingLockedProfile(pId);
        return;
      }

      setActivePage(page);
      setProfileId(pId);

      try {
        sessionStorage.setItem(STORAGE_KEY, pId);
        if (pushHistory) {
          const hash = page === 'home' ? 'series' : page;
          window.history.pushState({ page, pId }, '', `#${hash}`);
        }
      } catch {
        /* storage/history unavailable */
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
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    },
    [stage],
  );

  // Profile picker with lock check
  const attemptPickProfile = useCallback(
    (id: ProfileId) => {
      if (!isProfileSessionUnlocked(id)) {
        setPendingLockedProfile(id);
        return;
      }

      setProfileId(id);
      const targetPage = profileToPage(id);
      setActivePage(targetPage);

      try {
        sessionStorage.setItem(STORAGE_KEY, id);
        const hash = targetPage === 'home' ? 'series' : targetPage;
        window.history.pushState({ page: targetPage, id }, '', `#${hash}`);
      } catch {
        /* storage unavailable */
      }

      window.scrollTo(0, 0);
      setStage('home');
    },
    [],
  );

  // Return to Profile Chooser
  const openProfileChooser = useCallback(() => {
    try {
      window.history.pushState({ stage: 'profiles' }, '', '#profiles');
    } catch {
      /* history unavailable */
    }
    window.scrollTo(0, 0);
    setStage('profiles');
  }, []);

  // Listen to browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === 'profiles') {
        setStage('profiles');
      } else if (['series', 'home', 'recruiter', 'developer', 'creative'].includes(hash)) {
        const targetPage: PageId =
          hash === 'recruiter'
            ? 'recruiter'
            : hash === 'developer'
            ? 'developer'
            : hash === 'creative'
            ? 'creative'
            : 'home';
        handleNavigate(targetPage, undefined, false);
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
      } else if (e.key === 'd' || e.key === 'D') {
        playClick();
        handleNavigate('developer');
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

  const sections: Record<SectionId, ReactNode> = {
    about: <About />,
    portrait: <PortraitExperience />,
    journey: <Seasons />,
    originals: <Originals onOpen={setProject} />,
    picks: <TopPicks />,
    skills: <Skills />,
    moments: <Achievements />,
    story: <ResumeSection onView={() => setResumeOpen(true)} />,
  };

  return (
    <LayoutGroup>
      <div className="grain" aria-hidden />

      {/* Opening sequence is optional; can be triggered explicitly via Watch Intro */}
      <AnimatePresence>
        {stage === 'opening' && (
          <OpeningSequence key="opening" onDone={() => setStage('profiles')} />
        )}
      </AnimatePresence>

      {/* Root First Screen: All Four Profiles Screen */}
      <AnimatePresence>
        {stage === 'profiles' && (
          <ProfileSelector
            key="profiles"
            onPick={attemptPickProfile}
            onWatchIntro={() => setStage('opening')}
            onOpenLockManager={() => setLockManagerOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Main Experience View */}
      {stage === 'home' && (
        <motion.div
          initial={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* Persistent Navbar across all pages and scrolls */}
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

          {/* Page 1: Cinematic Series Home */}
          {activePage === 'home' && (
            <main>
              <Hero
                key={`hero-${profileId}`}
                onPlay={() => setPlaying(true)}
                onResume={() => setResumeOpen(true)}
                profileId={profileId}
                onSwitchToRecruiter={() => handleNavigate('recruiter')}
              />
              <ContinueWatching order={order} />
              {order.map((id) => (
                <Scene key={id} id={id} className={id === 'originals' ? '!py-0 sm:!py-0' : ''}>
                  {sections[id]}
                </Scene>
              ))}
              <FinalCTA
                onReplay={() => setStage('opening')}
                onSwitchToRecruiter={() => handleNavigate('recruiter')}
              />
            </main>
          )}

          {/* Page 2: Dedicated Creative Page (Manifesto, Art & Storytelling - No Education) */}
          {activePage === 'creative' && (
            <CreativePage
              onSelectProject={setProject}
              onNavigateHome={() => handleNavigate('home')}
              onNavigateDeveloper={() => handleNavigate('developer')}
            />
          )}

          {/* Page 3: Dedicated Developer Page (Workstation, ML Architecture, Code Tabs, GitHub Repos) */}
          {activePage === 'developer' && (
            <DeveloperPage
              onSelectProject={setProject}
              onNavigateHome={() => handleNavigate('home')}
              onNavigateRecruiter={() => handleNavigate('recruiter')}
            />
          )}

          {/* Page 4: Dedicated Recruiter Dossier Experience (High Density ATS, Metrics, 1-Click Resume) */}
          {activePage === 'recruiter' && (
            <RecruiterDossier
              onSelectProject={setProject}
              onOpenResumeModal={() => setResumeOpen(true)}
              onSwitchToCinematic={() => handleNavigate('home')}
            />
          )}
        </motion.div>
      )}

      {/* Visitor Password Gate for Locked Profiles */}
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

      {/* Owner Profile Lock Manager Modal */}
      <ProfileLockManagerModal
        isOpen={lockManagerOpen}
        onClose={() => setLockManagerOpen(false)}
        onLockStateChange={() => {
          // Trigger re-render to reflect updated lock badges
          setToast('Lock configuration saved successfully.');
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
