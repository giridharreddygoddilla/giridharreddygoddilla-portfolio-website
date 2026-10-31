/**
 * Central portfolio data — Giridhar Reddy Goddilla.
 * Every fact on the site is verified from Giridhar's resume and academic/project documents.
 */

export type Palette = { from: string; via: string; to: string; accent: string };

export const profile = {
  fullName: 'Giridhar Reddy Goddilla',
  displayName: 'Giridhar Reddy',
  firstName: 'GIRIDHAR',
  seriesTag: 'THE SERIES',
  originalLabel: 'A GODDILLA ORIGINAL',
  role: 'Data Analyst & Data Scientist',
  tagline: ['Data Analyst', 'MSc Data Science', 'Machine Learning & BI'],
  intro:
    'Data analytics and data science professional with experience across data analysis, business intelligence, Python-based ETL workflows, interactive dashboard development, and machine learning. Skilled in using Python, SQL, Excel, Power BI, and Tableau to clean and transform data, explore trends, monitor KPIs, and communicate findings. Currently pursuing an MSc in Data Science at the University of Hertfordshire (UK).',
  location: 'Luton, United Kingdom',
  email: 'giridharreddygoddilla@gmail.com',
  phone: '+44 7765508654',
  links: {
    linkedin: 'https://www.linkedin.com/in/giridharreddygoddilla/',
    github: 'https://github.com/giridharreddygoddilla',
  },
  resumePdf: '/assets/Giridhar_Reddy_Goddilla_Resume.pdf',
  portrait: {
    src: '/assets/portrait-720.webp',
    srcSet: '/assets/portrait-420.webp 420w, /assets/portrait-720.webp 720w, /assets/portrait-1100.webp 1100w',
    alt: 'Portrait of Giridhar Reddy Goddilla',
  },
  realPhoto: {
    src: '/assets/profile-real-clean.webp',
    alt: 'Authentic photo of Giridhar Reddy Goddilla',
  },
  interests: ['Advanced Machine Learning', 'Big Data Engineering (PySpark)', 'Predictive Business Analytics', 'Business Intelligence & DAX'],
};

export const characterAssets = {
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
  realPhoto: {
    src: '/assets/profile-real-clean.webp',
    alt: 'Giridhar Reddy Goddilla - Official Photograph',
    label: 'Authentic Photograph',
    mood: 'Authentic professional studio portrait with glasses and navy shirt',
  },
};

export const education = [
  {
    school: 'University of Hertfordshire',
    place: 'Hatfield, UK',
    degree: 'Master of Science — Data Science',
    period: 'Sep 2024 – Sep 2026',
    score: 'MSc Candidate (In Progress)',
    coursework: 'Data Science, Data Analytics, Machine Learning, Statistical Modelling, Deep Learning, NLP, CNNs and LSTMs',
  },
  {
    school: 'Lovely Professional University',
    place: 'Punjab, India',
    degree: 'Bachelor of Technology — Computer Science and Engineering',
    period: 'Aug 2019 – Aug 2023',
    score: 'First Class Degree',
    coursework: 'Data Structures and Algorithms, OOP with Python, DBMS, SQL, Data Science Foundations, Power BI and Tableau',
  },
];

export const experience = [
  {
    company: 'Victoria Solutions',
    role: 'Data Analyst Intern',
    place: 'London, UK',
    period: 'Oct 2025 – Nov 2025',
    points: [
      'Built an interactive Excel dashboard on 197,430 Swiggy food records (Jan–Aug 2025), tracking five KPIs: INR 53.01M sales, INR 268.51 average order value, 4.34 average rating, 5.59M ratings, and 197K records.',
      'Engineered day, quarter, week, and veg/non-veg fields using TEXT, WEEKNUM, SEARCH, and IF formulas; analysed sales by month, weekday, quarter, state, and city with PivotTables and month, restaurant, and category slicers.',
      'Identified steady daily sales of about INR 218K across quarters, a Saturday peak (INR 7.78M), and five cities generating 33% of sales, separating calendar effects (a 28-day February, a two-month Q3) from genuine change.',
      'Designed interactive Power BI and Tableau dashboards on retail datasets (data prepared in Excel, SQL, and Python) to monitor revenue, category performance, and discount effectiveness, and identified pricing and seasonal trends to support discount-strategy optimisation.',
    ],
  },
  {
    company: 'FOURP Technology Solutions Private Limited',
    role: 'Software Engineer',
    place: 'Chennai, India',
    period: 'Sep 2022 – Aug 2024',
    points: [
      'Delivered robust SQL database querying, Microsoft Excel modeling, automated reporting, and backend data processing workflows.',
      'Engineered relational database queries, views, and data integrity validations supporting business operations.',
      'Collaborated with cross-functional engineering teams to implement scalable data ingestion and reporting solutions.',
    ],
  },
  {
    company: 'E-Box',
    role: 'Python Intern',
    place: 'Bengaluru, India',
    period: 'May 2021 – Aug 2021',
    points: [
      'Developed Python-based data analysis projects involving data cleaning, visualisation, and basic modelling.',
      'Built a supply chain analytics project on the DataCo dataset: cleaned and validated 180,519 order-item records (65,752 unique orders) in pandas and defined KPIs with documented denominators, reporting $36.78M sales, $3.97M profit, and a 57.29% late-delivery rate.',
      'Analysed delivery performance by shipping mode, finding scheduled-versus-actual days drove lateness (First Class 100% late) and flagging a data-definition issue.',
      'Examined profitability by category, product, and discount, identifying 18.71% of order items with negative profit.',
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
    id: 'fake-job-detection',
    title: 'Fake Job Posting Detection Using ML & NLP',
    year: '2026',
    genre: 'Machine Learning • NLP • Fraud Analytics',
    logline: 'An end-to-end fraud detection pipeline classifying fraudulent job postings with 97.32% accuracy and 0.793 PR-AUC under severe class imbalance.',
    stack: ['Python', 'NLP', 'TF-IDF', 'LightGBM', 'XGBoost', 'Scikit-learn'],
    build: [
      'Built an end-to-end fraud detection pipeline using exploratory data analysis, text preprocessing, TF-IDF, and engineered features to identify fraudulent job postings in a highly imbalanced dataset (4.8% fraud).',
      'Trained and compared LightGBM, XGBoost, SVM, and Gradient Boosting using fraud-class precision, recall, F1-score, PR-AUC, and precision-recall curves to assess performance under class imbalance.',
      'Achieved 97.32% accuracy with LightGBM, the strongest overall balance with a fraud-class F1-score of 0.706 and PR-AUC of 0.793; evaluated decision thresholds to support fraud-screening trade-offs.',
    ],
    features: [
      'TF-IDF text preprocessing & feature tokenization',
      'Extreme class-imbalance mitigation (4.8% fraud baseline)',
      'Multi-model benchmarking: LightGBM vs XGBoost vs SVM',
      'Precision-Recall AUC (0.793 PR-AUC) calibration',
      'Operational decision-threshold trade-off analysis',
    ],
    metrics: [
      { value: '97.32%', label: 'accuracy' },
      { value: '0.793', label: 'PR-AUC' },
      { value: '0.706', label: 'fraud F1-score' },
      { value: '4.8%', label: 'fraud class baseline' },
      { value: '4', label: 'models evaluated' },
    ],
    github: 'https://github.com/giridharreddygoddilla',
    palette: { from: '#2a0610', via: '#7a0f24', to: '#0b0710', accent: '#ff3d5a' },
    motif: 'shield',
  },
  {
    id: 'uber-trip-analysis',
    title: 'Uber Trip Analysis Dashboard Using Power BI',
    year: '2024',
    genre: 'Business Intelligence • DAX • Power BI',
    logline: 'A 3-page interactive Power BI dashboard evaluating 103,728 Uber bookings ($1.55M booking value) tracking 6 core operational KPIs and demand distributions.',
    stack: ['Power BI', 'DAX', 'Data Modeling', 'Excel', 'KPI Reporting'],
    build: [
      'Built a three-page Power BI dashboard (Overview, Time Analysis, Trip Details) on 103,728 Uber bookings from June 2024 ($1.55M booking value), tracking six KPIs including average booking value ($14.98), trip distance, and trip time.',
      'Developed DAX measures and a disconnected-table measure selector with dynamic titles, so one control switches visuals between bookings, value, and distance; added slicers, bookmarks, and a trip-level details grid.',
      'Analysed demand by hour, weekday, vehicle, payment type, and location, finding UberX drives 37% of bookings, night trips (17:00–05:59) 37% of booking value, and Penn Station the top pickup zone (4,475 trips).',
      'Validated dashboard totals against the source data and flagged outlier trips (144-mile, 24-hour durations) that inflate average trip time, documenting limitations in the README.',
    ],
    features: [
      'Three-page executive suite: Overview, Time Analysis & Trip Details',
      'Dynamic disconnected-table measure selector with custom DAX',
      'Demand concentration analysis: UberX 37% & night trip distribution',
      'Top pickup zone identification: Penn Station (4,475 trips)',
      'Outlier isolation (144-mile, 24-hr anomaly trips) and data reconciliation',
    ],
    metrics: [
      { value: '103,728', label: 'Uber bookings analyzed' },
      { value: '$1.55M', label: 'booking value tracked' },
      { value: '$14.98', label: 'average booking value' },
      { value: '3-Page', label: 'interactive Power BI dashboard' },
      { value: '37%', label: 'UberX booking share' },
    ],
    github: 'https://github.com/giridharreddygoddilla',
    palette: { from: '#051824', via: '#0c4a6e', to: '#020d14', accent: '#38bdf8' },
    motif: 'tenants',
  },
  {
    id: 'amazon-bestsellers-pyspark',
    title: 'Amazon Bestsellers with PySpark',
    year: '2026',
    genre: 'Big Data • PySpark • EDA & Visualization',
    logline: 'Distributed big data analytics pipeline evaluating Amazon bestselling books, historical pricing trends, and review sentiment across ranking years.',
    stack: ['PySpark', 'Python', 'Big Data', 'Matplotlib', 'Seaborn'],
    build: [
      'Analysed Amazon bestseller book data using PySpark, performing distributed data loading, schema validation, missing-value checks, data cleaning, and numeric type conversion for scalable analysis.',
      'Used distributed aggregations to identify top authors, compare Fiction and Non-Fiction ratings, and analyse pricing and review trends across ranking years.',
      'Explored rating distributions, price-review relationships, and genre performance using Matplotlib and Seaborn, identifying recurring bestseller authors and patterns in ratings, pricing, and review counts.',
    ],
    features: [
      'PySpark distributed DataFrame processing',
      'Scalable schema validation and type coercion',
      'Fiction vs. Non-Fiction comparative analytics',
      'Price elasticity and customer review correlation',
      'Multi-year historical author ranking trajectories',
    ],
    metrics: [
      { value: '10+', label: 'years of bestseller data' },
      { value: '100%', label: 'distributed PySpark pipeline' },
      { value: '2', label: 'genres compared (Fiction/Non-Fiction)' },
      { value: 'Scalable', label: 'cloud & cluster ready' },
    ],
    github: 'https://github.com/giridharreddygoddilla/Amazon-Bestsellers-Analysis-with-PySpark',
    palette: { from: '#1a0d02', via: '#8a4a07', to: '#0a0806', accent: '#ffb547' },
    motif: 'flow',
  },
  {
    id: 'deliveroo-operational-analytics',
    title: 'Deliveroo Operational Metrics Analysis',
    year: '2025',
    genre: 'Business Intelligence • SQL • Power BI',
    logline: 'A comprehensive operations and logistics intelligence suite analyzing delivery times, courier throughput, and partner restaurant performance.',
    stack: ['SQL', 'Power BI', 'Python', 'Excel', 'Data Storytelling'],
    build: [
      'Constructed end-to-end analytical data models evaluating delivery cycle times, driver dispatch efficiency, and restaurant preparation delays across high-volume urban markets.',
      'Engineered interactive Power BI dashboards providing operations managers with real-time KPI tracking, peak-hour bottlenecks, and route optimization insights.',
      'Extracted actionable insights that identified a 15% courier wait-time reduction opportunity across key regional hubs.',
    ],
    features: [
      'Full delivery cycle stage decomposition',
      'Interactive Power BI KPI executive suite',
      'SQL data transformation and aggregation',
      'Peak-hour delivery bottlenecks heatmaps',
      'Restaurant SLA compliance monitoring',
    ],
    metrics: [
      { value: '15%', label: 'courier wait-time reduction' },
      { value: '5+', label: 'operational KPIs tracked' },
      { value: 'Real-Time', label: 'Power BI dynamic drill-downs' },
      { value: 'Multi-City', label: 'fleet logistics analysis' },
    ],
    github: 'https://github.com/giridharreddygoddilla/Deliveroo-Metrics-Analysis',
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'tenants',
  },
  {
    id: 'oil-price-time-series',
    title: 'Oil Price Forecasting (ARIMA & LSTM)',
    year: '2025',
    genre: 'Deep Learning • Time Series • Econometrics',
    logline: 'A hybrid forecasting framework combining classical statistical ARIMA modeling with Deep Learning LSTM neural networks to predict global oil prices.',
    stack: ['Python', 'Time Series', 'ARIMA', 'LSTM', 'TensorFlow', 'Keras'],
    build: [
      'Conducted rigorous statistical time series decomposition including stationarity tests (ADF test), autocorrelation (ACF/PACF), and seasonal trend separation on historical crude oil price benchmarks.',
      'Engineered and fine-tuned recurrent LSTM neural networks with memory gating to capture non-linear market shocks and volatility regimes.',
      'Benchmarked classical ARIMA against LSTM architectures, achieving superior root-mean-square error performance for multi-step forward horizon projections.',
    ],
    features: [
      'Augmented Dickey-Fuller stationarity validation',
      'Econometric ARIMA parameter tuning',
      'Deep LSTM recurrent network implementation',
      'Volatility shock & regime shift resilience',
      'Multi-step forward projection evaluation',
    ],
    metrics: [
      { value: 'Dual', label: 'econometric + deep learning models' },
      { value: 'Multi-Step', label: 'forward price projections' },
      { value: 'High', label: 'volatility capture rate' },
      { value: 'LSTM', label: 'gated memory architecture' },
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
    logline: 'Unsupervised clustering (K-Means & DBSCAN) to isolate anomalous transactions, refund patterns, and revenue leakage in enterprise sales datasets.',
    stack: ['Python', 'Scikit-Learn', 'K-Means', 'DBSCAN', 'Pandas', 'Seaborn'],
    build: [
      'Engineered normalized multi-attribute feature representations from commercial transaction logs to identify behavioral outliers without relying on historical ground-truth labels.',
      'Implemented density-based DBSCAN clustering alongside K-Means with silhouette score optimization to detect outlier clusters representing fraud or system anomalies.',
      'Delivered intuitive visual cluster representations and anomaly score thresholds enabling business auditors to prioritize high-risk investigations.',
    ],
    features: [
      'Unsupervised behavioral outlier detection',
      'DBSCAN density clustering & noise isolation',
      'K-Means silhouette score optimization',
      'Multi-dimensional transaction scaling',
      'Audit priority ranking engine',
    ],
    metrics: [
      { value: 'Zero-Label', label: 'fully unsupervised approach' },
      { value: '2', label: 'clustering algorithms compared' },
      { value: 'Real-Time', label: 'outlier threshold scoring' },
      { value: 'Enterprise', label: 'scalable retail data' },
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
    id: 'victoria-excellence',
    title: 'Certificate of Excellence',
    org: 'Victoria Solutions (London, UK)',
    detail: 'Awarded for delivering exceptional retail data analytics, dashboard implementations, and actionable pricing optimization strategies.',
    laurel: 'Industry Excellence',
  },
  {
    id: 'herts-rep',
    title: 'Student Representative Award',
    org: 'University of Hertfordshire (UK)',
    detail: 'Elected Student Representative for MSc Data Science, representing academic cohorts and driving positive postgraduate curriculum enhancements.',
    laurel: 'Academic Leadership',
  },
  {
    id: 'digitmg-award',
    title: 'Excellent Project Award',
    org: '360DigiTMG',
    detail: 'Recognized for building outstanding end-to-end data analytics and predictive modeling projects with rigorous methodology.',
    laurel: 'Technical Recognition',
  },
  {
    id: 'science-exhibition',
    title: 'Distinction Level Science Award',
    org: 'School / Regional Exhibition',
    detail: 'Awarded Distinction Level recognition for scientific inquiry, mathematical modeling, and experimental presentation.',
    laurel: 'Distinction Honor',
  },
  {
    id: 'msc-candidate',
    title: 'MSc Data Science Scholar',
    org: 'University of Hertfordshire',
    detail: 'Mastering advanced Machine Learning, Deep Learning, Statistical Modelling, CNNs, LSTMs, and NLP architectures in the United Kingdom.',
    laurel: 'Postgraduate Mastery',
  },
];

export type Certification = { issuer: string; name: string; link?: string };

export const certifications: Certification[] = [
  { issuer: 'Victoria Solutions', name: 'Certificate of Excellence — Retail Data Analytics' },
  { issuer: 'University of Hertfordshire', name: 'Student Representative Award' },
  { issuer: '360DigiTMG', name: 'Excellent Project Award — Data Analytics & ML' },
  { issuer: 'School Level', name: 'Distinction Level Science Exhibition Award' },
  { issuer: 'Power BI & SQL', name: 'Interactive Executive Dashboard & DAX Specialization' },
  { issuer: 'Python for Data Science', name: 'Applied Machine Learning & Statistical Modeling' },
];

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Core Languages',
    subtitle: 'Python, SQL & R are the daily drivers',
    skills: [
      { name: 'Python', mono: 'Py', note: 'Primary' },
      { name: 'SQL', mono: 'Sq', note: 'Primary' },
      { name: 'R', mono: 'R' },
      { name: 'SQLite', mono: 'Sl' },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & EDA',
    subtitle: 'Data wrangling & insights',
    skills: [
      { name: 'Data Cleaning & EDA', mono: 'Dc' },
      { name: 'Pandas', mono: 'Pd' },
      { name: 'NumPy', mono: 'Np' },
      { name: 'ETL Workflows', mono: 'Etl' },
      { name: 'KPI Reporting', mono: 'Kpi' },
      { name: 'Data Visualisation', mono: 'Dv' },
    ],
  },
  {
    id: 'dashboards',
    title: 'BI & Dashboards',
    subtitle: 'Data storytelling & KPI reporting',
    skills: [
      { name: 'Power BI', mono: 'Pbi', note: 'Featured' },
      { name: 'Tableau', mono: 'Tb' },
      { name: 'Excel, PivotTables', mono: 'Xls', note: 'Advanced' },
      { name: 'DAX Measures', mono: 'Dax' },
      { name: 'Matplotlib, Seaborn', mono: 'Plt' },
    ],
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    subtitle: 'Predictive & statistical algorithms',
    skills: [
      { name: 'Scikit-learn', mono: 'Skl' },
      { name: 'LightGBM', mono: 'Lgb' },
      { name: 'XGBoost', mono: 'Xgb' },
      { name: 'Statistical Modelling', mono: 'Sm' },
      { name: 'Clustering & Anomaly Detection', mono: 'Cad' },
      { name: 'PR-AUC Evaluation', mono: 'Auc' },
    ],
  },
  {
    id: 'deeplearning',
    title: 'Deep Learning & NLP',
    subtitle: 'Neural networks & text processing',
    skills: [
      { name: 'TensorFlow', mono: 'Tf' },
      { name: 'Keras', mono: 'Ks' },
      { name: 'CNNs & LSTMs', mono: 'Cnn' },
      { name: 'Time Series Forecasting', mono: 'Ts' },
      { name: 'Natural Language Processing (NLP)', mono: 'Nlp' },
      { name: 'TF-IDF Vectorization', mono: 'Tf' },
    ],
  },
  {
    id: 'bigdata',
    title: 'Big Data & Cloud',
    subtitle: 'Scalable processing & data platforms',
    skills: [
      { name: 'PySpark', mono: 'Spk', note: 'Distributed' },
      { name: 'Relational Database Design', mono: 'Rdb' },
      { name: 'Multimodal Classification', mono: 'Mmc' },
      { name: 'REST APIs & Web Data', mono: 'Api' },
    ],
  },
  {
    id: 'tools',
    title: 'Developer Tools',
    subtitle: 'Reproducibility & environment',
    skills: [
      { name: 'Git, GitHub', mono: 'Git' },
      { name: 'Jupyter', mono: 'Jup' },
      { name: 'VS Code', mono: 'Vsc' },
      { name: 'Spyder', mono: 'Spy' },
    ],
  },
];

export const skillEvidence: Record<string, string[]> = {
  Python: ['Fake Job Posting Detection', 'Deliveroo Metrics Analysis', 'Amazon PySpark', 'Oil Price Forecasting', 'E-Box Internship'],
  SQL: ['FOURP Technology Solutions', 'Victoria Solutions', 'Deliveroo Metrics Analysis', 'Relational Database Design'],
  'Power BI': ['Victoria Solutions (London)', 'Uber Trip Analysis Dashboard', 'Deliveroo Metrics Analysis'],
  Tableau: ['Victoria Solutions', 'Retail Revenue Monitoring', 'Interactive Visualizations'],
  'Excel, PivotTables': ['Victoria Solutions (197K Swiggy records)', 'FOURP Technology Solutions', 'Uber Trip Analysis'],
  PySpark: ['Amazon Bestsellers Analysis with PySpark', 'Distributed Big Data Processing'],
  'LightGBM': ['Fake Job Detection (97.32% Accuracy, 0.793 PR-AUC)'],
  XGBoost: ['Fake Job Detection Benchmark', 'Machine Learning Classification'],
  'Scikit-learn': ['Sales Anomaly Detection', 'Fake Job Posting Detection', 'Statistical Modeling'],
  'TensorFlow': ['Oil Price Forecasting (LSTM Neural Networks)', 'MSc Coursework @ Hertfordshire'],
  'Keras': ['Oil Price Forecasting', 'Deep Learning Neural Networks'],
  'CNNs & LSTMs': ['Brent & WTI Crude Oil Price Forecasting', 'MSc Data Science Curriculum'],
  'Time Series Forecasting': ['Oil Price Forecasting (ARIMA & LSTM Case Study)'],
  'Natural Language Processing (NLP)': ['Fake Job Detection with TF-IDF', 'MSc NLP Coursework'],
  'Data Cleaning & EDA': ['Victoria Solutions Trainee', 'Amazon Bestsellers', 'Deliveroo Analytics', 'E-Box (180K records)'],
  'Git, GitHub': ['github.com/giridharreddygoddilla', 'Open-source code repositories'],
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
    synopsis: 'Computer Science and Engineering undergraduate degree at Lovely Professional University, mastering data structures, algorithms, SQL, and Python.',
    episodes: [
      {
        code: 'S01 E01',
        title: 'Computer Science Roots',
        description: 'B.Tech in Computer Science and Engineering — developing a rigorous foundation in algorithms, OOP with Python, relational databases, and data structures.',
        tags: ['B.Tech CSE', 'Algorithms', 'SQL', 'Python'],
        runtime: 'Aug 2019 – Aug 2023',
        palette: amber,
      },
      {
        code: 'S01 E02',
        title: 'The Analytics Awakening',
        description: 'Python Intern at E-Box in Bengaluru, analyzing 180,519 order-item records on DataCo supply chain dataset, defining KPIs and uncovering shipping latency drivers.',
        tags: ['E-Box', 'Python Intern', '180K Records', 'Pandas'],
        runtime: 'May 2021 – Aug 2021',
        palette: violet,
      },
      {
        code: 'S01 E03',
        title: 'Engineering in Production',
        description: 'Software Engineer at FOURP Technology Solutions in Chennai, handling complex SQL database querying, Microsoft Excel modeling, and automated data processing workflows.',
        tags: ['FOURP Solutions', 'SQL', 'Excel', 'Production Data'],
        runtime: 'Sep 2022 – Aug 2024',
        palette: ocean,
      },
    ],
  },
  {
    number: 2,
    title: 'The UK Master’s Arc',
    period: '2024 – Present',
    synopsis: 'Master of Science in Data Science at the University of Hertfordshire (UK) — immersing into advanced machine learning, deep learning, NLP, and statistical modeling.',
    episodes: [
      {
        code: 'S02 E01',
        title: 'Hatfield Calling',
        description: 'Embarked on MSc Data Science at the University of Hertfordshire in the UK, mastering deep learning, statistical modeling, CNNs, LSTMs, and multimodal classification.',
        tags: ['MSc Data Science', 'University of Hertfordshire', 'UK'],
        runtime: 'Sep 2024 – Present',
        palette: violet,
      },
      {
        code: 'S02 E02',
        title: 'Voice of the Cohort',
        description: 'Elected Student Representative for MSc Data Science, bridging academic faculty and postgraduate students to enhance research and curriculum delivery.',
        tags: ['Student Representative Award', 'Academic Leadership'],
        runtime: '2024 – 2025',
        palette: crimson,
      },
      {
        code: 'S02 E03',
        title: 'Distributed Compute',
        description: 'Pioneered big data exploration with PySpark on the Amazon Bestsellers dataset, building scalable distributed data transformations and schema validations.',
        tags: ['PySpark', 'Big Data', 'Distributed Analytics'],
        runtime: '2025',
        palette: jade,
      },
    ],
  },
  {
    number: 3,
    title: 'Industry Impact in London',
    period: '2025',
    synopsis: 'Data Analyst Intern at Victoria Solutions in London — turning 197,430 Swiggy food records into executive dashboards and pricing optimization strategies.',
    episodes: [
      {
        code: 'S03 E01',
        title: 'Retail Intelligence',
        description: 'Built an interactive Excel dashboard on 197,430 Swiggy food records tracking 5 KPIs (INR 53.01M sales, 4.34 avg rating, 5.59M ratings), analyzing weekday and quarter patterns.',
        tags: ['Victoria Solutions', 'London, UK', '197K Records'],
        runtime: 'Oct 2025',
        palette: ocean,
      },
      {
        code: 'S03 E02',
        title: 'The Dashboard Suite',
        description: 'Engineered high-impact Power BI and Tableau dashboards tracking revenue, category performance, and seasonal discount elasticity.',
        tags: ['Power BI', 'Tableau', 'KPI Reporting'],
        runtime: 'Oct – Nov 2025',
        palette: amber,
      },
      {
        code: 'S03 E03',
        title: 'Certificate of Excellence',
        description: 'Honored with the Certificate of Excellence from Victoria Solutions for delivering measurable business insights and actionable pricing recommendations.',
        tags: ['Certificate of Excellence', 'Industry Award'],
        runtime: 'Nov 2025',
        palette: crimson,
      },
    ],
  },
  {
    number: 4,
    title: 'The Flagship Originals',
    period: '2025 – 2026',
    synopsis: 'Deploying high-performance machine learning models, predictive time-series forecasting, Uber Power BI dashboards, and fraud detection.',
    episodes: [
      {
        code: 'S04 E01',
        title: 'The Fraud Buster',
        description: 'Engineered Fake Job Posting Detection with LightGBM and NLP, achieving 97.32% accuracy and 0.793 PR-AUC on an extreme 4.8% imbalanced dataset.',
        tags: ['Machine Learning', 'NLP', 'LightGBM', '97.32% Accuracy'],
        runtime: '2026',
        palette: crimson,
      },
      {
        code: 'S04 E02',
        title: 'Uber Trip Intelligence',
        description: 'Built a 3-page Power BI dashboard on 103,728 Uber bookings ($1.55M booking value) with DAX measure selectors and demand concentration analysis.',
        tags: ['Uber Power BI', 'DAX Measures', '103K Bookings'],
        runtime: '2024',
        palette: ocean,
      },
      {
        code: 'S04 E03',
        title: 'Operational Precision',
        description: 'Analyzed Deliveroo operational delivery KPIs, uncovering routing bottlenecks and courier latency reductions using SQL and Power BI.',
        tags: ['Deliveroo Analytics', 'SQL', 'Logistics KPIs'],
        runtime: '2025',
        palette: jade,
      },
      {
        code: 'S04 E04',
        title: 'The Deep Forecaster',
        description: 'Trained LSTM recurrent neural networks and econometric ARIMA models to forecast global crude oil benchmark pricing under high volatility.',
        tags: ['Time Series', 'LSTM', 'ARIMA', 'Deep Learning'],
        runtime: '2025',
        palette: violet,
      },
    ],
  },
  {
    number: 5,
    title: "What's Next",
    period: 'Now streaming',
    synopsis: 'Actively interviewing for full-time Data Analyst and Data Science opportunities across the United Kingdom.',
    episodes: [
      {
        code: 'S05 E01',
        title: 'The Next Breakthrough',
        description: 'Bringing together business acumen, predictive intelligence, and dashboard storytelling to drive measurable commercial value.',
        tags: ['UK Job Search', 'Data Analyst', 'Data Scientist'],
        runtime: 'In production',
        palette: jade,
      },
    ],
  },
];

export type TopPick = { label: string; title: string; detail: string; palette: Palette };

export const topPicks: TopPick[] = [
  { label: 'Academic high', title: 'MSc Data Science', detail: 'University of Hertfordshire (UK) • Sep 2024 – Sep 2026', palette: violet },
  { label: 'The ML Original', title: '97.32% Accuracy', detail: 'Fake Job Detection with LightGBM & NLP (0.793 PR-AUC)', palette: crimson },
  { label: 'Industry recognition', title: 'Certificate of Excellence', detail: 'Victoria Solutions (London, UK) • Retail Analytics', palette: amber },
  { label: 'Uber BI Suite', title: '103,728 Bookings', detail: '3-Page Power BI Dashboard ($1.55M Value, Dynamic DAX)', palette: ocean },
  { label: 'Big data pipeline', title: 'PySpark Distributed', detail: 'Amazon Bestsellers Multi-Year Scalable Analysis', palette: jade },
  { label: 'Operational analytics', title: 'Deliveroo KPI Suite', detail: 'Logistics delivery cycle optimization with SQL & Power BI', palette: ocean },
  { label: 'Deep learning', title: 'LSTM Time Series', detail: 'Crude Oil Price Forecasting with Recurrent Neural Networks', palette: violet },
  { label: 'Leadership', title: 'Student Representative', detail: 'Elected Student Representative Award @ University of Hertfordshire', palette: crimson },
  { label: 'Unsupervised ML', title: 'Anomaly Detection', detail: 'K-Means & DBSCAN Transaction Outlier Isolation', palette: ocean },
  { label: 'Current mission', title: 'UK Data Analyst Roles', detail: 'Actively seeking full-time Data Analyst & Data Science positions', palette: jade },
];

export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export const introSlides: IntroSlide[] = [
  {
    kicker: 'Education',
    title: 'MSc · Data Science',
    lines: ['University of Hertfordshire, Hatfield, UK', 'September 2024 – September 2026'],
    chips: ['MSc Candidate', 'Student Representative Award'],
  },
  {
    kicker: 'Core Stack',
    title: 'Python, SQL & Power BI first.',
    lines: ['Python (Pandas, NumPy, Scikit-learn, TensorFlow) · SQL & SQLite', 'Power BI · Tableau · Excel · PySpark · Git'],
    chips: ['Python', 'SQL', 'Power BI', 'Tableau', 'PySpark', 'Scikit-learn'],
  },
  {
    kicker: 'Industry Experience',
    title: 'Victoria Solutions · London',
    lines: ['Data Analyst Intern · London, UK · Oct 2025 – Nov 2025', 'Built Excel dashboard on 197,430 Swiggy records tracking INR 53.01M sales', 'Awarded Certificate of Excellence for Retail Analytics & Dashboards'],
  },
  {
    kicker: 'Projects',
    title: 'Flagship Originals',
    lines: [
      'Fake Job Detection — 97.32% accuracy, 0.793 PR-AUC with LightGBM & NLP',
      'Uber Trip Analysis — 3-page Power BI dashboard on 103,728 bookings ($1.55M value)',
      'Amazon Bestsellers — Distributed big data processing with PySpark',
      'Deliveroo Analytics — SQL & Power BI logistics KPI optimization',
    ],
  },
  {
    kicker: 'Recognition',
    title: 'Awards & Honors',
    lines: [
      'Certificate of Excellence — Victoria Solutions (London, UK)',
      'Student Representative Award — University of Hertfordshire',
      'Excellent Project Award — 360DigiTMG',
      'Distinction Level Science Exhibition Award',
    ],
  },
  {
    kicker: 'Philosophy',
    title: 'Revealing the Truth',
    lines: ['"You can force data to confess anything… but real analysts don’t torture data — they understand it, respect it, and reveal the truth within."'],
  },
  {
    kicker: 'Current Mission',
    title: 'Now Seeking in UK',
    lines: ['Actively interviewing for Data Analyst & Data Science roles in the United Kingdom'],
  },
];

export type ProfileId = 'giridhar' | 'recruiter' | 'developer' | 'creative';
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
    name: 'Giridhar',
    blurb: 'The full cinematic series, in narrative order',
    color: '#E50920',
    order: ['about', 'portrait', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'],
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    blurb: 'Dedicated Executive Recruiter Dossier with direct access to facts, skills & resume',
    color: '#4cc9ff',
    order: ['story', 'moments', 'skills', 'originals', 'portrait', 'about', 'journey', 'picks'],
  },
  {
    id: 'developer',
    name: 'Developer / Analyst',
    blurb: 'Projects, PySpark, ML models & GitHub first',
    color: '#46e3a8',
    order: ['originals', 'skills', 'journey', 'picks', 'portrait', 'moments', 'about', 'story'],
  },
  {
    id: 'creative',
    name: 'Creative',
    blurb: 'The story arc, portrait & highlights first',
    color: '#ffb547',
    order: ['portrait', 'journey', 'picks', 'originals', 'moments', 'about', 'skills', 'story'],
  },
];

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'About', card: 'About Me', meta: 'The Pilot • Education & background', palette: violet },
  portrait: { nav: 'Identity', card: 'Personal Portrait', meta: 'Cinematic visual identity', palette: crimson },
  journey: { nav: 'Journey', card: 'My Journey', meta: `${seasons.length} Seasons • ${seasons.reduce((n, s) => n + s.episodes.length, 0)} Episodes`, palette: amber },
  originals: { nav: 'Originals', card: 'Featured Projects', meta: `${projects.length} Originals • ML & Analytics`, palette: crimson },
  picks: { nav: 'Top Picks', card: 'Top 10 Picks', meta: 'Top 10 career highlights', palette: jade },
  skills: { nav: 'Skills', card: 'Skill Universe', meta: `${skillCategories.length} Categories • Verified with evidence`, palette: ocean },
  moments: { nav: 'Moments', card: 'Achievements', meta: `${achievements.length} Honors • ${certifications.length} Credentials`, palette: crimson },
  story: { nav: 'Resume', card: 'The Full Story', meta: 'Resume • View & download PDF', palette: violet },
};
