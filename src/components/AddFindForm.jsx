import { useState, useEffect, useRef, useMemo } from "react";
import { PRESET_CATEGORY_COLORS } from "../subCategories";
import { loadCategoriesData, addCategory } from "../services/categoriesService";
import { loadMaterialsData } from "../services/materialsService";
import AudioNotePlayer from "./AudioNotePlayer";
import { startAudioRecording, stopAudioRecording, isAudioRecordingSupported } from "../services/audioRecorder";

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
  newAudio,
  setNewAudio,
  newAudioDuration,
  setNewAudioDuration,
  newVideo,
  setNewVideo,
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
  const [materialsData, setMaterialsData] = useState(() => loadMaterialsData());
  const [showQuickCatBox, setShowQuickCatBox] = useState(false);
  const [quickCatName, setQuickCatName] = useState("");
  const [quickCatEmoji, setQuickCatEmoji] = useState("🪙");
  const [quickCatColor, setQuickCatColor] = useState("#facc15");

  // Media states
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingTime, setRecordingTime] = useState(newAudioDuration || 0);
  const [localAudio, setLocalAudio] = useState(null);
  const [localVideo, setLocalVideo] = useState(null);

  const activeAudio = newAudio || localAudio;
  const activeVideo = newVideo || localVideo;

  const updateAudio = (val) => {
    setLocalAudio(val);
    if (setNewAudio) setNewAudio(val);
  };

  const updateVideo = (val) => {
    setLocalVideo(val);
    if (setNewVideo) setNewVideo(val);
  };

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const videoPreviewUrl = useMemo(() => {
    if (!activeVideo) return null;
    if (typeof activeVideo === "string") return activeVideo;
    if (activeVideo instanceof Blob || activeVideo instanceof File) {
      try {
        return URL.createObjectURL(activeVideo);
      } catch {
        return null;
      }
    }
    return null;
  }, [activeVideo]);

  useEffect(() => {
    const handleCategoriesUpdate = () => {
      const data = loadCategoriesData();
      setCategoryData(data);
      const keys = Object.keys(data.categories || {});
      if (keys.length > 0 && (!newCategory || !data.categories[newCategory])) {
        setNewCategory(keys[0]);
      }
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
  }, [newCategory, setNewCategory]);

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
        marginTop: "6px",
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
            ? "Mode différé : saisissez la date, coordonnées et choisissez vos médias."
            : "Mode direct : position GPS actuelle et date enregistrées automatiquement."}
        </span>
      </div>

      {/* TITRE (SANS EXEMPLE) */}
      <div>
        <label style={{ fontSize: "11px", fontWeight: "600", color: "#ffffff", marginBottom: "4px", display: "block" }}>
          Titre de l'objet *
        </label>
        <input
          type="text"
          placeholder="Titre de l'objet"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* CATEGORIE & SOUS-CATEGORIE */}
      {categoryKeys.length === 0 ? (
        <div
          style={{
            padding: "14px",
            borderRadius: "14px",
            background: "rgba(59, 130, 246, 0.15)",
            border: "1px dashed rgba(96, 165, 250, 0.5)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#ffffff" }}>
            🏷️ Aucune catégorie configurée
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.75)" }}>
            Créez rapidement une catégorie pour classer votre trouvaille.
          </div>

          {!showQuickCatBox ? (
            <button
              type="button"
              onClick={() => setShowQuickCatBox(true)}
              style={{
                alignSelf: "center",
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)"
              }}
            >
              + Créer une catégorie
            </button>
          ) : (
            <div
              style={{
                background: "rgba(15, 23, 42, 0.9)",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                textAlign: "left"
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                <select
                  value={quickCatEmoji}
                  onChange={(e) => setQuickCatEmoji(e.target.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    fontSize: "16px",
                    cursor: "pointer"
                  }}
                >
                  {["🪙", "💍", "👑", "🛡️", "⚔️", "🏺", "🗝️", "🎖️", "💣", "🔨", "🪓", "🔔", "⚓", "📦", "📜", "✝️", "🏷️", "💎"].map((em) => (
                    <option key={em} value={em} style={{ background: "#1e293b", color: "#ffffff" }}>
                      {em}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Nom de la catégorie..."
                  value={quickCatName}
                  onChange={(e) => setQuickCatName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    fontSize: "12px",
                    outline: "none"
                  }}
                />
              </div>

              {/* Color swatches */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {PRESET_CATEGORY_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setQuickCatColor(col)}
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: col,
                      border: quickCatColor === col ? "2px solid #ffffff" : "1px solid rgba(255,255,255,0.2)",
                      cursor: "pointer",
                      padding: 0
                    }}
                  />
                ))}
              </div>

              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowQuickCatBox(false)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "transparent",
                    color: "#cbd5e1",
                    fontSize: "11px",
                    cursor: "pointer"
                  }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = quickCatName.trim();
                    if (!trimmed) return;
                    addCategory(trimmed, quickCatEmoji, ["Indéterminé"], quickCatColor);
                    setNewCategory(trimmed);
                    setQuickCatName("");
                    setShowQuickCatBox(false);
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#10b981",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: availableSubCats.length > 0 ? "1fr 1fr" : "1fr", gap: "8px" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: "600", color: "#ffffff", marginBottom: "4px", display: "block" }}>
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
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#ffffff", marginBottom: "4px", display: "block" }}>
                Sous-catégorie
              </label>
              <select
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                style={inputStyle}
              >
                <option value="" style={{ background: "#1f2937", color: "#ffffff" }}>
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
      )}

      {/* METAL */}
      <div>
        <label style={{ fontSize: "11px", fontWeight: "600", color: "#ffffff", marginBottom: "4px", display: "block" }}>
          Métal
        </label>
        <select
          value={newDescription || "Indéterminé"}
          onChange={(e) => setNewDescription(e.target.value)}
          style={inputStyle}
        >
          <option value="Indéterminé" style={{ background: "#1f2937", color: "#ffffff" }}>
            ❓ Métal non spécifié
          </option>
          {(materialsData.materials || []).filter((m) => m !== "Indéterminé").map((mat) => (
            <option key={mat} value={mat} style={{ background: "#1f2937", color: "#ffffff" }}>
              {materialsData.emojis?.[mat] || "🪙"} {mat}
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
            <label style={{ fontSize: "11px", fontWeight: "600", color: "#ffffff", marginBottom: "4px", display: "block" }}>
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
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#ffffff", marginBottom: "4px", display: "block" }}>
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
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#ffffff", marginBottom: "4px", display: "block" }}>
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

      {/* Hidden file inputs for Camera, Gallery, and Video */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setNewPhoto(file);
        }}
      />
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setNewPhoto(file);
        }}
      />
      <input
        type="file"
        accept="video/*"
        capture="environment"
        ref={videoInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 25 * 1024 * 1024) {
            alert("⚠️ Vidéo trop volumineuse (max 25 Mo). Privilégiez un court extrait de 5 à 15 secondes.");
            return;
          }
          updateVideo(file);
        }}
      />

      {/* MEDIA TOOLBAR (4 BOUTONS : PHOTO, GALERIE, VIDÉO, VOCAL - MONOCHROME) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px" }}>
        {/* Appareil Photo */}
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          title="Prendre une photo"
          style={{
            background: newPhoto ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.06)",
            border: newPhoto ? "1px solid rgba(255, 255, 255, 0.35)" : "1px solid rgba(255, 255, 255, 0.12)",
            color: "#ffffff",
            padding: "9px 4px",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            fontSize: "11px",
            fontWeight: "700",
            transition: "all 0.15s"
          }}
        >
          <span style={{ fontSize: "16px" }}>📷</span>
          <span>Photo</span>
        </button>

        {/* Galerie Photo */}
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          title="Choisir depuis la galerie"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#ffffff",
            padding: "9px 4px",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            fontSize: "11px",
            fontWeight: "700",
            transition: "all 0.15s"
          }}
        >
          <span style={{ fontSize: "16px" }}>🖼️</span>
          <span>Galerie</span>
        </button>

        {/* Vidéo */}
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          title="Ajouter un court extrait vidéo"
          style={{
            background: activeVideo ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.06)",
            border: activeVideo ? "1px solid rgba(255, 255, 255, 0.35)" : "1px solid rgba(255, 255, 255, 0.12)",
            color: "#ffffff",
            padding: "9px 4px",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            fontSize: "11px",
            fontWeight: "700",
            transition: "all 0.15s"
          }}
        >
          <span style={{ fontSize: "16px" }}>🎥</span>
          <span>Vidéo</span>
        </button>

        {/* Note Vocale Micro */}
        <button
          type="button"
          onClick={async () => {
            if (isRecordingAudio) {
              try {
                const res = await stopAudioRecording();
                setIsRecordingAudio(false);
                if (res && res.base64) {
                  updateAudio(res.base64);
                  setRecordingTime(res.duration);
                  if (setNewAudioDuration) setNewAudioDuration(res.duration);
                }
              } catch (e) {
                console.error("Audio stop error", e);
                setIsRecordingAudio(false);
              }
            } else {
              try {
                setRecordingTime(0);
                await startAudioRecording((sec) => setRecordingTime(sec), 60);
                setIsRecordingAudio(true);
              } catch (err) {
                alert("Microphone non disponible ou permission refusée");
                setIsRecordingAudio(false);
              }
            }
          }}
          title={isRecordingAudio ? "Arrêter l'enregistrement" : "Enregistrer une note vocale"}
          style={{
            background: isRecordingAudio
              ? "#ef4444"
              : activeAudio
              ? "rgba(255, 255, 255, 0.18)"
              : "rgba(255, 255, 255, 0.06)",
            border: isRecordingAudio
              ? "1px solid #ef4444"
              : activeAudio
              ? "1px solid rgba(255, 255, 255, 0.35)"
              : "1px solid rgba(255, 255, 255, 0.12)",
            color: "#ffffff",
            padding: "9px 4px",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            fontSize: "11px",
            fontWeight: "700",
            transition: "all 0.15s"
          }}
        >
          <span style={{ fontSize: "16px" }}>{isRecordingAudio ? "⏹️" : "🎙️"}</span>
          <span>{isRecordingAudio ? `${recordingTime}s` : "Vocal"}</span>
        </button>
      </div>

      {/* PREVIEW PHOTO */}
      {newPhoto && (
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
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
              background: "rgba(239, 68, 68, 0.2)",
              color: "#fca5a5",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600"
            }}
          >
            ❌ Retirer photo
          </button>
        </div>
      )}

      {/* PREVIEW NOTE VOCALE AUDIO */}
      {activeAudio && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#e2e8f0", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>🎙️</span> Note vocale
          </div>
          <AudioNotePlayer
            src={activeAudio}
            duration={recordingTime || null}
            onDelete={() => {
              updateAudio(null);
              setRecordingTime(0);
              if (setNewAudioDuration) setNewAudioDuration(null);
            }}
            theme="dark"
          />
        </div>
      )}

      {/* PREVIEW VIDEO */}
      {videoPreviewUrl && (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "10px",
            borderRadius: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#ffffff", fontWeight: "700" }}>🎥 Vidéo</span>
            <button
              type="button"
              onClick={() => updateVideo(null)}
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                color: "#94a3b8",
                borderRadius: "8px",
                padding: "3px 8px",
                fontSize: "11px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              ✕ Retirer
            </button>
          </div>
          <video
            src={videoPreviewUrl}
            controls
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              maxHeight: "160px",
              borderRadius: "10px",
              background: "#000000"
            }}
          />
        </div>
      )}

      {/* BOUTON SAVE */}
      <button
        type="button"
        disabled={addingFind || !newTitle.trim()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (setNewAudio && activeAudio !== newAudio) setNewAudio(activeAudio);
          if (setNewVideo && activeVideo !== newVideo) setNewVideo(activeVideo);
          if (setNewAudioDuration && recordingTime > 0) setNewAudioDuration(recordingTime);
          addFind({
            audio: activeAudio,
            audioDuration: recordingTime,
            video: activeVideo
          });
        }}
        style={{
          borderRadius: "14px",
          padding: "14px",
          border: "none",
          background: addingFind || !newTitle.trim()
            ? "#334155"
            : "#10b981",
          color: "white",
          fontSize: "14px",
          fontWeight: "700",
          cursor: addingFind || !newTitle.trim() ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          boxShadow: addingFind || !newTitle.trim() ? "none" : "0 4px 14px rgba(16,185,129,0.25)",
          marginTop: "4px"
        }}
      >
        {addingFind ? "Enregistrement en cours..." : "✅ Enregistrer la trouvaille"}
      </button>
    </div>
  );
}