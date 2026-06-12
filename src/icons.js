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
  autre: createIcon("#000000"),      // noir

  bijou: createIcon("#ff69b4"),      // rose

  boucle: createIcon("#8b4513"),     // marron

  bouton: createIcon("#22c55e"),     // vert

  "dé à coudre":
    createIcon("#ffffff"),           // blanc

  médaille:
    createIcon("#2563eb"),           // bleu

  militaire:
    createIcon("#dc2626"),           // rouge

  monnaie:
    createIcon("#facc15"),           // jaune

  outil:
    createIcon("#4b5563"),           // gris foncé

  plomb:
    createIcon("#9ca3af"),           // gris

  religieux:
    createIcon("#f97316")            // orange
};