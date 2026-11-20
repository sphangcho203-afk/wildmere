import { startTick } from './tick.js';
import { noteForPlace, saveNotes, renderNotebook } from './notebook.js';
import { heightAt, currentPlace, stepBirds } from './world.js';
import { stepRain, rainWanted } from './weather.js';
import * as THREE from 'three';

export function bootTick(ctx) {
  const {
    scene, camera, renderer, hero, birds, rain,
    skyU, sun, dir, hemi,
    WATER_Y, foundNotes, interactives, fires, plots, player,
    getPlaying, setNotebookOpen, getNotebookOpen,
    atQuietWell, atShadePool,
    atThymeRest, atMintRest, atSageRest, atRosemaryRest, atBasilRest, atOreganoRest,
    thymeRest, mintRest, sageRest, rosemaryRest, basilRest, oreganoRest
  } = ctx;

  ctx.keys = { w: false, a: false, s: false, d: false };
  ctx.stick = { x: 0, z: 0 };
  ctx.yaw = 0;
  ctx.pitch = 0.1;
  ctx.worldTime = 0.22;
  ctx.resting = false;
  ctx.restSpeed = 0.08;
  ctx.restTarget = 0.22;
  ctx.raining = false;

  ctx.heightAt = heightAt;
  ctx.currentPlace = currentPlace;
  ctx.stepBirds = stepBirds;
  ctx.stepRain = stepRain;
  ctx.rainWanted = rainWanted;

  const buildPieces = ['wooden post', 'campfire', 'cabin wall', 'soil bed'];
  let buildIndex = 0;
  function updateBuildChip() {
    const chip = document.getElementById('build-chip');
    if (chip) chip.textContent = 'Build: ' + buildPieces[buildIndex];
  }
  updateBuildChip();

  let toastTimer = 0;
  function toast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = String(msg || '');
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }
  ctx.toast = toast;

  function updateInv() {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    set('wood-n', player.wood);
    set('food-n', player.food);
    set('stone-n', player.stone);
    set('fish-n', player.fish);
    set('axe-n', player.axe ? 'yes' : 'no');
  }
  updateInv();

  function setBar(id, val) {
    const bar = document.querySelector('#' + id + ' .bar i');
    if (bar) bar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, val / 100)) + ')';
    const v = document.querySelector('#' + id + ' .v');
    if (v) v.textContent = Math.round(val);
  }

  function stepNeeds(dt) {
    player.hunger = Math.max(0, player.hunger - dt * 0.7);
    player.thirst = Math.max(0, player.thirst - dt * 1.0);
    const nearFire = fires.some(f => Math.hypot(hero.position.x - f.x, hero.position.z - f.z) < 4.5);
    if (nearFire && player.warmth < 100) player.warmth = Math.min(100, player.warmth + dt * 7);
    else if (!ctx.raining) player.warmth = Math.max(40, player.warmth - dt * 0.35);
    if (ctx.raining) player.warmth = Math.max(20, player.warmth - dt * 1.1);
    if (player.hunger < 20 || player.thirst < 15) player.health = Math.max(0, player.health - dt * 2);
    else if (player.health < 100) player.health = Math.min(100, player.health + dt * 0.4);

    setBar('hp', player.health);
    setBar('hun', player.hunger);
    setBar('thirst', player.thirst);
    setBar('warm', player.warmth);

    for (const p of plots) {
      if (p.stage > 0 && p.stage < 1.2) {
        if (ctx.raining || p.watered) p.stage += dt * 0.04;
        if (p.sprout) p.sprout.scale.y = 0.2 + Math.min(1, p.stage) * 0.8;
      }
    }

    const t = ctx.worldTime % 1;
    let label = 'Morning';
    if (t > 0.22 && t < 0.5) label = 'Day';
    else if (t > 0.5 && t < 0.72) label = 'Dusk';
    else if (t > 0.72 || t < 0.08) label = 'Night';
    const clock = document.getElementById('clock');
    if (clock) clock.textContent = label;
  }
  ctx.stepNeeds = stepNeeds;

  function finishRest() {
    ctx.resting = false;
    player.hunger = Math.min(100, player.hunger + 18);
    player.warmth = Math.min(100, player.warmth + 25);
    player.health = Math.min(100, player.health + 8);
    toast('Rested by the fire.');
  }
  ctx.finishRest = finishRest;

  function rememberPlace(name) {
    const note = noteForPlace(name);
    if (!note || foundNotes.has(note.id)) return;
    foundNotes.add(note.id);
    saveNotes(foundNotes);
    renderNotebook(foundNotes);
    toast(note.line);
  }
  ctx.rememberPlace = rememberPlace;

  const liftables = [];
  function addLifts(obj) {
    if (obj && Array.isArray(obj.blooms)) {
      for (const b of obj.blooms) liftables.push(b);
    }
  }
  addLifts(thymeRest); addLifts(mintRest); addLifts(sageRest);
  addLifts(rosemaryRest); addLifts(basilRest); addLifts(oreganoRest);
  ctx.stepLandmarkLifts = (now) => {
    const t = now * 0.001;
    for (const b of liftables) {
      if (b.userData && typeof b.userData.baseY === 'number') {
        b.position.y = b.userData.baseY + Math.sin(t * 1.4 + (b.userData.phase || 0)) * 0.028;
      }
    }
  };

  function nearestInteractive(range = 3.4) {
    let best = null, bd = range;
    for (const it of interactives) {
      const d = Math.hypot(hero.position.x - it.x, hero.position.z - it.z);
      if (d < bd) { bd = d; best = it; }
    }
    return best;
  }

  function doGather() {
    if (!getPlaying() || getNotebookOpen() || ctx.resting) return;
    const x = hero.position.x, z = hero.position.z;

    const herbs = [
      [atThymeRest, 'thyme leaves'],
      [atMintRest, 'mint leaves'],
      [atSageRest, 'sage leaves'],
      [atRosemaryRest, 'rosemary sprigs'],
      [atBasilRest, 'basil leaves'],
      [atOreganoRest, 'oregano leaves']
    ];
    for (const [fn, label] of herbs) {
      if (fn && fn(x, z)) {
        player.food = Math.min(99, player.food + 1);
        updateInv();
        toast('Picked ' + label + '.');
        return;
      }
    }

    if ((atQuietWell && atQuietWell(x, z)) || (atShadePool && atShadePool(x, z))) {
      player.thirst = Math.min(100, player.thirst + 28);
      toast('Drank cool water.');
      return;
    }

    for (const p of plots) {
      const d = Math.hypot(x - p.x, z - p.z);
      if (d < 2.8 && p.stage >= 1) {
        player.food = Math.min(99, player.food + 2);
        p.stage = 0;
        if (p.sprout) p.sprout.scale.y = 0.2;
        updateInv();
        toast('Gathered greens.');
        return;
      }
    }

    const it = nearestInteractive();
    if (it) {
      if (it.type === 'berry') {
        player.food = Math.min(99, player.food + 1);
        it.hp = (it.hp || 1) - 1;
        if (it.hp <= 0 && it.mesh) {
          scene.remove(it.mesh);
          const idx = interactives.indexOf(it);
          if (idx >= 0) interactives.splice(idx, 1);
        }
        updateInv();
        toast('Gathered berries.');
        return;
      }
      if (it.type === 'rock') {
        player.stone = Math.min(99, player.stone + 1);
        it.hp = (it.hp || 2) - 1;
        if (it.hp <= 0 && it.mesh) {
          scene.remove(it.mesh);
          const idx = interactives.indexOf(it);
          if (idx >= 0) interactives.splice(idx, 1);
        }
        updateInv();
        toast('Gathered stone.');
        return;
      }
      if (it.type === 'tree') {
        player.wood = Math.min(99, player.wood + 1);
        it.hp = (it.hp || 4) - 1;
        if (it.hp <= 0 && it.mesh) {
          scene.remove(it.mesh);
          const idx = interactives.indexOf(it);
          if (idx >= 0) interactives.splice(idx, 1);
        }
        updateInv();
        toast('Gathered wood.');
        return;
      }
    }

    if (Math.abs(x - (14 * Math.sin(z * 0.016) + 7 * Math.sin(z * 0.049 + 1.7))) < 9) {
      player.fish = Math.min(99, player.fish + 1);
      updateInv();
      toast('Caught a small fish.');
      return;
    }

    toast('Nothing to gather here.');
  }

  function doBuild() {
    if (!getPlaying() || getNotebookOpen() || ctx.resting) return;
    const piece = buildPieces[buildIndex];
    const costs = {
      'wooden post': { wood: 3 },
      'campfire': { wood: 4, stone: 2 },
      'cabin wall': { wood: 8 },
      'soil bed': { wood: 2 }
    };
    const need = costs[piece] || {};
    if ((need.wood && player.wood < need.wood) || (need.stone && player.stone < need.stone)) {
      toast('Need more materials.');
      return;
    }
    if (need.wood) player.wood -= need.wood;
    if (need.stone) player.stone -= need.stone;
    updateInv();

    const yaw = ctx.yaw;
    const px = hero.position.x + Math.sin(yaw) * 2.6;
    const pz = hero.position.z + Math.cos(yaw) * 2.6;
    const py = heightAt(px, pz);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
    const mossMat = new THREE.MeshStandardMaterial({ color: 0x4a5a36, roughness: 0.88 });

    if (piece === 'wooden post') {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.6, 6), woodMat);
      m.position.set(px, py + 0.8, pz);
      m.castShadow = true;
      scene.add(m);
    } else if (piece === 'campfire') {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.12, 8), stoneMat);
      ring.position.set(px, py + 0.06, pz);
      scene.add(ring);
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.7, 5), woodMat);
      log.rotation.z = Math.PI / 2;
      log.position.set(px, py + 0.18, pz);
      scene.add(log);
      fires.push({ x: px, z: pz });
    } else if (piece === 'cabin wall') {
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.12), woodMat);
      m.position.set(px, py + 0.7, pz);
      m.rotation.y = yaw;
      m.castShadow = true;
      scene.add(m);
    } else if (piece === 'soil bed') {
      const bed = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.7), mossMat);
      bed.position.set(px, py + 0.04, pz);
      scene.add(bed);
      const sprout = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.18, 4), new THREE.MeshStandardMaterial({ color: 0x5a8a3a }));
      sprout.position.set(px, py + 0.14, pz);
      sprout.scale.y = 0.2;
      scene.add(sprout);
      plots.push({ x: px, z: pz, stage: 0, watered: false, sprout });
    }
    toast('Placed ' + piece + '.');
  }

  function doPlant() {
    if (!getPlaying() || getNotebookOpen() || ctx.resting) return;
    const x = hero.position.x, z = hero.position.z;
    for (const p of plots) {
      if (Math.hypot(x - p.x, z - p.z) < 2.6 && p.stage === 0) {
        if (player.food < 1) { toast('Need food to plant.'); return; }
        player.food -= 1;
        p.stage = 0.15;
        p.watered = ctx.raining;
        updateInv();
        toast('Planted a seed.');
        return;
      }
    }
    toast('Stand near a soil bed to plant.');
  }

  function doRest() {
    if (!getPlaying() || getNotebookOpen()) return;
    const elev = Math.sin(ctx.worldTime * Math.PI * 2);
    if (elev > 0.1) { toast('Rest only at night.'); return; }
    const near = fires.some(f => Math.hypot(hero.position.x - f.x, hero.position.z - f.z) < 4.2);
    if (!near) { toast('Rest near a fire.'); return; }
    ctx.resting = true;
    ctx.restTarget = 0.22;
    toast('Resting until morning.');
  }

  function doEat() {
    if (!getPlaying() || getNotebookOpen()) return;
    if (player.food > 0) {
      player.food -= 1;
      player.hunger = Math.min(100, player.hunger + 22);
      updateInv();
      toast('Ate something.');
    } else if (player.fish > 0) {
      player.fish -= 1;
      player.hunger = Math.min(100, player.hunger + 28);
      updateInv();
      toast('Ate a fish.');
    } else {
      toast('Nothing to eat.');
    }
  }

  function doNotebook() {
    if (!getPlaying()) return;
    const nb = document.getElementById('notebook');
    if (!nb) return;
    const open = nb.hasAttribute('hidden');
    if (open) {
      nb.removeAttribute('hidden');
      setNotebookOpen(true);
    } else {
      nb.setAttribute('hidden', '');
      setNotebookOpen(false);
    }
  }

  function cycleBuild() {
    if (!getPlaying() || getNotebookOpen()) return;
    buildIndex = (buildIndex + 1) % buildPieces.length;
    updateBuildChip();
  }

  addEventListener('keydown', e => {
    if (!getPlaying()) return;
    const k = e.key.toLowerCase();
    if (k === 'w') ctx.keys.w = true;
    if (k === 'a') ctx.keys.a = true;
    if (k === 's') ctx.keys.s = true;
    if (k === 'd') ctx.keys.d = true;
    if (k === 'e') doGather();
    if (k === 'f') doBuild();
    if (k === 'g') doPlant();
    if (k === 'r') doRest();
    if (k === 'm') doNotebook();
    if (k === '1') doEat();
    if (k === 'tab' || k === 'q') { e.preventDefault(); cycleBuild(); }
  });
  addEventListener('keyup', e => {
    const k = e.key.toLowerCase();
    if (k === 'w') ctx.keys.w = false;
    if (k === 'a') ctx.keys.a = false;
    if (k === 's') ctx.keys.s = false;
    if (k === 'd') ctx.keys.d = false;
  });

  const bind = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', e => { e.preventDefault(); fn(); });
  };
  bind('btn-e', doGather);
  bind('btn-f', doBuild);
  bind('btn-g', doPlant);
  bind('btn-r', doRest);
  bind('btn-m', doNotebook);
  bind('btn-q', cycleBuild);

  const stickEl = document.getElementById('stick-walk');
  const knob = stickEl ? stickEl.querySelector('i') : null;
  let stickPointer = null;
  function resetStick() {
    ctx.stick.x = 0;
    ctx.stick.z = 0;
    if (knob) knob.style.transform = 'translate(0px, 0px)';
    stickPointer = null;
  }
  if (stickEl) {
    stickEl.addEventListener('pointerdown', e => {
      if (!getPlaying() || getNotebookOpen()) return;
      stickPointer = e.pointerId;
      stickEl.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    stickEl.addEventListener('pointermove', e => {
      if (e.pointerId !== stickPointer) return;
      const rect = stickEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = e.clientX - cx;
      let dy = e.clientY - cy;
      const max = 36;
      const len = Math.hypot(dx, dy);
      if (len > max) { dx = dx / len * max; dy = dy / len * max; }
      ctx.stick.x = dx / max;
      ctx.stick.z = -dy / max;
      if (knob) knob.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    });
    stickEl.addEventListener('pointerup', resetStick);
    stickEl.addEventListener('pointercancel', resetStick);
  }

  let leftTouch = null;
  addEventListener('pointerdown', e => {
    if (!getPlaying() || getNotebookOpen()) return;
    if (e.clientX < innerWidth * 0.48 && !e.target.closest('#touch-actions') && !e.target.closest('#stick-walk')) {
      leftTouch = e.pointerId;
    }
  });
  addEventListener('pointerup', e => { if (e.pointerId === leftTouch) leftTouch = null; });

  startTick(ctx);
}
