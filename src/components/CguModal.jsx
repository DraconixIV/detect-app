import React from "react";

export default function CguModal({ isOpen, onClose, theme = "dark" }) {
  if (!isOpen) return null;

  const isLight = theme === "light";
  const bgModal = isLight ? "#ffffff" : "#0f172a";
  const textMain = isLight ? "#0f172a" : "#ffffff";
  const textSub = isLight ? "#475569" : "#94a3b8";
  const cardBg = isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.04)";
  const cardBorder = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.12)";
  const accentColor = isLight ? "#2563eb" : "#38bdf8";

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
          maxWidth: "520px",
          maxHeight: "88vh",
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
            <span style={{ fontSize: "22px" }}>⚖️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: textMain }}>
                Conditions Générales d'Utilisation
              </h3>
              <p style={{ margin: 0, fontSize: "11px", color: textSub }}>
                Mentions Légales & Confidentialité des Données (RGPD)
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

        {/* Content */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            fontSize: "12px",
            lineHeight: "1.6",
            color: isLight ? "#334155" : "#cbd5e1"
          }}
        >
          {/* Article 1 */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: cardBg,
              border: `1px solid ${cardBorder}`
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "800", color: accentColor, marginBottom: "6px" }}>
              Article 1 — Objet & Nature du Service
            </div>
            <p style={{ margin: 0 }}>
              <strong>GeoProspect</strong> est une application web progressive (PWA) conçue bénévolement et mise à disposition à titre gratuit. Elle constitue un <strong>carnet de bord numérique personnel</strong> permettant aux passionnés de détection de loisir d'enregistrer leurs trouvailles, de visualiser des fonds de cartes géographiques et de suivre leurs parcours GPS.
            </p>
          </div>

          {/* Article 2 */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: cardBg,
              border: `1px solid ${cardBorder}`
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "800", color: accentColor, marginBottom: "6px" }}>
              Article 2 — Cadre Légal & Responsabilité de l'Utilisateur
            </div>
            <p style={{ margin: "0 0 8px 0" }}>
              L'utilisateur est <strong>seul et unique responsable</strong> de sa pratique de la détection sur le terrain et de l'usage qu'il fait des informations cartographiques. L'application GeoProspect rappelle et impose le respect strict des réglementations en vigueur :
            </p>
            <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>
                <strong>Propriété privée (Art. 544 et 552 du Code civil) :</strong> Toute prospection sur un terrain privé nécessite impérativement l'autorisation préalable du propriétaire du sol.
              </li>
              <li>
                <strong>Code du patrimoine (Art. L. 542-1) :</strong> Nul ne peut utiliser du matériel de détection d'objets métalliques à l'effet de recherches de monuments ou d'objets pouvant intéresser la préhistoire, l'histoire, l'art ou l'archéologie sans autorisation préfectorale préalable.
              </li>
              <li>
                <strong>Découvertes fortuites (Art. L. 531-14) :</strong> Tout objet ou vestige d'intérêt historique découvert de façon fortuite doit être immédiatement déclaré auprès de la mairie et du Service Régional de l'Archéologie (DRAC).
              </li>
              <li>
                <strong>Éthique & Environnement :</strong> L'utilisateur s'engage à reboucher systématiquement tous ses trous de prospection et à ramasser les déchets métalliques polluants.
              </li>
            </ul>
          </div>

          {/* Article 3 */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: cardBg,
              border: `1px solid ${cardBorder}`
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "800", color: accentColor, marginBottom: "6px" }}>
              Article 3 — Données Personnelles & Confidentialité (RGPD)
            </div>
            <p style={{ margin: "0 0 8px 0" }}>
              GeoProspect respecte scrupuleusement votre vie privée et applique le principe de minimisation des données :
            </p>
            <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>
                <strong>Données collectées :</strong> Adresse email (si création de compte), pseudonyme de prospecteur, coordonnées GPS et photographies de vos trouvailles.
              </li>
              <li>
                <strong>Usage strict :</strong> Vos données ne sont utilisées <em>que</em> pour assurer le fonctionnement de votre carnet de bord et la synchronisation entre vos appareils.
              </li>
              <li>
                <strong>Aucune Revente :</strong> Aucune donnée personnelle, coordonnée GPS ou image n'est vendue, louée, cédée ou partagée à des régies publicitaires ou tiers commerciaux.
              </li>
            </ul>
          </div>

          {/* Article 4 */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: cardBg,
              border: `1px solid ${cardBorder}`
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "800", color: accentColor, marginBottom: "6px" }}>
              Article 4 — Absence de Cookies Publicitaires & Traçage
            </div>
            <p style={{ margin: 0 }}>
              GeoProspect n'utilise <strong>aucun cookie publicitaire, aucun outil d'analyse comportementale tierce</strong> (Google Analytics, Facebook Pixel, etc.). Les technologies de stockage local du navigateur (<code>IndexedDB</code> et <code>localStorage</code>) sont exclusivement réservées au fonctionnement technique du carnet de bord (mémorisation de votre thème, stockage hors-ligne de vos tracés et session d'authentification).
            </p>
          </div>

          {/* Article 5 */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: cardBg,
              border: `1px solid ${cardBorder}`
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "800", color: accentColor, marginBottom: "6px" }}>
              Article 5 — Droit à l'Oubli & Suppression Totale
            </div>
            <p style={{ margin: 0 }}>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et d'effacement total de vos données. L'option <strong>« Suppression définitive du compte »</strong> accessible dans les Paramètres (Zone de danger) permet de détruire immédiatement, intégralement et de façon irréversible l'ensemble de votre compte, de vos coordonnées, photos, notes vocales et tracés de nos serveurs.
            </p>
          </div>

          {/* Article 6 */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              background: cardBg,
              border: `1px solid ${cardBorder}`
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "800", color: accentColor, marginBottom: "6px" }}>
              Article 6 — Gratuité & Disponibilité du Service
            </div>
            <p style={{ margin: 0 }}>
              L'application est proposée 100 % gratuitement et sans publicité. Le développeur bénévole met en œuvre tous les moyens raisonnables pour assurer la continuité et la sécurité du service, sans garantie d'absence totale d'interruption temporaire ou de bugs. L'utilisateur est invité à exporter régulièrement des sauvegardes locales de son journal.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: `1px solid ${cardBorder}`,
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "white",
              fontSize: "13px",
              fontWeight: "700",
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
