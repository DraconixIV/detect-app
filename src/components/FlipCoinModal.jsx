import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ConfirmModal from "./ConfirmModal";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const aversCameraRef = useRef(null);
  const aversGalleryRef = useRef(null);
  const reversCameraRef = useRef(null);
  const reversGalleryRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setAversUrl(currentFlipCoin?.aversUrl || "");
      setReversUrl(currentFlipCoin?.reversUrl || "");
      setIsFlipped(false);
      setShowDeleteConfirm(false);
    }
  }, [isOpen, currentFlipCoin]);

  if (!isOpen || !find) return null;

  const isLight = theme === "light";
  const bgModal = isLight ? "#f3f4f2" : "#111915";
  const sheetBg = isLight ? "#ffffff" : "#19231e";
  const inputBg = isLight ? "#f3f4f2" : "#111915";
  const cardBorder = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.08)";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";

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
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onDeleteFlipCoin(find.id);
    onClose();
  };

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
        background: "rgba(8, 14, 11, 0.8)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
      onClick={onClose}
    >
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
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: bgModal,
          borderRadius: "20px",
          border: `1px solid ${cardBorder}`,
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5)",
          color: textMain,
          boxSizing: "border-box",
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
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "400", color: "#ffffff" }}>
              Configuration de la vue 3D
            </h2>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "rgba(255,255,255,0.75)" }}>
              {find.title || "Objet"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.14)",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              color: "#ffffff",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* 3D Coin Live Preview */}
          <div
            style={{
              background: sheetBg,
              borderRadius: "16px",
              border: `1px solid ${cardBorder}`,
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "400", textTransform: "uppercase", letterSpacing: "0.5px", color: textSub, marginBottom: "8px" }}>
              Aperçu rotatif (toucher pour retourner)
            </div>

            <style>{`
              .modal-coin-3d {
                perspective: 1000px;
                width: 140px;
                height: 140px;
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
                border: 2px solid #2c5e4c;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
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
                background: ${inputBg};
                display: flex;
                flex-direction: column;
                alignItems: center;
                justifyContent: center;
                color: ${textSub};
                font-size: 11px;
                font-weight: 400;
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
                      <span>Face 1 : Avers</span>
                    </div>
                  )}
                </div>
                <div className="modal-coin-back">
                  {reversUrl ? (
                    <img src={reversUrl} alt="Revers" />
                  ) : (
                    <div className="modal-coin-placeholder">
                      <span>Face 2 : Revers</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ fontSize: "11px", color: textSub, marginTop: "6px" }}>
              Face visible : {isFlipped ? "Revers" : "Avers"}
            </div>
          </div>

          {/* 2 SIDES CONFIGURATION SECTION */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {/* AVERS */}
            <div
              style={{
                background: sheetBg,
                border: `1px solid ${aversUrl ? "#2c5e4c" : cardBorder}`,
                borderRadius: "14px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: "400", color: textMain, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Face 1 : Avers</span>
                {aversUrl && <span style={{ color: "#40916c", fontSize: "11px" }}>✓</span>}
              </div>

              {aversUrl ? (
                <div style={{ position: "relative", width: "100%", height: "85px", borderRadius: "8px", overflow: "hidden", border: `1px solid ${cardBorder}` }}>
                  <img src={aversUrl} alt="Avers" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button
                    onClick={() => setAversUrl("")}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      background: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "2px 6px",
                      fontSize: "10px",
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
                      padding: "8px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#2c5e4c",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "400",
                      cursor: "pointer"
                    }}
                  >
                    Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => aversGalleryRef.current?.click()}
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      border: `1px solid ${cardBorder}`,
                      background: inputBg,
                      color: textMain,
                      fontSize: "11px",
                      fontWeight: "400",
                      cursor: "pointer"
                    }}
                  >
                    Galerie
                  </button>
                </div>
              )}
            </div>

            {/* REVERS */}
            <div
              style={{
                background: sheetBg,
                border: `1px solid ${reversUrl ? "#2c5e4c" : cardBorder}`,
                borderRadius: "14px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: "400", color: textMain, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Face 2 : Revers</span>
                {reversUrl && <span style={{ color: "#40916c", fontSize: "11px" }}>✓</span>}
              </div>

              {reversUrl ? (
                <div style={{ position: "relative", width: "100%", height: "85px", borderRadius: "8px", overflow: "hidden", border: `1px solid ${cardBorder}` }}>
                  <img src={reversUrl} alt="Revers" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button
                    onClick={() => setReversUrl("")}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      background: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "2px 6px",
                      fontSize: "10px",
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
                      padding: "8px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#2c5e4c",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "400",
                      cursor: "pointer"
                    }}
                  >
                    Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => reversGalleryRef.current?.click()}
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      border: `1px solid ${cardBorder}`,
                      background: inputBg,
                      color: textMain,
                      fontSize: "11px",
                      fontWeight: "400",
                      cursor: "pointer"
                    }}
                  >
                    Galerie
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Existing photos quick selector */}
          {candidatePhotos.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: "400", color: textSub, marginBottom: "6px" }}>
                Ou sélectionner depuis les photos existantes :
              </div>
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                {candidatePhotos.map((url, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: "0 0 64px",
                      height: "64px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: `1px solid ${cardBorder}`,
                      position: "relative"
                    }}
                  >
                    <img src={url} alt="existing" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "2px" }}>
                      <button
                        onClick={() => setAversUrl(url)}
                        style={{ background: "#2c5e4c", color: "white", border: "none", borderRadius: "4px", fontSize: "9px", cursor: "pointer", padding: "2px" }}
                      >
                        Avers
                      </button>
                      <button
                        onClick={() => setReversUrl(url)}
                        style={{ background: "#40916c", color: "white", border: "none", borderRadius: "4px", fontSize: "9px", cursor: "pointer", padding: "2px" }}
                      >
                        Revers
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={!aversUrl || !reversUrl}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: !aversUrl || !reversUrl ? (isLight ? "#dce2de" : "rgba(255,255,255,0.08)") : "#2c5e4c",
                color: !aversUrl || !reversUrl ? textSub : "#ffffff",
                fontSize: "13px",
                fontWeight: "400",
                cursor: !aversUrl || !reversUrl ? "not-allowed" : "pointer"
              }}
            >
              Enregistrer la vue 3D
            </button>

            {currentFlipCoin && (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  width: "100%",
                  padding: "9px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(220, 38, 38, 0.12)",
                  color: "#dc2626",
                  fontSize: "12px",
                  fontWeight: "400",
                  cursor: "pointer"
                }}
              >
                Supprimer la vue 3D
              </button>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Supprimer la vue 3D"
          confirmColor="#dc2626"
          message="Voulez-vous supprimer la vue 3D pour cette trouvaille ?"
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>,
    document.body
  );
}
