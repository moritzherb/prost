import { newDeck, type Card } from '../../lib/cards';
import { shuffle } from '../../lib/random';

/*
 * Beat the Deck: nine cards face up in a grid, the rest face down as the draw pile. Pick a grid
 * card and say whether the next card from the pile is higher or lower. Right: it goes on top of
 * the grid card. Wrong, or the same rank: that place is turned over, out of the game. Through the
 * whole pile with at least one place left: you win. All nine turned over: you lose.
 */

export const PLACES = 9;

export interface Place {
  /** The card on top. */
  top: Card;
  /** Cards in this place (for the stack's height). */
  count: number;
  /** The cards under the top one, the first laid first (they peek out of the pile). */
  below: Card[];
  dead: boolean;
}

export interface Game {
  places: Place[];
  deck: Card[];
  /** The last guess: which place, and whether it was right (for the animation and the line on top). */
  last: { place: number; card: Card; right: boolean } | null;
}

export function newGame(deck: Card[] = shuffle(newDeck())): Game {
  const rest = [...deck];
  const places = Array.from({ length: PLACES }, () => ({ top: rest.pop()!, count: 1, below: [], dead: false }));
  return { places, deck: rest, last: null };
}

export type Guess = 'higher' | 'lower';

export function guess(g: Game, place: number, how: Guess): Game {
  const p = g.places[place];
  if (!p || p.dead || !g.deck.length || over(g)) return g;
  const deck = g.deck.slice(0, -1);
  const card = g.deck[g.deck.length - 1];
  const right = how === 'higher' ? card.value > p.top.value : card.value < p.top.value;
  const places = g.places.map((x, i) => (i === place ? { top: card, count: x.count + 1, below: [...x.below, x.top], dead: !right } : x));
  return { places, deck, last: { place, card, right } };
}

export const alive = (g: Game) => g.places.filter((p) => !p.dead).length;
export const won = (g: Game) => !g.deck.length && alive(g) > 0;
export const lost = (g: Game) => alive(g) === 0;
export const over = (g: Game) => won(g) || lost(g);
