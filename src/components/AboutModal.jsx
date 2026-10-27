import React from "react";

export default function AboutModal({ isOpen, onClose, theme = "dark" }) {
  if (!isOpen) return null;

  const isLight = theme === "light";
  const bgModal = isLight ? "#f3f4f2" : "#111915";
  const sheetBg = isLight ? "#ffffff" : "#19231e";
  const cardBorder = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.08)";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(8, 14, 11, 0.8)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          maxHeight: "85vh",
          background: bgModal,
          borderRadius: "20px",
          border: `1px solid ${cardBorder}`,
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: "#2c5e4c",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "400", color: "#ffffff" }}>
              À propos de GeoProspect
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "rgba(255,255,255,0.75)" }}>
              Version 3.2.0 • 100 % indépendant et libre
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.14)",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "18px 20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          {/* Logo & Intro Card */}
          <div
            style={{
              padding: "16px",
              borderRadius: "16px",
              background: sheetBg,
              border: `1px solid ${cardBorder}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "6px"
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#ebe3d3",
                border: `1px solid ${cardBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
              }}
            >
              <img
                src="/icon-192.png"
                alt="GeoProspect"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ fontSize: "15px", fontWeight: "400", color: textMain }}>GeoProspect</div>
            <div style={{ fontSize: "11px", color: textSub }}>
              Le carnet de détection GPS des détectoristes
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: textSub, lineHeight: "1.5" }}>
              Passionné de détection comme vous, j'ai créé GeoProspect avec une idée simple : concevoir le carnet de détection dont on avait tous besoin sur le terrain. Une application moderne, fluide, 100 % gratuite, sans publicité et respectueuse de votre vie privée.
            </p>
          </div>

          {/* Engagements */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: sheetBg,
              border: `1px solid ${cardBorder}`,
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Nos engagements
            </div>
            <div style={{ fontSize: "12px", color: textMain, lineHeight: "1.4" }}>
              • 100 % gratuit : aucune fonctionnalité bridée derrière un abonnement.
            </div>
            <div style={{ fontSize: "12px", color: textMain, lineHeight: "1.4" }}>
              • Confidentialité totale : vos coordonnées GPS et trouvailles restent votre propriété exclusive.
            </div>
            <div style={{ fontSize: "12px", color: textMain, lineHeight: "1.4" }}>
              • Respect du patrimoine : pratique légale et responsable de la détection de loisir.
            </div>
          </div>

          {/* Soutenir */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: sheetBg,
              border: `1px solid ${cardBorder}`,
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Soutenir le projet
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: textSub, lineHeight: "1.4" }}>
              Un don encourage les futures nouveautés.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <a
                href="https://ko-fi.com/geoprospect"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: "9px",
                  borderRadius: "10px",
                  background: isLight ? "#f3f4f2" : "#111915",
                  border: `1px solid ${cardBorder}`,
                  color: textMain,
                  fontSize: "12px",
                  fontWeight: "400",
                  textDecoration: "none",
                  textAlign: "center"
                }}
              >
                Ko-fi
              </a>
              <a
                href="https://paypal.me/geoprospect"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: "9px",
                  borderRadius: "10px",
                  background: isLight ? "#f3f4f2" : "#111915",
                  border: `1px solid ${cardBorder}`,
                  color: textMain,
                  fontSize: "12px",
                  fontWeight: "400",
                  textDecoration: "none",
                  textAlign: "center"
                }}
              >
                PayPal
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
