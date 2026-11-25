import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import Avatar from '../../components/Avatar';
import BigButton from '../../components/BigButton';
import Bump from '../../components/Bump';
import Finished from '../../components/Finished';
import { ChevronIcon } from '../../components/Icons';
import Sheet from '../../components/Sheet';
import Tap from '../../components/Tap';
import { getLang, t, tx } from '../../i18n';
import { buzz as vibrate, celebrate, sfx } from '../../lib/fx';
import { useCrewButton } from '../../lib/turn';
import { useShared } from '../../net/shared';
import { useApp } from '../../state/AppState';
import { buzz, canBuzz, judge, newQuiz, picked, ranking, sideOf, skip, TYPES, type Kind, type Quiz, type Side } from './logic';
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
  estimate: tx('Estimate'),
  first: tx('What came first?'),
  lie: tx('Two truths and a lie'),
  odd: tx('Odd one out'),
  words: tx('Wordplay & logic'),
  plot: tx('Badly explained'),
  connect: tx('Connections'),
  decades: tx('Decades'),
};

/** The lead-ins that only repeat the type shown on the card's top line (so they're left off the question). */
const REPEATS = new Set(['True or false', 'Wahr oder falsch', 'Estimate', 'Schätzfrage', 'Schätzt', 'Odd one out', 'Was passt nicht', 'Badly explained', 'Schlecht erklärt']);
/** A lead-in that is itself a question ("What comes next") gets its question mark. */
const asked = (lead: string) => (/\b(what|which|how|where|who|when|odd one out|was|welche[rsmn]?|wie|wo|wer|wann)\b/i.test(lead) && !/[?]$/.test(lead) ? `${lead}?` : lead);
const cap = (x: string) => x.charAt(0).toLocaleUpperCase() + x.slice(1);

/**
 * A question as the card shows it. The text is one string; its parts are told apart here. Every
 * line starts with a capital. A lead-in before a colon ("What comes next: …") becomes a small line
 * over the question, unless it only repeats the type on the top line. Two truths and a lie shows
 * only its subject in big letters (the type is on the top line), the options "A) … B) … C) …" each
 * on a row of their own.
 */
export function QuestionText({ text, topic }: { text: string; topic: Topic }) {
  const opts = text.match(/^(.*?)\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*)$/s);
  const whole = opts ? opts[1].replace(/:\s*$/, '') : text;
  const lead = !opts ? whole.match(/^([^:„“”"]{3,40}):\s+(.+)$/s) : null;
  const subject = topic === 'lie' ? whole.split(/\s+[–-]\s+/).slice(1).join(' – ') : '';
  const body = subject || (lead ? lead[2] : whole);
  const line = lead && !REPEATS.has(lead[1]) ? asked(lead[1]) : null;
  return (
    <>
      {line && <span className="pq-lead">{cap(line)}</span>}
      <p className="pq-question">{cap(body)}</p>
      {opts && (
        <ol className="pq-options">
          {opts.slice(2).map((o, i) => (
            <li key={i}>
              <b>{'ABC'[i]}</b>
              <span>{cap(o)}</span>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

/** How hard a question is: four small dots, as many filled as its level, named for screen readers. */
export function LevelDots({ level }: { level: Level }) {
  return (
    <span className="pq-level" role="img" aria-label={t(LEVELS[level - 1].label)}>
      {LEVELS.map((l) => (
        <i key={l.id} className={l.id <= level ? 'on' : undefined} />
      ))}
    </span>
  );
}

/** The categories of classic questions, in the order the setup shows them. */
const CATEGORIES: Topic[] = ['general', 'film', 'sports', 'entertainment', 'history', 'geography', 'science', 'food', 'gaming', 'art', 'myth', 'trash', 'decades'];
const KINDS: Kind[] = ['classic', ...TYPES];
const KIND_NAME = (k: Kind) => (k === 'classic' ? tx('Classic questions') : TOPIC_NAME[k]);

/**
 * The setup's pick of questions: two rows, categories (for classic questions) and question types;
 * each opens a sheet to tick as many as you like (at least one). Categories only count for classic
 * questions, so their row says so while those are off.
 */
export function useQuestionPick() {
  const [cats, setCats] = useState<Topic[]>(CATEGORIES);
  const [kinds, setKinds] = useState<Kind[]>(KINDS);
  const [open, setOpen] = useState<'cats' | 'kinds' | null>(null);
  const flip = <T,>(set: (f: (x: T[]) => T[]) => void, v: T) => set((x) => (x.includes(v) ? (x.length > 1 ? x.filter((y) => y !== v) : x) : [...x, v]));
  const chips = <T extends string>(all: T[], on: T[], name: (v: T) => string, tap: (v: T) => void) => (
    <div className="pq-chips">
      {all.map((v, i) => (
        <button key={v} type="button" className={`chip${on.includes(v) ? ' active' : ''}`} style={{ '--i': i } as CSSProperties} aria-pressed={on.includes(v)} onClick={() => tap(v)}>
          {t(name(v))}
        </button>
      ))}
    </div>
  );
  const row = (label: string, hint: string, key: 'cats' | 'kinds') => (
    <button type="button" className="setting-row" onClick={() => setOpen(key)}>
      <span className="setting-text">
        <span className="setting-label">{label}</span>
        <span className="setting-hint">{hint}</span>
      </span>
      <span className="look-chevron" aria-hidden="true">
        <ChevronIcon />
      </span>
    </button>
  );
  const view = (
    <>
      <div className="settings-list pq-pick">
        {row(t('Categories'), CATEGORIES.filter((c) => cats.includes(c)).map((c) => t(TOPIC_NAME[c])).join(', '), 'cats')}
        {row(t('Question types'), KINDS.filter((k) => kinds.includes(k)).map((k) => t(KIND_NAME(k))).join(', '), 'kinds')}
      </div>
      {/* Pick as many as you like; a chip drops in after the one before it. */}
      <Sheet open={open === 'cats'} onClose={() => setOpen(null)} title={t('Categories')} closeLabel={t('Done')}>
        {chips(CATEGORIES, cats, (v) => TOPIC_NAME[v], (v) => flip(setCats, v))}
        {!kinds.includes('classic') && <p className="fine-print">{t('Categories only count for classic questions.')}</p>}
      </Sheet>
      <Sheet open={open === 'kinds'} onClose={() => setOpen(null)} title={t('Question types')} closeLabel={t('Done')}>
        {chips(KINDS, kinds, KIND_NAME, (v) => flip(setKinds, v))}
      </Sheet>
    </>
  );
  return { view, keep: picked(cats, kinds) };
}

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
  const { view: pickView, keep } = useQuestionPick();
  const pool = QUESTIONS.filter((q) => levels.includes(q.level) && keep(q)).length;
  return (
    <div className="bd">
      <div className="bd-head">
        <span className="kicker">{t('This phone asks, the others buzz')}</span>
        <h2 className="bd-title big">{t('Pub Quiz')}</h2>
        {!known && <p className="lead">{t('Read the question out. Whoever buzzes first answers; you say if it’s right.')}</p>}
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
        <BigButton size="xl" disabled={sides.length < 1 || !pool} onClick={() => onStart(newQuiz(sides, levels, Math.min(count, pool), QUESTIONS, keep))}>
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
          <Bump className="pq-score-n" value={q.scores[s.id]} />
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
  // On the body: a transformed page around it would make `fixed` mean that page's box, not the screen.
  return createPortal(
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
      <div className="pq-verdict-text">
        <span className="pq-verdict-word">{v.right ? t('Right') : t('Wrong')}</span>
        <span className="pq-verdict-name">{side.name}</span>
      </div>
    </div>,
    document.body,
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
        <div className="pq-meta">
          <span>
            {t('Question {n} of {m}', { n: q.at + 1, m: q.deck.length })} · {t(TOPIC_NAME[item.topic])}
          </span>
          <LevelDots level={item.level} />
        </div>
        <QuestionText text={item.q[lang]} topic={item.topic} />
        <p className="pq-answer">
          <span>{t('Answer')}</span> {item.a[lang]}
        </p>
      </div>
      <div className="pq-master-foot">
        {by ? (
          <>
            <p key={q.seq} className="pq-buzzed" style={{ '--chip': by.color } as CSSProperties}>
              {t('{name} buzzed', { name: by.name })}
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
        {by ? (mine ? t('You buzzed: answer now') : t('{name} buzzed', { name: by.name })) : can ? t('Buzz when you know it') : side ? t('Wait until everyone else has buzzed') : t('You’re watching this quiz.')}
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

export function End({ q, onNew }: { q: Quiz; onNew?: () => void }) {
  const order = ranking(q);
  const top = q.scores[order[0]?.id] ?? 0;
  const winners = order.filter((s) => q.scores[s.id] === top);
  return (
    <div className="bd">
      <Finished game="pub-quiz" end />
      <div className="bd-head center">
        <span className="kicker">{t('Quiz over')}</span>
        <h2 className="bd-title big">{t('{name} wins', { name: winners.map((s) => s.name).join(' & ') })}</h2>
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
