export default function ConfirmModal({
  message,
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
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 999999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
      onClick={(e) => {
        e.stopPropagation();
        onCancel();
      }}
    >
      <div
        style={{
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "360px",
          padding: "22px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.6)",
          animation: "confirm-pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Keyframe Animation */}
        <style>{`
          @keyframes confirm-pop {
            from {
              transform: scale(0.92);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>

        {/* Warning Icon Banner */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: "#ef4444"
            }}
          >
            ⚠️
          </div>
          <h4 style={{ margin: 0, color: "white", fontSize: "16px", fontWeight: "800" }}>
            Confirmation
          </h4>
        </div>

        {/* Message */}
        <p
          style={{
            margin: 0,
            color: "#d1d5db",
            fontSize: "13.5px",
            lineHeight: "1.5",
            fontWeight: "500"
          }}
        >
          {message}
        </p>

        {/* Actions buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "white",
              fontSize: "12.5px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Annuler
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            style={{
              flex: 1.5,
              padding: "11px",
              borderRadius: "12px",
              border: "none",
              background: "#ef4444",
              color: "white",
              fontSize: "12.5px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)"
            }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
