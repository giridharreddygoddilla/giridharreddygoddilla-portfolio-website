/**
 * Central portfolio data — Giridhar Reddy Goddilla.
 * Every fact on the site is verified from Giridhar's official resume and academic/project documents.
 */

export type Palette = { from: string; via: string; to: string; accent: string };

export const profile = {
  fullName: 'Giridhar Reddy Goddilla',
  displayName: 'Giridhar Reddy',
  firstName: 'GIRIDHAR',
  seriesTag: 'THE SERIES',
  originalLabel: 'A GODDILLA ORIGINAL',
  role: 'Data Analyst | MSc Data Science (Distinction)',
  headline: 'Data Analyst | MSc Data Science (Distinction) | SQL, Power BI, Python & ETL',
  tagline: ['Data Analyst', 'MSc Data Science (Distinction)', 'SQL, Power BI, Python & ETL'],
  intro:
    'Data Analyst with an MSc in Data Science (Distinction) and over two years of experience across software engineering, advanced SQL, data warehousing, and business intelligence reporting. Delivered product and regional sales analytics that contributed to a 14% year-on-year sales increase at FOURP Technology Solutions. Analysed 339K+ records across food-delivery sales, Uber bookings, and bank loan portfolios using SQL, Power BI, and Excel, alongside Pandas workflows that cleaned 180K+ order lines for forecasting. Holds UK right to work (2-year visa) and focuses on turning complex datasets into actionable revenue, demand, and credit-risk decisions.',
  location: 'Luton, UK',
  visa: 'UK Right to Work (2-Year Visa)',
  email: 'giridharreddygoddilla@gmail.com',
  phone: '+44 7765508654',
  links: {
    linkedin: 'https://www.linkedin.com/in/giridharreddygoddilla/',
    github: 'https://github.com/giridharreddygoddilla',
    portfolio: 'https://giridharreddygoddilla-portfolio-web.vercel.app/',
  },
  resumePdf: '/assets/Giridhar_Reddy_Goddilla_Resume_ATS.pdf',
  resumePremiumPdf: '/assets/Giridhar_Reddy_Goddilla_Resume_Premium.pdf',
  resumeDocx: '/assets/Giridhar_Reddy_Goddilla_Resume.docx',
  portrait: {
    src: '/assets/character/hero-portrait.webp',
    alt: 'Giridhar Reddy Goddilla - Character Illustration',
  },
  recruiterPhoto: {
    src: '/assets/giridhar-original-portrait.jpg',
    alt: 'Giridhar Reddy Goddilla - Original Professional Photograph',
  },
  interests: [
    'Revenue & Demand Analytics',
    'Credit-Risk & Financial Modelling',
    'ETL & Data Warehousing (SQL / PySpark)',
    'Business Intelligence (Power BI / DAX / Tableau)',
  ],
};

export const characterAssets = {
  thumbnail: {
    src: '/assets/character/walking-city.webp',
    alt: 'Giridhar Reddy - Character Thumbnail',
  },
  hero: {
    src: '/assets/character/hero-portrait.webp',
    alt: 'Giridhar Reddy - Signature Hero Portrait (Anime Aesthetic)',
    label: 'Signature Hero Portrait',
    mood: 'Warm atmospheric studio lighting, wavy hair, glasses, confident subtle smile',
  },
  developer: {
    src: '/assets/character/developer-workspace.webp',
    alt: 'Giridhar Reddy - Developer Workspace at Dual-Monitor Setup',
    label: 'Developer Workstation',
    mood: 'Multi-monitor setup, machine learning pipelines, dark navy shirt, blue monitor glow',
  },
  walking: {
    src: '/assets/character/walking-city.webp',
    alt: 'Giridhar Reddy - Walking in Modern City',
    label: 'Cinematic Journey',
    mood: 'Full-body shot walking in modern architectural city, golden hour lighting',
  },
  confident: {
    src: '/assets/character/confident-arms-crossed.webp',
    alt: 'Giridhar Reddy - Confident Studio Portrait',
    label: 'Confident Professional',
    mood: 'Studio waist-up, arms crossed, warm golden rim lighting',
  },
  calmCity: {
    src: '/assets/character/calm-city-smile.webp',
    alt: 'Giridhar Reddy - Approachable City Portrait',
    label: 'City Plaza Smile',
    mood: 'Warm daylight, modern plaza, approachable confident expression',
  },
  seated: {
    src: '/assets/character/seated-executive.webp',
    alt: 'Giridhar Reddy - Seated Executive Portrait',
    label: 'Seated Executive',
    mood: 'Thoughtful posture, hand on chin, warm architectural office illumination',
  },
};

export const education = [
  {
    school: 'University of Hertfordshire',
    place: 'Hatfield, UK',
    degree: 'Master of Science, Data Science',
    period: 'Sep 2024 – Sep 2026',
    score: 'Distinction',
    coursework: 'Data Analytics, Statistical Modelling, Database Management, Data Mining, Machine Learning, PySpark',
    logo: '/assets/education/hertfordshire.webp',
    shortCode: 'UH',
  },
  {
    school: 'Lovely Professional University',
    place: 'India',
    degree: 'Bachelor of Technology, Computer Science and Engineering',
    period: 'Aug 2019 – Aug 2023',
    score: 'Distinction',
    coursework: 'Probability and Statistics, Data Structures and Algorithms, Database Management Systems, SQL, Python, Data Science',
    logo: '/assets/education/lpu.webp',
    shortCode: 'LPU',
  },
];

export const experience = [
  {
    company: 'Victoria Solutions',
    role: 'Data Analyst Intern',
    place: 'London, UK',
    period: 'October 2025 – November 2025',
    points: [
      'Analysed INR 53.01M in food-delivery sales across 28 cities, ranking markets by revenue share and identifying that the top five cities accounted for 32.9% of total sales to prioritise city-level promotional spend.',
      'Evaluated monthly and daily order trends, establishing stable non-seasonal demand at INR 212K–224K per day with a modest 14.7% Saturday peak and directing growth strategy toward city and menu mix.',
      'Assessed menu-segment performance by comparing order volume against revenue share, showing that non-vegetarian dishes represented 29% of orders while generating 37% of sales to inform menu-mix decisions.',
      'Developed interactive Excel, Power BI, and Tableau dashboards tracking sales, orders, average order value, and customer ratings—including an Excel build with 8 PivotTables, 10 charts, and 3 slicers for self-service exploration.',
      'Cleaned and validated 197,430 order records using Excel formulas and structured filters to resolve inconsistencies prior to analysis and ensure reliable downstream reporting.',
    ],
  },
  {
    company: 'FOURP Technology Solutions Pvt. Ltd.',
    role: 'Software Engineer',
    place: 'E-Commerce & BI Analytics',
    period: 'June 2022 – August 2024',
    points: [
      'Delivered product-level and regional growth insights through year-over-year comparisons, revenue trend analysis, and performance benchmarking, contributing to a 14% year-on-year sales increase across product categories and markets.',
      'Engineered end-to-end SQL and PySpark ETL pipelines applying joins, CTEs, window functions, and distributed transformations with built-in cleansing and validation to convert multi-source e-commerce data into analysis-ready datasets.',
      'Designed relational and dimensional data warehouse models comprising standardised fact and dimension tables with aggregation workflows, centralising historical sales datasets for consistent business reporting.',
      'Developed Power BI and Tableau dashboards with advanced DAX measures and time-intelligence calculations to automate period-over-period tracking of revenue trends, sales performance, and operational KPIs.',
      'Standardised performance measurement across product lines and regions by defining KPI frameworks and product-region segmentation embedded directly into Power BI and Tableau reporting suites.',
    ],
  },
];

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  year: string;
  genre: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  github?: string;
  demoUrl?: string;
  palette: Palette;
  motif: 'shield' | 'flow' | 'tenants';
};

export const projects: Project[] = [
  {
    id: 'uber-trip-analysis',
    title: 'Uber Trip Analysis',
    year: '2024',
    genre: 'Business Intelligence • Power BI • Star Schema',
    logline:
      'Three-page interactive Power BI reporting suite analysing 103,728 June 2024 Uber bookings ($1.55M total fare value) with star-schema modelling, custom DAX measures, and demand heatmaps.',
    stack: ['Power BI', 'DAX', 'Star Schema', 'Data Modelling'],
    build: [
      'Designed a three-page interactive Power BI report analysing 103,728 June 2024 Uber bookings ($1.55M total fare value) backed by a star-schema model, DAX measures for fares, trip times, and top pickup/drop-off zones, a dynamic KPI switcher, slicers, and an hour-by-weekday heatmap.',
      'Established that UberX accounts for 37.4% of booking volume while all five vehicle types average approximately $15 per booking, demonstrating that premium tiers generate no fare uplift and pricing is not a differentiator.',
    ],
    features: [
      'Three-page executive Power BI suite with star-schema data model',
      'Custom DAX measures for fares, trip durations & top pickup/drop-off zones',
      'Dynamic KPI switcher, interactive slicers & hour-by-weekday heatmap',
      'Vehicle tier pricing benchmark showing $15 average across all five tiers',
      'Volume share decomposition identifying UberX at 37.4% of bookings',
    ],
    metrics: [
      { value: '103,728', label: 'Uber bookings analysed' },
      { value: '$1.55M', label: 'total fare value' },
      { value: '37.4%', label: 'UberX volume share' },
      { value: '~$15', label: 'average fare across tiers' },
      { value: '3-Page', label: 'Power BI star-schema report' },
    ],
    github: 'https://github.com/giridharreddygoddilla/USA-Uber-Data-Analysis',
    palette: { from: '#051824', via: '#0c4a6e', to: '#020d14', accent: '#38bdf8' },
    motif: 'tenants',
  },
  {
    id: 'bank-loan-credit-risk',
    title: 'Bank Loan & Credit Risk Analysis',
    year: '2025',
    genre: 'Credit Risk • SQL • Excel Visualisation',
    logline:
      'Credit-risk and loan repayment analytics across 38,576 loan records ($65.5M funded), quantifying a $28.2M charge-off shortfall and recommending stricter underwriting for Grades E–G and 60-month terms.',
    stack: ['Excel', 'SQL', 'PivotTables', 'Data Visualisation'],
    build: [
      'Built interactive Excel dashboards across 38,576 loan records (2021) featuring 15 PivotTables, slicers, and five MTD/MoM KPI cards, paired with SQL queries (JOINs, CTEs, window functions, CASE WHEN) to classify loans and track collections, which rose 15.8% month-on-month in December.',
      'Quantified default exposure by showing charged-off loans (13.82%) returned only 56.9% of $65.5M funded ($28.2M shortfall), with charge-offs rising from 5.7% (Grade A) to 31.3% (Grade G) and doubling on 60-month terms (22.3% vs. 10.7%); recommended stricter underwriting for Grades E–G and extended terms.',
    ],
    features: [
      '15 interactive PivotTables, dynamic slicers & five MTD/MoM KPI cards',
      'SQL loan classification using JOINs, CTEs, window functions & CASE WHEN',
      'Default exposure quantification ($28.2M shortfall on $65.5M charged-off funding)',
      'Credit grade risk curve analysis (5.7% Grade A to 31.3% Grade G)',
      'Loan term risk comparison showing 2× charge-offs on 60-month loans (22.3% vs. 10.7%)',
    ],
    metrics: [
      { value: '38,576', label: 'loan records analysed' },
      { value: '$28.2M', label: 'charge-off shortfall identified' },
      { value: '13.82%', label: 'charged-off loan rate' },
      { value: '+15.8%', label: 'Dec MoM collections growth' },
      { value: '15', label: 'interactive PivotTables' },
    ],
    github: 'https://github.com/giridharreddygoddilla',
    palette: { from: '#1a0d02', via: '#8a4a07', to: '#0a0806', accent: '#ffb547' },
    motif: 'shield',
  },
  {
    id: 'fake-job-detection',
    title: 'Fake Job Posting Detection (MSc Dissertation)',
    year: '2026',
    genre: 'Machine Learning • NLP • Fraud Analytics',
    logline:
      'MSc dissertation fraud-detection pipeline analysing 17,880 recruitment listings (4.84% fraud rate) with 20 engineered features, TF-IDF NLP, and LightGBM achieving 0.706 F1-score and 0.793 PR-AUC.',
    stack: ['Python', 'Scikit-learn', 'NLP', 'XGBoost', 'LightGBM'],
    build: [
      'Investigated 17,880 job postings exhibiting severe class imbalance (4.84% fraud rate) for fraud indicators across text, recruitment patterns, and missing metadata; engineered 20 domain features (textual richness, scam keywords, missing fields, writing patterns) alongside TF-IDF representations.',
      'Benchmarked LightGBM, XGBoost, SVM, and Gradient Boosting on precision, recall, F1-score, and PR-AUC to account for class imbalance, with LightGBM delivering the strongest performance (0.706 F1-score, 0.793 PR-AUC).',
    ],
    features: [
      '20 domain-engineered fraud features (textual richness, scam keywords, missing data)',
      'TF-IDF text vectorisation for recruitment listing classification',
      'Severe class-imbalance handling (4.84% fraud baseline across 17,880 records)',
      'Multi-model benchmark: LightGBM, XGBoost, SVM & Gradient Boosting',
      'Imbalance-focused evaluation via Precision, Recall, F1 (0.706) & PR-AUC (0.793)',
    ],
    metrics: [
      { value: '0.793', label: 'LightGBM PR-AUC' },
      { value: '0.706', label: 'fraud F1-score' },
      { value: '17,880', label: 'job postings analysed' },
      { value: '20', label: 'engineered fraud features' },
      { value: '4.84%', label: 'imbalanced fraud baseline' },
    ],
    github: 'https://github.com/giridharreddygoddilla/MSc-Data-Science-Project',
    palette: { from: '#2a0610', via: '#7a0f24', to: '#0b0710', accent: '#ff3d5a' },
    motif: 'shield',
  },
  {
    id: 'amazon-bestsellers-pyspark',
    title: 'Amazon Bestsellers with PySpark',
    year: '2026',
    genre: 'Big Data • PySpark • EDA & Visualisation',
    logline:
      'Distributed PySpark analytics pipeline evaluating Amazon bestselling books, historical pricing patterns, and review distributions across Fiction and Non-Fiction genres.',
    stack: ['PySpark', 'Python', 'Matplotlib', 'Seaborn'],
    build: [
      'Analysed Amazon bestseller book data using PySpark, performing distributed data loading, schema validation, missing-value checks, data cleaning, and numeric type conversion.',
      'Applied distributed aggregations to identify recurring top authors, compare Fiction and Non-Fiction ratings, and evaluate pricing and review trends across ranking years.',
      'Visualised rating distributions, price-review relationships, and genre performance using Matplotlib and Seaborn.',
    ],
    features: [
      'PySpark distributed DataFrame transformations',
      'Schema validation and numeric type coercion',
      'Fiction vs. Non-Fiction comparative analytics',
      'Price and customer review trend analysis',
    ],
    metrics: [
      { value: 'PySpark', label: 'distributed pipeline' },
      { value: '2 Genres', label: 'Fiction vs. Non-Fiction' },
      { value: 'EDA', label: 'Matplotlib & Seaborn' },
    ],
    github: 'https://github.com/giridharreddygoddilla/Amazon-Bestsellers-Analysis-with-PySpark',
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'flow',
  },
  {
    id: 'oil-price-time-series',
    title: 'Time-Series Forecasting Case Study',
    year: '2025',
    genre: 'Time-Series • ARIMA / SARIMAX • Statistical Modelling',
    logline:
      'Statistical time-series decomposition and forecasting study applying stationarity testing and ARIMA/SARIMAX modelling to analyse temporal price trends and volatility.',
    stack: ['Python', 'ARIMA', 'SARIMAX', 'Pandas', 'Statistical Modelling'],
    build: [
      'Conducted statistical time-series decomposition including stationarity validation, autocorrelation inspection, and trend-seasonality analysis.',
      'Implemented and evaluated ARIMA and SARIMAX forecasting models to examine multi-step projections across shifting volatility regimes.',
    ],
    features: [
      'Time-series stationarity & autocorrelation diagnostics',
      'ARIMA and SARIMAX model configuration',
      'Forecast accuracy evaluation across horizons',
    ],
    metrics: [
      { value: 'ARIMA', label: 'econometric baseline' },
      { value: 'SARIMAX', label: 'seasonal forecasting' },
      { value: 'Python', label: 'statistical pipeline' },
    ],
    github: 'https://github.com/giridharreddygoddilla/Time-Series-Modelling-Case-Study',
    palette: { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' },
    motif: 'flow',
  },
  {
    id: 'sales-anomaly-detection',
    title: 'Sales Clustering & Anomaly Detection',
    year: '2025',
    genre: 'Unsupervised ML • Anomaly Detection • Retail',
    logline:
      'Unsupervised clustering pipeline using Scikit-learn to isolate anomalous sales transactions and outlier clusters without relying on ground-truth labels.',
    stack: ['Python', 'Scikit-learn', 'Pandas', 'Seaborn'],
    build: [
      'Prepared scaled multi-attribute sales features to isolate behavioural transaction outliers without historical labels.',
      'Applied clustering algorithms in Scikit-learn to separate outlier clusters and highlight anomalous patterns for review.',
    ],
    features: [
      'Unsupervised behavioural outlier detection',
      'Multi-dimensional feature normalisation',
      'Visual cluster and anomaly boundary inspection',
    ],
    metrics: [
      { value: 'Unsupervised', label: 'zero-label approach' },
      { value: 'Scikit-learn', label: 'clustering pipeline' },
    ],
    github: 'https://github.com/giridharreddygoddilla/Clustering_Based_Anomaly_Detection_on_Sales_Data',
    palette: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
    motif: 'shield',
  },
];

export type Achievement = {
  id: string;
  title: string;
  org: string;
  detail: string;
  laurel: string;
  link?: string;
};

export const achievements: Achievement[] = [
  {
    id: 'msc-distinction',
    title: 'MSc Data Science (Distinction)',
    org: 'University of Hertfordshire (Hatfield, UK)',
    detail: 'Master of Science in Data Science with Distinction, including MSc Dissertation on Fake Job Posting Detection (0.793 PR-AUC with LightGBM).',
    laurel: 'Postgraduate Distinction',
  },
  {
    id: 'btech-distinction',
    title: 'B.Tech Computer Science & Engineering (Distinction)',
    org: 'Lovely Professional University (India)',
    detail: 'Graduated with Distinction in Computer Science and Engineering covering Probability & Statistics, Algorithms, DBMS, SQL, and Python.',
    laurel: 'Undergraduate Distinction',
  },
  {
    id: 'fourp-sales-impact',
    title: '14% Year-on-Year Sales Impact',
    org: 'FOURP Technology Solutions Pvt. Ltd.',
    detail: 'Delivered product-level and regional sales analytics, dimensional data warehouse models, and Power BI / Tableau KPI suites behind a 14% YoY sales increase.',
    laurel: 'Commercial Impact',
  },
  {
    id: 'victoria-analytics',
    title: '197,430-Record Food-Delivery Analytics',
    org: 'Victoria Solutions (London, UK)',
    detail: 'Analysed INR 53.01M in sales across 28 cities and delivered multi-tool Excel, Power BI, and Tableau dashboards guiding city and menu-mix strategy.',
    laurel: 'UK Industry Internship',
  },
];

export type Certification = { issuer: string; name: string; link?: string };

export const certifications: Certification[] = [
  { issuer: 'DeepLearning.AI', name: 'Supervised Machine Learning: Regression and Classification' },
  { issuer: 'DataCamp', name: 'Machine Learning, Data Science & Python Programming' },
];

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Programming Languages',
    subtitle: 'Core querying and analytical programming',
    skills: [
      { name: 'SQL (JOINs, CTEs, Window Functions, CASE WHEN)', mono: 'Sql', note: 'Primary' },
      { name: 'Python (Pandas, NumPy)', mono: 'Py', note: 'Primary' },
    ],
  },
  {
    id: 'analytics',
    title: 'Data Analytics',
    subtitle: 'Wrangling, validation & commercial analysis',
    skills: [
      { name: 'Exploratory Data Analysis (EDA)', mono: 'Eda' },
      { name: 'Data Cleaning & Validation', mono: 'Dcv' },
      { name: 'Revenue & Trend Analysis', mono: 'Rta' },
      { name: 'KPI Frameworks', mono: 'Kpi' },
      { name: 'Performance Benchmarking', mono: 'Pb' },
    ],
  },
  {
    id: 'visualisation',
    title: 'Data Visualisation & BI',
    subtitle: 'Executive reporting & interactive dashboards',
    skills: [
      { name: 'Power BI (DAX, Time Intelligence)', mono: 'Pbi', note: 'Featured' },
      { name: 'Tableau', mono: 'Tb' },
      { name: 'Advanced Excel (PivotTables, Slicers)', mono: 'Xls', note: 'Advanced' },
      { name: 'Matplotlib & Seaborn', mono: 'Plt' },
    ],
  },
  {
    id: 'engineering',
    title: 'Databases & Data Engineering',
    subtitle: 'Warehousing, modelling & distributed ETL',
    skills: [
      { name: 'ETL/ELT Pipelines', mono: 'Etl' },
      { name: 'Data Warehousing & Star-Schema Modelling', mono: 'Dwh' },
      { name: 'PySpark', mono: 'Spk', note: 'Distributed' },
      { name: 'Databricks', mono: 'Dbx' },
      { name: 'Snowflake', mono: 'Snf' },
      { name: 'Microsoft Fabric', mono: 'Fab' },
    ],
  },
  {
    id: 'ml',
    title: 'Machine Learning & Statistics',
    subtitle: 'Classification, NLP & time-series modelling',
    skills: [
      { name: 'Scikit-learn', mono: 'Skl' },
      { name: 'LightGBM & XGBoost', mono: 'Lgb' },
      { name: 'SVM & Gradient Boosting', mono: 'Svm' },
      { name: 'NLP (TF-IDF)', mono: 'Nlp' },
      { name: 'Time-Series Forecasting (ARIMA, SARIMAX)', mono: 'Ts' },
    ],
  },
  {
    id: 'tools',
    title: 'Development Tools',
    subtitle: 'Version control, notebooks & deployment',
    skills: [
      { name: 'Git & GitHub', mono: 'Git' },
      { name: 'Jupyter Notebook', mono: 'Jup' },
      { name: 'Streamlit', mono: 'Str' },
    ],
  },
];

export const skillEvidence: Record<string, string[]> = {
  'SQL (JOINs, CTEs, Window Functions, CASE WHEN)': [
    'FOURP Technology Solutions (ETL Pipelines & Warehousing)',
    'Bank Loan & Credit Risk Analysis (38,576 Loans)',
  ],
  'Python (Pandas, NumPy)': [
    'Fake Job Posting Detection (MSc Dissertation)',
    '180K+ Order-Line Pandas Data Cleaning Workflows',
    'Amazon Bestsellers PySpark & EDA',
  ],
  'Power BI (DAX, Time Intelligence)': [
    'FOURP Technology Solutions (14% YoY Sales Increase)',
    'Uber Trip Analysis (3-Page Star-Schema Report, $1.55M)',
    'Victoria Solutions (London, UK)',
  ],
  Tableau: [
    'FOURP Technology Solutions (KPI Benchmarking Dashboards)',
    'Victoria Solutions (Food-Delivery Dashboards)',
  ],
  'Advanced Excel (PivotTables, Slicers)': [
    'Victoria Solutions (197,430 Orders, 8 PivotTables, 10 Charts, 3 Slicers)',
    'Bank Loan & Credit Risk Analysis (15 PivotTables, 5 MTD/MoM KPI Cards)',
  ],
  'ETL/ELT Pipelines': [
    'FOURP Technology Solutions (End-to-End SQL & PySpark ETL)',
  ],
  'Data Warehousing & Star-Schema Modelling': [
    'FOURP Technology Solutions (Fact & Dimension Tables)',
    'Uber Trip Analysis (Power BI Star Schema)',
  ],
  PySpark: [
    'FOURP Technology Solutions (Distributed E-Commerce ETL)',
    'Amazon Bestsellers with PySpark',
    'MSc Data Science Coursework (University of Hertfordshire)',
  ],
  'Scikit-learn': [
    'Fake Job Posting Detection (MSc Dissertation)',
    'Sales Clustering & Anomaly Detection',
  ],
  'LightGBM & XGBoost': [
    'Fake Job Posting Detection (0.706 F1, 0.793 PR-AUC)',
  ],
  'NLP (TF-IDF)': [
    'Fake Job Posting Detection (20 Engineered Features + TF-IDF)',
  ],
  'Time-Series Forecasting (ARIMA, SARIMAX)': [
    'Time-Series Forecasting Case Study',
  ],
  'Git & GitHub': [
    'github.com/giridharreddygoddilla',
    'Open-source portfolio & MSc dissertation repositories',
  ],
};

export type Episode = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
  palette: Palette;
};

export type Season = {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  episodes: Episode[];
};

const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const amber: Palette = { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' };
const violet: Palette = { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' };
const jade: Palette = { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' };

export const seasons: Season[] = [
  {
    number: 1,
    title: 'The Foundation',
    period: '2019 – 2023',
    synopsis: 'Bachelor of Technology in Computer Science and Engineering (Distinction) at Lovely Professional University, building strong foundations in Probability, Algorithms, SQL, and Python.',
    episodes: [
      {
        code: 'S01 E01',
        title: 'Computer Science Roots',
        description: 'B.Tech in Computer Science and Engineering (Distinction) — mastering Probability & Statistics, Data Structures & Algorithms, DBMS, SQL, Python, and Data Science.',
        tags: ['B.Tech CSE', 'Distinction', 'SQL', 'Python'],
        runtime: 'Aug 2019 – Aug 2023',
        palette: amber,
      },
      {
        code: 'S01 E02',
        title: 'Engineering & ETL at Scale',
        description: 'Software Engineer at FOURP Technology Solutions Pvt. Ltd. — engineering SQL & PySpark ETL pipelines, dimensional data warehouse models, and Power BI / Tableau KPI frameworks behind a 14% YoY sales increase.',
        tags: ['FOURP Solutions', '14% YoY Sales', 'SQL & PySpark', 'Power BI'],
        runtime: 'Jun 2022 – Aug 2024',
        palette: ocean,
      },
    ],
  },
  {
    number: 2,
    title: 'The UK Master’s Arc',
    period: '2024 – 2026',
    synopsis: 'Master of Science in Data Science (Distinction) at the University of Hertfordshire (UK) — advancing across Data Analytics, Statistical Modelling, Data Mining, Machine Learning, and PySpark.',
    episodes: [
      {
        code: 'S02 E01',
        title: 'Hatfield Calling',
        description: 'Pursued MSc Data Science (Distinction) at the University of Hertfordshire covering Statistical Modelling, Database Management, Machine Learning, and PySpark.',
        tags: ['MSc Data Science', 'Distinction', 'University of Hertfordshire'],
        runtime: 'Sep 2024 – Sep 2026',
        palette: violet,
      },
      {
        code: 'S02 E02',
        title: 'Distributed Compute',
        description: 'Built distributed PySpark analytics pipelines and expanded into modern cloud data platforms including Databricks, Snowflake, and Microsoft Fabric.',
        tags: ['PySpark', 'Databricks', 'Snowflake', 'Microsoft Fabric'],
        runtime: '2025',
        palette: jade,
      },
    ],
  },
  {
    number: 3,
    title: 'Industry Impact in London',
    period: 'Oct – Nov 2025',
    synopsis: 'Data Analyst Intern at Victoria Solutions in London — cleaning 197,430 food-delivery orders and analysing INR 53.01M in sales across 28 cities.',
    episodes: [
      {
        code: 'S03 E01',
        title: 'Data Quality First',
        description: 'Cleaned and validated 197,430 food-delivery order records using Excel formulas and filters before conducting multi-city revenue analysis.',
        tags: ['Victoria Solutions', 'London, UK', '197,430 Records'],
        runtime: 'Oct 2025',
        palette: ocean,
      },
      {
        code: 'S03 E02',
        title: '28-City Strategy & Dashboards',
        description: 'Identified that 5 cities drive 32.9% of INR 53.01M sales, established flat daily demand (INR 212K–224K), and built Excel, Power BI, and Tableau dashboards (8 PivotTables, 10 charts, 3 slicers).',
        tags: ['INR 53.01M Sales', 'Power BI', 'Tableau', 'Excel'],
        runtime: 'Oct – Nov 2025',
        palette: amber,
      },
    ],
  },
  {
    number: 4,
    title: 'The Flagship Originals',
    period: '2024 – 2026',
    synopsis: 'High-impact portfolio solutions across mobility BI, bank credit risk, and imbalanced fraud detection.',
    episodes: [
      {
        code: 'S04 E01',
        title: 'Uber Trip Intelligence',
        description: 'Three-page Power BI star-schema dashboard analysing 103,728 bookings ($1.55M), proving UberX leads volume (37.4%) with ~$15 average fare across all five tiers.',
        tags: ['Power BI', 'Star Schema', 'DAX', '103K Bookings'],
        runtime: '2024',
        palette: ocean,
      },
      {
        code: 'S04 E02',
        title: 'Credit Risk & Loan Recovery',
        description: 'Analysed 38,576 bank loans ($65.5M funded) with 15 PivotTables and SQL, quantifying a $28.2M charge-off shortfall and recommending tighter underwriting for Grades E–G and 60-month terms.',
        tags: ['SQL', 'Excel', 'Credit Risk', '38.5K Loans'],
        runtime: '2025',
        palette: amber,
      },
      {
        code: 'S04 E03',
        title: 'Fake Job Detection Dissertation',
        description: 'MSc dissertation analysing 17,880 postings (4.84% fraud) with 20 engineered features + TF-IDF; LightGBM achieved 0.706 F1-score and 0.793 PR-AUC.',
        tags: ['LightGBM', 'NLP', '0.793 PR-AUC', 'MSc Dissertation'],
        runtime: '2026',
        palette: crimson,
      },
    ],
  },
  {
    number: 5,
    title: "What's Next",
    period: 'UK Right to Work (2-Year Visa)',
    synopsis: 'Ready to contribute as a Data Analyst turning complex datasets into clear revenue, demand, and credit-risk decisions across the United Kingdom.',
    episodes: [
      {
        code: 'S05 E01',
        title: 'The Next Breakthrough',
        description: 'Combining 2+ years of engineering and BI reporting with MSc Data Science (Distinction) to deliver measurable commercial impact.',
        tags: ['UK Right to Work', 'Data Analyst', 'SQL & Power BI'],
        runtime: 'Available Now',
        palette: jade,
      },
    ],
  },
];

export type TopPick = { label: string; title: string; detail: string; palette: Palette };

export const topPicks: TopPick[] = [
  { label: 'Commercial impact', title: '+14% YoY Sales', detail: 'FOURP Technology Solutions • Product & regional analytics', palette: crimson },
  { label: 'Academic high', title: 'MSc Data Science', detail: 'University of Hertfordshire (UK) • Distinction (2024–2026)', palette: violet },
  { label: 'Scale analysed', title: '339K+ Records', detail: 'Food-delivery sales, Uber bookings & bank loan portfolios', palette: ocean },
  { label: 'MSc Dissertation', title: '0.793 PR-AUC', detail: 'Fake Job Detection with LightGBM, NLP & 20 engineered features', palette: crimson },
  { label: 'Credit Risk Suite', title: '$28.2M Shortfall', detail: 'Bank Loan & Credit Risk Analysis across 38,576 loans in SQL & Excel', palette: amber },
  { label: 'Uber BI Suite', title: '103,728 Bookings', detail: '3-Page Power BI Star-Schema Report ($1.55M fare value)', palette: ocean },
  { label: 'London Internship', title: 'INR 53.01M Sales', detail: 'Victoria Solutions • 197,430 orders across 28 cities', palette: jade },
  { label: 'Modern Data Stack', title: 'ETL & Warehousing', detail: 'SQL, PySpark, Databricks, Snowflake & Microsoft Fabric', palette: violet },
  { label: 'Certifications', title: 'DeepLearning.AI', detail: 'Supervised ML + DataCamp Python & Data Science', palette: amber },
  { label: 'Availability', title: 'UK Right to Work', detail: '2-Year Visa • Based in Luton, UK • Data Analyst Roles', palette: jade },
];

export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export const introSlides: IntroSlide[] = [
  {
    kicker: 'Education',
    title: 'MSc · Data Science (Distinction)',
    lines: ['University of Hertfordshire, Hatfield, UK', 'Sep 2024 – Sep 2026 · B.Tech CSE (Distinction)'],
    chips: ['MSc Distinction', 'UK Right to Work (2-Year Visa)'],
  },
  {
    kicker: 'Core Stack',
    title: 'SQL, Power BI, Python & ETL.',
    lines: ['SQL (CTEs, Window Functions) · Python (Pandas, NumPy) · Power BI (DAX) · Tableau', 'PySpark · Databricks · Snowflake · Microsoft Fabric · Scikit-learn · LightGBM'],
    chips: ['SQL', 'Power BI', 'Python', 'PySpark', 'Databricks', 'Snowflake'],
  },
  {
    kicker: 'Commercial Impact',
    title: '14% YoY Sales Growth',
    lines: ['FOURP Technology Solutions · Software Engineer (Jun 2022 – Aug 2024)', 'Victoria Solutions (London) · Data Analyst Intern (Oct – Nov 2025)', '339K+ records analysed across food delivery, Uber bookings & bank loans'],
  },
  {
    kicker: 'Flagship Projects',
    title: 'Revenue, Risk & Fraud',
    lines: [
      'Uber Trip Analysis — 103,728 bookings ($1.55M) in 3-page Power BI star schema',
      'Bank Loan & Credit Risk — 38,576 loans ($65.5M funded), $28.2M charge-off shortfall',
      'Fake Job Detection (MSc) — 17,880 postings, LightGBM 0.706 F1 & 0.793 PR-AUC',
    ],
  },
  {
    kicker: 'Current Mission',
    title: 'Ready in the UK',
    lines: ['Holds UK right to work (2-year visa) · Seeking Data Analyst roles'],
  },
];

export type ProfileId = 'giridhar' | 'recruiter' | 'creative';
export type SectionId = 'about' | 'portrait' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';

export const viewerProfiles: {
  id: ProfileId;
  name: string;
  blurb: string;
  color: string;
  order: SectionId[];
}[] = [
  {
    id: 'giridhar',
    name: 'PERSONAL',
    blurb: 'The person behind it all.',
    color: '#E50920',
    order: ['about', 'portrait', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'],
  },
  {
    id: 'recruiter',
    name: 'PROFESSIONAL',
    blurb: 'The ambition behind the work.',
    color: '#4cc9ff',
    order: ['story', 'moments', 'skills', 'originals', 'portrait', 'about', 'journey', 'picks'],
  },
  {
    id: 'creative',
    name: 'CREATIVE',
    blurb: 'The imagination behind the ideas.',
    color: '#ffb547',
    order: ['portrait', 'journey', 'picks', 'originals', 'moments', 'about', 'skills', 'story'],
  },
];

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'About', card: 'About Me', meta: 'The Pilot • Education & background', palette: violet },
  portrait: { nav: 'Identity', card: 'Personal Portrait', meta: 'Cinematic visual identity', palette: crimson },
  journey: { nav: 'Journey', card: 'My Journey', meta: `${seasons.length} Seasons • ${seasons.reduce((n, s) => n + s.episodes.length, 0)} Episodes`, palette: amber },
  originals: { nav: 'Originals', card: 'Featured Projects', meta: `${projects.length} Originals • BI, Credit Risk & ML`, palette: crimson },
  picks: { nav: 'Top Picks', card: 'Top 10 Picks', meta: 'Top 10 career highlights', palette: jade },
  skills: { nav: 'Skills', card: 'Skill Universe', meta: `${skillCategories.length} Categories • Verified with evidence`, palette: ocean },
  moments: { nav: 'Moments', card: 'Achievements', meta: `${achievements.length} Highlights • ${certifications.length} Certifications`, palette: crimson },
  story: { nav: 'Resume', card: 'The Full Story', meta: 'ATS PDF • Premium PDF • Editable DOCX', palette: violet },
};
