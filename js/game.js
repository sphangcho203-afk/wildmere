import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import {
  WORLD, WATER_Y, SEED,
  vnoise, riverDist, heightAt,
  makeTree, treeKindAt, addBerryBush,
  makeHuman, makeRiverWater, currentPlace
} from './world.js';

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.72;
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x9bb3c0, 0.0062);
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.12, 900);
const blocker = document.getElementById('blocker');
let playing = false;
function enterValley(e){
  if (e) e.preventDefault();
  playing = true;
  blocker.style.display = 'none';
  document.body.classList.add('is-phone');
  const layer = document.getElementById('touch-layer');
  if (layer) layer.style.display = 'block';
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

const sky = new Sky();
sky.scale.setScalar(4500);
scene.add(sky);
const sun = new THREE.Vector3();
const skyU = sky.material.uniforms;
skyU.turbidity.value = 6; skyU.rayleigh.value = 2.2;
skyU.mieCoefficient.value = 0.005; skyU.mieDirectionalG.value = 0.75;
scene.add(new THREE.HemisphereLight(0xcfe6ff, 0x3d4a32, 0.7));
const dir = new THREE.DirectionalLight(0xfff1d0, 2);
dir.position.set(40, 70, 20);
dir.castShadow = true;
scene.add(dir);

const terrainGeo = new THREE.PlaneGeometry(WORLD, WORLD, 140, 140);
terrainGeo.rotateX(-Math.PI / 2);
const pos = terrainGeo.attributes.position;
const colors = [];
const _c = new THREE.Color();
for (let i = 0; i < pos.count; i++){
  const x = pos.getX(i), z = pos.getZ(i);
  const y = heightAt(x, z);
  pos.setY(i, y);
  const rd = riverDist(x, z);
  let col = 0x5c7840;
  if (y < WATER_Y + 0.35 && rd < 12) col = 0x8a7a52;
  else if (y > 15) col = 0x6e6a62;
  else if (y > 10) col = 0x6a7548;
  _c.setHex(col);
  colors.push(_c.r, _c.g, _c.b);
}
terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
terrainGeo.computeVertexNormals();
scene.add(new THREE.Mesh(terrainGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 })));

const waterMat = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.2, transparent: true, opacity: 0.72 });
scene.add(makeRiverWater(waterMat));

const interactives = [];
for (let i = 0; i < 1600 && interactives.filter(t => t.type === 'tree').length < 140; i++){
  const x = (Math.random() - 0.5) * (WORLD - 30);
  const z = (Math.random() - 0.5) * (WORLD - 30);
  const y = heightAt(x, z);
  if (y < WATER_Y + 0.8 || riverDist(x, z) < 8) continue;
  if (Math.hypot(x - 10, z - 26) < 14) continue;
  const tr = makeTree(0.85 + Math.random() * 0.45, treeKindAt(x, z));
  tr.position.set(x, y, z);
  scene.add(tr);
  interactives.push({ mesh: tr, type: 'tree', hp: 3, x, z, y });
}

const hero = makeHuman();
hero.position.set(10, heightAt(10, 26), 26);
scene.add(hero);

const player = { wood: 0, food: 0, stone: 0, health: 100, hunger: 100, thirst: 100, warmth: 72 };
const keys = { w:0, a:0, s:0, d:0 };
const stick = { x: 0, z: 0 };
let yaw = 0, pitch = 0.12;
let buildIndex = 0;
const BUILDS = [
  { id: 'post', label: 'wooden post', wood: 2 },
  { id: 'fire', label: 'campfire', wood: 5 },
  { id: 'cabin', label: 'small cabin', wood: 18, stone: 2 }
];

function toast(msg){
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 1400);
}
function hud(){
  const set = (id, v) => {
    const bar = document.querySelector('#' + id + ' i');
    const lab = document.querySelector('#' + id + ' .v');
    if (bar) bar.style.transform = 'scaleX(' + (Math.max(0, v) / 100) + ')';
    if (lab) lab.textContent = Math.round(v);
  };
  set('hp', player.health); set('hun', player.hunger); set('thirst', player.thirst); set('warm', player.warmth);
  const w = document.getElementById('wood-n'); if (w) w.textContent = player.wood;
  const f = document.getElementById('food-n'); if (f) f.textContent = player.food;
  const s = document.getElementById('stone-n'); if (s) s.textContent = player.stone;
  const b = document.getElementById('build-chip'); if (b) b.textContent = 'Build: ' + BUILDS[buildIndex].label;
}
hud();

function nearest(){
  let best = null, bd = 4;
  for (const it of interactives){
    if (!it.mesh.visible) continue;
    const d = Math.hypot(it.x - hero.position.x, it.z - hero.position.z);
    if (d < bd){ bd = d; best = it; }
  }
  return best;
}
function gather(){
  if (!playing) return;
  const it = nearest();
  if (!it){ toast('Walk closer to a tree'); return; }
  if (it.type === 'tree'){
    player.wood += 2; it.hp -= 1; it.mesh.scale.multiplyScalar(0.9);
    if (it.hp <= 0) it.mesh.visible = false;
    toast('+2 wood');
  }
  hud();
}
function place(){
  if (!playing) return;
  const spec = BUILDS[buildIndex];
  if (player.wood < spec.wood){ toast('Need ' + spec.wood + ' wood'); return; }
  player.wood -= spec.wood;
  const x = hero.position.x + Math.sin(hero.rotation.y) * 2.4;
  const z = hero.position.z + Math.cos(hero.rotation.y) * 2.4;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(spec.id === 'cabin' ? 3 : 0.2, spec.id === 'cabin' ? 1.8 : 1.6, spec.id === 'cabin' ? 3 : 0.2), new THREE.MeshStandardMaterial({ color: 0x6b5340 }));
  mesh.position.set(x, heightAt(x, z) + 0.8, z);
  scene.add(mesh);
  toast(spec.label); hud();
}

addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (keys[k] !== undefined) keys[k] = 1;
  if (k === 'e') gather();
  if (k === 'f') place();
});
addEventListener('keyup', e => {
  const k = e.key.toLowerCase();
  if (keys[k] !== undefined) keys[k] = 0;
});

(function touch(){
  const walk = document.getElementById('stick-walk');
  const look = document.getElementById('stick-look');
  if (!walk || !look) return;
  const bind = (el, fn) => {
    const go = ev => {
      const t = ev.changedTouches[0];
      const r = el.getBoundingClientRect();
      fn((t.clientX - r.left) / r.width * 2 - 1, (t.clientY - r.top) / r.height * 2 - 1);
    };
    el.addEventListener('touchstart', e => { e.preventDefault(); go(e); }, { passive: false });
    el.addEventListener('touchmove', e => { e.preventDefault(); go(e); }, { passive: false });
    el.addEventListener('touchend', e => { e.preventDefault(); fn(0, 0); });
  };
  bind(walk, (x, y) => { stick.x = Math.max(-1, Math.min(1, x)); stick.z = Math.max(-1, Math.min(1, -y)); });
  let lx = 0, ly = 0;
  look.addEventListener('touchstart', e => { const t = e.changedTouches[0]; lx = t.clientX; ly = t.clientY; }, { passive: true });
  look.addEventListener('touchmove', e => {
    const t = e.changedTouches[0];
    yaw -= (t.clientX - lx) * 0.008;
    pitch = Math.max(-0.4, Math.min(0.7, pitch + (t.clientY - ly) * 0.006));
    lx = t.clientX; ly = t.clientY;
  }, { passive: true });
  const be = document.getElementById('btn-e'); if (be) be.addEventListener('click', gather);
  const bf = document.getElementById('btn-f'); if (bf) bf.addEventListener('click', place);
  const bq = document.getElementById('btn-q'); if (bq) bq.addEventListener('click', () => { buildIndex = (buildIndex + 1) % BUILDS.length; hud(); });
})();

const clock = new THREE.Clock();
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

function animate(){
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, clock.getDelta());
  const up = Math.max(0, Math.sin(clock.elapsedTime * 0.02));
  sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(48), 0.8);
  skyU.sunPosition.value.copy(sun);
  if (playing){
    const fx = Math.sin(yaw), fz = Math.cos(yaw);
    let mx = fx * stick.z + Math.cos(yaw) * stick.x;
    let mz = fz * stick.z - Math.sin(yaw) * stick.x;
    if (keys.w){ mx += fx; mz += fz; }
    if (keys.s){ mx -= fx; mz -= fz; }
    if (keys.d){ mx += Math.cos(yaw); mz -= Math.sin(yaw); }
    if (keys.a){ mx -= Math.cos(yaw); mz += Math.sin(yaw); }
    const len = Math.hypot(mx, mz);
    if (len > 0.12){
      mx /= len; mz /= len;
      hero.position.x += mx * 6 * dt;
      hero.position.z += mz * 6 * dt;
      hero.rotation.y = Math.atan2(mx, mz);
    }
    hero.position.x = THREE.MathUtils.clamp(hero.position.x, -200, 200);
    hero.position.z = THREE.MathUtils.clamp(hero.position.z, -200, 200);
    hero.position.y = heightAt(hero.position.x, hero.position.z);
    camera.position.set(
      hero.position.x - Math.sin(yaw) * 5.6,
      hero.position.y + 2.2 + pitch,
      hero.position.z - Math.cos(yaw) * 5.6
    );
    camera.lookAt(hero.position.x, hero.position.y + 1.35, hero.position.z);
    const pr = document.getElementById('prompt');
    if (pr) pr.textContent = nearest() ? 'E gather' : 'Left pad walk · right pad look';
    const pl = document.getElementById('place');
    if (pl) pl.textContent = currentPlace(hero.position.x, hero.position.z);
  }
  renderer.render(scene, camera);
}
animate();
