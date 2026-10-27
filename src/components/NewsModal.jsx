import React, { useEffect } from "react";
import { markUpdateAsSeen, APP_RELEASES } from "../services/feedbackService";

export default function NewsModal({ isOpen, onClose, onOpenFeedback, theme = "dark" }) {
  useEffect(() => {
    if (isOpen) {
      markUpdateAsSeen();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLight = theme === "light";
  const bgModal = isLight ? "#f3f4f2" : "#111915";
  const sheetBg = isLight ? "#ffffff" : "#19231e";
  const cardBorder = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.08)";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";

  const handleClose = () => {
    markUpdateAsSeen();
    onClose();
  };

  const handleFeedbackClick = () => {
    handleClose();
    if (onOpenFeedback) {
      onOpenFeedback();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(8, 14, 11, 0.8)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          maxHeight: "85vh",
          background: bgModal,
          borderRadius: "20px",
          border: `1px solid ${cardBorder}`,
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: "#2c5e4c",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "400", color: "#ffffff" }}>
              Mises à jour
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "rgba(255,255,255,0.75)" }}>
              Dernières évolutions de GeoProspect
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: "rgba(255,255,255,0.14)",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* Feedback prompt banner */}
        <div
          style={{
            padding: "12px 18px",
            background: sheetBg,
            borderBottom: `1px solid ${cardBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px"
          }}
        >
          <div style={{ fontSize: "12px", color: textMain, fontWeight: "400" }}>
            Une idée ou un problème à signaler ?
          </div>
          <button
            type="button"
            onClick={handleFeedbackClick}
            style={{
              padding: "7px 14px",
              borderRadius: "999px",
              background: "#2c5e4c",
              border: "none",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: "400",
              cursor: "pointer"
            }}
          >
            Formulaire de retour
          </button>
        </div>

        {/* Content list */}
        <div
          style={{
            padding: "16px 18px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          {APP_RELEASES.filter((r) => r.id === "1.4.0").map((item) => (
            <div
              key={item.id}
              style={{
                padding: "14px 16px",
                borderRadius: "16px",
                background: sheetBg,
                border: `1px solid ${cardBorder}`,
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", fontWeight: "400", color: textMain }}>
                  {item.version}
                </span>
                <span style={{ fontSize: "11px", color: textSub, fontWeight: "400" }}>{item.date}</span>
              </div>

              <div style={{ fontSize: "13px", fontWeight: "400", color: textMain }}>
                {item.title}
              </div>

              {item.highlights && item.highlights.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "2px" }}>
                  {item.highlights.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: "12px",
                        color: textSub,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "6px",
                        lineHeight: "1.45"
                      }}
                    >
                      <span style={{ color: textSub, flexShrink: 0 }}>•</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
