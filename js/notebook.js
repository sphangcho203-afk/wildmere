import { TERRACE_X, TERRACE_Z } from './world.js';
import { WELL_X, WELL_Z, HOLLOW_X, HOLLOW_Z, STEP_X, STEP_Z, CAIRN_X, CAIRN_Z } from './places.js';
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
import { slowBendCenter } from './bend.js';

const SAVE_NOTES = 'wildmere-notes-v1';

export const NOTES = [
  { id: 'clearing', name: 'The Clearing', line: 'Open grass. A good place to start a day.', x: 10, z: 26, mapX: 52, mapY: 58 },
  { id: 'crossing', name: 'Reedford Crossing', line: 'The stream cuts the valley and keeps its own time.', x: 4, z: 18, mapX: 48, mapY: 48 },
  { id: 'ring', name: 'The Old Ring', line: 'Eight stones. Older than the pines around them.', x: -18, z: 8, mapX: 38, mapY: 50 },
  { id: 'moss', name: 'The Moss Seat', line: 'A low curve of stone with a soft pad. A pause.', x: 32, z: -14, mapX: 68, mapY: 42 },
  { id: 'well', name: 'The Quiet Well', line: 'Someone kept this water. It is still cool.', x: WELL_X, z: WELL_Z, mapX: 74, mapY: 54 },
  { id: 'bend', name: 'The Slow Bend', line: 'The water holds here. Fish move under the plank.', x: 0, z: 48, mapX: 50, mapY: 72 },
  { id: 'pines', name: 'The Quiet Pines', line: 'Thicker timber. The light thins between trunks.', x: 40, z: 40, mapX: 72, mapY: 66 },
  { id: 'spine', name: 'High Spine', line: 'The ground lifts. Wind finds you first.', x: -40, z: -50, mapX: 30, mapY: 32 },
  { id: 'pine', name: 'The Listening Pine', line: 'A taller pine and a wooden slat on a cord. The wind talks.', x: 58, z: -38, mapX: 78, mapY: 34 },
  { id: 'terrace', name: 'The Stone Terrace', line: 'Pale shelves and a small cairn. The sky stays open.', x: TERRACE_X, z: TERRACE_Z, mapX: 22, mapY: 18 },
  { id: 'hollow', name: 'The Wind Hollow', line: 'A stone bowl and a strip of cloth. The air keeps moving.', x: HOLLOW_X, z: HOLLOW_Z, mapX: 28, mapY: 68 },
  { id: 'step', name: 'The Reed Step', line: 'Flat stones and tall reeds. The stream is shallow here.', x: STEP_X, z: STEP_Z, mapX: 47, mapY: 38 },
  { id: 'cairn', name: 'The Low Cairn', line: 'Five stones stacked by a path someone used to walk.', x: CAIRN_X, z: CAIRN_Z, mapX: 24, mapY: 56 },
  { id: 'pool', name: 'The Shade Pool', line: 'Still water under a fallen log. The reeds keep their own time.', x: POOL_X, z: POOL_Z, mapX: 62, mapY: 76 },
  { id: 'oak', name: 'The Split Oak', line: 'Two trunks from one base. A low bench in the moss.', x: OAK_X, z: OAK_Z, mapX: 84, mapY: 60 },
  { id: 'gate', name: 'The Still Gate', line: 'Two weathered posts. The lintel fell and stayed where it fell.', x: GATE_X, z: GATE_Z, mapX: 64, mapY: 80 },
  { id: 'wash', name: 'The Wash Rock', line: 'A flat stone by the stream. A paddle, a bucket, cloth on a post.', x: WASH_X, z: WASH_Z, mapX: 36, mapY: 62 },
  { id: 'lark', name: 'The Lark Post', line: 'A thin post and three slats. The air taps them when it wants.', x: LARK_X, z: LARK_Z, mapX: 44, mapY: 28 },
  { id: 'fern', name: 'The Fern Stair', line: 'Three low steps in the moss. Ferns keep the shade moving.', x: FERN_X, z: FERN_Z, mapX: 76, mapY: 64 },
  { id: 'bell', name: 'The Evening Bell', line: 'Two posts and a small bronze. The air moves it just enough.', x: BELL_X, z: BELL_Z, mapX: 34, mapY: 36 },
  { id: 'rowan', name: 'The Rowan Lean', line: 'A thin tree tips toward a stone seat. Red clusters hang in the leaves.', x: ROWAN_X, z: ROWAN_Z, mapX: 66, mapY: 52 },
  { id: 'willow', name: 'The Willow Dip', line: 'Long strands hang over a small pool at the roots. The air keeps them moving.', x: WILLOW_X, z: WILLOW_Z, mapX: 60, mapY: 36 },
  { id: 'honey', name: 'The Honey Stone', line: 'A warm slab and a wooden bowl. Gold drops hang from a thin post.', x: HONEY_X, z: HONEY_Z, mapX: 34, mapY: 64 },
  { id: 'thistle', name: 'The Thistle Seat', line: 'A low bench in the moss. Purple heads nod when the air moves.', x: THISTLE_X, z: THISTLE_Z, mapX: 58, mapY: 74 }
];

function bendDot(){
  const c = slowBendCenter();
  const bend = NOTES.find(n => n.id === 'bend');
  if (bend){ bend.x = c.x; bend.z = c.z; }
}
bendDot();

export function loadNotes(){
  const found = new Set(['clearing']);
  try {
    const raw = localStorage.getItem(SAVE_NOTES);
    if (raw){
      const list = JSON.parse(raw);
      if (Array.isArray(list)) list.forEach(id => found.add(id));
    }
  } catch (e) {}
  return found;
}

export function saveNotes(found){
  try {
    localStorage.setItem(SAVE_NOTES, JSON.stringify([...found]));
  } catch (e) {}
}

export function noteForPlace(placeName){
  return NOTES.find(n => n.name === placeName) || null;
}

export function renderNotebook(found){
  const list = document.getElementById('nb-list');
  const count = document.getElementById('nb-count');
  const dots = document.getElementById('nb-dots');
  if (count) count.textContent = found.size + ' / ' + NOTES.length;
  if (list){
    list.innerHTML = NOTES.map(n => {
      const known = found.has(n.id);
      return '<li class="' + (known ? 'known' : 'fog') + '"><b>' +
        (known ? n.name : '\u2014') + '</b><span>' +
        (known ? n.line : 'Not walked yet') + '</span></li>';
    }).join('');
  }
  if (dots){
    dots.innerHTML = NOTES.map(n => {
      const known = found.has(n.id);
      return '<circle class="' + (known ? 'known' : 'fog') + '" cx="' +
        n.mapX + '" cy="' + n.mapY + '" r="' + (known ? '3.2' : '2') +
        '"><title>' + (known ? n.name : '') + '</title></circle>';
    }).join('');
  }
}
