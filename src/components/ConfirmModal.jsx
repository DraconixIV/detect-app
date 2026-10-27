export default function ConfirmModal({
  title = "Confirmation",
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  icon = null,
  confirmColor = "#dc2626",
  onConfirm,
  onCancel,
  theme = "dark"
}) {
  const isLight = theme === "light";
  const bg = isLight ? "#ffffff" : "#19231e";
  const border = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.08)";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(8, 14, 11, 0.82)",
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
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: "18px",
          width: "100%",
          maxWidth: "380px",
          padding: "22px 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h4 style={{ margin: "0 0 6px 0", color: textMain, fontSize: "16px", fontWeight: "400", letterSpacing: "-0.2px" }}>
            {title}
          </h4>
          <p
            style={{
              margin: 0,
              color: textSub,
              fontSize: "13px",
              lineHeight: "1.5",
              fontWeight: "400"
            }}
          >
            {message}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "10px",
              border: `1px solid ${border}`,
              background: isLight ? "#f3f4f2" : "#111915",
              color: textSub,
              fontSize: "13px",
              fontWeight: "400",
              cursor: "pointer"
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
              flex: 1.2,
              padding: "11px",
              borderRadius: "10px",
              border: "none",
              background: confirmColor || "#dc2626",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "400",
              cursor: "pointer"
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
