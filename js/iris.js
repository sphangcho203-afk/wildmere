import * as THREE from 'three';
import { heightAt } from './world.js';

export const IRIS_X = 26;
export const IRIS_Z = 34;

export function atIrisRest(x, z){
  return Math.hypot(x - IRIS_X, z - IRIS_Z) < 5.5;
}

export function makeIrisRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5c38, roughness: 0.9 });
  const bloom = new THREE.MeshStandardMaterial({ color: 0x5a7cc8, roughness: 0.65 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x3a5ca8, roughness: 0.7 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6a5240, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(IRIS_X, IRIS_Z);
  const g = new THREE.Group();
  g.name = 'iris-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(IRIS_X, y + 0.02, IRIS_Z);
  pad.receiveShadow = true;
  g.add(pad);

  for (let i = 0; i < 5; i++){
    const a = i * 1.25;
    const r = 0.62 + (i % 2) * 0.16;
    const clump = new THREE.Mesh(new THREE.SphereGeometry(0.19 + (i % 3) * 0.03, 6, 4), i % 2 ? deep : bloom);
    clump.position.set(IRIS_X + Math.cos(a) * r, y + 0.13, IRIS_Z + Math.sin(a) * r);
    clump.scale.y = 0.5;
    clump.castShadow = true;
    g.add(clump);
  }

  const blooms = [];
  for (let i = 0; i < 7; i++){
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.03, 4, 3), bloom);
    const a = i * 0.9;
    const r = 0.48 + (i % 3) * 0.13;
    b.position.set(IRIS_X + Math.cos(a) * r, y + 0.19 + (i % 2) * 0.03, IRIS_Z + Math.sin(a) * r);
    b.userData.phase = i * 0.52;
    b.userData.baseY = b.position.y;
    g.add(b);
    blooms.push(b);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.06, 0.25), wood);
  seat.position.set(IRIS_X + 0.44, y + 0.29, IRIS_Z + 0.02);
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.22, 0.046), wood);
  legL.position.set(IRIS_X + 0.25, y + 0.13, IRIS_Z);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.22, 0.046), wood);
  legR.position.set(IRIS_X + 0.63, y + 0.13, IRIS_Z);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.045, 0.11), pale);
  sill.position.set(IRIS_X - 0.1, y + 0.12, IRIS_Z - 0.36);
  g.add(sill);

  for (let i = 0; i < 4; i++){
    const a = i * 1.57 + 0.15;
    const r = 1.12;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.065, 0.08), i % 2 ? pale : stone);
    s.position.set(IRIS_X + Math.cos(a) * r, y + 0.04, IRIS_Z + Math.sin(a) * r);
    s.rotation.y = a;
    g.add(s);
  }

  scene.add(g);
  return { x: IRIS_X, z: IRIS_Z, name: 'The Iris Rest', blooms, y };
}
