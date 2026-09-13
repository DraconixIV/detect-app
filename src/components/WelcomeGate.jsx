import React, { useState, useEffect } from "react";
import { THEMES } from "../styles/themes";

export default function WelcomeGate({
  isOpen,
  onEnter,
  findsCount = 0,
  tracksCount = 0,
  isOnline = true,
  currentThemeKey = "tactical",
  theme = "dark"
}) {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(15);
  const activeTheme = THEMES[currentThemeKey] || THEMES.tactical;
  const c = activeTheme.colors;
  const isLight = theme === "light";

  useEffect(() => {
    if (!isOpen) return;

    // Simulate smooth asset & telemetry loading progression
    const timer1 = setTimeout(() => setProgress(45), 250);
    const timer2 = setTimeout(() => setProgress(80), 550);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setLoaded(true);
    }, 850);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: isLight ? "linear-gradient(145deg, #f8fafc, #e2e8f0)" : "radial-gradient(circle at center, #111827 0%, #030712 100%)",
        color: isLight ? "#0f172a" : "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "32px 20px env(safe-area-inset-bottom, 24px) 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxSizing: "border-box",
        userSelect: "none"
      }}
    >
      {/* Top Bar with Dev Skip Button */}
      <div style={{ width: "100%", maxWidth: "420px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isOnline ? "#10b981" : "#f59e0b" }} />
          <span style={{ fontSize: "11px", fontWeight: "700", color: isLight ? "#475569" : "#94a3b8" }}>
            {isOnline ? "En ligne & Synchronisé" : "Mode Hors Ligne"}
          </span>
        </div>

        {/* Developer Quick Bypass Button */}
        <button
          onClick={onEnter}
          style={{
            padding: "5px 10px",
            borderRadius: "8px",
            border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.15)",
            background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.08)",
            color: isLight ? "#2563eb" : "#facc15",
            fontSize: "10px",
            fontWeight: "800",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
          title="Bypass direct pour le développement"
        >
          <span>⚡ Dev Skip</span>
        </button>
      </div>

      {/* Center Branding & Telemetry Cards */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: "380px", width: "100%" }}>
        {/* Animated Radar/Compass Logo Badge */}
        <div
          style={{
            width: "88px",
            height: "88px",
            borderRadius: "26px",
            background: isLight ? "#ffffff" : `linear-gradient(135deg, #1e293b, #0f172a)`,
            border: `2px solid ${c.accent}`,
            boxShadow: `0 0 30px ${c.accent}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "44px",
            marginBottom: "16px",
            transform: "translateY(0px)",
            animation: "pulse 2s infinite ease-in-out"
          }}
        >
          🧭
        </div>

        <h1
          style={{
            margin: "0 0 4px 0",
            fontSize: "24px",
            fontWeight: "900",
            letterSpacing: "-0.5px",
            color: isLight ? "#0f172a" : "#ffffff"
          }}
        >
          RDL DETECT
        </h1>

        <div
          style={{
            fontSize: "11px",
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: c.accent,
            marginBottom: "20px"
          }}
        >
          {activeTheme.name} • Télémétrie de Terrain
        </div>

        {/* Progress bar */}
        <div style={{ width: "100%", marginBottom: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700", marginBottom: "6px", color: isLight ? "#475569" : "#94a3b8" }}>
            <span>{loaded ? "Données & Carte prêtes" : "Chargement des données & couches..."}</span>
            <span>{progress}%</span>
          </div>
          <div style={{ width: "100%", height: "6px", borderRadius: "3px", background: isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.1)", overflow: "hidden" }}>
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: "3px",
                background: `linear-gradient(90deg, ${c.accent}, #3b82f6)`,
                transition: "width 0.3s ease"
              }}
            />
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", width: "100%", marginBottom: "10px" }}>
          <div
            style={{
              background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
              border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "12px",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "16px" }}>📍</div>
            <div style={{ fontSize: "9px", color: isLight ? "#64748b" : "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Trouvailles</div>
            <div style={{ fontSize: "15px", fontWeight: "800", marginTop: "2px", color: isLight ? "#0f172a" : "#facc15" }}>{findsCount} enregistrées</div>
          </div>

          <div
            style={{
              background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
              border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "12px",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "16px" }}>🚶</div>
            <div style={{ fontSize: "9px", color: isLight ? "#64748b" : "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Parcours GPS</div>
            <div style={{ fontSize: "15px", fontWeight: "800", marginTop: "2px", color: isLight ? "#0f172a" : "#10b981" }}>{tracksCount} sorties</div>
          </div>
        </div>
      </div>

      {/* Big Action Entry Button */}
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <button
          onClick={onEnter}
          style={{
            width: "100%",
            padding: "16px 20px",
            borderRadius: "18px",
            border: "none",
            background: `linear-gradient(135deg, ${c.accent}, #2563eb)`,
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: "900",
            letterSpacing: "0.5px",
            cursor: "pointer",
            boxShadow: `0 8px 24px ${c.accent}50`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transform: loaded ? "scale(1.02)" : "scale(1)",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          <span>🚀</span>
          <span>ACCÉDER À L'APPLICATION</span>
          <span style={{ fontSize: "18px" }}>➔</span>
        </button>

        <p style={{ margin: "10px 0 0 0", textAlign: "center", fontSize: "10px", color: isLight ? "#64748b" : "#6b7280" }}>
          Carnet de détection privé & confidentiel • Données sécurisées
        </p>
      </div>
    </div>
  );
}
