import React, { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
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
import TacticalPinIcon from "./TacticalPinIcon";
import CategoryMarkerPicker from "./CategoryMarkerPicker";

const DETECTORIST_EMOJIS = [
  "🪙", "💰", "🥇", "🥈", "🥉", "💎", "💍", "👑", "📿", "🏆", "🎖️", "🏅", "⚜️",
  "🏺", "🗿", "🏛️", "📜", "🗝️", "🔑", "🔒", "🪞", "🕯️", "⌛", "⏳", "🧱", "✝️",
  "🛡️", "⚔️", "🗡️", "🏹", "💣", "🪖", "🎯", "🔫", "🪓", "🪚", "⚙️", "🥨",
  "🔔", "⚓", "🧲", "🔨", "⛏️", "🔧", "🔩", "🪛", "🖇️", "📎", "✂️", "🪡", "🧷", "🥄", "🍴", "👞", "👝", "🏷️", "📦", "🔘", "🥫", "🎣", "⛓️", "🪜", "🪤", "🪨",
  "🟫", "💿", "⚖️", "🧪", "🔬", "🪵", "🧭", "🔍", "⚡", "🌟", "✨",
  "🟡", "⚪", "🟤", "🔴", "🟢", "🔵", "🟣", "⚫"
];

export default function CategoryManagerModal({ isOpen, onClose, theme = "dark" }) {
  const [modalTab, setModalTab] = useState("categories"); // 'categories' | 'metals'
  const [categoriesData, setCategoriesData] = useState(() => loadCategoriesData());
  const [materialsData, setMaterialsData] = useState(() => loadMaterialsData());
  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("monnaie");
  const [newCatColor, setNewCatColor] = useState("#facc15");
  const [colorPickerCat, setColorPickerCat] = useState(null);
  const [selectedCatForSub, setSelectedCatForSub] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [expandedCat, setExpandedCat] = useState(null);
  const [confirmCatToDelete, setConfirmCatToDelete] = useState(null);

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
  const bgModal = isLight ? "#f3f4f2" : "#111915";
  const sheetBg = isLight ? "#ffffff" : "#19231e";
  const inputBg = isLight ? "#f3f4f2" : "#111915";
  const cardBorder = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.08)";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";

  const handleAddCategory = (e) => {
    e?.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName, newCatEmoji, ["Indéterminé"], newCatColor);
    setNewCatName("");
    setNewCatColor("#facc15");
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

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(8, 14, 11, 0.8)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: bgModal,
          color: textMain,
          borderRadius: "20px",
          border: `1px solid ${cardBorder}`,
          width: "100%",
          maxWidth: "480px",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5)",
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
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "400", color: "#ffffff" }}>
              {modalTab === "categories" ? "Gestion des catégories" : "Gestion des métaux"}
            </h2>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "rgba(255,255,255,0.75)" }}>
              {modalTab === "categories"
                ? "Personnalisez vos catégories, repères et sous-catégories"
                : "Activez et personnalisez les métaux pour vos trouvailles"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255, 255, 255, 0.14)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "400",
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
            padding: "10px 16px 4px 16px",
            background: sheetBg
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: inputBg,
              padding: "4px",
              borderRadius: "999px",
              border: `1px solid ${cardBorder}`
            }}
          >
            <button
              type="button"
              onClick={() => setModalTab("categories")}
              style={{
                padding: "8px",
                borderRadius: "999px",
                border: "none",
                background: modalTab === "categories" ? "#2c5e4c" : "transparent",
                color: modalTab === "categories" ? "#ffffff" : textSub,
                fontWeight: "400",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              Catégories ({Object.keys(categoriesData.categories || {}).length})
            </button>
            <button
              type="button"
              onClick={() => setModalTab("metals")}
              style={{
                padding: "8px",
                borderRadius: "999px",
                border: "none",
                background: modalTab === "metals" ? "#2c5e4c" : "transparent",
                color: modalTab === "metals" ? "#ffffff" : textSub,
                fontWeight: "400",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              Métaux ({(materialsData.materials || []).length})
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: "14px 16px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          {modalTab === "categories" ? (
            <>
              {/* Add Category Form */}
              <form
                onSubmit={handleAddCategory}
                style={{
                  background: sheetBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Créer une catégorie
                </div>

                <input
                  type="text"
                  placeholder="Nom de votre catégorie (ex: Monnaies royales...)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: `1px solid ${cardBorder}`,
                    background: inputBg,
                    color: textMain,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />

                {/* Color Swatches */}
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, marginBottom: "8px" }}>
                    Couleur du repère sur la carte
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
                          {isSelected && <span style={{ color: "#ffffff", fontSize: "10px" }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Visual Marker Picker */}
                <CategoryMarkerPicker
                  selectedMarkerId={newCatEmoji}
                  onSelectMarker={setNewCatEmoji}
                  currentColor={newCatColor}
                  theme={theme}
                />

                <button
                  type="submit"
                  disabled={!newCatName.trim()}
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "12px",
                    border: "none",
                    background: newCatName.trim() ? "#2c5e4c" : (isLight ? "#dce2de" : "rgba(255,255,255,0.08)"),
                    color: newCatName.trim() ? "#ffffff" : textSub,
                    fontSize: "13px",
                    fontWeight: "400",
                    cursor: newCatName.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.2s ease"
                  }}
                >
                  Ajouter cette catégorie
                </button>
              </form>

              {/* Categories List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Catégories actives ({Object.keys(categoriesData.categories || {}).length})
                </div>

                <div
                  style={{
                    background: sheetBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: "16px",
                    overflow: "hidden"
                  }}
                >
                  {Object.entries(categoriesData.categories || {})
                    .sort(([a], [b]) => a.localeCompare(b, "fr", { sensitivity: "base" }))
                    .map(([catName, subCats], idx, arr) => {
                    const emoji = categoriesData.emojis?.[catName] || "🏷️";
                    const color = categoriesData.colors?.[catName] || defaultCategoryColors[catName] || "#2c5e4c";
                    const isExpanded = expandedCat === catName;
                    const isPickingColor = colorPickerCat === catName;

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
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setColorPickerCat(isPickingColor ? null : catName);
                              }}
                              title="Changer la couleur du repère"
                              style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", flexShrink: 0 }}
                            >
                              <TacticalPinIcon markerId={emoji} color={color} size={24} categoryName={catName} />
                            </div>
                            <span style={{ fontWeight: "400", fontSize: "13.5px", color: textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {catName}
                            </span>
                            <span style={{ fontSize: "11px", color: textSub, flexShrink: 0 }}>
                              ({subCats.length})
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmCatToDelete(catName);
                              }}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: textSub,
                                cursor: "pointer",
                                fontSize: "13px",
                                padding: "2px 4px"
                              }}
                              title="Supprimer la catégorie"
                            >
                              ✕
                            </button>
                            <span style={{ color: textSub, fontSize: "10px", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                              ▼
                            </span>
                          </div>
                        </div>

                        {/* Color Picker Accordion */}
                        {isPickingColor && (
                          <div
                            style={{
                              padding: "10px 14px",
                              background: inputBg,
                              borderTop: `1px solid ${cardBorder}`
                            }}
                          >
                            <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, marginBottom: "6px" }}>
                              Couleur pour {catName} :
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
                                    border: color === col ? `2px solid ${textMain}` : "1px solid rgba(0,0,0,0.15)",
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
                              padding: "10px 14px 14px 14px",
                              borderTop: `1px solid ${cardBorder}`,
                              background: inputBg
                            }}
                          >
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                              {[...subCats]
                                .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }))
                                .map((sub) => (
                                <div
                                  key={sub}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    padding: "4px 9px",
                                    borderRadius: "999px",
                                    background: sheetBg,
                                    border: `1px solid ${cardBorder}`,
                                    fontSize: "11px",
                                    color: textMain
                                  }}
                                >
                                  <span>{sub}</span>
                                  <button
                                    onClick={() => removeSubCategory(catName, sub)}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      color: textSub,
                                      cursor: "pointer",
                                      fontSize: "11px",
                                      padding: "0 2px"
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>

                            <form
                              onSubmit={(e) => {
                                handleAddSub(catName, e);
                              }}
                              style={{ display: "flex", gap: "6px" }}
                            >
                              <input
                                type="text"
                                placeholder={`Ajouter une sous-catégorie à ${catName}...`}
                                value={selectedCatForSub === catName ? newSubName : ""}
                                onFocus={() => setSelectedCatForSub(catName)}
                                onChange={(e) => {
                                  setSelectedCatForSub(catName);
                                  setNewSubName(e.target.value);
                                }}
                                style={{
                                  flex: 1,
                                  padding: "7px 10px",
                                  borderRadius: "8px",
                                  border: `1px solid ${cardBorder}`,
                                  background: sheetBg,
                                  color: textMain,
                                  fontSize: "11px",
                                  outline: "none"
                                }}
                              />
                              <button
                                type="submit"
                                style={{
                                  padding: "7px 12px",
                                  borderRadius: "8px",
                                  border: "none",
                                  background: "#2c5e4c",
                                  color: "white",
                                  fontSize: "11px",
                                  fontWeight: "400",
                                  cursor: "pointer"
                                }}
                              >
                                Ajouter
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* TAB: METALS */
            <>
              <div
                style={{
                  background: sheetBg,
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
                    const isActif = (materialsData.materials || []).includes(rec.name);
                    return (
                      <button
                        key={rec.name}
                        type="button"
                        onClick={() => handleToggleRecommendedMetal(rec)}
                        style={{
                          padding: "6px 11px",
                          borderRadius: "999px",
                          border: isActif ? "1px solid #2c5e4c" : `1px solid ${cardBorder}`,
                          background: isActif ? (isLight ? "#eef2ee" : "rgba(44, 94, 76, 0.28)") : inputBg,
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
                        <span style={{ fontSize: "14px" }}>{materialsData.emojis?.[rec.name] || rec.emoji}</span>
                        <span>{rec.name}</span>
                        <span style={{ color: isActif ? (isLight ? "#2c5e4c" : "#80b99c") : textSub, fontSize: "11px" }}>
                          {isActif ? "✓" : "+"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Metal Form */}
              <form
                onSubmit={handleAddCustomMetal}
                style={{
                  background: sheetBg,
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
                    border: `1px solid ${cardBorder}`,
                    background: inputBg,
                    color: textMain,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />

                {/* Emojis grid */}
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
                      border: `1px solid ${cardBorder}`,
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
                            background: isSelected ? (isLight ? "#eef2ee" : "rgba(44, 94, 76, 0.35)") : sheetBg,
                            fontSize: "17px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            padding: 0
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
                    background: newMetalName.trim() ? "#2c5e4c" : (isLight ? "#dce2de" : "rgba(255,255,255,0.08)"),
                    color: newMetalName.trim() ? "#ffffff" : textSub,
                    fontSize: "12px",
                    fontWeight: "400",
                    cursor: newMetalName.trim() ? "pointer" : "not-allowed"
                  }}
                >
                  Ajouter ce métal
                </button>
              </form>

              {/* Active Metals List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Vos métaux actifs ({(materialsData.materials || []).length})
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
                          background: sheetBg,
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
                          onClick={() => removeMaterial(mat)}
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
              </div>
            </>
          )}
        </div>
      </div>

      {confirmCatToDelete && (
        <ConfirmModal
          title="Supprimer la catégorie"
          confirmColor="#dc2626"
          message={`Voulez-vous supprimer la catégorie « ${confirmCatToDelete} » ?`}
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={() => {
            removeCategory(confirmCatToDelete);
            setConfirmCatToDelete(null);
          }}
          onCancel={() => setConfirmCatToDelete(null)}
        />
      )}
    </div>
  );
}
