import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceImagePath = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e/.user_uploaded/media_1789416468863.jpg';
const artifactDir = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e';
const publicIconsDir = path.resolve('./public/icons');

async function processBeigeVariations() {
  console.log('Generating beige and tailored background color harmonies for the GP logo...');

  const width = 1024;
  const height = 1024;

  // Mask of the emblem
  const emblemMask = await sharp(sourceImagePath)
    .grayscale()
    .negate()
    .linear(1.8, -40)
    .png()
    .toBuffer();

  // Dark charcoal/obsidian emblem on transparent background
  const darkEmblem = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 24, g: 22, b: 20, alpha: 1 } // #181614
    }
  })
  .joinChannel(emblemMask)
  .png()
  .toBuffer();

  // =========================================================================
  // 1. BEIGE SABLE MINÉRAL & LIN (Warm Sand & Linen Beige #F3EDE2)
  // =========================================================================
  const bg1Svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sand-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f6f1e8" />
        <stop offset="100%" stop-color="#ebe3d3" />
      </linearGradient>
      <radialGradient id="soft-glow" cx="50%" cy="58%" r="45%">
        <stop offset="0%" stop-color="#d4af37" stop-opacity="0.22" />
        <stop offset="55%" stop-color="#c5a059" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#ebe3d3" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="gold-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fde047" />
        <stop offset="100%" stop-color="#d97706" />
      </radialGradient>
    </defs>

    <!-- Warm Sand Beige Background -->
    <rect width="${width}" height="${height}" fill="url(#sand-grad)" />
    
    <!-- Subtle Golden Halo behind the search coil -->
    <circle cx="512" cy="580" r="390" fill="url(#soft-glow)" />
    <circle cx="512" cy="580" r="330" stroke="#d5c7b0" stroke-width="2" fill="none" stroke-dasharray="8 8" />
    <circle cx="512" cy="580" r="250" stroke="#d5c7b0" stroke-width="1.5" fill="none" />

    <!-- Subterranean Sonar Arc below coil -->
    <path d="M 260 880 Q 512 825 764 880" stroke="#bfa67a" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7" />
    <path d="M 330 925 Q 512 878 694 925" stroke="#bfa67a" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4" />

    <!-- Center Gold Target Find -->
    <circle cx="512" cy="582" r="20" fill="url(#gold-core)" />
  </svg>`;

  const buffer1 = await sharp(Buffer.from(bg1Svg))
    .composite([{ input: darkEmblem, blend: 'over' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'gp_color_1_sand_beige.png'), buffer1);
  fs.writeFileSync(path.join(publicIconsDir, 'gp_color_1_sand_beige.png'), buffer1);
  console.log('✓ 1. Sand Beige created');

  // =========================================================================
  // 2. BEIGE TERRE CUITE & AMBRE CHAUD (Warm Terracotta / Desert Clay #EDDCC8)
  // =========================================================================
  const bg2Svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="clay-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f0e2d1" />
        <stop offset="100%" stop-color="#e2cdb6" />
      </linearGradient>
      <radialGradient id="amber-glow" cx="50%" cy="58%" r="45%">
        <stop offset="0%" stop-color="#ea580c" stop-opacity="0.2" />
        <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#e2cdb6" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="gold-core2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fde047" />
        <stop offset="100%" stop-color="#ea580c" />
      </radialGradient>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#clay-grad)" />

    <!-- Soft Amber Halo -->
    <circle cx="512" cy="580" r="390" fill="url(#amber-glow)" />
    <circle cx="512" cy="580" r="330" stroke="#c9b095" stroke-width="2" fill="none" stroke-dasharray="8 8" />

    <!-- Sonar Arc -->
    <path d="M 260 880 Q 512 825 764 880" stroke="#c28c5a" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.65" />
    <path d="M 330 925 Q 512 878 694 925" stroke="#c28c5a" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.35" />

    <!-- Center Target -->
    <circle cx="512" cy="582" r="20" fill="url(#gold-core2)" />
  </svg>`;

  const buffer2 = await sharp(Buffer.from(bg2Svg))
    .composite([{ input: darkEmblem, blend: 'over' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'gp_color_2_terracotta_beige.png'), buffer2);
  fs.writeFileSync(path.join(publicIconsDir, 'gp_color_2_terracotta_beige.png'), buffer2);
  console.log('✓ 2. Terracotta Beige created');

  // =========================================================================
  // 3. BEIGE PIERRE & CRAIE CHAUDE (Chalk & Mineral Stone #EAE7E1)
  // =========================================================================
  const bg3Svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="stone-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#edeae4" />
        <stop offset="100%" stop-color="#dfdad0" />
      </linearGradient>
      <radialGradient id="blue-halo-stone" cx="50%" cy="58%" r="45%">
        <stop offset="0%" stop-color="#2563eb" stop-opacity="0.18" />
        <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.06" />
        <stop offset="100%" stop-color="#dfdad0" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="gold-core3" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fde047" />
        <stop offset="100%" stop-color="#d97706" />
      </radialGradient>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#stone-grad)" />

    <!-- Subtle Blue Radar Accent behind the coil on Stone Beige -->
    <circle cx="512" cy="580" r="390" fill="url(#blue-halo-stone)" />
    <circle cx="512" cy="580" r="330" stroke="#c0b9ad" stroke-width="2" fill="none" stroke-dasharray="8 8" />
    <circle cx="512" cy="580" r="250" stroke="#b0a799" stroke-width="1.5" fill="none" />

    <!-- Blue Sonar Arc -->
    <path d="M 260 880 Q 512 825 764 880" stroke="#2563eb" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6" />
    <path d="M 330 925 Q 512 878 694 925" stroke="#2563eb" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.3" />

    <!-- Center Gold Target -->
    <circle cx="512" cy="582" r="20" fill="url(#gold-core3)" />
  </svg>`;

  const buffer3 = await sharp(Buffer.from(bg3Svg))
    .composite([{ input: darkEmblem, blend: 'over' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'gp_color_3_stone_chalk.png'), buffer3);
  fs.writeFileSync(path.join(publicIconsDir, 'gp_color_3_stone_chalk.png'), buffer3);
  console.log('✓ 3. Stone Chalk Beige created');

  // =========================================================================
  // 4. VERT EXPÉDITION / OLIVE PÂLE (Outdoor Safari Olive #E3E8DC)
  // =========================================================================
  const bg4Svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="olive-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#e6ece0" />
        <stop offset="100%" stop-color="#d4decb" />
      </linearGradient>
      <radialGradient id="gold-core4" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fde047" />
        <stop offset="100%" stop-color="#d97706" />
      </radialGradient>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#olive-grad)" />

    <!-- Subtle Military / Outdoor Radar grid -->
    <circle cx="512" cy="580" r="330" stroke="#b2c2a4" stroke-width="2" fill="none" stroke-dasharray="8 8" />
    <circle cx="512" cy="580" r="250" stroke="#b2c2a4" stroke-width="1.5" fill="none" />

    <!-- Sonar Arc -->
    <path d="M 260 880 Q 512 825 764 880" stroke="#52796f" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6" />
    <path d="M 330 925 Q 512 878 694 925" stroke="#52796f" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.35" />

    <!-- Center Gold Target -->
    <circle cx="512" cy="582" r="20" fill="url(#gold-core4)" />
  </svg>`;

  const buffer4 = await sharp(Buffer.from(bg4Svg))
    .composite([{ input: darkEmblem, blend: 'over' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'gp_color_4_safari_olive.png'), buffer4);
  fs.writeFileSync(path.join(publicIconsDir, 'gp_color_4_safari_olive.png'), buffer4);
  console.log('✓ 4. Safari Olive created');

  console.log('All beige and mineral color variations generated successfully!');
}

processBeigeVariations().catch(console.error);
