import { useEffect, useState } from "react";

import {
  MapContainer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { supabase } from "./supabase";

import FindPopup from "./components/FindPopup";
import AddFindForm from "./components/AddFindForm";

import LoadingScreen from "./components/LoadingScreen";
import GpsMarker from "./components/GpsMarker";
import MapLayers from "./components/MapLayers";
import StatsPanel from "./components/StatsPanel";

import { icons } from "./icons";

import {
  loadFinds as fetchFinds,
  addFind as createFind
} from "./services/findsService";

import {
  exportData,
  importData
} from "./services/backupService";

function offsetPosition(position, index) {
  const radius = 0.00012;

  const angle =
    index * 45 * (Math.PI / 180);

  return [
    position[0] +
      Math.sin(angle) * radius,

    position[1] +
      Math.cos(angle) * radius
  ];
}

function RecenterMap({
  position
}) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position);
    }
  }, [position, map]);

  return null;
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

function App() {
  const [position, setPosition] =
    useState(null);

  const [finds, setFinds] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    selectedDate,
    setSelectedDate
  ] = useState(null);

  const [mapStyle, setMapStyle] =
    useState("plan");

  const [filters, setFilters] =
    useState([
      "autre",
      "bijou",
      "boucle",
      "bouton",
      "dé à coudre",
      "médaille",
      "militaire",
      "monnaie",
      "outil",
      "plomb",
      "religieux"
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
  ] = useState("monnaie");

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

  const [
    addingFind,
    setAddingFind
  ] = useState(false);

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

          if (!followGps) {
            return;
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
  }, [followGps]);

  const loadFinds = async () => {
    const data =
      await fetchFinds();

    setFinds(data || []);
  };

  const toggleFilter = (
    category
  ) => {
    if (
      filters.includes(category)
    ) {
      setFilters(
        filters.filter(
          (f) => f !== category
        )
      );
    } else {
      setFilters([
        ...filters,
        category
      ]);
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

      loadTracks();
    };

  const addFind = async () => {
    if (!position) return;

    if (addingFind) return;

    setAddingFind(true);

    try {
      await createFind({
        position,
        newTitle,
        newDescription,
        newCategory,
        photoFile: newPhoto
      });

      setShowForm(false);

      setNewTitle("");

      setNewDescription("");

      setNewCategory("monnaie");

      setNewPhoto(null);

      await loadFinds();

    } catch (error) {
      console.error(error);

      alert(
        "Erreur ajout trouvaille"
      );
    }

    setAddingFind(false);
  };

  const deleteFind = async (
    findId
  ) => {
    const confirmed =
      window.confirm(
        "Supprimer définitivement cette trouvaille ?"
      );

    if (!confirmed) return;

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

    loadFinds();
  };

  const groupedDates = {};

  finds.forEach((find) => {
    const shortDate =
      find.date?.split(" ")[0];

    if (
      !groupedDates[shortDate]
    ) {
      groupedDates[
        shortDate
      ] = [];
    }

    groupedDates[
      shortDate
    ].push(find);
  });

  const filteredFinds =
    finds.filter((find) => {
      const matchesCategory =
        filters.includes(
          find.category
        );

      const matchesSearch =
        find.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        find.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesDate =
        !selectedDate ||
        find.date?.startsWith(
          selectedDate
        );

      return (
        matchesCategory &&
        matchesSearch &&
        matchesDate
      );
    });

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
          zIndex: 2000,
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
        }}
        style={{
          position: "absolute",
          top: 150,
          left: 15,
          zIndex: 2000,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          border: "none",
          background: "#111827",
          color: "white",
          fontSize: "20px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.35)"
        }}
      >
        📊
      </button>

      {/* MENU PANEL */}
      {showMenu && (
        <div
          style={{
            position: "absolute",
            zIndex: 5000,
            top: 85,
            left: 75,
            background:
              "rgba(20,20,20,0.72)",
            backdropFilter:
              "blur(10px)",
            padding: "8px",
            borderRadius: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            alignItems: "stretch",
            width: "190px",
            maxHeight: "65vh",
            overflowY: "auto",
            color: "white",
            boxShadow:
              "0 0 20px rgba(0,0,0,0.4)"
          }}
        >
          <button
            onClick={() =>
              setShowMenu(false)
            }
            style={{
              alignSelf: "flex-end",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "none",
              background: "#ef4444",
              color: "white",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            ✕
          </button>

          <button
            onClick={() => {
              setShowForm(!showForm);
            }}
            style={{
              borderRadius:
                "12px",
              padding: "7px",
              border: "none",
              fontSize: "13px"
            }}
          >
            ➕ Ajouter trouvaille
          </button>

          <div
            style={{
              display: "flex",
              gap: "5px"
            }}
          >
            <button
              onClick={() =>
                setFollowGps(
                  !followGps
                )
              }
              style={{
                flex: 1,
                borderRadius:
                  "12px",
                padding: "7px",
                border: "none",
                fontSize: "13px"
              }}
            >
              {followGps
                ? "📍 ON"
                : "📍 OFF"}
            </button>

          </div>

          <button
            onClick={() => {
              setMapStyle(
                mapStyle === "plan"
                  ? "satellite"
                  : "plan"
              );

              setShowMenu(false);
            }}
            style={{
              borderRadius:
                "12px",
              padding: "7px",
              border: "none",
              fontSize: "13px"
            }}
          >
            {mapStyle ===
            "plan"
              ? "🛰️ Satellite"
              : "🗺️ Plan"}
          </button>

          <input
            type="text"
            placeholder="Recherche..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            style={{
              padding: "7px",
              borderRadius:
                "10px",
              border: "none",
              fontSize: "13px"
            }}
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
                {category}
              </button>
            ))}
          </div>

          <AddFindForm
            showForm={showForm}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            newDescription={newDescription}
            setNewDescription={
              setNewDescription
            }
            newCategory={newCategory}
            setNewCategory={
              setNewCategory
            }
            icons={icons}
            addFind={addFind}
            newPhoto={newPhoto}
            setNewPhoto={setNewPhoto}
            addingFind={addingFind}
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
            exportData={
              handleExport
            }
            importData={
              handleImport
            }
            groupedDates={
              groupedDates
            }
            setSelectedDate={
              setSelectedDate
            }
            onClose={() =>
              setShowStats(false)
            }
          />
        </div>
      )}

      <MapContainer
        center={position}
        zoom={20}
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        {followGps && (
          <RecenterMap
            position={position}
          />
        )}

        <MapLayers
          mapStyle={mapStyle}
        />

        <GpsMarker
          position={position}
        />

        {filteredFinds.map(
          (find, index) => (
            <Marker
              key={find.id}
              position={offsetPosition(
                find.position,
                index
              )}
              icon={
                icons[
                  find.category
                ] ||
                icons.autre
              }
            >
              <Popup>
                <FindPopup
                  find={find}
                  onDelete={
                    deleteFind
                  }
                />
              </Popup>
            </Marker>
          )
        )}
      </MapContainer>
    </div>
  );
}

export default App;