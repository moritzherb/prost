import type { CSSProperties } from 'react';
import { CardFace } from '../../components/PlayingCard';
import { cardName, SUITS, type Card } from '../../lib/cards';

/** A card lying on the table in the patience games: face up, or its back. Sized by --cw. */
export default function SoloCard({ card, up = true, className = '', style }: { card?: Card | null; up?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <span className={`sol-card${className ? ` ${className}` : ''}`} style={style} aria-label={card && up ? cardName(card) : undefined}>
      {card && up ? <CardFace card={card} /> : <span className="pcard-face pcard-back" />}
    </span>
  );
}

/** A small number from a card, the same every time, so each card keeps its own messy spot. */
const wobble = (c: Card, salt: number) => ((Math.imul(c.value * 97 + SUITS.indexOf(c.suit) * 31 + salt * 7919, 2654435761) >>> 0) % 1000) / 1000 - 0.5;

/**
 * Where a card lies on its pile: a little off the middle and askew, the same every time, so a card
 * stays put when the next one is dropped on it (as --r, --x, --y for .sol-under, .btd-top, .acc-top).
 */
export const lie = (c: Card) =>
  ({
    '--r': `${wobble(c, 1) * 9}deg`,
    '--x': `${wobble(c, 2) * 6}px`,
    '--y': `${wobble(c, 3) * 6}px`,
  }) as CSSProperties;

/** The cards under a pile's top one, the last three, each where it was dropped. Laid behind the top card (which stays in the flow and sizes the pile). */
export function PileUnder({ cards, up = true }: { cards: Card[]; up?: boolean }) {
  return cards.slice(-3).map((c) => <SoloCard key={`${c.value}${c.suit}`} card={c} up={up} className="sol-under" style={lie(c)} />);
}
