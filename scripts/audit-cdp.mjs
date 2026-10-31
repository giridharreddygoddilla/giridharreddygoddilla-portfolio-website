import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import os from 'os';

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
    this.events = [];
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
            this.consoleErrors.push(data.params.exceptionDetails.text);
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

  async captureScreenshot(filename) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(path.join(outDir, filename), buffer);
    console.log(`📸 Saved screenshot: ${filename}`);
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    return res.result?.value;
  }
}

async function main() {
  console.log('--- STARTING AUTONOMOUS QUALITY AUDIT & VIEWPORT QA ---');
  
  // 1. Launch Chrome with isolated temp profile in OS tmpdir
  const tempProfileDir = path.join(os.tmpdir(), 'chrome_qa_' + Date.now());
  if (!fs.existsSync(tempProfileDir)) {
    fs.mkdirSync(tempProfileDir, { recursive: true });
  }

  const chromeProcess = spawn(chromePath, [
    '--remote-debugging-port=9222',
    `--user-data-dir=${tempProfileDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  try {
    // Poll until debugging port is ready (up to 5s)
    let connected = false;
    let versionData = null;
    for (let i = 0; i < 20; i++) {
      await sleep(250);
      try {
        const versionRes = await fetch('http://127.0.0.1:9222/json/version');
        versionData = await versionRes.json();
        connected = true;
        break;
      } catch (e) {}
    }

    if (!connected) {
      throw new Error('Chromium debugging port 9222 could not be reached');
    }
    console.log('✓ Connected to Chromium DevTools:', versionData.Browser);

    const listRes = await fetch('http://127.0.0.1:9222/json/list');
    const tabs = await listRes.json();
    const targetTab = tabs.find(t => t.type === 'page') || tabs[0];
    const wsUrl = targetTab.webSocketDebuggerUrl;

    const client = new CDPClient(wsUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

    console.log('✓ Navigating to http://localhost:5173 ...');
    await client.send('Page.navigate', { url: 'http://localhost:5173' });
    await sleep(2500);

    // TEST 1: Opening Screen (1440x900)
    await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await sleep(1500);
    await client.captureScreenshot('01_desktop_opening.png');

    // TEST 2: Skip Intro -> Profile Selector
    console.log('Testing Skip Intro to reach Profile Selector...');
    await client.eval(`
      const skip = document.querySelector('button[aria-label="Skip intro"]');
      if (skip) skip.click();
      else {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('SKIP'));
        if (btn) btn.click();
      }
    `);
    await sleep(1500);
    await client.captureScreenshot('02_profile_selector.png');

    // TEST 3: Select Recruiter Profile -> Recruiter Dossier
    console.log('Testing Recruiter Profile selection...');
    await client.eval(`
      const recruiterBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Recruiter'));
      if (recruiterBtn) recruiterBtn.click();
    `);
    await sleep(2000);
    await client.captureScreenshot('03_recruiter_dossier.png');

    // Verify Recruiter Mode content
    const recruiterHeading = await client.eval(`document.querySelector('h1')?.textContent`);
    console.log('✓ Recruiter Dossier H1:', recruiterHeading);

    // TEST 4: Viewports test on Recruiter Mode
    const viewports = [
      { name: '04_viewport_1920_recruiter.png', w: 1920, h: 1080, mobile: false },
      { name: '05_viewport_1366_recruiter.png', w: 1366, h: 768, mobile: false },
      { name: '06_viewport_1024_tablet_recruiter.png', w: 1024, h: 768, mobile: false },
      { name: '07_viewport_768_tablet_recruiter.png', w: 768, h: 1024, mobile: true },
      { name: '08_viewport_390_mobile_recruiter.png', w: 390, h: 844, mobile: true },
      { name: '09_viewport_360_small_recruiter.png', w: 360, h: 740, mobile: true },
    ];

    for (const vp of viewports) {
      await client.send('Emulation.setDeviceMetricsOverride', { width: vp.w, height: vp.h, deviceScaleFactor: 1, mobile: vp.mobile });
      await sleep(600);
      await client.captureScreenshot(vp.name);
    }

    // TEST 5: Switch back to Cinematic Series
    console.log('Testing switch to Cinematic Series...');
    await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await client.eval(`
      const switchBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cinematic Series'));
      if (switchBtn) switchBtn.click();
    `);
    await sleep(2000);
    await client.captureScreenshot('10_cinematic_hero_desktop.png');

    // TEST 6: Test Anime / Real Photo toggle in Hero
    console.log('Testing Art Switcher in Hero (Real Photo)...');
    await client.eval(`
      const photoBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Real Photo'));
      if (photoBtn) photoBtn.click();
    `);
    await sleep(1000);
    await client.captureScreenshot('11_hero_real_photo.png');

    // TEST 7: Scroll to Originals and open Project Detail Modal
    console.log('Scrolling to Flagship Originals...');
    await client.eval(`document.getElementById('originals')?.scrollIntoView({ behavior: 'instant' });`);
    await sleep(1500);
    await client.captureScreenshot('12_flagship_originals.png');

    console.log('Opening project modal...');
    await client.eval(`
      const card = document.querySelector('button[data-cursor="view"]');
      if (card) card.click();
    `);
    await sleep(1500);
    await client.captureScreenshot('13_project_modal.png');

    // Close project modal
    await client.eval(`
      const closeBtn = document.querySelector('button[aria-label="Close project modal"]');
      if (closeBtn) closeBtn.click();
    `);
    await sleep(800);

    // TEST 8: Scroll to Skills and Portrait Experience
    console.log('Scrolling to Skill Universe...');
    await client.eval(`document.getElementById('skills')?.scrollIntoView({ behavior: 'instant' });`);
    await sleep(1200);
    await client.captureScreenshot('14_skill_universe.png');

    console.log('Scrolling to Identity Spotlight...');
    await client.eval(`document.getElementById('portrait')?.scrollIntoView({ behavior: 'instant' });`);
    await sleep(1200);
    await client.captureScreenshot('15_portrait_identity.png');

    // TEST 9: Mobile Viewport (iPhone 390px) on Cinematic Series
    console.log('Testing iPhone 390px mobile on Cinematic Series...');
    await client.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await client.eval(`window.scrollTo(0, 0);`);
    await sleep(1200);
    await client.captureScreenshot('16_mobile_hero_390.png');

    // Check Console Errors
    console.log('\n=======================================');
    console.log('CONSOLE ERRORS DETECTED:', client.consoleErrors.length);
    if (client.consoleErrors.length > 0) {
      console.error(client.consoleErrors);
    } else {
      console.log('✓ ZERO console errors or uncaught exceptions!');
    }
    console.log('=======================================\n');

  } finally {
    try {
      chromeProcess.kill();
      await sleep(1000);
      fs.rmSync(tempProfileDir, { recursive: true, force: true });
    } catch(e){}
  }
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
