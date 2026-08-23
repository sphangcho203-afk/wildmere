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
  trunk.position.y = trunkH * 0.5;
  trunk.castShadow = true;
  g.add(trunk);
  const canopy = new THREE.Group();
  const branches = 3 + (Math.random() * 3 | 0);
  for (let i = 0; i < branches; i++){
    const len = (0.7 + Math.random() * 0.9) * scale;
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.035 * scale, 0.055 * scale, len, 5), barkLeaf);
    const a = (i / branches) * Math.PI * 2 + Math.random() * 0.4;
    br.position.set(Math.sin(a) * 0.18 * scale, trunkH * (0.58 + Math.random() * 0.22), Math.cos(a) * 0.18 * scale);
    br.rotation.z = Math.cos(a) * 0.85;
    br.rotation.x = Math.sin(a) * 0.85;
    br.castShadow = true;
    g.add(br);
  }
  const blobs = 5 + (Math.random() * 3 | 0);
  for (let i = 0; i < blobs; i++){
    const r = (0.85 + Math.random() * 1.05) * scale;
    const fol = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), leafMats[i % leafMats.length]);
    fol.position.set((Math.random() - 0.5) * 1.7 * scale, trunkH * 0.78 + Math.random() * 1.15 * scale, (Math.random() - 0.5) * 1.7 * scale);
    fol.castShadow = true;
    canopy.add(fol);
  }
  g.add(canopy);
  g.userData.canopy = canopy;
  g.userData.kind = 'leaf';
  return g;
}

export function makePine(scale = 1){
  const g = new THREE.Group();
  const trunkH = (5.2 + Math.random() * 2.6) * scale;
  const trunkR = (0.13 + Math.random() * 0.07) * scale;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(trunkR * 0.45, trunkR, trunkH, 7), barkPine);
  trunk.position.y = trunkH * 0.5;
  trunk.castShadow = true;
  g.add(trunk);
  const canopy = new THREE.Group();
  const layers = 4 + (Math.random() * 2 | 0);
  for (let i = 0; i < layers; i++){
    const t = i / (layers - 1);
    const r = (1.55 - t * 1.15) * scale;
    const h = (1.35 - t * 0.25) * scale;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), pineMat);
    cone.position.y = trunkH * 0.38 + i * 0.85 * scale;
    cone.castShadow = true;
    canopy.add(cone);
  }
  g.add(canopy);
  g.userData.canopy = canopy;
  g.userData.kind = 'pine';
  return g;
}

export function makeTree(scale = 1, kind = 'leaf'){
  return kind === 'pine' ? makePine(scale) : makeBroadleaf(scale);
}

export function treeKindAt(x, z){
  const y = heightAt(x, z);
  const pineBelt = fbm(x * 0.01 + 3, z * 0.01 + 9, 3);
  if (y > 11.5 || pineBelt > 0.56) return 'pine';
  return 'leaf';
}

export function addBerryBush(scene, x, y, z, grown = true){
  const bush = new THREE.Group();
  const s = grown ? 1 : 0.35;
  const leaf = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 7, 5),
    new THREE.MeshStandardMaterial({ color: 0x2a4a24, roughness: 0.9 })
  );
  leaf.position.y = 0.45;
  leaf.castShadow = true;
  bush.add(leaf);
  if (grown){
    const berryMat = new THREE.MeshStandardMaterial({ color: 0x8b2040, roughness: 0.5 });
    for (let b = 0; b < 5; b++){
      const berry = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 5), berryMat);
      berry.position.set((Math.random() - 0.5) * 0.7, 0.35 + Math.random() * 0.5, (Math.random() - 0.5) * 0.7);
      bush.add(berry);
    }
  }
  bush.scale.setScalar(s);
  bush.position.set(x, y, z);
  scene.add(bush);
  return bush;
}

export function makeGrassTuft(){
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x4a6a32, roughness: 1, side: THREE.DoubleSide });
  for (let i = 0; i < 4; i++){
    const blade = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.38 + Math.random() * 0.22), mat);
    blade.position.y = 0.18;
    blade.rotation.y = i * 0.8 + Math.random() * 0.3;
    blade.rotation.x = (Math.random() - 0.5) * 0.25;
    g.add(blade);
  }
  return g;
}

export function makeDeer(){
  const g = new THREE.Group();
  const hide = new THREE.MeshStandardMaterial({ color: 0x6b4a32, roughness: 0.85 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.9), hide);
  body.position.y = 0.72; g.add(body);
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.32, 0.16), hide);
  neck.position.set(0, 1.02, 0.38); g.add(neck);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.28), hide);
  head.position.set(0, 1.18, 0.52); g.add(head);
  for (const sx of [-0.14, 0.14]){
    for (const sz of [-0.28, 0.28]){
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.08), hide);
      leg.position.set(sx, 0.28, sz); g.add(leg);
    }
  }
  return g;
}

export function makeBird(){
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x2a2a28, roughness: 0.7 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.22), mat);
  g.add(body);
  const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.015, 0.1), mat);
  wingL.position.set(-0.16, 0, 0);
  const wingR = wingL.clone();
  wingR.position.x = 0.16;
  g.add(wingL); g.add(wingR);
  g.userData.wings = [wingL, wingR];
  return g;
}

export function currentPlace(x, z){
  if (Math.hypot(x - 4, z - 18) < 24) return 'The Clearing';
  if (riverDist(x, z) < 14) return 'Reedford Crossing';
  if (heightAt(x, z) > 13) return 'High Spine';
  if (fbm(x * 0.01 + 3, z * 0.01 + 9, 3) > 0.58 && heightAt(x, z) > 3) return 'The Quiet Pines';
  return 'Open ground';
}
