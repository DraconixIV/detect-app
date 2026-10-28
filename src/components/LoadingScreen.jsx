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
      <div style={{ width: "32px", height: "32px", margin: "0 auto", borderRadius: "50%", background: "#2c5e4c", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg></div>
      <div style={{ fontSize: "14px", fontWeight: "400", color: "#64748b" }}>
        Chargement de la carte...
      </div>
    </div>
  );
}