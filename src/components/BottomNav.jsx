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
    {
      id: "map",
      label: "Carte",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
      )
    },
    {
      id: "gallery",
      label: "Galerie",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    },
    {
      id: "reports",
      label: "Journal",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      )
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 6500,
        background: "#0d1f18",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 12px env(safe-area-inset-bottom, 10px) 12px",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.35)",
        userSelect: "none"
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
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
              gap: "3px",
              padding: "4px 2px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
              color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.5)"
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3px 14px",
                borderRadius: "999px",
                background: isActive ? "rgba(44, 94, 76, 0.55)" : "transparent",
                transition: "all 0.2s ease"
              }}
            >
              {tab.icon}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "400",
                letterSpacing: "0.2px",
                color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.55)"
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
