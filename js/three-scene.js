import { state, universesData } from './config.js';
import { createAdvancedPlanetTextures } from './texture-generator.js';
import { onMouseMove, onPlanetClick, onPlanetHover, onPlanetLeave, updateConnectionLine } from './ui-handlers.js';

export function initThreeScene() {
  console.log('🌌 Initializing 3D Universe Scene...');

  const canvas = document.getElementById('three-canvas');

  // Scene setup
  state.threeScene = new THREE.Scene();
  state.threeScene.background = new THREE.Color(0x000000);

  // Camera setup
  state.threeCamera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
  );
  state.threeCamera.position.z = 50;

  // Renderer setup
  state.threeRenderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  state.threeRenderer.setSize(window.innerWidth, window.innerHeight);
  state.threeRenderer.setPixelRatio(window.devicePixelRatio);

  createStarfield();
  createPlanets();

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  state.threeScene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(10, 10, 10);
  state.threeScene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x4488ff, 0.6);
  fillLight.position.set(-10, -10, 5);
  state.threeScene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xff8844, 0.4);
  rimLight.position.set(0, -10, -10);
  state.threeScene.add(rimLight);

  // Initialize raycaster for interactions
  state.raycaster = new THREE.Raycaster();
  state.mouse = new THREE.Vector2();

  canvas.addEventListener('mousemove', onMouseMove, false);
  canvas.addEventListener('click', onPlanetClick, false);
  window.addEventListener('resize', onWindowResize, false);

  animate();

  console.log('✅ 3D Scene Ready!');
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

  const starGroups = [
    { count: 1000, size: 0.3, opacity: 0.6 },
    { count: 500, size: 0.8, opacity: 0.8 },
    { count: 200, size: 1.5, opacity: 1.0 }
  ];

  starGroups.forEach(group => {
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(group.count * 3);

    for (let i = 0; i < group.count * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 200;
      starPositions[i + 1] = (Math.random() - 0.5) * 200;
      starPositions[i + 2] = (Math.random() - 0.5) * 200;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({
      map: starTexture,
      size: group.size,
      transparent: true,
      opacity: group.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    state.threeScene.add(stars);
  });
}

function createPlanets() {
  console.log('🪐 Creating planets...');

  universesData.forEach((universeData) => {
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
      emissiveIntensity: 0.3
    });

    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.position.set(
      universeData.position.x,
      universeData.position.y,
      universeData.position.z
    );

    planetMesh.userData = {
      id: universeData.id,
      name: universeData.name,
      description: universeData.description,
      originalY: universeData.position.y,
      rotationSpeed: Math.random() * 0.002 + 0.001
    };

    state.threeScene.add(planetMesh);

    const glowGeometry = new THREE.SphereGeometry(planetSize + 0.5, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: universeData.glowColor,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.position.copy(planetMesh.position);
    state.threeScene.add(glowMesh);

    const planetLight = new THREE.PointLight(universeData.glowColor, 0.8, 30);
    planetLight.position.copy(planetMesh.position);
    state.threeScene.add(planetLight);

    let ring = null;
    let satellite = null;

    if (universeData.id === 'dev') {
      const ringGeometry = new THREE.RingGeometry(planetSize + 1.5, planetSize + 3, 64);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0x86cabf,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x003344,
        emissiveIntensity: 0.3
      });
      ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(planetMesh.position);
      ring.rotation.x = Math.PI / 2.5;
      state.threeScene.add(ring);
    }

    if (universeData.id === 'game') {
      const satellites = [];
      const sat1Geometry = new THREE.SphereGeometry(0.6, 16, 16);
      const sat1Material = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 0.6, metalness: 0.8, roughness: 0.2 });
      const satellite1 = new THREE.Mesh(sat1Geometry, sat1Material);
      const orbit1Radius = planetSize + 3.5;
      satellite1.position.set(planetMesh.position.x + orbit1Radius, planetMesh.position.y, planetMesh.position.z);
      satellite1.userData = { orbitRadius: orbit1Radius, orbitSpeed: 0.006, orbitAngle: 0, orbitTilt: 0.2, planetPos: planetMesh.position };
      state.threeScene.add(satellite1);
      satellites.push(satellite1);

      const sat2Geometry = new THREE.SphereGeometry(0.5, 16, 16);
      const sat2Material = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.6, metalness: 0.8, roughness: 0.2 });
      const satellite2 = new THREE.Mesh(sat2Geometry, sat2Material);
      const orbit2Radius = planetSize + 5.5;
      satellite2.position.set(planetMesh.position.x - orbit2Radius, planetMesh.position.y, planetMesh.position.z);
      satellite2.userData = { orbitRadius: orbit2Radius, orbitSpeed: 0.004, orbitAngle: Math.PI, orbitTilt: -0.3, planetPos: planetMesh.position };
      state.threeScene.add(satellite2);
      satellites.push(satellite2);
      satellite = satellites;
    }

    state.planets.push({ mesh: planetMesh, glow: glowMesh, light: planetLight, ring: ring, satellite: satellite, data: universeData });
  });

  console.log(`✅ ${state.planets.length} planets created!`);
}

let cameraTargetPos = new THREE.Vector3(0, 0, 50);

function animate() {
  requestAnimationFrame(animate);

  // Star rotation
  state.threeScene.children.forEach((child) => {
    if (child instanceof THREE.Points) {
      child.rotation.y += 0.00006;
      child.rotation.x += 0.00002;
    }
  });

  // Planet animation
  state.planets.forEach((planet) => {
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
  if (state.raycaster && state.mouse && state.currentScreen === 'universe') {
    state.raycaster.setFromCamera(state.mouse, state.threeCamera);
    const planetMeshes = state.planets.map(p => p.mesh);
    const intersects = state.raycaster.intersectObjects(planetMeshes);

    if (intersects.length > 0) {
      const newHoveredPlanet = intersects[0].object;
      if (state.hoveredPlanet !== newHoveredPlanet) {
        onPlanetHover(newHoveredPlanet);
      }
    } else if (state.hoveredPlanet) {
      onPlanetLeave();
    }
  }

  updateCamera();
  if (state.selectedPlanet) {
    updateConnectionLine();
  }

  if (state.threeRenderer && state.threeScene && state.threeCamera) {
    state.threeRenderer.render(state.threeScene, state.threeCamera);
  }
}

function onWindowResize() {
  if (state.threeCamera && state.threeRenderer) {
    state.threeCamera.aspect = window.innerWidth / window.innerHeight;
    state.threeCamera.updateProjectionMatrix();
    state.threeRenderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export function animateCamera(targetPos) {
  cameraTargetPos.copy(targetPos);
}

function updateCamera() {
  state.threeCamera.position.lerp(cameraTargetPos, 0.05);
}
