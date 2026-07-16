import { useState } from "react";

export default function GpsOnboarding({
  finds,
  onGpsAuthorized,
  onModeConsultation
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState(false);
  const [tempPosition, setTempPosition] = useState(null);

  const handleRequestLocation = () => {
    setLoading(true);
    setError("");
    setWarning(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setTempPosition(newPos);

        if (pos.coords.accuracy > 150) {
          setWarning(true);
        } else {
          onGpsAuthorized(newPos);
        }
      },
      (err) => {
        setLoading(false);
        console.error("GPS onboarding getCurrentPosition error:", err);
        setError(
          "Impossible d'accéder au GPS. Veuillez autoriser la localisation dans vos paramètres ou basculer en mode Consultation."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleAcceptPoorLocation = () => {
    if (tempPosition) {
      onGpsAuthorized(tempPosition);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(8, 10, 20, 0.97)",
        backdropFilter: "blur(12px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(17, 24, 39, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          padding: "30px 24px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          textAlign: "center",
          color: "white"
        }}
      >
        {!warning ? (
          <>
            <div style={{ fontSize: "52px", marginBottom: "15px" }}>🛰️</div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
              Configuration GPS
            </h2>
            <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.6", margin: "0 0 24px 0" }}>
              Pour cartographier et enregistrer vos trouvailles sur le terrain, l'application a besoin d'une connexion GPS fonctionnelle.
            </p>

            {error && (
              <div style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "12px",
                padding: "10px 12px",
                fontSize: "12px",
                color: "#f87171",
                marginBottom: "20px",
                lineHeight: "1.4"
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={handleRequestLocation}
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  border: "none",
                  borderRadius: "14px",
                  padding: "14px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
                  transition: "transform 0.15s, opacity 0.2s"
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.transform = "scale(1)"; }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid white",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin-loader-gps 0.8s linear infinite"
                    }}></span>
                    Acquisition du signal...
                  </>
                ) : (
                  <>🎯 Activer la localisation</>
                )}
              </button>

              <button
                onClick={onModeConsultation}
                disabled={loading}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  padding: "14px",
                  color: "#d1d5db",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background 0.2s, transform 0.15s"
                }}
                onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"; e.currentTarget.style.transform = "scale(1.02)"; } }}
                onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.transform = "scale(1)"; } }}
              >
                🗺️ Mode Consultation (Lespignan)
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: "52px", marginBottom: "15px" }}>⚠️</div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 10px 0", color: "#fbbf24" }}>
              Signal GPS imprécis
            </h2>
            <p style={{ fontSize: "13px", color: "#d1d5db", lineHeight: "1.6", margin: "0 0 20px 0" }}>
              Votre navigateur renvoie une position approximative (IP de connexion résolue à **Mèze** ou alentours).
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.5", margin: "0 0 24px 0" }}>
              Si vous êtes chez vous sur ordinateur, nous vous conseillons de centrer la carte sur votre zone de trouvailles habituelle (Lespignan) pour éviter les décalages.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={onModeConsultation}
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  border: "none",
                  borderRadius: "14px",
                  padding: "14px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                  transition: "transform 0.15s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                🏰 Centrer sur Lespignan (Recommandé)
              </button>

              <button
                onClick={handleAcceptPoorLocation}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  padding: "14px",
                  color: "#9ca3af",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
              >
                Utiliser quand même cette position GPS
              </button>
            </div>
          </>
        )}
      </div>
      
      <style>{`
        @keyframes spin-loader-gps {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
