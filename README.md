# Slim Portfolio

My personal portfolio, built as a game. Instead of a classic scrolling page, you land on a game menu, hit "New Game", and navigate a 3D space scene where each planet is a different area of my work.

## The idea

I wanted something that actually reflects who I am - I love games, I love building stuff, and I wanted recruiters/visitors to **explore** my work rather than just scroll past it. So I turned the whole thing into an interactive experience with Three.js.

Each planet has its own procedurally generated textures (hexagonal tech patterns for Dev, paint strokes for Arts, pixel blocks for Game...) and leads to a dedicated section showcasing related projects.

## What's under the hood

- **Vanilla JavaScript** with ES modules - no React, no framework, no bundler. Just the browser.
- **Three.js** for the 3D planet scene (raycasting, camera lerp, animated starfield)
- **Procedural PBR textures** generated at runtime with Canvas API (color maps, normal maps, roughness maps)
- **Custom event bus** and **reactive state store** to keep modules decoupled
- **Lazy-loaded universes** - each planet's content only loads when you enter it
- **CSS custom properties** for consistent theming across the whole thing
- **Data-driven content** - projects are stored in JSON files, the UI builds itself from that

## Architecture

The project went through a full refactoring from a single-file mess to a clean modular setup. The git history tells that story across 9 phases.

```
js/
  main.js               → Bootstrap
  constants.js          → Config, colors, magic numbers
  events.js             → Pub/sub event bus
  state.js              → Centralized reactive store
  screen-transitions.js → Screen navigation logic
  planet-interaction.js → Hover, click, select planets
  three-scene.js        → 3D scene setup + render loop
  texture-generator.js  → Procedural PBR texture generation
  universe-content.js   → Universe loader + project modal
  universe-dev.js       → Dev world (project cards)
  universe-design.js    → Design planet (showcase grid)
  tips.js               → Rotating tip messages
  welcome-effects.js    → Welcome screen star particles
data/                   → Project data as flat JSON
```

More details in [doc/architecture.md](doc/architecture.md) (dependency graph, patterns used, how to extend).

## Run it

No install, no build. Just serve the files:

```bash
npx serve .
```

Or open `index.html` directly in a browser.

## Add a project

1. Drop a JSON object into the right file under `data/`
2. Put images in `assets/images/<category>/`
3. Done - shows up on next load
