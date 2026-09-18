import React from "react";
import { getMyDisplayName } from "../services/sessionService";

export default function AppDrawer({
  isOpen,
  onClose,
  theme = "dark",
  onNavigate,
  onOpenNews,
  onOpenAbout,
  user,
  isRecordingSortie,
  isOnline = true
}) {
  if (!isOpen) return null;

  const isLight = theme === "light";
  const bgDrawer = isLight ? "#ffffff" : "#0a0f1d";
  const textMain = isLight ? "#0f172a" : "#ffffff";
  const textSub = isLight ? "#64748b" : "#94a3b8";
  const borderColor = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.12)";
  const itemBg = isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.04)";
  const itemBorder = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.08)";

  const myName = getMyDisplayName() || (user ? user.email.split("@")[0] : "Utilisateur");

  const menuItems = [
    {
      id: "news",
      label: "Nouvelles & Astuces",
      icon: "📰",
      action: () => {
        onClose();
        if (onOpenNews) onOpenNews();
      }
    },
    {
      id: "about",
      label: "À Propos de GeoProspect",
      icon: "ℹ️",
      action: () => {
        onClose();
        if (onOpenAbout) onOpenAbout();
      }
    },
    {
      id: "settings",
      label: "Paramètres & Thème",
      icon: "⚙️",
      action: () => {
        onClose();
        if (onNavigate) onNavigate("settings");
      }
    }
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9500,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "80%",
          maxWidth: "300px",
          height: "100%",
          background: bgDrawer,
          borderRight: `1px solid ${borderColor}`,
          display: "flex",
          flexDirection: "column",
          boxShadow: isLight ? "10px 0 30px rgba(0,0,0,0.1)" : "10px 0 40px rgba(0,0,0,0.6)",
          overflowY: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête Utilisateur (Monochrome Noir/Blanc) */}
        <div
          style={{
            padding: "20px 16px 16px 16px",
            borderBottom: `1px solid ${borderColor}`,
            background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.02)",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: isLight ? "#0f172a" : "#1e293b",
                  border: `1px solid ${borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  color: "#ffffff"
                }}
              >
                🧭
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "800", color: textMain }}>
                  {myName}
                </div>
                <div style={{ fontSize: "11px", color: textSub, display: "flex", alignItems: "center", gap: "4px" }}>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: isOnline ? "#10b981" : "#f59e0b"
                    }}
                  />
                  <span>{isOnline ? "En ligne" : "Hors-ligne"}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.08)",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: textMain,
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              ✕
            </button>
          </div>

          {/* Badge Sortie active */}
          {isRecordingSortie && (
            <div
              style={{
                padding: "6px 10px",
                borderRadius: "10px",
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
                fontSize: "11px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>🔴</span>
              <span>Sortie en cours</span>
            </div>
          )}
        </div>

        {/* Liste des options autorisées */}
        <div style={{ padding: "14px 12px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "14px",
                border: `1px solid ${itemBorder}`,
                background: itemBg,
                color: textMain,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease"
              }}
            >
              <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: "13px", color: textSub }}>›</span>
            </button>
          ))}
        </div>

        {/* Pied de page */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: `1px solid ${borderColor}`,
            background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ fontSize: "11px", color: textSub, fontWeight: "600" }}>
            GeoProspect • v3.2
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <a
              href="https://ko-fi.com/geoprospect"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "11px",
                textDecoration: "none",
                padding: "4px 8px",
                borderRadius: "8px",
                background: isLight ? "#e2e8f0" : "rgba(255,255,255,0.08)",
                color: textMain,
                fontWeight: "700"
              }}
            >
              ☕ Soutenir
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
