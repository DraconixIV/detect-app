import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

// Style 1: Pulsing Glowing Blue Dot (Google Maps style)
const blueDotHtml = `
  <div class="gps-blue-wrapper">
    <div class="gps-blue-pulse"></div>
    <div class="gps-blue-dot"></div>
  </div>
`;

// Style 2: Radar target reticle (High-Tech Green Locator)
const radarHtml = `
  <div class="gps-radar-wrapper">
    <div class="gps-radar-ring"></div>
    <div class="gps-radar-cross-h"></div>
    <div class="gps-radar-cross-v"></div>
    <div class="gps-radar-center"></div>
  </div>
`;

// Style 3: Royal Crown Gold Pointer (GeoProspect theme)
const royalHtml = `
  <div class="gps-royal-wrapper">
    <div class="gps-royal-halo"></div>
    <div class="gps-royal-dot"></div>
  </div>
`;

const iconsMap = {
  "blue-dot": new L.DivIcon({
    className: "",
    html: blueDotHtml,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  }),
  "radar": new L.DivIcon({
    className: "",
    html: radarHtml,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  }),
  "royal-pointer": new L.DivIcon({
    className: "",
    html: royalHtml,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
};

export default function GpsMarker({ position, gpsStyle = "blue-dot" }) {
  const selectedIcon = iconsMap[gpsStyle] || iconsMap["blue-dot"];

  return (
    <Marker position={position} icon={selectedIcon}>
      <style>{`
        .gps-popup .leaflet-popup-content-wrapper {
          background: rgba(17, 24, 39, 0.92) !important;
          backdrop-filter: blur(12px) !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 14px !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5) !important;
        }
        .gps-popup .leaflet-popup-tip {
          background: rgba(17, 24, 39, 0.92) !important;
          border-left: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: none !important;
        }
        .gps-popup .leaflet-popup-content {
          margin: 6px 12px !important;
          font-family: system-ui, -apple-system, sans-serif !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          color: white !important;
          text-align: center !important;
        }
      `}</style>
      <Popup className="gps-popup" closeButton={false} autoPan={false}>
        📍 Vous êtes ici
      </Popup>
    </Marker>
  );
}