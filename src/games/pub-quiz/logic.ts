import { shuffle } from '../../lib/random';
import { QUESTIONS, type Level, type Question, type Topic } from './questions';

/*
 * Pub Quiz: one phone is the quizmaster's (question, answer, scores), every other phone a buzzer.
 * The quizmaster reads the question out; the first to buzz answers. Right: a point, next
 * question. Wrong: the buzzers open again, but nobody buzzes a second time on a question before
 * everyone else has buzzed once (a third time before everyone has buzzed twice, and so on).
 * Players can play alone or as teams, a buzzer per team.
 */

export interface Side {
  id: string;
  name: string;
  color: string;
  /** The phones (player ids) that buzz for this side: one for a player, the members of a team. */
  members: string[];
}

export interface Quiz {
  sides: Side[];
  /** Question numbers (in QUESTIONS), in the order they come. */
  deck: number[];
  at: number;
  phase: 'ask' | 'buzzed' | 'over';
  /** Who buzzed (a side's id). */
  by: string | null;
  /** Buzzes on the question asked now, by side. */
  buzzes: Record<string, number>;
  scores: Record<string, number>;
  /** The last answer judged: shown to everyone a moment. */
  verdict: { side: string; right: boolean; n: number } | null;
  seq: number;
}

export function newQuiz(sides: Side[], levels: Level[], count: number, pool = QUESTIONS, keep: (q: Question) => boolean = () => true): Quiz {
  const fit = pool.map((q, i) => (levels.includes(q.level) && keep(q) ? i : -1)).filter((i) => i >= 0);
  const deck = shuffle(fit).slice(0, count);
  return {
    sides,
    deck,
    at: 0,
    phase: deck.length ? 'ask' : 'over',
    by: null,
    buzzes: Object.fromEntries(sides.map((s) => [s.id, 0])),
    scores: Object.fromEntries(sides.map((s) => [s.id, 0])),
    verdict: null,
    seq: 0,
  };
}

/** May this side buzz now? Only with as few buzzes on this question as anyone else. */
export function canBuzz(q: Quiz, side: string) {
  if (q.phase !== 'ask' || !(side in q.buzzes)) return false;
  const least = Math.min(...Object.values(q.buzzes));
  return q.buzzes[side] === least;
}

export function buzz(q: Quiz, side: string): Quiz {
  if (!canBuzz(q, side)) return q;
  return { ...q, phase: 'buzzed', by: side, buzzes: { ...q.buzzes, [side]: q.buzzes[side] + 1 }, seq: q.seq + 1 };
}

/** The next question (or the end), every buzzer open again. */
function advance(q: Quiz): Quiz {
  const at = q.at + 1;
  return { ...q, at, phase: at >= q.deck.length ? 'over' : 'ask', by: null, buzzes: Object.fromEntries(q.sides.map((s) => [s.id, 0])) };
}

/** The quizmaster judges the answer of whoever buzzed. */
export function judge(q: Quiz, right: boolean): Quiz {
  if (q.phase !== 'buzzed' || !q.by) return q;
  const verdict = { side: q.by, right, n: q.seq + 1 };
  if (!right) return { ...q, phase: 'ask', by: null, verdict, seq: q.seq + 1 };
  return { ...advance({ ...q, scores: { ...q.scores, [q.by]: q.scores[q.by] + 1 } }), verdict, seq: q.seq + 1 };
}

/** Nobody knows (or the quizmaster moves on): next question, no points. */
export function skip(q: Quiz): Quiz {
  if (q.phase === 'over') return q;
  return { ...advance(q), verdict: null, seq: q.seq + 1 };
}

/** The side a phone buzzes for. */
export const sideOf = (q: Quiz, playerId: string) => q.sides.find((s) => s.members.includes(playerId)) ?? null;

/** Best first. */
export const ranking = (q: Quiz) => [...q.sides].sort((a, b) => q.scores[b.id] - q.scores[a.id]);

/** The question types besides a classic question; any other topic is a category of classic ones. */
export const TYPES = ['truefalse', 'estimate', 'first', 'lie', 'odd', 'words', 'plot', 'connect'] as const satisfies readonly Topic[];
export type Kind = 'classic' | (typeof TYPES)[number];
const isType = (t: Topic): t is (typeof TYPES)[number] => (TYPES as readonly Topic[]).includes(t);

/** Whether a question is one of the picked kinds: a classic one only in a picked category. */
export const picked = (cats: Topic[], kinds: Kind[]) => (q: Question) => (isType(q.topic) ? kinds.includes(q.topic) : kinds.includes('classic') && cats.includes(q.topic));
