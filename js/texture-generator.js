import { TEXTURE } from './constants.js';

export function createAdvancedPlanetTextures(planetId, baseColor) {
  const size = TEXTURE.resolution;

  switch (planetId) {
    case 'dev':
      return createDevPBRTextures(size, baseColor);
    case 'design':
      return createDesignPBRTextures(size, baseColor);
    case 'arts':
      return createArtsPBRTextures(size, baseColor);
    case 'game':
      return createGamePBRTextures(size, baseColor);
    default:
      return createBasicPBRTextures(size, baseColor);
  }
}

// ============
// DEV PLANET
// ============

function createDevPBRTextures(size, baseColor) {
  // Color Map - hexagonal tech panels
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d');

  // Dark brushed metal background
  colorCtx.fillStyle = '#1a2a35';
  colorCtx.fillRect(0, 0, size, size);

  // Hexagonal tech grid
  const hexSize = 40;
  for (let y = 0; y < size; y += hexSize * 1.5) {
    for (let x = 0; x < size; x += hexSize * Math.sqrt(3)) {
      const offsetX =
        (y / (hexSize * 1.5)) % 2 === 0 ? 0 : (hexSize * Math.sqrt(3)) / 2;
      drawHexagon(colorCtx, x + offsetX, y, hexSize, '#2a4a5a', 2);

      // Randomly highlight some edges with cyan
      if (Math.random() > 0.7) {
        colorCtx.strokeStyle = '#86cabf';
        colorCtx.lineWidth = 2;
        colorCtx.stroke();
      }
    }
  }

  // Normal Map - pronounced hexagonal relief
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = normalCanvas.height = size;
  const normalCtx = normalCanvas.getContext('2d');
  normalCtx.fillStyle = '#8080ff';
  normalCtx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += hexSize * 1.5) {
    for (let x = 0; x < size; x += hexSize * Math.sqrt(3)) {
      const offsetX =
        (y / (hexSize * 1.5)) % 2 === 0 ? 0 : (hexSize * Math.sqrt(3)) / 2;

      // Radial gradient for convex relief
      const grd = normalCtx.createRadialGradient(
        x + offsetX, y, 0,
        x + offsetX, y, hexSize,
      );
      grd.addColorStop(0, '#ffffff');
      grd.addColorStop(0.7, '#a0a0ff');
      grd.addColorStop(1, '#404080');
      normalCtx.fillStyle = grd;
      drawHexagon(normalCtx, x + offsetX, y, hexSize);
      normalCtx.fill();
    }
  }

  // Roughness - mixed metal
  const roughnessCanvas = document.createElement('canvas');
  roughnessCanvas.width = roughnessCanvas.height = size;
  const roughnessCtx = roughnessCanvas.getContext('2d');
  roughnessCtx.fillStyle = '#303030';
  roughnessCtx.fillRect(0, 0, size, size);

  return {
    colorMap: new THREE.CanvasTexture(colorCanvas),
    normalMap: new THREE.CanvasTexture(normalCanvas),
    roughnessMap: new THREE.CanvasTexture(roughnessCanvas),
    normalScale: new THREE.Vector2(2, 2),
    roughness: 0.3,
    metalness: 0.9,
  };
}

function drawHexagon(ctx, x, y, size, fillStyle, strokeWidth) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const hx = x + size * Math.cos(angle);
    const hy = y + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeWidth) {
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

// ==============
// DESIGN PLANET
// ==============

function createDesignPBRTextures(size, baseColor) {
  // Color Map - geometric colored bands
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d');

  // Subtle gradient background
  const bgGrad = colorCtx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#3d1a2e');
  bgGrad.addColorStop(1, '#1a0d1f');
  colorCtx.fillStyle = bgGrad;
  colorCtx.fillRect(0, 0, size, size);

  // Clean diagonal colored bands
  const bandWidth = 80;
  const colors = ['#c180a1', '#b084b1', '#9e87be', '#c97d99'];
  for (let i = -size; i < size * 2; i += bandWidth) {
    const colorIndex = Math.floor((i + size) / bandWidth) % colors.length;
    const grd = colorCtx.createLinearGradient(i, 0, i + bandWidth, 0);
    grd.addColorStop(0, colors[colorIndex] + '00');
    grd.addColorStop(0.5, colors[colorIndex] + 'aa');
    grd.addColorStop(1, colors[colorIndex] + '00');
    colorCtx.fillStyle = grd;
    colorCtx.save();
    colorCtx.translate(size / 2, size / 2);
    colorCtx.rotate(Math.PI / 6);
    colorCtx.fillRect(i - size, -size, bandWidth, size * 3);
    colorCtx.restore();
  }

  // Sharp geometric circles
  colorCtx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 15; i++) {
    const grd = colorCtx.createRadialGradient(
      Math.random() * size, Math.random() * size, 0,
      Math.random() * size, Math.random() * size, 80,
    );
    grd.addColorStop(0, '#ff69b4aa');
    grd.addColorStop(1, '#ff69b400');
    colorCtx.fillStyle = grd;
    colorCtx.fillRect(0, 0, size, size);
  }
  colorCtx.globalCompositeOperation = 'source-over';

  // Normal Map - clean relief bands
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = normalCanvas.height = size;
  const normalCtx = normalCanvas.getContext('2d');
  normalCtx.fillStyle = '#8080ff';
  normalCtx.fillRect(0, 0, size, size);

  for (let i = -size; i < size * 2; i += bandWidth * 2) {
    const grd = normalCtx.createLinearGradient(i, 0, i + bandWidth, 0);
    grd.addColorStop(0, '#8080ff');
    grd.addColorStop(0.3, '#ffffff');
    grd.addColorStop(0.7, '#ffffff');
    grd.addColorStop(1, '#8080ff');
    normalCtx.fillStyle = grd;
    normalCtx.save();
    normalCtx.translate(size / 2, size / 2);
    normalCtx.rotate(Math.PI / 6);
    normalCtx.fillRect(i - size, -size, bandWidth, size * 3);
    normalCtx.restore();
  }

  // Roughness - glossy
  const roughnessCanvas = document.createElement('canvas');
  roughnessCanvas.width = roughnessCanvas.height = size;
  const roughnessCtx = roughnessCanvas.getContext('2d');
  roughnessCtx.fillStyle = '#202020';
  roughnessCtx.fillRect(0, 0, size, size);

  return {
    colorMap: new THREE.CanvasTexture(colorCanvas),
    normalMap: new THREE.CanvasTexture(normalCanvas),
    roughnessMap: new THREE.CanvasTexture(roughnessCanvas),
    normalScale: new THREE.Vector2(1.5, 1.5),
    roughness: 0.2,
    metalness: 0.4,
  };
}

// ============
// ARTS PLANET
// ============

function createArtsPBRTextures(size, baseColor) {
  // Color Map - canvas texture with paint strokes
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d');

  // Textured canvas background
  colorCtx.fillStyle = '#2a1810';
  colorCtx.fillRect(0, 0, size, size);

  // Canvas weave crosshatch
  colorCtx.strokeStyle = 'rgba(70, 40, 20, 0.3)';
  colorCtx.lineWidth = 1;
  for (let i = 0; i < size; i += 4) {
    colorCtx.beginPath();
    colorCtx.moveTo(i, 0);
    colorCtx.lineTo(i, size);
    colorCtx.stroke();
    colorCtx.beginPath();
    colorCtx.moveTo(0, i);
    colorCtx.lineTo(size, i);
    colorCtx.stroke();
  }

  // Broad expressive paint strokes
  const paletteColors = ['#8dbdc5', '#92b3c6', '#96a7c5', '#9e87be'];
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const w = Math.random() * 120 + 60;
    const h = Math.random() * 80 + 40;

    const grd = colorCtx.createLinearGradient(x, y, x + w, y + h);
    const col = paletteColors[Math.floor(Math.random() * paletteColors.length)];
    grd.addColorStop(0, col + 'dd');
    grd.addColorStop(0.5, col + 'aa');
    grd.addColorStop(1, col + '66');

    colorCtx.save();
    colorCtx.translate(x, y);
    colorCtx.rotate(Math.random() * Math.PI);
    colorCtx.fillStyle = grd;
    colorCtx.fillRect(0, 0, w, h);
    colorCtx.restore();
  }

  // Normal Map - thick impasto relief
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = normalCanvas.height = size;
  const normalCtx = normalCanvas.getContext('2d');
  normalCtx.fillStyle = '#8080ff';
  normalCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 40; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 60 + 30;

    const grd = normalCtx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, '#ffffff');
    grd.addColorStop(0.6, '#b0b0ff');
    grd.addColorStop(1, '#6060a0');
    normalCtx.fillStyle = grd;
    normalCtx.beginPath();
    normalCtx.arc(x, y, r, 0, Math.PI * 2);
    normalCtx.fill();
  }

  // Roughness - matte with variations
  const roughnessCanvas = document.createElement('canvas');
  roughnessCanvas.width = roughnessCanvas.height = size;
  const roughnessCtx = roughnessCanvas.getContext('2d');
  roughnessCtx.fillStyle = '#909090';
  roughnessCtx.fillRect(0, 0, size, size);

  return {
    colorMap: new THREE.CanvasTexture(colorCanvas),
    normalMap: new THREE.CanvasTexture(normalCanvas),
    roughnessMap: new THREE.CanvasTexture(roughnessCanvas),
    normalScale: new THREE.Vector2(2, 2),
    roughness: 0.85,
    metalness: 0.0,
  };
}

// ============
// GAME PLANET
// ============

function createGamePBRTextures(size, baseColor) {
  // Color Map - retro pixel art
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d');

  // Deep purple gaming gradient
  const bgGrad = colorCtx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2,
  );
  bgGrad.addColorStop(0, '#3a1a5f');
  bgGrad.addColorStop(0.7, '#2a1045');
  bgGrad.addColorStop(1, '#150a25');
  colorCtx.fillStyle = bgGrad;
  colorCtx.fillRect(0, 0, size, size);

  // Organized pixel block grid
  const blockSize = 35;
  const spacing = 5;
  const colors = ['#b084b1', '#c97d99', '#a586b9', '#9e87be'];

  for (let y = 0; y < size; y += blockSize + spacing) {
    for (let x = 0; x < size; x += blockSize + spacing) {
      if ((x / (blockSize + spacing) + y / (blockSize + spacing)) % 3 === 0) {
        const colorIndex = Math.floor(Math.random() * colors.length);

        const grd = colorCtx.createLinearGradient(x, y, x + blockSize, y + blockSize);
        grd.addColorStop(0, colors[colorIndex]);
        grd.addColorStop(1, colors[colorIndex] + '88');
        colorCtx.fillStyle = grd;
        colorCtx.fillRect(x, y, blockSize, blockSize);

        colorCtx.strokeStyle = '#ffffff44';
        colorCtx.lineWidth = 2;
        colorCtx.strokeRect(x, y, blockSize, blockSize);
      }
    }
  }

  // Horizontal neon scanlines
  colorCtx.strokeStyle = '#00ffff33';
  colorCtx.lineWidth = 2;
  for (let i = 0; i < size; i += 50) {
    colorCtx.beginPath();
    colorCtx.moveTo(0, i);
    colorCtx.lineTo(size, i);
    colorCtx.stroke();
  }

  const powerUpPositions = [];
  for (let i = 0; i < 20; i++) {
    const px = Math.floor(Math.random() * (size / 80)) * 80 + 40;
    const py = Math.floor(Math.random() * (size / 80)) * 80 + 40;

    const glowGrad = colorCtx.createRadialGradient(px, py, 0, px, py, 20);
    glowGrad.addColorStop(0, '#ffff00');
    glowGrad.addColorStop(0.4, '#ffcc00aa');
    glowGrad.addColorStop(1, '#ffcc0000');
    colorCtx.fillStyle = glowGrad;
    colorCtx.fillRect(px - 20, py - 20, 40, 40);

    colorCtx.fillStyle = '#ffffff';
    colorCtx.fillRect(px - 8, py - 8, 16, 16);

    powerUpPositions.push({ x: px, y: py });
  }

  // Normal Map - pronounced block relief
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = normalCanvas.height = size;
  const normalCtx = normalCanvas.getContext('2d');
  normalCtx.fillStyle = '#8080ff';
  normalCtx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += blockSize + spacing) {
    for (let x = 0; x < size; x += blockSize + spacing) {
      if ((x / (blockSize + spacing) + y / (blockSize + spacing)) % 3 === 0) {
        const grd = normalCtx.createLinearGradient(x, y, x + blockSize, y + blockSize);
        grd.addColorStop(0, '#ffffff');
        grd.addColorStop(0.5, '#c0c0ff');
        grd.addColorStop(1, '#5050a0');
        normalCtx.fillStyle = grd;
        normalCtx.fillRect(x, y, blockSize, blockSize);
      }
    }
  }

  powerUpPositions.forEach((pos) => {
    const grd = normalCtx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 18);
    grd.addColorStop(0, '#ffffff');
    grd.addColorStop(0.6, '#b0b0ff');
    grd.addColorStop(1, '#6060a0');
    normalCtx.fillStyle = grd;
    normalCtx.beginPath();
    normalCtx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
    normalCtx.fill();
  });

  // Roughness - glossy arcade plastic
  const roughnessCanvas = document.createElement('canvas');
  roughnessCanvas.width = roughnessCanvas.height = size;
  const roughnessCtx = roughnessCanvas.getContext('2d');
  roughnessCtx.fillStyle = '#404040';
  roughnessCtx.fillRect(0, 0, size, size);

  return {
    colorMap: new THREE.CanvasTexture(colorCanvas),
    normalMap: new THREE.CanvasTexture(normalCanvas),
    roughnessMap: new THREE.CanvasTexture(roughnessCanvas),
    normalScale: new THREE.Vector2(2.5, 2.5),
    roughness: 0.25,
    metalness: 0.6,
  };
}

function createBasicPBRTextures(size, baseColor) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  const color = new THREE.Color(baseColor);
  ctx.fillStyle = color.getStyle();
  ctx.fillRect(0, 0, size, size);

  return {
    colorMap: new THREE.CanvasTexture(canvas),
    normalMap: null,
    roughnessMap: null,
    normalScale: new THREE.Vector2(1, 1),
    roughness: 0.5,
    metalness: 0.5,
  };
}
