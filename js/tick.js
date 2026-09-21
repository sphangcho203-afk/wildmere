export function startTick(ctx){
  const THREE = ctx.THREE;
  const {
    scene, camera, renderer, hero, heightAt, atFernStair, atLarkPost, atEveningBell, atRowanLean, atWillowDip, atHoneyStone, atThistleSeat, atCloverPad, atDaisyRing, atRushNest, atBirchShelf, atAlderNook, atHazelRest, atMapleSill, atAspenLean, atCedarBowl,
    currentPlace, rememberPlace, stepBirds, stepRain, rainWanted,
    birds, rain, fernStair, larkPost, eveningBell, washRock, windHollow, rowanLean, willowDip, honeyStone, thistleSeat, cloverPad, daisyRing, rushNest, birchShelf, alderNook, hazelRest, mapleSill, aspenLean, cedarBowl,
    skyU, sun, dir, hemi, WATER_Y
  } = ctx;
  const keys = ctx.keys;
  const stick = ctx.stick;
  const clock = new THREE.Clock();
  function stepWalk(dt, moving){
    const ud = hero.userData;
    if (!ud || !ud.legs) return;
    if (moving){
      const s = Math.sin(clock.elapsedTime * 7.2);
      ud.legs[0].rotation.x = s * 0.55;
      ud.legs[1].rotation.x = -s * 0.55;
      if (ud.shins){
        ud.shins[0].rotation.x = Math.max(0, -s) * 0.25;
        ud.shins[1].rotation.x = Math.max(0, s) * 0.25;
      }
      if (ud.arms){
        ud.arms[0].rotation.x = -s * 0.4;
        ud.arms[1].rotation.x = s * 0.4;
      }
    } else {
      const idle = Math.sin(clock.elapsedTime * 1.4) * 0.04;
      ud.legs[0].rotation.x *= 0.85;
      ud.legs[1].rotation.x *= 0.85;
      if (ud.torso) ud.torso.position.y = 0.94 + idle * 0.08;
    }
  }
  function animate(){
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, clock.getDelta());
    if (ctx.resting && ctx.restSpeed){
      ctx.worldTime += ctx.restSpeed * dt;
      if (ctx.worldTime >= ctx.restTarget && ctx.worldTime < ctx.restTarget + 0.08){
        ctx.worldTime = ctx.restTarget;
        if (ctx.finishRest) ctx.finishRest();
      }
      ctx.worldTime = ctx.worldTime % 1;
    } else {
      ctx.worldTime = (ctx.worldTime + dt / 360) % 1;
    }
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
    if (ctx.playing && !ctx.notebookOpen && !ctx.resting){
      const yaw = ctx.yaw, pitch = ctx.pitch;
      const fx = Math.sin(yaw), fz = Math.cos(yaw);
      let mx = fx * stick.z + Math.cos(yaw) * stick.x;
      let mz = fz * stick.z - Math.sin(yaw) * stick.x;
      if (keys.w){ mx += fx; mz += fz; } if (keys.s){ mx -= fx; mz -= fz; }
      if (keys.d){ mx += Math.cos(yaw); mz -= Math.sin(yaw); } if (keys.a){ mx -= Math.cos(yaw); mz += Math.sin(yaw); }
      const len = Math.hypot(mx, mz);
      const moving = len > 0.08;
      if (moving){
        mx /= len; mz /= len;
        hero.position.x += mx * 6.8 * dt;
        hero.position.z += mz * 6.8 * dt;
        hero.rotation.y = Math.atan2(mx, mz);
      }
      stepWalk(dt, moving);
      hero.position.x = THREE.MathUtils.clamp(hero.position.x, -200, 200);
      hero.position.z = THREE.MathUtils.clamp(hero.position.z, -200, 200);
      hero.position.y = heightAt(hero.position.x, hero.position.z);
      camera.position.set(hero.position.x - Math.sin(yaw) * 5.6, hero.position.y + 2.15 + pitch, hero.position.z - Math.cos(yaw) * 5.6);
      camera.lookAt(hero.position.x, hero.position.y + 1.35, hero.position.z);
      if (!ctx.foundFern && atFernStair(hero.position.x, hero.position.z)){
        ctx.foundFern = true;
        ctx.toast('The Fern Stair. Three low steps. Ferns keep the shade moving.');
      }
      if (!ctx.foundBell && atEveningBell(hero.position.x, hero.position.z)){
        ctx.foundBell = true;
        ctx.toast('The Evening Bell. Two posts, a small bronze, a bench in the moss.');
      }
      if (atRowanLean && !ctx.foundRowan && atRowanLean(hero.position.x, hero.position.z)){
        ctx.foundRowan = true;
        ctx.toast('The Rowan Lean. A thin tree tips toward a stone seat. Red clusters hang.');
      }
      if (atWillowDip && !ctx.foundWillow && atWillowDip(hero.position.x, hero.position.z)){
        ctx.foundWillow = true;
        ctx.toast('The Willow Dip. Long strands hang over a small pool at the roots.');
      }
      if (atHoneyStone && !ctx.foundHoney && atHoneyStone(hero.position.x, hero.position.z)){
        ctx.foundHoney = true;
        ctx.toast('The Honey Stone. A warm slab, a wooden bowl, gold drops on a post.');
      }
      if (atThistleSeat && !ctx.foundThistle && atThistleSeat(hero.position.x, hero.position.z)){
        ctx.foundThistle = true;
        ctx.toast('The Thistle Seat. A low bench in the moss. Purple heads nod in the air.');
      }
      if (atCloverPad && !ctx.foundClover && atCloverPad(hero.position.x, hero.position.z)){
        ctx.foundClover = true;
        ctx.toast('The Clover Pad. A round of moss, a low stool, rainwater in a tin cup.');
      }
      if (atDaisyRing && !ctx.foundDaisy && atDaisyRing(hero.position.x, hero.position.z)){
        ctx.foundDaisy = true;
        ctx.toast('The Daisy Ring. White heads in a small circle. A bench in the moss.');
      }
      if (atRushNest && !ctx.foundRush && atRushNest(hero.position.x, hero.position.z)){
        ctx.foundRush = true;
        ctx.toast('The Rush Nest. Pale rushes in a fan. A stone dish holds rain.');
      }
      if (atBirchShelf && !ctx.foundBirch && atBirchShelf(hero.position.x, hero.position.z)){
        ctx.foundBirch = true;
        ctx.toast('The Birch Shelf. Pale bark, a stone shelf, peels that lift in the air.');
      }
      if (atAlderNook && !ctx.foundAlder && atAlderNook(hero.position.x, hero.position.z)){
        ctx.foundAlder = true;
        ctx.toast('The Alder Nook. A dark trunk, hanging catkins, rain in a stone bowl.');
      }
      if (atHazelRest && !ctx.foundHazel && atHazelRest(hero.position.x, hero.position.z)){
        ctx.foundHazel = true;
        ctx.toast('The Hazel Rest. A small tree, a moss seat, nuts in the leaves.');
      }
      if (atMapleSill && !ctx.foundMaple && atMapleSill(hero.position.x, hero.position.z)){
        ctx.foundMaple = true;
        ctx.toast('The Maple Sill. Warm leaves, a stone sill, seeds that spin in the air.');
      }
      if (atAspenLean && !ctx.foundAspen && atAspenLean(hero.position.x, hero.position.z)){
        ctx.foundAspen = true;
        ctx.toast('The Aspen Lean. A pale trunk, flickering leaves, a seat in the moss.');
      }
      if (atCedarBowl && !ctx.foundCedar && atCedarBowl(hero.position.x, hero.position.z)){
        ctx.foundCedar = true;
        ctx.toast('The Cedar Bowl. A dark cedar, small cones, rain in a stone bowl.');
      }
      let hereName = currentPlace(hero.position.x, hero.position.z);
      if (atEveningBell(hero.position.x, hero.position.z)) hereName = 'The Evening Bell';
      else if (atFernStair(hero.position.x, hero.position.z)) hereName = 'The Fern Stair';
      else if (atLarkPost(hero.position.x, hero.position.z)) hereName = 'The Lark Post';
      else if (atRowanLean && atRowanLean(hero.position.x, hero.position.z)) hereName = 'The Rowan Lean';
      else if (atWillowDip && atWillowDip(hero.position.x, hero.position.z)) hereName = 'The Willow Dip';
      else if (atHoneyStone && atHoneyStone(hero.position.x, hero.position.z)) hereName = 'The Honey Stone';
      else if (atThistleSeat && atThistleSeat(hero.position.x, hero.position.z)) hereName = 'The Thistle Seat';
      else if (atCloverPad && atCloverPad(hero.position.x, hero.position.z)) hereName = 'The Clover Pad';
      else if (atDaisyRing && atDaisyRing(hero.position.x, hero.position.z)) hereName = 'The Daisy Ring';
      else if (atRushNest && atRushNest(hero.position.x, hero.position.z)) hereName = 'The Rush Nest';
      else if (atBirchShelf && atBirchShelf(hero.position.x, hero.position.z)) hereName = 'The Birch Shelf';
      else if (atAlderNook && atAlderNook(hero.position.x, hero.position.z)) hereName = 'The Alder Nook';
      else if (atHazelRest && atHazelRest(hero.position.x, hero.position.z)) hereName = 'The Hazel Rest';
      else if (atMapleSill && atMapleSill(hero.position.x, hero.position.z)) hereName = 'The Maple Sill';
      else if (atAspenLean && atAspenLean(hero.position.x, hero.position.z)) hereName = 'The Aspen Lean';
      else if (atCedarBowl && atCedarBowl(hero.position.x, hero.position.z)) hereName = 'The Cedar Bowl';
      rememberPlace(hereName);
      const pl = document.getElementById('place'); if (pl) pl.textContent = hereName;
      if (ctx.stepNeeds) ctx.stepNeeds(dt);
    } else {
      stepWalk(dt, false);
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
    if (eveningBell && eveningBell.bell){
      const wr = ctx.raining ? 1.4 : 1;
      eveningBell.bell.rotation.z = Math.sin(clock.elapsedTime * 1.15 * wr) * 0.12 * wr;
      eveningBell.bell.rotation.x = Math.sin(clock.elapsedTime * 0.9 * wr + 0.6) * 0.06 * wr;
    }
    if (washRock && washRock.cloths){
      const wr = ctx.raining ? 1.6 : 1;
      for (let i = 0; i < washRock.cloths.length; i++){
        washRock.cloths[i].rotation.x = Math.sin(clock.elapsedTime * 1.8 * wr + i) * 0.18 * wr;
      }
    }
    if (windHollow && windHollow.ribbon){
      const wr = ctx.raining ? 1.6 : 1;
      windHollow.ribbon.rotation.y = Math.sin(clock.elapsedTime * 2.1 * wr) * 0.35 * wr;
    }
    if (rowanLean && rowanLean.clusters){
      const wr = ctx.raining ? 1.3 : 1;
      for (let i = 0; i < rowanLean.clusters.length; i++){
        const c = rowanLean.clusters[i];
        c.position.y += Math.sin(clock.elapsedTime * 1.6 * wr + i) * 0.0008 * wr;
      }
    }
    if (willowDip && willowDip.strands){
      const wr = ctx.raining ? 1.6 : 1;
      for (let i = 0; i < willowDip.strands.length; i++){
        willowDip.strands[i].rotation.z = Math.sin(clock.elapsedTime * 1.7 * wr + i * 0.4) * 0.16 * wr;
        willowDip.strands[i].rotation.x = Math.sin(clock.elapsedTime * 1.1 * wr + i * 0.2) * 0.05 * wr;
      }
    }
    if (honeyStone && honeyStone.flecks){
      const wr = ctx.raining ? 0.6 : 1;
      const hx = honeyStone.x, hz = honeyStone.z, hy = honeyStone.y || 0;
      for (let i = 0; i < honeyStone.flecks.length; i++){
        const f = honeyStone.flecks[i];
        const a = clock.elapsedTime * 1.35 * wr + f.userData.phase;
        f.position.set(
          hx + Math.cos(a) * f.userData.radius,
          hy + f.userData.lift + Math.sin(a * 1.7) * 0.08,
          hz + Math.sin(a) * f.userData.radius
        );
      }
    }
    if (honeyStone && honeyStone.drops){
      for (let i = 0; i < honeyStone.drops.length; i++){
        honeyStone.drops[i].position.y += Math.sin(clock.elapsedTime * 2.2 + i) * 0.0006;
      }
    }
    if (thistleSeat && thistleSeat.heads){
      const wr = ctx.raining ? 1.5 : 1;
      for (let i = 0; i < thistleSeat.heads.length; i++){
        const h = thistleSeat.heads[i];
        h.position.y = h.userData.baseY + Math.sin(clock.elapsedTime * 1.8 * wr + h.userData.phase) * 0.025 * wr;
        h.rotation.z = Math.sin(clock.elapsedTime * 1.4 * wr + i) * 0.12 * wr;
      }
    }
    if (cloverPad && cloverPad.leaves){
      const wr = ctx.raining ? 1.4 : 1;
      for (let i = 0; i < cloverPad.leaves.length; i++){
        const leaf = cloverPad.leaves[i];
        leaf.rotation.z = Math.sin(clock.elapsedTime * 1.3 * wr + leaf.userData.phase) * 0.08 * wr;
        leaf.position.y = leaf.userData.baseY + Math.sin(clock.elapsedTime * 1.6 * wr + i) * 0.006 * wr;
      }
    }
    if (daisyRing && daisyRing.heads){
      const wr = ctx.raining ? 1.4 : 1;
      for (let i = 0; i < daisyRing.heads.length; i++){
        const head = daisyRing.heads[i];
        head.rotation.z = Math.sin(clock.elapsedTime * 1.25 * wr + head.userData.phase) * 0.1 * wr;
        head.position.y = head.userData.baseY + Math.sin(clock.elapsedTime * 1.5 * wr + i) * 0.008 * wr;
      }
    }
    if (rushNest && rushNest.reeds){
      const wr = ctx.raining ? 1.6 : 1;
      for (let i = 0; i < rushNest.reeds.length; i++){
        const reed = rushNest.reeds[i];
        reed.rotation.z = Math.sin(clock.elapsedTime * 1.45 * wr + reed.userData.phase) * 0.14 * wr;
      }
    }
    if (birchShelf && birchShelf.peels){
      const wr = ctx.raining ? 1.5 : 1;
      for (let i = 0; i < birchShelf.peels.length; i++){
        const peel = birchShelf.peels[i];
        peel.rotation.z = Math.sin(clock.elapsedTime * 1.55 * wr + peel.userData.phase) * 0.18 * wr;
        peel.rotation.x = Math.sin(clock.elapsedTime * 1.1 * wr + i) * 0.06 * wr;
      }
    }
    if (alderNook && alderNook.catkins){
      const wr = ctx.raining ? 1.5 : 1;
      for (let i = 0; i < alderNook.catkins.length; i++){
        const c = alderNook.catkins[i];
        c.rotation.z = Math.sin(clock.elapsedTime * 1.5 * wr + c.userData.phase) * 0.16 * wr;
      }
    }
    if (hazelRest && hazelRest.nuts){
      const wr = ctx.raining ? 1.4 : 1;
      for (let i = 0; i < hazelRest.nuts.length; i++){
        const n = hazelRest.nuts[i];
        n.position.y = n.userData.baseY + Math.sin(clock.elapsedTime * 1.6 * wr + n.userData.phase) * 0.012 * wr;
      }
    }
    if (mapleSill && mapleSill.seeds){
      const wr = ctx.raining ? 1.5 : 1;
      for (let i = 0; i < mapleSill.seeds.length; i++){
        const s = mapleSill.seeds[i];
        s.rotation.z = Math.sin(clock.elapsedTime * 1.8 * wr + s.userData.phase) * 0.22 * wr;
        s.position.y = s.userData.baseY + Math.sin(clock.elapsedTime * 1.5 * wr + i) * 0.01 * wr;
      }
    }
    if (aspenLean && aspenLean.leaves){
      const wr = ctx.raining ? 1.6 : 1;
      for (let i = 0; i < aspenLean.leaves.length; i++){
        const leaf = aspenLean.leaves[i];
        leaf.rotation.z = Math.sin(clock.elapsedTime * 2.2 * wr + leaf.userData.phase) * 0.28 * wr;
        leaf.position.y = leaf.userData.baseY + Math.sin(clock.elapsedTime * 1.7 * wr + i) * 0.012 * wr;
      }
    }
    if (cedarBowl && cedarBowl.cones){
      const wr = ctx.raining ? 1.5 : 1;
      for (let i = 0; i < cedarBowl.cones.length; i++){
        const c = cedarBowl.cones[i];
        c.rotation.z = Math.sin(clock.elapsedTime * 1.6 * wr + c.userData.phase) * 0.14 * wr;
        c.position.y = c.userData.baseY + Math.sin(clock.elapsedTime * 1.5 * wr + i) * 0.01 * wr;
      }
    }
    stepBirds(birds, clock.elapsedTime);
    stepRain(rain, camera, dt, ctx.raining);
    const clockEl = document.getElementById('clock');
    if (clockEl){
      const names = ['Night', 'Dawn', 'Morning', 'Noon', 'Afternoon', 'Evening', 'Dusk', 'Night'];
      clockEl.textContent = names[Math.floor(((ctx.worldTime + 0.05) % 1) * 8) % 8];
    }
    renderer.render(scene, camera);
  }
  animate();
}
