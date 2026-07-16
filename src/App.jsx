import { useEffect, useState, useRef, useMemo } from "react";
import { categoryEmojis } from "./subCategories";

import LoadingScreen from "./components/LoadingScreen";
import StatsPanel from "./components/StatsPanel";
import PerformancePanel from "./components/PerformancePanel";
import CropperModal from "./components/CropperModal";
import ToastNotification from "./components/ToastNotification";
import ConfirmModal from "./components/ConfirmModal";
import GpsOnboarding from "./components/GpsOnboarding";
import AlbumPanel from "./components/AlbumPanel";
import MainMap from "./components/MainMap";
import SidebarMenu from "./components/SidebarMenu";
import OutingWidget from "./components/OutingWidget";

import { icons } from "./icons";

import useSupabaseSync from "./hooks/useSupabaseSync";
import useSortieRecorder from "./hooks/useSortieRecorder";

function offsetPosition(
  position,
  index
) {
  const radius = 0.00004;

  const angle =
    index * 60 * (Math.PI / 180);

  return [
    position[0] +
      Math.sin(angle) * radius,

    position[1] +
      Math.cos(angle) * radius
  ];
}


function App() {
  const [position, setPosition] = useState(() => {
    try {
      const cached = localStorage.getItem("lastKnownPosition");
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error("Error reading cached position", e);
    }
    return [43.273, 3.173]; // Par défaut Lespignan (Hérault) au lieu de Bourges
  });



  const [search, setSearch] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState(null);
  
  const [zoomToDate, setZoomToDate] =
    useState(null);

  const [mapStyle, setMapStyle] =
    useState("plan");

  const [filters, setFilters] =
    useState([
      "Monnaie",
      "Bijou",
      "Boucle",
      "Bouton",
      "Médaille",
      "Munition",
      "Outil",
      "Plomb",
      "Religieux",
      "Autre"
    ]);

  const [newTitle, setNewTitle] =
    useState("");

  const [
    newDescription,
    setNewDescription
  ] = useState("");

  const [
    newCategory,
    setNewCategory
  ] = useState("Monnaie");

  const [
    newSubCategory,
    setNewSubCategory
  ] = useState("");

  const [newPhoto, setNewPhoto] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [showMenu, setShowMenu] =
    useState(false);

  const [showStats, setShowStats] =
    useState(false);

  const [followGps, setFollowGps] =
    useState(false);

  const [toast, setToast] = useState(null);

  const {
    finds,
    allPhotos,
    isOnline,
    syncing,
    loadFinds,
    syncOfflineFinds
  } = useSupabaseSync(setToast);

  const {
    isRecordingSortie,
    sortieDistance,
    sortiePositions,
    savedTracks,
    startSortie: startSortieRaw,
    recordNewPosition,
    cancelSortie,
    saveSortie,
    loadTracksList
  } = useSortieRecorder();

  const [showAlbum, setShowAlbum] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [quickAddFile, setQuickAddFile] = useState(null);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddTitleInput, setQuickAddTitleInput] = useState("Trouvaille Rapide");
  const [showOutingNameModal, setShowOutingNameModal] = useState(false);
  const [outingNameInput, setOutingNameInput] = useState("");
  const [tempSortiePositions, setTempSortiePositions] = useState([]);
  const [zoomTarget, setZoomTarget] = useState(null);
  const [openPopupFind, setOpenPopupFind] = useState(null);
  const [activePopupId, setActivePopupId] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [showHistoricalMap, setShowHistoricalMap] = useState(false);
  const [historicalMapOpacity, setHistoricalMapOpacity] = useState(0.5);
  const [useClustering, setUseClustering] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [subCategorySelectCat, setSubCategorySelectCat] = useState(null);
  const [subCatModalStep, setSubCatModalStep] = useState(1);
  const [gpsStyle, setGpsStyle] = useState(() => localStorage.getItem("gpsStyle") || "blue-dot");

  const [showStartupLocationScreen, setShowStartupLocationScreen] = useState(true);
  const gpsWatchIdRef = useRef(null);

  const startGpsTracking = (initialPosition = null) => {
    if (gpsWatchIdRef.current) return;

    if (initialPosition) {
      setPosition(initialPosition);
      localStorage.setItem("lastKnownPosition", JSON.stringify(initialPosition));
    }

    gpsWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPosition = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPosition);
        localStorage.setItem("lastKnownPosition", JSON.stringify(newPosition));
        setGpsAccuracy(pos.coords.accuracy);

        if (isRecordingRef.current) {
          recordNewPosition(newPosition);
        }
      },
      (err) => {
        console.error("GPS Watch Error:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    if (followGps) {
      startGpsTracking();
    }
  }, [followGps]);

  const isRecordingRef = useRef(isRecordingSortie);
  const positionsRef = useRef(sortiePositions);
  const quickAddInputRef = useRef(null);

  useEffect(() => {
    window.__showToast = (message, type = "info") => {
      setToast({ message, type });
    };

    const nativeAlert = window.alert;
    window.alert = (msg) => {
      let type = "info";
      const normalized = String(msg).toLowerCase();
      if (
        normalized.includes("✅") ||
        normalized.includes("succès") ||
        normalized.includes("success") ||
        normalized.includes("✨") ||
        normalized.includes("enregistré") ||
        normalized.includes("démarrée") ||
        normalized.includes("démarré") ||
        normalized.includes("terminée") ||
        normalized.includes("partagée")
      ) {
        type = "success";
      } else if (
        normalized.includes("⚠️") ||
        normalized.includes("erreur") ||
        normalized.includes("échec") ||
        normalized.includes("impossible") ||
        normalized.includes("indisponible") ||
        normalized.includes("blocage")
      ) {
        type = "error";
      }
      window.__showToast(msg, type);
    };

    return () => {
      window.alert = nativeAlert;
    };
  }, []);

  useEffect(() => {
    isRecordingRef.current = isRecordingSortie;
  }, [isRecordingSortie]);

  useEffect(() => {
    positionsRef.current = sortiePositions;
  }, [sortiePositions]);

  const startSortie = () => {
    startSortieRaw(position);
    alert("⏱️ Sortie démarrée ! Les déplacements GPS accumuleront la distance marchée en arrière-plan.");
  };

  const submitOutingName = async () => {
    const name = outingNameInput.trim() || `Sortie du ${new Date().toLocaleDateString("fr-FR")}`;
    setShowOutingNameModal(false);
    await saveSortie(tempSortiePositions, name);
    setTempSortiePositions([]);
  };

  const stopSortie = async () => {
    if (sortiePositions.length < 2 || sortieDistance === 0) {
      setConfirmConfig({
        message: "Pas assez de déplacements enregistrés. Annuler la sortie ?",
        onConfirm: () => {
          cancelSortie();
          setToast({
            message: "Sortie annulée.",
            type: "info"
          });
        }
      });
      return;
    }

    setTempSortiePositions(sortiePositions);
    setOutingNameInput(`Sortie du ${new Date().toLocaleDateString("fr-FR")}`);
    setShowOutingNameModal(true);
  };
  
  const [favoritesOnly, setFavoritesOnly] =
    useState(false);

  const [
    addingFind,
    setAddingFind
  ] = useState(false);

  const [customDate, setCustomDate] =
    useState("");

  const [customLat, setCustomLat] =
    useState("");

  const [customLng, setCustomLng] =
    useState("");

  useEffect(() => {
    return () => {
      if (gpsWatchIdRef.current) {
        navigator.geolocation.clearWatch(gpsWatchIdRef.current);
      }
    };
  }, []);

  const toggleFilter = (category) => {
    // Si la catégorie cliquée est déjà la seule active, on réactive tout
    if (filters.length === 1 && filters[0] === category) {
      setFilters(Object.keys(icons));
      setActiveSubCategory(null);
    } else {
      // Extraire les sous-catégories uniques pour cette catégorie dans la base de données
      const subCats = Array.from(
        new Set(
          finds
            .filter((f) => f.category === category && f.sub_category)
            .map((f) => f.sub_category)
        )
      ).filter(Boolean);

      if (subCats.length > 0) {
        // Ouvrir la boîte de dialogue de filtre par sous-catégorie
        setSubCategorySelectCat(category);
        setSubCatModalStep(1);
      } else {
        // S'il n'y a aucune sous-catégorie enregistrée, on filtre directement par catégorie
        setFilters([category]);
        setActiveSubCategory(null);
      }
    }
  };

  const handleMapLongPress = (latlng) => {
    setCustomLat(latlng.lat.toFixed(6));
    setCustomLng(latlng.lng.toFixed(6));
    setShowForm(true);
    setShowMenu(true);
    setToast({
      message: "📍 Coordonnées ciblées depuis la carte. Remplissez le formulaire !",
      type: "success"
    });
  };

  const handleExport =
    async () => {
      await exportData();
    };

  const handleImport =
    async () => {
      await importData();

      loadFinds();
    };

  const addFind = async (quickParams = null) => {
    const finalPosition = quickParams
      ? quickParams.position
      : (customLat && customLng
        ? [Number(customLat), Number(customLng)]
        : position);

    if (!finalPosition) {
      alert("GPS indisponible");
      return;
    }

    if (addingFind) return;
    setAddingFind(true);

    const titleVal = quickParams ? quickParams.newTitle : newTitle;
    const descVal = quickParams ? quickParams.newDescription : newDescription;
    const catVal = quickParams ? quickParams.newCategory : newCategory;
    const subCatVal = quickParams ? quickParams.newSubCategory : newSubCategory;
    const photoVal = quickParams ? quickParams.newPhoto : newPhoto;
    const dateVal = quickParams ? quickParams.customDate : (customDate || null);

    try {
      if (!isOnline) {
        await addPendingFind({
          position: finalPosition,
          newTitle: titleVal,
          newDescription: descVal,
          newCategory: catVal,
          newSubCategory: subCatVal,
          customDate: dateVal
        }, photoVal);

        alert("Trouvaille sauvegardée localement (Hors-ligne) ! Elle sera synchronisée dès le retour d'internet. 💾");
      } else {
        await createFind({
          position: finalPosition,
          newTitle: titleVal,
          newDescription: descVal,
          newCategory: catVal,
          newSubCategory: subCatVal,
          newPhoto: photoVal,
          customDate: dateVal,
        });
      }

      setCustomDate("");
      setCustomLat("");
      setCustomLng("");
      setShowForm(false);
      setNewTitle("");
      setNewDescription("");
      setNewCategory("Monnaie");
      setNewSubCategory("");
      setNewPhoto(null);

      await loadFinds();
      if (quickParams) {
        alert("📸 Trouvaille rapide enregistrée !");
      }
    } catch (error) {
      console.error("Supabase creation failed, falling back to local storage:", error);
      try {
        await addPendingFind({
          position: finalPosition,
          newTitle: titleVal,
          newDescription: descVal,
          newCategory: catVal,
          newSubCategory: subCatVal,
          customDate: dateVal
        }, photoVal);

        alert("⚠️ Erreur de réseau ou connexion instable. Votre trouvaille a été sauvegardée localement (Hors-ligne) par précaution ! Elle sera synchronisée dès le retour d'internet. 💾");

        setCustomDate("");
        setCustomLat("");
        setCustomLng("");
        setShowForm(false);
        setNewTitle("");
        setNewDescription("");
        setNewCategory("Monnaie");
        setNewSubCategory("");
        setNewPhoto(null);

        await loadFinds();
      } catch (fallbackError) {
        console.error("Critical fallback save error:", fallbackError);
        alert("Erreur critique : impossible d'enregistrer la trouvaille même localement.");
      }
    }

    setAddingFind(false);
  };

  const submitQuickAdd = async () => {
    if (!quickAddFile) return;
    const title = quickAddTitleInput.trim() || "Trouvaille Rapide";

    setShowQuickAddModal(false);

    await addFind({
      position,
      newTitle: title,
      newDescription: "Indéterminé",
      newCategory: "Autre",
      newSubCategory: "",
      newPhoto: quickAddFile,
      customDate: new Date().toLocaleString("fr-FR")
    });

    setQuickAddFile(null);
  };

  const handleQuickAdd = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!position) {
      alert("Position GPS non acquise. Veuillez patienter.");
      return;
    }

    setQuickAddFile(file);
    setQuickAddTitleInput("Trouvaille Rapide");
    setShowQuickAddModal(true);

    e.target.value = "";
  };

  const handleFavorite =
  async (find) => {

    const success =
      await toggleFavorite(
        find.id,
        find.favorite
      );

    if (success) {
      await loadFinds();
    }
  };

  const deleteFind = async (findId) => {

    if (typeof findId === "string" && findId.startsWith("offline-")) {
      const offlineId = Number(findId.replace("offline-", ""));
      await deletePendingFind(offlineId);
      await loadFinds();
      return;
    }

    const { data: photos } =
      await supabase
        .from("find_photos")
        .select("*")
        .eq("find_id", findId);

    if (photos?.length) {
      for (const photo of photos) {
        const fileName =
          photo.image_url
            .split("/")
            .pop();

        await supabase.storage
          .from("find-photos")
          .remove([fileName]);
      }

      await supabase
        .from("find_photos")
        .delete()
        .eq("find_id", findId);
    }

    await supabase
      .from("finds")
      .delete()
      .eq("id", findId);

    await loadFinds();
  };

  const filteredFinds = useMemo(() => {
    return finds.filter((find) => {
      if (favoritesOnly && !find.favorite) {
        return false;
      }

      const matchesCategory = filters.includes(find.category);
      const matchesSubCategory = !activeSubCategory || find.sub_category === activeSubCategory;

      const matchesSearch =
        !search ||
        find.title?.toLowerCase().includes(search.toLowerCase()) ||
        find.description?.toLowerCase().includes(search.toLowerCase()) ||
        find.category?.toLowerCase().includes(search.toLowerCase()) ||
        find.sub_category?.toLowerCase().includes(search.toLowerCase()) ||
        find.date?.toLowerCase().includes(search.toLowerCase());

      const matchesDate =
        !selectedDate ||
        find.date?.startsWith(selectedDate);

      return matchesCategory && matchesSubCategory && matchesSearch && matchesDate;
    });
  }, [finds, filters, activeSubCategory, search, selectedDate, favoritesOnly]);

  const positionedFinds = useMemo(() => {
    if (filteredFinds.length === 0) return [];
    
    const groups = [];
    filteredFinds.forEach((find) => {
      const group = groups.find((g) => {
        const first = g[0];
        // Fast bounding box check (equivalent to ~3-4 meters)
        const latDiff = Math.abs(first.position[0] - find.position[0]);
        const lngDiff = Math.abs(first.position[1] - find.position[1]);
        return latDiff < 0.00004 && lngDiff < 0.00004;
      });
      
      if (group) {
        group.push(find);
      } else {
        groups.push([find]);
      }
    });

    return groups.flatMap((group) => {
      if (group.length === 1) {
        return { ...group[0], finalPosition: group[0].position };
      }
      return group.map((find, index) => ({
        ...find,
        finalPosition: offsetPosition(find.position, index)
      }));
    });
  }, [filteredFinds]);



  const selectedDateTracks = useMemo(() => {
    if (!selectedDate) return [];
    return savedTracks.filter((track) => {
      if (!track.created_at) return false;
      const trackDate = new Date(track.created_at).toLocaleDateString("fr-FR");
      return trackDate === selectedDate;
    });
  }, [selectedDate, savedTracks]);

    const groupedDates = finds.reduce(
  (acc, find) => {
    if (!find?.date) {
      return acc;
    }

    const shortDate =
      find.date.split(" ")[0];

    if (!acc[shortDate]) {
      acc[shortDate] = [];
    }

    acc[shortDate].push(find);

    return acc;
  },
  {}
);

  if (!position) {
    return <LoadingScreen />;
  }


const dateFinds =
  zoomToDate
    ? finds.filter((find) =>
        find.date?.startsWith(
          zoomToDate
        )
      )
    : [];

const zoomPosition =
  dateFinds.length > 0
    ? dateFinds[0].position
    : null;

return (

    <div
      style={{
        height: "100vh",
        width: "100%"
      }}
    >
      {/* FILTER BANNER */}
      {selectedDate && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5000,
            background: "rgba(17, 24, 39, 0.92)",
            backdropFilter: "blur(8px)",
            color: "white",
            padding: "10px 18px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
            fontFamily: "system-ui, sans-serif",
            fontSize: "14px",
            fontWeight: "600",
            border: "1px solid rgba(255, 255, 255, 0.12)"
          }}
        >
          <span>
            📅 Sortie du {selectedDate} : {filteredFinds.length} trouvaille{filteredFinds.length > 1 ? "s" : ""}
          </span>
          <button
            onClick={() => {
              setSelectedDate(null);
              setZoomToDate(null);
            }}
            style={{
              border: "none",
              background: "#ef4444",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              padding: 0
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* MENU BUTTON */}
      <button
        onClick={() => {
          setShowMenu(!showMenu);
          setShowStats(false);
        }}
        style={{
          position: "absolute",
          top: 85,
          left: 15,
          zIndex: 5000,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          border: "none",
          background: "#111827",
          color: "white",
          fontSize: "22px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.35)"
        }}
      >
        ☰
      </button>

      {/* STATS BUTTON */}
      <button
        onClick={() => {
          setShowStats(!showStats);
          setShowMenu(false);
          setShowAlbum(false);
          setShowPerformance(false);
        }}
        style={{
          position: "absolute",
          top: 150,
          left: 15,
          zIndex: 5000,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          border: "none",
          background: showStats ? "#2563eb" : "#111827",
          color: "white",
          fontSize: "20px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.35)",
          cursor: "pointer",
          transition: "background 0.2s"
        }}
      >
        📊
      </button>

      {/* ALBUM BUTTON */}
      <button
        onClick={() => {
          setShowAlbum(!showAlbum);
          setShowMenu(false);
          setShowStats(false);
          setShowPerformance(false);
        }}
        style={{
          position: "absolute",
          top: 215,
          left: 15,
          zIndex: 5000,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          border: "none",
          background: showAlbum ? "#2563eb" : "#111827",
          color: "white",
          fontSize: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.35)",
          cursor: "pointer",
          transition: "background 0.2s"
        }}
      >
        🖼️
      </button>

      {/* PERFORMANCE ASSISTANT BUTTON */}
      <button
        onClick={() => {
          setShowPerformance(!showPerformance);
          setShowMenu(false);
          setShowStats(false);
          setShowAlbum(false);
        }}
        style={{
          position: "absolute",
          top: 280,
          left: 15,
          zIndex: 5000,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          border: "none",
          background: showPerformance ? "#2563eb" : "#111827",
          color: "white",
          fontSize: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.35)",
          cursor: "pointer",
          transition: "background 0.2s"
        }}
        title="Assistant de Terrain"
      >
        ⚡
      </button>

      <SidebarMenu
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        showForm={showForm}
        setShowForm={setShowForm}
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
        followGps={followGps}
        setFollowGps={setFollowGps}
        showHistoricalMap={showHistoricalMap}
        setShowHistoricalMap={setShowHistoricalMap}
        historicalMapOpacity={historicalMapOpacity}
        setHistoricalMapOpacity={setHistoricalMapOpacity}
        useClustering={useClustering}
        setUseClustering={setUseClustering}
        gpsStyle={gpsStyle}
        setGpsStyle={setGpsStyle}
        isRecordingSortie={isRecordingSortie}
        sortieDistance={sortieDistance}
        startSortie={startSortie}
        stopSortie={stopSortie}
        onExport={handleExport}
        onImport={handleImport}
        onOpenAlbum={() => setShowAlbum(true)}
        onOpenStats={() => setShowStats(true)}
        onOpenPerformance={() => setShowPerformance(true)}
        
        // AddFindForm Props
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newSubCategory={newSubCategory}
        setNewSubCategory={setNewSubCategory}
        icons={icons}
        addFind={addFind}
        newPhoto={newPhoto}
        setNewPhoto={setNewPhoto}
        addingFind={addingFind}
        customDate={customDate}
        setCustomDate={setCustomDate}
        customLat={customLat}
        setCustomLat={setCustomLat}
        customLng={customLng}
        setCustomLng={setCustomLng}
        activeSubCategory={activeSubCategory}
        setActiveSubCategory={setActiveSubCategory}
      />



      {/* STATS PANEL */}
      {showStats && (
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 75,
            zIndex: 5000
          }}
        >
          <StatsPanel
            finds={finds}
            savedTracks={savedTracks}
            exportData={
              handleExport
            }
            importData={
              handleImport
            }
            groupedDates={
              groupedDates
            }
            setSelectedDate={(date) => {
              setSelectedDate(date);
              setZoomToDate(date);
            }}
            onClose={() =>
              setShowStats(false)
            }
          />
        </div>
      )}

      {/* PERFORMANCE PANEL */}
      {showPerformance && (
        <PerformancePanel
          latitude={position?.[0]}
          longitude={position?.[1]}
          onClose={() => setShowPerformance(false)}
        />
      )}

      {showAlbum && (
        <AlbumPanel
          finds={finds}
          allPhotos={allPhotos}
          onClose={() => setShowAlbum(false)}
          onOpenFindDetails={(find) => {
            setZoomTarget({ position: find.position || [find.latitude, find.longitude], zoom: 20 });
            setOpenPopupFind(find);
            setShowAlbum(false);
          }}
        />
      )}

      {/* STATUS BADGES */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          fontFamily: "system-ui, sans-serif",
          fontSize: "12px",
          fontWeight: "700"
        }}
      >
        <div
          style={{
            background: isOnline ? "rgba(22, 163, 74, 0.9)" : "rgba(245, 158, 11, 0.9)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "white" }}></span>
          {isOnline ? "En ligne" : "Hors-ligne 💾"}
          {syncing && " (Synchro...)"}
        </div>

        {/* GPS Accuracy Badge */}
        <div
          style={{
            background: "rgba(17, 24, 39, 0.8)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: gpsAccuracy === null
                ? "#9ca3af" // Grey
                : gpsAccuracy < 5
                  ? "#10b981" // Green
                  : gpsAccuracy < 15
                    ? "#f59e0b" // Orange
                    : "#ef4444" // Red
            }}
          ></span>
          {gpsAccuracy === null ? "GPS : Recherche..." : `GPS : ± ${gpsAccuracy.toFixed(0)}m`}
        </div>

        <OutingWidget
          isRecordingSortie={isRecordingSortie}
          sortieDistance={sortieDistance}
        />
      </div>

      <MainMap
        position={position}
        followGps={followGps}
        setFollowGps={setFollowGps}
        zoomTarget={zoomTarget}
        setZoomTarget={setZoomTarget}
        openPopupFind={openPopupFind}
        setOpenPopupFind={setOpenPopupFind}
        activePopupId={activePopupId}
        setActivePopupId={setActivePopupId}
        gpsStyle={gpsStyle}
        useClustering={useClustering}
        mapStyle={mapStyle}
        showHistoricalMap={showHistoricalMap}
        historicalMapOpacity={historicalMapOpacity}
        positionedFinds={positionedFinds}
        selectedDateTracks={selectedDateTracks}
        handleMapLongPress={handleMapLongPress}
        deleteFind={deleteFind}
        handleFavorite={handleFavorite}
        loadFinds={loadFinds}
      />

      {/* Hidden input for quick add */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={quickAddInputRef}
        style={{ display: "none" }}
        onChange={handleQuickAdd}
      />


      {/* Floating Recenter GPS Button */}
      <button
        onClick={() => {
          setFollowGps(true);
          setZoomTarget({ position: position, zoom: 20 });
          setToast({
            message: "🎯 Centrage et suivi GPS activés !",
            type: "success"
          });
        }}
        style={{
          position: "absolute",
          bottom: "105px",
          right: "36px",
          zIndex: 5000,
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.15)",
          background: followGps ? "rgba(37, 99, 235, 0.95)" : "rgba(17, 24, 39, 0.9)",
          backdropFilter: "blur(8px)",
          color: "white",
          fontSize: "20px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.15s, background-color 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        title="Centrer sur ma position"
      >
        🎯
      </button>

      {/* Floating Add Flash Button */}
      <button
        onClick={() => {
          if (quickAddInputRef.current) {
            quickAddInputRef.current.click();
          }
        }}
        style={{
          position: "absolute",
          bottom: "30px",
          right: "30px",
          zIndex: 5000,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.2)",
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          fontSize: "24px",
          boxShadow: "0 8px 24px rgba(5, 150, 105, 0.4)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.15s, background-color 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        title="Ajout Rapide Flash"
      >
        📸+
      </button>
      {/* QUICK ADD CUSTOM TITLE PROMPT MODAL */}
      {showQuickAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            padding: "16px",
            boxSizing: "border-box"
          }}
          onClick={() => {
            setShowQuickAddModal(false);
            setQuickAddFile(null);
          }}
        >
          <div
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "360px",
              padding: "20px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              boxShadow: "0 12px 36px rgba(0,0,0,0.5)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ margin: 0, color: "white", fontSize: "16px", fontWeight: "800" }}>
              📷 Titre de la trouvaille rapide :
            </h4>

            <input
              type="text"
              value={quickAddTitleInput}
              onChange={(e) => setQuickAddTitleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitQuickAdd();
                }
              }}
              autoFocus
              style={{
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                width: "100%",
                boxSizing: "border-box",
                outline: "none"
              }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  setShowQuickAddModal(false);
                  setQuickAddFile(null);
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "transparent",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Annuler
              </button>
              <button
                onClick={submitQuickAdd}
                style={{
                  flex: 1.5,
                  padding: "10px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#16a34a",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Valider ✅
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OUTING NAME CUSTOM PROMPT MODAL */}
      {showOutingNameModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            padding: "16px",
            boxSizing: "border-box"
          }}
          onClick={() => {
            setShowOutingNameModal(false);
            setTempSortiePositions([]);
          }}
        >
          <div
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "360px",
              padding: "20px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              boxShadow: "0 12px 36px rgba(0,0,0,0.5)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ margin: 0, color: "white", fontSize: "16px", fontWeight: "800" }}>
              ⏱️ Nom de la sortie ?
            </h4>

            <input
              type="text"
              value={outingNameInput}
              onChange={(e) => setOutingNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitOutingName();
                }
              }}
              autoFocus
              style={{
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                width: "100%",
                boxSizing: "border-box",
                outline: "none"
              }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  setShowOutingNameModal(false);
                  setTempSortiePositions([]);
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "transparent",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Annuler
              </button>
              <button
                onClick={submitOutingName}
                style={{
                  flex: 1.5,
                  padding: "10px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#16a34a",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Valider ✅
              </button>
            </div>
          </div>
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
      {/* Subcategory Selection Modal */}
      {subCategorySelectCat && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              background: "rgba(17, 24, 39, 0.95)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "24px",
              padding: "24px",
              width: "100%",
              maxWidth: "380px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              boxSizing: "border-box"
            }}
          >
            {subCatModalStep === 1 ? (
              <>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                  🔍 Filtrer par sous-catégorie ?
                </h3>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.5", color: "#d1d5db" }}>
                  Souhaitez-vous affiner votre recherche par sous-catégorie pour les trouvailles de type <strong>{categoryEmojis[subCategorySelectCat] || ""} {subCategorySelectCat}</strong> ?
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                  <button
                    onClick={() => setSubCatModalStep(2)}
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      border: "none",
                      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)"
                    }}
                  >
                    Oui (Choisir une sous-catégorie)
                  </button>
                  <button
                    onClick={() => {
                      setFilters([subCategorySelectCat]);
                      setActiveSubCategory(null);
                      setSubCategorySelectCat(null);
                    }}
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.06)",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Non (Voir toute la catégorie)
                  </button>
                  <button
                    onClick={() => setSubCategorySelectCat(null)}
                    style={{
                      padding: "10px",
                      borderRadius: "12px",
                      border: "none",
                      background: "transparent",
                      color: "#9ca3af",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                  🏷️ Choisir la sous-catégorie
                </h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                  Sélectionnez la sous-catégorie pour <strong>{subCategorySelectCat}</strong> :
                </p>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  maxHeight: "220px",
                  overflowY: "auto",
                  paddingRight: "4px"
                }}>
                  {Array.from(new Set(finds.filter(f => f.category === subCategorySelectCat && f.sub_category).map(f => f.sub_category)))
                    .filter(Boolean)
                    .map((subCat) => (
                      <button
                        key={subCat}
                        onClick={() => {
                          setFilters([subCategorySelectCat]);
                          setActiveSubCategory(subCat);
                          setSubCategorySelectCat(null);
                        }}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(255,255,255,0.04)",
                          color: "white",
                          fontSize: "13px",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                        }}
                      >
                        🔹 {subCat}
                      </button>
                    ))}
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                  <button
                    onClick={() => setSubCatModalStep(1)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "transparent",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setSubCategorySelectCat(null)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: "none",
                      background: "#ef4444",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Onboarding GPS Startup Screen */}
      {showStartupLocationScreen && (
        <GpsOnboarding
          finds={finds}
          onGpsAuthorized={(pos) => {
            setFollowGps(true);
            startGpsTracking(pos);
            setZoomTarget({ position: pos, zoom: 18 });
            setShowStartupLocationScreen(false);
            setToast({ message: "🎯 GPS activé avec précision !", type: "success" });
          }}
          onModeConsultation={() => {
            setFollowGps(false);
            if (finds && finds.length > 0) {
              const validFinds = finds.filter(f => (f.position ? f.position[0] : f.latitude) != null);
              if (validFinds.length > 0) {
                const lats = validFinds.map(f => f.position ? f.position[0] : f.latitude);
                const lngs = validFinds.map(f => f.position ? f.position[1] : f.longitude);
                const avgLat = lats.reduce((sum, val) => sum + val, 0) / lats.length;
                const avgLng = lngs.reduce((sum, val) => sum + val, 0) / lngs.length;
                setZoomTarget({ position: [avgLat, avgLng], zoom: 16 });
              } else {
                setZoomTarget({ position: [43.273, 3.173], zoom: 16 });
              }
            } else {
              setZoomTarget({ position: [43.273, 3.173], zoom: 16 });
            }
            setShowStartupLocationScreen(false);
            setToast({ message: "🗺️ Mode consultation activé à Lespignan.", type: "success" });
          }}
        />
      )}
    </div>
  );
}

export default App;
