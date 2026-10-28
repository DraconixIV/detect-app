import React from "react";

export default function OnboardingStep6Letter({
  isDark,
  cardBg,
  cardBorder,
  textMain,
  textSub,
  onBack,
  onFinish
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "400", color: textMain, letterSpacing: "-0.3px" }}>
          Bienvenue dans l'aventure
        </h1>
        <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
          Ceci est la dernière étape avant de faire vos premiers pas dans GeoProspect.
        </p>
      </div>

      {/* Letter / Personal Message Card */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: "16px",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          fontSize: "13px",
          lineHeight: "1.6",
          color: textMain,
          maxHeight: "52vh",
          overflowY: "auto"
        }}
      >
        <p style={{ margin: 0, color: textSub }}>
          Cette application est 100 % gratuite et en constante évolution. Elle peut encore comporter de petits ajustements au fil de vos sorties.
        </p>
        <p style={{ margin: 0, color: textSub }}>
          GeoProspect est un projet indépendant que je développe seul, à 19 ans, animé par la passion de la détection et épaulé par l'intelligence artificielle pour concevoir l'outil de terrain le plus fluide et moderne possible. C'est ma façon de contribuer activement à notre communauté.
        </p>
        <p style={{ margin: 0, color: textSub }}>
          Chacun de vos retours d'expérience est précieux et participe directement à perfectionner l'application. Si l'outil vous plaît et que vous souhaitez m'aider à aller plus loin, un espace de dons est à votre disposition pour soutenir le projet et l'arrivée continue de nouvelles fonctionnalités.
        </p>
        <p style={{ margin: 0, color: textSub }}>
          Enfin, rappelons que notre passion s'exerce dans un cadre légal strict. Respecter la législation française et obtenir l'accord préalable des propriétaires est indispensable pour préserver l'image de notre loisir et faire vivre une détection responsable. Prospecter exige une vraie déontologie.
        </p>
        <div
          style={{
            marginTop: "4px",
            padding: "12px 14px",
            borderRadius: "12px",
            background: isDark ? "rgba(44, 94, 76, 0.22)" : "#eef2ee",
            border: isDark ? "1px solid rgba(64, 145, 108, 0.35)" : "1px solid #c8d6ce",
            fontWeight: "400",
            color: textMain,
            fontSize: "13px",
            textAlign: "center",
            lineHeight: "1.5"
          }}
        >
          Bonnes sorties et belles découvertes avec GeoProspect !
        </div>
      </div>

      {/* Action Buttons */}
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
          onClick={onFinish}
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
          Accéder à l'application
        </button>
      </div>
    </div>
  );
}
