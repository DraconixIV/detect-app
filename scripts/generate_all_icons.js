import fs from 'fs';
import path from 'path';
import { renderAsync } from '@resvg/resvg-js';

const artifactDir = "C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e";
const publicIconsDir = path.resolve("./public/icons");

if (!fs.existsSync(publicIconsDir)) {
  fs.mkdirSync(publicIconsDir, { recursive: true });
}

// 1. Version 1: GP Flagship Monogram & Search Coil
const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bg-1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#020617" />
      <stop offset="100%" stop-color="#08142c" />
    </linearGradient>
    <linearGradient id="blue-1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="gold-1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <radialGradient id="glow-1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="115" fill="url(#bg-1)" />
  <rect width="512" height="512" rx="115" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="4" />
  
  <circle cx="256" cy="256" r="200" stroke="rgba(255,255,255,0.05)" stroke-width="3" fill="none" />
  <circle cx="256" cy="256" r="140" stroke="rgba(56,189,248,0.12)" stroke-width="3" fill="none" stroke-dasharray="8 8" />

  <!-- "G" Monogram -->
  <path d="M 185 160 C 128 160 88 200 88 256 C 88 312 128 352 185 352 C 218 352 244 338 258 318 L 258 272 L 194 272 L 194 236 L 294 236 L 294 328 C 266 368 225 388 180 388 C 102 388 46 332 46 256 C 46 180 102 124 185 124 C 226 124 262 138 288 164 L 254 198 C 236 174 212 160 185 160 Z" fill="#ffffff" />

  <!-- "P" & Coil Fusion -->
  <rect x="306" y="124" width="36" height="264" rx="18" fill="#ffffff" />
  
  <g transform="translate(362, 210)">
    <circle cx="0" cy="0" r="82" fill="url(#glow-1)" />
    <circle cx="0" cy="0" r="72" fill="#0f172a" stroke="url(#blue-1)" stroke-width="15" />
    <circle cx="0" cy="0" r="33" fill="none" stroke="url(#blue-1)" stroke-width="10" />
    <line x1="-72" y1="0" x2="72" y2="0" stroke="url(#blue-1)" stroke-width="10" />
    <circle cx="0" cy="0" r="13" fill="url(#gold-1)" />
  </g>

  <path d="M 320 398 A 45 16 0 0 1 410 398" stroke="#38bdf8" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8" />
  <path d="M 305 418 A 65 22 0 0 1 425 418" stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.4" />
</svg>`;

// 2. Version 2: The Tactical 3D Pulse Coil
const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bg-2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#0b1329" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="blue-2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <linearGradient id="gold-2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#eab308" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="115" fill="url(#bg-2)" />
  <rect width="512" height="512" rx="115" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3" />

  <path d="M 50 380 Q 150 340 256 375 T 460 350" stroke="rgba(255,255,255,0.12)" stroke-width="6" fill="none" />
  <path d="M 50 420 Q 180 390 310 420 T 460 400" stroke="rgba(56,189,248,0.18)" stroke-width="5" fill="none" />

  <g transform="translate(256, 275)">
    <ellipse cx="0" cy="45" rx="110" ry="36" stroke="#38bdf8" stroke-width="5" fill="none" opacity="0.6" stroke-dasharray="10 10" />
    <ellipse cx="0" cy="80" rx="140" ry="46" stroke="#38bdf8" stroke-width="3.5" fill="none" opacity="0.3" />

    <ellipse cx="0" cy="0" rx="150" ry="62" fill="#0b1329" stroke="url(#blue-2)" stroke-width="18" />
    <ellipse cx="0" cy="0" rx="62" ry="26" fill="none" stroke="url(#blue-2)" stroke-width="11" />
    <line x1="-150" y1="0" x2="150" y2="0" stroke="url(#blue-2)" stroke-width="11" />
    <line x1="0" y1="-62" x2="0" y2="62" stroke="url(#blue-2)" stroke-width="11" />

    <circle cx="0" cy="0" r="18" fill="url(#gold-2)" />
    <circle cx="0" cy="0" r="30" stroke="url(#gold-2)" stroke-width="5" fill="none" opacity="0.6" />

    <line x1="0" y1="-25" x2="-90" y2="-165" stroke="#ffffff" stroke-width="15" stroke-linecap="round" />
    <path d="M -90 -165 L -115 -190" stroke="#38bdf8" stroke-width="12" stroke-linecap="round" />
  </g>

  <text x="420" y="112" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="52" fill="#ffffff" letter-spacing="3">GP</text>
  <circle cx="440" cy="98" r="8" fill="#38bdf8" />
</svg>`;

// 3. Version 3: The GeoPin Discovery
const svg3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bg-3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#050b18" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="blue-3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="gold-3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="115" fill="url(#bg-3)" />
  <rect width="512" height="512" rx="115" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3" />

  <circle cx="256" cy="256" r="200" stroke="rgba(255,255,255,0.06)" stroke-width="3" fill="none" />
  <circle cx="256" cy="256" r="130" stroke="rgba(56,189,248,0.1)" stroke-width="3" fill="none" stroke-dasharray="8 8" />

  <!-- Search Coil at Base -->
  <g transform="translate(256, 365)">
    <ellipse cx="0" cy="0" rx="125" ry="46" fill="#0f172a" stroke="url(#blue-3)" stroke-width="13" />
    <ellipse cx="0" cy="0" rx="46" ry="18" fill="none" stroke="url(#blue-3)" stroke-width="8" />
    <line x1="-125" y1="0" x2="125" y2="0" stroke="url(#blue-3)" stroke-width="8" />
    <ellipse cx="0" cy="0" rx="88" ry="32" stroke="url(#gold-3)" stroke-width="4" fill="none" stroke-dasharray="8 8" />
  </g>

  <!-- Majestic Pin -->
  <g transform="translate(256, 218)">
    <path d="M 0 -135 C -72 -135 -118 -78 -118 -5 C -118 72 0 142 0 142 C 0 142 118 72 118 -5 C 118 -78 72 -135 0 -135 Z" fill="url(#blue-3)" />
    <circle cx="0" cy="-15" r="56" fill="#ffffff" />
    <text x="0" y="2" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="48" fill="#0f172a">GP</text>
  </g>
</svg>`;

// 4. Version 4: The Explorer Silhouette & Horizon
const svg4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bg-4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="blue-4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <linearGradient id="gold-4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="115" fill="url(#bg-4)" />
  <rect width="512" height="512" rx="115" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="3" />

  <path d="M 60 375 Q 160 360 256 370 T 450 365" stroke="rgba(255,255,255,0.14)" stroke-width="4" fill="none" />
  <path d="M 60 410 Q 180 395 300 410 T 450 400" stroke="rgba(255,255,255,0.07)" stroke-width="3" fill="none" />

  <!-- Sonar Pulse -->
  <path d="M 310 380 A 55 20 0 0 1 400 380" stroke="url(#blue-4)" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.9" />
  <path d="M 298 400 A 75 27 0 0 1 412 400" stroke="url(#blue-4)" stroke-width="4.5" fill="none" stroke-linecap="round" opacity="0.6" />
  <circle cx="355" cy="410" r="12" fill="url(#gold-4)" />

  <!-- Explorer Silhouette -->
  <path d="M 160 178 C 160 162 173 152 191 152 C 209 152 222 162 222 178 C 222 191 214 198 202 203 L 227 203 C 232 203 234 206 229 211 L 202 213 C 192 223 176 223 166 213 Z" fill="#ffffff" />
  <path d="M 168 218 C 150 234 145 260 142 295 L 175 310 L 185 275 L 195 290 L 192 360 L 172 360 L 172 370 L 202 370 L 210 295 C 218 270 215 240 198 218 Z" fill="#e2e8f0" />
  <path d="M 193 234 L 244 270 L 261 262 L 213 226 Z" fill="#ffffff" />

  <!-- Detector -->
  <line x1="248" y1="265" x2="355" y2="365" stroke="#94a3b8" stroke-width="8" stroke-linecap="round" />
  <g transform="rotate(-8 355 365)">
    <ellipse cx="355" cy="365" rx="42" ry="16" fill="#0f172a" stroke="url(#blue-4)" stroke-width="7" />
    <ellipse cx="355" cy="365" rx="16" ry="6.5" fill="#2563eb" />
  </g>

  <text x="80" y="125" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="52" fill="#ffffff" letter-spacing="2">GP</text>
  <circle cx="152" cy="110" r="7" fill="#38bdf8" />
  <text x="80" y="470" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="24" fill="#64748b" letter-spacing="5">GEOPROSPECT</text>
</svg>`;

// 5. Version 5: Pure White Minimalist Edition
const svg5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="blue-5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="gold-5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="115" fill="#ffffff" stroke="#e2e8f0" stroke-width="4" />

  <circle cx="256" cy="256" r="210" fill="#f8fafc" stroke="#e2e8f0" stroke-width="3" />
  <circle cx="256" cy="256" r="150" fill="none" stroke="#e2e8f0" stroke-width="2.5" stroke-dasharray="8 8" />

  <line x1="80" y1="370" x2="432" y2="370" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round" />

  <path d="M 310 388 A 50 18 0 0 1 400 388" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round" />
  <circle cx="355" cy="420" r="13" fill="url(#gold-5)" />

  <path d="M 165 174 C 165 158 178 148 196 148 C 214 148 227 158 227 174 C 227 187 219 194 207 199 L 232 199 C 237 199 239 202 234 207 L 207 209 C 197 219 181 219 171 209 Z" fill="#0f172a" />
  <path d="M 173 214 C 155 230 150 256 147 291 L 180 306 L 190 271 L 200 286 L 197 362 L 177 362 L 177 370 L 207 370 L 215 291 C 223 266 220 236 203 214 Z" fill="#1e293b" />
  <path d="M 198 230 L 249 266 L 266 258 L 218 222 Z" fill="#0f172a" />

  <line x1="253" y1="260" x2="355" y2="352" stroke="#3b82f6" stroke-width="8" stroke-linecap="round" />
  <g transform="rotate(-6 355 352)">
    <ellipse cx="355" cy="352" rx="44" ry="17" fill="#eff6ff" stroke="url(#blue-5)" stroke-width="7" />
    <ellipse cx="355" cy="352" rx="17" ry="6.5" fill="#2563eb" />
  </g>

  <text x="90" y="125" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="52" fill="#0f172a" letter-spacing="2">GP</text>
  <circle cx="166" cy="110" r="7" fill="#2563eb" />
  <text x="90" y="470" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#0f172a" letter-spacing="5">GEO<tspan fill="#2563eb">PROSPECT</tspan></text>
</svg>`;

// 6. Version 6: Gold Explorer Crest
const svg6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bg-6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1329" />
      <stop offset="100%" stop-color="#050b18" />
    </linearGradient>
    <linearGradient id="gold-6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <linearGradient id="blue-6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="115" fill="url(#bg-6)" />

  <circle cx="256" cy="256" r="220" fill="none" stroke="url(#gold-6)" stroke-width="7" />
  <circle cx="256" cy="256" r="208" fill="#0b1329" stroke="rgba(245, 158, 11, 0.25)" stroke-width="2.5" />

  <path d="M 65 280 Q 150 240 256 290 T 445 265" stroke="rgba(255,255,255,0.09)" stroke-width="3" fill="none" />
  <path d="M 55 330 Q 180 290 280 340 T 455 305" stroke="rgba(255,255,255,0.09)" stroke-width="3" fill="none" />

  <circle cx="256" cy="165" r="60" fill="url(#blue-6)" opacity="0.3" />
  <circle cx="256" cy="165" r="35" fill="url(#gold-6)" opacity="0.9" />

  <path d="M 185 188 C 185 174 195 164 210 164 C 225 164 235 174 235 188 C 235 198 228 204 218 208 L 243 208 C 248 208 250 211 245 216 L 218 218 C 210 228 198 228 188 218 Z" fill="#ffffff" />
  <path d="M 190 224 C 175 238 170 264 168 298 L 200 312 L 210 278 L 220 292 L 218 362 L 198 362 L 198 372 L 228 372 L 235 298 C 242 274 240 244 222 224 Z" fill="#f8fafc" />
  <path d="M 218 240 L 268 274 L 285 268 L 238 232 Z" fill="#ffffff" />

  <line x1="272" y1="270" x2="362" y2="352" stroke="#cbd5e1" stroke-width="7" stroke-linecap="round" />
  <g transform="rotate(-6 362 352)">
    <ellipse cx="362" cy="352" rx="46" ry="18" fill="#0b1329" stroke="url(#gold-6)" stroke-width="8" />
    <ellipse cx="362" cy="352" rx="18" ry="7" fill="url(#gold-6)" />
  </g>
  <path d="M 315 372 A 55 20 0 0 1 408 372" stroke="url(#gold-6)" stroke-width="5" fill="none" stroke-linecap="round" />

  <rect x="191" y="60" width="130" height="50" rx="25" fill="url(#gold-6)" />
  <text x="256" y="95" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="32" fill="#0f172a" letter-spacing="4">GP</text>
  <text x="256" y="445" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="22" fill="#f59e0b" letter-spacing="4">GEOPROSPECT</text>
</svg>`;

const icons = [
  { id: 'gp_v1_monogram', title: '1. Le Monogramme GP & Disque Fusionné', svg: svg1 },
  { id: 'gp_v2_tactical_coil', title: '2. Le Disque 3D & Ondes de Sol', svg: svg2 },
  { id: 'gp_v3_geopin', title: '3. Le GeoPin & Disque Précision', svg: svg3 },
  { id: 'gp_v4_explorer_horizon', title: '4. L\'Explorateur & Disque au Sol', svg: svg4 },
  { id: 'gp_v5_pure_white', title: '5. Pure White Minimaliste', svg: svg5 },
  { id: 'gp_v6_gold_crest', title: '6. L\'Écusson Gold & Navy', svg: svg6 }
];

async function generate() {
  console.log("Rendering 6 PNG images...");
  for (const item of icons) {
    const pngData = await renderAsync(item.svg, {
      fitTo: { mode: 'width', value: 1024 }
    });
    
    // Write to public/icons
    fs.writeFileSync(path.join(publicIconsDir, `${item.id}.png`), pngData.asPng());
    // Write to artifactDir
    fs.writeFileSync(path.join(artifactDir, `${item.id}.png`), pngData.asPng());
    console.log(`✓ Generated ${item.id}.png (1024x1024)`);
  }
  console.log("All icons generated successfully!");
}

generate().catch(console.error);
