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
  makeLowCairn, atLowCairn,
  makeStillGate, atStillGate,
  makeShadePool, atShadePool,
  addDistantRidges, addGrassTufts, addValleyBirds, stepBirds
} from './world.js';
import { atSlowBend, placeSlowBend } from './bend.js';
import { loadNotes, saveNotes, noteForPlace, renderNotebook } from './notebook.js';
import { makePassingRain, stepRain, rainWanted } from './weather.js';
