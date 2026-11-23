import { describe, expect, it } from 'vitest';
import { buzz, canBuzz, judge, newQuiz, skip, type Side } from './logic';
import { QUESTIONS } from './questions';

const sides: Side[] = ['a', 'b', 'c'].map((id) => ({ id, name: id, color: '#fff', members: [id] }));

describe('Pub Quiz', () => {
  it('every question has both languages, an answer, and a level 1–4', () => {
    for (const q of QUESTIONS) {
      expect(q.q.de && q.q.en && q.a.de && q.a.en).toBeTruthy();
      expect([1, 2, 3, 4]).toContain(q.level);
    }
    expect(QUESTIONS.length).toBeGreaterThan(200);
  });

  it('only the levels picked, as many as asked', () => {
    const q = newQuiz(sides, [1], 10);
    expect(q.deck).toHaveLength(10);
    expect(q.deck.every((i) => QUESTIONS[i].level === 1)).toBe(true);
    expect(new Set(q.deck).size).toBe(10);
  });

  it('first buzz answers; right scores and moves on', () => {
    let q = newQuiz(sides, [1, 2], 5);
    q = buzz(q, 'b');
    expect(q.phase).toBe('buzzed');
    expect(buzz(q, 'a')).toBe(q); // locked while b answers
    q = judge(q, true);
    expect(q.scores.b).toBe(1);
    expect(q.at).toBe(1);
    expect(q.phase).toBe('ask');
  });

  it('wrong opens again, but nobody buzzes twice before everyone has once', () => {
    let q = newQuiz(sides, [1, 2], 5);
    q = judge(buzz(q, 'a'), false);
    expect(canBuzz(q, 'a')).toBe(false);
    q = judge(buzz(q, 'b'), false);
    expect(canBuzz(q, 'a')).toBe(false);
    q = judge(buzz(q, 'c'), false);
    // Everyone has buzzed once: a may buzz again.
    expect(canBuzz(q, 'a')).toBe(true);
    expect(q.at).toBe(0);
  });

  it('skip moves on; the last question ends it', () => {
    let q = newQuiz(sides, [1], 2);
    q = skip(skip(q));
    expect(q.phase).toBe('over');
  });
});
