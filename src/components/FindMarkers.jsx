import {
  Marker,
  Popup
} from "react-leaflet";

import FindPopup from "./FindPopup";

function offsetPosition(
  position,
  index
) {
  const radius = 0.00012;

  const angle =
    index * 45 * (Math.PI / 180);

  return [
    position[0] +
      Math.sin(angle) *
        radius,

    position[1] +
      Math.cos(angle) *
        radius
  ];
}

export default function FindMarkers({
  filteredFinds,
  icons
}) {
  return (
    <>
      {filteredFinds.map(
        (find, index) => (
          <Marker
            key={find.id}
            position={offsetPosition(
              find.position,
              index
            )}
            icon={
              icons[
                find.category
              ] ||
              icons.autre
            }
          >
            <Popup>
              <FindPopup
                find={find}
              />
            </Popup>
          </Marker>
        )
      )}
    </>
  );
}