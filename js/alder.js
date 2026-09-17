import * as THREE from 'three';
import { heightAt } from './world.js';

export const ALDER_X = 8;
export const ALDER_Z = 38;

export function atAlderNook(x, z){
  return Math.hypot(x - ALDER_X, z - ALDER_Z) < 5.6;
}

export function makeAlderNook(scene){
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const bark = new THREE.MeshStandardMaterial({ color: 0x4a4036, roughness: 0.92 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4e6a3a, roughness: 0.88 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const catkinM = new THREE.MeshStandardMaterial({ color: 0x8a7a48, roughness: 0.78 });
  const water = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.2, transparent: true, opacity: 0.7 });
  const y = heightAt(ALDER_X, ALDER_Z);
  const g = new THREE.Group();
  g.name = 'alder-nook';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.86, 0.08, 10), moss);
  pad.position.set(ALDER_X, y + 0.02, ALDER_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const trunkH = 3.05;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, trunkH, 7), bark);
  trunk.position.set(ALDER_X + 0.48, y + trunkH * 0.5, ALDER_Z - 0.18);
  trunk.rotation.z = 0.12;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 6; i++){
    const a = i * 1.05;
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.26 + (i % 3) * 0.05, 6, 5), leaf);
    puff.position.set(
      ALDER_X + 0.38 + Math.cos(a) * 0.38,
      y + 2.55 + (i % 3) * 0.16,
      ALDER_Z - 0.22 + Math.sin(a) * 0.3
    );
    puff.castShadow = true;
    g.add(puff);
  }

  const catkins = [];
  for (let i = 0; i < 6; i++){
    const strip = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.028, 0.28, 5), catkinM);
    strip.position.set(ALDER_X + 0.22 + (i % 3) * 0.12, y + 2.15 + (i % 2) * 0.12, ALDER_Z - 0.08 + (i % 3) * 0.06);
    strip.userData.phase = i * 0.55;
    g.add(strip);
    catkins.push(strip);
  }

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.24), wood);
  seat.position.set(ALDER_X - 0.55, y + 0.26, ALDER_Z + 0.22);
  seat.rotation.y = -0.35;
  seat.castShadow = true;
  g.add(seat);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), wood);
  leg.position.set(ALDER_X - 0.55, y + 0.12, ALDER_Z + 0.22);
  g.add(leg);

  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.08, 8), pale);
  bowl.position.set(ALDER_X - 0.12, y + 0.16, ALDER_Z + 0.42);
  bowl.castShadow = true;
  g.add(bowl);
  const sip = new THREE.Mesh(new THREE.CircleGeometry(0.11, 10), water);
  sip.rotation.x = -Math.PI / 2;
  sip.position.set(ALDER_X - 0.12, y + 0.205, ALDER_Z + 0.42);
  g.add(sip);

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.4;
    const r = 1.18 + (i % 2) * 0.12;
    const h = 0.12 + (i % 3) * 0.06;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.16), i % 2 ? pale : stone);
    s.position.set(ALDER_X + Math.cos(a) * r, y + h * 0.45, ALDER_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: ALDER_X, z: ALDER_Z, name: 'The Alder Nook', catkins, y };
}
