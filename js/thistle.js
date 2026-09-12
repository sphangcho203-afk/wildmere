import * as THREE from 'three';
import { heightAt } from './world.js';

export const THISTLE_X = 22;
export const THISTLE_Z = 54;

export function atThistleSeat(x, z){
  return Math.hypot(x - THISTLE_X, z - THISTLE_Z) < 5.6;
}

export function makeThistleSeat(scene){
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x4a3b30, roughness: 0.94 });
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const stemM = new THREE.MeshStandardMaterial({ color: 0x3a4a28, roughness: 0.9 });
  const leafM = new THREE.MeshStandardMaterial({ color: 0x3a5428, roughness: 0.88, side: THREE.DoubleSide });
  const headM = new THREE.MeshStandardMaterial({ color: 0x6a4a78, roughness: 0.55 });
  const fluffM = new THREE.MeshStandardMaterial({ color: 0xc8c0b0, roughness: 0.7, transparent: true, opacity: 0.72 });
  const y = heightAt(THISTLE_X, THISTLE_Z);
  const g = new THREE.Group();
  g.name = 'thistle-seat';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.84, 0.08, 10), moss);
  pad.position.set(THISTLE_X, y + 0.02, THISTLE_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.12, 0.36), wood);
  seat.position.set(THISTLE_X - 0.15, y + 0.32, THISTLE_Z + 0.55);
  seat.rotation.y = 0.22;
  seat.castShadow = true;
  g.add(seat);
  for (const sx of [-0.36, 0.36]){
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.26, 0.07), dark);
    leg.position.set(
      THISTLE_X - 0.15 + Math.cos(0.22) * sx,
      y + 0.14,
      THISTLE_Z + 0.55 + Math.sin(0.22) * sx
    );
    g.add(leg);
  }

  const heads = [];
  for (let i = 0; i < 11; i++){
    const a = i * 0.57 + 0.2;
    const r = 0.85 + (i % 4) * 0.22;
    const hx = THISTLE_X + Math.cos(a) * r;
    const hz = THISTLE_Z + Math.sin(a) * r - 0.15;
    const h = 0.48 + (i % 5) * 0.12;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, h, 4), stemM);
    stem.position.set(hx, y + h * 0.48, hz);
    stem.rotation.z = Math.cos(a) * 0.08;
    g.add(stem);
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.2), leafM);
    leaf.position.set(hx + 0.05, y + h * 0.38, hz);
    leaf.rotation.z = 0.4;
    g.add(leaf);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 5), headM);
    head.position.set(hx, y + h * 0.95, hz);
    head.castShadow = true;
    g.add(head);
    const fluff = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 5), fluffM);
    fluff.position.set(hx, y + h * 1.05, hz);
    fluff.userData.phase = i * 0.7;
    fluff.userData.baseY = y + h * 1.05;
    g.add(fluff);
    heads.push(fluff);
  }

  const fallen = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.055, 0.9, 6), dark);
  fallen.rotation.z = Math.PI / 2;
  fallen.rotation.y = 0.6;
  fallen.position.set(THISTLE_X + 0.95, y + 0.08, THISTLE_Z - 0.55);
  fallen.castShadow = true;
  g.add(fallen);

  for (let i = 0; i < 6; i++){
    const a = i * 1.05 + 0.4;
    const r = 1.22 + (i % 2) * 0.16;
    const h = 0.15 + (i % 3) * 0.07;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.24, h, 0.16), i % 2 ? pale : stone);
    s.position.set(THISTLE_X + Math.cos(a) * r, y + h * 0.45, THISTLE_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: THISTLE_X, z: THISTLE_Z, name: 'The Thistle Seat', heads, y };
}
