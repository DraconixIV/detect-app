import React, { useState, useEffect } from "react";
import { THEMES } from "../styles/themes";
import { loadCategoriesData } from "../services/categoriesService";

export default function MapTopBar({
  currentThemeKey = "tactical",
  workspace = { mode: "personal" },
  gpsAccuracy,
  isOnline,
  isRecordingSortie,
  onToggleRecording,
  onOpenTeamSession,
  onToggleSearch,
  showSearch,
  search,
  setSearch,
  filters,
  toggleFilter,
  zenMode = false
}) {
  const [categoriesData, setCategoriesData] = useState(() => loadCategoriesData());

  useEffect(() => {
    const handleUpdate = () => setCategoriesData(loadCategoriesData());
    window.addEventListener("categories-updated", handleUpdate);
    return () => window.removeEventListener("categories-updated", handleUpdate);
  }, []);

  const theme = THEMES[currentThemeKey] || THEMES.tactical;
  const c = theme.colors;

  const getGpsStatusColor = () => {
    if (gpsAccuracy === null) return "#9ca3af";
    if (gpsAccuracy < 5) return "#10b981";
    if (gpsAccuracy < 15) return "#f59e0b";
    return "#ef4444";
  };

  if (zenMode) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5000,
        padding: "env(safe-area-inset-top, 8px) 12px 8px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        pointerEvents: "none",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        userSelect: "none"
      }}
    >
      {/* Top Glassmorphism Navigation Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          background: "rgba(11, 19, 41, 0.78)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "16px",
          padding: "6px 10px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.45)",
          pointerEvents: "auto"
        }}
      >
        {/* LEFT: Branding with Official Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              background: "#ebe3d3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              border: "1.5px solid rgba(245, 158, 11, 0.4)"
            }}
          >
            <img
              src="/icon-192.png"
              alt="GeoProspect Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "900",
                letterSpacing: "-0.3px",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "2px"
              }}
            >
              <span>Geo</span>
              <span style={{ color: "#38bdf8" }}>Prospect</span>
            </span>
            <span
              style={{
                fontSize: "9px",
                fontWeight: "700",
                color: isOnline ? "#34d399" : "#fbbf24",
                letterSpacing: "0.2px"
              }}
            >
              {isOnline ? "● Connecté" : "○ Hors-ligne"}
            </span>
          </div>
        </div>

        {/* CENTER: GPS Precision / Session Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(255, 255, 255, 0.06)",
            border: `1px solid ${workspace.mode === "session" ? "#10b981" : "rgba(255, 255, 255, 0.08)"}`,
            padding: "3px 8px",
            borderRadius: "999px"
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: workspace.mode === "session" ? "#10b981" : getGpsStatusColor(),
              boxShadow: `0 0 6px ${workspace.mode === "session" ? "#10b981" : getGpsStatusColor()}`
            }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: "800",
              fontFamily: "monospace",
              color: "#e2e8f0"
            }}
          >
            {workspace.mode === "session"
              ? `ÉQUIPE ${workspace.targetCode || ""}`
              : (gpsAccuracy === null ? "GPS..." : `±${gpsAccuracy.toFixed(0)}m`)}
          </span>
        </div>

        {/* RIGHT: Quick Tools (Search, Team, Rec Status) */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* Search / Filter Toggle */}
          <button
            onClick={onToggleSearch}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              border: `1px solid ${showSearch ? "#38bdf8" : "rgba(255,255,255,0.1)"}`,
              background: showSearch ? "rgba(56, 189, 248, 0.2)" : "rgba(255,255,255,0.06)",
              color: showSearch ? "#38bdf8" : "#cbd5e1",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease"
            }}
            title="Rechercher & Filtrer"
          >
            🔍
          </button>

          {/* Team Session Button */}
          {onOpenTeamSession && (
            <button
              onClick={onOpenTeamSession}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                border: `1px solid ${workspace.mode === "session" ? "#10b981" : "rgba(255,255,255,0.1)"}`,
                background: workspace.mode === "session" ? "rgba(16, 185, 129, 0.25)" : "rgba(255,255,255,0.06)",
                color: workspace.mode === "session" ? "#10b981" : "#cbd5e1",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease"
              }}
              title="Session d'Équipe"
            >
              👥
            </button>
          )}

          {/* Sortie REC Indicator / Trigger */}
          <button
            onClick={onToggleRecording}
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
              border: `1px solid ${isRecordingSortie ? "#ef4444" : "rgba(255,255,255,0.12)"}`,
              background: isRecordingSortie ? "rgba(239, 68, 68, 0.25)" : "rgba(255,255,255,0.06)",
              color: isRecordingSortie ? "#ef4444" : "#cbd5e1",
              fontSize: "10px",
              fontWeight: "900",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.15s ease"
            }}
            title={isRecordingSortie ? "Arrêter la sortie" : "Démarrer une sortie"}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: isRecordingSortie ? "#ef4444" : "#94a3b8",
                boxShadow: isRecordingSortie ? "0 0 8px #ef4444" : "none",
                animation: isRecordingSortie ? "pulse 1.2s infinite" : "none"
              }}
            />
            <span>{isRecordingSortie ? "REC" : "SORTIE"}</span>
          </button>
        </div>
      </div>

      {/* Expandable Search & Filter Bar */}
      {showSearch && (
        <div
          style={{
            background: "rgba(11, 19, 41, 0.9)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "14px",
            padding: "8px 12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            pointerEvents: "auto",
            animation: "fadeIn 0.2s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="text"
              placeholder="Rechercher une trouvaille..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "#ffffff",
                fontSize: "12px",
                outline: "none"
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(255,255,255,0.1)",
                  color: "#ffffff",
                  fontSize: "11px",
                  cursor: "pointer"
                }}
              >
                Effacer
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              paddingBottom: "2px",
              scrollbarWidth: "none"
            }}
          >
            {Object.keys(categoriesData.categories || {}).map((cat) => {
              const active = filters.includes(cat);
              const emoji = categoriesData.emojis?.[cat] || "";
              return (
                <button
                  key={cat}
                  onClick={() => toggleFilter(cat)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: `1px solid ${active ? "#38bdf8" : "rgba(255,255,255,0.1)"}`,
                    background: active ? "rgba(56, 189, 248, 0.2)" : "rgba(255,255,255,0.04)",
                    color: active ? "#ffffff" : "#94a3b8",
                    fontSize: "11px",
                    fontWeight: active ? "700" : "500",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {emoji} {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
