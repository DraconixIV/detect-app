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
  const bgModal = isLight ? "#ffffff" : "#0f172a";
  const textMain = isLight ? "#0f172a" : "#ffffff";
  const textSub = isLight ? "#475569" : "#94a3b8";
  const cardBg = isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.04)";
  const cardBorder = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.12)";
  const inputBg = isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.06)";
  const inputBorder = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.15)";

  const categories = [
    { id: "bug", label: "Signaler un bug", icon: "🐛", color: "#ef4444" },
    { id: "suggestion", label: "Suggérer une idée", icon: "💡", color: "#38bdf8" },
    { id: "avis", label: "Avis et retours", icon: "💬", color: "#10b981" },
    { id: "question", label: "Poser une question", icon: "❓", color: "#f59e0b" }
  ];

  const getPlaceholder = () => {
    switch (category) {
      case "bug":
        return "Décrivez le problème rencontré : ce qui s'est passé, sur quel écran, ou si un bouton ne répondait pas...";
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
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.2s ease"
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          maxHeight: "85vh",
          background: bgModal,
          borderRadius: "24px",
          border: `1px solid ${cardBorder}`,
          boxShadow: isLight ? "0 20px 40px rgba(0,0,0,0.15)" : "0 25px 60px rgba(0,0,0,0.8)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${cardBorder}`
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>📝</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: textMain }}>
                Formulaire de retour
              </h3>
              <p style={{ margin: 0, fontSize: "11px", color: textSub }}>
                Aidez-nous à améliorer GeoProspect
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: isLight ? "#f1f5f9" : "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: textMain,
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "20px", overflowY: "auto" }}>
          {isSubmitted ? (
            <div style={{ textAlign: "center", padding: "30px 10px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  margin: "0 auto 16px auto",
                  boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)"
                }}
              >
                ✓
              </div>
              <h4 style={{ fontSize: "18px", fontWeight: "900", color: textMain, margin: "0 0 8px 0" }}>
                Merci pour votre retour !
              </h4>
              <p style={{ fontSize: "13px", color: textSub, lineHeight: "1.5", margin: "0 0 24px 0" }}>
                Votre message a bien été transmis. Vos retours permettent de faire évoluer GeoProspect pour tous les prospecteurs.
              </p>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: "12px 28px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "800",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)"
                }}
              >
                Retour à l'application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Category selector */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: textSub, marginBottom: "8px" }}>
                  Type de message :
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {categories.map((c) => {
                    const active = category === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "12px",
                          background: active ? `${c.color}22` : cardBg,
                          border: active ? `2px solid ${c.color}` : `1px solid ${cardBorder}`,
                          color: active ? (isLight ? "#0f172a" : "#ffffff") : textSub,
                          fontSize: "12px",
                          fontWeight: active ? "800" : "600",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "all 0.15s ease"
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>{c.icon}</span>
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message field */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: textSub, marginBottom: "6px" }}>
                  Votre message <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={getPlaceholder()}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
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
                <div style={{ padding: "8px 12px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#f87171", fontSize: "11.5px", fontWeight: "700" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "14px",
                  background: isSubmitting || !message.trim() ? "rgba(37, 99, 235, 0.4)" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "13.5px",
                  fontWeight: "800",
                  cursor: isSubmitting || !message.trim() ? "not-allowed" : "pointer",
                  boxShadow: isSubmitting || !message.trim() ? "none" : "0 6px 20px rgba(37, 99, 235, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s"
                }}
              >
                <span>{isSubmitting ? "Envoi en cours..." : "Envoyer mon message"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
