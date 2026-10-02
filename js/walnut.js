import * as THREE from 'three';
import { heightAt } from './world.js';

export const WALNUT_X = 20;
export const WALNUT_Z = 48;

export function atWalnutBench(x, z){
  return Math.hypot(x - WALNUT_X, z - WALNUT_Z) < 5.6;
}

export function makeWalnutBench(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5c4a38, roughness: 0.94 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3e6a32, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x2a5226, roughness: 0.88 });
  const hull = new THREE.MeshStandardMaterial({ color: 0x6a8a3a, roughness: 0.7 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(WALNUT_X, WALNUT_Z);
  const g = new THREE.Group();
  g.name = 'walnut-bench';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.88, 0.08, 10), moss);
  pad.position.set(WALNUT_X, y + 0.02, WALNUT_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.2;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.18, trunkH, 7), bark);
  trunk.position.set(WALNUT_X + 0.24, y + trunkH * 0.5, WALNUT_Z - 0.04);
  trunk.rotation.z = -0.06;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.62 - t * 0.06, 7, 6), i % 2 ? deep : leaf);
    crown.position.set(WALNUT_X + 0.18 + (i % 2) * 0.05, y + 1.85 + i * 0.22, WALNUT_Z - 0.06 + (i % 3) * 0.03);
    crown.scale.set(1.2, 0.72, 1.05);
    crown.castShadow = true;
    g.add(crown);
  }

  const hulls = [];
  for (let i = 0; i < 7; i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.034, 6, 5), hull);
    n.scale.set(1, 0.85, 0.9);
    n.position.set(WALNUT_X - 0.02 + (i % 3) * 0.07, y + 1.32 + (i % 4) * 0.08, WALNUT_Z + 0.18 + (i % 2) * 0.05);
    n.userData.phase = i * 0.66;
    n.userData.baseY = n.position.y;
    g.add(n);
    hulls.push(n);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.08, 0.26), wood);
  seat.position.set(WALNUT_X - 0.58, y + 0.28, WALNUT_Z - 0.18);
  seat.rotation.y = 0.14;
  seat.castShadow = true;
  g.add(seat);
  const legA = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.08), wood);
  legA.position.set(WALNUT_X - 0.84, y + 0.12, WALNUT_Z - 0.18);
  g.add(legA);
  const legB = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.08), wood);
  legB.position.set(WALNUT_X - 0.32, y + 0.12, WALNUT_Z - 0.18);
  g.add(legB);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 0.26), pale);
  sill.position.set(WALNUT_X - 0.36, y + 0.28, WALNUT_Z + 0.24);
  sill.rotation.y = -0.12;
  g.add(sill);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.22;
    const r = 1.18 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(WALNUT_X + Math.cos(a) * r, y + h * 0.45, WALNUT_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: WALNUT_X, z: WALNUT_Z, name: 'The Walnut Bench', hulls, y };
}
