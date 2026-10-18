import * as THREE from 'three';
import { heightAt } from './world.js';

export const SERVICE_X = -32;
export const SERVICE_Z = 18;

export function atServiceRest(x, z){
  return Math.hypot(x - SERVICE_X, z - SERVICE_Z) < 5.5;
}

export function makeServiceRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5c38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5c4634, roughness: 0.9 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3e5c2c, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x2e4a22, roughness: 0.88 });
  const berry = new THREE.MeshStandardMaterial({ color: 0x4a2a4a, roughness: 0.65 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6a5240, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(SERVICE_X, SERVICE_Z);
  const g = new THREE.Group();
  g.name = 'service-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.88, 0.08, 10), moss);
  pad.position.set(SERVICE_X, y + 0.02, SERVICE_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.35;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.19, trunkH, 7), bark);
  trunk.position.set(SERVICE_X - 0.05, y + trunkH * 0.5, SERVICE_Z + 0.03);
  trunk.rotation.z = 0.04;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 4; i++){
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.55 - i * 0.025, 6, 5), i % 2 ? deep : leaf);
    crown.position.set(SERVICE_X + 0.02 + (i % 2) * 0.015, y + 1.5 + i * 0.08, SERVICE_Z - 0.01);
    crown.scale.set(1.15, 0.48, 1.05);
    crown.castShadow = true;
    g.add(crown);
  }

  const berries = [];
  for (let i = 0; i < 6; i++){
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.035, 5, 4), berry);
    b.position.set(SERVICE_X - 0.1 + (i % 3) * 0.09, y + 1.38 + (i % 2) * 0.06, SERVICE_Z - 0.03 + (i % 2) * 0.07);
    b.userData.phase = i * 0.55;
    b.userData.baseY = b.position.y;
    g.add(b);
    berries.push(b);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.07, 0.3), wood);
  seat.position.set(SERVICE_X + 0.48, y + 0.3, SERVICE_Z + 0.02);
  seat.rotation.y = 0.03;
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legL.position.set(SERVICE_X + 0.28, y + 0.15, SERVICE_Z + 0.02);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legR.position.set(SERVICE_X + 0.66, y + 0.15, SERVICE_Z + 0.01);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.15), pale);
  sill.position.set(SERVICE_X + 0.02, y + 0.16, SERVICE_Z - 0.4);
  sill.rotation.y = -0.04;
  g.add(sill);

  for (let i = 0; i < 4; i++){
    const a = i * 1.57 + 0.3;
    const r = 1.18 + (i % 2) * 0.03;
    const h = 0.1 + (i % 3) * 0.02;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.15, h, 0.12), i % 2 ? pale : stone);
    s.position.set(SERVICE_X + Math.cos(a) * r, y + h * 0.45, SERVICE_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: SERVICE_X, z: SERVICE_Z, name: 'The Serviceberry Rest', berries, y };
}
