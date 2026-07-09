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



function App() {
  const [position, setPosition] =
    useState(null);

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
    useState(true);

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
  const [zoomTarget, setZoomTarget] = useState(null);
  const [openPopupFind, setOpenPopupFind] = useState(null);
  const [activePopupId, setActivePopupId] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [showHistoricalMap, setShowHistoricalMap] = useState(false);
  const [historicalMapOpacity, setHistoricalMapOpacity] = useState(0.5);
  const [useClustering, setUseClustering] = useState(false);

  const isRecordingRef = useRef(isRecordingSortie);
  const positionsRef = useRef(sortiePositions);
  const quickAddInputRef = useRef(null);

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

  const stopSortie = async () => {
    if (sortiePositions.length < 2 || sortieDistance === 0) {
      const forceClose = window.confirm("Pas assez de déplacements enregistrés. Annuler la sortie ?");
      if (forceClose) {
        setIsRecordingSortie(false);
        setSortiePositions([]);
        setSortieDistance(0);
      }
      return;
    }

    setIsRecordingSortie(false);
    const success = await saveTrack(sortiePositions);
    if (success) {
      const tracks = await loadTracks();
      setSavedTracks(tracks || []);
    }
    setSortiePositions([]);
    setSortieDistance(0);
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

    const watchId =
      navigator.geolocation.watchPosition(
        (pos) => {
          const newPosition = [
            pos.coords.latitude,
            pos.coords.longitude
          ];

          setPosition(newPosition);
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
          console.error(err);

          alert(
            "Erreur GPS : " +
              err.message
          );
        },

        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        }
      );

    return () =>
      navigator.geolocation.clearWatch(
        watchId
      );
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
      .select("*");
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

  const toggleFilter = (
    category
  ) => {
    // Si la catégorie cliquée est déjà la seule active, on réactive tout
    if (filters.length === 1 && filters[0] === category) {
      setFilters(Object.keys(icons));
    } else {
      // Sinon, on isole cette catégorie
      setFilters([category]);
    }
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

  const handleQuickAdd = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!position) {
      alert("Position GPS non acquise. Veuillez patienter.");
      return;
    }

    const titleInput = window.prompt("Titre de la trouvaille :", "Trouvaille Rapide");
    if (titleInput === null) {
      e.target.value = "";
      return;
    }

    const title = titleInput.trim() || "Trouvaille Rapide";

    await addFind({
      position,
      newTitle: title,
      newDescription: "Indéterminé",
      newCategory: "Autre",
      newSubCategory: "",
      newPhoto: file,
      customDate: new Date().toLocaleString("fr-FR")
    });

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

  const deleteFind = async (
    findId
  ) => {
    const confirmed =
      window.confirm(
        "Supprimer définitivement cette trouvaille ?"
      );

    if (!confirmed) return;

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

      return matchesCategory && matchesSearch && matchesDate;
    });
  }, [finds, filters, search, selectedDate, favoritesOnly]);

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

      {/* ALBUM PANEL */}
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
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
          <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", paddingRight: "4px" }}>
            {finds
              .filter((f) => albumFilter === "Tous" || f.category === albumFilter)
              .map((find) => {
                const photoUrl = find.isOfflinePending
                  ? find.offlinePhoto
                  : allPhotos.find((p) => p.find_id === find.id)?.image_url;

                if (!photoUrl) return null;

                return (
                  <div
                    key={find.id}
                    onClick={() => {
                      setSelectedAlbumPhoto({ find, photoUrl });
                    }}
                    style={{
                      position: "relative",
                      aspectRatio: "1/1",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                      transition: "transform 0.15s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <img
                      src={photoUrl}
                      alt={find.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", top: "4px", left: "4px", background: "rgba(0,0,0,0.6)", padding: "2px 4px", borderRadius: "4px", fontSize: "9px" }}>
                      {categoryEmojis[find.category] || "📍"}
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
              justifyContent: "center"
            }}
          >
            ✕
          </button>

          {/* Fullscreen Image */}
          <img
            src={selectedAlbumPhoto.photoUrl}
            alt={selectedAlbumPhoto.find.title}
            style={{
              maxWidth: "90%",
              maxHeight: "70%",
              objectFit: "contain",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)"
            }}
            onClick={(e) => e.stopPropagation()}
          />

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
              {selectedAlbumPhoto.find.title}
            </h3>
            <p style={{ margin: 0, opacity: 0.8, fontSize: "14px" }}>
              {categoryEmojis[selectedAlbumPhoto.find.category] || "📍"} {selectedAlbumPhoto.find.category}
              {selectedAlbumPhoto.find.sub_category ? ` • ${selectedAlbumPhoto.find.sub_category}` : ""}
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
                boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)"
              }}
            >
              🔗 Voir la trouvaille sur la carte
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default App;
