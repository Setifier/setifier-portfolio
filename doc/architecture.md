# Architecture

## Module dependency graph

```
main.js
  ├── three-scene.js  (side-effect import)
  └── screen-transitions.js
        ├── tips.js
        ├── welcome-effects.js
        ├── planet-interaction.js ──► universe-content.js
        └── universe-content.js
              ├── universe-dev.js    (lazy)
              ├── universe-design.js (lazy)
              ├── universe-arts.js   (lazy)
              └── universe-game.js   (lazy)

three-scene.js
  ├── planet-interaction.js  (one-way)
  └── texture-generator.js

Shared (no circular deps):
  constants.js   ◄── imported by most modules
  events.js      ◄── pub/sub bus
  state.js       ◄── reactive store
```

## Key patterns

### Event bus (`events.js`)
Decouples modules that would otherwise create circular imports.
- `scene:init` — emitted by `screen-transitions`, listened by `three-scene`
- `camera:move` — emitted by `planet-interaction`, listened by `three-scene`

### Reactive state (`state.js`)
Centralised `get`/`set`/`subscribe` store replacing the previous bare mutable object.
All Three.js refs, screen state, and interval IDs live here.

### Screen flow
```
Welcome  ─► Universe Selection (3D)  ─► Universe Content
   │                │                         │
   ▼                ▼                         │
Options        Planet modal                   │
   │                │                         │
   └── back ◄───────┘◄────────────────────────┘
```

## File purposes

| File | Role |
|------|------|
| `main.js` | Entry point, DOMContentLoaded bootstrap |
| `constants.js` | All magic numbers, colors, timing, universe config |
| `events.js` | Minimal pub/sub: `on`, `off`, `emit` |
| `state.js` | Reactive store: `get`, `set`, `subscribe`, `pick` |
| `screen-transitions.js` | Welcome/options/universe screen transitions |
| `tips.js` | Tip rotation on welcome and universe screens |
| `welcome-effects.js` | DOM star generation on welcome screen |
| `planet-interaction.js` | Hover, click, select/deselect planets, connection line |
| `three-scene.js` | Three.js scene, planets, starfield, animation loop |
| `texture-generator.js` | Procedural PBR textures per planet type |
| `universe-content.js` | Loads universe sub-modules, project modal |
| `universe-dev.js` | Dev world project cards from JSON |
| `universe-design.js` | Design planet carousel from JSON |
| `universe-arts.js` | Arts placeholder |
| `universe-game.js` | Game placeholder |

## How to add a project

1. Add the project object to the matching JSON file in `data/`
2. Place images under `assets/images/<category>/`
3. The project will appear automatically on next load

## How to add a universe

1. Add an entry to `UNIVERSES` in `constants.js` (position, color, size)
2. Add camera offsets in `PLANET_CAMERA_OFFSETS`
3. Create `js/universe-<name>.js` exporting an `init` function
4. Add a `case` in `universe-content.js` switch
5. Add a button in `index.html` with `data-universe="<name>"`
6. Add CSS styles for the new universe button color in `styles.css`
