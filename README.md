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
| E | Gather wood / berries / stone · water soil · harvest crops · drink · fish at the Slow Bend · pick rowan berries · sip the willow pool · sip the honey bowl · pick thistle seeds · sip the clover cup · pick daisy heads · sip the rush dish · pick birch bark · sip the alder bowl · pick hazel nuts · pick maple seeds · pick aspen leaves · sip the cedar bowl · sip the spruce cup · pick yew berries · sip the elm dish · pick beech hulls · pick linden blooms · sip the poplar dish · pick ash keys · pick holly berries · pick walnut hulls · pick chestnut burrs · pick hawthorn blooms · sip the elder bowl · sip the juniper cup · pick mulberry berries · pick hornbeam keys · pick sycamore balls · pick crabapples |
| Tab or Q | Cycle build piece |
| F | Place selected piece (post, fire, cabin, soil bed) |
| G | Plant a crop in a soil bed (needs 1 berry) |
| R | Rest by a campfire (night: advances time to morning) |
| M | Open or close the field notebook |
| 1 | Eat |
| Esc | Release mouse |

## What is in the valley

- A carved stream (Reedford Crossing), the Slow Bend, and a starting meadow (The Clearing)
- High ground (High Spine) and a stone terrace past it, with thin grass and loose rock
- Thicker timber (The Quiet Pines)
- The Old Ring, the Moss Seat, the Wind Hollow, the Reed Step, the Low Cairn, the Shade Pool, the Split Oak, the Still Gate, the Wash Rock, the Lark Post, the Fern Stair, the Evening Bell, the Rowan Lean, the Willow Dip, the Honey Stone, the Thistle Seat, the Clover Pad, the Daisy Ring, the Rush Nest, the Birch Shelf, the Alder Nook, the Hazel Rest, the Maple Sill, the Aspen Lean, and the Cedar Bowl — quiet named places
- The Spruce Cup, the Yew Sill, the Elm Dish, the Beech Ledge, the Linden Seat, the Poplar Rest, the Ash Ledge, the Holly Rest, the Walnut Bench, the Chestnut Rest, the Hawthorn Bench, the Elder Bowl, the Juniper Cup, the Mulberry Rest, the Hornbeam Shelf, the Sycamore Seat, and the Crabapple Rest — quiet named places
- Trees, berry bushes, stone, grass tufts
- Birds circling high over the valley
- Day and night with a real sky model
- Passing rain that dims the light and waters soil beds
- Warmth near a campfire; rest by the fire through the night
- Soil beds you place, water, and grow three crops (leaf greens, roots, grain)
- Fishing at the Slow Bend — stand by the still water, drink if you need, then wait on a line
- A field notebook that fills in as you walk named ground

Walk southwest from the clearing, up High Spine, to reach the terrace.
Walk northwest from the clearing to the Wind Hollow — a low stone bowl and a scrap of cloth that moves.
Walk south along the stream from the clearing to the Reed Step — stones set in the shallow water.
Walk north from the clearing to the Shade Pool — still water, a fallen log, and a few reeds. Drink there if you need.
Walk east past the Quiet Well to the Split Oak — two trunks from one base and a low bench in the moss.
Walk a little north of the Slow Bend to the Still Gate — two posts and a fallen lintel in the grass.
Walk west of the clearing, toward the stream, to the Wash Rock — a flat stone, a paddle, a bucket, and cloth on a post.
Walk south of the clearing to the Lark Post — a thin post, three slats, and a stump. The slats tap when the air moves.
Walk northsouth of the clearing to the Fern Stair — three low moss steps and fronds that move in the air.
Walk southwest of the clearing toward High Spine to the Evening Bell — two posts, a small bronze, and a bench in the moss.
Walk a short way south of the clearing to the Rowan Lean — a thin tree that tips toward a stone seat. Red clusters hang. Press E for a few berries.
Walk southsouth of the clearing to the Willow Dip — a leaning willow, hanging strands, and a small pool at the roots. Press E for a sip.
Walk west-northwest of the clearing to the Honey Stone — a warm slab, a wooden bowl, gold drops on a post. Press E for a sip.
Walk north-northsouth of the clearing to the Thistle Seat — a low bench in the moss and purple heads that nod. Press E for a few seeds.
Walk east-northsouth of the clearing to the Clover Pad — a moss round, small leaves, a low stool, and a tin cup. Press E for a sip.
Walk south of the clearing, toward the Reed Step, to the Daisy Ring — white heads in a small circle and a low bench in the moss. Press E for a few daisy heads.
Walk east-southsouth of the clearing, toward the Quiet Well, to the Rush Nest — a fan of pale rushes, a low bench, and a stone dish. Press E for a sip.
Walk west-southwest of the clearing, toward the Old Ring, to the Birch Shelf — a pale leaning trunk, a stone shelf, and thin peels that lift. Press E for a curl of bark.
Walk a short way north of the clearing, toward the Slow Bend, to the Alder Nook — a dark trunk, hanging catkins, a low seat, and a stone bowl of rain. Press E for a sip.
Walk southsouth of the clearing, toward the Quiet Well, to the Hazel Rest — a small leaning tree, hanging nuts, and a low seat in the moss. Press E for a few nuts.
Walk a short way east-southsouth of the clearing to the Maple Sill — a leaning maple, warm leaves, a stone sill, and thin seeds that spin. Press E for a few seeds.
Walk southsouth of the clearing, toward the Moss Seat, to the Aspen Lean — a pale trunk, flickering leaves, a low seat, and a stone sill. Press E for a few leaves.
Walk west of the clearing, toward the Old Ring, to the Cedar Bowl — a dark cedar, small cones that lift, a low seat, and a stone bowl of rain. Press E for a sip.
Walk south of the clearing, toward the Slow Bend, to the Walnut Bench — a leaning walnut, green hulls, a low wooden bench, and a pale stone sill. Press E for a few hulls.
Walk north of the clearing, a little west, to the Chestnut Rest — a leaning chestnut, spiny burrs, a low wooden seat, and a pale stone sill. Press E for a few burrs.
Walk east-northeast of the clearing, toward the Quiet Well, to the Hawthorn Bench — a leaning hawthorn, pale blooms, a low wooden bench, and a pale stone sill. Press E for a few blooms.
Walk south-southwest of the clearing, toward the Reed Step, to the Elder Bowl — a dark elder, pale flower plates, a low wooden seat, and a stone bowl of rain. Press E for a sip.
Walk west of the clearing, a little south of the Old Ring path, to the Juniper Cup — a low juniper, blue berries, and a wooden cup of rain. Press E for a sip.
Walk east of the clearing, a little south of the Quiet Well, to the Mulberry Rest — a leaning mulberry, dark berries, a low wooden seat, and a pale stone sill. Press E for a few berries.

Walk west of the clearing, a little north of the stream path, to the Hornbeam Shelf — a fluted trunk, thin keys that lift, a low wooden shelf, and a pale stone sill. Press E for a few keys.
Walk east of the clearing, a little south, to the Sycamore Seat — a mottled trunk, round seed balls that lift, a low wooden seat, and a pale stone sill. Press E for a few balls.
Walk northwest of the clearing, a little west, to the Crabapple Rest — a leaning crabapple, small red fruits that lift, a low wooden seat, and a pale stone sill. Press E for a few crabapples.

## Project

| File | Role |
| --- | --- |
| `index.html` | Shell and HUD |
| `js/game.js` | Entry |
| `js/loop.js` | Valley spawn, landmarks, enterValley |
| `js/tick.js` | Walk / look / sky / rain tick |
| `js/boot-tick.js` | Phone pads, gather, farm, fish, rest |
| `js/world.js` | Ground, trees, places, birds, ridges |
| `js/fern.js` | The Fern Stair |
| `js/bell.js` | The Evening Bell |
| `js/rowan.js` | The Rowan Lean |
| `js/willow.js` | The Willow Dip |
| `js/honey.js` | The Honey Stone |
| `js/thistle.js` | The Thistle Seat |
| `js/clover.js` | The Clover Pad |
| `js/daisy.js` | The Daisy Ring |
| `js/rush.js` | The Rush Nest |
| `js/birch.js` | The Birch Shelf |
| `js/alder.js` | The Alder Nook |
| `js/hazel.js` | The Hazel Rest |
| `js/maple.js` | The Maple Sill |
| `js/aspen.js` | The Aspen Lean |
| `js/cedar.js` | The Cedar Bowl |
| `js/walnut.js` | The Walnut Bench |
| `js/chestnut.js` | The Chestnut Rest |
| `js/hawthorn.js` | The Hawthorn Bench |
| `js/elder.js` | The Elder Bowl |
| `js/juniper.js` | The Juniper Cup |
| `js/mulberry.js` | The Mulberry Rest |
| `js/hornbeam.js` | The Hornbeam Shelf |
| `js/sycamore.js` | The Sycamore Seat |
| `js/crabapple.js` | The Crabapple Rest |
| `js/shade.js` | The Shade Pool |
| `js/oak.js` | The Split Oak |
| `js/gate.js` | The Still Gate |
| `js/wash.js` | The Wash Rock |
| `js/lark.js` | The Lark Post |
| `js/weather.js` | Passing rain |
| `js/notebook.js` | Field notes that fill in by walking |
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
6. Folder: ** / (root)**
7. **Save**

After a minute or two the valley will be at `https://sphangcho203-afk.github.io/wildmere/`.

## License

MIT. Take it, fork it, keep walking.
