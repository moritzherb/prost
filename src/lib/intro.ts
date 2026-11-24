/*
 * Measured on an iPhone screen recording (60 fps) of unlocking to the home screen: the first frame
 * shows home 3.34 times its size, already fully opaque, and it comes down onto its place in about
 * 400 ms, fastest at first. The depth left (1 - 1/scale) shrinks by the same share every frame,
 * with a time constant of 70 ms; the scale follows from it.
 */
const FROM = 3.34;
const TAU = 70;
const MS = 420;
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
  const screen = home.getBoundingClientRect();
  const cx = screen.left + screen.width / 2;
  const cy = screen.top + screen.height / 2;
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
