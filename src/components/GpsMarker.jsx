import L from "leaflet";

import {
  Marker,
  Popup
} from "react-leaflet";

const gpsIcon = new L.DivIcon({
  className: "",

  html: `
    <div
      style="
        width:24px;
        height:24px;
        border:4px solid red;
        border-radius:50%;
        background:transparent;
        box-sizing:border-box;
      "
    ></div>
  `,

  iconSize: [24, 24],

  iconAnchor: [12, 12]
});

export default function GpsMarker({
  position
}) {
  return (
    <Marker
      position={position}
      icon={gpsIcon}
    >
      <Popup>
        📍 Vous êtes ici
      </Popup>
    </Marker>
  );
}