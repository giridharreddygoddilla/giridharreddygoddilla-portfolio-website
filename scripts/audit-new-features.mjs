import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'qa_screenshots');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const chromePath = 'C:/Users/girid/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.consoleErrors = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = err => reject(err);
      this.ws.onmessage = msg => {
        const data = JSON.parse(msg.data);
        if (data.id && this.callbacks.has(data.id)) {
          const { resolve, reject } = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) reject(data.error);
          else resolve(data.result);
        } else if (data.method) {
          if (data.method === 'Runtime.consoleAPICalled') {
            if (data.params.type === 'error') {
              this.consoleErrors.push(data.params.args.map(a => a.value || a.description).join(' '));
            }
          } else if (data.method === 'Runtime.exceptionThrown') {
            this.consoleErrors.push(data.params.exceptionDetails.text + ' ' + (data.params.exceptionDetails.exception?.description || ''));
          }
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Runtime.evaluate failed');
    }
    return res.result?.value;
  }

  async captureScreenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const p = path.join(outDir, filename);
    fs.writeFileSync(p, buffer);
    console.log(`Saved screenshot: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
  }
}

async function runAudit() {
  console.log('--- STARTING COMPREHENSIVE QA AUDIT OF NEW FEATURES ---');
  const port = 9223;
  const userDataDir = path.join(os.tmpdir(), 'temp_chrome_audit_' + Date.now());

  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    'http://localhost:5173',
  ]);

  try {
    let wsUrl = null;
    for (let i = 0; i < 30; i++) {
      await sleep(500);
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json`);
        const targets = await res.json();
        const pageTarget = targets.find(t => t.type === 'page');
        if (pageTarget && pageTarget.webSocketDebuggerUrl) {
          wsUrl = pageTarget.webSocketDebuggerUrl;
          break;
        }
      } catch {}
    }

    if (!wsUrl) throw new Error('Could not connect to Chrome DevTools WebSocket');

    const client = new CDPClient(wsUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('Connected to Chrome. Waiting for page initial load...');
    await sleep(2000);

    // 1. Skip opening sequence and select default profile
    console.log('Skipping opening titles via Escape key...');
    await client.eval(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    `);
    await sleep(1500);

    console.log('Selecting Giridhar profile...');
    await client.eval(`
      const profileBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Giridhar'));
      if (profileBtn) profileBtn.click();
    `);
    await sleep(2500);
    await client.captureScreenshot('audit_01_series_home.png');

    // 2. Audit Cursor: verify system cursor is used and no cursor:none
    const cursorAudit = await client.eval(`
      (() => {
        const bodyCursor = window.getComputedStyle(document.body).cursor;
        const htmlCursor = window.getComputedStyle(document.documentElement).cursor;
        const customCursorElem = document.querySelector('.custom-cursor');
        const buttons = Array.from(document.querySelectorAll('button')).slice(0, 5).map(b => window.getComputedStyle(b).cursor);
        return { bodyCursor, htmlCursor, customCursorElem: !!customCursorElem, buttonCursors: buttons };
      })()
    `);
    console.log('Cursor Audit Result:', cursorAudit);

    // 3. Test Persistent Page Switcher Dropdown
    console.log('Testing Persistent Page Switcher...');
    await client.eval(`
      const switcher = document.querySelector('button[aria-label*="Click to switch page"]');
      if (switcher) switcher.click();
    `);
    await sleep(1000);
    await client.captureScreenshot('audit_02_switcher_dropdown.png');

    // 4. Test Switching to Creative Page
    console.log('Navigating to Creative Page...');
    await client.eval(`
      const creativeOption = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Creative'));
      if (creativeOption) creativeOption.click();
    `);
    await sleep(2000);
    await client.captureScreenshot('audit_03_creative_page_hero.png');

    // Verify Creative Page has ZERO education mentions
    const creativeEducationCheck = await client.eval(`
      (() => {
        const text = document.body.innerText.toLowerCase();
        const hasEducation = text.includes('education') || text.includes('bedfordshire') || text.includes('bachelor of technology');
        const hasManifesto = text.includes('creative manifesto');
        const hasArtwork = text.includes('signature character scenes');
        return { hasEducation, hasManifesto, hasArtwork };
      })()
    `);
    console.log('Creative Page Content Check (Must have NO education):', creativeEducationCheck);

    // Scroll down on Creative Page
    await client.eval(`window.scrollTo(0, 1000);`);
    await sleep(1000);
    await client.captureScreenshot('audit_04_creative_page_gallery.png');

    // 5. Test Switching to Developer Page
    console.log('Navigating to Developer Page...');
    await client.eval(`
      const navLinks = Array.from(document.querySelectorAll('button'));
      const devBtn = navLinks.find(b => b.textContent.includes('Developer'));
      if (devBtn) devBtn.click();
    `);
    await sleep(2000);
    await client.captureScreenshot('audit_05_developer_page_hero.png');

    // Scroll to code tabs and switch to LightGBM / PySpark
    await client.eval(`
      const codeSec = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('PRODUCTION CODE'));
      if (codeSec) codeSec.scrollIntoView({ behavior: 'instant' });
    `);
    await sleep(1200);
    await client.captureScreenshot('audit_06_developer_code_tabs.png');

    // 6. Test Switching to Recruiter Dossier
    console.log('Navigating to Recruiter Dossier...');
    await client.eval(`
      const recruiterBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Recruiter'));
      if (recruiterBtn) recruiterBtn.click();
    `);
    await sleep(2000);
    await client.captureScreenshot('audit_07_recruiter_dossier.png');

    // Verify Real Photo is NOT in Recruiter Dossier (Character avatar only)
    const recruiterImageSrc = await client.eval(`
      (() => {
        const imgs = Array.from(document.querySelectorAll('img')).map(i => i.src);
        const hasRealPhoto = imgs.some(src => src.includes('profile-real') || src.includes('portrait-'));
        const hasCharacterAvatar = imgs.some(src => src.includes('hero-portrait') || src.includes('character'));
        return { hasRealPhoto, hasCharacterAvatar, imgCount: imgs.length };
      })()
    `);
    console.log('Recruiter Photo Audit (Must be false for realPhoto):', recruiterImageSrc);

    // 7. Test 3-Line Hamburger Menu
    console.log('Testing Hamburger Menu Drawer...');
    await client.eval(`
      const burger = document.querySelector('button[aria-label*="navigation menu"]');
      if (burger) burger.click();
    `);
    await sleep(1200);
    await client.captureScreenshot('audit_08_hamburger_drawer.png');

    // 8. Test Navigation Guide Modal [?]
    console.log('Testing Navigation Guide Modal...');
    await client.eval(`
      const helpItem = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('How to Navigate'));
      if (helpItem) helpItem.click();
    `);
    await sleep(1200);
    await client.captureScreenshot('audit_09_navigation_guide_modal.png');

    // Close guide
    await client.eval(`
      const closeGuide = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Got It'));
      if (closeGuide) closeGuide.click();
    `);
    await sleep(800);

    // 9. Mobile Responsive Audit (390px iPhone viewport)
    console.log('Testing 390px Mobile Viewport...');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await client.eval(`window.scrollTo(0, 0);`);
    await sleep(1200);
    await client.captureScreenshot('audit_10_mobile_390_navbar.png');

    // Check Console Errors
    console.log('\n=======================================');
    console.log('CONSOLE ERRORS DETECTED:', client.consoleErrors.length);
    if (client.consoleErrors.length > 0) {
      console.error(client.consoleErrors);
    } else {
      console.log('✓ ZERO console errors or uncaught exceptions across all pages!');
    }
    console.log('=======================================\n');

  } finally {
    chromeProc.kill();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  }
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
