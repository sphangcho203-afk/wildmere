import * as THREE from 'three';
import { heightAt } from './world.js';

export const HONEY_X = -24;
export const HONEY_Z = 32;

export function atHoneyStone(x, z){
  return Math.hypot(x - HONEY_X, z - HONEY_Z) < 5.6;
}

export function makeHoneyStone(scene){
  const stone = new THREE.MeshStandardMaterial({ color: 0x7a6e58, roughness: 0.92, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x8a8270, roughness: 0.9, flatShading: true });
  const dark = new THREE.MeshStandardMaterial({ color: 0x5a5044, roughness: 0.95, flatShading: true });
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xc49a3a, roughness: 0.35, metalness: 0.08 });
  const amber = new THREE.MeshStandardMaterial({ color: 0xb07a28, roughness: 0.4, transparent: true, opacity: 0.82 });
  const y = heightAt(HONEY_X, HONEY_Z);
  const g = new THREE.Group();
  g.name = 'honey-stone';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 1.88, 0.08, 10), moss);
  pad.position.set(HONEY_X, y + 0.02, HONEY_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const slab = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.22, 1.05), stone);
  slab.position.set(HONEY_X, y + 0.16, HONEY_Z);
  slab.rotation.y = 0.28;
  slab.castShadow = true;
  slab.receiveShadow = true;
  g.add(slab);

  const lip = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 0.42), pale);
  lip.position.set(HONEY_X + 0.12, y + 0.3, HONEY_Z - 0.08);
  lip.rotation.y = 0.28;
  g.add(lip);

  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.1, 10, 1, true), wood);
  bowl.position.set(HONEY_X + 0.1, y + 0.36, HONEY_Z - 0.06);
  g.add(bowl);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(0.11, 10), amber);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(HONEY_X + 0.1, y + 0.38, HONEY_Z - 0.06);
  g.add(pool);

  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 1.15, 6), wood);
  post.position.set(HONEY_X - 0.55, y + 0.7, HONEY_Z + 0.35);
  post.rotation.z = 0.08;
  post.castShadow = true;
  g.add(post);

  const drops = [];
  for (let i = 0; i < 4; i++){
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.035 + i * 0.006, 6, 5), gold);
    drop.position.set(HONEY_X - 0.48 + i * 0.02, y + 1.05 - i * 0.12, HONEY_Z + 0.32);
    g.add(drop);
    drops.push(drop);
  }

  const flecks = [];
  for (let i = 0; i < 6; i++){
    const fleck = new THREE.Mesh(new THREE.SphereGeometry(0.018, 5, 4), gold);
    fleck.userData.phase = i * 1.05;
    fleck.userData.radius = 0.55 + (i % 3) * 0.12;
    fleck.userData.lift = 0.55 + (i % 2) * 0.18;
    fleck.position.set(HONEY_X, y + 0.7, HONEY_Z);
    g.add(fleck);
    flecks.push(fleck);
  }

  for (let i = 0; i < 6; i++){
    const a = i * 1.05 + 0.15;
    const r = 1.15 + (i % 2) * 0.16;
    const h = 0.16 + (i % 3) * 0.07;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.26, h, 0.18), i % 2 ? pale : dark);
    s.position.set(HONEY_X + Math.cos(a) * r, y + h * 0.45, HONEY_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: HONEY_X, z: HONEY_Z, name: 'The Honey Stone', drops, flecks, y };
}
