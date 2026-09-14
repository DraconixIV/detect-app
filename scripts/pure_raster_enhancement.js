import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceImagePath = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e/.user_uploaded/media_1789414837780.jpg';
const artifactDir = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e';
const publicIconsDir = path.resolve('./public/icons');

async function processPureArt() {
  console.log('Performing 100% pure raster enhancements directly on the original illustration...');

  const original = sharp(sourceImagePath);
  const metadata = await original.metadata();
  const width = metadata.width || 1008;
  const height = metadata.height || 1008;

  // =========================================================================
  // 1. OMBRAGE NATUREL & CONTRE-JOUR (Natural Human Chiaroscuro on Real Pixels)
  // Deepens the character and mountain shadows naturally through tonal curves
  // =========================================================================
  const opt1 = await sharp(sourceImagePath)
    .gamma(1.2)
    .linear(1.15, -15) // Deepens shadows and dark tones of the real body and mountain
    .modulate({
      brightness: 0.98,
      saturation: 1.12
    })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'real_art_1_chiaroscuro.png'), opt1);
  fs.writeFileSync(path.join(publicIconsDir, 'real_art_1_chiaroscuro.png'), opt1);
  console.log('✓ 1. Natural Chiaroscuro generated');

  // =========================================================================
  // 2. AMBIANCE DORÉE & COUCHER DE SOLEIL CHALEUREUX (Warm Golden Sunset Grading)
  // Warms up the sky and enriches the mountain and character tones
  // =========================================================================
  // Create a soft atmospheric sunset overlay gradient
  const warmGradient = Buffer.from(`
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="warm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fff8ed" stop-opacity="0.1" />
          <stop offset="50%" stop-color="#fed7aa" stop-opacity="0.25" />
          <stop offset="85%" stop-color="#f97316" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#9a3412" stop-opacity="0.15" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#warm-sky)" />
    </svg>
  `);

  const opt2 = await sharp(sourceImagePath)
    .composite([{ input: warmGradient, blend: 'multiply' }])
    .gamma(1.1)
    .modulate({
      brightness: 1.02,
      saturation: 1.25
    })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'real_art_2_sunset_glow.png'), opt2);
  fs.writeFileSync(path.join(publicIconsDir, 'real_art_2_sunset_glow.png'), opt2);
  console.log('✓ 2. Warm Sunset Glow generated');

  // =========================================================================
  // 3. SILHOUETTE CONTRE-JOUR INTENSE (Moody Shadow Figure)
  // Deepens the human figure and mountain into a rich, poetic shadow against a clean light sky
  // =========================================================================
  const opt3 = await sharp(sourceImagePath)
    .linear(1.35, -45) // Makes dark tones significantly richer and shadowy
    .gamma(1.3)
    .modulate({
      brightness: 0.95,
      saturation: 1.08
    })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'real_art_3_moody_shadow.png'), opt3);
  fs.writeFileSync(path.join(publicIconsDir, 'real_art_3_moody_shadow.png'), opt3);
  console.log('✓ 3. Moody Shadow Figure generated');

  // =========================================================================
  // 4. TEXTURE PAPIER FINE ART & PROFONDEUR MINÉRALE (Art Gallery Tone)
  // High micro-contrast, elegant linen paper warmth, refined authentic lines
  // =========================================================================
  const opt4 = await sharp(sourceImagePath)
    .sharpen({
      sigma: 1.2,
      m1: 1.0,
      m2: 2.0
    })
    .linear(1.1, -8)
    .modulate({
      brightness: 1.01,
      saturation: 1.15
    })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'real_art_4_gallery_texture.png'), opt4);
  fs.writeFileSync(path.join(publicIconsDir, 'real_art_4_gallery_texture.png'), opt4);
  console.log('✓ 4. Gallery Texture generated');

  console.log('All 4 real raster enhancements completed successfully!');
}

processPureArt().catch(console.error);
