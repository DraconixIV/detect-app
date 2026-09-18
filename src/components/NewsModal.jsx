import React from "react";

const NEWS_ARTICLES = [
  {
    id: "v3.2",
    date: "Septembre 2026",
    tag: "Nouveauté",
    tagColor: "#10b981",
    title: "🎙️ Notes Vocales & Coordonnées UTM",
    content: "Enregistrez vos mémos vocaux directement sur le terrain sans retirer vos gants ! Affichage des coordonnées militaires et topographiques UTM pour une précision cartographique maximale."
  },
  {
    id: "v3.1",
    date: "Septembre 2026",
    tag: "Mise à jour",
    tagColor: "#3b82f6",
    title: "🧭 Nouveau Menu Latéral & Synchronisation Cloud",
    content: "Accédez rapidement à vos sorties, trouvailles, statistiques et sessions d'équipe grâce au nouveau menu latéral rapide."
  },
  {
    id: "tip-1",
    date: "Conseil Pro",
    tag: "Astuce Terrain",
    tagColor: "#f59e0b",
    title: "💡 Balayage et discrimination des ferreux",
    content: "Pour éviter de creuser sur des clous rouillés sans manquer les petites monnaies profondes, effectuez un balayage en croix à 90° au-dessus de la cible douteuse."
  },
  {
    id: "law-1",
    date: "Législation",
    tag: "Rappel Légal",
    tagColor: "#8b5cf6",
    title: "⚖️ Autorisation du propriétaire & Code du Patrimoine",
    content: "Rappel amical : l'accord exprès et écrit du propriétaire du terrain est obligatoire avant toute sortie de détection de loisir (Art. L. 542-1 du Code du Patrimoine)."
  }
];

export default function NewsModal({ isOpen, onClose, theme = "dark" }) {
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
            <span style={{ fontSize: "22px" }}>📰</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: textMain }}>
                Nouvelles & Mises à jour
              </h3>
              <p style={{ margin: 0, fontSize: "11px", color: textSub }}>
                Changelog de l'app et conseils pour vos sorties
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

        {/* Content list */}
        <div
          style={{
            padding: "16px 20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          {NEWS_ARTICLES.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "14px 16px",
                borderRadius: "16px",
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                <span style={{ fontSize: "10px", color: textSub, fontWeight: "600" }}>{item.date}</span>
              </div>
              <div style={{ fontSize: "13px", fontWeight: "800", color: textMain, marginTop: "2px" }}>
                {item.title}
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: textSub, lineHeight: "1.45" }}>
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
