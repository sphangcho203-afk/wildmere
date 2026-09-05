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
  makeStillGate, atStillGate,
  makeShadePool, atShadePool,
  addDistantRidges, addGrassTufts, addValleyBirds, stepBirds
} from './world.js';
import { atSlowBend, placeSlowBend } from './bend.js';
import { loadNotes, saveNotes, noteForPlace, renderNotebook } from './notebook.js';
import { makePassingRain, stepRain, rainWanted } from './weather.js';

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
let foundRing = false;
let foundMoss = false;
let foundWell = false;
let foundPine = false;
let foundHollow = false;
let foundStep = false;
let foundCairn = false;
let foundPool = false;
let foundGate = false;
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
