import { describe, expect, it } from 'vitest';
import type { Card } from '../../lib/cards';
import { deal, move, newGame, over, targets, won } from './logic';

const c = (value: number, suit: Card['suit']): Card => ({ value, suit });
/** Dealt in this order (the deck deals from its end). */
const dealt = (...cards: Card[]) => {
  let g = newGame([...cards].reverse());
  for (let i = 0; i < cards.length; i++) g = deal(g);
  return g;
};

describe('Accordion', () => {
  it('a pile goes on the one before or three before, on rank or suit', () => {
    const g = dealt(c(10, 'spades'), c(3, 'hearts'), c(9, 'clubs'), c(10, 'hearts'));
    // 10♥: one before is 9♣ (no), three before is 10♠ (rank): yes; 2 before isn't allowed.
    expect(targets(g, 3)).toEqual([0]);
    const after = move(g, 3, 0);
    expect(after.piles).toHaveLength(3);
    expect(after.piles[0]).toEqual([c(10, 'spades'), c(10, 'hearts')]);
    expect(targets(after, 1)).toEqual([0]); // 3♥ now matches the 10♥ on top (suit)
  });

  it('no other moves', () => {
    const g = dealt(c(10, 'spades'), c(3, 'hearts'), c(9, 'clubs'));
    expect(move(g, 2, 0)).toBe(g);
  });

  it('one pile left at the end wins', () => {
    let g = dealt(c(10, 'spades'), c(10, 'hearts'));
    g = move(g, 1, 0);
    expect(over(g)).toBe(true);
    expect(won(g)).toBe(true);
  });
});
