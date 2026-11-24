import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import BigButton from '../../components/BigButton';
import { t } from '../../i18n';
import { buzz, celebrate, sfx } from '../../lib/fx';
import { load, save } from '../../lib/storage';
import type { GameProps } from '../types';
import { flyIn, reducedMotion } from '../../lib/cardFly';
import { EASE_OUT } from '../../lib/listMotion';
import Bump from '../../components/Bump';
import SoloCard, { lie, PileUnder } from '../solo/SoloCard';
import SoloEnd from '../solo/SoloEnd';
import { anyMove, deal, move, newGame, over, targets, won } from './logic';

/** Accordion: deal, squeeze the line together; one pile left is the rare win. */
export default function Accordion({ exit }: GameProps) {
  const [g, setG] = useState(() => deal(newGame()));
  const [pick, setPick] = useState<number | null>(null);
  const [best, setBest] = useState(() => load<number | null>('accordion-best', null));
  // The line can't get shorter: the best kept, a win cheered.
  useEffect(() => {
    if (!over(g)) return;
    const n = g.piles.length;
    if (won(g)) celebrate();
    setBest((b) => {
      if (b != null && b <= n) return b;
      save('accordion-best', n);
      return n;
    });
  }, [g]);

  // A card dealt flies from the pile into the line, a pile moved flies onto the one it goes on.
  // The line scrolls with the newest card; squeezed together, it comes back up by itself.
  const felt = useRef<HTMLDivElement>(null);
  const pileEl = useRef<HTMLSpanElement>(null);
  const flight = useRef<{ pile: number; from: DOMRect } | null>(null);
  useLayoutEffect(() => {
    const f = flight.current;
    flight.current = null;
    const pileBox = f && (felt.current?.children[f.pile] as HTMLElement | undefined);
    if (!f || !pileBox) return;
    // The line scrolls to its place at once (the card's flight is worked out against it), and every
    // pile glides from where it was instead: a jump of a whole row reads as a glitch.
    const line = felt.current!;
    const was = line.scrollTop;
    pileBox.scrollIntoView({ block: 'nearest' });
    const moved = line.scrollTop - was;
    if (moved && !reducedMotion()) {
      for (const c of line.children) c.animate([{ transform: `translateY(${moved}px)` }, { transform: 'none' }], { duration: 320, easing: EASE_OUT });
    }
    const el = pileBox.querySelector<HTMLElement>('.acc-top');
    // The pile starts `moved` lower (the glide), so the card is told to start that much higher.
    if (el) flyIn(el, new DOMRect(f.from.x, f.from.y - moved, f.from.width, f.from.height), 420);
  }, [g]);

  if (over(g)) {
    const n = g.piles.length;
    return (
      <SoloEnd
        game="accordion"
        won={won(g)}
        title={won(g) ? t('One pile left: solved!') : t('{n} piles left', { n })}
        lead={best != null ? t('Your best: {n} piles', { n: best }) : undefined}
        onAgain={() => {
          setG(deal(newGame()));
          setPick(null);
        }}
        exit={exit}
      />
    );
  }

  const go = (from: number, to: number) => {
    sfx.pop();
    buzz(10);
    const rect = felt.current?.children[from]?.querySelector('.acc-top')?.getBoundingClientRect();
    if (rect) flight.current = { pile: to, from: rect };
    setG(move(g, from, to));
    setPick(null);
  };
  const tap = (i: number) => {
    if (pick != null && targets(g, pick).includes(i)) return go(pick, i);
    const to = targets(g, i);
    if (to.length === 1) return go(i, to[0]);
    if (to.length > 1) return setPick(pick === i ? null : i);
    buzz([20, 30, 20]);
    setPick(null);
  };
  const open = pick != null ? targets(g, pick) : [];

  return (
    <div className="sol bd-play fill">
      <p className="sol-status">{pick != null ? t('Onto which pile?') : anyMove(g) ? t('Tap a pile to move it') : t('Deal the next card')}</p>
      <div ref={felt} className="sol-felt acc-line">
        {g.piles.map((p, i) => (
          <button key={`${p[0].value}${p[0].suit}`} type="button" className={`acc-pile${pick === i ? ' picked' : ''}${open.includes(i) ? ' target' : ''}`} onClick={() => tap(i)}>
            <PileUnder cards={p.slice(0, -1)} />
            <SoloCard key={p.length} card={p[p.length - 1]} className="acc-top" style={lie(p[p.length - 1])} />
            {p.length > 1 && <span className="acc-n">{p.length}</span>}
          </button>
        ))}
      </div>
      <div className="sol-foot">
        <span ref={pileEl} className="sol-pile">
          <SoloCard up={false} className={g.deck.length ? '' : 'gone'} />
          <Bump className="sol-pile-n" value={g.deck.length} by={1.15} />
        </span>
        <BigButton
          size="xl"
          disabled={!g.deck.length}
          onClick={() => {
            sfx.tick();
            const from = pileEl.current?.getBoundingClientRect();
            if (from) flight.current = { pile: g.piles.length, from };
            setG(deal(g));
            setPick(null);
          }}
        >
          {t('Deal')}
        </BigButton>
      </div>
    </div>
  );
}
