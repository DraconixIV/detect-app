import React from "react";
import { THEMES } from "../styles/themes";

export default function BottomNav({ activeTab, setActiveTab, currentThemeKey = "tactical" }) {
  const theme = THEMES[currentThemeKey] || THEMES.tactical;
  const c = theme.colors;

  const tabs = [
    { id: "map", label: "Carte", icon: "🗺️" },
    { id: "gallery", label: "Galerie", icon: "🖼️" },
    { id: "reports", label: "Rapports", icon: "📊" },
    { id: "shortcuts", label: "Raccourcis", icon: "⚡" },
    { id: "settings", label: "Paramètres", icon: "⚙️" }
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 6500,
        background: c.hudBg,
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${c.border}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "6px 8px env(safe-area-inset-bottom, 8px) 8px",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.5)",
        userSelect: "none"
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              padding: "6px 2px",
              border: "none",
              background: isActive ? `${c.accent}20` : "transparent",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              color: isActive ? c.accent : c.textSecondary
            }}
          >
            <span
              style={{
                fontSize: "18px",
                transform: isActive ? "scale(1.15)" : "scale(1)",
                transition: "transform 0.2s ease"
              }}
            >
              {tab.icon}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: isActive ? "800" : "600",
                letterSpacing: "0.2px"
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
