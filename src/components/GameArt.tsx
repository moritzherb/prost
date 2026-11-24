import type { ReactElement, ReactNode } from 'react';

/*
 * Each game's picture for its app icon, its splash and wherever the game shows as a little picture:
 * our own, drawn here, instead of the phone's emoji. One way of drawing for all of them: a thing
 * from the game, lit from the top left (light to dark), a soft gloss where the light falls, no
 * outlines; 64 × 64. A game without one here keeps its emoji.
 */

type Art = () => ReactElement;

const FONT = 'system-ui, -apple-system, "SF Pro Display", Roboto, sans-serif';

/** A colour running from light (top left) to dark (bottom right). */
const lin = (id: string, from: string, to: string) => (
  <linearGradient id={id} x1="0.15" y1="0" x2="0.85" y2="1">
    <stop offset="0" stopColor={from} />
    <stop offset="1" stopColor={to} />
  </linearGradient>
);

/** The same, laid over the whole picture (64 × 64): every shape filled with it is one material,
 *  with no seam where two of them meet. */
const linU = (id: string, from: string, to: string, x1 = 10, y1 = 6, x2 = 54, y2 = 58) => (
  <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
    <stop offset="0" stopColor={from} />
    <stop offset="1" stopColor={to} />
  </linearGradient>
);

/** A round thing lit from the top left. */
const rad = (id: string, from: string, to: string) => (
  <radialGradient id={id} cx="0.36" cy="0.3" r="0.85">
    <stop offset="0" stopColor={from} />
    <stop offset="1" stopColor={to} />
  </radialGradient>
);

/** Where the light falls: a soft white sheen. */
const Gloss = ({ d, o = 0.38 }: { d: string; o?: number }) => <path d={d} fill="#fff" opacity={o} />;

/** A playing card's white face. */
const Card = ({ x, y, w = 24, h = 34, r = 4, turn = 0, cx = 32, cy = 58, children }: { x: number; y: number; w?: number; h?: number; r?: number; turn?: number; cx?: number; cy?: number; children?: ReactNode }) => (
  <g transform={`rotate(${turn} ${cx} ${cy})`}>
    <rect x={x} y={y + 1.5} width={w} height={h} rx={r} fill="#000" opacity="0.18" />
    <rect x={x} y={y} width={w} height={h} rx={r} fill="url(#ga-paper)" />
    {children}
  </g>
);

const paper = lin('ga-paper', '#ffffff', '#e6e1d6');

/** A heart, `s` wide, its top middle at (x, y). */
const heart = (x: number, y: number, s: number) =>
  `M${x} ${y + s * 0.28}c${-s * 0.12} ${-s * 0.32} ${-s * 0.5} ${-s * 0.34} ${-s * 0.5} ${-s * 0.02}c0 ${s * 0.26} ${s * 0.3} ${s * 0.44} ${s * 0.5} ${s * 0.62}c${s * 0.2} ${-s * 0.18} ${s * 0.5} ${-s * 0.36} ${s * 0.5} ${-s * 0.62}c0 ${-s * 0.32} ${-s * 0.38} ${-s * 0.3} ${-s * 0.5} ${s * 0.02}z`;

const ART: Record<string, Art> = {
  'bus-driver': () => (
    <>
      <defs>
        {lin('ga-bus', '#ffd970', '#ee9a1c')}
        {lin('ga-bus-glass', '#bfe6ff', '#3f82c6')}
      </defs>
      <rect x="14" y="48" width="10" height="10" rx="3.5" fill="#262626" />
      <rect x="40" y="48" width="10" height="10" rx="3.5" fill="#262626" />
      <rect x="11" y="7" width="42" height="46" rx="10" fill="url(#ga-bus)" />
      <rect x="22" y="9.5" width="20" height="4.5" rx="2.2" fill="#7c4a0d" opacity="0.5" />
      <rect x="15" y="16" width="34" height="18" rx="4.5" fill="url(#ga-bus-glass)" />
      <path d="M18 18h11l-6 14h-5z" fill="#fff" opacity="0.4" />
      <rect x="11" y="36" width="42" height="2" fill="#b86f0f" opacity="0.45" />
      <circle cx="19" cy="44" r="3.6" fill="#fff8dc" />
      <circle cx="45" cy="44" r="3.6" fill="#fff8dc" />
      <rect x="26" y="42" width="12" height="4.5" rx="2.2" fill="#a8640d" />
      <Gloss d="M15 12c4-3 9-3.5 14-3.5-6 1-10 2.5-14 6z" o={0.5} />
    </>
  ),
  'hose-runter': () => (
    <>
      <defs>
        {paper}
        {rad('ga-swap', '#7ee0a2', '#1f9a52')}
      </defs>
      <Card x={18} y={10} turn={-18} />
      <Card x={18} y={10} turn={0} />
      <Card x={18} y={10} turn={18}>
        <text x="21.5" y="19" fontFamily={FONT} fontWeight="800" fontSize="8" fill="#d62d20">
          A
        </text>
        <path d={heart(30, 21, 13)} fill="#d62d20" />
      </Card>
      <circle cx="47" cy="47" r="10" fill="url(#ga-swap)" />
      <path d="M42 46a5.5 5.5 0 0 1 9.3-3.4M52 48a5.5 5.5 0 0 1-9.3 3.4" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M52.4 39.6v4.2h-4.2M41.6 54.4v-4.2h4.2" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'kings-cup': () => (
    <>
      <defs>
        {lin('ga-gold', '#ffe58a', '#d99a00')}
        {lin('ga-gold-d', '#f2c230', '#a86f00')}
      </defs>
      <ellipse cx="32" cy="54" rx="13" ry="4.5" fill="url(#ga-gold-d)" />
      <rect x="29" y="38" width="6" height="15" rx="2" fill="url(#ga-gold-d)" />
      <path d="M16 22h32c0 12-6.5 19-16 19s-16-7-16-19z" fill="url(#ga-gold)" />
      <ellipse cx="32" cy="22" rx="16" ry="4" fill="#9b2318" />
      <ellipse cx="29" cy="21.2" rx="7" ry="1.4" fill="#fff" opacity="0.3" />
      <path d="M21 16l2-10 5 5 4-8 4 8 5-5 2 10z" fill="url(#ga-gold)" />
      <circle cx="32" cy="11.5" r="1.8" fill="#e5484d" />
      <circle cx="25.5" cy="13.5" r="1.4" fill="#3b82f6" />
      <circle cx="38.5" cy="13.5" r="1.4" fill="#22a06b" />
      <Gloss d="M19 25c1 6 3.5 10 7 12.5-5-1-8-6-8.6-12.5z" o={0.55} />
    </>
  ),
  klatschen: () => {
    // Two hands mid-clap, like the clapping-hands emoji: drawn upright round the wrist (0, 0), then
    // leant over to the left. Pinky to index: each finger's left edge and tip.
    const fingers = [
      [-11.2, -30],
      [-5.6, -35.5],
      [0, -37],
      [5.6, -34.5],
    ];
    const hand = (fill: string, thumb: boolean) => (
      <>
        {thumb && (
          <g transform="rotate(26 10 -6)">
            <rect x="6.6" y="-25" width="6.6" height="20" rx="3.3" fill={fill} />
            <ellipse cx="9.4" cy="-21.6" rx="1.3" ry="2.2" fill="#fff" opacity="0.45" />
          </g>
        )}
        <rect x="-11.2" y="-24" width="22.4" height="27" rx="10.5" fill={fill} />
        {fingers.map(([x, top], i) => (
          <g key={x}>
            {/* A soft groove where it lies on the finger before it (never past that finger's tip). */}
            {i > 0 && <rect x={x - 0.9} y={fingers[i - 1][1] + 2.8} width="5.6" height={-14 - fingers[i - 1][1] - 2.8} rx="2.8" fill="#a2560a" opacity="0.16" />}
            <rect x={x} y={top} width="5.6" height={-12 - top} rx="2.8" fill={fill} />
            <ellipse cx={x + 2.2} cy={top + 3.4} rx="1.2" ry="2.2" fill="#fff" opacity="0.45" />
          </g>
        ))}
      </>
    );
    // A motion stroke: round and wide out at (x, y), coming to a point at (tx, ty) by the hands.
    const ray = (x: number, y: number, tx: number, ty: number, w: number) => {
      const l = Math.hypot(tx - x, ty - y);
      const nx = ((y - ty) / l) * (w / 2);
      const ny = ((tx - x) / l) * (w / 2);
      return `M${x + nx} ${y + ny}L${tx} ${ty}L${x - nx} ${y - ny}A${w / 2} ${w / 2} 0 0 0 ${x + nx} ${y + ny}z`;
    };
    return (
      <>
        <defs>
          {linU('ga-clap-b', '#fbc843', '#e38816', 0, -40, 0, 4)}
          {linU('ga-clap-f', '#ffe476', '#f5aa2a', 0, -40, 0, 4)}
          {/* Cream, not the emoji's orange: the tile is orange. */}
          {lin('ga-clap-ray', '#fffaf0', '#ffdc9c')}
        </defs>
        {/* The hand behind sits lower left of the one in front, so its pinky side and fingertips show. */}
        <g transform="translate(46.5 50) rotate(-42) scale(0.92)">
          <g transform="translate(-6.5 -1)">{hand('url(#ga-clap-b)', false)}</g>
          {hand('url(#ga-clap-f)', true)}
        </g>
        <g fill="url(#ga-clap-ray)">
          <path d={ray(7.5, 21.5, 14.5, 24.5, 3.6)} />
          <path d={ray(13, 8.5, 18, 15, 3.6)} />
          <path d={ray(25.5, 5, 26, 13, 3.6)} />
        </g>
      </>
    );
  },
  'fuck-the-dealer': () => (
    <>
      <defs>
        {lin('ga-back', '#5b8cff', '#2546b8')}
        {rad('ga-bubble', '#ffffff', '#e6e1d6')}
      </defs>
      <g transform="rotate(-10 28 46)">
        <rect x="12" y="16.5" width="28" height="40" rx="5" fill="#000" opacity="0.18" />
        <rect x="12" y="15" width="28" height="40" rx="5" fill="#fff" />
        <rect x="15" y="18" width="22" height="34" rx="3" fill="url(#ga-back)" />
        <path d="M15 24l22 22M15 34l12 12M25 18l12 12" stroke="#fff" strokeWidth="1.6" opacity="0.35" />
      </g>
      <path d="M46 6a12 12 0 1 1-8.5 20.5l-5 2 2-5A12 12 0 0 1 46 6z" fill="url(#ga-bubble)" />
      <text x="46" y="23.5" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="16" fill="#d0367a">
        ?
      </text>
    </>
  ),
  'five-thousand': () => {
    // Poker dice, as the game's: one shows the Ace, one the King.
    const die = (x: number, y: number, turn: number, letter: string, color: string) => (
      <g transform={`rotate(${turn} ${x + 13} ${y + 13})`}>
        <rect x={x} y={y + 3} width="26" height="26" rx="6.5" fill="url(#ga-die-s)" />
        <rect x={x} y={y} width="26" height="26" rx="6.5" fill="url(#ga-die)" />
        <text x={x + 13} y={y + 20.5} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="19" fill={color}>
          {letter}
        </text>
      </g>
    );
    return (
      <>
        <defs>
          {lin('ga-die', '#ffffff', '#dfd9cb')}
          {lin('ga-die-s', '#c9c1ad', '#9d937b')}
        </defs>
        {die(32, 10, 14, 'K', '#1d1d1b')}
        {die(7, 25, -12, 'A', '#d62d20')}
      </>
    );
  },
  maexchen: () => {
    const die = (x: number, y: number, turn: number, pips: [number, number][]) => (
      <g transform={`rotate(${turn} ${x + 9} ${y + 9})`}>
        <rect x={x} y={y + 2} width="18" height="18" rx="4.5" fill="#b9b19d" />
        <rect x={x} y={y} width="18" height="18" rx="4.5" fill="url(#ga-die)" />
        {pips.map(([px, py], i) => (
          <circle key={i} cx={x + px} cy={y + py} r="2.1" fill="#d62d20" />
        ))}
      </g>
    );
    return (
      <>
        <defs>
          {lin('ga-leather', '#c48650', '#5f3818')}
          {lin('ga-die', '#ffffff', '#dfd9cb')}
        </defs>
        {/* Its shadow on the table, under the cup lifted off. */}
        <ellipse cx="45" cy="56" rx="11" ry="2.4" fill="#000" opacity="0.14" />
        {/* Mäxchen, now to be seen: a two and a one. */}
        {die(7, 37, -10, [
          [5, 5],
          [13, 13],
        ])}
        {die(27, 39, 8, [[9, 9]])}
        {/* The cup, lifted up and tipped to the side, its open mouth (dark inside) turned to the dice. */}
        <g transform="translate(38 29) rotate(24) scale(0.68) translate(-30 -44)">
          <path d="M17 9.5a3 3 0 0 1 3-3h20a3 3 0 0 1 3 3L47 41H13z" fill="url(#ga-leather)" />
          <Gloss d="M20.5 9.5h4.5l-3 29h-4.5z" o={0.22} />
          <rect x="10.5" y="38" width="39" height="8" rx="4" fill="#4d2c11" />
          <ellipse cx="30" cy="45" rx="18" ry="3.6" fill="#24130a" />
        </g>
      </>
    );
  },
  schweinerei: () => (
    <>
      <defs>
        {rad('ga-pig', '#ffd6e0', '#f0849f')}
        {rad('ga-snout', '#ffb3c6', '#e66a8a')}
        {lin('ga-ear', '#f7a1b6', '#d85c7c')}
      </defs>
      {/* Ears, folded forward a little, pink inside. */}
      <path d="M11 24C8 15 10 8 14 6c5 2 11 7 13 12z" fill="url(#ga-ear)" />
      <path d="M53 24c3-9 1-16-3-18-5 2-11 7-13 12z" fill="url(#ga-ear)" />
      <path d="M14 20c-1-5 0-9 2-10 3 1.5 6 4 7.5 7z" fill="#ffc4d3" />
      <path d="M50 20c1-5 0-9-2-10-3 1.5-6 4-7.5 7z" fill="#ffc4d3" />
      <ellipse cx="32" cy="35" rx="22" ry="20" fill="url(#ga-pig)" />
      <ellipse cx="18.5" cy="40" rx="4.5" ry="3" fill="#ff8fab" opacity="0.6" />
      <ellipse cx="45.5" cy="40" rx="4.5" ry="3" fill="#ff8fab" opacity="0.6" />
      <ellipse cx="32" cy="41" rx="10" ry="7.5" fill="url(#ga-snout)" />
      <ellipse cx="28.2" cy="41" rx="2" ry="3" fill="#a8385a" />
      <ellipse cx="35.8" cy="41" rx="2" ry="3" fill="#a8385a" />
      <ellipse cx="30" cy="36.5" rx="4" ry="1.6" fill="#fff" opacity="0.45" />
      <circle cx="23" cy="30" r="3.2" fill="#2b1d22" />
      <circle cx="41" cy="30" r="3.2" fill="#2b1d22" />
      <circle cx="24.1" cy="28.9" r="1.1" fill="#fff" />
      <circle cx="42.1" cy="28.9" r="1.1" fill="#fff" />
      <Gloss d="M15 27c2-7 8-11.5 15-12.5-6 3-10 7-11.5 13.5z" o={0.5} />
    </>
  ),
  speed: () => (
    <>
      <defs>{lin('ga-bolt', '#fff58a', '#ffa200')}</defs>
      <path d="M36 4L15 36h14l-6 24 26-36H35z" fill="url(#ga-bolt)" />
      <path d="M36 4L15 36h7z" fill="#fff" opacity="0.45" />
      <path d="M49 24L23 60l6-24h6z" fill="#c26a00" opacity="0.35" />
      <path d="M6 22h7M4 30h6M8 46h6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" opacity="0.8" />
    </>
  ),
  palace: () => (
    <>
      <defs>
        {lin('ga-stone', '#eef0f4', '#a9b0bd')}
        {lin('ga-stone-d', '#d4d8e0', '#8b93a2')}
      </defs>
      <path d="M17 4v14" stroke="#7a5230" strokeWidth="1.8" />
      <path d="M17.6 4.5h10l-3 3.2 3 3.3h-10z" fill="#e5484d" />
      <rect x="20" y="28" width="24" height="28" fill="url(#ga-stone-d)" />
      <rect x="9" y="18" width="15" height="38" rx="1.5" fill="url(#ga-stone)" />
      <rect x="40" y="18" width="15" height="38" rx="1.5" fill="url(#ga-stone)" />
      <path d="M9 14h4v5H9zM14.5 14h4v5h-4zM20 14h4v5h-4zM40 14h4v5h-4zM45.5 14h4v5h-4zM51 14h4v5h-4zM22 24h4v5h-4zM30 24h4v5h-4zM38 24h4v5h-4z" fill="url(#ga-stone)" />
      <path d="M26 56V45a6 6 0 0 1 12 0v11z" fill="#5a3a22" />
      <rect x="14" y="27" width="5" height="7" rx="2.5" fill="#3a4a66" />
      <rect x="45" y="27" width="5" height="7" rx="2.5" fill="#3a4a66" />
      <Gloss d="M10 19h4v36h-4z" o={0.3} />
    </>
  ),
  president: () => (
    <>
      <defs>
        {lin('ga-shirt', '#ffffff', '#d9dde4')}
        {lin('ga-tie', '#ff6b6b', '#b4161e')}
        {/* The tie's stripes stay on the tie. */}
        <clipPath id="ga-tie-clip">
          <path d="M29.5 30h5l6 22-8.5 8-8.5-8z" />
        </clipPath>
      </defs>
      <path d="M8 10l24 14 24-14v48H8z" fill="url(#ga-shirt)" />
      <path d="M32 24L14 6l-6 10 14 16zM32 24L50 6l6 10-14 16z" fill="#f4f5f7" />
      <path d="M28 23h8l-1.5 7h-5z" fill="#c81e28" />
      <path d="M29.5 30h5l6 22-8.5 8-8.5-8z" fill="url(#ga-tie)" />
      <g clipPath="url(#ga-tie-clip)" stroke="#7d0f15" strokeWidth="2" opacity="0.4">
        <path d="M20 42l24-14M20 50l24-14M20 58l24-14" />
      </g>
      <Gloss d="M30.5 31h2l-4 19-2.5-2.5z" o={0.35} />
    </>
  ),
  arschloch: () => (
    <>
      <defs>
        {lin('ga-j1', '#ff7a7a', '#c4202a')}
        {lin('ga-j2', '#8ee49d', '#23955a')}
        {lin('ga-j3', '#ffe27a', '#e0a100')}
        {rad('ga-bell', '#fff3b0', '#d29b00')}
      </defs>
      {/* The fool's cap, mirrored exactly about the middle: three points, a bell on each. */}
      <path d="M15 50C10 37 9 25 5 18c10 2 17 14 19 30z" fill="url(#ga-j1)" />
      <path d="M49 50c5-13 6-25 10-32-10 2-17 14-19 30z" fill="url(#ga-j2)" />
      <path d="M22 49c0-15 4-28 10-36 6 8 10 21 10 36z" fill="url(#ga-j3)" />
      <rect x="12" y="46" width="40" height="11" rx="5.5" fill="#5b3cc4" />
      <path d="M16 50h32" stroke="#fff" strokeWidth="1.6" opacity="0.3" strokeLinecap="round" />
      <circle cx="5" cy="17" r="3.8" fill="url(#ga-bell)" />
      <circle cx="59" cy="17" r="3.8" fill="url(#ga-bell)" />
      <circle cx="32" cy="11" r="3.8" fill="url(#ga-bell)" />
    </>
  ),
  'horse-race': () => (
    <>
      <defs>{lin('ga-shoe', '#ffe69a', '#c98a00')}</defs>
      <path d="M17 10c-9 13-8 36 15 42 23-6 24-29 15-42" fill="none" stroke="#7a5200" strokeWidth="12" strokeLinecap="round" opacity="0.25" transform="translate(0 2)" />
      <path d="M17 10c-9 13-8 36 15 42 23-6 24-29 15-42" fill="none" stroke="url(#ga-shoe)" strokeWidth="12" strokeLinecap="round" />
      <g fill="#7a5200" opacity="0.75">
        <circle cx="14" cy="20" r="1.6" />
        <circle cx="13" cy="31" r="1.6" />
        <circle cx="17" cy="42" r="1.6" />
        <circle cx="50" cy="20" r="1.6" />
        <circle cx="51" cy="31" r="1.6" />
        <circle cx="47" cy="42" r="1.6" />
      </g>
      <path d="M13 15c-2.5 6-3 13-2 19" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" opacity="0.55" fill="none" />
    </>
  ),
  trash: () => (
    <>
      <defs>{lin('ga-bin', '#e8ebf0', '#8d95a3')}</defs>
      <path d="M14 22h36l-4 36H18z" fill="url(#ga-bin)" />
      <path d="M22 28l1.5 24M32 28v24M42 28l-1.5 24" stroke="#6f7785" strokeWidth="2.4" strokeLinecap="round" opacity="0.6" />
      {/* The lid, tipped up a little. */}
      <g transform="rotate(-10 32 18)">
        <rect x="11" y="15" width="42" height="7" rx="3.5" fill="#a8afbb" />
        <rect x="26" y="10.5" width="12" height="5.5" rx="2.75" fill="#7d8594" />
      </g>
      <Gloss d="M16 24h4l2.5 32h-3z" o={0.45} />
    </>
  ),
  'who-drinks': () => (
    <>
      <defs>
        {lin('ga-slot', '#ff7b72', '#b3171f')}
        {rad('ga-knob', '#ff9a9a', '#b3171f')}
      </defs>
      <path d="M54 20v18" stroke="#9aa1ad" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="54" cy="16" r="4.6" fill="url(#ga-knob)" />
      <rect x="6" y="12" width="44" height="44" rx="8" fill="url(#ga-slot)" />
      <rect x="10" y="22" width="36" height="17" rx="4" fill="#2a1414" />
      <rect x="12" y="24" width="10" height="13" rx="2" fill="#fff" />
      <rect x="23" y="24" width="10" height="13" rx="2" fill="#fff" />
      <rect x="34" y="24" width="10" height="13" rx="2" fill="#fff" />
      <text x="17" y="34.5" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="10" fill="#d62d20">
        7
      </text>
      <text x="28" y="34.5" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="10" fill="#d62d20">
        7
      </text>
      <text x="39" y="34.5" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="10" fill="#d62d20">
        7
      </text>
      <rect x="16" y="44" width="24" height="6" rx="3" fill="#7d0f15" />
      <rect x="18" y="14" width="20" height="5" rx="2.5" fill="#ffd54a" />
      <Gloss d="M9 15c3-2 7-2.5 11-2.5-4 1-7.5 2.5-10 5z" o={0.5} />
    </>
  ),
  'princess-treatment': () => (
    <>
      <defs>
        {lin('ga-gold', '#ffe58a', '#d99a00')}
        {lin('ga-tiara', '#ffe680', '#ffcc33')}
      </defs>
      {/* The King's crown, gold, behind on the left. */}
      <g transform="translate(0 -3) rotate(-10 22 36)">
        <path d="M5 44l3-22 8 9 6-15 6 15 8-9 3 22z" fill="url(#ga-gold)" />
        <rect x="5" y="41" width="34" height="8" rx="2.5" fill="#d99a00" />
        <circle cx="22" cy="45" r="2.3" fill="#e5484d" />
        <circle cx="12.5" cy="45" r="1.6" fill="#3b82f6" />
        <circle cx="31.5" cy="45" r="1.6" fill="#22a06b" />
        <Gloss d="M8.5 25l2 14.5h-3.2z" o={0.5} />
      </g>
      {/* The Princess's tiara, as she wears it in the game (princess-treatment/Heads.tsx), in front on the right. */}
      <g transform="translate(43 42) rotate(8) scale(0.84) translate(-60 -25)">
        <path d="M37 38.5L45 24.5l7 9 8-19 8 19 7-9 8 14z" fill="#000" opacity="0.18" />
        <path d="M37 36L45 22l7 9 8-19 8 19 7-9 8 14z" fill="url(#ga-tiara)" stroke="#d99a00" strokeWidth="1.9" strokeLinejoin="round" />
        <circle cx="60" cy="25" r="4.4" fill="#ff5fa2" stroke="#d6337f" strokeWidth="1.3" />
        <circle cx="45.5" cy="29" r="2.5" fill="#7fd6ff" />
        <circle cx="74.5" cy="29" r="2.5" fill="#7fd6ff" />
      </g>
    </>
  ),
  'ten-but': () => (
    <>
      <defs>
        {rad('ga-sign', '#ffffff', '#e3ded2')}
        {lin('ga-wood', '#d9a066', '#8c5a2b')}
        {rad('ga-down', '#ff8a80', '#c62828')}
      </defs>
      <rect x="28" y="40" width="8" height="21" rx="3" fill="url(#ga-wood)" />
      <circle cx="32" cy="25" r="20" fill="#c81e28" />
      <circle cx="32" cy="25" r="16.5" fill="url(#ga-sign)" />
      <text x="32" y="32" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="19" fill="#1d1d1b" letterSpacing="-1">
        10
      </text>
      <circle cx="50" cy="44" r="8.5" fill="url(#ga-down)" />
      <path d="M50 39.5v8.5M46.2 44.8L50 48.6l3.8-3.8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <Gloss d="M17 20c2-6 7-10 13-11-5 2.5-9 6-10.5 12z" o={0.6} />
    </>
  ),
  party: () => (
    <>
      <defs>
        {/* The game's own pawn (party/pawns.ts): lit across, from the left. */}
        <linearGradient id="ga-pawn" gradientUnits="userSpaceOnUse" x1="9" y1="0" x2="55" y2="0">
          <stop offset="0" stopColor="#1b4aae" />
          <stop offset="0.3" stopColor="#6d98f0" />
          <stop offset="0.55" stopColor="#2463e8" />
          <stop offset="1" stopColor="#14378a" />
        </linearGradient>
        <radialGradient id="ga-pawn-head" cx="0.4" cy="0.32" r="0.7">
          <stop offset="0" stopColor="#9dbcf7" />
          <stop offset="0.45" stopColor="#2463e8" />
          <stop offset="1" stopColor="#163f9c" />
        </radialGradient>
      </defs>
      {/* A stocky, solid pawn: wide base, full body, a big round head. */}
      <ellipse cx="32" cy="55" rx="23" ry="5.6" fill="#163f9c" />
      <rect x="9" y="49" width="46" height="6" fill="url(#ga-pawn)" />
      <ellipse cx="32" cy="49" rx="23" ry="5.6" fill="#4a7fee" />
      <path d="M13 49c.6-12.5 10-17.5 11.4-26.5h15.2C41 31.5 50.4 36.5 51 49a19 4.6 0 0 1-38 0z" fill="url(#ga-pawn)" />
      <ellipse cx="32" cy="22.5" rx="12.5" ry="3.6" fill="url(#ga-pawn)" />
      <circle cx="32" cy="15" r="11.5" fill="url(#ga-pawn-head)" />
    </>
  ),
  'rat-screw': () => (
    <>
      <defs>
        {lin('ga-sand', '#ffd98a', '#c98d32')}
        {lin('ga-sand-d', '#d9a24a', '#9a6420')}
        {lin('ga-rat', '#d3d7de', '#7f8591')}
        {lin('ga-steel', '#f4f6f9', '#8e96a4')}
      </defs>
      {/* Egyptian: the pyramid behind, its shaded side on the right. */}
      <path d="M32 6L6 46h26z" fill="url(#ga-sand)" />
      <path d="M32 6l26 40H32z" fill="url(#ga-sand-d)" />
      <path d="M16 31h11M12 37.5h17M21 24.5h8" stroke="#a8702a" strokeWidth="1.4" opacity="0.4" strokeLinecap="round" />
      {/* The rat, sitting in front, facing right. */}
      <path d="M14 55c-6 0-9-3-6-6 2-2 5-1 7 0" fill="none" stroke="#c98fa0" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="24" cy="49" rx="12" ry="9" fill="url(#ga-rat)" />
      <path d="M30 42c5-3 11-2 15 3l-4 4c-3 2-8 2-11 0z" fill="url(#ga-rat)" />
      <circle cx="31" cy="39.5" r="4.6" fill="url(#ga-rat)" />
      <circle cx="31" cy="39.5" r="2.6" fill="#f2a5b8" />
      <circle cx="38.5" cy="44.5" r="1.5" fill="#1d1d1b" />
      <circle cx="45" cy="46.5" r="1.6" fill="#e56b8a" />
      <ellipse cx="21" cy="57.5" rx="3" ry="1.4" fill="#e9a3b5" />
      <ellipse cx="30" cy="57.5" rx="3" ry="1.4" fill="#e9a3b5" />
      {/* The screw, standing on the right. */}
      <g transform="rotate(14 52 46)">
        <rect x="49" y="40" width="6" height="18" rx="1" fill="url(#ga-steel)" />
        <path d="M49 43.5l6-2M49 47.5l6-2M49 51.5l6-2M49 55.5l6-2" stroke="#6a7280" strokeWidth="1.4" />
        <path d="M49 58l3 4 3-4z" fill="#8e96a4" />
        <ellipse cx="52" cy="40" rx="6.5" ry="2.8" fill="url(#ga-steel)" />
        <path d="M48.5 40h7" stroke="#5d6472" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </>
  ),
  'color-clash': () => {
    const cards: [string, string, number][] = [
      ['#ff7a7f', '#c8262d', -24],
      ['#7fb2ff', '#2459c7', -8],
      ['#ffd760', '#d99a00', 8],
      ['#6fdca5', '#178a52', 24],
    ];
    return (
      <>
        <defs>{cards.map(([a, b], i) => lin(`ga-cc${i}`, a, b))}</defs>
        {cards.map(([, , turn], i) => (
          <g key={i} transform={`rotate(${turn} 32 60)`}>
            <rect x="20" y="13.5" width="24" height="36" rx="4.5" fill="#000" opacity="0.18" />
            <rect x="20" y="12" width="24" height="36" rx="4.5" fill="#fff" />
            <rect x="22" y="14" width="20" height="32" rx="3" fill={`url(#ga-cc${i})`} />
            {i === 3 && <ellipse cx="32" cy="30" rx="7" ry="11" fill="#fff" opacity="0.9" transform="rotate(20 32 30)" />}
          </g>
        ))}
      </>
    );
  },
  spellbound: () => (
    <>
      <defs>
        {lin('ga-hat', '#a58bff', '#4120a8')}
        {lin('ga-brim', '#7b5cf0', '#2f1780')}
      </defs>
      <ellipse cx="32" cy="50" rx="27" ry="8" fill="url(#ga-brim)" />
      <path d="M14 48C20 34 24 18 34 4c2 8 8 14 6 22l8 22c-12 4-22 4-34 0z" fill="url(#ga-hat)" />
      <path d="M15 44c11 3.5 22 3.5 32 0l1.6 4.4c-12 4-22 4-34.6 0z" fill="#ffcb2e" />
      <path d="M30 22l1.4 3 3.2.4-2.4 2.2.7 3.2-2.9-1.6-2.9 1.6.7-3.2-2.4-2.2 3.2-.4zM39 33l1 2 2.2.3-1.6 1.5.4 2.1-2-1.1-2 1.1.4-2.1-1.6-1.5 2.2-.3z" fill="#ffe27a" />
      <Gloss d="M18 44c5-12 9-24 15-36-3 10-6 22-10 36z" o={0.25} />
    </>
  ),
  'number-flip': () => (
    <>
      <defs>
        {lin('ga-box', '#d9a066', '#7f4f22')}
        {lin('ga-tile', '#fff9e8', '#e7dcc0')}
      </defs>
      <rect x="4" y="22" width="56" height="30" rx="6" fill="url(#ga-box)" />
      {/* The light on the box's top edge: rounded at both ends, inside its corners, behind the flaps. */}
      <rect x="9" y="23.2" width="46" height="1.8" rx="0.9" fill="#fff" opacity="0.3" />
      <rect x="8" y="26" width="48" height="22" rx="3" fill="#5c3818" />
      {[0, 1, 2, 3].map((i) =>
        i === 2 ? (
          <rect key={i} x={10 + i * 11.5} y="40" width="10" height="7" rx="1.5" fill="#cbbd98" />
        ) : (
          <g key={i}>
            <rect x={10 + i * 11.5} y="14" width="10" height="33" rx="2" fill="url(#ga-tile)" />
            <text x={15 + i * 11.5} y="35" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="11" fill="#5c3818">
              {[1, 2, 3, 4][i]}
            </text>
          </g>
        ),
      )}
    </>
  ),
  'mega-ttt': () => (
    <>
      <defs>{lin('ga-board', '#ffffff', '#dcd6c8')}</defs>
      <rect x="6" y="8" width="52" height="52" rx="10" fill="#000" opacity="0.16" />
      <rect x="6" y="6" width="52" height="52" rx="10" fill="url(#ga-board)" />
      <path d="M24 12v40M40 12v40M12 24h40M12 40h40" stroke="#4a4a46" strokeWidth="3" strokeLinecap="round" />
      <path d="M13 13l7 7M20 13l-7 7M45 29l7 7M52 29l-7 7M29 45l6 6M35 45l-6 6" stroke="#e5484d" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="32" cy="32" r="4.4" fill="none" stroke="#2f6fe0" strokeWidth="3.2" />
      <circle cx="48.5" cy="16.5" r="4.4" fill="none" stroke="#2f6fe0" strokeWidth="3.2" />
    </>
  ),
  'beat-the-deck': () => (
    <>
      <defs>
        {paper}
        {rad('ga-up', '#7ee0a2', '#1f9a52')}
        {rad('ga-down', '#ff8a80', '#c62828')}
      </defs>
      <Card x={10} y={14} w={28} h={40} r={5} turn={-6} cx={24} cy={34}>
        <text x="14.5" y="25" fontFamily={FONT} fontWeight="800" fontSize="10" fill="#1d1d1b">
          7
        </text>
        <path d="M24 28c-3 4-7 6-7 10a4 4 0 0 0 6 3l-1.5 5h5L25 41a4 4 0 0 0 6-3c0-4-4-6-7-10z" fill="#1d1d1b" />
      </Card>
      <circle cx="48" cy="20" r="10" fill="url(#ga-up)" />
      <path d="M48 25v-10M43.5 19.5L48 15l4.5 4.5" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="45" r="10" fill="url(#ga-down)" />
      <path d="M48 40v10M43.5 45.5L48 50l4.5-4.5" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  accordion: () => (
    <>
      <defs>
        {lin('ga-acc', '#ff7b72', '#a8141c')}
        {linU('ga-fold-a', '#fff2dc', '#d8b98a', 0, 10, 0, 56)}
        {linU('ga-fold-b', '#d4ad74', '#8f6a3d', 0, 10, 0, 56)}
      </defs>
      <g transform="rotate(-8 32 32)">
        {/* The bellows: pleats in turn lit and in shade, wider in the middle as it's pulled open. */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 18 + i * 4.7;
          return (
            <g key={i}>
              <path d={`M${x} ${12 - (i === 2 || i === 3 ? 2 : 0)}h2.35v${44 + (i === 2 || i === 3 ? 4 : 0)}H${x}z`} fill="url(#ga-fold-a)" />
              <path d={`M${x + 2.35} ${12 - (i === 2 || i === 3 ? 2 : 0)}h2.35v${44 + (i === 2 || i === 3 ? 4 : 0)}h-2.35z`} fill="url(#ga-fold-b)" />
            </g>
          );
        })}
        {/* The two ends: the treble side with its keys (right), the bass side with its buttons. */}
        <rect x="4" y="9" width="15" height="48" rx="4" fill="url(#ga-acc)" />
        <rect x="45" y="9" width="15" height="48" rx="4" fill="url(#ga-acc)" />
        <rect x="48" y="12" width="9" height="42" rx="2" fill="#fbf7ee" />
        <g fill="#1d1d1b">
          {[0, 1, 2, 4, 5].map((i) => (
            <rect key={i} x="52.5" y={15 + i * 7} width="4.5" height="4" rx="1" />
          ))}
        </g>
        <g fill="#ffe27a">
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx="11.5" cy={15 + i * 8.5} r="2.4" />
          ))}
        </g>
        <Gloss d="M6 11h3.5v44H6z" o={0.3} />
      </g>
    </>
  ),
  vierer: () => (
    <>
      <defs>{paper}</defs>
      <Card x={20} y={10} w={24} h={36} turn={-21} />
      <Card x={20} y={10} w={24} h={36} turn={-7} />
      <Card x={20} y={10} w={24} h={36} turn={7} />
      <Card x={20} y={10} w={24} h={36} turn={21}>
        <text x="32" y="36" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="22" fill="#d62d20">
          4
        </text>
      </Card>
    </>
  ),
  'pub-quiz': () => (
    <>
      <defs>
        {rad('ga-dome', '#ff8a80', '#b3171f')}
        {lin('ga-base', '#4a4b45', '#141512')}
      </defs>
      <ellipse cx="32" cy="50" rx="26" ry="9" fill="#0b0b0a" />
      <ellipse cx="32" cy="46" rx="26" ry="9" fill="url(#ga-base)" />
      <path d="M12 44c0-14 9-24 20-24s20 10 20 24c-6 3-13 4.5-20 4.5S18 47 12 44z" fill="url(#ga-dome)" />
      <ellipse cx="25" cy="29" rx="7" ry="4" fill="#fff" opacity="0.55" transform="rotate(-25 25 29)" />
      <path d="M32 6v6M17 10l3.5 5M47 10l-3.5 5" stroke="#ffd54a" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
};

/** Whether a game has a picture of its own here. */
export const hasArt = (id: string) => id in ART;

/** A game's picture, sized by the font size round it (1.15em square). */
export default function GameArt({ id }: { id: string }) {
  const Draw = ART[id];
  if (!Draw) return null;
  return (
    <svg className="game-art" viewBox="0 0 64 64" aria-hidden="true">
      <Draw />
    </svg>
  );
}
