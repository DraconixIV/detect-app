import { defaultCategoryColors, PRESET_CATEGORY_COLORS, SUGGESTED_STARTER_CATEGORIES, materials, materialEmojis } from "../src/subCategories.js";
import { generateRandomCode } from "../src/services/sessionService.js";
import { normalizeCategoryAndSub } from "../src/services/findsService.js";

console.log("==========================================================");
console.log("🧪 AUDIT FONCTIONNEL EXHAUSTIF DES FONCTIONNALITÉS");
console.log("==========================================================\n");

const results = [];

function assertTest(name, condition, details = "") {
  if (condition) {
    results.push({ name, pass: true, details });
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    results.push({ name, pass: false, details });
    console.log(`  ❌ [FAIL] ${name} (${details})`);
  }
}

// -------------------------------------------------------------
// MODULE 1 : MOTEUR DE CATÉGORIES & PERSONNALISATION
// -------------------------------------------------------------
console.log("📌 Module 1 : Moteur de Catégories & Personnalisation");
assertTest(
  "Palette de 16 couleurs prédéfinies",
  Array.isArray(PRESET_CATEGORY_COLORS) && PRESET_CATEGORY_COLORS.length === 16,
  `Nombre de couleurs : ${PRESET_CATEGORY_COLORS.length}`
);

assertTest(
  "Suggestions d'onboarding structurées",
  Object.keys(SUGGESTED_STARTER_CATEGORIES).length >= 8,
  `Nombre de suggestions : ${Object.keys(SUGGESTED_STARTER_CATEGORIES).length}`
);

const monnaieStarter = SUGGESTED_STARTER_CATEGORIES["Monnaie"];
assertTest(
  "Intégrité du modèle suggestion Monnaie",
  monnaieStarter && monnaieStarter.emoji === "🪙" && monnaieStarter.subCategories.length > 5,
  "Monnaie starter valide"
);

// -------------------------------------------------------------
// MODULE 2 : SYSTÈME DE TOKENS & SESSIONS (FORMAT GEO-XXXX)
// -------------------------------------------------------------
console.log("\n📌 Module 2 : Système de Tokens & Codes Prospecteur");
const sampleCode1 = generateRandomCode("GEO");
const sampleCode2 = generateRandomCode("TEAM");
assertTest(
  "Génération de code prospecteur au format GEO-XXXX",
  /^GEO-[2-9A-Z]{4}$/.test(sampleCode1),
  `Code généré : ${sampleCode1}`
);
assertTest(
  "Génération de code session au format TEAM-XXXX",
  /^TEAM-[2-9A-Z]{4}$/.test(sampleCode2),
  `Code généré : ${sampleCode2}`
);

// -------------------------------------------------------------
// MODULE 3 : NORMALISATION & COMPATIBILITÉ DES TROUVAILLES
// -------------------------------------------------------------
console.log("\n📌 Module 3 : Normalisation & Migration des Données");
const legacyFind1 = { title: "Test", category: "munition", sub_category: "balle" };
const norm1 = normalizeCategoryAndSub(legacyFind1);
assertTest(
  "Normalisation Munition (minuscule -> Majuscule)",
  norm1.category === "Munition",
  `Résultat : ${norm1.category}`
);

const legacyFind2 = { title: "Test 2", category: "dé à coudre", sub_category: "" };
const norm2 = normalizeCategoryAndSub(legacyFind2);
assertTest(
  "Migration automatique de 'dé à coudre' en Outil",
  norm2.category === "Outil" && norm2.sub_category === "Dé à coudre",
  `Résultat : ${norm2.category} / ${norm2.sub_category}`
);

// -------------------------------------------------------------
// MODULE 4 : MATÉRIAUX & ÉMOJIS
// -------------------------------------------------------------
console.log("\n📌 Module 4 : Catalogue des Métaux & Matières");
assertTest(
  "Présence d'au moins 15 matières",
  Array.isArray(materials) && materials.length >= 15,
  `Nombre de matières : ${materials.length}`
);
assertTest(
  "Support complet des émojis pour tous les métaux",
  materials.every(m => materialEmojis[m] !== undefined),
  "Tous les métaux ont un émoji associé"
);

// -------------------------------------------------------------
// MODULE 5 : GÉOMÉTRIE & DISTANCE GÉODÉSIQUE (HAVERSINE)
// -------------------------------------------------------------
console.log("\n📌 Module 5 : Calculs Géodésiques & GPS");
function haversineDistKm(p1, p2) {
  const R = 6371;
  const dLat = ((p2[0] - p1[0]) * Math.PI) / 180;
  const dLng = ((p2[1] - p1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1[0] * Math.PI) / 180) * Math.cos((p2[0] * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Distance Paris (48.8566, 2.3522) -> Versailles (48.8049, 2.1204) ~ 17.9 km
const testDist = haversineDistKm([48.8566, 2.3522], [48.8049, 2.1204]);
assertTest(
  "Formule Haversine de calcul de distance précise",
  Math.abs(testDist - 17.91) < 0.2,
  `Distance mesurée : ${testDist.toFixed(2)} km`
);

// -------------------------------------------------------------
// BILAN GLOBAL
// -------------------------------------------------------------
const totalPassed = results.filter(r => r.pass).length;
const totalFailed = results.filter(r => !r.pass).length;

console.log("\n==========================================================");
console.log(`📊 BILAN DE L'AUDIT FONCTIONNEL : ${totalPassed}/${results.length} TESTS RÉUSSIS`);
if (totalFailed === 0) {
  console.log("🎉 100% DES TESTS UNITAIRES ET FONCTIONNELS VALIDÉS AVEC SUCCÈS !");
} else {
  console.log(`⚠️ ${totalFailed} test(s) ont échoué.`);
}
console.log("==========================================================\n");
