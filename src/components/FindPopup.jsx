import { useEffect, useState } from "react";

import { supabase } from "../supabase";

import imageCompression from "browser-image-compression";

function FindPopup({
  find,
  onDelete,
  onFavorite
}) {
  const [activeTab, setActiveTab] =
    useState("discovery");

  const [title, setTitle] =
    useState(find.title || "");

  const [description, setDescription] =
    useState(find.description || "");

  const [cleanTitle, setCleanTitle] =
    useState(find.clean_title || "");

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

const [isOldFind, setIsOldFind] =
  useState(find.is_old_find || false);

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

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    const { data, error } =
      await supabase
        .from("find_photos")
        .select("*")
        .eq("find_id", find.id);

    if (error) {
      console.error(error);
      return;
    }

    setPhotos(data || []);
  };

  const saveChanges = async () => {
    if (saving) return;

    setSaving(true);

    const { error } =
      await supabase
        .from("finds")
       .update({
  title,
  description,
  clean_title: cleanTitle,
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

  is_old_find:
    isOldFind
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

{isOldFind && (
  <div
    style={{
      textAlign: "center",
      fontSize: "18px",
      fontWeight: "bold"
    }}
  >
    🏛️ Ancienne trouvaille
  </div>
)}
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

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Description"
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "none"
              }}
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
  onChange={(e) =>
    setCategory(e.target.value)
  }
  style={inputStyle}
>
  <option value="autre">autre</option>
  <option value="bijou">bijou</option>
  <option value="boucle">boucle</option>
  <option value="bouton">bouton</option>
  <option value="dé à coudre">dé à coudre</option>
  <option value="médaille">médaille</option>
  <option value="militaire">militaire</option>
  <option value="monnaie">monnaie</option>
  <option value="outil">outil</option>
  <option value="plomb">plomb</option>
  <option value="religieux">religieux</option>
</select>

<label
  style={{
    display: "flex",
    gap: "8px",
    alignItems: "center"
  }}
>
  <input
    type="checkbox"
    checked={isOldFind}
    onChange={(e) =>
      setIsOldFind(
        e.target.checked
      )
    }
  />
  Ancienne trouvaille
</label>

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
                    onClick={() =>
                      setDiscoveryIndex(
                        (
                          discoveryIndex -
                          1 +
                          discoveryPhotos.length
                        ) %
                          discoveryPhotos.length
                      )
                    }
                    style={buttonStyle}
                  >
                    ←
                  </button>

                  <button
                    onClick={() =>
                      setDiscoveryIndex(
                        (
                          discoveryIndex +
                          1
                        ) %
                          discoveryPhotos.length
                      )
                    }
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
            <input
              value={cleanTitle}
              onChange={(e) =>
                setCleanTitle(
                  e.target.value
                )
              }
              placeholder="Titre nettoyage"
              style={inputStyle}
            />

            <textarea
              value={
                cleanDescription
              }
              onChange={(e) =>
                setCleanDescription(
                  e.target.value
                )
              }
              placeholder="Description nettoyage"
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "none"
              }}
            />

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
                    onClick={() =>
                      setCleanIndex(
                        (
                          cleanIndex -
                          1 +
                          cleanPhotos.length
                        ) %
                          cleanPhotos.length
                      )
                    }
                    style={buttonStyle}
                  >
                    ←
                  </button>

                  <button
                    onClick={() =>
                      setCleanIndex(
                        (
                          cleanIndex +
                          1
                        ) %
                          cleanPhotos.length
                      )
                    }
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
      </div>

      {/* FULLSCREEN */}
      {fullscreenImage && (
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
            background:
              "rgba(0,0,0,0.92)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            zIndex: 99999,
            cursor: "pointer",
            padding: "10px",
            boxSizing: "border-box"
          }}
        >
          <img
            src={fullscreenImage}
            alt=""
            style={{
              maxWidth: "95%",
              maxHeight: "95%",
              borderRadius: "16px",
              boxShadow:
                "0 0 40px rgba(0,0,0,0.5)"
            }}
          />
        </div>
      )}
    </>
  );
}

export default FindPopup;