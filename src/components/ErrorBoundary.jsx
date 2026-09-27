import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("GeoProspect Global ErrorBoundary caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    try {
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((reg) => reg.unregister());
        });
      }
      // Remove potentially corrupt sortie/session keys but keep user finds safely
      localStorage.removeItem("isRecordingSortie");
      localStorage.removeItem("isSortiePaused");
      localStorage.removeItem("sortieDistance");
      localStorage.removeItem("sortieElapsedSeconds");
      localStorage.removeItem("sortiePositions");
      localStorage.removeItem("geoprospect_active_session_v1");
    } catch (e) {
      console.warn("Storage reset error:", e);
    }
    setTimeout(() => {
      window.location.href = window.location.origin + "?cache_bust=" + Date.now();
    }, 200);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#0b1329",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
            boxSizing: "border-box"
          }}
        >
          <div style={{ fontSize: "44px", marginBottom: "14px" }}>🧭</div>
          <h2 style={{ fontSize: "20px", fontWeight: "900", margin: "0 0 10px 0", color: "#f8fafc" }}>
            GeoProspect
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", maxWidth: "300px", margin: "0 0 24px 0", lineHeight: "1.5" }}>
            Une mise à jour a été détectée ou une erreur est survenue lors du chargement.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "260px" }}>
            <button
              onClick={this.handleReload}
              style={{
                padding: "12px 16px",
                borderRadius: "14px",
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                fontWeight: "800",
                cursor: "pointer",
                fontSize: "14px",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)"
              }}
            >
              🔄 Recharger
            </button>
            <button
              onClick={this.handleResetStorage}
              style={{
                padding: "12px 16px",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#e2e8f0",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              🧹 Vider le cache & redémarrer
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
