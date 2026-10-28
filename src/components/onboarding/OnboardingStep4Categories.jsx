import React, { useState } from "react";
import { PRESET_CATEGORY_COLORS } from "../../subCategories";
import TacticalPinIcon from "../TacticalPinIcon";
import CategoryMarkerPicker from "../CategoryMarkerPicker";
import MetallicMaterialBadge from "../MetallicMaterialBadge";
import { RECOMMENDED_METALS } from "../../services/materialsService";
import { METALLIC_SHADES, deriveMetalSymbol } from "../../constants/metallicMaterials";

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
  const [newMetalShade, setNewMetalShade] = useState("or");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "400", color: textMain, letterSpacing: "-0.3px" }}>
          Votre classification
        </h1>
        <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
          Définissez vos catégories d'objets, leurs repères visibles sur la carte et choisissez les métaux associés à vos futures trouvailles.
        </p>
      </div>

      {/* Sub-Tabs Switcher */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: cardBg,
          borderRadius: "999px",
          padding: "4px",
          border: `1px solid ${cardBorder}`,
          gap: "4px"
        }}
      >
        <button
          type="button"
          onClick={() => setStep4Tab("categories")}
          style={{
            padding: "9px 12px",
            borderRadius: "999px",
            border: "none",
            background: step4Tab === "categories" ? "#2c5e4c" : "transparent",
            color: step4Tab === "categories" ? "#ffffff" : textSub,
            fontWeight: "400",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          Catégories ({Object.keys(categories).length})
        </button>
        <button
          type="button"
          onClick={() => setStep4Tab("metals")}
          style={{
            padding: "9px 12px",
            borderRadius: "999px",
            border: "none",
            background: step4Tab === "metals" ? "#2c5e4c" : "transparent",
            color: step4Tab === "metals" ? "#ffffff" : textSub,
            fontWeight: "400",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          Métaux ({materials.length})
        </button>
      </div>

      {/* TAB 1: FAMILLES D'OBJETS */}
      {step4Tab === "categories" && (
        <>
          {/* Custom Category Creation Form */}
          <form
            onSubmit={handleAddCustomCategory}
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "16px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            <div>
              <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                1. Nom de votre catégorie
              </div>
              <input
                type="text"
                placeholder="Ex : Monnaies royales, Balles de mousquet, Boucles, Militaria..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: `1px solid ${inputBorder}`,
                  background: inputBg,
                  color: textMain,
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Color Swatch Picker */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                2. Couleur du repère sur la carte
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", alignItems: "center" }}>
                {PRESET_CATEGORY_COLORS.map((colorHex) => {
                  const isSelected = newCatColor === colorHex;
                  return (
                    <button
                      key={colorHex}
                      type="button"
                      onClick={() => setNewCatColor(colorHex)}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: colorHex,
                        border: isSelected ? `2px solid ${textMain}` : "1.5px solid rgba(0,0,0,0.15)",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: isSelected ? "scale(1.15)" : "scale(1)",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {isSelected && <span style={{ color: "#ffffff", fontSize: "11px", fontWeight: "400" }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Marker Picker in GROS PLAN */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                3. Choix du repère visuel
              </div>
              <CategoryMarkerPicker
                selectedMarkerId={newCatEmoji}
                onSelectMarker={setNewCatEmoji}
                currentColor={newCatColor}
                theme={isDark ? "dark" : "light"}
              />
            </div>

            {/* Sous-catégories (optionnel) */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  4. Sous-catégories (optionnel)
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
                        fontWeight: "400",
                        outline: "none",
                        cursor: "pointer"
                      }}
                    >
                      {Object.keys(categories)
                        .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }))
                        .map((c) => (
                        <option key={c} value={c} style={{ background: cardBg, color: textMain }}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Ex : Antique, Médiéval, Moderne (séparez par des virgules)..."
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

            <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
              <button
                type="submit"
                disabled={!newCatName.trim()}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: "10px",
                  border: "none",
                  background: newCatName.trim() ? "#2c5e4c" : (isDark ? "rgba(255,255,255,0.06)" : "#dce2de"),
                  color: newCatName.trim() ? "#ffffff" : textSub,
                  fontSize: "13px",
                  fontWeight: "400",
                  cursor: newCatName.trim() ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease"
                }}
              >
                Ajouter cette catégorie
              </button>

              {newSubText.trim() && Object.keys(categories).length > 0 && (
                <button
                  type="button"
                  onClick={handleAddCustomSubCategory}
                  style={{
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: `1px solid #2c5e4c`,
                    background: isDark ? "rgba(44, 94, 76, 0.22)" : "#eef2ee",
                    color: textMain,
                    fontSize: "13px",
                    fontWeight: "400",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Ajouter sous-catégorie
                </button>
              )}
            </div>
          </form>

          {/* Configured Categories List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Vos catégories créées ({Object.keys(categories).length})
              </span>
            </div>

            {Object.keys(categories).length === 0 ? (
              <div
                style={{
                  padding: "18px 14px",
                  borderRadius: "14px",
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  textAlign: "center",
                  color: textSub,
                  fontSize: "12px"
                }}
              >
                <div style={{ fontWeight: "400", color: textMain, marginBottom: "4px" }}>
                  Aucune catégorie créée pour le moment
                </div>
                <div>
                  Créez votre première catégorie ci-dessus en lui donnant le nom et la forme de votre choix.
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "16px",
                  overflow: "hidden"
                }}
              >
                {Object.entries(categories)
                  .sort(([a], [b]) => a.localeCompare(b, "fr", { sensitivity: "base" }))
                  .map(([catName, subCats], idx, arr) => {
                  const em = emojis[catName] || "monnaie";
                  const col = colors[catName] || "#2c5e4c";
                  const isExpanded = expandedCat === catName;
                  const safeSubCats = Array.isArray(subCats) ? subCats : [];

                  return (
                    <div
                      key={catName}
                      style={{
                        borderBottom: idx < arr.length - 1 ? `1px solid ${cardBorder}` : "none"
                      }}
                    >
                      <div
                        onClick={() => setExpandedCat(isExpanded ? null : catName)}
                        style={{
                          padding: "12px 14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          userSelect: "none"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                          <TacticalPinIcon markerId={em} color={col} size={28} categoryName={catName} />
                          <span style={{ fontSize: "14px", fontWeight: "400", color: textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {catName}
                          </span>
                          <span style={{ fontSize: "11px", fontWeight: "400", color: textSub, flexShrink: 0 }}>
                            ({safeSubCats.length})
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCategory(catName);
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: textSub,
                              fontSize: "14px",
                              cursor: "pointer",
                              padding: "2px 4px"
                            }}
                            title="Retirer la catégorie"
                          >
                            ✕
                          </button>
                          <span style={{ fontSize: "10px", color: textSub, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                            ▼
                          </span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div
                          style={{
                            padding: "10px 14px 14px 14px",
                            borderTop: `1px solid ${cardBorder}`,
                            background: inputBg
                          }}
                        >
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                            {[...safeSubCats]
                              .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }))
                              .map((sub) => (
                              <span
                                key={sub}
                                style={{
                                  padding: "4px 9px",
                                  borderRadius: "999px",
                                  background: cardBg,
                                  border: `1px solid ${cardBorder}`,
                                  fontSize: "11px",
                                  color: textMain,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px"
                                }}
                              >
                                {sub}
                                <span
                                  onClick={() => handleRemoveSubInline(catName, sub)}
                                  style={{ cursor: "pointer", color: textSub, fontWeight: "400", fontSize: "11px" }}
                                >
                                  ×
                                </span>
                              </span>
                            ))}
                          </div>

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
                                padding: "7px 10px",
                                borderRadius: "8px",
                                border: `1px solid ${inputBorder}`,
                                background: cardBg,
                                color: textMain,
                                fontSize: "11px",
                                outline: "none"
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleAddSubInline(catName)}
                              style={{
                                padding: "7px 12px",
                                borderRadius: "8px",
                                border: "none",
                                background: "#2c5e4c",
                                color: "#ffffff",
                                fontSize: "11px",
                                fontWeight: "400",
                                cursor: "pointer"
                              }}
                            >
                              Ajouter
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

      {/* TAB 2: MÉTAUX */}
      {step4Tab === "metals" && (
        <>
          <div
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "16px",
              padding: "14px"
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
              Métaux recommandés (activer / désactiver)
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
                      padding: "6px 11px",
                      borderRadius: "999px",
                      border: isActif ? "1px solid #2c5e4c" : `1px solid ${cardBorder}`,
                      background: isActif ? (isDark ? "rgba(44, 94, 76, 0.28)" : "#eef2ee") : inputBg,
                      color: isActif ? textMain : textSub,
                      fontSize: "12px",
                      fontWeight: "400",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <MetallicMaterialBadge metalName={rec.name} emojiOrSymbol={materialEmojis[rec.name] || rec.symbol || rec.emoji} size={18} />
                    <span>{rec.name}</span>
                    <span style={{ color: isActif ? (isDark ? "#80b99c" : "#2c5e4c") : textSub, fontSize: "11px" }}>
                      {isActif ? "✓" : "+"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

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
            <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Ajouter un métal ou un alliage
            </div>

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

            <div>
              <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, marginBottom: "8px" }}>
                Nuance de matière métallique
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}>
                {METALLIC_SHADES.map((shade) => {
                  const isSelected = newMetalShade === shade.id;
                  return (
                    <button
                      key={shade.id}
                      type="button"
                      onClick={() => setNewMetalShade(shade.id)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        padding: "6px 2px",
                        borderRadius: "10px",
                        border: isSelected ? "1.5px solid #10b981" : `1px solid ${cardBorder}`,
                        background: isSelected ? (isDark ? "rgba(16, 185, 129, 0.18)" : "rgba(16, 185, 129, 0.12)") : inputBg,
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <MetallicMaterialBadge shade={shade.id} metalName={newMetalName.trim() || shade.label} size={20} />
                      <span style={{ fontSize: "9px", color: isSelected ? textMain : textSub }}>{shade.label}</span>
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
                background: newMetalName.trim() ? "#2c5e4c" : (isDark ? "rgba(255,255,255,0.06)" : "#dce2de"),
                color: newMetalName.trim() ? "#ffffff" : textSub,
                fontSize: "13px",
                fontWeight: "400",
                cursor: newMetalName.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s ease"
              }}
            >
              Ajouter ce métal
            </button>
          </form>

          {/* Liste des métaux actifs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Vos métaux actifs ({materials.length})
              </span>
            </div>

            {materials.length === 0 ? (
              <div
                style={{
                  padding: "18px 14px",
                  borderRadius: "14px",
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  textAlign: "center",
                  color: textSub,
                  fontSize: "12px"
                }}
              >
                <div style={{ fontWeight: "400", color: textMain, marginBottom: "4px" }}>
                  Aucun métal sélectionné
                </div>
                <div>
                  Activez un des métaux recommandés ci-dessus ou créez vos propres alliages.
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: "6px"
                }}
              >
                {materials.map((mat) => {
                  const em = materialEmojis[mat] || "";
                  return (
                    <div
                      key={mat}
                      style={{
                        background: cardBg,
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
                        <MetallicMaterialBadge metalName={mat} emojiOrSymbol={em} size={18} />
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "400",
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
                          color: textSub,
                          fontSize: "12px",
                          cursor: "pointer",
                          padding: "2px"
                        }}
                      >
                        ✕
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
          onClick={onNext}
          style={{
            flex: 1,
            padding: "13px 18px",
            borderRadius: "12px",
            border: "none",
            background: "#2c5e4c",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "400",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          Continuer vers l'étape 5
        </button>
      </div>
    </div>
  );
}
