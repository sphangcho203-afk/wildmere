import * as THREE from 'three';
import { heightAt } from './world.js';

export const CHESTNUT_X = -8;
export const CHESTNUT_Z = 62;

export function atChestnutRest(x, z){
  return Math.hypot(x - CHESTNUT_X, z - CHESTNUT_Z) < 5.6;
}

export function makeChestnutRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a4634, roughness: 0.94 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3f6b34, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x2c5428, roughness: 0.88 });
  const burr = new THREE.MeshStandardMaterial({ color: 0x8a7a42, roughness: 0.72 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(CHESTNUT_X, CHESTNUT_Z);
  const g = new THREE.Group();
  g.name = 'chestnut-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 1.9, 0.08, 10), moss);
  pad.position.set(CHESTNUT_X, y + 0.02, CHESTNUT_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.05;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, trunkH, 7), bark);
  trunk.position.set(CHESTNUT_X + 0.18, y + trunkH * 0.5, CHESTNUT_Z + 0.06);
  trunk.rotation.z = 0.08;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.68 - t * 0.07, 7, 6), i % 2 ? deep : leaf);
    crown.position.set(CHESTNUT_X + 0.12 + (i % 2) * 0.04, y + 1.78 + i * 0.22, CHESTNUT_Z + 0.02 + (i % 3) * 0.03);
    crown.scale.set(1.18, 0.7, 1.08);
    crown.castShadow = true;
    g.add(crown);
  }

  const burrs = [];
  for (let i = 0; i < 7; i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.038, 6, 5), burr);
    n.scale.set(1.05, 0.82, 0.9);
    n.position.set(CHESTNUT_X - 0.04 + (i % 3) * 0.07, y + 1.28 + (i % 4) * 0.08, CHESTNUT_Z - 0.16 + (i % 2) * 0.05);
    n.userData.phase = i * 0.7;
    n.userData.baseY = n.position.y;
    g.add(n);
    burrs.push(n);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.28), wood);
  seat.position.set(CHESTNUT_X - 0.62, y + 0.26, CHESTNUT_Z + 0.12);
  seat.rotation.y = -0.18;
  seat.castShadow = true;
  g.add(seat);
  const legA = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  legA.position.set(CHESTNUT_X - 0.86, y + 0.12, CHESTNUT_Z + 0.12);
  g.add(legA);
  const legB = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  legB.position.set(CHESTNUT_X - 0.36, y + 0.12, CHESTNUT_Z + 0.12);
  g.add(legB);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.07, 0.26), pale);
  sill.position.set(CHESTNUT_X + 0.34, y + 0.26, CHESTNUT_Z - 0.22);
  sill.rotation.y = 0.16;
  g.add(sill);

  for (let i = 0; i < 5; i++){
    const a = i * 1.22 + 0.4;
    const r = 1.16 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(CHESTNUT_X + Math.cos(a) * r, y + h * 0.45, CHESTNUT_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: CHESTNUT_X, z: CHESTNUT_Z, name: 'The Chestnut Rest', burrs, y };
}
