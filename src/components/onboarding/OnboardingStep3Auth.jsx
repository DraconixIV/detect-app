import React from "react";
import AuthForm from "../AuthForm";

export default function OnboardingStep3Auth({
  isDark,
  cardBg,
  cardBorder,
  textMain,
  textSub,
  selectedAppTheme,
  user,
  setUser,
  onBack,
  onNext
}) {
  const sheetBg = cardBg || (isDark ? "#19231e" : "#ffffff");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "400", color: textMain, letterSpacing: "-0.3px" }}>
          Votre espace prospecteur
        </h1>
        <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
          Connectez-vous pour synchroniser vos trouvailles sur tous vos appareils, ou continuez en local.
        </p>
      </div>

      {user ? (
        <div
          style={{
            background: sheetBg,
            border: `1px solid ${cardBorder}`,
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
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "#2c5e4c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: "400",
                fontSize: "16px"
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "400", color: textMain }}>
                Connecté avec succès
              </div>
              <div style={{ fontSize: "12px", color: textSub }}>
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
              background: "#2c5e4c",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "400",
              cursor: "pointer"
            }}
          >
            Continuer vers l'étape 4
          </button>
        </div>
      ) : (
        <div
          style={{
            background: sheetBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: "16px",
            padding: "16px"
          }}
        >
          <AuthForm
            theme={selectedAppTheme}
            onAuthSuccess={(u) => {
              setUser(u);
              onNext();
            }}
            showGoogleOption={true}
          />

          <div style={{ textAlign: "center", marginTop: "14px", paddingTop: "12px", borderTop: `1px solid ${cardBorder}` }}>
            <button
              type="button"
              onClick={onNext}
              style={{
                background: "none",
                border: "none",
                color: textSub,
                fontSize: "12px",
                fontWeight: "400",
                cursor: "pointer",
                padding: "4px 10px",
                textDecoration: "underline",
                transition: "color 0.2s"
              }}
            >
              Continuer sans compte (mode local)
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
            borderRadius: "12px",
            border: `1px solid ${cardBorder}`,
            background: sheetBg,
            color: textSub,
            fontSize: "12px",
            fontWeight: "400",
            cursor: "pointer"
          }}
        >
          Retour au cadre légal
        </button>
      </div>
    </div>
  );
}
