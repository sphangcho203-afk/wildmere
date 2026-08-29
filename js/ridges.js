import * as THREE from 'three';
function hash2(ix, iy){
  const SEED = 2041;
  let n = (ix * 374761393 + iy * 668265263 + SEED * 13) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
export function addDistantRidges(scene){
  const nearMat = new THREE.MeshStandardMaterial({ color: 0x5c6e48, roughness: 0.96, flatShading: true });
  const midMat = new THREE.MeshStandardMaterial({ color: 0x62725a, roughness: 0.97, flatShading: true });
  const farMat = new THREE.MeshStandardMaterial({ color: 0x6a7a70, roughness: 0.98, flatShading: true });
  const group = new THREE.Group();
  group.name = 'distant-ridges';
  for (let i = 0; i < 28; i++){
    const a = (i / 28) * Math.PI * 2 + hash2(i, 3) * 0.4;
    const r = 255 + hash2(i, 7) * 55;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const baseH = 14 + hash2(i, 11) * 22;
    const w = 28 + hash2(i, 13) * 36;
    const ridge = new THREE.Mesh(new THREE.ConeGeometry(w * 0.55, baseH, 5 + (i % 3)), nearMat);
    ridge.position.set(x, baseH * 0.28, z);
    ridge.rotation.y = a + hash2(i, 17) * 1.2;
    ridge.scale.set(1 + hash2(i, 19) * 0.6, 1, 0.55 + hash2(i, 23) * 0.5);
    group.add(ridge);
    if (hash2(i, 29) > 0.45){
      const h2 = baseH * (0.45 + hash2(i, 31) * 0.35);
      const side = new THREE.Mesh(new THREE.ConeGeometry(w * 0.28, h2, 5), nearMat);
      const off = 18 + hash2(i, 37) * 14;
      side.position.set(x + Math.cos(a + 1.1) * off, h2 * 0.25, z + Math.sin(a + 1.1) * off);
      side.scale.set(1.2, 1, 0.7);
      group.add(side);
    }
  }
  for (let i = 0; i < 20; i++){
    const a = (i / 20) * Math.PI * 2 + 0.3 + hash2(i + 40, 5) * 0.35;
    const r = 340 + hash2(i + 40, 9) * 50;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const baseH = 22 + hash2(i + 40, 15) * 28;
    const w = 40 + hash2(i + 40, 21) * 45;
    const ridge = new THREE.Mesh(new THREE.ConeGeometry(w * 0.5, baseH, 5), midMat);
    ridge.position.set(x, baseH * 0.3, z);
    ridge.rotation.y = a;
    ridge.scale.set(1.1, 1, 0.6);
    group.add(ridge);
  }
  for (let i = 0; i < 14; i++){
    const a = (i / 14) * Math.PI * 2 + 0.7;
    const r = 420 + hash2(i + 80, 4) * 40;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const baseH = 30 + hash2(i + 80, 12) * 35;
    const ridge = new THREE.Mesh(new THREE.ConeGeometry(55 + hash2(i + 80, 18) * 40, baseH, 6), farMat);
    ridge.position.set(x, baseH * 0.32, z);
    ridge.scale.set(1.3, 1, 0.55);
    group.add(ridge);
  }
  scene.add(group);
  return group;
}
