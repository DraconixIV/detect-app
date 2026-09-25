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

export function createHighlightedIcon(color, size = "medium") {
  const safeColor = color || "#3b82f6";
  const dim = SIZES[size] || SIZES.medium;
  const totalW = dim.w + 20;
  const totalH = dim.h + 20;
  const anchorX = totalW / 2;
  const anchorY = totalH - 4;

  const html = `
    <div style="position: relative; width: ${totalW}px; height: ${totalH}px; display: flex; justify-content: center; align-items: flex-end;">
      <!-- Glowing pulsing halo at pin tip -->
      <div style="
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 32px;
        height: 16px;
        border-radius: 50%;
        background: radial-gradient(ellipse, rgba(250, 204, 21, 0.95) 0%, rgba(250, 204, 21, 0) 70%);
        box-shadow: 0 0 16px 4px #facc15;
        animation: sortieGlowPulse 1.8s infinite ease-in-out;
        pointer-events: none;
      "></div>

      <!-- Elevated Pin with Golden Outline & Drop Shadow -->
      <div style="position: relative; width: ${dim.w}px; height: ${dim.h}px; margin-bottom: 4px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.6));">
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
            stroke="#facc15"
            stroke-width="2.6"
          />
          <circle
            cx="12.5"
            cy="12.5"
            r="5"
            fill="#ffffff"
            stroke="#facc15"
            stroke-width="1.5"
          />
        </svg>

        <!-- Sparkle Star on top right of the pin -->
        <span style="
          position: absolute;
          top: -9px;
          right: -9px;
          font-size: 14px;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.9));
        ">✨</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "highlighted-sortie-find-marker",
    iconSize: [totalW, totalH],
    iconAnchor: [anchorX, anchorY],
    popupAnchor: [0, -dim.h - 6]
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