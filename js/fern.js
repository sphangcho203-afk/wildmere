import * as THREE from 'three';
import { heightAt } from './world.js';

export const FERN_X = -28;
export const FERN_Z = -36;

export function atFernLean(x, z){
  return Math.hypot(x - FERN_X, z - FERN_Z) < 5.6;
}

export function makeFernLean(scene){
  const wood = new THREE.MeshStandardMaterial({ color: 0x5a4636, roughness: 0.92 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x4a3b30, roughness: 0.94 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const fernM = new THREE.MeshStandardMaterial({ color: 0x3a5a30, roughness: 0.88, side: THREE.DoubleSide });
  const tipM = new THREE.MeshStandardMaterial({ color: 0x2a4a24, roughness: 0.86, side: THREE.DoubleSide });
  const y = heightAt(FERN_X, FERN_Z);
  const g = new THREE.Group();
  g.name = 'fern-lean';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.9, 0.07, 10), moss);
  pad.position.set(FERN_X, y + 0.02, FERN_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.55, 9), dark);
  stump.position.set(FERN_X - 0.95, y + 0.28, FERN_Z + 0.15);
  stump.castShadow = true;
  g.add(stump);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 6, 10), wood);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(FERN_X - 0.95, y + 0.56, FERN_Z + 0.15);
  g.add(ring);

  const lean = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 2.85, 8), wood);
  lean.position.set(FERN_X + 0.35, y + 0.62, FERN_Z - 0.08);
  lean.rotation.z = 1.12;
  lean.rotation.y = 0.18;
  lean.castShadow = true;
  g.add(lean);

  const prop = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.38, 0.26), stone);
  prop.position.set(FERN_X + 1.15, y + 0.22, FERN_Z - 0.22);
  prop.rotation.y = 0.4;
  prop.castShadow = true;
  g.add(prop);

  const sit = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.38), pale);
  sit.position.set(FERN_X + 0.15, y + 0.14, FERN_Z + 0.85);
  sit.rotation.y = -0.25;
  sit.castShadow = true;
  g.add(sit);

  for (let i = 0; i < 4; i++){
    const a = i * 1.4 + 0.5;
    const r = 1.25 + (i % 2) * 0.22;
    const h = 0.16 + (i % 3) * 0.07;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.26, h, 0.18), i % 2 ? pale : stone);
    s.position.set(FERN_X + Math.cos(a) * r, y + h * 0.45, FERN_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  const fronds = [];
  for (let i = 0; i < 14; i++){
    const a = i * 0.45 + 0.2;
    const r = 0.85 + (i % 5) * 0.22;
    const hx = FERN_X + Math.cos(a) * r;
    const hz = FERN_Z + Math.sin(a) * r;
    const stemH = 0.42 + (i % 4) * 0.1;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, stemH, 4), fernM);
    stem.position.set(hx, y + stemH * 0.45, hz);
    stem.rotation.z = Math.cos(a) * 0.12;
    g.add(stem);
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.38), i % 2 ? fernM : tipM);
    leaf.position.set(hx + Math.cos(a) * 0.08, y + stemH * 0.85, hz + Math.sin(a) * 0.08);
    leaf.rotation.y = a;
    leaf.rotation.x = -0.35;
    g.add(leaf);
    fronds.push(leaf);
  }

  scene.add(g);
  return { x: FERN_X, z: FERN_Z, name: 'The Fern Lean', fronds };
}
