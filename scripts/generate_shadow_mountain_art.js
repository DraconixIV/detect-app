import fs from 'fs';
import path from 'path';
import { renderAsync } from '@resvg/resvg-js';

const artifactDir = "C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e";
const publicIconsDir = path.resolve("./public/icons");

// =========================================================================
// 1. LA CRÊTE AIGUË & BRUME DE VALLÉE (Dramatic Alpine Knife-Edge Ridge)
// =========================================================================
const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1024" height="1024">
  <defs>
    <linearGradient id="sky-1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fdfbf7" />
      <stop offset="60%" stop-color="#f5efe6" />
      <stop offset="100%" stop-color="#edd5be" />
    </linearGradient>
    <linearGradient id="ridge-shadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2d2926" />
      <stop offset="100%" stop-color="#181614" />
    </linearGradient>
    <linearGradient id="ridge-light" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4a433c" />
      <stop offset="100%" stop-color="#2e2924" />
    </linearGradient>
  </defs>

  <rect width="1000" height="1000" fill="url(#sky-1)" />

  <!-- Soft Horizon Sun Glow -->
  <circle cx="500" cy="580" r="280" fill="#fef08a" opacity="0.25" />

  <!-- Distant Mountain Layers (Brume) -->
  <polygon points="0,780 180,680 400,740 600,660 850,730 1000,670 1000,1000 0,1000" fill="#ded5c5" opacity="0.6" />
  <polygon points="0,830 300,740 520,800 750,720 1000,790 1000,1000 0,1000" fill="#c4baa7" opacity="0.75" />

  <!-- DRAMATIC NEW MOUNTAIN RIDGE: Sharp Knife-Edge Alpine Ridge -->
  <!-- Left Shadow Flank -->
  <polygon points="0,960 220,820 500,600 500,1000 0,1000" fill="url(#ridge-shadow)" />
  <!-- Right Light Flank -->
  <polygon points="500,600 760,780 1000,890 1000,1000 500,1000" fill="url(#ridge-light)" />
  <!-- Ridge Crest Line -->
  <polyline points="0,960 220,820 500,600 760,780 1000,890" fill="none" stroke="#e7c8a4" stroke-width="3.5" stroke-linecap="round" />
  <line x1="500" y1="600" x2="500" y2="1000" stroke="#12100e" stroke-width="2.5" />

  <!-- Topo Lines on Mountain Face -->
  <path d="M 380 690 Q 500 660 620 680" fill="none" stroke="#e7c8a4" stroke-width="1.8" opacity="0.4" />
  <path d="M 300 750 Q 500 720 700 740" fill="none" stroke="#e7c8a4" stroke-width="1.8" opacity="0.3" />
  <path d="M 220 820 Q 500 780 780 810" fill="none" stroke="#e7c8a4" stroke-width="1.8" opacity="0.2" />

  <!-- ================= SHADOW CHARACTER (PERSONNAGE OMBRAGÉ) ================= -->
  <g transform="translate(0, 0)">
    <!-- Legs in Deep Shadow -->
    <path d="M 440 440 L 440 642 L 476 600 L 478 470 Z" fill="#24201d" stroke="#141210" stroke-width="2.5" />
    <path d="M 522 470 L 524 600 L 558 642 L 560 440 Z" fill="#1c1917" stroke="#141210" stroke-width="2.5" />

    <!-- Torso in Moody Shadow -->
    <path d="M 416 320 C 416 305 440 280 500 280 C 560 280 584 305 584 320 L 588 440 C 588 445 580 448 570 448 L 430 448 C 420 448 412 445 412 440 Z" fill="#2c2723" stroke="#181512" stroke-width="3" />
    <!-- Subtle Rim Highlight on Left Shoulder/Back -->
    <path d="M 416 340 C 418 315 440 284 500 284" fill="none" stroke="#f6d8b8" stroke-width="2.5" stroke-linecap="round" opacity="0.75" />

    <!-- Left Arm (Shadow) -->
    <path d="M 416 320 C 405 345 402 385 410 450 L 432 445 C 426 390 428 350 436 328 Z" fill="#28231f" stroke="#181512" stroke-width="2.5" />
    <!-- Left Hand -->
    <path d="M 414 450 C 414 465 422 475 432 472 C 438 470 436 455 434 445 Z" fill="#785944" stroke="#181512" stroke-width="2" />

    <!-- Right Arm (Shadow) -->
    <path d="M 580 325 C 596 350 618 360 610 385 C 602 400 584 370 568 340 Z" fill="#26221e" stroke="#181512" stroke-width="2.5" />
    <path d="M 610 385 L 590 315 L 615 310 L 632 375 Z" fill="#26221e" stroke="#181512" stroke-width="2.5" />
    <!-- Right Hand -->
    <path d="M 590 318 C 588 300 605 292 616 295 C 624 298 626 312 618 322 Z" fill="#785944" stroke="#181512" stroke-width="2" />

    <!-- Head & Hair (Deep Charcoal Shadow) -->
    <path d="M 482 280 L 482 265 L 518 265 L 518 280 Z" fill="#523c2d" stroke="#181512" stroke-width="2" />
    <path d="M 470 240 C 470 205 530 205 530 240 C 530 265 470 265 470 240 Z" fill="#1c1815" stroke="#0e0c0a" stroke-width="3" />
    <path d="M 470 230 C 475 210 500 206 525 212" fill="none" stroke="#f6d8b8" stroke-width="2" stroke-linecap="round" opacity="0.7" />

    <!-- ================= THE EXACT DETECTOR (NON CHANGÉ) ================= -->
    <g transform="rotate(-6 500 280)">
      <!-- Left side: Armrest Cuff -->
      <path d="M 405 270 C 390 262 390 245 405 242 L 450 242 C 458 242 462 250 460 260 L 452 278 Z" fill="#475569" stroke="#1e293b" stroke-width="3" />
      
      <!-- Long Detector Shaft -->
      <line x1="400" y1="280" x2="690" y2="280" stroke="#334155" stroke-width="9" stroke-linecap="round" />
      <line x1="400" y1="277" x2="690" y2="277" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" />

      <!-- Right side: Search Coil Disc -->
      <g transform="translate(710, 280)">
        <ellipse cx="0" cy="0" rx="52" ry="24" fill="#1e293b" stroke="#0f172a" stroke-width="6" />
        <ellipse cx="0" cy="0" rx="22" ry="10" fill="none" stroke="#64748b" stroke-width="3" />
        <line x1="-52" y1="0" x2="52" y2="0" stroke="#64748b" stroke-width="3" />
        <line x1="0" y1="-24" x2="0" y2="24" stroke="#64748b" stroke-width="3" />
      </g>
    </g>
  </g>
</svg>`;

// =========================================================================
// 2. LES RELIEFS STRATIFIÉS & COURBES ORGANIQUES (Flowing Sandstone Strata)
// =========================================================================
const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1024" height="1024">
  <defs>
    <linearGradient id="sky-2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#faf6ee" />
      <stop offset="65%" stop-color="#f2ebd9" />
      <stop offset="100%" stop-color="#e2cfb8" />
    </linearGradient>
  </defs>

  <rect width="1000" height="1000" fill="url(#sky-2)" />

  <!-- Curved Organic Sandstone Wave Mountains -->
  <path d="M 0 760 Q 250 680 500 740 T 1000 710 L 1000 1000 L 0 1000 Z" fill="#d5c8b2" />
  <path d="M 0 820 Q 280 750 550 810 T 1000 780 L 1000 1000 L 0 1000 Z" fill="#bfae95" />
  <path d="M 0 890 Q 320 830 600 880 T 1000 860 L 1000 1000 L 0 1000 Z" fill="#a48f73" />

  <!-- Front Summit: Sculpted Organic Rock Peak -->
  <polygon points="180,1000 500,600 500,1000" fill="#3a322b" />
  <polygon points="500,600 840,1000 500,1000" fill="#29231e" />
  <path d="M 0 940 Q 280 810 500 600 T 1000 920" fill="none" stroke="#e8cfae" stroke-width="4" />

  <!-- Shadow Character on Peak -->
  <g transform="translate(0, 0)">
    <path d="M 440 440 L 440 642 L 476 600 L 478 470 Z" fill="#1e1a17" stroke="#0e0c0a" stroke-width="2.5" />
    <path d="M 522 470 L 524 600 L 558 642 L 560 440 Z" fill="#181512" stroke="#0e0c0a" stroke-width="2.5" />
    <path d="M 416 320 C 416 305 440 280 500 280 C 560 280 584 305 584 320 L 588 440 C 588 445 580 448 570 448 L 430 448 C 420 448 412 445 412 440 Z" fill="#26211d" stroke="#120f0d" stroke-width="3" />
    <path d="M 416 320 C 405 345 402 385 410 450 L 432 445 C 426 390 428 350 436 328 Z" fill="#221e1a" stroke="#120f0d" stroke-width="2.5" />
    <path d="M 610 385 L 590 315 L 615 310 L 632 375 Z" fill="#221e1a" stroke="#120f0d" stroke-width="2.5" />
    <path d="M 470 240 C 470 205 530 205 530 240 C 530 265 470 265 470 240 Z" fill="#161310" stroke="#0a0807" stroke-width="3" />

    <!-- Exact Detector -->
    <g transform="rotate(-6 500 280)">
      <path d="M 405 270 C 390 262 390 245 405 242 L 450 242 C 458 242 462 250 460 260 L 452 278 Z" fill="#475569" stroke="#1e293b" stroke-width="3" />
      <line x1="400" y1="280" x2="690" y2="280" stroke="#334155" stroke-width="9" stroke-linecap="round" />
      <g transform="translate(710, 280)">
        <ellipse cx="0" cy="0" rx="52" ry="24" fill="#1e293b" stroke="#0f172a" stroke-width="6" />
        <ellipse cx="0" cy="0" rx="22" ry="10" fill="none" stroke="#64748b" stroke-width="3" />
        <line x1="-52" y1="0" x2="52" y2="0" stroke="#64748b" stroke-width="3" />
        <line x1="0" y1="-24" x2="0" y2="24" stroke="#64748b" stroke-width="3" />
      </g>
    </g>
  </g>
</svg>`;

// =========================================================================
// 3. LE SOMMET EN FALAISE & ABÎME ROCHEUX (High Alpine Precipice)
// =========================================================================
const svg3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1024" height="1024">
  <defs>
    <linearGradient id="sky-3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f8f4eb" />
      <stop offset="50%" stop-color="#eddac6" />
      <stop offset="100%" stop-color="#d9b693" />
    </linearGradient>
  </defs>

  <rect width="1000" height="1000" fill="url(#sky-3)" />

  <!-- Distant mountain silhouette ridges in pastel haze -->
  <polygon points="0,640 240,560 480,630 760,550 1000,610 1000,1000 0,1000" fill="#cfbfa8" opacity="0.4" />
  <polygon points="0,720 320,640 600,710 880,630 1000,690 1000,1000 0,1000" fill="#baa48b" opacity="0.6" />

  <!-- Massive High Clifftop Peak (Standing on the Promontory) -->
  <polygon points="0,1000 0,780 280,680 500,600 500,1000" fill="#2d2621" />
  <polygon points="500,600 680,740 780,1000 500,1000" fill="#201b17" />
  <polygon points="680,740 1000,840 1000,1000 780,1000" fill="#181411" />

  <polyline points="0,780 280,680 500,600 680,740 1000,840" fill="none" stroke="#f1dac2" stroke-width="3.5" />

  <!-- Shadow Character -->
  <g transform="translate(0, 0)">
    <path d="M 440 440 L 440 642 L 476 600 L 478 470 Z" fill="#1c1815" stroke="#0a0807" stroke-width="2.5" />
    <path d="M 522 470 L 524 600 L 558 642 L 560 440 Z" fill="#14110e" stroke="#0a0807" stroke-width="2.5" />
    <path d="M 416 320 C 416 305 440 280 500 280 C 560 280 584 305 584 320 L 588 440 C 588 445 580 448 570 448 L 430 448 C 420 448 412 445 412 440 Z" fill="#241f1b" stroke="#0f0c0a" stroke-width="3" />
    <path d="M 416 320 C 405 345 402 385 410 450 L 432 445 C 426 390 428 350 436 328 Z" fill="#201b18" stroke="#0f0c0a" stroke-width="2.5" />
    <path d="M 610 385 L 590 315 L 615 310 L 632 375 Z" fill="#201b18" stroke="#0f0c0a" stroke-width="2.5" />
    <path d="M 470 240 C 470 205 530 205 530 240 C 530 265 470 265 470 240 Z" fill="#120f0d" stroke="#050403" stroke-width="3" />

    <!-- Exact Detector -->
    <g transform="rotate(-6 500 280)">
      <path d="M 405 270 C 390 262 390 245 405 242 L 450 242 C 458 242 462 250 460 260 L 452 278 Z" fill="#475569" stroke="#1e293b" stroke-width="3" />
      <line x1="400" y1="280" x2="690" y2="280" stroke="#334155" stroke-width="9" stroke-linecap="round" />
      <g transform="translate(710, 280)">
        <ellipse cx="0" cy="0" rx="52" ry="24" fill="#1e293b" stroke="#0f172a" stroke-width="6" />
        <ellipse cx="0" cy="0" rx="22" ry="10" fill="none" stroke="#64748b" stroke-width="3" />
        <line x1="-52" y1="0" x2="52" y2="0" stroke="#64748b" stroke-width="3" />
        <line x1="0" y1="-24" x2="0" y2="24" stroke="#64748b" stroke-width="3" />
      </g>
    </g>
  </g>
</svg>`;

// =========================================================================
// 4. LE PIC GÉOMÉTRIQUE SOMBRE & ARÊTES ÉPURÉES (Pure Nordic Razor Shadow)
// =========================================================================
const svg4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1024" height="1024">
  <defs>
    <linearGradient id="sky-4" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fdfcf9" />
      <stop offset="100%" stop-color="#f3eee3" />
    </linearGradient>
  </defs>

  <rect width="1000" height="1000" fill="url(#sky-4)" />

  <!-- Ultra Clean Razor Peak (Dark Charcoal & Slate Tone) -->
  <polygon points="120,1000 280,780 500,600 500,1000" fill="#38332e" />
  <polygon points="0,1000 120,1000 280,780 0,920" fill="#4d463f" />
  <polygon points="500,600 780,820 1000,1000 500,1000" fill="#221e1b" />
  <polygon points="780,820 1000,900 1000,1000" fill="#1a1714" />

  <polyline points="0,920 280,780 500,600 780,820 1000,900" fill="none" stroke="#786c5e" stroke-width="2.5" />
  <line x1="500" y1="600" x2="500" y2="1000" stroke="#120f0d" stroke-width="2" />

  <!-- Shadow Character -->
  <g transform="translate(0, 0)">
    <path d="M 440 440 L 440 642 L 476 600 L 478 470 Z" fill="#221e1a" stroke="#100d0b" stroke-width="2.5" />
    <path d="M 522 470 L 524 600 L 558 642 L 560 440 Z" fill="#1a1714" stroke="#100d0b" stroke-width="2.5" />
    <path d="M 416 320 C 416 305 440 280 500 280 C 560 280 584 305 584 320 L 588 440 C 588 445 580 448 570 448 L 430 448 C 420 448 412 445 412 440 Z" fill="#2a2520" stroke="#14110e" stroke-width="3" />
    <path d="M 416 320 C 405 345 402 385 410 450 L 432 445 C 426 390 428 350 436 328 Z" fill="#25201b" stroke="#14110e" stroke-width="2.5" />
    <path d="M 610 385 L 590 315 L 615 310 L 632 375 Z" fill="#25201b" stroke="#14110e" stroke-width="2.5" />
    <path d="M 470 240 C 470 205 530 205 530 240 C 530 265 470 265 470 240 Z" fill="#15120f" stroke="#080706" stroke-width="3" />

    <!-- Exact Detector -->
    <g transform="rotate(-6 500 280)">
      <path d="M 405 270 C 390 262 390 245 405 242 L 450 242 C 458 242 462 250 460 260 L 452 278 Z" fill="#475569" stroke="#1e293b" stroke-width="3" />
      <line x1="400" y1="280" x2="690" y2="280" stroke="#334155" stroke-width="9" stroke-linecap="round" />
      <g transform="translate(710, 280)">
        <ellipse cx="0" cy="0" rx="52" ry="24" fill="#1e293b" stroke="#0f172a" stroke-width="6" />
        <ellipse cx="0" cy="0" rx="22" ry="10" fill="none" stroke="#64748b" stroke-width="3" />
        <line x1="-52" y1="0" x2="52" y2="0" stroke="#64748b" stroke-width="3" />
        <line x1="0" y1="-24" x2="0" y2="24" stroke="#64748b" stroke-width="3" />
      </g>
    </g>
  </g>
</svg>`;

const artworks = [
  { id: 'shadow_v1_alpine_ridge', svg: svg1 },
  { id: 'shadow_v2_organic_strata', svg: svg2 },
  { id: 'shadow_v3_high_precipice', svg: svg3 },
  { id: 'shadow_v4_nordic_razor', svg: svg4 }
];

async function renderShadowArt() {
  console.log("Rendering 4 shadow character + mountain style variations in 1024x1024...");
  for (const item of artworks) {
    const png = await renderAsync(item.svg, {
      fitTo: { mode: 'width', value: 1024 }
    });
    fs.writeFileSync(path.join(publicIconsDir, `${item.id}.png`), png.asPng());
    fs.writeFileSync(path.join(artifactDir, `${item.id}.png`), png.asPng());
    console.log(`✓ Generated ${item.id}.png`);
  }
  console.log("All shadow variations ready!");
}

renderShadowArt().catch(console.error);
