import fs from 'fs';
import path from 'path';

const artifactDir = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e';

const img1 = fs.readFileSync(path.join(artifactDir, 'shadow_v1_alpine_ridge.png')).toString('base64');
const img2 = fs.readFileSync(path.join(artifactDir, 'shadow_v2_organic_strata.png')).toString('base64');
const img3 = fs.readFileSync(path.join(artifactDir, 'shadow_v3_high_precipice.png')).toString('base64');
const img4 = fs.readFileSync(path.join(artifactDir, 'shadow_v4_nordic_razor.png')).toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>GeoProspect - Personnage Ombragé & Styles de Montagnes</title>
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
        👤 Personnage Shadow • Détecteur Intact • Nouveaux Styles de Montagnes
      </div>
      <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
        4 Nouveaux Styles Artistiques
      </h1>
      <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
        Le personnage est traité en <strong>silhouette ombragée (shadow)</strong> avec son détecteur authentique sur les épaules, sur 4 styles de montagnes entièrement repensés.
      </p>
    </div>

    <!-- GRID DES 4 VARIATIONS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- ================= 1. CRÊTE ALPINE & BRUME ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-amber-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold">Style 1</span>
          <span class="text-amber-400 font-semibold text-[11px]">⛰️ Crête Alpine &amp; Brume</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden art-shadow border border-stone-700/50 bg-[#f5efe6]">
          <img src="data:image/png;base64,${img1}" alt="Style 1" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">1. Crête Alpine &amp; Brume de Vallée</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Personnage en silhouette ombragée sur une arête alpine acérée, avec chaînes de montagnes lointaines dans la brume matinale.
        </p>
      </div>

      <!-- ================= 2. RELIEFS STRATIFIÉS ORGANIQUES ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-amber-500 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-amber-600/20 text-amber-300 font-bold">Style 2</span>
          <span class="text-amber-400 font-semibold text-[11px]">🏜️ Reliefs Stratifiés</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden art-shadow border border-stone-700/50 bg-[#f2ebd9]">
          <img src="data:image/png;base64,${img2}" alt="Style 2" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">2. Reliefs Stratifiés &amp; Courbes Minérales</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Pentes rocheuses aux courbes organiques et douces, évoquant les canyons et les collines de prospection.
        </p>
      </div>

      <!-- ================= 3. LE SOMMET EN FALAISE / ABÎME ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-blue-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold">Style 3</span>
          <span class="text-blue-400 font-semibold text-[11px]">🌄 Falaise &amp; Horizon Lointain</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden art-shadow border border-stone-700/50 bg-[#eddac6]">
          <img src="data:image/png;base64,${img3}" alt="Style 3" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">3. Falaise de Sommet &amp; Horizon</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Le prospecteur en contre-jour se dresse sur un promontoire rocheux vertigineux dominant l'immensité du paysage.
        </p>
      </div>

      <!-- ================= 4. LE PIC SOMBRE & GÉOMÉTRIE SCANDINAVE ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-stone-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-stone-700 text-stone-200 font-bold">Style 4</span>
          <span class="text-stone-300 font-semibold text-[11px]">⬛ Pic Sombre Épuré</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden art-shadow border border-stone-700/50 bg-[#f3eee3]">
          <img src="data:image/png;base64,${img4}" alt="Style 4" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">4. Pic Sombre &amp; Arêtes Épurées</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Contraste marqué entre le sommet en ardoise sombre et la lumière épurée du ciel, style minimaliste contemporain.
        </p>
      </div>

    </div>

    <!-- ACTION FOOTER -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
      <div>
        <span class="font-bold text-white">👉 Quel style de montagne et d'atmosphère (1, 2, 3 ou 4) préférez-vous ?</span>
      </div>
    </div>

  </div>
</body>
</html>`;

fs.writeFileSync(path.join(artifactDir, 'geoprospect_shadow_showcase.html'), htmlContent);
console.log('Shadow showcase HTML generated!');
