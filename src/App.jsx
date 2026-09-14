import { useEffect, useState, useRef, useMemo } from "react";
import { categoryEmojis } from "./subCategories";

import LoadingScreen from "./components/LoadingScreen";
import StatsPanel from "./components/StatsPanel";
import CropperModal from "./components/CropperModal";
import ToastNotification from "./components/ToastNotification";
import ConfirmModal from "./components/ConfirmModal";
import AlbumPanel from "./components/AlbumPanel";
import MainMap from "./components/MainMap";
import SidebarMenu from "./components/SidebarMenu";
import OutingWidget from "./components/OutingWidget";
import BottomNav from "./components/BottomNav";
import OnboardingModal from "./components/OnboardingModal";
import ReportsPanel from "./components/ReportsPanel";
import ShortcutsPanel from "./components/ShortcutsPanel";
import SettingsPanel from "./components/SettingsPanel";
import TacticalTopHUD from "./components/TacticalTopHUD";
import TacticalBottomHUD from "./components/TacticalBottomHUD";
import ThemePickerModal from "./components/ThemePickerModal";
import CategoryManagerModal from "./components/CategoryManagerModal";
import TeamSessionModal from "./components/TeamSessionModal";
import MapLayersModal from "./components/MapLayersModal";
import { THEMES } from "./styles/themes";

import { icons } from "./icons";
import { supabase } from "./supabase";

import useSupabaseSync from "./hooks/useSupabaseSync";
import useSortieRecorder from "./hooks/useSortieRecorder";
import { addPendingFind, deletePendingFind } from "./services/offlineStore";
import { importData, exportData } from "./services/backupService";
import { addFind as createFind, toggleFavorite } from "./services/findsService";
import { getActiveSession, leaveTeamSession } from "./services/sessionService";

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

  const [hideAllFinds, setHideAllFinds] = useState(() => {
    return localStorage.getItem("hideAllFinds") === "true";
  });

  useEffect(() => {
    localStorage.setItem("hideAllFinds", hideAllFinds);
  }, [hideAllFinds]);

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

  const [workspace, setWorkspace] = useState(() => {
    const activeSess = getActiveSession();
    if (activeSess) {
      return {
        mode: "session",
        targetCode: activeSess.code,
        sessionName: activeSess.name
      };
    }
    return {
      mode: "personal",
      targetCode: null,
      sessionName: null
    };
  });
  const [showTeamSessionModal, setShowTeamSessionModal] = useState(false);

  const {
    finds,
    allPhotos,
    isOnline,
    syncing,
    loadFinds,
    syncOfflineFinds,
    loadPhotosForAlbum
  } = useSupabaseSync(setToast, workspace);

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

  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem("rdl_onboarding_completed_v2") !== "true";
  });
  const [activeTab, setActiveTab] = useState("map");
  const [theme, setTheme] = useState(() => localStorage.getItem("app_theme") || "dark");
  const [designTheme, setDesignTheme] = useState(() => localStorage.getItem("app_design_theme") || "tactical");
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showCategoryManagerModal, setShowCategoryManagerModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("app_design_theme", designTheme);
  }, [designTheme]);

  useEffect(() => {
    localStorage.setItem("app_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "light") {
      document.body.classList.add("theme-light");
      document.body.classList.remove("theme-dark");
    } else {
      document.body.classList.add("theme-dark");
      document.body.classList.remove("theme-light");
    }
  }, [theme]);

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
  const [baseMap, setBaseMap] = useState(() => localStorage.getItem("baseMap") || "satellite");
  const [showCadastre, setShowCadastre] = useState(() => localStorage.getItem("showCadastre") === "true");
  const [cadastreOpacity, setCadastreOpacity] = useState(() => {
    const val = localStorage.getItem("cadastreOpacity");
    return val ? parseFloat(val) : 1.0;
  });
  const [showCassini, setShowCassini] = useState(() => localStorage.getItem("showCassini") === "true" || localStorage.getItem("showHistoricalMap") === "true");
  const [cassiniOpacity, setCassiniOpacity] = useState(() => {
    const val = localStorage.getItem("cassiniOpacity") || localStorage.getItem("historicalMapOpacity");
    return val ? parseFloat(val) : 1.0;
  });
  const [showEtatMajor, setShowEtatMajor] = useState(() => localStorage.getItem("showEtatMajor") === "true");
  const [etatMajorOpacity, setEtatMajorOpacity] = useState(() => {
    const val = localStorage.getItem("etatMajorOpacity");
    return val ? parseFloat(val) : 1.0;
  });
  const [showMapLayersModal, setShowMapLayersModal] = useState(false);
  const [showHistoricalMap, setShowHistoricalMap] = useState(false);
  const [historicalMapOpacity, setHistoricalMapOpacity] = useState(0.5);
  const [useClustering, setUseClustering] = useState(false);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [subCategorySelectCat, setSubCategorySelectCat] = useState(null);
  const [subCatModalStep, setSubCatModalStep] = useState(1);
  const [gpsStyle, setGpsStyle] = useState(() => localStorage.getItem("gpsStyle") || "blue-dot");

  const gpsWatchIdRef = useRef(null);

  // Silent automatic GPS discovery on startup (without blocking modal)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const currentPos = [pos.coords.latitude, pos.coords.longitude];
          setPosition(currentPos);
          localStorage.setItem("lastKnownPosition", JSON.stringify(currentPos));
          setGpsAccuracy(pos.coords.accuracy);
        },
        (err) => {
          console.warn("Silent GPS startup check:", err?.message);
        },
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
      );
    }
  }, []);

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
          recordNewPosition(newPosition, pos.coords.accuracy);
        }
      },
      (err) => {
        console.error("GPS Watch Error:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 1000
      }
    );
  };

  useEffect(() => {
    if (followGps || isRecordingSortie) {
      startGpsTracking();
    }
  }, [followGps, isRecordingSortie]);

  useEffect(() => {
    if (showAlbum) {
      loadPhotosForAlbum();
    }
  }, [showAlbum]);

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
    startGpsTracking(position);
    setFollowGps(true);
    startSortieRaw(position);
    setToast({
      message: "⏱️ Sortie démarrée ! Tracé GPS en direct activé.",
      type: "success"
    });
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
        alert("Erreur critique : impossible d'enregistrer la trouvaille même localement. Détail : " + (fallbackError?.message || fallbackError || "Inconnu"));
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
    if (hideAllFinds || filteredFinds.length === 0) return [];
    
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
  }, [filteredFinds, hideAllFinds]);



  const todayFindsCount = useMemo(() => {
    const today = new Date().toLocaleDateString("fr-FR");
    const todayIso = new Date().toISOString().split("T")[0];
    return finds.filter((f) => {
      if (!f?.date) return false;
      return f.date.includes(today) || f.date.startsWith(todayIso);
    }).length;
  }, [finds]);

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

      {/* TACTICAL TOP HUD (GO TERRAIN STYLE) */}
      {activeTab === "map" && (
        <TacticalTopHUD
          currentThemeKey={designTheme}
          onOpenMenu={() => setShowMenu(!showMenu)}
          onOpenThemePicker={() => setShowThemePicker(true)}
          onOpenTeamSession={() => setShowTeamSessionModal(true)}
          workspace={workspace}
          gpsAccuracy={gpsAccuracy}
          isOnline={isOnline}
          isRecordingSortie={isRecordingSortie}
          onToggleRecording={() => isRecordingSortie ? stopSortie() : startSortie(position)}
        />
      )}

      {/* SIDEBAR MENU */}
      <SidebarMenu
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        showForm={showForm}
        setShowForm={setShowForm}
        baseMap={baseMap}
        setBaseMap={setBaseMap}
        showCadastre={showCadastre}
        setShowCadastre={setShowCadastre}
        cadastreOpacity={cadastreOpacity}
        setCadastreOpacity={setCadastreOpacity}
        showCassini={showCassini}
        setShowCassini={setShowCassini}
        cassiniOpacity={cassiniOpacity}
        setCassiniOpacity={setCassiniOpacity}
        showEtatMajor={showEtatMajor}
        setShowEtatMajor={setShowEtatMajor}
        etatMajorOpacity={etatMajorOpacity}
        setEtatMajorOpacity={setEtatMajorOpacity}
        onOpenMapLayers={() => setShowMapLayersModal(true)}
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
        favoritesOnly={favoritesOnly}
        setFavoritesOnly={setFavoritesOnly}
        hideAllFinds={hideAllFinds}
        setHideAllFinds={setHideAllFinds}
        search={search}
        setSearch={setSearch}
        filters={filters}
        toggleFilter={toggleFilter}
        
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

      {/* TAB: GALERIE */}
      {activeTab === "gallery" && (
        <AlbumPanel
          finds={finds}
          allPhotos={allPhotos}
          isTab={true}
          onClose={() => setActiveTab("map")}
          theme={theme}
          onOpenCategoryManager={() => setShowCategoryManagerModal(true)}
          onOpenFindDetails={(find) => {
            setActiveTab("map");
            setZoomTarget({ position: find.position || [find.latitude, find.longitude], zoom: 17 });
            setOpenPopupFind(find);
          }}
        />
      )}

      {/* TAB: RAPPORTS */}
      {activeTab === "reports" && (
        <ReportsPanel
          finds={finds}
          savedTracks={savedTracks}
          exportData={handleExport}
          importData={handleImport}
          theme={theme}
          onOpenCategoryManager={() => setShowCategoryManagerModal(true)}
          setSelectedDate={(date) => {
            setSelectedDate(date);
            setZoomToDate(date);
            setActiveTab("map");
          }}
          onClose={() => setActiveTab("map")}
        />
      )}

      {/* TAB: RACCOURCIS */}
      {activeTab === "shortcuts" && (
        <ShortcutsPanel
          baseMap={baseMap}
          setBaseMap={setBaseMap}
          showCadastre={showCadastre}
          setShowCadastre={setShowCadastre}
          cadastreOpacity={cadastreOpacity}
          setCadastreOpacity={setCadastreOpacity}
          showCassini={showCassini}
          setShowCassini={setShowCassini}
          cassiniOpacity={cassiniOpacity}
          setCassiniOpacity={setCassiniOpacity}
          showEtatMajor={showEtatMajor}
          setShowEtatMajor={setShowEtatMajor}
          etatMajorOpacity={etatMajorOpacity}
          setEtatMajorOpacity={setEtatMajorOpacity}
          showHistoricalMap={showHistoricalMap}
          setShowHistoricalMap={setShowHistoricalMap}
          historicalMapOpacity={historicalMapOpacity}
          setHistoricalMapOpacity={setHistoricalMapOpacity}
          onOpenMapLayers={() => setShowMapLayersModal(true)}
          useClustering={useClustering}
          setUseClustering={setUseClustering}
          hideAllFinds={hideAllFinds}
          setHideAllFinds={setHideAllFinds}
          followGps={followGps}
          setFollowGps={setFollowGps}
          gpsStyle={gpsStyle}
          setGpsStyle={setGpsStyle}
          isRecordingSortie={isRecordingSortie}
          sortieDistance={sortieDistance}
          startSortie={startSortie}
          stopSortie={stopSortie}
          favoritesOnly={favoritesOnly}
          setFavoritesOnly={setFavoritesOnly}
          theme={theme}
          onOpenCategoryManager={() => setShowCategoryManagerModal(true)}
          onOpenMap={() => setActiveTab("map")}
        />
      )}

      {/* TAB: PARAMETRES */}
      {activeTab === "settings" && (
        <SettingsPanel
          theme={theme}
          setTheme={setTheme}
          baseMap={baseMap}
          setBaseMap={setBaseMap}
          mapStyle={mapStyle}
          setMapStyle={setMapStyle}
          onOpenMapLayers={() => setShowMapLayersModal(true)}
          onExportBackup={handleExport}
          onImportBackup={handleImport}
          currentThemeKey={designTheme}
          setDesignTheme={setDesignTheme}
          onOpenThemePicker={() => setShowThemePicker(true)}
          onOpenCategoryManager={() => setShowCategoryManagerModal(true)}
          onRestartOnboarding={() => setShowOnboarding(true)}
          workspace={workspace}
          setWorkspace={setWorkspace}
          onOpenTeamSession={() => setShowTeamSessionModal(true)}
        />
      )}

      {/* MAIN MAP */}
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
        baseMap={baseMap}
        mapStyle={mapStyle}
        showCadastre={showCadastre}
        cadastreOpacity={cadastreOpacity}
        showCassini={showCassini}
        showHistoricalMap={showHistoricalMap}
        cassiniOpacity={cassiniOpacity}
        historicalMapOpacity={historicalMapOpacity}
        showEtatMajor={showEtatMajor}
        etatMajorOpacity={etatMajorOpacity}
        onOpenMapLayers={() => setShowMapLayersModal(true)}
        positionedFinds={positionedFinds}
        selectedDateTracks={selectedDateTracks}
        handleMapLongPress={handleMapLongPress}
        deleteFind={deleteFind}
        handleFavorite={handleFavorite}
        loadFinds={loadFinds}
        workspace={workspace}
        setWorkspace={setWorkspace}
        onOpenTeamSession={() => setShowTeamSessionModal(true)}
        isRecordingSortie={isRecordingSortie}
        sortiePositions={sortiePositions}
        savedTracks={savedTracks}
      />

      {/* TACTICAL BOTTOM HUD (TELEMETRY & ACTIONS - MAP ONLY) */}
      {activeTab === "map" && (
        <TacticalBottomHUD
          currentThemeKey={designTheme}
          isRecordingSortie={isRecordingSortie}
          sortieDistance={sortieDistance}
          todayFindsCount={todayFindsCount}
          onStartSortie={() => startSortie(position)}
          onStopSortie={stopSortie}
          onAddFindClick={() => {
            setShowForm(true);
            setShowMenu(true);
          }}
          onOpenMapLayers={() => setShowMapLayersModal(true)}
          activeLayersCount={(showCadastre ? 1 : 0) + ((showCassini || showHistoricalMap) ? 1 : 0) + (showEtatMajor ? 1 : 0)}
          onToggleCassini={() => setShowHistoricalMap(!showHistoricalMap)}
          showCassini={showHistoricalMap || showCassini}
          onRecenterGps={() => {
            setFollowGps(true);
            setZoomTarget({ position: position, zoom: 17 });
            setToast({
              message: "🎯 Centrage et suivi GPS activés !",
              type: "success"
            });
          }}
          followGps={followGps}
        />
      )}

      {/* Hidden input for quick add */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={quickAddInputRef}
        style={{ display: "none" }}
        onChange={handleQuickAdd}
      />

      {/* Theme Picker Modal */}
      <ThemePickerModal
        isOpen={showThemePicker}
        onClose={() => setShowThemePicker(false)}
        currentThemeKey={designTheme}
        onSelectTheme={(newTh) => {
          setDesignTheme(newTh);
          setToast({
            message: `🎨 Palette "${THEMES[newTh]?.name || newTh}" activée !`,
            type: "success"
          });
        }}
      />

      {/* Map Layers & IGN Overlays Modal */}
      <MapLayersModal
        isOpen={showMapLayersModal}
        onClose={() => setShowMapLayersModal(false)}
        currentThemeKey={designTheme}
        baseMap={baseMap}
        setBaseMap={setBaseMap}
        showCadastre={showCadastre}
        setShowCadastre={setShowCadastre}
        cadastreOpacity={cadastreOpacity}
        setCadastreOpacity={setCadastreOpacity}
        showCassini={showCassini}
        setShowCassini={setShowCassini}
        cassiniOpacity={cassiniOpacity}
        setCassiniOpacity={setCassiniOpacity}
        showEtatMajor={showEtatMajor}
        setShowEtatMajor={setShowEtatMajor}
        etatMajorOpacity={etatMajorOpacity}
        setEtatMajorOpacity={setEtatMajorOpacity}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={showCategoryManagerModal}
        onClose={() => setShowCategoryManagerModal(false)}
        theme={theme}
      />

      {/* Team Session & Detector Code Modal */}
      <TeamSessionModal
        isOpen={showTeamSessionModal}
        onClose={() => setShowTeamSessionModal(false)}
        workspace={workspace}
        setWorkspace={setWorkspace}
        theme={theme}
      />
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

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} currentThemeKey={designTheme} />

      {/* Startup Onboarding Wizard (First Launch: Auth -> Official Legal & Ethical Charter -> Pre-Customization) */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={({ defaultMapStyle, designTheme: newDesignTheme, theme: newTheme, gpsStyle: newGpsStyle }) => {
          setShowOnboarding(false);
          if (defaultMapStyle) setMapStyle(defaultMapStyle);
          if (newDesignTheme) setDesignTheme(newDesignTheme);
          if (newTheme) setTheme(newTheme);
          if (newGpsStyle) setGpsStyle(newGpsStyle);
        }}
      />
    </div>
  );
}

export default App;
