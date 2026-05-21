import { Polyline } from "react-leaflet";

function TrackLines({
  track,
  visible
}) {
  if (
    !visible ||
    !track ||
    track.length < 2
  ) {
    return null;
  }

  return (
    <Polyline
      positions={track}
      pathOptions={{
        color: "blue",
        weight: 4,
        opacity: 0.8
      }}
    />
  );
}

export default TrackLines;