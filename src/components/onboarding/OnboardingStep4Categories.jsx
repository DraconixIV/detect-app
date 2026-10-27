import React from "react";
import { PRESET_CATEGORY_COLORS, SUGGESTED_STARTER_CATEGORIES } from "../../subCategories";
import { RECOMMENDED_METALS } from "../../services/materialsService";

const DETECTORIST_EMOJIS = [
  "🪙", "💰", "🥇", "🥈", "🥉", "💎", "💍", "👑", "📿", "🏆", "🎖️", "🏅", "⚜️",
  "🏺", "🗿", "🏛️", "📜", "🗝️", "🔑", "🔒", "🪞", "🕯️", "⌛", "⏳", "🧱", "✝️",
  "🛡️", "⚔️", "🗡️", "🏹", "💣", "🪖", "🎯", "🔫", "🪓", "🪚", "⚙️", "🥨",
  "🔔", "⚓", "🧲", "🔨", "⛏️", "🔧", "🔩", "🪛", "🖇️", "📎", "✂️", "🪡", "🧷", "🥄", "🍴", "👞", "👝", "🏷️", "📦", "🔘", "🥫", "🎣", "⛓️", "🪜", "🪤", "🪨",
  "🟫", "💿", "⚖️", "🧪", "🔬", "🪵", "🧭", "🔍", "⚡", "🌟", "✨",
  "🟡", "⚪", "🟤", "🔴", "🟢", "🔵", "🟣", "⚫"
];

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
          {/* Quick 1-click Suggestion Chips */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "16px",
              padding: "14px"
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
              Suggestions en 1 clic (activer / désactiver)
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
                      padding: "6px 11px",
                      borderRadius: "999px",
                      border: isAlreadyAdded ? "1px solid #2c5e4c" : `1px solid ${cardBorder}`,
                      background: isAlreadyAdded ? (isDark ? "rgba(44, 94, 76, 0.28)" : "#eef2ee") : inputBg,
                      color: isAlreadyAdded ? textMain : textSub,
                      fontSize: "12px",
                      fontWeight: "400",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease"
                    }}
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
                        color: isAlreadyAdded ? (isDark ? "#80b99c" : "#2c5e4c") : textSub,
                        fontWeight: "400",
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
            <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Créer une catégorie
            </div>

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

            {/* Grille d'émojis */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, marginBottom: "6px" }}>
                Symbole du repère carte
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  maxHeight: "115px",
                  overflowY: "auto",
                  padding: "6px",
                  background: inputBg,
                  border: `1px solid ${inputBorder}`,
                  borderRadius: "10px"
                }}
              >
                {DETECTORIST_EMOJIS.map((em) => {
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
                        border: isSelected ? "1.5px solid #2c5e4c" : `1px solid ${cardBorder}`,
                        background: isSelected ? (isDark ? "rgba(44, 94, 76, 0.35)" : "#eef2ee") : cardBg,
                        fontSize: "17px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        padding: 0,
                        transition: "all 0.12s ease"
                      }}
                    >
                      {em}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sous-catégories */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <div style={{ fontSize: "11px", fontWeight: "400", color: textSub }}>
                  Sous-catégories
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
                      {Object.keys(categories).map((c) => (
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
                placeholder="Ex : Antique, Médiéval, Moderne..."
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
              <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, marginBottom: "6px" }}>
                Couleur du repère carte
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
                      {isSelected && <span style={{ color: "#ffffff", fontSize: "10px", fontWeight: "400" }}>✓</span>}
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

            <button
              type="button"
              onClick={handleAddCustomSubCategory}
              disabled={!newSubText.trim() || Object.keys(categories).length === 0}
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: `1px solid ${newSubText.trim() && Object.keys(categories).length > 0 ? "#2c5e4c" : cardBorder}`,
                background: newSubText.trim() && Object.keys(categories).length > 0 ? (isDark ? "rgba(44, 94, 76, 0.22)" : "#eef2ee") : inputBg,
                color: newSubText.trim() && Object.keys(categories).length > 0 ? textMain : textSub,
                fontSize: "13px",
                fontWeight: "400",
                cursor: newSubText.trim() && Object.keys(categories).length > 0 ? "pointer" : "not-allowed",
                transition: "all 0.2s ease"
              }}
            >
              Ajouter cette sous-catégorie
            </button>
          </form>

          {/* Configured Categories List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Vos catégories ({Object.keys(categories).length})
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
                  Aucune catégorie sélectionnée
                </div>
                <div>
                  Activez une suggestion ci-dessus ou créez vos propres catégories.
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
                {Object.entries(categories).map(([catName, subCats], idx, arr) => {
                  const em = emojis[catName] || "🪙";
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
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: col,
                              display: "inline-block",
                              flexShrink: 0
                            }}
                          />
                          <span style={{ fontSize: "15px", flexShrink: 0 }}>{em}</span>
                          <span style={{ fontSize: "13px", fontWeight: "400", color: textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
                            {safeSubCats.map((sub) => (
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
                    <span style={{ fontSize: "14px" }}>{materialEmojis[rec.name] || rec.emoji}</span>
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
              <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, marginBottom: "6px" }}>
                Symbole associé
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  maxHeight: "115px",
                  overflowY: "auto",
                  padding: "6px",
                  background: inputBg,
                  border: `1px solid ${inputBorder}`,
                  borderRadius: "10px"
                }}
              >
                {DETECTORIST_EMOJIS.map((em) => {
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
                        border: isSelected ? "1.5px solid #2c5e4c" : `1px solid ${cardBorder}`,
                        background: isSelected ? (isDark ? "rgba(44, 94, 76, 0.35)" : "#eef2ee") : cardBg,
                        fontSize: "17px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        padding: 0,
                        transition: "all 0.12s ease"
                      }}
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
                  const em = materialEmojis[mat] || "🪙";
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
                        <span style={{ fontSize: "14px" }}>{em}</span>
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
