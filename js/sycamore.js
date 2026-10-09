import * as THREE from 'three';
import { heightAt } from './world.js';

export const SYCAMORE_X = 48;
export const SYCAMORE_Z = 8;

export function atSycamoreSeat(x, z){
  return Math.hypot(x - SYCAMORE_X, z - SYCAMORE_Z) < 5.5;
}

export function makeSycamoreSeat(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4c5c3a, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x8a8478, roughness: 0.88 });
  const patch = new THREE.MeshStandardMaterial({ color: 0xb7b0a2, roughness: 0.84 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x5a7840, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x3e5a2c, roughness: 0.88 });
  const ball = new THREE.MeshStandardMaterial({ color: 0x8a6a42, roughness: 0.72 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6d5542, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6c6862, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7c786e, roughness: 0.94, flatShading: true });
  const y = heightAt(SYCAMORE_X, SYCAMORE_Z);
  const g = new THREE.Group();
  g.name = 'sycamore-seat';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 1.9, 0.08, 10), moss);
  pad.position.set(SYCAMORE_X, y + 0.02, SYCAMORE_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.55;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, trunkH, 8), bark);
  trunk.position.set(SYCAMORE_X - 0.18, y + trunkH * 0.5, SYCAMORE_Z + 0.06);
  trunk.rotation.z = -0.06;
  trunk.castShadow = true;
  g.add(trunk);
  for (let i = 0; i < 5; i++){
    const flake = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.03), patch);
    const a = i * 1.25 + 0.3;
    flake.position.set(SYCAMORE_X - 0.18 + Math.cos(a) * 0.2, y + 0.55 + (i % 3) * 0.42, SYCAMORE_Z + 0.06 + Math.sin(a) * 0.2);
    flake.rotation.y = a;
    g.add(flake);
  }

  for (let i = 0; i < 5; i++){
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.7 - i * 0.05, 7, 6), i % 2 ? deep : leaf);
    crown.position.set(SYCAMORE_X + 0.02 + (i % 2) * 0.06, y + 1.7 + i * 0.14, SYCAMORE_Z - 0.02);
    crown.scale.set(1.35, 0.55, 1.18);
    crown.castShadow = true;
    g.add(crown);
  }

  const balls = [];
  for (let i = 0; i < 6; i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 5), ball);
    n.position.set(SYCAMORE_X - 0.22 + (i % 3) * 0.16, y + 1.42 + (i % 2) * 0.12, SYCAMORE_Z - 0.1 + (i % 2) * 0.12);
    n.userData.phase = i * 0.7;
    n.userData.baseY = n.position.y;
    g.add(n);
    balls.push(n);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.07, 0.32), wood);
  seat.position.set(SYCAMORE_X + 0.55, y + 0.32, SYCAMORE_Z - 0.06);
  seat.rotation.y = -0.14;
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.28, 0.07), wood);
  legL.position.set(SYCAMORE_X + 0.34, y + 0.16, SYCAMORE_Z - 0.06);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.28, 0.07), wood);
  legR.position.set(SYCAMORE_X + 0.74, y + 0.16, SYCAMORE_Z - 0.08);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.2), pale);
  sill.position.set(SYCAMORE_X + 0.06, y + 0.18, SYCAMORE_Z - 0.42);
  sill.rotation.y = 0.12;
  g.add(sill);

  for (let i = 0; i < 5; i++){
    const a = i * 1.22 + 0.55;
    const r = 1.18 + (i % 2) * 0.08;
    const h = 0.1 + (i % 3) * 0.05;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.2, h, 0.15), i % 2 ? pale : stone);
    s.position.set(SYCAMORE_X + Math.cos(a) * r, y + h * 0.45, SYCAMORE_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: SYCAMORE_X, z: SYCAMORE_Z, name: 'The Sycamore Seat', balls, y };
}
