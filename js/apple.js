import * as THREE from 'three';
import { heightAt } from './world.js';

export const APPLE_X = 24;
export const APPLE_Z = 46;

export function atAppleRest(x, z){
  return Math.hypot(x - APPLE_X, z - APPLE_Z) < 5.5;
}

export function makeAppleRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4d5c3a, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a4636, roughness: 0.9 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4a6a34, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x3a5228, roughness: 0.88 });
  const fruit = new THREE.MeshStandardMaterial({ color: 0xc44a3a, roughness: 0.7 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6d5542, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6c6862, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7c786e, roughness: 0.94, flatShading: true });
  const y = heightAt(APPLE_X, APPLE_Z);
  const g = new THREE.Group();
  g.name = 'apple-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.85, 0.08, 10), moss);
  pad.position.set(APPLE_X, y + 0.02, APPLE_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.3;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.21, trunkH, 7), bark);
  trunk.position.set(APPLE_X - 0.04, y + trunkH * 0.5, APPLE_Z + 0.02);
  trunk.rotation.z = -0.03;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 4; i++){
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.58 - i * 0.03, 6, 5), i % 2 ? deep : leaf);
    crown.position.set(APPLE_X + 0.01 + (i % 2) * 0.02, y + 1.48 + i * 0.09, APPLE_Z - 0.01);
    crown.scale.set(1.2, 0.48, 1.08);
    crown.castShadow = true;
    g.add(crown);
  }

  const fruits = [];
  for (let i = 0; i < 5; i++){
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.05, 5, 4), fruit);
    f.position.set(APPLE_X - 0.12 + (i % 3) * 0.12, y + 1.34 + (i % 2) * 0.07, APPLE_Z - 0.03 + (i % 2) * 0.08);
    f.userData.phase = i * 0.7;
    f.userData.baseY = f.position.y;
    g.add(f);
    fruits.push(f);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.07, 0.32), wood);
  seat.position.set(APPLE_X + 0.48, y + 0.31, APPLE_Z - 0.01);
  seat.rotation.y = -0.06;
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.27, 0.06), wood);
  legL.position.set(APPLE_X + 0.28, y + 0.16, APPLE_Z - 0.01);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.27, 0.06), wood);
  legR.position.set(APPLE_X + 0.66, y + 0.16, APPLE_Z - 0.03);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.17), pale);
  sill.position.set(APPLE_X + 0.02, y + 0.17, APPLE_Z - 0.4);
  sill.rotation.y = 0.04;
  g.add(sill);

  for (let i = 0; i < 4; i++){
    const a = i * 1.57 + 0.3;
    const r = 1.16 + (i % 2) * 0.05;
    const h = 0.1 + (i % 3) * 0.02;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.17, h, 0.14), i % 2 ? pale : stone);
    s.position.set(APPLE_X + Math.cos(a) * r, y + h * 0.45, APPLE_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: APPLE_X, z: APPLE_Z, name: 'The Apple Rest', fruits, y };
}
