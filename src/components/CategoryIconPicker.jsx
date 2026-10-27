import React, { useState, useMemo } from "react";
import { CATEGORY_ICONS, EMOJI_TO_ICON_ID } from "./CategoryIcon";

const THEME_TABS = [
  { id: "all", label: "Tous" },
  { id: "treasure", label: "Monnaies" },
  { id: "clothing", label: "Parure" },
  { id: "jewelry", label: "Bijoux" },
  { id: "militaria", label: "Militaria" },
  { id: "history", label: "Histoire" },
  { id: "tools", label: "Outils" },
  { id: "cleanup", label: "Dépollution" },
  { id: "symbols", label: "Symboles" }
];

export default function CategoryIconPicker({
  selectedIcon,
  onSelectIcon,
  categoryColor = "#2c5e4c",
  isDark = true,
  cardBg = "#19231e",
  cardBorder = "rgba(255, 255, 255, 0.08)",
  inputBg = "#111915",
  inputBorder = "rgba(255, 255, 255, 0.12)",
  textMain = "#f1f5f2",
  textSub = "#9aa8a0"
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const currentIconId = EMOJI_TO_ICON_ID[selectedIcon] || selectedIcon || "coin";

  const filteredIcons = useMemo(() => {
    const q = search.trim().toLowerCase();
    const entries = Object.entries(CATEGORY_ICONS);

    return entries.filter(([id, def]) => {
      // Tab filter
      if (activeTab !== "all" && def.category !== activeTab) {
        return false;
      }
      // Search filter
      if (q) {
        const matchesLabel = def.label.toLowerCase().includes(q);
        const matchesKeywords = def.keywords?.some((k) => k.toLowerCase().includes(q));
        const matchesId = id.toLowerCase().includes(q);
        return matchesLabel || matchesKeywords || matchesId;
      }
      return true;
    });
  }, [activeTab, search]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Search Input & Active Tab Filter */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une icône (clé, monnaie, boucle...)"
            style={{
              width: "100%",
              padding: "7px 28px 7px 10px",
              borderRadius: "8px",
              border: `1px solid ${inputBorder}`,
              background: inputBg,
              color: textMain,
              fontSize: "12px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: "6px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: textSub,
                cursor: "pointer",
                padding: "2px 4px",
                fontSize: "11px"
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Category Tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          overflowX: "auto",
          paddingBottom: "4px",
          scrollbarWidth: "none"
        }}
      >
        {THEME_TABS.map((tab) => {
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "4px 9px",
                borderRadius: "999px",
                border: "none",
                background: isSel ? (isDark ? "rgba(44, 94, 76, 0.35)" : "#2c5e4c") : "transparent",
                color: isSel ? (isDark ? "#80b99c" : "#ffffff") : textSub,
                fontSize: "11px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.12s ease"
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Icons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
          gap: "6px",
          maxHeight: "150px",
          overflowY: "auto",
          padding: "8px",
          background: inputBg,
          border: `1px solid ${inputBorder}`,
          borderRadius: "10px"
        }}
      >
        {filteredIcons.map(([id, def]) => {
          const isSelected = currentIconId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectIcon(id)}
              title={def.label}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: isSelected ? `2px solid ${categoryColor}` : `1px solid ${cardBorder}`,
                background: isSelected
                  ? (isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(44, 94, 76, 0.12)")
                  : (isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: "6px",
                boxSizing: "border-box",
                transition: "all 0.12s ease",
                transform: isSelected ? "scale(1.05)" : "scale(1)",
                boxShadow: isSelected ? `0 0 10px ${categoryColor}44` : "none"
              }}
            >
              <div style={{ width: "20px", height: "20px" }}>
                {def.svg(isSelected ? categoryColor : (isDark ? "#d1d5db" : "#4b5563"))}
              </div>
            </button>
          );
        })}

        {filteredIcons.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "16px 8px",
              color: textSub,
              fontSize: "12px"
            }}
          >
            Aucune icône trouvée pour « {search} »
          </div>
        )}
      </div>
    </div>
  );
}
