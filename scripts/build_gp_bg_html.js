import fs from 'fs';
import path from 'path';

const artifactDir = 'C:/Users/leona/.gemini/antigravity/brain/b4fe412b-019b-4da2-a5dc-01b1772b425e';

const img1 = fs.readFileSync(path.join(artifactDir, 'gp_bg_1_carbon_sonar.png')).toString('base64');
const img2 = fs.readFileSync(path.join(artifactDir, 'gp_bg_2_topography_ign.png')).toString('base64');
const img3 = fs.readFileSync(path.join(artifactDir, 'gp_bg_3_pure_white_halo.png')).toString('base64');
const img4 = fs.readFileSync(path.join(artifactDir, 'gp_bg_4_sunset_mountains.png')).toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>GeoProspect - 4 Arrière-Plans Google Play Store</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    .icon-shadow {
      box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.45), 0 6px 16px -4px rgba(0, 0, 0, 0.25);
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 antialiased p-3 sm:p-6 font-sans">
  <div class="max-w-5xl mx-auto space-y-8">
    
    <!-- HEADER -->
    <div class="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
        📱 Standards Google Play Store • Votre Emblème GP Sublimé
      </div>
      <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
        4 Propositions d'Arrière-Plans pour Votre Logo GP
      </h1>
      <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
        Votre logo <strong>GP + Disque de Détection</strong> intégré sur 4 univers d'arrière-plans graphiques pour un rendu percutant sur le Play Store et l'écran d'accueil.
      </p>
    </div>

    <!-- GRID DES 4 VERSIONS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- ================= 1. CARBONE & ONDES SONAR BLEUES ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-blue-500 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold">Option 1</span>
          <span class="text-blue-400 font-semibold text-[11px]">★ Standard Play Store</span>
        </div>

        <div class="w-full max-w-xs rounded-[2rem] overflow-hidden icon-shadow border border-slate-700/60 bg-[#070e1c]">
          <img src="data:image/png;base64,${img1}" alt="Option 1" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">1. Carbone &amp; Ondes Sonar Bleues</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Fond sombre carbone &amp; ardoise avec ondes radar sonar bleues, halo lumineux et cible d'or 24k au centre du disque.
        </p>
      </div>

      <!-- ================= 2. COURBES TOPOGRAPHIQUES IGN ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-cyan-500 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">Option 2</span>
          <span class="text-cyan-400 font-semibold text-[11px]">🧭 Cartographie &amp; Relief</span>
        </div>

        <div class="w-full max-w-xs rounded-[2rem] overflow-hidden icon-shadow border border-slate-700/60 bg-[#071326]">
          <img src="data:image/png;base64,${img2}" alt="Option 2" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">2. Courbes Topographiques IGN &amp; Relief</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Fond bleu marine d'expédition avec de fines courbes de niveau cartographiques et réticule doré.
        </p>
      </div>

      <!-- ================= 3. PURE WHITE STUDIO & HALO SAPHIR ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-slate-300 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-slate-700 text-slate-200 font-bold">Option 3</span>
          <span class="text-slate-300 font-semibold text-[11px]">⚪ Pure White Studio</span>
        </div>

        <div class="w-full max-w-xs rounded-[2rem] overflow-hidden icon-shadow border border-slate-200 bg-white">
          <img src="data:image/png;base64,${img3}" alt="Option 3" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">3. Pure White Studio &amp; Halo Saphir</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Fond blanc pur épuré avec votre logo noir d'origine, délicat halo bleu saphir et ondes sonar.
        </p>
      </div>

      <!-- ================= 4. COUCHER DE SOLEIL & SILHOUETTES DE MONTAGNES ================= -->
      <div class="bg-slate-900/80 border border-slate-800 hover:border-amber-500 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
        <div class="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold">Option 4</span>
          <span class="text-amber-400 font-semibold text-[11px]">🌅 Coucher de Soleil &amp; Montagnes</span>
        </div>

        <div class="w-full max-w-xs rounded-[2rem] overflow-hidden icon-shadow border border-amber-500/30 bg-[#0c182c]">
          <img src="data:image/png;base64,${img4}" alt="Option 4" class="w-full h-auto block" />
        </div>

        <h3 class="text-base font-bold text-white mt-4">4. Coucher de Soleil &amp; Montagnes</h3>
        <p class="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
          Silhouettes de crêtes de montagnes au bas du logo avec dégradé crépusculaire chaleureux.
        </p>
      </div>

    </div>

    <!-- ACTION FOOTER -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
      <div>
        <span class="font-bold text-white">👉 Quel arrière-plan (1, 2, 3 ou 4) préférez-vous pour le Google Play Store ?</span> Dès votre choix, je l'applique directement comme icône et logo officiel de l'application !
      </div>
    </div>

  </div>
</body>
</html>`;

fs.writeFileSync(path.join(artifactDir, 'geoprospect_gp_backgrounds_showcase.html'), htmlContent);
console.log('GP Backgrounds Showcase HTML built!');
