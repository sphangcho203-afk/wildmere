import * as THREE from 'three';
import { heightAt } from './world.js';

export const PEAR_X = -16;
export const PEAR_Z = 58;

export function atPearRest(x, z){
  return Math.hypot(x - PEAR_X, z - PEAR_Z) < 5.5;
}

export function makePearRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4d5c3a, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a4636, roughness: 0.9 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4a6a34, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x3a5228, roughness: 0.88 });
  const fruit = new THREE.MeshStandardMaterial({ color: 0x8a9a4a, roughness: 0.7 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6d5542, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6c6862, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7c786e, roughness: 0.94, flatShading: true });
  const y = heightAt(PEAR_X, PEAR_Z);
  const g = new THREE.Group();
  g.name = 'pear-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.85, 0.08, 10), moss);
  pad.position.set(PEAR_X, y + 0.02, PEAR_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.4;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, trunkH, 7), bark);
  trunk.position.set(PEAR_X - 0.06, y + trunkH * 0.5, PEAR_Z + 0.04);
  trunk.rotation.z = 0.04;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 4; i++){
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.55 - i * 0.03, 6, 5), i % 2 ? deep : leaf);
    crown.position.set(PEAR_X + 0.02 + (i % 2) * 0.03, y + 1.5 + i * 0.1, PEAR_Z - 0.01);
    crown.scale.set(1.18, 0.47, 1.05);
    crown.castShadow = true;
    g.add(crown);
  }

  const fruits = [];
  for (let i = 0; i < 5; i++){
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.045, 5, 4), fruit);
    f.position.set(PEAR_X - 0.1 + (i % 3) * 0.11, y + 1.36 + (i % 2) * 0.08, PEAR_Z - 0.04 + (i % 2) * 0.07);
    f.userData.phase = i * 0.65;
    f.userData.baseY = f.position.y;
    g.add(f);
    fruits.push(f);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.07, 0.3), wood);
  seat.position.set(PEAR_X + 0.46, y + 0.3, PEAR_Z - 0.02);
  seat.rotation.y = 0.07;
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legL.position.set(PEAR_X + 0.26, y + 0.15, PEAR_Z - 0.02);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legR.position.set(PEAR_X + 0.64, y + 0.15, PEAR_Z - 0.04);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.16), pale);
  sill.position.set(PEAR_X + 0.01, y + 0.16, PEAR_Z - 0.38);
  sill.rotation.y = -0.05;
  g.add(sill);

  for (let i = 0; i < 4; i++){
    const a = i * 1.57 + 0.22;
    const r = 1.14 + (i % 2) * 0.04;
    const h = 0.09 + (i % 3) * 0.03;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, 0.13), i % 2 ? pale : stone);
    s.position.set(PEAR_X + Math.cos(a) * r, y + h * 0.45, PEAR_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: PEAR_X, z: PEAR_Z, name: 'The Pear Rest', fruits, y };
}
