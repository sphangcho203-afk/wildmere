import * as THREE from 'three';
import { heightAt } from './world.js';

export const YEW_X = -28;
export const YEW_Z = -8;

export function atYewSill(x, z){
  return Math.hypot(x - YEW_X, z - YEW_Z) < 5.6;
}

export function makeYewSill(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x3a3228, roughness: 0.94 });
  const needle = new THREE.MeshStandardMaterial({ color: 0x1e3a28, roughness: 0.9 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x14281c, roughness: 0.92 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const berryM = new THREE.MeshStandardMaterial({ color: 0x8a3a32, roughness: 0.7 });
  const y = heightAt(YEW_X, YEW_Z);
  const g = new THREE.Group();
  g.name = 'yew-sill';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(YEW_X, y + 0.02, YEW_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.2;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.15, trunkH, 7), bark);
  trunk.position.set(YEW_X + 0.38, y + trunkH * 0.5, YEW_Z - 0.14);
  trunk.rotation.z = 0.08;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.72 - t * 0.36, 0.68, 7), i % 2 ? deep : needle);
    cone.position.set(YEW_X + 0.42, y + 1.65 + i * 0.36, YEW_Z - 0.16);
    cone.castShadow = true;
    g.add(cone);
  }

  const berries = [];
  for (let i = 0; i < 7; i++){
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.028, 6, 5), berryM);
    b.position.set(YEW_X + 0.12 + (i % 3) * 0.08, y + 1.48 + (i % 4) * 0.1, YEW_Z + 0.06 + (i % 2) * 0.05);
    b.userData.phase = i * 0.7;
    b.userData.baseY = b.position.y;
    g.add(b);
    berries.push(b);
  }

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.07, 0.22), pale);
  sill.position.set(YEW_X - 0.48, y + 0.3, YEW_Z + 0.12);
  sill.rotation.y = 0.16;
  sill.castShadow = true;
  g.add(sill);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.22), wood);
  seat.position.set(YEW_X - 0.52, y + 0.26, YEW_Z - 0.26);
  seat.rotation.y = 0.2;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  leg.position.set(YEW_X - 0.52, y + 0.12, YEW_Z - 0.26);
  g.add(leg);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.15;
    const r = 1.16 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(YEW_X + Math.cos(a) * r, y + h * 0.45, YEW_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: YEW_X, z: YEW_Z, name: 'The Yew Sill', berries, y };
}
