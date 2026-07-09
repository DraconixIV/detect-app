import { useState, useRef } from "react";

export default function CropperModal({
  imageSrc,
  onCrop,
  onClose
}) {
  const displaySrc = (imageSrc && (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")))
    ? `${imageSrc}${imageSrc.includes("?") ? "&" : "?"}nocache=${Date.now()}`
    : imageSrc;

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [maskShape, setMaskShape] = useState("circle"); // 'circle' | 'rect'

  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  // Mouse / Touch drag handlers
  const handleStart = (e) => {
    isDragging.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startX.current = clientX - posX;
    startY.current = clientY - posY;
  };

  const handleMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPosX(clientX - startX.current);
    setPosY(clientY - startY.current);
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  const handleCropClick = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // HD Crop square size
    canvas.width = 500;
    canvas.height = 500;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, 500, 500);
      
      // Save state
      ctx.save();
      
      // Translate to center of canvas for rotation and zoom
      ctx.translate(250, 250);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);
      
      // Scale translation to match canvas resolution (500px vs 300px viewport)
      const scaleFactor = 500 / 300;
      ctx.translate(posX * scaleFactor / zoom, posY * scaleFactor / zoom);

      // Determine dimensions to fill viewport
      const imgRatio = img.width / img.height;
      let drawW, drawH;
      if (imgRatio > 1) {
        drawH = 300;
        drawW = 300 * imgRatio;
      } else {
        drawW = 300;
        drawH = 300 / imgRatio;
      }

      const canvasDrawW = drawW * scaleFactor;
      const canvasDrawH = drawH * scaleFactor;

      ctx.drawImage(img, -canvasDrawW / 2, -canvasDrawH / 2, canvasDrawW, canvasDrawH);
      
      ctx.restore();

      canvas.toBlob(
        (blob) => {
          onCrop(blob);
        },
        "image/jpeg",
        0.85
      );
    };
    img.src = displaySrc;
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.9)",
        zIndex: 9999999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: "16px",
        boxSizing: "border-box"
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)"
        }}
      >
        {/* Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0, color: "white", fontSize: "15px", fontWeight: "800" }}>
            📐 Centrer & Aligner la Trouvaille
          </h4>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            ✕
          </button>
        </div>

        {/* Viewport Box (300x300) */}
        <div
          ref={containerRef}
          style={{
            width: "300px",
            height: "300px",
            position: "relative",
            overflow: "hidden",
            borderRadius: "16px",
            background: "#000",
            cursor: "move",
            alignSelf: "center",
            touchAction: "none"
          }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          {/* Image to crop */}
          <img
            src={displaySrc}
            crossOrigin="anonymous"
            alt="To Crop"
            draggable="false"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: `translate(${posX}px, ${posY}px) rotate(${rotation}deg) scale(${zoom})`,
              transformOrigin: "center",
              pointerEvents: "none"
            }}
          />

          {/* Glowing Cutout Mask */}
          <div
            style={{
              position: "absolute",
              top: "50px",
              left: "50px",
              width: "200px",
              height: "200px",
              borderRadius: maskShape === "circle" ? "50%" : "12px",
              boxShadow: "0 0 0 9999px rgba(17, 24, 39, 0.75)",
              border: "2px solid #60a5fa",
              pointerEvents: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Control Tools */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          {/* Mask Shape Toggle */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setMaskShape("circle")}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "10px",
                border: "none",
                background: maskShape === "circle" ? "#2563eb" : "rgba(255,255,255,0.06)",
                color: "white",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              ⚪ Pièce (Ronde)
            </button>
            <button
              onClick={() => setMaskShape("rect")}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "10px",
                border: "none",
                background: maskShape === "rect" ? "#2563eb" : "rgba(255,255,255,0.06)",
                color: "white",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              ⬜ Objet / Carré / Boucle
            </button>
          </div>

          {/* Zoom Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af" }}>
              <span>🔍 Zoom :</span>
              <span>{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "#2563eb" }}
            />
          </div>

          {/* Rotation Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af" }}>
              <span>🔄 Aligner (Angle) :</span>
              <span>{rotation}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "#2563eb" }}
            />
          </div>

          <div style={{ fontSize: "10px", opacity: 0.6, color: "#9ca3af", textAlign: "center" }}>
            👉 Faites glisser l'image pour la centrer. Utilisez les glissières pour zoomer et redresser la pièce.
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleCropClick}
            style={{
              flex: 2,
              padding: "10px",
              borderRadius: "12px",
              border: "none",
              background: "#2563eb",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Valider le Cadrage
          </button>
        </div>
      </div>
    </div>
  );
}
