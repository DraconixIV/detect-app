import { useEffect, useState, useRef, useMemo } from "react";
import { categoryEmojis } from "./subCategories";

import LoadingScreen from "./components/LoadingScreen";
import StatsPanel from "./components/StatsPanel";
import CropperModal from "./components/CropperModal";
import ToastNotification from "./components/ToastNotification";
import ConfirmModal from "./components/ConfirmModal";
import AlbumPanel from "./components/AlbumPanel";
import MainMap from "./components/MainMap";
import MapTopBar from "./components/MapTopBar";
import MapFloatingControls from "./components/MapFloatingControls";
import SortieLiveWidget from "./components/SortieLiveWidget";
import AddFindModal from "./components/AddFindModal";
import OutingWidget from "./components/OutingWidget";
import BottomNav from "./components/BottomNav";
import OnboardingModal from "./components/OnboardingModal";
import ReportsPanel from "./components/ReportsPanel";
import SettingsPanel from "./components/SettingsPanel";
import CategoryManagerModal from "./components/CategoryManagerModal";
import TeamSessionModal from "./components/TeamSessionModal";
import ConsultationRequestModal from "./components/ConsultationRequestModal";
import MapLayersModal from "./components/MapLayersModal";
import SplashScreen from "./components/SplashScreen";
import AppDrawer from "./components/AppDrawer";
import NewsModal from "./components/NewsModal";
import AboutModal from "./components/AboutModal";
import { THEMES } from "./styles/themes";

import { icons } from "./icons";
import { supabase, initAnonymousAuth } from "./supabase";

import useSupabaseSync from "./hooks/useSupabaseSync";
import useTeamPresence from "./hooks/useTeamPresence";
import useConsultationRequests from "./hooks/useConsultationRequests";
import useSortieRecorder from "./hooks/useSortieRecorder";
import { addPendingFind, deletePendingFind } from "./services/offlineStore";
import { importData, exportData } from "./services/backupService";
import { addFind as createFind, toggleFavorite, normalizeDateStr, isFindInSortie } from "./services/findsService";
import { getActiveSession, leaveTeamSession } from "./services/sessionService";
import { loadCategoriesData } from "./services/categoriesService";

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
    return [43.273, 3.173]; // Position par défaut
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

  useEffect(() => {
    initAnonymousAuth();
  }, []);

  const [categoriesData, setCategoriesData] = useState(() => loadCategoriesData());

  useEffect(() => {
    const handleCategoriesUpdate = () => {
      setCategoriesData(loadCategoriesData());
    };
    window.addEventListener("categories-updated", handleCategoriesUpdate);
    return () => window.removeEventListener("categories-updated", handleCategoriesUpdate);
  }, []);

  const [filters, setFilters] = useState(() => {
    try {
      const data = loadCategoriesData();
      return Object.keys(data.categories || {});
    } catch {
      return [
        "Monnaie", "Bijou", "Boucle", "Bouton", "Médaille",
        "Munition", "Outil", "Plomb", "Religieux", "Autre"
      ];
    }
  });

  const [newTitle, setNewTitle] =
    useState("");

  const [
    newDescription,
    setNewDescription
  ] = useState("Indéterminé");

  const [
    newCategory,
    setNewCategory
  ] = useState(() => Object.keys(loadCategoriesData().categories || {})[0] || "");

  const [
    newSubCategory,
    setNewSubCategory
  ] = useState("");

  const [newPhoto, setNewPhoto] =
    useState(null);

  const [newAudio, setNewAudio] =
    useState(null);

  const [newAudioDuration, setNewAudioDuration] =
    useState(null);

  const [newVideo, setNewVideo] =
    useState(null);

  const [showDrawer, setShowDrawer] =
    useState(false);

  const [showNewsModal, setShowNewsModal] =
    useState(false);

  const [showAboutModal, setShowAboutModal] =
    useState(false);

  const [markerSize, setMarkerSize] =
    useState(() => localStorage.getItem("marker_size") || "medium");

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
    setFinds,
    allPhotos,
    isOnline,
    syncing,
    loadFinds,
    syncOfflineFinds,
    loadPhotosForAlbum
  } = useSupabaseSync(setToast, workspace);

  const {
    teammates,
    broadcastFind,
    broadcastDeleteFind,
    isHost,
    isLocked,
    bannedList,
    kickTeammate,
    banTeammate,
    unbanTeammate,
    toggleSessionLock
  } = useTeamPresence(workspace, position, setToast, setWorkspace);

  const {
    incomingRequest,
    activeViewers,
    approveRequest,
    rejectRequest,
    revokeViewerAccess,
    requestMapConsultation
  } = useConsultationRequests(workspace, setWorkspace, setToast);

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

  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("geoprospect_splash_seen");
  });
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem("geoprospect_onboarding_completed_v3") !== "true" && localStorage.getItem("rdl_onboarding_completed_v3") !== "true";
  });
  const [activeTab, setActiveTab] = useState("map");
  const [theme, setTheme] = useState(() => localStorage.getItem("app_theme") || "dark");
  const [designTheme, setDesignTheme] = useState(() => localStorage.getItem("app_design_theme") || "tactical");
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
  const [useClustering, setUseClustering] = useState(() => {
    return localStorage.getItem("useClustering") === "true";
  });

  useEffect(() => {
    localStorage.setItem("useClustering", useClustering);
  }, [useClustering]);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [subCategorySelectCat, setSubCategorySelectCat] = useState(null);
  const [subCatModalStep, setSubCatModalStep] = useState(1);
  const [gpsStyle, setGpsStyle] = useState(() => localStorage.getItem("gpsStyle") || "blue-dot");
  const [zenMode, setZenMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const hasAutoCenteredRef = useRef(false);
  const gpsWatchIdRef = useRef(null);

  // Core Geolocation Engine: Force a fresh satellite hardware read & center map
  const requestFreshGpsFix = (shouldCenter = false, showFeedback = false) => {
    if (!("geolocation" in navigator)) {
      if (showFeedback) {
        setToast({
          message: "⚠️ Géolocalisation non prise en charge par ce navigateur.",
          type: "error"
        });
      }
      return;
    }

    setIsLocatingGps(true);

    const handleSuccess = (pos) => {
      const freshPos = [pos.coords.latitude, pos.coords.longitude];
      const accuracy = pos.coords.accuracy;

      setPosition(freshPos);
      localStorage.setItem("lastKnownPosition", JSON.stringify(freshPos));
      setGpsAccuracy(accuracy);
      setIsLocatingGps(false);

      if (shouldCenter || !hasAutoCenteredRef.current) {
        hasAutoCenteredRef.current = true;
        setZoomTarget({ position: freshPos, zoom: 17 });
        setFollowGps(true);
      }

      if (showFeedback) {
        const accText = accuracy ? ` (±${Math.round(accuracy)}m)` : "";
        setToast({
          message: `🎯 Position GPS actualisée${accText} !`,
          type: "success"
        });
      }
    };

    const handleHighAccuracyError = (err) => {
      console.warn("High-accuracy GPS failed, trying standard accuracy fallback:", err.message);
      // Fallback for indoor / campus locations with low satellite signal
      navigator.geolocation.getCurrentPosition(
        (fallbackPos) => {
          handleSuccess(fallbackPos);
        },
        (finalErr) => {
          setIsLocatingGps(false);
          console.warn("GPS Geolocation Error:", finalErr);
          if (showFeedback) {
            if (finalErr.code === 1) {
              setToast({
                message: "⚠️ Accès GPS refusé. Veuillez autoriser la localisation dans les paramètres.",
                type: "error"
              });
            } else {
              setToast({
                message: "⚠️ Signal GPS indisponible. Vérifiez que la localisation est activée.",
                type: "error"
              });
            }
          }
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 10000 }
      );
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleHighAccuracyError,
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 5000 }
    );
  };

  // Continuous background GPS satellite watcher
  const startContinuousGpsWatch = () => {
    if (!("geolocation" in navigator) || gpsWatchIdRef.current) return;

    gpsWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const livePos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(livePos);
        localStorage.setItem("lastKnownPosition", JSON.stringify(livePos));
        setGpsAccuracy(pos.coords.accuracy);

        // Smoothly auto-center map when the first fresh satellite fix arrives on launch
        if (!hasAutoCenteredRef.current) {
          hasAutoCenteredRef.current = true;
          setZoomTarget({ position: livePos, zoom: 17 });
          setFollowGps(true);
        }

        if (isRecordingRef.current) {
          recordNewPosition(livePos, pos.coords.accuracy);
        }
      },
      (err) => {
        console.warn("GPS Watch Warning:", err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
  };

  // Initialize GPS immediately on startup and whenever the user returns to the app
  useEffect(() => {
    // 1. Immediate fresh fix & initial map auto-center
    requestFreshGpsFix(true, false);

    // 2. Start continuous satellite watch
    startContinuousGpsWatch();

    // 3. Auto-refresh when app resumes from background or screen unlock
    const handleAppResume = () => {
      if (document.visibilityState === "visible") {
        requestFreshGpsFix(false, false);
      }
    };

    document.addEventListener("visibilitychange", handleAppResume);
    window.addEventListener("focus", handleAppResume);

    return () => {
      if (gpsWatchIdRef.current) {
        navigator.geolocation.clearWatch(gpsWatchIdRef.current);
        gpsWatchIdRef.current = null;
      }
      document.removeEventListener("visibilitychange", handleAppResume);
      window.removeEventListener("focus", handleAppResume);
    };
  }, []);

  useEffect(() => {
    if (activeTab === "gallery" || showAlbum) {
      loadPhotosForAlbum();
    }
  }, [activeTab, showAlbum]);

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
    requestFreshGpsFix(true, false);
    startContinuousGpsWatch();
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
      setFilters(Object.keys(categoriesData.categories || icons));
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
    let finalPosition = null;

    if (quickParams && quickParams.newTitle !== undefined) {
      finalPosition = quickParams.position || position;
    } else if (customLat && customLng) {
      finalPosition = [Number(customLat), Number(customLng)];
    } else {
      finalPosition = position;
    }

    if (!finalPosition) {
      try {
        const cached = localStorage.getItem("lastKnownPosition");
        if (cached) {
          finalPosition = JSON.parse(cached);
        }
      } catch (e) {
        // ignore
      }
    }

    if (!finalPosition) {
      alert("Position GPS non détectée. Veuillez autoriser la localisation ou saisir les coordonnées.");
      return;
    }

    if (addingFind) return;
    setAddingFind(true);

    const titleVal = (quickParams && quickParams.newTitle) ? quickParams.newTitle : newTitle;
    const descVal = (quickParams && quickParams.newDescription !== undefined) ? quickParams.newDescription : newDescription;
    const catVal = (quickParams && quickParams.newCategory) ? quickParams.newCategory : newCategory;
    const subCatVal = (quickParams && quickParams.newSubCategory !== undefined) ? quickParams.newSubCategory : newSubCategory;
    const photoVal = (quickParams && quickParams.newPhoto) ? quickParams.newPhoto : newPhoto;
    const dateVal = (quickParams && quickParams.customDate) ? quickParams.customDate : (customDate || null);
    const audioVal = (quickParams && quickParams.audio !== undefined) ? quickParams.audio : ((quickParams && quickParams.newTitle) ? null : newAudio);
    const audioDurationVal = (quickParams && quickParams.audioDuration !== undefined) ? quickParams.audioDuration : ((quickParams && quickParams.newTitle) ? null : newAudioDuration);
    const videoVal = (quickParams && quickParams.video !== undefined) ? quickParams.video : ((quickParams && quickParams.newTitle) ? null : newVideo);

    const currentSessionCode = workspace.mode === "session" ? workspace.targetCode : null;

    try {
      if (!isOnline) {
        await addPendingFind({
          position: finalPosition,
          newTitle: titleVal,
          newDescription: descVal,
          newCategory: catVal,
          newSubCategory: subCatVal,
          customDate: dateVal,
          audio: audioVal,
          audioDuration: audioDurationVal,
          video: videoVal,
          sessionCode: currentSessionCode
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
          audio: audioVal,
          audioDuration: audioDurationVal,
          video: videoVal,
          sessionCode: currentSessionCode
        });

        if (workspace.mode === "session" && broadcastFind) {
          broadcastFind({
            title: titleVal,
            description: descVal,
            category: catVal,
            sub_category: subCatVal,
            position: finalPosition,
            latitude: finalPosition[0],
            longitude: finalPosition[1],
            date: dateVal || new Date().toLocaleString()
          });
        }
      }

      const firstAvailableCat = Object.keys(loadCategoriesData().categories || {})[0] || "";
      setCustomDate("");
      setCustomLat("");
      setCustomLng("");
      setShowForm(false);
      setNewTitle("");
      setNewDescription("Indéterminé");
      setNewCategory(firstAvailableCat);
      setNewSubCategory("");
      setNewPhoto(null);
      setNewAudio(null);
      setNewAudioDuration(null);
      setNewVideo(null);

      await loadFinds();
      if (quickParams && quickParams.newTitle) {
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
          customDate: dateVal,
          audio: audioVal,
          audioDuration: audioDurationVal,
          video: videoVal,
          sessionCode: currentSessionCode
        }, photoVal);

        alert("⚠️ Connexion instable. Votre trouvaille a été sauvegardée localement (Hors-ligne) ! 💾");

        const firstAvailableCat = Object.keys(loadCategoriesData().categories || {})[0] || "";
        setCustomDate("");
        setCustomLat("");
        setCustomLng("");
        setShowForm(false);
        setNewTitle("");
        setNewDescription("Indéterminé");
        setNewCategory(firstAvailableCat);
        setNewSubCategory("");
        setNewPhoto(null);
        setNewAudio(null);
        setNewAudioDuration(null);
        setNewVideo(null);

        await loadFinds();
      } catch (fallbackError) {
        alert("Erreur critique d'enregistrement : " + (fallbackError?.message || fallbackError || "Inconnu"));
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

  const handleFavorite = async (find, explicitTargetVal = null) => {
    const targetVal = typeof explicitTargetVal === "boolean"
      ? explicitTargetVal
      : !find.favorite;

    // Mutate find object reference immediately
    find.favorite = targetVal;

    // Optimistic UI update
    setFinds((prev) =>
      prev.map((f) => (f.id === find.id ? { ...f, favorite: targetVal } : f))
    );
    if (openPopupFind && openPopupFind.id === find.id) {
      setOpenPopupFind((prev) => ({ ...prev, favorite: targetVal }));
    }

    const success = await toggleFavorite(find.id, targetVal);
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

    if (broadcastDeleteFind) {
      broadcastDeleteFind(findId);
    }

    await loadFinds();
  };

  const filteredFinds = useMemo(() => {
    // Single category filter is only active when user explicitly clicks a category chip (filters.length === 1)
    const isSingleCatFilter = Array.isArray(filters) && filters.length === 1;
    const singleCatName = isSingleCatFilter ? filters[0].trim().toLowerCase() : null;

    return finds.filter((find) => {
      if (favoritesOnly && !find.favorite) {
        return false;
      }

      const findCat = (find.category || "Autre").trim().toLowerCase();
      const matchesCategory = !isSingleCatFilter || findCat === singleCatName;

      const matchesSubCategory =
        !activeSubCategory ||
        (find.sub_category || "").trim().toLowerCase() === activeSubCategory.trim().toLowerCase();

      const matchesSearch =
        !search ||
        find.title?.toLowerCase().includes(search.toLowerCase()) ||
        find.description?.toLowerCase().includes(search.toLowerCase()) ||
        find.category?.toLowerCase().includes(search.toLowerCase()) ||
        find.sub_category?.toLowerCase().includes(search.toLowerCase()) ||
        find.date?.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSubCategory && matchesSearch;
    });
  }, [finds, filters, activeSubCategory, search, favoritesOnly]);

  const positionedFinds = useMemo(() => {
    if (hideAllFinds || filteredFinds.length === 0) return [];
    
    // Ensure all valid finds have a valid numeric [lat, lng]
    const validFinds = filteredFinds.filter((find) => {
      const lat = find.latitude ?? (Array.isArray(find.position) ? find.position[0] : null);
      const lng = find.longitude ?? (Array.isArray(find.position) ? find.position[1] : null);
      return lat !== null && lng !== null && !isNaN(Number(lat)) && !isNaN(Number(lng));
    }).map((find) => {
      const lat = Number(find.latitude ?? find.position[0]);
      const lng = Number(find.longitude ?? find.position[1]);
      return {
        ...find,
        position: [lat, lng]
      };
    });

    const groups = [];
    validFinds.forEach((find) => {
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
      return isFindInSortie(track, selectedDate);
    });
  }, [selectedDate, savedTracks]);

  const selectedSortieFindsCount = useMemo(() => {
    if (!selectedDate) return 0;
    return finds.filter((f) => isFindInSortie(f, selectedDate)).length;
  }, [selectedDate, finds]);

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

  useEffect(() => {
    if (zoomToDate) {
      const match = finds.find((f) => isFindInSortie(f, zoomToDate));
      if (match) {
        const lat = match.latitude ?? (Array.isArray(match.position) ? match.position[0] : null);
        const lng = match.longitude ?? (Array.isArray(match.position) ? match.position[1] : null);
        if (lat !== null && lng !== null) {
          setFollowGps(false);
          setZoomTarget({ position: [Number(lat), Number(lng)], zoom: 17 });
        }
      } else {
        const trackMatch = savedTracks.find((t) => isFindInSortie(t, zoomToDate));
        if (trackMatch && trackMatch.positions && trackMatch.positions.length > 0) {
          setFollowGps(false);
          setZoomTarget({ position: trackMatch.positions[0], zoom: 17 });
        }
      }
    }
  }, [zoomToDate, finds, savedTracks]);

  if (!position) {
    return <LoadingScreen />;
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100%"
      }}
    >
      {/* FLOATING SORTIE HIGHLIGHT BANNER */}
      {selectedDate && (
        <div
          style={{
            position: "fixed",
            top: "calc(env(safe-area-inset-top, 0px) + 68px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 4900,
            background: "rgba(15, 23, 42, 0.94)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            color: "#ffffff",
            padding: "8px 14px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.45)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "13px",
            fontWeight: "700",
            border: "1.5px solid rgba(250, 204, 21, 0.6)",
            maxWidth: "460px",
            width: "calc(100% - 28px)",
            boxSizing: "border-box"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <span style={{ fontSize: "16px", flexShrink: 0 }}>✨</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "13px", fontWeight: "800", color: "#fef08a" }}>
                Sortie du {normalizeDateStr(selectedDate)}
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>
                {selectedSortieFindsCount > 0 ? (
                  <>🪙 <strong style={{ color: "#facc15" }}>{selectedSortieFindsCount}</strong> trouvaille{selectedSortieFindsCount > 1 ? "s" : ""} en surbrillance</>
                ) : (
                  <>Tracé GPS de la sortie affiché</>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedDate(null);
              setZoomToDate(null);
            }}
            title="Quitter le mode sortie"
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#f87171",
              borderRadius: "8px",
              padding: "5px 9px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "800",
              flexShrink: 0,
              transition: "0.2s"
            }}
          >
            <span>✕</span>
            <span>Fermer</span>
          </button>
        </div>
      )}

      {/* MAP TOP BAR (GLASSMORPHISM & TELEMETRY) */}
      {activeTab === "map" && (
        <MapTopBar
          currentThemeKey={designTheme}
          themeMode={theme}
          workspace={workspace}
          gpsAccuracy={gpsAccuracy}
          isOnline={isOnline}
          isRecordingSortie={isRecordingSortie}
          onToggleRecording={() => isRecordingSortie ? stopSortie() : startSortie(position)}
          onOpenTeamSession={() => setShowTeamSessionModal(true)}
          onOpenDrawer={() => setShowDrawer(true)}
          onToggleSearch={() => setShowSearch(!showSearch)}
          showSearch={showSearch}
          search={search}
          setSearch={setSearch}
          filters={filters}
          toggleFilter={toggleFilter}
          finds={finds}
          onSelectFind={(find) => {
            const lat = find.latitude ?? (Array.isArray(find.position) ? find.position[0] : find.position?.lat);
            const lng = find.longitude ?? (Array.isArray(find.position) ? find.position[1] : find.position?.lng);
            if (lat && lng) {
              setFollowGps(false);
              setZoomTarget({ position: [Number(lat), Number(lng)], zoom: 18 });
              setOpenPopupFind(find);
            }
            setShowSearch(false);
          }}
          onSelectPlace={(place) => {
            if (place.lat && place.lon) {
              setFollowGps(false);
              setZoomTarget({ position: [Number(place.lat), Number(place.lon)], zoom: 15 });
            }
            setShowSearch(false);
          }}
          zenMode={zenMode}
        />
      )}

      {/* TAB: TROUVAILLES (GALERIE & ALBUM) */}
      {activeTab === "gallery" && (
        <AlbumPanel
          finds={finds}
          allPhotos={allPhotos}
          loadPhotosForAlbum={loadPhotosForAlbum}
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

      {/* TAB: JOURNAL & RAPPORTS */}
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

      {/* TAB: PARAMÈTRES & ÉQUIPE */}
      {activeTab === "settings" && (
        <SettingsPanel
          theme={theme}
          setTheme={setTheme}
          onExportBackup={handleExport}
          onImportBackup={handleImport}
          onOpenCategoryManager={() => setShowCategoryManagerModal(true)}
          onRestartOnboarding={() => setShowOnboarding(true)}
          workspace={workspace}
          setWorkspace={setWorkspace}
          onOpenTeamSession={() => setShowTeamSessionModal(true)}
          markerSize={markerSize}
          setMarkerSize={setMarkerSize}
        />
      )}

      {/* MAIN MAP (100% IMMERSIVE VIEWPORT) */}
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
        selectedDate={selectedDate}
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
        markerSize={markerSize}
        teammates={teammates}
      />

      {/* FLOATING RIGHT-SIDE CONTROLS (GPS RECENTER, LAYERS & ZEN MODE) */}
      {activeTab === "map" && (
        <MapFloatingControls
          onRecenterGps={() => {
            requestFreshGpsFix(true, true);
          }}
          followGps={followGps}
          isLocatingGps={isLocatingGps}
          gpsAccuracy={gpsAccuracy}
          onOpenMapLayers={() => setShowMapLayersModal(true)}
          activeLayersCount={(showCadastre ? 1 : 0) + ((showCassini || showHistoricalMap) ? 1 : 0) + (showEtatMajor ? 1 : 0)}
          zenMode={zenMode}
          setZenMode={setZenMode}
          hideAllFinds={hideAllFinds}
          setHideAllFinds={setHideAllFinds}
          useClustering={useClustering}
          setUseClustering={setUseClustering}
          onAddFindClick={() => setShowForm(true)}
        />
      )}

      {/* FLOATING SORTIE TELEMETRY WIDGET */}
      {activeTab === "map" && (
        <SortieLiveWidget
          isRecordingSortie={isRecordingSortie}
          sortieDistance={sortieDistance}
          todayFindsCount={todayFindsCount}
          onStopSortie={stopSortie}
          zenMode={zenMode}
        />
      )}

      {/* ADD FIND BOTTOM SHEET MODAL */}
      <AddFindModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
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
        newAudio={newAudio}
        setNewAudio={setNewAudio}
        newAudioDuration={newAudioDuration}
        setNewAudioDuration={setNewAudioDuration}
        newVideo={newVideo}
        setNewVideo={setNewVideo}
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
        teammates={teammates}
        isHost={isHost}
        isLocked={isLocked}
        bannedList={bannedList}
        kickTeammate={kickTeammate}
        banTeammate={banTeammate}
        unbanTeammate={unbanTeammate}
        toggleSessionLock={toggleSessionLock}
        requestMapConsultation={requestMapConsultation}
        activeViewers={activeViewers}
        revokeViewerAccess={revokeViewerAccess}
      />

      {/* Real-time incoming map consultation permission request modal */}
      <ConsultationRequestModal
        request={incomingRequest}
        onApprove={approveRequest}
        onReject={rejectRequest}
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

      {/* App Drawer */}
      <AppDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        theme={theme}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setShowDrawer(false);
        }}
        onOpenNews={() => {
          setShowNewsModal(true);
          setShowDrawer(false);
        }}
        onOpenAbout={() => {
          setShowAboutModal(true);
          setShowDrawer(false);
        }}
        onOpenTeamSession={() => {
          setShowTeamSessionModal(true);
          setShowDrawer(false);
        }}
        onOpenCategoryManager={() => {
          setShowCategoryManagerModal(true);
          setShowDrawer(false);
        }}
        onOpenMapLayers={() => {
          setShowMapLayersModal(true);
          setShowDrawer(false);
        }}
        onExportBackup={handleExport}
        onImportBackup={handleImport}
        totalFindsCount={finds.length}
        isOnline={isOnline}
      />

      {/* News & Tips Modal */}
      <NewsModal
        isOpen={showNewsModal}
        onClose={() => setShowNewsModal(false)}
        theme={theme}
      />

      {/* About GeoProspect Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        theme={theme}
      />

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} currentThemeKey={designTheme} zenMode={zenMode} />

      {/* Startup Onboarding Wizard (First Launch: Feature Discovery -> Official Legal & Ethical Charter -> Auth -> Pre-Customization -> Creator Note) */}
      <OnboardingModal
        isOpen={showOnboarding}
        currentTheme={theme}
        onLiveThemeChange={(newTheme) => {
          if (newTheme) setTheme(newTheme);
        }}
        onComplete={({ defaultMapStyle, designTheme: newDesignTheme, theme: newTheme, gpsStyle: newGpsStyle }) => {
          setShowOnboarding(false);
          if (defaultMapStyle) setMapStyle(defaultMapStyle);
          if (newDesignTheme) setDesignTheme(newDesignTheme);
          if (newTheme) setTheme(newTheme);
          if (newGpsStyle) setGpsStyle(newGpsStyle);
        }}
      />

      {/* Animated Luminous White Splash Screen */}
      {showSplash && (
        <SplashScreen
          onFinish={() => {
            setShowSplash(false);
            sessionStorage.setItem("geoprospect_splash_seen", "true");
          }}
          duration={2200}
        />
      )}
    </div>
  );
}

export default App;
