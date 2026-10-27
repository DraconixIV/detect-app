/**
 * GeoProspect Tactical Markers Library (42 Proprietary Vector Markers)
 * High-performance vector icons with dark forest body (#242c26),
 * white silhouette (#ffffff), and dynamic outer border coloring.
 */

export const TACTICAL_MARKERS = [
  {
    id: "monnaie",
    label: "Monnaie",
    keywords: ["monnaie", "piece", "flan", "franc", "euro", "centime", "numismatique"],
    svgInner: `
      <g transform="translate(18, 17)">
        <path d="M-8.5 -1 v4 A 8.5 4.5 0 0 0 8.5 3 v-4 A 8.5 4.5 0 0 1 -8.5 -1" fill="#1b241e" stroke="#ffffff" stroke-width="1.8"/>
        <line x1="-6.5" y1="2.0" x2="-6.5" y2="6.0" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round"/>
        <line x1="-4" y1="2.9" x2="-4" y2="6.9" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round"/>
        <line x1="-1.5" y1="3.4" x2="-1.5" y2="7.4" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round"/>
        <line x1="1.5" y1="3.4" x2="1.5" y2="7.4" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round"/>
        <line x1="4" y1="2.9" x2="4" y2="6.9" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round"/>
        <line x1="6.5" y1="2.0" x2="6.5" y2="6.0" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round"/>
        <ellipse cx="0" cy="-1" rx="8.5" ry="4.5" fill="#242c26" stroke="#ffffff" stroke-width="1.8"/>
        <ellipse cx="0" cy="-1" rx="6.8" ry="3.2" fill="none" stroke="#ffffff" stroke-width="0.9" opacity="0.8"/>
      </g>
    `
  },
  {
    id: "boucle",
    label: "Boucle",
    keywords: ["boucle", "ceinturon", "harnachement", "chaussure"],
    svgInner: `
      <rect x="9" y="11" width="18" height="14" rx="3.5" stroke="#ffffff" stroke-width="2.2" fill="none"/>
      <line x1="18" y1="11" x2="18" y2="25" stroke="#ffffff" stroke-width="1.8"/>
      <line x1="18" y1="18" x2="23" y2="18" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    `
  },
  {
    id: "bouton",
    label: "Bouton",
    keywords: ["bouton", "uniforme", "civile", "attache"],
    svgInner: `
      <circle cx="18" cy="18" r="10" stroke="#ffffff" stroke-width="2" fill="none"/>
      <circle cx="18" cy="18" r="6.5" stroke="#ffffff" stroke-width="0.8" stroke-dasharray="1 1" fill="none"/>
      <circle cx="15.5" cy="15.5" r="1.3" fill="#ffffff"/>
      <circle cx="20.5" cy="15.5" r="1.3" fill="#ffffff"/>
      <circle cx="15.5" cy="20.5" r="1.3" fill="#ffffff"/>
      <circle cx="20.5" cy="20.5" r="1.3" fill="#ffffff"/>
    `
  },
  {
    id: "cle",
    label: "Clé",
    keywords: ["cle", "clef", "serrure", "cadenas"],
    svgInner: `
      <circle cx="13" cy="20" r="4" stroke="#ffffff" stroke-width="2" fill="none"/>
      <line x1="16" y1="17" x2="25" y2="8" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="22" y1="11" x2="24" y2="13" stroke="#ffffff" stroke-width="2"/>
      <line x1="24" y1="9" x2="26" y2="11" stroke="#ffffff" stroke-width="2"/>
    `
  },
  {
    id: "grelot",
    label: "Grelot",
    keywords: ["grelot", "clochette", "attelage", "cheval", "sonnette"],
    svgInner: `
      <circle cx="18" cy="18" r="8" fill="#ffffff"/>
      <line x1="12" y1="18" x2="24" y2="18" stroke="#242c26" stroke-width="1.8"/>
      <circle cx="18" cy="18" r="2.2" fill="#242c26"/>
      <circle cx="18" cy="9" r="1.5" stroke="#ffffff" stroke-width="1.2" fill="none"/>
    `
  },
  {
    id: "bague",
    label: "Bague",
    keywords: ["bague", "anneau", "alliance", "chevaliere", "bijou"],
    svgInner: `
      <circle cx="18" cy="20" r="6.5" stroke="#ffffff" stroke-width="2" fill="none"/>
      <path d="M15 13.5l3-4.5 3 4.5h-6z" fill="#ffffff"/>
      <line x1="18" y1="9" x2="18" y2="13.5" stroke="#242c26" stroke-width="1.2"/>
    `
  },
  {
    id: "pendentif",
    label: "Pendentif",
    keywords: ["pendentif", "collier", "parure", "bijou"],
    svgInner: `
      <circle cx="18" cy="11" r="1.5" stroke="#ffffff" stroke-width="1.2" fill="none"/>
      <path d="m18 13-5 6 5 6 5-6-5-6z" fill="#ffffff"/>
      <line x1="13" y1="19" x2="23" y2="19" stroke="#242c26" stroke-width="1.2"/>
    `
  },
  {
    id: "montre",
    label: "Montre",
    keywords: ["montre", "gousset", "horlogerie", "cadran", "heure"],
    svgInner: `
      <circle cx="18" cy="19" r="7.5" stroke="#ffffff" stroke-width="2" fill="none"/>
      <path d="M18 15v4l2.5 2.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="18" cy="10" r="1.2" stroke="#ffffff" stroke-width="1.2" fill="none"/>
    `
  },
  {
    id: "militaria",
    label: "Militaria",
    keywords: ["militaria", "grade", "chevron", "armee", "regiment"],
    svgInner: `
      <path d="M11 15l7-4 7 4" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M11 20l7-4 7 4" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="18" cy="23" r="1.2" fill="#ffffff"/>
    `
  },
  {
    id: "religieux",
    label: "Religieux",
    keywords: ["religieux", "croix", "chretien", "pelerinage", "foi"],
    svgInner: `
      <path d="M17 10h2v4h4v2h-4v8h-2v-8h-4v-2h4v-4z" fill="#ffffff"/>
      <circle cx="18" cy="10" r="1.5" fill="#ffffff"/>
      <circle cx="23" cy="15" r="1.5" fill="#ffffff"/>
      <circle cx="13" cy="15" r="1.5" fill="#ffffff"/>
      <circle cx="18" cy="24" r="1.5" fill="#ffffff"/>
    `
  },
  {
    id: "munition",
    label: "Munition",
    keywords: ["munition", "balle", "cartouche", "ogive", "obus", "douille"],
    svgInner: `
      <circle cx="14" cy="21" r="3.5" fill="#ffffff"/>
      <path d="M20 10c1.5 1 3 3 3 5v8h-6v-8c0-2 1.5-4 3-5z" fill="#ffffff"/>
      <line x1="17" y1="20" x2="23" y2="20" stroke="#242c26" stroke-width="1"/>
    `
  },
  {
    id: "casque",
    label: "Casque",
    keywords: ["casque", "adrian", "militaire", "poilu", "guerre"],
    svgInner: `
      <path d="M11 20c0-4.5 3-8 7-8s7 3.5 7 8" fill="#ffffff"/>
      <path d="M9 20h18l-1 2H10l-1-2z" fill="#ffffff"/>
      <path d="M17 10h2v4h-2z" fill="#ffffff"/>
    `
  },
  {
    id: "epee",
    label: "Épée",
    keywords: ["epee", "lame", "fourreau", "arme", "poignard"],
    svgInner: `
      <path d="M17 8h2l.8 11h-3.6z" fill="#ffffff"/>
      <rect x="13" y="19" width="10" height="2" rx="0.5" fill="#ffffff"/>
      <rect x="17" y="21" width="2" height="3" fill="#ffffff"/>
      <circle cx="18" cy="25" r="1.3" fill="#ffffff"/>
    `
  },
  {
    id: "fibule",
    label: "Fibule",
    keywords: ["fibule", "romain", "gaulois", "broche", "antique"],
    svgInner: `
      <path d="M12 21c-2-3-1-8 3-10s8-1 10 3" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <circle cx="12" cy="21" r="1.5" fill="#ffffff"/>
      <circle cx="25" cy="14" r="1.5" fill="#ffffff"/>
      <line x1="11" y1="21" x2="26" y2="12" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
    `
  },
  {
    id: "fer",
    label: "Fer à cheval",
    keywords: ["fer", "cheval", "mulet", "harnais", "forge"],
    svgInner: `
      <path d="M12 23c-1.5-6 1-12 6-12s7.5 6 6 12" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none"/>
      <circle cx="14" cy="18" r="0.9" fill="#242c26"/>
      <circle cx="22" cy="18" r="0.9" fill="#242c26"/>
      <circle cx="15.5" cy="14" r="0.9" fill="#242c26"/>
      <circle cx="20.5" cy="14" r="0.9" fill="#242c26"/>
    `
  },
  {
    id: "de_coudre",
    label: "Dé à coudre",
    keywords: ["de", "coudre", "couture", "tailleur", "ruche"],
    svgInner: `
      <path d="M14 12c0-2 1.8-3 4-3s4 1 4 3l1.5 10.5h-11l1.5-10.5z" fill="#ffffff"/>
      <circle cx="18" cy="13" r="0.7" fill="#242c26"/>
      <circle cx="16" cy="15.5" r="0.7" fill="#242c26"/>
      <circle cx="20" cy="15.5" r="0.7" fill="#242c26"/>
      <circle cx="18" cy="18" r="0.7" fill="#242c26"/>
      <circle cx="15.5" cy="20.5" r="0.7" fill="#242c26"/>
      <circle cx="20.5" cy="20.5" r="0.7" fill="#242c26"/>
    `
  },
  {
    id: "autre",
    label: "Autre",
    keywords: ["autre", "divers", "indetermine", "inconnu"],
    svgInner: `
      <circle cx="18" cy="18" r="8" stroke="#ffffff" stroke-width="1.8" fill="none"/>
      <circle cx="13" cy="18" r="1.2" fill="#ffffff"/>
      <circle cx="18" cy="18" r="1.2" fill="#ffffff"/>
      <circle cx="23" cy="18" r="1.2" fill="#ffffff"/>
    `
  },
  {
    id: "outil",
    label: "Outil",
    keywords: ["outil", "caisse", "artisan", "bricolage", "ferronnerie"],
    svgInner: `
      <path d="M15 13v-2h6v2" stroke="#ffffff" stroke-width="1.6" fill="none"/>
      <rect x="11" y="13" width="14" height="10" rx="1.5" fill="#ffffff"/>
      <line x1="11" y1="16.5" x2="25" y2="16.5" stroke="#242c26" stroke-width="1.2"/>
      <rect x="16.5" y="15.5" width="3" height="2.5" rx="0.5" fill="#242c26"/>
    `
  },
  {
    id: "plomb",
    label: "Plomb",
    keywords: ["plomb", "scelle", "pesee", "lest", "filoir"],
    svgInner: `
      <circle cx="18" cy="11.5" r="2" stroke="#ffffff" stroke-width="1.6" fill="none"/>
      <path d="M16 13h4l2 5-4 6-4-6 2-5z" fill="#ffffff"/>
      <line x1="15" y1="18" x2="21" y2="18" stroke="#242c26" stroke-width="1.2"/>
    `
  },
  {
    id: "clou",
    label: "Clou",
    keywords: ["clou", "forge", "charpente", "pointe"],
    svgInner: `
      <path d="M14 11l4-2 4 2-4 2-4-2z" fill="#ffffff"/>
      <path d="M17 12h2l-1 13h0z" fill="#ffffff"/>
    `
  },
  {
    id: "fleche",
    label: "Flèche",
    keywords: ["fleche", "arc", "pointe", "carreau", "barbele", "chasse", "trait"],
    svgInner: `
      <!-- Pointe réaliste effilée à barbillons et douille -->
      <path d="M18 7 L22 14 L19.2 13.5 L19.2 16 L16.8 16 L16.8 13.5 L14 14 Z" fill="#ffffff"/>
      <!-- Fût en bois de la flèche -->
      <line x1="18" y1="13" x2="18" y2="26.5" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>
      <!-- Empennage à plumes réalistes -->
      <path d="M18 19.5 L14.8 23.5 L15.5 25 L18 24 Z" fill="#ffffff"/>
      <path d="M18 19.5 L21.2 23.5 L20.5 25 L18 24 Z" fill="#ffffff"/>
      <!-- Encoche à la base -->
      <line x1="17.2" y1="26.5" x2="18.8" y2="26.5" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>
    `
  },
  {
    id: "medaille",
    label: "Médaille",
    keywords: ["medaille", "pelerin", "sainte", "sanctuaire", "pendentif"],
    svgInner: `
      <circle cx="18" cy="10" r="1.5" stroke="#ffffff" stroke-width="1.2" fill="none"/>
      <ellipse cx="18" cy="18" rx="6" ry="7.5" fill="#ffffff"/>
      <path d="M18 13.5v9M15 17h6" stroke="#242c26" stroke-width="1.4"/>
    `
  },
  {
    id: "eperon",
    label: "Éperon",
    keywords: ["eperon", "cavalier", "cheval", "molette", "botte"],
    svgInner: `
      <path d="M13 14c0 4 2 7 5 7s5-3 5-7" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <line x1="18" y1="21" x2="18" y2="24" stroke="#ffffff" stroke-width="2"/>
      <circle cx="18" cy="24" r="1.5" fill="#ffffff"/>
    `
  },
  {
    id: "cadenas",
    label: "Cadenas",
    keywords: ["cadenas", "coffre", "serrure", "securite"],
    svgInner: `
      <path d="M14 15v-3c0-2.2 1.8-4 4-4s4 1.8 4 4v3" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none"/>
      <rect x="12" y="15" width="12" height="9" rx="2" fill="#ffffff"/>
      <circle cx="18" cy="18.5" r="1.3" fill="#242c26"/>
      <line x1="18" y1="19.5" x2="18" y2="22" stroke="#242c26" stroke-width="1.2"/>
    `
  },
  {
    id: "boussole",
    label: "Boussole",
    keywords: ["boussole", "compas", "orientation", "nord", "carte"],
    svgInner: `
      <circle cx="18" cy="18" r="8" stroke="#ffffff" stroke-width="1.8" fill="none"/>
      <polygon points="18,11 20,17 18,16 16,17" fill="#ffffff"/>
      <polygon points="18,25 20,19 18,20 16,19" fill="#ffffff"/>
      <circle cx="18" cy="18" r="1.2" fill="#ffffff"/>
    `
  },
  {
    id: "ancre",
    label: "Ancre",
    keywords: ["ancre", "marine", "bateau", "peche", "plage"],
    svgInner: `
      <circle cx="18" cy="11" r="1.8" stroke="#ffffff" stroke-width="1.4" fill="none"/>
      <line x1="18" y1="13" x2="18" y2="24" stroke="#ffffff" stroke-width="2"/>
      <line x1="14" y1="15" x2="22" y2="15" stroke="#ffffff" stroke-width="1.8"/>
      <path d="M12 20c1.5 4 4.5 5 6 5s4.5-1 6-5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none"/>
    `
  },
  {
    id: "blason",
    label: "Blason",
    keywords: ["blason", "armoiries", "heradique", "chevalier", "noble"],
    svgInner: `
      <path d="M13 11h10v7c0 4-5 7-5 7s-5-3-5-7v-7z" fill="#ffffff"/>
      <path d="M13 16h10M18 11v14" stroke="#242c26" stroke-width="1.2"/>
    `
  },
  {
    id: "couronne",
    label: "Couronne",
    keywords: ["couronne", "roi", "reine", "fleuron", "royaute"],
    svgInner: `
      <path d="M11 22l2-9 5 5 5-5 2 9h-14z" fill="#ffffff"/>
      <circle cx="11" cy="12" r="1" fill="#ffffff"/>
      <circle cx="18" cy="11" r="1.2" fill="#ffffff"/>
      <circle cx="25" cy="12" r="1" fill="#ffffff"/>
      <line x1="11" y1="22" x2="25" y2="22" stroke="#ffffff" stroke-width="2"/>
    `
  },
  {
    id: "balance",
    label: "Balance",
    keywords: ["balance", "poids", "trebuchet", "justice", "pesee"],
    svgInner: `
      <line x1="18" y1="10" x2="18" y2="23" stroke="#ffffff" stroke-width="1.8"/>
      <line x1="12" y1="12" x2="24" y2="12" stroke="#ffffff" stroke-width="1.8"/>
      <path d="M10 18l2-6 2 6c0 1-1.8 1.5-2 1.5s-2-.5-2-1.5z" fill="#ffffff"/>
      <path d="M22 18l2-6 2 6c0 1-1.8 1.5-2 1.5s-2-.5-2-1.5z" fill="#ffffff"/>
    `
  },
  {
    id: "insigne",
    label: "Insigne",
    keywords: ["insigne", "etoile", "badge", "sherif", "officier"],
    svgInner: `
      <circle cx="18" cy="18" r="8" stroke="#ffffff" stroke-width="1.8" fill="none"/>
      <polygon points="18,12 19.8,16 24,16.5 21,19.5 21.8,24 18,22 14.2,24 15,19.5 12,16.5 16.2,16" fill="#ffffff"/>
    `
  },
  {
    id: "decoration",
    label: "Décoration",
    keywords: ["decoration", "medaille", "croix", "guerre", "ruban"],
    svgInner: `
      <rect x="15" y="10" width="6" height="5" rx="0.5" fill="#ffffff"/>
      <path d="M17 16h2v3h3v2h-3v3h-2v-3h-3v-2h3v-3z" fill="#ffffff"/>
    `
  },
  {
    id: "agrafe",
    label: "Agrafe",
    keywords: ["agrafe", "col", "cape", "fermoir", "demi-ceint"],
    svgInner: `
      <path d="M15 14c0-2.5 2-3.5 4-3.5s3 1.5 3 3.5c0 3-8 4-8 7 0 2 1.5 3.5 3.5 3.5s3.5-1 3.5-3" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    `
  },
  {
    id: "mors",
    label: "Mors de cheval",
    keywords: ["mors", "bride", "cheval", "harnais", "equitation"],
    svgInner: `
      <circle cx="12.5" cy="18" r="3.5" stroke="#ffffff" stroke-width="1.8" fill="none"/>
      <circle cx="23.5" cy="18" r="3.5" stroke="#ffffff" stroke-width="1.8" fill="none"/>
      <line x1="16" y1="18" x2="20" y2="18" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="18" cy="18" r="1" fill="#ffffff"/>
    `
  },
  {
    id: "jeton",
    label: "Jeton",
    keywords: ["jeton", "mereau", "compte", "abbaye", "peage"],
    svgInner: `
      <circle cx="18" cy="18" r="8" stroke="#ffffff" stroke-width="2" fill="none"/>
      <rect x="14" y="14" width="8" height="8" stroke="#ffffff" stroke-width="1.5" fill="none"/>
    `
  },
  {
    id: "croix_templiers",
    label: "Croix templière",
    keywords: ["templier", "croix", "pattee", "croisade", "ordre"],
    svgInner: `
      <path d="M16 14h4l1-3h-6zM16 22h4l1 3h-6zM14 16v4l-3 1v-6zM22 16v4l3 1v-6z" fill="#ffffff"/>
      <circle cx="18" cy="18" r="1.5" fill="#ffffff"/>
    `
  },
  {
    id: "boucle_ovale",
    label: "Boucle ovale",
    keywords: ["boucle", "ovale", "chaussure", "jarretiere", "siecle"],
    svgInner: `
      <ellipse cx="18" cy="18" rx="8" ry="6" stroke="#ffffff" stroke-width="2" fill="none"/>
      <line x1="18" y1="12" x2="18" y2="24" stroke="#ffffff" stroke-width="1.8"/>
      <line x1="18" y1="18" x2="23" y2="18" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
    `
  },
  {
    id: "rouelle",
    label: "Rouelle",
    keywords: ["rouelle", "votive", "celte", "gaulois", "solaire"],
    svgInner: `
      <circle cx="18" cy="18" r="8" stroke="#ffffff" stroke-width="2" fill="none"/>
      <circle cx="18" cy="18" r="2" fill="#ffffff"/>
      <line x1="18" y1="10" x2="18" y2="26" stroke="#ffffff" stroke-width="1.2"/>
      <line x1="10" y1="18" x2="26" y2="18" stroke="#ffffff" stroke-width="1.2"/>
      <line x1="12" y1="12" x2="24" y2="24" stroke="#ffffff" stroke-width="1.2"/>
      <line x1="12" y1="24" x2="24" y2="12" stroke="#ffffff" stroke-width="1.2"/>
    `
  },
  {
    id: "diamant",
    label: "Diamant",
    keywords: ["diamant", "gemme", "tresor", "pierre", "précieux"],
    svgInner: `
      <polygon points="14,13 22,13 25,17 18,24 11,17" stroke="#ffffff" stroke-width="1.8" fill="none"/>
      <line x1="11" y1="17" x2="25" y2="17" stroke="#ffffff" stroke-width="1.2"/>
      <line x1="18" y1="13" x2="15" y2="17" stroke="#ffffff" stroke-width="1.2"/>
      <line x1="18" y1="13" x2="21" y2="17" stroke="#ffffff" stroke-width="1.2"/>
      <line x1="18" y1="24" x2="15" y2="17" stroke="#ffffff" stroke-width="1.2"/>
      <line x1="18" y1="24" x2="21" y2="17" stroke="#ffffff" stroke-width="1.2"/>
    `
  },
  {
    id: "mystere",
    label: "Mystère ?",
    keywords: ["mystere", "inconnu", "oni", "question", "recherche"],
    svgInner: `
      <path d="M15 13c.5-2 2-3 4-3s3.5 1 3.5 2.5c0 2-2 2.5-3 3.5-.7.7-.7 1.5-.7 2.5" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <circle cx="18.8" cy="22.5" r="1.3" fill="#ffffff"/>
    `
  },
  {
    id: "boite",
    label: "Boîte",
    keywords: ["boite", "coffre", "reliquat", "fourre-tout", "stockage"],
    svgInner: `
      <polygon points="18,10 24,14 18,18 12,14" fill="#ffffff"/>
      <polygon points="12,14 18,18 18,25 12,21" fill="#ffffff" opacity="0.8"/>
      <polygon points="18,18 24,14 24,21 18,25" fill="#ffffff" opacity="0.6"/>
    `
  },
  {
    id: "pile_pieces",
    label: "Pile de pièces",
    keywords: ["pile", "pieces", "monnaies", "tresor", "magot", "bourse"],
    svgInner: `
      <path d="M11 18v3.5c0 1.8 3.1 3.5 7 3.5s7-1.7 7-3.5V18" stroke="#ffffff" stroke-width="1.8" fill="#1b241e"/>
      <path d="M11 15v3c0 1.8 3.1 3.5 7 3.5s7-1.7 7-3.5V15" stroke="#ffffff" stroke-width="1.8" fill="#202a22"/>
      <ellipse cx="18" cy="14" rx="7" ry="3.2" stroke="#ffffff" stroke-width="2" fill="#242c26"/>
    `
  }
];

export const TACTICAL_MARKERS_BY_ID = Object.fromEntries(
  TACTICAL_MARKERS.map((m) => [m.id, m])
);

/**
 * Mapping table from historical emojis to tactical marker IDs
 * Ensures 100% retro-compatibility for existing finds and categories.
 */
export const EMOJI_TO_MARKER_MAP = {
  "🪙": "monnaie",
  "💰": "pile_pieces",
  "🥨": "boucle",
  "🔘": "bouton",
  "🗝️": "cle",
  "🔑": "cle",
  "🔒": "cadenas",
  "🔔": "grelot",
  "💍": "bague",
  "💎": "diamant",
  "📿": "pendentif",
  "🎖️": "decoration",
  "🏅": "medaille",
  "🏆": "insigne",
  "⚜️": "blason",
  "🛡️": "blason",
  "👑": "couronne",
  "⚔️": "epee",
  "🗡️": "epee",
  "🏹": "fleche",
  "💣": "munition",
  "🪖": "casque",
  "🛠️": "outil",
  "🔨": "outil",
  "⛏️": "outil",
  "🔧": "outil",
  "⚙️": "rouelle",
  "✝️": "religieux",
  "⚓": "ancre",
  "⚖️": "balance",
  "🧭": "boussole",
  "📦": "boite",
  "❓": "mystere",
  "❔": "mystere"
};

/**
 * Resolves a category's marker ID from its stored icon/emoji or name.
 */
export function resolveMarkerId(iconOrEmoji, categoryName = "") {
  if (iconOrEmoji === "carreau") {
    return "fleche";
  }
  if (iconOrEmoji && TACTICAL_MARKERS_BY_ID[iconOrEmoji]) {
    return iconOrEmoji;
  }
  if (iconOrEmoji && EMOJI_TO_MARKER_MAP[iconOrEmoji]) {
    return EMOJI_TO_MARKER_MAP[iconOrEmoji];
  }

  // Fallback by normalized category name
  const normalized = (categoryName || "").toLowerCase().trim();
  for (const marker of TACTICAL_MARKERS) {
    if (marker.id === normalized || marker.label.toLowerCase() === normalized) {
      return marker.id;
    }
    if (marker.keywords.some((k) => normalized.includes(k))) {
      return marker.id;
    }
  }

  return "autre";
}

/**
 * Generates the full raw SVG string for a tactical pin
 * @param {string} markerId - ID of the tactical marker
 * @param {string} color - Dynamic stroke color for the pin contour
 * @param {number} width - Output width
 * @param {number} height - Output height
 * @param {boolean} isHighlighted - If true, adds subtle luminous halo
 */
export function renderTacticalPinSvg(markerId, color = "#facc15", width = 36, height = 46, isHighlighted = false) {
  const marker = TACTICAL_MARKERS_BY_ID[markerId] || TACTICAL_MARKERS_BY_ID.autre;
  const safeColor = color || "#facc15";

  const highlightAura = isHighlighted
    ? `
      <ellipse cx="18" cy="19" rx="17" ry="17" fill="${safeColor}" opacity="0.25"/>
      <circle cx="18" cy="19" r="16" stroke="${safeColor}" stroke-width="1.2" stroke-dasharray="2 2" opacity="0.6"/>
    `
    : "";

  return `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="${width}"
         height="${height}"
         viewBox="0 0 36 46"
         fill="none">
      ${highlightAura}
      <path
        d="M18 2C8.6 2 1 9.6 1 19c0 10.5 14 24 17 26 3-2 17-15.5 17-26 0-9.4-7.6-17-17-17z"
        fill="#242c26"
        stroke="${safeColor}"
        stroke-width="${isHighlighted ? "2.6" : "2"}"
        stroke-linejoin="round"
      />
      ${marker.svgInner}
    </svg>
  `.trim();
}
