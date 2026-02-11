import { openProjectModal, initPlaceholderUniverse } from './universe-content.js';
import { COLORS } from './constants.js';

function renderCards(projects, startIndex) {
  return projects.map((project, i) => `
    <div class="design-card" data-id="${project.id}" style="animation-delay: ${(startIndex + i) * 0.12}s">
      <div class="design-card-image">
        <img src="${project.image}" alt="${project.title}">
      </div>
      <div class="design-card-title">${project.title}</div>
    </div>
  `).join('');
}

function renderSection(title, projects, startIndex) {
  if (!projects.length) {
    return `
      <h2 class="design-section-title">${title}</h2>
      <div class="design-section-placeholder">Coming soon...</div>
    `;
  }
  return `
    <h2 class="design-section-title">${title}</h2>
    <div class="design-showcase">
      ${renderCards(projects, startIndex)}
    </div>
  `;
}

export async function initDesignPlanet(container) {
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

  const clientProjects = projectsData.filter(p => p.category === 'client');
  const personalProjects = projectsData.filter(p => p.category === 'personal');

  designPlanetContainer.innerHTML = `
    <div class="design-planet-background"></div>
    <div class="design-planet-content">
      <h1 class="design-planet-title">BRAND & LOGO DESIGN</h1>
      ${renderSection('Clients', clientProjects, 0)}
      ${renderSection('Personal Projects', personalProjects, clientProjects.length)}
    </div>
  `;
  container.appendChild(designPlanetContainer);

  const cards = designPlanetContainer.querySelectorAll('.design-card');
  cards.forEach(card => {
    const project = projectsData.find(p => p.id === card.dataset.id);
    card.addEventListener('click', () => {
      openProjectModal(project, COLORS.designAccent, { layout: 'design' });
    });
  });
}
