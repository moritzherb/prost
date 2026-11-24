import { EASE_OUT } from './listMotion';

/*
 * Measured on an iPhone screen recording (60 fps) of unlocking to the home screen: the first frame
 * shows home 3.34 times its size, already fully opaque, and it comes down onto its place in about
 * 400 ms, fastest at first. The depth left (1 - 1/scale) shrinks by the same share every frame;
 * here with a time constant of 85 ms over 520 ms (a touch slower than the recording), the scale
 * following from it.
 */
const FROM = 3.34;
const TAU = 85;
const MS = 520;
const STEPS = 28;
const SCALES = Array.from({ length: STEPS + 1 }, (_, i) => {
  if (i === STEPS) return 1;
  const depth = (1 - 1 / FROM) * Math.exp(-((i / STEPS) * MS) / TAU);
  return +(1 / (1 - depth)).toFixed(4);
});

/** What's on the home screen, in layers that zoom together (the wallpaper under them stays put). */
const LAYERS = ':scope > :is(.sb-pages, .sb-dots-bar, .sb-dock, .os-done, .la-glance, .la-widgets, .la-grid, .la-dock, .la-search)';

/**
 * Home comes in as the iPhone's does after unlocking: everything on it as one layer, zoomed in
 * around the middle of the screen, coming down onto its place. No fade (an iPhone has none), so
 * nothing on it is ever see-through or darkened on its way. On opening the app and every time
 * home shows again; transform only, on the phone's compositor.
 */
export function playIntro() {
  const home = document.querySelector<HTMLElement>('.os-home');
  if (!home || typeof home.animate !== 'function' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // An Android phone has no zoom: home's content settles in from a touch smaller, Material's emphasized curve.
  if (home.querySelector(':scope .la-grid, :scope .la-dock')) {
    for (const el of home.querySelectorAll<HTMLElement>(LAYERS)) {
      el.animate(
        [
          { transform: 'scale(0.94)', opacity: 0.6 },
          { transform: 'none', opacity: 1 },
        ],
        { duration: 400, easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)', fill: 'backwards' },
      );
    }
    return;
  }
  const screen = home.getBoundingClientRect();
  const cx = screen.left + screen.width / 2;
  const cy = screen.top + screen.height / 2;
  // On top of the layer's zoom each app and widget has a little motion of its own: it starts a bit
  // further out and bigger and lands a beat after the ones nearer the middle, each a touch
  // differently (the jitter is fixed by where it sits, so it is the same every time).
  const far = Math.hypot(screen.width / 2, screen.height / 2) || 1;
  for (const el of home.querySelectorAll<HTMLElement>(':scope .sb-pages :is(.app, .widget), :scope .la-grid .app, :scope .la-widgets .widget')) {
    const r = el.getBoundingClientRect();
    const dx = r.left + r.width / 2 - cx;
    const dy = r.top + r.height / 2 - cy;
    const k = Math.min(1, Math.hypot(dx, dy) / far);
    const jitter = (Math.sin(r.left * 12.9898 + r.top * 78.233) * 43758.5453) % 1;
    const j = (jitter + 1) / 2;
    el.animate(
      [
        { transform: `translate(${dx * 0.14}px, ${dy * 0.14}px) scale(1.1)` },
        { transform: 'none' },
      ],
      { duration: 380 + k * 120 + j * 80, delay: k * 70 + j * 50, easing: EASE_OUT, fill: 'backwards' },
    );
  }
  // The layers last: measuring comes first, before their zoom moves everything.
  for (const el of home.querySelectorAll<HTMLElement>(LAYERS)) {
    const r = el.getBoundingClientRect();
    // Each layer scaled around the same point, the screen's middle: together they move as one.
    const origin = `${cx - r.left}px ${cy - r.top}px`;
    el.animate(
      SCALES.map((s) => ({ transform: `scale(${s})`, transformOrigin: origin })),
      { duration: MS, easing: 'linear', fill: 'backwards' },
    );
  }
}
