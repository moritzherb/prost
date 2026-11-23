import { useEffect, useState } from 'react';
import BigButton from '../../components/BigButton';
import { t } from '../../i18n';
import { buzz, celebrate, sfx } from '../../lib/fx';
import { load, save } from '../../lib/storage';
import type { GameProps } from '../types';
import SoloCard from '../solo/SoloCard';
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
      <div className="sol-felt acc-line">
        {g.piles.map((p, i) => (
          <button key={`${p[0].value}${p[0].suit}`} type="button" className={`acc-pile${pick === i ? ' picked' : ''}${open.includes(i) ? ' target' : ''}`} onClick={() => tap(i)}>
            <SoloCard key={p.length} card={p[p.length - 1]} className="sol-land" />
            {p.length > 1 && <span className="acc-n">{p.length}</span>}
          </button>
        ))}
      </div>
      <div className="sol-foot">
        <span className="sol-pile">
          <SoloCard up={false} className={g.deck.length ? '' : 'gone'} />
          <span className="sol-pile-n">{g.deck.length}</span>
        </span>
        <BigButton
          size="xl"
          disabled={!g.deck.length}
          onClick={() => {
            sfx.tick();
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
