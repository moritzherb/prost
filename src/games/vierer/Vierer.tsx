import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import Avatar from '../../components/Avatar';
import BigButton from '../../components/BigButton';
import Finished from '../../components/Finished';
import Glyph from '../../components/Glyph';
import SuitIcon from '../../components/Suit';
import { CardFace } from '../../components/PlayingCard';
import Tap from '../../components/Tap';
import { t, tx } from '../../i18n';
import { cardColor, cardName, rankLabel, SUITS, type Card } from '../../lib/cards';
import { flyIn } from '../../lib/cardFly';
import { buzz, celebrate, sfx } from '../../lib/fx';
import { useCrewButton, useYourTurn } from '../../lib/turn';
import { useShared } from '../../net/shared';
import { useApp } from '../../state/AppState';
import { call, canMove, canPlay, JACK, KING_OF_CLUBS, newGame, play, PLAYERS, POINTS, QUEEN, ROUNDS, same, skip, winners, type Game, type RoundKind } from './logic';

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
  // The trick just taken stays on the table a moment before it goes to its taker: what it cost
  // rises from the taker's score, and a Queen or the King of clubs is called out on the table.
  const [shownTrick, setShownTrick] = useState<Game['lastTrick']>(null);
  const [gain, setGain] = useState<{ seat: number; pts: number; what: string | null; key: number } | null>(null);
  useEffect(() => {
    const lt = g.lastTrick;
    if (!lt) return;
    setShownTrick(lt);
    const queens = lt.plays.filter((p) => p.card.value === QUEEN).length;
    const king = lt.plays.some((p) => same(p.card, KING_OF_CLUBS));
    const pts = lt.kind === 'queens' ? queens * POINTS.queen : lt.kind === 'king' ? (king ? POINTS.king : 0) : lt.kind === 'tricks' ? POINTS.trick : 0;
    const what = lt.kind === 'queens' && queens ? (queens === 1 ? t('A Queen') : t('{n} Queens', { n: queens })) : lt.kind === 'king' && king ? t('The King of clubs') : null;
    setGain(pts ? { seat: lt.by, pts, what, key: g.seq } : null);
    if (what) {
      sfx.boo();
      buzz([40, 40, 40]);
    } else sfx.pop();
    const id = window.setTimeout(() => setShownTrick(null), what ? 1700 : 1100);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per trick taken
  }, [g.lastTrick]);
  // A round over: a look back at who got what and why, until tapped away (or after a while).
  const [seenDeal, setSeenDeal] = useState(g.deal);
  const roundUp = g.lastRound && seenDeal !== g.deal && g.phase !== 'over' ? g.lastRound : null;
  useEffect(() => {
    if (!roundUp) return;
    const id = window.setTimeout(() => setSeenDeal(g.deal), 7000);
    return () => window.clearTimeout(id);
  }, [roundUp, g.deal]);
  // Where your card was in your hand when you played it: it flies to the table from there.
  const launch = useRef<DOMRect | null>(null);
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
          <h2 className="bd-title big">{won.includes(me) ? t('You win') : t('{name} wins', { name: won.map((i) => seats[i].name).join(' & ') })}</h2>
        </div>
        <ol className="vr-results">
          {order.map(({ s, i }, k) => (
            <li key={s.id} className={won.includes(i) ? 'won' : ''} style={{ '--k': k } as CSSProperties}>
              <span className="vr-results-rank">{won.includes(i) ? <Glyph name="trophy" /> : k + 1}</span>
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
    launch.current = document.querySelector(`.vr-card[data-card="${cardName(c)}"]`)?.getBoundingClientRect() ?? null;
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
          <span key={s.id} data-seat={i} className={`vr-seat${g.turn === i && g.phase !== 'call' ? ' on' : ''}${g.phase === 'call' && g.caller === i ? ' on' : ''}`} style={{ '--chip': s.color } as CSSProperties}>
            <span className="vr-seat-avatar">
              <Avatar name={s.name} color={s.color} photo={photoOf(s.id)} />
            </span>
            <span className="vr-seat-name">{name(i)}</span>
            <span className="vr-seat-score">{g.scores[i] + g.roundPoints[i]}</span>
            {gain?.seat === i && (
              <span key={gain.key} className="vr-gain">
                +{gain.pts}
              </span>
            )}
          </span>
        ))}
      </div>
      <p className={`vr-status${myTurn ? ' mine' : ''}`}>
        <span className="vr-round">{roundLabel}</span>
        <span key={myTurn ? `me-${g.seq}` : 'status'} className="vr-status-text">
          {status}
        </span>
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
          <TrickCross
            plays={g.trick.length ? g.trick : (shownTrick?.plays ?? [])}
            taker={g.trick.length ? null : (shownTrick?.by ?? null)}
            kind={g.trick.length ? g.round : (shownTrick?.kind ?? null)}
            view={view}
            me={me}
            seats={seats}
            launch={launch}
          />
        )}
        {shownTrick && gain?.what && (
          <div key={gain.key} className="vr-callout" style={{ '--chip': seats[gain.seat]?.color } as CSSProperties}>
            <strong>{gain.what}</strong>
            <span>{t('+{n} for {name}', { n: gain.pts, name: name(gain.seat) })}</span>
          </div>
        )}
        {roundUp && (
          <button type="button" className="vr-roundup" onClick={() => setSeenDeal(g.deal)}>
            <span className="kicker">{t('Round over')}</span>
            <strong className="vr-roundup-title">{t(ROUND_NAME[roundUp.kind])}</strong>
            <span className="vr-roundup-rows">
              {seats.map((st, i) => (
                <span key={st.id} className="vr-roundup-row" style={{ '--k': i } as CSSProperties}>
                  <span className="vr-seat-avatar">
                    <Avatar name={st.name} color={st.color} photo={photoOf(st.id)} />
                  </span>
                  <span className="vr-roundup-name">{name(i)}</span>
                  <span className="vr-roundup-why">{why(roundUp.kind, roundUp.points[i])}</span>
                  <span className={`vr-roundup-n${roundUp.points[i] ? '' : ' zero'}`}>{roundUp.points[i] ? `+${roundUp.points[i]}` : '0'}</span>
                </span>
              ))}
            </span>
            <span className="vr-roundup-tap">{t('Tap to go on')}</span>
          </button>
        )}
      </div>

      <Hand key={g.deal} cards={hand} selected={sel} playable={(c) => myTurn && canPlay(g, me, c)} turn={myTurn} onTap={tap} onDrop={(c) => myTurn && playCard(c)} />

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

/** Why a seat got its points in a round: the Queens, the King, the tricks it took (or nothing). */
function why(kind: RoundKind, pts: number) {
  if (!pts) return t('Nothing');
  if (kind === 'queens') return pts / POINTS.queen === 1 ? t('1 Queen') : t('{n} Queens', { n: pts / POINTS.queen });
  if (kind === 'king') return t('King of clubs');
  return pts / POINTS.trick === 1 ? t('1 trick') : t('{n} tricks', { n: pts / POINTS.trick });
}

/**
 * The trick: each card in front of whoever played it, you at the bottom. A card played flies in from
 * its player (yours from your hand); the cards that cost points glow.
 */
function TrickCross({
  plays,
  taker,
  kind,
  view,
  me,
  seats,
  launch,
}: {
  plays: { seat: number; card: Card }[];
  taker: number | null;
  kind: RoundKind | null;
  view: number;
  me: number;
  seats: Seat[];
  launch: { current: DOMRect | null };
}) {
  const spot = ['bottom', 'left', 'top', 'right'];
  const box = useRef<HTMLDivElement>(null);
  const last = plays.at(-1);
  const lastKey = taker == null && last ? cardName(last.card) : null;
  useLayoutEffect(() => {
    if (!last || !lastKey) return;
    const el = box.current?.querySelector<HTMLElement>(`[data-trick="${lastKey}"]`);
    const from = last.seat === me && launch.current ? launch.current : document.querySelector(`.vr-seat[data-seat="${last.seat}"]`)?.getBoundingClientRect();
    launch.current = null;
    if (el && from) flyIn(el, from, 340);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per card played
  }, [lastKey]);
  const hot = (c: Card) => (kind === 'queens' && c.value === QUEEN) || (kind === 'king' && same(c, KING_OF_CLUBS));
  return (
    <div ref={box} className={`vr-trick${taker != null ? ` taken to-${spot[(taker - view + PLAYERS) % PLAYERS]}` : ''}`}>
      {plays.map((p) => (
        <span
          key={cardName(p.card)}
          data-trick={cardName(p.card)}
          className={`vr-trick-card ${spot[(p.seat - view + PLAYERS) % PLAYERS]}${hot(p.card) ? ' hot' : ''}`}
          aria-label={`${seats[p.seat]?.name}: ${cardName(p.card)}`}
        >
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
                <span key={v} className={`vr-slot${down ? ` down ${cardColor({ value: v, suit })}` : ''}${nextUp ? ' next' : ''}${v === JACK ? ' jack' : ''}`}>
                  {/* A card laid: just its rank and suit, big (the cards are small here). */}
                  {down ? (
                    <span className="vr-mini" aria-label={cardName({ value: v, suit })}>
                      <b>{rankLabel(v)}</b>
                      <SuitIcon suit={suit} />
                    </span>
                  ) : (
                    <span className="vr-slot-label">{rankLabel(v)}</span>
                  )}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Your hand in one overlapping row. Run a finger along it and the card under it comes up (the top one
 * there, never one jumping over its neighbours); let go to pick it, tap it again to play it, or pull it
 * up onto the table. Dealt in card by card; on your turn the cards you may play bob.
 */
function Hand({ cards, selected, playable, turn, onTap, onDrop }: { cards: Card[]; selected: Card | null; playable: (c: Card) => boolean; turn: boolean; onTap: (c: Card) => void; onDrop: (c: Card) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(358);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const n = cards.length;
  const cw = Math.min(64, w / 4.2);
  const step = n > 1 ? Math.min(cw + 6, (w - cw) / (n - 1)) : 0;
  const left0 = (w - (cw + step * (n - 1))) / 2;
  const [hover, setHover] = useState<number | null>(null);
  const [drag, setDrag] = useState<{ i: number; dx: number; dy: number } | null>(null);
  const down = useRef<{ x: number; y: number } | null>(null);
  /** The card on top under the finger (each card covers the left of the one before it). */
  const at = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r || !n) return null;
    const x = clientX - r.left - left0;
    if (x < 0 || x > step * (n - 1) + cw) return null;
    return Math.min(n - 1, Math.floor(x / Math.max(1, step)));
  };
  const end = () => {
    down.current = null;
    setDrag(null);
    setHover(null);
  };
  return (
    <div
      ref={box}
      className={`vr-hand${turn ? ' turn' : ''}`}
      style={{ '--cw': `${cw}px` } as CSSProperties}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture?.(e.pointerId);
        down.current = { x: e.clientX, y: e.clientY };
        setHover(at(e.clientX));
      }}
      onPointerMove={(e) => {
        const d = down.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        if (drag) return setDrag({ ...drag, dx, dy });
        // Pulled up: that card goes along with the finger (only one you may play).
        if (dy < -28 && hover != null && playable(cards[hover])) return setDrag({ i: hover, dx, dy });
        setHover(at(e.clientX));
      }}
      onPointerUp={(e) => {
        const i = drag ? drag.i : hover;
        const dropped = !!drag && document.elementsFromPoint(e.clientX, e.clientY).some((el) => el.closest('.vr-drop'));
        end();
        if (i == null || !cards[i]) return;
        if (drag) {
          if (dropped) onDrop(cards[i]);
        } else onTap(cards[i]);
      }}
      onPointerCancel={end}
    >
      {cards.map((c, i) => {
        const k = cardName(c);
        const sel = !!selected && same(selected, c);
        const held = drag?.i === i ? drag : null;
        const lift = sel ? -16 : hover === i && !drag ? -12 : 0;
        const ok = playable(c);
        return (
          <button
            key={k}
            type="button"
            data-card={k}
            className={`vr-card${sel ? ' selected' : ''}${turn && !ok ? ' dim' : ''}${turn && ok ? ' ok' : ''}`}
            style={
              {
                '--i': i,
                transform: `translate(${left0 + i * step + (held?.dx ?? 0)}px, ${lift + (held?.dy ?? 0)}px)`,
                zIndex: held ? 50 : i + 1,
                transition: held ? 'none' : undefined,
              } as CSSProperties
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onTap(c);
              }
            }}
            aria-label={k}
          >
            <span className="vr-card-in">
              <CardFace card={c} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
