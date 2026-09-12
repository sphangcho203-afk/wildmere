import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import {
  WORLD, WATER_Y, SEED,
  riverDist, heightAt,
  makeTree, treeKindAt, addBerryBush,
  makeHuman, makeRiverWater, currentPlace, makeStoneRing, makeMossSeat,
  makeQuietWell, atQuietWell,
  makeListeningPine, atListeningPine,
  makeWindHollow, atWindHollow,
  makeReedStep, atReedStep,
  makeLowCairn, atLowCairn,
  makeShadePool, atShadePool,
  makeSplitOak, atSplitOak,
  makeStillGate, atStillGate,
  makeWashRock, atWashRock,
  makeLarkPost, atLarkPost,
  makeFernStair, atFernStair,
  makeEveningBell, atEveningBell,
  makeRowanLean, atRowanLean,
  makeWillowDip, atWillowDip,
  makeHoneyStone, atHoneyStone,
  makeThistleSeat, atThistleSeat,
  addDistantRidges, addGrassTufts, addValleyBirds, stepBirds
} from './world.js';
import { atSlowBend, placeSlowBend } from './bend.js';
import { loadNotes, saveNotes, noteForPlace, renderNotebook } from './notebook.js';
import { makePassingRain, stepRain, rainWanted } from './weather.js';
import { bootTick } from './boot-tick.js';

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.75;
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x9bb3c0, 0.0055);
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.12, 1100);
const blocker = document.getElementById('blocker');
let playing = false;
const foundNotes = loadNotes();
let notebookOpen = false;
function enterValley(e){
  if (e) e.preventDefault();
  playing = true;
  blocker.style.display = 'none';
  document.body.classList.add('is-phone');
  const layer = document.getElementById('touch-layer');
  if (layer) layer.style.display = 'block';
  ['controls-help', 'build-chip'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
  if (document.pointerLockElement) document.exitPointerLock();
}
const startBtn = document.getElementById('start-btn');
if (startBtn){
  startBtn.addEventListener('click', enterValley);
  startBtn.addEventListener('touchend', enterValley, { passive: false });
}
if (blocker) blocker.addEventListener('click', (e) => { if (!playing) enterValley(e); });
document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement) document.exitPointerLock();
});

const sky = new Sky(); sky.scale.setScalar(4500); scene.add(sky);
const sun = new THREE.Vector3();
const skyU = sky.material.uniforms;
skyU.turbidity.value = 5; skyU.rayleigh.value = 2.1;
skyU.mieCoefficient.value = 0.005; skyU.mieDirectionalG.value = 0.75;
const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x3d4a32, 0.7);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xfff1d0, 2);
dir.castShadow = true; scene.add(dir);

const terrainGeo = new THREE.PlaneGeometry(WORLD, WORLD, 140, 140);
terrainGeo.rotateX(-Math.PI / 2);
const pos = terrainGeo.attributes.position;
const colors = [];
const _c = new THREE.Color();
for (let i = 0; i < pos.count; i++){
  const x = pos.getX(i), z = pos.getZ(i);
  const y = heightAt(x, z);
  pos.setY(i, y);
  let col = 0x5c7840;
  if (y < WATER_Y + 0.35 && riverDist(x, z) < 12) col = 0x8a7a52;
  else if (y > 15) col = 0x6e6a62;
  else if (y > 10) col = 0x6a7548;
  _c.setHex(col); colors.push(_c.r, _c.g, _c.b);
}
terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
terrainGeo.computeVertexNormals();
scene.add(new THREE.Mesh(terrainGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 })));
scene.add(makeRiverWater(new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.2, transparent: true, opacity: 0.72 })));

addDistantRidges(scene);
addGrassTufts(scene);
const birds = addValleyBirds(scene);
const rain = makePassingRain(scene);

const interactives = [];
const fires = [];
const plots = [];
function addThing(mesh, type, x, y, z, hp){
  mesh.position.set(x, type === 'rock' ? y + 0.2 : y, z);
  scene.add(mesh);
  interactives.push({ mesh, type, hp, x, z, y });
}
for (let a = 0; a < 10; a++){
  const ang = a * 0.63, r = 11 + (a % 3) * 3;
  const x = 10 + Math.cos(ang) * r, z = 26 + Math.sin(ang) * r;
  const y = heightAt(x, z);
  if (y < WATER_Y + 0.6) continue;
  addThing(makeTree(0.9, treeKindAt(x, z)), 'tree', x, y, z, 3);
}
for (let i = 0; i < 1200 && interactives.filter(t => t.type === 'tree').length < 110; i++){
  const x = (Math.random() - 0.5) * 380, z = (Math.random() - 0.5) * 380;
  const y = heightAt(x, z);
  if (y < WATER_Y + 0.8 || riverDist(x, z) < 8 || Math.hypot(x - 10, z - 26) < 9 || Math.hypot(x - 58, z + 38) < 7 || Math.hypot(x + 36, z - 42) < 7 || Math.hypot(x + 0.75, z + 22) < 8 || Math.hypot(x + 52, z - 16) < 8 || Math.hypot(x - 24, z - 56) < 8 || Math.hypot(x + 22, z - 28) < 7 || Math.hypot(x + 8, z + 48) < 7 || Math.hypot(x - 52, z - 38) < 7 || Math.hypot(x + 28, z + 44) < 7 || Math.hypot(x - 38, z - 22) < 7 || Math.hypot(x - 24, z + 32) < 8 || Math.hypot(x - 22, z - 54) < 8) continue;
  addThing(makeTree(0.8 + Math.random() * 0.5, treeKindAt(x, z)), 'tree', x, y, z, 3);
}
for (let i = 0; i < 16; i++){
  const a = Math.random() * 6.28, r = 8 + Math.random() * 24;
  const x = 10 + Math.cos(a) * r, z = 26 + Math.sin(a) * r;
  const y = heightAt(x, z);
  if (y < WATER_Y + 0.5 || riverDist(x, z) < 6) continue;
  addThing(addBerryBush(scene, x, y, z), 'berry', x, y, z, 1);
}
const rockMat = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95 });
for (let i = 0; i < 14; i++){
  const a = Math.random() * 6.28, r = 7 + Math.random() * 20;
  const x = 10 + Math.cos(a) * r, z = 26 + Math.sin(a) * r;
  const y = heightAt(x, z);
  addThing(new THREE.Mesh(new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.3, 0), rockMat), 'rock', x, y, z, 2);
}

const hero = makeHuman();
hero.position.set(10, heightAt(10, 26), 26);
scene.add(hero);
makeStoneRing(scene, -18, 8);
makeMossSeat(scene, 32, -14);
makeQuietWell(scene);
const listeningPine = makeListeningPine(scene);
const windHollow = makeWindHollow(scene);
const reedStep = makeReedStep(scene);
const lowCairn = makeLowCairn(scene);
const shadePool = makeShadePool(scene);
const splitOak = makeSplitOak(scene);
const stillGate = makeStillGate(scene);
const washRock = makeWashRock(scene);
const larkPost = makeLarkPost(scene);
const fernStair = makeFernStair(scene);
const eveningBell = makeEveningBell(scene);
const rowanLean = makeRowanLean(scene);
const willowDip = makeWillowDip(scene);
const honeyStone = makeHoneyStone(scene);
const thistleSeat = makeThistleSeat(scene);
const slowBend = placeSlowBend(scene);
renderNotebook(foundNotes);

const player = { wood: 0, food: 0, stone: 0, fish: 0, health: 100, hunger: 100, thirst: 100, warmth: 74 };

bootTick({
  scene, camera, renderer, hero, birds, rain,
  fernStair, larkPost, eveningBell, washRock, windHollow, rowanLean, willowDip, honeyStone, thistleSeat,
  skyU, sun, dir, hemi,
  WATER_Y, foundNotes, interactives, fires, plots, player,
  atQuietWell, atShadePool, atSlowBend, atEveningBell, atRowanLean, atWillowDip, atHoneyStone, atThistleSeat,
  getPlaying: () => playing,
  setNotebookOpen: (v) => { notebookOpen = v; },
  getNotebookOpen: () => notebookOpen
});
