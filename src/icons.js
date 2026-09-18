import L from "leaflet";
import { defaultCategoryColors } from "./subCategories";
import { loadCategoriesData } from "./services/categoriesService";

const SIZES = {
  small: { w: 19, h: 31, anchor: [9.5, 31], popup: [1, -26] },
  medium: { w: 25, h: 41, anchor: [12.5, 41], popup: [1, -34] },
  large: { w: 33, h: 54, anchor: [16.5, 54], popup: [1, -45] }
};

export function createIcon(color, size = "medium") {
  const safeColor = color || "#3b82f6";
  const dim = SIZES[size] || SIZES.medium;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="${dim.w}"
         height="${dim.h}"
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

    iconSize: [dim.w, dim.h],
    iconAnchor: dim.anchor,
    popupAnchor: dim.popup
  });
}

// Icon memory cache to avoid creating duplicate Leaflet Icon instances
const iconCache = new Map();

export function getCategoryIcon(category, customColors = null, size = "medium") {
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

  const cacheKey = `${color}_${size}`;
  if (!iconCache.has(cacheKey)) {
    iconCache.set(cacheKey, createIcon(color, size));
  }
  return iconCache.get(cacheKey);
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