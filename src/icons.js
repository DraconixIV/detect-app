import L from "leaflet";

function createIcon(color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="25"
         height="41"
         viewBox="0 0 25 41"
         style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.35)); transition: transform 0.1s ease-out;">
      <path
        d="M12.5 0C5.6 0 0 5.6 0 12.5
           c0 9.4 12.5 28.5 12.5 28.5
           S25 21.9 25 12.5
           C25 5.6 19.4 0 12.5 0z"
        fill="${color}"
        stroke="#ffffff"
        stroke-width="1.5"
      />
      <circle
        cx="12.5"
        cy="12.5"
        r="5"
        fill="white"
      />
    </svg>
  `;

  return new L.divIcon({
    className: "",
    html: svg,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -34]
  });
}

export const icons = {
  Monnaie: createIcon("#facc15"),    // Jaune vif (impératif)
  Bijou: createIcon("#ec4899"),      // Rose magenta élégant
  Boucle: createIcon("#8b5cf6"),     // Violet
  Bouton: createIcon("#10b981"),     // Vert émeraude
  Médaille: createIcon("#3b82f6"),   // Bleu royal
  Munition: createIcon("#ef4444"),   // Rouge corail
  Outil: createIcon("#f97316"),      // Orange/Ambre
  Plomb: createIcon("#6b7280"),      // Gris acier
  Religieux: createIcon("#d97706"),  // Brun doré
  Autre: createIcon("#111827")       // Noir charbon
};