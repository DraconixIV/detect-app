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
  } else {
    baseLayerUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    baseLayerAttribution = "&copy; Esri";
  }

  return (
    <>
      <TileLayer
        key={baseLayerUrl}
        attribution={baseLayerAttribution}
        url={baseLayerUrl}
      />
      {showHistoricalMap && (
        <TileLayer
          key="cassini-overlay"
          pane="overlayPane"
          attribution="&copy; IGN, BnF"
          url="https://data.geopf.fr/wmts?layer=BNF-IGNF_GEOGRAPHICALGRIDSYSTEMS.CASSINI&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix={z}&TileCol={x}&TileRow={y}"
          opacity={historicalMapOpacity}
          maxZoom={20}
          minZoom={0}
        />
      )}
    </>
  );
}