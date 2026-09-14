import fs from 'fs';
import path from 'path';
import { renderAsync } from '@resvg/resvg-js';

const artifactDir = "C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e";
const publicIconsDir = path.resolve("./public/icons");

// =========================================================================
// DIRECTION 1 : The Neon Arc & Coil (Inspiration Pure GoTerrain / XP Deus)
// =========================================================================
const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bg-d1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c0d12" />
      <stop offset="50%" stop-color="#050608" />
      <stop offset="100%" stop-color="#0e1017" />
    </linearGradient>
    <linearGradient id="neon-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f2fe" />
      <stop offset="100%" stop-color="#4facfe" />
    </linearGradient>
    <linearGradient id="gold-d1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe259" />
      <stop offset="100%" stop-color="#ffa751" />
    </linearGradient>
    <radialGradient id="coil-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#00f2fe" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Dark Premium Tile -->
  <rect width="512" height="512" rx="115" fill="url(#bg-d1)" />
  <rect width="512" height="512" rx="115" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" />

  <!-- Sweeping Detection Arc (Le balayage dynamique du détecteur) -->
  <path d="M 90 360 C 90 200 220 110 380 110" fill="none" stroke="url(#neon-cyan)" stroke-width="8" stroke-linecap="round" stroke-dasharray="280 20" opacity="0.3" />
  <path d="M 120 380 C 130 250 250 160 390 160" fill="none" stroke="url(#neon-cyan)" stroke-width="14" stroke-linecap="round" opacity="0.85" />
  
  <!-- The Double-D Search Coil at the Apex of the Sweep -->
  <g transform="translate(370, 180) rotate(-15)">
    <!-- Aura Glow -->
    <circle cx="0" cy="0" r="95" fill="url(#coil-glow)" />
    
    <!-- Outer Coil Frame -->
    <circle cx="0" cy="0" r="82" fill="#080a10" stroke="url(#neon-cyan)" stroke-width="14" />
    <!-- Inner Spoke Structure -->
    <circle cx="0" cy="0" r="38" fill="none" stroke="url(#neon-cyan)" stroke-width="9" />
    <line x1="-82" y1="0" x2="82" y2="0" stroke="url(#neon-cyan)" stroke-width="9" />
    <line x1="0" y1="-82" x2="0" y2="82" stroke="url(#neon-cyan)" stroke-width="9" />
    
    <!-- Gold Discovery Pinpoint Core -->
    <circle cx="0" cy="0" r="14" fill="url(#gold-d1)" />
  </g>

  <!-- Sonar Waves radiating from coil -->
  <path d="M 390 280 A 60 20 0 0 1 470 300" stroke="#00f2fe" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.7" />
  <path d="M 360 320 A 100 30 0 0 1 480 345" stroke="#00f2fe" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.35" />

  <!-- Minimal Brand Monogram Tag -->
  <text x="80" y="440" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="4">GP</text>
  <circle cx="156" cy="425" r="7" fill="#00f2fe" />
</svg>`;

// =========================================================================
// DIRECTION 2 : The Modern G-Coil (Monogramme Géométrique Haute Définition)
// =========================================================================
const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bg-d2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="blue-royal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="gold-core" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>

  <rect width="512" height="512" rx="115" fill="url(#bg-d2)" />
  <rect width="512" height="512" rx="115" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="3" />

  <!-- Background Radar Grid -->
  <circle cx="256" cy="256" r="190" stroke="rgba(255,255,255,0.05)" stroke-width="3" fill="none" />
  <circle cx="256" cy="256" r="130" stroke="rgba(56,189,248,0.1)" stroke-width="2.5" fill="none" stroke-dasharray="6 6" />

  <!-- Massive G-Letter whose inner loop IS the search coil -->
  <g transform="translate(256, 256)">
    <!-- Main Outer G Arch -->
    <path d="M 0 -150 C 82 -150 150 -82 150 0 C 150 82 82 150 0 150 C -82 150 -150 82 -150 0 C -150 -82 -82 -150 0 -150" fill="none" stroke="url(#blue-royal)" stroke-width="32" stroke-linecap="round" stroke-dasharray="750" stroke-dashoffset="140" />
    
    <!-- Crossbar of G forming the detector shaft connector -->
    <line x1="0" y1="0" x2="150" y2="0" stroke="url(#blue-royal)" stroke-width="32" stroke-linecap="round" />

    <!-- Inner Concentric Search Coil -->
    <circle cx="0" cy="0" r="75" fill="#0b1329" stroke="#ffffff" stroke-width="12" />
    <circle cx="0" cy="0" r="34" fill="none" stroke="#38bdf8" stroke-width="8" />
    <line x1="-75" y1="0" x2="0" y2="0" stroke="#38bdf8" stroke-width="8" />
    <line x1="0" y1="-75" x2="0" y2="75" stroke="#38bdf8" stroke-width="8" />

    <!-- Central Gold Target Finding -->
    <circle cx="0" cy="0" r="14" fill="url(#gold-core)" />
  </g>
</svg>`;

// =========================================================================
// DIRECTION 3 : Pure Gold & Carbon Precision (Minimaliste Haute Horlogerie)
// =========================================================================
const svg3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="carbon-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#09090b" />
    </linearGradient>
    <linearGradient id="gold-lux" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
  </defs>

  <rect width="512" height="512" rx="115" fill="url(#carbon-bg)" />
  <rect width="512" height="512" rx="115" fill="none" stroke="rgba(234, 179, 8, 0.3)" stroke-width="3" />

  <!-- Precision Topo Contours -->
  <path d="M 60 360 Q 180 320 256 350 T 452 330" stroke="rgba(255,255,255,0.1)" stroke-width="3" fill="none" />
  <path d="M 60 400 Q 200 360 320 390 T 452 370" stroke="rgba(234,179,8,0.2)" stroke-width="3" fill="none" />

  <!-- The Golden Coil & Pinpoint Target -->
  <g transform="translate(256, 230)">
    <!-- Outer DD Coil Loop -->
    <ellipse cx="0" cy="0" rx="145" ry="70" fill="#111113" stroke="url(#gold-lux)" stroke-width="16" />
    <!-- Inner Spoke -->
    <ellipse cx="0" cy="0" rx="60" ry="28" fill="none" stroke="url(#gold-lux)" stroke-width="10" />
    <line x1="-145" y1="0" x2="145" y2="0" stroke="url(#gold-lux)" stroke-width="10" />
    <line x1="0" y1="-70" x2="0" y2="70" stroke="url(#gold-lux)" stroke-width="10" />

    <!-- Pure Relic / Gold Target Pulse -->
    <circle cx="0" cy="0" r="18" fill="url(#gold-lux)" />
    <circle cx="0" cy="0" r="32" stroke="url(#gold-lux)" stroke-width="3.5" fill="none" stroke-dasharray="6 6" />
  </g>

  <!-- Typography "GeoProspect" in Gold Lettering -->
  <text x="256" y="445" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="url(#gold-lux)" letter-spacing="6">GEOPROSPECT</text>
</svg>`;

// =========================================================================
// DIRECTION 4 : The Explorer Silhouette & Ground Horizon (Patagonia/Outdoor Pro)
// =========================================================================
const svg4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="sky-d4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c1e3d" />
      <stop offset="50%" stop-color="#142b58" />
      <stop offset="100%" stop-color="#08142b" />
    </linearGradient>
    <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="gold-target" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>

  <rect width="512" height="512" rx="115" fill="url(#sky-d4)" />
  <rect width="512" height="512" rx="115" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="3" />

  <!-- Radar Crescent Moon in the sky -->
  <circle cx="370" cy="130" r="55" fill="none" stroke="url(#cyan-glow)" stroke-width="4" stroke-dasharray="8 8" opacity="0.6" />
  <circle cx="370" cy="130" r="32" fill="none" stroke="url(#cyan-glow)" stroke-width="3" opacity="0.4" />

  <!-- Hill Ridge Soil Line -->
  <path d="M 0 350 Q 180 310 320 340 T 512 330 L 512 512 L 0 512 Z" fill="#070d1a" />
  <path d="M 0 350 Q 180 310 320 340 T 512 330" stroke="rgba(56,189,248,0.3)" stroke-width="3" fill="none" />

  <!-- Subterranean Sonar Pulses & Gold Artifact -->
  <path d="M 310 365 A 40 14 0 0 1 380 365" stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round" />
  <circle cx="345" cy="385" r="10" fill="url(#gold-target)" />

  <!-- Minimalist Vector Silhouette of Explorer with Detector -->
  <!-- Explorer Figure (Clean Flat Graphic Art) -->
  <g fill="#ffffff">
    <!-- Cap -->
    <path d="M 175 195 C 175 182 185 174 200 174 C 214 174 224 182 224 195 L 236 198 L 220 205 C 214 212 200 212 192 205 Z" />
    <!-- Torso / Jacket -->
    <path d="M 188 212 C 172 225 168 250 165 285 L 195 295 L 202 265 L 212 278 L 208 348 L 188 348 L 188 355 L 218 355 L 224 285 C 230 260 228 232 212 212 Z" fill="#e2e8f0" />
    <!-- Arm -->
    <path d="M 210 228 L 252 260 L 265 252 L 225 220 Z" />
  </g>

  <!-- Detector Rod and Double-D Coil -->
  <line x1="255" y1="255" x2="345" y2="340" stroke="#94a3b8" stroke-width="7" stroke-linecap="round" />
  <g transform="translate(345, 340) rotate(-8)">
    <ellipse cx="0" cy="0" rx="38" ry="14" fill="#070d1a" stroke="url(#cyan-glow)" stroke-width="6" />
    <ellipse cx="0" cy="0" rx="14" ry="5.5" fill="#38bdf8" />
  </g>

  <!-- Wordmark at top left -->
  <text x="75" y="115" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="38" fill="#ffffff" letter-spacing="2">GP</text>
  <circle cx="138" cy="102" r="5" fill="#38bdf8" />
</svg>`;

// =========================================================================
// DIRECTION 5 : The Nordic Minimalist White & Blue (Pure Flat Scandinavian)
// =========================================================================
const svg5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="blue-nordic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="gold-nordic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>

  <rect width="512" height="512" rx="115" fill="#ffffff" stroke="#e2e8f0" stroke-width="4" />

  <!-- Clean Minimalist Radar Lines -->
  <circle cx="256" cy="220" r="150" fill="#f8fafc" stroke="#e2e8f0" stroke-width="3" />
  <circle cx="256" cy="220" r="95" fill="none" stroke="#dbeafe" stroke-width="2.5" />

  <!-- Stylized Minimalist Double-D Coil -->
  <g transform="translate(256, 220)">
    <!-- Outer Coil -->
    <circle cx="0" cy="0" r="76" fill="#ffffff" stroke="url(#blue-nordic)" stroke-width="14" />
    <!-- Center Strut -->
    <line x1="0" y1="-76" x2="0" y2="76" stroke="url(#blue-nordic)" stroke-width="10" />
    <circle cx="0" cy="0" r="32" fill="none" stroke="url(#blue-nordic)" stroke-width="8" />
    <!-- Gold Finder Core -->
    <circle cx="0" cy="0" r="14" fill="url(#gold-nordic)" />
  </g>

  <!-- Sonar Waves Below -->
  <path d="M 180 330 A 85 24 0 0 0 332 330" stroke="url(#blue-nordic)" stroke-width="4" fill="none" stroke-linecap="round" />

  <!-- Clean Wordmark "GeoProspect" -->
  <text x="256" y="425" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="38" letter-spacing="1">
    <tspan fill="#0f172a">Geo</tspan><tspan fill="#2563eb">Prospect</tspan>
  </text>
  <text x="256" y="460" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="13" fill="#94a3b8" letter-spacing="6">DETECT &amp; MAP</text>
</svg>`;

const tests = [
  { id: 'gp_test_1_neon_arc', svg: svg1 },
  { id: 'gp_test_2_g_coil', svg: svg2 },
  { id: 'gp_test_3_carbon_gold', svg: svg3 },
  { id: 'gp_test_4_outdoor_explorer', svg: svg4 },
  { id: 'gp_test_5_nordic_white', svg: svg5 }
];

async function run() {
  console.log("Rendering 5 fresh test directions in 1024x1024 PNG...");
  for (const t of tests) {
    const png = await renderAsync(t.svg, {
      fitTo: { mode: 'width', value: 1024 }
    });
    fs.writeFileSync(path.join(publicIconsDir, `${t.id}.png`), png.asPng());
    fs.writeFileSync(path.join(artifactDir, `${t.id}.png`), png.asPng());
    console.log(`✓ Generated ${t.id}.png`);
  }
  console.log("All fresh tests ready!");
}

run().catch(console.error);
