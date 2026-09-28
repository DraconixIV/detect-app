export default function ConfirmModal({
  title = "Confirmation",
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  icon = "⚠️",
  confirmColor = "#ef4444",
  onConfirm,
  onCancel
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(5, 8, 16, 0.82)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 1000000000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
      onClick={(e) => {
        e.stopPropagation();
        onCancel();
      }}
    >
      <div
        style={{
          background: "#0f172a",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "22px",
          width: "100%",
          maxWidth: "380px",
          padding: "24px 22px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.85)",
          animation: "confirm-pop 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Keyframe Animation */}
        <style>{`
          @keyframes confirm-pop {
            from {
              transform: scale(0.93);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>

        {/* Icon Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: confirmColor === "#ef4444" ? "rgba(239, 68, 68, 0.15)" : "rgba(37, 99, 235, 0.15)",
              border: confirmColor === "#ef4444" ? "1px solid rgba(239, 68, 68, 0.25)" : "1px solid rgba(37, 99, 235, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0
            }}
          >
            {icon}
          </div>
          <div>
            <h4 style={{ margin: 0, color: "#ffffff", fontSize: "16px", fontWeight: "800", letterSpacing: "-0.2px" }}>
              {title}
            </h4>
          </div>
        </div>

        {/* Message */}
        <p
          style={{
            margin: 0,
            color: "#cbd5e1",
            fontSize: "13.5px",
            lineHeight: "1.55",
            fontWeight: "500"
          }}
        >
          {message}
        </p>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "rgba(255, 255, 255, 0.06)",
              color: "#e2e8f0",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            style={{
              flex: 1.3,
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background: confirmColor,
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: confirmColor === "#ef4444" ? "0 4px 14px rgba(239, 68, 68, 0.35)" : "0 4px 14px rgba(37, 99, 235, 0.35)",
              transition: "transform 0.15s, filter 0.15s"
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
