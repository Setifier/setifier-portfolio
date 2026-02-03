function initDevWorld(container) {
  console.log('💻 Initializing DEV WORLD - Clean Interface...');

  const devWorldContainer = document.createElement('div');
  devWorldContainer.className = 'dev-world-container';
  devWorldContainer.innerHTML = `
    <div class="dev-world-background"></div>
    <div class="dev-world-content">
      <h1 class="dev-world-title">DEV PROJECTS</h1>
      <div class="mission-hud">
        <div class="mission-header">
          <div class="mission-icon">⚡</div>
          <div class="mission-text">
            <h2>MISSION BRIEFING</h2>
            <p>Explore all development projects to complete your mission</p>
          </div>
        </div>
        <div class="mission-stats">
          <div class="stat-item"><span class="stat-label">PROJECTS EXPLORED</span><span class="stat-value" id="projects-explored">0</span></div>
          <div class="stat-divider"></div>
          <div class="stat-item"><span class="stat-label">TOTAL MISSIONS</span><span class="stat-value" id="total-projects">0</span></div>
          <div class="stat-divider"></div>
          <div class="stat-item"><span class="stat-label">COMPLETION</span><span class="stat-value" id="completion-percentage">0%</span></div>
        </div>
        <div class="mission-progress"><div class="progress-bar"><div class="progress-fill" id="progress-fill"></div><div class="progress-glow"></div></div></div>
      </div>
      <div class="projects-grid" id="projects-grid"></div>
    </div>
  `;
  container.appendChild(devWorldContainer);

  createProjectCards();
}

async function createProjectCards() {
  let projectsData = [];
  try {
    const response = await fetch('data/web-projects.json');
    const data = await response.json();
    projectsData = data.projects[0].projects;
  } catch (error) {
    console.error('Error loading projects:', error);
    return;
  }

  updateMissionStats(projectsData.length);
  exploredProjects.clear();
  updateMissionProgress();

  const colors = ['#86cabf', '#8dbdc5', '#96a7c5', '#9e87be', '#b084b1', '#c180a1'];
  const grid = document.getElementById('projects-grid');

  projectsData.forEach((project, index) => {
    const color = colors[index % colors.length];
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.setProperty('--card-color', color);
    const logoSrc = project.thumbnail || project.image || 'assets/logo.png';
    card.innerHTML = `
      <div class="project-card-banner" style="border-color: ${color};"><img src="${logoSrc}" alt="${project.title}" class="project-card-logo"></div>
      <div class="project-card-body">
        <h3 class="project-card-title">${project.title}</h3>
        <p class="project-card-description">${project.description}</p>
        <div class="project-card-tech">${(project.technologies.slice(0, 4)).map(tech => `<span class="tech-badge" style="border-color: ${color}; color: ${color};">${tech}</span>`).join('')}</div>
        <button class="project-card-btn" style="background: ${color}; border-color: ${color};">View Details →</button>
      </div>`;
    card.addEventListener('click', () => {
      openProjectModal(project, color, {
        onOpen: (projectId) => {
          if (!exploredProjects.has(projectId)) {
            exploredProjects.add(projectId);
            updateMissionProgress();
          }
        }
      });
    });
    grid.appendChild(card);
  });
}

function updateMissionStats(totalProjects) {
  const totalEl = document.getElementById('total-projects');
  if (totalEl) totalEl.textContent = totalProjects;
}

function updateMissionProgress() {
  const exploredEl = document.getElementById('projects-explored');
  const totalEl = document.getElementById('total-projects');
  const percentageEl = document.getElementById('completion-percentage');
  const progressFill = document.getElementById('progress-fill');
  if(!totalEl || !exploredEl || !percentageEl || !progressFill) return;
  const explored = exploredProjects.size;
  const total = parseInt(totalEl.textContent) || 0;
  const percentage = total > 0 ? Math.round((explored / total) * 100) : 0;
  exploredEl.textContent = explored;
  percentageEl.textContent = `${percentage}%`;
  progressFill.style.width = `${percentage}%`;
  if (percentage === 100) {
    setTimeout(() => showMissionComplete(), 800);
  }
}

function showMissionComplete() {
  const missionHud = document.querySelector('.mission-hud');
  if (missionHud) missionHud.classList.add('mission-complete');
  const overlay = document.createElement('div');
  overlay.className = 'mission-complete-overlay';
  overlay.innerHTML = `<div class="mission-complete-content">...</div>`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('show'), 100);
  const closeOverlay = () => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 500);
  };
  setTimeout(closeOverlay, 5000);
  overlay.addEventListener('click', closeOverlay);
}
