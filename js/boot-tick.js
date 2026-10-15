import * as THREE from 'three';
import { startTick } from './tick.js';
import { heightAt, currentPlace, atLarkPost, atFernStair, atEveningBell, atRowanLean, atWillowDip, atHoneyStone, atThistleSeat, atCloverPad, atDaisyRing, atRushNest, atBirchShelf, atAlderNook, atHazelRest, atMapleSill, atAspenLean, atCedarBowl, atSpruceCup, atYewSill, atElmDish, atBeechLedge, atLindenSeat, atPoplarRest, atAshLedge, atHollyRest, atWalnutBench, atChestnutRest, atHawthornBench, atElderBowl, atJuniperCup, atMulberryRest, atHornbeamShelf, atSycamoreSeat, atCrabappleRest, atDogwoodSeat, atPlumRest,
    atPearRest, atAppleRest, riverDist } from './world.js';
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
    atWillowDip,
    atHoneyStone,
    atThistleSeat,
    atCloverPad,
    atDaisyRing,
    atRushNest,
    atBirchShelf,
    atAlderNook,
    atHazelRest,
    atMapleSill,
    atAspenLean,
    atCedarBowl,
    atSpruceCup,
    atYewSill,
    atElmDish,
    atBeechLedge,
    atLindenSeat,
    atPoplarRest,
    atAshLedge,
    atHollyRest,
    atWalnutBench,
    atChestnutRest,
    atHawthornBench,
    atElderBowl,
    atJuniperCup,
    atMulberryRest,
    atHornbeamShelf,
    atSycamoreSeat,
    atCrabappleRest,
    atDogwoodSeat,
    atPlumRest,
    atPearRest,
    atAppleRest,
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
    foundWillow: false,
    foundHoney: false,
    foundThistle: false,
    foundClover: false,
    foundDaisy: false,
    foundRush: false,
    foundBirch: false,
    foundAlder: false,
    foundHazel: false,
    foundMaple: false,
    foundAspen: false,
    foundCedar: false,
    foundSpruce: false,
    foundYew: false,
    foundElm: false,
    foundBeech: false,
    foundLinden: false,
    foundPoplar: false,
    foundAsh: false,
    foundHolly: false,
    foundWalnut: false,
    foundChestnut: false,
    foundHawthorn: false,
    foundElder: false,
    foundJuniper: false,
    foundMulberry: false,
    foundHornbeam: false,
    foundSycamore: false,
    foundCrabapple: false,
    foundDogwood: false,
    foundPlum: false,
    foundPear: false,
    foundApple: false,
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
    const ax = document.getElementById('axe-n'); if (ax) ax.textContent = player.axe ? 'yes' : 'no';
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
    if (atWillowDip(hero.position.x, hero.position.z)){
      player.thirst = Math.min(100, player.thirst + 22);
      ctx.toast('A sip from the root pool. Cool and a little sweet.');
      hud();
      return;
    }
    if (atHoneyStone(hero.position.x, hero.position.z)){
      player.hunger = Math.min(100, player.hunger + 16);
      player.thirst = Math.min(100, player.thirst + 8);
      ctx.toast('A sip from the bowl. Warm and sweet.');
      hud();
      return;
    }
    if (atThistleSeat(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A dry thistle head. A few seeds in the palm.');
      hud();
      return;
    }
    if (atCloverPad(hero.position.x, hero.position.z)){
      player.thirst = Math.min(100, player.thirst + 18);
      ctx.toast('Rainwater in the tin cup. Cool and a little grassy.');
      hud();
      return;
    }
    if (atDaisyRing(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few daisy heads. Light, and they keep.');
      hud();
      return;
    }
    if (atRushNest(hero.position.x, hero.position.z)){
      player.thirst = Math.min(100, player.thirst + 16);
      ctx.toast('A sip from the stone dish. Cool, with a taste of grass.');
      hud();
      return;
    }
    if (atBirchShelf(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A curl of pale bark. Thin, and it keeps.');
      hud();
      return;
    }
    if (atAlderNook(hero.position.x, hero.position.z)){
      player.thirst = Math.min(100, player.thirst + 16);
      ctx.toast('A sip from the stone bowl. Cool, with a taste of leaf.');
      hud();
      return;
    }
    if (atHazelRest(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few hazel nuts. Small, and they keep.');
      hud();
      return;
    }
    if (atMapleSill(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few maple seeds. Light, and they keep.');
      hud();
      return;
    }
    if (atAspenLean(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few aspen leaves. Thin, and they keep.');
      hud();
      return;
    }
    if (atCedarBowl(hero.position.x, hero.position.z)){
      player.thirst = Math.min(100, player.thirst + 16);
      ctx.toast('A sip from the cedar bowl. Cool, with a taste of resin.');
      hud();
      return;
    }
    if (atSpruceCup(hero.position.x, hero.position.z)){
      player.thirst = Math.min(100, player.thirst + 16);
      ctx.toast('A sip from the spruce cup. Cool, with a taste of needle.');
      hud();
      return;
    }
    if (atYewSill(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few yew berries. Small, and they keep.');
      hud();
      return;
    }
    if (atElmDish(hero.position.x, hero.position.z)){
      player.thirst = Math.min(100, player.thirst + 16);
      ctx.toast('A sip from the elm dish. Cool, with a taste of leaf.');
      hud();
      return;
    }
    if (atBeechLedge(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few beech hulls. Small, and they keep.');
      hud();
      return;
    }
    if (atLindenSeat(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few linden blooms. Soft, and they keep.');
      hud();
      return;
    }
    if (atPoplarRest(hero.position.x, hero.position.z)){
      player.thirst = Math.min(100, player.thirst + 16);
      ctx.toast('A sip from the poplar dish. Cool, with a taste of leaf.');
      hud();
      return;
    }
    if (atAshLedge(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few ash keys. Thin, and they keep.');
      hud();
      return;
    }
    if (atHollyRest(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few holly berries. Small, and they keep.');
      hud();
      return;
    }
    if (atWalnutBench(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few walnut hulls. Green, and they keep.');
      hud();
      return;
    }
    if (atChestnutRest(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few chestnut burrs. Spiny, and they keep.');
      hud();
      return;
    }
    if (atHawthornBench(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few hawthorn blooms. Pale, and they keep.');
      hud();
      return;
    }
    if (atElderBowl(hero.position.x, hero.position.z)){
      player.thirst = Math.min(100, player.thirst + 16);
      ctx.toast('A sip from the elder bowl. Cool, with a taste of flower.');
      hud();
      return;
    }
    if (atJuniperCup(hero.position.x, hero.position.z)){
      player.thirst = Math.min(100, player.thirst + 16);
      ctx.toast('A sip from the juniper cup. Cool, with a taste of berry.');
      hud();
      return;
    }
    if (atMulberryRest(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few mulberry berries. Dark, and they keep.');
      hud();
      return;
    }
    if (atHornbeamShelf(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few hornbeam keys. Thin, and they keep.');
      hud();
      return;
    }
    if (atSycamoreSeat(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few sycamore balls. Round, and they keep.');
      hud();
      return;
    }
    if (atCrabappleRest(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few crabapples. Tart, and they keep.');
      hud();
      return;
    }
    if (atDogwoodSeat(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few dogwood blooms. Pale, and they keep.');
      hud();
      return;
    }
    if (atPlumRest(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few plums. Dark and soft, and they keep.');
      hud();
      return;
    }
    if (atPearRest(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few pears. Green and firm, and they keep.');
      hud();
      return;
    }
    if (atAppleRest(hero.position.x, hero.position.z)){
      player.food = Math.min(player.food + 1, 24);
      ctx.toast('A few apples. Red and crisp, and they keep.');
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
    if (!it){
      if (!player.axe && player.wood >= 3 && player.stone >= 2){
        player.wood -= 3;
        player.stone -= 2;
        player.axe = true;
        ctx.toast('Bound a small axe. Trees come down cleaner.');
        hud();
        return;
      }
      if (!player.axe){
        ctx.toast('Walk to a tree, bush, or stone. An axe needs 3 wood and 2 stone.');
        return;
      }
      ctx.toast('Walk to a tree, bush, stone, or soil bed');
      return;
    }
    if (it.type === 'tree'){
      if (player.axe){
        player.wood += 3; it.hp -= 2; it.mesh.scale.multiplyScalar(0.72);
        ctx.toast('+3 wood');
      } else {
        player.wood += 2; it.hp -= 1; it.mesh.scale.multiplyScalar(0.88);
        ctx.toast('+2 wood');
      }
      if (it.hp <= 0) it.mesh.visible = false;
    } else if (it.type === 'berry'){
      player.food += 2; it.mesh.visible = false; ctx.toast('+2 berries');
    } else if (it.type === 'rock'){
      player.stone += 1; it.hp -= 1; if (it.hp <= 0) it.mesh.visible = false; ctx.toast('+1 stone');
      if (!player.axe && player.wood >= 3 && player.stone >= 2){
        ctx.toast('Stone in hand. Stand clear and press E to bind an axe.');
      }
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
    } else if (spec.id === 'cabin'){
      mesh = new THREE.Group();
      const wall = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 0.1), woodM);
      wall.position.set(0, 0.9, -1.1); mesh.add(wall);
      const wall2 = wall.clone(); wall2.position.z = 1.1; mesh.add(wall2);
      const side = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.8, 2.2), woodM);
      side.position.set(-1.1, 0.9, 0); mesh.add(side);
      const side2 = side.clone(); side2.position.x = 1.1; mesh.add(side2);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 2.6), woodM);
      roof.position.y = 1.9; mesh.add(roof);
      mesh.position.set(x, y, z);
    } else if (spec.id === 'plot'){
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.75, 0.08, 8), soilMat);
      mesh.position.set(x, y + 0.04, z);
      plots.push({ x, z, y, bed: mesh, crop: null, growth: 0, watered: false, cropMesh: null });
    }
    if (mesh){
      scene.add(mesh);
      ctx.toast('Placed ' + spec.label);
    }
    hud();
  }
  function rest(){
    if (!parts.getPlaying() || ctx.notebookOpen) return;
    if (resting) return;
    let nearFire = false;
    for (const f of fires){
      if (Math.hypot(f.x - hero.position.x, f.z - hero.position.z) < 3.5) nearFire = true;
    }
    if (!nearFire){ ctx.toast('Stand by a campfire to rest'); return; }
    resting = true;
    ctx.resting = true;
    ctx.restSpeed = 0.08;
    ctx.restTarget = 0.22;
    ctx.toast('Resting by the fire…');
  }
  function finishRest(){
    resting = false;
    ctx.resting = false;
    player.warmth = Math.min(100, player.warmth + 40);
    player.hunger = Math.max(0, player.hunger - 8);
    ctx.toast('Morning. The fire is low.');
    hud();
  }
  ctx.finishRest = finishRest;

  function stepNeeds(dt){
    if (resting) return;
    player.hunger = Math.max(0, player.hunger - dt * 0.35);
    player.thirst = Math.max(0, player.thirst - dt * 0.45);
    let nearFire = false;
    for (const f of fires){
      if (Math.hypot(f.x - hero.position.x, f.z - hero.position.z) < 4) nearFire = true;
    }
    if (nearFire) player.warmth = Math.min(100, player.warmth + dt * 8);
    else player.warmth = Math.max(0, player.warmth - dt * 0.4);
    if (ctx.raining && !nearFire) player.warmth = Math.max(0, player.warmth - dt * 0.6);
    if (player.hunger < 20) player.health = Math.max(0, player.health - dt * 0.8);
    if (player.thirst < 15) player.health = Math.max(0, player.health - dt * 1.1);
    if (player.warmth < 25) player.health = Math.max(0, player.health - dt * 0.5);
    if (player.health <= 0){
      ctx.toast('The valley takes you back to the clearing.');
      hero.position.set(10, heightAt(10, 26), 26);
      player.health = 60; player.hunger = 50; player.thirst = 50; player.warmth = 60;
    }
    for (const p of plots){
      if (p.crop && p.watered){
        p.growth = Math.min(1, p.growth + dt * 0.012);
        if (p.growth >= 1 && !p.ripe){
          p.ripe = true;
          refreshPlotLook(p);
        }
      }
      if (ctx.raining && p.crop) p.watered = true;
    }
    hud();
  }
  ctx.stepNeeds = stepNeeds;

  // Phone pads and buttons
  const leftPad = document.getElementById('left-pad');
  const rightPad = document.getElementById('right-pad');
  const walkKnob = document.getElementById('walk-knob');
  if (leftPad){
    leftPad.addEventListener('pointerdown', e => {
      if (!parts.getPlaying() || ctx.notebookOpen) return;
      e.preventDefault();
      const rect = leftPad.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dz = (e.clientY - cy) / (rect.height / 2);
      stick.x = Math.max(-1, Math.min(1, dx));
      stick.z = Math.max(-1, Math.min(1, -dz));
      if (walkKnob){
        walkKnob.style.left = (50 + stick.x * 30) + '%';
        walkKnob.style.top = (50 - stick.z * 30) + '%';
      }
    });
    leftPad.addEventListener('pointermove', e => {
      if (!e.buttons) return;
      const rect = leftPad.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dz = (e.clientY - cy) / (rect.height / 2);
      stick.x = Math.max(-1, Math.min(1, dx));
      stick.z = Math.max(-1, Math.min(1, -dz));
      if (walkKnob){
        walkKnob.style.left = (50 + stick.x * 30) + '%';
        walkKnob.style.top = (50 - stick.z * 30) + '%';
      }
    });
    leftPad.addEventListener('pointerup', () => {
      stick.x = 0; stick.z = 0;
      if (walkKnob){
        walkKnob.style.left = '50%';
        walkKnob.style.top = '50%';
      }
    });
  }

  document.getElementById('btn-e')?.addEventListener('click', gather);
  document.getElementById('btn-f')?.addEventListener('click', place);
  document.getElementById('btn-g')?.addEventListener('click', plant);
  document.getElementById('btn-r')?.addEventListener('click', rest);
  document.getElementById('btn-m')?.addEventListener('click', toggleNotebook);
  document.getElementById('btn-tab')?.addEventListener('click', () => {
    buildIndex = (buildIndex + 1) % BUILDS.length;
    hud();
    ctx.toast('Build: ' + BUILDS[buildIndex].label);
  });

  addEventListener('keydown', e => {
    if (e.key === 'w' || e.key === 'W') keys.w = 1;
    if (e.key === 'a' || e.key === 'A') keys.a = 1;
    if (e.key === 's' || e.key === 'S') keys.s = 1;
    if (e.key === 'd' || e.key === 'D') keys.d = 1;
    if (e.key === 'e' || e.key === 'E') gather();
    if (e.key === 'f' || e.key === 'F') place();
    if (e.key === 'g' || e.key === 'G') plant();
    if (e.key === 'r' || e.key === 'R') rest();
    if (e.key === 'm' || e.key === 'M' || e.key === 'Tab') {
      if (e.key === 'Tab') e.preventDefault();
      toggleNotebook();
    }
    if (e.key === '1') eat();
    if (e.key === 'Escape'){
      if (ctx.notebookOpen) toggleNotebook();
    }
  });
  addEventListener('keyup', e => {
    if (e.key === 'w' || e.key === 'W') keys.w = 0;
    if (e.key === 'a' || e.key === 'A') keys.a = 0;
    if (e.key === 's' || e.key === 'S') keys.s = 0;
    if (e.key === 'd' || e.key === 'D') keys.d = 0;
  });

  ctx.stepLandmarkLifts = function(now){
    const list = [
      parts.dogwoodSeat, parts.crabappleRest, parts.sycamoreSeat,
      parts.hornbeamShelf, parts.mulberryRest, parts.plumRest, parts.pearRest, parts.appleRest
    ];
    for (const lm of list){
      if (!lm) continue;
      const items = lm.blooms || lm.fruits || lm.keys || lm.berries || [];
      for (const item of items){
        if (item && item.userData && item.userData.baseY != null){
          item.position.y = item.userData.baseY + Math.sin(now * 0.002 + (item.userData.phase || 0)) * 0.028;
        }
      }
    }
  };

  startTick(ctx);
}
