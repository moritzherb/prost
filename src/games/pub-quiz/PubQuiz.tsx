import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Avatar from '../../components/Avatar';
import BigButton from '../../components/BigButton';
import Finished from '../../components/Finished';
import Tap from '../../components/Tap';
import { getLang, t, tx } from '../../i18n';
import { buzz as vibrate, celebrate, sfx } from '../../lib/fx';
import { useCrewButton } from '../../lib/turn';
import { useShared } from '../../net/shared';
import { useApp } from '../../state/AppState';
import { buzz, canBuzz, judge, newQuiz, ranking, sideOf, skip, type Quiz, type Side } from './logic';
import { QUESTIONS, type Level, type Topic } from './questions';

interface Shared {
  quiz: Quiz | null;
}

export const LEVELS: { id: Level; label: string }[] = [
  { id: 1, label: tx('Easy') },
  { id: 2, label: tx('Medium') },
  { id: 3, label: tx('Hard') },
  { id: 4, label: tx('Impossible') },
];
export const COUNTS = [10, 20, 30];
/** The teams' colours to pick from, each with the name a team of that colour has until it's renamed. */
const TEAM_COLORS = ['#ff5a5f', '#3da9fc', '#ffc93c', '#7ae582', '#b388ff', '#ff8a3d', '#2ec4b6', '#f15bb5'];
const TEAM_NAMES = [tx('Team Red'), tx('Team Blue'), tx('Team Yellow'), tx('Team Green'), tx('Team Purple'), tx('Team Orange'), tx('Team Teal'), tx('Team Pink')];

export const TOPIC_NAME: Record<Topic, string> = {
  general: tx('General knowledge'),
  film: tx('Film & TV'),
  sports: tx('Sports'),
  entertainment: tx('Music & stars'),
  history: tx('History'),
  geography: tx('Geography'),
  science: tx('Science'),
  food: tx('Food & drink'),
  gaming: tx('Gaming'),
  art: tx('Art & fashion'),
  myth: tx('Mythology'),
  trash: tx('Reality TV'),
  truefalse: tx('True or false'),
  estimate: tx('Estimate: closest wins'),
  first: tx('What came first?'),
  lie: tx('Two truths and a lie'),
  odd: tx('Odd one out'),
  words: tx('Wordplay & logic'),
  plot: tx('Badly explained plots'),
  beforeafter: tx('Before & after'),
  connect: tx('Connections'),
  decades: tx('Decades'),
};

/** Pub Quiz: this phone (the host's) asks; every other phone is a buzzer. */
export default function PubQuiz() {
  const { state, set, room, isHost, myId } = useShared<Shared>('pq', { quiz: null });
  useCrewButton(!state.quiz && isHost ? 'room' : null);
  if (!state.quiz) return isHost ? <Setup room={room} onStart={(quiz) => set({ quiz })} /> : <Waiting host={room.members.find((m) => m.host)?.name} />;
  const act = (next: (q: Quiz) => Quiz) => set((s) => (s.quiz ? { quiz: next(s.quiz) } : s));
  return isHost ? <Master q={state.quiz} act={act} onNew={() => set({ quiz: null })} /> : <Buzzer q={state.quiz} myId={myId} act={act} />;
}

function Waiting({ host }: { host?: string }) {
  return (
    <div className="bd">
      <div className="connecting">
        <h2 className="bd-title">{t('Pub Quiz')}</h2>
        <p className="lead">{host ? t('Waiting for {name} to start the quiz…', { name: host }) : t('Waiting for the host to start…')}</p>
      </div>
    </div>
  );
}

function Setup({ room, onStart }: { room: ReturnType<typeof useShared<Shared>>['room']; onStart: (q: Quiz) => void }) {
  const known = useApp().knows('pub-quiz');
  const players = room.members.filter((m) => !m.host);
  const [levels, setLevels] = useState<Level[]>([1, 2]);
  const [count, setCount] = useState(20);
  const [teams, setTeams] = useState(false);
  // In teams: which team each player is in (by turns, changed with a tap).
  const [teamOf, setTeamOf] = useState<Record<string, number>>({});
  const nTeams = Math.max(2, Math.min(4, Math.ceil(players.length / 2)));
  const team = (id: string, i: number) => (teamOf[id] ?? i % nTeams) % nTeams;
  // Each team's colour (a place in TEAM_COLORS) and its own name, if it was given one.
  const [hues, setHues] = useState([0, 1, 2, 3]);
  const [names, setNames] = useState<string[]>([]);
  const colorOf = (k: number) => TEAM_COLORS[hues[k]];
  const nameOf = (k: number) => names[k]?.trim() || t(TEAM_NAMES[hues[k]]);
  // The next colour no other team has.
  const recolor = (k: number) =>
    setHues((h) => {
      const taken = h.filter((_, j) => j !== k && j < nTeams);
      let next = h[k];
      do next = (next + 1) % TEAM_COLORS.length;
      while (taken.includes(next));
      return h.map((x, j) => (j === k ? next : x));
    });
  const sides: Side[] = teams
    ? Array.from({ length: nTeams }, (_, k) => ({ id: `team-${k}`, name: nameOf(k), color: colorOf(k), members: players.filter((p, i) => team(p.id, i) === k).map((p) => p.id) })).filter(
        (s) => s.members.length,
      )
    : players.map((p) => ({ id: p.id, name: p.name, color: p.color, members: [p.id] }));
  const toggle = (l: Level) => setLevels((x) => (x.includes(l) ? (x.length > 1 ? x.filter((y) => y !== l) : x) : [...x, l].sort()));
  const pool = QUESTIONS.filter((q) => levels.includes(q.level)).length;
  return (
    <div className="bd">
      <div className="bd-head">
        <span className="kicker">{t('This phone asks, the others buzz')}</span>
        <h2 className="bd-title big">{t('Pub Quiz')}</h2>
        {!known && <p className="lead">{t('Read the question out. Whoever buzzes first answers; you say if it’s right.')}</p>}
      </div>
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
      <div className="seg two">
        <button type="button" className={`seg-btn${!teams ? ' active' : ''}`} onClick={() => setTeams(false)}>
          <span className="seg-main">{t('Everyone alone')}</span>
        </button>
        <button type="button" className={`seg-btn${teams ? ' active' : ''}`} onClick={() => setTeams(true)} disabled={players.length < 2}>
          <span className="seg-main">{t('In teams')}</span>
        </button>
      </div>
      <div className="pick-grid">
        {players.map((p, i) => (
          <Tap
            key={p.id}
            className="pick-chip selected"
            style={{ '--chip': teams ? colorOf(team(p.id, i)) : p.color } as CSSProperties}
            onClick={() => teams && setTeamOf((x) => ({ ...x, [p.id]: team(p.id, i) + 1 }))}
          >
            <span className="pick-chip-avatar">
              <Avatar name={p.name} color={p.color} photo={p.photo} />
            </span>
            <span className="pick-chip-name">{p.name}</span>
          </Tap>
        ))}
      </div>
      {teams && <p className="fine-print">{t('Tap a player to move them to the next team. Each team buzzes on any of its phones.')}</p>}
      {/* The teams: tap the dot for another colour, type a name of your own. */}
      {teams && (
        <div className="pq-teams">
          {Array.from({ length: nTeams }, (_, k) => (
            <div key={k} className="pq-team" style={{ '--chip': colorOf(k) } as CSSProperties}>
              <button type="button" className="pq-team-color" aria-label={t('Change colour')} onClick={() => recolor(k)} />
              <input
                className="pq-team-name"
                value={names[k] ?? ''}
                placeholder={t(TEAM_NAMES[hues[k]])}
                maxLength={20}
                aria-label={t('Team name')}
                onChange={(e) => {
                  const v = e.target.value;
                  setNames((n) => Object.assign([...n], { [k]: v }));
                }}
              />
            </div>
          ))}
        </div>
      )}
      <div className="sticky-action">
        <BigButton size="xl" disabled={sides.length < 1} onClick={() => onStart(newQuiz(sides, levels, Math.min(count, pool)))}>
          {players.length ? t('Start the quiz') : t('Waiting for players…')}
        </BigButton>
      </div>
    </div>
  );
}

/** The scores, best first: a slim row on top of every phone. */
export function Board({ q, mine }: { q: Quiz; mine?: string | null }) {
  return (
    <div className="pq-board">
      {ranking(q).map((s) => (
        <span key={s.id} className={`pq-score${q.by === s.id ? ' buzzed' : ''}${mine === s.id ? ' mine' : ''}`} style={{ '--chip': s.color } as CSSProperties}>
          <span className="pq-score-name">{s.name}</span>
          <span className="pq-score-n">{q.scores[s.id]}</span>
        </span>
      ))}
    </div>
  );
}

/**
 * An answer judged, on every phone: a big tick or cross in the colour of who answered, with their
 * name, then it's gone. Not for one already judged when this screen opened.
 */
export function VerdictFlash({ q }: { q: Quiz }) {
  const v = q.verdict;
  const [first] = useState(() => v?.n);
  useEffect(() => {
    if (!v || v.n === first) return;
    if (v.right) {
      sfx.tada();
      vibrate([40, 40, 80]);
    } else {
      sfx.boo();
      vibrate([80, 40, 80]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per verdict
  }, [v?.n]);
  const side = v && q.sides.find((s) => s.id === v.side);
  if (!v || !side || v.n === first) return null;
  return (
    <div key={v.n} className={`pq-verdict ${v.right ? 'right' : 'wrong'}`} style={{ '--chip': side.color } as CSSProperties} role="status">
      <span className="pq-verdict-mark">
        {/* Drawn in, stroke by stroke (pathLength 1 for the dash animation). */}
        <svg viewBox="0 0 52 52" aria-hidden="true">
          {v.right ? (
            <path d="M15 27.5l7.5 7.5L38 18.5" pathLength={1} />
          ) : (
            <>
              <path d="M18 18l16 16" pathLength={1} />
              <path d="M34 18L18 34" pathLength={1} />
            </>
          )}
        </svg>
      </span>
      <span className="pq-verdict-word">{v.right ? t('Right') : t('Wrong')}</span>
      <span className="pq-verdict-name">{side.name}</span>
    </div>
  );
}

/** Someone buzzed: their name pops up big on every phone. */
function useBuzzSound(q: Quiz) {
  const last = useRef(q.seq);
  useEffect(() => {
    if (q.seq === last.current) return;
    last.current = q.seq;
    if (q.phase === 'buzzed') {
      sfx.pop();
      vibrate([40, 30, 40]);
    }
  }, [q.seq, q.phase]);
}

function Master({ q, act, onNew }: { q: Quiz; act: (next: (q: Quiz) => Quiz) => void; onNew: () => void }) {
  useBuzzSound(q);
  const lang = getLang();
  useEffect(() => {
    if (q.phase === 'over') celebrate();
  }, [q.phase]);
  if (q.phase === 'over') return <End q={q} onNew={onNew} />;
  const item = QUESTIONS[q.deck[q.at]];
  const by = q.sides.find((s) => s.id === q.by);
  return (
    <div className="pq fill">
      <VerdictFlash q={q} />
      <Board q={q} />
      <div className="pq-card" key={q.at}>
        <span className="pq-meta">
          {t('Question {n} of {m}', { n: q.at + 1, m: q.deck.length })} · {t(TOPIC_NAME[item.topic])}
        </span>
        <p className="pq-question">{item.q[lang]}</p>
        <p className="pq-answer">
          <span>{t('Answer')}</span> {item.a[lang]}
        </p>
      </div>
      <div className="pq-master-foot">
        {by ? (
          <>
            <p key={q.seq} className="pq-buzzed" style={{ '--chip': by.color } as CSSProperties}>
              {t('{name} buzzed!', { name: by.name })}
            </p>
            <div className="pq-judge">
              <BigButton variant="danger" onClick={() => act((x) => judge(x, false))}>
                {t('Wrong')}
              </BigButton>
              <BigButton onClick={() => act((x) => judge(x, true))}>{t('Right')}</BigButton>
            </div>
          </>
        ) : (
          <>
            <p className="pq-waiting">{t('Read it out. Waiting for a buzz…')}</p>
            <BigButton variant="glass" onClick={() => act(skip)}>
              {t('Nobody knows: next question')}
            </BigButton>
          </>
        )}
      </div>
    </div>
  );
}

function Buzzer({ q, myId, act }: { q: Quiz; myId: string; act: (next: (q: Quiz) => Quiz) => void }) {
  useBuzzSound(q);
  const side = sideOf(q, myId);
  if (q.phase === 'over') return <End q={q} />;
  const can = !!side && canBuzz(q, side.id);
  const by = q.sides.find((s) => s.id === q.by);
  const mine = !!by && by.id === side?.id;
  return (
    <div className={`pq fill${mine ? ' answering' : ''}`} style={mine ? ({ '--chip': by.color } as CSSProperties) : undefined}>
      <VerdictFlash q={q} />
      <Board q={q} mine={side?.id} />
      <p key={mine ? q.seq : 'status'} className={`pq-buzz-status${mine ? ' mine' : ''}`}>
        {by ? (mine ? t('You buzzed: answer now!') : t('{name} buzzed!', { name: by.name })) : can ? t('Buzz when you know it') : side ? t('Wait until everyone else has buzzed') : t('You’re watching this quiz.')}
      </p>
      <div className="pq-buzz-room">
        <button
          type="button"
          className={`pq-buzzer${can ? '' : ' off'}${by ? ' locked' : ''}${mine ? ' mine' : ''}`}
          style={(by ? { '--chip': by.color } : side ? { '--chip': side.color } : {}) as CSSProperties}
          disabled={!can}
          onPointerDown={() => {
            if (!side || !can) return;
            vibrate([60, 40, 60]);
            act((x) => buzz(x, side.id));
          }}
          aria-label={t('Buzz')}
        >
          {/* A real buzzer: nothing written on it. */}
          <span className="pq-buzzer-cap" />
        </button>
      </div>
    </div>
  );
}

function End({ q, onNew }: { q: Quiz; onNew?: () => void }) {
  const order = ranking(q);
  const top = q.scores[order[0]?.id] ?? 0;
  const winners = order.filter((s) => q.scores[s.id] === top);
  return (
    <div className="bd">
      <Finished game="pub-quiz" />
      <div className="bd-head center">
        <span className="kicker">{t('Quiz over')}</span>
        <h2 className="bd-title big">{t('{name} wins!', { name: winners.map((s) => s.name).join(' & ') })}</h2>
      </div>
      <ol className="vr-results">
        {order.map((s) => (
          <li key={s.id} className={q.scores[s.id] === top ? 'won' : ''}>
            <span className="pq-dot" style={{ background: s.color }} />
            <span className="vr-results-name">{s.name}</span>
            <span className="vr-results-n">{q.scores[s.id]}</span>
          </li>
        ))}
      </ol>
      {onNew && (
        <div className="sticky-action">
          <BigButton size="xl" onClick={onNew}>
            {t('New quiz')}
          </BigButton>
        </div>
      )}
    </div>
  );
}
