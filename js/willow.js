import * as THREE from 'three';
import { heightAt } from './world.js';

export const WILLOW_X = 24;
export const WILLOW_Z = -32;

export function atWillowDip(x, z){
  return Math.hypot(x - WILLOW_X, z - WILLOW_Z) < 5.8;
}

export function makeWillowDip(scene){
  const bark = new THREE.MeshStandardMaterial({ color: 0x5c4a38, roughness: 0.94 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x4a3828, roughness: 0.95 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4a6a32, roughness: 0.86, side: THREE.DoubleSide });
  const leaf2 = new THREE.MeshStandardMaterial({ color: 0x3a5428, roughness: 0.88, side: THREE.DoubleSide });
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const water = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.18, transparent: true, opacity: 0.7 });
  const y = heightAt(WILLOW_X, WILLOW_Z);
  const g = new THREE.Group();
  g.name = 'willow-dip';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.22, 0.08, 12), moss);
  pad.position.set(WILLOW_X, y + 0.02, WILLOW_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const dip = new THREE.Mesh(new THREE.CircleGeometry(0.72, 12), water);
  dip.rotation.x = -Math.PI / 2;
  dip.position.set(WILLOW_X + 0.55, y + 0.06, WILLOW_Z + 0.4);
  g.add(dip);

  const trunkH = 5.8;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, trunkH, 8), bark);
  trunk.position.set(WILLOW_X - 0.15, y + trunkH * 0.48, WILLOW_Z - 0.1);
  trunk.rotation.z = 0.12;
  trunk.castShadow = true;
  g.add(trunk);

  const crotch = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, 2.2, 6), dark);
  crotch.position.set(WILLOW_X + 0.55, y + 4.4, WILLOW_Z);
  crotch.rotation.z = -0.7;
  crotch.castShadow = true;
  g.add(crotch);

  const canopyX = WILLOW_X - 0.05;
  const canopyY = y + 5.35;
  const canopyZ = WILLOW_Z - 0.08;
  for (let i = 0; i < 8; i++){
    const a = i * 0.78;
    const fol = new THREE.Mesh(
      new THREE.SphereGeometry(0.62 + (i % 3) * 0.14, 8, 6),
      i % 2 ? leaf : leaf2
    );
    fol.position.set(
      canopyX + Math.cos(a) * 0.7,
      canopyY + (i % 3) * 0.18 - 0.12,
      canopyZ + Math.sin(a) * 0.62
    );
    fol.castShadow = true;
    g.add(fol);
  }

  const strands = [];
  for (let i = 0; i < 14; i++){
    const a = i * 0.45;
    const len = 1.35 + (i % 4) * 0.28;
    const strand = new THREE.Mesh(new THREE.PlaneGeometry(0.06, len), i % 2 ? leaf : leaf2);
    strand.position.set(
      canopyX + Math.cos(a) * 0.95,
      canopyY - len * 0.42,
      canopyZ + Math.sin(a) * 0.85
    );
    strand.rotation.z = Math.cos(a) * 0.08;
    g.add(strand);
    strands.push(strand);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.13, 0.38), pale);
  seat.position.set(WILLOW_X - 1.05, y + 0.26, WILLOW_Z + 0.55);
  seat.rotation.y = -0.35;
  seat.castShadow = true;
  g.add(seat);
  for (const sx of [-0.28, 0.28]){
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.08), stone);
    leg.position.set(WILLOW_X - 1.05 + Math.cos(-0.35) * sx, y + 0.12, WILLOW_Z + 0.55 + Math.sin(-0.35) * sx);
    g.add(leg);
  }

  const fallen = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.2, 6), dark);
  fallen.rotation.z = Math.PI / 2;
  fallen.rotation.y = 0.5;
  fallen.position.set(WILLOW_X + 1.2, y + 0.09, WILLOW_Z - 0.55);
  fallen.castShadow = true;
  g.add(fallen);

  for (let i = 0; i < 6; i++){
    const a = i * 1.05 + 0.2;
    const r = 1.35 + (i % 2) * 0.18;
    const h = 0.14 + (i % 3) * 0.07;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.24, h, 0.16), i % 2 ? pale : stone);
    s.position.set(WILLOW_X + Math.cos(a) * r, y + h * 0.45, WILLOW_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: WILLOW_X, z: WILLOW_Z, name: 'The Willow Dip', strands, dip };
}
