import React, { useState, useEffect } from "react";
import {
  loadCategoriesData,
  addCategory,
  removeCategory,
  addSubCategory,
  removeSubCategory,
  resetCategories
} from "../services/categoriesService";

const COMMON_EMOJIS = ["🪙", "💍", "👑", "🛡️", "⚔️", "🏺", "🗝️", "🎖️", "💣", "🔨", "🪓", "🔔", "⚓", "📦", "📜", "✝️", "🏷️", "💎"];

export default function CategoryManagerModal({ isOpen, onClose, theme = "dark" }) {
  const [categoriesData, setCategoriesData] = useState(() => loadCategoriesData());
  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("🪙");
  const [selectedCatForSub, setSelectedCatForSub] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [expandedCat, setExpandedCat] = useState(null);

  useEffect(() => {
    const refresh = () => setCategoriesData(loadCategoriesData());
    window.addEventListener("categories-updated", refresh);
    return () => window.removeEventListener("categories-updated", refresh);
  }, []);

  if (!isOpen) return null;

  const isLight = theme === "light";
  const bgModal = isLight ? "#ffffff" : "#0f172a";
  const textMain = isLight ? "#0f172a" : "#ffffff";
  const textSub = isLight ? "#64748b" : "#ffffff";
  const cardBg = isLight ? "#f8fafc" : "#1e293b";
  const cardBorder = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.1)";
  const inputBg = isLight ? "#ffffff" : "#0b1329";
  const inputBorder = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.18)";

  const handleAddCategory = (e) => {
    e?.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName, newCatEmoji);
    setNewCatName("");
  };

  const handleAddSub = (catName, e) => {
    e?.preventDefault();
    if (!newSubName.trim()) return;
    addSubCategory(catName, newSubName);
    setNewSubName("");
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
            <span style={{ fontSize: "24px" }}>🏷️</span>
            <div>
              <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: textMain }}>
                Gestion des Catégories
              </h2>
              <p style={{ margin: 0, fontSize: "11px", color: textSub }}>
                Personnalisez vos familles et sous-types d'objets
              </p>
            </div>
          </div>
          <button
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

        {/* Scrollable Content */}
        <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1 }}>
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
            <div style={{ fontSize: "12px", fontWeight: "800", marginBottom: "8px", color: isLight ? "#2563eb" : "#60a5fa" }}>
              ➕ Nouvelle Catégorie
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
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
                placeholder="Nom (ex: Poterie, Arme...)"
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

              <button
                type="submit"
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Créer
              </button>
            </div>
          </form>

          {/* List of Categories */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Catégories Existantes ({Object.keys(categoriesData.categories || {}).length})
              </span>
              <button
                onClick={() => {
                  if (window.confirm("Réinitialiser toutes les catégories et sous-catégories par défaut ?")) {
                    resetCategories();
                  }
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontWeight: "600",
                  textDecoration: "underline"
                }}
              >
                Réinitialiser par défaut
              </button>
            </div>

            {Object.entries(categoriesData.categories || {}).map(([catName, subCats]) => {
              const emoji = categoriesData.emojis[catName] || "🏷️";
              const isExpanded = expandedCat === catName;

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
                  {/* Category Header Row */}
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
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "18px" }}>{emoji}</span>
                      <span style={{ fontWeight: "700", fontSize: "14px", color: textMain }}>
                        {catName}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "2px 6px",
                          borderRadius: "8px",
                          background: isLight ? "#e2e8f0" : "rgba(255,255,255,0.08)",
                          color: textSub
                        }}
                      >
                        {subCats.length} sous-types
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Supprimer définitivement la catégorie "${catName}" ?`)) {
                            removeCategory(catName);
                          }
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
                      <span style={{ fontSize: "12px", color: textSub, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Sub-categories expanded section */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "10px 14px 14px 14px",
                        borderTop: `1px solid ${cardBorder}`,
                        background: isLight ? "#f1f5f9" : "rgba(0,0,0,0.2)"
                      }}
                    >
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
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
