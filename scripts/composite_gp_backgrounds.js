import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceImagePath = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e/.user_uploaded/media_1789416468863.jpg';
const artifactDir = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e';
const publicIconsDir = path.resolve('./public/icons');

async function processGPBackgrounds() {
  console.log('Extracting logo emblem and compositing Play Store backgrounds...');

  // Step 1: Create an alpha mask from the black drawing on white background
  // Invert and use threshold/linear to get clean emblem mask
  const emblemMask = await sharp(sourceImagePath)
    .grayscale()
    .negate() // Black becomes white, white becomes black
    .linear(1.8, -40) // High contrast mask
    .png()
    .toBuffer();

  // Create White Emblem version on transparent background
  const whiteEmblem = await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .joinChannel(emblemMask)
  .png()
  .toBuffer();

  // Create Electric Blue Gradient Emblem
  const blueGradientSvg = `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="emblem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="50%" stop-color="#2563eb" />
        <stop offset="100%" stop-color="#1d4ed8" />
      </linearGradient>
    </defs>
    <rect width="1024" height="1024" fill="url(#emblem-grad)" />
  </svg>`;

  const blueEmblem = await sharp(Buffer.from(blueGradientSvg))
    .joinChannel(emblemMask)
    .png()
    .toBuffer();

  // =========================================================================
  // BACKGROUND 1 : CARBONE & ONDES SONAR BLEUES (Standard Google Play Store)
  // =========================================================================
  const bg1Svg = `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg-carbon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="45%" stop-color="#020617" />
        <stop offset="100%" stop-color="#08142c" />
      </linearGradient>
      <radialGradient id="coil-glow-blue" cx="50%" cy="58%" r="45%">
        <stop offset="0%" stop-color="#2563eb" stop-opacity="0.45" />
        <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#2563eb" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="gold-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fde047" />
        <stop offset="100%" stop-color="#f59e0b" />
      </radialGradient>
    </defs>

    <!-- Dark Carbon/Obsidian Background -->
    <rect width="1024" height="1024" fill="url(#bg-carbon)" />
    
    <!-- Concentric Radar Pulses centered on the coil (x: 512, y: 580) -->
    <circle cx="512" cy="580" r="420" fill="url(#coil-glow-blue)" />
    <circle cx="512" cy="580" r="360" stroke="rgba(255,255,255,0.06)" stroke-width="2" fill="none" stroke-dasharray="8 8" />
    <circle cx="512" cy="580" r="280" stroke="rgba(56,189,248,0.14)" stroke-width="2" fill="none" />
    <circle cx="512" cy="580" r="190" stroke="rgba(56,189,248,0.2)" stroke-width="2" fill="none" stroke-dasharray="6 6" />

    <!-- Subterranean Sonar Frequency Waves at Bottom -->
    <path d="M 200 860 Q 512 800 824 860" stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6" />
    <path d="M 280 910 Q 512 860 744 910" stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.35" />

    <!-- Gold Target Find in Coil Center Hub -->
    <circle cx="512" cy="582" r="22" fill="url(#gold-core)" />
    <circle cx="512" cy="582" r="38" stroke="url(#gold-core)" stroke-width="3" fill="none" opacity="0.7" />
  </svg>`;

  const buffer1 = await sharp(Buffer.from(bg1Svg))
    .composite([{ input: whiteEmblem, blend: 'over' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'gp_bg_1_carbon_sonar.png'), buffer1);
  fs.writeFileSync(path.join(publicIconsDir, 'gp_bg_1_carbon_sonar.png'), buffer1);
  console.log('✓ 1. Carbon Sonar Play Store background created');

  // =========================================================================
  // BACKGROUND 2 : COURBES TOPOGRAPHIQUES IGN (Expédition Outdoor)
  // =========================================================================
  const bg2Svg = `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg-topo-navy" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#071326" />
        <stop offset="50%" stop-color="#030914" />
        <stop offset="100%" stop-color="#0b1b36" />
      </linearGradient>
      <linearGradient id="gold-grad-b2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fde047" />
        <stop offset="100%" stop-color="#f59e0b" />
      </linearGradient>
    </defs>

    <rect width="1024" height="1024" fill="url(#bg-topo-navy)" />

    <!-- Flowing Topographic Contour Lines across the canvas -->
    <path d="M 0 220 Q 280 160 512 240 T 1024 180" stroke="rgba(255,255,255,0.08)" stroke-width="2.5" fill="none" />
    <path d="M 0 340 Q 320 280 512 360 T 1024 300" stroke="rgba(255,255,255,0.08)" stroke-width="2.5" fill="none" />
    <path d="M 0 460 Q 350 400 512 480 T 1024 420" stroke="rgba(255,255,255,0.08)" stroke-width="2.5" fill="none" />
    <path d="M 0 580 Q 380 520 512 600 T 1024 540" stroke="rgba(56,189,248,0.18)" stroke-width="3" fill="none" />
    <path d="M 0 700 Q 420 640 512 720 T 1024 660" stroke="rgba(245,158,11,0.22)" stroke-width="3" fill="none" />
    <path d="M 0 820 Q 450 760 512 840 T 1024 780" stroke="rgba(255,255,255,0.08)" stroke-width="2.5" fill="none" />
    <path d="M 0 940 Q 480 880 512 960 T 1024 900" stroke="rgba(255,255,255,0.08)" stroke-width="2.5" fill="none" />

    <!-- Center Gold Target Finder -->
    <circle cx="512" cy="582" r="24" fill="url(#gold-grad-b2)" />
    <circle cx="512" cy="582" r="42" stroke="url(#gold-grad-b2)" stroke-width="2.5" fill="none" opacity="0.6" stroke-dasharray="6 6" />
  </svg>`;

  const buffer2 = await sharp(Buffer.from(bg2Svg))
    .composite([{ input: whiteEmblem, blend: 'over' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'gp_bg_2_topography_ign.png'), buffer2);
  fs.writeFileSync(path.join(publicIconsDir, 'gp_bg_2_topography_ign.png'), buffer2);
  console.log('✓ 2. Topography IGN background created');

  // =========================================================================
  // BACKGROUND 3 : PURE WHITE STUDIO & HALO SAPHIR (Minimaliste & Épuré)
  // =========================================================================
  const bg3Svg = `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="soft-blue-halo" cx="50%" cy="58%" r="45%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35" />
        <stop offset="60%" stop-color="#2563eb" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="gold-spot" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#d97706" />
      </radialGradient>
    </defs>

    <!-- Pure White Base with delicate gradient -->
    <rect width="1024" height="1024" fill="#ffffff" />
    
    <!-- Subtle Radar Halo behind the coil -->
    <circle cx="512" cy="580" r="400" fill="url(#soft-blue-halo)" />
    <circle cx="512" cy="580" r="340" stroke="#e2e8f0" stroke-width="2.5" fill="none" stroke-dasharray="8 8" />
    <circle cx="512" cy="580" r="260" stroke="#dbeafe" stroke-width="2" fill="none" />

    <!-- Sonar Wave at bottom -->
    <path d="M 240 880 Q 512 820 784 880" stroke="#2563eb" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.6" />
    <path d="M 320 925 Q 512 875 704 925" stroke="#2563eb" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.3" />

    <!-- Center Gold Target -->
    <circle cx="512" cy="582" r="22" fill="url(#gold-spot)" />
  </svg>`;

  // For white background, we keep the original BLACK emblem
  const buffer3 = await sharp(Buffer.from(bg3Svg))
    .composite([{ input: sourceImagePath, blend: 'multiply' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'gp_bg_3_pure_white_halo.png'), buffer3);
  fs.writeFileSync(path.join(publicIconsDir, 'gp_bg_3_pure_white_halo.png'), buffer3);
  console.log('✓ 3. Pure White Halo background created');

  // =========================================================================
  // BACKGROUND 4 : HORIZON CRÉPUSCULE & MONTAGNES (Outdoor Adventure)
  // =========================================================================
  const bg4Svg = `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg-sunset-sky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0c182c" />
        <stop offset="40%" stop-color="#162c4e" />
        <stop offset="65%" stop-color="#9a3412" />
        <stop offset="85%" stop-color="#d97706" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
      <linearGradient id="mountain-front" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#090d16" />
      </linearGradient>
    </defs>

    <!-- Sky Gradient -->
    <rect width="1024" height="1024" fill="url(#bg-sunset-sky)" />

    <!-- Distant Mountain Silhouettes in the Background -->
    <polygon points="0,780 260,690 512,760 780,680 1024,750 1024,1024 0,1024" fill="#0b1322" opacity="0.7" />
    <polygon points="0,840 340,760 512,810 820,740 1024,800 1024,1024 0,1024" fill="url(#mountain-front)" />

    <!-- Gold Sun Disc behind Coil -->
    <circle cx="512" cy="580" r="180" fill="#fde047" opacity="0.3" />
    <circle cx="512" cy="582" r="22" fill="#fde047" />
  </svg>`;

  const buffer4 = await sharp(Buffer.from(bg4Svg))
    .composite([{ input: whiteEmblem, blend: 'over' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'gp_bg_4_sunset_mountains.png'), buffer4);
  fs.writeFileSync(path.join(publicIconsDir, 'gp_bg_4_sunset_mountains.png'), buffer4);
  console.log('✓ 4. Sunset Mountains background created');

  console.log('All 4 Play Store background compositions created successfully!');
}

processGPBackgrounds().catch(console.error);
