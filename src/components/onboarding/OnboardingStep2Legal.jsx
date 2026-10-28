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
  const checkedBg = isDark ? "rgba(44, 94, 76, 0.22)" : "#eef2ee";
  const checkedBorder = "#2c5e4c";
  const checkedText = isDark ? "#f1f5f2" : "#1f2924";

  const checkboxes = [
    {
      checked: checkOwner,
      onChange: setCheckOwner,
      label: "J'obtiens systématiquement l'accord préalable du propriétaire du terrain (Articles 544 et 552 du Code civil)."
    },
    {
      checked: checkHeritage,
      onChange: setCheckHeritage,
      label: "Je respecte l'interdiction de recherche archéologique sans autorisation préfectorale (Art. L. 542-1 du Code du patrimoine)."
    },
    {
      checked: checkDeclaration,
      onChange: setCheckDeclaration,
      label: "Je m'engage à déclarer sans délai toute découverte fortuite en mairie et à la DRAC (Art. L. 531-14 du Code du patrimoine)."
    },
    {
      checked: checkNature,
      onChange: setCheckNature,
      label: "Je m'engage à reboucher systématiquement mes trous et à ramasser les déchets métalliques."
    },
    {
      checked: checkCgu,
      onChange: setCheckCgu,
      label: "J'accepte les Conditions d'Utilisation et m'engage à respecter les règles de détection énoncées ci-dessus."
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "400", color: textMain, letterSpacing: "-0.3px" }}>
          Cadre légal
        </h1>
        <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
          La détection de métaux en France est encadrée pour protéger le patrimoine et respecter la propriété privée.
        </p>
      </div>

      {/* Grouped Sheet: Legal Articles */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: "16px",
          overflow: "hidden",
          fontSize: "12px",
          lineHeight: "1.45",
          color: textMain
        }}
      >
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${cardBorder}` }}>
          <div style={{ fontWeight: "400", color: textMain, marginBottom: "3px" }}>
            Articles 544 et 552 du Code civil
          </div>
          <div style={{ color: textSub, fontSize: "11px" }}>
            La propriété du sol emporte la propriété du dessus et du dessous. Toute prospection sur un terrain privé nécessite impérativement l'accord écrit ou formel du propriétaire du terrain.
          </div>
        </div>

        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${cardBorder}` }}>
          <div style={{ fontWeight: "400", color: textMain, marginBottom: "3px" }}>
            Article L. 542-1 du Code du patrimoine
          </div>
          <div style={{ color: textSub, fontStyle: "italic", fontSize: "11px" }}>
            « Nul ne peut utiliser du matériel permettant la détection d'objets métalliques, à l'effet de recherches de monuments et d'objets pouvant intéresser la préhistoire, l'histoire, l'art ou l'archéologie, sans avoir, au préalable, obtenu une autorisation administrative. »
          </div>
        </div>

        <div style={{ padding: "14px 16px" }}>
          <div style={{ fontWeight: "400", color: textMain, marginBottom: "3px" }}>
            Article L. 531-14 du Code du patrimoine
          </div>
          <div style={{ color: textSub, fontSize: "11px" }}>
            Toute découverte fortuite d'intérêt historique ou archéologique doit être immédiatement déclarée auprès de la mairie et du Service Régional de l'Archéologie (DRAC).
          </div>
        </div>
      </div>

      {/* 5 Legal Checkboxes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {checkboxes.map((item, idx) => (
          <label
            key={idx}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              background: item.checked ? checkedBg : cardBg,
              border: item.checked ? `1px solid ${checkedBorder}` : `1px solid ${cardBorder}`,
              padding: "11px 13px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "12px",
              lineHeight: "1.4",
              color: item.checked ? checkedText : textMain,
              transition: "all 0.2s ease"
            }}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={(e) => item.onChange(e.target.checked)}
              style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2c5e4c", cursor: "pointer", flexShrink: 0 }}
            />
            <span>{item.label}</span>
          </label>
        ))}
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
          disabled={!allLegalChecked}
          onClick={onNext}
          style={{
            flex: 1,
            padding: "13px 18px",
            borderRadius: "12px",
            border: "none",
            background: allLegalChecked ? "#2c5e4c" : (isDark ? "rgba(255,255,255,0.06)" : "#dce2de"),
            color: allLegalChecked ? "#ffffff" : textSub,
            fontSize: "13px",
            fontWeight: "400",
            cursor: allLegalChecked ? "pointer" : "not-allowed",
            transition: "all 0.2s ease"
          }}
        >
          Continuer vers l'étape 3
        </button>
      </div>
    </div>
  );
}
