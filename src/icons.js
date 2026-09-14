import L from "leaflet";
import { defaultCategoryColors } from "./subCategories";
import { loadCategoriesData } from "./services/categoriesService";

export function createIcon(color) {
  const safeColor = color || "#3b82f6";
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
        fill="${safeColor}"
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

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });
}

// Icon memory cache to avoid creating duplicate Leaflet Icon instances
const iconCache = new Map();

export function getCategoryIcon(category, customColors = null) {
  let color = null;
  if (customColors && customColors[category]) {
    color = customColors[category];
  } else {
    try {
      const { colors } = loadCategoriesData();
      if (colors && colors[category]) {
        color = colors[category];
      }
    } catch {
      // Fallback
    }
  }

  if (!color) {
    color = defaultCategoryColors[category] || defaultCategoryColors["Autre"] || "#334155";
  }

  if (!iconCache.has(color)) {
    iconCache.set(color, createIcon(color));
  }
  return iconCache.get(color);
}

// Transparent Proxy object ensuring icons[catName] works seamlessly everywhere
export const icons = new Proxy({}, {
  get(target, prop) {
    if (typeof prop === "string") {
      if (prop === "autre" || prop === "Autre") {
        return getCategoryIcon("Autre");
      }
      return getCategoryIcon(prop);
    }
    return target[prop];
  }
});