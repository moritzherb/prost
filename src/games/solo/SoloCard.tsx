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
 * The cards under a pile's top one, as a real pile lies: the last three peek out from under it, each
 * a little askew. Laid behind the top card (which stays in the flow and sizes the pile).
 */
export function PileUnder({ cards, up = true }: { cards: Card[]; up?: boolean }) {
  const shown = cards.slice(-3);
  return shown.map((c, k) => (
    <SoloCard
      key={`${c.value}${c.suit}`}
      card={c}
      up={up}
      className="sol-under"
      style={
        {
          '--r': `${wobble(c, 1) * 9}deg`,
          '--x': `${wobble(c, 2) * 6}px`,
          '--y': `${(shown.length - k) * 2.5 + wobble(c, 3) * 3}px`,
        } as CSSProperties
      }
    />
  ));
}
