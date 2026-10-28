import L from "leaflet";
import { defaultCategoryColors } from "./subCategories";
import { loadCategoriesData } from "./services/categoriesService";
import { renderTacticalPinSvg, resolveMarkerId } from "./constants/tacticalMarkers";

const PIN_SIZES = {
  small: { w: 22, h: 28, anchor: [11, 28], popup: [0, -26] },
  medium: { w: 28, h: 36, anchor: [14, 36], popup: [0, -34] },
  large: { w: 36, h: 46, anchor: [18, 46], popup: [0, -44] }
};

const HIGHLIGHTED_SIZES = {
  small: { w: 36, h: 42, anchor: [18, 35], popup: [0, -36] },
  medium: { w: 46, h: 54, anchor: [23, 44], popup: [0, -46] },
  large: { w: 56, h: 65, anchor: [28, 53], popup: [0, -56] }
};

/**
 * Creates a Leaflet Icon with the GeoProspect tactical pin
 */
export function createTacticalIcon(markerId, color, size = "medium", isHighlighted = false) {
  const safeColor = color || "#facc15";
  const dimTable = isHighlighted ? HIGHLIGHTED_SIZES : PIN_SIZES;
  const dim = dimTable[size] || dimTable.medium;

  const svg = renderTacticalPinSvg(markerId, safeColor, dim.w, dim.h, isHighlighted);

  return new L.Icon({
    iconUrl: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    iconSize: [dim.w, dim.h],
    iconAnchor: dim.anchor,
    popupAnchor: dim.popup
  });
}

// Icon memory cache to avoid redundant Leaflet Icon instances
const iconCache = new Map();

/**
 * Resolves and returns the cached tactical Leaflet Icon for a category.
 */
export function getCategoryIcon(category, customColors = null, size = "medium", isHighlighted = false) {
  let color = null;
  let storedIcon = null;

  try {
    const { colors, emojis } = loadCategoriesData();
    if (customColors && customColors[category]) {
      color = customColors[category];
    } else if (colors && colors[category]) {
      color = colors[category];
    }
    if (emojis && emojis[category]) {
      storedIcon = emojis[category];
    }
  } catch {
    // Fallback
  }

  if (!color) {
    color = defaultCategoryColors[category] || defaultCategoryColors["Autre"] || "#334155";
  }

  const markerId = resolveMarkerId(storedIcon, category);
  const cacheKey = `${markerId}_${color}_${size}_${isHighlighted ? "hl" : "norm"}`;

  if (!iconCache.has(cacheKey)) {
    iconCache.set(cacheKey, createTacticalIcon(markerId, color, size, isHighlighted));
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
