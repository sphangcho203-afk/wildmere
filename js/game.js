import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import {
  WORLD, WATER_Y, SEED,
  riverDist, heightAt,
  makeTree, treeKindAt, addBerryBush,
  makeHuman, makeRiverWater, currentPlace, makeStoneRing, makeMossSeat,
  makeQuietWell, atQuietWell,
  makeListeningPine, atListeningPine,
  makeWindHollow, atWindHollow,
  makeReedStep, atReedStep,
  addDistantRidges, addGrassTufts, addValleyBirds, stepBirds
} from './world.js';
