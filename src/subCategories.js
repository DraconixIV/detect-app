export const categoryEmojis = {};

export const defaultCategoryColors = {};

export const PRESET_CATEGORY_COLORS = [
  "#facc15", // Jaune or
  "#f59e0b", // Ambre
  "#f97316", // Orange vif
  "#ef4444", // Rouge corail
  "#ec4899", // Rose magenta
  "#d946ef", // Fuchsia
  "#8b5cf6", // Violet
  "#6366f1", // Indigo
  "#3b82f6", // Bleu royal
  "#06b6d4", // Cyan / Turquoise
  "#14b8a6", // Sarcelle / Teal
  "#10b981", // Vert émeraude
  "#84cc16", // Vert lime
  "#d97706", // Bronze cuivré
  "#6b7280", // Gris acier
  "#334155"  // Ardoise sombre
];

export const SUGGESTED_STARTER_CATEGORIES = {
  "Monnaie": {
    emoji: "🪙",
    color: "#facc15",
    subCategories: [
      "Gauloise",
      "Romaine",
      "Royale",
      "Révolution",
      "Empire",
      "Moderne",
      "Jeton",
      "Savo",
      "Indéterminée"
    ]
  },
  "Bijou": {
    emoji: "💍",
    color: "#ec4899",
    subCategories: [
      "Bague / Anneau",
      "Broche / Fibule",
      "Pendentif",
      "Boucle d'oreille",
      "Bracelet",
      "Indéterminé"
    ]
  },
  "Boucle": {
    emoji: "🥨",
    color: "#8b5cf6",
    subCategories: [
      "Romaine / Médiévale",
      "Double fenêtre (XVIe-XVIIe)",
      "Chaussure (XVIIIe)",
      "Ceinture",
      "Militaire",
      "Indéterminée"
    ]
  },
  "Bouton": {
    emoji: "🔘",
    color: "#10b981",
    subCategories: [
      "Civil plat (XVIIIe-XIXe)",
      "Civil décoré",
      "Militaire",
      "Double face",
      "Indéterminé"
    ]
  },
  "Militaria": {
    emoji: "🎖️",
    color: "#ef4444",
    subCategories: [
      "Insigne / Médaille",
      "Cartouche / Douille",
      "Balle de plomb",
      "Bouton d'uniforme",
      "Boucle militaire",
      "Indéterminée"
    ]
  },
  "Outil": {
    emoji: "🛠️",
    color: "#f97316",
    subCategories: [
      "Dé à coudre",
      "Poids monétaire / balance",
      "Clé / Serrure",
      "Outil agricole",
      "Indéterminé"
    ]
  },
  "Religieux": {
    emoji: "✝️",
    color: "#d97706",
    subCategories: [
      "Croix / Crucifix",
      "Médaille de pèlerin",
      "Statuelle / Objet de culte",
      "Indéterminé"
    ]
  },
  "Plomb": {
    emoji: "⚓",
    color: "#6b7280",
    subCategories: [
      "Plomb de sac / Scellé",
      "Lest de filet / Poids",
      "Indéterminé"
    ]
  },
  "Autre": {
    emoji: "📦",
    color: "#334155",
    subCategories: [
      "Objet utilitaire",
      "Plaque d'identité",
      "Déchet / Reste de fonderie",
      "Indéterminé"
    ]
  }
};

export const categoriesWithSub = {};

// Retro-compatibility
export const monnaieSubCategories = [];

export const RECOMMENDED_METALS = [
  { name: "Or", emoji: "🪙" },
  { name: "Argent", emoji: "🥈" },
  { name: "Bronze", emoji: "🥉" },
  { name: "Cuivre", emoji: "🟫" },
  { name: "Laiton", emoji: "🔔" },
  { name: "Cupronickel", emoji: "💿" },
  { name: "Billon", emoji: "🔘" },
  { name: "Étain", emoji: "⚖️" },
  { name: "Aluminium", emoji: "🥫" },
  { name: "Plomb", emoji: "⚓" },
  { name: "Fer", emoji: "⚙️" }
];

export const materials = [
  "Indéterminé",
  "Or",
  "Argent",
  "Bronze",
  "Cuivre",
  "Laiton",
  "Cupronickel",
  "Billon",
  "Étain",
  "Aluminium",
  "Plomb",
  "Fer",
  "Alliage cuivreux",
  "Maillechort",
  "Peltre",
  "Métal blanc",
  "Zamac",
  "Autre"
];

export const materialEmojis = {
  "Indéterminé": "❓",
  "Or": "🪙",
  "Argent": "🥈",
  "Bronze": "🥉",
  "Cuivre": "🟫",
  "Laiton": "🔔",
  "Cupronickel": "💿",
  "Billon": "🔘",
  "Étain": "⚖️",
  "Aluminium": "🥫",
  "Plomb": "⚓",
  "Fer": "⚙️",
  "Alliage cuivreux": "🏺",
  "Maillechort": "🔱",
  "Peltre": "🫖",
  "Métal blanc": "⬜",
  "Zamac": "🚗",
  "Autre": "📦"
};