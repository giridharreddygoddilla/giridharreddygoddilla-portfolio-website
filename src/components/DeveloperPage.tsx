import { useState } from 'react';
import { motion } from 'framer-motion';
import { profile, characterAssets, projects, skillCategories, Project } from '../data/portfolio';
import { playClick } from '../hooks/useSoundFX';

interface DeveloperPageProps {
  onSelectProject: (p: Project) => void;
  onNavigateHome: () => void;
  onNavigateRecruiter: () => void;
}

export default function DeveloperPage({
  onSelectProject,
  onNavigateHome,
  onNavigateRecruiter,
}: DeveloperPageProps) {
  const [activeCodeTab, setActiveCodeTab] = useState<'pyspark' | 'lightgbm' | 'dax'>('lightgbm');

  const codeSnippets = {
    lightgbm: `# -------------------------------------------------------------
# Fake Job Posting Detection: LightGBM Fraud Classifier Pipeline
# Handling 4.8% extreme class imbalance with PR-AUC optimization
# -------------------------------------------------------------
import lightgbm as lgb
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import classification_report, precision_recall_curve, auc

# 1. Feature Engineering & TF-IDF Extraction
tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), stop_words='english')
X_text = tfidf.fit_transform(df['cleaned_job_description'])

# 2. Imbalance-Aware LightGBM Configuration
params = {
    'objective': 'binary',
    'metric': 'binary_logloss',
    'scale_pos_weight': 19.8,  # calibrated for 4.8% fraud prevalence
    'learning_rate': 0.05,
    'num_leaves': 31,
    'random_state': 42
}

# 3. Model Training & PR-AUC Evaluation
model = lgb.train(params, train_data, num_boost_round=450)
y_pred_proba = model.predict(X_test)

# Result: 97.32% Accuracy | 0.793 PR-AUC | 0.706 Fraud F1-Score`,

    pyspark: `# -------------------------------------------------------------
# Amazon Bestsellers Distributed Big Data Processing with PySpark
# Scalable schema inference, outlier filtering & distributed aggregations
# -------------------------------------------------------------
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, count, when

spark = SparkSession.builder \\
    .appName("AmazonBestsellersAnalysis") \\
    .config("spark.executor.memory", "4g") \\
    .getOrCreate()

# 1. Load distributed dataset with schema enforcement
df = spark.read.csv("s3a://data-lake/bestsellers.csv", header=True, inferSchema=True)

# 2. Clean numerical fields and compute author rankings across years
cleaned_df = df.filter(col("User Rating").isNotNull()) \\
    .withColumn("Is_Fiction", when(col("Genre") == "Fiction", 1).otherwise(0))

author_stats = cleaned_df.groupBy("Author") \\
    .agg(
        count("Name").alias("Total_Bestsellers"),
        avg("User Rating").alias("Avg_Rating"),
        avg("Price").alias("Avg_Price")
    ).filter(col("Total_Bestsellers") >= 5) \\
    .orderBy(col("Avg_Rating").desc())`,

    dax: `// -------------------------------------------------------------
// Uber Trip Analysis: Disconnected Measure Selection via DAX
// Enables dynamic control over Bookings, Gross Value & Distance
// -------------------------------------------------------------
Selected Metric Value = 
VAR CurrentSelection = SELECTEDVALUE('Measure Selector'[Metric Name], "Total Bookings")
RETURN
    SWITCH(
        CurrentSelection,
        "Total Bookings", FORMAT([Total Bookings Count], "#,##0"),
        "Gross Booking Value", FORMAT([Gross Booking Value GBP], "£#,##0.00"),
        "Average Trip Distance", FORMAT([Avg Trip Distance Miles], "#,##0.0") & " mi",
        "Average Trip Duration", FORMAT([Avg Duration Minutes], "#,##0") & " min",
        BLANK()
    )`
  };

  return (
    <main className="min-h-screen bg-[#08090D] text-[#F5F5F5] pt-24 pb-28">
      {/* DEVELOPER HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-white/50">
          <button
            type="button"
            onClick={() => {
              playClick();
              onNavigateHome();
            }}
            className="hover:text-white transition cursor-pointer flex items-center gap-1"
          >
            <span>← Return to Series</span>
          </button>
          <span>/</span>
          <span className="text-[#46e3a8]">Developer Workstation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Intro Text */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-[#46e3a8] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#46e3a8] font-bold">
                SOFTWARE ENGINEERING & DATA SCIENCE
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal leading-[0.92] tracking-wide text-white">
              BUILDING SCALABLE ANALYTICS & <span className="text-[#46e3a8]">PREDICTIVE AI</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#A3A6B0] leading-relaxed max-w-2xl font-sans">
              Combining 2 years of professional software engineering foundations with advanced postgraduate
              Data Science mastery in the United Kingdom. I architect end-to-end Python ETL pipelines, distributed
              PySpark data clusters, robust SQL schemas, and high-precision Machine Learning classifiers.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-mono">
              {['Python', 'SQL & Relational DBs', 'PySpark Big Data', 'LightGBM / XGBoost', 'Power BI & DAX', 'Git / GitHub'].map(
                (skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[#46e3a8]"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-[#46e3a8] hover:bg-[#3cd097] text-[#08090D] font-bold text-sm tracking-wider transition cursor-pointer shadow-lg shadow-[#46e3a8]/20 flex items-center gap-2"
              >
                <span>🐙</span>
                <span>EXPLORE GITHUB PROFILE</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  onNavigateRecruiter();
                }}
                className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition cursor-pointer"
              >
                👔 RECRUITER DOSSIER →
              </button>
            </div>
          </div>

          {/* Workstation Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[460px] aspect-[4/3] rounded-3xl overflow-hidden border border-[#46e3a8]/30 bg-[#11131A] shadow-2xl group">
              <motion.img
                src={characterAssets.developer.src}
                alt={characterAssets.developer.alt}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-transparent opacity-85" />

              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#46e3a8] uppercase tracking-wider block font-bold">
                    Production Setup
                  </span>
                  <p className="font-display text-xl text-white">DUAL-MONITOR WORKSTATION</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#46e3a8]/20 text-[#46e3a8] font-mono text-[10px] border border-[#46e3a8]/30">
                  ML & Big Data
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI & MACHINE LEARNING DEEP DIVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#E50920] font-bold">
              MACHINE LEARNING ARCHITECTURE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide mt-1">
              PRODUCTION FRAUD DETECTION & NLP
            </h2>
          </div>
          <span className="font-mono text-xs text-[#A3A6B0] hidden sm:inline">
            Class Imbalance & Threshold Tuning
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Architecture Highlight Card */}
          <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#181B24]/80 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🛡️</span>
                <span className="font-mono text-xs text-[#E50920] font-bold uppercase">
                  LightGBM + TF-IDF Vectorizer
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Fake Job Posting Detection System
              </h3>

              <p className="text-sm text-[#A3A6B0] leading-relaxed">
                Engineered an end-to-end fraud screening pipeline operating on an extreme 4.8% imbalanced dataset.
                Trained and benchmarked LightGBM, XGBoost, Support Vector Machines, and Gradient Boosting algorithms.
                Calibrated decision thresholds against precision-recall curves to optimize operational screening trade-offs.
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 my-6 py-4 border-y border-white/10">
                <div>
                  <div className="text-2xl font-black text-white font-mono">97.32%</div>
                  <div className="text-[10px] text-[#A3A6B0] uppercase font-bold mt-0.5">Overall Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#E50920] font-mono">0.793</div>
                  <div className="text-[10px] text-[#A3A6B0] uppercase font-bold mt-0.5">PR-AUC Score</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#D6AD62] font-mono">0.706</div>
                  <div className="text-[10px] text-[#A3A6B0] uppercase font-bold mt-0.5">Fraud F1-Score</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#A3A6B0]">
                <div className="flex items-center gap-2">
                  <span className="text-[#46e3a8]">✓</span>
                  <span>Stop-word filtering, n-gram tokenization, and TF-IDF matrix decomposition</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#46e3a8]">✓</span>
                  <span>Hyperparameter tuning via cross-validation and loss surface optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#46e3a8]">✓</span>
                  <span>Calibrated decision thresholds to minimize false negatives in recruiting fraud</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-[#46e3a8] hover:underline flex items-center gap-1"
              >
                <span>View ML Repo on GitHub</span>
                <span>↗</span>
              </a>
              <span className="text-xs font-mono text-white/40">Python • Scikit-learn • LightGBM</span>
            </div>
          </div>

          {/* Interactive Code Viewer Card */}
          <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#0C0E14] overflow-hidden flex flex-col shadow-xl">
            {/* Code Tabs Header */}
            <div className="flex items-center justify-between bg-[#11131A] px-4 py-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block" />
                <span className="font-mono text-xs text-white/50 ml-2">pipeline_execution.py</span>
              </div>

              <div className="flex items-center gap-1">
                {(['lightgbm', 'pyspark', 'dax'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      playClick();
                      setActiveCodeTab(tab);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
                      activeCodeTab === tab
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Display */}
            <div className="p-4 sm:p-5 flex-1 overflow-x-auto font-mono text-xs leading-relaxed text-white/90 bg-[#08090D]">
              <pre className="text-white/85">
                <code>{codeSnippets[activeCodeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ALL 6 VERIFIED REPOSITORIES & PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#38bdf8] font-bold">
              OPEN SOURCE & REPOSITORIES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide mt-1">
              ENGINEERING PORTFOLIO ({projects.length} SOLUTIONS)
            </h2>
          </div>
          <span className="font-mono text-xs text-[#A3A6B0] hidden sm:inline">
            Real GitHub Repositories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl border border-white/10 bg-[#181B24]/75 p-6 flex flex-col justify-between hover:border-white/25 transition group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#A3A6B0] mb-2">
                  <span className="text-[#46e3a8]">{proj.genre.split('•')[0]}</span>
                  <span>{proj.year}</span>
                </div>

                <h3 className="font-bold text-lg text-white group-hover:text-[#46e3a8] transition">
                  {proj.title}
                </h3>

                <p className="text-xs text-[#A3A6B0] mt-2.5 leading-relaxed line-clamp-3">
                  {proj.logline}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 my-4 py-3 border-y border-white/5">
                  {proj.metrics.slice(0, 2).map((m, mIdx) => (
                    <div key={mIdx}>
                      <div className="text-sm font-bold text-white font-mono">{m.value}</div>
                      <div className="text-[10px] text-[#A3A6B0] uppercase truncate">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {proj.stack.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-white/70">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onSelectProject(proj);
                  }}
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

      {/* STRUCTURED TECHNICAL CAPABILITIES MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#D6AD62] font-bold">
              STACK TAXONOMY
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide mt-1">
              TECHNICAL PROFICIENCY MATRIX
            </h2>
          </div>
          <span className="font-mono text-xs text-[#A3A6B0] hidden sm:inline">
            5 Structured Engineering Tiers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat) => (
            <div key={cat.id} className="rounded-2xl border border-white/10 bg-[#181B24]/60 p-5">
              <h3 className="font-mono text-xs font-bold text-[#46e3a8] uppercase tracking-wider mb-1">
                {cat.title}
              </h3>
              <p className="text-[11px] text-[#A3A6B0] mb-3">{cat.subtitle}</p>

              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((s) => (
                  <span
                    key={s.name}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-white/90 border border-white/10 flex items-center gap-1.5"
                  >
                    <span>{s.name}</span>
                    {s.note && (
                      <span className="text-[9px] px-1 rounded bg-white/10 text-[#D6AD62] font-mono">
                        {s.note}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEVELOPER FOOTER CALLOUT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#181B24] via-[#11131A] to-[#181B24] p-10 shadow-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-[#46e3a8] font-bold">
            LET&apos;S CONNECT
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide mt-2">
            READY TO CONTRIBUTE TO HIGH-IMPACT DATA TEAMS
          </h2>
          <p className="mt-3 text-sm text-[#A3A6B0] max-w-lg mx-auto leading-relaxed">
            Actively seeking Data Analyst and Data Science opportunities across the United Kingdom.
            Open to discussing ML pipelines, Big Data engineering, or executive BI implementations.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-[#46e3a8] hover:bg-[#3cd097] text-[#08090D] font-bold text-sm tracking-wider transition cursor-pointer shadow-lg shadow-[#46e3a8]/20"
            >
              🐙 VIEW GITHUB REPOSITORIES
            </a>

            <button
              type="button"
              onClick={() => {
                playClick();
                onNavigateRecruiter();
              }}
              className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition cursor-pointer"
            >
              👔 VIEW RECRUITER DOSSIER
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
