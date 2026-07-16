export default function OutingWidget({
  isRecordingSortie,
  sortieDistance
}) {
  return (
    isRecordingSortie && (
      <div
        style={{
          background: "rgba(239, 68, 68, 0.9)",
          color: "white",
          padding: "6px 12px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}
      >
        <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "white" }}></span>
        Sortie active : {(sortieDistance / 1000).toFixed(2)} km
      </div>
    )
  );
}
