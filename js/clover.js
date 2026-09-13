import * as THREE from 'three';
import { heightAt } from './world.js';

export const CLOVER_X = 38;
export const CLOVER_Z = 36;

export function atCloverPad(x, z){
  return Math.hypot(x - CLOVER_X, z - CLOVER_Z) < 5.6;
}

export function makeCloverPad(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const leafM = new THREE.MeshStandardMaterial({ color: 0x3a6a32, roughness: 0.88, side: THREE.DoubleSide });
  const paleLeaf = new THREE.MeshStandardMaterial({ color: 0x5a7a40, roughness: 0.86, side: THREE.DoubleSide });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x4a3b30, roughness: 0.94 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const tin = new THREE.MeshStandardMaterial({ color: 0x8a8e86, roughness: 0.45, metalness: 0.22 });
  const water = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.2, transparent: true, opacity: 0.62 });
  const y = heightAt(CLOVER_X, CLOVER_Z);
  const g = new THREE.Group();
  g.name = 'clover-pad';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 1.9, 0.08, 10), moss);
  pad.position.set(CLOVER_X, y + 0.02, CLOVER_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const leaves = [];
  for (let i = 0; i < 18; i++){
    const a = i * 0.35 + 0.1;
    const r = 0.35 + (i % 5) * 0.22;
    const lx = CLOVER_X + Math.cos(a) * r;
    const lz = CLOVER_Z + Math.sin(a) * r;
    const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.08 + (i % 3) * 0.02, 5), i % 2 ? paleLeaf : leafM);
    leaf.rotation.x = -Math.PI / 2 + 0.12;
    leaf.rotation.z = a;
    leaf.position.set(lx, y + 0.07, lz);
    leaf.userData.phase = i * 0.4;
    leaf.userData.baseY = y + 0.07;
    g.add(leaf);
    leaves.push(leaf);
  }

  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.08, 8), wood);
  seat.position.set(CLOVER_X - 0.55, y + 0.34, CLOVER_Z + 0.42);
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.3, 6), dark);
  leg.position.set(CLOVER_X - 0.55, y + 0.16, CLOVER_Z + 0.42);
  g.add(leg);

  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.1, 8, 1, true), tin);
  cup.position.set(CLOVER_X + 0.28, y + 0.16, CLOVER_Z - 0.12);
  g.add(cup);
  const sip = new THREE.Mesh(new THREE.CircleGeometry(0.055, 8), water);
  sip.rotation.x = -Math.PI / 2;
  sip.position.set(CLOVER_X + 0.28, y + 0.2, CLOVER_Z - 0.12);
  g.add(sip);

  for (let i = 0; i < 6; i++){
    const a = i * 1.05 + 0.3;
    const r = 1.2 + (i % 2) * 0.14;
    const h = 0.14 + (i % 3) * 0.07;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.24, h, 0.16), i % 2 ? pale : stone);
    s.position.set(CLOVER_X + Math.cos(a) * r, y + h * 0.45, CLOVER_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: CLOVER_X, z: CLOVER_Z, name: 'The Clover Pad', leaves, y };
}
