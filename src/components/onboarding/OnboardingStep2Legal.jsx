import React from "react";

export default function OnboardingStep2Legal({
  isDark,
  cardBg,
  cardBorder,
  textMain,
  textSub,
  checkOwner,
  setCheckOwner,
  checkHeritage,
  setCheckHeritage,
  checkDeclaration,
  setCheckDeclaration,
  checkNature,
  setCheckNature,
  checkCgu,
  setCheckCgu,
  allLegalChecked,
  onBack,
  onNext
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "900", color: textMain, letterSpacing: "-0.5px" }}>
          ⚖️ Cadre légal
        </h1>
        <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
          La détection de métaux en France est encadrée pour protéger le patrimoine et respecter la propriété privée.
        </p>
      </div>

      {/* Structured Legal Box */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: "14px",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          fontSize: "12px",
          lineHeight: "1.45",
          color: textMain
        }}
      >
        <div>
          <div style={{ fontWeight: "800", color: textMain, marginBottom: "3px" }}>
            Articles 544 et 552 du Code civil
          </div>
          <div style={{ color: textSub, fontSize: "11px" }}>
            La propriété du sol emporte la propriété du dessus et du dessous. Toute prospection sur un terrain privé nécessite impérativement l'accord écrit ou formel du propriétaire du terrain.
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${cardBorder}`, paddingTop: "8px" }}>
          <div style={{ fontWeight: "800", color: textMain, marginBottom: "3px" }}>
            Article L. 542-1 du Code du patrimoine
          </div>
          <div style={{ color: textSub, fontStyle: "italic", fontSize: "11px" }}>
            « Nul ne peut utiliser du matériel permettant la détection d'objets métalliques, à l'effet de recherches de monuments et d'objets pouvant intéresser la préhistoire, l'histoire, l'art ou l'archéologie, sans avoir, au préalable, obtenu une autorisation administrative. »
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${cardBorder}`, paddingTop: "8px" }}>
          <div style={{ fontWeight: "800", color: textMain, marginBottom: "3px" }}>
            Article L. 531-14 du Code du patrimoine
          </div>
          <div style={{ color: textSub, fontSize: "11px" }}>
            Toute découverte fortuite d'intérêt historique ou archéologique doit être immédiatement déclarée auprès de la mairie et du Service Régional de l'Archéologie (DRAC).
          </div>
        </div>
      </div>

      {/* 5 Legal Checkboxes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            background: checkOwner ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
            border: checkOwner ? "1px solid #3b82f6" : `1px solid ${cardBorder}`,
            padding: "11px 13px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "12px",
            lineHeight: "1.4",
            color: checkOwner ? (isDark ? "#93c5fd" : "#1e3a8a") : textMain,
            transition: "all 0.2s ease"
          }}
        >
          <input
            type="checkbox"
            checked={checkOwner}
            onChange={(e) => setCheckOwner(e.target.checked)}
            style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
          />
          <span>J'obtiens systématiquement l'<strong>accord préalable du propriétaire</strong> du terrain (Articles 544 et 552 du Code civil).</span>
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            background: checkHeritage ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
            border: checkHeritage ? "1px solid #3b82f6" : `1px solid ${cardBorder}`,
            padding: "11px 13px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "12px",
            lineHeight: "1.4",
            color: checkHeritage ? (isDark ? "#93c5fd" : "#1e3a8a") : textMain,
            transition: "all 0.2s ease"
          }}
        >
          <input
            type="checkbox"
            checked={checkHeritage}
            onChange={(e) => setCheckHeritage(e.target.checked)}
            style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
          />
          <span>Je respecte l'interdiction de recherche archéologique sans <strong>autorisation préfectorale (Art. L. 542-1)</strong>.</span>
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            background: checkDeclaration ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
            border: checkDeclaration ? "1px solid #3b82f6" : `1px solid ${cardBorder}`,
            padding: "11px 13px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "12px",
            lineHeight: "1.4",
            color: checkDeclaration ? (isDark ? "#93c5fd" : "#1e3a8a") : textMain,
            transition: "all 0.2s ease"
          }}
        >
          <input
            type="checkbox"
            checked={checkDeclaration}
            onChange={(e) => setCheckDeclaration(e.target.checked)}
            style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
          />
          <span>Je m'engage à <strong>déclarer sans délai toute découverte fortuite</strong> en mairie et à la DRAC (Art. L. 531-14 du Code du patrimoine).</span>
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            background: checkNature ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
            border: checkNature ? "1px solid #3b82f6" : `1px solid ${cardBorder}`,
            padding: "11px 13px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "12px",
            lineHeight: "1.4",
            color: checkNature ? (isDark ? "#93c5fd" : "#1e3a8a") : textMain,
            transition: "all 0.2s ease"
          }}
        >
          <input
            type="checkbox"
            checked={checkNature}
            onChange={(e) => setCheckNature(e.target.checked)}
            style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
          />
          <span>Je m'engage à <strong>reboucher systématiquement mes trous</strong> et à ramasser les déchets métalliques.</span>
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            background: checkCgu ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
            border: checkCgu ? "1px solid #3b82f6" : `1px solid ${cardBorder}`,
            padding: "11px 13px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "12px",
            lineHeight: "1.4",
            color: checkCgu ? (isDark ? "#93c5fd" : "#1e3a8a") : textMain,
            transition: "all 0.2s ease"
          }}
        >
          <input
            type="checkbox"
            checked={checkCgu}
            onChange={(e) => setCheckCgu(e.target.checked)}
            style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
          />
          <span>J'accepte les <strong>Conditions d'Utilisation</strong> et m'engage à respecter les règles de détection énoncées ci-dessus.</span>
        </label>
      </div>

      {/* Actions Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
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
          Retour
        </button>

        <button
          type="button"
          disabled={!allLegalChecked}
          onClick={onNext}
          style={{
            flex: 1,
            padding: "13px 18px",
            borderRadius: "12px",
            border: "none",
            background: allLegalChecked ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : (isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"),
            color: allLegalChecked ? "#ffffff" : (isDark ? "rgba(255,255,255,0.3)" : "#94a3b8"),
            fontSize: "13px",
            fontWeight: "700",
            cursor: allLegalChecked ? "pointer" : "not-allowed",
            boxShadow: allLegalChecked ? "0 2px 10px rgba(37, 99, 235, 0.25)" : "none",
            transition: "all 0.2s ease"
          }}
        >
          Continuer vers l'étape 3 →
        </button>
      </div>
    </div>
  );
}
