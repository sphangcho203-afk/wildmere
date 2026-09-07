import * as THREE from 'three';
import { heightAt } from './world.js';

export const LARK_X = -8;
export const LARK_Z = -48;

export function atLarkPost(x, z){
  return Math.hypot(x - LARK_X, z - LARK_Z) < 5.4;
}

export function makeLarkPost(scene){
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x4a3b30, roughness: 0.94 });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const y = heightAt(LARK_X, LARK_Z);
  const g = new THREE.Group();
  g.name = 'lark-post';

  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.08, 2.35, 8), dark);
  post.position.set(LARK_X, y + 1.18, LARK_Z);
  post.rotation.z = 0.05;
  post.castShadow = true;
  g.add(post);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.05, 0.05), wood);
  arm.position.set(LARK_X + 0.28, y + 2.12, LARK_Z);
  arm.rotation.z = -0.08;
  g.add(arm);

  const slats = [];
  for (let i = 0; i < 3; i++){
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.34, 0.02), wood);
    slat.position.set(LARK_X + 0.08 + i * 0.16, y + 1.86, LARK_Z + 0.02);
    slat.castShadow = true;
    g.add(slat);
    slats.push(slat);
  }

  const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.38, 10), wood);
  stump.position.set(LARK_X + 1.05, y + 0.2, LARK_Z + 0.35);
  stump.castShadow = true;
  g.add(stump);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 6, 10), dark);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(LARK_X + 1.05, y + 0.4, LARK_Z + 0.35);
  g.add(ring);

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.6, 0.07, 10), moss);
  pad.position.set(LARK_X, y + 0.02, LARK_Z);
  pad.receiveShadow = true;
  g.add(pad);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.3;
    const r = 1.15 + (i % 2) * 0.2;
    const h = 0.16 + (i % 3) * 0.07;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.26, h, 0.18), i % 2 ? pale : stone);
    s.position.set(LARK_X + Math.cos(a) * r, y + h * 0.45, LARK_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: LARK_X, z: LARK_Z, name: 'The Lark Post', slats };
}
