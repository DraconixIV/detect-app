import React from "react";

export default function OnboardingStep1Welcome({
  isDark,
  cardBg,
  cardBorder,
  textMain,
  textSub,
  onNext
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "900", color: textMain, letterSpacing: "-0.5px" }}>
          Bienvenue sur GeoProspect 🧭
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: textSub, lineHeight: "1.5" }}>
          Votre compagnon tout-en-un pour la détection de loisir.
        </p>
      </div>

      {/* 3 Key Feature Highlight Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Feature 1 */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            padding: "14px 16px",
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: "16px",
            alignItems: "flex-start"
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: isDark ? "rgba(37, 99, 235, 0.2)" : "#eff6ff",
              border: isDark ? "1px solid rgba(37, 99, 235, 0.4)" : "1px solid #bfdbfe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0
            }}
          >
            🗺️
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800", color: textMain, marginBottom: "3px" }}>
              Cartes IGN et Tracé GPS en Direct
            </div>
            <div style={{ fontSize: "12px", color: textSub, lineHeight: "1.5" }}>
              Superposez le <strong>Cadastre officiel IGN</strong>, la carte de <strong>Cassini</strong> et l'<strong>État-Major 1820</strong>. Visualisez votre parcours pour ne jamais repasser au même endroit.
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            padding: "14px 16px",
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: "16px",
            alignItems: "flex-start"
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: isDark ? "rgba(245, 158, 11, 0.2)" : "#fef3c7",
              border: isDark ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid #fde68a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0
            }}
          >
            🪙
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800", color: textMain, marginBottom: "3px" }}>
              Journal de Trouvailles et Photos HD
            </div>
            <div style={{ fontSize: "12px", color: textSub, lineHeight: "1.5" }}>
              Épinglez chaque découverte avec ses coordonnées exactes, photos macro, catégorie et exportez vos statistiques à tout moment.
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            padding: "14px 16px",
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: "16px",
            alignItems: "flex-start"
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: isDark ? "rgba(16, 185, 129, 0.2)" : "#ecfdf5",
              border: isDark ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid #a7f3d0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0
            }}
          >
            👥
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800", color: textMain, marginBottom: "3px" }}>
              Sessions en Équipe et Sauvegarde
            </div>
            <div style={{ fontSize: "12px", color: textSub, lineHeight: "1.5" }}>
              Rejoignez une session collective en direct avec vos amis ou prospectez en mode local sécurisé.
            </div>
          </div>
        </div>
      </div>

      {/* Action Next Button */}
      <button
        type="button"
        onClick={onNext}
        style={{
          marginTop: "6px",
          padding: "14px 20px",
          borderRadius: "14px",
          border: "none",
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: "white",
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)")}
      >
        Continuer vers l'étape 2 →
      </button>
    </div>
  );
}
