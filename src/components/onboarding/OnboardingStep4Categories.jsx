import React from "react";
import { PRESET_CATEGORY_COLORS, SUGGESTED_STARTER_CATEGORIES } from "../../subCategories";
import { RECOMMENDED_METALS } from "../../services/materialsService";

const DETECTORIST_EMOJIS = [
  // Monnaies, Trésors & Précieux
  "🪙", "💰", "🥇", "🥈", "🥉", "💎", "💍", "👑", "📿", "🏆", "🎖️", "🏅", "⚜️",
  // Antiquités, Objets Historiques & Archéologie
  "🏺", "🗿", "🏛️", "📜", "🗝️", "🔑", "🔒", "🪞", "🕯️", "⌛", "⏳", "🧱", "✝️",
  // Militaria, Armes & Boucles
  "🛡️", "⚔️", "🗡️", "🏹", "💣", "🪖", "🎯", "🔫", "🪓", "🪚", "⚙️", "🥨",
  // Quincaillerie, Outils, Fixations & Ferraille
  "🔔", "⚓", "🧲", "🔨", "⛏️", "🔧", "🔩", "🪛", "🖇️", "📎", "✂️", "🪡", "🧷", "🥄", "🍴", "👞", "👝", "🏷️", "📦", "🔘", "🥫", "🎣", "⛓️", "🪜", "🪤", "🪨",
  // Métaux, Matières, Éléments & Minéraux
  "🟫", "💿", "⚖️", "🧪", "🔬", "🪵", "🧭", "🔍", "⚡", "🌟", "✨",
  // Pastilles de repérage
  "🟡", "⚪", "🟤", "🔴", "🟢", "🔵", "🟣", "⚫"
];

const COMMON_EMOJIS = DETECTORIST_EMOJIS;
const METAL_EMOJIS = DETECTORIST_EMOJIS;

export default function OnboardingStep4Categories({
  isDark,
  cardBg,
  cardBorder,
  inputBg,
  inputBorder,
  textMain,
  textSub,
  step4Tab,
  setStep4Tab,
  categories,
  emojis,
  colors,
  materials,
  materialEmojis,
  newCatName,
  setNewCatName,
  newCatEmoji,
  setNewCatEmoji,
  newCatColor,
  setNewCatColor,
  newSubText,
  setNewSubText,
  targetCategoryForSub,
  setTargetCategoryForSub,
  expandedCat,
  setExpandedCat,
  inlineSubInput,
  setInlineSubInput,
  newMetalName,
  setNewMetalName,
  newMetalEmoji,
  setNewMetalEmoji,
  handleToggleStarter,
  handleAddCustomCategory,
  handleAddCustomSubCategory,
  handleRemoveCategory,
  handleAddSubInline,
  handleRemoveSubInline,
  handleToggleRecommendedMetal,
  handleAddCustomMetal,
  handleRemoveMetal,
  onBack,
  onNext
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "900", color: textMain, letterSpacing: "-0.5px" }}>
          Votre classification :
        </h1>
        <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
          Définissez vos catégories d'objets, leurs repères visibles sur la carte et choisissez les métaux associés à vos futures trouvailles.
        </p>
      </div>

      {/* Sub-Tabs Switcher */}
      <div
        style={{
          display: "flex",
          background: isDark ? "#1e293b" : "#f1f5f9",
          borderRadius: "12px",
          padding: "4px",
          border: `1px solid ${cardBorder}`,
          gap: "4px"
        }}
      >
        <button
          type="button"
          onClick={() => setStep4Tab("categories")}
          style={{
            flex: 1,
            padding: "9px 12px",
            borderRadius: "9px",
            border: "none",
            background: step4Tab === "categories" ? (isDark ? "#2563eb" : "#ffffff") : "transparent",
            color: step4Tab === "categories" ? "#ffffff" : textSub,
            fontWeight: step4Tab === "categories" ? "800" : "600",
            fontSize: "12px",
            cursor: "pointer",
            boxShadow: step4Tab === "categories" ? "0 2px 4px rgba(0,0,0,0.15)" : "none",
            transition: "all 0.15s ease"
          }}
        >
          Catégories d'objets ({Object.keys(categories).length})
        </button>
        <button
          type="button"
          onClick={() => setStep4Tab("metals")}
          style={{
            flex: 1,
            padding: "9px 12px",
            borderRadius: "9px",
            border: "none",
            background: step4Tab === "metals" ? (isDark ? "#2563eb" : "#ffffff") : "transparent",
            color: step4Tab === "metals" ? "#ffffff" : textSub,
            fontWeight: step4Tab === "metals" ? "800" : "600",
            fontSize: "12px",
            cursor: "pointer",
            boxShadow: step4Tab === "metals" ? "0 2px 4px rgba(0,0,0,0.15)" : "none",
            transition: "all 0.15s ease"
          }}
        >
          Métaux ({materials.length})
        </button>
      </div>

      {/* TAB 1: FAMILLES D'OBJETS */}
      {step4Tab === "categories" && (
        <>
          {/* Quick 1-click Suggestion Chips (Toggleables) */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "14px",
              padding: "12px 14px"
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
              💡 Suggestions en 1 clic (cliquez pour activer / désactiver) :
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {Object.keys(SUGGESTED_STARTER_CATEGORIES).map((starterName) => {
                const item = SUGGESTED_STARTER_CATEGORIES[starterName];
                const isAlreadyAdded = !!categories[starterName];
                return (
                  <button
                    key={starterName}
                    type="button"
                    onClick={() => handleToggleStarter(starterName)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "10px",
                      border: isAlreadyAdded ? `1.5px solid ${item.color}` : `1px solid ${cardBorder}`,
                      background: isAlreadyAdded ? (isDark ? "rgba(37,99,235,0.25)" : "#eff6ff") : (isDark ? "#1e293b" : "#ffffff"),
                      color: isAlreadyAdded ? (isDark ? "#93c5fd" : "#1e3a8a") : textSub,
                      fontSize: "12px",
                      fontWeight: isAlreadyAdded ? "700" : "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                      boxShadow: isAlreadyAdded ? "0 1px 4px rgba(37,99,235,0.2)" : "0 1px 3px rgba(0,0,0,0.04)"
                    }}
                    title={isAlreadyAdded ? `Cliquer pour retirer la catégorie ${starterName}` : `Cliquer pour ajouter la catégorie ${starterName}`}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: item.color,
                        display: "inline-block",
                        opacity: isAlreadyAdded ? 1 : 0.6
                      }}
                    />
                    <span>{item.emoji} {starterName}</span>
                    <span
                      style={{
                        color: isAlreadyAdded ? "#10b981" : (isDark ? "#64748b" : "#94a3b8"),
                        fontWeight: "900",
                        fontSize: "11px"
                      }}
                    >
                      {isAlreadyAdded ? "✓" : "+"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Category Creation Form */}
          <form
            onSubmit={handleAddCustomCategory}
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "16px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Créer une catégorie :
            </div>

            {/* Nom */}
            <input
              type="text"
              placeholder="Ex : Objets militaires, Déchets ferreux, Fibules..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "10px",
                border: `1px solid ${inputBorder}`,
                background: inputBg,
                color: textMain,
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />

            {/* Grille complète d'émojis */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: textSub, marginBottom: "6px" }}>
                Émoji associé :
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  maxHeight: "120px",
                  overflowY: "auto",
                  padding: "6px",
                  background: inputBg,
                  border: `1px solid ${inputBorder}`,
                  borderRadius: "10px"
                }}
              >
                {COMMON_EMOJIS.map((em) => {
                  const isSelected = newCatEmoji === em;
                  return (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewCatEmoji(em)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border: isSelected ? "2px solid #3b82f6" : `1px solid ${cardBorder}`,
                        background: isSelected ? (isDark ? "rgba(37,99,235,0.3)" : "#eff6ff") : (isDark ? "#1e293b" : "#f8fafc"),
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        padding: 0,
                        transform: isSelected ? "scale(1.12)" : "scale(1)",
                        transition: "all 0.12s ease"
                      }}
                      title={em}
                    >
                      {em}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sous-catégories avec libellé et placeholder harmonisé */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: textSub }}>
                  Sous-catégories :
                </div>
                {Object.keys(categories).length > 0 && (
                  <div style={{ fontSize: "11px", color: textSub, display: "flex", alignItems: "center", gap: "4px" }}>
                    <span>associer à :</span>
                    <select
                      value={targetCategoryForSub || (expandedCat && categories[expandedCat] ? expandedCat : Object.keys(categories)[0])}
                      onChange={(e) => setTargetCategoryForSub(e.target.value)}
                      style={{
                        padding: "2px 6px",
                        borderRadius: "6px",
                        border: `1px solid ${inputBorder}`,
                        background: inputBg,
                        color: textMain,
                        fontSize: "11px",
                        fontWeight: "700",
                        outline: "none",
                        cursor: "pointer"
                      }}
                    >
                      {Object.keys(categories).map((c) => (
                        <option key={c} value={c} style={{ background: isDark ? "#0f172a" : "#ffffff", color: textMain }}>
                          {emojis[c] || "📦"} {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Ex: Antique, Médiéval, Moderne..."
                value={newSubText}
                onChange={(e) => setNewSubText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "10px",
                  border: `1px solid ${inputBorder}`,
                  background: inputBg,
                  color: textMain,
                  fontSize: "12px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Color Swatch Picker */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: textSub, marginBottom: "6px" }}>
                🎨 Couleur du repère carte :
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                {PRESET_CATEGORY_COLORS.map((colorHex) => {
                  const isSelected = newCatColor === colorHex;
                  return (
                    <button
                      key={colorHex}
                      type="button"
                      onClick={() => setNewCatColor(colorHex)}
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: colorHex,
                        border: isSelected ? (isDark ? "2.5px solid #ffffff" : "2.5px solid #0f172a") : "1.5px solid rgba(0,0,0,0.15)",
                        boxShadow: isSelected ? `0 0 6px ${colorHex}` : "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: isSelected ? "scale(1.2)" : "scale(1)",
                        transition: "all 0.15s ease"
                      }}
                      title={colorHex}
                    >
                      {isSelected && <span style={{ color: "#ffffff", fontSize: "10px", fontWeight: "900" }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={!newCatName.trim()}
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: newCatName.trim() ? "linear-gradient(135deg, #10b981, #059669)" : (isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"),
                color: newCatName.trim() ? "#ffffff" : (isDark ? "rgba(255,255,255,0.3)" : "#94a3b8"),
                fontSize: "13px",
                fontWeight: "700",
                cursor: newCatName.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s ease"
              }}
            >
              + Ajouter cette catégorie
            </button>

            <button
              type="button"
              onClick={handleAddCustomSubCategory}
              disabled={!newSubText.trim() || Object.keys(categories).length === 0}
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: `1px solid ${newSubText.trim() && Object.keys(categories).length > 0 ? "#3b82f6" : cardBorder}`,
                background: newSubText.trim() && Object.keys(categories).length > 0 ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : (isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
                color: newSubText.trim() && Object.keys(categories).length > 0 ? (isDark ? "#93c5fd" : "#1d4ed8") : (isDark ? "rgba(255,255,255,0.3)" : "#94a3b8"),
                fontSize: "13px",
                fontWeight: "700",
                cursor: newSubText.trim() && Object.keys(categories).length > 0 ? "pointer" : "not-allowed",
                transition: "all 0.2s ease"
              }}
            >
              + Ajouter cette sous-catégorie
            </button>
          </form>

          {/* Configured Categories List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Vos Catégories ({Object.keys(categories).length})
              </span>
              {Object.keys(categories).length > 0 && (
                <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700" }}>
                  ✓ Prêt pour l'inventaire
                </span>
              )}
            </div>

            {Object.keys(categories).length === 0 ? (
              <div
                style={{
                  padding: "18px 14px",
                  borderRadius: "14px",
                  background: cardBg,
                  border: `1px dashed ${cardBorder}`,
                  textAlign: "center",
                  color: textSub,
                  fontSize: "12px"
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>🏷️</div>
                <div style={{ fontWeight: "700", color: textMain, marginBottom: "2px" }}>
                  0 catégorie pour le moment
                </div>
                <div>
                  Ajoutez vos catégories sur-mesure ci-dessus ou cliquez sur une suggestion rapide.
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto", paddingRight: "2px" }}>
                {Object.entries(categories).map(([catName, subCats]) => {
                  const em = emojis[catName] || "🏷️";
                  const col = colors[catName] || "#3b82f6";
                  const isExpanded = expandedCat === catName;
                  const safeSubCats = Array.isArray(subCats) ? subCats : [];

                  return (
                    <div
                      key={catName}
                      style={{
                        background: isDark ? "#1e293b" : "#f8fafc",
                        border: `1px solid ${cardBorder}`,
                        borderRadius: "12px",
                        overflow: "hidden",
                        flexShrink: 0,
                        minHeight: "44px",
                        boxSizing: "border-box"
                      }}
                    >
                      <div
                        onClick={() => setExpandedCat(isExpanded ? null : catName)}
                        style={{
                          padding: "10px 12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          userSelect: "none",
                          minHeight: "44px",
                          boxSizing: "border-box"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                          <span
                            style={{
                              width: "14px",
                              height: "14px",
                              borderRadius: "50%",
                              background: col,
                              boxShadow: `0 0 4px ${col}88`,
                              display: "inline-block",
                              flexShrink: 0
                            }}
                          />
                          <span style={{ fontSize: "16px", flexShrink: 0 }}>{em}</span>
                          <span style={{ fontSize: "13px", fontWeight: "700", color: textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {catName}
                          </span>
                          <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 6px", borderRadius: "8px", background: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0", color: textSub, flexShrink: 0 }}>
                            {safeSubCats.length} sous-types
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCategory(catName);
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#ef4444",
                              fontSize: "14px",
                              cursor: "pointer",
                              padding: "4px"
                            }}
                            title="Supprimer la catégorie"
                          >
                            🗑️
                          </button>
                          <span style={{ fontSize: "11px", color: textSub, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                            ▼
                          </span>
                        </div>
                      </div>

                      {/* Expanded Subcategories view */}
                      {isExpanded && (
                        <div
                          style={{
                            padding: "8px 12px 12px 12px",
                            borderTop: `1px solid ${cardBorder}`,
                            background: isDark ? "#0f172a" : "#f1f5f9"
                          }}
                        >
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
                            {safeSubCats.map((sub) => (
                              <span
                                key={sub}
                                style={{
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  background: isDark ? "#1e293b" : "#ffffff",
                                  border: `1px solid ${cardBorder}`,
                                  fontSize: "11px",
                                  color: textMain,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px"
                                }}
                              >
                                {sub}
                                <span
                                  onClick={() => handleRemoveSubInline(catName, sub)}
                                  style={{ cursor: "pointer", color: "#ef4444", fontWeight: "bold", fontSize: "10px" }}
                                >
                                  ×
                                </span>
                              </span>
                            ))}
                          </div>

                          {/* Add subcategory input */}
                          <div style={{ display: "flex", gap: "6px" }}>
                            <input
                              type="text"
                              placeholder={`Ajouter une sous-catégorie à ${catName}...`}
                              value={inlineSubInput}
                              onChange={(e) => setInlineSubInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddSubInline(catName);
                                }
                              }}
                              style={{
                                flex: 1,
                                padding: "6px 10px",
                                borderRadius: "8px",
                                border: `1px solid ${inputBorder}`,
                                background: inputBg,
                                color: textMain,
                                fontSize: "11px",
                                outline: "none"
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleAddSubInline(catName)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "8px",
                                border: "none",
                                background: "#3b82f6",
                                color: "white",
                                fontSize: "11px",
                                fontWeight: "bold",
                                cursor: "pointer"
                              }}
                            >
                              + Ajouter
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: MÉTAUX & ÉMOJIS */}
      {step4Tab === "metals" && (
        <>
          {/* Recommandations des 11 métaux */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "14px",
              padding: "12px 14px"
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
              💡 Métaux recommandés par GeoProspect (Cliquez pour activer / désactiver) :
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {RECOMMENDED_METALS.map((rec) => {
                const isActif = materials.includes(rec.name);
                return (
                  <button
                    key={rec.name}
                    type="button"
                    onClick={() => handleToggleRecommendedMetal(rec)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "10px",
                      border: isActif ? "1.5px solid #3b82f6" : `1px solid ${cardBorder}`,
                      background: isActif ? (isDark ? "rgba(37,99,235,0.25)" : "#eff6ff") : (isDark ? "#1e293b" : "#ffffff"),
                      color: isActif ? (isDark ? "#93c5fd" : "#1e3a8a") : textMain,
                      fontSize: "12px",
                      fontWeight: isActif ? "700" : "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "all 0.15s ease",
                      boxShadow: isActif ? "0 1px 3px rgba(37,99,235,0.15)" : "0 1px 2px rgba(0,0,0,0.04)"
                    }}
                    title={isActif ? "Métal actif pour vos trouvailles" : `Cliquer pour activer ${rec.name}`}
                  >
                    <span style={{ fontSize: "14px" }}>{materialEmojis[rec.name] || rec.emoji}</span>
                    <span>{rec.name}</span>
                    {isActif ? (
                      <span style={{ color: "#10b981", fontWeight: "900", fontSize: "11px" }}>✓</span>
                    ) : (
                      <span style={{ color: textSub, fontSize: "10px" }}>+</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulaire d'ajout de métal sur-mesure */}
          <form
            onSubmit={handleAddCustomMetal}
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "16px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Ajouter un métal et/ou un alliage :
            </div>

            {/* Nom du métal */}
            <input
              type="text"
              placeholder="Nom du métal"
              value={newMetalName}
              onChange={(e) => setNewMetalName(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "10px",
                border: `1px solid ${inputBorder}`,
                background: inputBg,
                color: textMain,
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />

            {/* Grille complète d'émojis pour les métaux */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: textSub, marginBottom: "6px" }}>
                Émoji associé :
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  maxHeight: "120px",
                  overflowY: "auto",
                  padding: "6px",
                  background: inputBg,
                  border: `1px solid ${inputBorder}`,
                  borderRadius: "10px"
                }}
              >
                {METAL_EMOJIS.map((em) => {
                  const isSelected = newMetalEmoji === em;
                  return (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewMetalEmoji(em)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border: isSelected ? "2px solid #3b82f6" : `1px solid ${cardBorder}`,
                        background: isSelected ? (isDark ? "rgba(37,99,235,0.3)" : "#eff6ff") : (isDark ? "#1e293b" : "#f8fafc"),
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        padding: 0,
                        transform: isSelected ? "scale(1.12)" : "scale(1)",
                        transition: "all 0.12s ease"
                      }}
                      title={em}
                    >
                      {em}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={!newMetalName.trim()}
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: newMetalName.trim() ? "linear-gradient(135deg, #10b981, #059669)" : (isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"),
                color: newMetalName.trim() ? "#ffffff" : (isDark ? "rgba(255,255,255,0.3)" : "#94a3b8"),
                fontSize: "13px",
                fontWeight: "700",
                cursor: newMetalName.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s ease"
              }}
            >
              + Ajouter ce métal à mes trouvailles
            </button>
          </form>

          {/* Liste des métaux actifs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Vos Métaux Actifs ({materials.length})
              </span>
              {materials.length > 0 && (
                <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700" }}>
                  ✓ Enregistrement prêt
                </span>
              )}
            </div>

            {materials.length === 0 ? (
              <div
                style={{
                  padding: "18px 14px",
                  borderRadius: "14px",
                  background: cardBg,
                  border: `1px dashed ${cardBorder}`,
                  textAlign: "center",
                  color: textSub,
                  fontSize: "12px"
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>🪙</div>
                <div style={{ fontWeight: "700", color: textMain, marginBottom: "2px" }}>
                  Aucun métal sélectionné
                </div>
                <div>
                  Activez un des métaux recommandés ci-dessus ou créez vos propres alliages personnalisés.
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: "6px",
                  maxHeight: "220px",
                  overflowY: "auto"
                }}
              >
                {materials.map((mat) => {
                  const em = materialEmojis[mat] || "🪙";
                  return (
                    <div
                      key={mat}
                      style={{
                        background: isDark ? "#1e293b" : "#f8fafc",
                        border: `1px solid ${cardBorder}`,
                        borderRadius: "10px",
                        padding: "8px 10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "6px"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
                        <span style={{ fontSize: "15px" }}>{em}</span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: textMain,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {mat}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMetal(mat)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          fontSize: "12px",
                          cursor: "pointer",
                          padding: "2px"
                        }}
                        title={`Supprimer ${mat}`}
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

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
          ← Retour
        </button>

        <button
          type="button"
          onClick={onNext}
          style={{
            flex: 1,
            padding: "13px 18px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(37, 99, 235, 0.25)",
            transition: "all 0.2s ease"
          }}
        >
          Continuer vers l'étape 5 →
        </button>
      </div>
    </div>
  );
}
