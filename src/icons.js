import L from "leaflet";

function createIcon(color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="25"
         height="41"
         viewBox="0 0 25 41">
      <path
        d="M12.5 0C5.6 0 0 5.6 0 12.5
           c0 9.4 12.5 28.5 12.5 28.5
           S25 21.9 25 12.5
           C25 5.6 19.4 0 12.5 0z"
        fill="${color}"
        stroke="#000"
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

  return new L.Icon({
    iconUrl:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(svg),

    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
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

export function createClusterIcon(count) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: rgba(37, 99, 235, 0.95);
        border: 3px solid white;
        border-radius: 50%;
        color: white;
        font-weight: 800;
        font-size: 14px;
        font-family: system-ui, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
      ">
        ${count}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}