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
  /** Fictional studio card shown at the very start of the opening sequence. */
  originalLabel: 'A GODDILLA ORIGINAL',
  role: 'Data Analyst & Data Scientist',
  tagline: ['Data Analyst', 'MSc Data Science', 'Machine Learning & BI'],
  intro:
    'An MSc Data Science student at the University of Hertfordshire (UK) and Data Analyst specializing in business intelligence, Python ETL workflows, predictive modeling, and interactive Power BI & Tableau dashboards.',
  location: 'Luton, United Kingdom',
  email: 'giridharreddygoddilla@gmail.com',
  phone: '+44 7765508654',
  links: {
    linkedin: 'https://www.linkedin.com/in/giridharreddygoddilla',
    github: 'https://github.com/giridharreddygoddilla',
  },
  resumePdf: '/assets/Giridhar_Reddy_Goddilla_Resume.pdf',
  portrait: {
    src: '/assets/portrait-720.webp',
    srcSet: '/assets/portrait-420.webp 420w, /assets/portrait-720.webp 720w, /assets/portrait-1100.webp 1100w',
    alt: 'Portrait of Giridhar Reddy Goddilla',
  },
  interests: ['Advanced Machine Learning', 'Big Data Engineering (PySpark)', 'Predictive Business Analytics'],
};

export const education = [
  {
    school: 'University of Hertfordshire',
    place: 'Hatfield, UK',
    degree: 'Master of Science — Data Science',
    period: 'September 2024 – September 2026',
    score: 'MSc Candidate',
    coursework: 'Data Science, Data Analytics, Machine Learning, Statistical Modelling, Deep Learning, NLP, CNNs and LSTMs',
  },
  {
    school: 'Lovely Professional University',
    place: 'Punjab, India',
    degree: 'Bachelor of Technology — Computer Science and Engineering',
    period: 'August 2019 – August 2023',
    score: 'First Class',
    coursework: 'Data Structures and Algorithms, OOP with Python, DBMS, SQL, Data Science Foundations, Power BI and Tableau',
  },
];

export const experience = [
  {
    company: 'Victoria Solutions',
    role: 'Data Analyst Trainee',
    place: 'London, UK',
    period: 'October 2025 – November 2025',
    points: [
      'Performed end-to-end analysis of retail datasets using Excel, SQL, and Python, including data cleaning, exploratory analysis, and transformation.',
      'Designed interactive Power BI and Tableau dashboards to monitor revenue, category performance, and discount effectiveness.',
      'Identified pricing and seasonal trends to support discount-strategy optimisation and revenue outcomes.',
    ],
  },
  {
    company: 'FOURP Technology Solutions Private Limited',
    role: 'Software Engineer',
    place: 'Chennai, India',
    period: 'September 2022 – August 2024',
    points: [
      'Delivered robust SQL database querying, Microsoft Excel modeling, automated reporting, and backend data processing workflows.',
      'Engineered relational database queries, views, and data integrity validations supporting business operations.',
      'Collaborated with cross-functional engineering teams to implement scalable data ingestion and reporting solutions.',
    ],
  },
  {
    company: 'Teachnook – E-Box',
    role: 'Data Science & Python Intern',
    place: 'Bengaluru, India',
    period: 'May 2021 – August 2021',
    points: [
      'Developed Python-based data analysis projects involving data cleaning, visualization, and statistical modeling.',
      'Constructed exploratory data pipelines with Pandas, NumPy, and Matplotlib to surface actionable patterns.',
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
    title: 'Fake Job Detection with ML & NLP',
    year: '2026',
    genre: 'Machine Learning • NLP • Fraud Analytics',
    logline: 'An end-to-end fraud detection pipeline classifying fraudulent job postings with 97.32% accuracy and 0.793 PR-AUC under severe class imbalance.',
    stack: ['Python', 'NLP', 'TF-IDF', 'LightGBM', 'XGBoost', 'Scikit-learn'],
    build: [
      'Built an end-to-end fraud detection pipeline using exploratory data analysis, text preprocessing, TF-IDF vectorization, and engineered features to identify fraudulent job postings in a highly imbalanced dataset (4.8% fraud).',
      'Trained and compared LightGBM, XGBoost, SVM, and Gradient Boosting using fraud-class precision, recall, F1-score, PR-AUC, and precision-recall curves to assess performance under class imbalance.',
      'Achieved 97.32% accuracy with LightGBM, the strongest overall balance with a fraud-class F1-score of 0.706 and PR-AUC of 0.793; evaluated decision thresholds to support fraud-screening trade-offs.',
    ],
    features: [
      'TF-IDF text feature extraction & tokenization',
      'Heavy class-imbalance mitigation (4.8% baseline)',
      'Multi-model benchmarking: LightGBM vs XGBoost vs SVM',
      'Precision-Recall AUC (PR-AUC) optimization',
      'Custom threshold calibration for operational fraud screening',
    ],
    metrics: [
      { value: '97.32%', label: 'accuracy' },
      { value: '0.793', label: 'PR-AUC' },
      { value: '0.706', label: 'fraud F1-score' },
      { value: '4.8%', label: 'class imbalance handled' },
      { value: '4', label: 'ML models benchmarked' },
    ],
    palette: { from: '#2a0610', via: '#7a0f24', to: '#0b0710', accent: '#ff3d5a' },
    motif: 'shield',
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
  { issuer: 'Microsoft / DataCamp', name: 'Power BI Data Analyst & Dashboard Specialization' },
  { issuer: 'SQL & Database Systems', name: 'Advanced Relational Database Design & Analytics' },
  { issuer: 'Python for Data Science', name: 'Applied Machine Learning & Statistical Modeling' },
];

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Core Languages',
    subtitle: 'Python & SQL are the daily drivers',
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
      { name: 'Data Cleaning', mono: 'Dc' },
      { name: 'Exploratory Data Analysis (EDA)', mono: 'Eda' },
      { name: 'Pandas', mono: 'Pd' },
      { name: 'NumPy', mono: 'Np' },
      { name: 'Statistical Modelling', mono: 'Sm' },
      { name: 'ETL Workflows', mono: 'Etl' },
    ],
  },
  {
    id: 'dashboards',
    title: 'BI & Dashboards',
    subtitle: 'Data storytelling & KPI reporting',
    skills: [
      { name: 'Power BI', mono: 'Pbi', note: 'Featured' },
      { name: 'Tableau', mono: 'Tb' },
      { name: 'Microsoft Excel', mono: 'Xls', note: 'Advanced' },
      { name: 'KPI Reporting', mono: 'Kpi' },
      { name: 'Data Visualisation', mono: 'Dv' },
      { name: 'Matplotlib & Seaborn', mono: 'Plt' },
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
      { name: 'Classification & Regression', mono: 'Cr' },
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
      { name: 'LSTMs & Time Series', mono: 'Lstm' },
      { name: 'CNNs', mono: 'Cnn' },
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
      { name: 'Microsoft Fabric', mono: 'Fab' },
      { name: 'Azure Cloud', mono: 'Az' },
      { name: 'REST APIs', mono: 'Api' },
    ],
  },
  {
    id: 'tools',
    title: 'Developer Tools',
    subtitle: 'Reproducibility & version control',
    skills: [
      { name: 'Git & GitHub', mono: 'Git' },
      { name: 'Jupyter Notebook', mono: 'Jup' },
      { name: 'VS Code', mono: 'Vsc' },
      { name: 'Spyder', mono: 'Spy' },
    ],
  },
];

/**
 * Factual cross-references shown when a skill card is hovered/tapped:
 * where the skill appears in the projects, certifications or achievements on the resume.
 */
export const skillEvidence: Record<string, string[]> = {
  Python: ['Fake Job Posting Detection', 'Deliveroo Metrics Analysis', 'Amazon PySpark', 'Oil Price Forecasting'],
  SQL: ['FOURP Technology Solutions', 'Victoria Solutions', 'Deliveroo Metrics Analysis', 'Relational Database Design'],
  'Power BI': ['Victoria Solutions (London)', 'Deliveroo Metrics Analysis', 'Retail KPI Dashboards'],
  Tableau: ['Victoria Solutions', 'Retail Revenue Monitoring', 'Interactive Visualizations'],
  'Microsoft Excel': ['Victoria Solutions', 'FOURP Technology Solutions', 'Financial & Sales Modeling'],
  PySpark: ['Amazon Bestsellers Analysis with PySpark', 'Distributed Big Data Processing'],
  'LightGBM': ['Fake Job Detection (97.32% Accuracy, 0.793 PR-AUC)'],
  XGBoost: ['Fake Job Detection Benchmark', 'Machine Learning Classification'],
  'Scikit-learn': ['Sales Anomaly Detection', 'Fake Job Posting Detection', 'Statistical Modeling'],
  'TensorFlow': ['Oil Price Forecasting (LSTM Neural Networks)', 'MSc Coursework @ Hertfordshire'],
  'Keras': ['Oil Price Forecasting', 'Deep Learning Neural Networks'],
  'LSTMs & Time Series': ['Brent & WTI Crude Oil Price Forecasting', 'MSc Data Science Curriculum'],
  'Natural Language Processing (NLP)': ['Fake Job Detection with TF-IDF', 'MSc NLP Coursework'],
  'Data Cleaning': ['Victoria Solutions Trainee', 'Amazon Bestsellers', 'Deliveroo Analytics'],
  'Exploratory Data Analysis (EDA)': ['Deliveroo Metrics Analysis', 'Amazon Bestsellers', 'Fake Job Detection'],
  'Git & GitHub': ['github.com/giridharreddygoddilla', 'Open-source code repositories'],
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
        description: 'Data Science & Python Intern at Teachnook – E-Box in Bengaluru, applying exploratory data analysis, data cleaning, and statistical modeling to real datasets.',
        tags: ['Teachnook', 'Data Science Intern', 'EDA', 'Pandas'],
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
    synopsis: 'Data Analyst Trainee at Victoria Solutions in London — turning commercial retail datasets into executive dashboards and pricing optimization strategies.',
    episodes: [
      {
        code: 'S03 E01',
        title: 'Retail Intelligence',
        description: 'Conducted end-to-end data cleaning, SQL transformation, and exploratory trend analysis on complex retail datasets at Victoria Solutions.',
        tags: ['Victoria Solutions', 'London, UK', 'Retail Data'],
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
    synopsis: 'Deploying high-performance machine learning models, predictive time-series forecasting, and logistics analytics.',
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
        title: 'Operational Precision',
        description: 'Analyzed Deliveroo operational delivery KPIs, uncovering routing bottlenecks and courier latency reductions using SQL and Power BI.',
        tags: ['Deliveroo Analytics', 'SQL', 'Logistics KPIs'],
        runtime: '2025',
        palette: ocean,
      },
      {
        code: 'S04 E03',
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
  { label: 'Big data pipeline', title: 'PySpark Distributed', detail: 'Amazon Bestsellers Multi-Year Scalable Analysis', palette: ocean },
  { label: 'Operational analytics', title: 'Deliveroo KPI Suite', detail: 'Logistics delivery cycle optimization with SQL & Power BI', palette: jade },
  { label: 'Deep learning', title: 'LSTM Time Series', detail: 'Crude Oil Price Forecasting with Recurrent Neural Networks', palette: violet },
  { label: 'Leadership', title: 'Student Representative', detail: 'Elected Student Representative Award @ University of Hertfordshire', palette: crimson },
  { label: 'Unsupervised ML', title: 'Anomaly Detection', detail: 'K-Means & DBSCAN Transaction Outlier Isolation', palette: ocean },
  { label: 'Dual BI mastery', title: 'Power BI + Tableau', detail: 'Executive dashboarding, KPI storytelling & retail analytics', palette: amber },
  { label: 'Current mission', title: 'UK Data Analyst Roles', detail: 'Actively seeking full-time Data Analyst & Data Science positions', palette: jade },
];

/** Slides for the "▶ Play Intro" cinematic sequence. */
export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export const introSlides: IntroSlide[] = [
  {
    kicker: 'Education',
    title: 'MSc · Data Science',
    lines: ['University of Hertfordshire, Hatfield, UK', 'September 2024 – September 2026'],
    chips: ['MSc Candidate', 'Student Representative'],
  },
  {
    kicker: 'Core Stack',
    title: 'Python & SQL first.',
    lines: ['Python (Pandas, NumPy, Scikit-learn, TensorFlow) · SQL & SQLite', 'Power BI · Tableau · Excel · PySpark · Git'],
    chips: ['Python', 'SQL', 'Power BI', 'Tableau', 'PySpark', 'Scikit-learn'],
  },
  {
    kicker: 'Industry Experience',
    title: 'Victoria Solutions · London',
    lines: ['Data Analyst Trainee · London, UK · October 2025 – November 2025', 'Awarded Certificate of Excellence for Retail Analytics & Dashboards', 'Former Software Engineer at FOURP Technology Solutions (2 years)'],
  },
  {
    kicker: 'Projects',
    title: 'Flagship Originals',
    lines: [
      'Fake Job Detection — 97.32% accuracy, 0.793 PR-AUC with LightGBM & NLP',
      'Amazon Bestsellers — Distributed big data processing with PySpark',
      'Deliveroo Analytics — SQL & Power BI logistics KPI optimization',
      'Oil Price Forecasting — Deep Learning LSTM & ARIMA time series models',
    ],
  },
  {
    kicker: 'Recognition',
    title: 'Awards & Honors',
    lines: [
      'Certificate of Excellence — Victoria Solutions (London, UK)',
      'Student Representative Award — University of Hertfordshire',
      'Excellent Project Award — 360DigiTMG',
      'Distinction Level Science Award',
    ],
  },
  {
    kicker: 'Philosophy',
    title: 'Revealing the Truth',
    lines: ['"You can force data to confess anything… but real analysts don’t torture data — they understand it, respect it, and reveal the truth within."'],
  },
  {
    kicker: 'Current Mission',
    title: 'Now Seeking',
    lines: ['Actively interviewing for Data Analyst & Data Science roles in the UK'],
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
    blurb: 'Resume, education, achievements & skills first',
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
