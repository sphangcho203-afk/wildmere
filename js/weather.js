import * as THREE from 'three';

const DROP_COUNT = 420;

export function makePassingRain(scene){
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(DROP_COUNT * 3);
  const speed = new Float32Array(DROP_COUNT);
  for (let i = 0; i < DROP_COUNT; i++){
    pos[i * 3] = (Math.random() - 0.5) * 28;
    pos[i * 3 + 1] = Math.random() * 16;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 28;
    speed[i] = 9 + Math.random() * 7;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xb7c8d4,
    size: 0.055,
    transparent: true,
    opacity: 0,
    depthWrite: false
  });
  const points = new THREE.Points(geo, mat);
  points.visible = false;
  scene.add(points);
  return { points, speed, falling: false, shown: false };
}

// Short showers twice in a valley day, quieter at night.
export function rainWanted(worldTime){
  const wave = Math.sin(worldTime * Math.PI * 2 * 2.15 + 1.1);
  const dusk = Math.sin(worldTime * Math.PI * 2);
  return wave > 0.72 && dusk > -0.35;
}

export function stepRain(rain, camera, dt, raining){
  const pts = rain.points;
  const pos = pts.geometry.attributes.position;
  rain.falling = raining;
  if (raining && !rain.shown){
    rain.shown = true;
    pts.visible = true;
  }
  if (!raining && rain.shown && pts.material.opacity < 0.02){
    rain.shown = false;
    pts.visible = false;
  }
  const target = raining ? 0.55 : 0;
  pts.material.opacity += (target - pts.material.opacity) * Math.min(1, dt * 1.8);
  if (!pts.visible) return;
  pts.position.copy(camera.position);
  for (let i = 0; i < DROP_COUNT; i++){
    let y = pos.getY(i) - rain.speed[i] * dt;
    if (y < -2){
      pos.setXYZ(i, (Math.random() - 0.5) * 28, 10 + Math.random() * 8, (Math.random() - 0.5) * 28);
    } else {
      pos.setY(i, y);
    }
  }
  pos.needsUpdate = true;
}
