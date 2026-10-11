import * as THREE from 'three';

export function startTick(ctx){
  const {
    scene,
    camera, renderer, hero, birds, rain,
    skyU, sun, dir, hemi,
    WATER_Y, foundNotes, interactives, fires, plots, player,
    getPlaying, getNotebookOpen,
    stepBirds, stepRain, rainWanted, currentPlace,
    heightAt, rememberPlace, stepNeeds, finishRest,
    toast
  } = ctx;

  let last = performance.now();
  let lastPlace = '';

  // Mouse look without pointer lock: only when pointer is on right half of screen
  let mouseDown = false;
  let lastMx = 0, lastMy = 0;
  addEventListener('pointerdown', e => {
    if (!getPlaying() || getNotebookOpen()) return;
    if (e.clientX > innerWidth * 0.5){
      mouseDown = true;
      lastMx = e.clientX;
      lastMy = e.clientY;
    }
  });
  addEventListener('pointermove', e => {
    if (!mouseDown || !getPlaying() || getNotebookOpen()) return;
    ctx.yaw -= (e.clientX - lastMx) * 0.005;
    ctx.pitch = Math.max(-0.4, Math.min(0.7, ctx.pitch + (e.clientY - lastMy) * 0.004));
    lastMx = e.clientX;
    lastMy = e.clientY;
  });
  addEventListener('pointerup', () => { mouseDown = false; });
  addEventListener('pointerleave', () => { mouseDown = false; });

  function frame(now){
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (!getPlaying()){
      renderer.render(scene, camera);
      return;
    }

    // Time
    if (ctx.resting){
      ctx.worldTime += (ctx.restSpeed || 0.08) * dt * 8;
      if (Math.sin(ctx.worldTime * Math.PI * 2) > 0.15){
        ctx.worldTime = ctx.restTarget || 0.22;
        if (finishRest) finishRest();
      }
    } else {
      ctx.worldTime += dt * 0.012;
    }
    const elev = Math.sin(ctx.worldTime * Math.PI * 2);
    const day = elev > 0;

    // Sky
    const phi = Math.PI * 0.5 - elev * 1.1;
    const theta = 0.4;
    sun.setFromSphericalCoords(1, phi, theta);
    skyU.sunPosition.value.copy(sun);
    const intensity = Math.max(0.08, elev * 0.9 + 0.15);
    dir.intensity = intensity * 2.2;
    hemi.intensity = 0.35 + intensity * 0.4;
    dir.position.copy(sun).multiplyScalar(80);
    dir.position.y = Math.max(8, dir.position.y);
    scene.fog.color.setHSL(0.55, 0.12, 0.55 + elev * 0.15);

    // Rain
    ctx.raining = rainWanted ? rainWanted(ctx.worldTime) : false;
    if (stepRain) stepRain(rain, camera, dt, ctx.raining);

    // Movement
    if (!ctx.resting && !getNotebookOpen()){
      const speed = 4.8;
      let mx = 0, mz = 0;
      if (ctx.keys.w) mz -= 1;
      if (ctx.keys.s) mz += 1;
      if (ctx.keys.a) mx -= 1;
      if (ctx.keys.d) mx += 1;
      mx += ctx.stick.x || 0;
      mz -= ctx.stick.z || 0; // stick.z positive is forward in pad
      const len = Math.hypot(mx, mz);
      if (len > 0){
        mx /= len; mz /= len;
        const yaw = ctx.yaw;
        const wx = mx * Math.cos(yaw) - mz * Math.sin(yaw);
        const wz = mx * Math.sin(yaw) + mz * Math.cos(yaw);
        hero.position.x += wx * speed * dt;
        hero.position.z += wz * speed * dt;
        hero.rotation.y = Math.atan2(wx, wz);
      }
    }
    const gy = heightAt(hero.position.x, hero.position.z);
    hero.position.y = gy;
    // simple walk bob
    if (Math.abs(ctx.keys.w || ctx.keys.s || ctx.stick.z || 0) > 0.1){
      hero.position.y += Math.sin(now * 0.012) * 0.04;
    }

    // Camera
    const eye = 1.62;
    camera.position.set(
      hero.position.x,
      hero.position.y + eye + Math.sin(ctx.pitch) * 0.15,
      hero.position.z
    );
    camera.rotation.order = 'YXZ';
    camera.rotation.y = ctx.yaw;
    camera.rotation.x = -ctx.pitch;

    // Compass heading
    const deg = ((-ctx.yaw * 180 / Math.PI) % 360 + 360) % 360;
    const dirs = ['N','NE','E','SE','S','SW','W','NW'];
    const di = Math.round(deg / 45) % 8;
    const compass = document.getElementById('compass');
    if (compass) compass.firstChild.textContent = dirs[di];

    // Place discovery
    const place = currentPlace(hero.position.x, hero.position.z);
    if (place && place !== lastPlace){
      lastPlace = place;
      const el = document.getElementById('place');
      if (el) el.textContent = place;
      if (rememberPlace) rememberPlace(place);
    }

    if (stepNeeds) stepNeeds(dt);
    if (stepBirds) stepBirds(birds, now * 0.001);

    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}
