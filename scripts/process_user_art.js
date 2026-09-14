import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceImagePath = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e/.user_uploaded/media_1789414837780.jpg';
const artifactDir = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e';
const publicIconsDir = path.resolve('./public/icons');

async function processArt() {
  console.log('Loading source master image...');
  const metadata = await sharp(sourceImagePath).metadata();
  const width = metadata.width || 1024;
  const height = metadata.height || 1024;
  console.log(`Image dimensions: ${width}x${height}`);

  // -------------------------------------------------------------
  // VARIATION 1: Original Artwork + Pure Editorial GeoProspect Typography
  // -------------------------------------------------------------
  const overlaySvg1 = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <!-- Top Editorial Branding -->
    <text x="512" y="110" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="34" fill="#3d3833" letter-spacing="14">GEOPROSPECT</text>
    <text x="512" y="145" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="12" fill="#7a7167" letter-spacing="6">DÉTECTION &amp; CARTOGRAPHIE</text>
    
    <!-- Fine bottom coordinate line -->
    <text x="512" y="970" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11" fill="#8c8276" letter-spacing="4">ALTITUDE • HORIZON • HISTOIRE</text>
  </svg>`;

  const var1Buffer = await sharp(sourceImagePath)
    .composite([{ input: Buffer.from(overlaySvg1), top: 0, left: 0 }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'geoprospect_art_v1_editorial.png'), var1Buffer);
  fs.writeFileSync(path.join(publicIconsDir, 'geoprospect_art_v1_editorial.png'), var1Buffer);
  console.log('✓ Variation 1 created');

  // -------------------------------------------------------------
  // VARIATION 2: Sonar Detection Pulse on the Coil + Gold Pinpoint Spark
  // Search coil center is approximately at x=692, y=318 in the 1024x1024 image
  // -------------------------------------------------------------
  const overlaySvg2 = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gold-spark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a" />
        <stop offset="50%" stop-color="#eab308" />
        <stop offset="100%" stop-color="#ca8a04" />
      </linearGradient>
      <radialGradient id="coil-glow-soft" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Glowing Sonar Rings around the search coil at (692, 318) -->
    <circle cx="692" cy="318" r="70" fill="url(#coil-glow-soft)" />
    <ellipse cx="692" cy="318" rx="55" ry="42" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.65" stroke-dasharray="5 4" />
    <ellipse cx="692" cy="318" rx="78" ry="60" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.35" stroke-dasharray="6 6" />
    
    <!-- Subtle Golden Pinpoint Beacon -->
    <circle cx="692" cy="318" r="4.5" fill="url(#gold-spark)" />
    <circle cx="692" cy="318" r="8" stroke="url(#gold-spark)" stroke-width="1" fill="none" opacity="0.8" />

    <!-- Top Branding -->
    <text x="512" y="110" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="#3d3833" letter-spacing="12">GEO<tspan fill="#d97706">PROSPECT</tspan></text>
    <text x="512" y="145" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="12" fill="#d97706" letter-spacing="6">L'ALLIÉ DU PROSPECTEUR</text>
  </svg>`;

  const var2Buffer = await sharp(sourceImagePath)
    .composite([{ input: Buffer.from(overlaySvg2), top: 0, left: 0 }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'geoprospect_art_v2_pulse.png'), var2Buffer);
  fs.writeFileSync(path.join(publicIconsDir, 'geoprospect_art_v2_pulse.png'), var2Buffer);
  console.log('✓ Variation 2 created');

  // -------------------------------------------------------------
  // VARIATION 3: App Icon Squircle & Clean Signature
  // -------------------------------------------------------------
  const overlaySvg3 = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <!-- Rounded App Frame Border -->
    <rect x="16" y="16" width="992" height="992" rx="220" fill="none" stroke="#3d3833" stroke-width="8" opacity="0.15" />
    
    <!-- Monogram GP at top center -->
    <text x="512" y="125" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="56" fill="#3d3833" letter-spacing="6">GP</text>
    <circle cx="560" cy="98" r="5" fill="#2563eb" />

    <!-- Wordmark at mountain base -->
    <text x="512" y="960" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="22" fill="#3d3833" letter-spacing="8">GEOPROSPECT</text>
  </svg>`;

  const var3Buffer = await sharp(sourceImagePath)
    .composite([{ input: Buffer.from(overlaySvg3), top: 0, left: 0 }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'geoprospect_art_v3_app_frame.png'), var3Buffer);
  fs.writeFileSync(path.join(publicIconsDir, 'geoprospect_art_v3_app_frame.png'), var3Buffer);
  console.log('✓ Variation 3 created');

  // -------------------------------------------------------------
  // VARIATION 4: Modern Cobalt & Gold Horizon Touch
  // -------------------------------------------------------------
  const overlaySvg4 = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <!-- Delicate Blue Sonar Waves around coil -->
    <ellipse cx="692" cy="318" rx="55" ry="42" fill="none" stroke="#2563eb" stroke-width="2" opacity="0.6" stroke-dasharray="4 4" />
    <circle cx="692" cy="318" r="4.5" fill="#2563eb" />

    <!-- Pure Minimalist Logo at Top -->
    <text x="512" y="105" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="38" letter-spacing="1">
      <tspan fill="#2b2621">Geo</tspan><tspan fill="#2563eb">Prospect</tspan>
    </text>
  </svg>`;

  const var4Buffer = await sharp(sourceImagePath)
    .composite([{ input: Buffer.from(overlaySvg4), top: 0, left: 0 }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(artifactDir, 'geoprospect_art_v4_cobalt.png'), var4Buffer);
  fs.writeFileSync(path.join(publicIconsDir, 'geoprospect_art_v4_cobalt.png'), var4Buffer);
  console.log('✓ Variation 4 created');

  console.log('All 4 direct artwork variations generated successfully!');
}

processArt().catch(console.error);
