import { TERRACE_X, TERRACE_Z } from './world.js';
import { WELL_X, WELL_Z, HOLLOW_X, HOLLOW_Z, STEP_X, STEP_Z, CAIRN_X, CAIRN_Z, PINE_X, PINE_Z } from './places.js';
import { POOL_X, POOL_Z } from './shade.js';
import { OAK_X, OAK_Z } from './oak.js';
import { GATE_X, GATE_Z } from './gate.js';
import { WASH_X, WASH_Z } from './wash.js';
import { LARK_X, LARK_Z } from './lark.js';
import { FERN_X, FERN_Z } from './fern.js';
import { BELL_X, BELL_Z } from './bell.js';
import { ROWAN_X, ROWAN_Z } from './rowan.js';
import { WILLOW_X, WILLOW_Z } from './willow.js';
import { HONEY_X, HONEY_Z } from './honey.js';
import { THISTLE_X, THISTLE_Z } from './thistle.js';
import { CLOVER_X, CLOVER_Z } from './clover.js';
import { DAISY_X, DAISY_Z } from './daisy.js';
import { RUSH_X, RUSH_Z } from './rush.js';
import { BIRCH_X, BIRCH_Z } from './birch.js';
import { ALDER_X, ALDER_Z } from './alder.js';
import { HAZEL_X, HAZEL_Z } from './hazel.js';
import { MAPLE_X, MAPLE_Z } from './maple.js';
import { ASPEN_X, ASPEN_Z } from './aspen.js';
import { CEDAR_X, CEDAR_Z } from './cedar.js';
import { SPRUCE_X, SPRUCE_Z } from './spruce.js';
import { YEW_X, YEW_Z } from './yew.js';
import { ELM_X, ELM_Z } from './elm.js';
import { BEECH_X, BEECH_Z } from './beech.js';
import { LINDEN_X, LINDEN_Z } from './linden.js';
import { POPLAR_X, POPLAR_Z } from './poplar.js';
import { ASH_X, ASH_Z } from './ash.js';
import { HOLLY_X, HOLLY_Z } from './holly.js';
import { WALNUT_X, WALNUT_Z } from './walnut.js';
import { CHESTNUT_X, CHESTNUT_Z } from './chestnut.js';
import { HAWTHORN_X, HAWTHORN_Z } from './hawthorn.js';
import { ELDER_X, ELDER_Z } from './elder.js';
import { slowBendCenter } from './bend.js';

const NOTES_KEY = 'wildmere-notes-v1';

const NOTES = [
  { id: 'clearing', name: 'The Clearing', x: 10, z: 26, line: 'Open grass near the first trees. A good place to start walking.' },
  { id: 'reedford', name: 'Reedford Crossing', x: 8, z: 8, line: 'The stream cuts a shallow bed and keeps moving.' },
  { id: 'high-spine', name: 'High Spine', x: -20, z: -70, line: 'The ground lifts. Wind is thinner here.' },
  { id: 'quiet-pines', name: 'The Quiet Pines', x: 40, z: -20, line: 'Needles underfoot. The light is cooler.' },
  { id: 'old-ring', name: 'The Old Ring', x: -18, z: 8, line: 'Eight stones in a small circle. Someone stood here once.' },
  { id: 'moss-seat', name: 'The Moss Seat', x: 32, z: -14, line: 'A low pad of moss and a few stones to sit on.' },
  { id: 'quiet-well', name: 'The Quiet Well', x: WELL_X, z: WELL_Z, line: 'Cool water under a wooden beam. Drink if you need.' },
  { id: 'listening-pine', name: 'The Listening Pine', x: PINE_X, z: PINE_Z, line: 'A lone pine with a small slat on a cord.' },
  { id: 'wind-hollow', name: 'The Wind Hollow', x: HOLLOW_X, z: HOLLOW_Z, line: 'A stone bowl and a scrap of cloth that moves.' },
  { id: 'reed-step', name: 'The Reed Step', x: STEP_X, z: STEP_Z, line: 'Stones set in the shallow water. Reeds keep the banks.' },
  { id: 'low-cairn', name: 'The Low Cairn', x: CAIRN_X, z: CAIRN_Z, line: 'A small stack of pale rock in the grass.' },
  { id: 'shade-pool', name: 'The Shade Pool', x: POOL_X, z: POOL_Z, line: 'Still water under a fallen log. Drink there if you need.' },
  { id: 'split-oak', name: 'The Split Oak', x: OAK_X, z: OAK_Z, line: 'Two trunks from one base and a low bench in the moss.' },
  { id: 'still-gate', name: 'The Still Gate', x: GATE_X, z: GATE_Z, line: 'Two posts and a fallen lintel in the grass.' },
  { id: 'wash-rock', name: 'The Wash Rock', x: WASH_X, z: WASH_Z, line: 'A flat stone, a paddle, a bucket, and cloth on a post.' },
  { id: 'lark-post', name: 'The Lark Post', x: LARK_X, z: LARK_Z, line: 'A thin post and three slats. They tap when the air moves.' },
  { id: 'fern-stair', name: 'The Fern Stair', x: FERN_X, z: FERN_Z, line: 'Three low moss steps. Ferns keep the shade moving.' },
  { id: 'evening-bell', name: 'The Evening Bell', x: BELL_X, z: BELL_Z, line: 'Two posts, a small bronze, a bench in the moss.' },
  { id: 'rowan-lean', name: 'The Rowan Lean', x: ROWAN_X, z: ROWAN_Z, line: 'A thin tree tips toward a stone seat. Red clusters hang.' },
  { id: 'willow-dip', name: 'The Willow Dip', x: WILLOW_X, z: WILLOW_Z, line: 'Long strands hang over a small pool at the roots.' },
  { id: 'honey-stone', name: 'The Honey Stone', x: HONEY_X, z: HONEY_Z, line: 'A warm slab, a wooden bowl, gold drops on a post.' },
  { id: 'thistle-seat', name: 'The Thistle Seat', x: THISTLE_X, z: THISTLE_Z, line: 'A low bench in the moss. Purple heads nod in the air.' },
  { id: 'clover-pad', name: 'The Clover Pad', x: CLOVER_X, z: CLOVER_Z, line: 'A round of moss, a low stool, rainwater in a tin cup.' },
  { id: 'daisy-ring', name: 'The Daisy Ring', x: DAISY_X, z: DAISY_Z, line: 'White heads in a small circle. A bench in the moss.' },
  { id: 'rush-nest', name: 'The Rush Nest', x: RUSH_X, z: RUSH_Z, line: 'Pale rushes in a fan. A stone dish holds rain.' },
  { id: 'birch-shelf', name: 'The Birch Shelf', x: BIRCH_X, z: BIRCH_Z, line: 'Pale bark, a stone shelf, peels that lift in the air.' },
  { id: 'alder-nook', name: 'The Alder Nook', x: ALDER_X, z: ALDER_Z, line: 'A dark trunk, hanging catkins, rain in a stone bowl.' },
  { id: 'hazel-rest', name: 'The Hazel Rest', x: HAZEL_X, z: HAZEL_Z, line: 'A small tree, a moss seat, nuts in the leaves.' },
  { id: 'maple-sill', name: 'The Maple Sill', x: MAPLE_X, z: MAPLE_Z, line: 'Warm leaves, a stone sill, seeds that spin in the air.' },
  { id: 'aspen-lean', name: 'The Aspen Lean', x: ASPEN_X, z: ASPEN_Z, line: 'A pale trunk, flickering leaves, a seat in the moss.' },
  { id: 'cedar-bowl', name: 'The Cedar Bowl', x: CEDAR_X, z: CEDAR_Z, line: 'A dark cedar, small cones, rain in a stone bowl.' },
  { id: 'spruce-cup', name: 'The Spruce Cup', x: SPRUCE_X, z: SPRUCE_Z, line: 'A thin spruce, loose needles, rain in a wooden cup.' },
  { id: 'yew-sill', name: 'The Yew Sill', x: YEW_X, z: YEW_Z, line: 'A dark yew, small berries, a pale stone sill.' },
  { id: 'elm-dish', name: 'The Elm Dish', x: ELM_X, z: ELM_Z, line: 'A leaning elm, small leaves, rain in a stone dish.' },
  { id: 'beech-ledge', name: 'The Beech Ledge', x: BEECH_X, z: BEECH_Z, line: 'A smooth beech, small hulls, a pale stone ledge.' },
  { id: 'linden-seat', name: 'The Linden Seat', x: LINDEN_X, z: LINDEN_Z, line: 'A round linden, gold blooms, a pale stone sill.' },
  { id: 'poplar-rest', name: 'The Poplar Rest', x: POPLAR_X, z: POPLAR_Z, line: 'A pale trunk, lifting leaves, rain in a stone dish.' },
  { id: 'ash-ledge', name: 'The Ash Ledge', x: ASH_X, z: ASH_Z, line: 'A dark ash, thin keys that lift, a pale stone ledge.' },
  { id: 'holly-rest', name: 'The Holly Rest', x: HOLLY_X, z: HOLLY_Z, line: 'A dark holly, small red berries, a pale stone sill.' },
  { id: 'walnut-bench', name: 'The Walnut Bench', x: WALNUT_X, z: WALNUT_Z, line: 'A leaning walnut, green hulls, a low wooden bench.' },
  { id: 'chestnut-rest', name: 'The Chestnut Rest', x: CHESTNUT_X, z: CHESTNUT_Z, line: 'A leaning chestnut, spiny burrs, a low wooden seat.' },
  { id: 'hawthorn-bench', name: 'The Hawthorn Bench', x: HAWTHORN_X, z: HAWTHORN_Z, line: 'A leaning hawthorn, pale blooms, a low wooden bench.' },
  { id: 'elder-bowl', name: 'The Elder Bowl', x: ELDER_X, z: ELDER_Z, line: 'A dark elder, pale flower plates, rain in a stone bowl.' },
  { id: 'stone-terrace', name: 'The Stone Terrace', x: TERRACE_X, z: TERRACE_Z, line: 'A high shelf of rock and thin grass past High Spine.' },
  { id: 'slow-bend', name: 'The Slow Bend', x: 0, z: 48, line: 'Still water and a short plank. Fish if you can wait.' }
];

const ALLOW = new Set(NOTES.map(n => n.id));

function sanitizeId(id){
  if (typeof id !== 'string') return '';
  const s = id.replace(/[^a-z0-9-]/g, '').slice(0, 40);
  return ALLOW.has(s) ? s : '';
}

export function noteForPlace(name){
  if (typeof name !== 'string') return null;
  return NOTES.find(n => n.name === name) || null;
}

export function loadNotes(){
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    const out = new Set();
    for (const item of arr){
      const id = sanitizeId(item);
      if (id) out.add(id);
    }
    return out;
  } catch {
    return new Set();
  }
}

export function saveNotes(found){
  const ids = [];
  for (const item of found){
    const id = sanitizeId(item);
    if (id) ids.push(id);
  }
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(ids));
  } catch (_) {}
}

function mapPos(x, z){
  return {
    cx: 48 + x * 0.38,
    cy: 40 + z * 0.28
  };
}

export function renderNotebook(found){
  const list = document.getElementById('nb-list');
  const count = document.getElementById('nb-count');
  const dots = document.getElementById('nb-dots');
  const total = NOTES.length;
  const have = found ? found.size : 0;
  if (count) count.textContent = have + ' / ' + total;
  if (list){
    list.textContent = '';
    for (const note of NOTES){
      if (!found || !found.has(note.id)) continue;
      const li = document.createElement('li');
      const title = document.createElement('strong');
      title.textContent = note.name;
      const p = document.createElement('span');
      p.textContent = ' — ' + note.line;
      li.appendChild(title);
      li.appendChild(p);
      list.appendChild(li);
    }
    if (!list.childNodes.length){
      const li = document.createElement('li');
      li.textContent = 'Walk named ground. The book fills itself.';
      list.appendChild(li);
    }
  }
  if (dots){
    dots.textContent = '';
    const bend = slowBendCenter();
    for (const note of NOTES){
      if (!found || !found.has(note.id)) continue;
      let x = note.x, z = note.z;
      if (note.id === 'slow-bend'){ x = bend.x; z = bend.z; }
      const { cx, cy } = mapPos(x, z);
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', String(cx));
      c.setAttribute('cy', String(cy));
      c.setAttribute('r', '1.6');
      c.setAttribute('class', 'dot');
      dots.appendChild(c);
    }
  }
}
