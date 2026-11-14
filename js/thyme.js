import * as THREE from 'three';
import { heightAt } from './world.js';

export const THYME_X = -12;
export const THYME_Z = 34;

export function atThymeRest(x, z){
  return Math.hypot(x - THYME_X, z - THYME_Z) < 5.5;
}

export function makeThymeRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a36, roughness: 0.9 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3a5a2a, roughness: 0.7 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x2a4a22, roughness: 0.75 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(THYME_X, THYME_Z);
  const g = new THREE.Group();
  g.name = 'thyme-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.82, 0.08, 10), moss);
  pad.position.set(THYME_X, y + 0.02, THYME_Z);
  pad.receiveShadow = true;
  g.add(pad);

  for (let i = 0; i < 6; i++){
    const a = i * 1.05;
    const r = 0.42 + (i % 2) * 0.18;
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.016, 0.22, 5), deep);
    stalk.position.set(THYME_X + Math.cos(a) * r, y + 0.12, THYME_Z + Math.sin(a) * r);
    g.add(stalk);
    const clump = new THREE.Mesh(new THREE.SphereGeometry(0.048, 5, 3), leaf);
    clump.position.set(THYME_X + Math.cos(a) * r, y + 0.24, THYME_Z + Math.sin(a) * r);
    g.add(clump);
  }

  const blooms = [];
  for (let i = 0; i < 8; i++){
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.024, 4, 3), i % 2 ? deep : leaf);
    const a = i * 0.8;
    const r = 0.38 + (i % 3) * 0.12;
    b.position.set(THYME_X + Math.cos(a) * r, y + 0.16 + (i % 2) * 0.04, THYME_Z + Math.sin(a) * r);
    b.userData.phase = i * 0.38;
    b.userData.baseY = b.position.y;
    g.add(b);
    blooms.push(b);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.24), wood);
  seat.position.set(THYME_X + 0.32, y + 0.28, THYME_Z - 0.02);
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.2, 0.044), wood);
  legL.position.set(THYME_X + 0.16, y + 0.13, THYME_Z - 0.04);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.2, 0.044), wood);
  legR.position.set(THYME_X + 0.48, y + 0.13, THYME_Z - 0.04);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.1), pale);
  sill.position.set(THYME_X - 0.1, y + 0.1, THYME_Z + 0.26);
  g.add(sill);

  for (let i = 0; i < 3; i++){
    const a = i * 2.1 + 0.4;
    const r = 1.05;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.07), i % 2 ? pale : stone);
    s.position.set(THYME_X + Math.cos(a) * r, y + 0.03, THYME_Z + Math.sin(a) * r);
    s.rotation.y = a;
    g.add(s);
  }

  scene.add(g);
  return { x: THYME_X, z: THYME_Z, name: 'The Thyme Rest', blooms, y };
}
