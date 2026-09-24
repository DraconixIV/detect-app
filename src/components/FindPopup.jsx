import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../supabase";
import imageCompression from "browser-image-compression";
import CropperModal from "./CropperModal";
import ConfirmModal from "./ConfirmModal";
import { materials, materialEmojis } from "../subCategories";
import { loadCategoriesData } from "../services/categoriesService";
import { loadMaterialsData } from "../services/materialsService";
import { encodeMetadata, decodeMetadata, fileToDataUrl } from "../services/findsService";
import AudioNotePlayer from "./AudioNotePlayer";

export default function FindPopup({
  find,
  onDelete,
  onFavorite,
  onUpdate,
  workspace = { mode: "personal" }
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("discovery");
  const [title, setTitle] = useState(find.title || "");
  const [cleanDescription, setCleanDescription] = useState(find.clean_description || "");
  const [identificationLink, setIdentificationLink] = useState(find.identification_link || "");
  const [latitude, setLatitude] = useState(find.latitude || "");
  const [longitude, setLongitude] = useState(find.longitude || "");
  const [date, setDate] = useState(find.date || "");
  const [category, setCategory] = useState(find.category || "");
  const [subCategory, setSubCategory] = useState(find.sub_category || "");
  const [material, setMaterial] = useState(find.description || "Indéterminé");
  const [videoUrl, setVideoUrl] = useState(() => find.video_url || find.video || decodeMetadata(find)?.video_url || null);
  const [photos, setPhotos] = useState([]);
  const [discoveryIndex, setDiscoveryIndex] = useState(0);
  const [cleanIndex, setCleanIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [croppingStep, setCroppingStep] = useState("none"); // 'none' | 'before' | 'after' | 'saving'
  const [croppedBeforeBlob, setCroppedBeforeBlob] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [materialsData, setMaterialsData] = useState(() => loadMaterialsData());
  const [categoriesData, setCategoriesData] = useState(() => loadCategoriesData());
  const [isFav, setIsFav] = useState(!!find.favorite);

  useEffect(() => {
    setTitle(find.title || "");
    setCleanDescription(find.clean_description || "");
    setIdentificationLink(find.identification_link || "");
    setLatitude(find.latitude || "");
    setLongitude(find.longitude || "");
    setDate(find.date || "");
    setCategory(find.category || "");
    setSubCategory(find.sub_category || "");
    setMaterial(find.description || "Indéterminé");
    const resolvedVideo = find.video_url || find.video || decodeMetadata(find)?.video_url || null;
    setVideoUrl(resolvedVideo);
    setIsFav(!!find.favorite);
  }, [find.id, find.video_url, find.video, find.description]);

  useEffect(() => {
    const handleCategoriesUpdate = () => {
      setCategoriesData(loadCategoriesData());
    };
    const handleMaterialsUpdate = () => {
      setMaterialsData(loadMaterialsData());
    };
    window.addEventListener("categories-updated", handleCategoriesUpdate);
    window.addEventListener("materials-updated", handleMaterialsUpdate);
    return () => {
      window.removeEventListener("categories-updated", handleCategoriesUpdate);
      window.removeEventListener("materials-updated", handleMaterialsUpdate);
    };
  }, []);

  const { categories: categoriesWithSub = {}, emojis: categoryEmojis = {} } = categoriesData || {};
  const availableCategories = Array.from(new Set([
    ...Object.keys(categoriesWithSub),
    ...(category ? [category] : [])
  ]));
  const availableSubCats = Array.from(new Set([
    ...(categoriesWithSub[category] || []),
    ...(subCategory ? [subCategory] : [])
  ]));

  useEffect(() => {
    loadPhotos();
  }, [find.id]);

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

    // Check memory cache to avoid multiple network calls on map refresh
    window.findPhotosCache = window.findPhotosCache || {};
    if (window.findPhotosCache[find.id]) {
      setPhotos(window.findPhotosCache[find.id]);
      return;
    }

    const { data, error } = await supabase
      .from("find_photos")
      .select("*")
      .eq("find_id", find.id)
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    const fetchedPhotos = data || [];
    window.findPhotosCache[find.id] = fetchedPhotos;
    setPhotos(fetchedPhotos);

    // Auto-detect video if present in find_photos
    const foundVid = fetchedPhotos.find((p) => p.type === "video" || (typeof p.image_url === "string" && p.image_url.match(/\.(mp4|mov|webm|m4v|ogg)(\?.*)?$/i)));
    if (foundVid?.image_url) {
      setVideoUrl((prev) => prev || foundVid.image_url);
    }

    // Preload image source
    fetchedPhotos.forEach((photo) => {
      if (photo.image_url && !photo.image_url.match(/\.(mp4|mov|webm|m4v|ogg)(\?.*)?$/i)) {
        const img = new Image();
        img.src = photo.image_url;
      }
    });
  };

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setCategory(newCat);
    setSubCategory("");
  };

  const saveChanges = async () => {
    if (saving) return;
    setSaving(true);

    const encodedDesc = encodeMetadata(
      material || "Indéterminé",
      find.user_code,
      find.finder_name,
      find.session_code,
      find.thumbnail_url,
      {
        audio_url: find.audio_url || find.audio,
        audio_duration: find.audio_duration,
        video_url: effectiveVideoUrl
      }
    );

    const { error } = await supabase
      .from("finds")
      .update({
        title,
        clean_title: title,
        clean_description: cleanDescription,
        identification_link: identificationLink,
        latitude: Number(latitude),
        longitude: Number(longitude),
        date,
        category,
        sub_category: subCategory || null,
        description: encodedDesc
      })
      .eq("id", find.id);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Erreur lors de la sauvegarde.");
      return;
    }

    // Update find object fields locally so they reflect updates instantly
    find.title = title;
    find.clean_description = cleanDescription;
    find.identification_link = identificationLink;
    find.latitude = Number(latitude);
    find.longitude = Number(longitude);
    find.date = date;
    find.category = category;
    find.sub_category = subCategory || null;
    find.description = material || "Indéterminé";
    find.video_url = effectiveVideoUrl;

    alert("Sauvegardé ✅");
    if (onUpdate) onUpdate();
  };

  const uploadVideo = async () => {
    if (uploading) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.setAttribute("capture", "environment");

    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 50 * 1024 * 1024) {
        alert("⚠️ Vidéo trop volumineuse (max 50 Mo). Privilégiez un court extrait de 5 à 15 secondes.");
        return;
      }

      setUploading(true);
      try {
        let ext = (file.name?.split(".").pop() || "mp4").toLowerCase().replace(/[^a-z0-9]/gi, "");
        if (!ext || ext === "quicktime") ext = "mov";
        let contentType = file.type || (ext === "mov" ? "video/quicktime" : (ext === "webm" ? "video/webm" : "video/mp4"));

        const videoFileName = `video-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const { error: vErr } = await supabase.storage
          .from("find-photos")
          .upload(videoFileName, file, {
            contentType: contentType,
            upsert: false
          });

        if (vErr) {
          console.error("Storage upload error:", vErr);
          alert("Erreur lors du téléchargement de la vidéo : " + (vErr.message || "Serveur indisponible"));
          setUploading(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("find-photos")
          .getPublicUrl(videoFileName);

        // Update find metadata and state
        find.video_url = publicUrl;
        find.video = publicUrl;
        setVideoUrl(publicUrl);

        try {
          await supabase.from("find_photos").delete().eq("find_id", find.id).eq("type", "video");
        } catch (delErr) {
          console.warn("Clean old video entry error:", delErr);
        }

        await supabase.from("find_photos").insert([
          {
            find_id: find.id,
            image_url: publicUrl,
            type: "video"
          }
        ]);

        const encodedDesc = encodeMetadata(
          material || "Indéterminé",
          find.user_code,
          find.finder_name,
          find.session_code,
          find.thumbnail_url,
          {
            audio_url: find.audio_url || find.audio,
            audio_duration: find.audio_duration,
            video_url: publicUrl
          }
        );

        await supabase
          .from("finds")
          .update({ description: encodedDesc })
          .eq("id", find.id);

        if (window.findPhotosCache) {
          delete window.findPhotosCache[find.id];
        }
        await loadPhotos();

        alert("Vidéo enregistrée avec succès ! 🎥");
        if (onUpdate) onUpdate();
      } catch (err) {
        console.error("Video upload error:", err);
        alert("Erreur lors de l'enregistrement de la vidéo.");
      }
      setUploading(false);
    };

    input.click();
  };

  const deleteVideo = async () => {
    if (!confirm("Voulez-vous supprimer cette vidéo ?")) return;
    setUploading(true);
    try {
      const targetVid = effectiveVideoUrl;
      if (targetVid && targetVid.includes("/find-photos/")) {
        const fileName = targetVid.split("/").pop();
        if (fileName) {
          await supabase.storage.from("find-photos").remove([fileName]);
        }
      }
      try {
        await supabase.from("find_photos").delete().eq("find_id", find.id).eq("type", "video");
      } catch (pErr) {
        console.warn("find_photos delete warning:", pErr);
      }
      find.video_url = null;
      find.video = null;
      setVideoUrl(null);

      const encodedDesc = encodeMetadata(
        material || "Indéterminé",
        find.user_code,
        find.finder_name,
        find.session_code,
        find.thumbnail_url,
        {
          audio_url: find.audio_url || find.audio,
          audio_duration: find.audio_duration,
          video_url: null
        }
      );

      await supabase
        .from("finds")
        .update({ description: encodedDesc })
        .eq("id", find.id);

      if (window.findPhotosCache) {
        delete window.findPhotosCache[find.id];
      }
      await loadPhotos();
      alert("Vidéo supprimée ✅");
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Delete video error:", err);
    }
    setUploading(false);
  };

  const uploadPhoto = async (type, useCamera = false) => {
    if (uploading) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    if (useCamera) {
      input.setAttribute("capture", "environment");
    } else {
      input.multiple = true;
    }

    input.onchange = async (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      setUploading(true);

      try {
        for (const file of files) {
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1600,
            useWebWorker: true
          });

          const cleanName = file.name
            .replaceAll(" ", "-")
            .replaceAll("é", "e")
            .replaceAll("è", "e")
            .replaceAll("à", "a");

          const fileName = `${Date.now()}-${cleanName}`;

          const { error: uploadError } = await supabase.storage
            .from("find-photos")
            .upload(fileName, compressedFile, { upsert: false });

          if (uploadError) {
            console.error(uploadError);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from("find-photos")
            .getPublicUrl(fileName);

          await supabase.from("find_photos").insert([
            {
              find_id: find.id,
              image_url: publicUrl,
              type
            }
          ]);
        }

        // Clear local cache to force reload
        if (window.findPhotosCache) {
          delete window.findPhotosCache[find.id];
        }
        await loadPhotos();
        if (onUpdate) onUpdate();
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'envoi de la photo.");
      }

      setUploading(false);
    };

    input.click();
  };

  const saveCroppedPhotos = async (beforeBlob, afterBlob) => {
    if (!beforeBlob && !afterBlob) {
      setCroppingStep("none");
      alert("Cadrage ignoré (images conservées d'origine).");
      return;
    }

    setCroppingStep("saving");
    try {
      const discoveryPhoto = discoveryPhotos[0];
      const cleanPhoto = cleanPhotos[0];

      if (!discoveryPhoto || !cleanPhoto) {
        alert("Erreur : photos d'origine introuvables.");
        setCroppingStep("none");
        return;
      }

      const timestamp = Date.now();

      // Process Avant (Before)
      if (beforeBlob) {
        const beforeFile = new File([beforeBlob], "cropped-before.jpg", { type: "image/jpeg" });
        const beforeOldName = discoveryPhoto.image_url.split("/").pop();
        try {
          await supabase.storage.from("find-photos").remove([beforeOldName]);
        } catch (err) {
          console.warn("Storage removal warning (Before):", err);
        }

        const beforeNewName = `${timestamp}-cropped-before.jpg`;
        const { error: errorBefore } = await supabase.storage
          .from("find-photos")
          .upload(beforeNewName, beforeFile);

        if (errorBefore) {
          throw new Error(`Erreur de téléversement 'Avant' : ${errorBefore.message}`);
        }

        const { data: { publicUrl: beforeUrl } } = supabase.storage
          .from("find-photos")
          .getPublicUrl(beforeNewName);

        const { error: dbErrorBefore } = await supabase
          .from("find_photos")
          .update({ image_url: beforeUrl })
          .eq("id", discoveryPhoto.id);

        if (dbErrorBefore) {
          throw new Error(`Erreur de base de données 'Avant' : ${dbErrorBefore.message}`);
        }
      }

      // Process Après (After)
      if (afterBlob) {
        const afterFile = new File([afterBlob], "cropped-after.jpg", { type: "image/jpeg" });
        const afterOldName = cleanPhoto.image_url.split("/").pop();
        try {
          await supabase.storage.from("find-photos").remove([afterOldName]);
        } catch (err) {
          console.warn("Storage removal warning (After):", err);
        }

        const afterNewName = `${timestamp}-cropped-after.jpg`;
        const { error: errorAfter } = await supabase.storage
          .from("find-photos")
          .upload(afterNewName, afterFile);

        if (errorAfter) {
          throw new Error(`Erreur de téléversement 'Après' : ${errorAfter.message}`);
        }

        const { data: { publicUrl: afterUrl } } = supabase.storage
          .from("find-photos")
          .getPublicUrl(afterNewName);

        const { error: dbErrorAfter } = await supabase
          .from("find_photos")
          .update({ image_url: afterUrl })
          .eq("id", cleanPhoto.id);

        if (dbErrorAfter) {
          throw new Error(`Erreur de base de données 'Après' : ${dbErrorAfter.message}`);
        }
      }

      if (window.findPhotosCache) {
        delete window.findPhotosCache[find.id];
      }
      await loadPhotos();
      if (onUpdate) onUpdate();
      alert("Photos alignées et cadrées avec succès ! ✨");
    } catch (err) {
      console.error(err);
      alert(err.message || "Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setCroppingStep("none");
      setCroppedBeforeBlob(null);
    }
  };

  const deletePhoto = (photo) => {
    setConfirmConfig({
      message: "Supprimer cette photo ?",
      onConfirm: async () => {
        const fileName = photo.image_url.split("/").pop();
        await supabase.storage.from("find-photos").remove([fileName]);
        await supabase.from("find_photos").delete().eq("id", photo.id);

        if (window.findPhotosCache) {
          delete window.findPhotosCache[find.id];
        }
        await loadPhotos();
        if (onUpdate) onUpdate();
      }
    });
  };

  const setPhotoAsType = async (selectedPhoto, typeName) => {
    try {
      const sameTypePhotos = photos.filter((p) => p.type === typeName);
      for (const p of sameTypePhotos) {
        await supabase
          .from("find_photos")
          .update({ type: "clean" })
          .eq("id", p.id);
      }

      await supabase
        .from("find_photos")
        .update({ type: typeName })
        .eq("id", selectedPhoto.id);

      if (window.findPhotosCache) {
        delete window.findPhotosCache[find.id];
      }
      await loadPhotos();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error setting photo type:", err);
    }
  };

  const isVideoFile = (url) => typeof url === "string" && (
    url.startsWith("data:video/") ||
    url.match(/\.(mp4|mov|webm|m4v|ogg)(\?.*)?$/i) ||
    url.includes("/video-")
  );
  const discoveryPhotos = photos.filter((p) => p.type === "discovery" && !isVideoFile(p.image_url) && p.type !== "video");
  const cleanPhotos = photos.filter((p) => (p.type === "clean" || p.type === "avers" || p.type === "revers") && !isVideoFile(p.image_url) && p.type !== "video");
  const photoVideoUrl = photos.find((p) => p.type === "video" || isVideoFile(p.image_url))?.image_url;
  const effectiveVideoUrl = videoUrl || find.video_url || find.video || decodeMetadata(find)?.video_url || photoVideoUrl || null;

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    background: "rgba(255, 255, 255, 0.06)",
    color: "white",
    fontSize: "13px",
    boxSizing: "border-box",
    outline: "none"
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "12px",
    padding: "10px",
    background: "#1f2937",
    color: "white",
    fontWeight: "bold",
    fontSize: "13px",
    cursor: "pointer",
    transition: "background 0.2s"
  };

  const validPhotoList = photos.filter((p) => !isVideoFile(p.image_url) && p.type !== "video");
  const coverPhoto = validPhotoList.length > 0 ? validPhotoList[0].image_url : (find.thumbnail_url || find.image_url || null);
  const isReadOnly = workspace?.mode === "consultation";
  const finderText = find.finder_name || find.user_code;

  return (
    <>
      {/* 1. COMPACT READ-ONLY VIEW (Inside Leaflet map popup bubble) */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "215px",
          minWidth: "215px",
          maxWidth: "215px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          color: "#111827",
          fontFamily: "system-ui, sans-serif",
          boxSizing: "border-box"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "6px" }}>
          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
            {title || "Sans titre"}
          </h4>
          {isReadOnly && (
            <span style={{ fontSize: "10px", background: "#fef3c7", color: "#b45309", padding: "1px 6px", borderRadius: "6px", fontWeight: "700", whiteSpace: "nowrap" }}>
              🔒 Lecture
            </span>
          )}
        </div>

        {finderText && (
          <div style={{ fontSize: "10px", color: "#374151", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>👤</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Trouvé par : {finderText}
            </span>
          </div>
        )}

        {find.session_code && (
          <div style={{ fontSize: "9px", background: "rgba(16, 185, 129, 0.12)", color: "#059669", padding: "2px 6px", borderRadius: "5px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px", width: "fit-content" }}>
            <span>👥</span>
            <span>Session Équipe ({find.session_code})</span>
          </div>
        )}

        <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "700" }}>
          {categoryEmojis[category] || "📍"} {category} {subCategory ? `• ${subCategory}` : ""}
          {material && material !== "Indéterminé" ? ` • ${materialEmojis[material] || "🪙"} ${material}` : ""}
        </div>

        {/* Media display (Photo or Standard Category Placeholder) */}
        {coverPhoto && !isVideoFile(coverPhoto) ? (
          <div style={{ position: "relative", width: "100%", height: "110px" }}>
            <img
              src={coverPhoto}
              alt={title}
              style={{
                width: "100%",
                height: "110px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "1px solid #e5e7eb"
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "80px",
              background: "#f3f4f6",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px"
            }}
          >
            {categoryEmojis[category] || "📍"}
          </div>
        )}

        {/* Audio Note player in popup bubble */}
        {(find.audio_url || find.audio) && (
          <div style={{ marginTop: "4px" }}>
            <AudioNotePlayer
              src={find.audio_url || find.audio}
              duration={find.audio_duration || null}
              theme="light"
            />
          </div>
        )}

        <div style={{ fontSize: "10px", color: "#4b5563" }}>
          📅 {date ? date.split(",")[0] : "Date inconnue"}
        </div>

        <div style={{ display: "flex", gap: "6px", marginTop: "2px" }}>
          {/* Favorite Toggle */}
          <button
            onClick={async (e) => {
              e.stopPropagation();
              const nextFav = !isFav;
              setIsFav(nextFav);
              find.favorite = nextFav;
              if (onFavorite) {
                await onFavorite(find, nextFav);
              }
            }}
            style={{
              flex: "0 0 36px",
              height: "36px",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              background: isFav ? "#fef08a" : "white",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            title="Ajouter / Retirer des favoris"
          >
            {isFav ? "⭐" : "☆"}
          </button>

          {/* Details / Edit triggers Portal Modal */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            style={{
              flex: 1,
              height: "36px",
              border: "none",
              borderRadius: "10px",
              background: "#111827",
              color: "white",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {isReadOnly ? "👁️ Voir les détails" : "✏️ Détails et Éditer"}
          </button>
        </div>
      </div>

      {/* 2. PREMIUM PORTAL MODAL VIEW (Rich fullscreen sheet editor) */}
      {isModalOpen && createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(12px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box",
        fontFamily: "system-ui, sans-serif"
      }}
      onClick={() => setIsModalOpen(false)}
    >
      <div
        style={{
          background: "#0d1117",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "24px",
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.7)",
          color: "white",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
          boxSizing: "border-box",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", letterSpacing: "-0.5px" }}>
              {isReadOnly ? "🔍 Fiche Trouvaille" : "🔍 Détails et Édition"}
            </h3>
            {isReadOnly && (
              <span style={{ fontSize: "10px", background: "rgba(234, 179, 8, 0.15)", color: "#facc15", padding: "2px 6px", borderRadius: "6px", fontWeight: "700" }}>
                🔒 Lecture
              </span>
            )}
            {finderText && (
              <span style={{ fontSize: "10px", background: "rgba(255, 255, 255, 0.08)", color: "#e2e8f0", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "2px 6px", borderRadius: "6px", fontWeight: "700" }}>
                👤 {finderText}
              </span>
            )}
            {find.session_code && (
              <span style={{ fontSize: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "2px 6px", borderRadius: "6px", fontWeight: "700" }}>
                👥 Session {find.session_code}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255, 255, 255, 0.08)",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Container */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setActiveTab("discovery")}
              style={{
                flex: 1,
                padding: "8px",
                border: activeTab === "discovery" ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px",
                background: activeTab === "discovery" ? "#1e293b" : "rgba(255,255,255,0.04)",
                color: activeTab === "discovery" ? "#ffffff" : "#94a3b8",
                fontWeight: activeTab === "discovery" ? "700" : "600",
                fontSize: "11px",
                cursor: "pointer"
              }}
            >
              Découverte
            </button>

            <button
              onClick={() => setActiveTab("clean")}
              style={{
                flex: 1,
                padding: "8px",
                border: activeTab === "clean" ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px",
                background: activeTab === "clean" ? "#1e293b" : "rgba(255,255,255,0.04)",
                color: activeTab === "clean" ? "#ffffff" : "#94a3b8",
                fontWeight: activeTab === "clean" ? "700" : "600",
                fontSize: "11px",
                cursor: "pointer"
              }}
            >
              Description
            </button>

            <button
              onClick={() => setActiveTab("identification")}
              style={{
                flex: 1.2,
                padding: "8px",
                border: activeTab === "identification" ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px",
                background: activeTab === "identification" ? "#1e293b" : "rgba(255,255,255,0.04)",
                color: activeTab === "identification" ? "#ffffff" : "#94a3b8",
                fontWeight: activeTab === "identification" ? "700" : "600",
                fontSize: "11px",
                cursor: "pointer"
              }}
            >
              Identification
            </button>
          </div>

          {/* Tab 1: Discovery */}
          {activeTab === "discovery" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Titre</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de la trouvaille"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Date</label>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Date"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="Latitude"
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="Longitude"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Note Vocale Audio Player */}
              {(find.audio_url || find.audio) && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#e2e8f0", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>🎙️</span> Note vocale
                  </span>
                  <AudioNotePlayer
                    src={find.audio_url || find.audio}
                    duration={find.audio_duration || null}
                    theme="dark"
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Catégorie</label>
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  style={{ ...inputStyle, background: "#1f2937" }}
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryEmojis[cat] || "🏷️"} {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Sous-catégorie</label>
                {availableSubCats.length > 0 ? (
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    style={{ ...inputStyle, background: "#1f2937" }}
                  >
                    <option value="">-- Non spécifiée --</option>
                    {availableSubCats.map((subCat) => (
                      <option key={subCat} value={subCat}>{subCat}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="Sous-catégorie (ex: Denier, Napoléon...)"
                    style={inputStyle}
                  />
                )}
              </div>

              <div>
                <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Métal</label>
                <select
                  value={material || "Indéterminé"}
                  onChange={(e) => setMaterial(e.target.value)}
                  style={{ ...inputStyle, background: "#1f2937" }}
                >
                  <option value="Indéterminé">❓ Métal non spécifié</option>
                  {(materialsData.materials || []).filter((m) => m !== "Indéterminé").map((mat) => (
                    <option key={mat} value={mat}>
                      {materialsData.emojis?.[mat] || "🪙"} {mat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photos */}
              <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
                {!find.isOfflinePending && (
                  <>
                    <button
                      disabled={uploading}
                      onClick={() => uploadPhoto("discovery", true)}
                      style={{ ...buttonStyle, flex: 1, padding: "8px", fontSize: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      📸 Caméra
                    </button>
                    <button
                      disabled={uploading}
                      onClick={() => uploadPhoto("discovery", false)}
                      style={{ ...buttonStyle, flex: 1, padding: "8px", fontSize: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      🖼️ Album
                    </button>
                  </>
                )}
              </div>

              {discoveryPhotos.length > 0 && (
                <div style={{ marginTop: "5px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <img
                    src={discoveryPhotos[discoveryIndex].image_url}
                    alt=""
                    onClick={() => setFullscreenImage(discoveryPhotos[discoveryIndex].image_url)}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "contain",
                      background: "rgba(0,0,0,0.4)",
                      borderRadius: "14px",
                      cursor: "pointer",
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}
                  />
                  {discoveryPhotos.length > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDiscoveryIndex((discoveryIndex - 1 + discoveryPhotos.length) % discoveryPhotos.length);
                        }}
                        style={{ ...buttonStyle, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px 10px" }}
                      >
                        ←
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDiscoveryIndex((discoveryIndex + 1) % discoveryPhotos.length);
                        }}
                        style={{ ...buttonStyle, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px 10px" }}
                      >
                        →
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => deletePhoto(discoveryPhotos[discoveryIndex])}
                    style={{ ...buttonStyle, background: "#ef4444", padding: "6px 12px", fontSize: "11px", marginTop: "2px" }}
                  >
                    🗑️ Supprimer la photo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Clean Description */}
          {activeTab === "clean" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Section Vidéo de terrain */}
              {effectiveVideoUrl ? (
                <div
                  style={{
                    padding: "12px",
                    borderRadius: "16px",
                    background: "rgba(0, 0, 0, 0.45)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: "#f1f5f9", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>🎥</span> Vidéo de la trouvaille
                    </span>
                    {!isReadOnly && (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          disabled={uploading}
                          onClick={uploadVideo}
                          style={{
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            color: "#e2e8f0",
                            borderRadius: "8px",
                            padding: "4px 9px",
                            fontSize: "11px",
                            cursor: "pointer",
                            fontWeight: "bold"
                          }}
                        >
                          🔄 Remplacer
                        </button>
                        <button
                          type="button"
                          disabled={uploading}
                          onClick={deleteVideo}
                          style={{
                            background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#fca5a5",
                            borderRadius: "8px",
                            padding: "4px 9px",
                            fontSize: "11px",
                            cursor: "pointer",
                            fontWeight: "bold"
                          }}
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                  <video
                    key={effectiveVideoUrl}
                    src={effectiveVideoUrl}
                    controls
                    playsInline
                    preload="auto"
                    style={{
                      width: "100%",
                      maxHeight: "240px",
                      borderRadius: "12px",
                      background: "#000000",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      objectFit: "contain"
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    padding: "12px",
                    borderRadius: "14px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px dashed rgba(255, 255, 255, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px"
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>🎥</span> Vidéo de la trouvaille : Aucune
                  </span>
                  {!isReadOnly && !find.isOfflinePending && (
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={uploadVideo}
                      style={{
                        background: "#1f2937",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#ffffff",
                        borderRadius: "10px",
                        padding: "6px 12px",
                        fontSize: "11px",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      {uploading ? "Envoi..." : "🎥 + Ajouter vidéo"}
                    </button>
                  )}
                </div>
              )}

              <div>
                <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Description</label>
                <textarea
                  value={cleanDescription}
                  onChange={(e) => setCleanDescription(e.target.value)}
                  placeholder="Notes sur la trouvaille (description, état, métal...)"
                  style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                />
              </div>

              {/* Boutons d'action Photos */}
              <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
                {!find.isOfflinePending && !isReadOnly && (
                  <>
                    <button
                      disabled={uploading}
                      onClick={() => uploadPhoto("clean", true)}
                      style={{ ...buttonStyle, flex: 1, padding: "8px", fontSize: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      📸 Photo
                    </button>
                    <button
                      disabled={uploading}
                      onClick={() => uploadPhoto("clean", false)}
                      style={{ ...buttonStyle, flex: 1, padding: "8px", fontSize: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      🖼️ Album
                    </button>
                  </>
                )}
              </div>

              {cleanPhotos.length > 0 && (
                <div style={{ marginTop: "5px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <img
                    src={cleanPhotos[cleanIndex]?.image_url}
                    alt=""
                    onClick={() => setFullscreenImage(cleanPhotos[cleanIndex]?.image_url)}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "contain",
                      background: "rgba(0,0,0,0.4)",
                      borderRadius: "14px",
                      cursor: "pointer",
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}
                  />
                  {cleanPhotos.length > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCleanIndex((cleanIndex - 1 + cleanPhotos.length) % cleanPhotos.length);
                        }}
                        style={{ ...buttonStyle, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px 10px" }}
                      >
                        ←
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCleanIndex((cleanIndex + 1) % cleanPhotos.length);
                        }}
                        style={{ ...buttonStyle, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px 10px" }}
                      >
                        →
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => deletePhoto(cleanPhotos[cleanIndex])}
                    style={{ ...buttonStyle, background: "#ef4444", padding: "6px 12px", fontSize: "11px", marginTop: "2px" }}
                  >
                    🗑️ Supprimer la photo
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Tab 3: Identification Link */}
          {activeTab === "identification" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px", color: "#9ca3af" }}>
                  Lien d'identification (URL de référence)
                </label>
                <input
                  type="text"
                  value={identificationLink}
                  onChange={(e) => setIdentificationLink(e.target.value)}
                  placeholder="https://exemplesite.com/catalogue-piece"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.06)",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {identificationLink && (
                <div style={{ marginTop: "10px" }}>
                  <a
                    href={identificationLink.startsWith("http") ? identificationLink : `https://${identificationLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "12px",
                      borderRadius: "14px",
                      background: "#1f2937",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#ffffff",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "700",
                      textAlign: "center",
                      transition: "0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#374151";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#1f2937";
                    }}
                  >
                    🌐 Ouvrir le lien de référence
                  </a>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", gap: "10px", marginTop: "8px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "14px" }}>
          {isReadOnly ? (
            <button
              onClick={() => setIsModalOpen(false)}
              style={{ ...buttonStyle, background: "#1f2937", border: "1px solid rgba(255,255,255,0.15)", flex: 1, padding: "12px", fontSize: "14px" }}
            >
              Fermer la fiche
            </button>
          ) : (
            <>
              {activeTab !== "compare" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmConfig({
                      message: "Supprimer définitivement cette trouvaille ?",
                      onConfirm: () => {
                        onDelete(find.id);
                        setIsModalOpen(false);
                      }
                    });
                  }}
                  style={{ ...buttonStyle, background: "#ef4444", flex: 1, padding: "10px" }}
                >
                  🗑️ Supprimer
                </button>
              )}

              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await saveChanges();
                  setIsModalOpen(false);
                }}
                disabled={saving}
                style={{ ...buttonStyle, background: "#22c55e", flex: 1.5, padding: "10px" }}
              >
                {saving ? "Sauvegarde..." : "Enregistrer ✅"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox inside Portal */}
      {fullscreenImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.95)",
            zIndex: 100000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={(e) => {
            e.stopPropagation();
            setFullscreenImage(null);
          }}
        >
          <img
            src={fullscreenImage}
            alt=""
            style={{ maxWidth: "95%", maxHeight: "95%", objectFit: "contain", borderRadius: "10px" }}
          />
        </div>
      )}

      {/* 2-Step Before/After Cropper Modal */}
      {croppingStep === "before" && (
        <CropperModal
          key="crop-before"
          imageSrc={discoveryPhotos[0]?.image_url}
          onCrop={(blob) => {
            setCroppedBeforeBlob(blob);
            setCroppingStep("after");
          }}
          onClose={() => setCroppingStep("none")}
        />
      )}

      {croppingStep === "after" && (
        <CropperModal
          key="crop-after"
          imageSrc={cleanPhotos[0]?.image_url}
          onCrop={(blob) => {
            saveCroppedPhotos(croppedBeforeBlob, blob);
          }}
          onClose={() => {
            setCroppingStep("none");
            setCroppedBeforeBlob(null);
          }}
        />
      )}

      {croppingStep === "saving" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.85)",
            zIndex: 99999999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontFamily: "system-ui, sans-serif"
          }}
        >
          <span style={{ fontSize: "36px", marginBottom: "16px" }}>⚙️</span>
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>Alignement et compression des photos en cours...</span>
        </div>
      )}
      {confirmConfig && (
        <ConfirmModal
          message={confirmConfig.message}
          onConfirm={() => {
            confirmConfig.onConfirm();
            setConfirmConfig(null);
          }}
          onCancel={() => setConfirmConfig(null)}
        />
      )}
    </div>,
    document.body
  )}
</>
);
}