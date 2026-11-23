import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Avatar from '../../components/Avatar';
import BigButton from '../../components/BigButton';
import Finished from '../../components/Finished';
import { CardFace } from '../../components/PlayingCard';
import Tap from '../../components/Tap';
import { t, tx } from '../../i18n';
import { cardName, rankLabel, SUITS, type Card } from '../../lib/cards';
import { buzz, celebrate, sfx } from '../../lib/fx';
import { useCrewButton, useYourTurn } from '../../lib/turn';
import { useShared } from '../../net/shared';
import { useApp } from '../../state/AppState';
import { call, canMove, canPlay, JACK, newGame, play, PLAYERS, ROUNDS, same, skip, winners, type Game, type RoundKind } from './logic';

interface Seat {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

interface Shared {
  g: Game | null;
  seats: Seat[];
}

const ROUND_NAME: Record<RoundKind, string> = { queens: tx('Queens'), king: tx('King of clubs'), tricks: tx('Tricks') };
const ROUND_RULE: Record<RoundKind, string> = {
  queens: tx('20 points for every Queen in your tricks'),
  king: tx('50 points for whoever takes the King of clubs'),
  tricks: tx('5 points for every trick you take'),
};

/** 4er: four phones, three called trick rounds and the Jacks round; the fewest points win. */
export default function Vierer() {
  const { state, set, room, isHost, myId } = useShared<Shared>('vr', { g: null, seats: [] });
  const known = useApp().knows('vierer');
  const people = room.members;
  const [picked, setPicked] = useState<string[] | null>(null);
  useCrewButton(!state.g && isHost ? 'room' : null);

  if (!state.g || state.seats.length !== PLAYERS) {
    if (!isHost) {
      const host = people.find((m) => m.host);
      return (
        <div className="bd">
          <div className="connecting">
            <h2 className="bd-title">{t('4er')}</h2>
            <p className="lead">{host ? t('Waiting for {name} to deal…', { name: host.name }) : t('Waiting for the host to start…')}</p>
          </div>
        </div>
      );
    }
    const chosen = (picked ?? people.slice(0, PLAYERS).map((m) => m.id)).filter((id) => people.some((m) => m.id === id));
    const toggle = (id: string) => setPicked(chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id].slice(-PLAYERS));
    const seats: Seat[] = people.filter((m) => chosen.includes(m.id)).map((m) => ({ id: m.id, name: m.name, avatar: m.avatar, color: m.color }));
    return (
      <div className="bd">
        <div className="bd-head">
          <span className="kicker">{t('4 players, 52 cards')}</span>
          <h2 className="bd-title big">{t('4er')}</h2>
          {!known && <p className="lead">{t('Four rounds, and every point is bad: the fewest points at the end win.')}</p>}
        </div>
        <h3 className="section-title">{t('Who plays?')}</h3>
        <div className="pick-grid">
          {people.map((m) => (
            <Tap key={m.id} className={`pick-chip${chosen.includes(m.id) ? ' selected' : ''}${m.online ? '' : ' offline'}`} style={{ '--chip': m.color } as CSSProperties} onClick={() => toggle(m.id)}>
              <span className="pick-chip-avatar">
                <Avatar name={m.name} color={m.color} photo={m.photo} />
              </span>
              <span className="pick-chip-name">{m.name}</span>
            </Tap>
          ))}
        </div>
        <div className="sticky-action">
          <BigButton size="xl" disabled={seats.length !== PLAYERS} onClick={() => set({ g: newGame(Math.floor(Math.random() * PLAYERS)), seats })}>
            {seats.length !== PLAYERS ? t('Pick exactly 4 players') : t('Deal the cards')}
          </BigButton>
        </div>
      </div>
    );
  }

  const me = state.seats.findIndex((s) => s.id === myId);
  const photoOf = (id: string) => people.find((m) => m.id === id)?.photo;
  return (
    <Table
      g={state.g}
      seats={state.seats}
      me={me}
      photoOf={photoOf}
      isHost={isHost}
      act={(next) => set((s) => (s.g ? { ...s, g: next(s.g) } : s))}
      onNewGame={() => set((s) => ({ ...s, g: null }))}
    />
  );
}

function Table({
  g,
  seats,
  me,
  photoOf,
  isHost,
  act,
  onNewGame,
}: {
  g: Game;
  seats: Seat[];
  me: number;
  photoOf: (id: string) => string | undefined;
  isHost: boolean;
  act: (next: (g: Game) => Game) => void;
  onNewGame: () => void;
}) {
  const view = me >= 0 ? me : 0;
  const name = (i: number) => (i === me ? t('You') : (seats[i]?.name ?? ''));
  const myTurn = me >= 0 && g.turn === me && (g.phase === 'tricks' || g.phase === 'jacks');
  useYourTurn(myTurn || (me >= 0 && g.phase === 'call' && g.caller === me));
  const [sel, setSel] = useState<Card | null>(null);
  useEffect(() => setSel(null), [g.seq]);
  // The trick just taken stays on the table a moment before it goes to its taker.
  const [shownTrick, setShownTrick] = useState<Game['lastTrick']>(null);
  useEffect(() => {
    if (!g.lastTrick) return;
    setShownTrick(g.lastTrick);
    sfx.pop();
    const id = window.setTimeout(() => setShownTrick(null), 1100);
    return () => window.clearTimeout(id);
  }, [g.lastTrick]);
  const over = g.phase === 'over';
  useEffect(() => {
    if (over && me >= 0 && winners(g).includes(me)) celebrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over]);

  if (over) {
    const order = seats.map((s, i) => ({ s, i })).sort((a, b) => g.scores[a.i] - g.scores[b.i]);
    const won = winners(g);
    return (
      <div className="bd">
        <Finished game="vierer" />
        <div className="bd-head center">
          <span className="kicker">{t('Game over')}</span>
          <h2 className="bd-title big">{won.includes(me) ? t('You win!') : t('{name} wins!', { name: won.map((i) => seats[i].name).join(' & ') })}</h2>
        </div>
        <ol className="vr-results">
          {order.map(({ s, i }) => (
            <li key={s.id} className={won.includes(i) ? 'won' : ''}>
              <span className="bd-avatar xs" style={{ background: s.color }}>
                <Avatar name={s.name} color={s.color} photo={photoOf(s.id)} />
              </span>
              <span className="vr-results-name">{s.name}</span>
              <span className="vr-results-n">{g.scores[i]}</span>
            </li>
          ))}
        </ol>
        {isHost && (
          <div className="sticky-action">
            <BigButton size="xl" onClick={onNewGame}>
              {t('New game')}
            </BigButton>
          </div>
        )}
      </div>
    );
  }

  const hand = me >= 0 ? g.hands[me] : [];
  const playCard = (c: Card) => {
    if (!canPlay(g, me, c)) {
      buzz([20, 30, 20]);
      return;
    }
    sfx.pop();
    buzz(10);
    act((x) => play(x, me, c));
  };
  const tap = (c: Card) => {
    if (!myTurn) return;
    if (sel && same(sel, c)) return playCard(c);
    setSel(c);
    sfx.tick();
  };

  const status =
    g.phase === 'call'
      ? g.caller === me
        ? t('Pick the next round')
        : t('{name} picks the next round', { name: seats[g.caller]?.name ?? '' })
      : myTurn
        ? g.phase === 'jacks'
          ? canMove(g, me)
            ? g.again
              ? t('An Ace: play once more')
              : t('Your turn: add to a line')
            : t('Nothing fits: sit this one out')
          : g.trick.length
            ? t('Your turn: follow suit if you can')
            : t('Your turn: lead a card')
        : t('{name}’s turn', { name: seats[g.turn]?.name ?? '' });
  const roundLabel = g.phase === 'jacks' ? t('Jacks round') : g.round ? t(ROUND_NAME[g.round]) : t('Round {n} of 4', { n: g.played.length + 1 });

  return (
    <div className="vr fill">
      <div className="vr-scores">
        {seats.map((s, i) => (
          <span key={s.id} className={`vr-seat${g.turn === i && g.phase !== 'call' ? ' on' : ''}${g.phase === 'call' && g.caller === i ? ' on' : ''}`} style={{ '--chip': s.color } as CSSProperties}>
            <span className="vr-seat-avatar">
              <Avatar name={s.name} color={s.color} photo={photoOf(s.id)} />
            </span>
            <span className="vr-seat-name">{name(i)}</span>
            <span className="vr-seat-score">{g.scores[i] + g.roundPoints[i]}</span>
          </span>
        ))}
      </div>
      <p className="vr-status">
        <span className="vr-round">{roundLabel}</span>
        <span className="vr-status-text">{status}</span>
      </p>

      <div className="vr-board vr-drop">
        {g.phase === 'call' ? (
          g.caller === me ? (
            <div className="vr-calls">
              {ROUNDS.filter((r) => !g.played.includes(r)).map((r) => (
                <button key={r} type="button" className="vr-call" onClick={() => act((x) => call(x, me, r))}>
                  <strong>{t(ROUND_NAME[r])}</strong>
                  <span>{t(ROUND_RULE[r])}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="vr-wait">{t('Left: {rounds}', { rounds: ROUNDS.filter((r) => !g.played.includes(r)).map((r) => t(ROUND_NAME[r])).join(' · ') })}</p>
          )
        ) : g.phase === 'jacks' ? (
          <JackLines g={g} />
        ) : (
          <TrickCross plays={g.trick.length ? g.trick : (shownTrick?.plays ?? [])} taker={g.trick.length ? null : (shownTrick?.by ?? null)} view={view} seats={seats} />
        )}
      </div>

      <Hand cards={hand} selected={sel} playable={(c) => myTurn && canPlay(g, me, c)} dim={myTurn} onTap={tap} onDrop={(c) => myTurn && playCard(c)} />

      <div className="vr-actions">
        {myTurn && g.phase === 'jacks' && !canMove(g, me) ? (
          <BigButton variant="glass" onClick={() => act((x) => skip(x, me))}>
            {t('Skip')}
          </BigButton>
        ) : (
          <p className="vr-hint">{myTurn ? (sel ? t('Tap it again or drag it onto the table') : t('Tap a card to pick it')) : ' '}</p>
        )}
      </div>
    </div>
  );
}

/** The trick: each card in front of whoever played it, you at the bottom. */
function TrickCross({ plays, taker, view, seats }: { plays: { seat: number; card: Card }[]; taker: number | null; view: number; seats: Seat[] }) {
  const spot = ['bottom', 'left', 'top', 'right'];
  return (
    <div className={`vr-trick${taker != null ? ` taken to-${spot[(taker - view + PLAYERS) % PLAYERS]}` : ''}`}>
      {plays.map((p) => (
        <span key={cardName(p.card)} className={`vr-trick-card ${spot[(p.seat - view + PLAYERS) % PLAYERS]}`} aria-label={`${seats[p.seat]?.name}: ${cardName(p.card)}`}>
          <CardFace card={p.card} />
        </span>
      ))}
    </div>
  );
}

/** The Jacks round: four lines, one per suit, the Jack in the middle; the next fitting places marked. */
function JackLines({ g }: { g: Game }) {
  const VALUES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  return (
    <div className="vr-lines">
      {SUITS.map((suit) => {
        const line = g.lines[suit];
        return (
          <div key={suit} className="vr-line">
            {VALUES.map((v) => {
              const down = line && v >= line.lo && v <= line.hi;
              const nextUp = line ? v === line.lo - 1 || v === line.hi + 1 : v === JACK;
              return (
                <span key={v} className={`vr-slot${down ? ' down' : ''}${nextUp ? ' next' : ''}${v === JACK ? ' jack' : ''}`}>
                  {down ? <CardFace card={{ value: v, suit }} /> : <span className="vr-slot-label">{rankLabel(v)}</span>}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/** Your hand in one overlapping row: tap to pick, tap again or drag onto the table to play. */
function Hand({ cards, selected, playable, dim, onTap, onDrop }: { cards: Card[]; selected: Card | null; playable: (c: Card) => boolean; dim: boolean; onTap: (c: Card) => void; onDrop: (c: Card) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(358);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [drag, setDrag] = useState<{ key: string; x: number; y: number; dx: number; dy: number } | null>(null);
  const moved = useRef(false);
  const n = cards.length;
  const cw = Math.min(64, w / 4.2);
  const step = n > 1 ? Math.min(cw + 6, (w - cw) / (n - 1)) : 0;
  const left0 = (w - (cw + step * (n - 1))) / 2;
  return (
    <div ref={box} className="vr-hand" style={{ '--cw': `${cw}px` } as CSSProperties}>
      {cards.map((c, i) => {
        const k = cardName(c);
        const sel = !!selected && same(selected, c);
        const held = drag?.key === k ? drag : null;
        return (
          <button
            key={k}
            type="button"
            className={`vr-card${sel ? ' selected' : ''}${dim && !playable(c) ? ' dim' : ''}`}
            style={{ transform: `translate(${left0 + i * step + (held?.dx ?? 0)}px, ${(sel ? -16 : 0) + (held?.dy ?? 0)}px)`, zIndex: held ? 50 : i + 1, transition: held ? 'none' : undefined }}
            onPointerDown={(e) => {
              moved.current = false;
              e.currentTarget.setPointerCapture?.(e.pointerId);
              setDrag({ key: k, x: e.clientX, y: e.clientY, dx: 0, dy: 0 });
            }}
            onPointerMove={(e) => {
              if (drag?.key !== k) return;
              const dx = e.clientX - drag.x;
              const dy = e.clientY - drag.y;
              if (Math.abs(dx) + Math.abs(dy) > 10) moved.current = true;
              setDrag({ ...drag, dx, dy });
            }}
            onPointerUp={(e) => {
              setDrag(null);
              if (!moved.current) return;
              if (document.elementsFromPoint(e.clientX, e.clientY).some((el) => el.closest('.vr-drop'))) onDrop(c);
            }}
            onPointerCancel={() => setDrag(null)}
            onClick={() => {
              if (moved.current) return void (moved.current = false);
              onTap(c);
            }}
            aria-label={cardName(c)}
          >
            <CardFace card={c} />
          </button>
        );
      })}
    </div>
  );
}
