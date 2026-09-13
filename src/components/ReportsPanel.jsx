import React from "react";
import StatsPanel from "./StatsPanel";

export default function ReportsPanel({
  finds = [],
  savedTracks = [],
  exportData,
  importData,
  setSelectedDate,
  onClose
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: "0 0 60px 0",
        zIndex: 5500,
        background: "rgba(11, 19, 41, 0.95)",
        backdropFilter: "blur(12px)",
        color: "white",
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
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#facc15" }}>
              Rapports & Statistiques
            </h1>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>
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
          />
        </div>
      </div>
    </div>
  );
}
