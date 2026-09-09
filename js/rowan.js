import * as THREE from 'three';
import { heightAt } from './world.js';

export const ROWAN_X = 38;
export const ROWAN_Z = 22;

export function atRowanLean(x, z){
  return Math.hypot(x - ROWAN_X, z - ROWAN_Z) < 5.6;
}

export function makeRowanLean(scene){
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a4032, roughness: 0.94 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x4a3428, roughness: 0.95 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3a5c28, roughness: 0.86 });
  const leaf2 = new THREE.MeshStandardMaterial({ color: 0x2e4a20, roughness: 0.88 });
  const berry = new THREE.MeshStandardMaterial({ color: 0xa83828, roughness: 0.55 });
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(ROWAN_X, ROWAN_Z);
  const g = new THREE.Group();
  g.name = 'rowan-lean';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.62, 1.78, 0.07, 10), moss);
  pad.position.set(ROWAN_X, y + 0.02, ROWAN_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const lean = 0.22;
  const trunkH = 5.4;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.16, trunkH, 8), bark);
  trunk.position.set(ROWAN_X + 0.35, y + trunkH * 0.48, ROWAN_Z - 0.08);
  trunk.rotation.z = -lean;
  trunk.castShadow = true;
  g.add(trunk);

  const clusters = [];
  const canopyX = ROWAN_X + 0.35 + Math.sin(lean) * trunkH * 0.72;
  const canopyY = y + trunkH * 0.82;
  const canopyZ = ROWAN_Z - 0.08;
  for (let i = 0; i < 7; i++){
    const a = i * 0.9;
    const fol = new THREE.Mesh(
      new THREE.SphereGeometry(0.55 + (i % 3) * 0.12, 8, 6),
      i % 2 ? leaf : leaf2
    );
    fol.position.set(
      canopyX + Math.cos(a) * 0.55,
      canopyY + (i % 3) * 0.22 - 0.1,
      canopyZ + Math.sin(a) * 0.5
    );
    fol.castShadow = true;
    g.add(fol);
  }
  for (let i = 0; i < 9; i++){
    const a = i * 0.7;
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 5), berry);
    bun.position.set(
      canopyX + Math.cos(a) * 0.42,
      canopyY - 0.28 + (i % 3) * 0.08,
      canopyZ + Math.sin(a) * 0.38
    );
    bun.castShadow = true;
    g.add(bun);
    clusters.push(bun);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.14, 0.42), pale);
  seat.position.set(ROWAN_X - 0.85, y + 0.28, ROWAN_Z + 0.45);
  seat.rotation.y = 0.4;
  seat.castShadow = true;
  g.add(seat);
  for (const sx of [-0.32, 0.32]){
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), stone);
    leg.position.set(ROWAN_X - 0.85 + Math.cos(0.4) * sx, y + 0.12, ROWAN_Z + 0.45 + Math.sin(0.4) * sx);
    g.add(leg);
  }

  const fallen = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.35, 6), dark);
  fallen.rotation.z = Math.PI / 2;
  fallen.rotation.y = -0.4;
  fallen.position.set(ROWAN_X + 1.15, y + 0.1, ROWAN_Z + 0.7);
  fallen.castShadow = true;
  g.add(fallen);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.5;
    const r = 1.2 + (i % 2) * 0.16;
    const h = 0.15 + (i % 3) * 0.07;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.26, h, 0.18), i % 2 ? pale : stone);
    s.position.set(ROWAN_X + Math.cos(a) * r, y + h * 0.45, ROWAN_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: ROWAN_X, z: ROWAN_Z, name: 'The Rowan Lean', clusters };
}
