import * as THREE from 'three';
import { heightAt } from './world.js';

export const PLUM_X = 38;
export const PLUM_Z = 14;

export function atPlumRest(x, z){
  return Math.hypot(x - PLUM_X, z - PLUM_Z) < 5.5;
}

export function makePlumRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4d5c3a, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5b4638, roughness: 0.9 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4a6a36, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x3a522a, roughness: 0.88 });
  const fruit = new THREE.MeshStandardMaterial({ color: 0x6b3a52, roughness: 0.72 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6d5542, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6c6862, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7c786e, roughness: 0.94, flatShading: true });
  const y = heightAt(PLUM_X, PLUM_Z);
  const g = new THREE.Group();
  g.name = 'plum-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.82, 0.08, 10), moss);
  pad.position.set(PLUM_X, y + 0.02, PLUM_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.3;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.21, trunkH, 7), bark);
  trunk.position.set(PLUM_X - 0.08, y + trunkH * 0.5, PLUM_Z + 0.05);
  trunk.rotation.z = 0.05;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 4; i++){
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.56 - i * 0.03, 6, 5), i % 2 ? deep : leaf);
    crown.position.set(PLUM_X + 0.01 + (i % 2) * 0.04, y + 1.48 + i * 0.11, PLUM_Z - 0.02);
    crown.scale.set(1.2, 0.46, 1.06);
    crown.castShadow = true;
    g.add(crown);
  }

  const fruits = [];
  for (let i = 0; i < 5; i++){
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.04, 5, 4), fruit);
    f.position.set(PLUM_X - 0.12 + (i % 3) * 0.12, y + 1.34 + (i % 2) * 0.09, PLUM_Z - 0.05 + (i % 2) * 0.08);
    f.userData.phase = i * 0.68;
    f.userData.baseY = f.position.y;
    g.add(f);
    fruits.push(f);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.07, 0.3), wood);
  seat.position.set(PLUM_X + 0.48, y + 0.3, PLUM_Z - 0.03);
  seat.rotation.y = 0.08;
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legL.position.set(PLUM_X + 0.28, y + 0.15, PLUM_Z - 0.03);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legR.position.set(PLUM_X + 0.66, y + 0.15, PLUM_Z - 0.05);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.16), pale);
  sill.position.set(PLUM_X + 0.02, y + 0.16, PLUM_Z - 0.36);
  sill.rotation.y = -0.06;
  g.add(sill);

  for (let i = 0; i < 4; i++){
    const a = i * 1.57 + 0.25;
    const r = 1.12 + (i % 2) * 0.05;
    const h = 0.09 + (i % 3) * 0.03;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, 0.13), i % 2 ? pale : stone);
    s.position.set(PLUM_X + Math.cos(a) * r, y + h * 0.45, PLUM_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: PLUM_X, z: PLUM_Z, name: 'The Plum Rest', fruits, y };
}
