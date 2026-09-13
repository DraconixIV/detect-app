import { useState } from "react";
import { supabase } from "../supabase";

export default function AuthForm({ onAuthSuccess, showGoogleOption = true }) {
  // Mode par défaut : "signup" (Créer un compte à gauche)
  const [mode, setMode] = useState("signup"); // "signup" | "login" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setErrorMsg("Erreur d'authentification Google : " + (err.message || err));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", boxSizing: "border-box" }}>
      {/* Segmented Control : Créer un compte (Gauche) / Se connecter (Droite) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: "rgba(255, 255, 255, 0.05)",
          padding: "3px",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.08)"
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
            color: mode === "signup" ? "#ffffff" : "#94a3b8",
            fontWeight: mode === "signup" ? "700" : "500",
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
            color: mode === "login" ? "#ffffff" : "#94a3b8",
            fontWeight: mode === "login" ? "700" : "500",
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
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: "11px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "rgba(255, 255, 255, 0.04)",
              color: "#f8fafc",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s ease",
              boxSizing: "border-box"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
            }}
          >
            {/* Official Google Vector Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: "block" }}>
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continuer avec Google</span>
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "14px 0 6px 0"
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.08)" }} />
            <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>
              ou par email
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.08)" }} />
          </div>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px", display: "block" }}>
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
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "rgba(255, 255, 255, 0.04)",
              color: "#f8fafc",
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {mode !== "reset" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8" }}>
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
                    color: "#60a5fa",
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
                border: "1px solid rgba(255, 255, 255, 0.12)",
                background: "rgba(255, 255, 255, 0.04)",
                color: "#f8fafc",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                e.currentTarget.style.boxShadow = "none";
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
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#fca5a5",
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
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              color: "#86efac",
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
            background: "#2563eb",
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
            if (!loading) e.currentTarget.style.background = "#2563eb";
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
              color: "#94a3b8",
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
