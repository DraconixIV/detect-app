import fs from 'fs';
import path from 'path';

const artifactDir = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e';

const img1 = fs.readFileSync(path.join(artifactDir, 'beautified_1_golden_hour.png')).toString('base64');
const img2 = fs.readFileSync(path.join(artifactDir, 'beautified_2_topography.png')).toString('base64');
const img3 = fs.readFileSync(path.join(artifactDir, 'beautified_3_twilight.png')).toString('base64');
const img4 = fs.readFileSync(path.join(artifactDir, 'beautified_4_fine_art.png')).toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>GeoProspect - Embellissements Artistiques Purs</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    .art-shadow {
      box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.4), 0 6px 16px -4px rgba(0, 0, 0, 0.2);
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 antialiased p-3 sm:p-6 font-sans">
  <div class="max-w-5xl mx-auto space-y-8">
    
    <!-- HEADER -->
    <div class="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
        🎨 100% Art Pur • Aucun Texte • Aucun Cadre
      </div>
      <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
        4 Embellissements Purs de Votre Illustration
      </h1>
      <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
        Votre dessin original sublimé par la lumière atmosphérique, les courbes de relief naturelles et le travail des couleurs.
      </p>
    </div>

    <!-- GRID DES 4 VARIATIONS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- ================= 1. GOLDEN HOUR SOLEIL COUCHANT ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-amber-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold">1. Golden Hour</span>
          <span class="text-amber-400 font-semibold text-[11px]">🌅 Lumière Dorée</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden art-shadow border border-amber-500/20 bg-[#f7f5f0]">
          <img src="data:image/png;base64,${img1}" alt="1. Golden Hour" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">1. Lumière Dorée de Fin d'Après-Midi</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Un soleil couchant chaleureux diffuse une lumière dorée sur l'horizon, éclairant délicatement les arêtes du pic rocheux.
        </p>
      </div>

      <!-- ================= 2. COURBES TOPOGRAPHIQUES NATURELLES ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-blue-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold">2. Topographie Fine</span>
          <span class="text-blue-400 font-semibold text-[11px]">🧭 Courbes de Relief</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden art-shadow border border-blue-500/20 bg-[#f7f5f0]">
          <img src="data:image/png;base64,${img2}" alt="2. Topographie Fine" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">2. Courbes Topographiques &amp; Cartographie</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          De fines courbes de niveau bleues s'intègrent organiquement le long des pentes de la montagne comme sur une carte IGN d'exploration.
        </p>
      </div>

      <!-- ================= 3. CRÉPUSCULE ÉTOILÉ ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-indigo-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">3. Crépuscule Étoilé</span>
          <span class="text-indigo-400 font-semibold text-[11px]">🌌 Ciel Profond &amp; Étoiles</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden art-shadow border border-indigo-500/30 bg-[#0b1528]">
          <img src="data:image/png;base64,${img3}" alt="3. Crépuscule Étoilé" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">3. Crépuscule Étoilé &amp; Ciel Profond</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Une ambiance nocturne poétique : ciel bleu nuit profond dégradé vers l'or à l'horizon avec de fines étoiles scintillantes.
        </p>
      </div>

      <!-- ================= 4. AQUARELLE & NUANCES MINÉRALES ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-stone-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-stone-700 text-stone-200 font-bold">4. Aquarelle Fine</span>
          <span class="text-stone-300 font-semibold text-[11px]">🎨 Nuances Minérales</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden art-shadow border border-stone-600/30 bg-[#f7f5f0]">
          <img src="data:image/png;base64,${img4}" alt="4. Aquarelle Fine" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">4. Nuances Minérales &amp; Grain Papier</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Richesse accrue des nuances de terre et de roche, texture papier fine art et profondeur subtile des ombres.
        </p>
      </div>

    </div>

    <!-- ACTION FOOTER -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
      <div>
        <span class="font-bold text-white">👉 Dites-moi quelle ambiance artistique (1, 2, 3 ou 4) vous séduit le plus !</span>
      </div>
    </div>

  </div>
</body>
</html>`;

fs.writeFileSync(path.join(artifactDir, 'geoprospect_beautified_art_showcase.html'), htmlContent);
console.log('Beautified showcase HTML generated!');
