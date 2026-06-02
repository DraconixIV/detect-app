import L from "leaflet";

function createIcon(color) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,

    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],

    iconAnchor: [12, 41],

    popupAnchor: [1, -34],

    shadowSize: [41, 41]
  });
}

export const icons = {
  autre: createIcon("grey"),

  bijou: createIcon("yellow"),

  boucle: createIcon("orange"),

  bouton: createIcon("violet"),

  "dé à coudre":
    createIcon("black"),

  médaille:
    createIcon("yellow"),

  militaire:
    createIcon("red"),

  monnaie:
    createIcon("green"),

  outil:
    createIcon("blue"),

  plomb:
    createIcon("blue"),

  religieux:
    createIcon("violet")
};