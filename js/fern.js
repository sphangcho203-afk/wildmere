import * as THREE from 'three';
import { heightAt } from './world.js';

export const FERN_X = 52;
export const FERN_Z = 38;

export function atFernStair(x, z){
  return Math.hypot(x - FERN_X, z - FERN_Z) < 5.6;
}

export function makeFernStair(scene){
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const frond = new THREE.MeshStandardMaterial({ color: 0x3a5a28, roughness: 0.88, side: THREE.DoubleSide });
  const stemM = new THREE.MeshStandardMaterial({ color: 0x2e4a22, roughness: 0.9 });
  const y = heightAt(FERN_X, FERN_Z);
  const g = new THREE.Group();
  g.name = 'fern-stair';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.72, 0.07, 10), moss);
  pad.position.set(FERN_X, y + 0.02, FERN_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const steps = [];
  for (let i = 0; i < 3; i++){
    const w = 1.15 - i * 0.08;
    const d = 0.42;
    const h = 0.14;
    const s = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), i % 2 ? pale : stone);
    s.position.set(FERN_X + i * 0.08, y + 0.08 + i * 0.13, FERN_Z - 0.35 + i * 0.38);
    s.rotation.y = 0.12;
    s.castShadow = true;
    s.receiveShadow = true;
    g.add(s);
    steps.push(s);
  }

  const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.55, 0.06), stone);
  rail.position.set(FERN_X - 0.62, y + 0.38, FERN_Z + 0.15);
  rail.rotation.z = 0.08;
  rail.castShadow = true;
  g.add(rail);

  const ferns = [];
  for (let i = 0; i < 9; i++){
    const side = i < 5 ? -1 : 1;
    const a = (i % 5) * 0.35 - 0.6;
    const r = 0.95 + (i % 3) * 0.18;
    const fx = FERN_X + side * (1.15 + (i % 3) * 0.12) + Math.sin(a) * 0.2;
    const fz = FERN_Z + Math.cos(a) * 0.85;
    const h = 0.42 + (i % 4) * 0.1;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, h, 4), stemM);
    stem.position.set(fx, y + h * 0.48, fz);
    stem.rotation.z = side * 0.12;
    g.add(stem);
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.38), frond);
    leaf.position.set(fx + side * 0.08, y + h * 0.72, fz);
    leaf.rotation.z = side * 0.35;
    leaf.rotation.y = side * 0.4;
    g.add(leaf);
    ferns.push(leaf);
  }

  for (let i = 0; i < 4; i++){
    const a = i * 1.5 + 0.4;
    const r = 1.35 + (i % 2) * 0.16;
    const h = 0.16 + (i % 3) * 0.07;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.26, h, 0.18), i % 2 ? pale : stone);
    s.position.set(FERN_X + Math.cos(a) * r, y + h * 0.45, FERN_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: FERN_X, z: FERN_Z, name: 'The Fern Stair', ferns };
}
