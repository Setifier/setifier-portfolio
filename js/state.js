// Reactive store replacing the bare mutable state object from config.js.
// Supports subscribe(key, cb) so modules react to changes without polling.

const store = {
  currentScreen: 'welcome',
  planets: [],
  hoveredPlanet: null,
  selectedPlanet: null,

  threeScene: null,
  threeCamera: null,
  threeRenderer: null,
  threeAnimationId: null,
  raycaster: null,
  mouse: null,

  universeScene: null,
  universeCamera: null,
  universeRenderer: null,
  universeAnimationId: null,
  projectCubes: [],

  homeTipInterval: null,
  universeTipInterval: null,

  exploredProjects: new Set(),
};

const subs = new Map();

export function get(key) {
  return store[key];
}

export function set(key, value) {
  const prev = store[key];
  store[key] = value;
  if (subs.has(key)) {
    for (const cb of subs.get(key)) cb(value, prev);
  }
}

export function subscribe(key, cb) {
  if (!subs.has(key)) subs.set(key, new Set());
  subs.get(key).add(cb);
  return () => subs.get(key).delete(cb);
}

// Return a plain object snapshot of selected keys
export function pick(...keys) {
  const out = {};
  for (const k of keys) out[k] = store[k];
  return out;
}
