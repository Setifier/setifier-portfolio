import * as State from './state.js';
import { emit } from './events.js';
import { PLANET_CAMERA_OFFSETS, GLOW, CAMERA } from './constants.js';
import { initUniverseContent } from './universe-content.js';

let abortController = null;

export function setupPlanetListeners(canvas) {
  // Clean up previous listeners if re-initialized
  if (abortController) abortController.abort();
  abortController = new AbortController();
  const { signal } = abortController;

  canvas.addEventListener('mousemove', onMouseMove, { signal });
  canvas.addEventListener('click', onPlanetClick, { signal });
}

function onMouseMove(event) {
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  const mouse = State.get('mouse');
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

export function onPlanetHover(planetMesh) {
  State.set('hoveredPlanet', planetMesh);
  document.body.style.cursor = 'pointer';

  const planet = State.get('planets').find(p => p.mesh === planetMesh);
  if (planet) {
    planet.glow.material.opacity = GLOW.hoverOpacity;
    planet.glow.scale.set(GLOW.hoverScale, GLOW.hoverScale, GLOW.hoverScale);
    showTooltip(planet.mesh.userData.name);
  }
}

export function onPlanetLeave() {
  const hoveredPlanet = State.get('hoveredPlanet');
  if (hoveredPlanet) {
    const planet = State.get('planets').find(p => p.mesh === hoveredPlanet);
    if (planet && planet !== State.get('selectedPlanet')) {
      planet.glow.material.opacity = GLOW.defaultOpacity;
      planet.glow.scale.set(GLOW.defaultScale, GLOW.defaultScale, GLOW.defaultScale);
    }
  }
  State.set('hoveredPlanet', null);
  document.body.style.cursor = 'default';
  hideTooltip();
}

function onPlanetClick() {
  const hoveredPlanet = State.get('hoveredPlanet');
  if (hoveredPlanet) {
    const universeId = hoveredPlanet.userData.id;
    console.log(`Selecting ${universeId} planet...`);
    selectPlanet(universeId);
  } else {
    const modal = document.getElementById('selection-modal');
    if (modal.classList.contains('visible')) {
      deselectPlanet();
    }
  }
}

export function selectPlanet(universeId) {
  const planets = State.get('planets');
  const planet = planets.find(p => p.data.id === universeId);
  if (!planet || planet === State.get('selectedPlanet')) return;

  State.set('selectedPlanet', planet);

  document.querySelectorAll('.universe-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-universe="${universeId}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  planets.forEach(p => {
    p.glow.material.opacity = GLOW.defaultOpacity;
    p.glow.scale.set(GLOW.defaultScale, GLOW.defaultScale, GLOW.defaultScale);
  });

  planet.glow.material.opacity = GLOW.selectedOpacity;
  planet.glow.scale.set(GLOW.selectedScale, GLOW.selectedScale, GLOW.selectedScale);

  const planetPos = planet.mesh.position;
  const offsetX = planetPos.x > 0 ? -8 : 8;
  const offsetY = -planetPos.y * 0.1;
  const absX = Math.abs(planetPos.x);
  const absY = Math.abs(planetPos.y);
  let offsetZ = Math.max(45, absX * 1.8, absY * 1.5);

  const adj = PLANET_CAMERA_OFFSETS[universeId] || { zoom: 0, x: 0, y: 0 };

  const targetPos = new THREE.Vector3(
    offsetX + adj.x,
    offsetY + adj.y,
    offsetZ + adj.zoom,
  );
  emit('camera:move', targetPos);

  showSelectionModal(planet.data.name, planet.data.description);
  showConnectionLine();
}

export function deselectPlanet() {
  if (!State.get('selectedPlanet')) return;
  State.set('selectedPlanet', null);

  document.querySelectorAll('.universe-btn').forEach(btn => btn.classList.remove('active'));

  State.get('planets').forEach(p => {
    p.glow.material.opacity = GLOW.defaultOpacity;
    p.glow.scale.set(GLOW.defaultScale, GLOW.defaultScale, GLOW.defaultScale);
  });

  const hoveredPlanet = State.get('hoveredPlanet');
  if (hoveredPlanet) {
    const planet = State.get('planets').find(p => p.mesh === hoveredPlanet);
    if (planet) {
      planet.glow.material.opacity = GLOW.hoverOpacity;
      planet.glow.scale.set(GLOW.hoverScale, GLOW.hoverScale, GLOW.hoverScale);
    }
  }

  const originalPos = new THREE.Vector3(CAMERA.defaultPosition.x, CAMERA.defaultPosition.y, CAMERA.defaultPosition.z);
  emit('camera:move', originalPos);

  hideSelectionModal();
  hideConnectionLine();
}

export function updateConnectionLine() {
  const selectedPlanet = State.get('selectedPlanet');
  if (!selectedPlanet) return;

  const camera = State.get('threeCamera');
  const vector = new THREE.Vector3();
  vector.copy(selectedPlanet.mesh.position);
  vector.project(camera);

  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-(vector.y) * 0.5 + 0.5) * window.innerHeight;

  const modalX = window.innerWidth / 2;
  const modalY = window.innerHeight / 2;

  const lineElement = document.getElementById('line');
  lineElement.setAttribute('x1', x);
  lineElement.setAttribute('y1', y);
  lineElement.setAttribute('x2', modalX);
  lineElement.setAttribute('y2', modalY);
}

export function goToUniverse(universeId) {
  console.log(`Loading ${universeId} universe...`);
  State.set('currentScreen', 'content');

  const universeScreen = document.getElementById('universe-screen');
  universeScreen.classList.remove('active');

  const universeContent = document.getElementById('universe-content');
  universeContent.style.display = 'block';

  setTimeout(() => {
    universeContent.style.opacity = '1';
    initUniverseContent(universeId);
  }, 300);
}

// ---------------------
// DOM helpers (private)
// ---------------------

function showTooltip(name) {
  const tooltip = document.getElementById('planet-tooltip');
  const tooltipName = document.getElementById('tooltip-name');
  const mouse = State.get('mouse');
  tooltipName.textContent = name;
  tooltip.style.left = `${mouse.x * 50 + 50}%`;
  tooltip.style.top = `${-mouse.y * 50 + 50}%`;
  tooltip.classList.add('visible');
}

function hideTooltip() {
  document.getElementById('planet-tooltip').classList.remove('visible');
}

function showSelectionModal(name, description) {
  const modal = document.getElementById('selection-modal');
  document.getElementById('modal-universe-name').textContent = name;
  document.getElementById('modal-universe-description').textContent = description;
  modal.classList.add('visible');
}

function hideSelectionModal() {
  document.getElementById('selection-modal').classList.remove('visible');
}

function showConnectionLine() {
  document.getElementById('connection-line').classList.add('visible');
}

function hideConnectionLine() {
  document.getElementById('connection-line').classList.remove('visible');
}
