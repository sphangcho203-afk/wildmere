import * as THREE from 'three';
import { heightAt } from './world.js';

export const ELM_X = -12;
export const ELM_Z = 22;

export function atElmDish(x, z){
  return Math.hypot(x - ELM_X, z - ELM_Z) < 5.6;
}

export function makeElmDish(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x4a3c30, roughness: 0.94 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3d6a38, roughness: 0.88 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x2a4a28, roughness: 0.9 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const water = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.22, transparent: true, opacity: 0.7 });
  const y = heightAt(ELM_X, ELM_Z);
  const g = new THREE.Group();
  g.name = 'elm-dish';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(ELM_X, y + 0.02, ELM_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.35;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.16, trunkH, 7), bark);
  trunk.position.set(ELM_X + 0.34, y + trunkH * 0.5, ELM_Z - 0.1);
  trunk.rotation.z = 0.07;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.62 - t * 0.08, 7, 6), i % 2 ? deep : leaf);
    crown.position.set(ELM_X + 0.38 + (i % 2) * 0.08, y + 2.05 + i * 0.22, ELM_Z - 0.12 + (i % 3) * 0.04);
    crown.scale.set(1.15, 0.72, 1.05);
    crown.castShadow = true;
    g.add(crown);
  }

  const leaves = [];
  for (let i = 0; i < 8; i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.03, 5, 4), i % 2 ? leaf : deep);
    n.scale.set(1.4, 0.45, 0.8);
    n.position.set(ELM_X + 0.06 + (i % 3) * 0.07, y + 1.4 + (i % 4) * 0.09, ELM_Z + 0.1 + (i % 2) * 0.05);
    n.userData.phase = i * 0.62;
    n.userData.baseY = n.position.y;
    g.add(n);
    leaves.push(n);
  }

  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.06, 10, 1, true), stone);
  dish.position.set(ELM_X - 0.5, y + 0.28, ELM_Z + 0.14);
  g.add(dish);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(0.13, 10), water);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(ELM_X - 0.5, y + 0.3, ELM_Z + 0.14);
  g.add(pool);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.22), wood);
  seat.position.set(ELM_X - 0.52, y + 0.26, ELM_Z - 0.24);
  seat.rotation.y = 0.16;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  leg.position.set(ELM_X - 0.52, y + 0.12, ELM_Z - 0.24);
  g.add(leg);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.18;
    const r = 1.16 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(ELM_X + Math.cos(a) * r, y + h * 0.45, ELM_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: ELM_X, z: ELM_Z, name: 'The Elm Dish', leaves, y };
}
