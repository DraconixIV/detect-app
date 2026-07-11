import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

// Style 1: Pulsing Glowing Blue Dot (Google Maps style)
const blueDotHtml = `
  <style>
    @keyframes gpsPulse {
      0% {
        transform: scale(0.5);
        opacity: 1;
      }
      100% {
        transform: scale(2.0);
        opacity: 0;
      }
    }
    .gps-blue-wrapper {
      position: relative;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .gps-blue-dot {
      width: 12px;
      height: 12px;
      background: #3b82f6;
      border: 2.2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
      z-index: 2;
    }
    .gps-blue-pulse {
      position: absolute;
      width: 24px;
      height: 24px;
      background: rgba(59, 130, 246, 0.45);
      border-radius: 50%;
      animation: gpsPulse 2s infinite ease-out;
      z-index: 1;
    }
  </style>
  <div class="gps-blue-wrapper">
    <div class="gps-blue-pulse"></div>
    <div class="gps-blue-dot"></div>
  </div>
`;

// Style 2: Radar target reticle (High-Tech Green Locator)
const radarHtml = `
  <style>
    @keyframes radarSweep {
      0% {
        transform: scale(0.4);
        opacity: 1;
        border-color: rgba(16, 185, 129, 0.8);
      }
      100% {
        transform: scale(1.8);
        opacity: 0;
        border-color: rgba(16, 185, 129, 0);
      }
    }
    .gps-radar-wrapper {
      position: relative;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .gps-radar-center {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.9);
      z-index: 3;
    }
    .gps-radar-ring {
      position: absolute;
      width: 22px;
      height: 22px;
      border: 1.5px solid #10b981;
      border-radius: 50%;
      animation: radarSweep 1.8s infinite linear;
      z-index: 1;
    }
    .gps-radar-cross-h {
      position: absolute;
      width: 18px;
      height: 1px;
      background: rgba(16, 185, 129, 0.5);
      z-index: 2;
    }
    .gps-radar-cross-v {
      position: absolute;
      width: 1px;
      height: 18px;
      background: rgba(16, 185, 129, 0.5);
      z-index: 2;
    }
  </style>
  <div class="gps-radar-wrapper">
    <div class="gps-radar-ring"></div>
    <div class="gps-radar-cross-h"></div>
    <div class="gps-radar-cross-v"></div>
    <div class="gps-radar-center"></div>
  </div>
`;

// Style 3: Royal Crown Gold Pointer (RDL / Lespignan theme)
const royalHtml = `
  <style>
    @keyframes royalHalo {
      0% {
        transform: scale(0.7);
        box-shadow: 0 0 4px rgba(251, 191, 36, 0.3);
      }
      50% {
        transform: scale(1.2);
        box-shadow: 0 0 12px rgba(251, 191, 36, 0.7);
      }
      100% {
        transform: scale(0.7);
        box-shadow: 0 0 4px rgba(251, 191, 36, 0.3);
      }
    }
    .gps-royal-wrapper {
      position: relative;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .gps-royal-dot {
      width: 10px;
      height: 10px;
      background: #fbbf24;
      border: 2px solid #111827;
      border-radius: 50%;
      box-shadow: 0 0 4px rgba(0,0,0,0.5);
      z-index: 3;
    }
    .gps-royal-halo {
      position: absolute;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: rgba(251, 191, 36, 0.15);
      border: 1.5px solid rgba(251, 191, 36, 0.45);
      animation: royalHalo 2.5s infinite ease-in-out;
      z-index: 1;
    }
  </style>
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