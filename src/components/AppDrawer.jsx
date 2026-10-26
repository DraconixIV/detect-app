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

  const myName = getMyDisplayName() || (user ? user.email?.split("@")[0] : "Prospecteur");
  const newsBadgeCount = unreadUpdatesCount > 0 ? unreadUpdatesCount : (hasUnreadNews ? 1 : 0);

  const menuItems = [
    {
      id: "map",
      label: "Carte",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
      ),
      action: () => {
        onClose();
        if (onNavigate) onNavigate("map");
      }
    },
    {
      id: "gallery",
      label: "Album de collection",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      action: () => {
        onClose();
        if (onNavigate) onNavigate("gallery");
      }
    },
    {
      id: "reports",
      label: "Chronologie & Statistiques",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
      action: () => {
        onClose();
        if (onNavigate) onNavigate("reports");
      }
    },
    {
      id: "features",
      label: "Guide d'exploration",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      id: "news",
      label: "Actualités",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8V6Z" />
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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      action: () => {
        onClose();
        if (onOpenFeedback) onOpenFeedback();
      }
    },
    {
      id: "cgu",
      label: "Cadre légal",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      action: () => {
        onClose();
        if (onOpenCgu) onOpenCgu();
      }
    },
    {
      id: "about",
      label: "À propos",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      id: "settings",
      label: "Paramètres",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
        background: "rgba(12, 24, 19, 0.55)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "68%",
          maxWidth: "280px",
          height: "100%",
          background: "#0d1f18",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 24px 28px 24px",
          boxSizing: "border-box",
          overflowY: "auto",
          boxShadow: "12px 0 36px rgba(0, 0, 0, 0.45)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Centered Emblem (Forest Style) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            marginBottom: "28px",
            cursor: "pointer"
          }}
          onClick={() => {
            onClose();
            if (onNavigate) onNavigate("settings");
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "#ebe3d3",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.35)"
            }}
          >
            <img
              src="/icon-192.png"
              alt="GeoProspect"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              opacity: 0.95
            }}
          >
            <span>{myName}</span>
            <span style={{ fontSize: "14px", opacity: 0.7 }}>›</span>
          </div>

          {isRecordingSortie && (
            <div
              style={{
                padding: "3px 10px",
                borderRadius: "999px",
                background: "#e9edc9",
                color: "#1b4332",
                fontSize: "10px",
                letterSpacing: "0.4px"
              }}
            >
              SORTIE EN COURS
            </div>
          )}
        </div>

        {/* Clean Borderless Menu List (Forest Style) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            flex: 1,
            paddingLeft: "4px"
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              style={{
                width: "100%",
                padding: 0,
                border: "none",
                background: "transparent",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "18px",
                fontSize: "15px",
                fontWeight: "400",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  opacity: 0.92,
                  flexShrink: 0
                }}
              >
                {item.icon}
              </span>

              <div style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}>
                {item.hasBadge && (
                  <span
                    style={{
                      alignSelf: "flex-start",
                      background: "#e9edc9",
                      color: "#1b4332",
                      fontSize: "9.5px",
                      padding: "1px 7px",
                      borderRadius: "999px",
                      letterSpacing: "0.4px"
                    }}
                  >
                    NOUVEAU
                  </span>
                )}
                <span style={{ lineHeight: "1.25", opacity: 0.95 }}>{item.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Brand Signature (Forest "Seekrtech" Style) */}
        <div
          style={{
            marginTop: "32px",
            paddingTop: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            opacity: 0.88
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: "#ffffff",
              color: "#0d1f18",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span style={{ fontSize: "14px", color: "#ffffff", letterSpacing: "0.5px" }}>
            GeoProspect
          </span>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginLeft: "auto" }}>
            v{CURRENT_APP_VERSION}
          </span>
        </div>
      </div>
    </div>
  );
}
