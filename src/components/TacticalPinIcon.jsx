import React from "react";
import { TACTICAL_MARKERS_BY_ID, resolveMarkerId } from "../constants/tacticalMarkers";

/**
 * TacticalPinIcon
 * Lightweight vector React component rendering the GeoProspect tactical pin.
 *
 * @param {string} markerId - Tactical marker ID or legacy emoji
 * @param {string} color - Hex color for outer contour stroke
 * @param {string} size - 'sm' (20x26), 'md' (26x34), 'lg' (34x44), 'xl' (40x52) or numeric px height
 * @param {string} categoryName - Optional category name for fallback resolution
 * @param {string} className - Optional Tailwind or CSS class
 */
export default function TacticalPinIcon({
  markerId,
  color = "#facc15",
  size = "md",
  categoryName = "",
  className = "",
  style = {}
}) {
  const resolvedId = resolveMarkerId(markerId, categoryName);
  const marker = TACTICAL_MARKERS_BY_ID[resolvedId] || TACTICAL_MARKERS_BY_ID.autre;
  const safeColor = color || "#facc15";

  let w = 26;
  let h = 34;

  if (size === "xs") {
    w = 16;
    h = 21;
  } else if (size === "sm") {
    w = 20;
    h = 26;
  } else if (size === "md") {
    w = 26;
    h = 34;
  } else if (size === "lg") {
    w = 34;
    h = 44;
  } else if (size === "xl") {
    w = 40;
    h = 52;
  } else if (typeof size === "number") {
    h = size;
    w = Math.round((size * 36) / 46);
  }

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 36 46"
      fill="none"
      className={`inline-block shrink-0 select-none ${className}`}
      style={style}
      aria-label={marker.label}
    >
      <path
        d="M18 2C8.6 2 1 9.6 1 19c0 10.5 14 24 17 26 3-2 17-15.5 17-26 0-9.4-7.6-17-17-17z"
        fill="#242c26"
        stroke={safeColor}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <g dangerouslySetInnerHTML={{ __html: marker.svgInner }} />
    </svg>
  );
}
