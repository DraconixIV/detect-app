import fs from 'fs';
import path from 'path';
import { renderAsync } from '@resvg/resvg-js';

const artifactDir = "C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e";
const publicIconsDir = path.resolve("./public/icons");

// =========================================================================
// VERSION 1 : "L'Explorateur & Courbes Topographiques IGN" (Hommage Sublime)
// =========================================================================
const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1024" height="1024">
  <defs>
    <!-- Background Paper Cream Texture Tint -->
    <linearGradient id="bg-cream" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f7f5f0" />
      <stop offset="100%" stop-color="#efece4" />
    </linearGradient>
    <linearGradient id="blue-pulse" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <linearGradient id="gold-target" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1000" height="1000" fill="url(#bg-cream)" />

  <!-- Subtle Sun / Horizon Radar Arc -->
  <circle cx="500" cy="500" r="380" fill="none" stroke="rgba(217, 210, 196, 0.4)" stroke-width="1.5" />
  <circle cx="500" cy="500" r="260" fill="none" stroke="rgba(217, 210, 196, 0.3)" stroke-width="1.5" stroke-dasharray="6 6" />

  <!-- ================= GEOMETRIC MOUNTAIN PEAK ================= -->
  <!-- Left Mountain Ridge Shadow -->
  <polygon points="120,1000 240,760 360,920 500,600 500,1000" fill="#ded7cb" />
  <!-- Left Ridge Light Facet -->
  <polygon points="0,1000 120,1000 240,760 0,900" fill="#e8e2d8" />
  <!-- Center Main Peak Light Face -->
  <polygon points="500,600 500,1000 100,1000 240,760" fill="#e5dfd5" />
  <!-- Center Main Peak Shadow Face (Right) -->
  <polygon points="500,600 1000,1000 500,1000" fill="#d0c7b8" />
  <!-- Far Right Facet -->
  <polygon points="720,780 1000,1000 780,1000" fill="#c4baa9" />

  <!-- Mountain Peak Outlines -->
  <polyline points="0,900 240,760 360,920 500,600 720,780 1000,1000" fill="none" stroke="#7a7164" stroke-width="2.5" stroke-linejoin="round" />
  <line x1="500" y1="600" x2="500" y2="1000" stroke="#7a7164" stroke-width="2" />

  <!-- Elegant Topographic Contour Lines on Mountain -->
  <path d="M 380 720 Q 500 680 620 710" fill="none" stroke="#2563eb" stroke-width="2" opacity="0.45" />
  <path d="M 310 780 Q 500 740 700 770" fill="none" stroke="#2563eb" stroke-width="1.8" opacity="0.35" />
  <path d="M 250 840 Q 500 800 780 830" fill="none" stroke="#2563eb" stroke-width="1.8" opacity="0.25" />
  <path d="M 180 900 Q 500 860 860 890" fill="none" stroke="#2563eb" stroke-width="1.8" opacity="0.18" />

  <!-- ================= THE MINIMALIST EXPLORER (BACK VIEW) ================= -->
  <g transform="translate(0, 0)">
    
    <!-- Legs / Trousers -->
    <!-- Left Leg -->
    <path d="M 440 440 L 440 642 L 476 600 L 478 470 Z" fill="#b8aea0" stroke="#4a443a" stroke-width="3" stroke-linejoin="round" />
    <!-- Right Leg -->
    <path d="M 522 470 L 524 600 L 558 642 L 560 440 Z" fill="#ada395" stroke="#4a443a" stroke-width="3" stroke-linejoin="round" />
    
    <!-- Torso / Minimalist Cream-Beige Sweater / Jacket -->
    <path d="M 416 320 C 416 305 440 280 500 280 C 560 280 584 305 584 320 L 588 440 C 588 445 580 448 570 448 L 430 448 C 420 448 412 445 412 440 Z" fill="#ede8de" stroke="#4a443a" stroke-width="3.5" stroke-linejoin="round" />
    <!-- Subtle Spine fold line -->
    <line x1="500" y1="290" x2="500" y2="435" stroke="#4a443a" stroke-width="2" stroke-linecap="round" opacity="0.6" />

    <!-- Left Arm (Resting Down naturally) -->
    <path d="M 416 320 C 405 345 402 385 410 450 L 432 445 C 426 390 428 350 436 328 Z" fill="#ede8de" stroke="#4a443a" stroke-width="3" stroke-linejoin="round" />
    <!-- Left Hand -->
    <path d="M 414 450 C 414 465 422 475 432 472 C 438 470 436 455 434 445 Z" fill="#f0d5c2" stroke="#4a443a" stroke-width="2.5" />

    <!-- Right Arm (Bent up gripping the detector shaft) -->
    <path d="M 580 325 C 596 350 618 360 610 385 C 602 400 584 370 568 340 Z" fill="#ede8de" stroke="#4a443a" stroke-width="3" stroke-linejoin="round" />
    <path d="M 610 385 L 590 315 L 615 310 L 632 375 Z" fill="#ede8de" stroke="#4a443a" stroke-width="3" stroke-linejoin="round" />
    <!-- Right Hand gripping shaft -->
    <path d="M 590 318 C 588 300 605 292 616 295 C 624 298 626 312 618 322 Z" fill="#f0d5c2" stroke="#4a443a" stroke-width="2.5" />

    <!-- Head & Neck from Back -->
    <path d="M 482 280 L 482 265 L 518 265 L 518 280 Z" fill="#f0d5c2" stroke="#4a443a" stroke-width="2.5" />
    <!-- Minimalist Hair Cut (Brun) -->
    <path d="M 470 240 C 470 205 530 205 530 240 C 530 265 470 265 470 240 Z" fill="#544439" stroke="#362921" stroke-width="3" />
    <!-- Collar Line -->
    <path d="M 465 280 C 485 290 515 290 535 280" fill="none" stroke="#4a443a" stroke-width="3" stroke-linecap="round" />

    <!-- ================= THE METAL DETECTOR ON THE SHOULDERS ================= -->
    <!-- Detector Main Shaft (Barre traversant le dos horizontalement) -->
    <g transform="rotate(-6 500 280)">
      <!-- Left side: Armrest Cuff & Control Box -->
      <path d="M 405 270 C 390 262 390 245 405 242 L 450 242 C 458 242 462 250 460 260 L 452 278 Z" fill="#475569" stroke="#1e293b" stroke-width="3" />
      <rect x="445" y="258" width="18" height="28" rx="4" fill="#2563eb" stroke="#1e293b" stroke-width="2.5" />
      
      <!-- Long Detector Stem / Shaft -->
      <line x1="400" y1="280" x2="690" y2="280" stroke="#334155" stroke-width="9" stroke-linecap="round" />
      <line x1="400" y1="278" x2="690" y2="278" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" />

      <!-- Right side: The Double-D Search Coil Disc -->
      <g transform="translate(710, 280)">
        <!-- Subtle Glowing Sonar Pulse from Coil -->
        <ellipse cx="0" cy="0" rx="65" ry="32" fill="none" stroke="url(#blue-pulse)" stroke-width="2.5" opacity="0.7" stroke-dasharray="6 4" />
        
        <!-- Outer DD Coil Ring (Realistic Perspective) -->
        <ellipse cx="0" cy="0" rx="52" ry="24" fill="#1e293b" stroke="#0f172a" stroke-width="6" />
        <ellipse cx="0" cy="0" rx="52" ry="24" fill="none" stroke="#38bdf8" stroke-width="3" />
        
        <!-- Inner Double-D Struts -->
        <ellipse cx="0" cy="0" rx="22" ry="10" fill="none" stroke="#38bdf8" stroke-width="3" />
        <line x1="-52" y1="0" x2="52" y2="0" stroke="#38bdf8" stroke-width="3" />
        <line x1="0" y1="-24" x2="0" y2="24" stroke="#38bdf8" stroke-width="3" />
        
        <!-- Gold Find Center Spot -->
        <circle cx="0" cy="0" r="5" fill="url(#gold-target)" />
      </g>
    </g>

  </g>

  <!-- ================= BRAND TYPOGRAPHY ================= -->
  <text x="500" y="110" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="36" fill="#1e293b" letter-spacing="12">GEOPROSPECT</text>
  <text x="500" y="145" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="13" fill="#2563eb" letter-spacing="6">CARTOGRAPHIE &amp; PROSPECTION</text>

  <!-- Subtle GPS Coordinates Tag -->
  <text x="500" y="960" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11" fill="#7a7164" letter-spacing="4">43°19'N • 3°07'E — 100% LIBRE</text>
</svg>`;

// =========================================================================
// VERSION 2 : "Le Crépuscule du Prospecteur" (Golden Hour & Ciel Cobalt)
// =========================================================================
const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1024" height="1024">
  <defs>
    <linearGradient id="bg-twilight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0b1528" />
      <stop offset="45%" stop-color="#182d4d" />
      <stop offset="70%" stop-color="#b45309" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <linearGradient id="gold-glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>

  <!-- Sky Gradient -->
  <rect width="1000" height="1000" fill="url(#bg-twilight)" />

  <!-- Sun on Horizon -->
  <circle cx="500" cy="590" r="140" fill="url(#gold-glow)" opacity="0.85" />
  <circle cx="500" cy="590" r="220" fill="none" stroke="rgba(253, 224, 71, 0.3)" stroke-width="2" stroke-dasharray="6 6" />

  <!-- Mountain Silhouettes in Deep Slate Navy -->
  <polygon points="120,1000 240,760 360,920 500,600 500,1000" fill="#0c1729" />
  <polygon points="0,1000 120,1000 240,760 0,900" fill="#13233a" />
  <polygon points="500,600 500,1000 100,1000 240,760" fill="#182b45" />
  <polygon points="500,600 1000,1000 500,1000" fill="#080f1a" />
  <polygon points="720,780 1000,1000 780,1000" fill="#0f1d30" />

  <polyline points="0,900 240,760 360,920 500,600 720,780 1000,1000" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linejoin="round" opacity="0.7" />

  <!-- Gold Topo Lines -->
  <path d="M 380 720 Q 500 680 620 710" fill="none" stroke="#fde047" stroke-width="2" opacity="0.4" />
  <path d="M 310 780 Q 500 740 700 770" fill="none" stroke="#fde047" stroke-width="1.8" opacity="0.3" />

  <!-- THE EXPLORER (Silhouette Night Style) -->
  <!-- Left Leg -->
  <path d="M 440 440 L 440 642 L 476 600 L 478 470 Z" fill="#0a1220" stroke="#f59e0b" stroke-width="1.5" />
  <!-- Right Leg -->
  <path d="M 522 470 L 524 600 L 558 642 L 560 440 Z" fill="#080e1a" stroke="#f59e0b" stroke-width="1.5" />

  <!-- Torso in Slate Blue / Warm rim light -->
  <path d="M 416 320 C 416 305 440 280 500 280 C 560 280 584 305 584 320 L 588 440 C 588 445 580 448 570 448 L 430 448 C 420 448 412 445 412 440 Z" fill="#0f1e33" stroke="#fde047" stroke-width="2" />
  
  <!-- Left Arm -->
  <path d="M 416 320 C 405 345 402 385 410 450 L 432 445 C 426 390 428 350 436 328 Z" fill="#0f1e33" stroke="#fde047" stroke-width="1.5" />
  
  <!-- Right Arm -->
  <path d="M 610 385 L 590 315 L 615 310 L 632 375 Z" fill="#0f1e33" stroke="#fde047" stroke-width="1.5" />

  <!-- Head -->
  <path d="M 470 240 C 470 205 530 205 530 240 C 530 265 470 265 470 240 Z" fill="#0a1220" stroke="#fde047" stroke-width="1.5" />

  <!-- Detector across shoulders -->
  <g transform="rotate(-6 500 280)">
    <line x1="400" y1="280" x2="690" y2="280" stroke="#e2e8f0" stroke-width="9" stroke-linecap="round" />
    <g transform="translate(710, 280)">
      <!-- Golden Glow Pulse -->
      <ellipse cx="0" cy="0" rx="65" ry="32" fill="none" stroke="#fde047" stroke-width="3" stroke-dasharray="6 4" />
      <ellipse cx="0" cy="0" rx="52" ry="24" fill="#0b1528" stroke="#fde047" stroke-width="5" />
      <circle cx="0" cy="0" r="7" fill="#fde047" />
    </g>
  </g>

  <!-- Typography -->
  <text x="500" y="110" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="36" fill="#ffffff" letter-spacing="12">GEOPROSPECT</text>
  <text x="500" y="145" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="13" fill="#fde047" letter-spacing="6">L'AVENTURE &amp; LA DÉCOUVERTE</text>
</svg>`;

// =========================================================================
// VERSION 3 : "Pure Scandinavian White & Blue" (Studio Haute Couture)
// =========================================================================
const svg3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1024" height="1024">
  <defs>
    <linearGradient id="blue-scandi" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
  </defs>

  <rect width="1000" height="1000" fill="#ffffff" />

  <!-- Clean Minimalist Radar Halo -->
  <circle cx="500" cy="460" r="320" fill="none" stroke="#e2e8f0" stroke-width="2" />
  <circle cx="500" cy="460" r="220" fill="none" stroke="#dbeafe" stroke-width="2" stroke-dasharray="6 6" />

  <!-- Minimalist Geometric Mountain Line -->
  <polygon points="120,1000 240,760 360,920 500,600 500,1000" fill="#f1f5f9" />
  <polygon points="500,600 1000,1000 500,1000" fill="#e2e8f0" />
  <polyline points="0,900 240,760 360,920 500,600 720,780 1000,1000" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round" />

  <!-- Topographic Isolines in Clean Blue -->
  <path d="M 380 720 Q 500 680 620 710" fill="none" stroke="#2563eb" stroke-width="2.5" />
  <path d="M 310 780 Q 500 740 700 770" fill="none" stroke="#2563eb" stroke-width="2" opacity="0.7" />
  <path d="M 250 840 Q 500 800 780 830" fill="none" stroke="#2563eb" stroke-width="2" opacity="0.4" />

  <!-- Minimalist Character in Modern Navy Outdoor Jacket -->
  <!-- Legs -->
  <path d="M 440 440 L 440 642 L 476 600 L 478 470 Z" fill="#334155" stroke="#0f172a" stroke-width="3" />
  <path d="M 522 470 L 524 600 L 558 642 L 560 440 Z" fill="#1e293b" stroke="#0f172a" stroke-width="3" />

  <!-- Torso in Premium Royal Blue -->
  <path d="M 416 320 C 416 305 440 280 500 280 C 560 280 584 305 584 320 L 588 440 C 588 445 580 448 570 448 L 430 448 C 420 448 412 445 412 440 Z" fill="#0f172a" stroke="#0f172a" stroke-width="3.5" />
  
  <!-- Arms -->
  <path d="M 416 320 C 405 345 402 385 410 450 L 432 445 C 426 390 428 350 436 328 Z" fill="#0f172a" stroke="#0f172a" stroke-width="3" />
  <path d="M 610 385 L 590 315 L 615 310 L 632 375 Z" fill="#0f172a" stroke="#0f172a" stroke-width="3" />

  <!-- Head -->
  <path d="M 470 240 C 470 205 530 205 530 240 C 530 265 470 265 470 240 Z" fill="#1e293b" stroke="#0f172a" stroke-width="3" />

  <!-- Detector with Electric Saphir Coil -->
  <g transform="rotate(-6 500 280)">
    <line x1="400" y1="280" x2="690" y2="280" stroke="#0f172a" stroke-width="10" stroke-linecap="round" />
    <g transform="translate(710, 280)">
      <ellipse cx="0" cy="0" rx="54" ry="25" fill="#ffffff" stroke="#2563eb" stroke-width="7" />
      <ellipse cx="0" cy="0" rx="22" ry="10" fill="none" stroke="#2563eb" stroke-width="4" />
      <line x1="-54" y1="0" x2="54" y2="0" stroke="#2563eb" stroke-width="4" />
      <circle cx="0" cy="0" r="6" fill="#f59e0b" />
    </g>
  </g>

  <!-- Typography -->
  <text x="500" y="110" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="40" letter-spacing="2">
    <tspan fill="#0f172a">Geo</tspan><tspan fill="#2563eb">Prospect</tspan>
  </text>
  <text x="500" y="145" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="12" fill="#64748b" letter-spacing="8">EDITION SUISSE &amp; NORDIQUE</text>
</svg>`;

// =========================================================================
// VERSION 4 : "Format Icône d'Application Squircle" (Play Store & App Icon)
// =========================================================================
const svg4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1024" height="1024">
  <defs>
    <linearGradient id="bg-icon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <linearGradient id="blue-ico" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
  </defs>

  <!-- Squircle Base -->
  <rect width="1000" height="1000" rx="230" fill="url(#bg-icon)" stroke="#cbd5e1" stroke-width="8" />

  <!-- Mountain Peak rising from bottom -->
  <polygon points="240,1000 500,680 500,1000" fill="#cbd5e1" />
  <polygon points="500,680 1000,1000 500,1000" fill="#94a3b8" />
  <polyline points="0,960 240,820 500,680 760,840 1000,1000" fill="none" stroke="#334155" stroke-width="5" stroke-linejoin="round" />

  <!-- Topo Curve -->
  <path d="M 380 780 Q 500 740 620 770" fill="none" stroke="#2563eb" stroke-width="4" />

  <!-- Explorer centered -->
  <!-- Legs -->
  <path d="M 440 520 L 440 722 L 476 680 L 478 550 Z" fill="#475569" stroke="#0f172a" stroke-width="4" />
  <path d="M 522 550 L 524 680 L 558 722 L 560 520 Z" fill="#334155" stroke="#0f172a" stroke-width="4" />

  <!-- Torso -->
  <path d="M 416 400 C 416 385 440 360 500 360 C 560 360 584 385 584 400 L 588 520 C 588 525 580 528 570 528 L 430 528 C 420 528 412 525 412 520 Z" fill="#0f172a" stroke="#0f172a" stroke-width="4" />
  <path d="M 416 400 C 405 425 402 465 410 530 L 432 525 C 426 470 428 430 436 408 Z" fill="#0f172a" stroke="#0f172a" stroke-width="4" />
  <path d="M 610 465 L 590 395 L 615 390 L 632 455 Z" fill="#0f172a" stroke="#0f172a" stroke-width="4" />

  <!-- Head -->
  <path d="M 470 320 C 470 285 530 285 530 320 C 530 345 470 345 470 320 Z" fill="#1e293b" stroke="#0f172a" stroke-width="4" />

  <!-- Detector -->
  <g transform="rotate(-6 500 360)">
    <line x1="400" y1="360" x2="690" y2="360" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
    <g transform="translate(710, 360)">
      <ellipse cx="0" cy="0" rx="58" ry="27" fill="#ffffff" stroke="url(#blue-ico)" stroke-width="9" />
      <ellipse cx="0" cy="0" rx="24" ry="11" fill="none" stroke="url(#blue-ico)" stroke-width="5" />
      <circle cx="0" cy="0" r="7" fill="#f59e0b" />
    </g>
  </g>

  <!-- Monogram GP at Top -->
  <text x="500" y="190" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="72" fill="#0f172a" letter-spacing="6">GP</text>
</svg>`;

const artworks = [
  { id: 'gp_adventurer_v1_topo_cream', svg: svg1 },
  { id: 'gp_adventurer_v2_twilight_gold', svg: svg2 },
  { id: 'gp_adventurer_v3_scandi_white', svg: svg3 },
  { id: 'gp_adventurer_v4_app_icon_squircle', svg: svg4 }
];

async function generateAll() {
  console.log("Rendering 4 new artistic explorer artworks in 1024x1024...");
  for (const item of artworks) {
    const pngData = await renderAsync(item.svg, {
      fitTo: { mode: 'width', value: 1024 }
    });
    fs.writeFileSync(path.join(publicIconsDir, `${item.id}.png`), pngData.asPng());
    fs.writeFileSync(path.join(artifactDir, `${item.id}.png`), pngData.asPng());
    console.log(`✓ Generated ${item.id}.png`);
  }
  console.log("Artistic Explorer collection generated successfully!");
}

generateAll().catch(console.error);
