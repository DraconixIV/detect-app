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
    emoji: "monnaie",
    color: "#facc15",
    subCategories: []
  },
  "Bijou": {
    emoji: "bague",
    color: "#ec4899",
    subCategories: []
  },
  "Boucle": {
    emoji: "boucle",
    color: "#8b5cf6",
    subCategories: []
  },
  "Bouton": {
    emoji: "bouton",
    color: "#10b981",
    subCategories: []
  },
  "Militaria": {
    emoji: "militaria",
    color: "#ef4444",
    subCategories: []
  },
  "Outil": {
    emoji: "outil",
    color: "#f97316",
    subCategories: []
  },
  "Religieux": {
    emoji: "religieux",
    color: "#d97706",
    subCategories: []
  },
  "Plomb": {
    emoji: "plomb",
    color: "#6b7280",
    subCategories: []
  },
  "Autre": {
    emoji: "autre",
    color: "#334155",
    subCategories: []
  }
};

export const categoryEmojis = Object.fromEntries(
  Object.entries(SUGGESTED_STARTER_CATEGORIES).map(([k, v]) => [k, v.emoji])
);

export const defaultCategoryColors = Object.fromEntries(
  Object.entries(SUGGESTED_STARTER_CATEGORIES).map(([k, v]) => [k, v.color])
);

export const categoriesWithSub = Object.fromEntries(
  Object.entries(SUGGESTED_STARTER_CATEGORIES).map(([k, v]) => [k, v.subCategories])
);

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