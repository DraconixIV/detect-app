import React from "react";

export default function OnboardingStep1Welcome({
  isDark,
  cardBg,
  cardBorder,
  textMain,
  textSub,
  onNext
}) {
  const iconBadgeBg = isDark ? "rgba(44, 94, 76, 0.25)" : "#eef2ee";
  const iconColor = isDark ? "#80b99c" : "#2c5e4c";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "23px", fontWeight: "400", color: textMain, letterSpacing: "-0.3px" }}>
          Bienvenue sur GeoProspect
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: textSub, lineHeight: "1.5" }}>
          Votre carnet de terrain pour la détection de loisir.
        </p>
      </div>

      {/* Grouped Sheet of 3 Key Features */}
      <div
        style={{
          background: cardBg,
          borderRadius: "16px",
          border: `1px solid ${cardBorder}`,
          overflow: "hidden",
          boxShadow: isDark ? "none" : "0 2px 10px rgba(0, 0, 0, 0.03)"
        }}
      >
        {/* Feature 1 */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            padding: "16px",
            borderBottom: `1px solid ${cardBorder}`,
            alignItems: "flex-start"
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: iconBadgeBg,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "400", color: textMain, marginBottom: "4px" }}>
              Cartes IGN et tracé GPS en direct
            </div>
            <div style={{ fontSize: "12px", color: textSub, lineHeight: "1.5" }}>
              Superposez le Cadastre officiel IGN, la carte de Cassini et l'État-Major 1820. Visualisez votre parcours pour ne jamais repasser au même endroit.
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            padding: "16px",
            borderBottom: `1px solid ${cardBorder}`,
            alignItems: "flex-start"
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: iconBadgeBg,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "400", color: textMain, marginBottom: "4px" }}>
              Journal de trouvailles et photos HD
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
            padding: "16px",
            alignItems: "flex-start"
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: iconBadgeBg,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "400", color: textMain, marginBottom: "4px" }}>
              Sessions en équipe et sauvegarde
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
          marginTop: "4px",
          padding: "14px 20px",
          borderRadius: "12px",
          border: "none",
          background: "#2c5e4c",
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: "400",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
      >
        Continuer vers l'étape 2
      </button>
    </div>
  );
}
