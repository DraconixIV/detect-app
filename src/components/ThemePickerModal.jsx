import React from "react";
import { THEMES } from "../styles/themes";

export default function ThemePickerModal({
  isOpen,
  onClose,
  currentThemeKey,
  onSelectTheme
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#111827",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "24px",
          padding: "20px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.7)",
          color: "white",
          boxSizing: "border-box"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🎨</span> Palettes & Direction Artistique
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", opacity: 0.7 }}>
              Testez en direct les ambiances visuelles pour votre application
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* Theme cards list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "65vh", overflowY: "auto", paddingRight: "4px" }}>
          {Object.values(THEMES).map((th) => {
            const isSelected = currentThemeKey === th.id;
            const c = th.colors;

            return (
              <div
                key={th.id}
                onClick={() => {
                  onSelectTheme(th.id);
                }}
                style={{
                  padding: "14px",
                  borderRadius: "16px",
                  border: isSelected ? `2px solid ${c.accent}` : "1px solid rgba(255,255,255,0.1)",
                  background: isSelected ? `${c.accent}15` : "rgba(255,255,255,0.04)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  boxShadow: isSelected ? `0 4px 16px ${c.accent}33` : "none"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "22px" }}>{th.icon}</span>
                    <div>
                      <div style={{ fontWeight: "800", fontSize: "14px", color: isSelected ? c.accent : "#ffffff" }}>
                        {th.name}
                      </div>
                      <div style={{ fontSize: "10px", opacity: 0.6 }}>{th.badge}</div>
                    </div>
                  </div>

                  {/* Color palette sample swatches */}
                  <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: c.bgPrimary, border: "1px solid rgba(255,255,255,0.2)" }} />
                    <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: c.accent }} />
                    <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: c.accentSecondary }} />
                    {isSelected && (
                      <span style={{ fontSize: "14px", color: c.accent, marginLeft: "4px" }}>✓</span>
                    )}
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: "11px", opacity: 0.8, lineHeight: "1.4" }}>
                  {th.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              fontWeight: "800",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            Valider cette Palette ✅
          </button>
        </div>
      </div>
    </div>
  );
}
