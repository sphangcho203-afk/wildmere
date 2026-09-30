import * as THREE from 'three';
import { heightAt } from './world.js';

export const ASH_X = -12;
export const ASH_Z = 36;

export function atAshLedge(x, z){
  return Math.hypot(x - ASH_X, z - ASH_Z) < 5.6;
}

export function makeAshLedge(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a5248, roughness: 0.93 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4a7a38, roughness: 0.84 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x2e5a28, roughness: 0.88 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(ASH_X, ASH_Z);
  const g = new THREE.Group();
  g.name = 'ash-ledge';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(ASH_X, y + 0.02, ASH_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.5;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.16, trunkH, 7), bark);
  trunk.position.set(ASH_X + 0.22, y + trunkH * 0.5, ASH_Z - 0.06);
  trunk.rotation.z = -0.05;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.58 - t * 0.07, 7, 6), i % 2 ? deep : leaf);
    crown.position.set(ASH_X + 0.18 + (i % 2) * 0.05, y + 2.05 + i * 0.22, ASH_Z - 0.08 + (i % 3) * 0.03);
    crown.scale.set(1.05, 0.72, 0.95);
    crown.castShadow = true;
    g.add(crown);
  }

  const keys = [];
  for (let i = 0; i < 8; i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.028, 5, 4), i % 2 ? leaf : pale);
    n.scale.set(0.55, 1.15, 0.4);
    n.position.set(ASH_X - 0.02 + (i % 3) * 0.06, y + 1.42 + (i % 4) * 0.09, ASH_Z + 0.14 + (i % 2) * 0.05);
    n.userData.phase = i * 0.58;
    n.userData.baseY = n.position.y;
    g.add(n);
    keys.push(n);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.24), wood);
  seat.position.set(ASH_X - 0.54, y + 0.26, ASH_Z - 0.2);
  seat.rotation.y = 0.18;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  leg.position.set(ASH_X - 0.54, y + 0.12, ASH_Z - 0.2);
  g.add(leg);

  const ledge = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.07, 0.28), pale);
  ledge.position.set(ASH_X - 0.42, y + 0.28, ASH_Z + 0.22);
  ledge.rotation.y = -0.12;
  g.add(ledge);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.15;
    const r = 1.16 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(ASH_X + Math.cos(a) * r, y + h * 0.45, ASH_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: ASH_X, z: ASH_Z, name: 'The Ash Ledge', keys, y };
}
