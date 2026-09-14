import * as THREE from 'three';
import { heightAt } from './world.js';

export const DAISY_X = 4;
export const DAISY_Z = -6;

export function atDaisyRing(x, z){
  return Math.hypot(x - DAISY_X, z - DAISY_Z) < 5.6;
}

export function makeDaisyRing(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const stemM = new THREE.MeshStandardMaterial({ color: 0x3a6a32, roughness: 0.9 });
  const petalM = new THREE.MeshStandardMaterial({ color: 0xf2f0e4, roughness: 0.72, side: THREE.DoubleSide });
  const gold = new THREE.MeshStandardMaterial({ color: 0xe2b84a, roughness: 0.55 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(DAISY_X, DAISY_Z);
  const g = new THREE.Group();
  g.name = 'daisy-ring';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.78, 1.95, 0.08, 10), moss);
  pad.position.set(DAISY_X, y + 0.02, DAISY_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const heads = [];
  for (let i = 0; i < 14; i++){
    const a = i * 0.45 + 0.2;
    const r = 0.55 + (i % 4) * 0.22;
    const hx = DAISY_X + Math.cos(a) * r;
    const hz = DAISY_Z + Math.sin(a) * r;
    const stemH = 0.22 + (i % 3) * 0.06;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, stemH, 5), stemM);
    stem.position.set(hx, y + stemH * 0.5 + 0.04, hz);
    g.add(stem);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.07 + (i % 3) * 0.012, 8), petalM);
    disc.rotation.x = -Math.PI / 2 + 0.18;
    disc.position.set(hx, y + stemH + 0.08, hz);
    disc.userData.phase = i * 0.38;
    disc.userData.baseY = y + stemH + 0.08;
    g.add(disc);
    heads.push(disc);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.028, 6, 5), gold);
    eye.position.set(hx, y + stemH + 0.09, hz);
    g.add(eye);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.1, 0.28), wood);
  seat.position.set(DAISY_X - 0.48, y + 0.28, DAISY_Z + 0.38);
  seat.rotation.y = 0.35;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.08), wood);
  leg.position.set(DAISY_X - 0.48, y + 0.14, DAISY_Z + 0.38);
  g.add(leg);

  for (let i = 0; i < 6; i++){
    const a = i * 1.05 + 0.15;
    const r = 1.22 + (i % 2) * 0.14;
    const h = 0.14 + (i % 3) * 0.07;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.24, h, 0.16), i % 2 ? pale : stone);
    s.position.set(DAISY_X + Math.cos(a) * r, y + h * 0.45, DAISY_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: DAISY_X, z: DAISY_Z, name: 'The Daisy Ring', heads, y };
}
