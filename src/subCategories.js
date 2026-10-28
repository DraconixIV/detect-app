export const PRESET_CATEGORY_COLORS = [
  "#facc15", // Jaune or
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
  "#78350f", // Brun terre antique
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
    color: "#78350f",
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
  { name: "Or", symbol: "Au", emoji: "Au", shade: "or" },
  { name: "Argent", symbol: "Ag", emoji: "Ag", shade: "argent" },
  { name: "Bronze", symbol: "Bz", emoji: "Bz", shade: "bronze" },
  { name: "Cuivre", symbol: "Cu", emoji: "Cu", shade: "cuivre" },
  { name: "Laiton", symbol: "Lt", emoji: "Lt", shade: "laiton" },
  { name: "Cupronickel", symbol: "Ni", emoji: "Ni", shade: "cupronickel" },
  { name: "Billon", symbol: "Bi", emoji: "Bi", shade: "billon" },
  { name: "Potin", symbol: "Pt", emoji: "Pt", shade: "potin" },
  { name: "Étain", symbol: "Sn", emoji: "Sn", shade: "etain" },
  { name: "Aluminium", symbol: "Al", emoji: "Al", shade: "aluminium" },
  { name: "Plomb", symbol: "Pb", emoji: "Pb", shade: "plomb" },
  { name: "Fer", symbol: "Fe", emoji: "Fe", shade: "fer" }
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
  "Potin",
  "Étain",
  "Aluminium",
  "Plomb",
  "Fer",
  "Autre"
];

export const materialEmojis = {
  "Indéterminé": "?",
  "Or": "Au",
  "Argent": "Ag",
  "Bronze": "Bz",
  "Cuivre": "Cu",
  "Laiton": "Lt",
  "Cupronickel": "Ni",
  "Billon": "Bi",
  "Potin": "Pt",
  "Étain": "Sn",
  "Aluminium": "Al",
  "Plomb": "Pb",
  "Fer": "Fe",
  "Autre": "?"
};