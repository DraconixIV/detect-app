import fs from 'fs';
import path from 'path';

const artifactDir = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e';

const img1 = fs.readFileSync(path.join(artifactDir, 'real_art_1_chiaroscuro.png')).toString('base64');
const img2 = fs.readFileSync(path.join(artifactDir, 'real_art_2_sunset_glow.png')).toString('base64');
const img3 = fs.readFileSync(path.join(artifactDir, 'real_art_3_moody_shadow.png')).toString('base64');
const img4 = fs.readFileSync(path.join(artifactDir, 'real_art_4_gallery_texture.png')).toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>GeoProspect - Traitements Authentiques de Votre Illustration</title>
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
        ✨ 100% Dessin Original Préservé • Zéro Trait Redessiné
      </div>
      <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
        Traitements Photographiques &amp; Artistiques de Votre Dessin
      </h1>
      <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
        L'humain, son détecteur et la montagne restent exactement vos pixels d'origine, traités en profondeur de tons, ombrage naturel et lumière.
      </p>
    </div>

    <!-- GRID DES 4 TRAITEMENTS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- ================= 1. OMBRAGE NATUREL & CONTRE-JOUR ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-amber-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold">Traitement 1</span>
          <span class="text-amber-400 font-semibold text-[11px]">👤 Ombrage Naturel (Shadow)</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden art-shadow border border-stone-700/50 bg-[#efece4]">
          <img src="data:image/png;base64,${img1}" alt="1. Ombrage Naturel" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">1. Ombrage Naturel &amp; Contre-Jour</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Le corps du personnage et les versants de la montagne gagnent un ombrage plus profond et texturé, créant un effet de contre-jour naturel.
        </p>
      </div>

      <!-- ================= 2. AMBIANCE DORÉE COUCHER DE SOLEIL ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-amber-500 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-amber-600/20 text-amber-300 font-bold">Traitement 2</span>
          <span class="text-amber-400 font-semibold text-[11px]">🌅 Coucher de Soleil Chaleureux</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden art-shadow border border-amber-500/30 bg-[#efece4]">
          <img src="data:image/png;base64,${img2}" alt="2. Coucher de Soleil" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">2. Lumière Dorée de Fin de Journée</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Un voile atmosphérique chaud et doré enveloppe l'ensemble de l'illustration avec des teintes terre cuite et sable doux.
        </p>
      </div>

      <!-- ================= 3. CONTRE-JOUR INTENSE ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-blue-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold">Traitement 3</span>
          <span class="text-blue-400 font-semibold text-[11px]">⬛ Silhouette Shadow Intense</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden art-shadow border border-stone-700/50 bg-[#efece4]">
          <img src="data:image/png;base64,${img3}" alt="3. Silhouette Shadow Intense" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">3. Silhouette Shadow &amp; Contraste Épuré</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Le personnage et les arêtes rocheuses sont profondément contrastés pour faire ressortir la silhouette de l'homme et du détecteur.
        </p>
      </div>

      <!-- ================= 4. TEXTURE PAPIER FINE ART ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-stone-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-stone-700 text-stone-200 font-bold">Traitement 4</span>
          <span class="text-stone-300 font-semibold text-[11px]">🎨 Galerie d'Art &amp; Grain</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden art-shadow border border-stone-600/30 bg-[#efece4]">
          <img src="data:image/png;base64,${img4}" alt="4. Galerie d'Art" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">4. Texture Fine Art &amp; Piqué Précis</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Sublimation du piqué des traits d'encre originaux, richesse des demi-teintes et chaleur minérale naturelle.
        </p>
      </div>

    </div>

    <!-- ACTION FOOTER -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
      <div>
        <span class="font-bold text-white">👉 Quel traitement (1, 2, 3 ou 4) vous convient le mieux ?</span>
      </div>
    </div>

  </div>
</body>
</html>`;

fs.writeFileSync(path.join(artifactDir, 'geoprospect_pure_real_art_showcase.html'), htmlContent);
console.log('Pure real art showcase HTML built!');
