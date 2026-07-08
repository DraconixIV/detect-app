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
          attribution="&copy; IGN, BnF"
          url="https://data.geopf.fr/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=BNF-IGNF_GEOGRAPHICALGRIDSYSTEMS.CASSINI&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png"
          opacity={historicalMapOpacity}
          maxZoom={20}
          maxNativeZoom={15}
          minZoom={0}
        />
      )}
    </>
  );
}