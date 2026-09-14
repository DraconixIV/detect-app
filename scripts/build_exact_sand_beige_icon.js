import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceImagePath = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e/.user_uploaded/media_1789416468863.jpg';
const artifactDir = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e';
const publicIconsDir = path.resolve('./public/icons');
const publicDir = path.resolve('./public');

async function buildOfficialGeoProspectIcon() {
  console.log('Generating Official GeoProspect Sand Beige Master Icon...');

  // Target size 1024x1024
  const width = 1024;
  const height = 1024;

  // SVG combining Nuance 1 (Beige Sable Minéral) + Option 3 (Halo Bleu Saphir + Cercle radar + Vagues sonar + Cœur Or)
  const masterSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Fond Nuance 1 : Beige Sable Minéral & Lin avec texture chaude -->
      <linearGradient id="sand-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f7f3ec" />
        <stop offset="50%" stop-color="#f0e9dc" />
        <stop offset="100%" stop-color="#e6dcce" />
      </linearGradient>

      <!-- Halo Radar Bleu Saphir GPS doux -->
      <radialGradient id="soft-blue-halo" cx="50%" cy="58%" r="44%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.38" />
        <stop offset="50%" stop-color="#2563eb" stop-opacity="0.16" />
        <stop offset="100%" stop-color="#f0e9dc" stop-opacity="0" />
      </radialGradient>

      <!-- Point d'or / Cible 24k en dégradé éclatant -->
      <radialGradient id="gold-spot" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffea75" />
        <stop offset="50%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#d97706" />
      </radialGradient>
      
      <!-- Halo d'or subtil -->
      <radialGradient id="gold-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Fond Beige Sable Minéral plein format -->
    <rect width="${width}" height="${height}" fill="url(#sand-gradient)" />
    
    <!-- Halo Radar Bleu Saphir derrière le disque du détecteur (centre x: 512, y: 580) -->
    <circle cx="512" cy="580" r="410" fill="url(#soft-blue-halo)" />
    
    <!-- Cercles guides radar de précision -->
    <circle cx="512" cy="580" r="340" stroke="#cbd5e1" stroke-width="2.2" fill="none" stroke-dasharray="8 8" opacity="0.8" />
    <circle cx="512" cy="580" r="260" stroke="#93c5fd" stroke-width="1.8" fill="none" opacity="0.6" />

    <!-- Ondes sonar souterraines bleues au bas de l'icône -->
    <path d="M 240 880 Q 512 820 784 880" stroke="#2563eb" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.65" />
    <path d="M 320 925 Q 512 875 704 925" stroke="#3b82f6" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.4" />

    <!-- Cœur de cible en Or 24k pur -->
    <circle cx="512" cy="582" r="32" fill="url(#gold-glow)" />
    <circle cx="512" cy="582" r="21" fill="url(#gold-spot)" />
    <circle cx="512" cy="582" r="21" stroke="#b45309" stroke-width="1.2" fill="none" opacity="0.5" />
  </svg>`;

  // Composite user original black emblem with multiply blend onto our sand beige + blue/gold background
  const finalMasterBuffer = await sharp(Buffer.from(masterSvg))
    .composite([{ input: sourceImagePath, blend: 'multiply' }])
    .png({ quality: 100 })
    .toBuffer();

  // Save master 1024x1024 icon
  fs.writeFileSync(path.join(artifactDir, 'geoprospect_final_master.png'), finalMasterBuffer);
  fs.writeFileSync(path.join(publicIconsDir, 'geoprospect_final_master.png'), finalMasterBuffer);
  fs.writeFileSync(path.join(artifactDir, 'gp_combo_parfait_sand_beige.png'), finalMasterBuffer);
  fs.writeFileSync(path.join(publicIconsDir, 'gp_combo_parfait_sand_beige.png'), finalMasterBuffer);
  console.log('✓ Master 1024x1024 icon generated');

  // Generate standard App Icon Sizes for Android / PWA
  const icon512 = await sharp(finalMasterBuffer).resize(512, 512).png().toBuffer();
  const icon192 = await sharp(finalMasterBuffer).resize(192, 192).png().toBuffer();
  const favicon = await sharp(finalMasterBuffer).resize(64, 64).png().toBuffer();

  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), favicon);
  console.log('✓ PWA & App icons generated (512px, 192px, favicon)');

  // Build a showcase HTML with direct base64 embedded image to avoid ANY browser caching or loading glitches
  const base64Master = finalMasterBuffer.toString('base64');
  const showcaseHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GeoProspect - Combo Parfait Officiel (Nuance 1 + Option 3)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #0b0f19; color: #f8fafc; font-family: system-ui, sans-serif; }
    .gold-shadow {
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.25);
    }
  </style>
</head>
<body class="p-4 sm:p-8 flex items-center justify-center min-h-screen">
  <div class="max-w-3xl w-full space-y-6 text-center">
    
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-500/30">
      ✨ LE COMBO PARFAIT VALIDÉ
    </div>

    <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
      Logo &amp; Icône GeoProspect
    </h1>
    <p class="text-sm text-slate-300 max-w-xl mx-auto">
      Composition exacte : <strong>Option 3 (Halo Bleu Saphir + Radar + Sonar + Cible Or)</strong> appliquée sur le fond <strong>Nuance 1 (Beige Sable Minéral &amp; Lin)</strong>.
    </p>

    <!-- IMAGE CENTRALE FINALE (BASE64 DIRECT EMBED) -->
    <div class="flex justify-center my-6">
      <div class="w-80 h-80 sm:w-96 sm:h-96 rounded-[3rem] overflow-hidden gold-shadow border-4 border-amber-500/40 bg-[#ebe3d3] transition-transform hover:scale-105 duration-300">
        <img src="data:image/png;base64,${base64Master}" alt="GeoProspect Official Combo Parfait" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- CARACTÉRISTIQUES DE LA COMPOSITION -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div class="text-amber-400 font-bold text-xs uppercase">🌾 Nuance 1</div>
        <div class="text-white font-semibold text-sm mt-1">Beige Sable &amp; Lin</div>
        <p class="text-xs text-slate-400 mt-1">Fond minéral doux, texturé et épuré.</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div class="text-blue-400 font-bold text-xs uppercase">🧭 Option 3</div>
        <div class="text-white font-semibold text-sm mt-1">Halo Bleu Saphir &amp; Sonar</div>
        <p class="text-xs text-slate-400 mt-1">Aura radar et ondes de fréquence souterraines.</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div class="text-yellow-400 font-bold text-xs uppercase">🪙 Détection</div>
        <div class="text-white font-semibold text-sm mt-1">Point Cible Or 24k</div>
        <p class="text-xs text-slate-400 mt-1">Cœur doré éclatant sous le centre du disque.</p>
      </div>
    </div>

    <div class="text-xs text-slate-400 pt-2">
      Tous les formats (Play Store 1024px, PWA 512/192px, Favicon) sont générés.
    </div>

  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(publicDir, 'gallery.html'), showcaseHtml);
  fs.writeFileSync(path.join(artifactDir, 'geoprospect_combo_parfait.html'), showcaseHtml);
  console.log('✓ gallery.html and artifact HTML created');
}

buildOfficialGeoProspectIcon().catch(console.error);
