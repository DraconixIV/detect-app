import React from "react";

/**
 * High-definition vector icons dedicated to metal detecting, archaeology, and historical prospecting.
 * Each icon is crafted on a 24x24 grid with crisp 1.8px strokes.
 */
export const CATEGORY_ICONS = {
  // --- A. Monnaies & Trésors ---
  "coin": {
    label: "Monnaie",
    keywords: ["monnaie", "piece", "or", "argent", "bronze", "denier", "liard", "ecu"],
    category: "treasure",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5.5" strokeDasharray="2 2" strokeOpacity="0.85" />
        <path d="M12 9v6M9.5 12h5" strokeOpacity="0.75" />
      </svg>
    )
  },
  "coins-stacked": {
    label: "Bourse / Trésor",
    keywords: ["tresor", "bourse", "monnaies", "depot", "tas"],
    category: "treasure",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="9" cy="8" rx="6" ry="3.5" />
        <path d="M3 8v4c0 1.93 2.69 3.5 6 3.5s6-1.57 6-3.5V8" />
        <ellipse cx="15" cy="12" rx="6" ry="3" />
        <path d="M9 12v4c0 1.93 2.69 3.5 6 3.5s6-1.57 6-3.5v-4" />
      </svg>
    )
  },
  "ingot": {
    label: "Lingot",
    keywords: ["lingot", "or", "argent", "pain", "plomb", "cuivre"],
    category: "treasure",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 8 3-4h6l3 4-2 9H8L6 8z" />
        <line x1="6" y1="8" x2="18" y2="8" />
        <line x1="8" y1="17" x2="16" y2="17" />
        <line x1="9" y1="4" x2="10.5" y2="17" strokeOpacity="0.5" />
      </svg>
    )
  },
  "crown": {
    label: "Couronne / Royauté",
    keywords: ["couronne", "royal", "roi", "prince", "or"],
    category: "treasure",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 7 4 12h12l4-12-5 5-5-8-5 8-5-5z" />
        <circle cx="12" cy="16" r="1" fill={c} />
      </svg>
    )
  },
  "chest": {
    label: "Coffre aux trésors",
    keywords: ["coffre", "relique", "tresor", "boite"],
    category: "treasure",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8z" />
        <path d="M3 12h18" />
        <path d="M10 11v3h4v-3" />
        <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
      </svg>
    )
  },

  // --- B. Vêtements, Parure & Vie Quotidienne ---
  "button": {
    label: "Bouton d'uniforme / civil",
    keywords: ["bouton", "uniforme", "militaire", "civil", "plat", "grelot"],
    category: "clothing",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="6" strokeDasharray="1.5 1.5" strokeOpacity="0.7" />
        <circle cx="9.5" cy="9.5" r="1" fill={c} />
        <circle cx="14.5" cy="9.5" r="1" fill={c} />
        <circle cx="9.5" cy="14.5" r="1" fill={c} />
        <circle cx="14.5" cy="14.5" r="1" fill={c} />
      </svg>
    )
  },
  "buckle": {
    label: "Boucle de ceinturon",
    keywords: ["boucle", "ceinturon", "chaussure", "harnais", "ardillon"],
    category: "clothing",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="4" />
        <rect x="7" y="9" width="10" height="6" rx="2" strokeOpacity="0.8" />
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="12" y1="12" x2="16.5" y2="12" strokeWidth="2.2" />
      </svg>
    )
  },
  "fibula": {
    label: "Fibule / Broche",
    keywords: ["fibule", "broche", "romain", "gaulois", "epingle"],
    category: "clothing",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19 C5 11, 19 11, 19 19" />
        <line x1="3" y1="19" x2="21" y2="19" strokeWidth="2.2" />
        <circle cx="5" cy="19" r="2" fill={c} />
        <path d="M19 19l2-4" />
      </svg>
    )
  },
  "thimble": {
    label: "Dé à coudre",
    keywords: ["de a coudre", "couture", "tailleur", "bronze"],
    category: "clothing",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 20h10l-1.5-12a4 4 0 0 0-7 0L7 20z" />
        <line x1="6" y1="20" x2="18" y2="20" strokeWidth="2" />
        <line x1="9" y1="12" x2="15" y2="12" strokeDasharray="1.5 1.5" />
        <line x1="8.5" y1="16" x2="15.5" y2="16" strokeDasharray="1.5 1.5" />
      </svg>
    )
  },
  "key": {
    label: "Clé ancienne",
    keywords: ["cle", "serrure", "panneton", "fer", "bronze"],
    category: "clothing",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="15.5" r="4.5" />
        <circle cx="7.5" cy="15.5" r="1.5" fill={c} />
        <path d="m11 12 9-9" />
        <path d="m17 6 2 2" />
        <path d="m19 4 2 2" />
      </svg>
    )
  },
  "lock": {
    label: "Cadenas ancien",
    keywords: ["cadenas", "serrure", "fermeture", "coffre"],
    category: "clothing",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        <circle cx="12" cy="15.5" r="1.5" fill={c} />
        <line x1="12" y1="17" x2="12" y2="19" />
      </svg>
    )
  },
  "horseshoe": {
    label: "Fer à cheval",
    keywords: ["fer a cheval", "cheval", "equitation", "porte bonheur", "forgeron"],
    category: "clothing",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4v5a6 6 0 0 0 12 0V4" />
        <path d="M4 4h4M16 4h4" />
        <circle cx="7" cy="10" r="0.8" fill={c} />
        <circle cx="8" cy="14" r="0.8" fill={c} />
        <circle cx="17" cy="10" r="0.8" fill={c} />
        <circle cx="16" cy="14" r="0.8" fill={c} />
      </svg>
    )
  },
  "bell": {
    label: "Grelot / Clochette",
    keywords: ["grelot", "clochette", "sonnette", "harnais", "animal"],
    category: "clothing",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        <line x1="12" y1="2" x2="12" y2="4" />
      </svg>
    )
  },
  "pocket-watch": {
    label: "Montre à gousset",
    keywords: ["montre", "gousset", "horloge", "temps", "argent"],
    category: "clothing",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2.5 2.5" />
        <path d="M12 5V2M10 2h4" />
      </svg>
    )
  },
  "scissors": {
    label: "Ciseaux anciens / Forces",
    keywords: ["ciseaux", "forces", "laine", "outil"],
    category: "clothing",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3" />
        <path d="M8.12 8.12 12 12m4 4 2 2" />
        <circle cx="6" cy="18" r="3" />
        <path d="M14.8 9.2 20 4M8.12 15.88 16 8" />
      </svg>
    )
  },

  // --- C. Bijouterie & Objets Précieux ---
  "ring": {
    label: "Bague / Alliance",
    keywords: ["bague", "alliance", "chevaliére", "or", "argent", "gemme"],
    category: "jewelry",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="14" r="7" />
        <circle cx="12" cy="14" r="5" strokeOpacity="0.5" />
        <path d="m9 7 3-4 3 4H9z" fill={c} fillOpacity="0.25" />
      </svg>
    )
  },
  "gem": {
    label: "Pierre précieuse / Gemme",
    keywords: ["gemme", "diamant", "rubis", "saphir", "bijou", "cristal"],
    category: "jewelry",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 7-10 11L2 10l4-7z" />
        <path d="M2 10h20M12 21 8 10 11 3M12 21l4-11-3-7" strokeOpacity="0.75" />
      </svg>
    )
  },
  "pendant": {
    label: "Pendentif / Breloque",
    keywords: ["pendentif", "breloque", "amulette", "talisman"],
    category: "jewelry",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" />
        <path d="m12 6-5 7a5 5 0 0 0 10 0l-5-7z" fill={c} fillOpacity="0.2" />
        <circle cx="12" cy="13" r="1.5" fill={c} />
      </svg>
    )
  },
  "necklace": {
    label: "Collier / Chaîne",
    keywords: ["collier", "chaine", "perles", "or", "argent"],
    category: "jewelry",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5c2 8 6 13 8 13s6-5 8-13" />
        <circle cx="12" cy="18" r="2" fill={c} />
      </svg>
    )
  },

  // --- D. Militaria & Armement ---
  "bullet": {
    label: "Balle / Munition",
    keywords: ["balle", "munition", "mousquet", "ogive", "guerre"],
    category: "militaria",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8V11a4 4 0 0 0-8 0v10z" />
        <path d="M8 15h8M8 18h8" strokeOpacity="0.6" />
        <circle cx="12" cy="7" r="1" fill={c} />
      </svg>
    )
  },
  "cartridge": {
    label: "Douille / Cartouche",
    keywords: ["douille", "cartouche", "douilles", "calibre", "etui"],
    category: "militaria",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="7" width="8" height="14" rx="1" />
        <path d="M7 21h10M9 7V4h6v3" />
        <line x1="8" y1="12" x2="16" y2="12" strokeOpacity="0.6" />
      </svg>
    )
  },
  "militaria": {
    label: "Insigne militaire / Médaille",
    keywords: ["militaria", "insigne", "medaille", "regiment", "guerre"],
    category: "militaria",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 6v6c0 5.5 3.8 10 8 10s8-4.5 8-10V6l-8-4z" />
        <path d="M12 7l1.5 3.5 3.5.5-2.5 2.5.5 3.5-3-1.8-3 1.8.5-3.5-2.5-2.5 3.5-.5z" fill={c} fillOpacity="0.25" />
      </svg>
    )
  },
  "helmet": {
    label: "Casque militaire",
    keywords: ["casque", "adrian", "stalhelm", "poilu", "guerre"],
    category: "militaria",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 15a9 9 0 0 1 18 0" />
        <path d="M2 15h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z" />
        <path d="M12 6v3" />
      </svg>
    )
  },
  "shield": {
    label: "Bouclier / Écu",
    keywords: ["bouclier", "ecu", "armoirie", "blason", "chevalier"],
    category: "militaria",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="12" y1="2" x2="12" y2="22" strokeOpacity="0.5" />
        <line x1="4" y1="10" x2="20" y2="10" strokeOpacity="0.5" />
      </svg>
    )
  },
  "sword": {
    label: "Épée / Glaive",
    keywords: ["epee", "glaive", "lame", "chevalier", "moyen age"],
    category: "militaria",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m14.5 17.5-9 4.5 4.5-9L19 4l1 1-5.5 12.5z" />
        <line x1="13" y1="10" x2="10" y2="13" strokeWidth="2.5" />
        <line x1="19" y1="4" x2="20" y2="5" />
      </svg>
    )
  },
  "dagger": {
    label: "Dague / Poignard",
    keywords: ["dague", "poignard", "couteau", "arme"],
    category: "militaria",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 19 3-3" strokeWidth="2.5" />
        <path d="M7 15l2 2" strokeWidth="2.5" />
        <path d="M9 13 18 4l2 2-9 9-2-2z" />
      </svg>
    )
  },
  "arrow": {
    label: "Flèche / Carreau d'arbalète",
    keywords: ["fleche", "arbalete", "arc", "pointe", "moyen age"],
    category: "militaria",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="19" x2="19" y2="5" />
        <path d="m14 5 5 0 0 5" />
        <path d="m5 16 3 3M7 14l3 3" strokeOpacity="0.75" />
      </svg>
    )
  },
  "axe": {
    label: "Hache / Francisque",
    keywords: ["hache", "francisque", "viking", "outil", "bataille"],
    category: "militaria",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 20 10-10" strokeWidth="2.5" />
        <path d="M14 6 C14 3, 20 3, 21 5 C21 9, 17 11, 14 10 L14 6z" fill={c} fillOpacity="0.25" />
      </svg>
    )
  },
  "bomb": {
    label: "Bombe / Grenade",
    keywords: ["bombe", "grenade", "obus", "danger", "explosif"],
    category: "militaria",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="13.5" r="7.5" />
        <path d="M16 8l3-3" strokeWidth="2" />
        <path d="M18 3l3 3M19.5 4.5l2-2" />
      </svg>
    )
  },

  // --- E. Histoire, Culte & Écritures ---
  "cross": {
    label: "Croix / Religieux",
    keywords: ["croix", "religieux", "christ", "eglise", "medaille", "pelerinage"],
    category: "history",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M5 8h14" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="8" r="2" fill={c} fillOpacity="0.2" />
      </svg>
    )
  },
  "medal": {
    label: "Médaille",
    keywords: ["medaille", "ruban", "commemoration", "recompense"],
    category: "history",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="15" r="6" />
        <circle cx="12" cy="15" r="3.5" strokeOpacity="0.7" />
        <path d="m8 3 4 6 4-6" />
        <line x1="8" y1="3" x2="16" y2="3" />
      </svg>
    )
  },
  "chalice": {
    label: "Calice / Ciboire",
    keywords: ["calice", "ciboire", "coupe", "graal", "or"],
    category: "history",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12v5a6 6 0 0 1-12 0V3z" />
        <line x1="12" y1="14" x2="12" y2="20" strokeWidth="2" />
        <path d="M8 20h8" strokeWidth="2.2" />
      </svg>
    )
  },
  "seal-stamp": {
    label: "Sceau & Matrice",
    keywords: ["sceau", "matrice", "tampon", "cire", "sigillographie"],
    category: "history",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a2 2 0 0 0-2 2v6a4 4 0 0 1-4 4H5v4h14v-4h-1a4 4 0 0 1-4-4V5a2 2 0 0 0-2-2z" />
        <line x1="5" y1="19" x2="19" y2="19" strokeWidth="2" />
      </svg>
    )
  },
  "seal-lead": {
    label: "Plomb de sac / Scellé",
    keywords: ["plomb", "scelle", "douane", "sac", "farine", "tabac"],
    category: "history",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="12" r="5" fill={c} fillOpacity="0.15" />
        <circle cx="16" cy="12" r="5" fill={c} fillOpacity="0.15" />
        <path d="M12 4v16" strokeDasharray="2 2" strokeWidth="1.5" />
        <circle cx="8" cy="12" r="1.5" fill={c} />
        <circle cx="16" cy="12" r="1.5" fill={c} />
      </svg>
    )
  },
  "scale": {
    label: "Poids monétaire / Balance",
    keywords: ["balance", "poids monetaire", "changeur", "pesee"],
    category: "history",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="M7 21h10M12 3v18M3 7h18" />
      </svg>
    )
  },
  "pottery": {
    label: "Poterie / Céramique",
    keywords: ["amphore", "poterie", "ceramique", "vase", "tesson"],
    category: "history",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3h8v3c0 2-3 3-3 5v6c0 2 2 3 2 4H9c0-1 2-2 2-4v-6c0-2-3-3-3-5V3z" />
        <path d="M8 7H5c-1 0-2 1-2 3s1 3 2 3h3" />
        <path d="M16 7h3c1 0 2 1 2 3s-1 3-2 3h-3" />
      </svg>
    )
  },
  "scroll": {
    label: "Parchemin / Document",
    keywords: ["parchemin", "manuscrit", "archive", "papier"],
    category: "history",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17V5a2 2 0 0 0-2-2H4" />
        <path d="M8 21h12a2 2 0 0 0 2-2v-2H10a2 2 0 0 0-2 2v2z" />
        <path d="M4 17a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1" />
        <line x1="8" y1="7" x2="15" y2="7" />
        <line x1="8" y1="11" x2="13" y2="11" />
      </svg>
    )
  },
  "pillar": {
    label: "Ruine / Colonne antique",
    keywords: ["colonne", "ruine", "temple", "gallo romain", "vestige"],
    category: "history",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16M5 7h14M5 20h14M4 23h16" />
        <line x1="7" y1="7" x2="7" y2="20" />
        <line x1="12" y1="7" x2="12" y2="20" />
        <line x1="17" y1="7" x2="17" y2="20" />
      </svg>
    )
  },

  // --- F. Outils, Métiers & Forgerie ---
  "tool": {
    label: "Outils d'artisan",
    keywords: ["outil", "cle", "tournevis", "reparation", "metier"],
    category: "tools",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m14.7 6.3 3 3-10.4 10.4H4.3v-3z" />
        <path d="m16.5 4.5 3 3" />
      </svg>
    )
  },
  "hammer": {
    label: "Marteau de forgeron",
    keywords: ["marteau", "forge", "forgeron", "masse"],
    category: "tools",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9" strokeWidth="2" />
        <path d="M17.64 15 22 10.64l-3.54-3.54a2 2 0 0 1-.59-1.41V4h-1.69a2 2 0 0 1-1.41-.59L11.23 0 6.87 4.36l3.54 3.54a2 2 0 0 1 .59 1.41V11h1.69a2 2 0 0 1 1.41.59z" fill={c} fillOpacity="0.25" />
      </svg>
    )
  },
  "pickaxe": {
    label: "Pioche / Pic",
    keywords: ["pioche", "pic", "mine", "carriere", "fouille"],
    category: "tools",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 9.5 4 20" strokeWidth="2.2" />
        <path d="M21 3c-4 2-9 4-13 4l4 4c0-4 2-9 4-13" fill={c} fillOpacity="0.25" />
      </svg>
    )
  },
  "shovel": {
    label: "Pelle / Bêche",
    keywords: ["pelle", "beche", "creuser", "fouille", "trou"],
    category: "tools",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v10M10 2h4" strokeWidth="2" />
        <path d="M7 12h10l-1.5 7a4 4 0 0 1-7 0L7 12z" fill={c} fillOpacity="0.25" />
      </svg>
    )
  },
  "anvil": {
    label: "Enclume",
    keywords: ["enclume", "forge", "ferraille", "forgeron"],
    category: "tools",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8h16a3 3 0 0 1 3 3c0 2-2 3-4 3h-1l-2 5H9l-2-5H5c-2 0-3-1-3-3a3 3 0 0 1 1-3z" />
        <path d="M6 19h12" strokeWidth="2.2" />
      </svg>
    )
  },
  "nail": {
    label: "Clou forgé",
    keywords: ["clou", "fer", "pointe", "charpente", "forgeron"],
    category: "tools",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4h10v2H7z" fill={c} />
        <path d="M10.5 6 12 20l1.5-14z" fill={c} fillOpacity="0.25" />
      </svg>
    )
  },
  "iron-gear": {
    label: "Engrenage / Mécanique",
    keywords: ["engrenage", "mecanique", "machine", "agricole", "moulin"],
    category: "tools",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  },
  "compass": {
    label: "Boussole / Orientation",
    keywords: ["boussole", "orientation", "nord", "direction", "gps"],
    category: "tools",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={c} fillOpacity="0.25" />
      </svg>
    )
  },

  // --- G. Dépollution & Déchets Métalliques ---
  "bottle-cap": {
    label: "Capsule de bouteille",
    keywords: ["capsule", "bouteille", "biere", "soda", "depollution", "dechet"],
    category: "cleanup",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4l1 2 2-1 0 2.5 2-1-.5 2.5 2.5 0-1 2 2 1-1.5 2 2 .5-2 1.5 1 2-2.5 0 .5 2.5-2-1 0 2.5-2-1-1 2-1-2-2 1 0-2.5-2 1 .5-2.5-2.5 0 1-2-2-1 1.5-2-2-.5 2-1.5-1-2 2.5 0-.5-2.5 2 1 0-2.5 2 1z" strokeOpacity="0.35" />
        <circle cx="12" cy="12" r="4" strokeOpacity="0.75" />
      </svg>
    )
  },
  "pull-tab": {
    label: "Tirette de canette",
    keywords: ["tirette", "canette", "alu", "aluminium", "dechet", "depollution"],
    category: "cleanup",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="4" width="10" height="16" rx="5" />
        <circle cx="12" cy="9" r="2.5" />
        <ellipse cx="12" cy="15" rx="2" ry="1.5" strokeOpacity="0.75" />
      </svg>
    )
  },
  "can": {
    label: "Canette / Conserve",
    keywords: ["canette", "conserve", "boite", "alu", "dechet"],
    category: "cleanup",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="6" ry="2.5" />
        <path d="M6 5v14c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5V5" />
        <path d="M6 12c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5" strokeOpacity="0.5" />
      </svg>
    )
  },
  "wire": {
    label: "Fil de fer / Barbelé",
    keywords: ["barbele", "fil de fer", "cloture", "champ", "piquant"],
    category: "cleanup",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2.2" />
        <path d="m8 8 8 8M16 8l-8 8" />
        <circle cx="12" cy="12" r="1.5" fill={c} />
      </svg>
    )
  },
  "scrap": {
    label: "Déchet ferreux / Ferraille",
    keywords: ["ferraille", "dechet", "dechet ferreux", "rouille", "morceau"],
    category: "cleanup",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 14 3-8 9 2 4 8-7 4-9-6z" />
        <path d="m7 6 4 9 9-1" strokeOpacity="0.5" />
      </svg>
    )
  },

  // --- H. Symboles & Repères ---
  "artifact": {
    label: "Relique / Autre",
    keywords: ["autre", "relique", "indetermine", "objet", "inconnu"],
    category: "symbols",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5M12 22V12" strokeOpacity="0.65" />
      </svg>
    )
  },
  "star": {
    label: "Étoile",
    keywords: ["etoile", "favori", "star", "special"],
    category: "symbols",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  },
  "diamond": {
    label: "Losange",
    keywords: ["losange", "symbole", "geometrie"],
    category: "symbols",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 12 12 22 2 12 12 2" />
      </svg>
    )
  },
  "tag": {
    label: "Étiquette",
    keywords: ["etiquette", "tag", "label", "categorie"],
    category: "symbols",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
        <circle cx="7" cy="7" r="1.5" fill={c} />
      </svg>
    )
  },
  "pin": {
    label: "Repère carte",
    keywords: ["repere", "pin", "carte", "point", "lieu"],
    category: "symbols",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    )
  },
  "sparkle": {
    label: "Éclat / Découverte",
    keywords: ["eclat", "brillant", "scintille", "nouveau"],
    category: "symbols",
    svg: (c) => (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.9 6.1L4 11l6.1 1.9L12 19l1.9-6.1L20 11l-6.1-1.9z" />
      </svg>
    )
  }
};

/**
 * Backward compatibility dictionary: maps old Unicode emojis to the new GeoProspect icon IDs
 */
export const EMOJI_TO_ICON_ID = {
  "🪙": "coin",
  "💰": "coins-stacked",
  "🥇": "medal",
  "🥈": "medal",
  "🥉": "medal",
  "💎": "gem",
  "💍": "ring",
  "👑": "crown",
  "📿": "necklace",
  "🏆": "star",
  "🎖️": "militaria",
  "🏅": "medal",
  "⚜️": "crown",
  "🏺": "pottery",
  "🗿": "statue",
  "🏛️": "pillar",
  "📜": "scroll",
  "🗝️": "key",
  "🔑": "key",
  "🔒": "lock",
  "✝️": "cross",
  "🛡️": "shield",
  "⚔️": "sword",
  "🗡️": "dagger",
  "🏹": "arrow",
  "💣": "bomb",
  "🪖": "helmet",
  "🎯": "pin",
  "🪓": "axe",
  "⚙️": "iron-gear",
  "🥨": "buckle", // Pretzel converted to authentic buckle!
  "🔔": "bell",
  "⚓": "seal-lead", // Anchor converted to authentic lead seal!
  "🔨": "hammer",
  "⛏️": "pickaxe",
  "🔧": "tool",
  "🪛": "tool",
  "✂️": "scissors",
  "🔘": "button", // Radio button converted to authentic button!
  "🥫": "can",
  "🪨": "scrap",
  "⚖️": "scale",
  "🧭": "compass",
  "📦": "artifact",
  "🏷️": "tag",
  "✨": "sparkle",
  "⭐": "star"
};

/**
 * Universal Category Icon component.
 * Renders an SVG icon matching either an icon ID or a legacy emoji.
 * If unrecognized, renders text cleanly.
 */
export default function CategoryIcon({
  name,
  color = "currentColor",
  size = 18,
  style = {},
  className = ""
}) {
  const iconId = EMOJI_TO_ICON_ID[name] || name;
  const def = CATEGORY_ICONS[iconId];

  if (def && typeof def.svg === "function") {
    return (
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: `${size}px`,
          height: `${size}px`,
          flexShrink: 0,
          ...style
        }}
        aria-label={def.label}
        title={def.label}
      >
        {def.svg(color)}
      </span>
    );
  }

  // Fallback for non-mapped custom emoji or text
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: `${size * 0.9}px`,
        lineHeight: 1,
        flexShrink: 0,
        ...style
      }}
    >
      {name || "🏷️"}
    </span>
  );
}
