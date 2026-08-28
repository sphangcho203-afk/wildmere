import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import {
  WORLD, WATER_Y, SEED,
  riverDist, heightAt,
  makeTree, treeKindAt, addBerryBush,
  makeHuman, makeRiverWater, currentPlace, makeStoneRing, makeMossSeat,
  addDistantRidges, addGrassTufts, addValleyBirds, stepBirds
} from './world.js';

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
  if (y < WATER_Y + 0.8 || riverDist(x, z) < 8 || Math.hypot(x - 10, z - 26) < 9) continue;
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

const player = { wood: 0, food: 0, stone: 0, health: 100, hunger: 100, thirst: 100, warmth: 74 };
const keys = { w:0, a:0, s:0, d:0 };
const stick = { x: 0, z: 0 };
let yaw = 0.4, pitch = 0.12, buildIndex = 0, worldTime = 0.22, cropIndex = 0;
let resting = false;
let restTarget = 0;
let restSpeed = 0;
const BUILDS = [
  { id: 'post', label: 'wooden post', wood: 2 },
  { id: 'fire', label: 'campfire', wood: 5 },
  { id: 'cabin', label: 'small cabin', wood: 16 },
  { id: 'plot', label: 'soil bed', wood: 3 }
];
const CROPS = [
  { id: 'greens', label: 'leaf greens', color: 0x3a7a32, yield: 3 },
  { id: 'roots', label: 'roots', color: 0xc48a4a, yield: 2 },
  { id: 'grain', label: 'grain', color: 0xc9b86a, yield: 4 }
];
const soilMat = new THREE.MeshStandardMaterial({ color: 0x4a3a28, roughness: 0.95 });
const wetSoilMat = new THREE.MeshStandardMaterial({ color: 0x3a2e1e, roughness: 0.9 });

function toast(msg){
  const el = document.getElementById('toast'); if (!el) return;
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), 1600);
}
function hud(){
  const set = (id, v) => {
    const bar = document.querySelector('#' + id + ' i');
    const lab = document.querySelector('#' + id + ' .v');
    if (bar) bar.style.transform = 'scaleX(' + (Math.max(0, Math.min(100, v)) / 100) + ')';
    if (lab) lab.textContent = Math.round(v);
  };
  set('hp', player.health); set('hun', player.hunger); set('thirst', player.thirst); set('warm', player.warmth);
  const w = document.getElementById('wood-n'); if (w) w.textContent = player.wood;
  const f = document.getElementById('food-n'); if (f) f.textContent = player.food;
  const s = document.getElementById('stone-n'); if (s) s.textContent = player.stone;
  const chip = document.getElementById('build-chip');
  if (chip) chip.textContent = 'Build: ' + BUILDS[buildIndex].label;
}
hud();
function nearest(){
  let best = null, bd = 3.6;
  for (const it of interactives){
    if (!it.mesh.visible) continue;
    const d = Math.hypot(it.x - hero.position.x, it.z - hero.position.z);
    if (d < bd){ bd = d; best = it; }
  }
  return best;
}
function nearestPlot(){
  let best = null, bd = 3.2;
  for (const p of plots){
    const d = Math.hypot(p.x - hero.position.x, p.z - hero.position.z);
    if (d < bd){ bd = d; best = p; }
  }
  return best;
}
function makeCropMesh(crop, growth){
  const g = new THREE.Group();
  const h = 0.12 + growth * 0.55;
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.03, h, 5),
    new THREE.MeshStandardMaterial({ color: 0x2f4a22, roughness: 0.9 })
  );
  stem.position.y = h * 0.5;
  g.add(stem);
  if (growth > 0.35){
    const top = new THREE.Mesh(
      new THREE.SphereGeometry(0.08 + growth * 0.12, 6, 5),
      new THREE.MeshStandardMaterial({ color: crop.color, roughness: 0.85 })
    );
    top.position.y = h + 0.06;
    g.add(top);
  }
  return g;
}
function refreshPlotLook(p){
  if (p.cropMesh){
    scene.remove(p.cropMesh);
    p.cropMesh = null;
  }
  p.bed.material = p.watered ? wetSoilMat : soilMat;
  if (p.crop && p.growth > 0.05){
    p.cropMesh = makeCropMesh(p.crop, p.growth);
    p.cropMesh.position.set(p.x, p.y + 0.06, p.z);
    scene.add(p.cropMesh);
  }
}
function gather(){
  if (!playing || resting) return;
  const plot = nearestPlot();
  if (plot){
    if (plot.crop && plot.growth >= 1){
      player.food += plot.crop.yield;
      toast('Harvested ' + plot.crop.label + ' (+' + plot.crop.yield + ')');
      plot.crop = null;
      plot.growth = 0;
      plot.watered = false;
      refreshPlotLook(plot);
      hud();
      return;
    }
    if (plot.crop && !plot.watered){
      plot.watered = true;
      refreshPlotLook(plot);
      toast('Watered the soil');
      return;
    }
    if (!plot.crop){
      toast('Soil bed — plant with G (needs a berry)');
      return;
    }
  }
  if (riverDist(hero.position.x, hero.position.z) < 8){
    player.thirst = Math.min(100, player.thirst + 28); toast('Drank from the stream'); hud(); return;
  }
  const it = nearest();
  if (!it){ toast('Walk to a tree, bush, stone, or soil bed'); return; }
  if (it.type === 'tree'){
    player.wood += 2; it.hp -= 1; it.mesh.scale.multiplyScalar(0.88);
    if (it.hp <= 0) it.mesh.visible = false; toast('+2 wood');
  } else if (it.type === 'berry'){
    player.food += 2; it.mesh.visible = false; toast('+2 berries');
  } else if (it.type === 'rock'){
    player.stone += 1; it.hp -= 1; if (it.hp <= 0) it.mesh.visible = false; toast('+1 stone');
  }
  hud();
}
function eat(){
  if (resting) return;
  if (player.food < 1){ toast('Pick berries or harvest a crop first'); return; }
  player.food -= 1; player.hunger = Math.min(100, player.hunger + 24); toast('Ate'); hud();
}
function plant(){
  if (!playing || resting) return;
  const plot = nearestPlot();
  if (!plot){ toast('Stand by a soil bed to plant'); return; }
  if (plot.crop){ toast('Already planted — water or wait'); return; }
  if (player.food < 1){ toast('Need a berry to plant'); return; }
  player.food -= 1;
  const crop = CROPS[cropIndex % CROPS.length];
  cropIndex = (cropIndex + 1) % CROPS.length;
  plot.crop = crop;
  plot.growth = 0.08;
  plot.watered = false;
  refreshPlotLook(plot);
  toast('Planted ' + crop.label);
  hud();
}
function place(){
  if (!playing || resting) return;
  const spec = BUILDS[buildIndex];
  if (player.wood < spec.wood){ toast('Need ' + spec.wood + ' wood'); return; }
  player.wood -= spec.wood;
  const x = hero.position.x + Math.sin(hero.rotation.y) * 2.5;
  const z = hero.position.z + Math.cos(hero.rotation.y) * 2.5;
  const y = heightAt(x, z);
  const woodM = new THREE.MeshStandardMaterial({ color: 0x6b5340 });
  let mesh;
  if (spec.id === 'post'){
    mesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.6, 0.18), woodM);
    mesh.position.set(x, y + 0.8, z);
  } else if (spec.id === 'fire'){
    mesh = new THREE.Group();
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 6), new THREE.MeshBasicMaterial({ color: 0xff6622 }));
    flame.position.y = 0.35; mesh.add(flame);
    mesh.add(new THREE.PointLight(0xff8844, 1.6, 10));
    mesh.position.set(x, y, z);
    fires.push({ x, z });
  } else if (spec.id === 'plot'){
    const bed = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 1.6), soilMat);
    bed.position.set(x, y + 0.05, z);
    mesh = bed;
    const plot = { x, z, y, bed, crop: null, growth: 0, watered: false, cropMesh: null };
    plots.push(plot);
    toast('Soil bed ready');
  } else {
    mesh = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.8, 3.1), woodM);
    mesh.position.set(x, y, z);
  }
  scene.add(mesh);
  if (spec.id !== 'plot') toast(spec.label);
  hud();
}
function nearAnyFire(){
  return fires.some(f => Math.hypot(f.x - hero.position.x, f.z - hero.position.z) < 4);
}
function startRest(){
  if (!playing || resting) return;
  if (!nearAnyFire()){
    toast('Rest needs a campfire nearby');
    return;
  }
  const elev = Math.sin(worldTime * Math.PI * 2);
  if (elev > 0.05){
    toast('Sit by the coals a moment');
    player.warmth = Math.min(100, player.warmth + 12);
    player.health = Math.min(100, player.health + 4);
    hud();
    return;
  }
  restTarget = 0.22;
  let remain = restTarget - worldTime;
  if (remain <= 0) remain += 1;
  restSpeed = remain / 4.5;
  resting = true;
  toast('Resting by the fire…');
}
function finishRest(){
  resting = false;
  player.warmth = Math.min(100, player.warmth + 28);
  player.health = Math.min(100, player.health + 10);
  player.hunger = Math.max(0, player.hunger - 6);
  player.thirst = Math.max(0, player.thirst - 4);
  toast('Morning light. The valley is still.');
  hud();
}
addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (keys[k] !== undefined) keys[k] = 1;
  if (k === 'e') gather();
  if (k === 'f') place();
  if (k === 'g') plant();
  if (k === '1') eat();
  if (k === 'r') startRest();
  if (k === 'tab' || k === 'q'){
    e.preventDefault();
    if (!resting){
      buildIndex = (buildIndex + 1) % BUILDS.length;
      hud();
      toast(BUILDS[buildIndex].label);
    }
  }
});
addEventListener('keyup', e => { const k = e.key.toLowerCase(); if (keys[k] !== undefined) keys[k] = 0; });

(function touch(){
  const walk = document.getElementById('stick-walk');
  const look = document.getElementById('stick-look');
  const knob = walk && walk.querySelector('i');
  let walkId = null, lookId = null, lx = 0, ly = 0;
  function setKnob(el, nx, nz){ if (el) el.style.transform = 'translate(' + (nx * 36) + 'px,' + (-nz * 36) + 'px)'; }
  function applyWalk(t){
    const cx = walk ? walk.getBoundingClientRect() : { left: 36, top: innerHeight - 190, width: 140, height: 140 };
    stick.x = Math.max(-1, Math.min(1, (t.clientX - (cx.left + cx.width / 2)) / 58));
    stick.z = -Math.max(-1, Math.min(1, (t.clientY - (cx.top + cx.height / 2)) / 58));
    setKnob(knob, stick.x, stick.z);
  }
  function find(id, list){ for (let i = 0; i < list.length; i++) if (list[i].identifier === id) return list[i]; return null; }
  function onStart(e){
    if (!playing) return;
    for (const t of e.changedTouches){
      const hit = document.elementFromPoint(t.clientX, t.clientY);
      if (hit && hit.closest && hit.closest('#touch-actions')) continue;
      if (walkId === null && t.clientX < innerWidth * 0.55){ walkId = t.identifier; applyWalk(t); e.preventDefault(); }
      else if (lookId === null){ lookId = t.identifier; lx = t.clientX; ly = t.clientY; e.preventDefault(); }
    }
  }
  function onMove(e){
    if (walkId !== null){ const t = find(walkId, e.touches); if (t){ applyWalk(t); e.preventDefault(); } }
    if (lookId !== null){
      const t = find(lookId, e.touches);
      if (t){
        yaw -= (t.clientX - lx) * 0.01;
        pitch = Math.max(-0.35, Math.min(0.65, pitch + (t.clientY - ly) * 0.007));
        lx = t.clientX; ly = t.clientY; e.preventDefault();
      }
    }
  }
  function onEnd(e){
    for (const t of e.changedTouches){
      if (t.identifier === walkId){ walkId = null; stick.x = 0; stick.z = 0; setKnob(knob, 0, 0); }
      if (t.identifier === lookId) lookId = null;
    }
  }
  const opts = { passive: false };
  addEventListener('touchstart', onStart, opts);
  addEventListener('touchmove', onMove, opts);
  addEventListener('touchend', onEnd, opts);
  addEventListener('touchcancel', onEnd, opts);
  const be = document.getElementById('btn-e'); if (be) be.addEventListener('click', gather);
  const bf = document.getElementById('btn-f'); if (bf) bf.addEventListener('click', place);
  const bg = document.getElementById('btn-g'); if (bg) bg.addEventListener('click', plant);
  const bq = document.getElementById('btn-q'); if (bq) bq.addEventListener('click', () => { if (!resting){ buildIndex = (buildIndex + 1) % BUILDS.length; hud(); toast(BUILDS[buildIndex].label); } });
  const br = document.getElementById('btn-r'); if (br) br.addEventListener('click', startRest);
})();

const clock = new THREE.Clock();
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
function settle(o, k){ if (o) o.rotation[k] *= 0.72; }
function animate(){
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, clock.getDelta());
  if (resting){
    worldTime += restSpeed * dt;
    if (worldTime >= 1) worldTime -= 1;
    const elevNow = Math.sin(worldTime * Math.PI * 2);
    if (elevNow > 0.08 || Math.abs(worldTime - restTarget) < 0.015){
      worldTime = restTarget;
      finishRest();
    }
  } else {
    worldTime = (worldTime + dt / 360) % 1;
  }
  const elev = Math.sin(worldTime * Math.PI * 2);
  const up = Math.max(0, elev);
  sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elev * 42), worldTime * 6.28);
  skyU.sunPosition.value.copy(sun);
  dir.position.copy(sun).multiplyScalar(80);
  dir.intensity = 0.2 + up * 2; hemi.intensity = 0.2 + up * 0.55;
  renderer.toneMappingExposure = 0.38 + up * 0.42;
  scene.fog.color.setHSL(0.55, 0.14 + up * 0.12, 0.16 + up * 0.46);
  if (playing){
    const nearFire = nearAnyFire();
    if (resting){
      if (nearFire) player.warmth = Math.min(100, player.warmth + dt * 8);
      stick.x = 0; stick.z = 0;
      keys.w = keys.a = keys.s = keys.d = 0;
    } else {
      const fx = Math.sin(yaw), fz = Math.cos(yaw);
      let mx = fx * stick.z + Math.cos(yaw) * stick.x;
      let mz = fz * stick.z - Math.sin(yaw) * stick.x;
      if (keys.w){ mx += fx; mz += fz; } if (keys.s){ mx -= fx; mz -= fz; }
      if (keys.d){ mx += Math.cos(yaw); mz -= Math.sin(yaw); } if (keys.a){ mx -= Math.cos(yaw); mz += Math.sin(yaw); }
      const len = Math.hypot(mx, mz);
      const u = hero.userData;
      let moving = 0;
      if (len > 0.08){
        mx /= len; mz /= len; moving = 1;
        hero.position.x += mx * 6.8 * dt; hero.position.z += mz * 6.8 * dt;
        hero.rotation.y = Math.atan2(mx, mz);
        const t = clock.elapsedTime * 9;
        const swing = Math.sin(t) * 0.55;
        if (u.legs){ u.legs[0].rotation.x = swing; u.legs[1].rotation.x = -swing; }
        if (u.shins){ u.shins[0].rotation.x = Math.max(0, -swing) * 0.55; u.shins[1].rotation.x = Math.max(0, swing) * 0.55; }
        if (u.arms){ u.arms[0].rotation.x = -swing * 0.75; u.arms[1].rotation.x = swing * 0.75; }
        if (u.torso) u.torso.rotation.y = Math.sin(t) * 0.07;
      } else {
        if (u.legs){ settle(u.legs[0], 'x'); settle(u.legs[1], 'x'); }
        if (u.shins){ settle(u.shins[0], 'x'); settle(u.shins[1], 'x'); }
        if (u.arms){ settle(u.arms[0], 'x'); settle(u.arms[1], 'x'); }
        if (u.torso) settle(u.torso, 'y');
      }
      hero.position.x = THREE.MathUtils.clamp(hero.position.x, -200, 200);
      hero.position.z = THREE.MathUtils.clamp(hero.position.z, -200, 200);
      hero.position.y = heightAt(hero.position.x, hero.position.z);
      const bob = moving ? Math.sin(clock.elapsedTime * 9) * 0.05 : 0;
      camera.position.set(hero.position.x - Math.sin(yaw) * 5.6, hero.position.y + 2.15 + pitch + bob, hero.position.z - Math.cos(yaw) * 5.6);
      camera.lookAt(hero.position.x, hero.position.y + 1.35, hero.position.z);
      if (!foundRing && Math.hypot(hero.position.x + 18, hero.position.z - 8) < 7){
        foundRing = true; toast('The Old Ring. Stones older than the pines.');
      }
      if (!foundMoss && Math.hypot(hero.position.x - 32, hero.position.z + 14) < 6){
        foundMoss = true; toast('The Moss Seat. Soft stone, quiet ground.');
      }
      if (nearFire) player.warmth = Math.min(100, player.warmth + dt * 16);
      else player.warmth = Math.max(0, player.warmth - dt * (up < 0.12 ? 2.2 : 0.28));
      player.hunger = Math.max(0, player.hunger - dt * 0.55);
      player.thirst = Math.max(0, player.thirst - dt * 0.7);
      if (player.hunger < 1 || player.thirst < 1 || player.warmth < 8) player.health = Math.max(0, player.health - dt * 2);

      for (const p of plots){
        if (p.crop && p.watered && p.growth < 1){
          const rate = 0.018 + up * 0.028;
          const prev = p.growth;
          p.growth = Math.min(1, p.growth + dt * rate);
          if (Math.floor(prev * 4) !== Math.floor(p.growth * 4) || p.growth >= 1){
            refreshPlotLook(p);
          }
          if (p.growth >= 1) toast(p.crop.label + ' ready to pick');
        }
      }
    }

    if (resting){
      camera.position.set(hero.position.x - Math.sin(yaw) * 5.6, hero.position.y + 2.15 + pitch, hero.position.z - Math.cos(yaw) * 5.6);
      camera.lookAt(hero.position.x, hero.position.y + 1.35, hero.position.z);
    }

    const it = nearest();
    const plot = nearestPlot();
    const pr = document.getElementById('prompt');
    if (pr){
      if (resting) pr.textContent = 'Resting… light returns';
      else if (plot){
        if (plot.crop && plot.growth >= 1) pr.textContent = 'E  harvest ' + plot.crop.label;
        else if (plot.crop && !plot.watered) pr.textContent = 'E  water the soil';
        else if (plot.crop) pr.textContent = plot.crop.label + ' growing…';
        else pr.textContent = 'G  plant (berry) · E  look';
      } else if (it && it.type === 'tree') pr.textContent = 'E  wood';
      else if (it && it.type === 'berry') pr.textContent = 'E  berries';
      else if (it && it.type === 'rock') pr.textContent = 'E  stone';
      else if (riverDist(hero.position.x, hero.position.z) < 8) pr.textContent = 'E  drink';
      else if (nearFire){
        const elevNow = Math.sin(worldTime * Math.PI * 2);
        if (elevNow <= 0.05) pr.textContent = 'R  rest through the night';
        else pr.textContent = 'Warm by the fire · R rest';
      }
      else if (Math.hypot(hero.position.x + 18, hero.position.z - 8) < 8) pr.textContent = 'Old stone ring';
      else if (Math.hypot(hero.position.x - 32, hero.position.z + 14) < 6) pr.textContent = 'Moss seat — a place to pause';
      else pr.textContent = 'Hold left to walk · right to look';
    }
    const pl = document.getElementById('place'); if (pl) pl.textContent = currentPlace(hero.position.x, hero.position.z);
    const ck = document.getElementById('clock');
    if (ck) ck.textContent = elev > 0.3 ? 'Day' : elev > 0.05 ? 'Morning' : elev > -0.15 ? 'Dusk' : 'Night';
    if ((Math.floor(clock.elapsedTime * 2) % 4) === 0) hud();
  }
  stepBirds(birds, clock.elapsedTime);
  renderer.render(scene, camera);
}
animate();
