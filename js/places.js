import * as THREE from 'three';
import { WATER_Y, heightAt, fbm, riverDist, atStoneTerrace, TERRACE_X, TERRACE_Z } from './world.js';
import { atDaisyRing } from './daisy.js';
import { atRushNest } from './rush.js';
import { atBirchShelf } from './birch.js';
import { atAlderNook } from './alder.js';
import { atHazelRest } from './hazel.js';
import { atMapleSill } from './maple.js';
import { atAspenLean } from './aspen.js';
import { atCedarBowl } from './cedar.js';
import { atBeechLedge } from './beech.js';

function hash2(ix, iy){
  const SEED = 2041;
  let n = (ix * 374761393 + iy * 668265263 + SEED * 13) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

export const WELL_X = 46;
export const WELL_Z = 8;
export function atQuietWell(x, z){
  return Math.hypot(x - WELL_X, z - WELL_Z) < 4.2;
}
export function makeQuietWell(scene){
  const stone = new THREE.MeshStandardMaterial({ color: 0x6a6660, roughness: 0.95 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.9 });
  const water = new THREE.MeshStandardMaterial({ color: 0x3d6e7a, roughness: 0.2, transparent: true, opacity: 0.7 });
  const y = heightAt(WELL_X, WELL_Z);
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 0.55, 12, 1, true), stone);
  ring.position.set(WELL_X, y + 0.28, WELL_Z);
  scene.add(ring);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.08, 6, 12), stone);
  lip.rotation.x = Math.PI / 2;
  lip.position.set(WELL_X, y + 0.56, WELL_Z);
  scene.add(lip);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(0.78, 12), water);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(WELL_X, y + 0.18, WELL_Z);
  scene.add(pool);
  const postL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.15, 0.08), wood);
  postL.position.set(WELL_X - 0.7, y + 1.05, WELL_Z);
  const postR = postL.clone();
  postR.position.x = WELL_X + 0.7;
  scene.add(postL); scene.add(postR);
  const beam = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.07, 0.07), wood);
  beam.position.set(WELL_X, y + 1.6, WELL_Z);
  scene.add(beam);
  return { x: WELL_X, z: WELL_Z, name: 'The Quiet Well' };
}
