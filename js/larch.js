import * as THREE from 'three';
import { heightAt } from './world.js';

export const LARCH_X = 28;
export const LARCH_Z = 42;

export function atLarchRest(x, z){
  return Math.hypot(x - LARCH_X, z - LARCH_Z) < 5.5;
}

export function makeLarchRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5c38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a4838, roughness: 0.9 });
  const needle = new THREE.MeshStandardMaterial({ color: 0x6a8a4a, roughness: 0.8 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x4a6a32, roughness: 0.86 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6a5240, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(LARCH_X, LARCH_Z);
  const g = new THREE.Group();
  g.name = 'larch-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.88, 0.08, 10), moss);
  pad.position.set(LARCH_X, y + 0.02, LARCH_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.5;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.18, trunkH, 7), bark);
  trunk.position.set(LARCH_X - 0.04, y + trunkH * 0.5, LARCH_Z + 0.02);
  trunk.rotation.z = -0.05;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 3; i++){
    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.7 - i * 0.1, 0.9, 6), i % 2 ? deep : needle);
    crown.position.set(LARCH_X + 0.01, y + 1.6 + i * 0.35, LARCH_Z - 0.01);
    crown.castShadow = true;
    g.add(crown);
  }

  const needles = [];
  for (let i = 0; i < 7; i++){
    const n = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.12, 4), needle);
    n.position.set(LARCH_X - 0.15 + (i % 4) * 0.08, y + 1.45 + (i % 3) * 0.05, LARCH_Z - 0.05 + (i % 2) * 0.08);
    n.rotation.z = 0.3 + (i % 3) * 0.2;
    n.userData.phase = i * 0.6;
    n.userData.baseY = n.position.y;
    g.add(n);
    needles.push(n);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.07, 0.28), wood);
  seat.position.set(LARCH_X + 0.5, y + 0.3, LARCH_Z + 0.01);
  seat.rotation.y = -0.02;
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legL.position.set(LARCH_X + 0.3, y + 0.15, LARCH_Z + 0.01);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legR.position.set(LARCH_X + 0.68, y + 0.15, LARCH_Z);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.06, 0.14), pale);
  sill.position.set(LARCH_X + 0.01, y + 0.16, LARCH_Z - 0.42);
  sill.rotation.y = 0.03;
  g.add(sill);

  for (let i = 0; i < 4; i++){
    const a = i * 1.57 + 0.2;
    const r = 1.16 + (i % 2) * 0.04;
    const h = 0.09 + (i % 3) * 0.02;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.14, h, 0.11), i % 2 ? pale : stone);
    s.position.set(LARCH_X + Math.cos(a) * r, y + h * 0.45, LARCH_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: LARCH_X, z: LARCH_Z, name: 'The Larch Rest', needles, y };
}
