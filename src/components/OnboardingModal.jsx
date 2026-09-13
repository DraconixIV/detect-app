import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import AuthForm from "./AuthForm";

export default function OnboardingModal({ isOpen, onComplete }) {
  const [cguAccepted, setCguAccepted] = useState(false);
  const [selectedMapStyle, setSelectedMapStyle] = useState("satellite"); // "satellite" | "streets" | "topo"
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1); // 1: Sensibilisation & CGU, 2: Compte & Carte
  const [showAuthSection, setShowAuthSection] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleFinish = () => {
    if (!cguAccepted) {
      alert("Veuillez accepter les conditions d'utilisation et le rappel législatif pour continuer.");
      return;
    }

    localStorage.setItem("rdl_onboarding_completed", "true");
    localStorage.setItem("rdl_cgu_accepted", "true");
    localStorage.setItem("mapStyle", selectedMapStyle);
    
    if (onComplete) {
      onComplete({ defaultMapStyle: selectedMapStyle });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "linear-gradient(145deg, #182234, #0f172a)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          padding: "24px",
          color: "white",
          boxSizing: "border-box"
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "38px", marginBottom: "8px" }}>🪙</div>
          <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: "800", color: "#facc15", letterSpacing: "-0.5px" }}>
            Bienvenue sur votre Carnet de Détection
          </h2>
          <p style={{ margin: 0, fontSize: "12px", opacity: 0.75, lineHeight: "1.4" }}>
            L'outil libre, autonome et confidentiel pensé par et pour les passionnés de prospection.
          </p>
        </div>

        {step === 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Sensibilisation & Loi */}
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "16px",
                padding: "14px",
                fontSize: "12px",
                lineHeight: "1.5"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", color: "#f87171", marginBottom: "6px" }}>
                <span>⚖️</span>
                <span>Rappel Légal & Déontologie</span>
              </div>
              <p style={{ margin: "0 0 6px 0", opacity: 0.9 }}>
                La détection de loisir est strictement encadrée par l'<strong>article L. 542-1 du Code du patrimoine</strong>.
              </p>
              <ul style={{ margin: 0, paddingLeft: "18px", opacity: 0.85, fontSize: "11px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li>Autorisation préalable du propriétaire du terrain obligatoire.</li>
                <li>Interdiction totale sur sites historiques, archéologiques ou zones protégées.</li>
                <li>Obligation de déclaration des découvertes fortuites en mairie ou préfecture.</li>
                <li>Respect de la nature et rebouchage systématique de tous vos trous.</li>
              </ul>
            </div>

            {/* CGU checkbox */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "14px"
              }}
            >
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={cguAccepted}
                  onChange={(e) => setCguAccepted(e.target.checked)}
                  style={{ width: "18px", height: "18px", marginTop: "2px", accentColor: "#facc15", cursor: "pointer" }}
                />
                <span style={{ fontSize: "12px", opacity: 0.9, lineHeight: "1.4" }}>
                  J'ai pris connaissance de la réglementation légale, je m'engage à prospecter de manière responsable et j'accepte les <strong>Conditions Générales d'Utilisation</strong>.
                </span>
              </label>
            </div>

            <button
              disabled={!cguAccepted}
              onClick={() => setStep(2)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background: cguAccepted ? "linear-gradient(135deg, #facc15, #eab308)" : "rgba(255,255,255,0.1)",
                color: cguAccepted ? "#1e293b" : "rgba(255,255,255,0.4)",
                fontWeight: "800",
                fontSize: "14px",
                cursor: cguAccepted ? "pointer" : "not-allowed",
                transition: "all 0.2s"
              }}
            >
              Suivant : Personnalisation ➔
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Default Map Style Choice */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "8px", color: "#60a5fa" }}>
                🗺️ Fond de carte par défaut
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div
                  onClick={() => setSelectedMapStyle("satellite")}
                  style={{
                    padding: "12px",
                    borderRadius: "14px",
                    border: selectedMapStyle === "satellite" ? "2px solid #facc15" : "1px solid rgba(255,255,255,0.1)",
                    background: selectedMapStyle === "satellite" ? "rgba(250, 204, 21, 0.12)" : "rgba(255,255,255,0.04)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "4px" }}>🛰️</div>
                  <div style={{ fontSize: "12px", fontWeight: "bold" }}>Vue Satellite</div>
                  <div style={{ fontSize: "10px", opacity: 0.6 }}>Avec noms des rues</div>
                </div>

                <div
                  onClick={() => setSelectedMapStyle("streets")}
                  style={{
                    padding: "12px",
                    borderRadius: "14px",
                    border: selectedMapStyle === "streets" ? "2px solid #facc15" : "1px solid rgba(255,255,255,0.1)",
                    background: selectedMapStyle === "streets" ? "rgba(250, 204, 21, 0.12)" : "rgba(255,255,255,0.04)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "4px" }}>🏞️</div>
                  <div style={{ fontSize: "12px", fontWeight: "bold" }}>Vue Paysage</div>
                  <div style={{ fontSize: "10px", opacity: 0.6 }}>Relief & chemins</div>
                </div>
              </div>
              <div style={{ fontSize: "10px", opacity: 0.6, marginTop: "6px", textAlign: "center" }}>
                Vous pourrez basculer entre les deux cartes à tout moment via l'application.
              </div>
            </div>

            {/* Compte & Authentification */}
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "14px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: "#a78bfa" }}>
                  👤 Compte & Synchronisation
                </div>
                {user && (
                  <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "bold" }}>
                    ✅ Connecté
                  </span>
                )}
              </div>

              {user ? (
                <div style={{ fontSize: "12px", color: "#e2e8f0", padding: "8px 0" }}>
                  Connecté en tant que <strong>{user.email}</strong>
                </div>
              ) : (
                <>
                  <p style={{ margin: "0 0 10px 0", fontSize: "11px", opacity: "0.8", lineHeight: "1.4" }}>
                    Par défaut, l'app fonctionne en <strong>Mode 100% Local</strong> (sans compte requis). Vous pouvez vous connecter pour synchroniser vos données.
                  </p>

                  {!showAuthSection ? (
                    <button
                      type="button"
                      onClick={() => setShowAuthSection(true)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.08)",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                      }}
                    >
                      <span>🔑</span>
                      <span>Se connecter / S'inscrire (Email ou Google)</span>
                    </button>
                  ) : (
                    <div style={{ marginTop: "10px" }}>
                      <AuthForm
                        onAuthSuccess={(u) => {
                          setUser(u);
                          setShowAuthSection(false);
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Navigation buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: "12px 18px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                ← Retour
              </button>
              <button
                onClick={handleFinish}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "14px",
                  border: "none",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  fontWeight: "800",
                  fontSize: "13px",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                }}
              >
                Commencer l'Aventure 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
