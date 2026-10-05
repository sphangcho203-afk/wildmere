import * as THREE from 'three';
import { heightAt } from './world.js';

export const ELDER_X = -6;
export const ELDER_Z = 6;

export function atElderBowl(x, z){
  return Math.hypot(x - ELDER_X, z - ELDER_Z) < 5.6;
}

export function makeElderBowl(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x4e4034, roughness: 0.94 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3a5c30, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x274626, roughness: 0.88 });
  const bloom = new THREE.MeshStandardMaterial({ color: 0xf4f0dc, roughness: 0.58 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const water = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.22, transparent: true, opacity: 0.78 });
  const y = heightAt(ELDER_X, ELDER_Z);
  const g = new THREE.Group();
  g.name = 'elder-bowl';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 1.9, 0.08, 10), moss);
  pad.position.set(ELDER_X, y + 0.02, ELDER_Z);
  pad.receiveShadow = true;
  g.add(pad);

  for (let i = 0; i < 3; i++){
    const trunkH = 2.15 + i * 0.18;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, trunkH, 6), bark);
    trunk.position.set(ELDER_X - 0.18 + i * 0.16, y + trunkH * 0.5, ELDER_Z + 0.06 + (i - 1) * 0.08);
    trunk.rotation.z = -0.12 + i * 0.12;
    trunk.rotation.x = (i - 1) * 0.08;
    trunk.castShadow = true;
    g.add(trunk);
  }

  for (let i = 0; i < 5; i++){
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.52 - i * 0.04, 7, 6), i % 2 ? deep : leaf);
    crown.position.set(ELDER_X - 0.04 + (i % 2) * 0.08, y + 1.55 + i * 0.16, ELDER_Z + 0.02);
    crown.scale.set(1.28, 0.62, 1.1);
    crown.castShadow = true;
    g.add(crown);
  }

  const blooms = [];
  for (let i = 0; i < 8; i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 5), bloom);
    n.scale.set(1.35, 0.55, 1.2);
    n.position.set(ELDER_X - 0.32 + (i % 4) * 0.14, y + 1.28 + (i % 3) * 0.1, ELDER_Z - 0.1 + (i % 2) * 0.1);
    n.userData.phase = i * 0.7;
    n.userData.baseY = n.position.y;
    g.add(n);
    blooms.push(n);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.28), wood);
  seat.position.set(ELDER_X + 0.48, y + 0.24, ELDER_Z - 0.12);
  seat.rotation.y = 0.18;
  seat.castShadow = true;
  g.add(seat);
  const legA = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.07), wood);
  legA.position.set(ELDER_X + 0.24, y + 0.11, ELDER_Z - 0.12);
  g.add(legA);
  const legB = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.07), wood);
  legB.position.set(ELDER_X + 0.72, y + 0.11, ELDER_Z - 0.12);
  g.add(legB);

  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.1, 8), pale);
  bowl.position.set(ELDER_X - 0.12, y + 0.22, ELDER_Z - 0.42);
  g.add(bowl);
  const sip = new THREE.Mesh(new THREE.CircleGeometry(0.13, 8), water);
  sip.rotation.x = -Math.PI / 2;
  sip.position.set(ELDER_X - 0.12, y + 0.26, ELDER_Z - 0.42);
  g.add(sip);

  for (let i = 0; i < 5; i++){
    const a = i * 1.22 + 0.35;
    const r = 1.16 + (i % 2) * 0.1;
    const h = 0.12 + (i % 3) * 0.05;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.2, h, 0.15), i % 2 ? pale : stone);
    s.position.set(ELDER_X + Math.cos(a) * r, y + h * 0.45, ELDER_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: ELDER_X, z: ELDER_Z, name: 'The Elder Bowl', blooms, y };
}
