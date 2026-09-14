import React, { useState, useEffect } from "react";
import { THEMES } from "../styles/themes";

export default function TacticalBottomHUD({
  currentThemeKey = "tactical",
  isRecordingSortie,
  sortieDistance = 0,
  todayFindsCount = 0,
  onStartSortie,
  onStopSortie,
  onAddFindClick,
  onOpenMapLayers,
  activeLayersCount = 0,
  onToggleCassini,
  showCassini,
  onRecenterGps,
  followGps
}) {
  const theme = THEMES[currentThemeKey] || THEMES.tactical;
  const c = theme.colors;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let timer = null;
    if (isRecordingSortie) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecordingSortie]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const formatDistance = (meters) => {
    if (!meters || meters === 0) return "0.00 m";
    if (meters < 1000) return `${meters.toFixed(1)} m`;
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const hasActiveLayers = activeLayersCount > 0 || showCassini;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "60px", // right above BottomNav
        left: 0,
        right: 0,
        zIndex: 5100,
        background: c.hudBg,
        borderTop: `2px solid ${c.hudBorder}`,
        boxShadow: "0 -6px 24px rgba(0, 0, 0, 0.6)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        userSelect: "none",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* 1. TOP TELEMETRY INSTRUMENT BAR (Go Terrain style split dashboard) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1.2fr",
          background: c.telemetryBg,
          borderBottom: `1px solid ${c.border}`,
          padding: "6px 8px",
          textAlign: "center",
          alignItems: "center"
        }}
      >
        {/* Chrono / Durée */}
        <div style={{ borderRight: `1px solid ${c.border}`, padding: "2px 4px" }}>
          <div style={{ fontSize: "9px", color: c.textSecondary, fontWeight: "700", textTransform: "uppercase" }}>
            ⏱️ Durée
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "900",
              fontFamily: "monospace",
              color: isRecordingSortie ? c.accentSecondary : c.telemetryText,
              letterSpacing: "0.5px"
            }}
          >
            {formatTime(elapsedSeconds)}
          </div>
        </div>

        {/* Compteur de Cibles */}
        <div style={{ borderRight: `1px solid ${c.border}`, padding: "2px 4px" }}>
          <div style={{ fontSize: "9px", color: c.textSecondary, fontWeight: "700", textTransform: "uppercase" }}>
            🪙 Cibles
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "900",
              fontFamily: "monospace",
              color: todayFindsCount > 0 ? c.accent : c.telemetryText
            }}
          >
            {todayFindsCount} {todayFindsCount > 1 ? "Cibles" : "Cible"}
          </div>
        </div>

        {/* Distance parcourue */}
        <div style={{ padding: "2px 4px" }}>
          <div style={{ fontSize: "9px", color: c.textSecondary, fontWeight: "700", textTransform: "uppercase" }}>
            📍 Distance
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "900",
              fontFamily: "monospace",
              color: c.telemetryText,
              letterSpacing: "0.5px"
            }}
          >
            {formatDistance(sortieDistance)}
          </div>
        </div>
      </div>

      {/* 2. TACTICAL ACTION BAR (Large physical-like tactile buttons) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr 1fr 1fr",
          gap: "6px",
          padding: "8px 10px",
          background: c.hudBg,
          alignItems: "center"
        }}
      >
        {/* Button 1: Sortie Recorder Play/Stop */}
        <button
          onClick={isRecordingSortie ? onStopSortie : onStartSortie}
          style={{
            padding: "10px 4px",
            borderRadius: "10px",
            border: `1px solid ${isRecordingSortie ? c.accent : c.border}`,
            background: isRecordingSortie ? `${c.accent}25` : c.buttonBg,
            color: isRecordingSortie ? c.accent : c.textPrimary,
            fontSize: "11px",
            fontWeight: "800",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            transition: "all 0.15s ease"
          }}
        >
          <span style={{ fontSize: "16px" }}>{isRecordingSortie ? "⏹" : "▶"}</span>
          <span>{isRecordingSortie ? "Fin Sortie" : "Démarrer"}</span>
        </button>

        {/* Button 2 (Big Center Action): + AJOUT TROUVAILLE */}
        <button
          onClick={onAddFindClick}
          style={{
            padding: "10px 8px",
            borderRadius: "12px",
            border: `2px solid rgba(255,255,255,0.25)`,
            background: `linear-gradient(135deg, ${c.accent}, ${c.accentHover})`,
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: "900",
            letterSpacing: "0.5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            boxShadow: `0 4px 14px ${c.accent}66`,
            transform: "translateY(-1px)",
            transition: "all 0.15s ease"
          }}
        >
          <span style={{ fontSize: "18px" }}>📍+</span>
          <span>CIBLE</span>
        </button>

        {/* Button 3: Cartes & Couches IGN / Cadastre / Cassini */}
        <button
          onClick={onOpenMapLayers || onToggleCassini}
          style={{
            padding: "10px 4px",
            borderRadius: "10px",
            border: `1px solid ${hasActiveLayers ? c.accentSecondary : c.border}`,
            background: hasActiveLayers ? `${c.accentSecondary}25` : c.buttonBg,
            color: hasActiveLayers ? c.accentSecondary : c.textPrimary,
            fontSize: "11px",
            fontWeight: "800",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            transition: "all 0.15s ease"
          }}
        >
          <span style={{ fontSize: "16px" }}>🥞</span>
          <span>{activeLayersCount > 0 ? `Couches (${activeLayersCount})` : "Couches"}</span>
        </button>

        {/* Button 4: Recenter GPS */}
        <button
          onClick={onRecenterGps}
          style={{
            padding: "10px 4px",
            borderRadius: "10px",
            border: `1px solid ${followGps ? c.badgeGps : c.border}`,
            background: followGps ? `${c.badgeGps}25` : c.buttonBg,
            color: followGps ? c.badgeGps : c.textPrimary,
            fontSize: "11px",
            fontWeight: "800",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            transition: "all 0.15s ease"
          }}
        >
          <span style={{ fontSize: "16px" }}>🎯</span>
          <span>{followGps ? "Suivi GPS" : "Centrer"}</span>
        </button>
      </div>
    </div>
  );
}
