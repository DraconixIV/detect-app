import React, { useState } from "react";

export default function SortieLiveWidget({
  isRecordingSortie,
  isSortiePaused = false,
  onTogglePauseSortie = null,
  sortieDistance = 0,
  elapsedSeconds = 0,
  sortieFindsCount = 0,
  todayFindsCount = 0,
  onStopSortie,
  zenMode = false,
  showLiveSortieTrack = true,
  onToggleShowTrack
}) {
  const [collapsed, setCollapsed] = useState(false);
  const displayFindsCount = typeof sortieFindsCount === "number" ? sortieFindsCount : todayFindsCount;

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
        borderRadius: "16px",
        padding: collapsed ? "6px 12px" : "6px 8px",
        boxShadow: isSortiePaused 
          ? "0 8px 32px rgba(0, 0, 0, 0.55), 0 0 20px rgba(245, 158, 11, 0.25)"
          : "0 8px 32px rgba(0, 0, 0, 0.55), 0 0 20px rgba(239, 68, 68, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        userSelect: "none",
        width: "max-content",
        maxWidth: "calc(100vw - 12px)",
        boxSizing: "border-box",
        whiteSpace: "nowrap",
        transition: "border 0.25s ease, box-shadow 0.25s ease"
      }}
    >
      {/* Recording Pulsing / Pause Indicator */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          flexShrink: 0
        }}
        title={collapsed ? "Agrandir le bandeau" : "Réduire le bandeau"}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: isSortiePaused ? "#f59e0b" : "#ef4444",
            boxShadow: isSortiePaused ? "0 0 8px #f59e0b" : "0 0 8px #ef4444",
            animation: isSortiePaused ? "none" : "pulse 1.2s infinite",
            flexShrink: 0
          }}
        />
        <span
          style={{
            fontSize: "11px",
            fontWeight: "400",
            fontFamily: "monospace",
            color: isSortiePaused ? "#fbbf24" : "#f87171",
            letterSpacing: "0.3px"
          }}
        >
          {formatTime(elapsedSeconds)}
        </span>
      </div>

      {!collapsed && (
        <>
          {/* Divider */}
          <div style={{ width: "1px", height: "16px", background: "rgba(255, 255, 255, 0.15)", flexShrink: 0 }} />

          {/* Metrics : Distance & Finds */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: "7px", fontWeight: "400", color: "#94a3b8", textTransform: "uppercase", lineHeight: "1" }}>
                Distance
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "400", color: "#38bdf8", fontFamily: "monospace", marginTop: "1px" }}>
                {formatDistance(sortieDistance)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "7px", fontWeight: "400", color: "#94a3b8", textTransform: "uppercase", lineHeight: "1" }}>
                Cibles
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "400", color: "#fbbf24", fontFamily: "monospace", marginTop: "1px" }}>
                {displayFindsCount}
              </div>
            </div>
          </div>

          {/* Toggle Live Track Visibility Button */}
          {onToggleShowTrack && (
            <button
              type="button"
              onClick={onToggleShowTrack}
              style={{
                padding: "4px 6px",
                borderRadius: "8px",
                border: showLiveSortieTrack
                  ? "1px solid rgba(6, 182, 212, 0.45)"
                  : "1px solid rgba(148, 163, 184, 0.2)",
                background: showLiveSortieTrack
                  ? "rgba(6, 182, 212, 0.15)"
                  : "rgba(15, 23, 42, 0.65)",
                color: showLiveSortieTrack ? "#22d3ee" : "#94a3b8",
                fontSize: "10px",
                fontWeight: "400",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                flexShrink: 0,
                transition: "all 0.15s ease"
              }}
              title={showLiveSortieTrack ? "Masquer mon tracé sur la carte" : "Afficher mon tracé sur la carte"}
            >
              <span style={{ fontSize: "11px", display: "inline-flex", alignItems: "center" }}>
                {showLiveSortieTrack ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                )}
              </span>
              <span style={{ fontSize: "9px" }}>
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
                padding: "4px 6px",
                minWidth: "64px",
                borderRadius: "8px",
                border: isSortiePaused
                  ? "1px solid rgba(16, 185, 129, 0.6)"
                  : "1px solid rgba(245, 158, 11, 0.4)",
                background: isSortiePaused
                  ? "rgba(16, 185, 129, 0.22)"
                  : "rgba(245, 158, 11, 0.16)",
                color: isSortiePaused ? "#34d399" : "#fbbf24",
                fontSize: "10px",
                fontWeight: "400",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                flexShrink: 0,
                transition: "all 0.15s ease"
              }}
              title={isSortiePaused ? "Reprendre l'enregistrement de la sortie" : "Mettre en pause la sortie"}
            >
              <span style={{ fontSize: "11px", display: "inline-flex", alignItems: "center" }}>
                {isSortiePaused ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                )}
              </span>
              <span style={{ fontSize: "9px" }}>
                {isSortiePaused ? "Reprendre" : "Pause"}
              </span>
            </button>
          )}

          {/* Stop Button */}
          <button
            type="button"
            onClick={onStopSortie}
            style={{
              padding: "4px 7px",
              borderRadius: "8px",
              border: "1px solid rgba(239, 68, 68, 0.5)",
              background: "rgba(239, 68, 68, 0.2)",
              color: "#fca5a5",
              fontSize: "10px",
              fontWeight: "400",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "3px",
              flexShrink: 0,
              transition: "all 0.15s ease"
            }}
            title="Terminer et enregistrer la sortie"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
            <span style={{ fontSize: "9px" }}>Fin</span>
          </button>
        </>
      )}
    </div>
  );
}
