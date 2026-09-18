import * as THREE from 'three';
import { heightAt } from './world.js';

export const HAZEL_X = 22;
export const HAZEL_Z = 8;

export function atHazelRest(x, z){
  return Math.hypot(x - HAZEL_X, z - HAZEL_Z) < 5.6;
}

export function makeHazelRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a4a36, roughness: 0.92 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4e6a34, roughness: 0.88 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const nutM = new THREE.MeshStandardMaterial({ color: 0x8a6a38, roughness: 0.78 });
  const y = heightAt(HAZEL_X, HAZEL_Z);
  const g = new THREE.Group();
  g.name = 'hazel-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(HAZEL_X, y + 0.02, HAZEL_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.85;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.13, trunkH, 7), bark);
  trunk.position.set(HAZEL_X + 0.42, y + trunkH * 0.5, HAZEL_Z - 0.16);
  trunk.rotation.z = -0.1;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 7; i++){
    const a = i * 0.9;
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.24 + (i % 3) * 0.05, 6, 5), leaf);
    puff.position.set(
      HAZEL_X + 0.32 + Math.cos(a) * 0.36,
      y + 2.35 + (i % 3) * 0.14,
      HAZEL_Z - 0.2 + Math.sin(a) * 0.28
    );
    puff.castShadow = true;
    g.add(puff);
  }

  const nuts = [];
  for (let i = 0; i < 6; i++){
    const nut = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), nutM);
    nut.position.set(HAZEL_X + 0.18 + (i % 3) * 0.1, y + 1.95 + (i % 2) * 0.1, HAZEL_Z - 0.06 + (i % 3) * 0.05);
    nut.userData.phase = i * 0.5;
    nut.userData.baseY = nut.position.y;
    g.add(nut);
    nuts.push(nut);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.24), wood);
  seat.position.set(HAZEL_X - 0.52, y + 0.26, HAZEL_Z + 0.24);
  seat.rotation.y = 0.28;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  leg.position.set(HAZEL_X - 0.52, y + 0.12, HAZEL_Z + 0.24);
  g.add(leg);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.35;
    const r = 1.16 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(HAZEL_X + Math.cos(a) * r, y + h * 0.45, HAZEL_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: HAZEL_X, z: HAZEL_Z, name: 'The Hazel Rest', nuts, y };
}
