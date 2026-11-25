import { useEffect, useState } from 'react';
import BigButton from '../../components/BigButton';
import { getLang, t } from '../../i18n';
import { celebrate, sfx } from '../../lib/fx';
import { useCrewButton, useTurnBubble } from '../../lib/turn';
import { useApp } from '../../state/AppState';
import SoloEnd from '../solo/SoloEnd';
import type { GameProps } from '../types';
import { buzz, judge, newQuiz, skip, type Quiz } from './logic';
import { Board, COUNTS, End, LEVELS, QuestionText, TOPIC_NAME, useQuestionPick, VerdictFlash } from './PubQuiz';
import { QUESTIONS, type Level } from './questions';

/** How long a verdict shows (.pq-verdict in global.css): the buttons stay locked until it is gone. */
const VERDICT_MS = 1700;

/**
 * Pub Quiz on one phone: it asks, you think of the answer, look, and say honestly if you knew it.
 * With a crew, the questions go round: each one is for whoever is on, and each scores their own.
 */
export default function PubQuizSolo({ players, exit }: GameProps) {
  const known = useApp().knows('pub-quiz');
  const [levels, setLevels] = useState<Level[]>([1, 2]);
  const [count, setCount] = useState(20);
  const { view: pickView, keep } = useQuestionPick();
  const [q, setQ] = useState<Quiz | null>(null);
  const [shown, setShown] = useState(false);
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    if (!locked) return;
    const id = window.setTimeout(() => setLocked(false), VERDICT_MS);
    return () => window.clearTimeout(id);
  }, [locked]);
  const group = players.length > 1;
  useCrewButton(q ? null : 'crew');
  // Whose question it is, with a crew.
  const on = q && group ? q.sides[q.at % q.sides.length] : null;
  useTurnBubble(on && q?.phase !== 'over' ? players.find((p) => p.id === on.id) : null);
  const over = q?.phase === 'over';
  const score = q?.scores.me ?? 0;
  const won = !!q && score * 2 >= q.deck.length;
  useEffect(() => {
    if (over && (won || group)) celebrate();
  }, [over, won, group]);

  const start = () => {
    const pool = QUESTIONS.filter((x) => levels.includes(x.level) && keep(x)).length;
    const sides = group ? players.map((p) => ({ id: p.id, name: p.name, color: p.color, members: [p.id] })) : [{ id: 'me', name: t('You'), color: 'var(--accent)', members: ['me'] }];
    setQ(newQuiz(sides, levels, Math.min(count, pool), QUESTIONS, keep));
    setShown(false);
    setLocked(false);
  };

  if (!q) {
    const toggle = (l: Level) => setLevels((x) => (x.includes(l) ? (x.length > 1 ? x.filter((y) => y !== l) : x) : [...x, l].sort()));
    return (
      <div className="bd">
        <div className="bd-head">
          <span className="kicker">{group ? t('One phone, turn by turn') : t('Alone against the quiz')}</span>
          <h2 className="bd-title big">{t('Pub Quiz')}</h2>
          {!known && <p className="lead">{t('Think of the answer, then look, and say honestly if you knew it.')}</p>}
        </div>
        {pickView}
        <h3 className="section-title">{t('How hard?')}</h3>
        <div className="pq-chips">
          {LEVELS.map((l) => (
            <button key={l.id} type="button" className={`chip${levels.includes(l.id) ? ' active' : ''}`} aria-pressed={levels.includes(l.id)} onClick={() => toggle(l.id)}>
              {t(l.label)}
            </button>
          ))}
        </div>
        <div className="seg three">
          {COUNTS.map((n) => (
            <button key={n} type="button" className={`seg-btn${count === n ? ' active' : ''}`} onClick={() => setCount(n)}>
              <span className="seg-main">{t('{n} questions', { n })}</span>
            </button>
          ))}
        </div>
        <div className="sticky-action">
          <BigButton size="xl" onClick={start}>
            {t('Start the quiz')}
          </BigButton>
        </div>
      </div>
    );
  }

  if (over && group) return <End q={q} onNew={() => setQ(null)} />;
  if (over)
    return (
      <SoloEnd
        game="pub-quiz"
        won={won}
        kicker={t('Quiz over')}
        title={t('{n} of {m} right', { n: score, m: q.deck.length })}
        onAgain={() => setQ(null)}
        exit={exit}
      />
    );

  const lang = getLang();
  const item = QUESTIONS[q.deck[q.at]];
  const next = (knew: boolean) => {
    setQ((x) => {
      if (!x) return x;
      const judged = judge(buzz(x, on?.id ?? 'me'), knew);
      // Not known: no second try alone, on to the next one (the cross still shows).
      return knew ? judged : { ...skip(judged), verdict: judged.verdict };
    });
    setShown(false);
    setLocked(true);
  };
  return (
    <div className="pq fill">
      <VerdictFlash q={q} />
      <Board q={q} mine={on?.id} />
      <div className="pq-card" key={q.at}>
        <span className="pq-meta">
          {t('Question {n} of {m}', { n: q.at + 1, m: q.deck.length })} · {t(TOPIC_NAME[item.topic])}
        </span>
        <QuestionText text={item.q[lang]} />
        {/* There from the start, unseen: the card doesn't grow when it shows. */}
        <p className="pq-answer" style={shown ? undefined : { visibility: 'hidden' }} aria-hidden={!shown}>
          <span>{t('Answer')}</span> {item.a[lang]}
        </p>
      </div>
      <div className="pq-judge">
        {shown ? (
          // Keyed: unkeyed, React reuses the "Show answer" button for the first one, and it fades from green to red.
          <>
            <BigButton key="no" variant="danger" onClick={() => next(false)}>
              {t('Didn’t know')}
            </BigButton>
            <BigButton key="yes" onClick={() => next(true)}>{t('Knew it')}</BigButton>
          </>
        ) : (
          <BigButton
            key="show"
            className="pq-show"
            // Not `disabled`: that greys the button out, then it turns green again. Looks the same, just ignores taps.
            onClick={() => {
              if (locked) return;
              sfx.tick();
              setShown(true);
            }}
          >
            {t('Show answer')}
          </BigButton>
        )}
      </div>
    </div>
  );
}
