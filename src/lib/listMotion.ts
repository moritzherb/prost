import { useLayoutEffect, useRef, type RefObject } from 'react';
import { reducedMotion } from './cardFly';

/** The app's --ease-out (global.css), for the Web Animations API, which can't read CSS variables. */
export const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

/**
 * A short list whose items come and go (chips in a row that wraps): one taken out fades and shrinks
 * first, then the others close the gap by gliding from where they were; a new one grows in. Its items
 * carry `data-key`. Call `before()` right before the list changes for an add; `leave(el, remove)`
 * for a removal. Nothing moves for anyone who asked for less motion.
 */
export function useListMotion(list: RefObject<HTMLElement | null>, change: unknown) {
  const was = useRef<Map<string, DOMRect> | null>(null);
  const items = () => [...(list.current?.querySelectorAll<HTMLElement>('[data-key]') ?? [])];

  useLayoutEffect(() => {
    const prev = was.current;
    was.current = null;
    if (!prev || reducedMotion()) return;
    for (const el of items()) {
      if (typeof el.animate !== 'function') return;
      const from = prev.get(el.dataset.key!);
      const to = el.getBoundingClientRect();
      if (!from) el.animate([{ opacity: 0, transform: 'scale(0.9)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: EASE_OUT });
      else if (from.left !== to.left || from.top !== to.top)
        el.animate([{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` }, { transform: 'none' }], { duration: 220, easing: EASE_OUT });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the list changes
  }, [change]);

  const before = () => {
    was.current = new Map(items().map((el) => [el.dataset.key!, el.getBoundingClientRect()]));
  };

  const leaving = useRef(new Set<Element>());
  const leave = (el: Element | null, remove: () => void) => {
    if (!el || reducedMotion() || typeof el.animate !== 'function') return remove();
    if (leaving.current.has(el)) return;
    leaving.current.add(el);
    const done = () => {
      leaving.current.delete(el);
      before();
      remove();
    };
    el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.9)' }], { duration: 150, easing: EASE_OUT, fill: 'forwards' }).finished.then(done, done);
  };

  return { before, leave };
}
