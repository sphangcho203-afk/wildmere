import * as THREE from 'three';
import { heightAt } from './world.js';

export const FOX_X = -16;
export const FOX_Z = 20;

export function atFoxgloveRest(x, z){
  return Math.hypot(x - FOX_X, z - FOX_Z) < 5.5;
}

export function makeFoxgloveRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a36, roughness: 0.9 });
  const bloom = new THREE.MeshStandardMaterial({ color: 0xb070d0, roughness: 0.55 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x8a50a8, roughness: 0.6 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(FOX_X, FOX_Z);
  const g = new THREE.Group();
  g.name = 'foxglove-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.88, 0.08, 10), moss);
  pad.position.set(FOX_X, y + 0.02, FOX_Z);
  pad.receiveShadow = true;
  g.add(pad);

  for (let i = 0; i < 4; i++){
    const a = i * 1.57;
    const r = 0.55 + (i % 2) * 0.18;
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.42, 5), deep);
    stalk.position.set(FOX_X + Math.cos(a) * r, y + 0.21, FOX_Z + Math.sin(a) * r);
    g.add(stalk);
    const clump = new THREE.Mesh(new THREE.SphereGeometry(0.07, 5, 3), bloom);
    clump.position.set(FOX_X + Math.cos(a) * r, y + 0.38, FOX_Z + Math.sin(a) * r);
    g.add(clump);
  }

  const blooms = [];
  for (let i = 0; i < 6; i++){
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.035, 4, 3), i % 2 ? deep : bloom);
    const a = i * 1.05;
    const r = 0.5 + (i % 3) * 0.12;
    b.position.set(FOX_X + Math.cos(a) * r, y + 0.2 + (i % 2) * 0.04, FOX_Z + Math.sin(a) * r);
    b.userData.phase = i * 0.48;
    b.userData.baseY = b.position.y;
    g.add(b);
    blooms.push(b);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.06, 0.26), wood);
  seat.position.set(FOX_X + 0.4, y + 0.3, FOX_Z - 0.02);
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.22, 0.046), wood);
  legL.position.set(FOX_X + 0.22, y + 0.14, FOX_Z - 0.05);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.22, 0.046), wood);
  legR.position.set(FOX_X + 0.58, y + 0.14, FOX_Z - 0.05);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.045, 0.12), pale);
  sill.position.set(FOX_X - 0.15, y + 0.12, FOX_Z + 0.32);
  g.add(sill);

  for (let i = 0; i < 3; i++){
    const a = i * 2.1 + 0.2;
    const r = 1.15;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.08), i % 2 ? pale : stone);
    s.position.set(FOX_X + Math.cos(a) * r, y + 0.04, FOX_Z + Math.sin(a) * r);
    s.rotation.y = a;
    g.add(s);
  }

  scene.add(g);
  return { x: FOX_X, z: FOX_Z, name: 'The Foxglove Rest', blooms, y };
}
