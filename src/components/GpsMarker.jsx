import React, { useMemo } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

export default function GpsMarker({ position, gpsStyle = "blue-dot" }) {
  const icon = useMemo(() => {
    if (gpsStyle === "radar") {
      return L.divIcon({
        className: "custom-gps-marker-container",
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; pointer-events: none;">
            <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: rgba(16, 185, 129, 0.35); animation: gpsRadarPulse 1.8s infinite ease-out;"></div>
            <div style="position: absolute; width: 18px; height: 18px; border: 1.5px dashed #10b981; border-radius: 50%;"></div>
            <div style="position: absolute; width: 10px; height: 10px; background: #10b981; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px #10b981; z-index: 2;"></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
    }

    if (gpsStyle === "royal-pointer") {
      return L.divIcon({
        className: "custom-gps-marker-container",
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; pointer-events: none;">
            <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: rgba(245, 158, 11, 0.35); animation: gpsRadarPulse 2s infinite ease-out;"></div>
            <div style="position: absolute; width: 14px; height: 14px; background: #f59e0b; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 12px #f59e0b; z-index: 2;"></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
    }

    // Default: Pulsing Glowing Blue/Cyan GPS Dot
    return L.divIcon({
      className: "custom-gps-marker-container",
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; pointer-events: none;">
          <!-- Glowing Animated Radar Pulse Wave -->
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(14, 165, 233, 0.45);
            animation: gpsRadarPulse 1.8s infinite ease-out;
          "></div>
          <!-- Precision Outer White Glow Ring -->
          <div style="
            position: absolute;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.95);
            box-shadow: 0 0 10px rgba(14, 165, 233, 0.9);
          "></div>
          <!-- Solid Core Marker Dot -->
          <div style="
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #0284c7;
            border: 2.5px solid #ffffff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6), 0 0 12px #38bdf8;
            z-index: 2;
          "></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
  }, [gpsStyle]);

  if (!position || !Array.isArray(position) || typeof position[0] !== "number" || typeof position[1] !== "number") {
    return null;
  }

  return (
    <Marker position={position} icon={icon} zIndexOffset={2000}>
      <style>{`
        @keyframes gpsRadarPulse {
          0% { transform: scale(0.35); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
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