import { WELCOME } from './constants.js';

export function createWelcomeStars() {
  const starsContainer = document.querySelector('.stars-background');
  if (!starsContainer) return;

  starsContainer.innerHTML = '';
  for (let i = 0; i < WELCOME.starCount; i++) {
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
