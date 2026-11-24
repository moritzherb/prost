import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import BigButton from '../../components/BigButton';
import { t } from '../../i18n';
import { rankLabel } from '../../lib/cards';
import { buzz, celebrate, sfx } from '../../lib/fx';
import type { GameProps } from '../types';
import { flyIn } from '../../lib/cardFly';
import Bump from '../../components/Bump';
import SoloCard, { lie, PileUnder } from '../solo/SoloCard';
import SoloEnd from '../solo/SoloEnd';
import { alive, guess, newGame, over, won, type Game, type Guess } from './logic';

/** When a wrong place is edge on, half way through turning over (.btd-place.turning: delay + duration). */
const TURN_MS = 1200;
/** The same when it is the last place (.turning.last): the red moment is shorter, the end is near. */
const TURN_LAST_MS = 760;

/** Beat the Deck: higher or lower on one of nine cards, through the whole deck. */
export default function BeatTheDeck({ exit }: GameProps) {
  const [g, setG] = useState(newGame);
  const [pick, setPick] = useState<number | null>(null);
  // A wrong guess: the card lands, shows red a moment and the place lifts and turns over (.turning),
  // then lies face down (.down, the turn's second half). Worked out in the render, so the very
  // first frame already shows it face up; TURN_MS matches the CSS.
  const [turned, setTurned] = useState<Game | null>(null);
  const showing = g.last && !g.last.right && turned !== g ? g.last.place : null;
  useEffect(() => {
    if (!g.last || g.last.right) return;
    const id = window.setTimeout(() => setTurned(g), over(g) ? TURN_LAST_MS : TURN_MS);
    return () => window.clearTimeout(id);
  }, [g]);
  // The end comes a beat after the last card has landed (its flight takes 420 ms), or the last
  // place has turned over (its turn ends 320 ms after TURN_MS).
  const [endOf, setEndOf] = useState<Game | null>(null);
  useEffect(() => {
    if (!over(g) || showing != null) return;
    const id = window.setTimeout(() => setEndOf(g), g.last?.right ? 720 : 450);
    return () => window.clearTimeout(id);
  }, [g, showing]);
  // The card drawn flies from the pile onto the place it was guessed for.
  const felt = useRef<HTMLDivElement>(null);
  const pile = useRef<HTMLSpanElement>(null);
  const flight = useRef<{ place: number; from: DOMRect } | null>(null);
  useLayoutEffect(() => {
    const f = flight.current;
    flight.current = null;
    const el = f && felt.current?.children[f.place]?.querySelector<HTMLElement>('.btd-top');
    if (el) flyIn(el, f.from, 420);
  }, [g]);
  const done = endOf === g;
  useEffect(() => {
    // A moment after the end screen is up, once its own entrance has run: both together stuttered.
    if (!done || !won(g)) return;
    const id = window.setTimeout(celebrate, 450);
    return () => window.clearTimeout(id);
  }, [done, g]);

  if (done)
    return (
      <SoloEnd
        game="beat-the-deck"
        won={won(g)}
        title={won(g) ? t('You beat the deck!') : t('The deck wins')}
        lead={won(g) ? t('{n} of 9 places still open.', { n: alive(g) }) : t('{n} cards were left in the pile.', { n: g.deck.length })}
        onAgain={() => {
          setG(newGame());
          setPick(null);
        }}
        exit={exit}
      />
    );

  const play = (how: Guess) => {
    if (pick == null) return;
    const next = guess(g, pick, how);
    if (next === g) return;
    if (next.last?.right) {
      sfx.pop();
      buzz(10);
    } else {
      sfx.boo();
      buzz([30, 30, 30]);
    }
    const from = pile.current?.getBoundingClientRect();
    if (from) flight.current = { place: pick, from };
    setG(next);
    if (next.places[pick].dead) setPick(null);
  };
  const sel = pick != null ? g.places[pick] : null;

  return (
    <div className="sol bd-play fill">
      <p className="sol-status">
        {sel ? t('Higher or lower than {rank}?', { rank: rankLabel(sel.top.value) }) : t('Pick a card')}
      </p>
      <div ref={felt} className="sol-felt btd-grid">
        {g.places.map((p, i) => {
          const face = !p.dead || showing === i;
          // The last guess: a green rim if it was right, red if not (gone once the place lies face down).
          const mark = g.last?.place === i && face ? (g.last.right ? ' right' : ' wrong') : '';
          return (
            <button
              key={i}
              type="button"
              className={`btd-place${pick === i ? ' picked' : ''}${showing === i ? (over(g) ? ' turning last' : ' turning') : p.dead ? ' down' : ''}`}
              disabled={p.dead}
              onClick={() => setPick(pick === i ? null : i)}
            >
              <PileUnder cards={p.below} up={face} />
              <SoloCard key={`${p.count}`} card={p.top} up={face} className={`btd-top${mark}`} style={lie(p.top)} />
            </button>
          );
        })}
      </div>
      <div className="sol-foot">
        <span ref={pile} className="sol-pile">
          <SoloCard up={false} />
          <Bump className="sol-pile-n" value={g.deck.length} by={1.15} />
        </span>
        <div className="btd-guess">
          <BigButton variant="light" disabled={pick == null} onClick={() => play('lower')}>
            {t('Lower')}
          </BigButton>
          <BigButton disabled={pick == null} onClick={() => play('higher')}>
            {t('Higher')}
          </BigButton>
        </div>
      </div>
    </div>
  );
}
