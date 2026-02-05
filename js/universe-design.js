import { openProjectModal, initPlaceholderUniverse } from './universe-content.js';
import { COLORS } from './constants.js';

export async function initDesignPlanet(container) {
  console.log('Initializing DESIGN PLANET...');

  const designPlanetContainer = document.createElement('div');
  designPlanetContainer.className = 'design-planet-container';

  let projectsData = [];
  try {
    const response = await fetch('data/brand-projects.json');
    if (!response.ok) throw new Error(`Brand projects: ${response.status}`);
    const data = await response.json();
    projectsData = data.projects;
  } catch (error) {
    console.error('Error loading design projects:', error);
    initPlaceholderUniverse(container, 'DESIGN PLANET', 'Error loading projects.');
    return;
  }

  // Safe: data from local JSON we control
  designPlanetContainer.innerHTML = `
    <div class="design-planet-background"></div>
    <div class="design-planet-content">
      <h1 class="design-planet-title">BRAND & LOGO DESIGN</h1>
      <div class="design-gallery">
        <div class="gallery-track">
          ${projectsData.map(project => `
            <div class="gallery-slide" data-id="${project.id}">
              <div class="slide-image-container">
                <img src="${project.image}" alt="${project.title}">
              </div>
              <div class="slide-content">
                <h2 class="slide-title">${project.title}</h2>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="gallery-nav">
          <button class="nav-arrow prev">&larr;</button>
          <button class="nav-arrow next">&rarr;</button>
        </div>
      </div>
    </div>
  `;
  container.appendChild(designPlanetContainer);

  const track = designPlanetContainer.querySelector('.gallery-track');
  const slides = Array.from(track.children);
  const nextButton = designPlanetContainer.querySelector('.nav-arrow.next');
  const prevButton = designPlanetContainer.querySelector('.nav-arrow.prev');

  let currentIndex = 0;

  // Recalculate on resize so the carousel stays aligned
  const getSlideWidth = () => slides[0].getBoundingClientRect().width;

  const moveToSlide = (targetIndex) => {
    track.style.transform = `translateX(-${getSlideWidth() * targetIndex}px)`;
    currentIndex = targetIndex;
  };

  nextButton.addEventListener('click', () => {
    moveToSlide((currentIndex + 1) % slides.length);
  });

  prevButton.addEventListener('click', () => {
    moveToSlide((currentIndex - 1 + slides.length) % slides.length);
  });

  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      openProjectModal(projectsData[index], COLORS.designAccent);
    });
  });
}
