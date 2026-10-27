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
          Cette application est 100 % gratuite et toujours en phase de test. Il se peut que vous rencontriez de nouveaux bugs à mesure de son utilisation.
        </p>
        <p style={{ margin: 0, color: textSub }}>
          On parle d'un projet développé seul par un étudiant de 19 ans passionné de détection, qui s'appuie sur l'IA comme assistante de développement pour concevoir et enrichir ce carnet de détection. Proposer un outil de poche moderne et fluide est ma manière de contribuer à la communauté.
        </p>
        <p style={{ margin: 0, color: textSub }}>
          Tous vos retours seront votre manière de remercier mon travail, un simple compte-rendu de votre expérience suffira amplement à contribuer à l'amélioration constante de GeoProspect.
        </p>
        <p style={{ margin: 0, color: textSub }}>
          Je me suis ainsi permis d'ouvrir un espace aux dons pour permettre à tous les utilisateurs étant extrêmement satisfaits de soutenir le projet de manière plus directe. Ce fond pourra servir à investir dans ce dernier à plus long terme en allouant des ressources plus importantes et en continuant l'apport mensuel de nouveautés.
        </p>
        <p style={{ margin: 0, color: textSub }}>
          Enfin, j'aimerais souligner que notre loisir est encadré par des lois. À ce titre, il demeure essentiel de se renseigner sur la législation française afin d'éviter de ternir notre réputation et d'amputer la communauté responsable qui ne souhaite que plus de visibilité. Prospecter exige une déontologie.
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
          Allez, je vous laisse profiter ! Merci pour votre lecture, bonnes recherches.
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
