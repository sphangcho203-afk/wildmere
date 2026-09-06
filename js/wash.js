import * as THREE from 'three';
import { WATER_Y, heightAt } from './world.js';

export const WASH_X = -22;
export const WASH_Z = 28;

export function atWashRock(x, z){
  return Math.hypot(x - WASH_X, z - WASH_Z) < 5.8;
}

export function makeWashRock(scene){
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const wet = new THREE.MeshStandardMaterial({ color: 0x4a5a58, roughness: 0.35, flatShading: true });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const linen = new THREE.MeshStandardMaterial({ color: 0xcfc4a8, roughness: 0.78, side: THREE.DoubleSide });
  const y = heightAt(WASH_X, WASH_Z);
  const g = new THREE.Group();
  g.name = 'wash-rock';

  const slab = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.22, 1.45), stone);
  slab.position.set(WASH_X, y + 0.12, WASH_Z);
  slab.rotation.y = 0.28;
  slab.receiveShadow = true;
  slab.castShadow = true;
  g.add(slab);

  const lip = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.72), wet);
  lip.position.set(WASH_X + 0.12, y + 0.24, WASH_Z - 0.08);
  lip.rotation.y = 0.28;
  g.add(lip);

  const paddle = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.85, 6), wood);
  handle.rotation.z = 1.12;
  handle.position.set(WASH_X - 0.55, y + 0.28, WASH_Z + 0.35);
  paddle.add(handle);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.28), wood);
  blade.position.set(WASH_X - 0.92, y + 0.22, WASH_Z + 0.42);
  blade.rotation.y = 0.4;
  paddle.add(blade);
  g.add(paddle);

  const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.22, 8, 1, true), wood);
  bucket.position.set(WASH_X + 0.85, y + 0.22, WASH_Z + 0.55);
  g.add(bucket);
  const water = new THREE.Mesh(
    new THREE.CircleGeometry(0.13, 8),
    new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.2, transparent: true, opacity: 0.7 })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(WASH_X + 0.85, y + 0.3, WASH_Z + 0.55);
  g.add(water);

  const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.35, 0.08), wood);
  post.position.set(WASH_X + 1.35, y + 0.68, WASH_Z - 0.55);
  post.castShadow = true;
  g.add(post);

  const cloths = [];
  for (let i = 0; i < 2; i++){
    const c = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.55), linen);
    c.position.set(WASH_X + 1.22 - i * 0.22, y + 0.95, WASH_Z - 0.42 + i * 0.08);
    c.rotation.y = 0.5;
    g.add(c);
    cloths.push(c);
  }

  for (let i = 0; i < 5; i++){
    const a = i * 1.15 + 0.2;
    const r = 1.55 + (i % 2) * 0.2;
    const h = 0.16 + (i % 3) * 0.07;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.26, h, 0.18), i % 2 ? pale : stone);
    s.position.set(WASH_X + Math.cos(a) * r, y + h * 0.45, WASH_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: WASH_X, z: WASH_Z, name: 'The Wash Rock', cloths };
}
