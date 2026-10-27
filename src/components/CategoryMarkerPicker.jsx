import React from "react";
import { TACTICAL_MARKERS } from "../constants/tacticalMarkers";
import TacticalPinIcon from "./TacticalPinIcon";

/**
 * CategoryMarkerPicker
 * Ultra-clean visual gallery of tactical pins in large format (gros plan).
 * Displays pure shapes without imposing predetermined names, labels or verbose text.
 */
export default function CategoryMarkerPicker({
  selectedMarkerId = "monnaie",
  onSelectMarker,
  currentColor = "#facc15",
  theme = "dark"
}) {
  const isLight = theme === "light";
  const bgTile = isLight ? "#f1f3f1" : "rgba(255, 255, 255, 0.04)";
  const borderTile = isLight ? "#e5e7eb" : "rgba(255, 255, 255, 0.07)";
  const textSub = isLight ? "#64748b" : "#94a3b8";
  const activeColor = currentColor || "#facc15";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* En-tête compact et raffiné avec prévisualisation en direct */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          borderRadius: "12px",
          background: isLight ? "#f8faf9" : "rgba(255, 255, 255, 0.03)",
          border: `1px solid ${borderTile}`
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: "400",
            color: textSub,
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          Repère sélectionné
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px 10px",
            borderRadius: "10px",
            background: isLight ? "#ffffff" : "rgba(0, 0, 0, 0.35)",
            border: `1.5px solid ${activeColor}`,
            boxShadow: `0 0 14px ${activeColor}40`,
            transition: "all 0.2s ease"
          }}
        >
          <TacticalPinIcon
            markerId={selectedMarkerId}
            color={activeColor}
            size={34}
          />
        </div>
      </div>

      {/* Grille des repères visuels : pures formes en gros plan, aérées et contrastées */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "8px",
          maxHeight: "220px",
          overflowY: "auto",
          padding: "10px",
          borderRadius: "14px",
          background: isLight ? "#fbfbfa" : "#101914",
          border: `1px solid ${borderTile}`,
          boxSizing: "border-box"
        }}
        className="scrollbar-thin"
      >
        {TACTICAL_MARKERS.map((marker) => {
          const isSelected = selectedMarkerId === marker.id;
          const pinColor = isSelected
            ? activeColor
            : isLight
            ? "#94a3b8"
            : "rgba(255, 255, 255, 0.4)";

          return (
            <button
              key={marker.id}
              type="button"
              onClick={() => onSelectMarker(marker.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 2px",
                minHeight: "50px",
                borderRadius: "12px",
                background: isSelected
                  ? isLight
                    ? "rgba(44, 94, 76, 0.12)"
                    : `${activeColor}18`
                  : bgTile,
                border: isSelected
                  ? `2px solid ${activeColor}`
                  : `1px solid ${borderTile}`,
                boxShadow: isSelected
                  ? `0 0 14px ${activeColor}44`
                  : "none",
                transform: isSelected ? "scale(1.08)" : "scale(1)",
                cursor: "pointer",
                outline: "none",
                transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              <TacticalPinIcon
                markerId={marker.id}
                color={pinColor}
                size={34}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
