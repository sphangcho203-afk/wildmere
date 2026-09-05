import * as THREE from 'three';
import { heightAt } from './world.js';

export const GATE_X = 24;
export const GATE_Z = 56;

export function atStillGate(x, z){
  return Math.hypot(x - GATE_X, z - GATE_Z) < 5.6;
}

export function makeStillGate(scene){
  const wood = new THREE.MeshStandardMaterial({ color: 0x5a4636, roughness: 0.92 });
  const pale = new THREE.MeshStandardMaterial({ color: 0x6e6456, roughness: 0.94, flatShading: true });
  const lichen = new THREE.MeshStandardMaterial({ color: 0x5a6248, roughness: 0.93, flatShading: true });
  const y = heightAt(GATE_X, GATE_Z);
  const g = new THREE.Group();
  g.name = 'still-gate';
  const postL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.15, 0.22), wood);
  postL.position.set(GATE_X - 1.05, y + 1.05, GATE_Z);
  postL.rotation.z = 0.04;
  postL.castShadow = true;
  const postR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.95, 0.22), wood);
  postR.position.set(GATE_X + 1.12, y + 0.92, GATE_Z + 0.08);
  postR.rotation.z = -0.06;
  postR.castShadow = true;
  g.add(postL); g.add(postR);
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.16, 0.2), wood);
  lintel.position.set(GATE_X + 0.15, y + 0.22, GATE_Z + 0.55);
  lintel.rotation.set(0.18, 0.12, 0.62);
  lintel.castShadow = true;
  g.add(lintel);
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.75, 0.07, 10), lichen);
  pad.position.set(GATE_X, y + 0.02, GATE_Z);
  pad.receiveShadow = true;
  g.add(pad);
  for (let i = 0; i < 4; i++){
    const a = i * 1.5 + 0.4;
    const r = 1.25 + (i % 2) * 0.22;
    const h = 0.18 + (i % 3) * 0.08;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.28, h, 0.2), i % 2 ? pale : wood);
    s.position.set(GATE_X + Math.cos(a) * r, y + h * 0.48, GATE_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }
  scene.add(g);
  return { x: GATE_X, z: GATE_Z, name: 'The Still Gate' };
}
