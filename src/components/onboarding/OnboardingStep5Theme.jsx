import React from "react";

export default function OnboardingStep5Theme({
  isDark,
  cardBg,
  cardBorder,
  textMain,
  textSub,
  selectedMapStyle,
  setSelectedMapStyle,
  selectedAppTheme,
  handleSelectTheme,
  onBack,
  onNext
}) {
  const activeBg = isDark ? "rgba(44, 94, 76, 0.25)" : "#eef2ee";
  const activeBorder = "#2c5e4c";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "400", color: textMain, letterSpacing: "-0.3px" }}>
          Configuration initiale
        </h1>
        <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
          Personnalisez votre affichage cartographique et l'interface de travail.
        </p>
      </div>

      {/* 1. Map Style */}
      <div>
        <label style={{ fontSize: "11px", fontWeight: "400", textTransform: "uppercase", color: textSub, letterSpacing: "0.5px", marginBottom: "8px", display: "block" }}>
          Fond de carte par défaut
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div
            onClick={() => setSelectedMapStyle("satellite")}
            style={{
              padding: "16px 14px",
              borderRadius: "14px",
              border: selectedMapStyle === "satellite" ? `1.5px solid ${activeBorder}` : `1px solid ${cardBorder}`,
              background: selectedMapStyle === "satellite" ? activeBg : cardBg,
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: "400", color: textMain }}>
              Satellite HD
            </div>
            <div style={{ fontSize: "11px", color: textSub, marginTop: "3px" }}>
              Imagerie aérienne
            </div>
          </div>

          <div
            onClick={() => setSelectedMapStyle("streets")}
            style={{
              padding: "16px 14px",
              borderRadius: "14px",
              border: selectedMapStyle === "streets" ? `1.5px solid ${activeBorder}` : `1px solid ${cardBorder}`,
              background: selectedMapStyle === "streets" ? activeBg : cardBg,
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: "400", color: textMain }}>
              Relief topographique
            </div>
            <div style={{ fontSize: "11px", color: textSub, marginTop: "3px" }}>
              Courbes de niveau
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dark / Light Mode with Live Preview */}
      <div>
        <label style={{ fontSize: "11px", fontWeight: "400", textTransform: "uppercase", color: textSub, letterSpacing: "0.5px", marginBottom: "8px", display: "block" }}>
          Mode d'affichage
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: cardBg,
            padding: "4px",
            borderRadius: "999px",
            border: `1px solid ${cardBorder}`,
            gap: "4px"
          }}
        >
          <button
            type="button"
            onClick={() => handleSelectTheme("dark")}
            style={{
              padding: "10px",
              borderRadius: "999px",
              border: "none",
              background: selectedAppTheme === "dark" ? "#2c5e4c" : "transparent",
              color: selectedAppTheme === "dark" ? "#ffffff" : textSub,
              fontSize: "13px",
              fontWeight: "400",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Mode sombre
          </button>
          <button
            type="button"
            onClick={() => handleSelectTheme("light")}
            style={{
              padding: "10px",
              borderRadius: "999px",
              border: "none",
              background: selectedAppTheme === "light" ? "#2c5e4c" : "transparent",
              color: selectedAppTheme === "light" ? "#ffffff" : textSub,
              fontSize: "13px",
              fontWeight: "400",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Mode clair
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "13px 18px",
            borderRadius: "12px",
            border: `1px solid ${cardBorder}`,
            background: cardBg,
            color: textSub,
            fontSize: "13px",
            fontWeight: "400",
            cursor: "pointer"
          }}
        >
          Retour
        </button>

        <button
          type="button"
          onClick={onNext}
          style={{
            flex: 1,
            padding: "13px 18px",
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
          Continuer vers l'étape 6
        </button>
      </div>
    </div>
  );
}
