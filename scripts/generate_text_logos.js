import fs from 'fs';
import path from 'path';
import { renderAsync } from '@resvg/resvg-js';

const artifactDir = "C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e";
const publicIconsDir = path.resolve("./public/icons");

// 1. Logo 1: Titanium & Blue Neon Radar Coil
const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bg-l1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#020617" />
      <stop offset="100%" stop-color="#09142b" />
    </linearGradient>
    <linearGradient id="blue-l1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="gold-l1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <radialGradient id="radar-l1" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#2563eb" stop-opacity="0" />
    </radialGradient>
    <filter id="shadow-l1" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Background App Squircle -->
  <rect width="512" height="512" rx="115" fill="url(#bg-l1)" />
  <rect width="512" height="512" rx="115" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="4" />

  <!-- ELEMENTS ARRIÈRE-PLAN : Disque de détection & Radar Sonar -->
  <circle cx="256" cy="220" r="180" fill="url(#radar-l1)" />
  <circle cx="256" cy="220" r="160" stroke="rgba(255,255,255,0.06)" stroke-width="2" fill="none" stroke-dasharray="8 8" />
  <circle cx="256" cy="220" r="110" stroke="rgba(56,189,248,0.15)" stroke-width="2.5" fill="none" />
  
  <!-- Grand Disque de détecteur en arrière-plan -->
  <g transform="translate(256, 210) rotate(-12)" opacity="0.85">
    <!-- Disque Double-D externe -->
    <ellipse cx="0" cy="0" rx="130" ry="60" fill="#0b1329" stroke="url(#blue-l1)" stroke-width="12" />
    <!-- Structure interne double-D -->
    <ellipse cx="0" cy="0" rx="55" ry="25" fill="none" stroke="url(#blue-l1)" stroke-width="8" />
    <line x1="-130" y1="0" x2="130" y2="0" stroke="url(#blue-l1)" stroke-width="8" />
    <line x1="0" y1="-60" x2="0" y2="60" stroke="url(#blue-l1)" stroke-width="8" />
    <!-- Cible d'or centrale étincelante -->
    <circle cx="0" cy="0" r="14" fill="url(#gold-l1)" />
    <!-- Canne de fixation -->
    <line x1="0" y1="-25" x2="-60" y2="-120" stroke="#94a3b8" stroke-width="10" stroke-linecap="round" />
  </g>

  <!-- Ondes de détection au sol -->
  <path d="M 160 330 A 100 25 0 0 0 352 330" stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7" />
  <path d="M 190 350 A 70 18 0 0 0 322 350" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.4" />

  <!-- PREMIER PLAN : Nom GeoProspect stylisé -->
  <g filter="url(#shadow-l1)">
    <!-- Badge de fond pour détacher le texte -->
    <rect x="56" y="325" width="400" height="92" rx="24" fill="rgba(15, 23, 42, 0.92)" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
    
    <!-- Typographie GeoProspect -->
    <text x="256" y="385" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" letter-spacing="1">
      <tspan fill="#ffffff">Geo</tspan><tspan fill="#38bdf8">Prospect</tspan>
    </text>
  </g>

  <!-- Sous-titre pro -->
  <text x="256" y="455" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="16" fill="#94a3b8" letter-spacing="6">DETECTION &amp; GPS</text>
</svg>`;

// 2. Logo 2: Topo & Gold Search Coil
const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bg-l2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#071126" />
      <stop offset="50%" stop-color="#030814" />
      <stop offset="100%" stop-color="#0b1a3a" />
    </linearGradient>
    <linearGradient id="gold-l2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <linearGradient id="blue-l2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <filter id="shadow-l2" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.9"/>
    </filter>
  </defs>

  <rect width="512" height="512" rx="115" fill="url(#bg-l2)" />
  <rect width="512" height="512" rx="115" fill="none" stroke="rgba(245,158,11,0.25)" stroke-width="4" />

  <!-- Topographic Curves in background -->
  <path d="M 40 180 Q 140 120 256 160 T 472 130" stroke="rgba(255,255,255,0.08)" stroke-width="3" fill="none" />
  <path d="M 40 230 Q 160 170 280 220 T 472 180" stroke="rgba(255,255,255,0.08)" stroke-width="3" fill="none" />
  <path d="M 40 280 Q 180 230 300 270 T 472 240" stroke="rgba(245,158,11,0.18)" stroke-width="3" fill="none" />

  <!-- Disque de détection doré géant en fond -->
  <g transform="translate(256, 195)">
    <!-- Aura d'ondes dorées -->
    <ellipse cx="0" cy="0" rx="145" ry="75" fill="none" stroke="url(#gold-l2)" stroke-width="3" stroke-dasharray="10 10" opacity="0.6" />
    <ellipse cx="0" cy="0" rx="125" ry="62" fill="#071126" stroke="url(#gold-l2)" stroke-width="12" />
    <ellipse cx="0" cy="0" rx="55" ry="26" fill="none" stroke="url(#gold-l2)" stroke-width="7" />
    <line x1="-125" y1="0" x2="125" y2="0" stroke="url(#gold-l2)" stroke-width="7" />
    <line x1="0" y1="-62" x2="0" y2="62" stroke="url(#gold-l2)" stroke-width="7" />
    <circle cx="0" cy="0" r="16" fill="url(#gold-l2)" />
  </g>

  <!-- NOM GEOPROSPECT AU PREMIER PLAN -->
  <g filter="url(#shadow-l2)">
    <rect x="48" y="320" width="416" height="96" rx="24" fill="rgba(3, 8, 20, 0.94)" stroke="url(#gold-l2)" stroke-width="2.5" />
    <text x="256" y="384" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="42" letter-spacing="2">
      <tspan fill="#ffffff">GEO</tspan><tspan fill="url(#gold-l2)">PROSPECT</tspan>
    </text>
  </g>

  <text x="256" y="455" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="15" fill="#e2e8f0" letter-spacing="5">CARNET DU PROSPECTEUR</text>
</svg>`;

// 3. Logo 3: Minimalist Pure White Studio
const svg3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="blue-l3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="gold-l3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <filter id="shadow-l3" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>

  <rect width="512" height="512" rx="115" fill="#ffffff" stroke="#e2e8f0" stroke-width="4" />

  <!-- Background Radar / Disc Lines -->
  <circle cx="256" cy="200" r="160" fill="#f8fafc" stroke="#e2e8f0" stroke-width="3" />
  <circle cx="256" cy="200" r="110" fill="none" stroke="#dbeafe" stroke-width="2.5" stroke-dasharray="6 6" />

  <!-- Metal Detector Search Coil (Épuré Bleu & Or) -->
  <g transform="translate(256, 195) rotate(-8)">
    <ellipse cx="0" cy="0" rx="120" ry="56" fill="#eff6ff" stroke="url(#blue-l3)" stroke-width="10" />
    <ellipse cx="0" cy="0" rx="50" ry="22" fill="none" stroke="url(#blue-l3)" stroke-width="6" />
    <line x1="-120" y1="0" x2="120" y2="0" stroke="url(#blue-l3)" stroke-width="6" />
    <line x1="0" y1="-56" x2="0" y2="56" stroke="url(#blue-l3)" stroke-width="6" />
    <circle cx="0" cy="0" r="14" fill="url(#gold-l3)" />
    <!-- Shaft -->
    <line x1="0" y1="-20" x2="-45" y2="-105" stroke="#3b82f6" stroke-width="8" stroke-linecap="round" />
  </g>

  <!-- Sonar Waves -->
  <path d="M 170 290 A 90 22 0 0 0 342 290" stroke="#3b82f6" stroke-width="3.5" fill="none" stroke-linecap="round" />

  <!-- NOM GEOPROSPECT AU PREMIER PLAN -->
  <g filter="url(#shadow-l3)">
    <rect x="52" y="325" width="408" height="92" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
    <text x="256" y="386" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" letter-spacing="1">
      <tspan fill="#0f172a">Geo</tspan><tspan fill="#2563eb">Prospect</tspan>
    </text>
  </g>

  <text x="256" y="455" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="15" fill="#64748b" letter-spacing="5">APPLICATION DE DETECTION</text>
</svg>`;

// 4. Logo 4: Crosshair & Dynamic Detector Disc
const svg4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bg-l4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111827" />
      <stop offset="50%" stop-color="#030712" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="cyan-l4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="gold-l4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <filter id="shadow-l4" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <rect width="512" height="512" rx="115" fill="url(#bg-l4)" />
  <rect width="512" height="512" rx="115" fill="none" stroke="rgba(34,211,238,0.2)" stroke-width="4" />

  <!-- Tactical Target Crosshair in Background -->
  <circle cx="256" cy="205" r="165" stroke="rgba(255,255,255,0.06)" stroke-width="2" fill="none" />
  <circle cx="256" cy="205" r="120" stroke="rgba(34,211,238,0.15)" stroke-width="2" fill="none" stroke-dasharray="6 6" />
  <line x1="256" y1="40" x2="256" y2="370" stroke="rgba(34,211,238,0.1)" stroke-width="2" />
  <line x1="90" y1="205" x2="422" y2="205" stroke="rgba(34,211,238,0.1)" stroke-width="2" />

  <!-- Dual Search Coil Design -->
  <g transform="translate(256, 205)">
    <ellipse cx="0" cy="0" rx="135" ry="68" fill="#0f172a" stroke="url(#cyan-l4)" stroke-width="12" />
    <ellipse cx="0" cy="0" rx="58" ry="28" fill="none" stroke="url(#cyan-l4)" stroke-width="7" />
    <line x1="-135" y1="0" x2="135" y2="0" stroke="url(#cyan-l4)" stroke-width="7" />
    <line x1="0" y1="-68" x2="0" y2="68" stroke="url(#cyan-l4)" stroke-width="7" />
    <circle cx="0" cy="0" r="15" fill="url(#gold-l4)" />
    <!-- Pinpoint Pulse -->
    <circle cx="0" cy="0" r="28" stroke="url(#gold-l4)" stroke-width="3" fill="none" opacity="0.7" stroke-dasharray="4 4" />
  </g>

  <!-- NOM GEOPROSPECT AU PREMIER PLAN -->
  <g filter="url(#shadow-l4)">
    <rect x="52" y="325" width="408" height="92" rx="24" fill="rgba(17, 24, 39, 0.95)" stroke="url(#cyan-l4)" stroke-width="2" />
    <text x="256" y="386" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="42" letter-spacing="2">
      <tspan fill="#ffffff">GEO</tspan><tspan fill="url(#cyan-l4)">PROSPECT</tspan>
    </text>
  </g>

  <text x="256" y="455" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="15" fill="#9ca3af" letter-spacing="5">PINPOINT &amp; MAPPING</text>
</svg>`;

// 5. Logo 5: Shield Emblem & Discovery Beacon
const svg5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bg-l5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1329" />
      <stop offset="50%" stop-color="#030814" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <linearGradient id="purple-blue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
    <linearGradient id="gold-l5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <filter id="shadow-l5" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000000" flood-opacity="0.85"/>
    </filter>
  </defs>

  <rect width="512" height="512" rx="115" fill="url(#bg-l5)" />
  <rect width="512" height="512" rx="115" fill="none" stroke="rgba(99,102,241,0.3)" stroke-width="4" />

  <!-- Shield Shape in Background -->
  <path d="M 256 60 C 330 60 400 90 400 160 C 400 270 256 350 256 350 C 256 350 112 270 112 160 C 112 90 182 60 256 60 Z" fill="rgba(59, 130, 246, 0.08)" stroke="url(#purple-blue)" stroke-width="3" />

  <!-- Metal Detector Search Coil inside Shield -->
  <g transform="translate(256, 185)">
    <ellipse cx="0" cy="0" rx="115" ry="55" fill="#0b1329" stroke="url(#purple-blue)" stroke-width="11" />
    <ellipse cx="0" cy="0" rx="48" ry="22" fill="none" stroke="url(#purple-blue)" stroke-width="7" />
    <line x1="-115" y1="0" x2="115" y2="0" stroke="url(#purple-blue)" stroke-width="7" />
    <line x1="0" y1="-55" x2="0" y2="55" stroke="url(#purple-blue)" stroke-width="7" />
    <circle cx="0" cy="0" r="14" fill="url(#gold-l5)" />
    
    <!-- Gold Coin Treasure Item found -->
    <circle cx="0" cy="65" r="10" fill="url(#gold-l5)" />
    <circle cx="0" cy="65" r="18" stroke="url(#gold-l5)" stroke-width="2" fill="none" opacity="0.6" stroke-dasharray="3 3" />
  </g>

  <!-- NOM GEOPROSPECT AU PREMIER PLAN -->
  <g filter="url(#shadow-l5)">
    <rect x="50" y="325" width="412" height="92" rx="24" fill="rgba(11, 19, 41, 0.95)" stroke="url(#purple-blue)" stroke-width="2" />
    <text x="256" y="386" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" letter-spacing="1">
      <tspan fill="#ffffff">Geo</tspan><tspan fill="#38bdf8">Prospect</tspan>
    </text>
  </g>

  <text x="256" y="455" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="15" fill="#a5b4fc" letter-spacing="5">L'ALLIÉ DU DÉTECTORISTE</text>
</svg>`;

const logos = [
  { id: 'geoprospect_logo_1_radar', svg: svg1 },
  { id: 'geoprospect_logo_2_topo_gold', svg: svg2 },
  { id: 'geoprospect_logo_3_pure_white', svg: svg3 },
  { id: 'geoprospect_logo_4_crosshair', svg: svg4 },
  { id: 'geoprospect_logo_5_shield', svg: svg5 }
];

async function generateAll() {
  console.log("Rendering 5 new GeoProspect logos in 1024x1024...");
  for (const item of logos) {
    const pngData = await renderAsync(item.svg, {
      fitTo: { mode: 'width', value: 1024 }
    });
    fs.writeFileSync(path.join(publicIconsDir, `${item.id}.png`), pngData.asPng());
    fs.writeFileSync(path.join(artifactDir, `${item.id}.png`), pngData.asPng());
    console.log(`✓ Generated ${item.id}.png`);
  }
  console.log("Done!");
}

generateAll().catch(console.error);
