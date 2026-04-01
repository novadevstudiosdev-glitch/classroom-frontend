import { useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export interface AudioEngine {
  start: () => void;
  startPq: () => void;
  stop: () => void;
  tick: () => void;
  correct: () => void;
  wrong: () => void;
  timeout: () => void;
  spinStart: () => void;
  spinStop: () => void;
  setVolume: (v: number) => void;
  getVolume: () => number;
}

// ── Singleton ──────────────────────────────────────────────────────────────

const BPM = 96;
const B = 60 / BPM;

// Quiz melody
const MEL: [number, number, number][] = [
  [523.25,.5,.20],[659.25,.5,.18],[783.99,1,.22],[659.25,.5,.18],[523.25,.5,.20],
  [440,1,.18],[392,.5,.15],[440,.5,.17],[523.25,1,.20],[587.33,.5,.18],
  [659.25,.5,.20],[783.99,.5,.22],[880,.5,.20],[783.99,1,.20],[659.25,.5,.18],
  [587.33,.5,.17],[523.25,2,.22],
];

// Preguntados melody
const PQ_MEL: [number, number, number][] = [
  [880,.25,.20],[1046.5,.25,.18],[1174.66,.5,.22],[1046.5,.25,.18],[880,.25,.16],
  [783.99,.5,.20],[659.25,.25,.18],[783.99,.25,.17],[880,.5,.22],[698.46,.5,.18],
  [783.99,.25,.16],[880,.25,.18],[1046.5,.5,.22],[1174.66,.25,.20],[1318.51,.25,.22],
  [1174.66,.5,.20],[1046.5,.5,.18],[880,1,.22],[659.25,.5,.16],[783.99,.5,.18],[880,1,.20],
];

function createAudioEngine(): AudioEngine {
  let ctx: AudioContext | null = null;
  let masterVol = 0.7;
  let bgGain: GainNode | null = null;
  let bgNextNote = 0;
  let bgBeat = 0;
  let bgTimer: ReturnType<typeof setTimeout> | null = null;
  let bgMelody: [number, number, number][] | null = null;
  let spinClickTimer: ReturnType<typeof setTimeout> | null = null;

  function getCtx(): AudioContext | null {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch { return null; }
    }
    return ctx;
  }

  function beep(freq: number, dur: number, vol = 0.25, type: OscillatorType = 'sine', delay = 0) {
    const c = getCtx(); if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, c.currentTime + delay);
    g.gain.linearRampToValueAtTime(vol * masterVol, c.currentTime + delay + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
    o.connect(g); g.connect(c.destination);
    o.start(c.currentTime + delay);
    o.stop(c.currentTime + delay + dur);
  }

  function scheduleBg() {
    const c = getCtx(); if (!c || !bgGain) return;
    const mel = bgMelody ?? MEL;
    const now = c.currentTime;
    while (bgNextNote < now + 0.5) {
      const n = mel[bgBeat % mel.length];
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'triangle';
      o.frequency.value = n[0];
      g.gain.setValueAtTime(0, bgNextNote);
      g.gain.linearRampToValueAtTime(n[2] * masterVol * 0.55, bgNextNote + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, bgNextNote + n[1] * B);
      o.connect(g); g.connect(bgGain);
      o.start(bgNextNote); o.stop(bgNextNote + n[1] * B + 0.05);
      bgNextNote += n[1] * B;
      bgBeat++;
    }
    bgTimer = setTimeout(scheduleBg, 250);
  }

  function startBg(mel: [number, number, number][]) {
    const c = getCtx(); if (!c) return;
    if (bgGain) { try { bgGain.disconnect(); } catch {} bgGain = null; }
    if (bgTimer) clearTimeout(bgTimer);
    bgMelody = mel;
    bgGain = c.createGain();
    bgGain.gain.value = 1;
    bgGain.connect(c.destination);
    bgNextNote = c.currentTime + 0.1;
    bgBeat = 0;
    scheduleBg();
  }

  return {
    start: () => startBg(MEL),
    startPq: () => startBg(PQ_MEL),
    stop() {
      if (bgTimer) { clearTimeout(bgTimer); bgTimer = null; }
      if (bgGain) { try { bgGain.disconnect(); } catch {} bgGain = null; }
    },
    tick: () => beep(880, 0.06, 0.18, 'sine'),
    correct() {
      beep(523.25, 0.1, 0.3, 'sine');
      beep(659.25, 0.1, 0.3, 'sine', 0.1);
      beep(783.99, 0.25, 0.35, 'sine', 0.2);
    },
    wrong() {
      beep(220, 0.12, 0.3, 'sawtooth');
      beep(180, 0.2, 0.25, 'sawtooth', 0.1);
    },
    timeout() {
      beep(440, 0.08, 0.2, 'sawtooth');
      beep(330, 0.12, 0.2, 'sawtooth', 0.1);
      beep(220, 0.25, 0.25, 'sawtooth', 0.2);
    },
    spinStart() {
      if (spinClickTimer) clearTimeout(spinClickTimer);
      const endTime = Date.now() + 3500;
      let interval = 50;
      const click = () => {
        const remaining = endTime - Date.now();
        if (remaining <= 0) { spinClickTimer = null; return; }
        const progress = 1 - remaining / 3500;
        interval = progress < 0.45
          ? Math.max(28, 50 - progress * 100)
          : 30 + ((progress - 0.45) / 0.55) * 420;
        beep(700 + Math.random() * 300, 0.012, 0.09, 'square');
        spinClickTimer = setTimeout(click, interval);
      };
      click();
    },
    spinStop() {
      if (spinClickTimer) { clearTimeout(spinClickTimer); spinClickTimer = null; }
    },
    setVolume(v: number) {
      masterVol = v / 100;
      if (bgGain) bgGain.gain.value = v > 0 ? 0.55 : 0;
    },
    getVolume: () => masterVol * 100,
  };
}

// Singleton — lazy initialized
let _engine: AudioEngine | null = null;
function getEngine(): AudioEngine {
  if (!_engine) _engine = createAudioEngine();
  return _engine;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAudioEngine(): AudioEngine {
  const ref = useRef<AudioEngine | null>(null);
  if (!ref.current) ref.current = getEngine();
  return ref.current;
}
