import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function FlipCoinModal({
  isOpen,
  onClose,
  find,
  existingPhotos = [],
  currentFlipCoin = null,
  onSaveFlipCoin,
  onDeleteFlipCoin,
  theme = "dark"
}) {
  const [aversUrl, setAversUrl] = useState(currentFlipCoin?.aversUrl || "");
  const [reversUrl, setReversUrl] = useState(currentFlipCoin?.reversUrl || "");
  const [isFlipped, setIsFlipped] = useState(false);

  const aversCameraRef = useRef(null);
  const aversGalleryRef = useRef(null);
  const reversCameraRef = useRef(null);
  const reversGalleryRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setAversUrl(currentFlipCoin?.aversUrl || "");
      setReversUrl(currentFlipCoin?.reversUrl || "");
      setIsFlipped(false);
    }
  }, [isOpen, currentFlipCoin]);

  if (!isOpen || !find) return null;

  const isLight = theme === "light";
  const bgModal = isLight ? "#ffffff" : "#0f172a";
  const textMain = isLight ? "#0f172a" : "#ffffff";
  const textSub = isLight ? "#475569" : "#ffffff";
  const cardBorder = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.12)";
  const inputBg = isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.05)";

  const handleFileUpload = (e, setTargetUrl) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setTargetUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!aversUrl || !reversUrl) {
      alert("Veuillez sélectionner à la fois une photo pour l'Avers et pour le Revers.");
      return;
    }
    onSaveFlipCoin(find.id, aversUrl, reversUrl);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Supprimer la vue 3D Flip Coin pour cette trouvaille ?")) {
      onDeleteFlipCoin(find.id);
      onClose();
    }
  };

  // Collect all available photo URLs for this find
  const candidatePhotos = [];
  if (find.offlinePhoto) candidatePhotos.push(find.offlinePhoto);
  if (find.image_url && !candidatePhotos.includes(find.image_url)) candidatePhotos.push(find.image_url);
  if (find.photo_url && !candidatePhotos.includes(find.photo_url)) candidatePhotos.push(find.photo_url);
  existingPhotos.forEach((p) => {
    if (p.image_url && !candidatePhotos.includes(p.image_url)) {
      candidatePhotos.push(p.image_url);
    }
  });

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
      onClick={onClose}
    >
      {/* Hidden file inputs for Avers */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={aversCameraRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileUpload(e, setAversUrl)}
      />
      <input
        type="file"
        accept="image/*"
        ref={aversGalleryRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileUpload(e, setAversUrl)}
      />

      {/* Hidden file inputs for Revers */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={reversCameraRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileUpload(e, setReversUrl)}
      />
      <input
        type="file"
        accept="image/*"
        ref={reversGalleryRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileUpload(e, setReversUrl)}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: bgModal,
          borderRadius: "24px",
          border: `1px solid ${cardBorder}`,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
          padding: "22px",
          color: textMain,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🪙</span> Configuration Flip Coin 3D
            </h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: textSub }}>
              Sélectionnez les 2 faces de <strong>{find.title || "votre objet"}</strong> pour créer la vue rotative.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>

        {/* 3D Coin Live Preview */}
        <div
          style={{
            background: isLight ? "#f1f5f9" : "rgba(0, 0, 0, 0.35)",
            borderRadius: "18px",
            border: `1px solid ${cardBorder}`,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#facc15", marginBottom: "8px" }}>
            Aperçu 3D interactif (Tapez pour tourner)
          </div>

          <style>{`
            .modal-coin-3d {
              perspective: 1000px;
              width: 150px;
              height: 150px;
              cursor: pointer;
              margin: 6px auto;
            }
            .modal-coin-inner {
              position: relative;
              width: 100%;
              height: 100%;
              transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
              transform-style: preserve-3d;
            }
            .modal-coin-3d.flipped .modal-coin-inner {
              transform: rotateY(180deg);
            }
            .modal-coin-front, .modal-coin-back {
              position: absolute;
              width: 100%;
              height: 100%;
              -webkit-backface-visibility: hidden;
              backface-visibility: hidden;
              border-radius: 50%;
              overflow: hidden;
              border: 3px solid #facc15;
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
            }
            .modal-coin-back {
              transform: rotateY(180deg);
            }
            .modal-coin-front img, .modal-coin-back img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .modal-coin-placeholder {
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #1e293b, #0f172a);
              display: flex;
              flex-direction: column;
              alignItems: center;
              justifyContent: center;
              color: #facc15;
              font-size: 11px;
              font-weight: bold;
              text-align: center;
              padding: 10px;
              box-sizing: border-box;
            }
          `}</style>

          <div
            className={`modal-coin-3d ${isFlipped ? "flipped" : ""}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="modal-coin-inner">
              <div className="modal-coin-front">
                {aversUrl ? (
                  <img src={aversUrl} alt="Avers" />
                ) : (
                  <div className="modal-coin-placeholder">
                    <span style={{ fontSize: "24px", marginBottom: "4px" }}>🪙</span>
                    <span>1. Avers</span>
                    <span style={{ fontSize: "9px", opacity: 0.8 }}>(Face avant)</span>
                  </div>
                )}
              </div>
              <div className="modal-coin-back">
                {reversUrl ? (
                  <img src={reversUrl} alt="Revers" />
                ) : (
                  <div className="modal-coin-placeholder">
                    <span style={{ fontSize: "24px", marginBottom: "4px" }}>🔄</span>
                    <span>2. Revers</span>
                    <span style={{ fontSize: "9px", opacity: 0.8 }}>(Face arrière)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ fontSize: "11px", color: textSub, marginTop: "6px" }}>
            Face visible actuelle : <strong>{isFlipped ? "Revers (Face arrière)" : "Avers (Face avant)"}</strong>
          </div>
        </div>

        {/* 2 SIDES CONFIGURATION SECTION */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {/* AVERS CARD */}
          <div
            style={{
              background: inputBg,
              border: `1px solid ${aversUrl ? "#facc15" : cardBorder}`,
              borderRadius: "16px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>1. Avers (Avant)</span>
              {aversUrl && <span style={{ color: "#10b981", fontSize: "11px" }}>✓ Choisi</span>}
            </div>

            {aversUrl ? (
              <div style={{ position: "relative", width: "100%", height: "90px", borderRadius: "10px", overflow: "hidden", border: `1px solid ${cardBorder}` }}>
                <img src={aversUrl} alt="Avers" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button
                  onClick={() => setAversUrl("")}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    background: "rgba(239, 68, 68, 0.9)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "2px 6px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => aversCameraRef.current?.click()}
                  style={{
                    padding: "8px 6px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px"
                  }}
                >
                  <span>📷</span>
                  <span>Photo Avers</span>
                </button>

                <button
                  type="button"
                  onClick={() => aversGalleryRef.current?.click()}
                  style={{
                    padding: "8px 6px",
                    borderRadius: "10px",
                    border: `1px solid ${cardBorder}`,
                    background: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px"
                  }}
                >
                  <span>🖼️</span>
                  <span>Galerie Avers</span>
                </button>
              </div>
            )}
          </div>

          {/* REVERS CARD */}
          <div
            style={{
              background: inputBg,
              border: `1px solid ${reversUrl ? "#facc15" : cardBorder}`,
              borderRadius: "16px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>2. Revers (Arrière)</span>
              {reversUrl && <span style={{ color: "#10b981", fontSize: "11px" }}>✓ Choisi</span>}
            </div>

            {reversUrl ? (
              <div style={{ position: "relative", width: "100%", height: "90px", borderRadius: "10px", overflow: "hidden", border: `1px solid ${cardBorder}` }}>
                <img src={reversUrl} alt="Revers" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button
                  onClick={() => setReversUrl("")}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    background: "rgba(239, 68, 68, 0.9)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "2px 6px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => reversCameraRef.current?.click()}
                  style={{
                    padding: "8px 6px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px"
                  }}
                >
                  <span>📷</span>
                  <span>Photo Revers</span>
                </button>

                <button
                  type="button"
                  onClick={() => reversGalleryRef.current?.click()}
                  style={{
                    padding: "8px 6px",
                    borderRadius: "10px",
                    border: `1px solid ${cardBorder}`,
                    background: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px"
                  }}
                >
                  <span>🖼️</span>
                  <span>Galerie Revers</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Existing photos quick selector */}
        {candidatePhotos.length > 0 && (
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#ffffff", marginBottom: "6px" }}>
              Ou assigner depuis les photos existantes de l'objet :
            </div>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {candidatePhotos.map((url, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: "0 0 70px",
                    height: "70px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: `1px solid ${cardBorder}`,
                    position: "relative"
                  }}
                >
                  <img src={url} alt="existing" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "2px" }}>
                    <button
                      onClick={() => setAversUrl(url)}
                      style={{ background: "#2563eb", color: "white", border: "none", borderRadius: "4px", fontSize: "9px", fontWeight: "bold", cursor: "pointer", padding: "2px" }}
                    >
                      + Avers
                    </button>
                    <button
                      onClick={() => setReversUrl(url)}
                      style={{ background: "#059669", color: "white", border: "none", borderRadius: "4px", fontSize: "9px", fontWeight: "bold", cursor: "pointer", padding: "2px" }}
                    >
                      + Revers
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={!aversUrl || !reversUrl}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              background: !aversUrl || !reversUrl
                ? "rgba(255, 255, 255, 0.1)"
                : "linear-gradient(135deg, #10b981, #059669)",
              color: !aversUrl || !reversUrl ? "rgba(255,255,255,0.4)" : "#ffffff",
              fontSize: "14px",
              fontWeight: "800",
              cursor: !aversUrl || !reversUrl ? "not-allowed" : "pointer",
              boxShadow: !aversUrl || !reversUrl ? "none" : "0 4px 14px rgba(16, 185, 129, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <span>✨</span>
            <span>Activer le Flip Coin 3D</span>
          </button>

          {currentFlipCoin && (
            <button
              type="button"
              onClick={handleDelete}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "12px",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                background: "rgba(239, 68, 68, 0.15)",
                color: "#ef4444",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              🗑️ Supprimer le Flip Coin 3D
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
