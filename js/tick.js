export function startTick(ctx){
  const THREE = ctx.THREE;
  const {
    scene, camera, renderer, hero, heightAt, atFernStair, atLarkPost,
    currentPlace, rememberPlace, stepBirds, stepRain, rainWanted,
    birds, rain, fernStair, larkPost, skyU, sun, dir, hemi, WATER_Y
  } = ctx;
  const keys = ctx.keys;
  const stick = ctx.stick;
  const clock = new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, clock.getDelta());
    ctx.worldTime = (ctx.worldTime + dt / 360) % 1;
    const elev = Math.sin(ctx.worldTime * Math.PI * 2);
    const up = Math.max(0, elev);
    sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elev * 42), ctx.worldTime * 6.28);
    skyU.sunPosition.value.copy(sun);
    dir.position.copy(sun).multiplyScalar(80);
    dir.intensity = 0.2 + up * 2;
    hemi.intensity = 0.2 + up * 0.55;
    renderer.toneMappingExposure = 0.38 + up * 0.42;
    scene.fog.color.setHSL(0.55, 0.14 + up * 0.12, 0.16 + up * 0.46);
    const wantRain = rainWanted(ctx.worldTime);
    if (wantRain !== ctx.raining){
      ctx.raining = wantRain;
    }
    scene.fog.density = ctx.raining ? 0.0072 : 0.0055;
    if (ctx.playing && !ctx.notebookOpen){
      const yaw = ctx.yaw, pitch = ctx.pitch;
      const fx = Math.sin(yaw), fz = Math.cos(yaw);
      let mx = fx * stick.z + Math.cos(yaw) * stick.x;
      let mz = fz * stick.z - Math.sin(yaw) * stick.x;
      if (keys.w){ mx += fx; mz += fz; } if (keys.s){ mx -= fx; mz -= fz; }
      if (keys.d){ mx += Math.cos(yaw); mz -= Math.sin(yaw); } if (keys.a){ mx -= Math.cos(yaw); mz += Math.sin(yaw); }
      const len = Math.hypot(mx, mz);
      if (len > 0.08){
        mx /= len; mz /= len;
        hero.position.x += mx * 6.8 * dt;
        hero.position.z += mz * 6.8 * dt;
        hero.rotation.y = Math.atan2(mx, mz);
      }
      hero.position.x = THREE.MathUtils.clamp(hero.position.x, -200, 200);
      hero.position.z = THREE.MathUtils.clamp(hero.position.z, -200, 200);
      hero.position.y = heightAt(hero.position.x, hero.position.z);
      camera.position.set(hero.position.x - Math.sin(yaw) * 5.6, hero.position.y + 2.15 + pitch, hero.position.z - Math.cos(yaw) * 5.6);
      camera.lookAt(hero.position.x, hero.position.y + 1.35, hero.position.z);
      if (!ctx.foundFern && atFernStair(hero.position.x, hero.position.z)){
        ctx.foundFern = true;
        ctx.toast('The Fern Stair. Three low steps. Ferns keep the shade moving.');
      }
      const hereName = atFernStair(hero.position.x, hero.position.z) ? 'The Fern Stair' : atLarkPost(hero.position.x, hero.position.z) ? 'The Lark Post' : currentPlace(hero.position.x, hero.position.z);
      rememberPlace(hereName);
      const pl = document.getElementById('place'); if (pl) pl.textContent = hereName;
    } else {
      camera.position.set(hero.position.x - Math.sin(ctx.yaw) * 5.6, hero.position.y + 2.15 + ctx.pitch, hero.position.z - Math.cos(ctx.yaw) * 5.6);
      camera.lookAt(hero.position.x, hero.position.y + 1.35, hero.position.z);
    }
    if (fernStair && fernStair.ferns){
      const wr = ctx.raining ? 1.5 : 1;
      for (let i = 0; i < fernStair.ferns.length; i++){
        fernStair.ferns[i].rotation.z = Math.sin(clock.elapsedTime * 1.5 * wr + i * 0.35) * 0.12 * wr;
      }
    }
    if (larkPost && larkPost.slats){
      const wr = ctx.raining ? 1.7 : 1;
      for (let i = 0; i < larkPost.slats.length; i++){
        larkPost.slats[i].rotation.z = Math.sin(clock.elapsedTime * 2.4 * wr + i * 1.1) * 0.32 * wr;
      }
    }
    stepBirds(birds, clock.elapsedTime);
    stepRain(rain, camera, dt, ctx.raining);
    renderer.render(scene, camera);
  }
  animate();
}
