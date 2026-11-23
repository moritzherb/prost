import { newDeck, type Card } from '../../lib/cards';
import { shuffle } from '../../lib/random';

/*
 * Clock Patience: 13 piles of four, face down, twelve round a clock (Ace at one, Jack at eleven,
 * Queen at twelve) and the Kings' pile in the middle. Turn the middle's top card, put it face up
 * by its hour, turn the top card of that pile, and so on. Every card out before the fourth King:
 * you win. The fourth King too early: you lose. No choices: it's luck.
 */

/** Where a card goes: 0–11 the hours one to twelve (Ace = one), 12 the middle (Kings). */
export const placeOf = (c: Card) => (c.value === 14 ? 0 : c.value === 13 ? 12 : c.value - 1);
export const CENTER = 12;

export interface Game {
  /** Face down, by place: the top is the last. */
  down: Card[][];
  /** Laid face up by each place. */
  up: Card[][];
  /** The card just turned, still to be laid by its hour (null before the first turn). */
  hand: Card | null;
  /** Where the card in hand was turned from. */
  from: number;
  /** Cards laid so far. */
  laid: number;
}

export function newGame(deck: Card[] = shuffle(newDeck())): Game {
  const down: Card[][] = Array.from({ length: 13 }, () => []);
  deck.forEach((c, i) => down[i % 13].push(c));
  return { down, up: Array.from({ length: 13 }, () => []), hand: null, from: CENTER, laid: 0 };
}

const kings = (g: Game) => g.up[CENTER].length;
export const won = (g: Game) => g.laid === 52;
export const lost = (g: Game) => kings(g) === 4 && !won(g);
export const over = (g: Game) => kings(g) === 4;

/** One step: the first turn takes the middle's top card; after that, the card in hand goes to its
 *  hour and that pile's top card is turned. */
export function step(g: Game): Game {
  if (over(g)) return g;
  if (!g.hand) {
    const down = g.down.map((p) => [...p]);
    const hand = down[CENTER].pop() ?? null;
    return { ...g, down, hand, from: CENTER };
  }
  const to = placeOf(g.hand);
  const up = g.up.map((p, i) => (i === to ? [...p, g.hand!] : p));
  const laid = g.laid + 1;
  const next = { ...g, up, laid, hand: null as Card | null, from: to };
  if (up[CENTER].length === 4) return next;
  const down = g.down.map((p) => [...p]);
  return { ...next, down, hand: down[to].pop() ?? null };
}
