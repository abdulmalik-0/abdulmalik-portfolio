// The hero's 3D room: a small floating IT room seen in perspective, with one corner per track.
//
//   Infrastructure  racks with smoked-glass doors along the back wall
//   Network         a wall cabinet with a switch, and a router with antennas
//   Identity        an access-controlled door with a card reader
//   Operations      an asset shelf of laptops and tagged boxes
//   Automation      a desk whose monitor runs an n8n workflow
//   Home lab        a short rack on wheels: a switch, two Proxmox mini PCs, a NAS and a UPS
//
// Each corner is lit in its track colour. Six hotspot labels (ordinary DOM elements) are kept on
// their objects every frame; highlighting a label brightens its corner. The room builds itself on
// load, turns a little with the pointer, and turns and moves in as the hero scrolls away.
//
// The furniture (desk, chair, shelves, boxes, door, plants) comes from Kenney's Furniture Kit
// (CC0, kenney.nl, in public/models), recoloured for the room. The racks, network gear, cameras,
// walls and floor are built here, since the kit has none.
//
// The canvas is transparent, so the page background shows around the room. The scene watches its
// frame time and steps quality down on slow devices.
import {
  AdditiveBlending,
  Box3,
  BoxGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Raycaster,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TRACK_COLORS } from '../tracks.js';

// Quality steps, best first. The scene starts at 0 (or at LITE when the browser draws WebGL on
// the CPU) and moves down while frames stay slow. `lights` are the coloured corner lights.
const QUALITY = [
  { pixelRatio: 1.75, shadows: true, lights: true },
  { pixelRatio: 1.25, shadows: true, lights: true },
  { pixelRatio: 1, shadows: false, lights: false },
  { pixelRatio: 0.75, shadows: false, lights: false }
];
const LITE = 2;
const SLOW_FRAME_MS = 26; // slower than about 38 frames a second
const SOFTWARE_RENDERER = /basic render|swiftshader|llvmpipe|software/i;

const HALF = 3.5; // the room spans -3.5…3.5 on x and z
const T = 0.18; // wall thickness
const WALL_H = 2.8;
const INNER = -HALF + T; // inner face of the back and left walls

// Camera: a three-quarter view from the front right
const FOV = 30;
const TARGET = new Vector3(0, 0.8, 0.2);
const AZIMUTH = 0.72; // radians from +z toward +x
const ELEVATION = 0.5;
// Where the whole room must fit in the box: centre and size as fractions of the box
const OVERVIEW_FRAME = { cx: 0.5, cy: 0.5, w: 0.95, h: 0.92 };
// Close-up camera angles per track, chosen so nothing stands between the camera and the corner
const FOCUS_ANGLES = [
  { az: 0.32, el: 0.2 }, // racks, from the front
  { az: -0.08, el: 0.16 }, // network wall, from the left of the plant
  { az: 1.15, el: 0.2 }, // door, from across the room
  { az: 1.35, el: 0.34 }, // shelves, over the open floor
  { az: 0.15, el: 0.48 }, // desk, from in front and above the chair
  { az: 0.42, el: 0.22 } // home lab, from beyond the open side
];
// How quickly the camera closes on where it should be (per second)
const CAMERA_RATE = 3.2;

export const ASSEMBLED_AT = 2.3;

/* ---------- Furniture models ---------- */

const MODEL_NAMES = [
  'desk',
  'chairDesk',
  'computerKeyboard',
  'computerMouse',
  'laptop',
  'lampSquareTable',
  'plantSmall1',
  'plantSmall2',
  'plantSmall3',
  'pottedPlant',
  'bookcaseOpen',
  'cardboardBoxClosed',
  'cardboardBoxOpen',
  'books',
  'doorway',
  'rugRounded',
  'rugDoormat',
  'coatRackStanding',
  'trashcan',
  'sideTableDrawers',
  'kitchenCoffeeMachine'
];

// The kit is modelled at about half a metre to the unit.
const KIT = 1.95;

// The kit's materials by name, recoloured for the room: [colour, roughness, metalness]
const KIT_MATERIALS = {
  wood: ['#a47f5a', 0.72, 0],
  woodDark: ['#6e5137', 0.72, 0],
  metal: ['#cdd5e6', 0.4, 0.3],
  metalMedium: ['#5d6889', 0.45, 0.35],
  metalDark: ['#1d2439', 0.45, 0.35],
  carpet: ['#323c7e', 0.95, 0],
  carpetDarker: ['#20264f', 0.95, 0],
  carpetWhite: ['#e3e7f1', 0.9, 0],
  plant: ['#3aa66f', 0.8, 0],
  lamp: ['#ffe6bf', 0.6, 0]
};

function kitMaterial(name) {
  const [color, roughness, metalness] = KIT_MATERIALS[name] || ['#d9dfec', 0.6, 0.1];
  const material = new MeshStandardMaterial({ name, color, roughness, metalness });
  // The lamp shade glows warm.
  if (name === 'lamp') {
    material.emissive.set('#ffc580');
    material.emissiveIntensity = 1.1;
  }
  return material;
}

/**
 * Loads the furniture models (about 200 KB). The room is built once they are in, so it appears whole.
 * Resolves to { name: model }; rejects if a model cannot be loaded.
 */
export async function loadRoomModels(base = `${import.meta.env.BASE_URL}models/`) {
  const loader = new GLTFLoader();
  const materials = {};
  const entries = await Promise.all(
    MODEL_NAMES.map(async name => {
      const { scene } = await loader.loadAsync(`${base}${name}.glb`);
      scene.traverse(o => {
        if (!o.isMesh) return;
        const source = o.material;
        // One shared material per kit colour across every model.
        o.material = materials[source.name] || (materials[source.name] = kitMaterial(source.name));
        source.dispose();
        o.castShadow = true;
        o.receiveShadow = true;
      });
      return [name, scene];
    })
  );
  return Object.fromEntries(entries);
}

/** True when the browser draws WebGL on the CPU (no GPU, a blocked driver, a remote session). */
function drawsOnCpu() {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return false;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return SOFTWARE_RENDERER.test(name);
  } catch {
    return false;
  }
}

const clamp01 = v => Math.max(0, Math.min(1, v));
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = t => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);

/** A small deterministic random source, so the room looks the same on every visit. */
function seeded(start) {
  let s = start;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d'), width, height);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function radialTexture(stops) {
  return canvasTexture(128, 128, g => {
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach(([at, color]) => r.addColorStop(at, color));
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
  });
}

/* ---------- Textures ---------- */

function rackUnits(rnd) {
  const units = [];
  let y = 22;
  while (y < 500) {
    const pick = rnd();
    const type = pick < 0.16 ? 0 : pick < 0.6 ? 1 : pick < 0.84 ? 2 : 3;
    const h = type === 2 ? 34 : 17;
    if (y + h > 518) break;
    const leds = [];
    const count = type === 0 ? 0 : 2 + Math.floor(rnd() * 2);
    for (let l = 0; l < count; l++) {
      const c = rnd();
      leds.push(c < 0.6 ? '#35D08A' : c < 0.88 ? '#4C8DFF' : '#FFCB2E');
    }
    units.push({ y, h, type, leds, ports: Array.from({ length: 12 }, () => rnd() < 0.7) });
    y += h;
  }
  return units;
}

function drawRack(g, w, h, units, ledsOnly) {
  g.fillStyle = ledsOnly ? '#000000' : '#0a0f1e';
  g.fillRect(0, 0, w, h);
  for (const u of units) {
    const x = 14;
    const uw = w - 28;
    const uh = u.h - 2;
    if (!ledsOnly) {
      g.fillStyle = u.type === 0 ? '#101731' : '#1c2748';
      g.fillRect(x, u.y, uw, uh);
      g.fillStyle = 'rgba(255, 255, 255, 0.07)';
      if (u.type === 3) for (let p = 0; p < 12; p++) g.fillRect(x + 44 + p * 10, u.y + 4, 7, 7);
      else if (u.type) for (let v = 0; v < 11; v++) g.fillRect(x + 54 + v * 9, u.y + 4, 4, uh - 8);
      g.fillStyle = 'rgba(255, 255, 255, 0.05)';
      g.fillRect(x, u.y, uw, 1);
    }
    if (!u.type) continue;
    u.leds.forEach((color, l) => {
      g.fillStyle = color;
      g.beginPath();
      g.arc(x + 12 + l * 9, u.y + uh / 2, 2.8, 0, Math.PI * 2);
      g.fill();
    });
    if (u.type === 3) {
      u.ports.forEach((lit, p) => {
        if (!lit) return;
        g.fillStyle = '#35D08A';
        g.fillRect(x + 45 + p * 10, u.y + 2, 5, 2);
      });
    }
  }
}

function switchFace(rnd, ledsOnly) {
  const lit = Array.from({ length: 48 }, () => rnd());
  return canvasTexture(512, 192, (g, w, h) => {
    g.fillStyle = ledsOnly ? '#000000' : '#0d1428';
    g.fillRect(0, 0, w, h);
    for (let row = 0; row < 3; row++) {
      const y = 22 + row * 56;
      if (!ledsOnly) {
        g.fillStyle = '#1b2647';
        g.fillRect(16, y, w - 32, 44);
      }
      for (let p = 0; p < 16; p++) {
        const x = 30 + p * 29;
        if (!ledsOnly) {
          g.fillStyle = '#05080f';
          g.fillRect(x, y + 12, 22, 20);
        }
        const v = lit[row * 16 + p];
        if (v < 0.75) {
          g.fillStyle = v < 0.5 ? '#35D08A' : '#FFCB2E';
          g.fillRect(x + 2, y + 5, 7, 4);
        }
      }
    }
  });
}

/** The home lab's front: a switch, two Proxmox mini PCs, a four-bay NAS and a UPS with its display. */
function drawHomelab(g, w, h, ledsOnly) {
  g.fillStyle = ledsOnly ? '#000000' : '#0b1020';
  g.fillRect(0, 0, w, h);
  const led = (x, y, color, r = 3) => {
    g.fillStyle = color;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  };
  const body = (x, y, bw, bh, color) => {
    if (ledsOnly) return;
    g.fillStyle = color;
    g.fillRect(x, y, bw, bh);
    g.fillStyle = 'rgba(255, 255, 255, 0.07)';
    g.fillRect(x, y, bw, 2);
  };
  // Switch: eight ports with their link lights
  body(10, 10, w - 20, 34, '#1c2748');
  for (let p = 0; p < 8; p++) {
    const x = 24 + p * 25;
    if (!ledsOnly) {
      g.fillStyle = '#05080f';
      g.fillRect(x, 22, 17, 15);
    }
    if (p !== 5) {
      g.fillStyle = p % 3 === 2 ? '#FFCB2E' : '#35D08A';
      g.fillRect(x + 2, 15, 6, 3);
    }
  }
  // Two mini PCs, the Proxmox nodes
  [10, 124].forEach((x, k) => {
    body(x, 52, 106, 66, '#222d52');
    if (!ledsOnly) {
      g.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let v = 0; v < 6; v++) g.fillRect(x + 44 + v * 9, 62, 4, 46);
      g.fillStyle = '#8e9ab8';
      g.font = '600 14px sans-serif';
      g.fillText(`pve${k + 1}`, x + 8, 108);
    }
    led(x + 16, 68, '#4C8DFF', 4);
  });
  // NAS: four drive bays, each with a status and an activity light
  body(10, 126, w - 20, 136, '#161f3d');
  for (let b = 0; b < 4; b++) {
    const x = 18 + b * 52;
    if (!ledsOnly) {
      g.fillStyle = '#0c1226';
      g.fillRect(x, 136, 44, 116);
      g.fillStyle = 'rgba(255, 255, 255, 0.1)';
      g.fillRect(x + 6, 232, 32, 4);
    }
    led(x + 12, 148, '#35D08A');
    led(x + 26, 148, b === 2 ? TRACK_COLORS[5] : '#4C8DFF');
  }
  // UPS, its display reading full charge
  body(10, 270, w - 20, 120, '#121a33');
  g.fillStyle = ledsOnly ? '#0d3a35' : '#0b2b2a';
  g.fillRect(70, 288, 100, 44);
  g.fillStyle = '#5ef2c8';
  g.font = '700 24px sans-serif';
  g.fillText('100%', 88, 320);
  led(54, 302, '#35D08A', 4);
  if (!ledsOnly) {
    g.fillStyle = '#26315a';
    [92, 120, 148].forEach(x => {
      g.beginPath();
      g.arc(x, 362, 8, 0, Math.PI * 2);
      g.fill();
    });
  }
}

function floorTexture() {
  return canvasTexture(1024, 1024, (g, w) => {
    g.fillStyle = '#1b2345';
    g.fillRect(0, 0, w, w);
    const n = 10;
    const s = w / n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const shade = 34 + ((i * 7 + j * 3) % 5);
        g.fillStyle = `rgb(${shade - 6}, ${shade}, ${shade + 34})`;
        g.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
        // Perforated tiles in front of the racks (top-left of the texture = back-left of the room)
        if (j < 3 && i < 5 && (i + j) % 2 === 0) {
          g.fillStyle = 'rgba(150, 175, 240, 0.22)';
          for (let a = 0; a < 7; a++) for (let b = 0; b < 7; b++) g.fillRect(i * s + 14 + a * 10, j * s + 14 + b * 10, 4, 4);
        }
      }
    }
  });
}

function whiteboardTexture() {
  return canvasTexture(512, 320, (g, w, h) => {
    g.fillStyle = '#e8edf7';
    g.fillRect(0, 0, w, h);
    g.lineWidth = 5;
    g.lineCap = 'round';
    const boxes = [[40, 60, '#2f6be0'], [210, 30, '#2f6be0'], [210, 190, '#2f6be0'], [380, 110, '#d8a200']];
    g.strokeStyle = '#6a7390';
    [[0, 1], [0, 2], [1, 3], [2, 3]].forEach(([a, b]) => {
      g.beginPath();
      g.moveTo(boxes[a][0] + 50, boxes[a][1] + 30);
      g.lineTo(boxes[b][0] + 50, boxes[b][1] + 30);
      g.stroke();
    });
    boxes.forEach(([x, y, color]) => {
      g.fillStyle = '#e8edf7';
      g.fillRect(x, y, 100, 60);
      g.strokeStyle = color;
      g.strokeRect(x, y, 100, 60);
    });
  });
}

function assetTagTexture() {
  return canvasTexture(128, 64, (g, w, h) => {
    g.fillStyle = '#f4f6fb';
    g.fillRect(0, 0, w, h);
    g.fillStyle = TRACK_COLORS[3];
    g.fillRect(0, 0, w, 12);
    g.fillStyle = '#1b2140';
    let x = 10;
    while (x < w - 10) {
      const bar = 1 + Math.round(((x * 37) % 7) / 3);
      g.fillRect(x, 20, bar, 30);
      x += bar + 2;
    }
  });
}

/** The n8n screen: a workflow of nodes joined left to right. */
function workflowScreen() {
  return canvasTexture(640, 280, (g, w, h) => {
    g.fillStyle = '#0a1226';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#121d3d';
    g.fillRect(0, 0, w, 32);
    g.fillStyle = TRACK_COLORS[4];
    g.fillRect(14, 12, 9, 9);
    g.fillStyle = 'rgba(236, 241, 255, 0.85)';
    g.font = '600 16px sans-serif';
    g.fillText('Workflow', 32, 22);
    const nodes = [
      [40, 120, '#4C8DFF'],
      [175, 70, '#B18CFF'],
      [175, 175, '#B18CFF'],
      [325, 120, '#FF8A3D'],
      [470, 120, '#35D08A']
    ];
    g.strokeStyle = 'rgba(177, 140, 255, 0.75)';
    g.lineWidth = 3;
    [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]].forEach(([a, b]) => {
      const [x1, y1] = nodes[a];
      const [x2, y2] = nodes[b];
      g.beginPath();
      g.moveTo(x1 + 80, y1 + 26);
      g.bezierCurveTo(x1 + 115, y1 + 26, x2 - 35, y2 + 26, x2, y2 + 26);
      g.stroke();
    });
    nodes.forEach(([x, y, color]) => {
      g.fillStyle = '#17234b';
      g.fillRect(x, y, 80, 52);
      g.fillStyle = color;
      g.fillRect(x, y, 7, 52);
      g.fillStyle = 'rgba(236, 241, 255, 0.55)';
      g.fillRect(x + 18, y + 15, 44, 7);
      g.fillRect(x + 18, y + 29, 28, 7);
    });
  });
}

function terminalScreen() {
  return canvasTexture(320, 200, (g, w, h) => {
    g.fillStyle = '#060a16';
    g.fillRect(0, 0, w, h);
    const lines = [[0.55, '#35D08A'], [0.8, '#c3cce0'], [0.4, '#c3cce0'], [0.65, '#35D08A'], [0.7, '#c3cce0'], [0.3, '#FFCB2E'], [0.5, '#c3cce0']];
    lines.forEach(([len, color], i) => {
      g.fillStyle = color;
      g.globalAlpha = 0.8;
      g.fillRect(16, 18 + i * 24, (w - 32) * len, 9);
    });
    g.globalAlpha = 1;
  });
}

/* ---------- Scene ---------- */

export class ServerRoomScene {
  /**
   * @param canvas   the canvas to draw on
   * @param box      the element whose size the canvas fills
   * @param hotspots one element per track to keep positioned over their objects
   * @param models   the furniture, from loadRoomModels()
   * Throws if WebGL is not available; the hero then shows a still picture instead.
   */
  constructor(canvas, box, hotspots, models) {
    this.box = box;
    this.hotspots = hotspots;
    this.models = models;
    this.software = drawsOnCpu();
    this.renderer = new WebGLRenderer({ canvas, antialias: !this.software, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.scene = new Scene();
    const pmrem = new PMREMGenerator(this.renderer);
    this.envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environmentIntensity = 0.32;

    this.camera = new PerspectiveCamera(FOV, 1, 0.5, 200);
    this.distance = 20;

    this.scene.add(new HemisphereLight('#b4c4ff', '#0a0f1f', 1.3));
    const sun = new DirectionalLight('#fff1e0', 2.5);
    sun.position.set(-5, 11, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 });
    sun.shadow.bias = -0.0003;
    sun.shadow.normalBias = 0.025;
    this.scene.add(sun);
    const rim = new DirectionalLight('#7d98ff', 0.9);
    rim.position.set(7, 5, -6);
    this.scene.add(rim);

    this.room = new Group();
    this.scene.add(this.room);
    this.parts = [];
    this.cornerLights = [];
    this.build();

    // Driven from outside: `clock` is the intro's time (GSAP tweens it), `pointer` is -1…1
    // across the hero, `scroll` is 0…1 as the hero leaves the screen.
    this.clock = 0;
    this.pointer = { x: 0, y: 0 };
    this.scroll = 0;
    this.highlight = -1;
    this.still = false; // reduced motion: no drift, no blinking, no scroll turn
    this.visible = true;
    // Where the camera is now; each frame it moves part of the way to where it should be.
    // `ox`/`oy` shift the picture so the looked-at point sits off centre (for a close-up beside a panel).
    this.cam = { target: TARGET.clone(), az: AZIMUTH, el: ELEVATION, dist: null, ox: 0, oy: 0 };
    this.prevSeconds = null;
    // Close-ups: `focused` is the open track (-1 for the whole room), `frame` the part of the box
    // the close-up must fit in (the rest is covered by the details panel).
    this.focused = -1;
    this.focusView = null;
    this.frame = { cx: 0.5, cy: 0.5, w: 0.9, h: 0.86 };
    this.raycaster = new Raycaster();
    this.ndc = new Vector2();
    this.assembledApplied = false;
    this.W = 1;
    this.H = 1;

    this.quality = this.software ? LITE : 0;
    this.frameMs = 16;
    this.slowSince = null;
    this.watchFrom = null;
    this.lastSeconds = null;
    this.projected = new Vector3();
  }

  build() {
    const rnd = seeded(7);
    const room = this.room;
    const parts = this.parts;
    const lit = mesh => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };
    // A rounded box whose base sits at y = 0
    const rbox = (w, h, d, r, material) => {
      const geometry = new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
      geometry.translate(0, h / 2, 0);
      return lit(new Mesh(geometry, material));
    };
    const box = (w, h, d, material) => {
      const geometry = new BoxGeometry(w, h, d);
      geometry.translate(0, h / 2, 0);
      return lit(new Mesh(geometry, material));
    };
    const at = (mesh, x, y, z) => {
      mesh.position.set(x, y, z);
      return mesh;
    };
    const std = (color, roughness = 0.6, metalness = 0.1, extra = {}) => new MeshStandardMaterial({ color, roughness, metalness, ...extra });
    const glowMaterial = color => new MeshBasicMaterial({ color: new Color(color).multiplyScalar(1.6) });

    // A copy of a kit model, moved so its origin is at the middle of its base, then scaled.
    // `scale` is a number or [x, y, z]. The model's own root node is kept as userData.node.
    const kit = (name, scale = KIT) => {
      const inner = this.models[name].clone();
      const bounds = new Box3().setFromObject(inner);
      inner.position.set(-(bounds.min.x + bounds.max.x) / 2, -bounds.min.y, -(bounds.min.z + bounds.max.z) / 2);
      const piece = new Group();
      piece.add(inner);
      if (Array.isArray(scale)) piece.scale.set(...scale);
      else piece.scale.setScalar(scale);
      piece.userData.node = inner.children[0];
      return piece;
    };
    // Gives one kit colour inside `object` a different colour, for this object only.
    const repaint = (object, from, color) => {
      const material = kitMaterial(from);
      material.color.set(color);
      material.name = `${from} as ${color}`;
      object.traverse(o => {
        if (o.isMesh && o.material.name === from) o.material = material;
      });
      return object;
    };
    // The bounds of a piece in its parent's space (call before adding it to a parent).
    const boundsOf = piece => new Box3().setFromObject(piece);

    const contact = radialTexture([[0, 'rgba(0, 0, 0, 0.75)'], [0.55, 'rgba(0, 0, 0, 0.35)'], [1, 'rgba(0, 0, 0, 0)']]);
    this.softTexture = radialTexture([[0, 'rgba(255, 255, 255, 1)'], [0.35, 'rgba(255, 255, 255, 0.4)'], [1, 'rgba(255, 255, 255, 0)']]);
    // A soft dark patch on the floor under furniture, for grounding without costly occlusion passes
    // (Floor decals are marked `flat`, so close-ups frame the furniture and not the glow around it.)
    const shadowPatch = (w, d, x, z, opacity = 0.55) => {
      const patch = new Mesh(new PlaneGeometry(w, d), new MeshBasicMaterial({ map: contact, transparent: true, depthWrite: false, opacity }));
      patch.rotation.x = -Math.PI / 2;
      patch.position.set(x, 0.008, z);
      patch.userData.flat = true;
      return patch;
    };
    // A pool of coloured light on the floor that marks a track's corner
    const pool = (color, w, d, x, z, opacity) => {
      const p = new Mesh(new PlaneGeometry(w, d), new MeshBasicMaterial({ map: this.softTexture, color, transparent: true, depthWrite: false, blending: AdditiveBlending, opacity }));
      p.rotation.x = -Math.PI / 2;
      p.position.set(x, 0.012, z);
      p.userData.baseOpacity = opacity;
      p.userData.flat = true;
      return p;
    };
    const cornerLight = (track, x, y, z, intensity, distance) => {
      const light = new PointLight(TRACK_COLORS[track], 0, distance, 2);
      light.position.set(x, y, z);
      light.userData = { track, base: intensity };
      room.add(light);
      this.cornerLights.push(light);
      return light;
    };

    /* Base and floor */
    const under = new Mesh(
      new PlaneGeometry(11.5, 11.5),
      new MeshBasicMaterial({ map: this.softTexture, color: '#2c55c8', transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0 })
    );
    under.rotation.x = -Math.PI / 2;
    under.position.y = -0.85;
    room.add(under);
    const base = new Group();
    base.add(at(rbox(HALF * 2, 0.5, HALF * 2, 0.16, std('#141b36', 0.75, 0.2)), 0, -0.5, 0));
    // A thin lit edge along the open front of the platform
    const edge = glowMaterial('#3c6cff');
    edge.color.multiplyScalar(0.55);
    base.add(at(new Mesh(new BoxGeometry(HALF * 2 - 0.3, 0.025, 0.025), edge), 0, -0.09, HALF + 0.005));
    const sideEdge = new Mesh(new BoxGeometry(0.025, 0.025, HALF * 2 - 0.3), edge);
    base.add(at(sideEdge, HALF + 0.005, -0.09, 0));
    const floor = new Mesh(new PlaneGeometry(HALF * 2 - T, HALF * 2 - T), std('#ffffff', 0.55, 0.15, { map: floorTexture() }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(T / 2, 0.002, T / 2);
    floor.receiveShadow = true;
    base.add(floor);
    room.add(base);
    parts.push([base, 0, 'pop'], [under, 0, 'fade']);

    /* Walls, with a trim on top, a skirting board and an LED strip along the inner faces */
    const walls = new Group();
    const wallMaterial = std('#19213f', 0.88, 0.05);
    const trim = std('#2a3561', 0.5, 0.3);
    walls.add(at(box(HALF * 2, WALL_H, T, wallMaterial), 0, 0, -HALF + T / 2));
    walls.add(at(box(T, WALL_H, HALF * 2 - T, wallMaterial), -HALF + T / 2, 0, T / 2));
    walls.add(at(box(HALF * 2 + 0.02, 0.05, T + 0.04, trim), 0, WALL_H, -HALF + T / 2));
    walls.add(at(box(T + 0.04, 0.05, HALF * 2 - T, trim), -HALF + T / 2, WALL_H, T / 2));
    walls.add(at(box(HALF * 2 - T, 0.09, 0.03, trim), T / 2, 0, INNER + 0.015));
    walls.add(at(box(0.03, 0.09, HALF * 2 - T, trim), INNER + 0.015, 0, T / 2));
    const strip = glowMaterial('#dfe8ff');
    walls.add(at(new Mesh(new BoxGeometry(HALF * 2 - 0.6, 0.025, 0.02), strip), 0.3, WALL_H - 0.16, INNER + 0.012));
    walls.add(at(new Mesh(new BoxGeometry(0.02, 0.025, HALF * 2 - 0.6), strip), INNER + 0.012, WALL_H - 0.16, 0.3));
    room.add(walls);
    parts.push([walls, 0.15, 'rise']);

    /* 0 Infrastructure: four racks with smoked-glass doors, a cable tray and a blue glow */
    const racks = new Group();
    const rackBody = std('#111830', 0.42, 0.7);
    const glass = std('#0b1022', 0.08, 0.3, { transparent: true, opacity: 0.38 });
    const chrome = std('#c9d3ee', 0.25, 0.9);
    this.rackMaterials = [];
    [-2.85, -2.0, -1.15, -0.3].forEach(x => {
      const rack = new Group();
      rack.add(rbox(0.8, 2.2, 1.05, 0.035, rackBody));
      const units = rackUnits(rnd);
      const faceMaterial = new MeshStandardMaterial({
        map: canvasTexture(200, 540, (g, w, h) => drawRack(g, w, h, units, false)),
        emissiveMap: canvasTexture(200, 540, (g, w, h) => drawRack(g, w, h, units, true)),
        emissive: '#ffffff',
        emissiveIntensity: 2.6,
        roughness: 0.5,
        metalness: 0.4
      });
      this.rackMaterials.push(faceMaterial);
      rack.add(at(new Mesh(new PlaneGeometry(0.68, 2.0), faceMaterial), 0, 1.1, 0.528));
      rack.add(at(new Mesh(new PlaneGeometry(0.74, 2.08), glass), 0, 1.1, 0.534));
      rack.add(at(box(0.022, 0.32, 0.03, chrome), 0.32, 0.95, 0.55));
      rack.add(at(box(0.7, 0.02, 0.9, std('#0a0f1e', 0.6, 0.5)), 0, 2.2, 0));
      rack.position.set(x, 0, INNER + 0.56);
      racks.add(rack);
    });
    const tray = new Group();
    tray.add(at(box(3.45, 0.03, 0.36, trim), 0, 0, 0));
    tray.add(at(box(3.45, 0.1, 0.02, trim), 0, 0, 0.17));
    tray.position.set(-1.575, 2.42, INNER + 0.3);
    racks.add(tray);
    racks.add(shadowPatch(3.6, 1.7, -1.575, INNER + 0.56, 0.6));
    const rackPool = pool(TRACK_COLORS[0], 4.0, 2.4, -1.575, INNER + 1.5, 0.32);
    racks.add(rackPool);
    room.add(racks);
    cornerLight(0, -1.575, 1.2, INNER + 1.6, 5, 4);
    parts.push([racks, 0.4, 'rise']);

    /* Whiteboard between the racks and the network cabinet */
    const board = new Group();
    board.add(at(rbox(0.9, 0.6, 0.04, 0.02, std('#c9d1e6', 0.4, 0.2)), 0, 0, 0));
    board.add(at(new Mesh(new PlaneGeometry(0.84, 0.54), new MeshBasicMaterial({ map: whiteboardTexture(), color: new Color('#ffffff').multiplyScalar(0.8) })), 0, 0.3, 0.021));
    board.position.set(0.82, 1.4, INNER + 0.03);
    room.add(board);
    parts.push([board, 0.9, 'drop']);

    /* Under the whiteboard: a low cabinet with a coffee machine */
    const coffee = new Group();
    coffee.add(repaint(kit('sideTableDrawers'), 'wood', '#6d4f3a'));
    coffee.add(at(kit('kitchenCoffeeMachine', KIT * 0.8), -0.22, 0.384 * KIT, 0));
    coffee.add(at(kit('plantSmall3'), 0.3, 0.384 * KIT, 0.02));
    coffee.add(shadowPatch(1.3, 0.7, 0, 0, 0.45));
    coffee.position.set(0.85, 0, INNER + 0.23);
    room.add(coffee);
    parts.push([coffee, 1.15, 'drop']);

    /* 1 Network: wall cabinet with a switch, a router on a shelf, an access point */
    const network = new Group();
    const cabinet = new Group();
    cabinet.add(rbox(1.0, 0.72, 0.42, 0.03, rackBody));
    cabinet.add(at(new Mesh(new PlaneGeometry(0.88, 0.33), new MeshStandardMaterial({ map: switchFace(rnd, false), emissiveMap: switchFace(rnd, true), emissive: '#ffffff', emissiveIntensity: 2.2, roughness: 0.5, metalness: 0.4 })), 0, 0.42, 0.212));
    cabinet.add(at(new Mesh(new PlaneGeometry(0.92, 0.64), glass), 0, 0.36, 0.216));
    cabinet.position.set(2.3, 1.6, INNER + 0.21);
    network.add(cabinet);
    network.add(at(box(1.0, 0.035, 0.34, trim), 2.3, 1.2, INNER + 0.17));
    const router = new Group();
    router.add(rbox(0.62, 0.09, 0.24, 0.035, std('#0d1326', 0.4, 0.5)));
    [-0.22, 0, 0.22].forEach((x, k) => {
      const antenna = lit(new Mesh(new CylinderGeometry(0.018, 0.022, 0.42, 10), std('#0d1326', 0.5, 0.3)));
      antenna.geometry.translate(0, 0.21, 0);
      antenna.position.set(x, 0.07, -0.08);
      antenna.rotation.z = (k - 1) * 0.22;
      router.add(antenna);
    });
    this.routerLeds = [0, 1, 2, 3, 4].map(l => {
      const led = new Mesh(new SphereGeometry(0.016, 8, 8), new MeshBasicMaterial({ color: new Color(TRACK_COLORS[1]) }));
      led.position.set(-0.2 + l * 0.1, 0.05, 0.122);
      router.add(led);
      return led;
    });
    router.position.set(2.3, 1.235, INNER + 0.2);
    network.add(router);
    const accessPoint = lit(new Mesh(new CylinderGeometry(0.19, 0.21, 0.05, 32), std('#e4e9f5', 0.4, 0.1)));
    accessPoint.rotation.x = Math.PI / 2;
    accessPoint.position.set(0.82, 2.4, INNER + 0.03);
    network.add(accessPoint);
    const apRing = new Mesh(new CylinderGeometry(0.06, 0.06, 0.052, 24), glowMaterial(TRACK_COLORS[1]));
    apRing.rotation.x = Math.PI / 2;
    apRing.position.set(0.82, 2.4, INNER + 0.035);
    network.add(apRing);
    const networkPool = pool(TRACK_COLORS[1], 2.4, 1.8, 2.3, INNER + 0.9, 0.2);
    network.add(networkPool);
    room.add(network);
    cornerLight(1, 2.3, 1.5, INNER + 1.1, 2.6, 3);
    parts.push([network, 0.85, 'drop']);

    /* 5 Home lab: a short open rack on wheels beside the network gear, holding a switch, two
       Proxmox mini PCs, a four-bay NAS and a UPS */
    const homelab = new Group();
    const labFrame = std('#1a2140', 0.45, 0.6);
    const RW = 0.62; // rack width, depth, and height of its frame
    const RD = 0.6;
    const RH = 1.0;
    const lift = 0.07; // the wheels
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
      homelab.add(at(box(0.035, RH, 0.035, labFrame), sx * (RW / 2 - 0.018), lift, sz * (RD / 2 - 0.018)));
      const wheel = lit(new Mesh(new CylinderGeometry(0.03, 0.03, 0.025, 14), std('#0b0f1e', 0.6, 0.2)));
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(sx * (RW / 2 - 0.05), 0.03, sz * (RD / 2 - 0.05));
      homelab.add(wheel);
    });
    homelab.add(at(box(RW, 0.03, RD, labFrame), 0, lift, 0));
    homelab.add(at(box(RW, 0.03, RD, labFrame), 0, lift + RH - 0.03, 0));
    // The gear inside, and its front
    homelab.add(at(box(0.54, 0.86, 0.5, std('#10172d', 0.5, 0.4)), 0, lift + 0.05, -0.02));
    const labFace = new MeshStandardMaterial({
      map: canvasTexture(240, 400, (g, w, h) => drawHomelab(g, w, h, false)),
      emissiveMap: canvasTexture(240, 400, (g, w, h) => drawHomelab(g, w, h, true)),
      emissive: '#ffffff',
      emissiveIntensity: 2.6,
      roughness: 0.5,
      metalness: 0.4
    });
    this.rackMaterials.push(labFace);
    homelab.add(at(new Mesh(new PlaneGeometry(0.5, 0.833), labFace), 0, lift + 0.05 + 0.43, 0.232));
    // A thin light along the top front edge, in the track's colour
    homelab.add(at(new Mesh(new BoxGeometry(RW - 0.06, 0.012, 0.012), glowMaterial(TRACK_COLORS[5])), 0, lift + RH + 0.008, RD / 2 - 0.01));
    homelab.add(shadowPatch(1.0, 1.0, 0, 0, 0.55));
    const labPool = pool(TRACK_COLORS[5], 1.5, 1.5, 0, 0.55, 0.2);
    homelab.add(labPool);
    homelab.position.set(3.05, 0, -2.85);
    homelab.rotation.y = 0.25;
    room.add(homelab);
    cornerLight(5, 2.95, 1.3, -2.15, 2.2, 2.6);
    parts.push([homelab, 1.0, 'drop']);

    /* Cameras: one over the network corner, one over the door */
    this.cameraLeds = [];
    const wallCamera = (position, look) => {
      const cam = new Group();
      cam.add(lit(new Mesh(new RoundedBoxGeometry(0.16, 0.15, 0.36, 2, 0.05), std('#d9dfee', 0.45, 0.1))));
      const hood = lit(new Mesh(new BoxGeometry(0.2, 0.02, 0.4), std('#d9dfee', 0.45, 0.1)));
      hood.position.set(0, 0.085, 0.02);
      cam.add(hood);
      const lens = new Mesh(new CylinderGeometry(0.05, 0.05, 0.03, 18), std('#04060c', 0.1, 0.8));
      lens.rotation.x = Math.PI / 2;
      lens.position.z = 0.18;
      cam.add(lens);
      const led = new Mesh(new SphereGeometry(0.014, 8, 8), new MeshBasicMaterial({ color: new Color(TRACK_COLORS[0]) }));
      led.position.set(0.05, -0.04, 0.18);
      cam.add(led);
      this.cameraLeds.push(led);
      cam.position.copy(position);
      cam.lookAt(look);
      room.add(cam);
      return cam;
    };
    const camA = wallCamera(new Vector3(3.1, 2.45, INNER + 0.25), new Vector3(0, 0.6, 1));
    const camB = wallCamera(new Vector3(INNER + 0.25, 2.45, 3.0), new Vector3(1, 0.6, 0));
    parts.push([camA, 1.05, 'drop'], [camB, 1.1, 'drop']);

    /* 2 Identity: a door in the left wall with a card reader beside it */
    const access = new Group();
    const doorZ = 2.0;
    // A navy door in a light frame, turned to face into the room, its back against the wall
    const doorway = kit('doorway');
    repaint(doorway.getObjectByName('door'), 'wood', '#2d3a6e');
    repaint(doorway, 'wood', '#c3cbe0');
    doorway.rotation.y = Math.PI / 2;
    doorway.position.set(INNER + 0.087, 0, doorZ);
    access.add(doorway);
    const doormat = repaint(kit('rugDoormat'), 'wood', '#3a4470');
    doormat.rotation.y = Math.PI / 2;
    doormat.position.set(INNER + 0.42, 0, doorZ);
    access.add(doormat);
    access.add(at(repaint(kit('coatRackStanding'), 'wood', '#6d4f3a'), INNER + 0.32, 0, doorZ + 0.88));
    const reader = new Group();
    reader.add(rbox(0.04, 0.2, 0.12, 0.012, std('#0d1326', 0.4, 0.4)));
    this.readerLed = new Mesh(new BoxGeometry(0.01, 0.025, 0.07), new MeshBasicMaterial({ color: new Color(TRACK_COLORS[2]) }));
    this.readerLed.position.set(0.022, 0.16, 0);
    reader.add(this.readerLed);
    const pad = new Mesh(new PlaneGeometry(0.08, 0.08), new MeshBasicMaterial({ color: new Color(TRACK_COLORS[2]).multiplyScalar(0.6) }));
    pad.rotation.y = Math.PI / 2;
    pad.position.set(0.022, 0.08, 0);
    reader.add(pad);
    reader.position.set(INNER + 0.02, 1.15, doorZ - 0.78);
    access.add(reader);
    const exitSign = new Mesh(new BoxGeometry(0.03, 0.12, 0.32), glowMaterial(TRACK_COLORS[2]));
    exitSign.position.set(INNER + 0.03, 2.25, doorZ);
    access.add(exitSign);
    const accessPool = pool(TRACK_COLORS[2], 1.8, 2.2, INNER + 0.7, doorZ - 0.3, 0.2);
    access.add(accessPool);
    room.add(access);
    cornerLight(2, INNER + 0.6, 1.4, doorZ - 0.7, 2.2, 2.8);
    parts.push([access, 0.7, 'rise']);

    /* 3 Operations: two asset shelves of tagged boxes, books and spare laptops */
    // Built facing +z, then turned so the shelves stand against the left wall facing into the room.
    const shelf = new Group();
    const tag = assetTagTexture();
    const tagMaterial = new MeshBasicMaterial({ map: tag, color: new Color('#ffffff').multiplyScalar(0.85) });
    // Heights of the bookcase's four shelf surfaces (the last is the top)
    const level = [0.13, 0.37, 0.61, 0.85].map(y => y * KIT);
    const stock = (bookcaseX, name, scale, x, shelfIndex, options = {}) => {
      const piece = kit(name, scale);
      piece.position.set(bookcaseX + x, level[shelfIndex], options.z || 0);
      piece.rotation.y = options.turn || 0;
      // An asset tag on the front of tagged boxes
      if (options.tagged) {
        const b = boundsOf(piece);
        const label = new Mesh(new PlaneGeometry(0.13, 0.065), tagMaterial);
        label.position.set((b.min.x + b.max.x) / 2, b.min.y + (b.max.y - b.min.y) * 0.45, b.max.z + 0.003);
        shelf.add(label);
      }
      shelf.add(piece);
    };
    [-0.39, 0.39].forEach(x => {
      const bookcase = repaint(kit('bookcaseOpen'), 'wood', '#7a85a8');
      bookcase.position.x = x;
      shelf.add(bookcase);
    });
    // Left bookcase
    stock(-0.39, 'cardboardBoxClosed', 1.35, -0.15, 0, { tagged: true });
    stock(-0.39, 'books', KIT, 0.17, 0);
    stock(-0.39, 'laptop', KIT * 0.7, -0.08, 1);
    stock(-0.39, 'books', KIT, 0.24, 1, { turn: Math.PI / 2 });
    stock(-0.39, 'cardboardBoxClosed', 1.1, -0.17, 2, { tagged: true });
    stock(-0.39, 'cardboardBoxClosed', 1.1, 0.13, 2, { tagged: true });
    stock(-0.39, 'cardboardBoxOpen', 1.3, 0, 3);
    // Right bookcase
    stock(0.39, 'cardboardBoxClosed', 1.35, -0.16, 0, { tagged: true });
    stock(0.39, 'cardboardBoxClosed', 1.35, 0.16, 0, { tagged: true });
    stock(0.39, 'books', KIT, -0.16, 1);
    stock(0.39, 'cardboardBoxClosed', 1.1, 0.18, 1, { tagged: true });
    stock(0.39, 'laptop', KIT * 0.7, 0, 2);
    stock(0.39, 'books', KIT, -0.15, 3);
    stock(0.39, 'plantSmall2', KIT, 0.16, 3);
    shelf.add(shadowPatch(2.0, 0.9, 0, 0, 0.5));
    const opsPool = pool(TRACK_COLORS[3], 2.6, 1.8, 0, 0.75, 0.18);
    shelf.add(opsPool);
    shelf.rotation.y = Math.PI / 2;
    shelf.position.set(INNER + 0.25, 0, -0.85);
    room.add(shelf);
    cornerLight(3, INNER + 0.9, 1.6, -0.85, 2.4, 2.8);
    parts.push([shelf, 0.8, 'drop']);

    /* 4 Automation: a desk with a wide monitor running n8n, a laptop, a lamp and a chair */
    const desk = new Group();
    const deskMetal = std('#1a2140', 0.45, 0.5);
    // The kit's desk, widened, in a darker wood
    desk.add(repaint(kit('desk', [KIT * 1.3, KIT, KIT]), 'wood', '#6d4f3a'));
    const top = 0.384 * KIT; // the desk's top surface
    // Wide monitor on a stand
    desk.add(at(rbox(0.28, 0.02, 0.18, 0.008, deskMetal), 0, top, -0.2));
    desk.add(at(box(0.04, 0.3, 0.04, deskMetal), 0, top, -0.23));
    const monitorShell = rbox(1.2, 0.54, 0.04, 0.02, std('#0b0f1e', 0.4, 0.3));
    monitorShell.position.set(0, top + 0.18, -0.2);
    desk.add(monitorShell);
    const monitorScreen = new Mesh(new PlaneGeometry(1.14, 0.48), new MeshBasicMaterial({ map: workflowScreen(), color: new Color('#ffffff').multiplyScalar(1.3) }));
    monitorScreen.position.set(0, top + 0.45, -0.178);
    desk.add(monitorScreen);
    // Laptop, open, showing a terminal. The screen sits on the lid, in the model's own units.
    const laptop = kit('laptop', KIT * 0.8);
    const lidScreen = new Mesh(new PlaneGeometry(0.5, 0.28), new MeshBasicMaterial({ map: terminalScreen(), color: new Color('#ffffff').multiplyScalar(1.2) }));
    lidScreen.position.set(0.3, 0.219, -0.446);
    lidScreen.rotation.x = -0.42;
    laptop.userData.node.add(lidScreen);
    laptop.position.set(0.64, top, 0.1);
    laptop.rotation.y = -0.35;
    desk.add(laptop);
    // Keyboard, mouse, mug, a small plant
    desk.add(at(kit('computerKeyboard'), -0.05, top, 0.13));
    desk.add(at(kit('computerMouse'), 0.32, top, 0.15));
    desk.add(at(lit(new Mesh(new CylinderGeometry(0.045, 0.04, 0.11, 20), std('#eef1f8', 0.35, 0))), -0.5, top + 0.055, 0.14));
    desk.add(at(kit('plantSmall1'), -0.8, top, 0.2));
    // Desk lamp with a warm light
    desk.add(at(kit('lampSquareTable', KIT * 0.7), -0.74, top, -0.2));
    const warm = new PointLight('#ffb870', 0, 2.2, 2);
    warm.position.set(-0.7, top + 0.45, -0.05);
    warm.userData = { track: -1, base: 2.4 };
    desk.add(warm);
    this.cornerLights.push(warm);
    desk.add(at(kit('trashcan', KIT * 0.55), 1.15, 0, -0.12));
    // Office chair, pushed out to the side
    const chair = kit('chairDesk');
    chair.position.set(0.5, 0, 0.9);
    chair.rotation.y = Math.PI - 0.5;
    desk.add(chair);
    chair.userData.flat = true; // left out of the desk close-up's framing
    // Rug and grounding
    const rug = at(kit('rugRounded'), 0, 0, 0.35);
    rug.userData.flat = true;
    desk.add(rug);
    desk.add(shadowPatch(2.2, 1.0, 0, 0, 0.45));
    const autoPool = pool(TRACK_COLORS[4], 2.6, 2.0, 0, -0.1, 0.16);
    desk.add(autoPool);
    desk.position.set(1.4, 0, 1.15);
    desk.rotation.y = -0.18;
    room.add(desk);
    cornerLight(4, 1.4, 1.6, 0.8, 2.2, 2.8);
    parts.push([desk, 1.0, 'drop']);

    /* A tall plant in a white pot on the open side, clear of every close-up's view */
    const tallPlant = repaint(kit('pottedPlant', KIT * 1.8), 'wood', '#d4dbea');
    tallPlant.position.set(3.0, 0, 0.75);
    tallPlant.add(shadowPatch(0.8, 0.8, 0, 0, 0.5));
    room.add(tallPlant);
    parts.push([tallPlant, 1.25, 'drop']);

    parts.forEach(([object]) => {
      object.userData.baseY = object.position.y;
    });
    this.pools = [rackPool, networkPool, accessPool, opsPool, autoPool, labPool];

    // One hotspot per track, in track order, anchored on the object's most visible point.
    const appearAt = object => {
      const part = parts.find(([candidate]) => candidate === object);
      return (part ? part[1] : 0) + 0.55;
    };
    this.hot = [
      { object: racks, offset: new Vector3(-1.575, 2.25, INNER + 1.05), appearAt: appearAt(racks) },
      { object: router, offset: new Vector3(0, 0.3, 0.1), appearAt: appearAt(network) },
      { object: reader, offset: new Vector3(0.03, 0.12, 0), appearAt: appearAt(access) },
      { object: shelf, offset: new Vector3(0, 1.8, 0.1), appearAt: appearAt(shelf) },
      { object: monitorScreen, offset: new Vector3(0, 0.24, 0), appearAt: appearAt(desk) },
      { object: homelab, offset: new Vector3(0, 1.12, 0.05), appearAt: appearAt(homelab) }
    ];

    // Clicking anything in a corner opens its track: each corner's group carries its number.
    const corners = [racks, network, access, shelf, desk, homelab];
    corners.forEach((group, track) => {
      group.userData.track = track;
    });
    // What each close-up frames: the corner's furniture, without the floor decals around it
    room.updateMatrixWorld(true);
    this.focusBoxes = corners.map(group => {
      const bounds = new Box3();
      group.children.forEach(child => {
        if (!child.userData.flat) bounds.expandByObject(child);
      });
      return bounds;
    });
  }

  /** Re-reads the box size and frames the room inside it. Call after resize. */
  layout() {
    const rect = this.box.getBoundingClientRect();
    this.W = Math.max(1, rect.width);
    this.H = Math.max(1, rect.height);
    this.camera.aspect = this.W / this.H;
    this.camera.updateProjectionMatrix();
    // The distance at which the whole room (walls and platform) fits with a margin
    const corners = [];
    for (const x of [-HALF, HALF]) for (const z of [-HALF, HALF]) corners.push(new Vector3(x, -0.5, z), new Vector3(x, 0, z));
    corners.push(new Vector3(-HALF, WALL_H + 0.05, -HALF), new Vector3(HALF, WALL_H + 0.05, -HALF), new Vector3(-HALF, WALL_H + 0.05, HALF));
    this.distance = this.fitDistance(corners, TARGET, AZIMUTH, ELEVATION, OVERVIEW_FRAME, 6);
    this.updateFocusView();
    this.applyQuality();
  }

  /**
   * The camera distance at which every point fits inside `frame` (centre and size as fractions of
   * the box), looking at `target` from the given angles, with the picture shifted so `target`
   * sits at the frame's centre.
   */
  fitDistance(points, target, az, el, frame, nearest) {
    this.applyViewOffset(frame.cx - 0.5, frame.cy - 0.5);
    const x0 = 2 * (frame.cx - frame.w / 2) - 1;
    const x1 = 2 * (frame.cx + frame.w / 2) - 1;
    const y0 = 1 - 2 * (frame.cy + frame.h / 2);
    const y1 = 1 - 2 * (frame.cy - frame.h / 2);
    const p = new Vector3();
    let low = nearest;
    let high = 80;
    for (let i = 0; i < 28; i++) {
      const mid = (low + high) / 2;
      this.placeCamera(az, el, mid, target);
      this.camera.updateMatrixWorld();
      const fits = points.every(c => {
        p.copy(c).project(this.camera);
        return p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1;
      });
      if (fits) high = mid;
      else low = mid;
    }
    return high;
  }

  /** Shifts the picture so the camera's target appears `ox`, `oy` (fractions of the box) off centre. */
  applyViewOffset(ox, oy) {
    if (Math.abs(ox) < 1e-4 && Math.abs(oy) < 1e-4) {
      if (this.camera.view && this.camera.view.enabled) this.camera.clearViewOffset();
      return;
    }
    this.camera.setViewOffset(this.W, this.H, -ox * this.W, -oy * this.H, this.W, this.H);
  }

  placeCamera(az, el, distance, target = TARGET) {
    this.camera.position.set(
      target.x + distance * Math.sin(az) * Math.cos(el),
      target.y + distance * Math.sin(el),
      target.z + distance * Math.cos(az) * Math.cos(el)
    );
    this.camera.lookAt(target);
  }

  /** Opens a track's close-up (the camera flies there), or goes back to the whole room with -1. */
  focus(track) {
    this.focused = track >= 0 && track < this.focusBoxes.length ? track : -1;
    this.updateFocusView();
  }

  /** Sets the part of the box a close-up must fit in: { cx, cy, w, h } as fractions of the box. */
  setFrame(frame) {
    this.frame = frame;
    this.updateFocusView();
  }

  updateFocusView() {
    if (this.focused < 0) {
      this.focusView = null;
      return;
    }
    const bounds = this.focusBoxes[this.focused];
    const target = bounds.getCenter(new Vector3());
    const points = [];
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) points.push(new Vector3(x, y, z));
    // Never closer than the corner's own size, so nothing ends up behind the camera
    const nearest = bounds.getSize(new Vector3()).length() / 2 + 0.6;
    const { az, el } = FOCUS_ANGLES[this.focused];
    const distance = this.fitDistance(points, target, az, el, this.frame, nearest);
    this.focusView = { target, az, el, distance, ox: this.frame.cx - 0.5, oy: this.frame.cy - 0.5 };
  }

  /**
   * The track whose corner is under a point on the page (clientX/Y), or -1. Clicking or pointing
   * works once the room has built itself.
   */
  pick(clientX, clientY) {
    if (this.clock < ASSEMBLED_AT) return -1;
    const rect = this.box.getBoundingClientRect();
    this.ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hit = this.raycaster.intersectObject(this.room, true).find(h => h.object.visible);
    for (let o = hit && hit.object; o && o !== this.room; o = o.parent) {
      if (o.userData.track !== undefined) return o.userData.track;
    }
    return -1;
  }

  /** Sizes the drawing buffer and switches shadows, reflections and corner lights for the quality step. */
  applyQuality() {
    const step = QUALITY[this.quality];
    const pixelRatio = Math.min(window.devicePixelRatio || 1, step.pixelRatio);
    if (this.renderer.shadowMap.enabled !== step.shadows) {
      this.renderer.shadowMap.enabled = step.shadows;
      this.scene.traverse(o => {
        if (!o.isMesh) return;
        (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
          m.needsUpdate = true;
        });
      });
    }
    this.cornerLights.forEach(light => {
      light.visible = step.lights;
    });
    this.scene.environment = step.shadows ? this.envTexture : null;
    // The page drops its own costly effects (the header's backdrop blur, the pointer light) too.
    document.documentElement.toggleAttribute('data-lite-render', !step.shadows);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(this.W, this.H, false);
  }

  /** Steps quality down when frames have been slow for a while. It never steps back up. */
  watchFrameTime(seconds) {
    const elapsed = this.lastSeconds === null ? 0 : (seconds - this.lastSeconds) * 1000;
    this.lastSeconds = seconds;
    // The first seconds do not count: shaders compile and the intro runs.
    if (this.watchFrom === null) this.watchFrom = seconds + 3;
    if (elapsed <= 0 || elapsed > 250 || seconds < this.watchFrom) return;
    this.frameMs += (elapsed - this.frameMs) * 0.1;
    if (this.frameMs <= SLOW_FRAME_MS) {
      this.slowSince = null;
      return;
    }
    if (this.slowSince === null) this.slowSince = seconds;
    if (seconds - this.slowSince > 1 && this.quality < QUALITY.length - 1) {
      this.quality++;
      this.applyQuality();
      this.frameMs = 16;
      this.slowSince = null;
      this.watchFrom = seconds + 1.5;
    }
  }

  /** Puts every part where the intro clock says it should be. */
  applyAssembly() {
    if (this.assembledApplied && this.clock >= ASSEMBLED_AT) return;
    this.parts.forEach(([object, delay, kind]) => {
      const p = clamp01((this.clock - delay) / 0.65);
      object.visible = p > 0;
      if (kind === 'pop') object.scale.setScalar(Math.max(0.001, easeOutBack(p) * 0.25 + ease(p) * 0.75));
      if (kind === 'rise') object.scale.y = Math.max(0.001, ease(p));
      if (kind === 'drop') object.position.y = object.userData.baseY + (1 - ease(p)) * 3;
      if (kind === 'fade') object.material.opacity = ease(p);
    });
    this.assembledApplied = this.clock >= ASSEMBLED_AT;
  }

  /** Draws one frame. `seconds` is a running clock (GSAP's ticker time). */
  update(seconds) {
    if (!this.visible || document.hidden) {
      this.lastSeconds = null;
      this.prevSeconds = null;
      return;
    }
    const dt = this.prevSeconds === null ? 1 / 60 : Math.min(0.1, Math.max(0, seconds - this.prevSeconds));
    this.prevSeconds = seconds;
    this.watchFrameTime(seconds);
    this.applyAssembly();
    const { still } = this;
    const built = clamp01((this.clock - 1.2) / 0.8);

    // Lights: rack LEDs flicker, router lights blink, camera lights pulse
    this.rackMaterials.forEach((material, k) => {
      material.emissiveIntensity = still ? 2.6 : 2.3 + 0.6 * Math.max(0, Math.sin(seconds * (2.2 + k * 0.7) + k * 1.3));
    });
    this.routerLeds.forEach((led, k) => {
      const on = still || Math.sin(seconds * (5 + k * 1.9) + k) > -0.2;
      led.material.color.set(TRACK_COLORS[1]).multiplyScalar(on ? 2.6 : 0.4);
    });
    this.cameraLeds.forEach(led => {
      led.material.color.set(TRACK_COLORS[0]).multiplyScalar(still ? 2.2 : 1.4 + Math.sin(seconds * 2.4));
    });
    this.readerLed.material.color.set(TRACK_COLORS[2]).multiplyScalar(this.highlight === 2 ? 3.2 : 2);

    // Corner lights fade in once the room is built; the highlighted track's corner brightens.
    this.cornerLights.forEach(light => {
      const { track, base } = light.userData;
      const boost = track >= 0 && this.highlight === track ? 2.6 : 1;
      const want = base * built * boost;
      light.intensity += (want - light.intensity) * (still ? 1 : 0.12);
    });
    this.pools.forEach((p, i) => {
      const glow = p.userData.baseOpacity * built * (this.highlight === i ? 2.6 : 1);
      p.material.opacity += (glow - p.material.opacity) * (still ? 1 : 0.12);
    });

    // Camera. The whole room: a slow drift, a little toward the pointer, and a turn plus move-in as
    // the hero scrolls away. A close-up: the corner's own view, still following the pointer a little.
    const px = still ? 0 : this.pointer.x;
    const py = still ? 0 : this.pointer.y;
    const f = this.focusView;
    let want;
    if (f) {
      want = { target: f.target, az: f.az + px * 0.04, el: f.el - py * 0.02, dist: f.distance, ox: f.ox, oy: f.oy };
    } else {
      const drift = still ? 0 : Math.sin(seconds * 0.22) * 0.025;
      const scroll = still ? 0 : this.scroll;
      want = {
        target: TARGET,
        az: AZIMUTH + px * 0.07 + drift + scroll * 0.22,
        el: ELEVATION - py * 0.03,
        dist: this.distance * (1 - scroll * 0.06),
        ox: 0,
        oy: 0
      };
    }
    const c = this.cam;
    // The first frame (and reduced motion) jumps straight there; after that the camera eases in.
    const k = still || c.dist === null ? 1 : 1 - Math.exp(-dt * CAMERA_RATE);
    if (c.dist === null) c.dist = want.dist;
    c.target.lerp(want.target, k);
    c.az += (want.az - c.az) * k;
    c.el += (want.el - c.el) * k;
    c.dist += (want.dist - c.dist) * k;
    c.ox += (want.ox - c.ox) * k;
    c.oy += (want.oy - c.oy) * k;
    this.applyViewOffset(c.ox, c.oy);
    this.placeCamera(c.az, c.el, c.dist, c.target);

    this.renderer.render(this.scene, this.camera);
    this.placeHotspots();
  }

  /** Moves each hotspot label to its object's place on screen (after render, so matrices are current). */
  placeHotspots() {
    const p = this.projected;
    this.hot.forEach((h, i) => {
      const el = this.hotspots[i];
      if (!el) return;
      h.object.localToWorld(p.copy(h.offset)).project(this.camera);
      const x = ((p.x + 1) / 2) * this.W;
      const y = ((1 - p.y) / 2) * this.H;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      // An attribute rather than a class, so React re-rendering the list never clears it.
      el.toggleAttribute('data-shown', this.clock >= h.appearAt);
    });
  }

  dispose() {
    const textures = new Set([this.softTexture]);
    this.scene.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      const materials = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      materials.forEach(m => {
        ['map', 'emissiveMap'].forEach(key => m[key] && textures.add(m[key]));
        m.dispose();
      });
    });
    textures.forEach(t => t && t.dispose());
    // Kit geometry that no piece in the room uses
    Object.values(this.models).forEach(model => model.traverse(o => o.geometry && o.geometry.dispose()));
    this.envTexture.dispose();
    this.renderer.dispose();
    document.documentElement.removeAttribute('data-lite-render');
  }
}
