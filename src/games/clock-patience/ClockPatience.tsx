import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import BigButton from '../../components/BigButton';
import { t } from '../../i18n';
import { flyIn } from '../../lib/cardFly';
import { buzz, celebrate, sfx } from '../../lib/fx';
import type { GameProps } from '../types';
import SoloCard from '../solo/SoloCard';
import SoloEnd from '../solo/SoloEnd';
import { CENTER, lost, newGame, over, placeOf, step, won } from './logic';

const HOURS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q'];

/** Clock Patience: turn, lay by its hour, turn again. Luck only. */
export default function ClockPatience({ exit }: GameProps) {
  const [g, setG] = useState(newGame);
  const done = over(g);
  const [ended, setEnded] = useState(false);
  // The last card laid lands from where it was turned.
  const handRef = useRef<HTMLSpanElement>(null);
  const from = useRef<DOMRect | null>(null);
  useLayoutEffect(() => {
    const card = document.querySelector<HTMLElement>(`.clk-place[data-i="${g.from}"] .sol-card`);
    if (card && from.current) flyIn(card, from.current, 320);
    from.current = null;
  }, [g.laid, g.from]);
  // A moment on the finished clock, then the end.
  useEffect(() => {
    if (!done) return;
    if (won(g)) celebrate();
    else sfx.boo();
    const id = window.setTimeout(() => setEnded(true), 1400);
    return () => window.clearTimeout(id);
  }, [done, g]);

  if (ended)
    return (
      <SoloEnd
        game="clock-patience"
        won={won(g)}
        title={won(g) ? t('Every card is out!') : t('The fourth King came too soon')}
        lead={lost(g) ? t('{n} of 52 cards laid.', { n: g.laid }) : undefined}
        onAgain={() => {
          setG(newGame());
          setEnded(false);
        }}
        exit={exit}
      />
    );

  const next = () => {
    if (done) return;
    if (g.hand) from.current = handRef.current?.getBoundingClientRect() ?? null;
    sfx.tick();
    buzz(8);
    setG(step(g));
  };
  const target = g.hand ? placeOf(g.hand) : null;

  return (
    <div className="sol bd-play fill">
      <p className="sol-status">{!g.hand ? (g.laid ? t('Turn the next card') : t('Turn the first card from the middle')) : t('Goes to {hour}', { hour: target === CENTER ? t('the middle') : HOURS[target!] })}</p>
      <div className="sol-felt clk-face">
        {g.down.map((down, i) => {
          const a = ((i + 1) / 12) * Math.PI * 2;
          const pos = i === CENTER ? { left: '50%', top: '50%' } : { left: `${50 + Math.sin(a) * 39}%`, top: `${50 - Math.cos(a) * 39}%` };
          const up = g.up[i];
          return (
            <span key={i} data-i={i} className={`clk-place${target === i ? ' next' : ''}${i === CENTER ? ' center' : ''}`} style={pos as CSSProperties}>
              {up.length ? <SoloCard key={up.length} card={up[up.length - 1]} /> : <SoloCard up={false} className={down.length ? '' : 'gone'} />}
              {up.length > 1 && <span className="clk-laid">{up.length}</span>}
              <span className="clk-hour">{i === CENTER ? 'K' : HOURS[i]}</span>
              {down.length > 0 && <span className="clk-down">{down.length}</span>}
            </span>
          );
        })}
      </div>
      <div className="sol-foot">
        <span className="sol-hand" ref={handRef}>
          {g.hand ? <SoloCard key={g.laid} card={g.hand} className="sol-land" /> : <SoloCard up={false} className="gone" />}
        </span>
        <BigButton size="xl" disabled={done} onClick={next}>
          {g.hand ? t('Lay it down') : t('Turn a card')}
        </BigButton>
      </div>
    </div>
  );
}
