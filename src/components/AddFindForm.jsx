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
  addingFind
}) {
  if (!showForm) return null;

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
          "0 8px 24px rgba(0,0,0,0.35)"
      }}
    >
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

      {/* DESCRIPTION */}
      <textarea
        placeholder="Description"
        value={newDescription}
        onChange={(e) =>
          setNewDescription(
            e.target.value
          )
        }
        style={{
          ...inputStyle,
          minHeight: "100px",
          resize: "none",
          fontFamily: "inherit"
        }}
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
        disabled={
          addingFind || !newTitle
        }
        onClick={addFind}
        style={{
          borderRadius: "15px",
          padding: "14px",
          border: "none",
          background: addingFind
            ? "#4b5563"
            : "linear-gradient(135deg,#16a34a,#15803d)",
          color: "white",
          fontSize: "15px",
          fontWeight: "800",
          cursor: "pointer",
          transition: "0.2s",
          boxShadow:
            "0 6px 16px rgba(22,163,74,0.35)"
        }}
      >
        {addingFind
          ? "Ajout en cours..."
          : "✅ Sauvegarder trouvaille"}
      </button>
    </div>
  );
}