import * as THREE from 'three';

export const WORLD = 460;
export const WATER_Y = 1.35;
export const EYE = 1.67;
export const SEED = 2041;
export const SAVE_KEY = 'wildmere-v2';

function fade(t){ return t*t*t*(t*(t*6-15)+10); }
function lerp(a,b,t){ return a + (b-a)*t; }
function hash2(ix, iy){
  let n = (ix * 374761393 + iy * 668265263 + SEED * 13) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
export function vnoise(x, y){
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const u = fade(fx), v = fade(fy);
  return lerp(lerp(hash2(ix, iy), hash2(ix+1, iy), u), lerp(hash2(ix, iy+1), hash2(ix+1, iy+1), u), v);
}
export function fbm(x, y, oct = 5){
  let sum = 0, amp = 1, freq = 1, norm = 0;
  for (let i = 0; i < oct; i++){
    sum += amp * vnoise(x * freq, y * freq);
    norm += amp; amp *= 0.5; freq *= 2.03;
  }
  return sum / norm;
}
export function riverT(x, z){ return x - (14 * Math.sin(z * 0.016) + 7 * Math.sin(z * 0.049 + 1.7)); }
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

export function makeTree(scale = 1){
  const g = new THREE.Group();
  const trunkH = (3.4 + Math.random() * 2.4) * scale;
  const trunkR = (0.16 + Math.random() * 0.1) * scale;
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(trunkR * 0.7, trunkR, trunkH, 7),
    new THREE.MeshStandardMaterial({ color: 0x5a4030, roughness: 0.9 })
  );
  trunk.position.y = trunkH * 0.5; trunk.castShadow = true; g.add(trunk);
  const greens = [0x2f5a28, 0x3a6b30, 0x274820, 0x456b34];
  const blobs = 4 + (Math.random() * 3 | 0);
  for (let i = 0; i < blobs; i++){
    const r = (1.05 + Math.random() * 1.2) * scale;
    const fol = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), new THREE.MeshStandardMaterial({ color: greens[i % greens.length], roughness: 0.85 }));
    fol.position.set((Math.random() - 0.5) * 1.5 * scale, trunkH * 0.72 + Math.random() * 1.3 * scale, (Math.random() - 0.5) * 1.5 * scale);
    fol.castShadow = true; g.add(fol);
  }
  return g;
}

export function addBerryBush(scene, x, y, z, grown = true){
  const bush = new THREE.Group();
  const s = grown ? 1 : 0.35;
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.55, 7, 5), new THREE.MeshStandardMaterial({ color: 0x2a4a24, roughness: 0.9 }));
  leaf.position.y = 0.45; leaf.castShadow = true; bush.add(leaf);
  if (grown){
    const berryMat = new THREE.MeshStandardMaterial({ color: 0x8b2040, roughness: 0.5 });
    for (let b = 0; b < 5; b++){
      const berry = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 5), berryMat);
      berry.position.set((Math.random()-0.5)*0.7, 0.35 + Math.random()*0.5, (Math.random()-0.5)*0.7);
      bush.add(berry);
    }
  }
  bush.scale.setScalar(s);
  bush.position.set(x, y, z);
  scene.add(bush);
  return bush;
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

export function currentPlace(x, z){
  if (Math.hypot(x - 4, z - 18) < 24) return 'The Clearing';
  if (riverDist(x, z) < 14) return 'Reedford Crossing';
  if (heightAt(x, z) > 13) return 'High Spine';
  if (fbm(x*0.01+3, z*0.01+9, 3) > 0.58 && heightAt(x, z) > 3) return 'The Quiet Pines';
  return 'Open ground';
}
