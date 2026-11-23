import { newDeck, type Card } from '../../lib/cards';
import { shuffle } from '../../lib/random';

/*
 * Accordion: deal one card at a time into a line of piles, left to right. A pile may go on the
 * pile right before it or three before it, if their top cards match in rank or suit: the whole
 * pile moves. Deal everything and squeeze the line together: one pile left wins (rare).
 */

export interface Game {
  /** Left to right; each pile's top card last. */
  piles: Card[][];
  deck: Card[];
}

export function newGame(deck: Card[] = shuffle(newDeck())): Game {
  return { piles: [], deck: [...deck] };
}

const top = (p: Card[]) => p[p.length - 1];
const match = (a: Card, b: Card) => a.value === b.value || a.suit === b.suit;

/** Where pile `i` may go: one before and/or three before. */
export function targets(g: Game, i: number): number[] {
  const p = g.piles[i];
  if (!p) return [];
  return [i - 1, i - 3].filter((j) => j >= 0 && match(top(p), top(g.piles[j])));
}

export function deal(g: Game): Game {
  if (!g.deck.length) return g;
  return { piles: [...g.piles, [g.deck[g.deck.length - 1]]], deck: g.deck.slice(0, -1) };
}

export function move(g: Game, from: number, to: number): Game {
  if (!targets(g, from).includes(to)) return g;
  const piles = g.piles.map((p, i) => (i === to ? [...p, ...g.piles[from]] : p)).filter((_, i) => i !== from);
  return { ...g, piles };
}

export const anyMove = (g: Game) => g.piles.some((_, i) => targets(g, i).length > 0);
export const over = (g: Game) => !g.deck.length && !anyMove(g);
export const won = (g: Game) => over(g) && g.piles.length === 1;
