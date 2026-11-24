import { EASE_OUT } from './listMotion';

/** How much bigger the home screen starts, as the phone's comes in after unlocking or closing an app. */
const FROM = 1.2;
const MS = 600;

/**
 * Apple's default spring (SwiftUI `.smooth`: 0.5 s, no bounce), critically damped, as a CSS
 * `linear()` curve: it gathers fast and comes to rest without overshooting. Older engines get the
 * strong ease-out instead.
 */
const SPRING = (() => {
  const w = (2 * Math.PI) / 0.5;
  const points = Array.from({ length: 41 }, (_, i) => {
    const t = ((i / 40) * MS) / 1000;
    return i === 40 ? 1 : +(1 - (1 + w * t) * Math.exp(-w * t)).toFixed(4);
  });
  const curve = `linear(${points.join(', ')})`;
  return typeof CSS !== 'undefined' && CSS.supports('animation-timing-function', curve) ? curve : EASE_OUT;
})();

/**
 * The home screen comes in as the iPhone's does after unlocking or closing an app: everything on it
 * as one layer, a little bigger and faded out, zooming down onto its place from the middle of the
 * screen, all at once. On opening the app, and every time home shows again after that; transform
 * and opacity only, so it runs on the phone's compositor.
 */
export function playIntro() {
  const home = document.querySelector<HTMLElement>('.os-home');
  if (!home || typeof home.animate !== 'function' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  // The dock and the page dots move as wholes (their glass with them); the apps in the dock ride along.
  const items = [...home.querySelectorAll<HTMLElement>('.app, .widget, .sb-dock, .sb-dots-bar')].filter((el) => {
    if (!el.matches('.sb-dock') && el.closest('.sb-dock')) return false;
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < h && r.right > 0 && r.left < w;
  });
  for (const el of items) {
    const r = el.getBoundingClientRect();
    // Each piece scaled about the screen's middle, as if the whole layer were: same zoom, no stagger.
    const dx = (r.left + r.width / 2 - w / 2) * (FROM - 1);
    const dy = (r.top + r.height / 2 - h / 2) * (FROM - 1);
    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${FROM})`, opacity: 0 },
        { opacity: 1, offset: 0.55 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: MS, easing: SPRING, fill: 'backwards' },
    );
  }
}
