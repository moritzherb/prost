import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { reducedMotion } from '../lib/cardFly';
import { EASE_OUT } from '../lib/listMotion';

/**
 * A number that pops once when it changes (never when it first shows), so a score or a count going
 * up or down is noticed. `by` is how far it swells: small for counts that change on every move.
 */
export default function Bump({ value, by = 1.3, className, children }: { value: number | string; by?: number; className?: string; children?: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const last = useRef(value);
  useLayoutEffect(() => {
    if (last.current === value) return;
    last.current = value;
    const el = ref.current;
    if (!el || reducedMotion() || typeof el.animate !== 'function') return;
    el.animate([{ transform: 'scale(1)' }, { transform: `scale(${by})`, offset: 0.35 }, { transform: 'scale(1)' }], { duration: 320, easing: EASE_OUT });
  }, [value, by]);
  return (
    <span ref={ref} className={className}>
      {children ?? value}
    </span>
  );
}
