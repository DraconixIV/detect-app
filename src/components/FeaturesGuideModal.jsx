import React, { useState } from "react";

const FEATURES_DATA = [
  {
    category: "maps",
    categoryLabel: "Cartographie & Histoire",
    categoryEmoji: "🗺️",
    features: [
      {
        title: "Superposition du Cadastre Officiel IGN",
        icon: "📐",
        badge: "Officiel",
        badgeColor: "#2563eb",
        description: "Affiche le découpage parcellaire officiel, les limites de propriétés et les numéros de sections pour situer vos autorisations avec précision."
      },
      {
        title: "Carte de Cassini (XVIIIe siècle)",
        icon: "📜",
        badge: "Historique",
        badgeColor: "#d97706",
        description: "Explorez la toute première carte générale du royaume de France pour repérer les anciens moulins, chapelles, gués, châteaux et chemins séculaires."
      },
      {
        title: "Carte de l'État-Major (1820 — 1866)",
        icon: "⚔️",
        badge: "XIXe siècle",
        badgeColor: "#059669",
        description: "Superposez les levés topographiques militaires du XIXe siècle pour identifier l'évolution des parcelles et l'ancien réseau viaire rural."
      },
      {
        title: "Imagerie Satellite HD & Relief Topographique",
        icon: "🛰️",
        badge: "HD",
        badgeColor: "#7c3aed",
        description: "Basculez entre vue aérienne haute définition et modèle numérique de relief avec courbes de niveau pour analyser les dénivelés du terrain."
      },
      {
        title: "Curseur de Transparence / Opacité en Direct",
        icon: "🎚️",
        badge: "Temps réel",
        badgeColor: "#0284c7",
        description: "Ajustez la transparence de chaque couche historique pour voir le cadastre ou le satellite en transparence sous la carte ancienne."
      }
    ]
  },
  {
    category: "finds",
    categoryLabel: "Trouvailles & Photos HD",
    categoryEmoji: "🪙",
    features: [
      {
        title: "Pointage Précis & Clic Long Carte",
        icon: "📍",
        badge: "GPS",
        badgeColor: "#2563eb",
        description: "Épinglez instantanément une découverte avec vos coordonnées GPS réelles ou ciblez n'importe quel point précis de la carte par un appui long."
      },
      {
        title: "Photos Macro Avant / Après Nettoyage",
        icon: "✨",
        badge: "HD",
        badgeColor: "#10b981",
        description: "Ajoutez une photo de découverte brute (en terre) puis une photo après restauration pour apprécier l'évolution du nettoyage."
      },
      {
        title: "Recadrage Macro & Loupe Circulaire",
        icon: "🔍",
        badge: "Studio",
        badgeColor: "#f59e0b",
        description: "Recadrez et zoomez directement sur les détails des monnaies, fibules et reliefs fins sans quitter l'application."
      },
      {
        title: "Notes Vocales Dictées sur le Terrain",
        icon: "🎙️",
        badge: "Audio",
        badgeColor: "#ef4444",
        description: "Enregistrez un mémo vocal direct pour consigner le contexte du son, la profondeur ou le type de terre sans avoir à taper sur le clavier."
      },
      {
        title: "Classification & Émojis Personnalisés",
        icon: "🏷️",
        badge: "Sur-mesure",
        badgeColor: "#8b5cf6",
        description: "Créez vos propres catégories, sous-catégories et associez-y des métaux (Or, Argent, Bronze, Fer, Cuivre, Plomb...) avec leurs couleurs repères."
      }
    ]
  },
  {
    category: "gps",
    categoryLabel: "Traceur GPS & Télémétrie",
    categoryEmoji: "⏱️",
    features: [
      {
        title: "Ligne de Tracé GPS en Direct (Fil d'Ariane)",
        icon: "🔴",
        badge: "Direct",
        badgeColor: "#ef4444",
        description: "Visualisez en temps réel votre parcours sur la carte pour prospecter méthodiquement et ne jamais repasser au même endroit."
      },
      {
        title: "Compteur de Cibles Dynamique",
        icon: "🎯",
        badge: "Live",
        badgeColor: "#f59e0b",
        description: "Le bandeau de télémétrie démarre à 0 et comptabilise automatiquement le nombre de trouvailles épinglées pendant la sortie."
      },
      {
        title: "Télémétrie Complète (Distance, Chrono, Pause)",
        icon: "📊",
        badge: "Métriques",
        badgeColor: "#06b6d4",
        description: "Chronomètre avec mise en pause, calcul de la distance parcourue en kilomètres et protection contre les sauts GPS aberrants."
      },
      {
        title: "Historique & Revisualisation des Sorties",
        icon: "🗺️",
        badge: "Journal",
        badgeColor: "#3b82f6",
        description: "Sauvegardez vos sorties avec un nom personnalisé et réaffichez le tracé complet d'une journée passée sur la carte."
      }
    ]
  },
  {
    category: "team",
    categoryLabel: "Sessions en Équipe Multijoueur",
    categoryEmoji: "👥",
    features: [
      {
        title: "Partage GPS en Direct entre Coéquipiers",
        icon: "📡",
        badge: "Multijoueur",
        badgeColor: "#10b981",
        description: "Visualisez les positions de vos amis en temps réel sous forme de pastilles sur la carte pour rester coordonnés sur les grands terrains."
      },
      {
        title: "Alertes Trouvailles Instantanées",
        icon: "🔔",
        badge: "Temps réel",
        badgeColor: "#f59e0b",
        description: "Soyez notifié dès qu'un coéquipier enregistre une découverte remarquable dans le champ avec son nom et sa catégorie."
      },
      {
        title: "Code de Session Privé & Modération",
        icon: "🔒",
        badge: "Sécurité",
        badgeColor: "#6366f1",
        description: "Rejoignez une session avec un code unique à 6 lettres. L'hôte peut verrouiller la session ou exclure un participant."
      }
    ]
  },
  {
    category: "offline",
    categoryLabel: "Mode 100 % Hors-Ligne & Cloud",
    categoryEmoji: "💾",
    features: [
      {
        title: "Fonctionnement Total Sans Réseau (PWA)",
        icon: "🌲",
        badge: "Hors-ligne",
        badgeColor: "#059669",
        description: "Enregistrez vos trouvailles, photos et tracés même au fond des bois sans aucune couverture 4G grâce au stockage IndexedDB."
      },
      {
        title: "Synchronisation Automatique Silencieuse",
        icon: "🔄",
        badge: "Auto",
        badgeColor: "#2563eb",
        description: "Dès que votre téléphone capte à nouveau une connexion Internet, vos trouvailles en attente sont transmises à votre carnet cloud."
      },
      {
        title: "Sauvegardes Complètes JSON (Export / Import)",
        icon: "📁",
        badge: "Sécurité",
        badgeColor: "#d97706",
        description: "Téléchargez l'intégralité de vos trouvailles et paramètres dans un fichier de sauvegarde local réimportable à tout moment."
      }
    ]
  },
  {
    category: "tools",
    categoryLabel: "Boîte à Outils & Confort",
    categoryEmoji: "🧰",
    features: [
      {
        title: "Simulateur Pile ou Face 3D",
        icon: "🪙",
        badge: "Pratique",
        badgeColor: "#f59e0b",
        description: "Une pièce 3D réaliste pour trancher vos choix sur le terrain (continuer à gauche ou à droite ? quel champ explorer ?)."
      },
      {
        title: "Mode Sombre & Thème Clair Adaptatif",
        icon: "🌓",
        badge: "Visibilité",
        badgeColor: "#64748b",
        description: "Basculez entre thème sombre immersif et thème clair à fort contraste pour une lisibilité optimale sous le plein soleil."
      },
      {
        title: "Mode Zen & Maintien de l'Écran Allumé",
        icon: "🧘",
        badge: "Confort",
        badgeColor: "#10b981",
        description: "Masquez l'interface inutile pour admirer la carte et activez le Wake Lock pour que votre écran ne s'éteigne jamais pendant la marche."
      },
      {
        title: "Regroupement Intelligent des Marqueurs (Clustering)",
        icon: "🫧",
        badge: "Fluidité",
        badgeColor: "#3b82f6",
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
  const bgModal = isLight ? "#ffffff" : "#0f172a";
  const textMain = isLight ? "#0f172a" : "#ffffff";
  const textSub = isLight ? "#475569" : "#94a3b8";
  const cardBg = isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.04)";
  const cardBorder = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.12)";
  const inputBg = isLight ? "#f1f5f9" : "#1e293b";
  const inputBorder = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.16)";

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
          maxWidth: "540px",
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
            <span style={{ fontSize: "22px" }}>📖</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: textMain }}>
                Guide des Fonctionnalités
              </h3>
              <p style={{ margin: 0, fontSize: "11px", color: textSub }}>
                Toutes les capacités de votre carnet GeoProspect
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

        {/* Search & Category Filter bar */}
        <div
          style={{
            padding: "12px 20px",
            borderBottom: `1px solid ${cardBorder}`,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.02)"
          }}
        >
          {/* Search Input */}
          <input
            type="text"
            placeholder="🔍 Rechercher une fonctionnalité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 14px",
              borderRadius: "12px",
              border: `1px solid ${inputBorder}`,
              background: inputBg,
              color: textMain,
              fontSize: "12px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />

          {/* Category Filter Chips */}
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
                borderRadius: "10px",
                border: activeCategory === "all" ? "1px solid #3b82f6" : `1px solid ${cardBorder}`,
                background: activeCategory === "all" ? (isLight ? "#eff6ff" : "rgba(59, 130, 246, 0.2)") : "transparent",
                color: activeCategory === "all" ? (isLight ? "#1e40af" : "#93c5fd") : textSub,
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              🌟 Tout voir
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
                    borderRadius: "10px",
                    border: isSelected ? "1px solid #3b82f6" : `1px solid ${cardBorder}`,
                    background: isSelected ? (isLight ? "#eff6ff" : "rgba(59, 130, 246, 0.2)") : "transparent",
                    color: isSelected ? (isLight ? "#1e40af" : "#93c5fd") : textSub,
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <span>{cat.categoryEmoji}</span>
                  <span>{cat.categoryLabel.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content list */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
        >
          {filteredCategories.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 10px", color: textSub }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
              <div style={{ fontWeight: "700", fontSize: "14px", color: textMain }}>
                Aucune fonctionnalité trouvée
              </div>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                Essayez d'autres mots-clés ou réinitialisez la recherche.
              </div>
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div key={cat.category} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>{cat.categoryEmoji}</span>
                  <span style={{ fontSize: "13px", fontWeight: "800", color: textMain, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {cat.categoryLabel}
                  </span>
                  <span style={{ fontSize: "11px", color: textSub, fontWeight: "600" }}>
                    ({cat.features.length})
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {cat.features.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "14px",
                        background: cardBg,
                        border: `1px solid ${cardBorder}`,
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start"
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.08)",
                          border: `1px solid ${cardBorder}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          flexShrink: 0
                        }}
                      >
                        {f.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "3px" }}>
                          <div style={{ fontSize: "13px", fontWeight: "800", color: textMain }}>
                            {f.title}
                          </div>
                          {f.badge && (
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: "800",
                                padding: "2px 7px",
                                borderRadius: "6px",
                                background: isLight ? "#eff6ff" : "rgba(59, 130, 246, 0.15)",
                                color: f.badgeColor || "#3b82f6",
                                border: `1px solid ${f.badgeColor}40`,
                                flexShrink: 0
                              }}
                            >
                              {f.badge}
                            </span>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: "11.5px", color: textSub, lineHeight: "1.45" }}>
                          {f.description}
                        </p>
                      </div>
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
