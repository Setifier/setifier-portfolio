function initWelcomeScreen() {
  const newGameBtn = document.getElementById('new-game-btn');
  const optionsBtn = document.getElementById('options-btn');

  createWelcomeStars();
  initTips();

  if (newGameBtn) {
    newGameBtn.addEventListener('click', () => {
      console.log('🚀 Starting Game...');
      transitionToUniverseScreen();
    });
  }

  if (optionsBtn) {
    optionsBtn.addEventListener('click', () => {
      console.log('⚙️ Options clicked...');
      transitionToOptionsScreen();
    });
  }
}

const homeTips = [
  "To learn more about me, head to the Options.",
  "Click on Options for additional information.",
  "Press New Game to explore my creative universes.",
  "Click on NEW GAME to choose your field and discover the projects.",
];

const universeTips = [
  "Each planet represents a different creative universe.",
  "Hover over the planets to discover their name.",
  "Click on a planet or a button to select it.",
  "Explore each universe to discover my projects.",
];

let homeTipInterval = null;
let universeTipInterval = null;

function initTips() {
  startTipRotation('tip-text', homeTips, 'home');
}

function startUniverseTips() {
  startTipRotation('universe-tip-text', universeTips, 'universe');
}

function stopUniverseTips() {
  if (universeTipInterval) {
    clearInterval(universeTipInterval);
    universeTipInterval = null;
  }
}

function pickRandomTip(tipsArray, currentIndex) {
  if (tipsArray.length <= 1) return 0;
  let next;
  do {
    next = Math.floor(Math.random() * tipsArray.length);
  } while (next === currentIndex);
  return next;
}

function startTipRotation(elementId, tipsArray, type) {
  const tipText = document.getElementById(elementId);
  if (!tipText) return;
  const container = tipText.closest('.tip-container');

  let currentTip = Math.floor(Math.random() * tipsArray.length);
  tipText.textContent = tipsArray[currentTip];
  container.classList.remove('fade-in', 'fade-out');

  setTimeout(() => {
    container.classList.add('fade-in');
  }, 50);

  const interval = setInterval(() => {
    container.classList.remove('fade-in');
    container.classList.add('fade-out');
    setTimeout(() => {
      currentTip = pickRandomTip(tipsArray, currentTip);
      tipText.textContent = tipsArray[currentTip];
      container.classList.remove('fade-out');
      container.classList.add('fade-in');
    }, 2000);
  }, 10000);

  if (type === 'home') homeTipInterval = interval;
  if (type === 'universe') universeTipInterval = interval;
}

function createWelcomeStars() {
  const starsContainer = document.querySelector('.stars-background');
  if (!starsContainer) return;

  starsContainer.innerHTML = ''; // Clear in case
  for (let i = 0; i < 400; i++) {
    const star = document.createElement('div');
    star.className = 'welcome-star';
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    const opacity = Math.random() * 0.5 + 0.3;
    const duration = Math.random() * 3 + 2;

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.opacity = opacity;
    star.style.animationDuration = `${duration}s`;

    starsContainer.appendChild(star);
  }
}

function transitionToUniverseScreen() {
  const welcomeScreen = document.getElementById('welcome-screen');
  const universeScreen = document.getElementById('universe-screen');

  welcomeScreen.classList.remove('active');
  welcomeScreen.classList.add('hidden');


  setTimeout(() => {
    welcomeScreen.style.display = 'none';
    universeScreen.classList.add('active');
    currentScreen = 'universe';

    startUniverseTips();

    // The 3D scene should only be initialized once
    if (!threeRenderer) {
      initThreeScene();
    }
  }, 1000);
}

function transitionToOptionsScreen() {
  const welcomeScreen = document.getElementById('welcome-screen');
  const optionsScreen = document.getElementById('options-screen');

  welcomeScreen.classList.add('hidden');

  setTimeout(() => {
    welcomeScreen.style.display = 'none';
    optionsScreen.classList.add('active');
    currentScreen = 'options';
  }, 1000);
}

function initUniverseButtons() {
  const buttons = document.querySelectorAll('.universe-btn');
  const enterBtn = document.getElementById('enter-universe-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const universeId = btn.getAttribute('data-universe');
      selectPlanet(universeId);
    });
  });

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      if (selectedPlanet) {
        goToUniverse(selectedPlanet.data.id);
      }
    });
  }
}

function initCloseButtons() {
  const closeBtn = document.querySelector('.close-modal-btn');
  const backHomeBtn = document.getElementById('back-to-home-btn');
  const optionsBackBtn = document.getElementById('options-back-btn');

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deselectPlanet();
    });
  }
  
  if (backHomeBtn) {
    backHomeBtn.addEventListener('click', () => {
      backToHome();
    });
  }

  if (optionsBackBtn) {
    optionsBackBtn.addEventListener('click', () => {
      backToWelcomeFromOptions();
    });
  }
}

function backToHome() {
  const universeScreen = document.getElementById('universe-screen');
  const welcomeScreen = document.getElementById('welcome-screen');
  
  if (currentScreen === 'content') {
    exitUniverseContent();
  } else {
    universeScreen.classList.remove('active');

    setTimeout(() => {
        welcomeScreen.style.display = 'flex';
        welcomeScreen.classList.remove('hidden');
        currentScreen = 'welcome';
    }, 500);
  }
}

function backToWelcomeFromOptions() {
    const optionsScreen = document.getElementById('options-screen');
    const welcomeScreen = document.getElementById('welcome-screen');

    optionsScreen.classList.remove('active');

    setTimeout(() => {
        welcomeScreen.style.display = 'flex';
        welcomeScreen.classList.remove('hidden');
        currentScreen = 'welcome';
    }, 500);
}
function onMouseMove(event) {
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onPlanetHover(planetMesh) {
  hoveredPlanet = planetMesh;
  document.body.style.cursor = 'pointer';

  const planet = planets.find(p => p.mesh === planetMesh);
  if (planet) {
    planet.glow.material.opacity = 0.4;
    planet.glow.scale.set(1.1, 1.1, 1.1);
    showTooltip(planet.mesh.userData.name);
  }
}

function onPlanetLeave() {
  if (hoveredPlanet) {
    const planet = planets.find(p => p.mesh === hoveredPlanet);
    if (planet && planet !== selectedPlanet) {
        planet.glow.material.opacity = 0.2;
        planet.glow.scale.set(1, 1, 1);
    }
  }
  hoveredPlanet = null;
  document.body.style.cursor = 'default';
  hideTooltip();
}

function onPlanetClick(event) {
  if (hoveredPlanet) {
    const universeId = hoveredPlanet.userData.id;
    console.log(`🪐 Selecting ${universeId} planet...`);
    selectPlanet(universeId);
  } else {
    // If we click in the void, we deselect
    const modal = document.getElementById('selection-modal');
    if (modal.classList.contains('visible')) {
        deselectPlanet();
    }
  }
}

function selectPlanet(universeId) {
  const planet = planets.find(p => p.data.id === universeId);
  if (!planet || planet === selectedPlanet) return;

  selectedPlanet = planet;

  document.querySelectorAll('.universe-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-universe="${universeId}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  planets.forEach(p => {
    p.glow.material.opacity = 0.2;
    p.glow.scale.set(1, 1, 1);
  });

  planet.glow.material.opacity = 0.5;
  planet.glow.scale.set(1.15, 1.15, 1.15);

  const planetPos = planet.mesh.position;
  const offsetX = planetPos.x > 0 ? -8 : 8;
  const offsetY = -planetPos.y * 0.1;
  const absX = Math.abs(planetPos.x);
  const absY = Math.abs(planetPos.y);
  let offsetZ = Math.max(45, absX * 1.8, absY * 1.5);

  let zoomAdjustment = 0, xAdjustment = 0, yAdjustment = 0;
  switch(universeId) {
    case 'dev': zoomAdjustment = -8; xAdjustment = -4; break;
    case 'design': yAdjustment = 4; break;
    case 'arts': zoomAdjustment = -15; xAdjustment = -6; break;
    case 'game': zoomAdjustment = -18; xAdjustment = 18; break;
  }

  const targetPos = new THREE.Vector3(offsetX + xAdjustment, offsetY + yAdjustment, offsetZ + zoomAdjustment);
  animateCamera(targetPos);

  showSelectionModal(planet.data.name, planet.data.description);
  showConnectionLine(planet);
}

function deselectPlanet() {
  if (!selectedPlanet) return;
  selectedPlanet = null;

  document.querySelectorAll('.universe-btn').forEach(btn => btn.classList.remove('active'));

  planets.forEach(p => {
    p.glow.material.opacity = 0.2;
    p.glow.scale.set(1, 1, 1);
  });
  
  if (hoveredPlanet) {
    const planet = planets.find(p => p.mesh === hoveredPlanet);
    if(planet) {
        planet.glow.material.opacity = 0.4;
        planet.glow.scale.set(1.1, 1.1, 1.1);
    }
  }

  const originalPos = new THREE.Vector3(0, 0, 50);
  animateCamera(originalPos);

  hideSelectionModal();
  hideConnectionLine();
}

function showTooltip(name) {
  const tooltip = document.getElementById('planet-tooltip');
  const tooltipName = document.getElementById('tooltip-name');
  tooltipName.textContent = name;
  tooltip.style.left = `${mouse.x * 50 + 50}%`;
  tooltip.style.top = `${-mouse.y * 50 + 50}%`;
  tooltip.classList.add('visible');
}

function hideTooltip() {
  const tooltip = document.getElementById('planet-tooltip');
  tooltip.classList.remove('visible');
}

function showSelectionModal(name, description) {
  const modal = document.getElementById('selection-modal');
  const modalName = document.getElementById('modal-universe-name');
  const modalDescription = document.getElementById('modal-universe-description');
  modalName.textContent = name;
  modalDescription.textContent = description;
  modal.classList.add('visible');
}

function hideSelectionModal() {
  const modal = document.getElementById('selection-modal');
  modal.classList.remove('visible');
}

function showConnectionLine(planet) {
  const line = document.getElementById('connection-line');
  line.classList.add('visible');
}

function hideConnectionLine() {
  const line = document.getElementById('connection-line');
  line.classList.remove('visible');
}

function updateConnectionLine() {
  if (!selectedPlanet) return;

  const vector = new THREE.Vector3();
  vector.copy(selectedPlanet.mesh.position);
  vector.project(threeCamera);

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

function goToUniverse(universeId) {
  console.log(`🌍 Loading ${universeId} universe...`);
  currentScreen = 'content';

  const universeScreen = document.getElementById('universe-screen');
  universeScreen.classList.remove('active');

  const universeContent = document.getElementById('universe-content');
  universeContent.style.display = 'block';

  setTimeout(() => {
    universeContent.style.opacity = '1';
    initUniverseContent(universeId);
  }, 300);
}

