import * as THREE from 'three';
import { heightAt } from './world.js';

export const ASPEN_X = 24;
export const ASPEN_Z = -8;

export function atAspenLean(x, z){
  return Math.hypot(x - ASPEN_X, z - ASPEN_Z) < 5.6;
}

export function makeAspenLean(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0xd4c8a8, roughness: 0.86 });
  const mark = new THREE.MeshStandardMaterial({ color: 0x5a5246, roughness: 0.92 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x7a8a3a, roughness: 0.84, side: THREE.DoubleSide });
  const gold = new THREE.MeshStandardMaterial({ color: 0xc4a43a, roughness: 0.82, side: THREE.DoubleSide });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(ASPEN_X, ASPEN_Z);
  const g = new THREE.Group();
  g.name = 'aspen-lean';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(ASPEN_X, y + 0.02, ASPEN_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.25;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, trunkH, 7), bark);
  trunk.position.set(ASPEN_X + 0.42, y + trunkH * 0.5, ASPEN_Z - 0.18);
  trunk.rotation.z = -0.09;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const dash = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.07 + (i % 2) * 0.03, 0.03), mark);
    dash.position.set(ASPEN_X + 0.38 + i * 0.012, y + 0.85 + i * 0.36, ASPEN_Z - 0.16);
    g.add(dash);
  }

  for (let i = 0; i < 7; i++){
    const a = i * 0.9;
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.22 + (i % 3) * 0.05, 6, 5), i % 2 ? gold : leaf);
    puff.position.set(
      ASPEN_X + 0.32 + Math.cos(a) * 0.36,
      y + 2.65 + (i % 3) * 0.14,
      ASPEN_Z - 0.2 + Math.sin(a) * 0.28
    );
    puff.castShadow = true;
    g.add(puff);
  }

  const leaves = [];
  for (let i = 0; i < 8; i++){
    const flip = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.08), i % 2 ? gold : leaf);
    flip.position.set(ASPEN_X + 0.16 + (i % 4) * 0.08, y + 2.05 + (i % 3) * 0.1, ASPEN_Z - 0.02 + (i % 3) * 0.05);
    flip.rotation.z = 0.2 + i * 0.1;
    flip.userData.phase = i * 0.48;
    flip.userData.baseY = flip.position.y;
    g.add(flip);
    leaves.push(flip);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.24), wood);
  seat.position.set(ASPEN_X - 0.55, y + 0.26, ASPEN_Z + 0.2);
  seat.rotation.y = 0.26;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  leg.position.set(ASPEN_X - 0.55, y + 0.12, ASPEN_Z + 0.2);
  g.add(leg);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 0.26), pale);
  sill.position.set(ASPEN_X - 0.42, y + 0.22, ASPEN_Z - 0.32);
  sill.rotation.y = -0.18;
  sill.castShadow = true;
  g.add(sill);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.35;
    const r = 1.16 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(ASPEN_X + Math.cos(a) * r, y + h * 0.45, ASPEN_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: ASPEN_X, z: ASPEN_Z, name: 'The Aspen Lean', leaves, y };
}
