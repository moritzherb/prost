// Sound, vibration and confetti. Kept outside React so any game can call them directly.

import { isNative, toNative } from './native';

export const fxSettings = { sound: true, haptics: true };

export function buzz(pattern: number | number[] = 15) {
  if (!fxSettings.haptics) return;
  // In the store app: the phone's real haptics (iPhones have no navigator.vibrate at all).
  if (isNative) return toNative({ type: 'haptic', pattern: Array.isArray(pattern) ? pattern : [pattern] });
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* not supported */
    }
    return;
  }
  // An iPhone (no navigator.vibrate): a tick for each buzz of the pattern, where it would start.
  const parts = Array.isArray(pattern) ? pattern : [pattern];
  let at = 0;
  parts.forEach((ms, i) => {
    if (i % 2 === 0) {
      if (at === 0) tick();
      else window.setTimeout(tick, at);
    }
    at += ms;
  });
}

/**
 * The iPhone's own tick, the one its switches give: a switch (Safari 17.4 and later) flipped by a
 * hidden label, gone again at once. Elsewhere it does nothing.
 */
function tick() {
  if (typeof document === 'undefined') return;
  try {
    const label = document.createElement('label');
    label.setAttribute('aria-hidden', 'true');
    label.style.display = 'none';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    label.append(input);
    document.head.append(label);
    label.click();
    label.remove();
  } catch {
    /* not supported */
  }
}

let ctx: AudioContext | null = null;
function audio() {
  if (!fxSettings.sound) return null;
  try {
    ctx ??= new AudioContext();
    // Suspended at first, 'interrupted' on an iPhone after the app was away: on again.
    if (ctx.state !== 'running') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/**
 * Wakes the sound as a finger lifts (an iPhone only lets a touch start it, and starts it late): so
 * the sound of what that tap opens isn't lost, the first time or after the app was away.
 */
export function wakeAudio() {
  const ac = audio();
  if (!ac || ac.state === 'running') return;
  // A moment of silence played inside the touch is what lets an iPhone's sound out.
  const src = ac.createBufferSource();
  src.buffer = ac.createBuffer(1, 1, ac.sampleRate);
  src.connect(ac.destination);
  src.start();
}

/** One soft note: a few ms to come in (no click), then it dies away like a struck thing. */
function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', volume = 0.18, slideTo?: number) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

let grain: AudioBuffer | null = null;
/** 0.2 s of white noise, made once. */
function grainOf(ac: AudioContext) {
  if (!grain) {
    grain = ac.createBuffer(1, Math.round(ac.sampleRate * 0.2), ac.sampleRate);
    const d = grain.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return grain;
}

/** A short burst of filtered noise: the paper and wood in a card laid down or a tap. */
function noise(start: number, duration: number, freq: number, volume: number) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + start;
  const src = ac.createBufferSource();
  src.buffer = grainOf(ac);
  const band = ac.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = freq;
  band.Q.value = 1.2;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  src.connect(band).connect(gain).connect(ac.destination);
  src.start(t);
  src.stop(t + duration + 0.02);
}

export const sfx = {
  // A card or piece set down: a papery tap with a little body under it.
  pop: () => {
    noise(0, 0.05, 2400, 0.22);
    tone(240, 0, 0.12, 'sine', 0.14, 150);
  },
  // An app opening: a soft breath of air rising, and two bright notes going up.
  open: () => {
    const ac = audio();
    if (!ac) return;
    const t = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = grainOf(ac);
    const band = ac.createBiquadFilter();
    band.type = 'bandpass';
    band.Q.value = 0.9;
    band.frequency.setValueAtTime(700, t);
    band.frequency.exponentialRampToValueAtTime(3200, t + 0.2);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.09, t + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    src.connect(band).connect(gain).connect(ac.destination);
    src.start(t);
    src.stop(t + 0.24);
    tone(587, 0.05, 0.28, 'sine', 0.1);
    tone(880, 0.12, 0.42, 'sine', 0.09);
  },
  // A tick, like a wheel's peg passing: tiny and dry.
  tick: () => noise(0, 0.018, 4200, 0.12),
  // Not this time: two soft low notes going down, not a buzzer.
  boo: () => {
    tone(330, 0, 0.22, 'triangle', 0.12);
    tone(262, 0.16, 0.4, 'triangle', 0.12);
  },
  // A win: a bright chord struck like a bell, its notes a hair apart.
  tada: () => {
    [523, 659, 784, 1047].forEach((f, i) => {
      tone(f, i * 0.035, 1.1, 'sine', 0.09);
      tone(f * 2, i * 0.035, 0.5, 'sine', 0.025);
    });
  },
};

/** The dice's colours: the app's lime, champagne, cream, coral, and a few more. */
const PAPER = ['#f2c94c', '#f6f1e3', '#ff8a65', '#5aa9ff', '#ff7eb6', '#3ed6b5', '#9b8cff'];

/** A colour mixed toward black: the die's lower edge, turned away from the light. */
function shade(hex: string, by: number) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * (1 - by)));
  return `rgb(${c.join(',')})`;
}

/** Where the pips of each face sit, on a 3 x 3 grid (0 to 2). */
const PIPS: number[][][] = [
  [[1, 1]],
  [[0, 0], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[0, 0], [2, 0], [0, 2], [2, 2]],
  [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
  [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]],
];

/**
 * One small die as the app icon's: a rounded square in `color` with a darker lip under it and dark
 * pips (`face`, 1 to 6 of them), drawn once and stamped for every piece.
 */
const dice = new Map<string, HTMLCanvasElement>();
function dieSprite(color: string, face: number, px: number) {
  const key = `${color}${face}@${px}`;
  let c = dice.get(key);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = c.height = px;
  const g = c.getContext('2d')!;
  const u = px / 56;
  const round = (y: number, h: number, fill: string | CanvasGradient) => {
    g.fillStyle = fill;
    g.beginPath();
    // (roundRect is missing before iOS 16: a plain square then.)
    if (g.roundRect) g.roundRect(4 * u, y * u, 48 * u, h * u, 11 * u);
    else g.rect(4 * u, y * u, 48 * u, h * u);
    g.fill();
  };
  round(8, 44, shade(color, 0.3));
  const lit = g.createLinearGradient(8 * u, 4 * u, 48 * u, 48 * u);
  lit.addColorStop(0, color);
  lit.addColorStop(1, shade(color, 0.1));
  round(4, 44, lit);
  g.fillStyle = 'rgba(20, 21, 15, 0.88)';
  for (const [x, y] of PIPS[face - 1]) {
    g.beginPath();
    g.arc((14 + x * 14) * u, (14 + y * 12) * u, 4.6 * u, 0, Math.PI * 2);
    g.fill();
  }
  dice.set(key, c);
  return c;
}

/** The colour the screen in front plays in (its accent), else the app's. */
function accentNow() {
  const el = document.querySelector('.screen') ?? document.documentElement;
  const v = getComputedStyle(el).getPropertyValue('--accent').trim();
  return /^#[0-9a-f]{6}$/i.test(v) ? v : '#c5f235';
}

/**
 * Confetti: two poppers go off at the bottom corners and shoot up small dice, in all the colours,
 * that slow in the air, then tumble down swaying, and fade before they land. One canvas over the
 * screen (a layer per piece made iPhones flicker).
 */
export function confetti(amount = 100) {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  // A bit under the phone's own resolution: the dice are small, and a big canvas redrawn every frame is what lags.
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.className = 'confetti-layer';
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const colors = [accentNow(), ...PAPER];
  const reach = Math.min(1.25, h / 844);
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const bits = Array.from({ length: amount }, (_, i) => {
    const left = i % 2 === 0;
    // Up and in from each corner, fanned out.
    const angle = ((left ? -71 : -109) + rnd(-14, 14)) * (Math.PI / 180);
    const speed = rnd(2300, 3500) * reach;
    const color = colors[i % colors.length];
    return {
      x: left ? rnd(-8, 12) : w - rnd(-8, 12),
      y: h + rnd(0, 16),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      delay: (left ? 0 : 0.12) + rnd(0, 0.08),
      life: rnd(1.9, 2.7),
      size: rnd(14, 20),
      rot: rnd(0, Math.PI * 2),
      vr: rnd(-5, 5),
      sway: rnd(0, Math.PI * 2),
      vs: rnd(2, 4),
      // Made at the size it is drawn (20 px): no scaling down 80 times a frame.
      sprite: dieSprite(color, 1 + Math.floor(rnd(0, 6)), Math.round(20 * dpr)),
    };
  });
  document.body.appendChild(canvas);
  const DRAG = 2.3;
  // Dice are heavy: they drop fast, not flutter.
  const GRAVITY = 1900;
  let last = performance.now();
  const start = last;
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const age = (now - start) / 1000;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const b of bits) {
      const t = age - b.delay;
      if (t < 0) {
        alive = true;
        continue;
      }
      if (t > b.life || b.y > h + 30) continue;
      alive = true;
      const k = Math.exp(-DRAG * dt);
      b.vx *= k;
      b.vy = b.vy * k + GRAVITY * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.rot += b.vr * dt;
      b.sway += b.vs * dt;
      // One matrix set per piece (save, translate, rotate, restore was most of the frame).
      const cs = Math.cos(b.rot) * dpr;
      const sn = Math.sin(b.rot) * dpr;
      ctx.setTransform(cs, sn, -sn, cs, (b.x + Math.sin(b.sway) * 10) * dpr, b.y * dpr);
      ctx.globalAlpha = b.life - t < 0.4 ? (b.life - t) / 0.4 : 1;
      ctx.drawImage(b.sprite, -b.size / 2, -b.size / 2, b.size, b.size);
    }
    if (alive) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}

/** "Something great happened", heard and felt: the fanfare and a happy buzz. */
export function cheer() {
  sfx.tada();
  buzz([40, 60, 40, 60, 120]);
}

/** The full "something great happened" package: cheer, and confetti on top. */
export function celebrate() {
  cheer();
  confetti();
}
