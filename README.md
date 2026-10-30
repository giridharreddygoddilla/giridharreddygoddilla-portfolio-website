# 🎬 GIRIDHAR — THE SERIES
### A Cinematic Streaming-Platform Personal Portfolio & Interactive Documentary

An extraordinary, interactive, premium personal portfolio website engineered for **Giridhar Reddy Goddilla** (Data Analyst & MSc Data Science candidate at the University of Hertfordshire, UK). 

Inspired by flagship OTT streaming originals, Apple product design, and interactive documentaries, this portfolio turns a professional career into a multi-season cinematic narrative.

---

## 🌟 The Experience Architecture

1. **Cinematic Intro Sequence** (`OpeningSequence.tsx`)
   - Black screen opening with letterbox bars and atmospheric projector flicker.
   - Studio title reveal (*"A GODDILLA ORIGINAL"*).
   - Animated blur-to-focus typography (*"GIRIDHAR — THE SERIES"*).
   - Identity reveal with portrait cutout and crimson rim lighting.
   - Cinematic **▶ PLAY** button and **SKIP INTRO** fallback.

2. **Streaming Profile Selector** (`ProfileSelector.tsx`)
   - *"Who's watching?"* Netflix-style profile selector with 4 personalized experiences:
     - **Giridhar** (Main narrative series in chronological sequence)
     - **Recruiter** (Resume, credentials, education, and achievements first)
     - **Developer / Analyst** (Originals, PySpark, ML models, tech stack, and GitHub first)
     - **Creative** (Portrait experience, story arc, and philosophical highlights first)

3. **Cinematic Hero Experience** (`Hero.tsx`)
   - Prominent, natural portrait photograph of Giridhar with interactive 3D pointer parallax.
   - Dynamic crimson and warm amber radial atmosphere with animated light streaks and film grain.
   - Floating glassmorphism chips (*"MSc Candidate"*, *"97.32% Accuracy"*, *"Python • SQL • Power BI"*).
   - Direct CTA buttons: **Play Intro**, **Featured Work**, **View Resume**, **GitHub**, **LinkedIn**.

4. **Continue Exploring Rail** (`ContinueWatching.tsx`)
   - Horizontal snap rail with live episode progress bars.
   - Interactive zoom & hover perspective shift.

5. **The Screenplay / About Me** (`About.tsx`)
   - Editorial spotlight framing the pilot episode.
   - Core statistics: MSc Data Science (UK), Victoria Solutions London Trainee, Core Stack, and career philosophy.

6. **The Identity / Portrait Experience** (`PortraitExperience.tsx`)
   - Dedicated cinematic section featuring Giridhar's verified identity photograph.
   - 3D perspective tilt reacting to mouse movement.
   - Master record credential badge, location highlight (*Luton & London, UK*), and verified precision metrics.

7. **Flagship Originals / Featured Projects** (`Originals.tsx`, `ProjectCard.tsx`, `ProjectModal.tsx`)
   - Presented as streaming original productions:
     1. **Fake Job Detection with ML & NLP** (97.32% Accuracy, 0.793 PR-AUC, LightGBM)
     2. **Amazon Bestsellers Analysis with PySpark** (Distributed Big Data Pipeline)
     3. **Deliveroo Operational Metrics Analysis** (SQL & Power BI Logistics KPI Suite)
     4. **Oil Price Forecasting with ARIMA & LSTM** (Deep Learning & Econometric Time Series)
     5. **Sales Clustering & Anomaly Detection** (Unsupervised ML Outlier Isolation)
   - Interactive modal overlays detailing Problem Solved, Result/Impact metrics, My Contribution, Tech Stack, and direct GitHub links.

8. **Giridhar's Top 10 Picks** (`TopPicks.tsx`)
   - Visually engaging numbered top 10 countdown with streaming thumbnail art.

9. **The Skill Universe** (`Skills.tsx`)
   - Categorized into Core Languages, Analytics & EDA, BI & Dashboards, Machine Learning, Deep Learning & NLP, Big Data & Cloud, and Developer Tools.
   - **Interactive Skill Evidence**: Hovering or tapping any skill card displays the exact projects or credentials validating it.

10. **The Professional Journey: Seasons & Episodes** (`Seasons.tsx`, `EpisodeCard.tsx`)
    - **Season 01 — The Foundation (2019 – 2023)**: Computer Science degree, algorithm foundations, FOURP Technology Solutions.
    - **Season 02 — The UK Master's Arc (2024 – Present)**: MSc Data Science at University of Hertfordshire, Student Representative Award, PySpark.
    - **Season 03 — Industry Impact in London (2025)**: Victoria Solutions, retail intelligence, Certificate of Excellence.
    - **Season 04 — The Flagship Originals (2025 – 2026)**: Machine learning classifiers, deep time series, logistics BI.
    - **Season 05 — What's Next (Now Streaming)**: Stepping into full-time UK Data Analyst and Data Science roles.

11. **Interactive Screenplay & Resume** (`ResumeViewer.tsx`, `ResumeModal.tsx`)
    - Interactive resume sheet with one-click **Download PDF** (`Giridhar_Reddy_Goddilla_Resume.pdf`).
    - Full-screen modal PDF viewer with mobile fallback.

12. **Final Cinematic Contact Sequence** (`FinalCTA.tsx`)
    - Full-screen dramatic closing *"TO BE CONTINUED..."*.
    - Direct actions: **LET'S BUILD**, **LinkedIn**, **GitHub**, **Email**, **Watch Again**, **Replay Opening**.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript 5.8
- **Bundler & Tooling**: Vite 6
- **Styling**: Tailwind CSS v4 with custom cinematic color palette:
  - Deep Ink Background: `#08090D`
  - Secondary Ink: `#11131A`
  - Surface Cards: `#181B24`
  - Cinematic Crimson: `#E50920`
  - Warm Accent Gold: `#D6AD62`
  - Crisp Bone Typography: `#F5F5F5`
  - Muted Mist Typography: `#A3A6B0`
- **Motion & Physics**: Framer Motion 11
- **Smooth Scrolling**: Lenis 1.1
- **Visual Assets**: Optimized WebP responsive sets (`420w`, `720w`, `1100w`) processed with transparent background neural cutouts.
- **Quality Assurance**: Playwright automated visual regression and console error monitoring.

---

## 🚀 Running the Project

### Prerequisites
Node.js (v18 or higher) and npm.

### Development Server
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
npm run preview
```
The optimized static production bundle will be generated in `dist/`.

---

## 🌐 Deployment

The project is completely self-contained and ready to deploy to any modern edge hosting platform:

### Vercel
1. Push this repository to your GitHub account (`giridharreddygoddilla`).
2. Import the repository in [Vercel](https://vercel.com).
3. Framework preset: **Vite**.
4. Build command: `npm run build` (output directory: `dist`).
5. Click **Deploy**.

### Netlify
1. Drag and drop the `dist/` folder into Netlify, or link your GitHub repository.
2. Build command: `npm run build`, Publish directory: `dist`.

---

## ⚙️ Personalization Central (`src/data/portfolio.ts`)

All content on the website is centralized in:
[`src/data/portfolio.ts`](file:///src/data/portfolio.ts)

To update any biographical detail, project, skill, or metric in the future, edit this single file and the entire application automatically reflects the updates across all views and modals.
