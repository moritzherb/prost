import type { CSSProperties } from 'react';
import { CardFace } from '../../components/PlayingCard';
import { cardName, type Card } from '../../lib/cards';

/** A card lying on the table in the patience games: face up, or its back. Sized by --cw. */
export default function SoloCard({ card, up = true, className = '', style }: { card?: Card | null; up?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <span className={`sol-card${className ? ` ${className}` : ''}`} style={style} aria-label={card && up ? cardName(card) : undefined}>
      {card && up ? <CardFace card={card} /> : <span className="pcard-face pcard-back" />}
    </span>
  );
}
