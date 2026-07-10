import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../supabase";
import imageCompression from "browser-image-compression";
import CropperModal from "./CropperModal";
import ConfirmModal from "./ConfirmModal";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { categoriesWithSub, categoryEmojis, materials, materialEmojis } from "../subCategories";

export default function FindPopup({
  find,
  onDelete,
  onFavorite,
  onUpdate
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
  const [photos, setPhotos] = useState([]);
  const [discoveryIndex, setDiscoveryIndex] = useState(0);
  const [cleanIndex, setCleanIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [croppingStep, setCroppingStep] = useState("none"); // 'none' | 'before' | 'after' | 'saving'
  const [croppedBeforeBlob, setCroppedBeforeBlob] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

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

    // Preload image source
    fetchedPhotos.forEach((photo) => {
      if (photo.image_url) {
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
        description: material
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
    find.description = material;

    alert("Sauvegardé ✅");
    if (onUpdate) onUpdate();
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
            .upload(fileName, compressedFile);

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

  const discoveryPhotos = photos.filter((p) => p.type === "discovery");
  const cleanPhotos = photos.filter((p) => p.type === "clean" || p.type === "avers" || p.type === "revers");

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
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    fontSize: "13px",
    cursor: "pointer",
    transition: "background 0.2s"
  };

  // 1. COMPACT READ-ONLY VIEW (Inside Leaflet map popup bubble)
  if (!isModalOpen) {
    const coverPhoto = photos.length > 0 ? photos[0].image_url : null;
    return (
      <div
        style={{
          width: "210px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          color: "#111827",
          fontFamily: "system-ui, sans-serif"
        }}
      >
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {title || "Sans titre"}
        </h4>

        <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "700" }}>
          {categoryEmojis[category]} {category} {subCategory ? `• ${subCategory}` : ""}
          {material && material !== "Indéterminé" ? ` • ${materialEmojis[material]} ${material}` : ""}
        </div>

        {coverPhoto ? (
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
              fontSize: "24px"
            }}
          >
            {categoryEmojis[category] || "📍"}
          </div>
        )}

        <div style={{ fontSize: "10px", color: "#4b5563" }}>
          📅 {date ? date.split(",")[0] : "Date inconnue"}
        </div>

        <div style={{ display: "flex", gap: "6px", marginTop: "2px" }}>
          {/* Favorite Toggle */}
          <button
            onClick={() => onFavorite(find)}
            style={{
              flex: "0 0 36px",
              height: "36px",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              background: find.favorite ? "#fef08a" : "white",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {find.favorite ? "⭐" : "☆"}
          </button>

          {/* Edit / Details triggers Portal Modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              flex: 1,
              height: "36px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            ✏️ Détails & Éditer
          </button>
        </div>
      </div>
    );
  }

  // 2. PREMIUM PORTAL MODAL VIEW (Rich fullscreen sheet editor)
  return createPortal(
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
          background: "#111827",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "24px",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px" }}>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "800", letterSpacing: "-0.5px" }}>
            🔍 Détails & Édition
          </h3>
          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255, 255, 255, 0.1)",
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
                border: "none",
                borderRadius: "10px",
                background: activeTab === "discovery" ? "#2563eb" : "rgba(255,255,255,0.06)",
                color: "white",
                fontWeight: "600",
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
                border: "none",
                borderRadius: "10px",
                background: activeTab === "clean" ? "#2563eb" : "rgba(255,255,255,0.06)",
                color: "white",
                fontWeight: "600",
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
                border: "none",
                borderRadius: "10px",
                background: activeTab === "identification" ? "#2563eb" : "rgba(255,255,255,0.06)",
                color: "white",
                fontWeight: "600",
                fontSize: "11px",
                cursor: "pointer"
              }}
            >
              Identification 🔗
            </button>

            {discoveryPhotos.length > 0 && cleanPhotos.length > 0 && (
              <button
                onClick={() => setActiveTab("compare")}
                style={{
                  flex: 1.2,
                  padding: "8px",
                  border: "none",
                  borderRadius: "10px",
                  background: activeTab === "compare" ? "#2563eb" : "rgba(255,255,255,0.06)",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "11px",
                  cursor: "pointer"
                }}
              >
                Avant/Après ↔️
              </button>
            )}
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

              <div>
                <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Catégorie</label>
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  style={{ ...inputStyle, background: "#1f2937" }}
                >
                  {Object.keys(categoriesWithSub).map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryEmojis[cat] || ""} {cat}
                    </option>
                  ))}
                </select>
              </div>

              {categoriesWithSub[category] && (
                <div>
                  <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Sous-catégorie</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    style={{ ...inputStyle, background: "#1f2937" }}
                  >
                    <option value="">Sous-catégorie</option>
                    {categoriesWithSub[category].map((subCat) => (
                      <option key={subCat} value={subCat}>{subCat}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Matière</label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  style={{ ...inputStyle, background: "#1f2937" }}
                >
                  {materials.map((mat) => (
                    <option key={mat} value={mat}>
                      {materialEmojis[mat] || ""} {mat}
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
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Description</label>
                <textarea
                  value={cleanDescription}
                  onChange={(e) => setCleanDescription(e.target.value)}
                  placeholder="Notes sur la trouvaille (description, état, métal...)"
                  style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
                {!find.isOfflinePending && (
                  <>
                    <button
                      disabled={uploading}
                      onClick={() => uploadPhoto("clean", true)}
                      style={{ ...buttonStyle, flex: 1, padding: "8px", fontSize: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      📸 Photo Nettoyée
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

              {category === "Monnaie" && cleanPhotos.length > 0 ? (
                <div style={{ marginTop: "5px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                  <style>{`
                    .coin-popup-3d {
                      perspective: 1000px;
                      width: 130px;
                      height: 130px;
                      cursor: pointer;
                      margin: 5px auto;
                    }
                    .coin-popup-inner {
                      position: relative;
                      width: 100%;
                      height: 100%;
                      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                      transform-style: preserve-3d;
                    }
                    .coin-popup-3d.flipped .coin-popup-inner {
                      transform: rotateY(180deg);
                    }
                    .coin-popup-front, .coin-popup-back {
                      position: absolute;
                      width: 100%;
                      height: 100%;
                      -webkit-backface-visibility: hidden;
                      backface-visibility: hidden;
                      border-radius: 50%;
                      overflow: hidden;
                      border: 2px solid rgba(255, 255, 255, 0.2);
                      box-shadow: 0 4px 15px rgba(0,0,0,0.6);
                    }
                    .coin-popup-back {
                      transform: rotateY(180deg);
                    }
                    .coin-popup-front img, .coin-popup-back img {
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    }
                    .coin-revers-placeholder {
                      width: 100%;
                      height: 100%;
                      background: linear-gradient(135deg, #1e293b, #0f172a);
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      color: #fbbf24;
                      font-size: 8px;
                      font-weight: bold;
                      text-transform: uppercase;
                      border-radius: 50%;
                      border: 2px dashed rgba(251, 191, 36, 0.4);
                      box-sizing: border-box;
                      padding: 8px;
                      text-align: center;
                    }
                  `}</style>

                  {/* The 3D coin */}
                  {(() => {
                    const avers = cleanPhotos.find((p) => p.type === "avers") || cleanPhotos[0];
                    const revers = cleanPhotos.find((p) => p.type === "revers") || (cleanPhotos.length > 1 ? cleanPhotos.find((p) => p.id !== avers?.id) : null);
                    
                    return (
                      <div
                        className={`coin-popup-3d ${isFlipped ? "flipped" : ""}`}
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        <div className="coin-popup-inner">
                          <div className="coin-popup-front">
                            {avers ? (
                              <img src={avers.image_url} alt="Avers" />
                            ) : (
                              <div className="coin-revers-placeholder">Avers</div>
                            )}
                          </div>
                          <div className="coin-popup-back">
                            {revers ? (
                              <img src={revers.image_url} alt="Revers" />
                            ) : (
                              <div className="coin-revers-placeholder">
                                <span style={{ fontSize: "14px", marginBottom: "2px", display: "block" }}>🪙</span>
                                <span>Revers non</span>
                                <span>photographié</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <span style={{ fontSize: "10px", opacity: 0.6, marginBottom: "8px" }}>
                    👆 Cliquez sur la pièce pour la retourner (3D)
                  </span>

                  {/* Photo manager sub-section */}
                  <div style={{
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "12px",
                    padding: "10px",
                    boxSizing: "border-box"
                  }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                      <img
                        src={cleanPhotos[cleanIndex]?.image_url}
                        alt="Aperçu"
                        onClick={() => setFullscreenImage(cleanPhotos[cleanIndex]?.image_url)}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          cursor: "pointer"
                        }}
                      />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontSize: "10px", fontWeight: "bold" }}>
                          Photo {cleanIndex + 1} sur {cleanPhotos.length}
                        </span>
                        <span style={{ fontSize: "9px", opacity: 0.5 }}>
                          Rôle actuel : {
                            cleanPhotos[cleanIndex]?.type === "avers" ? "🪙 Avers" :
                            cleanPhotos[cleanIndex]?.type === "revers" ? "🪙 Revers" : "Non assigné"
                          }
                        </span>
                      </div>

                      {cleanPhotos.length > 1 && (
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCleanIndex((cleanIndex - 1 + cleanPhotos.length) % cleanPhotos.length);
                            }}
                            style={{ ...buttonStyle, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", padding: "2px 8px" }}
                          >
                            ←
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCleanIndex((cleanIndex + 1) % cleanPhotos.length);
                            }}
                            style={{ ...buttonStyle, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", padding: "2px 8px" }}
                          >
                            →
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "4px" }}>
                      {cleanPhotos[cleanIndex]?.type === "avers" ? (
                        <button
                          onClick={() => setPhotoAsType(cleanPhotos[cleanIndex], "clean")}
                          style={{ ...buttonStyle, flex: 1, background: "#3b82f6", padding: "4px", fontSize: "10px", fontWeight: "bold" }}
                        >
                          Avers ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => setPhotoAsType(cleanPhotos[cleanIndex], "avers")}
                          style={{ ...buttonStyle, flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "4px", fontSize: "10px", color: "#9ca3af" }}
                        >
                          Définir Avers
                        </button>
                      )}

                      {cleanPhotos[cleanIndex]?.type === "revers" ? (
                        <button
                          onClick={() => setPhotoAsType(cleanPhotos[cleanIndex], "clean")}
                          style={{ ...buttonStyle, flex: 1, background: "#10b981", padding: "4px", fontSize: "10px", fontWeight: "bold" }}
                        >
                          Revers ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => setPhotoAsType(cleanPhotos[cleanIndex], "revers")}
                          style={{ ...buttonStyle, flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "4px", fontSize: "10px", color: "#9ca3af" }}
                        >
                          Définir Revers
                        </button>
                      )}

                      <button
                        onClick={() => deletePhoto(cleanPhotos[cleanIndex])}
                        style={{ ...buttonStyle, background: "#ef4444", padding: "4px 8px", fontSize: "10px" }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                cleanPhotos.length > 0 && (
                  <div style={{ marginTop: "5px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <img
                      src={cleanPhotos[cleanIndex].image_url}
                      alt=""
                      onClick={() => setFullscreenImage(cleanPhotos[cleanIndex].image_url)}
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
                )
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
                      background: "rgba(59, 130, 246, 0.15)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      color: "#60a5fa",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "700",
                      textAlign: "center",
                      transition: "0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(59, 130, 246, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(59, 130, 246, 0.15)";
                    }}
                  >
                    🌐 Ouvrir le lien de référence
                  </a>
                </div>
              )}

            </div>
          )}

          {/* Tab 3: Comparateur slider */}
          {activeTab === "compare" && discoveryPhotos.length > 0 && cleanPhotos.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", width: "100%" }}>
              <BeforeAfterSlider
                beforeUrl={discoveryPhotos[0].image_url}
                afterUrl={cleanPhotos[0].image_url}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCroppingStep("before");
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                📐 Cadrer & Aligner les Photos
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", gap: "10px", marginTop: "8px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "14px" }}>
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
  );
}