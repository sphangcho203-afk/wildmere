import * as THREE from 'three';
import { heightAt } from './world.js';

export const BIRCH_X = -14;
export const BIRCH_Z = -6;

export function atBirchShelf(x, z){
  return Math.hypot(x - BIRCH_X, z - BIRCH_Z) < 5.6;
}

export function makeBirchShelf(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.86 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x5a5348, roughness: 0.92 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x6a7548, roughness: 0.88 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const peelM = new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.72, side: THREE.DoubleSide });
  const y = heightAt(BIRCH_X, BIRCH_Z);
  const g = new THREE.Group();
  g.name = 'birch-shelf';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.82, 0.08, 10), moss);
  pad.position.set(BIRCH_X, y + 0.02, BIRCH_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.35;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, trunkH, 7), bark);
  trunk.position.set(BIRCH_X + 0.55, y + trunkH * 0.48, BIRCH_Z - 0.22);
  trunk.rotation.z = 0.22;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const mark = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08 + (i % 2) * 0.04, 0.04), dark);
    mark.position.set(BIRCH_X + 0.48 + i * 0.02, y + 0.9 + i * 0.38, BIRCH_Z - 0.18);
    g.add(mark);
  }

  for (let i = 0; i < 7; i++){
    const a = i * 0.9;
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.28 + (i % 3) * 0.06, 6, 5), leaf);
    puff.position.set(
      BIRCH_X + 0.35 + Math.cos(a) * 0.42,
      y + 2.85 + (i % 3) * 0.18,
      BIRCH_Z - 0.28 + Math.sin(a) * 0.32
    );
    puff.castShadow = true;
    g.add(puff);
  }

  const peels = [];
  for (let i = 0; i < 5; i++){
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.34), peelM);
    strip.position.set(BIRCH_X + 0.62 + (i % 3) * 0.04, y + 1.35 + i * 0.22, BIRCH_Z - 0.12);
    strip.rotation.y = 0.4 + i * 0.15;
    strip.userData.phase = i * 0.7;
    g.add(strip);
    peels.push(strip);
  }

  const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.1, 0.42), pale);
  shelf.position.set(BIRCH_X - 0.28, y + 0.22, BIRCH_Z + 0.18);
  shelf.rotation.y = -0.2;
  shelf.castShadow = true;
  g.add(shelf);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.1), stone);
  leg.position.set(BIRCH_X - 0.28, y + 0.1, BIRCH_Z + 0.18);
  g.add(leg);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.24), wood);
  seat.position.set(BIRCH_X - 0.62, y + 0.26, BIRCH_Z - 0.32);
  seat.rotation.y = 0.4;
  seat.castShadow = true;
  g.add(seat);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.3;
    const r = 1.15 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(BIRCH_X + Math.cos(a) * r, y + h * 0.45, BIRCH_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: BIRCH_X, z: BIRCH_Z, name: 'The Birch Shelf', peels, y };
}
