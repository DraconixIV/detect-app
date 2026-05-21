export default function MapControls({
  followGps,
  setFollowGps,
  mapStyle,
  setMapStyle,
  showHeatmap,
  setShowHeatmap
}) {
  return (
    <>
      <button
        onClick={() =>
          setFollowGps(
            !followGps
          )
        }
      >
        {followGps
          ? "📍 GPS ON"
          : "📍 GPS OFF"}
      </button>

      <button
        onClick={() =>
          setMapStyle(
            mapStyle === "plan"
              ? "satellite"
              : "plan"
          )
        }
      >
        {mapStyle === "plan"
          ? "🛰️ Satellite"
          : "🗺️ Plan"}
      </button>

      <button
        onClick={() =>
          setShowHeatmap(
            !showHeatmap
          )
        }
      >
        🔥 Heatmap
      </button>
    </>
  );
}