import { useState, useRef, useEffect } from "react";

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
  const [imgDims, setImgDims] = useState({ w: 300, h: 300 });

  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (!naturalWidth || !naturalHeight) return;
    const ratio = naturalWidth / naturalHeight;
    let w, h;
    if (ratio > 1) {
      h = 300;
      w = 300 * ratio;
    } else {
      w = 300;
      h = 300 / ratio;
    }
    setImgDims({ w, h });
  };

  useEffect(() => {
    const maxPosX = (imgDims.w * zoom) / 2 - 100;
    const minPosX = 100 - (imgDims.w * zoom) / 2;
    const maxPosY = (imgDims.h * zoom) / 2 - 100;
    const minPosY = 100 - (imgDims.h * zoom) / 2;

    setPosX((x) => (maxPosX > minPosX ? Math.max(minPosX, Math.min(maxPosX, x)) : 0));
    setPosY((y) => (maxPosY > minPosY ? Math.max(minPosY, Math.min(maxPosY, y)) : 0));
  }, [zoom, imgDims]);

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
    const targetX = clientX - startX.current;
    const targetY = clientY - startY.current;

    const maxPosX = (imgDims.w * zoom) / 2 - 100;
    const minPosX = 100 - (imgDims.w * zoom) / 2;
    const maxPosY = (imgDims.h * zoom) / 2 - 100;
    const minPosY = 100 - (imgDims.h * zoom) / 2;

    const posXConstrained = maxPosX > minPosX ? Math.max(minPosX, Math.min(maxPosX, targetX)) : 0;
    const posYConstrained = maxPosY > minPosY ? Math.max(minPosY, Math.min(maxPosY, targetY)) : 0;

    setPosX(posXConstrained);
    setPosY(posYConstrained);
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  const handleCropClick = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 500;
    canvas.height = 500;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, 500, 500);
      ctx.save();
      ctx.translate(250, 250);
      
      const scaleFactor = 500 / 300;
      ctx.translate(posX * scaleFactor, posY * scaleFactor);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

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
        background: "rgba(8, 14, 11, 0.82)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        zIndex: 9999999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "16px",
        boxSizing: "border-box"
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          background: "#19231e",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "380px",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)"
        }}
      >
        {/* Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0, color: "#f1f5f2", fontSize: "15px", fontWeight: "400" }}>
            Centrer et aligner la photo
          </h4>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              color: "#9aa8a0",
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
            width: "280px",
            height: "280px",
            position: "relative",
            overflow: "hidden",
            borderRadius: "14px",
            background: "#111915",
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
          <img
            src={displaySrc}
            crossOrigin="anonymous"
            alt="To Crop"
            draggable="false"
            onLoad={handleImageLoad}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translate(${posX}px, ${posY}px) rotate(${rotation}deg) scale(${zoom})`,
              transformOrigin: "center",
              pointerEvents: "none"
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "40px",
              left: "40px",
              width: "200px",
              height: "200px",
              borderRadius: maskShape === "circle" ? "50%" : "12px",
              boxShadow: "0 0 0 9999px rgba(17, 25, 21, 0.75)",
              border: "1.5px solid #40916c",
              pointerEvents: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Mask Shape Toggle */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: "#111915",
              padding: "3px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <button
              onClick={() => setMaskShape("circle")}
              style={{
                padding: "6px 8px",
                borderRadius: "999px",
                border: "none",
                background: maskShape === "circle" ? "#2c5e4c" : "transparent",
                color: maskShape === "circle" ? "#ffffff" : "#9aa8a0",
                fontSize: "11px",
                fontWeight: "400",
                cursor: "pointer"
              }}
            >
              Ronde (Monnaie)
            </button>
            <button
              onClick={() => setMaskShape("rect")}
              style={{
                padding: "6px 8px",
                borderRadius: "999px",
                border: "none",
                background: maskShape === "rect" ? "#2c5e4c" : "transparent",
                color: maskShape === "rect" ? "#ffffff" : "#9aa8a0",
                fontSize: "11px",
                fontWeight: "400",
                cursor: "pointer"
              }}
            >
              Carrée (Objet)
            </button>
          </div>

          {/* Zoom Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9aa8a0" }}>
              <span>Zoom</span>
              <span>{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "#2c5e4c" }}
            />
          </div>

          {/* Rotation Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9aa8a0" }}>
              <span>Rotation</span>
              <span>{rotation}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "#2c5e4c" }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#111915",
              color: "#9aa8a0",
              fontSize: "12px",
              fontWeight: "400",
              cursor: "pointer"
            }}
          >
            Annuler
          </button>
          
          <button
            onClick={() => onCrop(null)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              background: "#111915",
              color: "#9aa8a0",
              fontSize: "12px",
              fontWeight: "400",
              cursor: "pointer"
            }}
          >
            Passer
          </button>

          <button
            onClick={handleCropClick}
            style={{
              flex: 1.4,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "#2c5e4c",
              color: "white",
              fontSize: "12px",
              fontWeight: "400",
              cursor: "pointer"
            }}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}
