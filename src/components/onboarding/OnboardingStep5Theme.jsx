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
              padding: "12px 10px 14px 10px",
              borderRadius: "14px",
              border: selectedMapStyle === "satellite" ? `1.5px solid ${activeBorder}` : `1px solid ${cardBorder}`,
              background: selectedMapStyle === "satellite" ? activeBg : cardBg,
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            {/* Mini preview Satellite HD */}
            <div style={{ width: "100%", height: "54px", borderRadius: "10px", overflow: "hidden", marginBottom: "8px", position: "relative", border: "1px solid rgba(255,255,255,0.1)" }}>
              <svg width="100%" height="100%" viewBox="0 0 140 54" preserveAspectRatio="xMidYMid slice" fill="none">
                <rect width="140" height="54" fill="#2d3d30" />
                <path d="M0 0 L80 0 L65 54 L0 54 Z" fill="#3a4b39" />
                <path d="M80 0 L140 0 L140 28 L72 28 Z" fill="#4d5c41" />
                <path d="M72 28 L140 28 L140 54 L65 54 Z" fill="#2f3e2e" />
                <path d="M22 0 L14 54" stroke="#222c21" strokeWidth="2" strokeDasharray="3 2" />
                <path d="M65 54 L80 0" stroke="#222c21" strokeWidth="2.5" />
                <path d="M72 28 L140 28" stroke="#222c21" strokeWidth="2" />
                <circle cx="38" cy="18" r="5" fill="#1b281d" opacity="0.8" />
                <circle cx="110" cy="40" r="6" fill="#1b281d" opacity="0.8" />
                <circle cx="70" cy="27" r="7" stroke="#facc15" strokeWidth="1.2" fill="none" opacity="0.85" />
                <circle cx="70" cy="27" r="2" fill="#facc15" />
              </svg>
            </div>
            <div style={{ fontSize: "13.5px", fontWeight: "400", color: textMain }}>
              Satellite HD
            </div>
            <div style={{ fontSize: "11px", color: textSub, marginTop: "2px" }}>
              Imagerie aérienne
            </div>
          </div>

          <div
            onClick={() => setSelectedMapStyle("streets")}
            style={{
              padding: "12px 10px 14px 10px",
              borderRadius: "14px",
              border: selectedMapStyle === "streets" ? `1.5px solid ${activeBorder}` : `1px solid ${cardBorder}`,
              background: selectedMapStyle === "streets" ? activeBg : cardBg,
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            {/* Mini preview Relief Topographique */}
            <div style={{ width: "100%", height: "54px", borderRadius: "10px", overflow: "hidden", marginBottom: "8px", position: "relative", border: "1px solid rgba(255,255,255,0.1)" }}>
              <svg width="100%" height="100%" viewBox="0 0 140 54" preserveAspectRatio="xMidYMid slice" fill="none">
                <rect width="140" height="54" fill="#eef2ee" />
                <path d="M0 18 Q35 6 75 22 T140 10 L140 54 L0 54 Z" fill="#dce6dc" />
                <path d="M-10 14 Q25 4 70 16 T150 8" fill="none" stroke="#8fa88f" strokeWidth="1.2" />
                <path d="M-10 24 Q30 14 80 26 T150 18" fill="none" stroke="#7a967a" strokeWidth="1.3" />
                <path d="M-10 34 Q35 24 90 36 T150 28" fill="none" stroke="#8fa88f" strokeWidth="1.2" />
                <path d="M-10 44 Q40 34 100 46 T150 38" fill="none" stroke="#7a967a" strokeWidth="1.3" />
                <text x="44" y="23" fontSize="7.5" fill="#4d664d" fontFamily="monospace">150m</text>
                <path d="M15 54 Q45 28 125 10" fill="none" stroke="#d97706" strokeWidth="1.4" strokeDasharray="3 2" />
              </svg>
            </div>
            <div style={{ fontSize: "13.5px", fontWeight: "400", color: textMain }}>
              Relief topographique
            </div>
            <div style={{ fontSize: "11px", color: textSub, marginTop: "2px" }}>
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
