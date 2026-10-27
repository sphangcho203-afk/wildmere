import * as THREE from 'three';
import { heightAt } from './world.js';

export const BUTTER_X = 28;
export const BUTTER_Z = 8;

export function atButtercupRest(x, z){
  return Math.hypot(x - BUTTER_X, z - BUTTER_Z) < 5.5;
}

export function makeButtercupRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5c38, roughness: 0.9 });
  const bloom = new THREE.MeshStandardMaterial({ color: 0xeda916, roughness: 0.68 });
  const deep = new THREE.MeshStandardMaterial({ color: 0xc48a12, roughness: 0.78 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6a5240, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(BUTTER_X, BUTTER_Z);
  const g = new THREE.Group();
  g.name = 'buttercup-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.88, 0.08, 10), moss);
  pad.position.set(BUTTER_X, y + 0.02, BUTTER_Z);
  pad.receiveShadow = true;
  g.add(pad);

  for (let i = 0; i < 5; i++){
    const a = i * 1.25;
    const r = 0.65 + (i % 2) * 0.18;
    const clump = new THREE.Mesh(new THREE.SphereGeometry(0.2 + (i % 3) * 0.03, 6, 4), i % 2 ? deep : bloom);
    clump.position.set(BUTTER_X + Math.cos(a) * r, y + 0.14, BUTTER_Z + Math.sin(a) * r);
    clump.scale.y = 0.55;
    clump.castShadow = true;
    g.add(clump);
  }

  const blooms = [];
  for (let i = 0; i < 7; i++){
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.032, 4, 3), bloom);
    const a = i * 0.9;
    const r = 0.5 + (i % 3) * 0.14;
    b.position.set(BUTTER_X + Math.cos(a) * r, y + 0.2 + (i % 2) * 0.035, BUTTER_Z + Math.sin(a) * r);
    b.userData.phase = i * 0.55;
    b.userData.baseY = b.position.y;
    g.add(b);
    blooms.push(b);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.065, 0.26), wood);
  seat.position.set(BUTTER_X + 0.46, y + 0.3, BUTTER_Z + 0.01);
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.24, 0.048), wood);
  legL.position.set(BUTTER_X + 0.26, y + 0.14, BUTTER_Z);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.24, 0.048), wood);
  legR.position.set(BUTTER_X + 0.66, y + 0.14, BUTTER_Z);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.12), pale);
  sill.position.set(BUTTER_X - 0.08, y + 0.13, BUTTER_Z - 0.38);
  g.add(sill);

  for (let i = 0; i < 4; i++){
    const a = i * 1.57 + 0.2;
    const r = 1.15;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.09), i % 2 ? pale : stone);
    s.position.set(BUTTER_X + Math.cos(a) * r, y + 0.05, BUTTER_Z + Math.sin(a) * r);
    s.rotation.y = a;
    g.add(s);
  }

  scene.add(g);
  return { x: BUTTER_X, z: BUTTER_Z, name: 'The Buttercup Rest', blooms, y };
}
