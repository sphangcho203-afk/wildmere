import * as THREE from 'three';
import { heightAt } from './world.js';

export const CRAB_X = -14;
export const CRAB_Z = -12;

export function atCrabappleRest(x, z){
  return Math.hypot(x - CRAB_X, z - CRAB_Z) < 5.5;
}

export function makeCrabappleRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4c5c3a, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a4a38, roughness: 0.9 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4a6a34, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x3a5228, roughness: 0.88 });
  const fruit = new THREE.MeshStandardMaterial({ color: 0xc45a3a, roughness: 0.7 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6d5542, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6c6862, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7c786e, roughness: 0.94, flatShading: true });
  const y = heightAt(CRAB_X, CRAB_Z);
  const g = new THREE.Group();
  g.name = 'crabapple-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.85, 0.08, 10), moss);
  pad.position.set(CRAB_X, y + 0.02, CRAB_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.4;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, trunkH, 7), bark);
  trunk.position.set(CRAB_X - 0.12, y + trunkH * 0.5, CRAB_Z + 0.04);
  trunk.rotation.z = 0.08;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 4; i++){
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.62 - i * 0.04, 6, 5), i % 2 ? deep : leaf);
    crown.position.set(CRAB_X + 0.04 + (i % 2) * 0.05, y + 1.55 + i * 0.12, CRAB_Z - 0.01);
    crown.scale.set(1.28, 0.52, 1.12);
    crown.castShadow = true;
    g.add(crown);
  }

  const fruits = [];
  for (let i = 0; i < 5; i++){
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.038, 5, 4), fruit);
    f.position.set(CRAB_X - 0.16 + (i % 3) * 0.14, y + 1.38 + (i % 2) * 0.1, CRAB_Z - 0.08 + (i % 2) * 0.1);
    f.userData.phase = i * 0.65;
    f.userData.baseY = f.position.y;
    g.add(f);
    fruits.push(f);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.07, 0.3), wood);
  seat.position.set(CRAB_X + 0.52, y + 0.3, CRAB_Z - 0.05);
  seat.rotation.y = 0.12;
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legL.position.set(CRAB_X + 0.32, y + 0.15, CRAB_Z - 0.05);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legR.position.set(CRAB_X + 0.7, y + 0.15, CRAB_Z - 0.07);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.18), pale);
  sill.position.set(CRAB_X + 0.04, y + 0.16, CRAB_Z - 0.38);
  sill.rotation.y = -0.1;
  g.add(sill);

  for (let i = 0; i < 4; i++){
    const a = i * 1.57 + 0.4;
    const r = 1.15 + (i % 2) * 0.06;
    const h = 0.09 + (i % 3) * 0.04;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.18, h, 0.14), i % 2 ? pale : stone);
    s.position.set(CRAB_X + Math.cos(a) * r, y + h * 0.45, CRAB_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: CRAB_X, z: CRAB_Z, name: 'The Crabapple Rest', fruits, y };
}
