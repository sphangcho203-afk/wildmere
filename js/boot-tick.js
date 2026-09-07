import * as THREE from 'three';
import { startTick } from './tick.js';
import { heightAt, currentPlace, atLarkPost, atFernStair } from './world.js';
import { stepBirds } from './world.js';
import { stepRain, rainWanted } from './weather.js';
import { noteForPlace, saveNotes, renderNotebook } from './notebook.js';

export function bootTick(parts){
  const keys = { w:0, a:0, s:0, d:0 };
  const stick = { x:0, z:0 };
  const ctx = {
    THREE,
    ...parts,
    heightAt,
    atFernStair,
    atLarkPost,
    currentPlace,
    stepBirds,
    stepRain,
    rainWanted,
    keys,
    stick,
    yaw: 0.4,
    pitch: 0.12,
    worldTime: 0.22,
    raining: false,
    foundFern: false,
    playing: parts.playingRef,
    notebookOpen: false,
    toast(msg){
      const el = document.getElementById('toast'); if (!el) return;
      el.textContent = msg; el.classList.add('show');
      clearTimeout(this._t); this._t = setTimeout(() => el.classList.remove('show'), 1600);
    },
    rememberPlace(name){
      const note = noteForPlace(name);
      if (!note || parts.foundNotes.has(note.id)) return;
      parts.foundNotes.add(note.id);
      saveNotes(parts.foundNotes);
      renderNotebook(parts.foundNotes);
      this.toast('Wrote: ' + note.name);
    }
  };
  Object.defineProperty(ctx, 'playing', { get(){ return parts.getPlaying(); } });
  addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (keys[k] !== undefined) keys[k] = 1;
  });
  addEventListener('keyup', e => {
    const k = e.key.toLowerCase();
    if (keys[k] !== undefined) keys[k] = 0;
  });
  const walk = document.getElementById('stick-walk');
  const knob = walk && walk.querySelector('i');
  let walkId = null, lookId = null, lx = 0, ly = 0;
  function setKnob(el, nx, nz){ if (el) el.style.transform = 'translate(' + (nx * 36) + 'px,' + (-nz * 36) + 'px)'; }
  function applyWalk(t){
    const cx = walk ? walk.getBoundingClientRect() : { left: 36, top: innerHeight - 190, width: 140, height: 140 };
    stick.x = Math.max(-1, Math.min(1, (t.clientX - (cx.left + cx.width / 2)) / 58));
    stick.z = -Math.max(-1, Math.min(1, (t.clientY - (cx.top + cx.height / 2)) / 58));
    setKnob(knob, stick.x, stick.z);
  }
  function find(id, list){ for (let i = 0; i < list.length; i++) if (list[i].identifier === id) return list[i]; return null; }
  addEventListener('touchstart', e => {
    if (!parts.getPlaying()) return;
    for (const t of e.changedTouches){
      const hit = document.elementFromPoint(t.clientX, t.clientY);
      if (hit && hit.closest && hit.closest('#touch-actions')) continue;
      if (walkId === null && t.clientX < innerWidth * 0.55){ walkId = t.identifier; applyWalk(t); e.preventDefault(); }
      else if (lookId === null){ lookId = t.identifier; lx = t.clientX; ly = t.clientY; e.preventDefault(); }
    }
  }, { passive: false });
  addEventListener('touchmove', e => {
    if (walkId !== null){ const t = find(walkId, e.touches); if (t){ applyWalk(t); e.preventDefault(); } }
    if (lookId !== null){
      const t = find(lookId, e.touches);
      if (t){
        ctx.yaw -= (t.clientX - lx) * 0.01;
        ctx.pitch = Math.max(-0.35, Math.min(0.65, ctx.pitch + (t.clientY - ly) * 0.007));
        lx = t.clientX; ly = t.clientY; e.preventDefault();
      }
    }
  }, { passive: false });
  addEventListener('touchend', e => {
    for (const t of e.changedTouches){
      if (t.identifier === walkId){ walkId = null; stick.x = 0; stick.z = 0; setKnob(knob, 0, 0); }
      if (t.identifier === lookId) lookId = null;
    }
  }, { passive: false });
  startTick(ctx);
}
