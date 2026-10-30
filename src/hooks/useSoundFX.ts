/**
 * Web Audio API synthesized cinematic sound design.
 * Requires 0 external audio files, 0 bandwidth, and zero latency.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(val: boolean) {
  soundEnabled = val;
  try {
    sessionStorage.setItem('giridhar-sound-fx', val ? '1' : '0');
  } catch {
    // ignore
  }
}

// Initialize from storage
if (typeof window !== 'undefined') {
  try {
    const stored = sessionStorage.getItem('giridhar-sound-fx');
    if (stored !== null) soundEnabled = stored === '1';
  } catch {
    // ignore
  }
}

/** Cinematic intro boom / OTT sound signature */
export function playCinematicBoom() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Deep Sub Bass
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(55, now);
  osc1.frequency.exponentialRampToValueAtTime(28, now + 1.2);
  gain1.gain.setValueAtTime(0.35, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 1.4);

  // Cinematic Resonant Chord
  [110, 164.8, 220].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 1.0);
    gain.gain.setValueAtTime(0.08 / (idx + 1), now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + 0.05);
    osc.stop(now + 1.2);
  });
}

/** Subtle mechanical click */
export function playClick() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.04);
}

/** Subtle soft hover tick */
export function playHover() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  gain.gain.setValueAtTime(0.02, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.02);
}
