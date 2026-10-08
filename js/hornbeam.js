import * as THREE from 'three';
import { heightAt } from './world.js';

export const HORNBEAM_X = -46;
export const HORNBEAM_Z = -10;

export function atHornbeamShelf(x, z){
  return Math.hypot(x - HORNBEAM_X, z - HORNBEAM_Z) < 5.5;
}

export function makeHornbeamShelf(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x6a5844, roughness: 0.92 });
  const rib = new THREE.MeshStandardMaterial({ color: 0x7a6850, roughness: 0.9 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4a6a32, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x345028, roughness: 0.88 });
  const key = new THREE.MeshStandardMaterial({ color: 0x8a7a48, roughness: 0.7 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(HORNBEAM_X, HORNBEAM_Z);
  const g = new THREE.Group();
  g.name = 'hornbeam-shelf';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.88, 0.08, 10), moss);
  pad.position.set(HORNBEAM_X, y + 0.02, HORNBEAM_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.7;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, trunkH, 8), bark);
  trunk.position.set(HORNBEAM_X - 0.12, y + trunkH * 0.5, HORNBEAM_Z + 0.04);
  trunk.rotation.z = 0.08;
  trunk.castShadow = true;
  g.add(trunk);
  for (let i = 0; i < 4; i++){
    const fl = new THREE.Mesh(new THREE.BoxGeometry(0.04, trunkH * 0.72, 0.06), rib);
    const a = i * 1.57 + 0.2;
    fl.position.set(HORNBEAM_X - 0.12 + Math.cos(a) * 0.16, y + trunkH * 0.46, HORNBEAM_Z + 0.04 + Math.sin(a) * 0.16);
    fl.rotation.y = a;
    g.add(fl);
  }

  for (let i = 0; i < 5; i++){
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.62 - i * 0.04, 7, 6), i % 2 ? deep : leaf);
    crown.position.set(HORNBEAM_X - 0.02 + (i % 2) * 0.05, y + 1.62 + i * 0.16, HORNBEAM_Z + 0.02);
    crown.scale.set(1.28, 0.58, 1.12);
    crown.castShadow = true;
    g.add(crown);
  }

  const keys = [];
  for (let i = 0; i < 7; i++){
    const n = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.09, 0.02), key);
    n.position.set(HORNBEAM_X - 0.28 + (i % 4) * 0.14, y + 1.35 + (i % 3) * 0.1, HORNBEAM_Z - 0.08 + (i % 2) * 0.1);
    n.rotation.z = 0.4;
    n.userData.phase = i * 0.62;
    n.userData.baseY = n.position.y;
    g.add(n);
    keys.push(n);
  }

  const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.06, 0.28), wood);
  shelf.position.set(HORNBEAM_X + 0.52, y + 0.42, HORNBEAM_Z - 0.08);
  shelf.rotation.y = 0.12;
  shelf.castShadow = true;
  g.add(shelf);
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.08), wood);
  post.position.set(HORNBEAM_X + 0.52, y + 0.2, HORNBEAM_Z - 0.08);
  g.add(post);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.06, 0.2), pale);
  sill.position.set(HORNBEAM_X + 0.08, y + 0.2, HORNBEAM_Z - 0.4);
  sill.rotation.y = -0.1;
  g.add(sill);

  for (let i = 0; i < 5; i++){
    const a = i * 1.22 + 0.4;
    const r = 1.16 + (i % 2) * 0.08;
    const h = 0.1 + (i % 3) * 0.05;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.2, h, 0.15), i % 2 ? pale : stone);
    s.position.set(HORNBEAM_X + Math.cos(a) * r, y + h * 0.45, HORNBEAM_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: HORNBEAM_X, z: HORNBEAM_Z, name: 'The Hornbeam Shelf', keys, y };
}
