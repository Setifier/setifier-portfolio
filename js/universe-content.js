import * as State from './state.js';
import { deselectPlanet } from './planet-interaction.js';
import { t, tProject, applyTranslations } from './i18n.js';

export async function initUniverseContent(universeId) {
  const universeContent = document.getElementById('universe-content');
  universeContent.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.className = 'universe-back-btn';
  backBtn.dataset.i18n = 'nav.backToPlanets';
  backBtn.textContent = t('nav.backToPlanets');
  backBtn.onclick = () => exitUniverseContent();
  universeContent.appendChild(backBtn);

  createProjectModal();

  switch (universeId) {
    case 'dev': {
      const { initDevWorld } = await import('./universe-dev.js');
      initDevWorld(universeContent);
      break;
    }
    case 'design': {
      const { initDesignPlanet } = await import('./universe-design.js');
      initDesignPlanet(universeContent);
      break;
    }
    case 'arts': {
      const { initArtsStation } = await import('./universe-arts.js');
      initArtsStation(universeContent);
      break;
    }
    case 'game': {
      const { initGameEarth } = await import('./universe-game.js');
      initGameEarth(universeContent);
      break;
    }
  }
}

export function exitUniverseContent() {
  State.set('currentScreen', 'universe');

  const animId = State.get('universeAnimationId');
  if (animId) {
    cancelAnimationFrame(animId);
    State.set('universeAnimationId', null);
  }

  const universeContent = document.getElementById('universe-content');
  universeContent.style.opacity = '0';

  setTimeout(() => {
    universeContent.style.display = 'none';
    universeContent.innerHTML = '';

    const universeScreen = document.getElementById('universe-screen');
    universeScreen.classList.add('active');

    deselectPlanet();
  }, 500);
}

function createProjectModal() {
  if (document.getElementById('project-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'project-modal';
  modal.className = 'project-modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <div class="modal-header">
        <img class="modal-image" src="" alt="Project">
        <div class="modal-header-text">
          <h2 class="modal-title"></h2>
          <p class="modal-short-desc"></p>
        </div>
      </div>
      <div class="modal-body">
        <div class="modal-section">
          <h3 data-i18n="modal.aboutProject">${t('modal.aboutProject')}</h3>
          <p class="modal-full-desc"></p>
        </div>
        <div class="modal-section">
          <h3 data-i18n="modal.technologies">${t('modal.technologies')}</h3>
          <div class="modal-tech-list"></div>
        </div>
      </div>
      <div class="modal-footer">
        <a class="modal-link-btn" href="#" target="_blank" rel="noopener noreferrer"></a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('.modal-close').addEventListener('click', closeProjectModal);
  modal.querySelector('.modal-overlay').addEventListener('click', closeProjectModal);
  modal.querySelector('.modal-content').addEventListener('click', (e) => e.stopPropagation());
}

// Track the last opened project to refresh the modal on language change
let _lastProject = null;
let _lastColor = null;
let _lastLayout = null;

export function openProjectModal(project, color, { onOpen, layout } = {}) {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  if (onOpen) {
    onOpen(project.id);
  }

  // Store for langchange refresh
  _lastProject = project;
  _lastColor = color;
  _lastLayout = layout ?? null;

  _populateModal(modal, project, color, layout);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function _populateModal(modal, project, color, layout) {
  const imagePath = project.image || project.thumbnail || 'assets/logo.png';
  const description = tProject(project, 'description') || t('modal.noDescription');
  const fullDescription = tProject(project, 'fullDescription') || description;

  modal.classList.remove('landscape-logo', 'design-layout');
  const modalImage = modal.querySelector('.modal-image');
  modalImage.src = imagePath;

  const detectOrientation = () => {
    if (modalImage.naturalWidth > modalImage.naturalHeight * 1.3) {
      modal.classList.add('landscape-logo');
    }
  };
  if (modalImage.complete && modalImage.naturalWidth) {
    detectOrientation();
  } else {
    modalImage.addEventListener('load', detectOrientation, { once: true });
  }

  modal.querySelector('.modal-title').textContent = project.title;
  modal.querySelector('.modal-short-desc').textContent = description;
  modal.querySelector('.modal-full-desc').textContent = fullDescription;

  // Re-translate static i18n labels inside the modal
  modal.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  const techList = modal.querySelector('.modal-tech-list');
  const allTechs = project.allTechnologies || project.technologies || [];
  if (allTechs.length > 0) {
    techList.parentElement.style.display = 'block';
    techList.innerHTML = allTechs.map(tech =>
      `<span class="modal-tech-badge" style="border-color: ${color}; color: ${color};">${tech}</span>`
    ).join('');
  } else {
    techList.parentElement.style.display = 'none';
  }

  const linkBtn = modal.querySelector('.modal-link-btn');
  const descSection = modal.querySelector('.modal-body .modal-section:first-child');
  descSection.classList.remove('expanded');
  linkBtn.onclick = null;

  if (layout === 'design') {
    modal.classList.add('design-layout');
    linkBtn.href = '#';
    linkBtn.style.display = 'block';
    linkBtn.style.background = color;
    linkBtn.style.borderColor = color;
    linkBtn.textContent = t('modal.moreDetails');
    linkBtn.onclick = (e) => {
      e.preventDefault();
      descSection.classList.toggle('expanded');
      linkBtn.textContent = descSection.classList.contains('expanded')
        ? t('modal.lessDetails') : t('modal.moreDetails');
    };
  } else if (project.link) {
    linkBtn.href = project.link;
    linkBtn.style.display = 'block';
    linkBtn.style.background = color;
    linkBtn.style.borderColor = color;
    linkBtn.textContent = t('modal.visitProject');
  } else {
    linkBtn.style.display = 'none';
  }

  modal.querySelector('.modal-content').style.setProperty('--accent-color', color);
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Refresh modal content when language changes (if the modal is open)
document.addEventListener('langchange', () => {
  const modal = document.getElementById('project-modal');
  if (!modal || !modal.classList.contains('active') || !_lastProject) return;
  _populateModal(modal, _lastProject, _lastColor, _lastLayout);
});

export function initPlaceholderUniverse(container, title, message) {
  const placeholderContainer = document.createElement('div');
  placeholderContainer.className = 'placeholder-container';
  placeholderContainer.innerHTML = `
    <h1 class="placeholder-title">${title}</h1>
    <p class="placeholder-message">${message}</p>
  `;
  container.appendChild(placeholderContainer);
}
