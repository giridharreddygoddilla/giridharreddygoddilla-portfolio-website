import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  profile,
  education,
  experience,
  projects,
  achievements,
  certifications,
  skillCategories,
  skillEvidence,
  Project,
} from '../data/portfolio';

interface RecruiterDossierProps {
  onSelectProject: (p: Project) => void;
  onOpenResumeModal: () => void;
  onSwitchToCinematic: () => void;
}

function UniversityLogo({
  logo,
  shortCode,
  school,
}: {
  logo?: string;
  shortCode?: string;
  school: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  if (logo && !imgFailed) {
    return (
      <img
        src={logo}
        alt={`${school} logo`}
        onError={() => setImgFailed(true)}
        className="w-full h-full object-contain"
      />
    );
  }

  return (
    <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[#D6AD62] bg-[#D6AD62]/10 border border-[#D6AD62]/20 w-full h-full rounded-lg flex items-center justify-center">
      {shortCode || school.split(' ').map((w) => w[0]).join('').slice(0, 3)}
    </span>
  );
}

export default function RecruiterDossier({
  onSelectProject,
  onOpenResumeModal,
  onSwitchToCinematic,
}: RecruiterDossierProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'experience' | 'projects' | 'skills' | 'education'>('all');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <main className="relative min-h-screen bg-[#08090D] text-[#F5F5F5] pt-24 pb-28 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {/* EXECUTIVE HEADER CARD */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#181B24] via-[#11131A] to-[#08090D] p-6 sm:p-8 lg:p-11 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-[#38bdf8]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-[#E50920]/10 blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)] gap-8 lg:gap-12 items-center">
            {/* LEFT SIDE: LinkedIn & GitHub Icons Centered Above Original Photograph */}
            <div className="flex flex-col items-center">
              {/* Social Profile Icons — 12mm (~45px) horizontal spacing */}
              <div className="flex items-center justify-center gap-[45px] mb-5">
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn — Giridhar Reddy Goddilla"
                  title="LinkedIn"
                  className="group/icon relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-white/90 shadow-lg backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-[#0A66C2]/80 hover:bg-[#0A66C2]/20 hover:text-white hover:shadow-[#0A66C2]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-6 w-6 fill-current"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md border border-white/15 bg-[#0B0D14]/95 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition duration-150 group-hover/icon:opacity-100 whitespace-nowrap">
                    LinkedIn
                  </span>
                </a>

                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub — Giridhar Reddy Goddilla"
                  title="GitHub"
                  className="group/icon relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-white/90 shadow-lg backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-white/50 hover:bg-white/15 hover:text-white hover:shadow-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-6 w-6 fill-current"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md border border-white/15 bg-[#0B0D14]/95 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition duration-150 group-hover/icon:opacity-100 whitespace-nowrap">
                    GitHub
                  </span>
                </a>
              </div>

              {/* Original Uploaded Photograph */}
              <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-full lg:h-auto lg:aspect-square max-w-[300px] rounded-2xl overflow-hidden border-2 border-[#D6AD62]/45 bg-[#11131A] shadow-2xl ring-4 ring-black/40">
                <img
                  src={profile.recruiterPhoto.src}
                  alt={profile.recruiterPhoto.alt}
                  className="w-full h-full object-cover object-[50%_18%]"
                />
              </div>
            </div>

            {/* RIGHT SIDE: Large Prominent Name, Professional Title, UK Visa & Introduction */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left min-w-0">
              <h1 className="text-3xl sm:text-5xl xl:text-[52px] font-black uppercase tracking-tight leading-[1.06] text-white font-sans">
                {profile.fullName}
              </h1>

              <p className="mt-3 text-lg sm:text-xl md:text-2xl font-semibold tracking-wide text-[#D6AD62]">
                Data Analytics | MSc Data Science
              </p>

              <div className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-4 py-1.5 backdrop-blur-sm shadow-sm shadow-[#38bdf8]/10">
                <span className="h-2.5 w-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
                <span className="text-sm sm:text-base font-semibold tracking-wide text-[#E0F2FE]">
                  UK Right to Work – 2-Year Visa
                </span>
              </div>

              <p className="mt-5 text-sm sm:text-base text-[#D0D3DC] leading-relaxed max-w-3xl">
                {profile.intro}
              </p>

              {/* Location & Contact Meta */}
              <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-4 text-xs sm:text-sm text-[#A3A6B0]">
                <span className="inline-flex items-center gap-1.5 text-white/90">
                  <span className="text-red-400">📍</span>
                  <span>{profile.location}</span>
                </span>
                <span className="hidden sm:inline text-white/20">•</span>
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white transition flex items-center gap-1"
                >
                  <span>📞</span>
                  <span>{profile.phone}</span>
                </a>
                <span className="hidden sm:inline text-white/20">•</span>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="hover:text-white transition flex items-center gap-1 text-[#38bdf8] cursor-pointer"
                >
                  <span>✉️</span>
                  <span>{copiedEmail ? 'Copied to clipboard!' : profile.email}</span>
                </button>
              </div>

              {/* Professional Interests */}
              <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/80 font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              {/* Action Buttons Row */}
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 w-full">
                <a
                  href={profile.resumePdf}
                  download="Giridhar_Reddy_Goddilla_Resume_ATS.pdf"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E50920] hover:bg-[#ff2438] text-white font-bold text-xs sm:text-sm tracking-wide transition shadow-lg shadow-[#E50920]/30 cursor-pointer"
                >
                  <span>📥</span>
                  <span>Download ATS Resume (PDF)</span>
                </a>

                <a
                  href={profile.resumePremiumPdf}
                  download="Giridhar_Reddy_Goddilla_Resume_Premium.pdf"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#D6AD62]/40 bg-[#D6AD62]/10 hover:bg-[#D6AD62]/20 text-[#F3DFA6] font-semibold text-xs sm:text-sm transition cursor-pointer"
                >
                  <span>✨</span>
                  <span>Premium Visual PDF</span>
                </a>

                <button
                  type="button"
                  onClick={onOpenResumeModal}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition cursor-pointer"
                >
                  <span>👁️</span>
                  <span>Preview PDF</span>
                </button>

                <a
                  href={profile.resumeDocx}
                  download="Giridhar_Reddy_Goddilla_Resume.docx"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition"
                >
                  <span>📄</span>
                  <span>DOCX</span>
                </a>

                <button
                  type="button"
                  onClick={onSwitchToCinematic}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/10 text-[#C8CBD4] hover:text-white font-medium text-xs sm:text-sm transition cursor-pointer"
                >
                  <span>🎬</span>
                  <span>Cinematic Series</span>
                </button>
              </div>
            </div>
          </div>

          {/* 10-SECOND EXECUTIVE HIGHLIGHTS GRID */}
          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-black text-white font-mono">+14% YoY</div>
              <div className="text-[11px] font-bold text-[#E50920] uppercase tracking-wider mt-0.5">
                Sales Growth Impact
              </div>
              <div className="text-xs text-[#A3A6B0] mt-1 leading-snug">
                Product & regional analytics + ETL pipelines at FOURP Technology Solutions
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-black text-white font-mono">339K+</div>
              <div className="text-[11px] font-bold text-[#38bdf8] uppercase tracking-wider mt-0.5">
                Records Analysed
              </div>
              <div className="text-xs text-[#A3A6B0] mt-1 leading-snug">
                Food-delivery sales (197K), Uber bookings (103K) & bank loans (38.5K)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-black text-white font-mono">0.793</div>
              <div className="text-[11px] font-bold text-[#D6AD62] uppercase tracking-wider mt-0.5">
                LightGBM PR-AUC
              </div>
              <div className="text-xs text-[#A3A6B0] mt-1 leading-snug">
                MSc dissertation fraud detection (0.706 F1, 20 engineered features + TF-IDF)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-black text-white font-mono">Distinction</div>
              <div className="text-[11px] font-bold text-[#46e3a8] uppercase tracking-wider mt-0.5">
                MSc Data Science (UK)
              </div>
              <div className="text-xs text-[#A3A6B0] mt-1 leading-snug">
                Univ. of Hertfordshire MSc & LPU B.Tech CSE (Distinction) • 2-Yr UK Visa
              </div>
            </div>
          </div>
        </section>

        {/* TABBED QUICK NAVIGATION */}
        <div className="mt-8 flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
          {[
            { id: 'all', label: 'Complete Dossier' },
            { id: 'experience', label: 'Work Experience' },
            { id: 'projects', label: 'Flagship Projects' },
            { id: 'skills', label: 'Technical Skills Matrix' },
            { id: 'education', label: 'Education & Certifications' },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-[#A3A6B0] hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* WORK EXPERIENCE */}
        {(activeTab === 'all' || activeTab === 'experience') && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#E50920]">
                  Verified Work History
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Professional Experience</h2>
              </div>
              <span className="text-xs text-[#A3A6B0] font-mono">
                {experience.length} Roles • 2+ Years Analytics & Engineering
              </span>
            </div>

            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-[#181B24]/70 p-6 hover:border-white/20 transition shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                      <div className="text-sm font-medium text-[#38bdf8]">{exp.company}</div>
                    </div>
                    <div className="sm:text-right">
                      <span className="inline-block px-2.5 py-1 rounded bg-white/5 text-xs font-mono text-[#D6AD62]">
                        {exp.period}
                      </span>
                      <div className="text-xs text-[#A3A6B0] mt-1">{exp.place}</div>
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {exp.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#A3A6B0] leading-relaxed">
                        <span className="text-[#E50920] font-bold mt-1 text-xs">▸</span>
                        <span className="text-white/85">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FLAGSHIP PROJECTS */}
        {(activeTab === 'all' || activeTab === 'projects') && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#38bdf8]">
                  BI, Credit Risk & Machine Learning
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Flagship Projects & Repositories</h2>
              </div>
              <span className="text-xs text-[#A3A6B0] font-mono">{projects.length} Verified Projects</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="flex flex-col rounded-xl border border-white/10 bg-[#181B24]/70 p-5 hover:border-white/25 transition group shadow-md"
                >
                  <div className="flex items-center justify-between text-xs text-[#A3A6B0] mb-2 font-mono">
                    <span>{proj.genre.split('•')[0]}</span>
                    <span>{proj.year}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#38bdf8] transition">
                    {proj.title}
                  </h3>

                  <p className="mt-2 text-xs text-[#A3A6B0] leading-relaxed line-clamp-3">
                    {proj.logline}
                  </p>

                  {/* Metrics Badges */}
                  <div className="mt-4 grid grid-cols-2 gap-2 py-3 border-y border-white/5">
                    {proj.metrics.slice(0, 2).map((m, mIdx) => (
                      <div key={mIdx}>
                        <div className="text-sm font-bold text-white font-mono">{m.value}</div>
                        <div className="text-[10px] text-[#A3A6B0] uppercase truncate">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {proj.stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-white/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProject(proj)}
                      className="text-xs font-semibold text-[#E50920] hover:text-[#ff3d5a] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect Details</span>
                      <span>→</span>
                    </button>

                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-[#A3A6B0] hover:text-white flex items-center gap-1"
                      >
                        <span>GitHub</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TECHNICAL SKILLS MATRIX */}
        {(activeTab === 'all' || activeTab === 'skills') && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#D6AD62]">
                  Capabilities Matrix
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Technical Skills & Evidence</h2>
              </div>
              <span className="text-xs text-[#A3A6B0] font-mono">Click any skill to view verified evidence</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {skillCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-xl border border-white/10 bg-[#181B24]/60 p-5"
                >
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#38bdf8]">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-[#A3A6B0] mb-3">{cat.subtitle}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((s) => {
                      const hasEvidence = !!skillEvidence[s.name];
                      const isSelected = selectedSkill === s.name;
                      return (
                        <button
                          type="button"
                          key={s.name}
                          onClick={() => setSelectedSkill(isSelected ? null : s.name)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 text-left ${
                            isSelected
                              ? 'bg-[#E50920] text-white shadow'
                              : hasEvidence
                              ? 'bg-white/5 hover:bg-white/10 text-white/90 border border-white/10'
                              : 'bg-white/[0.03] text-white/70'
                          }`}
                        >
                          <span>{s.name}</span>
                          {s.note && (
                            <span className="text-[9px] px-1 rounded bg-white/10 text-[#D6AD62] font-mono">
                              {s.note}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Skill Evidence Callout */}
            <AnimatePresence>
              {selectedSkill && skillEvidence[selectedSkill] && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/10 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-[#38bdf8] font-bold">
                      Verified Evidence for {selectedSkill}:
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {skillEvidence[selectedSkill].map((item, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-[#08090D] text-xs text-white border border-white/10">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSkill(null)}
                    className="text-[#A3A6B0] hover:text-white text-xs cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* EDUCATION, CERTIFICATIONS & HIGHLIGHTS */}
        {(activeTab === 'all' || activeTab === 'education') && (
          <section className="mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Education */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#46e3a8]">
                  Academic Foundations
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Education</h2>

                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/10 bg-[#181B24]/70 p-5 shadow-lg transition hover:border-white/20"
                    >
                      <div className="flex items-start gap-4">
                        {/* Compact University Logo Slot with Graceful Fallback */}
                        <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-white/10 bg-[#11131A] p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                          <UniversityLogo
                            logo={(edu as any).logo}
                            shortCode={(edu as any).shortCode}
                            school={edu.school}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <h3 className="text-base font-bold text-white leading-snug">{edu.degree}</h3>
                            <span className="px-2.5 py-0.5 rounded bg-white/5 font-mono text-xs text-[#D6AD62] whitespace-nowrap self-start">
                              {edu.period}
                            </span>
                          </div>
                          <div className="text-sm text-[#38bdf8] font-semibold mt-0.5">{edu.school}</div>
                          <div className="text-xs text-[#A3A6B0] mt-0.5">
                            {edu.place} • <span className="text-[#46e3a8] font-semibold">{edu.score}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3.5 text-xs text-white/80 leading-relaxed border-t border-white/5 pt-3">
                        <strong className="text-white/50 font-mono uppercase text-[10px] block mb-1">
                          Relevant Coursework
                        </strong>
                        {edu.coursework}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Certifications & Key Impact Highlights */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#D6AD62]">
                  Verified Credentials & Impact
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-6">
                  Certifications & Highlights
                </h2>

                <div className="space-y-3 mb-6">
                  {certifications.map((cert) => (
                    <div
                      key={cert.name}
                      className="rounded-xl border border-[#D6AD62]/25 bg-[#D6AD62]/[0.06] p-4 flex items-start gap-3.5"
                    >
                      <span className="text-lg mt-0.5">🎓</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-white">{cert.name}</h3>
                          <span className="text-[10px] font-mono text-[#D6AD62] px-2 py-0.5 rounded bg-[#D6AD62]/15 uppercase shrink-0">
                            Certified
                          </span>
                        </div>
                        <div className="text-xs text-[#38bdf8] mt-0.5">{cert.issuer}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className="rounded-xl border border-white/10 bg-[#181B24]/70 p-4 flex items-start gap-3.5"
                    >
                      <span className="text-lg">🏆</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-white">{ach.title}</h3>
                          <span className="text-[10px] font-mono text-[#D6AD62] px-2 py-0.5 rounded bg-[#D6AD62]/10 uppercase shrink-0">
                            {ach.laurel}
                          </span>
                        </div>
                        <div className="text-xs text-[#38bdf8] mt-0.5">{ach.org}</div>
                        <p className="text-xs text-[#A3A6B0] mt-1 leading-snug">{ach.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* EMBEDDED RESUME DOWNLOAD SUITE */}
        <section className="mt-16 p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-[#181B24] via-[#11131A] to-[#181B24] text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E50920]">
            Complete Verified Resume Suite
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Download Official Resume Formats
          </h2>
          <p className="mt-2 text-sm text-[#A3A6B0] max-w-2xl mx-auto">
            Choose between the clean single-column ATS-friendly PDF, the executive visual PDF, or the editable Microsoft Word (DOCX) version — all containing identical verified credentials and {profile.visa}.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={profile.resumePdf}
              download="Giridhar_Reddy_Goddilla_Resume_ATS.pdf"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E50920] hover:bg-[#ff2438] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#E50920]/25 transition cursor-pointer"
            >
              <span>📥</span>
              <span>ATS-Friendly PDF</span>
            </a>

            <a
              href={profile.resumePremiumPdf}
              download="Giridhar_Reddy_Goddilla_Resume_Premium.pdf"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#D6AD62]/50 bg-[#D6AD62]/10 hover:bg-[#D6AD62]/20 text-[#F3DFA6] font-bold text-sm transition cursor-pointer"
            >
              <span>✨</span>
              <span>Premium Visual PDF</span>
            </a>

            <a
              href={profile.resumeDocx}
              download="Giridhar_Reddy_Goddilla_Resume.docx"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition cursor-pointer"
            >
              <span>📄</span>
              <span>Editable Word (DOCX)</span>
            </a>

            <button
              type="button"
              onClick={onOpenResumeModal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/10 text-white font-semibold text-sm transition cursor-pointer"
            >
              <span>🔍</span>
              <span>Interactive PDF Viewer</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
