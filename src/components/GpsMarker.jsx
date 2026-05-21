import { Marker, Popup } from "react-leaflet";

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