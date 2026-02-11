import { openProjectModal } from "./universe-content.js";
import { COLORS } from "./constants.js";

export function initDevWorld(container) {
  const devWorldContainer = document.createElement("div");
  devWorldContainer.className = "dev-world-container";
  devWorldContainer.innerHTML = `
    <div class="dev-world-background"></div>
    <div class="dev-world-content">
      <h1 class="dev-world-title">CHOOSE YOUR STAGE</h1>
      <h2 class="dev-section-title">WEB PROJECTS</h2>
      <div class="projects-grid" id="web-projects-grid"></div>
      <h2 class="dev-section-title">MOBILE PROJECTS</h2>
      <div class="projects-grid" id="mobile-projects-grid"></div>
    </div>
  `;
  container.appendChild(devWorldContainer);

  loadAllProjects();
}

async function loadAllProjects() {
  try {
    const [webResponse, mobileResponse] = await Promise.all([
      fetch("data/web-projects.json"),
      fetch("data/mobile-projects.json"),
    ]);

    if (!webResponse.ok) throw new Error(`Web projects: ${webResponse.status}`);
    if (!mobileResponse.ok)
      throw new Error(`Mobile projects: ${mobileResponse.status}`);

    const webData = await webResponse.json();
    const mobileData = await mobileResponse.json();

    createProjectCards(webData.projects, "web-projects-grid");
    createProjectCards(mobileData.projects, "mobile-projects-grid");
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

function createProjectCards(projectsData, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  projectsData.forEach((project, index) => {
    const color = COLORS.cardCycle[index % COLORS.cardCycle.length];
    const card = document.createElement("div");
    card.className = "project-card";
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.setProperty("--card-color", color);
    const logoSrc = project.thumbnail || project.image || "assets/logo.png";
    card.innerHTML = `
      <div class="project-card-banner" style="border-color: ${color};"><img src="${logoSrc}" alt="${project.title}" class="project-card-logo"></div>
      <div class="project-card-body">
        <h3 class="project-card-title">${project.title}</h3>
        <p class="project-card-description">${project.description}</p>
        <div class="project-card-tech">${project.technologies
          .slice(0, 4)
          .map(
            (tech) =>
              `<span class="tech-badge" style="border-color: ${color}; color: ${color};">${tech}</span>`,
          )
          .join("")}</div>
        <button class="project-card-btn" style="background: ${color}; border-color: ${color};">View Details &rarr;</button>
      </div>`;
    const logo = card.querySelector(".project-card-logo");
    logo.addEventListener("load", () => {
      if (logo.naturalWidth > logo.naturalHeight * 1.3) {
        logo.classList.add("landscape");
      }
    });
    card.addEventListener("click", () => {
      openProjectModal(project, color);
    });
    grid.appendChild(card);
  });
}
