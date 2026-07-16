import { useEffect } from "react";
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

import { icons } from "../icons";
import FindPopup from "./FindPopup";
import GpsMarker from "./GpsMarker";
import MapLayers from "./MapLayers";

// Helper: Recenter map to target coords
function RecenterMap({ target, onRecentered }) {
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

// Helper: Intercept map context menu (long press) and map drag starts
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

// Helper: Custom Cluster Icon
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
        justifyContent: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
      ">
        ${count}
      </div>
    `,
    className: "custom-cluster-marker",
    iconSize: L.point(40, 40, true),
    iconAnchor: L.point(20, 20)
  });
};

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
  gpsStyle,
  useClustering,
  mapStyle,
  showHistoricalMap,
  historicalMapOpacity,
  positionedFinds = [],
  selectedDateTracks = [],
  handleMapLongPress,
  deleteFind,
  handleFavorite,
  loadFinds
}) {
  return (
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
  );
}
