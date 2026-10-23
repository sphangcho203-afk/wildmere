import * as THREE from 'three';
import { heightAt } from './world.js';

export const PINE_REST_X = 16;
export const PINE_REST_Z = -8;

export function atPineRest(x, z){
  return Math.hypot(x - PINE_REST_X, z - PINE_REST_Z) < 5.5;
}

export function makePineRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5c38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x4a3a30, roughness: 0.92 });
  const needle = new THREE.MeshStandardMaterial({ color: 0x3a5a32, roughness: 0.85 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x2a4a28, roughness: 0.88 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6a5240, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(PINE_REST_X, PINE_REST_Z);
  const g = new THREE.Group();
  g.name = 'pine-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.88, 0.08, 10), moss);
  pad.position.set(PINE_REST_X, y + 0.02, PINE_REST_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.7;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.21, trunkH, 7), bark);
  trunk.position.set(PINE_REST_X - 0.04, y + trunkH * 0.5, PINE_REST_Z + 0.02);
  trunk.rotation.z = -0.07;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 4; i++){
    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.78 - i * 0.13, 0.88, 6), i % 2 ? deep : needle);
    crown.position.set(PINE_REST_X + 0.02, y + 1.55 + i * 0.34, PINE_REST_Z - 0.02);
    crown.castShadow = true;
    g.add(crown);
  }

  const needles = [];
  for (let i = 0; i < 6; i++){
    const n = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.12, 4), needle);
    n.position.set(PINE_REST_X - 0.13 + (i % 3) * 0.1, y + 1.52 + (i % 2) * 0.07, PINE_REST_Z - 0.05 + (i % 2) * 0.08);
    n.rotation.z = 0.28 + (i % 3) * 0.16;
    n.userData.phase = i * 0.58;
    n.userData.baseY = n.position.y;
    g.add(n);
    needles.push(n);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.63, 0.07, 0.27), wood);
  seat.position.set(PINE_REST_X + 0.49, y + 0.3, PINE_REST_Z + 0.02);
  seat.rotation.y = -0.015;
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.26, 0.056), wood);
  legL.position.set(PINE_REST_X + 0.29, y + 0.15, PINE_REST_Z + 0.02);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.26, 0.056), wood);
  legR.position.set(PINE_REST_X + 0.67, y + 0.15, PINE_REST_Z);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.056, 0.14), pale);
  sill.position.set(PINE_REST_X + 0.02, y + 0.16, PINE_REST_Z - 0.42);
  sill.rotation.y = 0.025;
  g.add(sill);

  for (let i = 0; i < 4; i++){
    const a = i * 1.57 + 0.18;
    const r = 1.14 + (i % 2) * 0.05;
    const h = 0.085 + (i % 3) * 0.02;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.135, h, 0.105), i % 2 ? pale : stone);
    s.position.set(PINE_REST_X + Math.cos(a) * r, y + h * 0.45, PINE_REST_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: PINE_REST_X, z: PINE_REST_Z, name: 'The Pine Rest', needles, y };
}
