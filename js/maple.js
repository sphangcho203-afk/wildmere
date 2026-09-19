import * as THREE from 'three';
import { heightAt } from './world.js';

export const MAPLE_X = 18;
export const MAPLE_Z = 18;

export function atMapleSill(x, z){
  return Math.hypot(x - MAPLE_X, z - MAPLE_Z) < 5.6;
}

export function makeMapleSill(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a3e2c, roughness: 0.92 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0xb45a2a, roughness: 0.86 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xc47a32, roughness: 0.84 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const seedM = new THREE.MeshStandardMaterial({ color: 0x8a6a38, roughness: 0.78, side: THREE.DoubleSide });
  const y = heightAt(MAPLE_X, MAPLE_Z);
  const g = new THREE.Group();
  g.name = 'maple-sill';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(MAPLE_X, y + 0.02, MAPLE_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.15;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, trunkH, 7), bark);
  trunk.position.set(MAPLE_X + 0.38, y + trunkH * 0.5, MAPLE_Z - 0.2);
  trunk.rotation.z = -0.08;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 8; i++){
    const a = i * 0.78;
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.26 + (i % 3) * 0.05, 6, 5), i % 2 ? gold : leaf);
    puff.position.set(
      MAPLE_X + 0.28 + Math.cos(a) * 0.4,
      y + 2.55 + (i % 3) * 0.16,
      MAPLE_Z - 0.22 + Math.sin(a) * 0.32
    );
    puff.castShadow = true;
    g.add(puff);
  }

  const seeds = [];
  for (let i = 0; i < 7; i++){
    const wing = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.05), seedM);
    wing.position.set(MAPLE_X + 0.12 + (i % 3) * 0.1, y + 2.05 + (i % 4) * 0.08, MAPLE_Z - 0.04 + (i % 3) * 0.06);
    wing.rotation.z = 0.4 + i * 0.12;
    wing.userData.phase = i * 0.55;
    wing.userData.baseY = wing.position.y;
    g.add(wing);
    seeds.push(wing);
  }

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.28), pale);
  sill.position.set(MAPLE_X - 0.48, y + 0.24, MAPLE_Z + 0.22);
  sill.rotation.y = 0.22;
  sill.castShadow = true;
  g.add(sill);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), stone);
  leg.position.set(MAPLE_X - 0.48, y + 0.12, MAPLE_Z + 0.22);
  g.add(leg);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.24), wood);
  seat.position.set(MAPLE_X - 0.58, y + 0.26, MAPLE_Z - 0.28);
  seat.rotation.y = -0.3;
  seat.castShadow = true;
  g.add(seat);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.4;
    const r = 1.16 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(MAPLE_X + Math.cos(a) * r, y + h * 0.45, MAPLE_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: MAPLE_X, z: MAPLE_Z, name: 'The Maple Sill', seeds, y };
}
