# Wildmere

First-person open ground. Not voxels. Not a grid.

You wake in a valley that is supposed to feel like a place: hills, a stream that actually winds, timber, berries, stone, and enough sky to watch the day turn.

Walk wherever you want. Gather what the land gives. Plant something. Put up posts and a fire. Stay warm after dark.

This is a browser world built with Three.js. It will never be a store game. It can still be a good piece of ground.

**Play:** open `index.html` in Chrome, or serve the folder:

```bash
python3 -m http.server 8080
```

Then go to `http://localhost:8080`.

If the canvas stays black, you are on `file://` and the module imports were blocked. Use the local server.

## Controls

| Key | Action |
| --- | --- |
| Click | Enter the valley |
| WASD | Walk |
| Mouse / right pad | Look |
| E | Gather wood / berries / stone · water soil · harvest crops · drink · fish at the Slow Bend |
| Tab or Q | Cycle build piece |
| F | Place selected piece (post, fire, cabin, soil bed) |
| G | Plant a crop in a soil bed (needs 1 berry) |
| R | Rest by a campfire (night: advances time to morning) |
| 1 | Eat |
| Esc | Release mouse |

## What is in the valley

- A carved stream (Reedford Crossing), the Slow Bend, and a starting meadow (The Clearing)
- High ground (High Spine) and a stone terrace past it, with thin grass and loose rock
- Thicker timber (The Quiet Pines)
- The Old Ring and the Moss Seat — quiet named places
- Trees, berry bushes, stone, grass tufts
- Birds circling high over the valley
- Day and night with a real sky model
- Warmth near a campfire; rest by the fire through the night
- Soil beds you place, water, and grow three crops (leaf greens, roots, grain)
- Fishing at the Slow Bend — stand by the still water, drink if you need, then wait on a line
- Local feel of a quiet piece of ground

Walk southwest from the clearing, up High Spine, to reach the terrace.

## Project

| File | Role |
| --- | --- |
| `index.html` | Shell and HUD |
| `js/game.js` | Play loop, gather, build, rest, farm, fish |
| `js/world.js` | Ground, trees, places, birds, ridges |
| `js/bend.js` | The Slow Bend |
| `ROADMAP.md` | What gets built next |
| `LICENSE` | MIT |

Graphics are generated in code on purpose. No block world, no downloaded character pack. The look is “game-real,” not photograph-real.

## Live play (GitHub Pages)

Pages is not enabled from this account (repository Settings cannot be flipped by the file API). The owner should turn it on with these clicks:

1. Open https://github.com/sphangcho203-afk/wildmere
2. **Settings** (top tab)
3. Left sidebar, under **Code and automation**, click **Pages**
4. **Build and deployment** → **Source** → **Deploy from a branch**
5. Branch: **main**
6. Folder: **/ (root)**
7. **Save**

After a minute or two the valley will be at `https://sphangcho203-afk.github.io/wildmere/`. Add that URL at the top of this README once it loads.

## License

MIT. Take it, fork it, keep walking.
