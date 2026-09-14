export default function LoadingScreen() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        color: "#0f172a",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        zIndex: 999999
      }}
    >
      <div style={{ fontSize: "28px" }}>🧭</div>
      <div style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
        Chargement de la carte...
      </div>
    </div>
  );
}