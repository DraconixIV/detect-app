import React from "react";
import { TACTICAL_MARKERS } from "../constants/tacticalMarkers";
import TacticalPinIcon from "./TacticalPinIcon";

/**
 * CategoryMarkerPicker
 * Visual gallery of the 42 proprietary tactical pins in large format (gros plan).
 * Displays pure shapes without imposing predetermined names or labels.
 */
export default function CategoryMarkerPicker({
  selectedMarkerId = "monnaie",
  onSelectMarker,
  currentColor = "#facc15",
  theme = "dark"
}) {
  const isLight = theme === "light";
  const bgCard = isLight ? "#ffffff" : "#131e18";
  const borderCard = isLight ? "#e5e7eb" : "rgba(255, 255, 255, 0.08)";
  const bgTile = isLight ? "#f9fafb" : "#18241e";
  const textTitle = isLight ? "#111827" : "#ffffff";
  const textSub = isLight ? "#6b7280" : "#9ca3af";

  return (
    <div className="space-y-3">
      {/* En-tête avec prévisualisation en gros plan du repère sélectionné */}
      <div
        className="flex items-center justify-between p-3 rounded-xl border"
        style={{
          backgroundColor: bgCard,
          borderColor: borderCard
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl flex items-center justify-center border shadow-md shrink-0"
            style={{
              backgroundColor: isLight ? "#f3f4f6" : "#0f1712",
              borderColor: currentColor || "#facc15"
            }}
          >
            {/* Gros plan sur l'icône active */}
            <TacticalPinIcon
              markerId={selectedMarkerId}
              color={currentColor}
              size={52}
            />
          </div>
          <div>
            <div className="text-xs font-normal" style={{ color: textTitle }}>
              Forme du repère sélectionnée
            </div>
            <p className="text-[11px] font-normal" style={{ color: textSub }}>
              Touchez la forme de votre choix ci-dessous pour l'associer à votre catégorie
            </p>
          </div>
        </div>
        <span
          className="text-[11px] px-2.5 py-1 rounded-full border font-normal shrink-0"
          style={{
            backgroundColor: isLight ? "#f3f4f6" : "rgba(255, 255, 255, 0.05)",
            borderColor: borderCard,
            color: textSub
          }}
        >
          42 formes
        </span>
      </div>

      {/* Grille de sélection en GROS PLAN : pures formes géométriques, sans aucun nom imposé */}
      <div
        className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2.5 max-h-72 overflow-y-auto p-3 rounded-xl border scrollbar-thin"
        style={{
          backgroundColor: bgCard,
          borderColor: borderCard
        }}
      >
        {TACTICAL_MARKERS.map((marker) => {
          const isSelected = selectedMarkerId === marker.id;
          return (
            <button
              key={marker.id}
              type="button"
              onClick={() => onSelectMarker(marker.id)}
              className="flex items-center justify-center min-h-[58px] p-2 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: isSelected
                  ? isLight
                    ? "rgba(44, 94, 76, 0.15)"
                    : "rgba(250, 204, 21, 0.15)"
                  : bgTile,
                border: isSelected
                  ? `2px solid ${currentColor || "#facc15"}`
                  : `1px solid ${borderCard}`,
                boxShadow: isSelected ? `0 0 10px ${currentColor}44` : "none"
              }}
            >
              {/* Repère en gros plan (44px de haut) sans aucun texte */}
              <TacticalPinIcon
                markerId={marker.id}
                color={currentColor}
                size={44}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
