import * as THREE from 'three';
import { heightAt } from './world.js';

export const BEECH_X = 40;
export const BEECH_Z = 28;

export function atBeechLedge(x, z){
  return Math.hypot(x - BEECH_X, z - BEECH_Z) < 5.6;
}

export function makeBeechLedge(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x6a5a48, roughness: 0.94 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3a6a34, roughness: 0.88 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x2a4a26, roughness: 0.9 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const hull = new THREE.MeshStandardMaterial({ color: 0x8a6a42, roughness: 0.82 });
  const y = heightAt(BEECH_X, BEECH_Z);
  const g = new THREE.Group();
  g.name = 'beech-ledge';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(BEECH_X, y + 0.02, BEECH_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.4;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.17, trunkH, 7), bark);
  trunk.position.set(BEECH_X + 0.32, y + trunkH * 0.5, BEECH_Z - 0.12);
  trunk.rotation.z = -0.06;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.66 - t * 0.08, 7, 6), i % 2 ? deep : leaf);
    crown.position.set(BEECH_X + 0.28 + (i % 2) * 0.06, y + 2.08 + i * 0.22, BEECH_Z - 0.14 + (i % 3) * 0.04);
    crown.scale.set(1.18, 0.7, 1.08);
    crown.castShadow = true;
    g.add(crown);
  }

  const nuts = [];
  for (let i = 0; i < 7; i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.026, 5, 4), hull);
    n.scale.set(1.1, 0.85, 1);
    n.position.set(BEECH_X + 0.04 + (i % 3) * 0.07, y + 1.42 + (i % 4) * 0.1, BEECH_Z + 0.08 + (i % 2) * 0.05);
    n.userData.phase = i * 0.68;
    n.userData.baseY = n.position.y;
    g.add(n);
    nuts.push(n);
  }

  const ledge = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.24), pale);
  ledge.position.set(BEECH_X - 0.5, y + 0.3, BEECH_Z + 0.14);
  ledge.rotation.y = 0.14;
  ledge.castShadow = true;
  g.add(ledge);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.22), wood);
  seat.position.set(BEECH_X - 0.54, y + 0.26, BEECH_Z - 0.24);
  seat.rotation.y = 0.18;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  leg.position.set(BEECH_X - 0.54, y + 0.12, BEECH_Z - 0.24);
  g.add(leg);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.22;
    const r = 1.16 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(BEECH_X + Math.cos(a) * r, y + h * 0.45, BEECH_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: BEECH_X, z: BEECH_Z, name: 'The Beech Ledge', nuts, y };
}
