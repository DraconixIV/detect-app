import React, { useState } from "react";
import { submitUserFeedback } from "../services/feedbackService";

export default function FeedbackModal({ isOpen, onClose, theme = "dark" }) {
  const [category, setCategory] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const isLight = theme === "light";
  const bgModal = isLight ? "#f3f4f2" : "#111915";
  const sheetBg = isLight ? "#ffffff" : "#19231e";
  const inputBg = isLight ? "#f3f4f2" : "#111915";
  const cardBorder = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.08)";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";

  const categories = [
    { id: "bug", label: "Signaler un bug" },
    { id: "suggestion", label: "Suggérer une idée" },
    { id: "avis", label: "Avis" },
    { id: "question", label: "Poser une question" }
  ];

  const getPlaceholder = () => {
    switch (category) {
      case "bug":
        return "Décrivez le problème rencontré : ce qui s'est passé, sur quel écran...";
      case "suggestion":
        return "Quelle fonctionnalité aimeriez-vous voir dans une prochaine mise à jour de GeoProspect ?";
      case "question":
        return "Posez votre question sur l'application ou son utilisation...";
      default:
        return "Partagez vos impressions ou votre avis sur l'application...";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg("Veuillez saisir un message avant d'envoyer.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      await submitUserFeedback({
        category,
        message
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.message || "Erreur lors de l'envoi. Veuillez réessayer.");
    }
  };

  const handleClose = () => {
    setMessage("");
    setIsSubmitted(false);
    setErrorMsg("");
    onClose();
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
              Formulaire de retour
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "rgba(255,255,255,0.75)" }}>
              Aidez-nous à améliorer GeoProspect
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

        {/* Content Body */}
        <div style={{ padding: "18px 20px", overflowY: "auto" }}>
          {isSubmitted ? (
            <div style={{ textAlign: "center", padding: "24px 10px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#2c5e4c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  color: "#ffffff",
                  margin: "0 auto 14px auto"
                }}
              >
                ✓
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: "400", color: textMain, margin: "0 0 6px 0" }}>
                Merci pour votre retour
              </h4>
              <p style={{ fontSize: "13px", color: textSub, lineHeight: "1.5", margin: "0 0 20px 0" }}>
                Votre message a bien été transmis. Vos retours permettent de faire évoluer GeoProspect.
              </p>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: "11px 24px",
                  borderRadius: "10px",
                  background: "#2c5e4c",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "400",
                  cursor: "pointer"
                }}
              >
                Retour à l'application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                  Type de message
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  {categories.map((c) => {
                    const active = category === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        style={{
                          padding: "9px 12px",
                          borderRadius: "10px",
                          background: active ? "#2c5e4c" : sheetBg,
                          border: active ? "1px solid #2c5e4c" : `1px solid ${cardBorder}`,
                          color: active ? "#ffffff" : textSub,
                          fontSize: "12px",
                          fontWeight: "400",
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "400", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                  Votre message
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={getPlaceholder()}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    background: inputBg,
                    border: `1px solid ${cardBorder}`,
                    color: textMain,
                    fontSize: "13px",
                    lineHeight: "1.45",
                    outline: "none",
                    fontFamily: "inherit",
                    resize: "vertical"
                  }}
                  required
                />
              </div>

              {errorMsg && (
                <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(220, 38, 38, 0.12)", color: "#dc2626", fontSize: "12px", fontWeight: "400" }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  background: isSubmitting || !message.trim() ? (isLight ? "#dce2de" : "rgba(255,255,255,0.08)") : "#2c5e4c",
                  border: "none",
                  color: isSubmitting || !message.trim() ? textSub : "#ffffff",
                  fontSize: "13px",
                  fontWeight: "400",
                  cursor: isSubmitting || !message.trim() ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer mon message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
