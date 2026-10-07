import * as THREE from 'three';
import { heightAt } from './world.js';

export const MULBERRY_X = 54;
export const MULBERRY_Z = 22;

export function atMulberryRest(x, z){
  return Math.hypot(x - MULBERRY_X, z - MULBERRY_Z) < 5.5;
}

export function makeMulberryRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4c5c3a, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a4334, roughness: 0.94 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3a6230, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x274428, roughness: 0.88 });
  const berry = new THREE.MeshStandardMaterial({ color: 0x6a3058, roughness: 0.48 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(MULBERRY_X, MULBERRY_Z);
  const g = new THREE.Group();
  g.name = 'mulberry-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(MULBERRY_X, y + 0.02, MULBERRY_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.55;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, trunkH, 7), bark);
  trunk.position.set(MULBERRY_X - 0.18, y + trunkH * 0.5, MULBERRY_Z + 0.06);
  trunk.rotation.z = 0.22;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.58 - i * 0.04, 7, 6), i % 2 ? deep : leaf);
    crown.position.set(MULBERRY_X - 0.08 + (i % 2) * 0.06, y + 1.48 + i * 0.18, MULBERRY_Z + 0.02);
    crown.scale.set(1.32, 0.62, 1.08);
    crown.castShadow = true;
    g.add(crown);
  }

  const berries = [];
  for (let i = 0; i < 8; i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.032, 6, 5), berry);
    n.position.set(MULBERRY_X - 0.34 + (i % 4) * 0.12, y + 1.22 + (i % 3) * 0.1, MULBERRY_Z - 0.1 + (i % 2) * 0.1);
    n.userData.phase = i * 0.58;
    n.userData.baseY = n.position.y;
    g.add(n);
    berries.push(n);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.28), wood);
  seat.position.set(MULBERRY_X + 0.5, y + 0.24, MULBERRY_Z - 0.1);
  seat.rotation.y = -0.16;
  seat.castShadow = true;
  g.add(seat);
  const legA = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.07), wood);
  legA.position.set(MULBERRY_X + 0.26, y + 0.11, MULBERRY_Z - 0.1);
  g.add(legA);
  const legB = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.07), wood);
  legB.position.set(MULBERRY_X + 0.74, y + 0.11, MULBERRY_Z - 0.1);
  g.add(legB);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.22), pale);
  sill.position.set(MULBERRY_X - 0.06, y + 0.22, MULBERRY_Z - 0.38);
  sill.rotation.y = 0.12;
  g.add(sill);

  for (let i = 0; i < 5; i++){
    const a = i * 1.24 + 0.3;
    const r = 1.14 + (i % 2) * 0.1;
    const h = 0.11 + (i % 3) * 0.05;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.2, h, 0.15), i % 2 ? pale : stone);
    s.position.set(MULBERRY_X + Math.cos(a) * r, y + h * 0.45, MULBERRY_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: MULBERRY_X, z: MULBERRY_Z, name: 'The Mulberry Rest', berries, y };
}
