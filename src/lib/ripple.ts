/**
 * Android's touch ripple: on an Android phone a pressed button fills with a soft circle spreading
 * out from the finger. Only on the app's own press surfaces (buttons, alert and menu rows), only on
 * Android, transform and opacity only.
 */
const HOSTS = '.big-btn, .os-alert-btn, .la-menu-item, .seg-btn';

export function watchRipples() {
  if (typeof document === 'undefined') return;
  document.addEventListener(
    'pointerdown',
    (e) => {
      const root = document.documentElement;
      if (root.dataset.os !== 'android' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const host = (e.target as Element | null)?.closest<HTMLElement>(HOSTS);
      if (!host || (host as HTMLButtonElement).disabled || typeof host.animate !== 'function') return;
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // Big enough to reach the farthest corner from the finger.
      const size = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
      const dot = document.createElement('span');
      dot.className = 'ripple';
      dot.style.cssText = `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px`;
      host.append(dot);
      const grow = dot.animate([{ transform: 'scale(0.1)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)', fill: 'forwards' });
      const fade = () => {
        window.removeEventListener('pointerup', fade);
        window.removeEventListener('pointercancel', fade);
        // Let it reach the edge first, then go.
        void grow.finished.catch(() => {}).then(() => dot.animate([{ opacity: 0.14 }, { opacity: 0 }], { duration: 150, easing: 'linear', fill: 'forwards' }).finished.catch(() => {})).then(() => dot.remove());
      };
      window.addEventListener('pointerup', fade);
      window.addEventListener('pointercancel', fade);
    },
    { passive: true },
  );
}
