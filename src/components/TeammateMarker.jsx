import React, { useMemo } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

function getDistanceMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371e3; // meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function formatDistance(meters) {
  if (meters === null || meters === undefined) return null;
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function TeammateMarker({ teammate, myPosition }) {
  const { userCode, userName, position } = teammate;

  const distanceText = useMemo(() => {
    if (!myPosition || !position) return null;
    const d = getDistanceMeters(myPosition[0], myPosition[1], position[0], position[1]);
    return formatDistance(d);
  }, [myPosition, position]);

  const customIcon = useMemo(() => {
    const cleanName = (userName || `Détecteuriste ${userCode?.slice(-4) || ""}`)
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return L.divIcon({
      className: "teammate-gps-marker-custom",
      html: `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        ">
          <!-- Teammate Name Badge Tag -->
          <div style="
            background: rgba(15, 23, 42, 0.95);
            color: #ffffff;
            border: 1.5px solid #10b981;
            border-radius: 12px;
            padding: 3px 8px;
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 4px 14px rgba(0,0,0,0.6);
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 2px;
          ">
            <span style="width: 7px; height: 7px; background: #10b981; border-radius: 50%; display: inline-block; box-shadow: 0 0 6px #10b981;"></span>
            <span>${cleanName}</span>
          </div>

          <!-- Pulsing Live Radar Beacon -->
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
            <div style="
              position: absolute;
              width: 24px;
              height: 24px;
              background: rgba(16, 185, 129, 0.45);
              border-radius: 50%;
              animation: teammatePulseRing 2s infinite ease-out;
            "></div>
            <div style="
              width: 14px;
              height: 14px;
              background: #10b981;
              border: 2.5px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 10px rgba(16, 185, 129, 0.9);
              z-index: 2;
            "></div>
          </div>
        </div>
      `,
      iconSize: [140, 60],
      iconAnchor: [70, 48]
    });
  }, [userName, userCode]);

  if (!position || !Array.isArray(position) || position.length < 2) return null;

  return (
    <Marker position={position} icon={customIcon}>
      <Popup className="gps-popup" autoPan={false}>
        <div style={{ padding: "4px 2px", textAlign: "left", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ fontSize: "13px", fontWeight: "800", color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>🟢</span>
            <span>{userName || "Coéquipier"}</span>
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px", fontFamily: "ui-monospace, monospace" }}>
            Code : {userCode}
          </div>
          {distanceText && (
            <div style={{ fontSize: "11px", color: "#e2e8f0", marginTop: "6px", fontWeight: "600" }}>
              📍 À {distanceText} de vous
            </div>
          )}
          <div style={{ fontSize: "10px", color: "#6ee7b7", marginTop: "4px" }}>
            ✨ En direct sur le terrain
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
