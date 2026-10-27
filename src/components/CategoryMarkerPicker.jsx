import React, { useState, useMemo } from "react";
import { TACTICAL_MARKERS } from "../constants/tacticalMarkers";
import TacticalPinIcon from "./TacticalPinIcon";

/**
 * CategoryMarkerPicker
 * Pokédex-style tactical marker grid selector.
 * Allows picking any of the 42 official tactical markers with live color preview.
 */
export default function CategoryMarkerPicker({
  selectedMarkerId = "monnaie",
  onSelectMarker,
  currentColor = "#facc15",
  theme = "dark"
}) {
  const [search, setSearch] = useState("");

  const filteredMarkers = useMemo(() => {
    if (!search.trim()) return TACTICAL_MARKERS;
    const q = search.toLowerCase().trim();
    return TACTICAL_MARKERS.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.keywords.some((k) => k.includes(q))
    );
  }, [search]);

  const isLight = theme === "light";
  const bgCard = isLight ? "#ffffff" : "#131e18";
  const borderCard = isLight ? "#e5e7eb" : "rgba(255, 255, 255, 0.08)";
  const textTitle = isLight ? "#111827" : "#ffffff";
  const textSub = isLight ? "#6b7280" : "#9ca3af";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-normal" style={{ color: textTitle }}>
            Icône du repère ({filteredMarkers.length} disponibles)
          </label>
          <p className="text-[11px] font-normal" style={{ color: textSub }}>
            Choisissez le visuel tactique associé à votre cible
          </p>
        </div>
        <div className="w-32">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer..."
            className="w-full text-xs px-2.5 py-1 rounded-md border outline-none font-normal"
            style={{
              backgroundColor: isLight ? "#f3f4f6" : "#0e1612",
              borderColor: borderCard,
              color: textTitle
            }}
          />
        </div>
      </div>

      <div
        className="grid grid-cols-6 sm:grid-cols-7 gap-2 max-h-48 overflow-y-auto p-2 rounded-xl border scrollbar-thin"
        style={{
          backgroundColor: bgCard,
          borderColor: borderCard
        }}
      >
        {filteredMarkers.map((marker) => {
          const isSelected = selectedMarkerId === marker.id;
          return (
            <button
              key={marker.id}
              type="button"
              onClick={() => onSelectMarker(marker.id)}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg transition-all hover:scale-105"
              style={{
                backgroundColor: isSelected
                  ? isLight
                    ? "#e0e7ff"
                    : "rgba(250, 204, 21, 0.15)"
                  : "transparent",
                border: isSelected
                  ? `2px solid ${currentColor || "#facc15"}`
                  : `1px solid ${borderCard}`
              }}
              title={marker.label}
            >
              <TacticalPinIcon
                markerId={marker.id}
                color={currentColor}
                size={28}
              />
              <span
                className="text-[9px] mt-1 truncate w-full text-center font-normal"
                style={{ color: isSelected ? textTitle : textSub }}
              >
                {marker.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
