import { describe, expect, it } from 'vitest';
import { newDeck } from '../../lib/cards';
import { CENTER, lost, newGame, over, placeOf, step, won } from './logic';

describe('Clock Patience', () => {
  it('deals 13 piles of four', () => {
    const g = newGame();
    expect(g.down.every((p) => p.length === 4)).toBe(true);
  });

  it('Aces go at one, Queens at twelve, Kings in the middle', () => {
    expect(placeOf({ value: 14, suit: 'hearts' })).toBe(0);
    expect(placeOf({ value: 12, suit: 'hearts' })).toBe(11);
    expect(placeOf({ value: 13, suit: 'hearts' })).toBe(CENTER);
  });

  it('plays out to the fourth King: all 52 laid wins, sooner loses', () => {
    for (let k = 0; k < 30; k++) {
      let g = newGame();
      let n = 0;
      while (!over(g) && n++ < 200) g = step(g);
      expect(over(g)).toBe(true);
      expect(won(g) !== lost(g)).toBe(true);
      expect(g.up.flat().length).toBe(g.laid);
    }
  });

  it('an unshuffled deck plays out too', () => {
    const deck = newDeck();
    const g0 = newGame(deck);
    let g = g0;
    while (!over(g)) g = step(g);
    expect(over(g)).toBe(true);
  });
});
