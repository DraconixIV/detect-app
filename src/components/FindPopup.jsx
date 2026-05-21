import { useEffect, useState } from "react";

import { supabase } from "../supabase";

import imageCompression from "browser-image-compression";

function FindPopup({
  find,
  onDelete
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
            identificationLink
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

    // IMPORTANT :
    // ouvre directement la caméra
    // sur téléphone
    if (useCamera) {
      input.setAttribute(
        "capture",
        "environment"
      );
    }

    // galerie = multi upload
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

  return (
    <>
      <div
        style={{
          width: "250px"
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "5px",
            marginBottom: "10px"
          }}
        >
          <button
            onClick={() =>
              setActiveTab(
                "discovery"
              )
            }
          >
            Découverte
          </button>

          <button
            onClick={() =>
              setActiveTab("clean")
            }
          >
            Nettoyage
          </button>

          <button
            onClick={() =>
              setActiveTab("id")
            }
          >
            ID
          </button>
        </div>

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
            />

            <br />
            <br />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Description"
            />

            <br />
            <br />

            📅 {find.date}

            <br />
            <br />

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "6px"
              }}
            >
              <button
                disabled={uploading}
                onClick={() =>
                  uploadPhoto(
                    "discovery",
                    true
                  )
                }
              >
                {uploading
                  ? "Upload..."
                  : "📸 Prendre une photo"}
              </button>

              <button
                disabled={uploading}
                onClick={() =>
                  uploadPhoto(
                    "discovery",
                    false
                  )
                }
              >
                {uploading
                  ? "Upload..."
                  : "🖼️ Ajouter depuis galerie"}
              </button>
            </div>

            <br />
            <br />

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
                  width="200"
                  style={{
                    cursor:
                      "pointer",
                    borderRadius:
                      "10px"
                  }}
                  onClick={() =>
                    setFullscreenImage(
                      discoveryPhotos[
                        discoveryIndex
                      ].image_url
                    )
                  }
                />

                <br />
                <br />

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
                >
                  →

                </button>

                <br />
                <br />

                <button
                  onClick={() =>
                    deletePhoto(
                      discoveryPhotos[
                        discoveryIndex
                      ]
                    )
                  }
                >
                  🗑️ Supprimer
                </button>
              </>
            )}
          </>
        )}

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
            />

            <br />
            <br />

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
            />

            <br />
            <br />

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "6px"
              }}
            >
              <button
                disabled={uploading}
                onClick={() =>
                  uploadPhoto(
                    "clean",
                    true
                  )
                }
              >
                {uploading
                  ? "Upload..."
                  : "📸 Prendre une photo"}
              </button>

              <button
                disabled={uploading}
                onClick={() =>
                  uploadPhoto(
                    "clean",
                    false
                  )
                }
              >
                {uploading
                  ? "Upload..."
                  : "🖼️ Ajouter depuis galerie"}
              </button>
            </div>

            <br />
            <br />

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
                  width="200"
                  style={{
                    cursor:
                      "pointer",
                    borderRadius:
                      "10px"
                  }}
                  onClick={() =>
                    setFullscreenImage(
                      cleanPhotos[
                        cleanIndex
                      ].image_url
                    )
                  }
                />

                <br />
                <br />

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
                >
                  →
                </button>

                <br />
                <br />

                <button
                  onClick={() =>
                    deletePhoto(
                      cleanPhotos[
                        cleanIndex
                      ]
                    )
                  }
                >
                  🗑️ Supprimer
                </button>
              </>
            )}
          </>
        )}

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
            />

            <br />
            <br />

            {identificationLink && (
              <a
                href={
                  identificationLink
                }
                target="_blank"
                rel="noreferrer"
              >
                Ouvrir le lien
              </a>
            )}
          </>
        )}

        <br />
        <br />

        <button
          onClick={() =>
            onDelete(find.id)
          }
          style={{
            background: "#c62828",
            color: "white",
            marginBottom: "10px"
          }}
        >
          🗑️ Supprimer trouvaille
        </button>

        <br />

        <button
          disabled={saving}
          onClick={saveChanges}
        >
          {saving
            ? "Sauvegarde..."
            : "💾 Sauvegarder"}
        </button>
      </div>

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
              "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            zIndex: 99999,
            cursor: "pointer"
          }}
        >
          <img
            src={fullscreenImage}
            alt=""
            style={{
              maxWidth: "95%",
              maxHeight: "95%"
            }}
          />
        </div>
      )}
    </>
  );
}

export default FindPopup;