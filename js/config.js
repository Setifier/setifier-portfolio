let currentScreen = 'welcome';
let threeScene, threeCamera, threeRenderer;
let planets = [];
let raycaster, mouse;
let hoveredPlanet = null;
let selectedPlanet = null;

let universeScene, universeCamera, universeRenderer, universeAnimationId;
let projectCubes = [];

const exploredProjects = new Set();

const universesData = [
  {
    id: 'dev',
    name: 'DEV WORLD',
    description: 'Web & Mobile Development - Full Stack Projects',
    position: { x: -30, y: -3, z: 10 },
    color: 0x86cabf,
    glowColor: 0x86cabf,
    emissive: 0x003344,
    size: 5
  },
  {
    id: 'design',
    name: 'DESIGN PLANET',
    description: 'UI/UX Design - Brand Identity - Creative Solutions',
    position: { x: 30, y: 4, z: 5 },
    color: 0xc180a1,
    glowColor: 0xc180a1,
    emissive: 0x330022,
    size: 6.5
  },
  {
    id: 'arts',
    name: 'ARTS STATION',
    description: 'Digital Art - Illustrations - Creative Expression',
    position: { x: 25, y: -16, z: -15 },
    color: 0x8dbdc5,
    glowColor: 0x8dbdc5,
    emissive: 0x442211,
    size: 5
  },
  {
    id: 'game',
    name: 'GAME EARTH',
    description: 'Game Development - Interactive Experiences - The Dream',
    position: { x: -20, y: -18, z: -20 },
    color: 0xb084b1,
    glowColor: 0xb084b1,
    emissive: 0x220044,
    size: 5
  }
];
