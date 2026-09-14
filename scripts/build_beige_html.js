import fs from 'fs';
import path from 'path';

const artifactDir = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e';

const img1 = fs.readFileSync(path.join(artifactDir, 'gp_color_1_sand_beige.png')).toString('base64');
const img2 = fs.readFileSync(path.join(artifactDir, 'gp_color_2_terracotta_beige.png')).toString('base64');
const img3 = fs.readFileSync(path.join(artifactDir, 'gp_color_3_stone_chalk.png')).toString('base64');
const img4 = fs.readFileSync(path.join(artifactDir, 'gp_color_4_safari_olive.png')).toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>GeoProspect - Nuances de Beige & Matières Minérales</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    .icon-shadow {
      box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.35), 0 6px 16px -4px rgba(0, 0, 0, 0.2);
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 antialiased p-3 sm:p-6 font-sans">
  <div class="max-w-5xl mx-auto space-y-8">
    
    <!-- HEADER -->
    <div class="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
        🌾 Nuances de Beige &amp; Matières Minérales
      </div>
      <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
        4 Déclinaisons de Beige &amp; Matières pour Votre Logo GP
      </h1>
      <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
        Le beige apporte une texture noble, chaleureuse et organique (esprit carnet de terrain, terre et sable). Voici les 4 plus belles harmonies colorimétriques.
      </p>
    </div>

    <!-- GRID DES 4 VERSIONS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- ================= 1. BEIGE SABLE MINÉRAL & LIN ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-amber-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold">Nuance 1</span>
          <span class="text-amber-400 font-semibold text-[11px]">★ Sable &amp; Lin Minéral (Recommandé)</span>
        </div>

        <div class="w-full max-w-xs rounded-[2rem] overflow-hidden icon-shadow border border-amber-500/30 bg-[#ebe3d3]">
          <img src="data:image/png;base64,${img1}" alt="Nuance 1" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">1. Beige Sable Minéral &amp; Lin</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Beige chaud naturel, halo doré subtil et ondes de sol discrètes. Évoque le sable et le carnet de prospection ancien.
        </p>
      </div>

      <!-- ================= 2. BEIGE TERRE CUITE & AMBRE ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-orange-500 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 font-bold">Nuance 2</span>
          <span class="text-orange-400 font-semibold text-[11px]">🏜️ Terre Cuite &amp; Ambre</span>
        </div>

        <div class="w-full max-w-xs rounded-[2rem] overflow-hidden icon-shadow border border-orange-500/30 bg-[#e2cdb6]">
          <img src="data:image/png;base64,${img2}" alt="Nuance 2" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">2. Beige Terre Cuite &amp; Ambre</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Nuance plus chaleureuse aux accents méditerranéens (argile, terre sèche, soleil de fin d'après-midi).
        </p>
      </div>

      <!-- ================= 3. BEIGE PIERRE & CRAIE CHAUDE ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-blue-400 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold">Nuance 3</span>
          <span class="text-blue-400 font-semibold text-[11px]">⚪ Craie &amp; Pierre Chaude</span>
        </div>

        <div class="w-full max-w-xs rounded-[2rem] overflow-hidden icon-shadow border border-slate-600/40 bg-[#dfdad0]">
          <img src="data:image/png;base64,${img3}" alt="Nuance 3" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">3. Beige Pierre &amp; Craie Chaude</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Beige très sobre et minéral avec un halo bleu royal subtil créant un contraste moderne et haut de gamme.
        </p>
      </div>

      <!-- ================= 4. OLIVE EXPÉDITION / SAFARI ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-emerald-500 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">Nuance 4</span>
          <span class="text-emerald-400 font-semibold text-[11px]">🌿 Safari &amp; Olive Pâle</span>
        </div>

        <div class="w-full max-w-xs rounded-[2rem] overflow-hidden icon-shadow border border-emerald-500/30 bg-[#d4decb]">
          <img src="data:image/png;base64,${img4}" alt="Nuance 4" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">4. Vert Olive Pâle &amp; Safari</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Tonalité outdoor militaire et expédition de terrain (esprit matériel de randonnée haut de gamme).
        </p>
      </div>

    </div>

    <!-- ACTION FOOTER -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
      <div>
        <span class="font-bold text-white">👉 Quelle nuance (1, 2, 3 ou 4) préférez-vous ?</span>
      </div>
    </div>

  </div>
</body>
</html>`;

fs.writeFileSync(path.join(artifactDir, 'geoprospect_beige_showcase.html'), htmlContent);
console.log('Beige Showcase HTML built!');
