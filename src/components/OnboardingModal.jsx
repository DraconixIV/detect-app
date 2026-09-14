import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { THEMES } from "../styles/themes";
import AuthForm from "./AuthForm";

export default function OnboardingModal({ isOpen, onComplete }) {
  const [step, setStep] = useState(1); // 1: Compte/Connexion, 2: Législation & Charte Éthique, 3: Pré-personnalisation
  const [user, setUser] = useState(null);

  // Legal Checkboxes state
  const [checkOwner, setCheckOwner] = useState(false);
  const [checkHeritage, setCheckHeritage] = useState(false);
  const [checkDeclaration, setCheckDeclaration] = useState(false);
  const [checkNature, setCheckNature] = useState(false);
  const [checkCgu, setCheckCgu] = useState(false);

  // Pre-customization choices
  const [selectedMapStyle, setSelectedMapStyle] = useState("satellite");
  const [selectedDesignTheme, setSelectedDesignTheme] = useState("tactical");
  const [selectedAppTheme, setSelectedAppTheme] = useState("dark");
  const [selectedGpsStyle, setSelectedGpsStyle] = useState("blue-dot");

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

  const allLegalChecked = checkOwner && checkHeritage && checkDeclaration && checkNature && checkCgu;

  const handleDevSkip = () => {
    localStorage.setItem("rdl_onboarding_completed_v2", "true");
    localStorage.setItem("rdl_cgu_accepted", "true");
    if (onComplete) {
      onComplete({
        defaultMapStyle: selectedMapStyle,
        designTheme: selectedDesignTheme,
        theme: selectedAppTheme,
        gpsStyle: selectedGpsStyle
      });
    }
  };

  const handleFinish = () => {
    localStorage.setItem("rdl_onboarding_completed_v2", "true");
    localStorage.setItem("rdl_cgu_accepted", "true");
    localStorage.setItem("mapStyle", selectedMapStyle);
    localStorage.setItem("app_design_theme", selectedDesignTheme);
    localStorage.setItem("app_theme", selectedAppTheme);
    localStorage.setItem("gpsStyle", selectedGpsStyle);

    if (onComplete) {
      onComplete({
        defaultMapStyle: selectedMapStyle,
        designTheme: selectedDesignTheme,
        theme: selectedAppTheme,
        gpsStyle: selectedGpsStyle
      });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        background: "rgba(5, 8, 16, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#0f172a",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9)",
          padding: "24px 20px",
          color: "#f8fafc",
          boxSizing: "border-box",
          position: "relative"
        }}
      >
        {/* Header : Progress Stepper & Dev Skip */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          {/* Step Indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    width: step === s ? "20px" : "8px",
                    height: "6px",
                    borderRadius: "3px",
                    background: step === s ? "#3b82f6" : (step > s ? "#10b981" : "rgba(255, 255, 255, 0.15)"),
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", marginLeft: "4px" }}>
              Étape {step} sur 3
            </span>
          </div>

          {/* Dev Skip */}
          <button
            onClick={handleDevSkip}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "rgba(255, 255, 255, 0.04)",
              color: "#94a3b8",
              fontSize: "10px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#94a3b8";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
            }}
            title="Bypass pour le développement"
          >
            Dev Skip
          </button>
        </div>

        {/* ========================================================= */}
        {/* ÉTAPE 1 : ESPACE COMPTE (AUTHENTIFICATION) */}
        {/* ========================================================= */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: "800", color: "#f8fafc", letterSpacing: "-0.4px" }}>
                Votre Espace Détection
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.45" }}>
                Synchronisez vos découvertes, photos haute résolution et parcours GPS.
              </p>
            </div>

            {user ? (
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  borderRadius: "14px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "#10b981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px"
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>
                      Connecté avec succès
                    </div>
                    <div style={{ fontSize: "12px", color: "#6ee7b7" }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(37, 99, 235, 0.3)"
                  }}
                >
                  Continuer vers la Charte Légale ➔
                </button>
              </div>
            ) : (
              <div>
                <AuthForm
                  onAuthSuccess={(u) => {
                    setUser(u);
                    setStep(2);
                  }}
                  showGoogleOption={true}
                />

                <div style={{ textAlign: "center", marginTop: "16px" }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer",
                      padding: "6px 10px",
                      textDecoration: "underline",
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                  >
                    Continuer sans compte (Mode 100% hors-ligne) ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 2 : CADRE LÉGAL & CHARTE DÉONTOLOGIQUE */}
        {/* ========================================================= */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: "800", color: "#f8fafc", letterSpacing: "-0.4px" }}>
                Cadre Légal & Charte Éthique
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.45" }}>
                Réglementation officielle française encadrant l'utilisation des détecteurs de métaux.
              </p>
            </div>

            {/* Structured Legal Box */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "12px",
                lineHeight: "1.45",
                color: "#cbd5e1"
              }}
            >
              <div>
                <div style={{ fontWeight: "700", color: "#f1f5f9", marginBottom: "3px" }}>
                  Article L. 542-1 du Code du patrimoine
                </div>
                <div style={{ color: "#94a3b8", fontStyle: "italic", fontSize: "11px" }}>
                  « Nul ne peut utiliser du matériel permettant la détection d'objets métalliques, à l'effet de recherches de monuments et d'objets pouvant intéresser la préhistoire, l'histoire, l'art ou l'archéologie, sans avoir, au préalable, obtenu une autorisation administrative. »
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "8px" }}>
                <div style={{ fontWeight: "700", color: "#f1f5f9", marginBottom: "3px" }}>
                  Découvertes fortuites (Art. L. 531-14)
                </div>
                <div style={{ color: "#94a3b8", fontSize: "11px" }}>
                  Toute découverte d'intérêt historique ou archéologique fortuite doit être immédiatement déclarée auprès de la mairie et du Service Régional de l'Archéologie (DRAC).
                </div>
              </div>
            </div>

            {/* 5 Legal Checkboxes */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: checkOwner ? "rgba(37, 99, 235, 0.08)" : "rgba(255, 255, 255, 0.02)",
                  border: checkOwner ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="checkbox"
                  checked={checkOwner}
                  onChange={(e) => setCheckOwner(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <span>J'obtiens systématiquement l'<strong>accord préalable du propriétaire</strong> de la parcelle (Code civil).</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: checkHeritage ? "rgba(37, 99, 235, 0.08)" : "rgba(255, 255, 255, 0.02)",
                  border: checkHeritage ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="checkbox"
                  checked={checkHeritage}
                  onChange={(e) => setCheckHeritage(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <span>Je respecte l'interdiction de recherche archéologique sans <strong>autorisation préfectorale (Art. L. 542-1)</strong>.</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: checkDeclaration ? "rgba(37, 99, 235, 0.08)" : "rgba(255, 255, 255, 0.02)",
                  border: checkDeclaration ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="checkbox"
                  checked={checkDeclaration}
                  onChange={(e) => setCheckDeclaration(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <span>Je m'engage à <strong>déclarer sans délai toute découverte fortuite</strong> en mairie et à la DRAC (Art. L. 531-14).</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: checkNature ? "rgba(37, 99, 235, 0.08)" : "rgba(255, 255, 255, 0.02)",
                  border: checkNature ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="checkbox"
                  checked={checkNature}
                  onChange={(e) => setCheckNature(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <span>Je m'engage à <strong>reboucher systématiquement mes trous</strong> et à ramasser les déchets métalliques.</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: checkCgu ? "rgba(37, 99, 235, 0.08)" : "rgba(255, 255, 255, 0.02)",
                  border: checkCgu ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="checkbox"
                  checked={checkCgu}
                  onChange={(e) => setCheckCgu(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <span>J'accepte les <strong>Conditions Générales d'Utilisation</strong> et la politique de confidentialité.</span>
              </label>
            </div>

            {/* Actions Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  background: "transparent",
                  color: "#94a3b8",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Retour
              </button>

              <button
                type="button"
                disabled={!allLegalChecked}
                onClick={() => setStep(3)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: allLegalChecked ? "#2563eb" : "rgba(255, 255, 255, 0.06)",
                  color: allLegalChecked ? "#ffffff" : "#64748b",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: allLegalChecked ? "pointer" : "not-allowed",
                  boxShadow: allLegalChecked ? "0 2px 10px rgba(37, 99, 235, 0.35)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                Valider et continuer ➔
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 3 : PRÉ-PERSONNALISATION */}
        {/* ========================================================= */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: "800", color: "#f8fafc", letterSpacing: "-0.4px" }}>
                Configuration Initiale
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.45" }}>
                Personnalisez votre affichage cartographique et l'interface de travail.
              </p>
            </div>

            {/* 1. Map Style */}
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.5px", marginBottom: "8px", display: "block" }}>
                Fond de carte par défaut
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div
                  onClick={() => setSelectedMapStyle("satellite")}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: selectedMapStyle === "satellite" ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                    background: selectedMapStyle === "satellite" ? "rgba(59, 130, 246, 0.12)" : "rgba(255, 255, 255, 0.02)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: "700", color: selectedMapStyle === "satellite" ? "#ffffff" : "#94a3b8" }}>
                    Satellite HD
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    Imagerie aérienne
                  </div>
                </div>

                <div
                  onClick={() => setSelectedMapStyle("streets")}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: selectedMapStyle === "streets" ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                    background: selectedMapStyle === "streets" ? "rgba(59, 130, 246, 0.12)" : "rgba(255, 255, 255, 0.02)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: "700", color: selectedMapStyle === "streets" ? "#ffffff" : "#94a3b8" }}>
                    Relief & Topo
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    Courbes de niveau
                  </div>
                </div>
              </div>
            </div>

            {/* 2. DA / Palette */}
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.5px", marginBottom: "8px", display: "block" }}>
                Palette Visuelle
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {Object.values(THEMES).map((th) => {
                  const isSel = selectedDesignTheme === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => setSelectedDesignTheme(th.id)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: isSel ? `2px solid ${th.colors.accent}` : "1px solid rgba(255, 255, 255, 0.08)",
                        background: isSel ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.02)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: th.colors.accent }} />
                      <span style={{ fontSize: "12px", fontWeight: isSel ? "700" : "500", color: isSel ? "#ffffff" : "#cbd5e1" }}>
                        {th.name.split(" (")[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Dark / Light Mode */}
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.5px", marginBottom: "8px", display: "block" }}>
                Mode d'Affichage
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedAppTheme("dark")}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    border: selectedAppTheme === "dark" ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                    background: selectedAppTheme === "dark" ? "rgba(59, 130, 246, 0.12)" : "rgba(255, 255, 255, 0.02)",
                    color: selectedAppTheme === "dark" ? "#ffffff" : "#94a3b8",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Sombre
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAppTheme("light")}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    border: selectedAppTheme === "light" ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                    background: selectedAppTheme === "light" ? "rgba(59, 130, 246, 0.12)" : "rgba(255, 255, 255, 0.02)",
                    color: selectedAppTheme === "light" ? "#ffffff" : "#94a3b8",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Clair
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  background: "transparent",
                  color: "#94a3b8",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Retour
              </button>

              <button
                type="button"
                onClick={handleFinish}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(37, 99, 235, 0.35)",
                  transition: "all 0.2s ease"
                }}
              >
                Accéder à l'application ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

