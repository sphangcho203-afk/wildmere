import * as THREE from 'three';
import { startTick } from './tick.js';
import { heightAt, currentPlace, atLarkPost, atFernStair, atEveningBell, atRowanLean, riverDist } from './world.js';
import { stepBirds } from './world.js';
import { stepRain, rainWanted } from './weather.js';
import { noteForPlace, saveNotes, renderNotebook } from './notebook.js';

export function bootTick(parts){
  const keys = { w:0, a:0, s:0, d:0 };
  const stick = { x:0, z:0 };
  const player = parts.player;
  const interactives = parts.interactives;
  const fires = parts.fires;
  const plots = parts.plots;
  const scene = parts.scene;
  const hero = parts.hero;
  let buildIndex = 0;
  let cropIndex = 0;
  let resting = false;
  let fishing = false;
  let fishWait = 0;
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

  const ctx = {
    THREE,
    ...parts,
    heightAt,
    atFernStair,
    atLarkPost,
    atEveningBell,
    atRowanLean,
    currentPlace,
    stepBirds,
    stepRain,
    rainWanted,
    keys,
    stick,
    yaw: 0.4,
    pitch: 0.12,
    worldTime: 0.22,
    raining: false,
    foundFern: false,
    foundBell: false,
    foundRowan: false,
    notebookOpen: false,
    get resting(){ return resting; },
    get fishing(){ return fishing; },
    set fishing(v){ fishing = v; },
    get fishWait(){ return fishWait; },
    set fishWait(v){ fishWait = v; },
    toast(msg){
      const el = document.getElementById('toast'); if (!el) return;
      el.textContent = msg; el.classList.add('show');
      clearTimeout(this._t); this._t = setTimeout(() => el.classList.remove('show'), 1600);
    },
    rememberPlace(name){
      const note = noteForPlace(name);
      if (!note || parts.foundNotes.has(note.id)) return;
      parts.foundNotes.add(note.id);
      saveNotes(parts.foundNotes);
      renderNotebook(parts.foundNotes);
      this.toast('Wrote: ' + note.name);
    }
  };
  Object.defineProperty(ctx, 'playing', { get(){ return parts.getPlaying(); } });

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
    const fi = document.getElementById('fish-n'); if (fi) fi.textContent = player.fish;
    const chip = document.getElementById('build-chip');
    if (chip) chip.textContent = 'Build: ' + BUILDS[buildIndex].label;
  }
  hud();
  ctx.hud = hud;
  ctx.player = player;

  function toggleNotebook(){
    if (!parts.getPlaying()) return;
    ctx.notebookOpen = !ctx.notebookOpen;
    if (parts.setNotebookOpen) parts.setNotebookOpen(ctx.notebookOpen);
    const el = document.getElementById('notebook');
    if (el) el.hidden = !ctx.notebookOpen;
    if (ctx.notebookOpen){
      renderNotebook(parts.foundNotes);
      stick.x = 0; stick.z = 0;
    }
  }

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
    if (!parts.getPlaying() || resting || ctx.notebookOpen) return;
    if (fishing){ ctx.toast('Wait — the line is still'); return; }
    const plot = nearestPlot();
    if (plot){
      if (plot.crop && plot.growth >= 1){
        player.food += plot.crop.yield;
        ctx.toast('Harvested ' + plot.crop.label + ' (+' + plot.crop.yield + ')');
        plot.crop = null; plot.growth = 0; plot.watered = false;
        refreshPlotLook(plot); hud(); return;
      }
      if (plot.crop && !plot.watered){
        plot.watered = true; refreshPlotLook(plot); ctx.toast('Watered the soil'); return;
      }
      if (!plot.crop){ ctx.toast('Soil bed — plant with G (needs a berry)'); return; }
    }
    if (parts.atQuietWell && parts.atQuietWell(hero.position.x, hero.position.z)){
      player.thirst = Math.min(100, player.thirst + 34);
      ctx.toast('Cool water from the old well'); hud(); return;
    }
    if (parts.atShadePool && parts.atShadePool(hero.position.x, hero.position.z)){
      player.thirst = Math.min(100, player.thirst + 30);
      ctx.toast('Drank from the still pool'); hud(); return;
    }
    if (atEveningBell(hero.position.x, hero.position.z)){
      ctx.toast('The bronze is warm from the last sun.');
      return;
    }
    if (atRowanLean(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few rowan berries. Tart, but they keep.');
      hud();
      return;
    }
    if (parts.atSlowBend && parts.atSlowBend(hero.position.x, hero.position.z)){
      if (player.thirst < 72){
        player.thirst = Math.min(100, player.thirst + 28);
        ctx.toast('Drank at the slow bend'); hud(); return;
      }
      fishing = true; fishWait = 2.6; ctx.toast('Line in the still water…'); return;
    }
    if (riverDist(hero.position.x, hero.position.z) < 8){
      player.thirst = Math.min(100, player.thirst + 28); ctx.toast('Drank from the stream'); hud(); return;
    }
    const it = nearest();
    if (!it){ ctx.toast('Walk to a tree, bush, stone, or soil bed'); return; }
    if (it.type === 'tree'){
      player.wood += 2; it.hp -= 1; it.mesh.scale.multiplyScalar(0.88);
      if (it.hp <= 0) it.mesh.visible = false; ctx.toast('+2 wood');
    } else if (it.type === 'berry'){
      player.food += 2; it.mesh.visible = false; ctx.toast('+2 berries');
    } else if (it.type === 'rock'){
      player.stone += 1; it.hp -= 1; if (it.hp <= 0) it.mesh.visible = false; ctx.toast('+1 stone');
    }
    hud();
  }
  function eat(){
    if (resting || ctx.notebookOpen) return;
    if (player.food < 1){ ctx.toast('Pick berries, harvest a crop, or fish first'); return; }
    player.food -= 1; player.hunger = Math.min(100, player.hunger + 24); ctx.toast('Ate'); hud();
  }
  function plant(){
    if (!parts.getPlaying() || resting || ctx.notebookOpen) return;
    const plot = nearestPlot();
    if (!plot){ ctx.toast('Stand by a soil bed to plant'); return; }
    if (plot.crop){ ctx.toast('Already planted — water or wait'); return; }
    if (player.food < 1){ ctx.toast('Need a berry to plant'); return; }
    player.food -= 1;
    const crop = CROPS[cropIndex % CROPS.length];
    cropIndex = (cropIndex + 1) % CROPS.length;
    plot.crop = crop; plot.growth = 0.08; plot.watered = false;
    refreshPlotLook(plot); ctx.toast('Planted ' + crop.label); hud();
  }
  function place(){
    if (!parts.getPlaying() || resting || ctx.notebookOpen) return;
    const spec = BUILDS[buildIndex];
    if (player.wood < spec.wood){ ctx.toast('Need ' + spec.wood + ' wood'); return; }
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
      plots.push({ x, z, y, bed, crop: null, growth: 0, watered: false, cropMesh: null });
      ctx.toast('Soil bed ready');
    } else {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.8, 3.1), woodM);
      mesh.position.set(x, y, z);
    }
    scene.add(mesh);
    if (spec.id !== 'plot') ctx.toast(spec.label);
    hud();
  }
  function nearAnyFire(){
    return fires.some(f => Math.hypot(f.x - hero.position.x, f.z - hero.position.z) < 4);
  }
  function startRest(){
    if (!parts.getPlaying() || resting || ctx.notebookOpen) return;
    if (!nearAnyFire()){ ctx.toast('Rest needs a campfire nearby'); return; }
    const elev = Math.sin(ctx.worldTime * Math.PI * 2);
    if (elev > 0.05){
      ctx.toast('Sit by the coals a moment');
      player.warmth = Math.min(100, player.warmth + 12);
      player.health = Math.min(100, player.health + 4);
      hud(); return;
    }
    ctx.restTarget = 0.22;
    let remain = ctx.restTarget - ctx.worldTime;
    if (remain <= 0) remain += 1;
    ctx.restSpeed = remain / 4.5;
    resting = true;
    ctx.toast('Resting by the fire…');
  }
  ctx.finishRest = function(){
    resting = false;
    player.warmth = Math.min(100, player.warmth + 28);
    player.health = Math.min(100, player.health + 10);
    player.hunger = Math.max(0, player.hunger - 6);
    player.thirst = Math.max(0, player.thirst - 4);
    ctx.toast('Morning light. The valley is still.');
    hud();
  };
  ctx.stepNeeds = function(dt){
    if (!parts.getPlaying() || ctx.notebookOpen) return;
    if (fishing){
      fishWait -= dt;
      if (fishWait <= 0){
        fishing = false;
        player.fish += 1;
        player.food += 1;
        ctx.toast('A small fish. Enough for a meal.');
        hud();
      }
    }
    for (const p of plots){
      if (p.crop && p.watered && p.growth < 1){
        p.growth = Math.min(1, p.growth + dt * 0.035);
        if (Math.random() < dt * 0.8) refreshPlotLook(p);
      }
    }
    if (ctx.raining){
      for (const p of plots){ if (p.crop && !p.watered){ p.watered = true; refreshPlotLook(p); } }
    }
  };

  addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'm'){ e.preventDefault(); toggleNotebook(); return; }
    if (ctx.notebookOpen) return;
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
        hud(); ctx.toast(BUILDS[buildIndex].label);
      }
    }
  });
  addEventListener('keyup', e => {
    const k = e.key.toLowerCase();
    if (keys[k] !== undefined) keys[k] = 0;
  });

  const walk = document.getElementById('stick-walk');
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
  addEventListener('touchstart', e => {
    if (!parts.getPlaying() || ctx.notebookOpen) return;
    for (const t of e.changedTouches){
      const hit = document.elementFromPoint(t.clientX, t.clientY);
      if (hit && hit.closest && hit.closest('#touch-actions')) continue;
      if (walkId === null && t.clientX < innerWidth * 0.55){ walkId = t.identifier; applyWalk(t); e.preventDefault(); }
      else if (lookId === null){ lookId = t.identifier; lx = t.clientX; ly = t.clientY; e.preventDefault(); }
    }
  }, { passive: false });
  addEventListener('touchmove', e => {
    if (ctx.notebookOpen) return;
    if (walkId !== null){ const t = find(walkId, e.touches); if (t){ applyWalk(t); e.preventDefault(); } }
    if (lookId !== null){
      const t = find(lookId, e.touches);
      if (t){
        ctx.yaw -= (t.clientX - lx) * 0.01;
        ctx.pitch = Math.max(-0.35, Math.min(0.65, ctx.pitch + (t.clientY - ly) * 0.007));
        lx = t.clientX; ly = t.clientY; e.preventDefault();
      }
    }
  }, { passive: false });
  addEventListener('touchend', e => {
    for (const t of e.changedTouches){
      if (t.identifier === walkId){ walkId = null; stick.x = 0; stick.z = 0; setKnob(knob, 0, 0); }
      if (t.identifier === lookId) lookId = null;
    }
  }, { passive: false });
  const be = document.getElementById('btn-e'); if (be) be.addEventListener('click', gather);
  const bf = document.getElementById('btn-f'); if (bf) bf.addEventListener('click', place);
  const bg = document.getElementById('btn-g'); if (bg) bg.addEventListener('click', plant);
  const bq = document.getElementById('btn-q'); if (bq) bq.addEventListener('click', () => {
    if (!resting && !ctx.notebookOpen){ buildIndex = (buildIndex + 1) % BUILDS.length; hud(); ctx.toast(BUILDS[buildIndex].label); }
  });
  const br = document.getElementById('btn-r'); if (br) br.addEventListener('click', startRest);
  const bm = document.getElementById('btn-m'); if (bm) bm.addEventListener('click', toggleNotebook);

  startTick(ctx);
}
