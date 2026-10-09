import React, { useEffect } from "react";
import { markUpdateAsSeen } from "../services/feedbackService";

const NEWS_ARTICLES = [
  {
    id: "v1.4.0",
    version: "v1.4.0",
    date: "9 Octobre 2026",
    tag: "Nouveau",
    tagColor: "#38bdf8",
    title: "✨ Formulaire de retour & Sécurité renforcée",
    content: "Une mise à jour dédiée à l'écoute des prospecteurs et à la sécurité !",
    highlights: [
      "📝 Formulaire de retour disponible dans le menu latéral : signalez un bug ou proposez vos idées en 1 clic.",
      "🔒 Sécurité renforcée : Nouveaux codes de session cryptographiques équilibrés (3 chiffres + 3 lettres).",
      "⚡ Optimisation mobile PWA : Amélioration de la fluidité et du signal GPS en extérieur.",
      "📊 Console de suivi en direct : Meilleure détection des appareils et des navigateurs."
    ]
  },
  {
    id: "v1.3.0",
    version: "v1.3.0",
    date: "30 Septembre 2026",
    tag: "Majeure",
    tagColor: "#10b981",
    title: "🏛️ Cabinet Numismatique & Sorties GPS",
    content: "L'intelligence artificielle au service de l'identification de vos monnaies.",
    highlights: [
      "🪙 Cabinet Numismatique IA : Reconnaissance détaillée des monnaies Romaines, Royales et Gauloises.",
      "📍 Enregistrement GPS continu avec mode hors-ligne pour les zones blanches.",
      "👥 Sessions d'équipe synchronisées et modération d'hôte."
    ]
  },
  {
    id: "v1.2.0",
    version: "v1.2.0",
    date: "20 Septembre 2026",
    tag: "Lancement",
    tagColor: "#f59e0b",
    title: "🧭 Lancement officiel de GeoProspect",
    content: "L'application de cartographie privée pensée par et pour les prospecteurs de métaux.",
    highlights: [
      "🗺️ Cartes IGN, Satellite et Cadastre haute précision.",
      "📷 Galerie de trouvailles avec géolocalisation et photos haute résolution.",
      "🛡️ Confidentialité totale : Zéro carte publique, vos coins restent strictement secrets."
    ]
  }
];

export default function NewsModal({ isOpen, onClose, onOpenFeedback, theme = "dark" }) {
  useEffect(() => {
    if (isOpen) {
      markUpdateAsSeen();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLight = theme === "light";
  const bgModal = isLight ? "#ffffff" : "#0f172a";
  const textMain = isLight ? "#0f172a" : "#ffffff";
  const textSub = isLight ? "#475569" : "#94a3b8";
  const cardBg = isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.04)";
  const cardBorder = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.12)";

  const handleClose = () => {
    markUpdateAsSeen();
    onClose();
  };

  const handleFeedbackClick = () => {
    handleClose();
    if (onOpenFeedback) {
      onOpenFeedback();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.2s ease"
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "88vh",
          background: bgModal,
          borderRadius: "24px",
          border: `1px solid ${cardBorder}`,
          boxShadow: isLight ? "0 20px 40px rgba(0,0,0,0.15)" : "0 25px 60px rgba(0,0,0,0.8)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${cardBorder}`
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>🚀</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: textMain }}>
                Nouveautés & Mises à jour
              </h3>
              <p style={{ margin: 0, fontSize: "11px", color: textSub }}>
                Dernières évolutions de GeoProspect
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: isLight ? "#f1f5f9" : "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: textMain,
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* Action banner to test feedback */}
        <div
          style={{
            padding: "12px 18px",
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(56, 189, 248, 0.1))",
            borderBottom: `1px solid ${cardBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>💬</span>
            <div style={{ fontSize: "11.5px", color: textMain, fontWeight: "700" }}>
              Une idée ou un bug à signaler ?
            </div>
          </div>
          <button
            type="button"
            onClick={handleFeedbackClick}
            style={{
              padding: "6px 12px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              border: "none",
              color: "#ffffff",
              fontSize: "11.5px",
              fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
            }}
          >
            Formulaire de retour ›
          </button>
        </div>

        {/* Content list */}
        <div
          style={{
            padding: "16px 20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          {NEWS_ARTICLES.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "16px",
                borderRadius: "18px",
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      background: `${item.tagColor}22`,
                      border: `1px solid ${item.tagColor}44`,
                      color: item.tagColor,
                      fontSize: "10px",
                      fontWeight: "800",
                      textTransform: "uppercase"
                    }}
                  >
                    {item.tag}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: textSub }}>
                    {item.version}
                  </span>
                </div>
                <span style={{ fontSize: "10.5px", color: textSub, fontWeight: "600" }}>{item.date}</span>
              </div>

              <div style={{ fontSize: "14px", fontWeight: "900", color: textMain }}>
                {item.title}
              </div>

              <p style={{ margin: "2px 0 6px 0", fontSize: "12px", color: textSub, lineHeight: "1.4" }}>
                {item.content}
              </p>

              {item.highlights && item.highlights.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "4px" }}>
                  {item.highlights.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: "11.5px",
                        color: isLight ? "#1e293b" : "#e2e8f0",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "6px",
                        lineHeight: "1.4"
                      }}
                    >
                      <span style={{ color: "#38bdf8", flexShrink: 0 }}>•</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
