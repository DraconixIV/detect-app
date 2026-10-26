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
  hideAllFinds = false,
  setHideAllFinds,
  useClustering = false,
  setUseClustering,
  onAddFindClick,
  isRecordingSortie = false
}) {
  const bottomPos = zenMode ? "20px" : (isRecordingSortie ? "148px" : "84px");

  return (
    <div
      style={{
        position: "fixed",
        right: "14px",
        bottom: bottomPos,
        zIndex: 5100,
        display: "flex",
        flexDirection: zenMode ? "row" : "column",
        gap: "10px",
        alignItems: "center",
        transition: "bottom 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        userSelect: "none"
      }}
    >
      {/* 1. HIDE / SHOW ALL FINDS ON MAP TOGGLE (Visible in Zen Mode) */}
      {zenMode && setHideAllFinds && (
        <button
          onClick={() => setHideAllFinds(!hideAllFinds)}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: `1.5px solid ${hideAllFinds ? "#ef4444" : "rgba(255, 255, 255, 0.18)"}`,
            background: hideAllFinds ? "rgba(239, 68, 68, 0.85)" : "rgba(11, 19, 41, 0.82)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "#ffffff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: hideAllFinds ? "0 4px 20px rgba(239, 68, 68, 0.5)" : "0 4px 16px rgba(0, 0, 0, 0.45)",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
          title={hideAllFinds ? "Afficher les trouvailles sur la carte" : "Masquer toutes les trouvailles sur la carte"}
        >
          {hideAllFinds ? (
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          )}
        </button>
      )}

      {/* 2. CLUSTERING / GROUPING TOGGLE (In Zen Mode next to fullscreen) */}
      {zenMode && setUseClustering && (
        <button
          onClick={() => setUseClustering(!useClustering)}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: `1.5px solid ${useClustering ? "#38bdf8" : "rgba(255, 255, 255, 0.18)"}`,
            background: useClustering ? "rgba(14, 165, 233, 0.85)" : "rgba(11, 19, 41, 0.82)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "#ffffff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: useClustering ? "0 4px 20px rgba(56, 189, 248, 0.5)" : "0 4px 16px rgba(0, 0, 0, 0.45)",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
          title={useClustering ? "Désactiver le regroupement" : "Activer le regroupement"}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="3.5" />
            <circle cx="17" cy="8" r="3" />
            <circle cx="12" cy="17" r="3.5" />
          </svg>
        </button>
      )}

      {/* 3. ZEN MODE / FULLSCREEN TOGGLE (Always visible) */}
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
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: zenMode ? "0 4px 20px rgba(56, 189, 248, 0.5)" : "0 4px 16px rgba(0, 0, 0, 0.45)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        title={zenMode ? "Quitter le mode plein écran" : "Mode plein écran (masquer l'interface)"}
      >
        {zenMode ? (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        )}
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
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.45)",
              position: "relative",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            title="Couches cartographiques et cadastre"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
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
                  fontWeight: "400",
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
            type="button"
            onClick={onRecenterGps}
            data-testid="recenter-gps-btn"
            aria-label="Recentrer GPS"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1.5px solid rgba(255, 255, 255, 0.18)",
              background: "rgba(11, 19, 41, 0.82)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.45)",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            title={
              isLocatingGps
                ? "Recherche satellite GPS en cours..."
                : (followGps
                    ? `Suivi GPS actif${gpsAccuracy ? ` (précision ±${Math.round(gpsAccuracy)}m)` : ""}`
                    : "Recentrer sur ma position GPS exacte")
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="7" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
            </svg>
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
              fontWeight: "400",
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
