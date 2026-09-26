import React, { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import "leaflet/dist/leaflet.css";

import { icons, getCategoryIcon } from "../icons";
import { isFindInSortie } from "../services/findsService";
import { leaveTeamSession } from "../services/sessionService";
import FindPopup from "./FindPopup";
import GpsMarker from "./GpsMarker";
import TeammateMarker from "./TeammateMarker";
import MapLayers from "./MapLayers";

// Helper: Recenter map to target coords
function RecenterMap({ target, onRecentered }) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.setView(target.position, target.zoom || 17);
      if (onRecentered) {
        onRecentered();
      }
    }
  }, [target, map, onRecentered]);

  return null;
}

// Helper: Intercept map context menu (long press) and map drag starts
function MapEventsHandler({ onLongPress, onMapDrag }) {
  const map = useMap();

  useEffect(() => {
    const handleContextMenu = (e) => {
      if (onLongPress) {
        onLongPress(e.latlng);
      }
    };

    const handleUserMapMove = () => {
      if (onMapDrag) {
        onMapDrag();
      }
    };

    map.on("contextmenu", handleContextMenu);
    map.on("dragstart", handleUserMapMove);
    map.on("movestart", handleUserMapMove);

    return () => {
      map.off("contextmenu", handleContextMenu);
      map.off("dragstart", handleUserMapMove);
      map.off("movestart", handleUserMapMove);
    };
  }, [map, onLongPress, onMapDrag]);

  return null;
}

// Helper: Track user GPS position and auto-center
function GpsFollower({ position, followGps }) {
  const map = useMap();

  useEffect(() => {
    if (position && followGps) {
      map.setView(position, map.getZoom());
    }
  }, [position, followGps, map]);

  return null;
}

// Helper: Direct Leaflet Canvas/SVG Polyline renderer for live sortie tracking
function LiveSortieTrack({ positions, isRecording }) {
  const map = useMap();
  const polyRef = React.useRef(null);
  const glowRef = React.useRef(null);

  useEffect(() => {
    if (!isRecording || !positions || positions.length < 2) {
      if (polyRef.current) {
        map.removeLayer(polyRef.current);
        polyRef.current = null;
      }
      if (glowRef.current) {
        map.removeLayer(glowRef.current);
        glowRef.current = null;
      }
      return;
    }

    const latlngs = positions.map((p) => [p[0], p[1]]);

    if (!glowRef.current) {
      glowRef.current = L.polyline(latlngs, {
        color: "#083344",
        weight: 8,
        opacity: 0.85,
        lineCap: "round",
        lineJoin: "round",
        smoothFactor: 1.0,
        interactive: false
      }).addTo(map);
    } else {
      glowRef.current.setLatLngs(latlngs);
      if (typeof glowRef.current.redraw === "function") {
        glowRef.current.redraw();
      }
    }

    if (!polyRef.current) {
      polyRef.current = L.polyline(latlngs, {
        color: "#06b6d4",
        weight: 4.5,
        opacity: 1,
        lineCap: "round",
        lineJoin: "round",
        smoothFactor: 1.0,
        interactive: false
      }).addTo(map);
    } else {
      polyRef.current.setLatLngs(latlngs);
      if (typeof polyRef.current.redraw === "function") {
        polyRef.current.redraw();
      }
    }
  }, [positions, isRecording, map]);

  useEffect(() => {
    return () => {
      if (polyRef.current) {
        map.removeLayer(polyRef.current);
        polyRef.current = null;
      }
      if (glowRef.current) {
        map.removeLayer(glowRef.current);
        glowRef.current = null;
      }
    };
  }, [map]);

  return null;
}

// Helper: Custom Cluster Icon (Ultra-smooth modern bubble)
const createClusterCustomIcon = (cluster) => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `
      <div style="
        width: 38px;
        height: 38px;
        background: linear-gradient(135deg, #1d4ed8 0%, #0284c7 100%);
        border: 2px solid #ffffff;
        border-radius: 50%;
        color: #ffffff;
        font-weight: 900;
        font-size: 14px;
        font-family: system-ui, -apple-system, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(2, 132, 199, 0.6), 0 0 0 3px rgba(56, 189, 248, 0.35);
        user-select: none;
      ">
        ${count}
      </div>
    `,
    className: "custom-cluster-marker",
    iconSize: L.point(38, 38, true),
    iconAnchor: L.point(19, 19)
  });
};

// Helper: Ultra-lightweight memoized find marker (0 popup overhead, 100% GPU accelerated)
const FindMarker = React.memo(function FindMarker({
  find,
  markerSize,
  isHighlighted = false,
  onSelectFind
}) {
  const icon = getCategoryIcon(find.category, null, markerSize, isHighlighted) || icons.autre;

  return (
    <Marker
      position={find.finalPosition || find.position}
      icon={icon}
      zIndexOffset={isHighlighted ? 1500 : 0}
      eventHandlers={{
        click: (e) => {
          if (e && e.originalEvent) {
            L.DomEvent.stopPropagation(e.originalEvent);
          }
          if (onSelectFind) {
            onSelectFind(find);
          }
        }
      }}
    />
  );
});

export default function MainMap({
  position,
  followGps,
  setFollowGps,
  zoomTarget,
  setZoomTarget,
  openPopupFind,
  setOpenPopupFind,
  activePopupId,
  setActivePopupId,
  useClustering,
  baseMap = "satellite",
  mapStyle,
  showCadastre = false,
  cadastreOpacity = 0.85,
  showCassini = false,
  showHistoricalMap,
  cassiniOpacity = 0.6,
  historicalMapOpacity,
  showEtatMajor = false,
  etatMajorOpacity = 0.6,
  onOpenMapLayers,
  positionedFinds = [],
  selectedDateTracks = [],
  selectedDate = null,
  handleMapLongPress,
  deleteFind,
  handleFavorite,
  loadFinds,
  workspace = { mode: "personal" },
  setWorkspace,
  onOpenTeamSession,
  isRecordingSortie = false,
  showLiveSortieTrack = true,
  sortiePositions = [],
  savedTracks = [],
  markerSize = "medium",
  teammates = []
}) {
  const handleExitConsultation = () => {
    if (setWorkspace) {
      setWorkspace({ mode: "personal", targetCode: null, sessionName: null });
    }
  };

  const handleLeaveSession = () => {
    leaveTeamSession();
    if (setWorkspace) {
      setWorkspace({ mode: "personal", targetCode: null, sessionName: null });
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* FLOATING WORKSPACE / COLLABORATION BANNER */}
      {workspace && workspace.mode !== "personal" && (
        <div
          style={{
            position: "absolute",
            top: "66px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: "calc(100% - 24px)",
            maxWidth: "480px",
            background: workspace.mode === "session" ? "rgba(6, 44, 34, 0.94)" : "rgba(15, 23, 42, 0.94)",
            border: workspace.mode === "session" ? "1.5px solid #10b981" : "1.5px solid #3b82f6",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "14px",
            padding: "10px 14px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: workspace.mode === "session" ? "rgba(16, 185, 129, 0.2)" : "rgba(59, 130, 246, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                flexShrink: 0
              }}
            >
              {workspace.mode === "session" ? "🟢" : "👁️"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "0.2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {workspace.mode === "session"
                  ? (workspace.sessionName || "Session d'Équipe Live")
                  : `Consultation : ${workspace.targetCode}`}
              </div>
              <div style={{ fontSize: "10px", color: workspace.mode === "session" ? "#6ee7b7" : "#93c5fd", fontWeight: "600" }}>
                {workspace.mode === "session"
                  ? `Code : ${workspace.targetCode} • ${teammates.length > 0 ? `${teammates.length} coéquipier(s) en direct` : "Partage en direct"}`
                  : "Mode lecture seule"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            {workspace.mode === "session" && onOpenTeamSession && (
              <button
                type="button"
                onClick={onOpenTeamSession}
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                👥 Équipe
              </button>
            )}

            <button
              type="button"
              onClick={workspace.mode === "session" ? handleLeaveSession : handleExitConsultation}
              style={{
                background: "#ef4444",
                border: "none",
                color: "#ffffff",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(239, 68, 68, 0.4)"
              }}
            >
              {workspace.mode === "session" ? "Quitter" : "✕ Fermer"}
            </button>
          </div>
        </div>
      )}

      <MapContainer
        center={position}
        zoom={17}
        maxZoom={18}
        minZoom={4}
        preferCanvas={true}
        zoomControl={false}
        attributionControl={false}
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
            position={openPopupFind.finalPosition || openPopupFind.position}
            onClose={() => setOpenPopupFind(null)}
            className="custom-find-leaflet-popup"
            autoPan={false}
            closeButton={true}
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
              workspace={workspace}
            />
          </Popup>
        )}

      <MapLayers
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
      />

      {/* HISTORICAL / SELECTED TRACKS */}
      {selectedDateTracks.map((track, idx) => (
        <Polyline
          key={track.id || `sel-track-${idx}`}
          positions={track.positions}
          pathOptions={{
            color: "#f59e0b",
            weight: 4,
            opacity: 0.8,
            dashArray: "6, 8",
            lineCap: "round"
          }}
        />
      ))}

      {/* LIVE ACTIVE SORTIE TRACK (Direct Leaflet Canvas/SVG Layer) */}
      <LiveSortieTrack
        positions={showLiveSortieTrack ? sortiePositions : []}
        isRecording={isRecordingSortie && showLiveSortieTrack}
      />

      {/* START SORTIE PIN */}
      {isRecordingSortie && showLiveSortieTrack && sortiePositions && sortiePositions.length > 0 && (
        <Marker
          position={sortiePositions[0]}
          icon={L.divIcon({
            html: `
              <div style="
                background: #10b981;
                color: #ffffff;
                font-size: 11px;
                font-weight: 800;
                padding: 3px 8px;
                border-radius: 8px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.5);
                border: 2px solid #ffffff;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-family: system-ui, sans-serif;
              ">
                <span>🚩</span>
                <span>Départ</span>
              </div>
            `,
            className: "start-sortie-pin-custom",
            iconSize: [70, 26],
            iconAnchor: [35, 13]
          })}
        />
      )}

      <GpsMarker
        position={position}
      />

      {/* TEAMMATES LIVE GPS CURSORS */}
      {teammates && teammates.map((teammate) => (
        <TeammateMarker
          key={teammate.userCode}
          teammate={teammate}
          myPosition={position}
        />
      ))}

      {useClustering ? (
        <MarkerClusterGroup
          iconCreateFunction={createClusterCustomIcon}
          chunkedLoading={true}
          showCoverageOnHover={false}
          maxClusterRadius={50}
          animate={false}
          animateAddingMarkers={false}
          spiderfyOnMaxZoom={false}
        >
          {positionedFinds.map((find) => (
            <FindMarker
              key={find.id}
              find={find}
              markerSize={markerSize}
              isHighlighted={Boolean(selectedDate && isFindInSortie(find, selectedDate))}
              onSelectFind={setOpenPopupFind}
            />
          ))}
        </MarkerClusterGroup>
      ) : (
        positionedFinds.map((find) => (
          <FindMarker
            key={find.id}
            find={find}
            markerSize={markerSize}
            isHighlighted={Boolean(selectedDate && isFindInSortie(find, selectedDate))}
            onSelectFind={setOpenPopupFind}
          />
        ))
      )}
    </MapContainer>
    </div>
  );
}
