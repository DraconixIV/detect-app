export const categoryEmojis = {
  "Monnaie": "🪙",
  "Bijou": "💍",
  "Boucle": "🥨",
  "Bouton": "🔘",
  "Médaille": "🎖️",
  "Munition": "💣",
  "Outil": "🛠️",
  "Plomb": "🛡️",
  "Religieux": "✝️",
  "Autre": "📦"
};

export const categoriesWithSub = {
  "Monnaie": [
    "Gauloise",
    "Grecque",
    "Romaine",
    "Byzantine",
    "Mérovingienne",
    "Carolingienne",
    "Féodale",
    "Royale",
    "Révolution",
    "Empire",
    "République française",
    "Coloniale",
    "Étrangère",
    "Jeton",
    "Indéterminée",
    "Savo"
  ],
  "Bijou": [
    "Bague / Anneau",
    "Broche / Fibule",
    "Pendentif",
    "Boucle d'oreille",
    "Bracelet",
    "Indéterminé"
  ],
  "Boucle": [
    "Romaine / Médiévale",
    "Double fenêtre (XVIe-XVIIe)",
    "Chaussure (XVIIIe)",
    "Ceinture",
    "Harnais / Bourrellerie",
    "Militaire",
    "Indéterminée"
  ],
  "Bouton": [
    "Civil plat (XVIIIe-XIXe)",
    "Civil décoré",
    "Militaire",
    "Double face",
    "Attache",
    "Indéterminé"
  ],
  "Médaille": [
    "Religieuse",
    "Militaire / Commémorative",
    "Civile",
    "Indéterminée"
  ],
  "Munition": [
    "Balle de plomb",
    "Cartouche / Douille",
    "Balle moderne",
    "Obus / Shrapnel",
    "Boulet",
    "Indéterminée"
  ],
  "Outil": [
    "Dé à coudre",
    "Poids monétaire / de balance",
    "Clé / Serrure",
    "Faucille / Outil agricole",
    "Clou / Charnière",
    "Indéterminé"
  ],
  "Plomb": [
    "Plomb de sac / Scellé",
    "Lest de filet / Poids",
    "Indéterminé"
  ],
  "Religieux": [
    "Croix / Crucifix",
    "Médaille de pèlerin",
    "Statuelle / Objet de culte",
    "Indéterminé"
  ],
  "Autre": [
    "Déchet / Reste de fonderie",
    "Objet utilitaire",
    "Plaque d'identité",
    "Indéterminé"
  ]
};

// Retro-compatibility
export const monnaieSubCategories = categoriesWithSub["Monnaie"];