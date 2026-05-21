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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "10px",
        padding: "10px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.05)"
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
        style={{
          padding: "10px",
          borderRadius: "12px",
          border: "none",
          outline: "none",
          fontSize: "13px",
          background: "#f3f4f6"
        }}
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
          padding: "10px",
          borderRadius: "12px",
          border: "none",
          outline: "none",
          fontSize: "13px",
          minHeight: "90px",
          resize: "none",
          background: "#f3f4f6"
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
        style={{
          padding: "10px",
          borderRadius: "12px",
          border: "none",
          outline: "none",
          fontSize: "13px",
          background: "#f3f4f6"
        }}
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
          background: "#2563eb",
          color: "white",
          padding: "12px",
          borderRadius: "14px",
          textAlign: "center",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "600"
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
            padding: "10px",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "white",
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
              maxHeight: "180px",
              objectFit: "cover"
            }}
          />

          <button
            onClick={() =>
              setNewPhoto(null)
            }
            style={{
              border: "none",
              borderRadius: "10px",
              padding: "8px",
              background: "#ef4444",
              color: "white",
              cursor: "pointer",
              fontSize: "12px"
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
          borderRadius: "14px",
          padding: "12px",
          border: "none",
          background: addingFind
            ? "#4b5563"
            : "#16a34a",
          color: "white",
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
          transition: "0.2s"
        }}
      >
        {addingFind
          ? "Ajout en cours..."
          : "✅ Sauvegarder trouvaille"}
      </button>
    </div>
  );
}