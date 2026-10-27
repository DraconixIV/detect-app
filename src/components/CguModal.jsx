import React from "react";

export default function CguModal({ isOpen, onClose, theme = "dark" }) {
  if (!isOpen) return null;

  const isLight = theme === "light";
  const bgModal = isLight ? "#f3f4f2" : "#111915";
  const sheetBg = isLight ? "#ffffff" : "#19231e";
  const cardBorder = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.08)";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(8, 14, 11, 0.8)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          maxHeight: "88vh",
          background: bgModal,
          borderRadius: "20px",
          border: `1px solid ${cardBorder}`,
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: "#2c5e4c",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "400", color: "#ffffff" }}>
              Conditions générales d'utilisation
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "rgba(255,255,255,0.75)" }}>
              Mentions légales et confidentialité (RGPD)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.14)",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "18px 20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontSize: "12.5px",
            lineHeight: "1.6",
            color: textMain
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: sheetBg,
              border: `1px solid ${cardBorder}`
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "400", color: textMain, marginBottom: "6px" }}>
              1 — Nature du service
            </div>
            <p style={{ margin: 0, color: textSub }}>
              GeoProspect est une application web progressive conçue bénévolement et mise à disposition à titre gratuit. Elle constitue un carnet de détection numérique personnel permettant aux passionnés de détection de loisir d'enregistrer leurs trouvailles, de visualiser des fonds de cartes géographiques et de suivre leurs parcours GPS.
            </p>
          </div>

          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: sheetBg,
              border: `1px solid ${cardBorder}`
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "400", color: textMain, marginBottom: "6px" }}>
              2 — Responsabilité de l'utilisateur
            </div>
            <p style={{ margin: "0 0 8px 0", color: textSub }}>
              L'utilisateur est seul et unique responsable de sa pratique de la détection sur le terrain et de l'usage qu'il fait des informations cartographiques. L'application GeoProspect rappelle et impose le respect strict des réglementations en vigueur :
            </p>
            <ul style={{ margin: 0, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "6px", color: textSub }}>
              <li>
                Propriété privée (Articles 544 et 552 du Code civil) : toute prospection sur un terrain privé nécessite impérativement l'accord préalable du propriétaire du sol.
              </li>
              <li>
                Code du patrimoine (Article L. 542-1) : nul ne peut utiliser du matériel de détection d'objets métalliques à l'effet de recherches de monuments ou d'objets pouvant intéresser la préhistoire, l'histoire, l'art ou l'archéologie sans autorisation préfectorale préalable.
              </li>
              <li>
                Découvertes fortuites (Article L. 531-14 du Code du patrimoine) : tout objet ou vestige d'intérêt historique découvert de façon fortuite doit être immédiatement déclaré auprès de la mairie et du Service Régional de l'Archéologie (DRAC).
              </li>
              <li>
                Éthique et environnement : l'utilisateur s'engage à reboucher systématiquement tous ses trous de prospection et à ramasser les déchets métalliques polluants.
              </li>
            </ul>
          </div>

          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: sheetBg,
              border: `1px solid ${cardBorder}`
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "400", color: textMain, marginBottom: "6px" }}>
              3 — Données personnelles et confidentialité
            </div>
            <p style={{ margin: "0 0 8px 0", color: textSub }}>
              GeoProspect respecte votre vie privée et applique le principe de minimisation des données :
            </p>
            <ul style={{ margin: 0, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "6px", color: textSub }}>
              <li>
                Données collectées : adresse email (si création de compte), pseudonyme de prospecteur, coordonnées GPS et photographies de vos trouvailles.
              </li>
              <li>
                Usage strict : vos données ne sont utilisées que pour assurer le fonctionnement de votre carnet de détection et la synchronisation entre vos appareils.
              </li>
              <li>
                Aucune revente : aucune donnée personnelle, coordonnée GPS ou image n'est vendue, louée, cédée ou partagée à des régies publicitaires ou tiers commerciaux.
              </li>
            </ul>
          </div>

          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: sheetBg,
              border: `1px solid ${cardBorder}`
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "400", color: textMain, marginBottom: "6px" }}>
              4 — Traceurs et cookies publicitaires
            </div>
            <p style={{ margin: 0, color: textSub }}>
              GeoProspect n'utilise aucun cookie publicitaire ni outil d'analyse comportementale tierce. Le stockage local du navigateur (IndexedDB et localStorage) est exclusivement réservé au fonctionnement technique du carnet de détection.
            </p>
          </div>

          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: sheetBg,
              border: `1px solid ${cardBorder}`
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "400", color: textMain, marginBottom: "6px" }}>
              5 — Droit à l'oubli et suppression
            </div>
            <p style={{ margin: 0, color: textSub }}>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et d'effacement total de vos données via l'option Suppression définitive du compte dans les paramètres.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 18px",
            borderTop: `1px solid ${cardBorder}`,
            display: "flex",
            justifyContent: "flex-end",
            background: sheetBg
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 18px",
              borderRadius: "10px",
              border: "none",
              background: "#2c5e4c",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: "400",
              cursor: "pointer"
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
