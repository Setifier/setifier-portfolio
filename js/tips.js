import { HOME_TIPS, UNIVERSE_TIPS, TIPS } from './constants.js';
import * as State from './state.js';

export function initTips() {
  startTipRotation('tip-text', HOME_TIPS, 'home');
}

export function startUniverseTips() {
  startTipRotation('universe-tip-text', UNIVERSE_TIPS, 'universe');
}

export function stopUniverseTips() {
  const id = State.get('universeTipInterval');
  if (id) {
    clearInterval(id);
    State.set('universeTipInterval', null);
  }
}

export function stopHomeTips() {
  const id = State.get('homeTipInterval');
  if (id) {
    clearInterval(id);
    State.set('homeTipInterval', null);
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
  }, TIPS.fadeInDelay);

  const interval = setInterval(() => {
    container.classList.remove('fade-in');
    container.classList.add('fade-out');
    setTimeout(() => {
      currentTip = pickRandomTip(tipsArray, currentTip);
      tipText.textContent = tipsArray[currentTip];
      container.classList.remove('fade-out');
      container.classList.add('fade-in');
    }, TIPS.fadeDuration);
  }, TIPS.rotationInterval + TIPS.fadeDuration * 2);

  if (type === 'home') State.set('homeTipInterval', interval);
  if (type === 'universe') State.set('universeTipInterval', interval);
}
