import * as THREE from 'three';
import { WATER_Y, riverDist, heightAt } from './world.js';

export function riverX(z){
  return 14 * Math.sin(z * 0.016) + 7 * Math.sin(z * 0.049 + 1.7);
}
export const SLOW_BEND_Z = 48;
export function slowBendCenter(){
  return { x: riverX(SLOW_BEND_Z), z: SLOW_BEND_Z };
}
export function atSlowBend(x, z){
  const c = slowBendCenter();
  return Math.hypot(x - c.x, z - c.z) < 16 && riverDist(x, z) < 12;
}
export function makeFish(){
  const g = new THREE.Group();
  const bodyM = new THREE.MeshStandardMaterial({ color: 0x6a7a66, roughness: 0.42 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), bodyM);
  body.scale.set(1.85, 0.5, 0.68);
  g.add(body);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 4), bodyM);
  tail.rotation.z = Math.PI / 2;
  tail.position.x = -0.2;
  g.add(tail);
  return g;
}
export function placeSlowBend(scene){
  const c = slowBendCenter();
  const stone = new THREE.MeshStandardMaterial({ color: 0x5c5852, roughness: 0.95 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  for (let i = 0; i < 3; i++){
    const side = i % 2 === 0 ? 1 : -1;
    const bx = c.x + side * (5.2 + i * 0.35);
    const bz = c.z - 2 + i * 1.6;
    const y = Math.max(heightAt(bx, bz), WATER_Y + 0.15);
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.28, 0.46), stone);
    s.position.set(bx, y + 0.08, bz);
    s.rotation.y = 0.2 * side;
    s.castShadow = true;
    scene.add(s);
  }
  const plank = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.55), wood);
  const px = c.x + 4.4, pz = c.z + 0.4;
  plank.position.set(px, WATER_Y + 0.22, pz);
  plank.rotation.y = -0.35;
  plank.receiveShadow = true;
  scene.add(plank);
  const fish = [];
  for (let i = 0; i < 5; i++){
    const f = makeFish();
    f.userData.phase = i * 1.3;
    f.userData.radius = 2.2 + i * 0.45;
    scene.add(f);
    fish.push(f);
  }
  return { x: c.x, z: c.z, fish };
}
