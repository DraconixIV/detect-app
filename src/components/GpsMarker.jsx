import L from "leaflet";

import {
  Marker,
  Popup
} from "react-leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";

import markerIcon from "leaflet/dist/images/marker-icon.png";

import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* FIX ICONE LEAFLET VITE */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    markerIcon2x,

  iconUrl:
    markerIcon,

  shadowUrl:
    markerShadow
});

export default function GpsMarker({
  position
}) {
  return (
    <Marker position={position}>
      <Popup>
        Vous êtes ici 📍
      </Popup>
    </Marker>
  );
}