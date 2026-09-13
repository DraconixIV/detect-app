import React, { useState, useEffect } from "react";

export default function WelcomeGate({
  isOpen,
  onEnter,
  onDevSkip,
  findsCount = 0,
  tracksCount = 0,
  isOnline = true
}) {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    if (!isOpen) return;

    const timer1 = setTimeout(() => setProgress(55), 200);
    const timer2 = setTimeout(() => setProgress(85), 450);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setLoaded(true);
    }, 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "radial-gradient(circle at 50% 30%, #111827 0%, #080c14 100%)",
        color: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 20px env(safe-area-inset-bottom, 24px) 20px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxSizing: "border-box",
        userSelect: "none"
      }}
    >
      {/* Top Bar */}
      <div style={{ width: "100%", maxWidth: "420px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: isOnline ? "#10b981" : "#f59e0b",
              boxShadow: isOnline ? "0 0 8px rgba(16, 185, 129, 0.4)" : "none"
            }}
          />
          <span style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", letterSpacing: "0.2px" }}>
            {isOnline ? "Système synchronisé" : "Mode local actif"}
          </span>
        </div>

        {/* Developer Quick Bypass Button */}
        <button
          type="button"
          onClick={onDevSkip || onEnter}
          style={{
            padding: "4px 8px",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            background: "rgba(255, 255, 255, 0.04)",
            color: "#94a3b8",
            fontSize: "10px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
          }}
          title="Bypass pour le développement"
        >
          Dev Skip
        </button>
      </div>

      {/* Center Branding & Telemetry Cards */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: "380px", width: "100%" }}>
        {/* Minimalist Vector Emblem */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "18px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)"
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="rgba(59, 130, 246, 0.25)" />
          </svg>
        </div>

        <h1
          style={{
            margin: "0 0 4px 0",
            fontSize: "22px",
            fontWeight: "800",
            letterSpacing: "0.5px",
            color: "#ffffff"
          }}
        >
          RDL DETECT
        </h1>

        <div
          style={{
            fontSize: "12px",
            fontWeight: "500",
            color: "#94a3b8",
            marginBottom: "24px"
          }}
        >
          Carnet de bord & Télémétrie de prospection
        </div>

        {/* Progress bar */}
        <div style={{ width: "100%", marginBottom: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "600", marginBottom: "6px", color: "#64748b" }}>
            <span>{loaded ? "Prêt" : "Initialisation des cartes..."}</span>
            <span>{progress}%</span>
          </div>
          <div style={{ width: "100%", height: "4px", borderRadius: "2px", background: "rgba(255, 255, 255, 0.06)", overflow: "hidden" }}>
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: "2px",
                background: "#3b82f6",
                transition: "width 0.3s ease"
              }}
            />
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", width: "100%", marginBottom: "10px" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "12px",
              padding: "12px 14px",
              textAlign: "left"
            }}
          >
            <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.4px" }}>
              Trouvailles
            </div>
            <div style={{ fontSize: "16px", fontWeight: "700", marginTop: "2px", color: "#f8fafc" }}>
              {findsCount} <span style={{ fontSize: "11px", fontWeight: "400", color: "#94a3b8" }}>enregistrées</span>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "12px",
              padding: "12px 14px",
              textAlign: "left"
            }}
          >
            <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.4px" }}>
              Parcours
            </div>
            <div style={{ fontSize: "16px", fontWeight: "700", marginTop: "2px", color: "#f8fafc" }}>
              {tracksCount} <span style={{ fontSize: "11px", fontWeight: "400", color: "#94a3b8" }}>sorties</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Entry Button */}
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <button
          type="button"
          onClick={onEnter}
          style={{
            width: "100%",
            padding: "14px 20px",
            borderRadius: "12px",
            border: "none",
            background: "#2563eb",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "700",
            letterSpacing: "0.2px",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
        >
          <span>Accéder à l'application</span>
          <span style={{ fontSize: "15px" }}>➔</span>
        </button>

        <p style={{ margin: "12px 0 0 0", textAlign: "center", fontSize: "11px", color: "#64748b" }}>
          Données cryptées & carnet de prospection privé
        </p>
      </div>
    </div>
  );
}

