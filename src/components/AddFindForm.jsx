export default function AddFindForm({
  showForm,
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  newCategory,
  setNewCategory,
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

  if (!showForm) return null;
  console.log("ADD FINDFORM V999");
  <h1 style={{ color: "red" }}>
    VERSION 2026 TEST
  </h1>

  const inputStyle = {
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    fontSize: "14px",
    background: "#f9fafb",
    color: "#111827",
    width: "100%",
    boxSizing: "border-box",
    fontWeight: "500"
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginTop: "12px",
        padding: "14px",
        borderRadius: "18px",
        background: "rgba(17,24,39,0.92)",
        backdropFilter: "blur(12px)",
        boxShadow:
          "0 8px 24px rgba(0,0,0,0.35)",
        position: "relative",
        zIndex: 10
      }}
    >
        <h1 style={{ color: "red" }}>
          VERSION NOUVELLE
        </h1>
      {/* TITRE */}
      <input
        type="text"
        placeholder="Titre de la trouvaille"
        value={newTitle}
        onChange={(e) =>
          setNewTitle(e.target.value)
        }
        style={inputStyle}
      />

      {/* CATEGORIE */}
      <select
        value={newCategory}
        onChange={(e) =>
          setNewCategory(
            e.target.value
          )
        }
        style={inputStyle}
      >
        {Object.keys(icons).map(
          (cat) => (
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          )
        )}
      </select>

    <input
  type="date"
  value={customDate}
  onChange={(e) =>
    setCustomDate(e.target.value)
  }
  style={inputStyle}
/>

<input
  type="number"
  step="any"
  placeholder="Latitude"
  value={customLat}
  onChange={(e) =>
    setCustomLat(e.target.value)
  }
  style={inputStyle}
/>

<input
  type="number"
  step="any"
  placeholder="Longitude"
  value={customLng}
  onChange={(e) =>
    setCustomLng(e.target.value)
  }
  style={inputStyle}
/>

      {/* BOUTON PHOTO */}
      <label
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#1d4ed8)",
          color: "white",
          padding: "13px",
          borderRadius: "14px",
          textAlign: "center",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "700",
          boxShadow:
            "0 4px 12px rgba(37,99,235,0.35)"
        }}
      >
        📷 Ajouter une photo

        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{
            display: "none"
          }}
          onChange={(e) => {
            const file =
              e.target.files?.[0];

            if (!file) return;

            setNewPhoto(file);
          }}
        />
      </label>

      {/* PREVIEW PHOTO */}
      {newPhoto && (
        <div
          style={{
            background:
              "rgba(255,255,255,0.08)",
            padding: "12px",
            borderRadius: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#f3f4f6",
              wordBreak:
                "break-word"
            }}
          >
            📸 {newPhoto.name}
          </div>

          <img
            src={URL.createObjectURL(
              newPhoto
            )}
            alt="preview"
            style={{
              width: "100%",
              borderRadius: "12px",
              maxHeight: "220px",
              objectFit: "cover",
              border:
                "2px solid rgba(255,255,255,0.08)"
            }}
          />

          <button
            type="button"
            onClick={() =>
              setNewPhoto(null)
            }
            style={{
              border: "none",
              borderRadius: "10px",
              padding: "10px",
              background: "#ef4444",
              color: "white",
              cursor: "pointer",
              fontSize: "13px",
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
        disabled={addingFind}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          addFind();
        }}
        style={{
          borderRadius: "14px",
          padding: "12px",
          border: "none",
          background: addingFind
            ? "#4b5563"
            : "#16a34a",
          color: "white",
          fontSize: "14px",
          fontWeight: "700",
          cursor: addingFind
            ? "not-allowed"
            : "pointer",
          transition: "0.2s",
          position: "relative",
          zIndex: 999
        }}
      >
        {addingFind
          ? "Ajout en cours..."
          : "✅ Sauvegarder trouvaille"}
      </button>
    </div>
  );
}