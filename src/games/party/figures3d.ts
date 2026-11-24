/*
 * The special pawns (beer, unicorn, flamingo, …) as real little board-game pieces: each stands on a
 * turned pedestal (as the classic pawn does), its body turned on a lathe where it's round (a mug, a
 * ghost, a pineapple, a hat) or cut out thick with softened edges where it's a profile (the unicorn's
 * head, the dino, like a chess knight), painted matte with a few details. Lit by a soft room light and
 * one lamp from the top left, drawn once into the picture the board and the setup use as they use the
 * classic pawn's. Loaded on its own (three.js), so the flat token shows until it's here.
 *
 * Units are the sprite's own (SPRITE_H tall); y up, z towards you, the pedestal's centre at the origin.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { shade, SPRITE_H, type PawnDef } from './pawns';

type P = [number, number, number];
type XY = [number, number];

/** Seen a little from above, as a pawn standing on the board. */
const TILT = 12;
const PAD = 10;
const INK = '#1f1d1a';

class Kit {
  readonly group = new THREE.Group();
  private stuff: { dispose(): void }[] = [];

  mat(color: string, roughness = 0.62) {
    const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness, metalness: 0 });
    this.stuff.push(m);
    return m;
  }

  add(geo: THREE.BufferGeometry, color: string | THREE.Material, at: P = [0, 0, 0], rot: P = [0, 0, 0], scale: P = [1, 1, 1], parent: THREE.Object3D = this.group) {
    this.stuff.push(geo);
    const m = new THREE.Mesh(geo, typeof color === 'string' ? this.mat(color) : color);
    m.position.set(...at);
    m.rotation.set(...rot);
    m.scale.set(...scale);
    parent.add(m);
    return m;
  }

  /** A body turned round the y axis from its outline (x = radius, y = height), smoothed. */
  lathe(outline: XY[], color: string | THREE.Material, at: P = [0, 0, 0], scale: P = [1, 1, 1]) {
    const curve = new THREE.SplineCurve(outline.map(([x, y]) => new THREE.Vector2(x, y)));
    const pts = curve.getPoints(outline.length * 10).map((v) => new THREE.Vector2(Math.max(0, v.x), v.y));
    return this.add(new THREE.LatheGeometry(pts, 64), color, at, [0, 0, 0], scale);
  }

  /** A profile cut out `depth` thick with softly rounded edges, centred on z = 0. */
  cutout(outline: XY[], depth: number, color: string, at: P = [0, 0, 0], rot: P = [0, 0, 0]) {
    const s = new THREE.Shape();
    s.moveTo(...outline[0]);
    s.splineThru(outline.slice(1).map(([x, y]) => new THREE.Vector2(x, y)));
    s.closePath();
    const bevel = Math.min(7, depth * 0.3);
    const geo = new THREE.ExtrudeGeometry(s, { depth: depth - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: 6, curveSegments: 48 });
    geo.translate(0, 0, -(depth - bevel * 2) / 2);
    return this.add(geo, color, at, rot);
  }

  ball(r: number, color: string | THREE.Material, at: P, scale: P = [1, 1, 1], rot: P = [0, 0, 0]) {
    return this.add(new THREE.SphereGeometry(r, 40, 28), color, at, rot, scale);
  }

  capsule(r: number, len: number, color: string, at: P, rot: P = [0, 0, 0], scale: P = [1, 1, 1]) {
    return this.add(new THREE.CapsuleGeometry(r, len, 8, 24), color, at, rot, scale);
  }

  cone(r: number, h: number, color: string, at: P, rot: P = [0, 0, 0], scale: P = [1, 1, 1], parent?: THREE.Object3D) {
    return this.add(new THREE.ConeGeometry(r, h, 32), color, at, rot, scale, parent);
  }

  tube(points: P[], r: number, color: string, caps = true) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    const mesh = this.add(new THREE.TubeGeometry(curve, 64, r, 20, false), color);
    if (caps) {
      this.ball(r, color, points[0]);
      this.ball(r, color, points[points.length - 1]);
    }
    return mesh;
  }

  dispose() {
    this.stuff.forEach((s) => s.dispose());
  }
}

/** The turned pedestal every figure stands on, in its colour: a low disc with a rounded rim. */
function pedestal(k: Kit, color: string) {
  k.lathe(
    [
      [0, 0],
      [50, 0],
      [55, 4],
      [55, 10],
      [50, 14.5],
      [36, 15.5],
      [0, 15.5],
    ],
    shade(color, -0.22),
  );
}

/** Two eyes on a round face of radius `r` centred at (0, y, 0), `spread` apart, looking forward. */
function eyesOn(k: Kit, r: number, y: number, spread: number, size: number, zOff = 0) {
  for (const s of [-1, 1]) {
    const x = s * spread;
    const z = Math.sqrt(Math.max(0, r * r - x * x)) + zOff;
    k.ball(size, INK, [x, y, z - size * 0.35], [1, 1.25, 0.6]);
    k.ball(size * 0.28, '#ffffff', [x - size * 0.3, y + size * 0.35, z + size * 0.15]);
  }
}

const BUILD: Record<string, (k: Kit, color: string) => void> = {
  beer: (k) => {
    const glass = k.mat('#e9a227', 0.42);
    k.lathe([[0, 15], [27, 15], [30, 17], [31, 24], [33, 88], [33.5, 92], [0, 92]], glass);
    // The thick glass foot, a shade lighter.
    k.lathe([[0, 15], [30, 15], [31.5, 17], [31.5, 24], [0, 24]], k.mat('#f3be52', 0.35));
    // The head of foam, heaped above the rim and running over on the right.
    k.lathe([[0, 88], [33, 88], [36, 92], [35.5, 99], [30, 106], [20, 111], [0, 113]], '#fbf6ea');
    k.capsule(5.5, 10, '#fbf6ea', [26, 86, 18], [0, 0, 0.12]);
    k.capsule(4.5, 6, '#fbf6ea', [-14, 87, 29], [0, 0, -0.08]);
    // The handle.
    k.tube([[31, 78, 0], [50, 76, 0], [53, 54, 0], [49, 38, 0], [32, 34, 0]], 6.5, '#d08f1b', false);
  },
  ghost: (k) => {
    const sheet = '#f2f2f5';
    const body = k.lathe([[0, 138], [16, 136], [30, 127], [38, 112], [41, 92], [42, 66], [45, 44], [48, 30], [44, 26], [0, 30]], sheet);
    // The hem in waves: the bottom of the sheet pushed up and down round the edge.
    const pos = (body.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 40) continue;
      const a = Math.atan2(pos.getZ(i), pos.getX(i));
      pos.setY(i, y + Math.sin(a * 7) * 4 * (1 - (y - 26) / 14));
    }
    body.geometry.computeVertexNormals();
    k.capsule(8, 14, sheet, [-40, 78, 6], [0, 0, 0.7]);
    k.capsule(8, 14, sheet, [40, 78, 6], [0, 0, -0.7]);
    eyesOn(k, 39, 104, 13, 7.5);
    k.ball(6.5, '#3b3a40', [0, 86, 39], [1, 1.35, 0.5]);
  },
  pineapple: (k, color) => {
    k.lathe([[0, 15], [20, 16], [34, 30], [40, 56], [37, 82], [27, 98], [13, 106], [0, 107]], pineappleSkin(color));
    // The crown: long pointed leaves fanning out, a taller ring inside a lower one.
    const leaf = (len: number, wide: number, tilt: number, turn: number, color: string) => {
      const g = new THREE.Group();
      g.position.set(0, 102, 0);
      g.rotation.y = turn;
      k.group.add(g);
      k.cone(wide, len, color, [0, len / 2 - 2, 4], [tilt, 0, 0], [1, 1, 0.32], g);
    };
    for (let i = 0; i < 8; i++) leaf(38, 7, 0.75, (i / 8) * Math.PI * 2, '#3f9a4d');
    for (let i = 0; i < 6; i++) leaf(50, 6.5, 0.32, (i / 6) * Math.PI * 2 + 0.4, '#55b55f');
  },
  frog: (k, color) => {
    k.ball(42, color, [0, 50, 0], [1.12, 0.78, 1]);
    k.ball(30, mix(color, '#f4f0c8', 0.65), [0, 44, 16], [1, 0.72, 0.8]);
    for (const s of [-1, 1]) {
      // Back legs folded at the sides, front feet in front.
      k.ball(17, shade(color, -0.08), [s * 40, 32, -6], [0.8, 0.6, 1.25]);
      k.ball(10, shade(color, -0.05), [s * 24, 21, 32], [1.3, 0.45, 1.1]);
      // The eyes: domes on top, the eye in each.
      k.ball(15, color, [s * 22, 82, 8]);
      k.ball(10, '#f7f4e8', [s * 22, 85, 17]);
      k.ball(5.5, INK, [s * 22, 86, 25.5], [1, 1.2, 0.6]);
      k.ball(1.6, '#ffffff', [s * 22 - 1.8, 88, 27.6]);
    }
    k.tube([[-20, 66, 36], [-8, 61, 41], [8, 61, 41], [20, 66, 36]], 1.8, shade(color, -0.5));
  },
  alien: (k, color) => {
    k.lathe([[0, 15], [17, 15], [14, 30], [12, 46], [16, 58], [0, 60]], shade(color, -0.12));
    // The head: wide at the brow, a narrow chin.
    k.lathe([[0, 56], [10, 58], [24, 68], [36, 88], [38, 104], [31, 118], [17, 125], [0, 127]], color);
    for (const s of [-1, 1]) {
      k.ball(12, k.mat('#141416', 0.25), [s * 15, 92, 29], [1, 0.62, 0.42], [0, 0, s * 0.5]);
      k.ball(2.2, '#ffffff', [s * 15 - 3, 95, 33.5]);
      k.tube([[s * 10, 122, 0], [s * 16, 138, 0], [s * 22, 150, 0]], 2, shade(color, -0.2), false);
      k.ball(6, mix(color, '#ffffff', 0.35), [s * 22, 152, 0]);
    }
    k.tube([[-5, 74, 33], [0, 72, 34.5], [5, 74, 33]], 1.4, shade(color, -0.5));
  },
  cowboy: (k, color) => {
    // Shoulders and chest in the shirt, the scarf, the head, the hat.
    k.lathe([[0, 15], [34, 15], [37, 30], [34, 52], [22, 66], [12, 70], [0, 71]], '#3e6db0');
    k.lathe([[0, 64], [19, 64], [21, 70], [15, 76], [0, 76]], '#cf3b35');
    k.cone(10, 18, '#cf3b35', [0, 59, 18], [Math.PI + 0.3, 0, 0], [1, 1, 0.5]);
    k.ball(25, '#f0c39a', [0, 98, 0], [1, 1.05, 1]);
    k.ball(4.5, '#e3a983', [0, 96, 25]);
    eyesOn(k, 24, 104, 9, 3.6);
    k.tube([[-12, 89, 21], [-5, 92, 24], [5, 92, 24], [12, 89, 21]], 3.2, '#6b4226');
    // The hat: a brim turned up at the sides, the crown with its dent, the band.
    const brim = k.lathe([[0, 118], [44, 118], [50, 121], [49, 124], [40, 122], [0, 122]], color);
    const pos = (brim.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setY(i, pos.getY(i) + Math.max(0, Math.abs(x) - 26) ** 2 * 0.02);
    }
    brim.geometry.computeVertexNormals();
    k.lathe([[0, 120], [23, 120], [24, 136], [20, 145], [10, 147], [5, 143], [0, 144]], shade(color, -0.06));
    k.lathe([[0, 122], [24.2, 122], [24.5, 128], [0, 128]], '#3b2a1a');
  },
  pizza: (k) => {
    k.cutout([[-40, 0], [0, 128], [40, 0], [0, -6]], 14, '#f6c14b', [0, 26, 0]);
    // The crust along the bottom edge, the toppings on the front.
    k.capsule(11, 74, '#d48a3d', [0, 25, 0], [0, 0, Math.PI / 2]);
    for (const [x, y] of [[-14, 50], [13, 66], [-2, 96], [6, 40]]) {
      k.lathe([[0, 0], [9.5, 0], [10, 1.5], [9, 3], [0, 3]], '#c63a2e', [x, y, 7]).rotation.x = Math.PI / 2;
    }
    k.ball(4.5, '#4f8f3a', [-18, 72, 8], [1.2, 0.8, 0.3], [0, 0, 0.6]);
    k.ball(4.5, '#4f8f3a', [16, 46, 8], [1.2, 0.8, 0.3], [0, 0, -0.4]);
  },
  unicorn: (k) => {
    const white = '#f7f2f4';
    // A short turned neck on the pedestal, then the head cut out like a chess knight's.
    k.lathe([[0, 15], [26, 15], [22, 22], [20, 30], [0, 30]], white);
    k.cutout(
      [
        [-24, 28], [22, 28], [24, 48], [34, 62], [52, 68], [60, 76], [58, 86], [44, 94],
        [30, 106], [22, 118], [14, 110], [2, 112], [-10, 104], [-22, 82], [-26, 56],
      ],
      30,
      white,
    );
    // The horn, the eye and nostril on each side, the mane down the back of the neck.
    k.cone(6.5, 42, '#f0c24a', [28, 130, 0], [0, 0, -0.5]);
    for (const s of [-1, 1]) {
      k.ball(4, INK, [30, 90, s * 13], [1, 1.2, 0.5]);
      k.ball(2.5, shade(white, -0.35), [55, 77, s * 10]);
    }
    // Along the back edge, half out of it, so it shows from the side.
    ([[0, 114], [-11, 104], [-19, 91], [-24, 77], [-27, 63], [-28, 49]] as XY[]).forEach(([x, y], i) =>
      k.capsule(8, 9, ['#f27aa9', '#f6aa55', '#f5d55b', '#7fcf9e', '#79aef0', '#a989ee'][i], [x - 3, y, 0], [0, 0, 0.45 + i * 0.12], [1, 1, 1.6]),
    );
  },
  dino: (k, color) => {
    k.lathe([[0, 15], [26, 15], [22, 22], [20, 28], [0, 28]], color);
    k.cutout(
      [
        [-14, 26], [16, 26], [20, 44], [30, 54], [24, 62], [26, 74], [42, 82], [56, 84], [58, 94],
        [50, 104], [30, 108], [16, 104], [10, 90], [-2, 74], [-20, 60], [-40, 46], [-56, 40], [-34, 32],
      ],
      30,
      color,
    );
    // Plates down the back, the eye and nostril on each side, the belly a lighter shade.
    [[12, 104], [4, 90], [-6, 78], [-18, 68], [-30, 58], [-42, 50]].forEach(([x, y], i) =>
      k.cone(5.5 - i * 0.4, 13 - i, mix(color, '#f2d24a', 0.55), [x, y + 5, 0], [0, 0, 0.55], [1, 1, 0.45]),
    );
    for (const s of [-1, 1]) {
      k.ball(4, INK, [36, 96, s * 13], [1, 1.2, 0.5]);
      k.ball(2, shade(color, -0.4), [54, 92, s * 9]);
    }
  },
  flamingo: (k, color) => {
    const dark = shade(color, -0.18);
    // Thin legs with a knee, the body, folded wings, the neck in an S, the bent beak.
    k.tube([[-7, 15, 2], [-8, 40, 4], [-6, 62, 0]], 2.6, dark);
    k.tube([[7, 15, 2], [9, 38, 8], [6, 62, 0]], 2.6, dark);
    k.ball(32, color, [0, 76, -4], [0.92, 0.72, 1.3]);
    for (const s of [-1, 1]) k.ball(24, shade(color, -0.06), [s * 20, 80, -10], [0.32, 0.55, 1.05], [0.2, 0, 0]);
    k.cone(14, 26, dark, [0, 86, -44], [-1.35, 0, 0], [1, 1, 0.5]);
    k.tube([[0, 88, 24], [0, 106, 34], [0, 126, 26], [0, 140, 10], [0, 152, 8]], 6.5, color);
    k.ball(12, color, [0, 156, 12], [1, 0.95, 1.1]);
    k.cone(5, 14, '#f3d8c6', [0, 152, 27], [1.75, 0, 0]);
    k.cone(4.2, 10, INK, [0, 145, 33], [2.45, 0, 0]);
    for (const s of [-1, 1]) k.ball(2.6, INK, [s * 9.5, 160, 16], [0.6, 1, 1]);
  },
};

/** Profiles cut out (and a few round ones) stand turned three-quarters, so both their shape and
 *  their depth show. */
const TURNED: Record<string, number> = { unicorn: -0.55, dino: -0.55, flamingo: 0.7, pizza: 0.25, beer: -0.35 };

/** A colour mixed towards another (amount 0..1). */
function mix(a: string, b: string, amount: number) {
  return '#' + new THREE.Color(a).lerp(new THREE.Color(b), amount).getHexString();
}

/** The pineapple's skin: a diamond pattern with a little dark notch in each diamond. */
function pineappleSkin(color: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = color;
  g.fillRect(0, 0, 256, 256);
  const step = 32;
  for (let y = 0; y < 256 + step; y += step / 2)
    for (let x = (y / (step / 2)) % 2 ? step / 2 : 0; x < 256 + step; x += step) {
      const grad = g.createRadialGradient(x, y - 4, 1, x, y, step * 0.55);
      grad.addColorStop(0, shade(color, 0.18));
      grad.addColorStop(1, shade(color, -0.22));
      g.fillStyle = grad;
      g.beginPath();
      g.moveTo(x, y - step / 2 + 2);
      g.lineTo(x + step / 2 - 2, y);
      g.lineTo(x, y + step / 2 - 2);
      g.lineTo(x - step / 2 + 2, y);
      g.closePath();
      g.fill();
      g.fillStyle = shade(color, -0.5);
      g.beginPath();
      g.arc(x, y + 3, 2.2, 0, Math.PI * 2);
      g.fill();
    }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0 });
}

let renderer: THREE.WebGLRenderer | null = null;
let room: THREE.Texture | null = null;
let idle = 0;
const done = new Map<string, HTMLCanvasElement | null>();

/**
 * A special pawn's picture, the same size and placing as pawnSprite's (pedestal centre at the bottom
 * middle, PAD above the edge), or null where there's no WebGL (the flat token stays).
 */
export function figureSprite(def: PawnDef, ratio: number): HTMLCanvasElement | null {
  const key = `${def.id}@${ratio}`;
  if (done.has(key)) return done.get(key)!;
  const build = BUILD[def.id];
  if (!build) return null;
  const w = SPRITE_H * 0.8 + PAD * 2;
  const h = SPRITE_H * 1.1 + PAD * 2;
  let out: HTMLCanvasElement | null = null;
  try {
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      // Neutral: keeps the paint's colours (ACES washes them out).
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.setPixelRatio(1);
      const pmrem = new THREE.PMREMGenerator(renderer);
      room = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
    }
    renderer.setSize(Math.round(w * ratio), Math.round(h * ratio), false);
    const scene = new THREE.Scene();
    scene.environment = room;
    scene.environmentIntensity = 0.6;
    const sun = new THREE.DirectionalLight('#fff4e6', 1.9);
    sun.position.set(-140, 240, 160);
    scene.add(sun);
    const k = new Kit();
    pedestal(k, def.color);
    const figure = new Kit();
    build(figure, def.color);
    figure.group.rotation.y = TURNED[def.id] ?? 0;
    k.group.add(figure.group);
    scene.add(k.group);
    const cam = new THREE.OrthographicCamera(-w / 2, w / 2, h - PAD, -PAD, 1, 3000);
    const t = (TILT * Math.PI) / 180;
    cam.position.set(0, Math.sin(t) * 1000, Math.cos(t) * 1000);
    cam.lookAt(0, 0, 0);
    renderer.setClearColor(0x000000, 0);
    renderer.render(scene, cam);
    out = document.createElement('canvas');
    out.width = Math.round(w * ratio);
    out.height = Math.round(h * ratio);
    out.getContext('2d')!.drawImage(renderer.domElement, 0, 0);
    k.dispose();
    figure.dispose();
  } catch {
    out = null;
  }
  done.set(key, out);
  // One WebGL context only while pictures are being made: let it go once they're done.
  window.clearTimeout(idle);
  idle = window.setTimeout(() => {
    room?.dispose();
    room = null;
    renderer?.dispose();
    renderer = null;
  }, 2000);
  return out;
}
