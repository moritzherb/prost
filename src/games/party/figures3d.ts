/*
 * The special pawns (beer, unicorn, flamingo, …) as real little 3D figures: each one built from simple
 * solids (balls, cylinders, cones, a tube, an extruded slice), standing on a round base in its colour,
 * matte, lit from the top left, and drawn once into a picture the board and the setup use as they use
 * the classic pawn's. Loaded on its own (three.js), so the game shows the flat token until it's here.
 *
 * Units are the sprite's own (SPRITE_H tall); y up, z towards you, the base's centre at the origin.
 */

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { shade, SPRITE_H, type PawnDef } from './pawns';

type P = [number, number, number];

/** A seen-a-little-from-above look, as a pawn standing on the board. */
const TILT = 14;
const PAD = 10;

class Kit {
  readonly group = new THREE.Group();
  private stuff: { dispose(): void }[] = [];

  mat(color: string) {
    const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.82, metalness: 0 });
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

  ball(r: number, color: string, at: P, scale: P = [1, 1, 1], rot: P = [0, 0, 0]) {
    return this.add(new THREE.SphereGeometry(r, 32, 24), color, at, rot, scale);
  }

  cyl(rTop: number, rBottom: number, h: number, color: string, at: P, rot: P = [0, 0, 0]) {
    return this.add(new THREE.CylinderGeometry(rTop, rBottom, h, 40), color, at, rot);
  }

  cone(r: number, h: number, color: string, at: P, rot: P = [0, 0, 0], parent?: THREE.Object3D) {
    return this.add(new THREE.ConeGeometry(r, h, 32), color, at, rot, [1, 1, 1], parent);
  }

  ring(radius: number, tube: number, arc: number, color: string, at: P, rot: P = [0, 0, 0]) {
    return this.add(new THREE.TorusGeometry(radius, tube, 16, 48, arc), color, at, rot);
  }

  tube(points: P[], r: number, color: string) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return this.add(new THREE.TubeGeometry(curve, 48, r, 16, false), color);
  }

  box(w: number, h: number, d: number, color: string, at: P, rot: P = [0, 0, 0]) {
    return this.add(new RoundedBoxGeometry(w, h, d, 3, Math.min(w, h, d) * 0.2), color, at, rot);
  }

  dispose() {
    this.stuff.forEach((s) => s.dispose());
  }
}

/** The round base every figure stands on, in its colour (as the classic pawn's). */
function base(k: Kit, color: string) {
  k.cyl(54, 54, 14, shade(color, -0.28), [0, 7, 0]);
  k.cyl(51, 54, 2, shade(color, -0.12), [0, 14.5, 0]);
}

const INK = '#1d1d1b';
const TURNED: Record<string, number> = { unicorn: 0.75, flamingo: 0.85, dino: 0.85 };
const eyes = (k: Kit, x: number, y: number, z: number, r = 4) => {
  k.ball(r, INK, [-x, y, z]);
  k.ball(r, INK, [x, y, z]);
};

const BUILD: Record<string, (k: Kit, color: string) => void> = {
  beer: (k) => {
    k.cyl(34, 31, 80, '#f0a41c', [0, 56, 0]);
    k.cyl(35, 35, 6, '#d98c10', [0, 92, 0]);
    // The foam, heaped up and running over the side.
    k.ball(26, '#fffaf0', [0, 100, 0], [1.35, 0.62, 1.35]);
    for (const p of [[-22, 100, 10], [20, 102, -6], [6, 108, 16], [-10, 110, -12], [16, 106, 18]] as P[]) k.ball(12, '#fffaf0', p);
    k.ball(8, '#fffaf0', [22, 88, 22], [0.8, 1.5, 0.8]);
    // The handle on the right.
    k.ring(20, 7, Math.PI, '#d98c10', [34, 56, 0], [0, 0, -Math.PI / 2]);
  },
  unicorn: (k) => {
    const white = '#fff6fb';
    k.cyl(18, 26, 62, white, [0, 46, -2], [0.22, 0, 0]);
    k.ball(26, white, [0, 92, 8], [1, 1, 1.15]);
    k.ball(18, '#ffe3f1', [0, 84, 34], [0.95, 0.8, 1.1]);
    eyes(k, 14, 98, 26, 4);
    k.cone(8, 20, white, [-13, 120, 0], [0, 0, 0.25]);
    k.cone(8, 20, white, [13, 120, 0], [0, 0, -0.25]);
    k.cone(7, 42, '#ffcf5a', [0, 130, 16], [0.45, 0, 0]);
    // The mane down the back of the head and neck, in the rainbow.
    ['#ff6fa8', '#ffb347', '#ffe066', '#7ed6a5', '#7ab8ff', '#b38cff'].forEach((c, i) => k.ball(12, c, [0, 116 - i * 15, -10 - i * 3]));
  },
  flamingo: (k, color) => {
    k.cyl(3, 3, 52, shade(color, -0.15), [-8, 40, 2]);
    k.cyl(3, 3, 52, shade(color, -0.15), [8, 40, 2]);
    k.ball(34, color, [0, 78, -6], [1, 0.72, 1.3]);
    k.ball(20, shade(color, -0.12), [0, 84, -44], [0.7, 0.5, 0.9]);
    k.ball(22, shade(color, 0.12), [-24, 80, -8], [0.35, 0.6, 1]);
    k.ball(22, shade(color, 0.12), [24, 80, -8], [0.35, 0.6, 1]);
    k.tube([[0, 88, 20], [0, 112, 32], [0, 134, 18], [0, 150, 4]], 6, color);
    k.ball(13, color, [0, 155, 6]);
    k.cone(5.5, 22, INK, [0, 148, 24], [2.1, 0, 0]);
    eyes(k, 8.5, 158, 14, 3);
  },
  frog: (k, color) => {
    k.ball(44, color, [0, 52, 0], [1.1, 0.75, 1]);
    k.ball(32, '#cdefae', [0, 46, 16], [0.95, 0.7, 0.8]);
    for (const x of [-22, 22]) {
      k.ball(16, color, [x, 86, 6]);
      k.ball(11, '#ffffff', [x, 90, 16]);
      k.ball(6, INK, [x, 91, 25]);
    }
    k.ring(18, 2, Math.PI, shade(color, -0.45), [0, 72, 38], [0, 0, Math.PI]);
    k.ball(12, color, [-28, 22, 30], [1.2, 0.5, 1.3]);
    k.ball(12, color, [28, 22, 30], [1.2, 0.5, 1.3]);
  },
  ghost: (k) => {
    const sheet = '#f4f6fa';
    k.cyl(40, 42, 70, sheet, [0, 60, 0]);
    k.ball(40, sheet, [0, 95, 0]);
    // The hem, in waves.
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      k.ball(12, sheet, [Math.sin(a) * 32, 26, Math.cos(a) * 32]);
    }
    k.ball(8, INK, [-14, 104, 34], [0.8, 1.3, 0.6]);
    k.ball(8, INK, [14, 104, 34], [0.8, 1.3, 0.6]);
    k.ball(7, '#3a3a40', [0, 84, 38], [1, 1.3, 0.5]);
    k.ball(12, sheet, [-42, 70, 4], [0.8, 1.3, 0.8]);
    k.ball(12, sheet, [42, 70, 4], [0.8, 1.3, 0.8]);
  },
  dino: (k, color) => {
    k.cyl(10, 12, 30, color, [-14, 29, 0]);
    k.cyl(10, 12, 30, color, [14, 29, 0]);
    k.cone(17, 64, color, [0, 50, -50], [-1.95, 0, 0]);
    k.ball(34, color, [0, 66, -4], [0.9, 0.95, 1.25]);
    k.ball(24, '#c8ecb0', [0, 62, 18], [0.8, 1, 0.6]);
    k.cyl(15, 20, 40, color, [0, 96, 8], [0.35, 0, 0]);
    k.ball(22, color, [0, 118, 16], [1, 0.95, 1.2]);
    k.ball(16, color, [0, 112, 36], [1, 0.85, 1]);
    eyes(k, 13, 126, 26, 4);
    for (const [y, z] of [[140, 4], [116, -4], [100, -20], [86, -36], [70, -50]]) k.cone(6, 15, shade(color, -0.3), [0, y, z], [-0.5, 0, 0]);
    k.ball(7, color, [-26, 76, 20]);
    k.ball(7, color, [26, 76, 20]);
  },
  cowboy: (k, color) => {
    k.cyl(26, 38, 60, '#3d6fb6', [0, 44, 0]);
    k.cyl(22, 27, 12, '#d23b3b', [0, 78, 0]);
    k.ball(26, '#f2c79c', [0, 104, 0]);
    eyes(k, 9, 108, 23, 3.5);
    k.ball(6, '#6b4226', [-6, 96, 24], [1.5, 0.6, 0.6]);
    k.ball(6, '#6b4226', [6, 96, 24], [1.5, 0.6, 0.6]);
    // The hat: a wide brim turned up a little at the sides, the crown, its band.
    k.cyl(48, 48, 4, color, [0, 124, 0]);
    k.ring(46, 4, Math.PI * 2, color, [0, 126, 0], [Math.PI / 2, 0, 0]);
    k.cyl(20, 25, 28, shade(color, -0.08), [0, 140, 0]);
    k.cyl(25.5, 25.5, 5, '#3b2a1a', [0, 129, 0]);
  },
  pineapple: (k, color) => {
    const body = k.ball(40, color, [0, 62, 0], [1, 1.25, 1]);
    body.material = pineappleSkin(color);
    // The crown of leaves, fanning out.
    for (let i = 0; i < 7; i++) {
      const g = new THREE.Group();
      g.position.set(0, 112, 0);
      g.rotation.y = (i / 7) * Math.PI * 2;
      k.group.add(g);
      k.cone(7, 46, '#3fae4f', [0, 18, 8], [0.45, 0, 0], g);
    }
    k.cone(7, 56, '#2f9a40', [0, 136, 0]);
  },
  pizza: (k) => {
    const s = new THREE.Shape();
    s.moveTo(-42, 0);
    s.lineTo(42, 0);
    s.lineTo(0, 132);
    s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: 12, bevelEnabled: true, bevelSize: 2, bevelThickness: 2, bevelSegments: 2 });
    k.add(geo, '#ffc94a', [0, 22, -6]);
    // The crust along the bottom, the pepperoni on the front.
    k.cyl(10, 10, 92, '#d9893b', [0, 24, 0], [0, 0, Math.PI / 2]);
    for (const [x, y] of [[-14, 48], [14, 64], [-3, 94], [4, 38]]) k.cyl(10, 10, 3, '#cf3a2f', [x, y, 9], [Math.PI / 2, 0, 0]);
    k.ball(4, '#4f9a3c', [-20, 70, 9], [1, 1, 0.4]);
    k.ball(4, '#4f9a3c', [16, 44, 9], [1, 1, 0.4]);
  },
  alien: (k, color) => {
    k.cyl(18, 24, 42, shade(color, -0.12), [0, 35, 0]);
    k.ball(36, color, [0, 92, 0], [1.15, 1, 1]);
    k.ball(13, INK, [-16, 92, 28], [1, 0.6, 0.5], [0, 0, 0.5]);
    k.ball(13, INK, [16, 92, 28], [1, 0.6, 0.5], [0, 0, -0.5]);
    k.ball(3, shade(color, -0.5), [0, 72, 34]);
    k.cyl(2, 2, 30, shade(color, -0.2), [-12, 136, 0], [0, 0, 0.3]);
    k.cyl(2, 2, 30, shade(color, -0.2), [12, 136, 0], [0, 0, -0.3]);
    k.ball(6, '#d7ff7a', [-17, 151, 0]);
    k.ball(6, '#d7ff7a', [17, 151, 0]);
  },
};

/** The pineapple's skin: its diamond pattern, painted once. */
function pineappleSkin(color: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  g.fillStyle = color;
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = shade(color, -0.35);
  g.lineWidth = 3;
  for (let i = -128; i < 256; i += 21) {
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i + 128, 128);
    g.moveTo(i + 128, 0);
    g.lineTo(i, 128);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, metalness: 0 });
}

let renderer: THREE.WebGLRenderer | null = null;
let idle = 0;
const done = new Map<string, HTMLCanvasElement | null>();

/**
 * A special pawn's picture, the same size and placing as pawnSprite's (base centre at the bottom
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
      renderer.setPixelRatio(1);
    }
    renderer.setSize(Math.round(w * ratio), Math.round(h * ratio), false);
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight('#ffffff', '#6a5a48', 1.5));
    const sun = new THREE.DirectionalLight('#ffffff', 2.1);
    sun.position.set(-120, 220, 180);
    scene.add(sun);
    const k = new Kit();
    base(k, def.color);
    build(k, def.color);
    // Those seen best from the side (a snout, a beak, a horn) stand turned three-quarters.
    k.group.rotation.y = TURNED[def.id] ?? 0;
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
  } catch {
    out = null;
  }
  done.set(key, out);
  // One WebGL context only while pictures are being made: let it go once they're done.
  window.clearTimeout(idle);
  idle = window.setTimeout(() => {
    renderer?.dispose();
    renderer = null;
  }, 2000);
  return out;
}
