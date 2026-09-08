import * as THREE from 'three';
import { heightAt } from './world.js';

export const BELL_X = -28;
export const BELL_Z = -44;

export function atEveningBell(x, z){
  return Math.hypot(x - BELL_X, z - BELL_Z) < 5.6;
}

export function makeEveningBell(scene){
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x4a3b30, roughness: 0.94 });
  const bronze = new THREE.MeshStandardMaterial({ color: 0x8a6a3a, roughness: 0.42, metalness: 0.35 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95, flatShading: true });
  const pale = new THREE.MeshStandardMaterial({ color: 0x7a766c, roughness: 0.94, flatShading: true });
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const y = heightAt(BELL_X, BELL_Z);
  const g = new THREE.Group();
  g.name = 'evening-bell';

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.72, 0.07, 10), moss);
  pad.position.set(BELL_X, y + 0.02, BELL_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const postL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.05, 0.1), wood);
  postL.position.set(BELL_X - 0.55, y + 1.02, BELL_Z);
  postL.rotation.z = 0.03;
  postL.castShadow = true;
  const postR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.0, 0.1), wood);
  postR.position.set(BELL_X + 0.55, y + 0.98, BELL_Z + 0.04);
  postR.rotation.z = -0.025;
  postR.castShadow = true;
  g.add(postL); g.add(postR);

  const beam = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.08, 0.08), dark);
  beam.position.set(BELL_X, y + 2.08, BELL_Z);
  beam.castShadow = true;
  g.add(beam);

  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 5), dark);
  cord.position.set(BELL_X, y + 1.82, BELL_Z);
  g.add(cord);

  const bell = new THREE.Group();
  bell.name = 'evening-bell-body';
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.28, 10, 1, true), bronze);
  body.position.y = -0.14;
  bell.add(body);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 6, 12), bronze);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.28;
  bell.add(rim);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), bronze);
  cap.scale.y = 0.55;
  cap.position.y = 0.02;
  bell.add(cap);
  const clapper = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), dark);
  clapper.position.y = -0.22;
  bell.add(clapper);
  bell.position.set(BELL_X, y + 1.62, BELL_Z);
  g.add(bell);

  const bench = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.07, 0.28), wood);
  bench.position.set(BELL_X + 1.15, y + 0.34, BELL_Z + 0.35);
  bench.rotation.y = 0.35;
  bench.castShadow = true;
  g.add(bench);
  for (const sx of [-0.32, 0.32]){
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.06), wood);
    leg.position.set(BELL_X + 1.15 + Math.cos(0.35) * sx, y + 0.16, BELL_Z + 0.35 + Math.sin(0.35) * sx);
    g.add(leg);
  }

  for (let i = 0; i < 5; i++){
    const a = i * 1.2 + 0.25;
    const r = 1.2 + (i % 2) * 0.18;
    const h = 0.16 + (i % 3) * 0.07;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.26, h, 0.18), i % 2 ? pale : stone);
    s.position.set(BELL_X + Math.cos(a) * r, y + h * 0.45, BELL_Z + Math.sin(a) * r);
    s.rotation.y = a;
    s.castShadow = true;
    g.add(s);
  }

  scene.add(g);
  return { x: BELL_X, z: BELL_Z, name: 'The Evening Bell', bell };
}
