import React from "react";

export default function BottomNav({ activeTab, setActiveTab }) {
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
        background: "rgba(15, 23, 42, 0.92)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "6px 8px env(safe-area-inset-bottom, 8px) 8px",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.4)",
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
              background: isActive ? "rgba(255, 255, 255, 0.08)" : "transparent",
              borderRadius: "14px",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              color: isActive ? "#facc15" : "rgba(255, 255, 255, 0.65)"
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
