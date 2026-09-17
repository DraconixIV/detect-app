import React from "react";
import { THEMES } from "../styles/themes";

export default function BottomNav({
  activeTab,
  setActiveTab,
  currentThemeKey = "tactical",
  zenMode = false
}) {
  const theme = THEMES[currentThemeKey] || THEMES.tactical;
  const c = theme.colors;

  if (zenMode) return null;

  const tabs = [
    { id: "map", label: "Carte", icon: "🗺️" },
    { id: "gallery", label: "Galerie", icon: "📷" },
    { id: "reports", label: "Journal", icon: "📊" },
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
        background: "rgba(11, 19, 41, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "6px 12px env(safe-area-inset-bottom, 8px) 12px",
        boxShadow: "0 -4px 24px rgba(0, 0, 0, 0.5)",
        userSelect: "none"
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            data-tab={tab.id}
            onClick={() => {
              if (activeTab === tab.id && tab.id !== "map") {
                setActiveTab("map");
              } else {
                setActiveTab(tab.id);
              }
            }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              padding: "6px 2px",
              border: "none",
              background: isActive ? "rgba(56, 189, 248, 0.14)" : "transparent",
              borderRadius: "14px",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              color: isActive ? "#38bdf8" : "#94a3b8"
            }}
          >
            <span
              style={{
                fontSize: "19px",
                transform: isActive ? "scale(1.12)" : "scale(1)",
                transition: "transform 0.2s ease"
              }}
            >
              {tab.icon}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: isActive ? "800" : "600",
                letterSpacing: "0.2px",
                color: "#ffffff",
                opacity: isActive ? 1 : 0.8
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
