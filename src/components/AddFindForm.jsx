import { useState, useEffect, useRef, useMemo } from "react";
import { PRESET_CATEGORY_COLORS } from "../subCategories";
import CategoryMarkerPicker from "./CategoryMarkerPicker";
import TacticalPinIcon from "./TacticalPinIcon";
import MetallicMaterialBadge from "./MetallicMaterialBadge";
import { loadCategoriesData, addCategory, removeCategory } from "../services/categoriesService";
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
  const [quickCatEmoji, setQuickCatEmoji] = useState("monnaie");
  const [quickCatColor, setQuickCatColor] = useState("#facc15");

  // Modern Pickers
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [showMetalPicker, setShowMetalPicker] = useState(false);
  const [isCreatingNewCat, setIsCreatingNewCat] = useState(false);

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

  useEffect(() => {
    if (showForm) {
      const freshData = loadCategoriesData();
      setCategoryData(freshData);
      const keys = Object.keys(freshData.categories || {});
      if (keys.length > 0 && (!newCategory || !freshData.categories[newCategory])) {
        setNewCategory(keys[0]);
      }
      setMaterialsData(loadMaterialsData());
    }
  }, [showForm, newCategory, setNewCategory]);

  if (!showForm) return null;

  const categories = categoryData.categories || {};
  const emojis = categoryData.emojis || {};
  const colors = categoryData.colors || {};
  const categoryKeys = Object.keys(categories).sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
  const availableSubCats = [...(categories[newCategory] || [])].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));

  const handleModeToggle = (manual) => {
    setIsManualMode(manual);
    if (!manual) {
      if (setCustomDate) setCustomDate("");
      if (setCustomLat) setCustomLat("");
      if (setCustomLng) setCustomLng("");
    }
  };

  const inputStyle = {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    outline: "none",
    fontSize: "13px",
    background: "#111915",
    color: "#ffffff",
    width: "100%",
    boxSizing: "border-box",
    fontWeight: "400",
    transition: "all 0.2s ease"
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        zIndex: 10
      }}
    >
      {/* MODE SELECTOR TOGGLE (DIRECT LIVE VS MANUEL DIFFERÉ) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4px",
          background: "rgba(0, 0, 0, 0.25)",
          padding: "3px",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.06)"
        }}
      >
        <button
          type="button"
          onClick={() => handleModeToggle(false)}
          style={{
            padding: "8px 6px",
            borderRadius: "7px",
            border: "none",
            background: !isManualMode ? "#2c5e4c" : "transparent",
            color: !isManualMode ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
            fontWeight: "400",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px"
          }}
        >
          En direct
        </button>

        <button
          type="button"
          onClick={() => handleModeToggle(true)}
          style={{
            padding: "8px 6px",
            borderRadius: "7px",
            border: "none",
            background: isManualMode ? "#2c5e4c" : "transparent",
            color: isManualMode ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
            fontWeight: "400",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px"
          }}
        >
          En différé (manuel)
        </button>
      </div>

      {/* MODE INFO BADGE */}
      <div
        style={{
          fontSize: "11px",
          padding: "7px 10px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          color: "rgba(255, 255, 255, 0.7)",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}
      >
        <span>
          {isManualMode
            ? "Mode différé : saisissez la date, les coordonnées et choisissez vos médias."
            : "Mode direct : position GPS actuelle et date enregistrées automatiquement."}
        </span>
      </div>

      {/* TITRE (SANS EXEMPLE) */}
      <div>
        <label style={{ fontSize: "11px", fontWeight: "400", color: "rgba(255, 255, 255, 0.8)", marginBottom: "4px", display: "block" }}>
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
      <div>
        <label style={{ fontSize: "11px", fontWeight: "400", color: "rgba(255, 255, 255, 0.8)", marginBottom: "4px", display: "block" }}>
          Catégorie *
        </label>

        {categoryKeys.length === 0 ? (
          <div
            style={{
              padding: "14px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px dashed rgba(255, 255, 255, 0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: "400", color: "#ffffff" }}>
              Aucune catégorie créée pour le moment
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)" }}>
              Créez votre première catégorie manuellement avec son repère visuel.
            </div>

            <div
              style={{
                background: "#111915",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                textAlign: "left"
              }}
            >
              <input
                type="text"
                placeholder="Nom de la catégorie..."
                value={quickCatName}
                onChange={(e) => setQuickCatName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "#19231e",
                  color: "#ffffff",
                  fontSize: "12px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />

              {/* Color swatches */}
              <div>
                <div style={{ fontSize: "10px", opacity: 0.7, textTransform: "uppercase", marginBottom: "5px" }}>
                  Couleur du repère sur la carte
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {PRESET_CATEGORY_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setQuickCatColor(col)}
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: col,
                        border: quickCatColor === col ? "2px solid #ffffff" : "1px solid rgba(255,255,255,0.2)",
                        cursor: "pointer",
                        padding: 0
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Tactical marker selector */}
              <div>
                <CategoryMarkerPicker
                  selectedMarkerId={quickCatEmoji}
                  onSelectMarker={setQuickCatEmoji}
                  currentColor={quickCatColor}
                  theme="dark"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const trimmed = quickCatName.trim();
                  if (!trimmed) return;
                  addCategory(trimmed, quickCatEmoji, ["Indéterminé"], quickCatColor);
                  setNewCategory(trimmed);
                  setQuickCatName("");
                }}
                disabled={!quickCatName.trim()}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: quickCatName.trim() ? "#2c5e4c" : "rgba(255,255,255,0.1)",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: "400",
                  cursor: quickCatName.trim() ? "pointer" : "not-allowed"
                }}
              >
                Créer la catégorie
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCatPicker(true)}
            style={{
              ...inputStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <TacticalPinIcon
                markerId={emojis[newCategory] || "monnaie"}
                color={colors[newCategory] || "#2c5e4c"}
                size={22}
                categoryName={newCategory}
              />
              <span style={{ fontSize: "13px", color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {newCategory || "Sélectionner une catégorie"}
              </span>
            </div>
            <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.5)", flexShrink: 0 }}>
              Changer ▼
            </span>
          </button>
        )}
      </div>

      {/* SOUS-CATEGORIE (IF AVAILABLE) */}
      {availableSubCats.length > 0 && (
        <div>
          <label style={{ fontSize: "11px", fontWeight: "400", color: "rgba(255, 255, 255, 0.8)", marginBottom: "4px", display: "block" }}>
            Sous-catégorie
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <button
              type="button"
              onClick={() => setNewSubCategory("")}
              style={{
                padding: "6px 12px",
                borderRadius: "999px",
                border: !newSubCategory ? "1px solid #2c5e4c" : "1px solid rgba(255,255,255,0.08)",
                background: !newSubCategory ? "rgba(44, 94, 76, 0.3)" : "#111915",
                color: !newSubCategory ? "#ffffff" : "rgba(255,255,255,0.7)",
                fontSize: "12px",
                fontWeight: "400",
                cursor: "pointer"
              }}
            >
              Non spécifiée
            </button>
            {availableSubCats.map((subCat) => {
              const isSelected = newSubCategory === subCat;
              return (
                <button
                  key={subCat}
                  type="button"
                  onClick={() => setNewSubCategory(subCat)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "999px",
                    border: isSelected ? "1px solid #2c5e4c" : "1px solid rgba(255,255,255,0.08)",
                    background: isSelected ? "rgba(44, 94, 76, 0.3)" : "#111915",
                    color: isSelected ? "#ffffff" : "rgba(255,255,255,0.7)",
                    fontSize: "12px",
                    fontWeight: "400",
                    cursor: "pointer"
                  }}
                >
                  {subCat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* METAL */}
      <div>
        <label style={{ fontSize: "11px", fontWeight: "400", color: "rgba(255, 255, 255, 0.8)", marginBottom: "4px", display: "block" }}>
          Métal
        </label>
        <button
          type="button"
          onClick={() => setShowMetalPicker(true)}
          style={{
            ...inputStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <MetallicMaterialBadge
              metalName={newDescription && newDescription !== "Indéterminé" ? newDescription : "Indéterminé"}
              size={22}
            />
            <span style={{ fontSize: "13px", color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {newDescription && newDescription !== "Indéterminé" ? newDescription : "Métal non spécifié"}
            </span>
          </div>
          <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.5)", flexShrink: 0 }}>
            Changer ▼
          </span>
        </button>
      </div>

      {/* CHAMPS MANUELS (UNIQUEMENT SI MODE DIFFERE ACTIVE) */}
      {isManualMode && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "12px",
            borderRadius: "10px",
            background: "#111915",
            border: "1px solid rgba(255, 255, 255, 0.08)"
          }}
        >
          <div>
            <label style={{ fontSize: "11px", fontWeight: "400", color: "rgba(255, 255, 255, 0.8)", marginBottom: "4px", display: "block" }}>
              Date de découverte
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
              <label style={{ fontSize: "11px", fontWeight: "400", color: "rgba(255, 255, 255, 0.8)", marginBottom: "4px", display: "block" }}>
                Latitude
              </label>
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={customLat || ""}
                onChange={(e) => setCustomLat && setCustomLat(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "400", color: "rgba(255, 255, 255, 0.8)", marginBottom: "4px", display: "block" }}>
                Longitude
              </label>
              <input
                type="number"
                step="any"
                placeholder="Longitude"
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
          if (file.size > 50 * 1024 * 1024) {
            alert("Vidéo trop volumineuse (max 50 Mo). Privilégiez un court extrait.");
            return;
          }
          updateVideo(file);
        }}
      />

      {/* MEDIA TOOLBAR (4 BOUTONS : PHOTO, GALERIE, VIDÉO, VOCAL) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px" }}>
        {/* Appareil Photo */}
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          title="Prendre une photo"
          style={{
            background: newPhoto ? "#2c5e4c" : "rgba(255, 255, 255, 0.05)",
            border: newPhoto ? "1px solid #40916c" : "1px solid rgba(255, 255, 255, 0.08)",
            color: "#ffffff",
            padding: "8px 4px",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            fontSize: "11px",
            fontWeight: "400",
            transition: "all 0.15s"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <span>Photo</span>
        </button>

        {/* Galerie Photo */}
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          title="Choisir depuis la galerie"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#ffffff",
            padding: "8px 4px",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            fontSize: "11px",
            fontWeight: "400",
            transition: "all 0.15s"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span>Galerie</span>
        </button>

        {/* Vidéo */}
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          title="Ajouter un court extrait vidéo"
          style={{
            background: activeVideo ? "#2c5e4c" : "rgba(255, 255, 255, 0.05)",
            border: activeVideo ? "1px solid #40916c" : "1px solid rgba(255, 255, 255, 0.08)",
            color: "#ffffff",
            padding: "8px 4px",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            fontSize: "11px",
            fontWeight: "400",
            transition: "all 0.15s"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
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
              ? "#dc2626"
              : activeAudio
              ? "#2c5e4c"
              : "rgba(255, 255, 255, 0.05)",
            border: isRecordingAudio
              ? "1px solid #dc2626"
              : activeAudio
              ? "1px solid #40916c"
              : "1px solid rgba(255, 255, 255, 0.08)",
            color: "#ffffff",
            padding: "8px 4px",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            fontSize: "11px",
            fontWeight: "400",
            transition: "all 0.15s"
          }}
        >
          {isRecordingAudio ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          )}
          <span>{isRecordingAudio ? `${recordingTime}s` : "Vocal"}</span>
        </button>
      </div>

      {/* PREVIEW PHOTO */}
      {newPhoto && (
        <div
          style={{
            background: "#111915",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "10px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.8)",
              wordBreak: "break-word"
            }}
          >
            {newPhoto.name}
          </div>

          <img
            src={URL.createObjectURL(newPhoto)}
            alt="preview"
            style={{
              width: "100%",
              borderRadius: "8px",
              maxHeight: "180px",
              objectFit: "cover",
              border: "1px solid rgba(255, 255, 255, 0.08)"
            }}
          />

          <button
            type="button"
            onClick={() => setNewPhoto(null)}
            style={{
              border: "none",
              borderRadius: "8px",
              padding: "7px",
              background: "rgba(220, 38, 38, 0.15)",
              color: "#f87171",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "400"
            }}
          >
            Retirer la photo
          </button>
        </div>
      )}

      {/* PREVIEW NOTE VOCALE AUDIO */}
      {activeAudio && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ fontSize: "11px", fontWeight: "400", color: "rgba(255, 255, 255, 0.7)", display: "flex", alignItems: "center", gap: "6px" }}>
            Note vocale
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
            background: "#111915",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "10px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#ffffff", fontWeight: "400" }}>Vidéo</span>
            <button
              type="button"
              onClick={() => updateVideo(null)}
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "rgba(255, 255, 255, 0.7)",
                borderRadius: "6px",
                padding: "3px 8px",
                fontSize: "11px",
                cursor: "pointer",
                fontWeight: "400"
              }}
            >
              Retirer
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
              borderRadius: "8px",
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
            newPhoto: newPhoto,
            audio: activeAudio,
            audioDuration: recordingTime,
            video: activeVideo
          });
        }}
        style={{
          borderRadius: "10px",
          padding: "13px",
          border: "none",
          background: addingFind || !newTitle.trim()
            ? "rgba(255, 255, 255, 0.08)"
            : "#2c5e4c",
          color: addingFind || !newTitle.trim() ? "rgba(255, 255, 255, 0.35)" : "#ffffff",
          fontSize: "14px",
          fontWeight: "400",
          cursor: addingFind || !newTitle.trim() ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          marginTop: "4px"
        }}
      >
        {addingFind
          ? (activeVideo ? "Téléversement vidéo et enregistrement..." : (newPhoto ? "Envoi de la photo et enregistrement..." : "Enregistrement en cours..."))
          : "Enregistrer la trouvaille"}
      </button>

      {/* MODAL / SHEET CHOIX & CREATION DE CATEGORIE */}
      {showCatPicker && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            boxSizing: "border-box"
          }}
          onClick={() => setShowCatPicker(false)}
        >
          <div
            style={{
              background: "#161f1a",
              color: "#ffffff",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              width: "100%",
              maxWidth: "440px",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.6)",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "400", color: "#ffffff" }}>
                  Choisir une catégorie
                </h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "rgba(255, 255, 255, 0.6)" }}>
                  Sélectionnez ou créez une catégorie avec son repère visuel
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCatPicker(false)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
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

            {/* List */}
            <div style={{ padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {categoryKeys.map((cat) => {
                  const isSelected = cat === newCategory;
                  const markerId = emojis[cat] || "monnaie";
                  const color = colors[cat] || "#2c5e4c";
                  return (
                    <div
                      key={cat}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setNewCategory(cat);
                          setNewSubCategory("");
                          setShowCatPicker(false);
                        }}
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          borderRadius: "12px",
                          border: isSelected ? "1px solid #2c5e4c" : "1px solid rgba(255, 255, 255, 0.08)",
                          background: isSelected ? "rgba(44, 94, 76, 0.3)" : "#111915",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                          <TacticalPinIcon markerId={markerId} color={color} size={24} categoryName={cat} />
                          <span style={{ fontSize: "13px", fontWeight: "400", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {cat}
                          </span>
                        </div>
                        {isSelected && (
                          <span style={{ fontSize: "12px", color: "#6ee7b7", fontWeight: "400" }}>✓</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCategory(cat);
                          const updated = loadCategoriesData();
                          setCategoryData(updated);
                          if (newCategory === cat) {
                            const remaining = Object.keys(updated.categories || {});
                            setNewCategory(remaining[0] || "");
                            setNewSubCategory("");
                          }
                        }}
                        style={{
                          width: "34px",
                          height: "38px",
                          borderRadius: "10px",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          background: "#111915",
                          color: "rgba(255, 255, 255, 0.4)",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        title="Supprimer la catégorie"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              {categoryKeys.length === 0 && !isCreatingNewCat && (
                <div style={{ textAlign: "center", padding: "14px", color: "rgba(255, 255, 255, 0.6)", fontSize: "12px" }}>
                  Aucune catégorie configurée. Créez votre première catégorie ci-dessous pour pouvoir classer vos trouvailles.
                </div>
              )}

              {/* Add New Category Section */}
              {!isCreatingNewCat && categoryKeys.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsCreatingNewCat(true)}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px dashed rgba(255, 255, 255, 0.2)",
                    background: "transparent",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "13px",
                    fontWeight: "400",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  + Créer une nouvelle catégorie
                </button>
              ) : (
                <div
                  style={{
                    background: "#111915",
                    padding: "14px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  <div style={{ fontSize: "11px", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.7)", letterSpacing: "0.5px" }}>
                    Nouvelle catégorie
                  </div>
                  <input
                    type="text"
                    placeholder="Nom de la catégorie..."
                    value={quickCatName}
                    onChange={(e) => setQuickCatName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "#19231e",
                      color: "#ffffff",
                      fontSize: "12px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />

                  <div>
                    <div style={{ fontSize: "10px", opacity: 0.7, textTransform: "uppercase", marginBottom: "5px" }}>
                      Couleur du repère sur la carte
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {PRESET_CATEGORY_COLORS.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setQuickCatColor(col)}
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: col,
                            border: quickCatColor === col ? "2px solid #ffffff" : "1px solid rgba(255,255,255,0.2)",
                            cursor: "pointer",
                            padding: 0
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "10px", opacity: 0.7, textTransform: "uppercase", marginBottom: "5px" }}>
                      Repère visuel
                    </div>
                    <CategoryMarkerPicker
                      selectedMarkerId={quickCatEmoji}
                      onSelectMarker={setQuickCatEmoji}
                      currentColor={quickCatColor}
                      theme="dark"
                    />
                  </div>

                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNewCat(false);
                        setQuickCatName("");
                      }}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "transparent",
                        color: "rgba(255, 255, 255, 0.7)",
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
                        const updated = loadCategoriesData();
                        setCategoryData(updated);
                        setNewCategory(trimmed);
                        setNewSubCategory("");
                        setQuickCatName("");
                        setIsCreatingNewCat(false);
                        setShowCatPicker(false);
                      }}
                      disabled={!quickCatName.trim()}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: "none",
                        background: quickCatName.trim() ? "#2c5e4c" : "rgba(255,255,255,0.1)",
                        color: "#ffffff",
                        fontSize: "12px",
                        cursor: quickCatName.trim() ? "pointer" : "not-allowed"
                      }}
                    >
                      Créer et sélectionner
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL POUR CHOISIR UN MÉTAL */}
      {showMetalPicker && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            boxSizing: "border-box"
          }}
          onClick={() => setShowMetalPicker(false)}
        >
          <div
            style={{
              background: "#161f1a",
              color: "#ffffff",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              width: "100%",
              maxWidth: "420px",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.6)",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "400", color: "#ffffff" }}>
                  Sélectionner un métal
                </h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "rgba(255, 255, 255, 0.6)" }}>
                  Choisissez la matière de votre trouvaille
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMetalPicker(false)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
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

            {/* List */}
            <div style={{ padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Option: Métal non spécifié */}
              <button
                type="button"
                onClick={() => {
                  setNewDescription("Indéterminé");
                  setShowMetalPicker(false);
                }}
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: !newDescription || newDescription === "Indéterminé" ? "1px solid #2c5e4c" : "1px solid rgba(255, 255, 255, 0.08)",
                  background: !newDescription || newDescription === "Indéterminé" ? "rgba(44, 94, 76, 0.3)" : "#111915",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <MetallicMaterialBadge metalName="Indéterminé" size={24} />
                  <span style={{ fontSize: "13px", fontWeight: "400" }}>Métal non spécifié</span>
                </div>
                {(!newDescription || newDescription === "Indéterminé") && (
                  <span style={{ fontSize: "12px", color: "#6ee7b7", fontWeight: "400" }}>✓</span>
                )}
              </button>

              {/* Other metals */}
              {(materialsData.materials || []).filter((m) => m !== "Indéterminé").map((mat) => {
                const isSelected = newDescription === mat;
                return (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => {
                      setNewDescription(mat);
                      setShowMetalPicker(false);
                    }}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: isSelected ? "1px solid #2c5e4c" : "1px solid rgba(255, 255, 255, 0.08)",
                      background: isSelected ? "rgba(44, 94, 76, 0.3)" : "#111915",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <MetallicMaterialBadge metalName={mat} size={24} />
                      <span style={{ fontSize: "13px", fontWeight: "400" }}>{mat}</span>
                    </div>
                    {isSelected && (
                      <span style={{ fontSize: "12px", color: "#6ee7b7", fontWeight: "400" }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}