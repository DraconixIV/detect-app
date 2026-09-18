import React from "react";
import { getMyDisplayName } from "../services/sessionService";

export default function AppDrawer({
  isOpen,
  onClose,
  theme = "dark",
  activeTab = "map",
  onNavigate,
  onOpenTeamSession,
  onOpenCategoryManager,
  onOpenNews,
  onOpenAbout,
  onRestartOnboarding,
  user,
  isRecordingSortie,
  isOnline = true
}) {
  if (!isOpen) return null;

  const isLight = theme === "light";
  const bgDrawer = isLight ? "#ffffff" : "#0f172a";
  const textMain = isLight ? "#0f172a" : "#ffffff";
  const textSub = isLight ? "#64748b" : "#94a3b8";
  const borderColor = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.12)";
  const itemHoverBg = isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.08)";
  const activeItemBg = isLight ? "rgba(59, 130, 246, 0.12)" : "rgba(59, 130, 246, 0.2)";
  const activeItemColor = isLight ? "#2563eb" : "#60a5fa";

  const myName = getMyDisplayName() || (user ? user.email.split("@")[0] : "Détectoriste");

  const menuSections = [
    {
      title: "Navigation Principale",
      items: [
        { id: "map", label: "Carte & Détection", icon: "🧭", action: () => onNavigate("map") },
        { id: "album", label: "Mes Trouvailles & Galerie", icon: "📍", action: () => onNavigate("album") },
        { id: "stats", label: "Statistiques & Performances", icon: "📊", action: () => onNavigate("stats") },
        { id: "reports", label: "Fiches & Exports", icon: "📄", action: () => onNavigate("reports") }
      ]
    },
    {
      title: "Outils & Équipe",
      items: [
        { id: "team", label: "Sessions d'Équipe Live", icon: "👥", action: () => { onClose(); onOpenTeamSession && onOpenTeamSession(); } },
        { id: "categories", label: "Catégories & Métaux", icon: "🏷️", action: () => { onClose(); onOpenCategoryManager && onOpenCategoryManager(); } }
      ]
    },
    {
      title: "Communauté & Infos",
      items: [
        { id: "news", label: "Nouvelles & Astuces", icon: "📰", action: () => { onClose(); onOpenNews && onOpenNews(); } },
        { id: "about", label: "À Propos de GeoProspect", icon: "ℹ️", action: () => { onClose(); onOpenAbout && onOpenAbout(); } },
        { id: "settings", label: "Paramètres & Thème", icon: "⚙️", action: () => onNavigate("settings") }
      ]
    }
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9500,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        animation: "fadeIn 0.2s ease"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "82%",
          maxWidth: "320px",
          height: "100%",
          background: bgDrawer,
          borderRight: `1px solid ${borderColor}`,
          display: "flex",
          flexDirection: "column",
          boxShadow: isLight ? "10px 0 30px rgba(0,0,0,0.1)" : "10px 0 40px rgba(0,0,0,0.6)",
          animation: "slideRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          overflowY: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête Profil / Utilisateur */}
        <div
          style={{
            padding: "20px 18px 16px 18px",
            borderBottom: `1px solid ${borderColor}`,
            background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.03)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  color: "#ffffff",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.35)"
                }}
              >
                🧭
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "900", color: textMain }}>
                  {myName}
                </div>
                <div style={{ fontSize: "11px", color: textSub, display: "flex", alignItems: "center", gap: "4px" }}>
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: isOnline ? "#10b981" : "#f59e0b"
                    }}
                  />
                  <span>{isOnline ? "En ligne • Prêt" : "Mode Hors-ligne"}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.1)",
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

          {/* Badge Sortie en cours */}
          {isRecordingSortie && (
            <div
              style={{
                padding: "6px 10px",
                borderRadius: "10px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
                fontSize: "11px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span style={{ animation: "pulse 1s infinite" }}>🔴</span>
              <span>Enregistrement de sortie en cours</span>
            </div>
          )}
        </div>

        {/* Liste des sections de navigation */}
        <div style={{ padding: "12px 10px", display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
          {menuSections.map((sec, sIdx) => (
            <div key={sIdx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  color: textSub,
                  letterSpacing: "0.5px",
                  padding: "4px 8px"
                }}
              >
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      item.action();
                      if (item.id === "map" || item.id === "album" || item.id === "stats" || item.id === "reports" || item.id === "settings") {
                        onClose();
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "none",
                      background: isActive ? activeItemBg : "transparent",
                      color: isActive ? activeItemColor : textMain,
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      fontSize: "13px",
                      fontWeight: isActive ? "800" : "600",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {isActive && <span style={{ fontSize: "10px", fontWeight: "900" }}>●</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Pied de page du Drawer */}
        <div
          style={{
            padding: "12px 18px",
            borderTop: `1px solid ${borderColor}`,
            background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ fontSize: "10px", color: textSub, fontWeight: "600" }}>
            GeoProspect • v3.2
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <a
              href="https://ko-fi.com/geoprospect"
              target="_blank"
              rel="noopener noreferrer"
              title="Ko-fi"
              style={{
                fontSize: "12px",
                textDecoration: "none",
                padding: "4px 8px",
                borderRadius: "8px",
                background: isLight ? "#f1f5f9" : "rgba(255,255,255,0.08)",
                color: textMain,
                fontWeight: "700"
              }}
            >
              ☕ Don
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
