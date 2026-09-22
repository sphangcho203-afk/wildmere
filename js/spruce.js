import * as THREE from 'three';
import { heightAt } from './world.js';

export const SPRUCE_X = 4;
export const SPRUCE_Z = 38;

export function atSpruceCup(x, z){
  return Math.hypot(x - SPRUCE_X, z - SPRUCE_Z) < 5.6;
}

export function makeSpruceCup(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x3e3228, roughness: 0.94 });
  const needle = new THREE.MeshStandardMaterial({ color: 0x234632, roughness: 0.9 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x163226, roughness: 0.92 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const water = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.22, transparent: true, opacity: 0.7 });
  const y = heightAt(SPRUCE_X, SPRUCE_Z);
  const g = new THREE.Group();
  g.name = 'spruce-cup';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(SPRUCE_X, y + 0.02, SPRUCE_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.55;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.13, trunkH, 7), bark);
  trunk.position.set(SPRUCE_X + 0.36, y + trunkH * 0.5, SPRUCE_Z - 0.12);
  trunk.rotation.z = 0.06;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 6; i++){
    const t = i / 5;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.68 - t * 0.38, 0.7, 7), i % 2 ? deep : needle);
    cone.position.set(SPRUCE_X + 0.4, y + 1.7 + i * 0.34, SPRUCE_Z - 0.14);
    cone.castShadow = true;
    g.add(cone);
  }

  const needles = [];
  for (let i = 0; i < 7; i++){
    const n = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.11, 4), i % 2 ? needle : deep);
    n.position.set(SPRUCE_X + 0.08 + (i % 3) * 0.07, y + 1.42 + (i % 4) * 0.1, SPRUCE_Z + 0.08 + (i % 2) * 0.05);
    n.rotation.z = 0.5 + i * 0.18;
    n.userData.phase = i * 0.65;
    n.userData.baseY = n.position.y;
    g.add(n);
    needles.push(n);
  }

  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.09, 10, 1, true), wood);
  cup.position.set(SPRUCE_X - 0.52, y + 0.28, SPRUCE_Z + 0.16);
  g.add(cup);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(0.1, 10), water);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(SPRUCE_X - 0.52, y + 0.3, SPRUCE_Z + 0.16);
  g.add(pool);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.22), wood);
  seat.position.set(SPRUCE_X - 0.55, y + 0.26, SPRUCE_Z - 0.24);
  seat.rotation.y = 0.18;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  leg.position.set(SPRUCE_X - 0.55, y + 0.12, SPRUCE_Z - 0.24);
  g.add(leg);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.2;
    const r = 1.16 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(SPRUCE_X + Math.cos(a) * r, y + h * 0.45, SPRUCE_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: SPRUCE_X, z: SPRUCE_Z, name: 'The Spruce Cup', needles, y };
}
