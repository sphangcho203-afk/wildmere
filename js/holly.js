import * as THREE from 'three';
import { heightAt } from './world.js';

export const HOLLY_X = -8;
export const HOLLY_Z = 14;

export function atHollyRest(x, z){
  return Math.hypot(x - HOLLY_X, z - HOLLY_Z) < 5.6;
}

export function makeHollyRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x3a3228, roughness: 0.94 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x1e4a28, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x163820, roughness: 0.88 });
  const berry = new THREE.MeshStandardMaterial({ color: 0xa8322a, roughness: 0.55 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(HOLLY_X, HOLLY_Z);
  const g = new THREE.Group();
  g.name = 'holly-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(HOLLY_X, y + 0.02, HOLLY_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.9;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.15, trunkH, 7), bark);
  trunk.position.set(HOLLY_X + 0.2, y + trunkH * 0.5, HOLLY_Z - 0.06);
  trunk.rotation.z = -0.04;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.52 - t * 0.05, 7, 6), i % 2 ? deep : leaf);
    crown.position.set(HOLLY_X + 0.16 + (i % 2) * 0.05, y + 1.7 + i * 0.2, HOLLY_Z - 0.08 + (i % 3) * 0.03);
    crown.scale.set(1.1, 0.7, 1.0);
    crown.castShadow = true;
    g.add(crown);
  }

  const berries = [];
  for (let i = 0; i < 8; i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.026, 6, 5), berry);
    n.position.set(HOLLY_X - 0.04 + (i % 3) * 0.06, y + 1.28 + (i % 4) * 0.08, HOLLY_Z + 0.16 + (i % 2) * 0.05);
    n.userData.phase = i * 0.7;
    n.userData.baseY = n.position.y;
    g.add(n);
    berries.push(n);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.24), wood);
  seat.position.set(HOLLY_X - 0.54, y + 0.26, HOLLY_Z - 0.2);
  seat.rotation.y = 0.18;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  leg.position.set(HOLLY_X - 0.54, y + 0.12, HOLLY_Z - 0.2);
  g.add(leg);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.07, 0.26), pale);
  sill.position.set(HOLLY_X - 0.4, y + 0.28, HOLLY_Z + 0.22);
  sill.rotation.y = -0.1;
  g.add(sill);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.18;
    const r = 1.16 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(HOLLY_X + Math.cos(a) * r, y + h * 0.45, HOLLY_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: HOLLY_X, z: HOLLY_Z, name: 'The Holly Rest', berries, y };
}
