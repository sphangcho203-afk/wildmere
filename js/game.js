import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import {
  WORLD, WATER_Y, SEED,
  vnoise, fbm, riverDist, heightAt,
  makeTree, treeKindAt, addBerryBush, makeDeer,
  makeHuman, makeRiverWater, currentPlace
} from './world.js';

const isPhone = (navigator.maxTouchPoints || 0) > 0 || innerWidth < 900;
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
  document.getElementById('touch-layer').style.display = 'block';
  if (document.pointerLockElement) document.exitPointerLock();
}
document.getElementById('start-btn').addEventListener('click', enterValley);
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
  _c.offsetHSL(0, 0, (vnoise(x * 0.2, z * 0.2) - 0.5) * 0.08);
  colors.push(_c.r, _c.g, _c.b);
}
terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
terrainGeo.computeVertexNormals();
scene.add(new THREE.Mesh(terrainGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 })));

const waterMat = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.2, transparent: true, opacity: 0.72 });
scene.add(makeRiverWater(waterMat));

const interactives = [];
for (let i = 0; i < 2000 && interactives.filter(t => t.type === 'tree').length < 180; i++){
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
for (let i = 0; i < 40; i++){
  const x = (Math.random() - 0.5) * 140, z = (Math.random() - 0.5) * 140;
  const y = heightAt(x, z);
  if (y < WATER_Y + 0.7 || riverDist(x, z) < 7) continue;
  const bush = addBerryBush(scene, x, y, z, true);
  interactives.push({ mesh: bush, type: 'berry', hp: 1, x, z, y });
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
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 1400);
}
function hud(){
  const set = (id, v) => {
    document.querySelector('#' + id + ' i').style.transform = 'scaleX(' + (Math.max(0, v) / 100) + ')';
    document.querySelector('#' + id + ' .v').textContent = Math.round(v);
  };
  set('hp', player.health); set('hun', player.hunger); set('thirst', player.thirst); set('warm', player.warmth);
  document.getElementById('wood-n').textContent = player.wood;
  document.getElementById('food-n').textContent = player.food;
  document.getElementById('stone-n').textContent = player.stone;
  document.getElementById('build-chip').textContent = 'Build: ' + BUILDS[buildIndex].label;
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
  if (!it){ toast('Nothing close'); return; }
  if (it.type === 'tree'){
    player.wood += 2; it.hp -= 1; it.mesh.scale.multiplyScalar(0.9);
    if (it.hp <= 0) it.mesh.visible = false;
    toast('+2 wood');
  } else if (it.type === 'berry'){
    player.food += 2; it.mesh.visible = false; toast('+2 berries');
  }
  hud();
}
function place(){
  if (!playing) return;
  const spec = BUILDS[buildIndex];
  if (player.wood < spec.wood || player.stone < (spec.stone || 0)){
    toast('Need ' + spec.wood + ' wood'); return;
  }
  player.wood -= spec.wood;
  const x = hero.position.x + Math.sin(hero.rotation.y) * 2.4;
  const z = hero.position.z + Math.cos(hero.rotation.y) * 2.4;
  const y = heightAt(x, z);
  const woodM = new THREE.MeshStandardMaterial({ color: 0x6b5340 });
  let mesh;
  if (spec.id === 'post') mesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.6, 0.18), woodM);
  else if (spec.id === 'fire'){
    mesh = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 6), new THREE.MeshBasicMaterial({ color: 0xff6622 }));
  } else {
    mesh = new THREE.Mesh(new THREE.BoxGeometry(3, 1.8, 3), woodM);
  }
  mesh.position.set(x, y + 0.8, z);
  scene.add(mesh);
  toast(spec.label); hud();
}

addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (keys[k] !== undefined) keys[k] = 1;
  if (k === 'e') gather();
  if (k === 'f') place();
  if (k === 'q' || e.key === 'Tab'){ e.preventDefault(); buildIndex = (buildIndex + 1) % BUILDS.length; hud(); }
  if (k === '1' && player.food){ player.food--; player.hunger = Math.min(100, player.hunger + 22); hud(); }
  if (k === '2' && riverDist(hero.position.x, hero.position.z) < 9){
    player.thirst = Math.min(100, player.thirst + 35); toast('Drank'); hud();
  }
});
addEventListener('keyup', e => {
  const k = e.key.toLowerCase();
  if (keys[k] !== undefined) keys[k] = 0;
});

(function touch(){
  const walk = document.getElementById('stick-walk');
  const look = document.getElementById('stick-look');
  const layer = document.getElementById('touch-layer');
  layer.style.display = 'block';
  document.body.classList.add('is-phone');
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
  document.getElementById('btn-e').addEventListener('click', gather);
  document.getElementById('btn-f').addEventListener('click', place);
  document.getElementById('btn-g').addEventListener('click', () => {
    if (player.food < 1){ toast('Need a berry'); return; }
    player.food--; toast('Planted'); hud();
  });
  document.getElementById('btn-q').addEventListener('click', () => { buildIndex = (buildIndex + 1) % BUILDS.length; hud(); });
})();

let worldTime = 0.22;
const clock = new THREE.Clock();
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

function animate(){
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, clock.getDelta());
  worldTime = (worldTime + dt / 420) % 1;
  const up = Math.max(0, Math.sin(worldTime * Math.PI * 2));
  sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - up * 42), worldTime * 6.28);
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
    const back = 5.6;
    camera.position.set(
      hero.position.x - Math.sin(yaw) * back,
      hero.position.y + 2.2 + pitch,
      hero.position.z - Math.cos(yaw) * back
    );
    camera.lookAt(hero.position.x, hero.position.y + 1.35, hero.position.z);
    const it = nearest();
    const pr = document.getElementById('prompt');
    if (it) pr.textContent = it.type === 'tree' ? 'E gather wood' : 'E pick berries';
    else if (riverDist(hero.position.x, hero.position.z) < 8) pr.textContent = '2 drink';
    else pr.textContent = 'Left pad walk · right pad look';
    document.getElementById('place').textContent = currentPlace(hero.position.x, hero.position.z);
  }
  renderer.render(scene, camera);
}
animate();
document.getElementById('seedline').textContent = 'seed ' + SEED;
