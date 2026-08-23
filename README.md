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
| Click | Lock mouse, enter the valley |
| WASD | Walk |
| Shift | Walk faster |
| Mouse | Look |
| Space | Small hop |
| E | Gather wood / berries / stone |
| Tab or Q | Cycle build piece |
| F | Place selected piece (post, wall, lean-to, fire) |
| G | Plant a berry bush (needs 1 berry) |
| 1 | Eat a berry |
| 2 | Drink — stand in the stream |
| C | Craft a hand axe (3 wood + 2 stone) |
| Z | Rest by a fire at night |
| K | Save |
| L | Load |
| Esc | Release mouse |

## What is in the valley

- A carved stream (Reedford Crossing) and a starting meadow (The Clearing)
- High ground (High Spine) and thicker timber (The Quiet Pines)
- Trees, berry bushes, stone
- Peaceful deer that wander and startle
- Day and night with a real sky model
- Fireflies after dusk
- Warmth near a campfire
- Planted bushes that grow
- A hand axe that gathers faster
- Local save

## Project

| File | Role |
| --- | --- |
| `index.html` | The whole playable world (for now) |
| `ROADMAP.md` | What gets built next |
| `LICENSE` | MIT |

Graphics are generated in code on purpose. No block world, no downloaded character pack. The look is “game-real,” not photograph-real.

## License

MIT. Take it, fork it, keep walking.
