import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import {
  WORLD, WATER_Y, EYE, SEED, SAVE_KEY,
  vnoise, fbm, riverDist, heightAt,
  makeTree, addBerryBush, makeDeer, currentPlace
} from './world.js';

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.72;
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x9bb3c0, 0.0062);
const camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.12, 980);
const controls = new PointerLockControls(camera, document.body);
const blocker = document.getElementById('blocker');
document.getElementById('start-btn').addEventListener('click', () => controls.lock());
controls.addEventListener('lock', () => { blocker.style.display = 'none'; });
controls.addEventListener('unlock', () => { blocker.style.display = 'flex'; });

const sky = new Sky();
sky.scale.setScalar(4500);
scene.add(sky);
const sun = new THREE.Vector3();
const skyU = sky.material.uniforms;
skyU.turbidity.value = 6; skyU.rayleigh.value = 2.2;
skyU.mieCoefficient.value = 0.005; skyU.mieDirectionalG.value = 0.75;
const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x3d4a32, 0.55);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xfff1d0, 2.1);
dir.castShadow = true;
dir.shadow.mapSize.set(2048, 2048);
dir.shadow.camera.near = 2; dir.shadow.camera.far = 240;
dir.shadow.camera.left = -90; dir.shadow.camera.right = 90;
dir.shadow.camera.top = 90; dir.shadow.camera.bottom = -90;
dir.shadow.bias = -0.0004;
scene.add(dir); scene.add(dir.target);

const SEG = 168;
const terrainGeo = new THREE.PlaneGeometry(WORLD, WORLD, SEG, SEG);
terrainGeo.rotateX(-Math.PI / 2);
const pos = terrainGeo.attributes.position;
const colors = [];
const _c = new THREE.Color();
for (let i = 0; i < pos.count; i++){
  const x = pos.getX(i), z = pos.getZ(i);
  const y = heightAt(x, z);
  pos.setY(i, y);
  const rd = riverDist(x, z);
  let col;
  if (y < WATER_Y + 0.35 && rd < 12) col = y < WATER_Y + 0.05 ? 0x6a5a3e : 0x8a7a52;
  else if (y > 15) col = 0x6e6a62;
  else if (y > 10) col = 0x6a7548;
  else col = vnoise(x * 0.04, z * 0.04) > 0.55 ? 0x4f6a38 : 0x5c7840;
  _c.setHex(col);
  _c.offsetHSL(0, 0, (vnoise(x * 0.2, z * 0.2) - 0.5) * 0.08);
  colors.push(_c.r, _c.g, _c.b);
}
terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
terrainGeo.computeVertexNormals();
scene.add(new THREE.Mesh(terrainGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0.02 })));

const waterMat = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.18, metalness: 0.08, transparent: true, opacity: 0.72 });
const water = new THREE.Mesh(new THREE.PlaneGeometry(WORLD, WORLD), waterMat);
water.rotation.x = -Math.PI / 2; water.position.y = WATER_Y;
scene.add(water);

const interactives = [];
const builds = [];
const plants = [];
const fires = [];
const deerList = [];
const fireflies = [];

function placeNature(){
  for (let i = 0; i < 2800 && interactives.filter(t => t.type==='tree').length < 230; i++){
    const x = (Math.random() - 0.5) * (WORLD - 24);
    const z = (Math.random() - 0.5) * (WORLD - 24);
    const y = heightAt(x, z);
    if (y < WATER_Y + 0.7 || riverDist(x, z) < 8) continue;
    if (Math.hypot(x - 4, z - 18) < 16 && Math.random() < 0.72) continue;
    if (fbm(x * 0.01 + 3, z * 0.01 + 9, 3) < 0.42 && Math.random() < 0.55) continue;
    const tr = makeTree(0.85 + Math.random() * 0.5);
    tr.position.set(x, y, z); tr.rotation.y = Math.random() * 6.28;
    scene.add(tr);
    interactives.push({ mesh: tr, type: 'tree', hp: 3, x, z, y });
  }
  for (let i = 0; i < 64; i++){
    const x = (Math.random() - 0.5) * WORLD * 0.7;
    const z = (Math.random() - 0.5) * WORLD * 0.7;
    const y = heightAt(x, z);
    if (y < WATER_Y + 0.6 || riverDist(x, z) < 7) continue;
    const bush = addBerryBush(scene, x, y, z, true);
    interactives.push({ mesh: bush, type: 'berry', hp: 1, x, z, y });
  }
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95 });
  for (let i = 0; i < 48; i++){
    const x = (Math.random() - 0.5) * WORLD * 0.85;
    const z = (Math.random() - 0.5) * WORLD * 0.85;
    const y = heightAt(x, z);
    if (y < WATER_Y + 0.4) continue;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35 + Math.random() * 0.7, 0), rockMat);
    rock.position.set(x, y + 0.15, z);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    scene.add(rock);
    interactives.push({ mesh: rock, type: 'rock', hp: 2, x, z, y });
  }
}
placeNature();

for (let i = 0; i < 7; i++){
  const x = (Math.random() - 0.5) * 120;
  const z = (Math.random() - 0.5) * 120;
  const y = heightAt(x, z);
  if (y < WATER_Y + 1) continue;
  const d = makeDeer();
  d.position.set(x, y, z);
  scene.add(d);
  deerList.push({ mesh: d, x, z, a: Math.random() * 6.28, wait: Math.random() * 4 });
}
for (let i = 0; i < 80; i++){
  const ff = new THREE.Mesh(new THREE.SphereGeometry(0.035, 5, 4), new THREE.MeshBasicMaterial({ color: 0xd8e88a }));
  ff.visible = false;
  scene.add(ff);
  fireflies.push({ mesh: ff, p: Math.random() * 6.28, r: 2 + Math.random() * 6, h: 0.8 + Math.random() * 1.8, ox: 0, oz: 0 });
}

const player = { health: 100, hunger: 100, thirst: 100, warmth: 72, wood: 0, food: 0, stone: 0, axe: false, vy: 0, onGround: true };
const BUILD_KINDS = [
  { id: 'post', label: 'wooden post', wood: 2 },
  { id: 'wall', label: 'short wall', wood: 4 },
  { id: 'lean', label: 'lean-to', wood: 8 },
  { id: 'fire', label: 'campfire', wood: 5 }
];
let buildIndex = 0;
const keys = { w:0, a:0, s:0, d:0, shift:0 };
let worldTime = 0.22;

function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 1600);
}
function updateHUD(){
  const set = (id, val) => {
    const el = document.getElementById(id);
    el.querySelector('i').style.transform = `scaleX(${Math.max(0, Math.min(100, val))/100})`;
    el.querySelector('.v').textContent = Math.round(val);
  };
  set('hp', player.health); set('hun', player.hunger); set('thirst', player.thirst); set('warm', player.warmth);
  document.getElementById('wood-n').textContent = player.wood;
  document.getElementById('food-n').textContent = player.food;
  document.getElementById('stone-n').textContent = player.stone;
  document.getElementById('axe-n').textContent = player.axe ? 'yes' : 'no';
  document.getElementById('build-chip').textContent = 'Build: ' + BUILD_KINDS[buildIndex].label;
}
updateHUD();

const lookN = new THREE.Vector3();
function aimedInteractive(){
  camera.getWorldDirection(lookN);
  let best = null, bestD = 9;
  for (const it of interactives){
    if (!it.mesh.visible) continue;
    const dx = it.x - camera.position.x, dz = it.z - camera.position.z;
    const d = Math.hypot(dx, dz);
    if (d > 4.2) continue;
    if (lookN.x * dx + lookN.z * dz < 0.12) continue;
    if (d < bestD){ bestD = d; best = it; }
  }
  return best;
}
function frontPoint(dist = 2.5){
  camera.getWorldDirection(lookN);
  const px = camera.position.x + lookN.x * dist;
  const pz = camera.position.z + lookN.z * dist;
  return { x: px, z: pz, y: heightAt(px, pz) };
}
function placeBuild(kind, x, y, z, yaw){
  const g = new THREE.Group();
  const woodM = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.85 });
  if (kind === 'post'){
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.6, 0.18), woodM);
    p.position.y = 0.8; p.castShadow = true; g.add(p);
  } else if (kind === 'wall'){
    const w = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.35, 0.14), woodM);
    w.position.y = 0.68; w.castShadow = true; g.add(w);
  } else if (kind === 'lean'){
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.5, 0.12), woodM);
    back.position.set(0, 0.75, -0.7); g.add(back);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.8), woodM);
    roof.position.set(0, 1.45, 0.05); roof.rotation.x = -0.35; g.add(roof);
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 1.4), woodM);
    side.position.set(-1.15, 0.6, 0); g.add(side);
  } else if (kind === 'fire'){
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.08, 6, 10), new THREE.MeshStandardMaterial({ color: 0x4a3a2a }));
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.08; g.add(ring);
    const glow = new THREE.PointLight(0xff8844, 1.7, 9);
    glow.position.y = 0.4; g.add(glow);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.45, 6), new THREE.MeshBasicMaterial({ color: 0xff6622 }));
    flame.position.y = 0.38; g.add(flame);
  }
  g.position.set(x, y, z);
  g.rotation.y = yaw || 0;
  scene.add(g);
  const rec = { kind, x, y, z, yaw: yaw || 0, mesh: g };
  builds.push(rec);
  if (kind === 'fire') fires.push(rec);
  return rec;
}

function tryInteract(){
  if (!controls.isLocked) return;
  const it = aimedInteractive();
  if (!it) return;
  const dmg = player.axe && it.type !== 'berry' ? 2 : 1;
  it.hp -= dmg;
  if (it.type === 'tree'){
    const got = player.axe ? 2 : 1;
    player.wood += got;
    toast('+' + got + ' wood');
    it.mesh.scale.multiplyScalar(0.9);
    if (it.hp <= 0){ it.mesh.visible = false; player.wood += 2; toast('Tree down'); }
  } else if (it.type === 'berry'){
    player.food += 2; it.mesh.visible = false; it.hp = 0; toast('+2 berries');
  } else if (it.type === 'rock'){
    player.stone += player.axe ? 2 : 1;
    toast('+' + (player.axe ? 2 : 1) + ' stone');
    it.mesh.scale.multiplyScalar(0.85);
    if (it.hp <= 0) it.mesh.visible = false;
  }
  updateHUD();
}
function tryBuild(){
  if (!controls.isLocked) return;
  const spec = BUILD_KINDS[buildIndex];
  if (player.wood < spec.wood){ toast('Need ' + spec.wood + ' wood'); return; }
  const p = frontPoint(2.6);
  camera.getWorldDirection(lookN);
  player.wood -= spec.wood;
  placeBuild(spec.id, p.x, p.y, p.z, Math.atan2(lookN.x, lookN.z));
  toast(spec.label); updateHUD();
}
function plantBush(){
  if (!controls.isLocked) return;
  if (player.food < 1){ toast('Need a berry to plant'); return; }
  const p = frontPoint(2.2);
  if (p.y < WATER_Y + 0.5 || riverDist(p.x, p.z) < 6){ toast('Too wet here'); return; }
  player.food -= 1;
  const mesh = addBerryBush(scene, p.x, p.y, p.z, false);
  plants.push({ x: p.x, y: p.y, z: p.z, age: 0, mesh, grown: false });
  toast('Planted'); updateHUD();
}
function eat(){
  if (player.food <= 0){ toast('No berries'); return; }
  player.food -= 1;
  player.hunger = Math.min(100, player.hunger + 22);
  player.health = Math.min(100, player.health + 4);
  toast('Ate a berry'); updateHUD();
}
function drink(){
  const rd = riverDist(camera.position.x, camera.position.z);
  const y = heightAt(camera.position.x, camera.position.z);
  if (rd < 8 && y < WATER_Y + 2.2){
    player.thirst = Math.min(100, player.thirst + 35);
    toast('Drank from the stream'); updateHUD();
  } else toast('Stand in the stream');
}
function craftAxe(){
  if (player.axe){ toast('You already have an axe'); return; }
  if (player.wood < 3 || player.stone < 2){ toast('Need 3 wood and 2 stone'); return; }
  player.wood -= 3; player.stone -= 2; player.axe = true;
  toast('Hand axe'); updateHUD();
}
let sleeping = false;
let sleepUntil = 0;
function rest(){
  if (!controls.isLocked || sleeping) return;
  const near = fires.some(f => Math.hypot(f.x - camera.position.x, f.z - camera.position.z) < 4);
  if (!near){ toast('Rest beside a fire'); return; }
  const elev = Math.sin(worldTime * Math.PI * 2) * 42;
  if (elev > 6){ toast('It is still light'); return; }
  // Advance through the rest of the night into morning instead of snapping the clock.
  const target = worldTime < 0.5 ? 0.21 : 1.21;
  sleeping = true;
  sleepUntil = target;
  toast('You close your eyes by the fire');
}
function tickSleep(dt){
  if (!sleeping) return;
  // One full day is 420s of real time; sleep covers remaining night in ~4–5s of real time.
  const remaining = sleepUntil - worldTime;
  if (remaining <= 0.002){
    worldTime = sleepUntil % 1;
    sleeping = false;
    player.health = Math.min(100, player.health + 28);
    player.warmth = Math.min(100, player.warmth + 40);
    player.hunger = Math.max(8, player.hunger - 12);
    player.thirst = Math.max(8, player.thirst - 10);
    toast('Morning finds you by the fire');
    updateHUD();
    return;
  }
  const step = Math.min(remaining, dt * 0.18);
  worldTime += step;
  player.warmth = Math.min(100, player.warmth + dt * 6);
  player.hunger = Math.max(4, player.hunger - dt * 1.4);
  player.thirst = Math.max(4, player.thirst - dt * 1.1);
}
function saveGame(){
  const data = {
    player, worldTime,
    px: camera.position.x, py: camera.position.y, pz: camera.position.z,
    builds: builds.map(b => ({ kind: b.kind, x: b.x, y: b.y, z: b.z, yaw: b.yaw })),
    plants: plants.map(p => ({ x: p.x, y: p.y, z: p.z, age: p.age, grown: p.grown })),
    gone: interactives.map((it, i) => !it.mesh.visible ? i : -1).filter(i => i >= 0)
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  toast('Saved');
}
function loadGame(){
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw){ toast('No save yet'); return; }
  const data = JSON.parse(raw);
  Object.assign(player, data.player);
  worldTime = data.worldTime ?? 0.22;
  camera.position.set(data.px, data.py, data.pz);
  for (const b of [...builds]) scene.remove(b.mesh);
  builds.length = 0; fires.length = 0;
  for (const b of data.builds || []) placeBuild(b.kind, b.x, b.y, b.z, b.yaw);
  for (const p of [...plants]) scene.remove(p.mesh);
  plants.length = 0;
  for (const p of data.plants || []){
    const mesh = addBerryBush(scene, p.x, p.y, p.z, !!p.grown);
    plants.push({ ...p, mesh });
    if (p.grown) interactives.push({ mesh, type: 'berry', hp: 1, x: p.x, z: p.z, y: p.y });
  }
  for (const i of data.gone || []){
    if (interactives[i]){ interactives[i].mesh.visible = false; interactives[i].hp = 0; }
  }
  updateHUD(); toast('Loaded');
}

addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'w' || k === 'a' || k === 's' || k === 'd') keys[k] = 1;
  if (e.key === 'Shift') keys.shift = 1;
  if (k === 'e') tryInteract();
  if (k === 'f') tryBuild();
  if (k === 'q'){ buildIndex = (buildIndex + 1) % BUILD_KINDS.length; updateHUD(); }
  if (k === 'g') plantBush();
  if (k === '1') eat();
  if (k === '2') drink();
  if (k === 'c') craftAxe();
  if (k === 'z') rest();
  if (k === 'k') saveGame();
  if (k === 'l') loadGame();
  if (e.key === 'Tab'){ e.preventDefault(); buildIndex = (buildIndex + 1) % BUILD_KINDS.length; updateHUD(); }
  if (e.code === 'Space' && player.onGround) player.vy = 6.2;
});
addEventListener('keyup', e => {
  const k = e.key.toLowerCase();
  if (k === 'w' || k === 'a' || k === 's' || k === 'd') keys[k] = 0;
  if (e.key === 'Shift') keys.shift = 0;
});

function headingLabel(){
  camera.getWorldDirection(lookN);
  const deg = ((Math.atan2(lookN.x, lookN.z) * 180 / Math.PI) + 360) % 360;
  return ['N','NE','E','SE','S','SW','W','NW'][Math.round(deg / 45) % 8];
}
function applySky(){
  const elev = Math.sin(worldTime * Math.PI * 2) * 42;
  sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elev), THREE.MathUtils.degToRad(worldTime * 360));
  skyU.sunPosition.value.copy(sun);
  const up = Math.max(0, Math.sin(worldTime * Math.PI * 2));
  dir.position.copy(sun).multiplyScalar(90);
  dir.intensity = 0.15 + up * 2.05;
  dir.color.setHSL(0.09, 0.35, 0.72 + up * 0.2);
  hemi.intensity = 0.18 + up * 0.5;
  renderer.toneMappingExposure = 0.38 + up * 0.42;
  scene.fog.color.setHSL(0.55, 0.15 + up * 0.12, 0.18 + up * 0.45);
  waterMat.color.setHSL(0.52, 0.35, 0.18 + up * 0.22);
  const label = elev > 18 ? 'Day' : elev > 4 ? (worldTime % 1 < 0.5 ? 'Morning' : 'Evening') : elev > -6 ? (worldTime % 1 < 0.5 ? 'Dawn' : 'Dusk') : 'Night';
  document.getElementById('clock').textContent = label;
  return { elev, up };
}

camera.position.set(4, heightAt(4, 18) + EYE, 18);
document.getElementById('seedline').textContent = 'seed ' + SEED;
const clock = new THREE.Clock();
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

function animate(){
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, clock.getDelta());
  if (sleeping){
    tickSleep(dt);
  } else {
    worldTime = (worldTime + dt / 420) % 1;
  }
  const skyState = applySky();
  if (controls.isLocked && !sleeping){
    const speed = (keys.shift ? 9.2 : 4.6);
    camera.getWorldDirection(forward); forward.y = 0; forward.normalize();
    right.crossVectors(forward, camera.up).normalize();
    let mx = 0, mz = 0;
    if (keys.w){ mx += forward.x; mz += forward.z; }
    if (keys.s){ mx -= forward.x; mz -= forward.z; }
    if (keys.d){ mx += right.x; mz += right.z; }
    if (keys.a){ mx -= right.x; mz -= right.z; }
    const len = Math.hypot(mx, mz);
    if (len > 0){ mx /= len; mz /= len; }
    camera.position.x += mx * speed * dt;
    camera.position.z += mz * speed * dt;
    const gh = heightAt(camera.position.x, camera.position.z);
    const waterHere = riverDist(camera.position.x, camera.position.z) < 7.5 && gh < WATER_Y + 0.8;
    const floor = waterHere ? Math.max(gh, WATER_Y - 0.35) : gh;
    player.vy -= 18 * dt;
    camera.position.y += player.vy * dt;
    if (camera.position.y <= floor + EYE){ camera.position.y = floor + EYE; player.vy = 0; player.onGround = true; }
    else player.onGround = false;
    const lim = WORLD * 0.48;
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -lim, lim);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -lim, lim);
    const nearFire = fires.some(f => Math.hypot(f.x - camera.position.x, f.z - camera.position.z) < 3.6);
    if (nearFire) player.warmth = Math.min(100, player.warmth + dt * 18);
    else player.warmth -= dt * (skyState.up < 0.15 ? 2.4 : 0.35);
    player.hunger = Math.max(0, player.hunger - dt * 0.48);
    player.thirst = Math.max(0, player.thirst - dt * 0.64);
    player.warmth = Math.max(0, player.warmth);
    if (player.hunger <= 0 || player.thirst <= 0 || player.warmth <= 8) player.health -= dt * 2.2;
    else if (player.health < 100) player.health += dt * 0.7;
    player.health = Math.max(0, Math.min(100, player.health));
    const it = aimedInteractive();
    const pr = document.getElementById('prompt');
    if (it && it.mesh.visible) pr.textContent = it.type === 'tree' ? 'E  gather wood' : it.type === 'berry' ? 'E  pick berries' : 'E  gather stone';
    else if (riverDist(camera.position.x, camera.position.z) < 8 && gh < WATER_Y + 2.2) pr.textContent = '2  drink from the stream';
    else if (nearFire && skyState.up < 0.12) pr.textContent = 'Z  rest till morning';
    else pr.textContent = '';
    document.getElementById('compass').childNodes[0].textContent = headingLabel();
    document.getElementById('place').textContent = currentPlace(camera.position.x, camera.position.z);
    if ((Math.floor(clock.elapsedTime * 3) % 6) === 0) updateHUD();
  }
  for (const d of deerList){
    d.wait -= dt;
    if (d.wait <= 0){ d.a += (Math.random() - 0.5) * 1.2; d.wait = 2 + Math.random() * 5; }
    const scare = Math.hypot(d.x - camera.position.x, d.z - camera.position.z) < 9;
    const spd = scare ? 5.5 : 1.1;
    d.x += Math.sin(d.a) * spd * dt;
    d.z += Math.cos(d.a) * spd * dt;
    if (scare) d.a = Math.atan2(d.x - camera.position.x, d.z - camera.position.z);
    d.x = THREE.MathUtils.clamp(d.x, -180, 180);
    d.z = THREE.MathUtils.clamp(d.z, -180, 180);
    const hy = heightAt(d.x, d.z);
    if (hy < WATER_Y + 0.4) d.a += 1.2;
    d.mesh.position.set(d.x, hy, d.z);
    d.mesh.rotation.y = d.a;
  }
  for (const p of plants){
    if (p.grown) continue;
    p.age += dt;
    const t = Math.min(1, p.age / 90);
    p.mesh.scale.setScalar(0.35 + t * 0.65);
    if (t >= 1){
      p.grown = true;
      scene.remove(p.mesh);
      p.mesh = addBerryBush(scene, p.x, p.y, p.z, true);
      interactives.push({ mesh: p.mesh, type: 'berry', hp: 1, x: p.x, z: p.z, y: p.y });
    }
  }
  const night = skyState.up < 0.22;
  for (let i = 0; i < fireflies.length; i++){
    const f = fireflies[i];
    f.mesh.visible = night;
    if (!night) continue;
    if (f.ox === 0 && i === 0){
      const origin = fires[0] || { x: camera.position.x, z: camera.position.z };
      for (const ff of fireflies){ ff.ox = origin.x + (Math.random()-0.5)*18; ff.oz = origin.z + (Math.random()-0.5)*18; }
    }
    f.p += dt * (0.4 + (i % 5) * 0.1);
    const y = heightAt(f.ox, f.oz) + f.h + Math.sin(f.p * 2) * 0.25;
    f.mesh.position.set(f.ox + Math.cos(f.p) * f.r, y, f.oz + Math.sin(f.p * 0.8) * f.r);
  }
  water.position.y = WATER_Y + Math.sin(clock.elapsedTime * 0.6) * 0.03;
  renderer.render(scene, camera);
}
applySky();
animate();
