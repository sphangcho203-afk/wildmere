import * as THREE from 'three';
import { heightAt } from './world.js';

export const OAK_X = 78;
export const OAK_Z = 22;

export function atSplitOak(x, z){
  return Math.hypot(x - OAK_X, z - OAK_Z) < 6.2;
}

export function makeSplitOak(scene){
  const bark = new THREE.MeshStandardMaterial({ color: 0x5c4030, roughness: 0.93 });
  const darkBark = new THREE.MeshStandardMaterial({ color: 0x4a3428, roughness: 0.94 });
  const leafA = new THREE.MeshStandardMaterial({ color: 0x2f5a28, roughness: 0.86 });
  const leafB = new THREE.MeshStandardMaterial({ color: 0x3a6b30, roughness: 0.86 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const moss = new THREE.MeshStandardMaterial({ color: 0x4a5a38, roughness: 0.9 });
  const y = heightAt(OAK_X, OAK_Z);
  const g = new THREE.Group();
  g.name = 'split-oak';

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.48, 1.05, 10), darkBark);
  base.position.set(OAK_X, y + 0.52, OAK_Z);
  base.castShadow = true;
  g.add(base);

  const left = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.28, 5.4, 8), bark);
  left.position.set(OAK_X - 0.55, y + 3.4, OAK_Z + 0.08);
  left.rotation.z = 0.28;
  left.castShadow = true;
  g.add(left);

  const right = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 5.1, 8), bark);
  right.position.set(OAK_X + 0.62, y + 3.25, OAK_Z - 0.1);
  right.rotation.z = -0.32;
  right.castShadow = true;
  g.add(right);

  const leaves = [];
  const mats = [leafA, leafB];
  const crowns = [
    [-1.55, 6.15, 0.15, 1.15],
    [-2.1, 5.55, 0.45, 0.95],
    [1.7, 5.95, -0.2, 1.08],
    [2.15, 5.35, 0.35, 0.88],
    [0.15, 6.45, -0.55, 0.92],
    [-0.35, 5.85, 0.85, 0.78]
  ];
  for (let i = 0; i < crowns.length; i++){
    const c = crowns[i];
    const fol = new THREE.Mesh(new THREE.SphereGeometry(c[3], 8, 6), mats[i % 2]);
    fol.position.set(OAK_X + c[0], y + c[1], OAK_Z + c[2]);
    fol.castShadow = true;
    g.add(fol);
    leaves.push(fol);
  }

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 2.05, 0.07, 10), moss);
  pad.position.set(OAK_X, y + 0.02, OAK_Z);
  pad.receiveShadow = true;
  g.add(pad);

  const bench = new THREE.Group();
  const plank = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.06, 0.32), wood);
  plank.position.set(OAK_X + 1.55, y + 0.38, OAK_Z + 0.85);
  plank.rotation.y = 0.4;
  plank.castShadow = true;
  bench.add(plank);
  for (const sx of [-0.42, 0.42]){
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.34, 0.07), wood);
    leg.position.set(OAK_X + 1.55 + Math.cos(0.4) * sx, y + 0.18, OAK_Z + 0.85 + Math.sin(0.4) * sx);
    bench.add(leg);
  }
  g.add(bench);

  scene.add(g);
  return { x: OAK_X, z: OAK_Z, name: 'The Split Oak', leaves };
}
