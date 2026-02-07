import * as State from './state.js';
import { emit } from './events.js';
import { WELCOME } from './constants.js';
import { initTips, startUniverseTips, stopHomeTips } from './tips.js';
import { createWelcomeStars } from './welcome-effects.js';
import { selectPlanet, deselectPlanet, goToUniverse } from './planet-interaction.js';
import { exitUniverseContent } from './universe-content.js';

export function initWelcomeScreen() {
  const newGameBtn = document.getElementById('new-game-btn');
  const optionsBtn = document.getElementById('options-btn');

  createWelcomeStars();
  initTips();

  if (newGameBtn) {
    newGameBtn.addEventListener('click', () => {
      transitionToUniverseScreen();
    });
  }

  if (optionsBtn) {
    optionsBtn.addEventListener('click', () => {
      transitionToOptionsScreen();
    });
  }
}

export function initUniverseButtons() {
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
      const selected = State.get('selectedPlanet');
      if (selected) {
        goToUniverse(selected.data.id);
      }
    });
  }
}

export function initCloseButtons() {
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

function transitionToUniverseScreen() {
  const welcomeScreen = document.getElementById('welcome-screen');
  const universeScreen = document.getElementById('universe-screen');

  welcomeScreen.classList.remove('active');
  welcomeScreen.classList.add('hidden');

  // Stop home tips to prevent interval leak
  stopHomeTips();

  setTimeout(() => {
    welcomeScreen.style.display = 'none';
    universeScreen.classList.add('active');
    State.set('currentScreen', 'universe');

    startUniverseTips();

    // Only initialize the 3D scene once
    if (!State.get('threeRenderer')) {
      emit('scene:init');
    }
  }, WELCOME.transitionDuration);
}

function transitionToOptionsScreen() {
  const welcomeScreen = document.getElementById('welcome-screen');
  const optionsScreen = document.getElementById('options-screen');

  welcomeScreen.classList.add('hidden');

  setTimeout(() => {
    welcomeScreen.style.display = 'none';
    optionsScreen.classList.add('active');
    State.set('currentScreen', 'options');
  }, WELCOME.transitionDuration);
}

function backToHome() {
  const universeScreen = document.getElementById('universe-screen');
  const welcomeScreen = document.getElementById('welcome-screen');

  if (State.get('currentScreen') === 'content') {
    exitUniverseContent();
  } else {
    universeScreen.classList.remove('active');

    setTimeout(() => {
      welcomeScreen.style.display = 'flex';
      welcomeScreen.classList.remove('hidden');
      State.set('currentScreen', 'welcome');
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
    State.set('currentScreen', 'welcome');
  }, 500);
}
