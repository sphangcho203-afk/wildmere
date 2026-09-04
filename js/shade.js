import * as THREE from 'three';
import { heightAt } from './world.js';

export const POOL_X = 24;
export const POOL_Z = 56;

export function atShadePool(x, z){
  return Math.hypot(x - POOL_X, z - POOL_Z) < 5.6;
}

export function makeShadePool(scene){
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const water = new THREE.MeshStandardMaterial({ color: 0x3a6874, roughness: 0.18, transparent: true, opacity: 0.78 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x5a4636, roughness: 0.92 });
  const reedM = new THREE.MeshStandardMaterial({ color: 0x4a5e32, roughness: 0.92 });
  const y = heightAt(POOL_X, POOL_Z);
  const g = new THREE.Group();
  g.name = 'shade-pool';
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.35, 0.16, 12), moss);
  rim.position.set(POOL_X, y + 0.02, POOL_Z);
  rim.receiveShadow = true;
  g.add(rim);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(1.55, 16), water);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(POOL_X, y + 0.07, POOL_Z);
  g.add(pool);
  const lily = new THREE.Mesh(new THREE.CircleGeometry(0.16, 8), moss);
  lily.rotation.x = -Math.PI / 2;
  lily.position.set(POOL_X + 0.45, y + 0.09, POOL_Z - 0.3);
  g.add(lily);
  for (let i = 0; i < 7; i++){
    const a = i * 0.9 + 0.2;
    const r = 1.85 + (i % 3) * 0.18;
    const h = 0.18 + (i % 3) * 0.08;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.38, h, 0.26), i % 2 ? pale : stone);
    s.position.set(POOL_X + Math.cos(a) * r, y + h * 0.48, POOL_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }
  const log = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 2.4, 8), wood);
  log.rotation.z = Math.PI / 2;
  log.rotation.y = 0.35;
  log.position.set(POOL_X - 1.15, y + 0.16, POOL_Z + 0.85);
  log.castShadow = true;
  g.add(log);
  const reeds = [];
  for (let i = 0; i < 10; i++){
    const a = 2.2 + i * 0.22;
    const r = 2.1 + (i % 4) * 0.12;
    const h = 0.7 + (i % 3) * 0.16;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.024, h, 4), reedM);
    stem.position.set(POOL_X + Math.cos(a) * r, y + h * 0.45, POOL_Z + Math.sin(a) * r);
    g.add(stem);
    reeds.push(stem);
  }
  scene.add(g);
  return { x: POOL_X, z: POOL_Z, name: 'The Shade Pool', reeds };
}
