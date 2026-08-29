import * as THREE from 'three';

export const WORLD = 460;
export const WATER_Y = 1.35;
export const EYE = 1.67;
export const SEED = 2041;
export const SAVE_KEY = 'wildmere-v3';
export const WELL = { x: -8, z: -22 };

function fade(t){ return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a, b, t){ return a + (b - a) * t; }
function hash2(ix, iy){
  let n = (ix * 374761393 + iy * 668265263 + SEED * 13) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
export function vnoise(x, y){
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const u = fade(fx), v = fade(fy);
  return lerp(lerp(hash2(ix, iy), hash2(ix + 1, iy), u), lerp(hash2(ix, iy + 1), hash2(ix + 1, iy + 1), u), v);
}
export function fbm(x, y, oct = 5){
  let sum = 0, amp = 1, freq = 1, norm = 0;
  for (let i = 0; i < oct; i++){
    sum += amp * vnoise(x * freq, y * freq);
    norm += amp; amp *= 0.5; freq *= 2.03;
  }
  return sum / norm;
}
export function riverT(x, z){
  return x - (14 * Math.sin(z * 0.016) + 7 * Math.sin(z * 0.049 + 1.7));
}
export function riverDist(x, z){ return Math.abs(riverT(x, z)); }
export function heightAt(x, z){
  const nx = x * 0.0058, nz = z * 0.0058;
  let h = Math.pow(fbm(nx + 20, nz + 8, 6), 1.12);
  let elev = (h - 0.42) * 30;
  const d = Math.hypot(x, z) / (WORLD * 0.55);
  elev += (1 - Math.min(1, d * d)) * 1.1;
  const rd = riverDist(x, z);
  const carve = Math.max(0, 1 - rd / 10);
  elev -= carve * carve * 8.2;
  elev += fbm(x * 0.0028, z * 0.0028 + 40, 3) * 7;
  return elev;
}

const barkLeaf = new THREE.MeshStandardMaterial({ color: 0x5c4030, roughness: 0.92 });
const barkPine = new THREE.MeshStandardMaterial({ color: 0x4a3b30, roughness: 0.94 });
const leafMats = [
  new THREE.MeshStandardMaterial({ color: 0x2f5a28, roughness: 0.86 }),
  new THREE.MeshStandardMaterial({ color: 0x3a6b30, roughness: 0.86 }),
  new THREE.MeshStandardMaterial({ color: 0x274820, roughness: 0.88 }),
  new THREE.MeshStandardMaterial({ color: 0x456b34, roughness: 0.84 })
];
const pineMat = new THREE.MeshStandardMaterial({ color: 0x1f3d28, roughness: 0.9 });

export function makeBroadleaf(scale = 1){
  const g = new THREE.Group();
  const trunkH = (3.6 + Math.random() * 2.2) * scale;
  const trunkR = (0.15 + Math.random() * 0.09) * scale;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(trunkR * 0.62, trunkR, trunkH, 8), barkLeaf);
  trunk.position.y = trunkH * 0.5; trunk.castShadow = true; g.add(trunk);
  for (let i = 0; i < 4; i++){
    const len = (0.7 + Math.random() * 0.9) * scale;
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.035 * scale, 0.055 * scale, len, 5), barkLeaf);
    const a = (i / 4) * Math.PI * 2;
    br.position.set(Math.sin(a) * 0.18 * scale, trunkH * 0.65, Math.cos(a) * 0.18 * scale);
    br.rotation.z = Math.cos(a) * 0.8; br.rotation.x = Math.sin(a) * 0.8; g.add(br);
  }
  for (let i = 0; i < 6; i++){
    const fol = new THREE.Mesh(new THREE.SphereGeometry((0.7 + Math.random() * 0.55) * scale, 8, 6), leafMats[i % 4]);
    fol.position.set((Math.random() - 0.5) * 1.5 * scale, trunkH * 0.8 + Math.random() * 1.1 * scale, (Math.random() - 0.5) * 1.5 * scale);
    fol.castShadow = true; g.add(fol);
  }
  return g;
}
export function makePine(scale = 1){
  const g = new THREE.Group();
  const trunkH = (5.2 + Math.random() * 2.2) * scale;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * scale, 0.15 * scale, trunkH, 7), barkPine);
  trunk.position.y = trunkH * 0.5; trunk.castShadow = true; g.add(trunk);
  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const cone = new THREE.Mesh(new THREE.ConeGeometry((1.5 - t * 1.1) * scale, 1.2 * scale, 8), pineMat);
    cone.position.y = trunkH * 0.4 + i * 0.82 * scale; cone.castShadow = true; g.add(cone);
  }
  return g;
}
export function makeTree(scale = 1, kind = 'leaf'){ return kind === 'pine' ? makePine(scale) : makeBroadleaf(scale); }
export function treeKindAt(x, z){
  if (heightAt(x, z) > 11.5 || fbm(x * 0.01 + 3, z * 0.01 + 9, 3) > 0.56) return 'pine';
  return 'leaf';
}
export function addBerryBush(scene, x, y, z){
  const bush = new THREE.Group();
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6), new THREE.MeshStandardMaterial({ color: 0x2a4a24, roughness: 0.88 }));
  leaf.position.y = 0.42; bush.add(leaf);
  const berry = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 5), new THREE.MeshStandardMaterial({ color: 0x8b2040 }));
  berry.position.set(0.2, 0.5, 0.15); bush.add(berry);
  bush.position.set(x, y, z); scene.add(bush); return bush;
}
function makeLimb(len, rTop, rBot, mat){
  const wrap = new THREE.Group();
  const bone = new THREE.Mesh(new THREE.CylinderGeometry(rBot, rTop, len, 8), mat);
  bone.position.y = -len * 0.5; wrap.add(bone);
  return wrap;
}
function addHair(parent, hairM){
  const hair = new THREE.Group();
  hair.position.y = 0.8;
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), hairM);
  cap.scale.set(1.12, 0.95, 1.16);
  cap.position.set(0, 0.055, -0.018);
  hair.add(cap);
  const back = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), hairM);
  back.position.set(0, 0.0, -0.09);
  back.scale.set(1.15, 0.95, 1.0);
  hair.add(back);
  const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), hairM);
  fringe.position.set(0, 0.03, 0.11);
  fringe.scale.set(1.45, 0.42, 0.55);
  hair.add(fringe);
  for (const sx of [-0.12, 0.12]){
    const side = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), hairM);
    side.position.set(sx, -0.01, 0.02);
    side.scale.set(0.75, 1.15, 0.9);
    hair.add(side);
  }
  parent.add(hair);
}
export function makeHuman(){
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0xb88962, roughness: 0.58 });
  const shirt = new THREE.MeshStandardMaterial({ color: 0x5a6750, roughness: 0.8 });
  const pants = new THREE.MeshStandardMaterial({ color: 0x3d3832, roughness: 0.86 });
  const hairM = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.92 });
  const boot = new THREE.MeshStandardMaterial({ color: 0x2a241e, roughness: 0.9 });
  const hips = new THREE.Group(); hips.position.y = 0.94; g.add(hips);
  const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), pants);
  pelvis.scale.set(1.2, 0.52, 0.88); hips.add(pelvis);
  const lLeg = makeLimb(0.44, 0.055, 0.046, pants); lLeg.position.set(-0.075, 0, 0.015); hips.add(lLeg);
  const rLeg = makeLimb(0.44, 0.055, 0.046, pants); rLeg.position.set(0.075, 0, 0.015); hips.add(rLeg);
  const lShin = makeLimb(0.42, 0.045, 0.038, pants); lShin.position.y = -0.44; lLeg.add(lShin);
  const rShin = makeLimb(0.42, 0.045, 0.038, pants); rShin.position.y = -0.44; rLeg.add(rShin);
  const lFoot = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.045, 0.16), boot); lFoot.position.set(0, -0.44, 0.04); lShin.add(lFoot);
  rShin.add(lFoot.clone());
  const torsoG = new THREE.Group(); torsoG.position.y = 0.94; g.add(torsoG);
  const chest = new THREE.Mesh(new THREE.CapsuleGeometry(0.145, 0.36, 6, 10), shirt); chest.position.y = 0.36; torsoG.add(chest);
  const lArm = makeLimb(0.3, 0.04, 0.034, shirt); lArm.position.set(-0.195, 0.56, 0); torsoG.add(lArm);
  const rArm = makeLimb(0.3, 0.04, 0.034, skin); rArm.position.set(0.195, 0.56, 0); torsoG.add(rArm);
  const lFore = makeLimb(0.28, 0.033, 0.028, skin); lFore.position.y = -0.3; lArm.add(lFore);
  const rFore = makeLimb(0.28, 0.033, 0.028, skin); rFore.position.y = -0.3; rArm.add(rFore);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.048, 0.1, 8), skin); neck.position.y = 0.66; torsoG.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.122, 14, 12), skin); head.position.y = 0.8; head.scale.set(0.94, 1.06, 0.96); torsoG.add(head);
  addHair(torsoG, hairM);
  g.userData.legs = [lLeg, rLeg];
  g.userData.shins = [lShin, rShin];
  g.userData.arms = [lArm, rArm];
  g.userData.fores = [lFore, rFore];
  g.userData.torso = torsoG;
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}
export function makeStoneRing(scene, cx, cz){
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95 });
  const y = heightAt(cx, cz);
  for (let i = 0; i < 8; i++){
    const a = i * 0.785;
    const h = 0.9 + (i % 3) * 0.35;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.38, h, 0.28), stone);
    s.position.set(cx + Math.cos(a) * 2.4, y + h * 0.5, cz + Math.sin(a) * 2.4);
    s.rotation.y = a;
    scene.add(s);
  }
  return { x: cx, z: cz, name: 'The Old Ring' };
}
export function makeMossSeat(scene, cx, cz){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x5e5a54, roughness: 0.95 });
  const y = heightAt(cx, cz);
  for (let i = 0; i < 5; i++){
    const a = -0.7 + i * 0.35;
    const h = 0.22 + (i % 2) * 0.14;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.42, h, 0.3), stone);
    s.position.set(cx + Math.cos(a) * 1.55, y + h * 0.5, cz + Math.sin(a) * 1.55);
    s.rotation.y = a;
    s.castShadow = true;
    scene.add(s);
  }
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.15, 0.07, 12), moss);
  pad.position.set(cx, y + 0.035, cz);
  pad.receiveShadow = true;
  scene.add(pad);
  return { x: cx, z: cz, name: 'The Moss Seat' };
}
export function atQuietWell(x, z){
  return Math.hypot(x - WELL.x, z - WELL.z) < 5.2;
}
export function makeQuietWell(scene, cx = WELL.x, cz = WELL.z){
  const stone = new THREE.MeshStandardMaterial({ color: 0x5a564e, roughness: 0.96 });
  const moss = new THREE.MeshStandardMaterial({ color: 0x3e4a32, roughness: 0.9 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x5c4634, roughness: 0.9 });
  const water = new THREE.MeshStandardMaterial({ color: 0x2a3e42, roughness: 0.18, metalness: 0.08 });
  const y = heightAt(cx, cz);
  const group = new THREE.Group();
  group.position.set(cx, y, cz);
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.08, 0.55, 12), stone);
  ring.position.y = 0.28;
  ring.castShadow = true;
  group.add(ring);
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.2, 12), water);
  inner.position.y = 0.22;
  group.add(inner);
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.45, 0.06, 12), moss);
  pad.position.y = 0.03;
  pad.receiveShadow = true;
  group.add(pad);
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.15, 0.08), wood);
  p1.position.set(-0.7, 0.85, 0);
  const p2 = p1.clone();
  p2.position.x = 0.7;
  const beam = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.07, 0.07), wood);
  beam.position.set(0, 1.4, 0);
  group.add(p1, p2, beam);
  const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.16, 8), wood);
  bucket.position.set(0.55, 0.66, 0.35);
  group.add(bucket);
  scene.add(group);
  return { x: cx, z: cz, name: 'The Quiet Well' };
}
export function makeRiverWater(waterMat){
  const group = new THREE.Group();
  const geo = new THREE.PlaneGeometry(16, 10);
  for (let z = -210; z <= 210; z += 8){
    const x = 14 * Math.sin(z * 0.016) + 7 * Math.sin(z * 0.049 + 1.7);
    const slab = new THREE.Mesh(geo, waterMat);
    slab.rotation.x = -Math.PI / 2; slab.position.set(x, WATER_Y, z); group.add(slab);
  }
  return group;
}
export function currentPlace(x, z){
  if (atQuietWell(x, z)) return 'The Quiet Well';
  if (Math.hypot(x + 18, z - 8) < 8) return 'The Old Ring';
  if (Math.hypot(x - 32, z + 14) < 6) return 'The Moss Seat';
  if (Math.hypot(x - 4, z - 18) < 24) return 'The Clearing';
  if (riverDist(x, z) < 14) return 'Reedford Crossing';
  if (heightAt(x, z) > 13) return 'High Spine';
  if (fbm(x * 0.01 + 3, z * 0.01 + 9, 3) > 0.58 && heightAt(x, z) > 3) return 'The Quiet Pines';
  return 'Open ground';
}

export function addGrassTufts(scene){
  const mat = new THREE.MeshStandardMaterial({ color: 0x4a6a32, roughness: 0.95 });
  const geo = new THREE.ConeGeometry(0.045, 0.3, 4);
  for (let i = 0; i < 90; i++){
    const a = Math.random() * 6.28;
    const r = 4 + Math.random() * 38;
    const x = 10 + Math.cos(a) * r;
    const z = 22 + Math.sin(a) * r;
    const y = heightAt(x, z);
    if (y < WATER_Y + 0.45 || riverDist(x, z) < 5.5) continue;
    const n = 3 + (i % 3);
    for (let k = 0; k < n; k++){
      const blade = new THREE.Mesh(geo, mat);
      blade.position.set(x + (Math.random() - 0.5) * 0.34, y + 0.14, z + (Math.random() - 0.5) * 0.34);
      blade.rotation.z = (Math.random() - 0.5) * 0.32;
      blade.rotation.y = Math.random() * 6.28;
      scene.add(blade);
    }
  }
}

export function addValleyBirds(scene){
  const birds = [];
  const wingMat = new THREE.MeshStandardMaterial({ color: 0x2c2a26, roughness: 0.75, side: THREE.DoubleSide });
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3a3834, roughness: 0.82 });
  for (let i = 0; i < 7; i++){
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.26, 5), bodyMat);
    body.rotation.x = Math.PI / 2;
    g.add(body);
    const lw = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.11), wingMat);
    lw.position.set(-0.13, 0, 0);
    const rw = lw.clone();
    rw.position.set(0.13, 0, 0);
    g.add(lw); g.add(rw);
    g.userData.wings = [lw, rw];
    g.userData.radius = 16 + i * 7;
    g.userData.height = 15 + (i % 3) * 3.2;
    g.userData.speed = 0.16 + (i % 4) * 0.035;
    g.userData.phase = i * 0.85;
    g.userData.cx = 8;
    g.userData.cz = 18;
    scene.add(g);
    birds.push(g);
  }
  return birds;
}

export function stepBirds(birds, t){
  for (const b of birds){
    const u = b.userData;
    const a = t * u.speed + u.phase;
    b.position.set(u.cx + Math.cos(a) * u.radius, u.height, u.cz + Math.sin(a) * u.radius);
    b.rotation.y = -a + Math.PI / 2;
    const flap = Math.sin(t * 8.5 + u.phase) * 0.48;
    u.wings[0].rotation.z = flap;
    u.wings[1].rotation.z = -flap;
  }
}

export function addDistantRidges(scene){
  const nearMat = new THREE.MeshStandardMaterial({ color: 0x5c6e48, roughness: 0.96, flatShading: true });
  const midMat = new THREE.MeshStandardMaterial({ color: 0x62725a, roughness: 0.97, flatShading: true });
  const farMat = new THREE.MeshStandardMaterial({ color: 0x6a7a70, roughness: 0.98, flatShading: true });
  const group = new THREE.Group();
  group.name = 'distant-ridges';
  for (let i = 0; i < 28; i++){
    const a = (i / 28) * Math.PI * 2 + hash2(i, 3) * 0.4;
    const r = 255 + hash2(i, 7) * 55;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const baseH = 14 + hash2(i, 11) * 22;
    const w = 28 + hash2(i, 13) * 36;
    const ridge = new THREE.Mesh(new THREE.ConeGeometry(w * 0.55, baseH, 5 + (i % 3)), nearMat);
    ridge.position.set(x, baseH * 0.28, z);
    ridge.rotation.y = a + hash2(i, 17) * 1.2;
    ridge.scale.set(1 + hash2(i, 19) * 0.6, 1, 0.55 + hash2(i, 23) * 0.5);
    group.add(ridge);
    if (hash2(i, 29) > 0.45){
      const h2 = baseH * (0.45 + hash2(i, 31) * 0.35);
      const side = new THREE.Mesh(new THREE.ConeGeometry(w * 0.28, h2, 5), nearMat);
      const off = 18 + hash2(i, 37) * 14;
      side.position.set(x + Math.cos(a + 1.1) * off, h2 * 0.25, z + Math.sin(a + 1.1) * off);
      side.scale.set(1.2, 1, 0.7);
      group.add(side);
    }
  }
  for (let i = 0; i < 20; i++){
    const a = (i / 20) * Math.PI * 2 + 0.3 + hash2(i + 40, 5) * 0.35;
    const r = 340 + hash2(i + 40, 9) * 50;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const baseH = 22 + hash2(i + 40, 15) * 28;
    const w = 40 + hash2(i + 40, 21) * 45;
    const ridge = new THREE.Mesh(new THREE.ConeGeometry(w * 0.5, baseH, 5), midMat);
    ridge.position.set(x, baseH * 0.3, z);
    ridge.rotation.y = a;
    ridge.scale.set(1.1, 1, 0.6);
    group.add(ridge);
  }
  for (let i = 0; i < 14; i++){
    const a = (i / 14) * Math.PI * 2 + 0.7;
    const r = 420 + hash2(i + 80, 4) * 40;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const baseH = 30 + hash2(i + 80, 12) * 35;
    const ridge = new THREE.Mesh(new THREE.ConeGeometry(55 + hash2(i + 80, 18) * 40, baseH, 6), farMat);
    ridge.position.set(x, baseH * 0.32, z);
    ridge.scale.set(1.3, 1, 0.55);
    group.add(ridge);
  }
  scene.add(group);
  return group;
}
