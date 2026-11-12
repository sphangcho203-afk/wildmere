import * as THREE from 'three';
import { heightAt } from './world.js';

export const MINT_X = 26;
export const MINT_Z = 18;

export function atMintRest(x, z){
  return Math.hypot(x - MINT_X, z - MINT_Z) < 5.5;
}

export function makeMintRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a36, roughness: 0.9 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3a6a32, roughness: 0.7 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x2a4a28, roughness: 0.75 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(MINT_X, MINT_Z);
  const g = new THREE.Group();
  g.name = 'mint-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.82, 0.08, 10), moss);
  pad.position.set(MINT_X, y + 0.02, MINT_Z);
  pad.receiveShadow = true;
  g.add(pad);

  for (let i = 0; i < 5; i++){
    const a = i * 1.25;
    const r = 0.48 + (i % 2) * 0.15;
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.28, 5), deep);
    stalk.position.set(MINT_X + Math.cos(a) * r, y + 0.14, MINT_Z + Math.sin(a) * r);
    g.add(stalk);
    const clump = new THREE.Mesh(new THREE.SphereGeometry(0.055, 5, 3), leaf);
    clump.position.set(MINT_X + Math.cos(a) * r, y + 0.28, MINT_Z + Math.sin(a) * r);
    g.add(clump);
  }

  const blooms = [];
  for (let i = 0; i < 7; i++){
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.028, 4, 3), i % 2 ? deep : leaf);
    const a = i * 0.9;
    const r = 0.45 + (i % 3) * 0.1;
    b.position.set(MINT_X + Math.cos(a) * r, y + 0.18 + (i % 2) * 0.03, MINT_Z + Math.sin(a) * r);
    b.userData.phase = i * 0.42;
    b.userData.baseY = b.position.y;
    g.add(b);
    blooms.push(b);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.24), wood);
  seat.position.set(MINT_X + 0.35, y + 0.28, MINT_Z - 0.04);
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.2, 0.044), wood);
  legL.position.set(MINT_X + 0.18, y + 0.13, MINT_Z - 0.06);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.2, 0.044), wood);
  legR.position.set(MINT_X + 0.52, y + 0.13, MINT_Z - 0.06);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.1), pale);
  sill.position.set(MINT_X - 0.12, y + 0.1, MINT_Z + 0.28);
  g.add(sill);

  for (let i = 0; i < 3; i++){
    const a = i * 2.1 + 0.3;
    const r = 1.1;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.07), i % 2 ? pale : stone);
    s.position.set(MINT_X + Math.cos(a) * r, y + 0.03, MINT_Z + Math.sin(a) * r);
    s.rotation.y = a;
    g.add(s);
  }

  scene.add(g);
  return { x: MINT_X, z: MINT_Z, name: 'The Mint Rest', blooms, y };
}
