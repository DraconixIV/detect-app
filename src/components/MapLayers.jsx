import { TileLayer } from "react-leaflet";

export default function MapLayers({
  mapStyle,
  showHistoricalMap,
  historicalMapOpacity
}) {
  let baseLayerUrl = "";
  let baseLayerAttribution = "";

  if (mapStyle === "plan") {
    baseLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    baseLayerAttribution = "&copy; OpenStreetMap contributors";
  } else if (mapStyle === "tactique") {
    baseLayerUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    baseLayerAttribution = "&copy; OpenStreetMap contributors &copy; CARTO";
  } else {
    baseLayerUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    baseLayerAttribution = "&copy; Esri";
  }

  return (
    <>
      <TileLayer
        attribution={baseLayerAttribution}
        url={baseLayerUrl}
      />
      {showHistoricalMap && (
        <TileLayer
          attribution="&copy; Carte de Cassini (OSM France / IGN)"
          url="https://{s}.tile.openstreetmap.fr/cassini/{z}/{x}/{y}.png"
          opacity={historicalMapOpacity}
          zIndex={10}
        />
      )}
    </>
  );
}