import * as THREE from 'three';
import { heightAt } from './world.js';

export const LINDEN_X = 16;
export const LINDEN_Z = 44;

export function atLindenSeat(x, z){
  return Math.hypot(x - LINDEN_X, z - LINDEN_Z) < 5.6;
}

export function makeLindenSeat(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x6a5844, roughness: 0.94 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4a7a38, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x2e5a28, roughness: 0.9 });
  const bloom = new THREE.MeshStandardMaterial({ color: 0xd4c46a, roughness: 0.72 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(LINDEN_X, LINDEN_Z);
  const g = new THREE.Group();
  g.name = 'linden-seat';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(LINDEN_X, y + 0.02, LINDEN_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.3;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.17, trunkH, 7), bark);
  trunk.position.set(LINDEN_X + 0.3, y + trunkH * 0.5, LINDEN_Z - 0.1);
  trunk.rotation.z = 0.05;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.7 - t * 0.08, 7, 6), i % 2 ? deep : leaf);
    crown.position.set(LINDEN_X + 0.28 + (i % 2) * 0.05, y + 2.05 + i * 0.22, LINDEN_Z - 0.12 + (i % 3) * 0.04);
    crown.scale.set(1.2, 0.68, 1.1);
    crown.castShadow = true;
    g.add(crown);
  }

  const blooms = [];
  for (let i = 0; i < 8; i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.028, 5, 4), bloom);
    n.scale.set(1.3, 0.7, 1);
    n.position.set(LINDEN_X + 0.02 + (i % 3) * 0.08, y + 1.4 + (i % 4) * 0.09, LINDEN_Z + 0.1 + (i % 2) * 0.05);
    n.userData.phase = i * 0.58;
    n.userData.baseY = n.position.y;
    g.add(n);
    blooms.push(n);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.24), wood);
  seat.position.set(LINDEN_X - 0.52, y + 0.26, LINDEN_Z - 0.22);
  seat.rotation.y = 0.16;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  leg.position.set(LINDEN_X - 0.52, y + 0.12, LINDEN_Z - 0.22);
  g.add(leg);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.07, 0.22), pale);
  sill.position.set(LINDEN_X - 0.48, y + 0.3, LINDEN_Z + 0.16);
  sill.rotation.y = 0.12;
  sill.castShadow = true;
  g.add(sill);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.2;
    const r = 1.16 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(LINDEN_X + Math.cos(a) * r, y + h * 0.45, LINDEN_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: LINDEN_X, z: LINDEN_Z, name: 'The Linden Seat', blooms, y };
}
