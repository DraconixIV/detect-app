import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { supabase } from "../supabase";

import imageCompression from "browser-image-compression";

import { categoriesWithSub, categoryEmojis } from "../subCategories";

function FindPopup({
  find,
  onDelete,
  onFavorite
}) {

  const [activeTab, setActiveTab] =
    useState("discovery");

  const [title, setTitle] =
    useState(find.title || "");


  const [
    cleanDescription,
    setCleanDescription
  ] = useState(
    find.clean_description || ""
  );

  const [
    identificationLink,
    setIdentificationLink
  ] = useState(
    find.identification_link || ""
  );

  const [latitude, setLatitude] =
  useState(find.latitude || "");

const [longitude, setLongitude] =
  useState(find.longitude || "");

const [date, setDate] =
  useState(find.date || "");

const [category, setCategory] =
  useState(find.category || "");

const [
  subCategory,
  setSubCategory
] = useState(
  find.sub_category || ""
);

const handleCategoryChange = (e) => {
  const newCat = e.target.value;
  setCategory(newCat);
  setSubCategory("");
};

  const [photos, setPhotos] =
    useState([]);

  const [
    discoveryIndex,
    setDiscoveryIndex
  ] = useState(0);

  const [
    cleanIndex,
    setCleanIndex
  ] = useState(0);

  const [
    fullscreenImage,
    setFullscreenImage
  ] = useState(null);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [compareSliderPos, setCompareSliderPos] =
    useState(50);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    if (find.isOfflinePending) {
      if (find.offlinePhoto) {
        setPhotos([
          {
            id: "offline",
            image_url: find.offlinePhoto,
            type: "discovery"
          }
        ]);
      } else {
        setPhotos([]);
      }
      return;
    }
    const { data, error } =
      await supabase
        .from("find_photos")
        .select("*")
        .eq("find_id", find.id);

    if (error) {
      console.error(error);
      return;
    }

    const fetchedPhotos = data || [];
    setPhotos(fetchedPhotos);

    // Preload images to eliminate switching latency
    fetchedPhotos.forEach((photo) => {
      if (photo.image_url) {
        const img = new Image();
        img.src = photo.image_url;
      }
    });
  };

  const saveChanges = async () => {
    if (saving) return;

    setSaving(true);

    const { error } =
      await supabase
        .from("finds")
       .update({
  title,
  clean_title: title,
  clean_description:
    cleanDescription,
  identification_link:
    identificationLink,

  latitude:
    Number(latitude),

  longitude:
    Number(longitude),

  date,

  category,

  sub_category:
    subCategory || null,

})
        .eq("id", find.id);

    setSaving(false);

    if (error) {
      console.error(error);

      alert(
        "Erreur sauvegarde"
      );

      return;
    }

    alert("Sauvegardé ✅");
  };

  const uploadPhoto = async (
    type,
    useCamera = false
  ) => {
    if (uploading) return;

    const input =
      document.createElement("input");

    input.type = "file";

    input.accept = "image/*";

    if (useCamera) {
      input.setAttribute(
        "capture",
        "environment"
      );
    }

    if (!useCamera) {
      input.multiple = true;
    }

    input.onchange = async (e) => {
      const files =
        Array.from(
          e.target.files || []
        );

      if (!files.length) return;

      setUploading(true);

      try {
        for (const file of files) {
          const compressedFile =
            await imageCompression(
              file,
              {
                maxSizeMB: 0.3,
                maxWidthOrHeight: 1600,
                useWebWorker: true
              }
            );

          const cleanName =
            file.name
              .replaceAll(
                " ",
                "-"
              )
              .replaceAll(
                "é",
                "e"
              )
              .replaceAll(
                "è",
                "e"
              )
              .replaceAll(
                "à",
                "a"
              );

          const fileName =
            `${Date.now()}-${cleanName}`;

          const {
            error: uploadError
          } = await supabase.storage
            .from("find-photos")
            .upload(
              fileName,
              compressedFile
            );

          if (uploadError) {
            console.error(
              uploadError
            );

            continue;
          }

          const {
            data: { publicUrl }
          } = supabase.storage
            .from("find-photos")
            .getPublicUrl(
              fileName
            );

          await supabase
            .from("find_photos")
            .insert([
              {
                find_id:
                  find.id,
                image_url:
                  publicUrl,
                type
              }
            ]);
        }

        loadPhotos();
      } catch (err) {
        console.error(err);

        alert(
          "Erreur upload photo"
        );
      }

      setUploading(false);
    };

    input.click();
  };

  const deletePhoto = async (
    photo
  ) => {
    const confirmed =
      window.confirm(
        "Supprimer cette photo ?"
      );

    if (!confirmed) return;

    const fileName =
      photo.image_url
        .split("/")
        .pop();

    await supabase.storage
      .from("find-photos")
      .remove([fileName]);

    await supabase
      .from("find_photos")
      .delete()
      .eq("id", photo.id);

    loadPhotos();
  };

  const discoveryPhotos =
    photos.filter(
      (photo) =>
        photo.type ===
        "discovery"
    );

  const cleanPhotos =
    photos.filter(
      (photo) =>
        photo.type === "clean"
    );

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    boxSizing: "border-box",
    color: "#111827",
    background: "white",
    outline: "none"
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "12px",
    padding: "10px",
    background: "#2563eb",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
  };

  return (
    <>
      <div
  style={{
    width: "270px",
    maxHeight: "65vh",
    overflowY: "scroll",
    WebkitOverflowScrolling: "touch",
    touchAction: "pan-y",

    display: "flex",
    flexDirection: "column",
          gap: "10px",
          color: "#111827",
          fontFamily:
            "system-ui, sans-serif"
        }}
      >
        <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    fontSize: "22px"
  }}
>
  {find.favorite && <span>⭐</span>}
</div>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: "6px"
          }}
        >
          <button
            onClick={() =>
              setActiveTab(
                "discovery"
              )
            }
            style={{
              flex: 1,
              padding: "8px",
              border: "none",
              borderRadius: "10px",
              background:
                activeTab ===
                "discovery"
                  ? "#2563eb"
                  : "#e5e7eb",
              color:
                activeTab ===
                "discovery"
                  ? "white"
                  : "#111827",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Découverte
          </button>

          <button
            onClick={() =>
              setActiveTab("clean")
            }
            style={{
              flex: 1,
              padding: "8px",
              border: "none",
              borderRadius: "10px",
              background:
                activeTab ===
                "clean"
                  ? "#2563eb"
                  : "#e5e7eb",
              color:
                activeTab ===
                "clean"
                  ? "white"
                  : "#111827",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Nettoyage
          </button>

          <button
            onClick={() =>
              setActiveTab("id")
            }
            style={{
              flex: 1,
              padding: "8px",
              border: "none",
              borderRadius: "10px",
              background:
                activeTab === "id"
                  ? "#2563eb"
                  : "#e5e7eb",
              color:
                activeTab === "id"
                  ? "white"
                  : "#111827",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            ID
          </button>

          {discoveryPhotos.length > 0 && cleanPhotos.length > 0 && (
            <button
              onClick={() => setActiveTab("compare")}
              style={{
                flex: 1.2,
                padding: "8px",
                border: "none",
                borderRadius: "10px",
                background: activeTab === "compare" ? "#2563eb" : "#e5e7eb",
                color: activeTab === "compare" ? "white" : "#111827",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Avant/Après ↔️
            </button>
          )}
        </div>

        {/* DISCOVERY */}
        {activeTab ===
          "discovery" && (
          <>
            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Titre"
              style={inputStyle}
            />

            <input
  value={date}
  onChange={(e) =>
    setDate(e.target.value)
  }
  placeholder="Date"
  style={inputStyle}
/>

<input
  type="number"
  step="any"
  value={latitude}
  onChange={(e) =>
    setLatitude(e.target.value)
  }
  placeholder="Latitude"
  style={inputStyle}
/>

<input
  type="number"
  step="any"
  value={longitude}
  onChange={(e) =>
    setLongitude(e.target.value)
  }
  placeholder="Longitude"
  style={inputStyle}
/>

<select
  value={category}
  onChange={handleCategoryChange}
  style={inputStyle}
>
  {Object.keys(categoriesWithSub).map((cat) => (
    <option key={cat} value={cat}>
      {categoryEmojis[cat] || ""} {cat}
    </option>
  ))}
</select>

{categoriesWithSub[category] && (
  <select
    value={subCategory}
    onChange={(e) =>
      setSubCategory(
        e.target.value
      )
    }
    style={inputStyle}
  >
    <option value="">
      Sous-catégorie
    </option>

    {categoriesWithSub[category].map(
      (subCat) => (
        <option
          key={subCat}
          value={subCat}
        >
          {subCat}
        </option>
      )
    )}
  </select>
)}

<div
  style={{
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    margin: "5px 0"
  }}
>
  <div
    style={{
      padding: "6px 12px",
      borderRadius: "8px",
      background: "#e5e7eb",
      textAlign: "center",
      fontSize: "13px",
      fontWeight: "600",
      color: "#1f2937",
      flex: 1
    }}
  >
    {categoryEmojis[category] || "📍"} {category}
  </div>

  {subCategory && (
    <div
      style={{
        padding: "6px 12px",
        borderRadius: "8px",
        background: "#f3f4f6",
        textAlign: "center",
        fontSize: "13px",
        fontWeight: "600",
        color: "#4b5563",
        flex: 1
      }}
    >
      🏷️ {subCategory}
    </div>
  )}
</div>

            {!find.isOfflinePending && (
              <>
                <button
                  disabled={uploading}
                  onClick={() =>
                    uploadPhoto(
                      "discovery",
                      true
                    )
                  }
                  style={buttonStyle}
                >
                  📸 Caméra
                </button>

                <button
                  disabled={uploading}
                  onClick={() =>
                    uploadPhoto(
                      "discovery",
                      false
                    )
                  }
                  style={buttonStyle}
                >
                  🖼️ Galerie
                </button>
              </>
            )}

            {discoveryPhotos.length >
              0 && (
              <>
                <img
                  src={
                    discoveryPhotos[
                      discoveryIndex
                    ].image_url
                  }
                  alt=""
                  onClick={() =>
                    setFullscreenImage(
                      discoveryPhotos[
                        discoveryIndex
                      ].image_url
                    )
                  }
                  style={{
                    width: "100%",
                    maxHeight: "220px",
                    objectFit: "cover",
                    borderRadius: "14px",
                    cursor: "pointer",
                    border:
                      "2px solid #e5e7eb"
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "center",
                    gap: "8px"
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setDiscoveryIndex(
                        (
                          discoveryIndex -
                          1 +
                          discoveryPhotos.length
                        ) %
                          discoveryPhotos.length
                      );
                    }}
                    style={buttonStyle}
                  >
                    ←
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setDiscoveryIndex(
                        (
                          discoveryIndex +
                          1
                        ) %
                          discoveryPhotos.length
                      );
                    }}
                    style={buttonStyle}
                  >
                    →
                  </button>
                </div>

                <button
                  onClick={() =>
                    deletePhoto(
                      discoveryPhotos[
                        discoveryIndex
                      ]
                    )
                  }
                  style={{
                    ...buttonStyle,
                    background:
                      "#dc2626"
                  }}
                >
                  🗑️ Supprimer photo
                </button>
              </>
            )}
          </>
        )}

        {/* CLEAN */}
        {activeTab ===
          "clean" && (
          <>
            <textarea
  value={cleanDescription}
  onChange={(e) =>
    setCleanDescription(
      e.target.value
    )
  }
  placeholder="Description"
  style={{
    ...inputStyle,
    minHeight: "100px",
    resize: "vertical"
  }}
/>

            {!find.isOfflinePending && (
              <>
                <button
                  disabled={uploading}
                  onClick={() =>
                    uploadPhoto(
                      "clean",
                      true
                    )
                  }
                  style={buttonStyle}
                >
                  📸 Caméra
                </button>

                <button
                  disabled={uploading}
                  onClick={() =>
                    uploadPhoto(
                      "clean",
                      false
                    )
                  }
                  style={buttonStyle}
                >
                  🖼️ Galerie
                </button>
              </>
            )}

            {cleanPhotos.length >
              0 && (
              <>
                <img
                  src={
                    cleanPhotos[
                      cleanIndex
                    ].image_url
                  }
                  alt=""
                  onClick={() =>
                    setFullscreenImage(
                      cleanPhotos[
                        cleanIndex
                      ].image_url
                    )
                  }
                  style={{
                    width: "100%",
                    maxHeight: "220px",
                    objectFit: "cover",
                    borderRadius: "14px",
                    cursor: "pointer",
                    border:
                      "2px solid #e5e7eb"
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "center",
                    gap: "8px"
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setCleanIndex(
                        (
                          cleanIndex -
                          1 +
                          cleanPhotos.length
                        ) %
                          cleanPhotos.length
                      );
                    }}
                    style={buttonStyle}
                  >
                    ←
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setCleanIndex(
                        (
                          cleanIndex +
                          1
                        ) %
                          cleanPhotos.length
                      );
                    }}
                    style={buttonStyle}
                  >
                    →
                  </button>
                </div>

                <button
                  onClick={() =>
                    deletePhoto(
                      cleanPhotos[
                        cleanIndex
                      ]
                    )
                  }
                  style={{
                    ...buttonStyle,
                    background:
                      "#dc2626"
                  }}
                >
                  🗑️ Supprimer photo
                </button>
              </>
            )}
          </>
        )}

        {/* ID */}
        {activeTab === "id" && (
          <>
            <input
              value={
                identificationLink
              }
              onChange={(e) =>
                setIdentificationLink(
                  e.target.value
                )
              }
              placeholder="Lien d'identification"
              style={inputStyle}
            />

            {identificationLink && (
              <a
                href={
                  identificationLink
                }
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#2563eb",
                  fontWeight: "600"
                }}
              >
                🔗 Ouvrir le lien
              </a>
            )}
          </>
        )}

        {/* COMPARE SLIDER */}
        {activeTab === "compare" && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "250px",
              overflow: "hidden",
              borderRadius: "14px",
              border: "2px solid #e5e7eb",
              userSelect: "none"
            }}
          >
            {/* Before (Discovery) Image */}
            <img
              src={discoveryPhotos[discoveryIndex]?.image_url || discoveryPhotos[0]?.image_url}
              alt="Avant"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0
              }}
            />

            {/* After (Clean) Image */}
            <img
              src={cleanPhotos[cleanIndex]?.image_url || cleanPhotos[0]?.image_url}
              alt="Après"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                clipPath: `inset(0 ${100 - compareSliderPos}% 0 0)`
              }}
            />

            {/* Labels */}
            <div
              style={{
                position: "absolute",
                left: "10px",
                bottom: "10px",
                background: "rgba(0,0,0,0.68)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: "bold",
                zIndex: 10
              }}
            >
              Avant (Brut)
            </div>

            <div
              style={{
                position: "absolute",
                right: "10px",
                bottom: "10px",
                background: "rgba(0,0,0,0.68)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: "bold",
                zIndex: 10
              }}
            >
              Après (Propre)
            </div>

            {/* Range Input Slider overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={compareSliderPos}
              onChange={(e) => setCompareSliderPos(Number(e.target.value))}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "ew-resize",
                zIndex: 20,
                margin: 0
              }}
            />

            {/* Visual divider bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${compareSliderPos}%`,
                width: "3px",
                background: "white",
                boxShadow: "0 0 8px rgba(0,0,0,0.5)",
                transform: "translateX(-50%)",
                pointerEvents: "none",
                zIndex: 15
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "32px",
                  height: "32px",
                  background: "white",
                  borderRadius: "50%",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#4b5563"
                }}
              >
                ↔
              </div>
            </div>
          </div>
        )}

      <button
  onClick={() => onFavorite(find)}
  style={{
    border: "none",
    borderRadius: "14px",
    padding: "12px",
    background: find.favorite
      ? "#f59e0b"
      : "#6b7280",
    color: "white",
    fontWeight: "700",
    cursor: "pointer"
  }}
>
  {find.favorite
    ? "⭐ Retirer des favoris"
    : "☆ Ajouter aux favoris"}
</button>

        {/* DELETE */}
        <button
          onClick={() =>
            onDelete(find.id)
          }
          style={{
            border: "none",
            borderRadius: "14px",
            padding: "12px",
            background: "#dc2626",
            color: "white",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          🗑️ Supprimer trouvaille
        </button>

        {/* SAVE */}
        {!find.isOfflinePending ? (
          <button
            disabled={saving}
            onClick={saveChanges}
            style={{
              border: "none",
              borderRadius: "14px",
              padding: "12px",
              background: "#16a34a",
              color: "white",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {saving
              ? "Sauvegarde..."
              : "💾 Sauvegarder"}
          </button>
        ) : (
          <div style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", padding: "10px", borderRadius: "10px", fontSize: "12px", textAlign: "center", width: "100%", fontWeight: "600", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
            💾 Trouvaille hors-ligne. Les modifications seront disponibles après synchronisation.
          </div>
        )}
      </div>

      {/* FULLSCREEN */}
      {fullscreenImage && createPortal(
        <div
          onClick={() =>
            setFullscreenImage(null)
          }
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: "translateZ(0)",
            zIndex: 99999,
          }}
        >
          <img
            src={fullscreenImage}
            alt=""
            style={{
              maxWidth: "95vw",
              maxHeight: "95vh",
              objectFit: "contain",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}
          />
        </div>,
        document.body
      )}
    </>
  );
}

export default FindPopup;