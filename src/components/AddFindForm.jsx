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
        flexDirection:
          "column",
        gap: "8px"
      }}
    >
      <input
        placeholder="Titre"
        value={newTitle}
        onChange={(e) =>
          setNewTitle(
            e.target.value
          )
        }
        style={{
          padding: "8px",
          borderRadius: "10px",
          border: "none",
          fontSize: "13px"
        }}
      />

      <textarea
        placeholder="Description"
        value={newDescription}
        onChange={(e) =>
          setNewDescription(
            e.target.value
          )
        }
        style={{
          padding: "8px",
          borderRadius: "10px",
          border: "none",
          fontSize: "13px",
          minHeight: "70px"
        }}
      />

      <select
        value={newCategory}
        onChange={(e) =>
          setNewCategory(
            e.target.value
          )
        }
        style={{
          padding: "8px",
          borderRadius: "10px",
          border: "none",
          fontSize: "13px"
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

      {/* CAMERA */}
      <label
        style={{
          background:
            "#2563eb",
          color: "white",
          padding: "10px",
          borderRadius:
            "12px",
          textAlign: "center",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "600"
        }}
      >
        📷 Prendre une photo

        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{
            display: "none"
          }}
          onChange={(e) =>
            setNewPhoto(
              e.target.files[0]
            )
          }
        />
      </label>

      {/* GALERIE */}
      <label
        style={{
          background:
            "#374151",
          color: "white",
          padding: "10px",
          borderRadius:
            "12px",
          textAlign: "center",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "600"
        }}
      >
        🖼️ Choisir depuis galerie

        <input
          type="file"
          accept="image/*"
          style={{
            display: "none"
          }}
          onChange={(e) =>
            setNewPhoto(
              e.target.files[0]
            )
          }
        />
      </label>

      {/* PREVIEW */}
      {newPhoto && (
        <div
          style={{
            background:
              "rgba(255,255,255,0.08)",
            padding: "8px",
            borderRadius:
              "10px",
            fontSize: "12px",
            color: "white"
          }}
        >
          📸 {newPhoto.name}
        </div>
      )}

      {/* SAVE BUTTON */}
      <button
        disabled={addingFind}
        onClick={addFind}
        style={{
          borderRadius:
            "12px",
          padding: "10px",
          border: "none",
          background:
            "#16a34a",
          color: "white",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >
        {addingFind
          ? "Ajout..."
          : "✅ Sauvegarder trouvaille"}
      </button>
    </div>
  );
}