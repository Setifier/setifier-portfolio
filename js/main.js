import "./three-scene.js";
import {
  initWelcomeScreen,
  initUniverseButtons,
  initCloseButtons,
} from "./screen-transitions.js";
import { initI18n } from "./i18n.js";

document.addEventListener("DOMContentLoaded", () => {
  initI18n();
  initWelcomeScreen();
  initUniverseButtons();
  initCloseButtons();
});
