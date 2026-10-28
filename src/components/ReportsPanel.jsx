import React from "react";
import StatsPanel from "./StatsPanel";

export default function ReportsPanel({
  finds = [],
  savedTracks = [],
  exportData,
  importData,
  setSelectedDate,
  onClose,
  theme = "dark",
  onOpenCategoryManager,
  onDeleteTrack,
  onDeleteFind
}) {
  const isLight = theme === "light";
  const bgPage = isLight ? "#f3f4f2" : "#111915";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";

  return (
    <div
      style={{
        position: "fixed",
        inset: "0 0 60px 0",
        zIndex: 5500,
        background: bgPage,
        color: textMain,
        overflowY: "auto",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Tactical Forest Header Bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "linear-gradient(180deg, #1e4536 0%, #153227 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.09)",
          color: "#ffffff",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "11px",
              background: "rgba(52, 211, 153, 0.14)",
              border: "1px solid rgba(52, 211, 153, 0.28)",
              color: "#34d399",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
              flexShrink: 0
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "17px", fontWeight: "400", color: "#ffffff", letterSpacing: "0.2px", lineHeight: "1.2" }}>
              Journal
            </h1>
            <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.55)", marginTop: "2px" }}>
              Sorties & statistiques
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "20px",
              background: "rgba(0, 0, 0, 0.28)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              fontSize: "12px",
              color: "#f1f5f2"
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#34d399",
                boxShadow: "0 0 6px rgba(52, 211, 153, 0.85)"
              }}
            />
            <span>
              {savedTracks.length} {savedTracks.length > 1 ? "sorties" : "sortie"}
            </span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease"
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "14px 12px 80px 12px" }}>
        <StatsPanel
          finds={finds}
          savedTracks={savedTracks}
          exportData={exportData}
          importData={importData}
          setSelectedDate={setSelectedDate}
          isFullTab={true}
          onClose={onClose}
          theme={theme}
          onOpenCategoryManager={onOpenCategoryManager}
          onDeleteTrack={onDeleteTrack}
          onDeleteFind={onDeleteFind}
        />
      </div>
    </div>
  );
}
