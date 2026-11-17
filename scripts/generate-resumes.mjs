import fs from 'fs';
import path from 'path';
import os from 'os';
import zlib from 'zlib';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { getChromePath } from './find-chrome.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'public', 'assets');

const resumeData = {
  name: 'GIRIDHAR REDDY GODDILLA',
  headline: 'Data Analyst  |  MSc Data Science (Distinction)  |  SQL, Power BI, Python & ETL',
  location: 'Luton, UK',
  phone: '+44 7765508654',
  email: 'giridharreddygoddilla@gmail.com',
  visa: 'UK Right to Work (2-Year Visa)',
  links: {
    linkedin: 'https://www.linkedin.com/in/giridharreddygoddilla/',
    portfolio: 'https://giridharreddygoddilla-portfolio-web.vercel.app/',
    github: 'https://github.com/giridharreddygoddilla',
  },
  summary:
    'Data Analyst with an MSc in Data Science (Distinction) and over two years of experience across software engineering, advanced SQL, data warehousing, and business intelligence reporting. Delivered product and regional sales analytics that contributed to a 14% year-on-year sales increase at FOURP Technology Solutions. Analysed 339K+ records across food-delivery sales, Uber bookings, and bank loan portfolios using SQL, Power BI, and Excel, alongside Pandas workflows that cleaned 180K+ order lines for forecasting. Holds UK right to work (2-year visa) and focuses on turning complex datasets into actionable revenue, demand, and credit-risk decisions.',
  skills: [
    {
      category: 'Programming Languages',
      items: 'SQL (JOINs, Aggregates, CTEs, Window Functions, CASE WHEN), Python (Pandas, NumPy)',
    },
    {
      category: 'Data Analytics',
      items: 'Exploratory Data Analysis (EDA), Data Cleaning & Validation, Revenue & Trend Analysis, KPI Frameworks, Performance Benchmarking',
    },
    {
      category: 'Data Visualisation & BI',
      items: 'Power BI (DAX, Time Intelligence), Tableau, Advanced Excel (PivotTables, Slicers, Formulas), Matplotlib, Seaborn',
    },
    {
      category: 'Databases & Data Engineering',
      items: 'Data Warehousing, Star-Schema Modelling, Relational & Dimensional Modelling, ETL/ELT Pipelines, PySpark, Databricks, Snowflake, Microsoft Fabric',
    },
    {
      category: 'Machine Learning & Statistics',
      items: 'Scikit-learn, XGBoost, LightGBM, SVM, Gradient Boosting, NLP (TF-IDF), Time-Series Forecasting (ARIMA, SARIMAX)',
    },
    {
      category: 'Development Tools',
      items: 'Git, GitHub, Jupyter Notebook, Streamlit',
    },
  ],
  experience: [
    {
      company: 'Victoria Solutions',
      location: 'London, UK',
      role: 'Data Analyst Intern',
      period: 'October 2025 – November 2025',
      bullets: [
        'Analysed INR 53.01M in food-delivery sales across 28 cities, ranking markets by revenue share and identifying that the top five cities accounted for 32.9% of total sales to prioritise city-level promotional spend.',
        'Evaluated monthly and daily order trends, establishing stable non-seasonal demand at INR 212K–224K per day with a modest 14.7% Saturday peak and directing growth strategy toward city and menu mix.',
        'Assessed menu-segment performance by comparing order volume against revenue share, showing that non-vegetarian dishes represented 29% of orders while generating 37% of sales to inform menu-mix decisions.',
        'Developed interactive Excel, Power BI, and Tableau dashboards tracking sales, orders, average order value, and customer ratings—including an Excel build with 8 PivotTables, 10 charts, and 3 slicers for self-service exploration.',
        'Cleaned and validated 197,430 order records using Excel formulas and structured filters to resolve inconsistencies prior to analysis and ensure reliable downstream reporting.',
      ],
    },
    {
      company: 'FOURP Technology Solutions Pvt. Ltd.',
      location: '',
      role: 'Software Engineer',
      period: 'June 2022 – August 2024',
      bullets: [
        'Delivered product-level and regional growth insights through year-over-year comparisons, revenue trend analysis, and performance benchmarking, contributing to a 14% year-on-year sales increase across product categories and markets.',
        'Engineered end-to-end SQL and PySpark ETL pipelines applying joins, CTEs, window functions, and distributed transformations with built-in cleansing and validation to convert multi-source e-commerce data into analysis-ready datasets.',
        'Designed relational and dimensional data warehouse models comprising standardised fact and dimension tables with aggregation workflows, centralising historical sales datasets for consistent business reporting.',
        'Developed Power BI and Tableau dashboards with advanced DAX measures and time-intelligence calculations to automate period-over-period tracking of revenue trends, sales performance, and operational KPIs.',
        'Standardised performance measurement across product lines and regions by defining KPI frameworks and product-region segmentation embedded directly into Power BI and Tableau reporting suites.',
      ],
    },
  ],
  projects: [
    {
      title: 'Uber Trip Analysis',
      stack: 'Power BI, DAX, Star Schema, Data Modelling',
      url: 'https://github.com/giridharreddygoddilla/USA-Uber-Data-Analysis',
      bullets: [
        'Designed a three-page interactive Power BI report analysing 103,728 June 2024 Uber bookings ($1.55M total fare value) backed by a star-schema model, DAX measures for fares, trip times, and top pickup/drop-off zones, a dynamic KPI switcher, slicers, and an hour-by-weekday heatmap.',
        'Established that UberX accounts for 37.4% of booking volume while all five vehicle types average approximately $15 per booking, demonstrating that premium tiers generate no fare uplift and pricing is not a differentiator.',
      ],
    },
    {
      title: 'Bank Loan & Credit Risk Analysis',
      stack: 'Excel, SQL, PivotTables, Data Visualisation',
      url: '',
      bullets: [
        'Built interactive Excel dashboards across 38,576 loan records (2021) featuring 15 PivotTables, slicers, and five MTD/MoM KPI cards, paired with SQL queries (JOINs, CTEs, window functions, CASE WHEN) to classify loans and track collections, which rose 15.8% month-on-month in December.',
        'Quantified default exposure by showing charged-off loans (13.82%) returned only 56.9% of $65.5M funded ($28.2M shortfall), with charge-offs rising from 5.7% (Grade A) to 31.3% (Grade G) and doubling on 60-month terms (22.3% vs. 10.7%); recommended stricter underwriting for Grades E–G and extended terms.',
      ],
    },
    {
      title: 'Fake Job Posting Detection (MSc Dissertation)',
      stack: 'Python, Scikit-learn, NLP, XGBoost, LightGBM',
      url: 'https://github.com/giridharreddygoddilla/MSc-Data-Science-Project',
      bullets: [
        'Investigated 17,880 job postings exhibiting severe class imbalance (4.84% fraud rate) for fraud indicators across text, recruitment patterns, and missing metadata; engineered 20 domain features (textual richness, scam keywords, missing fields, writing patterns) alongside TF-IDF representations.',
        'Benchmarked LightGBM, XGBoost, SVM, and Gradient Boosting on precision, recall, F1-score, and PR-AUC to account for class imbalance, with LightGBM delivering the strongest performance (0.706 F1-score, 0.793 PR-AUC).',
      ],
    },
  ],
  education: [
    {
      school: 'University of Hertfordshire',
      location: 'Hatfield, UK',
      degree: 'Master of Science, Data Science (Distinction)',
      period: 'Sep 2024 – Sep 2026',
      coursework: 'Data Analytics, Statistical Modelling, Database Management, Data Mining, Machine Learning, PySpark',
    },
    {
      school: 'Lovely Professional University',
      location: 'India',
      degree: 'Bachelor of Technology, Computer Science and Engineering (Distinction)',
      period: 'Aug 2019 – Aug 2023',
      coursework: 'Probability and Statistics, Data Structures and Algorithms, Database Management Systems, SQL, Python, Data Science',
    },
  ],
  certifications: [
    { name: 'Supervised Machine Learning: Regression and Classification', issuer: 'DeepLearning.AI' },
    { name: 'Machine Learning, Data Science & Python Programming', issuer: 'DataCamp' },
  ],
};

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildAtsHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Giridhar Reddy Goddilla — Resume (ATS-Friendly)</title>
<style>
  @page {
    size: A4 portrait;
    margin: 7.5mm 9.5mm 7.5mm 9.5mm;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: "Calibri", "Segoe UI", Arial, Helvetica, sans-serif;
    color: #111827;
    font-size: 8.2pt;
    line-height: 1.24;
    background: #ffffff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  a {
    color: #1d4ed8;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  header {
    text-align: center;
    margin-bottom: 5.5pt;
    padding-bottom: 4pt;
    border-bottom: 1.2pt solid #111827;
  }
  header h1 {
    font-size: 15.5pt;
    font-weight: 700;
    letter-spacing: 0.6pt;
    color: #0f172a;
    margin-bottom: 1.5pt;
  }
  .contact-line {
    font-size: 8.1pt;
    color: #334155;
  }
  .contact-line span.sep {
    margin: 0 3.5pt;
    color: #64748b;
  }
  section {
    margin-bottom: 5pt;
  }
  h2 {
    font-size: 8.9pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.65pt;
    color: #0f172a;
    border-bottom: 0.8pt solid #334155;
    padding-bottom: 1.2pt;
    margin-bottom: 3pt;
  }
  .summary {
    text-align: left;
    color: #1f2937;
  }
  .skills-list {
    list-style: none;
  }
  .skills-list li {
    margin-bottom: 1.4pt;
  }
  .skills-list strong {
    color: #0f172a;
  }
  .entry {
    margin-bottom: 4pt;
  }
  .entry:last-child {
    margin-bottom: 0;
  }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8pt;
    margin-bottom: 1pt;
  }
  .entry-title {
    font-weight: 700;
    font-size: 8.45pt;
    color: #0f172a;
  }
  .entry-sub {
    font-weight: 600;
    color: #334155;
  }
  .entry-date {
    font-weight: 600;
    font-size: 8pt;
    color: #334155;
    white-space: nowrap;
  }
  ul.bullets {
    margin-left: 12pt;
    margin-top: 1pt;
  }
  ul.bullets li {
    margin-bottom: 1.25pt;
    padding-left: 1pt;
    color: #1f2937;
  }
  .edu-coursework {
    font-size: 7.8pt;
    color: #374151;
    margin-top: 0.8pt;
  }
  .cert-list {
    margin-left: 12pt;
  }
  .cert-list li {
    margin-bottom: 1.2pt;
  }
</style>
</head>
<body>
  <header>
    <h1>${escHtml(resumeData.name)}</h1>
    <div class="contact-line">
      ${escHtml(resumeData.location)}<span class="sep">•</span>
      <a href="tel:${escHtml(resumeData.phone.replace(/\s+/g, ''))}">${escHtml(resumeData.phone)}</a><span class="sep">•</span>
      <a href="mailto:${escHtml(resumeData.email)}">${escHtml(resumeData.email)}</a><span class="sep">•</span>
      <a href="${escHtml(resumeData.links.linkedin)}">LinkedIn</a><span class="sep">•</span>
      <a href="${escHtml(resumeData.links.portfolio)}">Portfolio</a><span class="sep">•</span>
      <a href="${escHtml(resumeData.links.github)}">GitHub</a>
    </div>
  </header>

  <section>
    <h2>Professional Summary</h2>
    <p class="summary">${escHtml(resumeData.summary)}</p>
  </section>

  <section>
    <h2>Technical Skills</h2>
    <ul class="skills-list">
      ${resumeData.skills
        .map(
          (s) =>
            `<li><strong>${escHtml(s.category)}:</strong> ${escHtml(s.items)}</li>`
        )
        .join('\n      ')}
    </ul>
  </section>

  <section>
    <h2>Work Experience</h2>
    ${resumeData.experience
      .map(
        (exp) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <span class="entry-title">${escHtml(exp.company)}${exp.location ? ` (${escHtml(exp.location)})` : ''}</span>
          <span class="entry-sub"> — ${escHtml(exp.role)}</span>
        </div>
        <div class="entry-date">${escHtml(exp.period)}</div>
      </div>
      <ul class="bullets">
        ${exp.bullets.map((b) => `<li>${escHtml(b)}</li>`).join('\n        ')}
      </ul>
    </div>`
      )
      .join('\n')}
  </section>

  <section>
    <h2>Projects</h2>
    ${resumeData.projects
      .map(
        (proj) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <span class="entry-title">${escHtml(proj.title)}</span>
          <span class="entry-sub"> | ${escHtml(proj.stack)}</span>
        </div>
        ${proj.url ? `<div class="entry-date"><a href="${escHtml(proj.url)}">GitHub Repository</a></div>` : ''}
      </div>
      <ul class="bullets">
        ${proj.bullets.map((b) => `<li>${escHtml(b)}</li>`).join('\n        ')}
      </ul>
    </div>`
      )
      .join('\n')}
  </section>

  <section>
    <h2>Education</h2>
    ${resumeData.education
      .map(
        (edu) => `
    <div class="entry" style="margin-bottom: 3.5pt;">
      <div class="entry-header">
        <div>
          <span class="entry-title">${escHtml(edu.school)} (${escHtml(edu.location)})</span> — <span class="entry-sub">${escHtml(edu.degree)}</span>
        </div>
        <div class="entry-date">${escHtml(edu.period)}</div>
      </div>
      <div class="edu-coursework"><strong>Relevant Coursework:</strong> ${escHtml(edu.coursework)}</div>
    </div>`
      )
      .join('\n')}
  </section>

  <section style="margin-bottom: 0;">
    <h2>Certifications</h2>
    <ul class="cert-list">
      ${resumeData.certifications
        .map(
          (c) =>
            `<li><strong>${escHtml(c.name)}</strong> — ${escHtml(c.issuer)}</li>`
        )
        .join('\n      ')}
    </ul>
  </section>
</body>
</html>`;
}

function buildPremiumHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Giridhar Reddy Goddilla — Executive Resume</title>
<style>
  @page {
    size: A4 portrait;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: "Segoe UI", "Inter", -apple-system, BlinkMacSystemFont, Arial, sans-serif;
    color: #1e293b;
    font-size: 7.75pt;
    line-height: 1.24;
    background: #ffffff;
    width: 210mm;
    height: 297mm;
    overflow: hidden;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  .top-banner {
    background: #0f172a;
    color: #f8fafc;
    padding: 12pt 20pt 10pt 20pt;
    border-bottom: 2.2pt solid #c59b43;
  }
  .banner-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 12pt;
  }
  .name {
    font-size: 16.8pt;
    font-weight: 800;
    letter-spacing: 0.85pt;
    color: #ffffff;
    line-height: 1.05;
  }
  .subtitle {
    font-size: 8.2pt;
    color: #e2c275;
    font-weight: 600;
    letter-spacing: 0.35pt;
    margin-top: 2.5pt;
  }
  .visa-badge {
    display: inline-block;
    border: 0.8pt solid rgba(226, 194, 117, 0.55);
    background: rgba(226, 194, 117, 0.12);
    color: #f3dfa6;
    font-size: 7.2pt;
    font-weight: 600;
    letter-spacing: 0.35pt;
    padding: 2pt 6.5pt;
    border-radius: 3pt;
    white-space: nowrap;
  }
  .contact-strip {
    margin-top: 6pt;
    padding-top: 5pt;
    border-top: 0.5pt solid rgba(255, 255, 255, 0.15);
    display: flex;
    flex-wrap: wrap;
    gap: 3pt 10pt;
    font-size: 7.5pt;
    color: #cbd5e1;
  }
  .contact-strip a {
    color: #e2e8f0;
  }
  .contact-strip a.accent-link {
    color: #93c5fd;
    font-weight: 600;
  }
  .page-body {
    display: grid;
    grid-template-columns: 1.78fr 0.94fr;
    gap: 10pt 14pt;
    padding: 9.5pt 20pt 10pt 20pt;
  }
  .summary-box {
    grid-column: 1 / -1;
    background: #f8fafc;
    border-left: 2.4pt solid #c59b43;
    padding: 5.5pt 9pt;
    border-radius: 0 3pt 3pt 0;
    color: #1e293b;
    font-size: 7.8pt;
    line-height: 1.3;
  }
  .section-title {
    font-size: 8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.9pt;
    color: #0f172a;
    border-bottom: 0.9pt solid #cbd5e1;
    padding-bottom: 1.8pt;
    margin-bottom: 4.5pt;
    display: flex;
    align-items: center;
    gap: 4.5pt;
  }
  .section-title::before {
    content: "";
    display: inline-block;
    width: 3.5pt;
    height: 7.8pt;
    background: #c59b43;
    border-radius: 1pt;
  }
  .col-section {
    margin-bottom: 7.5pt;
  }
  .col-section:last-child {
    margin-bottom: 0;
  }
  .exp-item, .proj-item {
    margin-bottom: 5.5pt;
  }
  .exp-item:last-child, .proj-item:last-child {
    margin-bottom: 0;
  }
  .item-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 5pt;
  }
  .item-role {
    font-size: 8.2pt;
    font-weight: 700;
    color: #0f172a;
  }
  .item-org {
    font-size: 7.6pt;
    font-weight: 600;
    color: #1d4ed8;
  }
  .item-date {
    font-size: 7.2pt;
    font-weight: 600;
    color: #475569;
    white-space: nowrap;
  }
  .item-stack {
    font-size: 7.1pt;
    color: #64748b;
    font-weight: 600;
    margin-top: 0.5pt;
    margin-bottom: 1.5pt;
  }
  ul.bullets {
    margin-left: 10pt;
    margin-top: 1.8pt;
  }
  ul.bullets li {
    margin-bottom: 1.65pt;
    color: #334155;
    padding-left: 0.8pt;
  }
  ul.bullets li::marker {
    color: #c59b43;
  }
  .skill-group {
    margin-bottom: 5pt;
    padding-bottom: 4.5pt;
    border-bottom: 0.5pt solid #e2e8f0;
  }
  .skill-group:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .skill-cat {
    font-size: 7.3pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4pt;
    color: #0f172a;
    margin-bottom: 1.5pt;
  }
  .skill-items {
    font-size: 7.45pt;
    color: #334155;
    line-height: 1.28;
  }
  .edu-card {
    background: #f8fafc;
    border: 0.6pt solid #e2e8f0;
    border-radius: 3.5pt;
    padding: 5.5pt 7pt;
    margin-bottom: 5pt;
  }
  .edu-card:last-child {
    margin-bottom: 0;
  }
  .edu-degree {
    font-size: 7.8pt;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.22;
  }
  .edu-school {
    font-size: 7.5pt;
    font-weight: 600;
    color: #1d4ed8;
    margin-top: 1pt;
  }
  .edu-meta {
    font-size: 7pt;
    color: #64748b;
    margin-top: 0.8pt;
  }
  .edu-course {
    font-size: 7pt;
    color: #475569;
    margin-top: 2.5pt;
    line-height: 1.25;
  }
  .cert-item {
    margin-bottom: 4pt;
    padding-left: 5.5pt;
    border-left: 1.5pt solid #c59b43;
  }
  .cert-item:last-child {
    margin-bottom: 0;
  }
  .cert-name {
    font-size: 7.55pt;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.22;
  }
  .cert-issuer {
    font-size: 7.1pt;
    color: #475569;
  }
  .repo-link {
    font-size: 7.1pt;
    color: #1d4ed8;
    font-weight: 600;
  }
</style>
</head>
<body>
  <header class="top-banner">
    <div class="banner-row">
      <div>
        <div class="name">${escHtml(resumeData.name)}</div>
        <div class="subtitle">${escHtml(resumeData.headline)}</div>
      </div>
      <div class="visa-badge">${escHtml(resumeData.visa)}</div>
    </div>
    <div class="contact-strip">
      <span>${escHtml(resumeData.location)}</span>
      <span>•</span>
      <a href="tel:${escHtml(resumeData.phone.replace(/\s+/g, ''))}">${escHtml(resumeData.phone)}</a>
      <span>•</span>
      <a href="mailto:${escHtml(resumeData.email)}">${escHtml(resumeData.email)}</a>
      <span>•</span>
      <a class="accent-link" href="${escHtml(resumeData.links.linkedin)}">LinkedIn</a>
      <span>•</span>
      <a class="accent-link" href="${escHtml(resumeData.links.portfolio)}">Portfolio</a>
      <span>•</span>
      <a class="accent-link" href="${escHtml(resumeData.links.github)}">GitHub</a>
    </div>
  </header>

  <main class="page-body">
    <div class="summary-box">
      ${escHtml(resumeData.summary)}
    </div>

    <div class="main-col">
      <section class="col-section">
        <div class="section-title">Work Experience</div>
        ${resumeData.experience
          .map(
            (exp) => `
        <div class="exp-item">
          <div class="item-head">
            <div>
              <span class="item-role">${escHtml(exp.role)}</span>
              <span class="item-org"> · ${escHtml(exp.company)}${exp.location ? ` (${escHtml(exp.location)})` : ''}</span>
            </div>
            <span class="item-date">${escHtml(exp.period)}</span>
          </div>
          <ul class="bullets">
            ${exp.bullets.map((b) => `<li>${escHtml(b)}</li>`).join('\n            ')}
          </ul>
        </div>`
          )
          .join('\n')}
      </section>

      <section class="col-section">
        <div class="section-title">Key Projects</div>
        ${resumeData.projects
          .map(
            (proj) => `
        <div class="proj-item">
          <div class="item-head">
            <span class="item-role">${escHtml(proj.title)}</span>
            ${proj.url ? `<a class="repo-link" href="${escHtml(proj.url)}">GitHub ↗</a>` : ''}
          </div>
          <div class="item-stack">${escHtml(proj.stack)}</div>
          <ul class="bullets">
            ${proj.bullets.map((b) => `<li>${escHtml(b)}</li>`).join('\n            ')}
          </ul>
        </div>`
          )
          .join('\n')}
      </section>
    </div>

    <aside class="side-col">
      <section class="col-section">
        <div class="section-title">Technical Skills</div>
        ${resumeData.skills
          .map(
            (s) => `
        <div class="skill-group">
          <div class="skill-cat">${escHtml(s.category)}</div>
          <div class="skill-items">${escHtml(s.items)}</div>
        </div>`
          )
          .join('\n')}
      </section>

      <section class="col-section">
        <div class="section-title">Education</div>
        ${resumeData.education
          .map(
            (edu) => `
        <div class="edu-card">
          <div class="edu-degree">${escHtml(edu.degree)}</div>
          <div class="edu-school">${escHtml(edu.school)}</div>
          <div class="edu-meta">${escHtml(edu.location)} • ${escHtml(edu.period)}</div>
          <div class="edu-course"><strong>Coursework:</strong> ${escHtml(edu.coursework)}</div>
        </div>`
          )
          .join('\n')}
      </section>

      <section class="col-section">
        <div class="section-title">Certifications</div>
        ${resumeData.certifications
          .map(
            (c) => `
        <div class="cert-item">
          <div class="cert-name">${escHtml(c.name)}</div>
          <div class="cert-issuer">${escHtml(c.issuer)}</div>
        </div>`
          )
          .join('\n')}
      </section>
    </aside>
  </main>
</body>
</html>`;
}

function escXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Pure-Node standards-compliant ZIP writer for .docx generation
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createZipBuffer(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const nameBuf = Buffer.from(file.name, 'utf8');
    const rawBuf = Buffer.from(file.content, 'utf8');
    const compressedBuf = zlib.deflateRawSync(rawBuf);
    const crc = crc32(rawBuf);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(8, 8); // deflate
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressedBuf.length, 18);
    localHeader.writeUInt32LE(rawBuf.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, nameBuf, compressedBuf);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressedBuf.length, 20);
    centralHeader.writeUInt32LE(rawBuf.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralParts.push(centralHeader, nameBuf);
    offset += localHeader.length + nameBuf.length + compressedBuf.length;
  }

  const centralDir = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDir.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDir, eocd]);
}

function buildDocx(outputPath) {
  const rels = [
    { id: 'rIdMail', target: `mailto:${resumeData.email}` },
    { id: 'rIdLinkedIn', target: resumeData.links.linkedin },
    { id: 'rIdPortfolio', target: resumeData.links.portfolio },
    { id: 'rIdGitHub', target: resumeData.links.github },
    { id: 'rIdUber', target: resumeData.projects[0].url },
    { id: 'rIdFakeJob', target: resumeData.projects[2].url },
  ];

  const run = (text, opts = {}) => {
    const rPr = [];
    rPr.push(`<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>`);
    if (opts.bold) rPr.push('<w:b/>');
    if (opts.italic) rPr.push('<w:i/>');
    if (opts.color) rPr.push(`<w:color w:val="${opts.color}"/>`);
    if (opts.size) rPr.push(`<w:sz w:val="${opts.size}"/><w:szCs w:val="${opts.size}"/>`);
    if (opts.underline) rPr.push('<w:u w:val="single"/>');
    return `<w:r><w:rPr>${rPr.join('')}</w:rPr><w:t xml:space="preserve">${escXml(text)}</w:t></w:r>`;
  };

  const hyperlink = (rId, text, size = 18) =>
    `<w:hyperlink r:id="${rId}">${run(text, { color: '1D4ED8', underline: true, size })}</w:hyperlink>`;

  const heading = (title) => `
    <w:p>
      <w:pPr>
        <w:spacing w:before="130" w:after="55"/>
        <w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="334155"/></w:pBdr>
        <w:keepNext/>
      </w:pPr>
      ${run(title.toUpperCase(), { bold: true, size: 20, color: '0F172A' })}
    </w:p>`;

  const bulletPara = (text) => `
    <w:p>
      <w:pPr>
        <w:spacing w:before="15" w:after="35" w:line="252" w:lineRule="auto"/>
        <w:ind w:left="280" w:hanging="160"/>
      </w:pPr>
      ${run('•  ', { bold: true, size: 18, color: '0F172A' })}
      ${run(text, { size: 18, color: '1F2937' })}
    </w:p>`;

  const paragraphs = [];

  // Name Header
  paragraphs.push(`
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:before="0" w:after="40"/>
      </w:pPr>
      ${run(resumeData.name, { bold: true, size: 32, color: '0F172A' })}
    </w:p>`);

  // Contact Line
  paragraphs.push(`
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:before="0" w:after="100"/>
        <w:pBdr><w:bottom w:val="single" w:sz="10" w:space="4" w:color="0F172A"/></w:pBdr>
      </w:pPr>
      ${run(`${resumeData.location}  •  ${resumeData.phone}  •  `, { size: 17, color: '334155' })}
      ${hyperlink('rIdMail', resumeData.email, 17)}
      ${run('  •  ', { size: 17, color: '334155' })}
      ${hyperlink('rIdLinkedIn', 'LinkedIn', 17)}
      ${run('  •  ', { size: 17, color: '334155' })}
      ${hyperlink('rIdPortfolio', 'Portfolio', 17)}
      ${run('  •  ', { size: 17, color: '334155' })}
      ${hyperlink('rIdGitHub', 'GitHub', 17)}
    </w:p>`);

  // Summary
  paragraphs.push(heading('Professional Summary'));
  paragraphs.push(`
    <w:p>
      <w:pPr><w:spacing w:before="20" w:after="60" w:line="252" w:lineRule="auto"/></w:pPr>
      ${run(resumeData.summary, { size: 18, color: '1F2937' })}
    </w:p>`);

  // Technical Skills
  paragraphs.push(heading('Technical Skills'));
  for (const s of resumeData.skills) {
    paragraphs.push(`
      <w:p>
        <w:pPr><w:spacing w:before="15" w:after="30" w:line="248" w:lineRule="auto"/></w:pPr>
        ${run(`${s.category}: `, { bold: true, size: 18, color: '0F172A' })}
        ${run(s.items, { size: 18, color: '1F2937' })}
      </w:p>`);
  }

  // Work Experience
  paragraphs.push(heading('Work Experience'));
  for (const exp of resumeData.experience) {
    paragraphs.push(`
      <w:p>
        <w:pPr>
          <w:spacing w:before="70" w:after="25"/>
          <w:tabs><w:tab w:val="right" w:pos="10400"/></w:tabs>
          <w:keepNext/>
        </w:pPr>
        ${run(`${exp.company}${exp.location ? ` (${exp.location})` : ''}`, { bold: true, size: 19, color: '0F172A' })}
        ${run(` — ${exp.role}`, { bold: true, italic: true, size: 18, color: '334155' })}
        <w:r><w:tab/></w:r>
        ${run(exp.period, { bold: true, size: 17, color: '334155' })}
      </w:p>`);
    for (const b of exp.bullets) {
      paragraphs.push(bulletPara(b));
    }
  }

  // Projects
  paragraphs.push(heading('Projects'));
  resumeData.projects.forEach((proj, idx) => {
    const rId = idx === 0 ? 'rIdUber' : idx === 2 ? 'rIdFakeJob' : null;
    paragraphs.push(`
      <w:p>
        <w:pPr>
          <w:spacing w:before="65" w:after="25"/>
          <w:tabs><w:tab w:val="right" w:pos="10400"/></w:tabs>
          <w:keepNext/>
        </w:pPr>
        ${run(proj.title, { bold: true, size: 19, color: '0F172A' })}
        ${run(` | ${proj.stack}`, { italic: true, size: 17, color: '334155' })}
        ${rId ? `<w:r><w:tab/></w:r>${hyperlink(rId, 'GitHub Repository', 17)}` : ''}
      </w:p>`);
    for (const b of proj.bullets) {
      paragraphs.push(bulletPara(b));
    }
  });

  // Education
  paragraphs.push(heading('Education'));
  for (const edu of resumeData.education) {
    paragraphs.push(`
      <w:p>
        <w:pPr>
          <w:spacing w:before="50" w:after="15"/>
          <w:tabs><w:tab w:val="right" w:pos="10400"/></w:tabs>
          <w:keepNext/>
        </w:pPr>
        ${run(`${edu.school} (${edu.location})`, { bold: true, size: 19, color: '0F172A' })}
        ${run(` — ${edu.degree}`, { italic: true, size: 18, color: '334155' })}
        <w:r><w:tab/></w:r>
        ${run(edu.period, { bold: true, size: 17, color: '334155' })}
      </w:p>`);
    paragraphs.push(`
      <w:p>
        <w:pPr><w:spacing w:before="0" w:after="45"/></w:pPr>
        ${run('Relevant Coursework: ', { bold: true, size: 17, color: '374151' })}
        ${run(edu.coursework, { size: 17, color: '374151' })}
      </w:p>`);
  }

  // Certifications
  paragraphs.push(heading('Certifications'));
  for (const c of resumeData.certifications) {
    paragraphs.push(`
      <w:p>
        <w:pPr>
          <w:spacing w:before="15" w:after="30"/>
          <w:ind w:left="280" w:hanging="160"/>
        </w:pPr>
        ${run('•  ', { bold: true, size: 18, color: '0F172A' })}
        ${run(c.name, { bold: true, size: 18, color: '0F172A' })}
        ${run(` — ${c.issuer}`, { size: 18, color: '334155' })}
      </w:p>`);
  }

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${paragraphs.join('\n')}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="720" w:right="750" w:bottom="720" w:left="750" w:header="400" w:footer="400" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${rels
    .map(
      (r) =>
        `<Relationship Id="${r.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${escXml(r.target)}" TargetMode="External"/>`
    )
    .join('\n  ')}
</Relationships>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const zipBuf = createZipBuffer([
    { name: '[Content_Types].xml', content: contentTypesXml },
    { name: '_rels/.rels', content: rootRelsXml },
    { name: 'word/_rels/document.xml.rels', content: docRelsXml },
    { name: 'word/document.xml', content: documentXml },
  ]);

  fs.writeFileSync(outputPath, zipBuf);
}

function renderHtmlToPdf(chromePath, htmlContent, pdfOutputPath, tmpDir, label) {
  const htmlFile = path.join(tmpDir, `${label}.html`);
  fs.writeFileSync(htmlFile, htmlContent, 'utf8');
  const fileUrl = `file:///${htmlFile.replace(/\\/g, '/')}`;

  execFileSync(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      `--print-to-pdf=${pdfOutputPath}`,
      fileUrl,
    ],
    { stdio: 'pipe' }
  );
}

async function main() {
  const chromePath = getChromePath();
  if (!chromePath) {
    throw new Error('Could not locate Chrome/Chromium executable.');
  }

  fs.mkdirSync(assetsDir, { recursive: true });
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-gen-'));

  try {
    const atsPdfPath = path.join(assetsDir, 'Giridhar_Reddy_Goddilla_Resume_ATS.pdf');
    const defaultPdfPath = path.join(assetsDir, 'Giridhar_Reddy_Goddilla_Resume.pdf');
    const premiumPdfPath = path.join(assetsDir, 'Giridhar_Reddy_Goddilla_Resume_Premium.pdf');
    const docxPath = path.join(assetsDir, 'Giridhar_Reddy_Goddilla_Resume.docx');

    console.log('Generating ATS-Friendly Resume PDF...');
    renderHtmlToPdf(chromePath, buildAtsHtml(), atsPdfPath, tmpDir, 'resume-ats');
    fs.copyFileSync(atsPdfPath, defaultPdfPath);

    console.log('Generating Premium Visual Resume PDF...');
    renderHtmlToPdf(chromePath, buildPremiumHtml(), premiumPdfPath, tmpDir, 'resume-premium');

    console.log('Generating Editable DOCX Resume...');
    buildDocx(docxPath);

    console.log('\n✓ Generated all resume deliverables:');
    for (const p of [atsPdfPath, defaultPdfPath, premiumPdfPath, docxPath]) {
      const stat = fs.statSync(p);
      console.log(`  - ${path.basename(p)} (${(stat.size / 1024).toFixed(1)} KB)`);
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error('Resume generation failed:', err);
  process.exit(1);
});
