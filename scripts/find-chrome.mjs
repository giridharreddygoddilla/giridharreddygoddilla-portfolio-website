import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Portable, cross-platform Chrome / Chromium browser detector.
 * Supports Windows, macOS, and Linux without hardcoded user-specific paths.
 */
export function getChromePath() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const platform = os.platform();

  if (platform === 'win32') {
    const candidates = [
      // Standard Playwright install location in LocalAppData
      ...(process.env.LOCALAPPDATA
        ? [
            path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1248', 'chrome-win64', 'chrome.exe'),
            path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1155', 'chrome-win64', 'chrome.exe'),
            path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe'),
            path.join(process.env.LOCALAPPDATA, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
          ]
        : []),
      // Program Files
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    ];

    for (const c of candidates) {
      if (fs.existsSync(c)) return c;
    }
  } else if (platform === 'darwin') {
    const macCandidates = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    ];
    for (const c of macCandidates) {
      if (fs.existsSync(c)) return c;
    }
  } else {
    // Linux
    const linuxCandidates = [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/snap/bin/chromium',
    ];
    for (const c of linuxCandidates) {
      if (fs.existsSync(c)) return c;
    }
  }

  return null;
}
