import React from "react";
import { THEMES } from "../styles/themes";

export default function TacticalTopHUD({
  currentThemeKey = "tactical",
  onOpenMenu,
  onOpenThemePicker,
  onOpenTeamSession,
  workspace = { mode: "personal" },
  gpsAccuracy,
  isOnline,
  isRecordingSortie,
  onToggleRecording
}) {
  const theme = THEMES[currentThemeKey] || THEMES.tactical;
  const c = theme.colors;

  const getGpsStatusColor = () => {
    if (gpsAccuracy === null) return "#9ca3af";
    if (gpsAccuracy < 5) return "#10b981";
    if (gpsAccuracy < 15) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5200,
        background: c.hudBg,
        borderBottom: `2px solid ${c.hudBorder}`,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
        padding: "env(safe-area-inset-top, 6px) 10px 6px 10px",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: "10px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        userSelect: "none"
      }}
    >
      {/* LEFT: Menu button & Tactical Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={onOpenMenu}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            border: `1px solid ${c.border}`,
            background: c.buttonBg,
            color: c.textPrimary,
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
            transition: "transform 0.1s"
          }}
          title="Menu & Filtres"
        >
          ☰
        </button>

        <div
          style={{
            background: `linear-gradient(135deg, ${c.accent}, ${c.accentHover})`,
            padding: "4px 8px",
            borderRadius: "8px",
            color: "#ffffff",
            fontWeight: "900",
            fontSize: "11px",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            boxShadow: `0 2px 8px ${c.accent}44`,
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <span>🪙</span>
          <span>GEOPROSPECT</span>
        </div>
      </div>

      {/* CENTER: Precision GPS Metric or Live Session Badge */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: c.telemetryBg,
          padding: "4px 10px",
          borderRadius: "10px",
          border: `1px solid ${workspace.mode === "session" ? "#10b981" : (workspace.mode === "consultation" ? "#3b82f6" : c.border)}`,
          maxWidth: "160px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        <span
          style={{
            fontSize: "9px",
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            color: workspace.mode === "session" ? "#10b981" : (workspace.mode === "consultation" ? "#60a5fa" : c.textSecondary),
            lineHeight: "1"
          }}
        >
          {workspace.mode === "session"
            ? "SESSION ÉQUIPE"
            : (workspace.mode === "consultation" ? "CONSULTATION" : "PRÉCISION GPS")}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: workspace.mode === "session" ? "#10b981" : (workspace.mode === "consultation" ? "#3b82f6" : getGpsStatusColor()),
              boxShadow: `0 0 8px ${workspace.mode === "session" ? "#10b981" : (workspace.mode === "consultation" ? "#3b82f6" : getGpsStatusColor())}`
            }}
          />
          <span
            style={{
              fontSize: "13px",
              fontWeight: "900",
              fontFamily: "monospace",
              color: c.telemetryText,
              letterSpacing: "0.5px"
            }}
          >
            {workspace.mode === "session"
              ? (workspace.targetCode || "LIVE")
              : (workspace.mode === "consultation" ? (workspace.targetCode || "LECTURE") : (gpsAccuracy === null ? "..." : `± ${gpsAccuracy.toFixed(0)}m`))}
          </span>
        </div>
      </div>

      {/* RIGHT: Team / Share Button, Live Palette Tester & Outing / Online Status */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* Team / Share Button */}
        {onOpenTeamSession && (
          <button
            onClick={onOpenTeamSession}
            style={{
              padding: "6px 8px",
              borderRadius: "10px",
              border: `1px solid ${workspace.mode === "session" ? "#10b981" : (workspace.mode === "consultation" ? "#3b82f6" : c.border)}`,
              background: workspace.mode === "session" ? "rgba(16, 185, 129, 0.2)" : (workspace.mode === "consultation" ? "rgba(59, 130, 246, 0.2)" : c.buttonBg),
              color: workspace.mode === "session" ? "#10b981" : (workspace.mode === "consultation" ? "#60a5fa" : c.textPrimary),
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
            }}
            title="Équipe & Partage"
          >
            <span>👥</span>
          </button>
        )}

        {/* Quick Palette Picker Button */}
        <button
          onClick={onOpenThemePicker}
          style={{
            padding: "6px 8px",
            borderRadius: "10px",
            border: `1px solid ${c.border}`,
            background: c.buttonBg,
            color: c.textPrimary,
            fontSize: "11px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
          title="Changer de Palette en direct"
        >
          <span>🎨</span>
        </button>

        {/* Status indicator (Recording or Online) */}
        <div
          onClick={onToggleRecording}
          style={{
            padding: "6px 8px",
            borderRadius: "10px",
            border: `1px solid ${isRecordingSortie ? c.accent : c.border}`,
            background: isRecordingSortie ? `${c.accent}22` : c.buttonBg,
            color: isRecordingSortie ? c.accent : (isOnline ? "#10b981" : "#f59e0b"),
            fontSize: "10px",
            fontWeight: "800",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
          title={isRecordingSortie ? "Sortie en cours d'enregistrement" : "Sortie en pause / arrêtée"}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isRecordingSortie ? c.accent : (isOnline ? "#10b981" : "#f59e0b"),
              boxShadow: isRecordingSortie ? `0 0 8px ${c.accent}` : "none",
              animation: isRecordingSortie ? "pulse 1.5s infinite" : "none"
            }}
          />
          <span>{isRecordingSortie ? "REC" : (isOnline ? "ON" : "OFF")}</span>
        </div>
      </div>
    </div>
  );
}
