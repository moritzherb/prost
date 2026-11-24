import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { Box3D, type FlapState } from './box3d';

/**
 * The box built ahead, while the setup shows: building it and drawing it the first time (the
 * shaders) takes a moment, and that moment shouldn't come when the game starts.
 */
let ready: { size: 9 | 12; square: boolean; box: Box3D } | null = null;
let dropTimer = 0;

/** Builds the box for this size (or the square one) now; the one built before for another goes. */
export function prepareBox3D(size: 9 | 12, square = false) {
  window.clearTimeout(dropTimer);
  if (ready?.size === size && ready.square === square) return;
  ready?.box.dispose();
  ready = null;
  try {
    const box = new Box3D(document.createElement('canvas'), size, () => {}, square);
    ready = { size, square, box };
    box.warmUp();
  } catch {
    // Built when the game starts instead (or the flat box, if it can't be).
  }
}

/** The setup has gone: a box built ahead that no game took is let go of. */
export function dropBox3D() {
  window.clearTimeout(dropTimer);
  dropTimer = window.setTimeout(() => {
    ready?.box.dispose();
    ready = null;
  }, 1000);
}

/** The box built ahead for this size, if there is one (it's then the caller's). */
function takeReady(size: 9 | 12, square: boolean) {
  if (ready?.size !== size || ready.square !== square) return null;
  const box = ready.box;
  ready = null;
  window.clearTimeout(dropTimer);
  return box;
}

/**
 * The box in 3D (box3d.ts) on a canvas, with what's written on the felt laid over its front.
 * Loaded on its own (three.js is big): the game shows the flat box until it's there, and keeps it
 * where a phone can't draw 3D.
 */
export default function Box3DView({
  size,
  flaps,
  dice,
  rolls,
  square,
  onTap,
  onFail,
  children,
}: {
  size: 9 | 12;
  flaps: FlapState;
  dice: number[] | null;
  rolls: number;
  /** The square box: each side's colour and flaps (null: nobody's), the side on now, and how far it's turned (in quarters). */
  square?: { sides: ({ color: string; open: number[] } | null)[]; live: number; turn: number };
  onTap: (n: number) => void;
  onFail: () => void;
  children?: ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const box = useRef<Box3D | null>(null);
  const tap = useRef(onTap);
  tap.current = onTap;
  const last = useRef<number[]>([1, 1]);
  if (dice) last.current = dice;

  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    let b: Box3D;
    try {
      const built = takeReady(size, !!square);
      if (built) {
        b = built;
        b.onTap = (n) => tap.current(n);
      } else b = new Box3D(document.createElement('canvas'), size, (n) => tap.current(n), !!square);
    } catch {
      onFail();
      return;
    }
    b.canvas.className = 'nf-canvas';
    el.appendChild(b.canvas);
    box.current = b;
    const fit = () => b.resize(el.clientWidth, el.clientHeight);
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();
    return () => {
      ro.disconnect();
      b.canvas.remove();
      b.dispose();
      box.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, !!square]);

  // The flaps as the game has them now (cheap when nothing changed: only what moves animates).
  const key = `${flaps.open.join(',')}|${flaps.picked.join(',')}|${flaps.falling.join(',')}|${flaps.interactive}|${!!flaps.stuck}`;
  const latest = useRef(flaps);
  latest.current = flaps;
  const sides = useRef(square);
  sides.current = square;
  const sideKey = square ? `${square.sides.map((x) => (x ? `${x.color}:${x.open.join('.')}` : '-')).join('|')}#${square.live}` : '';
  useEffect(() => {
    // The other rows first: the row on now is then the one setFlaps moves.
    if (sides.current) box.current?.setSides(sides.current.sides, sides.current.live);
    box.current?.setFlaps(latest.current);
  }, [key, sideKey]);

  useEffect(() => {
    if (square) box.current?.setTurn(square.turn);
  }, [square?.turn]);

  useEffect(() => {
    box.current?.setDice(dice, rolls, last.current);
  }, [dice, rolls]);

  return (
    <div className={`nf-stage size-${size}${square ? ' square' : ''}`}>
      <div ref={host} className="nf-canvas-host" />
      <div className="nf-stage-felt">{children}</div>
    </div>
  );
}
