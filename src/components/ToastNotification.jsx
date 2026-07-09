import { useEffect, useState } from "react";

export default function ToastNotification({
  message,
  type,
  onClose
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Auto-close after 3 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // match fade-out animation length
  };

  const getStyleConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: "✓",
          color: "#22c55e",
          bgGlow: "rgba(34, 197, 94, 0.15)"
        };
      case "error":
        return {
          icon: "⚠️",
          color: "#ef4444",
          bgGlow: "rgba(239, 68, 68, 0.15)"
        };
      default:
        return {
          icon: "ℹ️",
          color: "#3b82f6",
          bgGlow: "rgba(59, 130, 246, 0.15)"
        };
    }
  };

  const config = getStyleConfig();

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999999999,
        width: "90%",
        maxWidth: "400px",
        background: "rgba(17, 24, 39, 0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderRadius: "18px",
        padding: "14px 18px",
        boxSizing: "border-box",
        border: `1px solid rgba(255, 255, 255, 0.08)`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px ${config.bgGlow}`,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        animation: isExiting
          ? "toast-slide-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards"
          : "toast-slide-in 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
      }}
    >
      {/* Dynamic CSS Keyframes */}
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
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: `rgba(255,255,255,0.06)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: config.color,
          fontSize: type === "success" ? "16px" : "13px",
          fontWeight: "bold",
          border: `1px solid ${config.color}33`,
          flexShrink: 0
        }}
      >
        {config.icon}
      </div>

      {/* Message Text */}
      <div
        style={{
          color: "#f3f4f6",
          fontSize: "13.5px",
          fontWeight: "600",
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
          color: "#9ca3af",
          cursor: "pointer",
          fontSize: "12px",
          padding: "4px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "0.2s",
          alignSelf: "flex-start",
          marginTop: "-2px"
        }}
        onMouseEnter={(e) => (e.target.style.color = "white")}
        onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
      >
        ✕
      </button>
    </div>
  );
}
