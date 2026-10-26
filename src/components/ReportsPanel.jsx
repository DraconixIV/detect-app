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
      {/* Forest-Style Solid Top Header Bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "#2c5e4c",
          color: "#ffffff",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
        }}
      >
        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "400", color: "#ffffff", letterSpacing: "0.2px" }}>
          Statistiques et Chronologie
        </h1>
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
