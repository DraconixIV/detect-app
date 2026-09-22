import React from "react";

export default function ConsultationRequestModal({
  request,
  onApprove,
  onReject,
  theme = "dark"
}) {
  if (!request) return null;

  const isLight = theme === "light";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100005,
        background: "rgba(5, 8, 16, 0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        animation: "fadeIn 0.2s ease-out"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: isLight ? "#ffffff" : "#0f172a",
          borderRadius: "22px",
          border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(59, 130, 246, 0.35)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 25px rgba(59, 130, 246, 0.2)",
          padding: "24px 20px",
          color: isLight ? "#000000" : "#ffffff",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "18px"
        }}
      >
        {/* Header with Icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "rgba(59, 130, 246, 0.18)",
              border: "1px solid rgba(59, 130, 246, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              flexShrink: 0
            }}
          >
            🛡️
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: "#3b82f6", letterSpacing: "0.5px" }}>
              Autorisation Requise
            </div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: isLight ? "#0f172a" : "#ffffff" }}>
              Consultation de votre carte
            </h3>
          </div>
        </div>

        {/* Content Box */}
        <div
          style={{
            background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.04)",
            border: isLight ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div style={{ fontSize: "13px", lineHeight: "1.5", color: isLight ? "#1e293b" : "#f1f5f9" }}>
            <span style={{ fontWeight: "800", color: isLight ? "#0f172a" : "#60a5fa" }}>
              {request.requesterName}
            </span>{" "}
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "12px", background: isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
              {request.requesterCode}
            </span>{" "}
            souhaite consulter les trouvailles de votre carte en <strong>lecture seule</strong>.
          </div>

          <div style={{ fontSize: "11px", color: isLight ? "#64748b" : "#94a3b8", lineHeight: "1.4" }}>
            🔒 Vos trouvailles ne peuvent être ni modifiées ni supprimées. Vous pouvez révoquer cet accès à tout moment.
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            type="button"
            onClick={() => onApprove(request)}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "transform 0.1s"
            }}
          >
            <span>✓</span>
            <span>Autoriser l'accès à ma carte</span>
          </button>

          <button
            type="button"
            onClick={() => onReject(request)}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: "12px",
              border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.15)",
              background: isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.06)",
              color: isLight ? "#475569" : "#cbd5e1",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <span>✕ Refuser</span>
          </button>
        </div>
      </div>
    </div>
  );
}
