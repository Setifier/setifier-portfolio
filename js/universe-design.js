async function initDesignPlanet(container) {
  console.log('🎨 Initializing DESIGN PLANET - Visual Gallery...');

  const designPlanetContainer = document.createElement('div');
  designPlanetContainer.className = 'design-planet-container';

  let projectsData = [];
  try {
    const response = await fetch('data/brand-projects.json');
    const data = await response.json();
    projectsData = data.projects[0].projects;
  } catch (error) {
    console.error('Error loading design projects:', error);
    initPlaceholderUniverse(container, 'DESIGN PLANET', 'Error loading projects.');
    return;
  }

  // Correcting image paths
  const correctImagePaths = {
    "karate": "assets/images/brand-projects/karate/logo_ESH_Karaté.png",
    "comite": "assets/images/brand-projects/comite/logo_cd57_rugby.png",
    "supernova": "assets/images/brand-projects/supernova/logo_supernova_music.png",
    "fench-touch": "assets/images/brand-projects/fench-touch/french_touch_vector.png",
  };

  projectsData.forEach(p => {
    if (correctImagePaths[p.id]) {
      p.image = correctImagePaths[p.id];
      p.thumbnail = correctImagePaths[p.id];
    }
  });

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
          <button class="nav-arrow prev">←</button>
          <button class="nav-arrow next">→</button>
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
  const slideWidth = slides[0].getBoundingClientRect().width;

  const moveToSlide = (targetIndex) => {
    track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
    currentIndex = targetIndex;
  };

  nextButton.addEventListener('click', () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    moveToSlide(nextIndex);
  });

  prevButton.addEventListener('click', () => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    moveToSlide(prevIndex);
  });

  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
        const project = projectsData[index];
        openProjectModal(project, '#c180a1');
    });
  });
}
