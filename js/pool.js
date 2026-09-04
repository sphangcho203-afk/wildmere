import * as THREE from 'three';
import { heightAt } from './world.js';

export const POOL_X = 38;
export const POOL_Z = 54;

export function atShadePool(x, z){
  return Math.hypot(x - POOL_X, z - POOL_Z) < 5.6;
}

export function makeShadePool(scene){
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a4638, roughness: 0.92 });
  const leafM = new THREE.MeshStandardMaterial({ color: 0x3d5a2e, roughness: 0.88, side: THREE.DoubleSide });
  const water = new THREE.MeshStandardMaterial({ color: 0x3a6a72, roughness: 0.18, transparent: true, opacity: 0.74 });
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const y = heightAt(POOL_X, POOL_Z);
  const g = new THREE.Group();
  g.name = 'shade-pool';
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 2.15, 0.28, 12), stone);
  basin.position.set(POOL_X, y + 0.02, POOL_Z);
  basin.receiveShadow = true;
  g.add(basin);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(1.55, 16), water);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(POOL_X, y + 0.16, POOL_Z);
  g.add(pool);
  for (let i = 0; i < 8; i++){
    const a = i * 0.79;
    const r = 1.7 + (i % 3) * 0.12;
    const h = 0.22 + (i % 4) * 0.1;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.38, h, 0.24), i % 2 ? pale : stone);
    s.position.set(POOL_X + Math.cos(a) * r, y + h * 0.45, POOL_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 0.06, 8), moss);
  pad.position.set(POOL_X + 1.85, y + 0.03, POOL_Z + 0.4);
  pad.receiveShadow = true;
  g.add(pad);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 4.2, 7), bark);
  trunk.position.set(POOL_X + 2.05, y + 1.9, POOL_Z - 0.35);
  trunk.rotation.z = 0.22;
  trunk.rotation.x = -0.08;
  trunk.castShadow = true;
  g.add(trunk);
  const leaves = [];
  for (let i = 0; i < 7; i++){
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.55 + (i % 3) * 0.12, 0.85), leafM);
    const a = -0.4 + i * 0.28;
    leaf.position.set(POOL_X + 1.15 + Math.cos(a) * 0.55, y + 3.35 - (i % 3) * 0.18, POOL_Z - 0.2 + Math.sin(a) * 0.4);
    leaf.rotation.y = a;
    leaf.rotation.x = 0.2;
    g.add(leaf);
    leaves.push(leaf);
  }
  scene.add(g);
  return { x: POOL_X, z: POOL_Z, name: 'The Shade Pool', leaves };
}
