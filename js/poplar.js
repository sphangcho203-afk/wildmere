import * as THREE from 'three';
import { heightAt } from './world.js';

export const POPLAR_X = 34;
export const POPLAR_Z = 18;

export function atPoplarRest(x, z){
  return Math.hypot(x - POPLAR_X, z - POPLAR_Z) < 5.6;
}

export function makePoplarRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x8a8478, roughness: 0.92 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x5a8a3c, roughness: 0.84 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x3a6a2c, roughness: 0.88 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const water = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.22, transparent: true, opacity: 0.7 });
  const y = heightAt(POPLAR_X, POPLAR_Z);
  const g = new THREE.Group();
  g.name = 'poplar-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(POPLAR_X, y + 0.02, POPLAR_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.7;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, trunkH, 7), bark);
  trunk.position.set(POPLAR_X + 0.28, y + trunkH * 0.5, POPLAR_Z - 0.08);
  trunk.rotation.z = 0.04;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.52 - t * 0.06, 7, 6), i % 2 ? deep : leaf);
    crown.position.set(POPLAR_X + 0.26 + (i % 2) * 0.04, y + 2.2 + i * 0.24, POPLAR_Z - 0.1 + (i % 3) * 0.03);
    crown.scale.set(0.85, 1.15, 0.8);
    crown.castShadow = true;
    g.add(crown);
  }

  const leaves = [];
  for (let i = 0; i < 8; i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.03, 5, 4), i % 2 ? leaf : deep);
    n.scale.set(0.7, 1.2, 0.5);
    n.position.set(POPLAR_X + 0.02 + (i % 3) * 0.07, y + 1.5 + (i % 4) * 0.1, POPLAR_Z + 0.12 + (i % 2) * 0.05);
    n.userData.phase = i * 0.62;
    n.userData.baseY = n.position.y;
    g.add(n);
    leaves.push(n);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.24), wood);
  seat.position.set(POPLAR_X - 0.52, y + 0.26, POPLAR_Z - 0.22);
  seat.rotation.y = 0.16;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  leg.position.set(POPLAR_X - 0.52, y + 0.12, POPLAR_Z - 0.22);
  g.add(leg);

  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.06, 10, 1, true), pale);
  dish.position.set(POPLAR_X - 0.48, y + 0.3, POPLAR_Z + 0.16);
  g.add(dish);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(0.11, 10), water);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(POPLAR_X - 0.48, y + 0.32, POPLAR_Z + 0.16);
  g.add(pool);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.2;
    const r = 1.16 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(POPLAR_X + Math.cos(a) * r, y + h * 0.45, POPLAR_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: POPLAR_X, z: POPLAR_Z, name: 'The Poplar Rest', leaves, y };
}
