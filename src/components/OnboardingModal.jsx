import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { THEMES } from "../styles/themes";
import AuthForm from "./AuthForm";

export default function OnboardingModal({ isOpen, onComplete }) {
  const [step, setStep] = useState(1); // 1: Compte/Connexion, 2: Législation & Charte Éthique, 3: Pré-personnalisation
  const [user, setUser] = useState(null);
  const [showAuthSection, setShowAuthSection] = useState(false);

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
    localStorage.setItem("rdl_onboarding_completed", "true");
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
    localStorage.setItem("rdl_onboarding_completed", "true");
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
        background: "rgba(3, 7, 18, 0.92)",
        backdropFilter: "blur(12px)",
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
          maxWidth: "480px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "linear-gradient(145deg, #182234, #0b1329)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
          padding: "24px",
          color: "white",
          boxSizing: "border-box",
          position: "relative"
        }}
      >
        {/* Dev Skip Top Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          {/* Step Indicator */}
          <div style={{ display: "flex", gap: "6px" }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  width: "24px",
                  height: "6px",
                  borderRadius: "3px",
                  background: step === s ? "#facc15" : (step > s ? "#10b981" : "rgba(255, 255, 255, 0.15)"),
                  transition: "background 0.3s"
                }}
              />
            ))}
          </div>

          <button
            onClick={handleDevSkip}
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
              border: "1px solid rgba(250, 204, 21, 0.4)",
              background: "rgba(250, 204, 21, 0.12)",
              color: "#facc15",
              fontSize: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
            title="Bypass pour le développement"
          >
            <span>⚡ Dev Skip</span>
          </button>
        </div>

        {/* ÉTAPE 1 : CONNEXION & COMPTE */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ textAlign: "center", marginBottom: "4px" }}>
              <div style={{ fontSize: "36px", marginBottom: "6px" }}>👋</div>
              <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: "800", color: "#facc15" }}>
                Bienvenue sur RDL DETECT
              </h2>
              <p style={{ margin: 0, fontSize: "12px", opacity: 0.75, lineHeight: "1.4" }}>
                Votre carnet de bord numérique de détection et télémétrie de terrain.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "16px"
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: "800", marginBottom: "6px", color: "#60a5fa", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>👤</span>
                <span>Étape 1 : Connexion à votre Espace</span>
              </div>

              {user ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                  <div style={{ padding: "10px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", fontSize: "12px", color: "#4ade80", fontWeight: "bold" }}>
                    ✅ Connecté avec succès : {user.email}
                  </div>
                  <p style={{ margin: 0, fontSize: "11px", opacity: 0.7 }}>
                    Vos trouvailles et parcours seront synchronisés en continu sur votre compte.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "6px" }}>
                  <p style={{ margin: 0, fontSize: "11px", opacity: 0.8, lineHeight: "1.4" }}>
                    Connectez-vous pour sauvegarder automatiquement vos photos et coordonnées GPS dans votre cloud sécurisé.
                  </p>

                  {!showAuthSection ? (
                    <button
                      type="button"
                      onClick={() => setShowAuthSection(true)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "12px",
                        border: "none",
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
                      }}
                    >
                      <span>🔑</span>
                      <span>Se connecter (Google / Email)</span>
                    </button>
                  ) : (
                    <div style={{ marginTop: "6px" }}>
                      <AuthForm
                        onAuthSuccess={(u) => {
                          setUser(u);
                          setShowAuthSection(false);
                        }}
                      />
                    </div>
                  )}

                  <div style={{ textAlign: "center", fontSize: "10px", opacity: 0.6, marginTop: "2px" }}>
                    Ou continuez sans compte (Mode 100% Local sur votre téléphone).
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg, #facc15, #eab308)",
                color: "#1e293b",
                fontWeight: "800",
                fontSize: "13px",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(250, 204, 21, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <span>Continuer vers le Cadre Légal</span>
              <span>➔</span>
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : CADRE LÉGAL, CODE DU PATRIMOINE & CHARTE */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "4px" }}>⚖️</div>
              <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "800", color: "#f87171" }}>
                Cadre Légal & Charte Éthique
              </h2>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.75 }}>
                Réglementation officielle française sur la détection d'objets métalliques
              </p>
            </div>

            {/* Official law references card */}
            <div
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "14px",
                padding: "12px",
                fontSize: "11px",
                lineHeight: "1.45"
              }}
            >
              <div style={{ fontWeight: "bold", color: "#fca5a5", marginBottom: "4px" }}>
                📜 Article L. 542-1 du Code du patrimoine :
              </div>
              <p style={{ margin: "0 0 6px 0", fontStyle: "italic", opacity: 0.9 }}>
                « Nul ne peut utiliser du matériel permettant la détection d'objets métalliques, à l'effet de recherches de monuments et d'objets pouvant intéresser la préhistoire, l'histoire, l'art ou l'archéologie, sans avoir, au préalable, obtenu une autorisation administrative. »
              </p>
              <div style={{ fontWeight: "bold", color: "#fca5a5", marginBottom: "2px" }}>
                🏛️ Déclaration des découvertes fortuites (Art. L. 531-14) :
              </div>
              <p style={{ margin: 0, opacity: 0.85 }}>
                Toute découverte fortuite intéressant le patrimoine national doit être déclarée sans délai à la mairie de la commune et au Service Régional de l'Archéologie (DRAC).
              </p>
            </div>

            {/* 5 Mandated Checkboxes */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", background: "rgba(255,255,255,0.04)", padding: "8px 10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontSize: "11px" }}>
                <input
                  type="checkbox"
                  checked={checkOwner}
                  onChange={(e) => setCheckOwner(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "1px", accentColor: "#facc15" }}
                />
                <span>J'obtiens systématiquement l'<strong>accord préalable du propriétaire</strong> de la parcelle avant de prospecter (Code civil).</span>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", background: "rgba(255,255,255,0.04)", padding: "8px 10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontSize: "11px" }}>
                <input
                  type="checkbox"
                  checked={checkHeritage}
                  onChange={(e) => setCheckHeritage(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "1px", accentColor: "#facc15" }}
                />
                <span>Je reconnais l'interdiction totale de rechercher des objets archéologiques sans <strong>autorisation préfectorale (Art. L. 542-1)</strong>.</span>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", background: "rgba(255,255,255,0.04)", padding: "8px 10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontSize: "11px" }}>
                <input
                  type="checkbox"
                  checked={checkDeclaration}
                  onChange={(e) => setCheckDeclaration(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "1px", accentColor: "#facc15" }}
                />
                <span>Je m'engage à <strong>déclarer toute découverte fortuite</strong> d'intérêt historique ou archéologique (Art. L. 531-14).</span>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", background: "rgba(255,255,255,0.04)", padding: "8px 10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontSize: "11px" }}>
                <input
                  type="checkbox"
                  checked={checkNature}
                  onChange={(e) => setCheckNature(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "1px", accentColor: "#facc15" }}
                />
                <span>Je m'engage à <strong>reboucher systématiquement tous mes trous</strong> et à ramasser les déchets métalliques trouvés.</span>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", background: "rgba(255,255,255,0.04)", padding: "8px 10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontSize: "11px" }}>
                <input
                  type="checkbox"
                  checked={checkCgu}
                  onChange={(e) => setCheckCgu(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "1px", accentColor: "#facc15" }}
                />
                <span>J'accepte les <strong>CGU</strong> et reconnais la protection et confidentialité stricte de mes données sensibles (RGPD).</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: "12px 16px",
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
                disabled={!allLegalChecked}
                onClick={() => setStep(3)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "14px",
                  border: "none",
                  background: allLegalChecked ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.1)",
                  color: allLegalChecked ? "white" : "rgba(255,255,255,0.3)",
                  fontWeight: "800",
                  fontSize: "13px",
                  cursor: allLegalChecked ? "pointer" : "not-allowed",
                  boxShadow: allLegalChecked ? "0 4px 15px rgba(16, 185, 129, 0.4)" : "none"
                }}
              >
                Valider & Personnaliser ➔
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : PRÉ-PERSONNALISATION COMPLETE */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "4px" }}>🎛️</div>
              <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "800", color: "#facc15" }}>
                Configuration de votre Outil
              </h2>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.75 }}>
                Choisissez votre interface et vos préférences par défaut
              </p>
            </div>

            {/* 1. Map Style */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: "#60a5fa", marginBottom: "6px" }}>
                🗺️ Fond de Carte par Défaut
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div
                  onClick={() => setSelectedMapStyle("satellite")}
                  style={{
                    padding: "10px",
                    borderRadius: "12px",
                    border: selectedMapStyle === "satellite" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                    background: selectedMapStyle === "satellite" ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.04)",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: "18px" }}>🛰️</div>
                  <div style={{ fontSize: "11px", fontWeight: "bold" }}>Satellite</div>
                </div>

                <div
                  onClick={() => setSelectedMapStyle("streets")}
                  style={{
                    padding: "10px",
                    borderRadius: "12px",
                    border: selectedMapStyle === "streets" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                    background: selectedMapStyle === "streets" ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.04)",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: "18px" }}>🏞️</div>
                  <div style={{ fontSize: "11px", fontWeight: "bold" }}>Relief / Paysage</div>
                </div>
              </div>
            </div>

            {/* 2. Direction Artistique / Palette */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: "#60a5fa", marginBottom: "6px" }}>
                🎨 Direction Artistique (Cockpit)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                {Object.values(THEMES).map((th) => {
                  const isSel = selectedDesignTheme === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => setSelectedDesignTheme(th.id)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "10px",
                        border: isSel ? `2px solid ${th.colors.accent}` : "1px solid rgba(255,255,255,0.1)",
                        background: isSel ? `${th.colors.accent}20` : "rgba(255,255,255,0.04)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>{th.icon}</span>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: "800", color: isSel ? th.colors.accent : "white" }}>
                          {th.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Thème Nuit / Jour */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: "#60a5fa", marginBottom: "6px" }}>
                🌓 Mode Visuel
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedAppTheme("dark")}
                  style={{
                    padding: "8px",
                    borderRadius: "10px",
                    border: selectedAppTheme === "dark" ? "2px solid #facc15" : "1px solid rgba(255,255,255,0.1)",
                    background: selectedAppTheme === "dark" ? "rgba(250, 204, 21, 0.15)" : "rgba(255,255,255,0.04)",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  🌙 Sombre (Nuit)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAppTheme("light")}
                  style={{
                    padding: "8px",
                    borderRadius: "10px",
                    border: selectedAppTheme === "light" ? "2px solid #2563eb" : "1px solid rgba(255,255,255,0.1)",
                    background: selectedAppTheme === "light" ? "rgba(37, 99, 235, 0.2)" : "rgba(255,255,255,0.04)",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  ☀️ Clair (Jour)
                </button>
              </div>
            </div>

            {/* 4. GPS Marker Style */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: "#60a5fa", marginBottom: "6px" }}>
                📍 Style du Pointeur GPS
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedGpsStyle("blue-dot")}
                  style={{
                    padding: "8px",
                    borderRadius: "10px",
                    border: selectedGpsStyle === "blue-dot" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                    background: selectedGpsStyle === "blue-dot" ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.04)",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  🔵 Point Pulse
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGpsStyle("pin")}
                  style={{
                    padding: "8px",
                    borderRadius: "10px",
                    border: selectedGpsStyle === "pin" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                    background: selectedGpsStyle === "pin" ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.04)",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  📍 Épingle
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: "12px 16px",
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
                Lancer l'Application 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
