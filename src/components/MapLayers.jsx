import { TileLayer } from "react-leaflet";

export default function MapLayers({
  mapStyle
}) {
  if (mapStyle === "plan") {
    return (
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    );
  }

  return (
    <TileLayer
      attribution="&copy; Esri"
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    />
  );
}