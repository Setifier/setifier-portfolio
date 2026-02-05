import './three-scene.js';
import { initWelcomeScreen, initUniverseButtons, initCloseButtons } from './screen-transitions.js';

document.addEventListener('DOMContentLoaded', () => {
  initWelcomeScreen();
  initUniverseButtons();
  initCloseButtons();
});
