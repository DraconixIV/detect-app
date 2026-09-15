import React, { useState, useEffect } from "react";
import {
  loadCategoriesData,
  addCategory,
  removeCategory,
  addSubCategory,
  removeSubCategory,
  updateCategoryColor
} from "../services/categoriesService";
import {
  RECOMMENDED_METALS,
  loadMaterialsData,
  saveMaterialsData,
  addMaterial,
  removeMaterial
} from "../services/materialsService";
import { PRESET_CATEGORY_COLORS, defaultCategoryColors } from "../subCategories";

const COMMON_EMOJIS = ["🪙", "💍", "👑", "🛡️", "⚔️", "🏺", "🗝️", "🎖️", "💣", "🔨", "🪓", "🔔", "⚓", "📦", "📜", "✝️", "🏷️", "💎"];
const METAL_EMOJIS = ["🪙", "🥈", "🥉", "🟫", "🔔", "💿", "🔘", "⚖️", "🥫", "📎", "⚓", "⚙️", "⚔️", "🧲", "🔨", "💎", "👑", "📦", "🏺", "🛡️"];

export default function CategoryManagerModal({ isOpen, onClose, theme = "dark" }) {
  const [modalTab, setModalTab] = useState("categories"); // 'categories' | 'metals'
  const [categoriesData, setCategoriesData] = useState(() => loadCategoriesData());
  const [materialsData, setMaterialsData] = useState(() => loadMaterialsData());
  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("🪙");
  const [newCatColor, setNewCatColor] = useState("#3b82f6");
  const [colorPickerCat, setColorPickerCat] = useState(null);
  const [selectedCatForSub, setSelectedCatForSub] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [expandedCat, setExpandedCat] = useState(null);

  const [newMetalName, setNewMetalName] = useState("");
  const [newMetalEmoji, setNewMetalEmoji] = useState("🪙");

  useEffect(() => {
    const refreshCats = () => setCategoriesData(loadCategoriesData());
    const refreshMats = () => setMaterialsData(loadMaterialsData());
    window.addEventListener("categories-updated", refreshCats);
    window.addEventListener("materials-updated", refreshMats);
    return () => {
      window.removeEventListener("categories-updated", refreshCats);
      window.removeEventListener("materials-updated", refreshMats);
    };
  }, []);

  if (!isOpen) return null;

  const isLight = theme === "light";
  const bgModal = isLight ? "#ffffff" : "#0f172a";
  const textMain = isLight ? "#000000" : "#ffffff";
  const textSub = isLight ? "#1e293b" : "#ffffff";
  const cardBg = isLight ? "#f8fafc" : "#1e293b";
  const cardBorder = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.1)";
  const inputBg = isLight ? "#ffffff" : "#0b1329";
  const inputBorder = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.18)";

  const handleAddCategory = (e) => {
    e?.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName, newCatEmoji, ["Indéterminé"], newCatColor);
    setNewCatName("");
    setNewCatColor("#3b82f6");
  };

  const handleAddSub = (catName, e) => {
    e?.preventDefault();
    if (!newSubName.trim()) return;
    addSubCategory(catName, newSubName);
    setNewSubName("");
  };

  const handleToggleRecommendedMetal = (metal) => {
    const currentList = materialsData.materials || [];
    const currentEmojis = materialsData.emojis || {};
    let updatedMaterials;
    const updatedEmojis = { ...currentEmojis, [metal.name]: metal.emoji };
    if (currentList.includes(metal.name)) {
      updatedMaterials = currentList.filter((m) => m !== metal.name);
    } else {
      updatedMaterials = [...currentList, metal.name];
    }
    saveMaterialsData(updatedMaterials, updatedEmojis);
  };

  const handleAddCustomMetal = (e) => {
    e?.preventDefault();
    const trimmed = newMetalName.trim();
    if (!trimmed) return;
    addMaterial(trimmed, newMetalEmoji);
    setNewMetalName("");
  };

  const handleRemoveCustomMetal = (metalName) => {
    removeMaterial(metalName);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: bgModal,
          color: textMain,
          borderRadius: "24px",
          border: `1px solid ${cardBorder}`,
          width: "100%",
          maxWidth: "520px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px",
            borderBottom: `1px solid ${cardBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>{modalTab === "categories" ? "🏷️" : "🪙"}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: textMain }}>
                {modalTab === "categories" ? "Gestion des Catégories" : "Gestion des Métaux & Alliages"}
              </h2>
              <p style={{ margin: 0, fontSize: "11px", color: textSub }}>
                {modalTab === "categories"
                  ? "Personnalisez vos familles d'objets, repères et sous-types"
                  : "Activez et personnalisez les métaux pour vos trouvailles"}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: `1px solid ${cardBorder}`,
              background: cardBg,
              color: textMain,
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            background: isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.05)",
            padding: "6px 12px",
            borderBottom: `1px solid ${cardBorder}`,
            gap: "6px"
          }}
        >
          <button
            type="button"
            onClick={() => setModalTab("categories")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "10px",
              border: "none",
              background: modalTab === "categories" ? (isLight ? "#ffffff" : "#1e293b") : "transparent",
              color: modalTab === "categories" ? textMain : (isLight ? "#64748b" : "#94a3b8"),
              fontWeight: modalTab === "categories" ? "800" : "600",
              fontSize: "12px",
              cursor: "pointer",
              boxShadow: modalTab === "categories" ? "0 2px 5px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s ease"
            }}
          >
            🏷️ Familles ({Object.keys(categoriesData.categories || {}).length})
          </button>
          <button
            type="button"
            onClick={() => setModalTab("metals")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "10px",
              border: "none",
              background: modalTab === "metals" ? (isLight ? "#ffffff" : "#1e293b") : "transparent",
              color: modalTab === "metals" ? textMain : (isLight ? "#64748b" : "#94a3b8"),
              fontWeight: modalTab === "metals" ? "800" : "600",
              fontSize: "12px",
              cursor: "pointer",
              boxShadow: modalTab === "metals" ? "0 2px 5px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s ease"
            }}
          >
            🪙 Métaux ({ (materialsData.materials || []).length })
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1 }}>
          {modalTab === "categories" ? (
            <>
              {/* Add Category Form */}
              <form
                onSubmit={handleAddCategory}
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "16px",
                  padding: "14px",
                  marginBottom: "16px"
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: "800", marginBottom: "8px", color: textMain }}>
                  ➕ Nouvelle Catégorie
                </div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                  <select
                    value={newCatEmoji}
                    onChange={(e) => setNewCatEmoji(e.target.value)}
                    style={{
                      padding: "8px",
                      borderRadius: "10px",
                      border: `1px solid ${inputBorder}`,
                      background: inputBg,
                      color: textMain,
                      fontSize: "16px",
                      cursor: "pointer"
                    }}
                  >
                    {COMMON_EMOJIS.map((em) => (
                      <option key={em} value={em}>
                        {em}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Nom (ex: Poterie, Arme, Fossile...)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${inputBorder}`,
                      background: inputBg,
                      color: textMain,
                      fontSize: "13px",
                      outline: "none"
                    }}
                  />
                </div>

                {/* Color Swatches */}
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: textSub, marginBottom: "6px" }}>
                    Couleur du repère carte :
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
                            border: isSelected ? "2.5px solid #ffffff" : "1.5px solid rgba(0,0,0,0.2)",
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
                    width: "100%",
                    padding: "9px",
                    borderRadius: "10px",
                    border: "none",
                    background: newCatName.trim() ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "rgba(255,255,255,0.1)",
                    color: newCatName.trim() ? "#ffffff" : textSub,
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: newCatName.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.2s ease"
                  }}
                >
                  Ajouter cette catégorie
                </button>
              </form>

              {/* Categories List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "11px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Catégories Actives ({Object.keys(categoriesData.categories || {}).length})
                </div>

                {Object.entries(categoriesData.categories || {}).map(([catName, subCats]) => {
                  const emoji = categoriesData.emojis?.[catName] || "🏷️";
                  const color = categoriesData.colors?.[catName] || defaultCategoryColors[catName] || "#3b82f6";
                  const isExpanded = expandedCat === catName;
                  const isPickingColor = colorPickerCat === catName;

                  return (
                    <div
                      key={catName}
                      style={{
                        background: cardBg,
                        border: `1px solid ${cardBorder}`,
                        borderRadius: "14px",
                        overflow: "hidden"
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
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setColorPickerCat(isPickingColor ? null : catName);
                            }}
                            title="Changer la couleur du repère"
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              background: color,
                              border: "2px solid rgba(255,255,255,0.3)",
                              cursor: "pointer",
                              display: "inline-block"
                            }}
                          />
                          <span style={{ fontSize: "18px" }}>{emoji}</span>
                          <span style={{ fontWeight: "700", fontSize: "14px", color: textMain }}>
                            {catName}
                          </span>
                          <span style={{ fontSize: "11px", color: textSub }}>
                            ({subCats.length} sous-types)
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Supprimer la catégorie "${catName}" et tous ses sous-types ?`)) {
                                removeCategory(catName);
                              }
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              fontSize: "14px",
                              padding: "4px"
                            }}
                            title="Supprimer la catégorie"
                          >
                            🗑️
                          </button>
                          <span style={{ color: textSub, fontSize: "12px" }}>
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </div>
                      </div>

                      {/* Color Picker Accordion */}
                      {isPickingColor && (
                        <div
                          style={{
                            padding: "10px 14px",
                            background: isLight ? "#f1f5f9" : "rgba(0,0,0,0.35)",
                            borderTop: `1px solid ${cardBorder}`
                          }}
                        >
                          <div style={{ fontSize: "11px", fontWeight: "700", color: textSub, marginBottom: "6px" }}>
                            Choisir la couleur pour {catName} :
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {PRESET_CATEGORY_COLORS.map((col) => (
                              <button
                                key={col}
                                type="button"
                                onClick={() => {
                                  updateCategoryColor(catName, col);
                                  setColorPickerCat(null);
                                }}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  background: col,
                                  border: color === col ? "2px solid #ffffff" : "1px solid rgba(0,0,0,0.2)",
                                  cursor: "pointer",
                                  padding: 0
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub Categories Accordion */}
                      {isExpanded && (
                        <div
                          style={{
                            padding: "12px 14px",
                            borderTop: `1px solid ${cardBorder}`,
                            background: isLight ? "#f1f5f9" : "rgba(0,0,0,0.2)"
                          }}
                        >
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                            {subCats.map((sub) => (
                              <div
                                key={sub}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  padding: "4px 8px",
                                  borderRadius: "8px",
                                  background: isLight ? "#ffffff" : "rgba(255,255,255,0.08)",
                                  border: `1px solid ${cardBorder}`,
                                  fontSize: "12px",
                                  color: textMain
                                }}
                              >
                                <span>{sub}</span>
                                <button
                                  onClick={() => removeSubCategory(catName, sub)}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#ef4444",
                                    cursor: "pointer",
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                    padding: "0 2px"
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Add Sub Category Inline */}
                          <form
                            onSubmit={(e) => {
                              handleAddSub(catName, e);
                            }}
                            style={{ display: "flex", gap: "6px" }}
                          >
                            <input
                              type="text"
                              placeholder={`Ajouter un sous-type à ${catName}...`}
                              value={selectedCatForSub === catName ? newSubName : ""}
                              onFocus={() => setSelectedCatForSub(catName)}
                              onChange={(e) => {
                                setSelectedCatForSub(catName);
                                setNewSubName(e.target.value);
                              }}
                              style={{
                                flex: 1,
                                padding: "6px 10px",
                                borderRadius: "8px",
                                border: `1px solid ${inputBorder}`,
                                background: inputBg,
                                color: textMain,
                                fontSize: "12px",
                                outline: "none"
                              }}
                            />
                            <button
                              type="submit"
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
                          </form>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* TAB: METALS & EMOJIS */
            <>
              {/* Recommendations 11 metals */}
              <div
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "14px",
                  padding: "12px 14px",
                  marginBottom: "16px"
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                  💡 Métaux recommandés par GeoProspect (Cliquez pour activer / désactiver) :
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {RECOMMENDED_METALS.map((rec) => {
                    const isActif = (materialsData.materials || []).includes(rec.name);
                    return (
                      <button
                        key={rec.name}
                        type="button"
                        onClick={() => handleToggleRecommendedMetal(rec)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "10px",
                          border: isActif ? "1.5px solid #3b82f6" : `1px solid ${cardBorder}`,
                          background: isActif ? (isLight ? "#eff6ff" : "rgba(59, 130, 246, 0.2)") : inputBg,
                          color: isActif ? (isLight ? "#1e3a8a" : "#60a5fa") : textMain,
                          fontSize: "12px",
                          fontWeight: isActif ? "700" : "500",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          transition: "all 0.15s ease"
                        }}
                        title={isActif ? "Métal actif" : `Activer ${rec.name}`}
                      >
                        <span style={{ fontSize: "14px" }}>{materialsData.emojis?.[rec.name] || rec.emoji}</span>
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

              {/* Add Custom Metal Form */}
              <form
                onSubmit={handleAddCustomMetal}
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "16px",
                  padding: "14px",
                  marginBottom: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: "800", color: textMain }}>
                  ➕ Ajouter un Métal ou Alliage Sur-Mesure
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <select
                    value={newMetalEmoji}
                    onChange={(e) => setNewMetalEmoji(e.target.value)}
                    style={{
                      padding: "8px",
                      borderRadius: "10px",
                      border: `1px solid ${inputBorder}`,
                      background: inputBg,
                      color: textMain,
                      fontSize: "16px",
                      cursor: "pointer"
                    }}
                  >
                    {METAL_EMOJIS.map((em) => (
                      <option key={em} value={em}>
                        {em}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Nom du métal (ex: Maillechort, Peltre, Zamac, Or blanc...)"
                    value={newMetalName}
                    onChange={(e) => setNewMetalName(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${inputBorder}`,
                      background: inputBg,
                      color: textMain,
                      fontSize: "13px",
                      outline: "none"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newMetalName.trim()}
                  style={{
                    padding: "9px",
                    borderRadius: "10px",
                    border: "none",
                    background: newMetalName.trim() ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.1)",
                    color: newMetalName.trim() ? "#ffffff" : textSub,
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: newMetalName.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.2s ease"
                  }}
                >
                  + Ajouter ce métal
                </button>
              </form>

              {/* Active Metals List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "11px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Vos Métaux Actifs ({(materialsData.materials || []).length})
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: "6px"
                  }}
                >
                  {(materialsData.materials || []).map((mat) => {
                    const em = materialsData.emojis?.[mat] || "🪙";
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
                          onClick={() => handleRemoveCustomMetal(mat)}
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
              </div>
            </>
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
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              fontSize: "13px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Terminer ✅
          </button>
        </div>
      </div>
    </div>
  );
}
