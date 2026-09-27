import React, { useState } from "react";

export default function SortieLiveWidget({
  isRecordingSortie,
  isSortiePaused = false,
  onTogglePauseSortie = null,
  sortieDistance = 0,
  elapsedSeconds = 0,
  todayFindsCount = 0,
  onStopSortie,
  zenMode = false,
  showLiveSortieTrack = true,
  onToggleShowTrack
}) {
  const [collapsed, setCollapsed] = useState(false);

  if (!isRecordingSortie || zenMode) return null;

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const formatDistance = (meters) => {
    if (!meters || meters === 0) return "0 m";
    if (meters < 1000) return `${meters.toFixed(0)} m`;
    return `${(meters / 1000).toFixed(2)} km`;
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "84px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5100,
        background: "rgba(11, 19, 41, 0.94)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: isSortiePaused ? "1px solid rgba(245, 158, 11, 0.55)" : "1px solid rgba(239, 68, 68, 0.4)",
        borderRadius: "18px",
        padding: collapsed ? "6px 12px" : "8px 10px",
        boxShadow: isSortiePaused 
          ? "0 8px 32px rgba(0, 0, 0, 0.55), 0 0 20px rgba(245, 158, 11, 0.25)"
          : "0 8px 32px rgba(0, 0, 0, 0.55), 0 0 20px rgba(239, 68, 68, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        userSelect: "none",
        width: "max-content",
        maxWidth: "calc(100vw - 20px)",
        boxSizing: "border-box",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      {/* Recording Pulsing / Pause Indicator */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          cursor: "pointer",
          flexShrink: 0
        }}
        title={collapsed ? "Agrandir le widget" : "Réduire le widget"}
      >
        <span
          style={{
            width: "9px",
            height: "9px",
            borderRadius: "50%",
            background: isSortiePaused ? "#f59e0b" : "#ef4444",
            boxShadow: isSortiePaused ? "0 0 10px #f59e0b" : "0 0 10px #ef4444",
            animation: isSortiePaused ? "none" : "pulse 1.2s infinite",
            flexShrink: 0
          }}
        />
        <span
          style={{
            fontSize: "11.5px",
            fontWeight: "900",
            fontFamily: "monospace",
            color: isSortiePaused ? "#fbbf24" : "#f87171",
            letterSpacing: "0.5px"
          }}
        >
          {formatTime(elapsedSeconds)}
        </span>
        {isSortiePaused && (
          <span
            style={{
              fontSize: "8.5px",
              fontWeight: "900",
              background: "rgba(245, 158, 11, 0.25)",
              color: "#fbbf24",
              padding: "1px 4px",
              borderRadius: "5px",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              textTransform: "uppercase"
            }}
          >
            Pause
          </span>
        )}
      </div>

      {!collapsed && (
        <>
          {/* Divider */}
          <div style={{ width: "1px", height: "20px", background: "rgba(255, 255, 255, 0.15)", flexShrink: 0 }} />

          {/* Metrics : Distance & Finds */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: "7.5px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", lineHeight: "1" }}>
                Distance
              </div>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#38bdf8", fontFamily: "monospace", marginTop: "1px" }}>
                {formatDistance(sortieDistance)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "7.5px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", lineHeight: "1" }}>
                Cibles
              </div>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#fbbf24", fontFamily: "monospace", marginTop: "1px" }}>
                {todayFindsCount}
              </div>
            </div>
          </div>

          {/* Toggle Live Track Visibility Button */}
          {onToggleShowTrack && (
            <button
              type="button"
              onClick={onToggleShowTrack}
              style={{
                padding: "5px 7px",
                borderRadius: "9px",
                border: showLiveSortieTrack
                  ? "1px solid rgba(6, 182, 212, 0.45)"
                  : "1px solid rgba(148, 163, 184, 0.2)",
                background: showLiveSortieTrack
                  ? "rgba(6, 182, 212, 0.15)"
                  : "rgba(15, 23, 42, 0.65)",
                color: showLiveSortieTrack ? "#22d3ee" : "#94a3b8",
                fontSize: "10.5px",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                flexShrink: 0,
                transition: "all 0.15s ease"
              }}
              title={showLiveSortieTrack ? "Masquer mon tracé sur la carte" : "Afficher mon tracé sur la carte"}
            >
              <span style={{ fontSize: "11px" }}>
                {showLiveSortieTrack ? "👁️" : "🙈"}
              </span>
              <span style={{ fontSize: "9.5px" }}>
                {showLiveSortieTrack ? "Tracé" : "Masqué"}
              </span>
            </button>
          )}

          {/* Pause / Resume Button */}
          {onTogglePauseSortie && (
            <button
              type="button"
              onClick={onTogglePauseSortie}
              style={{
                padding: "5px 8px",
                borderRadius: "9px",
                border: isSortiePaused
                  ? "1px solid rgba(16, 185, 129, 0.6)"
                  : "1px solid rgba(245, 158, 11, 0.4)",
                background: isSortiePaused
                  ? "rgba(16, 185, 129, 0.22)"
                  : "rgba(245, 158, 11, 0.16)",
                color: isSortiePaused ? "#34d399" : "#fbbf24",
                fontSize: "10.5px",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                flexShrink: 0,
                transition: "all 0.15s ease"
              }}
              title={isSortiePaused ? "Reprendre l'enregistrement de la sortie" : "Mettre en pause la sortie"}
            >
              <span style={{ fontSize: "11px" }}>
                {isSortiePaused ? "▶️" : "⏸️"}
              </span>
              <span style={{ fontSize: "9.5px" }}>
                {isSortiePaused ? "Reprendre" : "Pause"}
              </span>
            </button>
          )}

          {/* Stop Button */}
          <button
            onClick={onStopSortie}
            style={{
              padding: "5px 9px",
              borderRadius: "9px",
              border: "1px solid rgba(239, 68, 68, 0.5)",
              background: "rgba(239, 68, 68, 0.2)",
              color: "#fca5a5",
              fontSize: "10.5px",
              fontWeight: "800",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "3px",
              flexShrink: 0,
              transition: "all 0.15s ease"
            }}
            title="Terminer et enregistrer la sortie"
          >
            <span>⏹</span>
            <span>Fin</span>
          </button>
        </>
      )}
    </div>
  );
}
