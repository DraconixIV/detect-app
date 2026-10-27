import React from "react";

export default function ConsultationRequestModal({
  request,
  onApprove,
  onReject,
  theme = "dark"
}) {
  if (!request) return null;

  const isLight = theme === "light";
  const bg = isLight ? "#ffffff" : "#19231e";
  const border = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.08)";
  const inputBg = isLight ? "#f3f4f2" : "#111915";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100005,
        background: "rgba(8, 14, 11, 0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: bg,
          borderRadius: "20px",
          border: `1px solid ${border}`,
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.55)",
          padding: "22px 20px",
          color: textMain,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
      >
        {/* Header */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: "400", textTransform: "uppercase", color: textSub, letterSpacing: "0.5px", marginBottom: "4px" }}>
            Autorisation requise
          </div>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "400", color: textMain }}>
            Consultation de votre carte
          </h3>
        </div>

        {/* Content Box */}
        <div
          style={{
            background: inputBg,
            border: `1px solid ${border}`,
            borderRadius: "14px",
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div style={{ fontSize: "13px", lineHeight: "1.5", color: textMain }}>
            <span>{request.requesterName}</span>{" "}
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "11px", background: isLight ? "#e2e6e3" : "rgba(255, 255, 255, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
              {request.requesterCode}
            </span>{" "}
            souhaite consulter les trouvailles de votre carte en lecture seule.
          </div>

          <div style={{ fontSize: "11px", color: textSub, lineHeight: "1.4" }}>
            Vos trouvailles ne peuvent être ni modifiées ni supprimées. Vous pouvez révoquer cet accès à tout moment.
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            type="button"
            onClick={() => onApprove(request)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#2c5e4c",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "400",
              cursor: "pointer"
            }}
          >
            Autoriser l'accès à ma carte
          </button>

          <button
            type="button"
            onClick={() => onReject(request)}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: "10px",
              border: `1px solid ${border}`,
              background: inputBg,
              color: textSub,
              fontSize: "12px",
              fontWeight: "400",
              cursor: "pointer"
            }}
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}
