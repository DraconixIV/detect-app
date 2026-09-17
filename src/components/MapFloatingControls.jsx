import React from "react";

export default function MapFloatingControls({
  onRecenterGps,
  followGps,
  isLocatingGps = false,
  gpsAccuracy = null,
  onOpenMapLayers,
  activeLayersCount = 0,
  zenMode,
  setZenMode,
  onAddFindClick
}) {
  return (
    <div
      style={{
        position: "fixed",
        right: "14px",
        bottom: zenMode ? "20px" : "84px",
        zIndex: 5100,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
        transition: "bottom 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        userSelect: "none"
      }}
    >
      {/* 1. ZEN MODE / FULLSCREEN TOGGLE (Always visible) */}
      <button
        onClick={() => setZenMode(!zenMode)}
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: `1.5px solid ${zenMode ? "#38bdf8" : "rgba(255, 255, 255, 0.18)"}`,
          background: zenMode ? "rgba(14, 165, 233, 0.9)" : "rgba(11, 19, 41, 0.82)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          color: "#ffffff",
          fontSize: "18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: zenMode ? "0 4px 20px rgba(56, 189, 248, 0.5)" : "0 4px 16px rgba(0, 0, 0, 0.45)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        title={zenMode ? "Quitter le mode Plein Écran Zen" : "Mode Plein Écran Zen (Masquer l'interface)"}
      >
        {zenMode ? "👁️" : "🔭"}
      </button>

      {/* When in Zen mode, other controls are hidden to give 100% clean view */}
      {!zenMode && (
        <>
          {/* 2. MAP LAYERS & CADASTRE / CASSINI MODAL TRIGGER */}
          <button
            onClick={onOpenMapLayers}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: `1.5px solid ${activeLayersCount > 0 ? "#f59e0b" : "rgba(255, 255, 255, 0.18)"}`,
              background: activeLayersCount > 0 ? "rgba(245, 158, 11, 0.25)" : "rgba(11, 19, 41, 0.82)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: activeLayersCount > 0 ? "#fbbf24" : "#ffffff",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.45)",
              position: "relative",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            title="Couches Cartographiques et Cadastre"
          >
            🗺️
            {activeLayersCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "#f59e0b",
                  color: "#000000",
                  fontSize: "10px",
                  fontWeight: "900",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)"
                }}
              >
                {activeLayersCount}
              </span>
            )}
          </button>

          {/* 3. RECENTER & FOLLOW GPS */}
          <button
            onClick={onRecenterGps}
            data-testid="recenter-gps-btn"
            aria-label="Recentrer GPS"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: `1.5px solid ${isLocatingGps ? "#38bdf8" : (followGps ? "#10b981" : "rgba(255, 255, 255, 0.18)")}`,
              background: isLocatingGps
                ? "rgba(14, 165, 233, 0.3)"
                : (followGps ? "rgba(16, 185, 129, 0.25)" : "rgba(11, 19, 41, 0.82)"),
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: isLocatingGps ? "#38bdf8" : (followGps ? "#34d399" : "#ffffff"),
              fontSize: "19px",
              cursor: isLocatingGps ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isLocatingGps
                ? "0 0 16px rgba(56, 189, 248, 0.6)"
                : (followGps ? "0 0 16px rgba(16, 185, 129, 0.4)" : "0 4px 16px rgba(0, 0, 0, 0.45)"),
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            title={
              isLocatingGps
                ? "Recherche satellite GPS en cours..."
                : (followGps
                    ? `Suivi GPS Actif${gpsAccuracy ? ` (Précision ±${Math.round(gpsAccuracy)}m)` : ""}`
                    : "Recentrer sur ma position GPS exacte")
            }
          >
            {isLocatingGps ? "🛰️" : "🎯"}
          </button>

          {/* 4. QUICK ADD FIND FLOATING ACTION BUTTON */}
          <button
            onClick={onAddFindClick}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#ffffff",
              fontSize: "24px",
              fontWeight: "900",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 22px rgba(37, 99, 235, 0.6), 0 0 0 1px rgba(255,255,255,0.2) inset",
              marginTop: "4px",
              transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            title="Ajouter une nouvelle trouvaille"
          >
            +
          </button>
        </>
      )}
    </div>
  );
}
