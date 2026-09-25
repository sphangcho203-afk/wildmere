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
