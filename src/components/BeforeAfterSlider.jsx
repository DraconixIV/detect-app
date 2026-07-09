import { useState } from "react";

export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl
}) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", width: "100%" }}>
      <label style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", alignSelf: "flex-start", color: "#9ca3af" }}>
        Comparaison Avant / Après
      </label>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "240px",
          borderRadius: "14px",
          overflow: "hidden",
          userSelect: "none",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          background: "rgba(0,0,0,0.3)"
        }}
      >
        {/* Cleaned Image (AFTER) in Background */}
        <img
          src={afterUrl}
          alt="Après"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            background: "rgba(0,0,0,0.5)",
            position: "absolute",
            top: 0,
            left: 0
          }}
        />

        {/* Discovery Image (BEFORE) Clipped on Top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
          }}
        >
          <img
            src={beforeUrl}
            alt="Avant"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "rgba(0,0,0,0.5)"
            }}
          />
        </div>

        {/* Slider Center Line Handle */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sliderPos}%`,
            width: "2px",
            background: "white",
            boxShadow: "0 0 10px rgba(0,0,0,0.6)",
            pointerEvents: "none",
            zIndex: 10
          }}
        >
          {/* Round Slider Icon */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "32px",
              height: "32px",
              background: "#2563eb",
              border: "3px solid white",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "11px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
            }}
          >
            ↔
          </div>
        </div>

        {/* Full Viewport Invisible Input Range */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "ew-resize",
            zIndex: 20
          }}
        />
      </div>
    </div>
  );
}
