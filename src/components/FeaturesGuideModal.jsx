import React, { useState } from "react";

const FEATURES_DATA = [
  {
    category: "maps",
    categoryLabel: "Cartographie",
    features: [
      {
        title: "Superposition du cadastre officiel IGN",
        description: "Affiche le découpage parcellaire officiel, les limites de propriétés et les numéros de sections pour situer vos autorisations avec précision."
      },
      {
        title: "Carte de Cassini (XVIIIe siècle)",
        description: "Explorez la toute première carte générale du royaume de France pour repérer les anciens moulins, chapelles, gués, châteaux et chemins séculaires."
      },
      {
        title: "Carte de l'état-major (1820 — 1866)",
        description: "Superposez les levés topographiques militaires du XIXe siècle pour identifier l'évolution des parcelles et l'ancien réseau viaire rural."
      },
      {
        title: "Imagerie satellite HD",
        description: "Basculez entre vue aérienne haute définition et modèle numérique de relief avec courbes de niveau pour analyser les dénivelés du terrain."
      },
      {
        title: "Curseur de transparence en direct",
        description: "Ajustez la transparence de chaque couche historique pour voir le cadastre ou le satellite en transparence sous la carte ancienne."
      }
    ]
  },
  {
    category: "finds",
    categoryLabel: "Trouvailles",
    features: [
      {
        title: "Pointage GPS précis",
        description: "Épinglez instantanément une découverte avec vos coordonnées GPS réelles ou ciblez n'importe quel point précis de la carte par un appui long."
      },
      {
        title: "Photos macro avant / après nettoyage",
        description: "Ajoutez une photo de découverte brute (en terre) puis une photo après restauration pour apprécier l'évolution du nettoyage."
      },
      {
        title: "Recadrage macro",
        description: "Recadrez et zoomez directement sur les détails des monnaies, fibules et reliefs fins sans quitter l'application."
      },
      {
        title: "Notes vocales dictées sur le terrain",
        description: "Enregistrez un mémo vocal direct pour consigner le contexte du son, la profondeur ou le type de terre sans avoir à taper sur le clavier."
      },
      {
        title: "Catégories personnalisées",
        description: "Créez vos propres catégories, sous-catégories et associez-y des métaux (or, argent, bronze, fer, cuivre, plomb...) avec leurs couleurs repères."
      }
    ]
  },
  {
    category: "gps",
    categoryLabel: "Traceur GPS",
    features: [
      {
        title: "Ligne de tracé GPS en direct",
        description: "Visualisez en temps réel votre parcours sur la carte pour prospecter méthodiquement et ne jamais repasser au même endroit."
      },
      {
        title: "Compteur de cibles dynamique",
        description: "Le bandeau de télémétrie démarre à 0 et comptabilise automatiquement le nombre de trouvailles épinglées pendant la sortie."
      },
      {
        title: "Télémétrie complète",
        description: "Chronomètre avec mise en pause, calcul de la distance parcourue en kilomètres et protection contre les sauts GPS aberrants."
      },
      {
        title: "Historique des sorties",
        description: "Sauvegardez vos sorties avec un nom personnalisé et réaffichez le tracé complet d'une journée passée sur la carte."
      }
    ]
  },
  {
    category: "team",
    categoryLabel: "Sessions en équipe",
    features: [
      {
        title: "Partage GPS en direct entre coéquipiers",
        description: "Visualisez les positions de vos amis en temps réel sous forme de pastilles sur la carte pour rester coordonnés sur les grands terrains."
      },
      {
        title: "Alertes trouvailles instantanées",
        description: "Soyez notifié dès qu'un coéquipier enregistre une découverte remarquable dans le champ avec son nom et sa catégorie."
      },
      {
        title: "Code de session privé",
        description: "Rejoignez une session avec un code unique à 6 lettres. L'hôte peut verrouiller la session ou exclure un participant."
      }
    ]
  },
  {
    category: "offline",
    categoryLabel: "Mode hors-ligne",
    features: [
      {
        title: "Fonctionnement sans réseau (Hors-ligne)",
        description: "Enregistrez vos trouvailles, photos et tracés même au fond des bois sans aucune couverture 4G grâce au stockage IndexedDB."
      },
      {
        title: "Synchronisation automatique silencieuse",
        description: "Dès que votre téléphone capte à nouveau une connexion Internet, vos trouvailles en attente sont transmises à votre carnet de détection cloud."
      },
      {
        title: "Sauvegardes complètes JSON",
        description: "Téléchargez l'intégralité de vos trouvailles et paramètres dans un fichier de sauvegarde local réimportable à tout moment."
      }
    ]
  },
  {
    category: "tools",
    categoryLabel: "Boîte à outils",
    features: [
      {
        title: "Mode sombre et clair",
        description: "Basculez entre thème sombre immersif et thème clair à fort contraste pour une lisibilité optimale sous le plein soleil."
      },
      {
        title: "Mode zen",
        description: "Masquez l'interface inutile pour admirer la carte et activez le Wake Lock pour que votre écran ne s'éteigne jamais pendant la marche."
      },
      {
        title: "Regroupement des marqueurs (clustering)",
        description: "Les centaines de points de découvertes se regroupent automatiquement en grappes fluides pour ne jamais saturer l'affichage."
      }
    ]
  }
];

export default function FeaturesGuideModal({ isOpen, onClose, theme = "dark" }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const isLight = theme === "light";
  const bgModal = isLight ? "#f3f4f2" : "#111915";
  const sheetBg = isLight ? "#ffffff" : "#19231e";
  const inputBg = isLight ? "#f3f4f2" : "#111915";
  const cardBorder = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.08)";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";

  const filteredCategories = FEATURES_DATA.map((cat) => {
    const matchingFeatures = cat.features.filter((f) => {
      const matchSearch =
        !searchQuery.trim() ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === "all" || cat.category === activeCategory;
      return matchSearch && matchCat;
    });

    return {
      ...cat,
      features: matchingFeatures
    };
  }).filter((cat) => cat.features.length > 0);

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
        {/* Forest Header */}
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
              Guide des fonctionnalités
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "rgba(255,255,255,0.75)" }}>
              Capacités de votre carnet de détection GeoProspect
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

        {/* Search & Category Filter bar */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${cardBorder}`,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: sheetBg
          }}
        >
          <input
            type="text"
            placeholder="Rechercher une fonctionnalité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "10px",
              border: `1px solid ${cardBorder}`,
              background: inputBg,
              color: textMain,
              fontSize: "12px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              paddingBottom: "2px"
            }}
          >
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              style={{
                padding: "6px 12px",
                borderRadius: "999px",
                border: "none",
                background: activeCategory === "all" ? "#2c5e4c" : inputBg,
                color: activeCategory === "all" ? "#ffffff" : textSub,
                fontSize: "11px",
                fontWeight: "400",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              Tout voir
            </button>
            {FEATURES_DATA.map((cat) => {
              const isSelected = activeCategory === cat.category;
              return (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setActiveCategory(cat.category)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "999px",
                    border: "none",
                    background: isSelected ? "#2c5e4c" : inputBg,
                    color: isSelected ? "#ffffff" : textSub,
                    fontSize: "11px",
                    fontWeight: "400",
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  {cat.categoryLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content list */}
        <div
          style={{
            padding: "16px 18px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          {filteredCategories.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 10px", color: textSub }}>
              <div style={{ fontWeight: "400", fontSize: "13px", color: textMain }}>
                Aucune fonctionnalité trouvée
              </div>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                Essayez d'autres termes de recherche.
              </div>
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div key={cat.category} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {cat.categoryLabel} ({cat.features.length})
                </div>

                <div
                  style={{
                    background: sheetBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: "16px",
                    overflow: "hidden"
                  }}
                >
                  {cat.features.map((f, i, arr) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px 14px",
                        borderBottom: i < arr.length - 1 ? `1px solid ${cardBorder}` : "none"
                      }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: "400", color: textMain, marginBottom: "3px" }}>
                        {f.title}
                      </div>
                      <p style={{ margin: 0, fontSize: "11.5px", color: textSub, lineHeight: "1.45" }}>
                        {f.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
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
