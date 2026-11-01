import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  profile,
  education,
  experience,
  projects,
  achievements,
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
    <main className="relative min-h-screen bg-[#08090D] text-[#F5F5F5] pt-24 pb-28">
      {/* Top sticky sub-banner for recruiter mode */}
      <div className="sticky top-16 md:top-[70px] z-40 border-b border-white/10 bg-[#11131A]/95 backdrop-blur-md shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#38bdf8] animate-pulse" />
            <span className="font-mono uppercase tracking-widest text-[#38bdf8] font-bold">
              Recruiter Mode Active
            </span>
            <span className="text-[#A3A6B0] hidden md:inline">|</span>
            <span className="text-[#A3A6B0] hidden md:inline">
              High-density executive dossier for hiring managers
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={onSwitchToCinematic}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium transition cursor-pointer text-[11px] sm:text-xs"
            >
              <span>🎬</span>
              <span>Switch to Cinematic Series</span>
            </button>
            <a
              href={profile.resumePdf}
              download="Giridhar_Reddy_Goddilla_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E50920] hover:bg-[#ff2438] text-white font-semibold transition cursor-pointer shadow-md shadow-[#E50920]/25 text-[11px] sm:text-xs shrink-0"
            >
              <span>↓</span>
              <span>Download Resume PDF</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* EXECUTIVE HEADER CARD */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#181B24] via-[#11131A] to-[#08090D] p-6 sm:p-8 md:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-[#38bdf8]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-[#E50920]/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Identity and photo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-white/20 bg-[#11131A] shadow-xl">
                  <img
                    src="/assets/character/hero-portrait.webp"
                    alt={profile.fullName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-[#38bdf8] text-[#08090D] font-mono text-[10px] font-bold uppercase tracking-wider shadow">
                  UK Ready
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#D6AD62]">
                    Data Analyst & Data Scientist
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="text-xs text-[#A3A6B0]">MSc Data Science (2024–2026)</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans">
                  {profile.fullName}
                </h1>

                <p className="mt-2 text-sm sm:text-base text-[#A3A6B0] max-w-2xl leading-relaxed">
                  Specialized in Python ETL workflows, statistical modeling, machine learning classification
                  (97.32% accuracy LightGBM), and executive Power BI / Tableau dashboards. Experienced in analyzing
                  197K+ retail records and 180K+ supply chain datasets.
                </p>

                {/* Location & Contact Meta */}
                <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#A3A6B0]">
                  <span className="inline-flex items-center gap-1.5 text-white/90">
                    <span className="text-red-400">📍</span>
                    <span>Luton & London, United Kingdom (Eligible to work in UK)</span>
                  </span>
                  <span className="hidden sm:inline text-white/20">•</span>
                  <a
                    href={`tel:${profile.phone}`}
                    className="hover:text-white transition flex items-center gap-1"
                  >
                    <span>📞</span>
                    <span>{profile.phone}</span>
                  </a>
                  <span className="hidden sm:inline text-white/20">•</span>
                  <button
                    onClick={copyEmail}
                    className="hover:text-white transition flex items-center gap-1 text-[#38bdf8] cursor-pointer"
                  >
                    <span>✉️</span>
                    <span>{copiedEmail ? 'Copied to clipboard!' : profile.email}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
              <a
                href={profile.resumePdf}
                download="Giridhar_Reddy_Goddilla_Resume.pdf"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#E50920] hover:bg-[#ff2438] text-white font-bold text-sm tracking-wide transition shadow-lg shadow-[#E50920]/30 cursor-pointer"
              >
                <span>📥</span>
                <span>Download Resume (PDF)</span>
              </a>

              <button
                onClick={onOpenResumeModal}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition cursor-pointer"
              >
                <span>👁️</span>
                <span>Preview Interactive PDF</span>
              </button>

              <div className="flex items-center gap-2 w-full">
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium transition"
                >
                  <span className="text-[#38bdf8]">in</span>
                  <span>LinkedIn</span>
                </a>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium transition"
                >
                  <span>🐙</span>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* 10-SECOND EXECUTIVE HIGHLIGHTS GRID */}
          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-black text-white font-mono">97.32%</div>
              <div className="text-[11px] font-bold text-[#E50920] uppercase tracking-wider mt-0.5">
                ML Fraud Classifier
              </div>
              <div className="text-xs text-[#A3A6B0] mt-1 leading-snug">
                LightGBM with 0.793 PR-AUC on 4.8% imbalanced postings
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-black text-white font-mono">197K+</div>
              <div className="text-[11px] font-bold text-[#38bdf8] uppercase tracking-wider mt-0.5">
                Records Analyzed
              </div>
              <div className="text-xs text-[#A3A6B0] mt-1 leading-snug">
                Swiggy food data tracking INR 53.01M sales at Victoria Solutions
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-black text-white font-mono">103K+</div>
              <div className="text-[11px] font-bold text-[#D6AD62] uppercase tracking-wider mt-0.5">
                Uber Bookings BI
              </div>
              <div className="text-xs text-[#A3A6B0] mt-1 leading-snug">
                3-page Power BI dashboard ($1.55M value) with dynamic DAX
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-black text-white font-mono">UK MSc</div>
              <div className="text-[11px] font-bold text-[#46e3a8] uppercase tracking-wider mt-0.5">
                Student Rep Award
              </div>
              <div className="text-xs text-[#A3A6B0] mt-1 leading-snug">
                Univ. of Hertfordshire Data Science + B.Tech CSE (First Class)
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
            { id: 'education', label: 'Education & Awards' },
          ].map((tab) => (
            <button
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
              <span className="text-xs text-[#A3A6B0] font-mono">3 Roles • Industry & Production</span>
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
                    <div className="text-right sm:text-right">
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
                  Production Models & Analytics
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Flagship Projects & Repositories</h2>
              </div>
              <span className="text-xs text-[#A3A6B0] font-mono">{projects.length} Verified Solutions</span>
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
              <span className="text-xs text-[#A3A6B0] font-mono">Click any skill to view project evidence</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {skillCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-xl border border-white/10 bg-[#181B24]/60 p-5"
                >
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-[#38bdf8]">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-[#A3A6B0] mb-3">{cat.subtitle}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((s) => {
                      const hasEvidence = !!skillEvidence[s.name];
                      const isSelected = selectedSkill === s.name;
                      return (
                        <button
                          key={s.name}
                          onClick={() => setSelectedSkill(isSelected ? null : s.name)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
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
                      Project Evidence for {selectedSkill}:
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {skillEvidence[selectedSkill].map((item, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-[#08090D] text-xs text-white border border-white/10">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
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

        {/* EDUCATION & CERTIFICATIONS */}
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
                          <div className="text-xs text-[#A3A6B0] mt-0.5">{edu.place} • <span className="text-white/80">{edu.score}</span></div>
                        </div>
                      </div>

                      <div className="mt-3.5 text-xs text-white/80 leading-relaxed border-t border-white/5 pt-3">
                        <strong className="text-white/50 font-mono uppercase text-[10px] block mb-1">
                          Key Coursework
                        </strong>
                        {edu.coursework}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements & Awards */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#D6AD62]">
                  Recognitions
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-6">
                  Certifications & Awards
                </h2>

                <div className="space-y-3">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className="rounded-xl border border-white/10 bg-[#181B24]/70 p-4 flex items-start gap-3.5"
                    >
                      <span className="text-xl">🏆</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-white">{ach.title}</h3>
                          <span className="text-[10px] font-mono text-[#D6AD62] px-2 py-0.5 rounded bg-[#D6AD62]/10 uppercase">
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

        {/* EMBEDDED RESUME PREVIEW & DOWNLOAD CALLOUT */}
        <section className="mt-16 p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-[#181B24] via-[#11131A] to-[#181B24] text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E50920]">
            Complete Verified Resume
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Need the Official PDF Document?
          </h2>
          <p className="mt-2 text-sm text-[#A3A6B0] max-w-xl mx-auto">
            Directly download Giridhar’s verified 2-page curriculum vitae, including full contact details, UK right to work, and verified academic references.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href={profile.resumePdf}
              download="Giridhar_Reddy_Goddilla_Resume.pdf"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50920] hover:bg-[#ff2438] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#E50920]/25 transition cursor-pointer"
            >
              <span>📥</span>
              <span>Download Official Resume PDF</span>
            </a>

            <button
              onClick={onOpenResumeModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition cursor-pointer"
            >
              <span>🔍</span>
              <span>Open In-Browser PDF Viewer</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
