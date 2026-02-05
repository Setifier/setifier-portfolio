// ---------------------
// Universe definitions
// ---------------------

export const UNIVERSES = [
  {
    id: 'dev',
    name: 'DEV WORLD',
    description: 'Web & Mobile Development - Full Stack Projects',
    position: { x: -30, y: -3, z: 10 },
    color: 0x86_ca_bf,
    glowColor: 0x86_ca_bf,
    emissive: 0x00_33_44,
    size: 5,
  },
  {
    id: 'design',
    name: 'DESIGN PLANET',
    description: 'UI/UX Design - Brand Identity - Creative Solutions',
    position: { x: 30, y: 4, z: 5 },
    color: 0xc1_80_a1,
    glowColor: 0xc1_80_a1,
    emissive: 0x33_00_22,
    size: 6.5,
  },
  {
    id: 'arts',
    name: 'ARTS STATION',
    description: 'Digital Art - Illustrations - Creative Expression',
    position: { x: 25, y: -16, z: -15 },
    color: 0x8d_bd_c5,
    glowColor: 0x8d_bd_c5,
    emissive: 0x44_22_11,
    size: 5,
  },
  {
    id: 'game',
    name: 'GAME EARTH',
    description: 'Game Development - Interactive Experiences - The Dream',
    position: { x: -20, y: -18, z: -20 },
    color: 0xb0_84_b1,
    glowColor: 0xb0_84_b1,
    emissive: 0x22_00_44,
    size: 5,
  },
];

// ---------------------
// Tips
// ---------------------

export const HOME_TIPS = [
  'To learn more about me, head to the Options.',
  'Click on Options for additional information.',
  'Press New Game to explore my creative universes.',
  'Click on NEW GAME to choose your field and discover the projects.',
];

export const UNIVERSE_TIPS = [
  'Each planet represents a different creative universe.',
  'Hover over the planets to discover their name.',
  'Click on a planet or a button to select it.',
  'Explore each universe to discover my projects.',
];

export const TIPS = {
  rotationInterval: 10_000,
  fadeDelay: 2_000,
  fadeInDelay: 50,
};

// ---------------------
// Welcome screen
// ---------------------

export const WELCOME = {
  starCount: 400,
  transitionDuration: 1_000,
};

// ---------------------
// Scene / camera
// ---------------------

export const SCENE = {
  fov: 75,
  near: 0.1,
  far: 1_000,
  defaultCameraZ: 50,
  starSpread: 200,
  starGroups: [
    { count: 1_000, size: 0.3, opacity: 0.6 },
    { count: 500, size: 0.8, opacity: 0.8 },
    { count: 200, size: 1.5, opacity: 1.0 },
  ],
  starRotationY: 0.00006,
  starRotationX: 0.00002,
  cameraLerp: 0.05,
  ambientIntensity: 0.4,
  mainLightIntensity: 1.2,
  fillLightIntensity: 0.6,
  rimLightIntensity: 0.4,
  planetLightIntensity: 0.8,
  planetLightRange: 30,
};

export const CAMERA = {
  defaultPosition: { x: 0, y: 0, z: 50 },
};

// Per-planet camera offset adjustments when selecting
export const PLANET_CAMERA_OFFSETS = {
  dev:    { zoom: -8, x: -4, y: 0 },
  design: { zoom: 0,  x: 0,  y: 4 },
  arts:   { zoom: -15, x: -6, y: 0 },
  game:   { zoom: -18, x: 18, y: 0 },
};

// ---------------------
// Glow defaults
// ---------------------

export const GLOW = {
  defaultOpacity: 0.2,
  hoverOpacity: 0.4,
  selectedOpacity: 0.5,
  defaultScale: 1,
  hoverScale: 1.1,
  selectedScale: 1.15,
};

// ---------------------
// Texture generation
// ---------------------

export const TEXTURE = {
  resolution: 1_024,
};

// ---------------------
// Color palette
// ---------------------

export const COLORS = {
  dev: '#86cabf',
  design: '#c180a1',
  arts: '#8dbdc5',
  game: '#b084b1',
  accent: '#8dbdc5',
  secondary: '#9e87be',
  accentAlt: '#96a7c5',
  highlight: '#da7586',
  designAccent: '#c180a1',
  // Cycling palette for dev project cards
  cardCycle: ['#86cabf', '#8dbdc5', '#96a7c5', '#9e87be', '#b084b1', '#c180a1'],
};

// ---------------------
// Dev planet ring / satellites
// ---------------------

export const DEV_RING = {
  color: 0x86_ca_bf,
  emissive: 0x00_33_44,
  innerOffset: 1.5,
  outerOffset: 3,
  tiltX: Math.PI / 2.5,
};

export const GAME_SATELLITES = [
  { radius: 0.6, color: 0xff_ff_00, orbitOffset: 3.5, speed: 0.006, tilt: 0.2, startAngle: 0 },
  { radius: 0.5, color: 0x00_ff_ff, orbitOffset: 5.5, speed: 0.004, tilt: -0.3, startAngle: Math.PI },
];
