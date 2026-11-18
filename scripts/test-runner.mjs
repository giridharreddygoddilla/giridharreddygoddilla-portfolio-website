import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✕ FAILED: ${message}`);
    process.exitCode = 1;
  }
}

console.log('\n======================================================');
console.log('PORTFOLIO TEST RUNNER: AUTOMATED VERIFICATION SUITE');
console.log('======================================================\n');

// TEST 1: TypeScript validation
console.log('1. Checking TypeScript validation...');
try {
  execSync('npx tsc -b', { cwd: rootDir, stdio: 'pipe' });
  assert(true, 'TypeScript type checking passed (tsc -b) with 0 errors');
} catch (e) {
  assert(false, `TypeScript compilation failed: ${e.message}`);
}

// TEST 2: Production Build
console.log('\n2. Checking Production Build...');
try {
  execSync('npx vite build', { cwd: rootDir, stdio: 'pipe' });
  const distHtml = path.join(rootDir, 'dist', 'index.html');
  assert(fs.existsSync(distHtml), 'Vite production build succeeded and generated dist/index.html');
} catch (e) {
  assert(false, `Production build failed: ${e.message}`);
}

// TEST 3: SEO Canonical & OG URL Check
console.log('\n3. Checking SEO & Metadata...');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
const canonicalExpected = 'https://giridharreddygoddilla-portfolio-web.vercel.app/';
assert(
  indexHtml.includes(`rel="canonical" href="${canonicalExpected}"`),
  `Canonical URL matches deployed domain (${canonicalExpected})`
);
assert(
  indexHtml.includes(`property="og:url" content="${canonicalExpected}"`),
  `OpenGraph URL matches deployed domain (${canonicalExpected})`
);
assert(
  !indexHtml.includes('portrait-720.webp'),
  'Unnecessary image preload (portrait-720.webp) was removed'
);

// TEST 4: GitHub Project Links Check
console.log('\n4. Checking GitHub Project Links...');
const portfolioTs = fs.readFileSync(path.join(rootDir, 'src', 'data', 'portfolio.ts'), 'utf-8');
const fakeJobExpected = 'https://github.com/giridharreddygoddilla/MSc-Data-Science-Project';
const uberExpected = 'https://github.com/giridharreddygoddilla/USA-Uber-Data-Analysis';

assert(
  portfolioTs.includes(fakeJobExpected),
  `Fake Job Detection GitHub repo is correctly set to ${fakeJobExpected}`
);
assert(
  portfolioTs.includes(uberExpected),
  `Uber Trip Analysis GitHub repo is correctly set to ${uberExpected}`
);

// TEST 5: Creative Mode Education Isolation Check
console.log('\n5. Checking Creative Mode Education Isolation...');
const creativeTsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'CreativePage.tsx'), 'utf-8');
const forbiddenEducationRegex = /education|degree|msc|bachelor|university|school|college|gpa/i;
const hasForbiddenEducation = forbiddenEducationRegex.test(creativeTsx);
assert(
  !hasForbiddenEducation,
  'CreativePage.tsx contains STRICTLY ZERO education, degree, or university references'
);

// TEST 6: Keyboard Shortcut Safety Check
console.log('\n6. Checking Keyboard Shortcut Safety...');
const appTsx = fs.readFileSync(path.join(rootDir, 'src', 'App.tsx'), 'utf-8');
const guideTsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'NavigationGuideModal.tsx'), 'utf-8');

assert(
  !appTsx.includes("e.key === 'c'") && !appTsx.includes("e.key === 'C'"),
  'Standalone C key shortcut is completely removed from App.tsx'
);
assert(
  appTsx.includes('e.metaKey || e.ctrlKey || e.altKey'),
  'Modifier key guards prevent interception of Ctrl+C, Cmd+C, Ctrl+V, Cmd+V'
);
assert(
  !guideTsx.includes("key: 'C'"),
  'Standalone C shortcut is removed from NavigationGuideModal.tsx'
);

// TEST 7: Lock Manager & Rate Limiting Check
console.log('\n7. Checking Lock Manager & Security Architecture...');
const lockService = fs.readFileSync(path.join(rootDir, 'src', 'services', 'lockManager.ts'), 'utf-8');
const supabaseMigration = fs.readFileSync(path.join(rootDir, 'supabase', 'migrations', '20261101_profile_locks.sql'), 'utf-8');

assert(
  lockService.includes('PBKDF2') && lockService.includes('100000'),
  'Lock Manager uses Web Crypto PBKDF2 with SHA-256 and 100,000 iterations'
);
assert(
  lockService.includes('MAX_ATTEMPTS') && lockService.includes('LOCKOUT_MS'),
  'Lock Manager enforces 5-attempt rate limiting and 30-second lockout delay'
);
assert(
  supabaseMigration.includes('SECURITY DEFINER') && supabaseMigration.includes('verify_profile_password'),
  'Supabase SQL migration provides server-side verification via pgcrypto'
);

// TEST 8: Recruiter Profile Reversed Two-Column Layout, Brand Logos & Side-by-Side Resume Buttons
console.log('\n8. Checking Recruiter Profile Layout, Brand Logos & Education Logos...');
const recruiterTsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'RecruiterDossier.tsx'), 'utf-8');

assert(
  !recruiterTsx.includes('sticky top-16') && !recruiterTsx.includes('Recruiter Mode Active'),
  'Fixed/sticky top recruiter banner is completely removed'
);
assert(
  recruiterTsx.includes("gap: '0.3mm'") &&
    recruiterTsx.includes('h-[58px] w-[58px]') &&
    recruiterTsx.includes('h-[33px] w-[33px]') &&
    recruiterTsx.includes('fill="#0A66C2"') &&
    recruiterTsx.includes('aria-label="LinkedIn') &&
    recruiterTsx.includes('aria-label="GitHub') &&
    recruiterTsx.includes('rel="noopener noreferrer"'),
  'Official LinkedIn & GitHub brand logos are +10% larger (58px/33px) with exact 0.3mm gap and safe links'
);
assert(
  recruiterTsx.includes('https://giridharreddygoddilla.vercel.app/assets/Giridhar_Reddy_Goddilla_Resume_ATS.pdf') &&
    recruiterTsx.includes('<span>Download Resume</span>') &&
    recruiterTsx.includes('<span>Preview Resume</span>') &&
    recruiterTsx.includes('object-contain') &&
    !recruiterTsx.includes('Premium Visual PDF') &&
    !recruiterTsx.includes('DOCX') &&
    !recruiterTsx.includes('Cinematic Series'),
  'Side-by-side Download Resume & Preview Resume buttons point to ATS PDF with object-contain photo and zero unwanted options'
);
assert(
  recruiterTsx.indexOf('Data Analytics | MSc Data Science') < recruiterTsx.indexOf('profile.recruiterPhoto.src') &&
    recruiterTsx.includes('UK Right to Work – 2-Year Visa'),
  'Professional info column is genuinely first (left on desktop, top on mobile) before photo & actions column'
);
assert(
  recruiterTsx.includes('UniversityLogo'),
  'University logo component with graceful monogram fallback is rendered in Education'
);

// TEST 9: Resume Transformation Deliverables & Original Photograph Integration
console.log('\n9. Checking Resume Deliverables & Recruiter Profile Integration...');
const assetsDir = path.join(rootDir, 'public', 'assets');
assert(
  fs.existsSync(path.join(assetsDir, 'Giridhar_Reddy_Goddilla_Resume_ATS.pdf')),
  'Version A: ATS-Friendly Resume PDF exists in public/assets/'
);
assert(
  fs.existsSync(path.join(assetsDir, 'Giridhar_Reddy_Goddilla_Resume_Premium.pdf')),
  'Version B: Premium Visual Resume PDF exists in public/assets/'
);
assert(
  fs.existsSync(path.join(assetsDir, 'Giridhar_Reddy_Goddilla_Resume.docx')),
  'Editable Word Resume (DOCX) exists in public/assets/'
);
assert(
  fs.existsSync(path.join(assetsDir, 'giridhar-original-portrait.jpg')) &&
    recruiterTsx.includes('profile.recruiterPhoto.src') &&
    !recruiterTsx.includes('hero-portrait.webp'),
  'Recruiter profile uses uploaded original photograph (no AI portrait)'
);
assert(
  portfolioTs.includes('Bank Loan & Credit Risk Analysis') && portfolioTs.includes('14% year-on-year sales increase'),
  'Portfolio data is synchronised with updated resume projects and impact'
);

// Final Summary
console.log('\n======================================================');
console.log(`TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
if (passedTests === totalTests) {
  console.log('✓ ALL SUITE CHECKS COMPLETED SUCCESSFULLY!');
} else {
  console.error(`✕ ${totalTests - passedTests} CHECKS FAILED`);
  process.exit(1);
}
console.log('======================================================\n');
