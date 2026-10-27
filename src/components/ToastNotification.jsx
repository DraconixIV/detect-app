import { useEffect, useState } from "react";

export default function ToastNotification({
  message,
  type,
  onClose
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getStyleConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: "✓",
          color: "#40916c"
        };
      case "error":
        return {
          icon: "✕",
          color: "#dc2626"
        };
      default:
        return {
          icon: "•",
          color: "#80b99c"
        };
    }
  };

  const config = getStyleConfig();

  return (
    <div
      data-testid="toast-notification"
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999999999,
        width: "90%",
        maxWidth: "380px",
        background: "rgba(17, 25, 21, 0.94)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderRadius: "14px",
        padding: "12px 16px",
        boxSizing: "border-box",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        animation: isExiting
          ? "toast-slide-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards"
          : "toast-slide-in 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
      }}
    >
      <style>{`
        @keyframes toast-slide-in {
          from {
            transform: translate(-50%, -40px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        @keyframes toast-slide-out {
          from {
            transform: translate(-50%, 0);
            opacity: 1;
          }
          to {
            transform: translate(-50%, -30px);
            opacity: 0;
          }
        }
      `}</style>

      {/* Icon Badge */}
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: config.color,
          fontSize: "12px",
          fontWeight: "400",
          border: `1px solid rgba(255,255,255,0.1)`,
          flexShrink: 0
        }}
      >
        {config.icon}
      </div>

      {/* Message Text */}
      <div
        style={{
          color: "#f1f5f2",
          fontSize: "13px",
          fontWeight: "400",
          lineHeight: "1.4",
          flex: 1
        }}
      >
        {message}
      </div>

      {/* Dismiss Button */}
      <button
        onClick={handleClose}
        style={{
          background: "transparent",
          border: "none",
          color: "#9aa8a0",
          cursor: "pointer",
          fontSize: "12px",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        ✕
      </button>
    </div>
  );
}
