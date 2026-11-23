import { describe, expect, it } from 'vitest';
import { newDeck, type Card } from '../../lib/cards';
import { call, canMove, canPlay, fits, newGame, play, POINTS, skip, winner, type Game } from './logic';

const c = (value: number, suit: Card['suit']): Card => ({ value, suit });

/** Plays the first card that may be played until `stop` says so (or 2000 moves). */
function autoplay(g: Game, stop: (g: Game) => boolean) {
  for (let n = 0; n < 2000 && !stop(g); n++) {
    if (g.phase === 'call') g = call(g, g.caller, (['queens', 'king', 'tricks'] as const).find((k) => !g.played.includes(k))!);
    else if (g.phase === 'jacks' && !canMove(g, g.turn)) g = skip(g, g.turn);
    else {
      const card = g.hands[g.turn].find((x) => canPlay(g, g.turn, x))!;
      g = play(g, g.turn, card);
    }
  }
  return g;
}

describe('4er', () => {
  it('deals 13 each; the player left of the dealer calls', () => {
    const g = newGame(2);
    expect(g.hands.every((h) => h.length === 13)).toBe(true);
    expect(g.phase).toBe('call');
    expect(g.caller).toBe(3);
    expect(call(g, 0, 'king')).toBe(g);
    expect(call(g, 3, 'king').turn).toBe(3);
  });

  it('follow suit if you can; the highest of the suit led takes it', () => {
    expect(winner([{ seat: 0, card: c(5, 'hearts') }, { seat: 1, card: c(14, 'spades') }, { seat: 2, card: c(9, 'hearts') }, { seat: 3, card: c(2, 'hearts') }])).toBe(2);
    let g = call(newGame(3), 0, 'tricks');
    const lead = g.hands[0][0];
    g = play(g, 0, lead);
    const hand = g.hands[1];
    const follows = hand.some((x) => x.suit === lead.suit);
    for (const x of hand) expect(canPlay(g, 1, x)).toBe(!follows || x.suit === lead.suit);
  });

  it('the Queens round ends when all four are taken, 20 each', () => {
    const g = autoplay(call(newGame(3), 0, 'queens'), (x) => x.played.length === 1);
    expect(g.played).toEqual(['queens']);
    expect(g.scores.reduce((a, b) => a + b, 0)).toBe(4 * POINTS.queen);
    // Whoever called it deals next; the one left of them calls.
    expect(g.dealer).toBe(0);
    expect(g.caller).toBe(1);
  });

  it('the King round: 50 for the King of clubs, nobody else scores', () => {
    const first = newGame(3);
    const g = autoplay(call(first, 0, 'king'), (x) => x.played.length === 1);
    expect([...g.scores].sort((a, b) => a - b)).toEqual([0, 0, 0, 50]);
    // The look back at the round, the last trick's round, a new deal.
    expect(g.lastRound).toEqual({ kind: 'king', points: g.scores });
    expect(g.lastTrick?.kind).toBe('king');
    expect(g.deal).toBe(first.deal + 1);
  });

  it('the Tricks round: 5 a trick, all 13', () => {
    const g = autoplay(call(newGame(3), 0, 'tricks'), (x) => x.played.length === 1);
    expect(g.scores.reduce((a, b) => a + b, 0)).toBe(13 * POINTS.trick);
  });

  it('each round is called once; then the Jacks round, and the game ends with two out', () => {
    let g = autoplay(newGame(0), (x) => x.phase === 'jacks');
    expect(new Set(g.played)).toEqual(new Set(['queens', 'king', 'tricks']));
    const before = g.scores.reduce((a, b) => a + b, 0);
    g = autoplay(g, (x) => x.phase === 'over');
    expect(g.phase).toBe('over');
    expect(g.out).toHaveLength(2);
    expect(g.scores.reduce((a, b) => a + b, 0)).toBe(before + POINTS.first + POINTS.second);
  });

  it('Jacks lines: a Jack starts a line, then one step down or up', () => {
    const lines = { hearts: { lo: 10, hi: 12 }, diamonds: null, spades: null, clubs: null };
    expect(fits(lines, c(9, 'hearts'))).toBe(true);
    expect(fits(lines, c(13, 'hearts'))).toBe(true);
    expect(fits(lines, c(14, 'hearts'))).toBe(false);
    expect(fits(lines, c(10, 'diamonds'))).toBe(false);
    expect(fits(lines, c(11, 'diamonds'))).toBe(true);
  });

  it('an Ace in the Jacks round: you play once more', () => {
    const deck = newDeck();
    let g = autoplay(newGame(0, deck), (x) => x.phase === 'jacks');
    // Lay hearts up to the King, then give the turn's player the Ace.
    g = { ...g, lines: { ...g.lines, hearts: { lo: 2, hi: 13 } }, hands: g.hands.map((h, s) => (s === g.turn ? [c(14, 'hearts'), c(11, 'spades'), c(3, 'clubs')] : h)) };
    const seat = g.turn;
    g = play(g, seat, c(14, 'hearts'));
    expect(g.turn).toBe(seat);
    expect(g.again).toBe(true);
  });
});
