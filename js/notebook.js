import { TERRACE_X, TERRACE_Z } from './world.js';
import { WELL_X, WELL_Z, HOLLOW_X, HOLLOW_Z, STEP_X, STEP_Z, CAIRN_X, CAIRN_Z, PINE_X, PINE_Z } from './places.js';
import { THYME_X, THYME_Z } from './thyme.js';
import { MINT_X, MINT_Z } from './mint.js';
import { SAGE_X, SAGE_Z } from './sage.js';
import { ROSEMARY_X, ROSEMARY_Z } from './rosemary.js';
import { BASIL_X, BASIL_Z } from './basil.js';

const NOTES_KEY = 'wildmere-notes-v1';

const NOTES = [
  { id: 'clearing', name: 'The Clearing', x: 10, z: 26, line: 'Open grass near the first trees. A good place to start walking.' },
  { id: 'reedford', name: 'Reedford Crossing', x: 8, z: 8, line: 'The stream cuts a shallow bed and keeps moving.' },
  { id: 'high-spine', name: 'High Spine', x: -20, z: -70, line: 'The ground lifts. Wind is thinner here.' },
  { id: 'quiet-pines', name: 'The Quiet Pines', x: 40, z: -20, line: 'Needles underfoot. The light is cooler.' },
  { id: 'old-ring', name: 'The Old Ring', x: -18, z: 8, line: 'Eight stones in a small circle. Someone stood here once.' },
  { id: 'moss-seat', name: 'The Moss Seat', x: 32, z: -14, line: 'A low pad of moss and a few stones to sit on.' },
  { id: 'quiet-well', name: 'The Quiet Well', x: WELL_X, z: WELL_Z, line: 'Cool water from the well. Drink if you need.' },
  { id: 'listening-pine', name: 'The Listening Pine', x: PINE_X, z: PINE_Z, line: 'A lone pine with a small slat on a cord.' },
  { id: 'wind-hollow', name: 'The Wind Hollow', x: HOLLOW_X, z: HOLLOW_Z, line: 'A stone bowl and a scrap of cloth that moves.' },
  { id: 'reed-step', name: 'The Reed Step', x: STEP_X, z: STEP_Z, line: 'Stones set in the shallow water. Reeds keep the banks.' },
  { id: 'low-cairn', name: 'The Low Cairn', x: CAIRN_X, z: CAIRN_Z, line: 'A small stack of pale rock in the grass.' },
  { id: 'thyme-rest', name: 'The Thyme Rest', x: THYME_X, z: THYME_Z, line: 'A moss pad with low thyme clumps. Soft leaves you can pick.' },
  { id: 'mint-rest', name: 'The Mint Rest', x: MINT_X, z: MINT_Z, line: 'A moss pad with mint leaves. Cool scent when you brush them.' },
  { id: 'sage-rest', name: 'The Sage Rest', x: SAGE_X, z: SAGE_Z, line: 'A moss pad with low sage clumps. Soft gray-green leaves you can pick.' },
  { id: 'rosemary-rest', name: 'The Rosemary Rest', x: ROSEMARY_X, z: ROSEMARY_Z, line: 'A moss pad with rosemary sprigs. Needle leaves you can pick.' },
  { id: 'basil-rest', name: 'The Basil Rest', x: BASIL_X, z: BASIL_Z, line: 'A moss pad with basil leaves. Soft green leaves you can pick.' },
  { id: 'stone-terrace', name: 'The Stone Terrace', x: TERRACE_X, z: TERRACE_Z, line: 'A broad shelf of stone above the valley floor.' }
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

export function saveNotes(set){
  const arr = Array.from(set).filter(id => ALLOW.has(id));
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(arr)); } catch {}
}

export function renderNotebook(found){
  const list = document.getElementById('nb-list');
  const count = document.getElementById('nb-count');
  const dots = document.getElementById('nb-dots');
  if (!list || !count) return;
  list.innerHTML = '';
  if (dots) dots.innerHTML = '';
  let n = 0;
  for (const note of NOTES){
    const li = document.createElement('li');
    const foundIt = found.has(note.id);
    li.textContent = foundIt ? note.name + ' — ' + note.line : note.name + ' (not yet)';
    if (!foundIt) li.style.opacity = '0.45';
    list.appendChild(li);
    if (foundIt && dots){
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', 48 + (note.x / 4));
      c.setAttribute('cy', 44 - (note.z / 4));
      c.setAttribute('r', '1.4');
      c.setAttribute('fill', '#3a5a2a');
      dots.appendChild(c);
    }
    if (foundIt) n++;
  }
  count.textContent = n + ' / ' + NOTES.length;
}
