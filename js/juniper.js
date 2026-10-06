import * as THREE from 'three';
import { heightAt } from './world.js';

export const JUNIPER_X = -16;
export const JUNIPER_Z = 20;

export function atJuniperCup(x, z){
  return Math.hypot(x - JUNIPER_X, z - JUNIPER_Z) < 5.4;
}

export function makeJuniperCup(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4d5c3a, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a4636, roughness: 0.94 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3e5a34, roughness: 0.88 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x2c4630, roughness: 0.9 });
  const berry = new THREE.MeshStandardMaterial({ color: 0x4a6a9a, roughness: 0.5 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const water = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.22, transparent: true, opacity: 0.78 });
  const y = heightAt(JUNIPER_X, JUNIPER_Z);
  const g = new THREE.Group();
  g.name = 'juniper-cup';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.78, 0.08, 10), moss);
  pad.position.set(JUNIPER_X, y + 0.02, JUNIPER_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 1.15, 6), bark);
  trunk.position.set(JUNIPER_X - 0.1, y + 0.58, JUNIPER_Z + 0.08);
  trunk.rotation.z = 0.35;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.48 - i * 0.03, 7, 5), i % 2 ? deep : leaf);
    crown.position.set(JUNIPER_X - 0.2 + i * 0.16, y + 0.72 + (i % 2) * 0.12, JUNIPER_Z + 0.04);
    crown.scale.set(1.45, 0.42, 1.05);
    crown.castShadow = true;
    g.add(crown);
  }

  const berries = [];
  for (let i = 0; i < 7; i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), berry);
    n.position.set(JUNIPER_X - 0.42 + (i % 4) * 0.16, y + 0.78 + (i % 3) * 0.08, JUNIPER_Z - 0.12 + (i % 2) * 0.12);
    n.userData.phase = i * 0.65;
    n.userData.baseY = n.position.y;
    g.add(n);
    berries.push(n);
  }

  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.14, 8), wood);
  cup.position.set(JUNIPER_X + 0.42, y + 0.16, JUNIPER_Z - 0.22);
  g.add(cup);
  const sip = new THREE.Mesh(new THREE.CircleGeometry(0.065, 8), water);
  sip.rotation.x = -Math.PI / 2;
  sip.position.set(JUNIPER_X + 0.42, y + 0.22, JUNIPER_Z - 0.22);
  g.add(sip);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.22), pale);
  sill.position.set(JUNIPER_X + 0.42, y + 0.08, JUNIPER_Z - 0.22);
  g.add(sill);

  for (let i = 0; i < 4; i++){
    const a = i * 1.5 + 0.4;
    const r = 1.12;
    const h = 0.1 + (i % 2) * 0.05;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.18, h, 0.14), pale);
    s.position.set(JUNIPER_X + Math.cos(a) * r, y + h * 0.45, JUNIPER_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: JUNIPER_X, z: JUNIPER_Z, name: 'The Juniper Cup', berries, y };
}
