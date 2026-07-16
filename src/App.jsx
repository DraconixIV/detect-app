import { useEffect, useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { categoryEmojis } from "./subCategories";

// Build refresh June 2026

import {
  MapContainer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { supabase } from "./supabase";

import FindPopup from "./components/FindPopup";
import AddFindForm from "./components/AddFindForm";

import LoadingScreen from "./components/LoadingScreen";
import GpsMarker from "./components/GpsMarker";
import MapLayers from "./components/MapLayers";
import StatsPanel from "./components/StatsPanel";
import PerformancePanel from "./components/PerformancePanel";
import CropperModal from "./components/CropperModal";
import ToastNotification from "./components/ToastNotification";
import ConfirmModal from "./components/ConfirmModal";
import MarkerClusterGroup from "react-leaflet-cluster";

import { icons } from "./icons";

const createClusterCustomIcon = (cluster) => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        border: 3px solid white;
        border-radius: 50%;
        color: white;
        font-weight: 800;
        font-size: 15px;
        font-family: system-ui, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
      ">
        ${count}
      </div>
    `,
    className: "custom-cluster-marker",
    iconSize: L.point(40, 40, true),
    iconAnchor: L.point(20, 20, true)
  });
};

import {
  loadFinds as fetchFinds,
  addFind as createFind,
  toggleFavorite
} from "./services/findsService";

import {
  exportData,
  importData
} from "./services/backupService";

import {
  addPendingFind,
  getPendingFinds,
  deletePendingFind
} from "./services/offlineStore";

import {
  loadTracks,
  saveTrack
} from "./services/tracksService";


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

function distanceBetween(
  point1,
  point2
) {
  const R = 6371000;

  const lat1 =
    (point1[0] * Math.PI) /
    180;

  const lat2 =
    (point2[0] * Math.PI) /
    180;

  const deltaLat =
    ((point2[0] -
      point1[0]) *
      Math.PI) /
    180;

  const deltaLng =
    ((point2[1] -
      point1[1]) *
      Math.PI) /
    180;

  const a =
    Math.sin(deltaLat / 2) *
      Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

function RecenterMap({
  target,
  onRecentered
}) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.setView(target.position, target.zoom || 20);
      if (onRecentered) {
        onRecentered();
      }
    }
  }, [target, map, onRecentered]);

  return null;
}

function MapEventsHandler({ onLongPress, onMapDrag }) {
  const map = useMap();

  useEffect(() => {
    const handleContextMenu = (e) => {
      if (onLongPress) {
        onLongPress(e.latlng);
      }
    };

    const handleDragStart = () => {
      if (onMapDrag) {
        onMapDrag();
      }
    };

    map.on("contextmenu", handleContextMenu);
    map.on("dragstart", handleDragStart);

    return () => {
      map.off("contextmenu", handleContextMenu);
      map.off("dragstart", handleDragStart);
    };
  }, [map, onLongPress, onMapDrag]);

  return null;
}

function GpsFollower({ position, followGps }) {
  const map = useMap();

  useEffect(() => {
    if (position && followGps) {
      map.setView(position, map.getZoom());
    }
  }, [position, followGps, map]);

  return null;
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

  const [finds, setFinds] =
    useState([]);

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

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [isRecordingSortie, setIsRecordingSortie] = useState(false);
  const [sortieDistance, setSortieDistance] = useState(0);
  const [sortiePositions, setSortiePositions] = useState([]);
  const [savedTracks, setSavedTracks] = useState([]);
  const [showAlbum, setShowAlbum] = useState(false);
  const [albumFilter, setAlbumFilter] = useState("Tous");
  const [allPhotos, setAllPhotos] = useState([]);
  const [selectedAlbumPhoto, setSelectedAlbumPhoto] = useState(null);
  const [albumSearch, setAlbumSearch] = useState("");
  const [albumSort, setAlbumSort] = useState("recent");
  const [lightboxCoinFlipped, setLightboxCoinFlipped] = useState(false);
  const [toast, setToast] = useState(null);
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
  const [startupLocationLoading, setStartupLocationLoading] = useState(false);
  const [startupLocationError, setStartupLocationError] = useState("");
  const [startupLocationWarning, setStartupLocationWarning] = useState(false);
  const [tempPosition, setTempPosition] = useState(null);

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
          setSortiePositions((prev) => {
            const next = [...prev, newPosition];
            if (prev.length > 0) {
              const last = prev[prev.length - 1];
              const d = distanceBetween(last, newPosition);
              setSortieDistance((dist) => dist + d);
            }
            return next;
          });
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

  const handleRequestLocation = () => {
    setStartupLocationLoading(true);
    setStartupLocationError("");
    setStartupLocationWarning(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStartupLocationLoading(false);
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setTempPosition(newPos);
        setGpsAccuracy(pos.coords.accuracy);

        if (pos.coords.accuracy > 150) {
          setStartupLocationWarning(true);
        } else {
          setFollowGps(true);
          startGpsTracking(newPos);
          setZoomTarget({ position: newPos, zoom: 18 });
          setShowStartupLocationScreen(false);
          setToast({ message: "🎯 GPS activé avec précision !", type: "success" });
        }
      },
      (err) => {
        setStartupLocationLoading(false);
        console.error("GPS startup request error:", err);
        setStartupLocationError(
          "Impossible d'accéder au GPS. Veuillez autoriser la localisation dans vos paramètres ou basculer en mode Consultation."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleAcceptPoorLocation = () => {
    if (tempPosition) {
      setFollowGps(true);
      startGpsTracking(tempPosition);
      setZoomTarget({ position: tempPosition, zoom: 18 });
      setShowStartupLocationScreen(false);
      setToast({ message: "🎯 Localisation activée (précision réduite).", type: "info" });
    }
  };

  const handleRejectPoorLocation = () => {
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
  };

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

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineFinds();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial outings list load
    const loadSavedTracksList = async () => {
      const tracks = await loadTracks();
      setSavedTracks(tracks || []);
    };
    loadSavedTracksList();

    if (navigator.onLine) {
      syncOfflineFinds();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const startSortie = () => {
    setIsRecordingSortie(true);
    setSortieDistance(0);
    setSortiePositions(position ? [position] : []);
    alert("⏱️ Sortie démarrée ! Les déplacements GPS accumuleront la distance marchée en arrière-plan.");
  };

  const submitOutingName = async () => {
    const name = outingNameInput.trim() || `Sortie du ${new Date().toLocaleDateString("fr-FR")}`;
    setShowOutingNameModal(false);

    const success = await saveTrack(tempSortiePositions, name);
    if (success) {
      const tracks = await loadTracks();
      setSavedTracks(tracks || []);
    }
    setTempSortiePositions([]);
  };

  const stopSortie = async () => {
    if (sortiePositions.length < 2 || sortieDistance === 0) {
      setConfirmConfig({
        message: "Pas assez de déplacements enregistrés. Annuler la sortie ?",
        onConfirm: () => {
          setIsRecordingSortie(false);
          setSortiePositions([]);
          setSortieDistance(0);
        }
      });
      return;
    }

    setTempSortiePositions(sortiePositions);
    setOutingNameInput(`Sortie du ${new Date().toLocaleDateString("fr-FR")}`);
    setIsRecordingSortie(false);
    setSortiePositions([]);
    setSortieDistance(0);
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
    loadFinds();

    const channel = supabase
      .channel("realtime-finds-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "finds" },
        () => {
          loadFinds();
        }
      )
      .subscribe();

    return () => {
      if (gpsWatchIdRef.current) {
        navigator.geolocation.clearWatch(gpsWatchIdRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, []);

  const syncOfflineFinds = async () => {
    try {
      const offlineFinds = await getPendingFinds();
      if (offlineFinds.length === 0) return;

      setSyncing(true);
      let syncedCount = 0;
      let failedCount = 0;

      for (const f of offlineFinds) {
        try {
          await createFind({
            position: f.position,
            newTitle: f.newTitle,
            newDescription: f.newDescription,
            newCategory: f.newCategory,
            newSubCategory: f.newSubCategory,
            newPhoto: f.photo,
            customDate: f.customDate
          });
          await deletePendingFind(f.id);
          syncedCount++;
        } catch (singleErr) {
          console.error(`Failed to sync find id ${f.id}:`, singleErr);
          failedCount++;
        }
      }

      if (syncedCount > 0) {
        alert(`Synchronisation : ${syncedCount} trouvaille(s) transférée(s) avec succès ! 🔄${failedCount > 0 ? ` (${failedCount} échecs)` : ""}`);
        await loadFinds();
      } else if (failedCount > 0) {
        alert(`⚠️ Échec de la synchronisation pour ${failedCount} trouvaille(s). Veuillez vérifier votre connexion.`);
      }
    } catch (err) {
      console.error("Synchro error:", err);
    } finally {
      setSyncing(false);
    }
  };

  const loadFinds = async () => {
    const data = await fetchFinds();

    // Charger également toutes les photos de Supabase pour l'Album
    const { data: photoData } = await supabase
      .from("find_photos")
      .select("*")
      .order("id", { ascending: true });
    if (photoData) {
      setAllPhotos(photoData);
    }

    try {
      const offlineFinds = await getPendingFinds();
      const formattedOffline = offlineFinds.map((f) => ({
        id: `offline-${f.id}`,
        title: f.newTitle,
        description: f.newDescription,
        category: f.newCategory,
        sub_category: f.newSubCategory,
        latitude: f.position[0],
        longitude: f.position[1],
        position: f.position,
        date: f.customDate || f.createdAt,
        isOfflinePending: true,
        offlinePhoto: f.photo ? URL.createObjectURL(f.photo) : null
      }));
      setFinds([...formattedOffline, ...(data || [])]);
    } catch (e) {
      console.error(e);
      setFinds(data || []);
    }
  };

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
  const albumFilteredFinds = useMemo(() => {
    // 1. Filter by category & check that photo exists with a valid URL
    let list = finds.filter((f) => {
      // Category match (case-insensitive)
      const catMatch = albumFilter === "Tous" || 
        (f.category && f.category.toLowerCase() === albumFilter.toLowerCase());
      if (!catMatch) return false;

      // Photo match
      const photoUrl = f.isOfflinePending
        ? f.offlinePhoto
        : allPhotos.find((p) => p.find_id === f.id)?.image_url;

      return !!photoUrl;
    });

    // 2. Filter by search term
    if (albumSearch.trim() !== "") {
      const q = albumSearch.toLowerCase();
      list = list.filter((f) => 
        (f.title && f.title.toLowerCase().includes(q)) ||
        (f.description && f.description.toLowerCase().includes(q)) ||
        (f.sub_category && f.sub_category.toLowerCase().includes(q))
      );
    }

    // 3. Sort
    list.sort((a, b) => {
      if (albumSort === "fav") {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;
      }
      
      const parseDate = (dStr) => {
        if (!dStr) return new Date(0);
        const clean = dStr.split(",")[0].split(" ")[0].trim();
        const parts = clean.split("/");
        if (parts.length === 3) {
          return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        return new Date(dStr);
      };
      
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);

      if (albumSort === "old") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    return list;
  }, [finds, allPhotos, albumFilter, albumSearch, albumSort]);

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

      {/* MENU PANEL */}
      {showMenu && (
        <div
          style={{
            position: "absolute",
            zIndex: 6000,
            top: 85,
            left: 75,
            background: "rgba(17, 24, 39, 0.95)",
            backdropFilter: "blur(16px)",
            padding: "18px",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "stretch",
            width: "280px",
            maxHeight: "75vh",
            overflowY: "auto",
            color: "white",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            fontFamily: "system-ui, sans-serif"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800" }}>⚙️ Menu de Contrôle</h3>
            <button
              onClick={() => setShowMenu(false)}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.1)",
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
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              borderRadius: "12px",
              padding: "10px",
              border: "none",
              background: "#16a34a",
              color: "white",
              fontWeight: "bold",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            ➕ Ajouter trouvaille
          </button>

          {/* 2x2 Toggle Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", margin: "5px 0" }}>
            {/* Map Style */}
            <button
              onClick={() => setMapStyle(mapStyle === "plan" ? "satellite" : "plan")}
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "8px",
                color: "white",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {mapStyle === "plan" ? "🛰️ Satellite" : "🗺️ Plan"}
            </button>

            {/* Follow GPS */}
            <button
              onClick={() => setFollowGps(!followGps)}
              style={{
                background: followGps ? "rgba(37, 99, 235, 0.15)" : "rgba(255, 255, 255, 0.06)",
                border: followGps ? "1px solid #2563eb" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "8px",
                color: followGps ? "#60a5fa" : "white",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              🎯 Suivi : {followGps ? "On" : "Off"}
            </button>

            {/* Outing Recording */}
            {!isRecordingSortie ? (
              <button
                onClick={startSortie}
                style={{
                  background: "rgba(22, 163, 74, 0.15)",
                  border: "1px solid #16a34a",
                  borderRadius: "12px",
                  padding: "8px",
                  color: "#4ade80",
                  fontSize: "11px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                ⏱️ Marche
              </button>
            ) : (
              <button
                onClick={stopSortie}
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid #ef4444",
                  borderRadius: "12px",
                  padding: "8px",
                  color: "#f87171",
                  fontSize: "11px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                🛑 Stop ({(sortieDistance / 1000).toFixed(2)}k)
              </button>
            )}

            {/* Favorites Toggle */}
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              style={{
                background: favoritesOnly ? "rgba(245, 158, 11, 0.15)" : "rgba(255, 255, 255, 0.06)",
                border: favoritesOnly ? "1px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "8px",
                color: favoritesOnly ? "#facc15" : "white",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              ⭐ Favoris : {favoritesOnly ? "On" : "Off"}
            </button>
          </div>

          {/* Advanced Toggles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", margin: "5px 0" }}>
            {/* Toggle Clustering */}
            <button
              onClick={() => setUseClustering(!useClustering)}
              style={{
                background: useClustering ? "rgba(37, 99, 235, 0.15)" : "rgba(255, 255, 255, 0.06)",
                border: useClustering ? "1px solid #2563eb" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "8px",
                color: useClustering ? "#60a5fa" : "white",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              🧬 Clusters : {useClustering ? "On" : "Off"}
            </button>

            {/* Toggle Cassini */}
            <button
              onClick={() => setShowHistoricalMap(!showHistoricalMap)}
              style={{
                background: showHistoricalMap ? "rgba(217, 119, 6, 0.15)" : "rgba(255, 255, 255, 0.06)",
                border: showHistoricalMap ? "1px solid #d97706" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "8px",
                color: showHistoricalMap ? "#fbbf24" : "white",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              🗺️ Cassini : {showHistoricalMap ? "On" : "Off"}
            </button>
          </div>

          {/* Opacity slider for Cassini */}
          {showHistoricalMap && (
            <div style={{ background: "rgba(255,255,255,0.04)", padding: "8px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", margin: "5px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#d1d5db", fontWeight: "bold", marginBottom: "4px" }}>
                <span>Opacité Cassini</span>
                <span>{Math.round(historicalMapOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={historicalMapOpacity * 100}
                onChange={(e) => setHistoricalMapOpacity(Number(e.target.value) / 100)}
                style={{ width: "100%", cursor: "pointer", accentColor: "#d97706" }}
              />
            </div>
          )}
          {/* Custom style selector for GPS Marker */}
          <div style={{ background: "rgba(255,255,255,0.04)", padding: "8px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", margin: "5px 0" }}>
            <div style={{ fontSize: "10px", color: "#d1d5db", fontWeight: "bold", marginBottom: "6px" }}>
              🎨 Style de ma position GPS
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={() => {
                  setGpsStyle("blue-dot");
                  localStorage.setItem("gpsStyle", "blue-dot");
                }}
                style={{
                  flex: 1,
                  padding: "5px",
                  borderRadius: "8px",
                  border: "none",
                  background: gpsStyle === "blue-dot" ? "#2563eb" : "rgba(255,255,255,0.06)",
                  color: "white",
                  fontSize: "9.5px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                🔵 Bleu
              </button>
              <button
                onClick={() => {
                  setGpsStyle("radar");
                  localStorage.setItem("gpsStyle", "radar");
                }}
                style={{
                  flex: 1,
                  padding: "5px",
                  borderRadius: "8px",
                  border: "none",
                  background: gpsStyle === "radar" ? "#10b981" : "rgba(255,255,255,0.06)",
                  color: "white",
                  fontSize: "9.5px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                🟢 Radar
              </button>
              <button
                onClick={() => {
                  setGpsStyle("royal-pointer");
                  localStorage.setItem("gpsStyle", "royal-pointer");
                }}
                style={{
                  flex: 1,
                  padding: "5px",
                  borderRadius: "8px",
                  border: "none",
                  background: gpsStyle === "royal-pointer" ? "#d97706" : "rgba(255,255,255,0.06)",
                  color: "white",
                  fontSize: "9.5px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                🟡 Or
              </button>
            </div>
          </div>
          <input
            type="text"
            placeholder="🔍 Rechercher titre, époque..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "rgba(255, 255, 255, 0.08)",
              color: "white",
              fontSize: "12px",
              fontWeight: "500",
              outline: "none",
              boxSizing: "border-box",
              margin: "5px 0",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
            onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)"}
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "5px"
            }}
          >
            {Object.keys(
              icons
            ).map((category) => (
              <button
                key={category}
                onClick={() =>
                  toggleFilter(
                    category
                  )
                }
                style={{
                  opacity:
                    filters.includes(
                      category
                    )
                      ? 1
                      : 0.35,
                  borderRadius:
                    "10px",
                  border: "none",
                  padding:
                    "4px 6px",
                  fontSize: "11px"
                }}
              >
                {categoryEmojis[category] || ""} {category}
              </button>
            ))}
          </div>

          {activeSubCategory && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(37, 99, 235, 0.15)",
              border: "1px solid rgba(37, 99, 235, 0.3)",
              borderRadius: "10px",
              padding: "6px 10px",
              marginTop: "8px",
              fontSize: "11px",
              color: "#93c5fd"
            }}>
              <span>🎯 Sous-catégorie : <strong>{activeSubCategory}</strong></span>
              <button
                onClick={() => setActiveSubCategory(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "0 2px"
                }}
                title="Effacer le filtre de sous-catégorie"
              >
                ✕
              </button>
            </div>
          )}

         <AddFindForm
  showForm={showForm}
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
/>
          
        </div>
      )}

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
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: "calc(100% - 40px)",
            maxWidth: "430px",
            height: "calc(100vh - 40px)",
            background: "rgba(17, 24, 39, 0.95)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "24px",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
            zIndex: 6000,
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            boxSizing: "border-box",
            fontFamily: "system-ui, sans-serif",
            color: "white"
          }}
        >
          <style>{`
            .album-grid-card {
              position: relative;
              width: 100%;
              height: 0;
              padding-bottom: 100%;
              border-radius: 14px;
              overflow: hidden;
              border: 1px solid rgba(255,255,255,0.08);
              cursor: pointer;
              transform: translateZ(0);
              transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s, box-shadow 0.25s;
            }
            .album-grid-card:hover {
              transform: scale(1.04) translateY(-2px);
              border-color: rgba(37, 99, 235, 0.4);
              box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
            }
            .album-grid-img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .album-grid-card:hover .album-grid-img {
              transform: scale(1.08);
            }
            .album-grid-overlay {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              background: linear-gradient(to top, rgba(10, 15, 30, 0.9) 0%, rgba(10, 15, 30, 0.4) 60%, transparent 100%);
              padding: 8px;
              display: flex;
              flex-direction: column;
              gap: 2px;
              opacity: 0;
              transform: translateY(8px);
              transition: opacity 0.25s, transform 0.25s;
              pointer-events: none;
            }
            .album-grid-card:hover .album-grid-overlay {
              opacity: 1;
              transform: translateY(0);
            }
          `}</style>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800" }}>🖼️ Album de Collection</h2>
            <button
              onClick={() => setShowAlbum(false)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}
            >
              ✕
            </button>
          </div>

          {/* Search & Sort Panel */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <input
              type="text"
              placeholder="🔍 Rechercher titre, époque..."
              value={albumSearch}
              onChange={(e) => setAlbumSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                background: "rgba(255, 255, 255, 0.06)",
                color: "white",
                fontSize: "12px",
                outline: "none"
              }}
            />
            <select
              value={albumSort}
              onChange={(e) => setAlbumSort(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                background: "rgba(255, 255, 255, 0.06)",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="recent" style={{ background: "#1f2937" }}>📅 Récentes</option>
              <option value="old" style={{ background: "#1f2937" }}>📅 Anciennes</option>
              <option value="fav" style={{ background: "#1f2937" }}>⭐ Favoris</option>
            </select>
          </div>

          {/* Album Filter */}
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "10px", marginBottom: "15px" }}>
            {["Tous", ...Object.keys(icons)].map((cat) => (
              <button
                key={cat}
                onClick={() => setAlbumFilter(cat)}
                style={{
                  background: albumFilter === cat ? "#2563eb" : "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  cursor: "pointer"
                }}
              >
                {cat === "Tous" ? "📁 Tous" : `${categoryEmojis[cat] || ""} ${cat}`}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", paddingRight: "6px" }}>
            {albumFilteredFinds.map((find) => {
              const photoUrl = (find.isOfflinePending
                ? find.offlinePhoto
                : allPhotos.find((p) => p.find_id === find.id)?.image_url) || "";

              return (
                <div
                  key={find.id}
                  className="album-grid-card"
                  onClick={() => {
                    setSelectedAlbumPhoto({ find, photoUrl });
                  }}
                >
                  <img
                    src={photoUrl}
                    alt={find.title}
                    className="album-grid-img"
                  />
                  
                  {/* Category Badge */}
                  <div style={{ position: "absolute", top: "6px", left: "6px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "3px 5px", borderRadius: "6px", fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {categoryEmojis[find.category] || categoryEmojis[find.category?.trim().charAt(0).toUpperCase() + find.category?.trim().slice(1).toLowerCase()] || "📍"}
                  </div>

                  {/* Favorite Badge */}
                  {find.favorite && (
                    <div style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "3px 5px", borderRadius: "6px", fontSize: "9px", color: "#facc15" }}>
                      ⭐
                    </div>
                  )}

                  {/* Hover Details Overlay */}
                  <div className="album-grid-overlay">
                    <div style={{ fontSize: "10px", fontWeight: "800", color: "white", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {find.title || "Sans titre"}
                    </div>
                    {find.date && (
                      <div style={{ fontSize: "8px", color: "#9ca3af" }}>
                        {find.date.split(",")[0]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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

        {isRecordingSortie && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.9)",
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
            Sortie active : {(sortieDistance / 1000).toFixed(2)} km
          </div>
        )}
      </div>

      <MapContainer
        center={position}
        zoom={20}
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        <MapEventsHandler 
          onLongPress={handleMapLongPress} 
          onMapDrag={() => setFollowGps(false)} 
        />
        <GpsFollower position={position} followGps={followGps} />
        {zoomTarget && (
          <RecenterMap
            target={zoomTarget}
            onRecentered={() => setZoomTarget(null)}
          />
        )}

        {openPopupFind && (
          <Popup
            position={openPopupFind.position}
            onClose={() => setOpenPopupFind(null)}
            eventHandlers={{
              remove: () => setOpenPopupFind(null)
            }}
          >
            <FindPopup
              find={openPopupFind}
              onClose={() => setOpenPopupFind(null)}
              onDelete={deleteFind}
              onFavorite={handleFavorite}
              onUpdate={loadFinds}
            />
          </Popup>
        )}

        <MapLayers
          mapStyle={mapStyle}
          showHistoricalMap={showHistoricalMap}
          historicalMapOpacity={historicalMapOpacity}
        />

        {selectedDateTracks.map((track, idx) => (
          <Polyline
            key={track.id || idx}
            positions={track.positions}
            pathOptions={{
              color: "#facc15",
              weight: 4,
              opacity: 0.7,
              dashArray: "6, 8",
              lineCap: "round"
            }}
          />
        ))}

        <GpsMarker
          position={position}
          gpsStyle={gpsStyle}
        />

        {useClustering ? (
          <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
            {positionedFinds.map((find) => (
              <Marker
                key={find.id}
                position={find.finalPosition}
                icon={icons[find.category] || icons.autre}
              >
                <Popup
                  autoPan={false}
                  keepInView={false}
                  closeOnClick={false}
                  eventHandlers={{
                    add: () => setActivePopupId(find.id),
                    remove: () => {
                      setActivePopupId((current) => current === find.id ? null : current);
                    }
                  }}
                >
                  {activePopupId === find.id ? (
                    <FindPopup
                      find={find}
                      onDelete={deleteFind}
                      onFavorite={handleFavorite}
                      onUpdate={loadFinds}
                    />
                  ) : (
                    <div style={{ padding: "10px", color: "black", fontFamily: "system-ui, sans-serif", fontSize: "12px" }}>
                      Chargement...
                    </div>
                  )}
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        ) : (
          positionedFinds.map((find) => (
            <Marker
              key={find.id}
              position={find.finalPosition}
              icon={icons[find.category] || icons.autre}
            >
              <Popup
                autoPan={false}
                keepInView={false}
                closeOnClick={false}
                eventHandlers={{
                  add: () => setActivePopupId(find.id),
                  remove: () => {
                    setActivePopupId((current) => current === find.id ? null : current);
                  }
                }}
              >
                {activePopupId === find.id ? (
                  <FindPopup
                    find={find}
                    onDelete={deleteFind}
                    onFavorite={handleFavorite}
                    onUpdate={loadFinds}
                  />
                ) : (
                  <div style={{ padding: "10px", color: "black", fontFamily: "system-ui, sans-serif", fontSize: "12px" }}>
                    Chargement...
                  </div>
                )}
              </Popup>
            </Marker>
          ))
        )}        

      </MapContainer>

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

      {/* FULLSCREEN ALBUM PHOTO LIGHTBOX */}
      {selectedAlbumPhoto && createPortal(
        (() => {
          const currentIndex = albumFilteredFinds.findIndex((f) => f.id === selectedAlbumPhoto.find.id);
          const prevFind = currentIndex > 0 ? albumFilteredFinds[currentIndex - 1] : null;
          const nextFind = currentIndex < albumFilteredFinds.length - 1 ? albumFilteredFinds[currentIndex + 1] : null;

          const navigatePhoto = (targetFind) => {
            if (!targetFind) return;
            const photoUrl = targetFind.isOfflinePending
              ? targetFind.offlinePhoto
              : allPhotos.find((p) => p.find_id === targetFind.id)?.image_url;
            setSelectedAlbumPhoto({ find: targetFind, photoUrl });
            setLightboxCoinFlipped(false);
          };

          const isCoin = selectedAlbumPhoto.find.category === "Monnaie";
          let avers = null;
          let revers = null;
          if (isCoin) {
            const coinPhotos = allPhotos.filter((p) => p.find_id === selectedAlbumPhoto.find.id);
            avers = coinPhotos.find((p) => p.type === "avers") || coinPhotos[0];
            revers = coinPhotos.find((p) => p.type === "revers") || (coinPhotos.length > 1 ? coinPhotos.find((p) => p.id !== avers?.id) : null);
          }

          return (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0, 0, 0, 0.95)",
                zIndex: 99999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "system-ui, sans-serif"
              }}
              onClick={() => setSelectedAlbumPhoto(null)}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedAlbumPhoto(null)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: "44px",
                  height: "44px",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10
                }}
              >
                ✕
              </button>

              {/* Navigation Left Arrow */}
              {prevFind && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePhoto(prevFind);
                  }}
                  style={{
                    position: "absolute",
                    left: "20px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
                >
                  ‹
                </button>
              )}

              {/* Navigation Right Arrow */}
              {nextFind && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePhoto(nextFind);
                  }}
                  style={{
                    position: "absolute",
                    right: "20px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
                >
                  ›
                </button>
              )}

              {/* Content Panel (image or 3D coin) */}
              <div 
                style={{
                  width: "100%",
                  maxHeight: "70%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 80px",
                  boxSizing: "border-box"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {isCoin ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <style>{`
                      .coin-lightbox-3d {
                        perspective: 1000px;
                        width: 240px;
                        height: 240px;
                        cursor: pointer;
                        margin: 10px auto;
                      }
                      .coin-lightbox-inner {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                        transform-style: preserve-3d;
                      }
                      .coin-lightbox-3d.flipped .coin-lightbox-inner {
                        transform: rotateY(180deg);
                      }
                      .coin-lightbox-front, .coin-lightbox-back {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        -webkit-backface-visibility: hidden;
                        backface-visibility: hidden;
                        border-radius: 50%;
                        overflow: hidden;
                        border: 3px solid rgba(255, 255, 255, 0.25);
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
                      }
                      .coin-lightbox-back {
                        transform: rotateY(180deg);
                      }
                      .coin-lightbox-front img, .coin-lightbox-back img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                      }
                      .coin-lightbox-revers-placeholder {
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #1e293b, #0f172a);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        color: #fbbf24;
                        font-size: 11px;
                        font-weight: bold;
                        text-transform: uppercase;
                        border-radius: 50%;
                        border: 3px dashed rgba(251, 191, 36, 0.4);
                        box-sizing: border-box;
                        padding: 15px;
                        text-align: center;
                      }
                    `}</style>
                    <div
                      className={`coin-lightbox-3d ${lightboxCoinFlipped ? "flipped" : ""}`}
                      onClick={() => setLightboxCoinFlipped(!lightboxCoinFlipped)}
                    >
                      <div className="coin-lightbox-inner">
                        <div className="coin-lightbox-front">
                          {avers ? (
                            <img src={avers.image_url} alt="Avers" />
                          ) : (
                            <div className="coin-lightbox-revers-placeholder">Avers</div>
                          )}
                        </div>
                        <div className="coin-lightbox-back">
                          {revers ? (
                            <img src={revers.image_url} alt="Revers" />
                          ) : (
                            <div className="coin-lightbox-revers-placeholder">
                              <span style={{ fontSize: "36px", marginBottom: "6px", display: "block" }}>🪙</span>
                              <span>Revers non</span>
                              <span>photographié</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: "12px", color: "#a1a1aa", marginTop: "5px" }}>
                      👆 Tapez sur la pièce pour la retourner (3D)
                    </span>
                  </div>
                ) : (
                  <img
                    src={selectedAlbumPhoto.photoUrl}
                    alt={selectedAlbumPhoto.find.title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "65vh",
                      objectFit: "contain",
                      borderRadius: "16px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.1)"
                    }}
                  />
                )}
              </div>

              {/* Details / Action Button */}
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  color: "white",
                  textAlign: "center",
                  width: "90%",
                  maxWidth: "400px"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                  {selectedAlbumPhoto.find.title || "Sans titre"}
                </h3>
                <p style={{ margin: 0, opacity: 0.8, fontSize: "14px" }}>
                  {categoryEmojis[selectedAlbumPhoto.find.category] || categoryEmojis[selectedAlbumPhoto.find.category?.trim().charAt(0).toUpperCase() + selectedAlbumPhoto.find.category?.trim().slice(1).toLowerCase()] || "📍"} {selectedAlbumPhoto.find.category}
                  {selectedAlbumPhoto.find.sub_category ? ` • ${selectedAlbumPhoto.find.sub_category}` : ""}
                  {selectedAlbumPhoto.find.date ? ` • 📅 ${selectedAlbumPhoto.find.date.split(",")[0]}` : ""}
                </p>

                <button
                  onClick={() => {
                    setZoomTarget({ position: selectedAlbumPhoto.find.position, zoom: 20 });
                    setOpenPopupFind(selectedAlbumPhoto.find);
                    setSelectedAlbumPhoto(null);
                    setShowAlbum(false);
                  }}
                  style={{
                    border: "none",
                    borderRadius: "14px",
                    padding: "12px 24px",
                    background: "#2563eb",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)",
                    transition: "transform 0.15s, background-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  🔗 Voir la trouvaille sur la carte
                </button>
              </div>
            </div>
          );
        })(),
        document.body
      )}
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
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(8, 10, 20, 0.97)",
            backdropFilter: "blur(12px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
            fontFamily: "system-ui, sans-serif"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "rgba(17, 24, 39, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "24px",
              padding: "30px 24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              textAlign: "center",
              color: "white"
            }}
          >
            {!startupLocationWarning ? (
              <>
                <div style={{ fontSize: "52px", marginBottom: "15px" }}>🛰️</div>
                <h2 style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
                  Configuration GPS
                </h2>
                <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.6", margin: "0 0 24px 0" }}>
                  Pour cartographier et enregistrer vos trouvailles sur le terrain, l'application a besoin d'une connexion GPS fonctionnelle.
                </p>

                {startupLocationError && (
                  <div style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    borderRadius: "12px",
                    padding: "10px 12px",
                    fontSize: "12px",
                    color: "#f87171",
                    marginBottom: "20px",
                    lineHeight: "1.4"
                  }}>
                    {startupLocationError}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button
                    onClick={handleRequestLocation}
                    disabled={startupLocationLoading}
                    style={{
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      border: "none",
                      borderRadius: "14px",
                      padding: "14px",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
                      transition: "transform 0.15s, opacity 0.2s"
                    }}
                    onMouseEnter={(e) => { if (!startupLocationLoading) e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={(e) => { if (!startupLocationLoading) e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    {startupLocationLoading ? (
                      <>
                        <span style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid white",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin-loader 0.8s linear infinite"
                        }}></span>
                        Acquisition du signal...
                      </>
                    ) : (
                      <>🎯 Activer la localisation</>
                    )}
                  </button>

                  <button
                    onClick={handleRejectPoorLocation}
                    disabled={startupLocationLoading}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "14px",
                      padding: "14px",
                      color: "#d1d5db",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "background 0.2s, transform 0.15s"
                    }}
                    onMouseEnter={(e) => { if (!startupLocationLoading) { e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"; e.currentTarget.style.transform = "scale(1.02)"; } }}
                    onMouseLeave={(e) => { if (!startupLocationLoading) { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.transform = "scale(1)"; } }}
                  >
                    🗺️ Mode Consultation (Lespignan)
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: "52px", marginBottom: "15px" }}>⚠️</div>
                <h2 style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 10px 0", color: "#fbbf24" }}>
                  Signal GPS imprécis
                </h2>
                <p style={{ fontSize: "13px", color: "#d1d5db", lineHeight: "1.6", margin: "0 0 20px 0" }}>
                  Votre navigateur renvoie une position approximative (IP de connexion résolue à **Mèze** ou alentours).
                </p>
                <p style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.5", margin: "0 0 24px 0" }}>
                  Si vous êtes chez vous sur ordinateur, nous vous conseillons de centrer la carte sur votre zone de trouvailles habituelle (Lespignan) pour éviter les décalages.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button
                    onClick={handleRejectPoorLocation}
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      border: "none",
                      borderRadius: "14px",
                      padding: "14px",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                      transition: "transform 0.15s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    🏰 Centrer sur Lespignan (Recommandé)
                  </button>

                  <button
                    onClick={handleAcceptPoorLocation}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "14px",
                      padding: "14px",
                      color: "#9ca3af",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
                  >
                    Utiliser quand même cette position GPS
                  </button>
                </div>
              </>
            )}
          </div>
          
          <style>{`
            @keyframes spin-loader {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default App;
