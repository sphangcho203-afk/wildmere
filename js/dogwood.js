import * as THREE from 'three';
import { heightAt } from './world.js';

export const DOG_X = 24;
export const DOG_Z = 50;

export function atDogwoodSeat(x, z){
  return Math.hypot(x - DOG_X, z - DOG_Z) < 5.5;
}

export function makeDogwoodSeat(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4c5c3a, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x5c4a3a, roughness: 0.9 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4a6238, roughness: 0.86 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x3a4e28, roughness: 0.88 });
  const bloom = new THREE.MeshStandardMaterial({ color: 0xf4efe6, roughness: 0.75 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6d5542, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6c6862, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7c786e, roughness: 0.94, flatShading: true });
  const y = heightAt(DOG_X, DOG_Z);
  const g = new THREE.Group();
  g.name = 'dogwood-seat';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.88, 0.08, 10), moss);
  pad.position.set(DOG_X, y + 0.02, DOG_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.2;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, trunkH, 7), bark);
  trunk.position.set(DOG_X - 0.1, y + trunkH * 0.5, DOG_Z + 0.06);
  trunk.rotation.z = 0.06;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 4; i++){
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.58 - i * 0.03, 6, 5), i % 2 ? deep : leaf);
    crown.position.set(DOG_X + 0.02 + (i % 2) * 0.04, y + 1.45 + i * 0.1, DOG_Z - 0.02);
    crown.scale.set(1.22, 0.48, 1.08);
    crown.castShadow = true;
    g.add(crown);
  }

  const blooms = [];
  for (let i = 0; i < 5; i++){
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.042, 5, 4), bloom);
    b.position.set(DOG_X - 0.14 + (i % 3) * 0.12, y + 1.32 + (i % 2) * 0.08, DOG_Z - 0.06 + (i % 2) * 0.09);
    b.userData.phase = i * 0.7;
    b.userData.baseY = b.position.y;
    g.add(b);
    blooms.push(b);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.07, 0.32), wood);
  seat.position.set(DOG_X + 0.5, y + 0.3, DOG_Z - 0.04);
  seat.rotation.y = 0.1;
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legL.position.set(DOG_X + 0.3, y + 0.15, DOG_Z - 0.04);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), wood);
  legR.position.set(DOG_X + 0.68, y + 0.15, DOG_Z - 0.06);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.18), pale);
  sill.position.set(DOG_X + 0.02, y + 0.16, DOG_Z - 0.4);
  sill.rotation.y = -0.08;
  g.add(sill);

  for (let i = 0; i < 4; i++){
    const a = i * 1.57 + 0.3;
    const r = 1.18 + (i % 2) * 0.05;
    const h = 0.09 + (i % 3) * 0.03;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.18, h, 0.14), i % 2 ? pale : stone);
    s.position.set(DOG_X + Math.cos(a) * r, y + h * 0.45, DOG_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: DOG_X, z: DOG_Z, name: 'The Dogwood Seat', blooms, y };
}
