import * as THREE from 'three';
import { heightAt } from './world.js';

export const HAWTHORN_X = 28;
export const HAWTHORN_Z = 40;

export function atHawthornBench(x, z){
  return Math.hypot(x - HAWTHORN_X, z - HAWTHORN_Z) < 5.6;
}

export function makeHawthornBench(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5c4636, roughness: 0.94 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3d6432, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x2a4e28, roughness: 0.88 });
  const bloom = new THREE.MeshStandardMaterial({ color: 0xf2efe4, roughness: 0.62 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(HAWTHORN_X, HAWTHORN_Z);
  const g = new THREE.Group();
  g.name = 'hawthorn-bench';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.88, 0.08, 10), moss);
  pad.position.set(HAWTHORN_X, y + 0.02, HAWTHORN_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.7;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.18, trunkH, 7), bark);
  trunk.position.set(HAWTHORN_X - 0.22, y + trunkH * 0.5, HAWTHORN_Z + 0.08);
  trunk.rotation.z = -0.16;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.62 - t * 0.06, 7, 6), i % 2 ? deep : leaf);
    crown.position.set(HAWTHORN_X - 0.16 + (i % 2) * 0.05, y + 1.62 + i * 0.2, HAWTHORN_Z + 0.04 + (i % 3) * 0.03);
    crown.scale.set(1.22, 0.68, 1.05);
    crown.castShadow = true;
    g.add(crown);
  }

  const blooms = [];
  for (let i = 0; i < 8; i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.034, 6, 5), bloom);
    n.scale.set(1.15, 0.7, 0.9);
    n.position.set(HAWTHORN_X - 0.28 + (i % 4) * 0.07, y + 1.22 + (i % 4) * 0.08, HAWTHORN_Z - 0.08 + (i % 2) * 0.05);
    n.userData.phase = i * 0.62;
    n.userData.baseY = n.position.y;
    g.add(n);
    blooms.push(n);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.08, 0.3), wood);
  seat.position.set(HAWTHORN_X + 0.52, y + 0.26, HAWTHORN_Z - 0.08);
  seat.rotation.y = 0.22;
  seat.castShadow = true;
  g.add(seat);
  const legA = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  legA.position.set(HAWTHORN_X + 0.26, y + 0.12, HAWTHORN_Z - 0.08);
  g.add(legA);
  const legB = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  legB.position.set(HAWTHORN_X + 0.78, y + 0.12, HAWTHORN_Z - 0.08);
  g.add(legB);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 0.24), pale);
  sill.position.set(HAWTHORN_X - 0.08, y + 0.24, HAWTHORN_Z - 0.36);
  sill.rotation.y = -0.14;
  g.add(sill);

  for (let i = 0; i < 5; i++){
    const a = i * 1.22 + 0.2;
    const r = 1.14 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(HAWTHORN_X + Math.cos(a) * r, y + h * 0.45, HAWTHORN_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: HAWTHORN_X, z: HAWTHORN_Z, name: 'The Hawthorn Bench', blooms, y };
}
