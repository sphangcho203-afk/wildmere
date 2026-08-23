import * as THREE from 'three';

export const WORLD = 460;
export const WATER_Y = 1.35;
export const EYE = 1.67;
export const SEED = 2041;
export const SAVE_KEY = 'wildmere-v3';

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
  const canopy = new THREE.Group();
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
    fol.castShadow = true; canopy.add(fol);
  }
  g.add(canopy); return g;
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
export function makeHuman(){
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0xb88962, roughness: 0.58 });
  const shirt = new THREE.MeshStandardMaterial({ color: 0x5a6750, roughness: 0.8 });
  const pants = new THREE.MeshStandardMaterial({ color: 0x3d3832, roughness: 0.86 });
  const hairM = new THREE.MeshStandardMaterial({ color: 0x1c1612, roughness: 0.95 });
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
  const rArm = makeLimb(0.3, 0.04, 0.034, shirt); rArm.position.set(0.195, 0.56, 0); torsoG.add(rArm);
  const lFore = makeLimb(0.28, 0.033, 0.028, skin); lFore.position.y = -0.3; lArm.add(lFore);
  const rFore = makeLimb(0.28, 0.033, 0.028, skin); rFore.position.y = -0.3; rArm.add(rFore);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.048, 0.1, 8), skin); neck.position.y = 0.66; torsoG.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.122, 14, 12), skin); head.position.y = 0.8; head.scale.set(0.94, 1.06, 0.96); torsoG.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.126, 12, 10), hairM); hair.position.set(0, 0.84, -0.012); hair.scale.set(1.03, 0.68, 1.06); torsoG.add(hair);
  g.userData.legs = [lLeg, rLeg];
  g.userData.shins = [lShin, rShin];
  g.userData.arms = [lArm, rArm];
  g.userData.fores = [lFore, rFore];
  g.userData.torso = torsoG;
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
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
  if (Math.hypot(x - 4, z - 18) < 24) return 'The Clearing';
  if (riverDist(x, z) < 14) return 'Reedford Crossing';
  if (heightAt(x, z) > 13) return 'High Spine';
  if (fbm(x * 0.01 + 3, z * 0.01 + 9, 3) > 0.58 && heightAt(x, z) > 3) return 'The Quiet Pines';
  return 'Open ground';
}
