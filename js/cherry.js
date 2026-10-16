import * as THREE from 'three';
import { heightAt } from './world.js';

export const CHERRY_X = 38;
export const CHERRY_Z = 38;

export function atCherryRest(x, z){
  return Math.hypot(x - CHERRY_X, z - CHERRY_Z) < 5.5;
}

export function makeCherryRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4d5c3a, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a4636, roughness: 0.9 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4a6a34, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x3a5228, roughness: 0.88 });
  const fruit = new THREE.MeshStandardMaterial({ color: 0xd45a6a, roughness: 0.7 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6d5542, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6c6862, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7c786e, roughness: 0.94, flatShading: true });
  const y = heightAt(CHERRY_X, CHERRY_Z);
  const g = new THREE.Group();
  g.name = 'cherry-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.85, 0.08, 10), moss);
  pad.position.set(CHERRY_X, y + 0.02, CHERRY_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.2;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.19, trunkH, 7), bark);
  trunk.position.set(CHERRY_X - 0.05, y + trunkH * 0.5, CHERRY_Z + 0.03);
  trunk.rotation.z = -0.04;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 4; i++){
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.56 - i * 0.03, 6, 5), i % 2 ? deep : leaf);
    crown.position.set(CHERRY_X + 0.02 + (i % 2) * 0.02, y + 1.42 + i * 0.09, CHERRY_Z - 0.01);
    crown.scale.set(1.22, 0.46, 1.06);
    crown.castShadow = true;
    g.add(crown);
  }

  const fruits = [];
  for (let i = 0; i < 6; i++){
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.042, 5, 4), fruit);
    f.position.set(CHERRY_X - 0.14 + (i % 3) * 0.11, y + 1.32 + (i % 2) * 0.08, CHERRY_Z - 0.04 + (i % 2) * 0.09);
    f.userData.phase = i * 0.68;
    f.userData.baseY = f.position.y;
    g.add(f);
    fruits.push(f);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.07, 0.31), wood);
  seat.position.set(CHERRY_X + 0.46, y + 0.3, CHERRY_Z - 0.01);
  seat.rotation.y = -0.05;
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legL.position.set(CHERRY_X + 0.26, y + 0.15, CHERRY_Z - 0.01);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legR.position.set(CHERRY_X + 0.64, y + 0.15, CHERRY_Z - 0.03);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.16), pale);
  sill.position.set(CHERRY_X + 0.01, y + 0.16, CHERRY_Z - 0.38);
  sill.rotation.y = 0.05;
  g.add(sill);

  for (let i = 0; i < 4; i++){
    const a = i * 1.57 + 0.28;
    const r = 1.15 + (i % 2) * 0.04;
    const h = 0.1 + (i % 3) * 0.02;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, 0.13), i % 2 ? pale : stone);
    s.position.set(CHERRY_X + Math.cos(a) * r, y + h * 0.45, CHERRY_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: CHERRY_X, z: CHERRY_Z, name: 'The Cherry Rest', fruits, y };
}
