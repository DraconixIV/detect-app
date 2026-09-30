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
  onDeleteTrack
}) {
  const isLight = theme === "light";
  const bgPanel = isLight ? "#f8fafc" : "#0b1329";
  const textMain = isLight ? "#000000" : "#ffffff";
  const textSub = isLight ? "#1e293b" : "#ffffff";

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
            onDeleteTrack={onDeleteTrack}
          />
        </div>
      </div>
    </div>
  );
}
