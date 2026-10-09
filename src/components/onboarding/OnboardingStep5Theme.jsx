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
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "900", color: textMain, letterSpacing: "-0.5px" }}>
          Configuration initiale ⚙️
        </h1>
        <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
          Personnalisez votre affichage cartographique et l'interface de travail.
        </p>
      </div>

      {/* 1. Map Style */}
      <div>
        <label style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: textSub, letterSpacing: "0.5px", marginBottom: "8px", display: "block" }}>
          Fond de carte par défaut
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div
            onClick={() => setSelectedMapStyle("satellite")}
            style={{
              padding: "14px",
              borderRadius: "14px",
              border: selectedMapStyle === "satellite" ? "2px solid #2563eb" : `1px solid ${cardBorder}`,
              background: selectedMapStyle === "satellite" ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: "800", color: selectedMapStyle === "satellite" ? (isDark ? "#60a5fa" : "#1e3a8a") : textMain }}>
              🛰️ Satellite HD
            </div>
            <div style={{ fontSize: "11px", color: textSub, marginTop: "2px" }}>
              Imagerie aérienne
            </div>
          </div>

          <div
            onClick={() => setSelectedMapStyle("streets")}
            style={{
              padding: "14px",
              borderRadius: "14px",
              border: selectedMapStyle === "streets" ? "2px solid #2563eb" : `1px solid ${cardBorder}`,
              background: selectedMapStyle === "streets" ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: "800", color: selectedMapStyle === "streets" ? (isDark ? "#60a5fa" : "#1e3a8a") : textMain }}>
              🏔️ Relief topographique
            </div>
            <div style={{ fontSize: "11px", color: textSub, marginTop: "2px" }}>
              Courbes de niveau
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dark / Light Mode with Live Preview */}
      <div>
        <label style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: textSub, letterSpacing: "0.5px", marginBottom: "8px", display: "block" }}>
          Mode d'affichage
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <button
            type="button"
            onClick={() => handleSelectTheme("dark")}
            style={{
              padding: "12px",
              borderRadius: "12px",
              border: selectedAppTheme === "dark" ? "2px solid #2563eb" : `1px solid ${cardBorder}`,
              background: selectedAppTheme === "dark" ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
              color: selectedAppTheme === "dark" ? (isDark ? "#60a5fa" : "#1e3a8a") : textSub,
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            🌙 Sombre {selectedAppTheme === "dark" && "✓"}
          </button>
          <button
            type="button"
            onClick={() => handleSelectTheme("light")}
            style={{
              padding: "12px",
              borderRadius: "12px",
              border: selectedAppTheme === "light" ? "2px solid #2563eb" : `1px solid ${cardBorder}`,
              background: selectedAppTheme === "light" ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
              color: selectedAppTheme === "light" ? (isDark ? "#60a5fa" : "#1e3a8a") : textSub,
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            ☀️ Clair {selectedAppTheme === "light" && "✓"}
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
            background: isDark ? "#1e293b" : "#ffffff",
            color: textSub,
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          ← Retour
        </button>

        <button
          type="button"
          onClick={onNext}
          style={{
            flex: 1,
            padding: "13px 18px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(37, 99, 235, 0.25)",
            transition: "all 0.2s ease"
          }}
        >
          Continuer vers l'étape 6 →
        </button>
      </div>
    </div>
  );
}
