import { describe, expect, it } from 'vitest';
import type { Card } from '../../lib/cards';
import { alive, guess, lost, newGame, won } from './logic';

const c = (value: number, suit: Card['suit'] = 'spades'): Card => ({ value, suit });

describe('Beat the Deck', () => {
  it('deals nine face up and keeps 43 to draw', () => {
    const g = newGame();
    expect(g.places).toHaveLength(9);
    expect(g.deck).toHaveLength(43);
  });

  it('right goes on top, wrong or the same rank turns the place over', () => {
    // Drawn from the end: the grid takes the last nine, the pile is what's left.
    const deck = [c(5), c(7), c(9), ...Array.from({ length: 9 }, () => c(8, 'hearts'))];
    let g = newGame(deck);
    g = guess(g, 0, 'higher'); // 9 on 8: right
    expect(g.places[0]).toMatchObject({ top: c(9), count: 2, dead: false });
    g = guess(g, 1, 'lower'); // 7 on 8: right
    expect(g.places[1].dead).toBe(false);
    g = guess(g, 2, 'higher'); // 5 on 8: wrong
    expect(g.places[2].dead).toBe(true);
    expect(alive(g)).toBe(8);
    expect(won(g)).toBe(true);
  });

  it('a tie is wrong; all nine gone loses', () => {
    let g = newGame([...Array.from({ length: 9 }, () => c(8)), ...Array.from({ length: 9 }, () => c(8, 'hearts'))]);
    for (let i = 0; i < 9; i++) g = guess(g, i, 'higher');
    expect(lost(g)).toBe(true);
    expect(guess(g, 0, 'lower')).toBe(g);
  });
});
