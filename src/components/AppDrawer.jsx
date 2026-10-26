import React from "react";
import { getMyDisplayName } from "../services/sessionService";
import { CURRENT_APP_VERSION } from "../services/feedbackService";

export default function AppDrawer({
  isOpen,
  onClose,
  theme = "dark",
  onNavigate,
  onOpenNews,
  onOpenFeedback,
  onOpenAbout,
  onOpenFeaturesGuide,
  onOpenCgu,
  user,
  isRecordingSortie,
  isOnline = true,
  hasUnreadNews = false,
  unreadUpdatesCount = 0
}) {
  if (!isOpen) return null;

  const isLight = theme === "light";
  const bgDrawer = isLight ? "#ffffff" : "#0a0f1d";
  const textMain = isLight ? "#0f172a" : "#ffffff";
  const textSub = isLight ? "#64748b" : "#94a3b8";
  const borderColor = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.12)";
  const itemBg = isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.04)";
  const itemBorder = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.08)";

  const myName = getMyDisplayName() || (user ? user.email?.split("@")[0] : "Prospecteur");

  const newsBadgeCount = unreadUpdatesCount > 0 ? unreadUpdatesCount : (hasUnreadNews ? 1 : 0);

  const menuItems = [
    {
      id: "news",
      label: "Mises à jour",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      hasBadge: newsBadgeCount > 0,
      badgeCount: newsBadgeCount,
      action: () => {
        onClose();
        if (onOpenNews) onOpenNews();
      }
    },
    {
      id: "feedback",
      label: "Formulaire de retour",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      action: () => {
        onClose();
        if (onOpenFeedback) onOpenFeedback();
      }
    },
    {
      id: "features",
      label: "Guide des fonctionnalités",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      action: () => {
        onClose();
        if (onOpenFeaturesGuide) onOpenFeaturesGuide();
      }
    },
    {
      id: "about",
      label: "À propos de GeoProspect",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
      action: () => {
        onClose();
        if (onOpenAbout) onOpenAbout();
      }
    },
    {
      id: "cgu",
      label: "Conditions d'utilisation (CGU)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      action: () => {
        onClose();
        if (onOpenCgu) onOpenCgu();
      }
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
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
          width: "82%",
          maxWidth: "310px",
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
                  borderRadius: "10px",
                  background: "#ebe3d3",
                  border: `1px solid ${borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0
                }}
              >
                <img
                  src="/icon-192.png"
                  alt="GeoProspect"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "400", color: textMain }}>
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
                fontWeight: "400",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  flexShrink: 0
                }}
              />
              <span>Sortie en cours</span>
            </div>
          )}
        </div>

        {/* Liste des options */}
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
                fontWeight: "400",
                cursor: "pointer",
                textAlign: "left",
                position: "relative",
                transition: "all 0.15s ease"
              }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", color: textSub, flexShrink: 0 }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>

              {/* Red notification badge '1' */}
              {item.hasBadge && (
                <span
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                    fontSize: "11.5px",
                    fontWeight: "400",
                    minWidth: "20px",
                    height: "20px",
                    padding: "0 5px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 10px rgba(239, 68, 68, 0.8)",
                    border: "1.5px solid #ffffff",
                    flexShrink: 0
                  }}
                >
                  {item.badgeCount || 1}
                </span>
              )}

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
          <div style={{ fontSize: "11px", color: textSub, fontWeight: "400"}}>
            GeoProspect • v{CURRENT_APP_VERSION}
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
                fontWeight: "400"
              }}
            >
              Soutenir
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
