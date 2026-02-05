# Slim Portfolio

A game-styled creative portfolio built with vanilla JavaScript and Three.js. Each planet represents a different skill universe (development, design, art, games).

## Tech stack

- **Vanilla JS** (ES modules, no bundler)
- **Three.js** (r128) for 3D planet selection
- **Procedural textures** via Canvas API
- **CSS custom properties** for theming

## Running locally

Open `index.html` in any modern browser. No build step required.

For local development with hot-reload you can use any static server:

```bash
npx serve .
```

## File structure

```
js/
  main.js               Entry point
  constants.js          All magic numbers, colors, config
  events.js             Pub/sub event bus
  state.js              Reactive store
  screen-transitions.js Screen navigation
  planet-interaction.js Planet hover/select/deselect
  three-scene.js        3D scene, animation loop
  tips.js               Rotating tip messages
  welcome-effects.js    Welcome screen stars
  texture-generator.js  Procedural planet textures
  universe-content.js   Universe loader + project modal
  universe-dev.js       Dev world project cards
  universe-design.js    Design planet carousel
  universe-arts.js      Arts placeholder
  universe-game.js      Game placeholder
data/                   Project data (flat JSON)
doc/architecture.md     Module graph and patterns
styles.css              Main styles with CSS variables
universe_styles.css     Universe-specific styles
```

See [doc/architecture.md](doc/architecture.md) for the full dependency graph and how to add content.

## Adding a project

1. Add the project object to the matching JSON file in `data/`
2. Place images under `assets/images/<category>/`
3. The project appears automatically on next load

## Adding a universe

See the step-by-step guide in [doc/architecture.md](doc/architecture.md#how-to-add-a-universe).
