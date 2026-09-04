const GOOD = 'https://raw.githubusercontent.com/sphangcho203-afk/wildmere/e58bb6b2f6ed91807c99cfcc9913c19d0283a920/js/game.js';

const src = await fetch(GOOD).then(r => {
  if (!r.ok) throw new Error('could not load valley loop');
  return r.text();
});

let code = src;
code = code.replace(
  '  makeLowCairn, atLowCairn,\n  addDistantRidges',
  '  makeLowCairn, atLowCairn,\n  makeShadePool, atShadePool,\n  addDistantRidges'
);
code = code.replace(
  'let foundCairn = false;',
  'let foundCairn = false;\nlet foundPool = false;'
);
code = code.replace(
  'Math.hypot(x + 52, z - 16) < 8) continue;',
  'Math.hypot(x + 52, z - 16) < 8 || Math.hypot(x - 24, z - 56) < 8) continue;'
);
code = code.replace(
  'const lowCairn = makeLowCairn(scene);',
  'const lowCairn = makeLowCairn(scene);\nconst shadePool = makeShadePool(scene);'
);
code = code.replace(
  `  if (atQuietWell(hero.position.x, hero.position.z)){\n    player.thirst = Math.min(100, player.thirst + 34);\n    toast('Cool water from the old well');\n    hud();\n    return;\n  }`,
  `  if (atQuietWell(hero.position.x, hero.position.z)){\n    player.thirst = Math.min(100, player.thirst + 34);\n    toast('Cool water from the old well');\n    hud();\n    return;\n  }\n  if (atShadePool(hero.position.x, hero.position.z)){\n    player.thirst = Math.min(100, player.thirst + 30);\n    toast('Drank from the still pool');\n    hud();\n    return;\n  }`
);
code = code.replace(
  `      if (!foundCairn && atLowCairn(hero.position.x, hero.position.z)){\n        foundCairn = true; toast('The Low Cairn. Someone stacked these so a walker would not miss the turn.');\n      }`,
  `      if (!foundCairn && atLowCairn(hero.position.x, hero.position.z)){\n        foundCairn = true; toast('The Low Cairn. Someone stacked these so a walker would not miss the turn.');\n      }\n      if (!foundPool && atShadePool(hero.position.x, hero.position.z)){\n        foundPool = true; toast('The Shade Pool. The water does not run. It only holds the sky.');\n      }`
);
code = code.replace(
  '    if (reedStep && reedStep.reeds){',
  `    if (shadePool && shadePool.reeds){\n      const wr = raining ? 1.4 : 1;\n      for (let i = 0; i < shadePool.reeds.length; i++){\n        const reed = shadePool.reeds[i];\n        reed.rotation.z = Math.sin(clock.elapsedTime * 1.6 * wr + i) * 0.12 * wr;\n        reed.rotation.x = Math.sin(clock.elapsedTime * 1.1 + i * 0.4) * 0.06;\n      }\n    }\n    if (reedStep && reedStep.reeds){`
);
code = code.replace(
  "else if (atQuietWell(hero.position.x, hero.position.z)) pr.textContent = 'E  drink from the well';",
  "else if (atQuietWell(hero.position.x, hero.position.z)) pr.textContent = 'E  drink from the well';\n      else if (atShadePool(hero.position.x, hero.position.z)) pr.textContent = 'E  drink from the shade pool';"
);
code = code.replace(
  "atSlowBend(hero.position.x, hero.position.z) ? 'The Slow Bend' : currentPlace(hero.position.x, hero.position.z);",
  "atShadePool(hero.position.x, hero.position.z) ? 'The Shade Pool' : atSlowBend(hero.position.x, hero.position.z) ? 'The Slow Bend' : currentPlace(hero.position.x, hero.position.z);"
);

const blob = new Blob([code], { type: 'text/javascript' });
const url = URL.createObjectURL(blob);
await import(url);
