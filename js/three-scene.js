import * as State from './state.js';
import { UNIVERSES, SCENE, DEV_RING, GAME_SATELLITES } from './constants.js';
import { on } from './events.js';
import { createAdvancedPlanetTextures } from './texture-generator.js';
import { setupPlanetListeners, onPlanetHover, onPlanetLeave, updateConnectionLine } from './planet-interaction.js';

// Register event-bus listeners at module level so screen-transitions
// never needs to import this file directly (no circular deps).
on('scene:init', initThreeScene);
on('camera:move', (targetPos) => { cameraTargetPos.copy(targetPos); });

let cameraTargetPos = new THREE.Vector3(0, 0, SCENE.defaultCameraZ);
let resizeController = null;

function initThreeScene() {
  console.log('Initializing 3D Universe Scene...');

  const canvas = document.getElementById('three-canvas');

  State.set('threeScene', new THREE.Scene());
  State.get('threeScene').background = new THREE.Color(0x000000);

  State.set('threeCamera', new THREE.PerspectiveCamera(
    SCENE.fov,
    window.innerWidth / window.innerHeight,
    SCENE.near,
    SCENE.far,
  ));
  State.get('threeCamera').position.z = SCENE.defaultCameraZ;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  State.set('threeRenderer', renderer);

  createStarfield();
  createPlanets();

  const scene = State.get('threeScene');

  const ambientLight = new THREE.AmbientLight(0xffffff, SCENE.ambientIntensity);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, SCENE.mainLightIntensity);
  mainLight.position.set(10, 10, 10);
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x4488ff, SCENE.fillLightIntensity);
  fillLight.position.set(-10, -10, 5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xff8844, SCENE.rimLightIntensity);
  rimLight.position.set(0, -10, -10);
  scene.add(rimLight);

  State.set('raycaster', new THREE.Raycaster());
  State.set('mouse', new THREE.Vector2());

  setupPlanetListeners(canvas);

  // Use AbortController for cleanup
  if (resizeController) resizeController.abort();
  resizeController = new AbortController();
  window.addEventListener('resize', onWindowResize, { signal: resizeController.signal });

  animate();
  console.log('3D Scene Ready');
}

function createStarfield() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const starTexture = new THREE.CanvasTexture(canvas);
  const scene = State.get('threeScene');

  SCENE.starGroups.forEach(group => {
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(group.count * 3);

    for (let i = 0; i < group.count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * SCENE.starSpread;
      positions[i + 1] = (Math.random() - 0.5) * SCENE.starSpread;
      positions[i + 2] = (Math.random() - 0.5) * SCENE.starSpread;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      map: starTexture,
      size: group.size,
      transparent: true,
      opacity: group.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    scene.add(new THREE.Points(starGeometry, material));
  });
}

function createPlanets() {
  console.log('Creating planets...');
  const scene = State.get('threeScene');

  UNIVERSES.forEach((universeData) => {
    const planetSize = universeData.size || 5;
    const geometry = new THREE.SphereGeometry(planetSize, 64, 64);
    const textures = createAdvancedPlanetTextures(universeData.id, universeData.color);

    const material = new THREE.MeshStandardMaterial({
      map: textures.colorMap,
      normalMap: textures.normalMap,
      roughnessMap: textures.roughnessMap,
      roughness: textures.roughness,
      metalness: textures.metalness,
      emissive: universeData.emissive,
      emissiveIntensity: 0.3,
    });

    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.position.set(
      universeData.position.x,
      universeData.position.y,
      universeData.position.z,
    );

    planetMesh.userData = {
      id: universeData.id,
      name: universeData.name,
      description: universeData.description,
      originalY: universeData.position.y,
      rotationSpeed: Math.random() * 0.002 + 0.001,
    };

    scene.add(planetMesh);

    const glowGeometry = new THREE.SphereGeometry(planetSize + 0.5, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: universeData.glowColor,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.position.copy(planetMesh.position);
    scene.add(glowMesh);

    const planetLight = new THREE.PointLight(universeData.glowColor, SCENE.planetLightIntensity, SCENE.planetLightRange);
    planetLight.position.copy(planetMesh.position);
    scene.add(planetLight);

    let ring = null;
    let satellite = null;

    if (universeData.id === 'dev') {
      const ringGeometry = new THREE.RingGeometry(planetSize + DEV_RING.innerOffset, planetSize + DEV_RING.outerOffset, 64);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: DEV_RING.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
        metalness: 0.8,
        roughness: 0.2,
        emissive: DEV_RING.emissive,
        emissiveIntensity: 0.3,
      });
      ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(planetMesh.position);
      ring.rotation.x = DEV_RING.tiltX;
      scene.add(ring);
    }

    if (universeData.id === 'game') {
      const satellites = [];
      GAME_SATELLITES.forEach(cfg => {
        const satGeometry = new THREE.SphereGeometry(cfg.radius, 16, 16);
        const satMaterial = new THREE.MeshStandardMaterial({
          color: cfg.color,
          emissive: cfg.color,
          emissiveIntensity: 0.6,
          metalness: 0.8,
          roughness: 0.2,
        });
        const sat = new THREE.Mesh(satGeometry, satMaterial);
        const orbitRadius = planetSize + cfg.orbitOffset;
        sat.position.set(
          planetMesh.position.x + Math.cos(cfg.startAngle) * orbitRadius,
          planetMesh.position.y,
          planetMesh.position.z + Math.sin(cfg.startAngle) * orbitRadius,
        );
        sat.userData = {
          orbitRadius,
          orbitSpeed: cfg.speed,
          orbitAngle: cfg.startAngle,
          orbitTilt: cfg.tilt,
          planetPos: planetMesh.position,
        };
        scene.add(sat);
        satellites.push(sat);
      });
      satellite = satellites;
    }

    State.get('planets').push({
      mesh: planetMesh, glow: glowMesh, light: planetLight,
      ring, satellite, data: universeData,
    });
  });

  console.log(`${State.get('planets').length} planets created`);
}

function animate() {
  State.set('threeAnimationId', requestAnimationFrame(animate));

  const scene = State.get('threeScene');
  const planets = State.get('planets');

  // Slow star-field rotation
  scene.children.forEach((child) => {
    if (child instanceof THREE.Points) {
      child.rotation.y += SCENE.starRotationY;
      child.rotation.x += SCENE.starRotationX;
    }
  });

  planets.forEach((planet) => {
    planet.mesh.rotation.y += planet.mesh.userData.rotationSpeed;
    planet.glow.rotation.y += planet.mesh.userData.rotationSpeed;

    const time = Date.now() * 0.001;
    const floatOffset = Math.sin(time + planet.mesh.position.x) * 0.3;
    planet.mesh.position.y = planet.mesh.userData.originalY + floatOffset;
    planet.glow.position.y = planet.mesh.position.y;
    planet.light.position.y = planet.mesh.position.y;

    if (planet.ring) {
      planet.ring.position.y = planet.mesh.position.y;
      planet.ring.rotation.z += 0.001;
    }

    if (planet.satellite) {
      const satellites = Array.isArray(planet.satellite) ? planet.satellite : [planet.satellite];
      satellites.forEach(sat => {
        sat.userData.orbitAngle += sat.userData.orbitSpeed;
        const { orbitRadius, orbitAngle, orbitTilt } = sat.userData;
        sat.position.x = planet.mesh.position.x + Math.cos(orbitAngle) * orbitRadius;
        sat.position.z = planet.mesh.position.z + Math.sin(orbitAngle) * orbitRadius;
        sat.position.y = planet.mesh.position.y + Math.sin(orbitAngle) * orbitTilt;
        sat.rotation.y += 0.015;
        sat.rotation.x += 0.01;
      });
    }
  });

  // Hover detection
  const raycaster = State.get('raycaster');
  const mouse = State.get('mouse');
  if (raycaster && mouse && State.get('currentScreen') === 'universe') {
    raycaster.setFromCamera(mouse, State.get('threeCamera'));
    const planetMeshes = planets.map(p => p.mesh);
    const intersects = raycaster.intersectObjects(planetMeshes);

    if (intersects.length > 0) {
      const newHoveredPlanet = intersects[0].object;
      if (State.get('hoveredPlanet') !== newHoveredPlanet) {
        onPlanetHover(newHoveredPlanet);
      }
    } else if (State.get('hoveredPlanet')) {
      onPlanetLeave();
    }
  }

  updateCamera();
  if (State.get('selectedPlanet')) {
    updateConnectionLine();
  }

  const renderer = State.get('threeRenderer');
  const threeScene = State.get('threeScene');
  const camera = State.get('threeCamera');
  if (renderer && threeScene && camera) {
    renderer.render(threeScene, camera);
  }
}

function onWindowResize() {
  const camera = State.get('threeCamera');
  const renderer = State.get('threeRenderer');
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

function updateCamera() {
  State.get('threeCamera').position.lerp(cameraTargetPos, SCENE.cameraLerp);
}
