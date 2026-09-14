import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceImagePath = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e/.user_uploaded/media_1789414837780.jpg';
const artifactDir = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e';
const publicIconsDir = path.resolve('./public/icons');

async function beautify() {
  console.log('Processing pure artistic enhancements on original artwork...');
  const metadata = await sharp(sourceImagePath).metadata();
  const width = metadata.width || 1008;
  const height = metadata.height || 1008;

  // =========================================================================
  // 1. GOLDEN HOUR / SOLEIL COUCHANT CHALEUREUX (Atmospheric Sunset Glow)
  // =========================================================================
  const goldenHourOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Soft Sun Glow on the horizon behind mountain peak -->
      <radialGradient id="sun-glow" cx="49%" cy="58%" r="48%">
        <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.4" />
        <stop offset="35%" stop-color="#f59e0b" stop-opacity="0.25" />
        <stop offset="70%" stop-color="#ea580c" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#ea580c" stop-opacity="0" />
      </radialGradient>
      <!-- Sky Gradient Overlay -->
      <linearGradient id="sky-amber" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.08" />
        <stop offset="45%" stop-color="#fde047" stop-opacity="0.15" />
        <stop offset="65%" stop-color="#f97316" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#c2410c" stop-opacity="0.15" />
      </linearGradient>
    </defs>

    <!-- Warm Atmospheric Wash -->
    <rect width="${width}" height="${height}" fill="url(#sky-amber)" mix-blend-mode="multiply" />
    <circle cx="495" cy="580" r="420" fill="url(#sun-glow)" mix-blend-mode="screen" />
    
    <!-- Warm Rim Lighting along the mountain edge -->
    <path d="M 0 900 Q 240 760 500 600 T 1000 1000" fill="none" stroke="#fef08a" stroke-width="3" opacity="0.4" />
  </svg>`;

  const buffer1 = await sharp(sourceImagePath)
    .composite([{ input: Buffer.from(goldenHourOverlay), top: 0, left: 0 }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'beautified_1_golden_hour.png'), buffer1);
  fs.writeFileSync(path.join(publicIconsDir, 'beautified_1_golden_hour.png'), buffer1);
  console.log('✓ 1. Golden hour enhanced');

  // =========================================================================
  // 2. COURBES DE NIVEAU TOPOGRAPHIQUES NATURELLES (Subtle Cartography Lines)
  // =========================================================================
  const topoOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="topo-fade" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2563eb" stop-opacity="0.05" />
        <stop offset="50%" stop-color="#2563eb" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#2563eb" stop-opacity="0.05" />
      </linearGradient>
    </defs>

    <!-- Subtle hand-drawn contour lines flowing naturally along the mountain slopes -->
    <!-- Left face contours -->
    <path d="M 380 720 Q 495 670 610 705" fill="none" stroke="#3b82f6" stroke-width="1.8" opacity="0.4" stroke-linecap="round" />
    <path d="M 310 780 Q 495 730 690 765" fill="none" stroke="#3b82f6" stroke-width="1.6" opacity="0.32" stroke-linecap="round" />
    <path d="M 240 840 Q 495 790 770 825" fill="none" stroke="#3b82f6" stroke-width="1.6" opacity="0.25" stroke-linecap="round" />
    <path d="M 170 900 Q 495 850 850 885" fill="none" stroke="#3b82f6" stroke-width="1.6" opacity="0.2" stroke-linecap="round" />
    <path d="M 100 960 Q 495 910 930 945" fill="none" stroke="#3b82f6" stroke-width="1.6" opacity="0.15" stroke-linecap="round" />

    <!-- Delicate altitude elevation ticks -->
    <circle cx="495" cy="605" r="3" fill="#2563eb" opacity="0.6" />
    <circle cx="495" cy="605" r="7" fill="none" stroke="#2563eb" stroke-width="1" opacity="0.4" />
  </svg>`;

  const buffer2 = await sharp(sourceImagePath)
    .composite([{ input: Buffer.from(topoOverlay), top: 0, left: 0 }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'beautified_2_topography.png'), buffer2);
  fs.writeFileSync(path.join(publicIconsDir, 'beautified_2_topography.png'), buffer2);
  console.log('✓ 2. Topography enhanced');

  // =========================================================================
  // 3. CRÉPUSCULE ÉTOILÉ & ATMOSPHÈRE BLEU NUIT (Twilight & Starlight)
  // =========================================================================
  const twilightOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="twilight-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#091428" stop-opacity="0.65" />
        <stop offset="40%" stop-color="#14284b" stop-opacity="0.4" />
        <stop offset="60%" stop-color="#b45309" stop-opacity="0.3" />
        <stop offset="85%" stop-color="#f59e0b" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#0c182d" stop-opacity="0.35" />
      </linearGradient>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#twilight-grad)" mix-blend-mode="multiply" />

    <!-- Delicate Starlight Constellation Dots in the upper sky -->
    <circle cx="210" cy="120" r="1.5" fill="#ffffff" opacity="0.75" />
    <circle cx="280" cy="95" r="1.2" fill="#ffffff" opacity="0.6" />
    <circle cx="340" cy="140" r="1.8" fill="#fde047" opacity="0.85" />
    <circle cx="720" cy="110" r="1.5" fill="#ffffff" opacity="0.7" />
    <circle cx="810" cy="160" r="1.2" fill="#ffffff" opacity="0.5" />
    <circle cx="670" cy="80" r="1.6" fill="#fde047" opacity="0.8" />
    <circle cx="150" cy="220" r="1.2" fill="#ffffff" opacity="0.5" />
    <circle cx="860" cy="240" r="1.5" fill="#ffffff" opacity="0.6" />
  </svg>`;

  const buffer3 = await sharp(sourceImagePath)
    .composite([{ input: Buffer.from(twilightOverlay), top: 0, left: 0 }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'beautified_3_twilight.png'), buffer3);
  fs.writeFileSync(path.join(publicIconsDir, 'beautified_3_twilight.png'), buffer3);
  console.log('✓ 3. Twilight enhanced');

  // =========================================================================
  // 4. AQUARELLE PROFONDE & LUMIÈRE MINÉRALE (Fine Art Watercolor Grading)
  // =========================================================================
  // Subtle contrast & warm vibrance boost, gentle vignette, richer shadows
  const buffer4 = await sharp(sourceImagePath)
    .modulate({
      brightness: 1.02,
      saturation: 1.18
    })
    .tint({ r: 248, g: 242, b: 232 })
    .png()
    .toBuffer();

  // Combine with soft artistic lighting
  const watercolorOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="soft-vignette" cx="50%" cy="48%" r="60%">
        <stop offset="55%" stop-color="#000000" stop-opacity="0" />
        <stop offset="100%" stop-color="#45382b" stop-opacity="0.18" />
      </radialGradient>
      <linearGradient id="warm-light" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fed7aa" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#0284c7" stop-opacity="0.1" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#warm-light)" mix-blend-mode="color-burn" />
    <rect width="${width}" height="${height}" fill="url(#soft-vignette)" />
  </svg>`;

  const finalBuffer4 = await sharp(buffer4)
    .composite([{ input: Buffer.from(watercolorOverlay), top: 0, left: 0 }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'beautified_4_fine_art.png'), finalBuffer4);
  fs.writeFileSync(path.join(publicIconsDir, 'beautified_4_fine_art.png'), finalBuffer4);
  console.log('✓ 4. Fine art watercolor enhanced');

  console.log('All 4 pure aesthetic enhancements generated successfully!');
}

beautify().catch(console.error);
