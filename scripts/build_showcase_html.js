import fs from 'fs';
import path from 'path';

const artifactDir = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e';

const img1 = fs.readFileSync(path.join(artifactDir, 'geoprospect_art_v1_editorial.png')).toString('base64');
const img2 = fs.readFileSync(path.join(artifactDir, 'geoprospect_art_v2_pulse.png')).toString('base64');
const img3 = fs.readFileSync(path.join(artifactDir, 'geoprospect_art_v3_app_frame.png')).toString('base64');
const img4 = fs.readFileSync(path.join(artifactDir, 'geoprospect_art_v4_cobalt.png')).toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>GeoProspect - Déclinaisons Authentiques de l'Oeuvre</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    .card-shadow {
      box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.4), 0 6px 16px -4px rgba(0, 0, 0, 0.2);
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 antialiased p-3 sm:p-6 font-sans">
  <div class="max-w-5xl mx-auto space-y-8">
    
    <!-- HEADER -->
    <div class="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
        ✨ Oeuvre Originale Préservée à 100%
      </div>
      <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
        Déclinaisons de Votre Image Originale
      </h1>
      <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
        Le dessin original, les textures papier, le trait d'encre et les proportions sont <strong>conservés à 100%</strong>, avec des touches de typographie et d'effets de détection subtils.
      </p>
    </div>

    <!-- GRID DES 4 VARIATIONS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- ================= OPTION 1 : ÉDITION ÉDITORIALE ÉPURÉE ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-amber-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold">Variation 1</span>
          <span class="text-amber-400 font-semibold text-[11px]">★ Édition Pure &amp; Sobre</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden card-shadow border border-stone-700/50 bg-[#efece4]">
          <img src="data:image/png;base64,${img1}" alt="Variation 1" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">1. Édition Pure &amp; Typographie Éditoriale</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Le dessin original avec typographie <strong>GEOPROSPECT</strong> en encre fusain assortie au trait du dessin.
        </p>
      </div>

      <!-- ================= OPTION 2 : DISQUE LUMINEUX & ONTES SONAR ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-amber-500 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-amber-600/20 text-amber-300 font-bold">Variation 2</span>
          <span class="text-amber-400 font-semibold text-[11px]">⚡ Disque Actif &amp; Or</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden card-shadow border border-amber-500/30 bg-[#efece4]">
          <img src="data:image/png;base64,${img2}" alt="Variation 2" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">2. Disque Détecteur Lumineux &amp; Or</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Le disque de détection émet une onde dorée subtile avec un point de détection d'or au centre du disque.
        </p>
      </div>

      <!-- ================= OPTION 3 : CADRE APPLI & MONOGRAMME GP ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-blue-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold">Variation 3</span>
          <span class="text-blue-400 font-semibold text-[11px]">📱 Format Cadre Icône</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden card-shadow border border-slate-700/50 bg-[#efece4]">
          <img src="data:image/png;base64,${img3}" alt="Variation 3" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">3. Format Squircle &amp; Monogramme GP</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Cadrage squircle délicat avec le monogramme <strong>GP</strong> en haut et GeoProspect au bas de la montagne.
        </p>
      </div>

      <!-- ================= OPTION 4 : LOGO COBALT ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-blue-500 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-blue-600/20 text-blue-300 font-bold">Variation 4</span>
          <span class="text-blue-400 font-semibold text-[11px]">💎 Accent Bleu Saphir</span>
        </div>

        <div class="w-full max-w-sm rounded-2xl overflow-hidden card-shadow border border-blue-500/30 bg-[#efece4]">
          <img src="data:image/png;base64,${img4}" alt="Variation 4" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">4. Accent Bleu Cobalt GeoProspect</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Touche bleu cobalt moderne sur le logo GeoProspect et de légères ondes bleu roi au disque.
        </p>
      </div>

    </div>

    <!-- ACTION FOOTER -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
      <div>
        <span class="font-bold text-white">👉 Laquelle de ces déclinaisons (1, 2, 3 ou 4) préférez-vous ?</span>
      </div>
    </div>

  </div>
</body>
</html>`;

fs.writeFileSync(path.join(artifactDir, 'geoprospect_authentic_art_showcase.html'), htmlContent);
console.log('Showcase HTML generated with embedded base64 images!');
