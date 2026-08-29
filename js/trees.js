import * as THREE from 'three';
import { heightAt, fbm } from './world.js';

const barkLeaf = new THREE.MeshStandardMaterial({ color: 0x5c4030, roughness: 0.92 });
const barkPine = new THREE.MeshStandardMaterial({ color: 0x4a3b30, roughness: 0.94 });
const leafMats = [
  new THREE.MeshStandardMaterial({ color: 0x2f5a28, roughness: 0.86 }),
  new THREE.MeshStandardMaterial({ color: 0x3a6b30, roughness: 0.86 }),
  new THREE.MeshStandardMaterial({ color: 0x274820, roughness: 0.88 }),
  new THREE.MeshStandardMaterial({ color: 0x456b34, roughness: 0.84 })
];
const pineMat = new THREE.MeshStandardMaterial({ color: 0x1f3d28, roughness: 0.9 });

export function makeBroadleaf(scale = 1){
  const g = new THREE.Group();
  const trunkH = (3.6 + Math.random() * 2.2) * scale;
  const trunkR = (0.15 + Math.random() * 0.09) * scale;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(trunkR * 0.62, trunkR, trunkH, 8), barkLeaf);
  trunk.position.y = trunkH * 0.5; trunk.castShadow = true; g.add(trunk);
  for (let i = 0; i < 4; i++){
    const len = (0.7 + Math.random() * 0.9) * scale;
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.035 * scale, 0.055 * scale, len, 5), barkLeaf);
    const a = (i / 4) * Math.PI * 2;
    br.position.set(Math.sin(a) * 0.18 * scale, trunkH * 0.65, Math.cos(a) * 0.18 * scale);
    br.rotation.z = Math.cos(a) * 0.8; br.rotation.x = Math.sin(a) * 0.8; g.add(br);
  }
  for (let i = 0; i < 6; i++){
    const fol = new THREE.Mesh(new THREE.SphereGeometry((0.7 + Math.random() * 0.55) * scale, 8, 6), leafMats[i % 4]);
    fol.position.set((Math.random() - 0.5) * 1.5 * scale, trunkH * 0.8 + Math.random() * 1.1 * scale, (Math.random() - 0.5) * 1.5 * scale);
    fol.castShadow = true; g.add(fol);
  }
  return g;
}
export function makePine(scale = 1){
  const g = new THREE.Group();
  const trunkH = (5.2 + Math.random() * 2.2) * scale;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * scale, 0.15 * scale, trunkH, 7), barkPine);
  trunk.position.y = trunkH * 0.5; trunk.castShadow = true; g.add(trunk);
  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const cone = new THREE.Mesh(new THREE.ConeGeometry((1.5 - t * 1.1) * scale, 1.2 * scale, 8), pineMat);
    cone.position.y = trunkH * 0.4 + i * 0.82 * scale; cone.castShadow = true; g.add(cone);
  }
  return g;
}
export function makeTree(scale = 1, kind = 'leaf'){ return kind === 'pine' ? makePine(scale) : makeBroadleaf(scale); }
export function treeKindAt(x, z){
  if (heightAt(x, z) > 11.5 || fbm(x * 0.01 + 3, z * 0.01 + 9, 3) > 0.56) return 'pine';
  return 'leaf';
}
export function addBerryBush(scene, x, y, z){
  const bush = new THREE.Group();
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6), new THREE.MeshStandardMaterial({ color: 0x2a4a24, roughness: 0.88 }));
  leaf.position.y = 0.42; bush.add(leaf);
  const berry = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 5), new THREE.MeshStandardMaterial({ color: 0x8b2040 }));
  berry.position.set(0.2, 0.5, 0.15); bush.add(berry);
  bush.position.set(x, y, z); scene.add(bush); return bush;
}
function makeLimb(len, rTop, rBot, mat){
  const wrap = new THREE.Group();
  const bone = new THREE.Mesh(new THREE.CylinderGeometry(rBot, rTop, len, 8), mat);
  bone.position.y = -len * 0.5; wrap.add(bone);
  return wrap;
}
function addHair(parent, hairM){
  const hair = new THREE.Group();
  hair.position.y = 0.8;
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), hairM);
  cap.scale.set(1.12, 0.95, 1.16);
  cap.position.set(0, 0.055, -0.018);
  hair.add(cap);
  const back = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), hairM);
  back.position.set(0, 0.0, -0.09);
  back.scale.set(1.15, 0.95, 1.0);
  hair.add(back);
  const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), hairM);
  fringe.position.set(0, 0.03, 0.11);
  fringe.scale.set(1.45, 0.42, 0.55);
  hair.add(fringe);
  for (const sx of [-0.12, 0.12]){
    const side = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), hairM);
    side.position.set(sx, -0.01, 0.02);
    side.scale.set(0.75, 1.15, 0.9);
    hair.add(side);
  }
  parent.add(hair);
}
export function makeHuman(){
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0xb88962, roughness: 0.58 });
  const shirt = new THREE.MeshStandardMaterial({ color: 0x5a6750, roughness: 0.8 });
  const pants = new THREE.MeshStandardMaterial({ color: 0x3d3832, roughness: 0.86 });
  const hairM = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.92 });
  const boot = new THREE.MeshStandardMaterial({ color: 0x2a241e, roughness: 0.9 });
  const hips = new THREE.Group(); hips.position.y = 0.94; g.add(hips);
  const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), pants);
  pelvis.scale.set(1.2, 0.52, 0.88); hips.add(pelvis);
  const lLeg = makeLimb(0.44, 0.055, 0.046, pants); lLeg.position.set(-0.075, 0, 0.015); hips.add(lLeg);
  const rLeg = makeLimb(0.44, 0.055, 0.046, pants); rLeg.position.set(0.075, 0, 0.015); hips.add(rLeg);
  const lShin = makeLimb(0.42, 0.045, 0.038, pants); lShin.position.y = -0.44; lLeg.add(lShin);
  const rShin = makeLimb(0.42, 0.045, 0.038, pants); rShin.position.y = -0.44; rLeg.add(rShin);
  const lFoot = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.045, 0.16), boot); lFoot.position.set(0, -0.44, 0.04); lShin.add(lFoot);
  rShin.add(lFoot.clone());
  const torsoG = new THREE.Group(); torsoG.position.y = 0.94; g.add(torsoG);
  const chest = new THREE.Mesh(new THREE.CapsuleGeometry(0.145, 0.36, 6, 10), shirt); chest.position.y = 0.36; torsoG.add(chest);
  const lArm = makeLimb(0.3, 0.04, 0.034, shirt); lArm.position.set(-0.195, 0.56, 0); torsoG.add(lArm);
  const rArm = makeLimb(0.3, 0.04, 0.034, skin); rArm.position.set(0.195, 0.56, 0); torsoG.add(rArm);
  const lFore = makeLimb(0.28, 0.033, 0.028, skin); lFore.position.y = -0.3; lArm.add(lFore);
  const rFore = makeLimb(0.28, 0.033, 0.028, skin); rFore.position.y = -0.3; rArm.add(rFore);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.048, 0.1, 8), skin); neck.position.y = 0.66; torsoG.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.122, 14, 12), skin); head.position.y = 0.8; head.scale.set(0.94, 1.06, 0.96); torsoG.add(head);
  addHair(torsoG, hairM);
  g.userData.legs = [lLeg, rLeg];
  g.userData.shins = [lShin, rShin];
  g.userData.arms = [lArm, rArm];
  g.userData.fores = [lFore, rFore];
  g.userData.torso = torsoG;
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}
