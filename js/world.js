import * as THREE from 'three';
import { atElderBowl } from './elder.js';
import { atJuniperCup } from './juniper.js';
import { atMulberryRest } from './mulberry.js';
import { atHornbeamShelf } from './hornbeam.js';
import { atSycamoreSeat } from './sycamore.js';
import { atCrabappleRest } from './crabapple.js';
import { atDogwoodSeat } from './dogwood.js';
import { atPlumRest } from './plum.js';
import { atPearRest } from './pear.js';
import { atAppleRest } from './apple.js';
import { atCherryRest } from './cherry.js';
import { atQuinceRest } from './quince.js';
import { atServiceRest } from './service.js';
import { atLarchRest } from './larch.js';
import { atFirRest } from './fir.js';
import { atPineRest } from './pine.js';
import { atCypressRest } from './cypress.js';
import { atHeatherRest } from './heather.js';
import { atVioletRest } from './violet.js';
import { atButtercupRest } from './buttercup.js';

export const WORLD = 460;
export const WATER_Y = 1.35;
export const EYE = 1.67;
export const SEED = 2041;
export const SAVE_KEY = 'wildmere-v3';

function fade(t){ return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a, b, t){ return a + (b - a) * t; }
function hash2(ix, iy){
  let n = (ix * 374761393 + iy * 668265263 + SEED * 13) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
export function vnoise(x, y){
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const u = fade(fx), v = fade(fy);
  return lerp(lerp(hash2(ix, iy), hash2(ix + 1, iy), u), lerp(hash2(ix, iy + 1), hash2(ix + 1, iy + 1), u), v);
}
export function fbm(x, y, oct = 5){
  let sum = 0, amp = 1, freq = 1, norm = 0;
  for (let i = 0; i < oct; i++){
    sum += amp * vnoise(x * freq, y * freq);
    norm += amp; amp *= 0.5; freq *= 2.03;
  }
  return sum / norm;
}
export function riverT(x, z){
  return x - (14 * Math.sin(z * 0.016) + 7 * Math.sin(z * 0.049 + 1.7));
}
export function riverDist(x, z){ return Math.abs(riverT(x, z)); }
export const TERRACE_X = -68;
export const TERRACE_Z = -96;
export function atStoneTerrace(x, z){
  return Math.hypot(x - TERRACE_X, z - TERRACE_Z) < 22;
}

export function heightAt(x, z){
  const nx = x * 0.0058, nz = z * 0.0058;
  let h = Math.pow(fbm(nx + 20, nz + 8, 6), 1.12);
  let elev = (h - 0.42) * 30;
  const d = Math.hypot(x, z) / (WORLD * 0.55);
  elev += (1 - Math.min(1, d * d)) * 1.1;
  const rd = riverDist(x, z);
  const carve = Math.max(0, 1 - rd / 10);
  elev -= carve * carve * 8.2;
  elev += fbm(x * 0.0028, z * 0.0028 + 40, 3) * 7;
  const td = Math.hypot(x - TERRACE_X, z - TERRACE_Z);
  if (td < 38){
    const w = Math.max(0, 1 - td / 38);
    const shelf = 16.15 + fbm(x * 0.04 + 2, z * 0.04 + 5, 2) * 0.4;
    elev = lerp(elev, shelf, w * w);
  }
  return elev;
}

export { makeTree, treeKindAt, addBerryBush, makeHuman } from './trees.js';
export {
  makeRiverWater, makeStoneRing, makeMossSeat,
  placeStoneTerrace, addGrassTufts, addValleyBirds, stepBirds,
  makeQuietWell, atQuietWell,
  makeListeningPine, atListeningPine,
  makeWindHollow, atWindHollow,
  makeReedStep, atReedStep,
  makeLowCairn, atLowCairn
} from './places.js';
import { currentPlace as rawPlace } from './places.js';
export function currentPlace(x, z){
  if (atButtercupRest(x, z)) return 'The Buttercup Rest';
  if (atVioletRest(x, z)) return 'The Violet Rest';
  if (atHeatherRest(x, z)) return 'The Heather Rest';
  if (atCypressRest(x, z)) return 'The Cypress Rest';
  if (atPineRest(x, z)) return 'The Pine Rest';
  if (atFirRest(x, z)) return 'The Fir Rest';
  if (atLarchRest(x, z)) return 'The Larch Rest';
  if (atServiceRest(x, z)) return 'The Serviceberry Rest';
  if (atQuinceRest(x, z)) return 'The Quince Rest';
  if (atCherryRest(x, z)) return 'The Cherry Rest';
  if (atAppleRest(x, z)) return 'The Apple Rest';
  if (atPearRest(x, z)) return 'The Pear Rest';
  if (atPlumRest(x, z)) return 'The Plum Rest';
  if (atDogwoodSeat(x, z)) return 'The Dogwood Seat';
  if (atCrabappleRest(x, z)) return 'The Crabapple Rest';
  if (atSycamoreSeat(x, z)) return 'The Sycamore Seat';
  if (atHornbeamShelf(x, z)) return 'The Hornbeam Shelf';
  if (atMulberryRest(x, z)) return 'The Mulberry Rest';
  if (atJuniperCup(x, z)) return 'The Juniper Cup';
  if (atElderBowl(x, z)) return 'The Elder Bowl';
  return rawPlace(x, z);
}
export { makeShadePool, atShadePool } from './shade.js';
export { makeSplitOak, atSplitOak } from './oak.js';
export { makeStillGate, atStillGate } from './gate.js';
export { makeWashRock, atWashRock } from './wash.js';
export { makeLarkPost, atLarkPost } from './lark.js';
export { makeFernStair, atFernStair } from './fern.js';
export { makeEveningBell, atEveningBell } from './bell.js';
export { makeRowanLean, atRowanLean } from './rowan.js';
export { makeWillowDip, atWillowDip } from './willow.js';
export { makeHoneyStone, atHoneyStone } from './honey.js';
export { makeThistleSeat, atThistleSeat } from './thistle.js';
export { makeCloverPad, atCloverPad } from './clover.js';
export { makeDaisyRing, atDaisyRing } from './daisy.js';
export { makeRushNest, atRushNest } from './rush.js';
export { makeBirchShelf, atBirchShelf } from './birch.js';
export { makeAlderNook, atAlderNook } from './alder.js';
export { makeHazelRest, atHazelRest } from './hazel.js';
export { makeMapleSill, atMapleSill } from './maple.js';
export { makeAspenLean, atAspenLean } from './aspen.js';
export { makeCedarBowl, atCedarBowl } from './cedar.js';
export { makeSpruceCup, atSpruceCup } from './spruce.js';
export { makeYewSill, atYewSill } from './yew.js';
export { makeElmDish, atElmDish } from './elm.js';
export { makeBeechLedge, atBeechLedge } from './beech.js';
export { makeLindenSeat, atLindenSeat } from './linden.js';
export { makePoplarRest, atPoplarRest } from './poplar.js';
export { makeAshLedge, atAshLedge } from './ash.js';
export { makeHollyRest, atHollyRest } from './holly.js';
export { makeWalnutBench, atWalnutBench } from './walnut.js';
export { makeChestnutRest, atChestnutRest } from './chestnut.js';
export { makeHawthornBench, atHawthornBench } from './hawthorn.js';
export { makeElderBowl, atElderBowl } from './elder.js';
export { makeJuniperCup, atJuniperCup } from './juniper.js';
export { makeMulberryRest, atMulberryRest } from './mulberry.js';
export { makeHornbeamShelf, atHornbeamShelf } from './hornbeam.js';
export { makeSycamoreSeat, atSycamoreSeat } from './sycamore.js';
export { makeCrabappleRest, atCrabappleRest } from './crabapple.js';
export { makeDogwoodSeat, atDogwoodSeat } from './dogwood.js';
export { makePlumRest, atPlumRest } from './plum.js';
export { makePearRest, atPearRest } from './pear.js';
export { makeAppleRest, atAppleRest } from './apple.js';
export { makeCherryRest, atCherryRest } from './cherry.js';
export { makeQuinceRest, atQuinceRest } from './quince.js';
export { makeServiceRest, atServiceRest } from './service.js';
export { makeLarchRest, atLarchRest } from './larch.js';
export { makeFirRest, atFirRest } from './fir.js';
export { makePineRest, atPineRest } from './pine.js';
export { makeCypressRest, atCypressRest } from './cypress.js';
export { makeHeatherRest, atHeatherRest } from './heather.js';
export { makeVioletRest, atVioletRest } from './violet.js';
export { makeButtercupRest, atButtercupRest } from './buttercup.js';
export { addDistantRidges } from './ridges.js';
