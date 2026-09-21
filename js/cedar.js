import * as THREE from 'three';
import { heightAt } from './world.js';

export const CEDAR_X = -6;
export const CEDAR_Z = 20;

export function atCedarBowl(x, z){
  return Math.hypot(x - CEDAR_X, z - CEDAR_Z) < 5.6;
}

export function makeCedarBowl(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x4a382c, roughness: 0.94 });
  const needle = new THREE.MeshStandardMaterial({ color: 0x2a4a32, roughness: 0.9 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x1c3a26, roughness: 0.92 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const water = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.22, transparent: true, opacity: 0.7 });
  const coneM = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.88 });
  const y = heightAt(CEDAR_X, CEDAR_Z);
  const g = new THREE.Group();
  g.name = 'cedar-bowl';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(CEDAR_X, y + 0.02, CEDAR_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.35;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, trunkH, 7), bark);
  trunk.position.set(CEDAR_X + 0.4, y + trunkH * 0.5, CEDAR_Z - 0.16);
  trunk.rotation.z = -0.07;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.62 - t * 0.32, 0.72, 7), i % 2 ? deep : needle);
    cone.position.set(CEDAR_X + 0.34, y + 1.85 + i * 0.38, CEDAR_Z - 0.18);
    cone.castShadow = true;
    g.add(cone);
  }

  const cones = [];
  for (let i = 0; i < 6; i++){
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 5), coneM);
    c.position.set(CEDAR_X + 0.18 + (i % 3) * 0.08, y + 1.55 + (i % 3) * 0.12, CEDAR_Z + 0.02 + (i % 2) * 0.06);
    c.rotation.z = 0.4 + i * 0.2;
    c.userData.phase = i * 0.7;
    c.userData.baseY = c.position.y;
    g.add(c);
    cones.push(c);
  }

  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.1, 10, 1, true), stone);
  bowl.position.set(CEDAR_X - 0.48, y + 0.28, CEDAR_Z + 0.18);
  g.add(bowl);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(0.13, 10), water);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(CEDAR_X - 0.48, y + 0.3, CEDAR_Z + 0.18);
  g.add(pool);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.24), wood);
  seat.position.set(CEDAR_X - 0.58, y + 0.26, CEDAR_Z - 0.22);
  seat.rotation.y = -0.22;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  leg.position.set(CEDAR_X - 0.58, y + 0.12, CEDAR_Z - 0.22);
  g.add(leg);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.3;
    const r = 1.16 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(CEDAR_X + Math.cos(a) * r, y + h * 0.45, CEDAR_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: CEDAR_X, z: CEDAR_Z, name: 'The Cedar Bowl', cones, y };
}
