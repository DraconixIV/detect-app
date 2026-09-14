import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceImagePath = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e/.user_uploaded/media_1789416468863.jpg';
const artifactDir = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e';
const publicIconsDir = path.resolve('./public/icons');

async function generateFinalMaster() {
  console.log('Generating Final Master: Nuance 1 (Beige Sable) + Option 3 (Halo Saphir & Or)...');

  const width = 1024;
  const height = 1024;

  // Mask of the emblem
  const emblemMask = await sharp(sourceImagePath)
    .grayscale()
    .negate()
    .linear(1.8, -40)
    .png()
    .toBuffer();

  // Dark obsidian/charcoal emblem on transparent background
  const darkEmblem = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 18, g: 16, b: 14, alpha: 1 } // #12100e
    }
  })
  .joinChannel(emblemMask)
  .png()
  .toBuffer();

  // =========================================================================
  // THE PERFECT COMBO:
  // - Background: Beige Sable Minéral & Lin (#f6f1e8 to #ebe3d3)
  // - Accent: Delicate Royal Cobalt & Saphir Halo (#2563eb / #38bdf8)
  // - Center Target: 24k Pure Gold Discovery Sparkle (#fde047 / #d97706)
  // - Ground Pulses: Fine Subterranean Sonar Arcs
  // =========================================================================
  const masterBgSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Beige Sable Minéral & Lin Gradient -->
      <linearGradient id="sand-master-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f7f2ea" />
        <stop offset="50%" stop-color="#f1eae0" />
        <stop offset="100%" stop-color="#e9e0d0" />
      </linearGradient>

      <!-- Delicate Saphir & Gold Radar Halo behind the coil (x: 512, y: 580) -->
      <radialGradient id="saphir-halo" cx="50%" cy="58%" r="46%">
        <stop offset="0%" stop-color="#2563eb" stop-opacity="0.22" />
        <stop offset="45%" stop-color="#38bdf8" stop-opacity="0.10" />
        <stop offset="80%" stop-color="#d4af37" stop-opacity="0.05" />
        <stop offset="100%" stop-color="#e9e0d0" stop-opacity="0" />
      </radialGradient>

      <!-- 24k Gold Target Core -->
      <radialGradient id="gold-target-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fef08a" />
        <stop offset="40%" stop-color="#fde047" />
        <stop offset="80%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#d97706" />
      </radialGradient>

      <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#382d21" flood-opacity="0.12"/>
      </filter>
    </defs>

    <!-- Base Beige Sable -->
    <rect width="${width}" height="${height}" fill="url(#sand-master-grad)" />

    <!-- Radar Pulse Halo behind Search Coil -->
    <circle cx="512" cy="580" r="410" fill="url(#saphir-halo)" />
    
    <!-- Subtle Precision Radar Rings (Sable & Bleu Saphir) -->
    <circle cx="512" cy="580" r="350" stroke="#d5c7b0" stroke-width="2" fill="none" stroke-dasharray="8 8" opacity="0.8" />
    <circle cx="512" cy="580" r="270" stroke="#2563eb" stroke-width="1.8" fill="none" opacity="0.2" />
    <circle cx="512" cy="580" r="190" stroke="#d5c7b0" stroke-width="1.5" fill="none" stroke-dasharray="6 6" opacity="0.6" />

    <!-- Sonar Subterranean Wave Arcs -->
    <path d="M 240 880 Q 512 820 784 880" stroke="#2563eb" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.45" />
    <path d="M 320 925 Q 512 870 704 925" stroke="#bfa67a" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.55" />

    <!-- Center 24k Gold Target Finder inside the Coil Hub -->
    <circle cx="512" cy="582" r="22" fill="url(#gold-target-core)" />
    <circle cx="512" cy="582" r="38" stroke="url(#gold-target-core)" stroke-width="2.5" fill="none" opacity="0.75" stroke-dasharray="4 4" />
  </svg>`;

  const finalMasterBuffer = await sharp(Buffer.from(masterBgSvg))
    .composite([{ input: darkEmblem, blend: 'over' }])
    .png()
    .toBuffer();

  // Save in multiple locations for production & previews
  fs.writeFileSync(path.join(artifactDir, 'geoprospect_final_master.png'), finalMasterBuffer);
  fs.writeFileSync(path.join(publicIconsDir, 'geoprospect_final_master.png'), finalMasterBuffer);
  fs.writeFileSync(path.join('./public', 'icon-512.png'), finalMasterBuffer); // PWA 512
  console.log('✓ Final Master generated in 1024x1024 PNG!');
}

generateFinalMaster().catch(console.error);
