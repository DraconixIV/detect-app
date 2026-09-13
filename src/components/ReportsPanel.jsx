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
  onOpenCategoryManager
}) {
  const isLight = theme === "light";
  const bgPanel = isLight ? "#f8fafc" : "#0b1329";
  const textMain = isLight ? "#0f172a" : "#f8fafc";
  const textSub = isLight ? "#475569" : "#94a3b8";

  return (
    <div
      style={{
        position: "fixed",
        inset: "0 0 60px 0",
        zIndex: 5500,
        background: bgPanel,
        color: textMain,
        overflowY: "auto",
        padding: "20px 16px 80px 16px",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ fontSize: "28px" }}>📊</div>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: isLight ? "#0f172a" : "#facc15" }}>
              Rapports & Statistiques
            </h1>
            <p style={{ margin: 0, fontSize: "12px", color: textSub }}>
              Historique de vos sorties, distances et découvertes
            </p>
          </div>
        </div>

        {/* Embedded full-width Stats Panel */}
        <div style={{ width: "100%" }}>
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
          />
        </div>
      </div>
    </div>
  );
}
