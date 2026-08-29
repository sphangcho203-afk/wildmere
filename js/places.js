import * as THREE from 'three';
import { WATER_Y, heightAt, fbm, riverDist, atStoneTerrace, TERRACE_X, TERRACE_Z } from './world.js';

function hash2(ix, iy){
  const SEED = 2041;
  let n = (ix * 374761393 + iy * 668265263 + SEED * 13) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

export const WELL_X = 46;
export const WELL_Z = 8;
export function atQuietWell(x, z){
  return Math.hypot(x - WELL_X, z - WELL_Z) < 4.2;
}
export function makeQuietWell(scene){
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const water = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.2, transparent: true, opacity: 0.7 });
  const y = heightAt(WELL_X, WELL_Z);
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 0.55, 12, 1, true), stone);
  ring.position.set(WELL_X, y + 0.28, WELL_Z);
  scene.add(ring);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.08, 6, 12), stone);
  lip.rotation.x = Math.PI / 2;
  lip.position.set(WELL_X, y + 0.56, WELL_Z);
  scene.add(lip);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(0.78, 12), water);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(WELL_X, y + 0.18, WELL_Z);
  scene.add(pool);
  const postL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.15, 0.08), wood);
  postL.position.set(WELL_X - 0.7, y + 1.05, WELL_Z);
  const postR = postL.clone();
  postR.position.x = WELL_X + 0.7;
  scene.add(postL); scene.add(postR);
  const beam = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.07, 0.07), wood);
  beam.position.set(WELL_X, y + 1.6, WELL_Z);
  scene.add(beam);
  return { x: WELL_X, z: WELL_Z, name: 'The Quiet Well' };
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
  if (atStoneTerrace(x, z)) return 'The Stone Terrace';
  if (atQuietWell(x, z)) return 'The Quiet Well';
  if (Math.hypot(x + 18, z - 8) < 8) return 'The Old Ring';
  if (Math.hypot(x - 32, z + 14) < 6) return 'The Moss Seat';
  if (Math.hypot(x - 4, z - 18) < 24) return 'The Clearing';
  if (riverDist(x, z) < 14) return 'Reedford Crossing';
  if (heightAt(x, z) > 13) return 'High Spine';
  if (fbm(x * 0.01 + 3, z * 0.01 + 9, 3) > 0.58 && heightAt(x, z) > 3) return 'The Quiet Pines';
  return 'Open ground';
}

export function placeStoneTerrace(scene){
  const stone = new THREE.MeshStandardMaterial({ color: 0x6e6a62, roughness: 0.96, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const grassM = new THREE.MeshStandardMaterial({ color: 0x6a7548, roughness: 0.95 });
  const y = heightAt(TERRACE_X, TERRACE_Z);
  const group = new THREE.Group();
  group.name = 'stone-terrace';
  const shelf = new THREE.Mesh(new THREE.CylinderGeometry(14.5, 16.2, 0.38, 10), stone);
  shelf.position.set(TERRACE_X, y - 0.05, TERRACE_Z);
  shelf.receiveShadow = true;
  group.add(shelf);
  const upper = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 8.4, 0.28, 8), pale);
  upper.position.set(TERRACE_X + 1.4, y + 0.22, TERRACE_Z - 1.1);
  upper.receiveShadow = true;
  group.add(upper);
  for (let i = 0; i < 9; i++){
    const a = i * 0.7;
    const r = 11 + (i % 3) * 1.4;
    const sx = TERRACE_X + Math.cos(a) * r;
    const sz = TERRACE_Z + Math.sin(a) * r;
    const h = 0.28 + (i % 4) * 0.16;
    const block = new THREE.Mesh(new THREE.BoxGeometry(1.1 + (i % 3) * 0.35, h, 0.7), stone);
    block.position.set(sx, heightAt(sx, sz) + h * 0.45, sz);
    block.rotation.y = a * 0.4;
    block.castShadow = true;
    group.add(block);
  }
  for (let i = 0; i < 4; i++){
    const s = 0.42 - i * 0.06;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), pale);
    rock.position.set(TERRACE_X - 0.4, y + 0.22 + i * 0.28, TERRACE_Z + 0.6);
    rock.rotation.set(i * 0.3, i * 0.7, 0.1);
    rock.castShadow = true;
    group.add(rock);
  }
  const blade = new THREE.ConeGeometry(0.03, 0.18, 4);
  for (let i = 0; i < 34; i++){
    const a = hash2(i + 4, 21) * 6.28;
    const r = 3 + hash2(i + 4, 27) * 12;
    const gx = TERRACE_X + Math.cos(a) * r;
    const gz = TERRACE_Z + Math.sin(a) * r;
    const gy = heightAt(gx, gz);
    const g = new THREE.Mesh(blade, grassM);
    g.position.set(gx, gy + 0.09, gz);
    g.rotation.z = (hash2(i, 33) - 0.5) * 0.4;
    g.rotation.y = hash2(i, 39) * 6.28;
    group.add(g);
  }
  scene.add(group);
  return { x: TERRACE_X, z: TERRACE_Z, name: 'The Stone Terrace' };
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
  placeStoneTerrace(scene);
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
