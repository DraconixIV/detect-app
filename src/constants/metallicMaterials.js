/**
 * GeoProspect Metallic Materials Library
 * Physical metallic nuances with authentic luster gradients and mineralogical/chemical symbols.
 * Replaces system emojis with professional metallurgical signatures.
 */

export const METALLIC_MATERIALS = {
  or: {
    id: "or",
    name: "Or",
    symbol: "Au",
    gradient: "linear-gradient(135deg, #fde047 0%, #eab308 50%, #ca8a04 100%)",
    border: "#fef08a",
    textColor: "#422006",
    glow: "rgba(234, 179, 8, 0.4)",
    keywords: ["or", "gold", "jaune", "electrum"]
  },
  argent: {
    id: "argent",
    name: "Argent",
    symbol: "Ag",
    gradient: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 55%, #94a3b8 100%)",
    border: "#ffffff",
    textColor: "#0f172a",
    glow: "rgba(203, 213, 225, 0.4)",
    keywords: ["argent", "silver", "argenté", "denier"]
  },
  bronze: {
    id: "bronze",
    name: "Bronze",
    symbol: "Bz",
    gradient: "linear-gradient(135deg, #d97706 0%, #b45309 50%, #78350f 100%)",
    border: "#f59e0b",
    textColor: "#fef3c7",
    glow: "rgba(180, 83, 9, 0.35)",
    keywords: ["bronze", "cusn", "antiquite", "romain", "gaulois"]
  },
  cuivre: {
    id: "cuivre",
    name: "Cuivre",
    symbol: "Cu",
    gradient: "linear-gradient(135deg, #fb923c 0%, #ea580c 50%, #9a3412 100%)",
    border: "#fdba74",
    textColor: "#fff7ed",
    glow: "rgba(234, 88, 12, 0.35)",
    keywords: ["cuivre", "copper", "rouge", "liard", "double tournois"]
  },
  laiton: {
    id: "laiton",
    name: "Laiton",
    symbol: "Lt",
    gradient: "linear-gradient(135deg, #fef08a 0%, #facc15 50%, #a16207 100%)",
    border: "#fef9c3",
    textColor: "#422006",
    glow: "rgba(250, 204, 21, 0.35)",
    keywords: ["laiton", "brass", "cuzn", "jaunatre"]
  },
  cupronickel: {
    id: "cupronickel",
    name: "Cupronickel",
    symbol: "Ni",
    gradient: "linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 50%, #64748b 100%)",
    border: "#ffffff",
    textColor: "#0f172a",
    glow: "rgba(148, 163, 184, 0.3)",
    keywords: ["cupronickel", "nickel", "cuni", "moderne", "franc"]
  },
  billon: {
    id: "billon",
    name: "Billon",
    symbol: "Bi",
    gradient: "linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #334155 100%)",
    border: "#cbd5e1",
    textColor: "#f8fafc",
    glow: "rgba(100, 116, 139, 0.3)",
    keywords: ["billon", "argent bas titre", "blanc", "feodal"]
  },
  potin: {
    id: "potin",
    name: "Potin",
    symbol: "Pt",
    gradient: "linear-gradient(135deg, #64748b 0%, #475569 50%, #1e293b 100%)",
    border: "#94a3b8",
    textColor: "#e2e8f0",
    glow: "rgba(100, 116, 139, 0.25)",
    keywords: ["potin", "gaulois", "senons", "remes", "leuques"]
  },
  etain: {
    id: "etain",
    name: "Étain",
    symbol: "Sn",
    gradient: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 50%, #64748b 100%)",
    border: "#f1f5f9",
    textColor: "#0f172a",
    glow: "rgba(148, 163, 184, 0.25)",
    keywords: ["etain", "tin", "pewter", "bouton plat", "vaisselle"]
  },
  aluminium: {
    id: "aluminium",
    name: "Aluminium",
    symbol: "Al",
    gradient: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 55%, #cbd5e1 100%)",
    border: "#f8fafc",
    textColor: "#1e293b",
    glow: "rgba(226, 232, 240, 0.3)",
    keywords: ["aluminium", "alu", "morlon", "chambre de commerce"]
  },
  plomb: {
    id: "plomb",
    name: "Plomb",
    symbol: "Pb",
    gradient: "linear-gradient(135deg, #475569 0%, #334155 50%, #1e293b 100%)",
    border: "#64748b",
    textColor: "#cbd5e1",
    glow: "rgba(71, 85, 105, 0.3)",
    keywords: ["plomb", "lead", "balle", "scelle", "palet"]
  },
  fer: {
    id: "fer",
    name: "Fer",
    symbol: "Fe",
    gradient: "linear-gradient(135deg, #334155 0%, #1e293b 60%, #0f172a 100%)",
    border: "#475569",
    textColor: "#cbd5e1",
    glow: "rgba(51, 65, 85, 0.3)",
    keywords: ["fer", "ferreux", "acier", "iron", "forge", "clou", "fer a cheval"]
  },
  autre: {
    id: "autre",
    name: "Autre",
    symbol: "?",
    gradient: "linear-gradient(135deg, #475569 0%, #334155 100%)",
    border: "#64748b",
    textColor: "#cbd5e1",
    glow: "rgba(71, 85, 105, 0.2)",
    keywords: ["autre", "indetermine", "inconnu"]
  }
};

/**
 * 12 selectable metallic nuances for custom alloys & metals
 */
export const METALLIC_SHADES = [
  { id: "or", label: "Or", symbol: "Au" },
  { id: "argent", label: "Argent", symbol: "Ag" },
  { id: "cuivre", label: "Cuivre", symbol: "Cu" },
  { id: "bronze", label: "Bronze", symbol: "Bz" },
  { id: "laiton", label: "Laiton", symbol: "Lt" },
  { id: "cupronickel", label: "Nickel", symbol: "Ni" },
  { id: "billon", label: "Billon", symbol: "Bi" },
  { id: "potin", label: "Potin", symbol: "Pt" },
  { id: "etain", label: "Étain", symbol: "Sn" },
  { id: "aluminium", label: "Aluminium", symbol: "Al" },
  { id: "plomb", label: "Plomb", symbol: "Pb" },
  { id: "fer", label: "Fer", symbol: "Fe" }
];

/**
 * Legacy emoji to metallic material key mapping
 */
export const LEGACY_EMOJI_TO_METAL = {
  "🪙": "or",
  "🥇": "or",
  "🥈": "argent",
  "🥉": "bronze",
  "🟫": "cuivre",
  "🔔": "laiton",
  "💿": "cupronickel",
  "🔘": "billon",
  "⚖️": "etain",
  "🥫": "aluminium",
  "⚓": "plomb",
  "⚙️": "fer",
  "❓": "autre",
  "📦": "autre"
};

/**
 * Automatically derives a clean 1-2 character chemical-style symbol from a name
 * (e.g. "Électrum" -> "El", "Zamak" -> "Zk", "Tombac" -> "Tb")
 */
export function deriveMetalSymbol(name = "") {
  if (!name) return "?";
  const cleaned = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (cleaned.length <= 2) return cleaned.toUpperCase();
  // Take first uppercase and second lowercase
  return cleaned[0].toUpperCase() + cleaned[1].toLowerCase();
}

/**
 * Resolves full metallic style configuration from metal name or legacy emoji
 */
export function getMetalConfig(metalName = "", emojiOrSymbol = "", shadeOverride = "") {
  if (shadeOverride && METALLIC_MATERIALS[shadeOverride]) {
    const base = METALLIC_MATERIALS[shadeOverride];
    return {
      ...base,
      symbol: emojiOrSymbol && emojiOrSymbol.length <= 3 ? emojiOrSymbol : deriveMetalSymbol(metalName)
    };
  }

  // 1. Direct name lookup
  const normName = (metalName || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  for (const [key, config] of Object.entries(METALLIC_MATERIALS)) {
    if (key === normName || config.keywords.some((k) => normName.includes(k))) {
      return config;
    }
  }

  // 2. Legacy emoji lookup
  if (emojiOrSymbol && LEGACY_EMOJI_TO_METAL[emojiOrSymbol]) {
    const key = LEGACY_EMOJI_TO_METAL[emojiOrSymbol];
    return METALLIC_MATERIALS[key];
  }

  // 3. Fallback: custom symbol with neutral alloy style
  return {
    ...METALLIC_MATERIALS.autre,
    symbol: emojiOrSymbol && emojiOrSymbol.length <= 3 ? emojiOrSymbol : deriveMetalSymbol(metalName)
  };
}
