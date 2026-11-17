import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import { useScrollLock } from '../hooks/smoothScroll';
import { useMedia } from '../hooks/useMedia';
import { EASE } from './fx';
import { ResumeSheet } from './ResumeViewer';

/** Full-screen PDF viewer supporting ATS-Friendly and Premium Visual versions plus DOCX download. */
export default function ResumeModal({ onClose }: { onClose: () => void }) {
  useScrollLock(true);
  const small = useMedia('(max-width: 767px)');
  const [variant, setVariant] = useState<'ats' | 'premium'>('ats');

  const activePdf = variant === 'ats' ? profile.resumePdf : profile.resumePremiumPdf;
  const activeFilename =
    variant === 'ats'
      ? 'Giridhar_Reddy_Goddilla_Resume_ATS.pdf'
      : 'Giridhar_Reddy_Goddilla_Resume_Premium.pdf';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[140] flex flex-col bg-black/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Resume"
    >
      <div className="gutter flex flex-wrap min-h-16 shrink-0 items-center justify-between gap-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          <p className="truncate font-display text-xl sm:text-2xl tracking-wide text-bone">The Screenplay &amp; Resume</p>
          <div className="hidden sm:inline-flex rounded-lg border border-white/15 bg-white/5 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setVariant('ats')}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                variant === 'ats' ? 'bg-bone text-ink' : 'text-mist hover:text-bone'
              }`}
            >
              ATS-Friendly PDF
            </button>
            <button
              type="button"
              onClick={() => setVariant('premium')}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                variant === 'premium' ? 'bg-[#D6AD62] text-ink' : 'text-mist hover:text-bone'
              }`}
            >
              Premium Visual PDF
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={activePdf}
            download={activeFilename}
            className="rounded-md bg-bone px-3.5 py-2 text-xs font-bold text-ink hover:bg-white transition"
          >
            ⤓ Download PDF
          </a>
          <a
            href={profile.resumeDocx}
            download="Giridhar_Reddy_Goddilla_Resume.docx"
            className="hidden sm:inline-flex rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-bone hover:bg-white/20 transition"
          >
            📄 DOCX
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close resume"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-bone hover:bg-white/20 cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>
      <motion.div
        className="gutter flex-1 pb-6"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {small ? (
          <div data-lenis-prevent className="h-full overflow-y-auto">
            <ResumeSheet />
            <div className="mt-4 grid grid-cols-1 gap-2">
              <a
                href={profile.resumePdf}
                target="_blank"
                rel="noreferrer"
                className="glass flex min-h-12 items-center justify-center rounded-md text-sm font-semibold text-bone"
              >
                Open ATS-Friendly PDF ↗
              </a>
              <a
                href={profile.resumePremiumPdf}
                target="_blank"
                rel="noreferrer"
                className="glass flex min-h-12 items-center justify-center rounded-md text-sm font-semibold text-[#F3DFA6]"
              >
                Open Premium Visual PDF ↗
              </a>
            </div>
          </div>
        ) : (
          <iframe
            key={activePdf}
            title={`Giridhar Reddy Goddilla resume (${variant.toUpperCase()} PDF)`}
            src={`${activePdf}#view=FitH`}
            className="h-full w-full rounded-xl bg-white"
          />
        )}
      </motion.div>
    </motion.div>
  );
}
