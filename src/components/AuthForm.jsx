import { useState } from "react";
import { supabase } from "../supabase";

export default function AuthForm({ onAuthSuccess, showGoogleOption = true, theme = "light" }) {
  // Mode par défaut : "signup" (Créer un compte à gauche)
  const [mode, setMode] = useState("signup"); // "signup" | "login" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isLight = theme === "light";

  const handleEmailAuth = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Veuillez renseigner une adresse email valide.");
      return;
    }

    if (mode === "reset") {
      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: window.location.origin
        });
        if (error) throw error;
        setSuccessMsg("Un lien de réinitialisation vous a été envoyé par email.");
      } catch (err) {
        setErrorMsg(err.message || "Erreur lors de l'envoi de l'email.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorMsg("Veuillez saisir votre mot de passe.");
      return;
    }

    if (mode === "signup" && password.length < 6) {
      setErrorMsg("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password
        });
        if (error) throw error;

        if (data?.session) {
          setSuccessMsg("Compte créé avec succès.");
          if (onAuthSuccess) onAuthSuccess(data.user);
        } else {
          setSuccessMsg("Compte créé. Veuillez vérifier vos emails pour confirmer votre inscription.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Identifiants incorrects (email ou mot de passe invalide).");
          }
          throw error;
        }

        setSuccessMsg("Connexion réussie.");
        if (onAuthSuccess) onAuthSuccess(data.user);
      }
    } catch (err) {
      setErrorMsg(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setGoogleLoading(true);
    try {
      // Determine accurate redirect URL based on environment (PWA / Web / Local)
      const currentRedirectUrl = window.location.origin + window.location.pathname;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: currentRedirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent"
          }
        }
      });

      if (error) {
        if (
          error.message?.includes("not enabled") ||
          error.message?.includes("Unsupported provider") ||
          error.message?.includes("provider is not enabled")
        ) {
          throw new Error(
            "Le fournisseur Google n'est pas encore activé sur votre console Supabase (Authentication > Providers > Google)."
          );
        }
        throw error;
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      setErrorMsg(err.message || "Erreur lors de l'authentification Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", boxSizing: "border-box" }}>
      {/* Segmented Control : Créer un compte (Gauche) / Se connecter (Droite) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.05)",
          padding: "3px",
          borderRadius: "12px",
          border: isLight ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.08)"
        }}
      >
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          style={{
            padding: "9px 8px",
            borderRadius: "9px",
            border: "none",
            background: mode === "signup" ? "#2563eb" : "transparent",
            color: mode === "signup" ? "#ffffff" : (isLight ? "#64748b" : "#94a3b8"),
            fontWeight: mode === "signup" ? "700" : "600",
            fontSize: "12px",
            letterSpacing: "0.2px",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: mode === "signup" ? "0 2px 8px rgba(37, 99, 235, 0.35)" : "none"
          }}
        >
          Créer un compte
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          style={{
            padding: "9px 8px",
            borderRadius: "9px",
            border: "none",
            background: mode === "login" ? "#2563eb" : "transparent",
            color: mode === "login" ? "#ffffff" : (isLight ? "#64748b" : "#94a3b8"),
            fontWeight: mode === "login" ? "700" : "600",
            fontSize: "12px",
            letterSpacing: "0.2px",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: mode === "login" ? "0 2px 8px rgba(37, 99, 235, 0.35)" : "none"
          }}
        >
          Se connecter
        </button>
      </div>

      {/* Google OAuth Button */}
      {showGoogleOption && (
        <div>
          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: "11px 16px",
              borderRadius: "12px",
              border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)",
              background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
              color: isLight ? "#000000" : "#f8fafc",
              fontSize: "13px",
              fontWeight: "600",
              cursor: googleLoading ? "wait" : "pointer",
              opacity: googleLoading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s ease",
              boxSizing: "border-box",
              boxShadow: isLight ? "0 1px 3px rgba(0,0,0,0.06)" : "none"
            }}
            onMouseEnter={(e) => {
              if (!googleLoading) {
                e.currentTarget.style.background = isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = isLight ? "#94a3b8" : "rgba(255, 255, 255, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (!googleLoading) {
                e.currentTarget.style.background = isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)";
                e.currentTarget.style.borderColor = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.12)";
              }
            }}
          >
            {/* Official Google Vector Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? "Connexion Google en cours..." : "Continuer avec Google"}</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "14px 0 2px 0" }}>
            <div style={{ flex: 1, height: "1px", background: isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.08)" }} />
            <span style={{ fontSize: "11px", color: isLight ? "#1e293b" : "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "700" }}>
              ou par email
            </span>
            <div style={{ flex: 1, height: "1px", background: isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.08)" }} />
          </div>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ fontSize: "11px", fontWeight: "700", color: isLight ? "#000000" : "#94a3b8", marginBottom: "6px", display: "block" }}>
            Adresse e-mail
          </label>
          <input
            type="email"
            placeholder="nom@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "11px 14px",
              borderRadius: "10px",
              border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)",
              background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.04)",
              color: isLight ? "#000000" : "#f8fafc",
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#2563eb";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.15)";
              if (isLight) e.currentTarget.style.background = "#ffffff";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.boxShadow = "none";
              if (isLight) e.currentTarget.style.background = "#f8fafc";
            }}
          />
        </div>

        {mode !== "reset" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: isLight ? "#000000" : "#94a3b8" }}>
                Mot de passe
              </label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("reset");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    fontSize: "11px",
                    color: "#2563eb",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Mot de passe oublié ?
                </button>
              )}
            </div>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "10px",
                border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)",
                background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.04)",
                color: isLight ? "#000000" : "#f8fafc",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.15)";
                if (isLight) e.currentTarget.style.background = "#ffffff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.12)";
                e.currentTarget.style.boxShadow = "none";
                if (isLight) e.currentTarget.style.background = "#f8fafc";
              }}
            />
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMsg && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              background: isLight ? "#fef2f2" : "rgba(239, 68, 68, 0.1)",
              border: isLight ? "1px solid #fecaca" : "1px solid rgba(239, 68, 68, 0.25)",
              color: isLight ? "#b91c1c" : "#fca5a5",
              fontSize: "12px",
              lineHeight: "1.4"
            }}
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              background: isLight ? "#ecfdf5" : "rgba(16, 185, 129, 0.1)",
              border: isLight ? "1px solid #a7f3d0" : "1px solid rgba(16, 185, 129, 0.25)",
              color: isLight ? "#047857" : "#86efac",
              fontSize: "12px",
              lineHeight: "1.4"
            }}
          >
            {successMsg}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "4px",
            padding: "12px 16px",
            borderRadius: "11px",
            border: "none",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 2px 10px rgba(37, 99, 235, 0.3)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)";
          }}
        >
          {loading
            ? "Traitement en cours..."
            : mode === "signup"
            ? "Créer mon compte"
            : mode === "reset"
            ? "Envoyer le lien de réinitialisation"
            : "Se connecter"}
        </button>

        {mode === "reset" && (
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            style={{
              background: "transparent",
              border: "none",
              color: isLight ? "#64748b" : "#94a3b8",
              fontSize: "12px",
              cursor: "pointer",
              padding: "4px"
            }}
          >
            ← Retour à la connexion
          </button>
        )}
      </form>
    </div>
  );
}
