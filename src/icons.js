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

const HIGHLIGHTED_SIZES = {
  small: { w: 27, h: 36, anchor: [13.5, 36], popup: [0, -33] },
  medium: { w: 36, h: 48, anchor: [18, 48], popup: [0, -44] },
  large: { w: 45, h: 60, anchor: [22.5, 60], popup: [0, -55] }
};

export function createHighlightedIcon(color, size = "medium") {
  const safeColor = color || "#3b82f6";
  const dim = HIGHLIGHTED_SIZES[size] || HIGHLIGHTED_SIZES.medium;

  // Luminous Luxury Golden Highlight Pin (100% vector SVG, native L.Icon, static radiant halo, sparkles, zero lag)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="${dim.w}"
         height="${dim.h}"
         viewBox="0 0 36 48">
      <defs>
        <!-- Radiant Golden Halo Aura -->
        <radialGradient id="goldAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fde047" stop-opacity="0.85"/>
          <stop offset="45%" stop-color="#f59e0b" stop-opacity="0.45"/>
          <stop offset="80%" stop-color="#d97706" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#d97706" stop-opacity="0"/>
        </radialGradient>
        <!-- Drop Shadow -->
        <filter id="goldPinShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" flood-color="#000000" flood-opacity="0.55"/>
        </filter>
      </defs>

      <!-- 1. Ambient Golden Halo Aura -->
      <ellipse cx="18" cy="18" rx="17" ry="17" fill="url(#goldAura)" />

      <!-- 2. Golden Dotted Orbit -->
      <circle cx="18" cy="18" r="14" fill="none" stroke="#fbbf24" stroke-width="1.2" stroke-opacity="0.7" stroke-dasharray="2 2" />

      <!-- 3. Elevated Pin Body with Gold Stroke -->
      <path
        d="M18 6 C11.4 6 6 11.4 6 18 C6 27.5 18 48 18 48 S30 27.5 30 18 C30 11.4 24.6 6 18 6 Z"
        fill="${safeColor}"
        stroke="#facc15"
        stroke-width="2.6"
        stroke-linejoin="round"
        filter="url(#goldPinShadow)"
      />

      <!-- 4. Inner White Bullseye -->
      <circle
        cx="18"
        cy="18"
        r="5.5"
        fill="#ffffff"
        stroke="#f59e0b"
        stroke-width="1.4"
      />

      <!-- 5. Golden Center Core -->
      <circle
        cx="18"
        cy="18"
        r="2.6"
        fill="#fbbf24"
      />

      <!-- 6. Diamond Sparkle Star (Top-Right) -->
      <path
        d="M 28 2 Q 28 6.5 32.5 6.5 Q 28 6.5 28 11 Q 28 6.5 23.5 6.5 Q 28 6.5 28 2 Z"
        fill="#ffffff"
        stroke="#f59e0b"
        stroke-width="0.8"
      />

      <!-- 7. Twinkle Sparkle (Top-Left) -->
      <path
        d="M 7.5 7.5 Q 7.5 10 10 10 Q 7.5 10 7.5 12.5 Q 7.5 10 5 10 Q 7.5 10 7.5 7.5 Z"
        fill="#fef08a"
        stroke="#d97706"
        stroke-width="0.6"
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

export function getCategoryIcon(category, customColors = null, size = "medium", isHighlighted = false) {
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

  const cacheKey = `${color}_${size}_${isHighlighted ? "hl" : "norm"}`;
  if (!iconCache.has(cacheKey)) {
    iconCache.set(cacheKey, isHighlighted ? createHighlightedIcon(color, size) : createIcon(color, size));
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