import React from "react";

export default function AboutModal({ isOpen, onClose, theme = "dark" }) {
  if (!isOpen) return null;

  const isLight = theme === "light";
  const bgModal = isLight ? "#ffffff" : "#0f172a";
  const textMain = isLight ? "#0f172a" : "#ffffff";
  const textSub = isLight ? "#475569" : "#94a3b8";
  const cardBg = isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.04)";
  const cardBorder = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.12)";

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
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          maxHeight: "85vh",
          background: bgModal,
          borderRadius: "24px",
          border: `1px solid ${cardBorder}`,
          boxShadow: isLight ? "0 20px 40px rgba(0,0,0,0.15)" : "0 20px 50px rgba(0,0,0,0.7)",
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
            <span style={{ fontSize: "22px" }}>ℹ️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: textMain }}>
                À Propos de GeoProspect
              </h3>
              <p style={{ margin: 0, fontSize: "11px", color: textSub }}>
                Version 3.2.0 • 100 % Indépendant & Libre
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
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

        {/* Content */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          {/* Logo & Intro Card */}
          <div
            style={{
              padding: "16px",
              borderRadius: "18px",
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "8px"
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                boxShadow: "0 8px 16px rgba(59, 130, 246, 0.3)"
              }}
            >
              🧭
            </div>
            <div style={{ fontSize: "16px", fontWeight: "900", color: textMain }}>GeoProspect</div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#3b82f6" }}>
              Le carnet de terrain GPS des détectoristes
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: textSub, lineHeight: "1.5" }}>
              Développé par un passionné pour offrir un outil moderne, gratuit, sans publicité et respectueux de la vie privée. Compatible avec toutes les marques de détecteurs (XP, Minelab, Garrett, Nokta...).
            </p>
          </div>

          {/* Engagements */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: "800", color: textMain, textTransform: "uppercase" }}>
              🛡️ Nos Engagements
            </div>
            <div style={{ fontSize: "11px", color: textSub, lineHeight: "1.4" }}>
              • <strong>100 % Gratuit</strong> : Aucune fonctionnalité bridée derrière un abonnement payant.
            </div>
            <div style={{ fontSize: "11px", color: textSub, lineHeight: "1.4" }}>
              • <strong>Confidentialité Totale</strong> : Vos coordonnées GPS et trouvailles restent votre propriété exclusive.
            </div>
            <div style={{ fontSize: "11px", color: textSub, lineHeight: "1.4" }}>
              • <strong>Respect du Patrimoine</strong> : Pratique légale et responsable de la détection de loisir.
            </div>
          </div>

          {/* Soutenir */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: "800", color: textMain, textTransform: "uppercase" }}>
              ☕ Soutenir le Développement
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: textSub, lineHeight: "1.4" }}>
              Un petit don aide à financer les serveurs cartographiques et encourage les futures nouveautés !
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <a
                href="https://ko-fi.com/geoprospect"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "12px",
                  background: isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.08)",
                  border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.16)",
                  color: isLight ? "#0f172a" : "#ffffff",
                  fontSize: "11px",
                  fontWeight: "800",
                  textDecoration: "none",
                  textAlign: "center"
                }}
              >
                ☕ Ko-fi
              </a>
              <a
                href="https://paypal.me/geoprospect"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "12px",
                  background: isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.08)",
                  border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.16)",
                  color: isLight ? "#0f172a" : "#ffffff",
                  fontSize: "11px",
                  fontWeight: "800",
                  textDecoration: "none",
                  textAlign: "center"
                }}
              >
                💳 PayPal.me
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
