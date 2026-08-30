import { TERRACE_X, TERRACE_Z } from './world.js';
import { WELL_X, WELL_Z } from './places.js';
import { slowBendCenter } from './bend.js';

const SAVE_NOTES = 'wildmere-notes-v1';

export const NOTES = [
  {
    id: 'clearing',
    name: 'The Clearing',
    line: 'Open grass. A good place to start a day.',
    x: 10,
    z: 26,
    mapX: 52,
    mapY: 58
  },
  {
    id: 'crossing',
    name: 'Reedford Crossing',
    line: 'The stream cuts the valley and keeps its own time.',
    x: 4,
    z: 18,
    mapX: 48,
    mapY: 48
  },
  {
    id: 'ring',
    name: 'The Old Ring',
    line: 'Eight stones. Older than the pines around them.',
    x: -18,
    z: 8,
    mapX: 38,
    mapY: 50
  },
  {
    id: 'moss',
    name: 'The Moss Seat',
    line: 'A low curve of stone with a soft pad. A pause.',
    x: 32,
    z: -14,
    mapX: 68,
    mapY: 42
  },
  {
    id: 'well',
    name: 'The Quiet Well',
    line: 'Someone kept this water. It is still cool.',
    x: WELL_X,
    z: WELL_Z,
    mapX: 74,
    mapY: 54
  },
  {
    id: 'bend',
    name: 'The Slow Bend',
    line: 'The water holds here. Fish move under the plank.',
    x: 0,
    z: 48,
    mapX: 50,
    mapY: 72
  },
  {
    id: 'pines',
    name: 'The Quiet Pines',
    line: 'Thicker timber. The light thins between trunks.',
    x: 40,
    z: 40,
    mapX: 72,
    mapY: 66
  },
  {
    id: 'spine',
    name: 'High Spine',
    line: 'The ground lifts. Wind finds you first.',
    x: -40,
    z: -50,
    mapX: 30,
    mapY: 32
  },
  {
    id: 'terrace',
    name: 'The Stone Terrace',
    line: 'Pale shelves and a small cairn. The sky stays open.',
    x: TERRACE_X,
    z: TERRACE_Z,
    mapX: 22,
    mapY: 18
  }
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
        (known ? n.name : '—') + '</b><span>' +
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
