import * as THREE from 'three';
import { heightAt } from './world.js';

export const OREGANO_X = -14;
export const OREGANO_Z = 48;

export function atOreganoRest(x, z){
  return Math.hypot(x - OREGANO_X, z - OREGANO_Z) < 5.5;
}

export function makeOreganoRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a36, roughness: 0.9 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x5a7a3a, roughness: 0.68 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x3e6a2e, roughness: 0.72 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(OREGANO_X, OREGANO_Z);
  const g = new THREE.Group();
  g.name = 'oregano-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.85, 0.08, 10), moss);
  pad.position.set(OREGANO_X, y + 0.02, OREGANO_Z);
  pad.receiveShadow = true;
  g.add(pad);

  for (let i = 0; i < 7; i++){
    const a = i * 0.9;
    const r = 0.38 + (i % 2) * 0.22;
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.2, 5), deep);
    stalk.position.set(OREGANO_X + Math.cos(a) * r, y + 0.11, OREGANO_Z + Math.sin(a) * r);
    g.add(stalk);
    const clump = new THREE.Mesh(new THREE.SphereGeometry(0.055, 5, 3), leaf);
    clump.position.set(OREGANO_X + Math.cos(a) * r, y + 0.22, OREGANO_Z + Math.sin(a) * r);
    g.add(clump);
  }

  const blooms = [];
  for (let i = 0; i < 9; i++){
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.028, 4, 3), i % 2 ? deep : leaf);
    const a = i * 0.7;
    const r = 0.36 + (i % 3) * 0.14;
    b.position.set(OREGANO_X + Math.cos(a) * r, y + 0.15 + (i % 2) * 0.05, OREGANO_Z + Math.sin(a) * r);
    b.userData.phase = i * 0.42;
    b.userData.baseY = b.position.y;
    g.add(b);
    blooms.push(b);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.06, 0.26), wood);
  seat.position.set(OREGANO_X + 0.35, y + 0.28, OREGANO_Z - 0.04);
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.2, 0.046), wood);
  legL.position.set(OREGANO_X + 0.18, y + 0.13, OREGANO_Z - 0.06);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.2, 0.046), wood);
  legR.position.set(OREGANO_X + 0.52, y + 0.13, OREGANO_Z - 0.06);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.11), pale);
  sill.position.set(OREGANO_X - 0.12, y + 0.1, OREGANO_Z + 0.28);
  g.add(sill);

  for (let i = 0; i < 3; i++){
    const a = i * 2.1 + 0.5;
    const r = 1.08;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.08), i % 2 ? pale : stone);
    s.position.set(OREGANO_X + Math.cos(a) * r, y + 0.03, OREGANO_Z + Math.sin(a) * r);
    s.rotation.y = a;
    g.add(s);
  }

  scene.add(g);
  return { x: OREGANO_X, z: OREGANO_Z, name: 'The Oregano Rest', blooms, y };
}
