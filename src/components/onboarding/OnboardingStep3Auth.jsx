import React from "react";
import AuthForm from "../AuthForm";

export default function OnboardingStep3Auth({
  isDark,
  cardBorder,
  textMain,
  textSub,
  selectedAppTheme,
  user,
  setUser,
  onBack,
  onNext
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "900", color: textMain, letterSpacing: "-0.5px" }}>
          Votre Espace Prospecteur 👤
        </h1>
        <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
          Connectez-vous pour synchroniser vos trouvailles sur tous vos appareils, ou continuez en local.
        </p>
      </div>

      {user ? (
        <div
          style={{
            background: isDark ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5",
            border: isDark ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid #a7f3d0",
            borderRadius: "16px",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "18px"
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "800", color: isDark ? "#34d399" : "#065f46" }}>
                Connecté avec succès
              </div>
              <div style={{ fontSize: "13px", color: isDark ? "#a7f3d0" : "#047857" }}>
                {user.email}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onNext}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "white",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(37, 99, 235, 0.25)"
            }}
          >
            Continuer vers l'étape 4 →
          </button>
        </div>
      ) : (
        <div>
          <AuthForm
            theme={selectedAppTheme}
            onAuthSuccess={(u) => {
              setUser(u);
              onNext();
            }}
            showGoogleOption={true}
          />

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button
              type="button"
              onClick={onNext}
              style={{
                background: "none",
                border: "none",
                color: textSub,
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                padding: "6px 10px",
                textDecoration: "underline",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = textMain)}
              onMouseLeave={(e) => (e.currentTarget.style.color = textSub)}
            >
              Continuer vers l'étape 4 (mode local) →
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "11px 16px",
            borderRadius: "10px",
            border: `1px solid ${cardBorder}`,
            background: isDark ? "#1e293b" : "#ffffff",
            color: textSub,
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          ← Retour au cadre légal
        </button>
      </div>
    </div>
  );
}
