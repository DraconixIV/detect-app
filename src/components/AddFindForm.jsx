import { useState, useEffect } from "react";
import { materials, materialEmojis } from "../subCategories";
import { loadCategoriesData } from "../services/categoriesService";

export default function AddFindForm({
  showForm,
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  newCategory,
  setNewCategory,
  newSubCategory,
  setNewSubCategory,
  icons,
  addFind,
  newPhoto,
  setNewPhoto,
  addingFind,
  customDate,
  setCustomDate,
  customLat,
  setCustomLat,
  customLng,
  setCustomLng,
}) {
  const [isManualMode, setIsManualMode] = useState(false);
  const [categoryData, setCategoryData] = useState(() => loadCategoriesData());

  useEffect(() => {
    const handleCategoriesUpdate = () => {
      setCategoryData(loadCategoriesData());
    };
    window.addEventListener("categories-updated", handleCategoriesUpdate);
    return () => window.removeEventListener("categories-updated", handleCategoriesUpdate);
  }, []);

  if (!showForm) return null;

  const categories = categoryData.categories || {};
  const emojis = categoryData.emojis || {};
  const categoryKeys = Object.keys(categories);
  const availableSubCats = categories[newCategory] || [];

  const handleModeToggle = (manual) => {
    setIsManualMode(manual);
    if (!manual) {
      if (setCustomDate) setCustomDate("");
      if (setCustomLat) setCustomLat("");
      if (setCustomLng) setCustomLng("");
    }
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    fontSize: "14px",
    background: "rgba(255, 255, 255, 0.08)",
    color: "#ffffff",
    width: "100%",
    boxSizing: "border-box",
    fontWeight: "500",
    transition: "all 0.2s ease"
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginTop: "12px",
        padding: "16px",
        borderRadius: "20px",
        background: "linear-gradient(180deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
        position: "relative",
        zIndex: 10
      }}
    >
      {/* MODE SELECTOR TOGGLE (DIRECT LIVE VS MANUEL DIFFERÉ) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px",
          background: "rgba(0, 0, 0, 0.3)",
          padding: "4px",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.06)"
        }}
      >
        <button
          type="button"
          onClick={() => handleModeToggle(false)}
          style={{
            padding: "9px 6px",
            borderRadius: "10px",
            border: "none",
            background: !isManualMode ? "linear-gradient(135deg, #10b981, #059669)" : "transparent",
            color: !isManualMode ? "#ffffff" : "#9ca3af",
            fontWeight: !isManualMode ? "700" : "500",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            boxShadow: !isManualMode ? "0 2px 8px rgba(16,185,129,0.3)" : "none"
          }}
        >
          <span>⚡</span> Direct (Live)
        </button>

        <button
          type="button"
          onClick={() => handleModeToggle(true)}
          style={{
            padding: "9px 6px",
            borderRadius: "10px",
            border: "none",
            background: isManualMode ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "transparent",
            color: isManualMode ? "#ffffff" : "#9ca3af",
            fontWeight: isManualMode ? "700" : "500",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            boxShadow: isManualMode ? "0 2px 8px rgba(59,130,246,0.3)" : "none"
          }}
        >
          <span>✍️</span> Différé (Manuel)
        </button>
      </div>

      {/* MODE INFO BADGE */}
      <div
        style={{
          fontSize: "11px",
          padding: "6px 10px",
          borderRadius: "8px",
          background: isManualMode ? "rgba(59, 130, 246, 0.12)" : "rgba(16, 185, 129, 0.12)",
          border: `1px solid ${isManualMode ? "rgba(59, 130, 246, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
          color: isManualMode ? "#93c5fd" : "#6ee7b7",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}
      >
        <span>{isManualMode ? "ℹ️" : "📍"}</span>
        <span>
          {isManualMode
            ? "Mode différé : vous pouvez spécifier la date et les coordonnées GPS manuellement."
            : "Mode direct : position GPS actuelle et date instantanée enregistrées automatiquement."}
        </span>
      </div>

      {/* TITRE */}
      <div>
        <label style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", marginBottom: "4px", display: "block" }}>
          Titre de l'objet *
        </label>
        <input
          type="text"
          placeholder="Ex: Denier tournois, Double Tournois, Boucle médiévale..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* CATEGORIE & SOUS-CATEGORIE */}
      <div style={{ display: "grid", gridTemplateColumns: availableSubCats.length > 0 ? "1fr 1fr" : "1fr", gap: "8px" }}>
        <div>
          <label style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", marginBottom: "4px", display: "block" }}>
            Catégorie
          </label>
          <select
            value={newCategory}
            onChange={(e) => {
              const cat = e.target.value;
              setNewCategory(cat);
              setNewSubCategory("");
            }}
            style={inputStyle}
          >
            {categoryKeys.map((cat) => (
              <option key={cat} value={cat} style={{ background: "#1f2937", color: "#ffffff" }}>
                {emojis[cat] || "🏷️"} {cat}
              </option>
            ))}
          </select>
        </div>

        {availableSubCats.length > 0 && (
          <div>
            <label style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", marginBottom: "4px", display: "block" }}>
              Sous-catégorie
            </label>
            <select
              value={newSubCategory}
              onChange={(e) => setNewSubCategory(e.target.value)}
              style={inputStyle}
            >
              <option value="" style={{ background: "#1f2937", color: "#9ca3af" }}>
                -- Sélectionner --
              </option>
              {availableSubCats.map((subCat) => (
                <option key={subCat} value={subCat} style={{ background: "#1f2937", color: "#ffffff" }}>
                  {subCat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* MATIERE */}
      <div>
        <label style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", marginBottom: "4px", display: "block" }}>
          Matière / Métal
        </label>
        <select
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={inputStyle}
        >
          <option value="" style={{ background: "#1f2937", color: "#9ca3af" }}>Matière non spécifiée</option>
          {materials.map((mat) => (
            <option key={mat} value={mat} style={{ background: "#1f2937", color: "#ffffff" }}>
              {materialEmojis[mat] || ""} {mat}
            </option>
          ))}
        </select>
      </div>

      {/* CHAMPS MANUELS (UNIQUEMENT SI MODE DIFFERE ACTIVE) */}
      {isManualMode && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "12px",
            borderRadius: "14px",
            background: "rgba(0,0,0,0.25)",
            border: "1px dashed rgba(59, 130, 246, 0.4)"
          }}
        >
          <div>
            <label style={{ fontSize: "11px", fontWeight: "600", color: "#93c5fd", marginBottom: "4px", display: "block" }}>
              📅 Date de découverte
            </label>
            <input
              type="date"
              value={customDate || ""}
              onChange={(e) => setCustomDate && setCustomDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#93c5fd", marginBottom: "4px", display: "block" }}>
                🌐 Latitude
              </label>
              <input
                type="number"
                step="any"
                placeholder="Ex: 43.273"
                value={customLat || ""}
                onChange={(e) => setCustomLat && setCustomLat(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#93c5fd", marginBottom: "4px", display: "block" }}>
                🌐 Longitude
              </label>
              <input
                type="number"
                step="any"
                placeholder="Ex: 3.173"
                value={customLng || ""}
                onChange={(e) => setCustomLng && setCustomLng(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      )}

      {/* BOUTON PHOTO */}
      <label
        style={{
          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          color: "white",
          padding: "12px",
          borderRadius: "14px",
          textAlign: "center",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "700",
          boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }}
      >
        <span>📷</span>
        <span>{newPhoto ? "Changer la photo" : "Ajouter une photo"}</span>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setNewPhoto(file);
          }}
        />
      </label>

      {/* PREVIEW PHOTO */}
      {newPhoto && (
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            padding: "10px",
            borderRadius: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#f3f4f6",
              wordBreak: "break-word"
            }}
          >
            📸 {newPhoto.name}
          </div>

          <img
            src={URL.createObjectURL(newPhoto)}
            alt="preview"
            style={{
              width: "100%",
              borderRadius: "10px",
              maxHeight: "180px",
              objectFit: "cover",
              border: "1px solid rgba(255,255,255,0.15)"
            }}
          />

          <button
            type="button"
            onClick={() => setNewPhoto(null)}
            style={{
              border: "none",
              borderRadius: "10px",
              padding: "8px",
              background: "#ef4444",
              color: "white",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600"
            }}
          >
            ❌ Retirer photo
          </button>
        </div>
      )}

      {/* BOUTON SAVE */}
      <button
        type="button"
        disabled={addingFind || !newTitle.trim()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addFind();
        }}
        style={{
          borderRadius: "14px",
          padding: "14px",
          border: "none",
          background: addingFind || !newTitle.trim()
            ? "#4b5563"
            : "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          fontSize: "14px",
          fontWeight: "700",
          cursor: addingFind || !newTitle.trim() ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          boxShadow: addingFind || !newTitle.trim() ? "none" : "0 4px 14px rgba(16,185,129,0.35)"
        }}
      >
        {addingFind ? "Enregistrement en cours..." : "✅ Enregistrer la trouvaille"}
      </button>
    </div>
  );
}