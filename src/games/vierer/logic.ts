import { newDeck, SUITS, type Card, type Suit } from '../../lib/cards';
import { shuffle } from '../../lib/random';

/*
 * 4er – four players, 52 cards, 2 low and Ace high, all dealt. Points are bad: the fewest wins.
 * - Three rounds of tricks, each called once, in an order the players choose: the player left of
 *   the dealer calls one of the rounds not played yet and leads its first trick.
 *   Queens: 20 points for each Queen in the tricks you take; over once all four are taken.
 *   King: 50 points for whoever takes the King of clubs; over once it's taken.
 *   Tricks: 5 points for every trick you take; all 13 are played.
 * - Tricks: follow the suit led if you can; the highest card of the suit led takes the trick and
 *   leads the next one.
 * - After a round, whoever called it deals the next; the player left of them calls.
 * - Last, the Jacks round: dealt again, the player left of the dealer starts. Each suit is a line
 *   that starts with its Jack and grows one step down (10, 9 … 2) or up (Q, K, A) at a time. On
 *   your turn you must play a card that fits a line if you have one (any of them); otherwise you
 *   sit it out. After an Ace you play once more. The first player out of cards gets -50, the
 *   second -20, and the round (and the game) ends.
 */

export type RoundKind = 'queens' | 'king' | 'tricks';
export const ROUNDS: RoundKind[] = ['queens', 'king', 'tricks'];
export const PLAYERS = 4;
export const QUEEN = 12;
export const JACK = 11;
export const KING_OF_CLUBS = { value: 13, suit: 'clubs' } as const;
const ACE = 14;
export const POINTS = { queen: 20, king: 50, trick: 5, first: -50, second: -20 };

export interface Play {
  seat: number;
  card: Card;
}

export interface Line {
  lo: number;
  hi: number;
}

export interface Game {
  phase: 'call' | 'tricks' | 'jacks' | 'over';
  dealer: number;
  /** Whoever calls (and leads) the round being played or about to be chosen. */
  caller: number;
  played: RoundKind[];
  round: RoundKind | null;
  hands: Card[][];
  turn: number;
  trick: Play[];
  /** The trick just taken, and by whom (shown a moment on every phone). */
  lastTrick: { by: number; plays: Play[] } | null;
  /** Tricks taken this round, by seat. */
  tricks: number[];
  /** Queens taken this round. */
  queens: number;
  kingTaken: boolean;
  /** Points this round so far, by seat. */
  roundPoints: number[];
  /** Points over the whole game, by seat. */
  scores: number[];
  /** Jacks round: each suit's line (null until its Jack is down). */
  lines: Record<Suit, Line | null>;
  /** Jacks round: seats in the order they ran out of cards. */
  out: number[];
  /** Jacks round: the seat that just played an Ace plays once more. */
  again: boolean;
  /** Counts moves, so every phone animates each one once. */
  seq: number;
}

export const same = (a: Card, b: Card) => a.value === b.value && a.suit === b.suit;
const bySuit = (a: Card, b: Card) => SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit) || a.value - b.value;
const zeros = () => [0, 0, 0, 0];
const emptyLines = (): Record<Suit, Line | null> => ({ hearts: null, diamonds: null, spades: null, clubs: null });
const next = (seat: number) => (seat + 1) % PLAYERS;

function dealHands(deck: Card[]) {
  return Array.from({ length: PLAYERS }, (_, s) => deck.slice(s * 13, s * 13 + 13).sort(bySuit));
}

/** A new deal: the round to call (or, all three played, the Jacks round). */
function dealRound(g: Omit<Game, 'hands'> & { hands?: Card[][] }, dealer: number, deck: Card[]): Game {
  const caller = next(dealer);
  const jacks = g.played.length === ROUNDS.length;
  return {
    ...(g as Game),
    phase: jacks ? 'jacks' : 'call',
    dealer,
    caller,
    round: null,
    hands: dealHands(deck),
    turn: caller,
    trick: [],
    lastTrick: null,
    tricks: zeros(),
    queens: 0,
    kingTaken: false,
    roundPoints: zeros(),
    lines: emptyLines(),
    out: [],
    again: false,
    seq: g.seq + 1,
  };
}

export function newGame(dealer = 0, deck: Card[] = shuffle(newDeck())): Game {
  const base = { played: [] as RoundKind[], scores: zeros(), seq: -1 } as unknown as Game;
  return dealRound(base, dealer, deck);
}

/** The caller picks one of the rounds not played yet, and leads. */
export function call(g: Game, seat: number, kind: RoundKind): Game {
  if (g.phase !== 'call' || seat !== g.caller || g.played.includes(kind)) return g;
  return { ...g, phase: 'tricks', round: kind, turn: g.caller, lastTrick: null, seq: g.seq + 1 };
}

/** Jacks round: does this card fit a line? */
export function fits(lines: Record<Suit, Line | null>, card: Card) {
  const line = lines[card.suit];
  if (!line) return card.value === JACK;
  return card.value === line.lo - 1 || card.value === line.hi + 1;
}

/** May this card be played now? (Tricks: follow the suit led if you can. Jacks: it fits a line.) */
export function canPlay(g: Game, seat: number, card: Card): boolean {
  if (seat !== g.turn || !g.hands[seat].some((c) => same(c, card))) return false;
  if (g.phase === 'jacks') return fits(g.lines, card);
  if (g.phase !== 'tricks') return false;
  const led = g.trick[0]?.card.suit;
  return !led || card.suit === led || !g.hands[seat].some((c) => c.suit === led);
}

/** Who takes a trick: the highest card of the suit led. */
export function winner(plays: Play[]) {
  const led = plays[0].card.suit;
  return plays.filter((p) => p.card.suit === led).reduce((a, b) => (b.card.value > a.card.value ? b : a)).seat;
}

/** Jacks round: can this seat play anything? */
export const canMove = (g: Game, seat: number) => g.hands[seat].some((c) => fits(g.lines, c));

export function play(g: Game, seat: number, card: Card): Game {
  if (!canPlay(g, seat, card)) return g;
  const hands = g.hands.map((h, s) => (s === seat ? h.filter((c) => !same(c, card)) : h));
  return g.phase === 'jacks' ? playJack({ ...g, hands, seq: g.seq + 1 }, seat, card) : playTrick({ ...g, hands, seq: g.seq + 1 }, seat, card);
}

function playTrick(g: Game, seat: number, card: Card): Game {
  const trick = [...g.trick, { seat, card }];
  if (trick.length < PLAYERS) return { ...g, trick, turn: next(seat), lastTrick: null };
  // Taken: its points to whoever took it.
  const by = winner(trick);
  const queens = trick.filter((p) => p.card.value === QUEEN).length;
  const king = trick.some((p) => same(p.card, KING_OF_CLUBS));
  const gain = g.round === 'queens' ? queens * POINTS.queen : g.round === 'king' ? (king ? POINTS.king : 0) : POINTS.trick;
  const roundPoints = g.roundPoints.map((p, s) => (s === by ? p + gain : p));
  const tricks = g.tricks.map((n, s) => (s === by ? n + 1 : n));
  const after: Game = { ...g, trick: [], lastTrick: { by, plays: trick }, tricks, roundPoints, queens: g.queens + queens, kingTaken: g.kingTaken || king, turn: by };
  const done =
    after.hands.every((h) => !h.length) || (g.round === 'queens' && after.queens === 4) || (g.round === 'king' && after.kingTaken);
  return done ? endRound(after) : after;
}

/** A round's points go onto the scores; whoever called it deals the next. */
function endRound(g: Game, deck: Card[] = shuffle(newDeck())): Game {
  const scores = g.scores.map((s, i) => s + g.roundPoints[i]);
  const played = g.round ? [...g.played, g.round] : g.played;
  return { ...dealRound({ ...g, scores, played }, g.caller, deck), lastTrick: g.lastTrick };
}

function playJack(g: Game, seat: number, card: Card): Game {
  const line = g.lines[card.suit];
  const lines = { ...g.lines, [card.suit]: line ? { lo: Math.min(line.lo, card.value), hi: Math.max(line.hi, card.value) } : { lo: JACK, hi: JACK } };
  let out = g.out;
  let roundPoints = g.roundPoints;
  if (!g.hands[seat].length) {
    out = [...out, seat];
    roundPoints = roundPoints.map((p, s) => (s === seat ? p + (out.length === 1 ? POINTS.first : POINTS.second) : p));
  }
  const after: Game = { ...g, lines, out, roundPoints };
  // Two out: that's the round, and the game.
  if (out.length >= 2) return { ...after, phase: 'over', scores: g.scores.map((s, i) => s + roundPoints[i]) };
  // An Ace: once more, if there's anything to play.
  if (card.value === ACE && g.hands[seat].length && canMove(after, seat)) return { ...after, again: true, turn: seat };
  return { ...after, again: false, turn: nextIn(after, seat) };
}

/** Jacks round: the next seat still holding cards. */
function nextIn(g: Game, from: number) {
  for (let k = 1; k <= PLAYERS; k++) {
    const s = (from + k) % PLAYERS;
    if (g.hands[s].length) return s;
  }
  return from;
}

/** Jacks round: nothing fits, so you sit this turn out. */
export function skip(g: Game, seat: number): Game {
  if (g.phase !== 'jacks' || seat !== g.turn || canMove(g, seat)) return g;
  return { ...g, again: false, turn: nextIn(g, seat), seq: g.seq + 1 };
}

/** The lowest score wins (ties share the win). */
export const winners = (g: Game) => {
  const low = Math.min(...g.scores);
  return g.scores.map((s, i) => (s === low ? i : -1)).filter((i) => i >= 0);
};
