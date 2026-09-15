import * as THREE from 'three';
import { heightAt } from './world.js';

export const RUSH_X = 24;
export const RUSH_Z = 4;

export function atRushNest(x, z){
  return Math.hypot(x - RUSH_X, z - RUSH_Z) < 5.6;
}

export function makeRushNest(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const reedM = new THREE.MeshStandardMaterial({ color: 0x4a5e32, roughness: 0.92 });
  const paleReed = new THREE.MeshStandardMaterial({ color: 0x6a7548, roughness: 0.9 });
  const tipM = new THREE.MeshStandardMaterial({ color: 0x6b5a32, roughness: 0.88 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const dish = new THREE.MeshStandardMaterial({ color: 0x5a5852, roughness: 0.55 });
  const water = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.2, transparent: true, opacity: 0.62 });
  const y = heightAt(RUSH_X, RUSH_Z);
  const g = new THREE.Group();
  g.name = 'rush-nest';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 1.9, 0.08, 10), moss);
  pad.position.set(RUSH_X, y + 0.02, RUSH_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const reeds = [];
  for (let i = 0; i < 16; i++){
    const a = i * 0.39 + 0.15;
    const r = 0.42 + (i % 5) * 0.2;
    const rx = RUSH_X + Math.cos(a) * r;
    const rz = RUSH_Z + Math.sin(a) * r;
    const h = 0.42 + (i % 4) * 0.12;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, h, 4), i % 2 ? paleReed : reedM);
    stem.position.set(rx, y + h * 0.48 + 0.04, rz);
    stem.rotation.z = Math.cos(a) * 0.08;
    stem.userData.phase = i * 0.33;
    g.add(stem);
    reeds.push(stem);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.12, 4), tipM);
    tip.position.set(rx + Math.cos(a) * 0.02, y + h * 0.95 + 0.04, rz);
    g.add(tip);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.1, 0.26), wood);
  seat.position.set(RUSH_X - 0.52, y + 0.28, RUSH_Z + 0.4);
  seat.rotation.y = 0.28;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.08), wood);
  leg.position.set(RUSH_X - 0.52, y + 0.14, RUSH_Z + 0.4);
  g.add(leg);

  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.06, 8), dish);
  bowl.position.set(RUSH_X + 0.32, y + 0.12, RUSH_Z - 0.18);
  g.add(bowl);
  const sip = new THREE.Mesh(new THREE.CircleGeometry(0.12, 8), water);
  sip.rotation.x = -Math.PI / 2;
  sip.position.set(RUSH_X + 0.32, y + 0.155, RUSH_Z - 0.18);
  g.add(sip);

  for (let i = 0; i < 6; i++){
    const a = i * 1.05 + 0.2;
    const r = 1.2 + (i % 2) * 0.14;
    const h = 0.14 + (i % 3) * 0.07;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.24, h, 0.16), i % 2 ? pale : stone);
    s.position.set(RUSH_X + Math.cos(a) * r, y + h * 0.45, RUSH_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: RUSH_X, z: RUSH_Z, name: 'The Rush Nest', reeds, y };
}
