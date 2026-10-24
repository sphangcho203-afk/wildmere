import * as THREE from 'three';
import { heightAt } from './world.js';

export const CYPRESS_REST_X = 28;
export const CYPRESS_REST_Z = 42;

export function atCypressRest(x, z){
  return Math.hypot(x - CYPRESS_REST_X, z - CYPRESS_REST_Z) < 5.5;
}

export function makeCypressRest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5c38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x4a3a30, roughness: 0.92 });
  const needle = new THREE.MeshStandardMaterial({ color: 0x3a5a32, roughness: 0.85 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x2a4a28, roughness: 0.88 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6a5240, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const y = heightAt(CYPRESS_REST_X, CYPRESS_REST_Z);
  const g = new THREE.Group();
  g.name = 'cypress-rest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.88, 0.08, 10), moss);
  pad.position.set(CYPRESS_REST_X, y + 0.02, CYPRESS_REST_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 2.85;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, trunkH, 7), bark);
  trunk.position.set(CYPRESS_REST_X - 0.03, y + trunkH * 0.5, CYPRESS_REST_Z + 0.01);
  trunk.rotation.z = -0.06;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 4; i++){
    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.72 - i * 0.12, 0.82, 6), i % 2 ? deep : needle);
    crown.position.set(CYPRESS_REST_X + 0.01, y + 1.6 + i * 0.32, CYPRESS_REST_Z - 0.01);
    crown.castShadow = true;
    g.add(crown);
  }

  const needles = [];
  for (let i = 0; i < 6; i++){
    const n = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.12, 4), needle);
    n.position.set(CYPRESS_REST_X - 0.12 + (i % 3) * 0.09, y + 1.55 + (i % 2) * 0.06, CYPRESS_REST_Z - 0.04 + (i % 2) * 0.07);
    n.rotation.z = 0.25 + (i % 3) * 0.15;
    n.userData.phase = i * 0.55;
    n.userData.baseY = n.position.y;
    g.add(n);
    needles.push(n);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.63, 0.07, 0.27), wood);
  seat.position.set(CYPRESS_REST_X + 0.48, y + 0.3, CYPRESS_REST_Z + 0.01);
  seat.rotation.y = -0.01;
  seat.castShadow = true;
  g.add(seat);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.26, 0.056), wood);
  legL.position.set(CYPRESS_REST_X + 0.28, y + 0.15, CYPRESS_REST_Z + 0.01);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.26, 0.056), wood);
  legR.position.set(CYPRESS_REST_X + 0.66, y + 0.15, CYPRESS_REST_Z);
  g.add(legR);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.056, 0.14), pale);
  sill.position.set(CYPRESS_REST_X + 0.01, y + 0.16, CYPRESS_REST_Z - 0.41);
  sill.rotation.y = 0.02;
  g.add(sill);

  for (let i = 0; i < 4; i++){
    const a = i * 1.57 + 0.16;
    const r = 1.13 + (i % 2) * 0.04;
    const h = 0.08 + (i % 3) * 0.02;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.13, h, 0.1), i % 2 ? pale : stone);
    s.position.set(CYPRESS_REST_X + Math.cos(a) * r, y + h * 0.45, CYPRESS_REST_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: CYPRESS_REST_X, z: CYPRESS_REST_Z, name: 'The Cypress Rest', needles, y };
}
