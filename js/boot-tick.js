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
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }
  ctx.toast = toast;

  function stepNeeds(dt) {
    player.hunger = Math.max(0, player.hunger - dt * 0.8);
    player.thirst = Math.max(0, player.thirst - dt * 1.1);
    const nearFire = fires.some(f => Math.hypot(hero.position.x - f.x, hero.position.z - f.z) < 4.5);
    if (nearFire && player.warmth < 100) player.warmth = Math.min(100, player.warmth + dt * 8);
    else if (!ctx.raining) player.warmth = Math.max(40, player.warmth - dt * 0.4);
    if (ctx.raining) player.warmth = Math.max(20, player.warmth - dt * 1.2);
    const setBar = (id, val) => {
      const bar = document.querySelector('#' + id + ' .bar i');
      const v = document.querySelector('#' + id + ' .v');
      if (bar) bar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, val / 100)) + ')';
      if (v) v.textContent = Math.round(val);
    };
    setBar('hp', player.health);
    setBar('hun', player.hunger);
    setBar('thirst', player.thirst);
    setBar('warm', player.warmth);
    const wood = document.getElementById('wood-n');
    const food = document.getElementById('food-n');
    const stone = document.getElementById('stone-n');
    const fish = document.getElementById('fish-n');
    const axe = document.getElementById('axe-n');
    if (wood) wood.textContent = player.wood;
    if (food) food.textContent = player.food;
    if (stone) stone.textContent = player.stone;
    if (fish) fish.textContent = player.fish;
    if (axe) axe.textContent = player.axe ? 'yes' : 'no';
    const elev = Math.sin(ctx.worldTime * Math.PI * 2);
    const clock = document.getElementById('clock');
    if (clock) {
      if (elev > 0.6) clock.textContent = 'Morning';
      else if (elev > 0.2) clock.textContent = 'Day';
      else if (elev > -0.2) clock.textContent = 'Evening';
      else clock.textContent = 'Night';
    }
  }
  ctx.stepNeeds = stepNeeds;

  function rememberPlace(name) {
    const note = noteForPlace(name);
    if (note && !foundNotes.has(note.id)) {
      foundNotes.add(note.id);
      saveNotes(foundNotes);
      renderNotebook(foundNotes);
      toast('Noted: ' + name);
    }
  }
  ctx.rememberPlace = rememberPlace;

  function finishRest() {
    ctx.resting = false;
    player.warmth = Math.min(100, player.warmth + 30);
    player.hunger = Math.max(0, player.hunger - 8);
    toast('Morning light. You feel rested.');
  }
  ctx.finishRest = finishRest;

  function stepLandmarkLifts(now) {
    const t = now * 0.001;
    const lift = (arr, amp = 0.06) => {
      if (!arr) return;
      for (const m of arr) {
        if (m && m.userData && m.userData.baseY != null) {
          m.position.y = m.userData.baseY + Math.sin(t * 1.6 + (m.userData.phase || 0)) * amp;
        }
      }
    };
    const landmarks = ['rowanLean', 'willowDip', 'honeyStone', 'thistleSeat', 'cloverPad', 'daisyRing', 'rushNest', 'birchShelf', 'alderNook', 'hazelRest', 'mapleSill', 'aspenLean', 'cedarBowl', 'spruceCup', 'yewSill', 'elmDish', 'beechLedge', 'lindenSeat', 'poplarRest', 'ashLedge', 'hollyRest', 'walnutBench', 'chestnutRest', 'hawthornBench', 'elderBowl', 'juniperCup', 'mulberryRest', 'hornbeamShelf', 'sycamoreSeat', 'crabappleRest', 'dogwoodSeat', 'plumRest', 'pearRest', 'appleRest', 'cherryRest', 'quinceRest', 'serviceRest', 'larchRest', 'firRest', 'pineRest', 'cypressRest'];
    for (const name of landmarks) {
      const lm = ctx[name];
      if (lm && lm.berries) lift(lm.berries);
      if (lm && lm.seeds) lift(lm.seeds);
      if (lm && lm.leaves) lift(lm.leaves);
      if (lm && lm.hulls) lift(lm.hulls);
      if (lm && lm.blooms) lift(lm.blooms);
      if (lm && lm.keys) lift(lm.keys);
      if (lm && lm.balls) lift(lm.balls);
      if (lm && lm.needles) lift(lm.needles);
    }
  }
  ctx.stepLandmarkLifts = stepLandmarkLifts;

  ctx.stepBirds = stepBirds;
  ctx.stepRain = stepRain;
  ctx.rainWanted = rainWanted;
  ctx.currentPlace = currentPlace;
  ctx.heightAt = heightAt;

  addEventListener('keydown', e => {
    if (!getPlaying() || getNotebookOpen()) return;
    const k = e.key.toLowerCase();
    if (k === 'w') ctx.keys.w = true;
    if (k === 'a') ctx.keys.a = true;
    if (k === 's') ctx.keys.s = true;
    if (k === 'd') ctx.keys.d = true;
    if (k === 'e') doGather();
    if (k === 'f') doBuild();
    if (k === 'g') doPlant();
    if (k === 'r') doRest();
    if (k === 'm') toggleNotebook();
    if (k === 'tab' || k === 'q') { e.preventDefault(); cycleBuild(); }
    if (k === '1') doEat();
  });
  addEventListener('keyup', e => {
    const k = e.key.toLowerCase();
    if (k === 'w') ctx.keys.w = false;
    if (k === 'a') ctx.keys.a = false;
    if (k === 's') ctx.keys.s = false;
    if (k === 'd') ctx.keys.d = false;
  });

  const walkStick = document.getElementById('stick-walk');
  const knob = walkStick ? walkStick.querySelector('i') : null;
  let walkActive = false;
  let walkId = null;
  let walkOrigin = { x: 0, y: 0 };
  function setKnob(dx, dy) {
    if (!knob) return;
    const max = 35;
    const len = Math.hypot(dx, dy);
    if (len > max) { dx = dx / len * max; dy = dy / len * max; }
    knob.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    ctx.stick.x = dx / max;
    ctx.stick.z = -dy / max;
  }
  if (walkStick) {
    walkStick.addEventListener('pointerdown', e => {
      if (!getPlaying() || getNotebookOpen()) return;
      walkActive = true;
      walkId = e.pointerId;
      const r = walkStick.getBoundingClientRect();
      walkOrigin.x = r.left + r.width / 2;
      walkOrigin.y = r.top + r.height / 2;
      setKnob(e.clientX - walkOrigin.x, e.clientY - walkOrigin.y);
      walkStick.setPointerCapture(e.pointerId);
    });
    walkStick.addEventListener('pointermove', e => {
      if (!walkActive || e.pointerId !== walkId) return;
      setKnob(e.clientX - walkOrigin.x, e.clientY - walkOrigin.y);
    });
    const endWalk = e => {
      if (e.pointerId !== walkId) return;
      walkActive = false;
      ctx.stick.x = 0;
      ctx.stick.z = 0;
      if (knob) knob.style.transform = '';
    };
    walkStick.addEventListener('pointerup', endWalk);
    walkStick.addEventListener('pointercancel', endWalk);
  }

  function bindBtn(id, fn) {
    const b = document.getElementById(id);
    if (b) b.addEventListener('click', () => { if (getPlaying() && !getNotebookOpen()) fn(); });
  }
  bindBtn('btn-e', doGather);
  bindBtn('btn-f', doBuild);
  bindBtn('btn-g', doPlant);
  bindBtn('btn-r', doRest);
  bindBtn('btn-m', toggleNotebook);
  bindBtn('btn-q', cycleBuild);

  function toggleNotebook() {
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
    buildIndex = (buildIndex + 1) % buildPieces.length;
    updateBuildChip();
    toast(buildPieces[buildIndex]);
  }

  function doEat() {
    if (player.food > 0) {
      player.food -= 1;
      player.hunger = Math.min(100, player.hunger + 28);
      toast('Ate a berry. Hunger eases.');
    } else if (player.fish > 0) {
      player.fish -= 1;
      player.hunger = Math.min(100, player.hunger + 40);
      toast('Ate a fish. You feel stronger.');
    } else {
      toast('Nothing to eat.');
    }
  }

  function doGather() {
    const hx = hero.position.x, hz = hero.position.z;
    const specials = [
      [ctx.atCypressRest, 'Picked a few soft needles.', 'food'],
      [ctx.atPineRest, 'Picked a few soft needles.', 'food'],
      [ctx.atFirRest, 'Picked a few soft needles.', 'food'],
      [ctx.atLarchRest, 'Picked a few soft needles.', 'food'],
      [ctx.atServiceRest, 'Picked a few dark berries.', 'food'],
      [ctx.atQuinceRest, 'Picked a few quinces.', 'food'],
      [ctx.atCherryRest, 'Picked a few cherries.', 'food'],
      [ctx.atAppleRest, 'Picked a few apples.', 'food'],
      [ctx.atPearRest, 'Picked a few pears.', 'food'],
      [ctx.atPlumRest, 'Picked a few plums.', 'food'],
      [ctx.atDogwoodSeat, 'Picked a few blooms.', 'food'],
      [ctx.atCrabappleRest, 'Picked a few crabapples.', 'food'],
      [ctx.atSycamoreSeat, 'Picked a few seed balls.', 'food'],
      [ctx.atHornbeamShelf, 'Picked a few keys.', 'food'],
      [ctx.atMulberryRest, 'Picked a few berries.', 'food'],
      [ctx.atJuniperCup, 'Sipped from the cup.', 'thirst'],
      [ctx.atElderBowl, 'Sipped from the bowl.', 'thirst'],
      [ctx.atHawthornBench, 'Picked a few blooms.', 'food'],
      [ctx.atChestnutRest, 'Picked a few burrs.', 'food'],
      [ctx.atWalnutBench, 'Picked a few hulls.', 'food'],
      [ctx.atHollyRest, 'Picked a few berries.', 'food'],
      [ctx.atAshLedge, 'Picked a few keys.', 'food'],
      [ctx.atPoplarRest, 'Sipped from the dish.', 'thirst'],
      [ctx.atLindenSeat, 'Picked a few blooms.', 'food'],
      [ctx.atBeechLedge, 'Picked a few hulls.', 'food'],
      [ctx.atElmDish, 'Sipped from the dish.', 'thirst'],
      [ctx.atYewSill, 'Picked a few berries.', 'food'],
      [ctx.atSpruceCup, 'Sipped from the cup.', 'thirst'],
      [ctx.atCedarBowl, 'Sipped from the bowl.', 'thirst'],
      [ctx.atAspenLean, 'Picked a few leaves.', 'food'],
      [ctx.atMapleSill, 'Picked a few seeds.', 'food'],
      [ctx.atHazelRest, 'Picked a few nuts.', 'food'],
      [ctx.atAlderNook, 'Sipped from the bowl.', 'thirst'],
      [ctx.atBirchShelf, 'Took a curl of bark.', 'wood'],
      [ctx.atRushNest, 'Sipped from the dish.', 'thirst'],
      [ctx.atDaisyRing, 'Picked a few daisy heads.', 'food'],
      [ctx.atCloverPad, 'Sipped from the cup.', 'thirst'],
      [ctx.atThistleSeat, 'Picked a few seeds.', 'food'],
      [ctx.atHoneyStone, 'Sipped from the bowl.', 'thirst'],
      [ctx.atWillowDip, 'Sipped from the pool.', 'thirst'],
      [ctx.atRowanLean, 'Picked a few berries.', 'food'],
      [ctx.atSlowBend, 'You cast a line...', 'fish'],
    ];
    for (const [atFn, msg, kind] of specials) {
      if (atFn && atFn(hx, hz)) {
        if (kind === 'thirst') {
          player.thirst = Math.min(100, player.thirst + 22);
          toast(msg);
        } else if (kind === 'food') {
          player.food += 1;
          toast(msg);
        } else if (kind === 'wood') {
          player.wood += 1;
          toast(msg);
        } else if (kind === 'fish') {
          toast('Waiting on the line...');
          setTimeout(() => {
            if (Math.hypot(hero.position.x - hx, hero.position.z - hz) < 6) {
              player.fish += 1;
              toast('A fish.');
            } else toast('The line went quiet.');
          }, 1800);
        }
        return;
      }
    }
    if (ctx.atQuietWell && ctx.atQuietWell(hx, hz)) {
      player.thirst = Math.min(100, player.thirst + 30);
      toast('Cool water from the well.');
      return;
    }
    if (ctx.atShadePool && ctx.atShadePool(hx, hz)) {
      player.thirst = Math.min(100, player.thirst + 25);
      toast('Sipped from the shade pool.');
      return;
    }
    let best = null, bestD = 3.2;
    for (const it of interactives) {
      if (it.hp <= 0) continue;
      const d = Math.hypot(hx - it.x, hz - it.z);
      if (d < bestD) { best = it; bestD = d; }
    }
    if (best) {
      if (best.type === 'tree') {
        best.hp -= 1;
        player.wood += 1;
        toast('Chopped some wood.');
        if (best.hp <= 0) {
          scene.remove(best.mesh);
          best.hp = 0;
        }
      } else if (best.type === 'berry') {
        player.food += 1;
        toast('Picked berries.');
        best.hp = 0;
        scene.remove(best.mesh);
      } else if (best.type === 'rock') {
        player.stone += 1;
        toast('Took a stone.');
        best.hp -= 1;
        if (best.hp <= 0) {
          scene.remove(best.mesh);
          best.hp = 0;
        }
      }
      return;
    }
    toast('Nothing to gather here.');
  }

  function doBuild() {
    const hx = hero.position.x, hz = hero.position.z;
    const yaw = ctx.yaw;
    const px = hx + Math.sin(yaw) * 1.8;
    const pz = hz + Math.cos(yaw) * 1.8;
    const py = heightAt(px, pz);
    if (py < WATER_Y + 0.4) {
      toast('Too close to water.');
      return;
    }
    const piece = buildPieces[buildIndex];
    if (piece === 'wooden post') {
      if (player.wood < 2) { toast('Need 2 wood.'); return; }
      player.wood -= 2;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.6, 6), new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 }));
      post.position.set(px, py + 0.8, pz);
      post.castShadow = true;
      scene.add(post);
      toast('Set a post.');
    } else if (piece === 'campfire') {
      if (player.wood < 3 || player.stone < 1) { toast('Need 3 wood and 1 stone.'); return; }
      player.wood -= 3;
      player.stone -= 1;
      const fire = new THREE.Group();
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.12, 8), new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95 }));
      base.position.y = 0.06;
      fire.add(base);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 5), new THREE.MeshStandardMaterial({ color: 0xffaa44, emissive: 0xff6622, emissiveIntensity: 0.8 }));
      flame.position.y = 0.35;
      fire.add(flame);
      fire.position.set(px, py, pz);
      scene.add(fire);
      fires.push({ x: px, z: pz, mesh: fire });
      toast('Lit a fire.');
    } else if (piece === 'cabin wall') {
      if (player.wood < 6) { toast('Need 6 wood.'); return; }
      player.wood -= 6;
      const wall = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.6, 0.12), new THREE.MeshStandardMaterial({ color: 0x7a6248, roughness: 0.9 }));
      wall.position.set(px, py + 0.8, pz);
      wall.rotation.y = yaw;
      wall.castShadow = true;
      scene.add(wall);
      toast('Raised a wall.');
    } else if (piece === 'soil bed') {
      if (player.wood < 1) { toast('Need a bit of wood.'); return; }
      player.wood -= 1;
      const bed = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.8), new THREE.MeshStandardMaterial({ color: 0x5a4a32, roughness: 0.95 }));
      bed.position.set(px, py + 0.04, pz);
      bed.rotation.y = yaw;
      scene.add(bed);
      plots.push({ x: px, z: pz, watered: false, crop: null, growth: 0, mesh: bed });
      toast('Laid a soil bed.');
    }
  }

  function doPlant() {
    const hx = hero.position.x, hz = hero.position.z;
    let best = null, bestD = 2.5;
    for (const p of plots) {
      const d = Math.hypot(hx - p.x, hz - p.z);
      if (d < bestD && !p.crop) { best = p; bestD = d; }
    }
    if (!best) { toast('Stand on an empty soil bed.'); return; }
    if (player.food < 1) { toast('Need a berry to plant.'); return; }
    player.food -= 1;
    best.crop = 'greens';
    best.growth = 0;
    best.watered = false;
    const sprout = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.18, 4), new THREE.MeshStandardMaterial({ color: 0x4a6a32 }));
    sprout.position.set(best.x, heightAt(best.x, best.z) + 0.12, best.z);
    scene.add(sprout);
    best.sprout = sprout;
    toast('Planted. Water it when you can.');
  }

  function doRest() {
    const near = fires.some(f => Math.hypot(hero.position.x - f.x, hero.position.z - f.z) < 4);
    if (!near) { toast('Need a fire nearby to rest.'); return; }
    const elev = Math.sin(ctx.worldTime * Math.PI * 2);
    if (elev > -0.1) { toast('It is not night yet.'); return; }
    ctx.resting = true;
    ctx.restTarget = 0.22;
    toast('Resting by the fire...');
  }

  const origStep = ctx.stepNeeds;
  ctx.stepNeeds = function(dt) {
    origStep(dt);
    for (const p of plots) {
      if (p.crop && p.watered && p.growth < 1) {
        p.growth = Math.min(1, p.growth + dt * 0.02);
        if (p.sprout) p.sprout.scale.y = 0.4 + p.growth * 1.6;
      }
      if (ctx.raining && !p.watered) p.watered = true;
    }
  };

  startTick(ctx);
}
