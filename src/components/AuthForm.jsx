import { useState } from "react";
import { supabase } from "../supabase";

export default function AuthForm({ onAuthSuccess, showGoogleOption = true, isCompact = false }) {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "reset"
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
      setErrorMsg("Veuillez saisir votre adresse email.");
      return;
    }

    if (mode === "reset") {
      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: window.location.origin
        });
        if (error) throw error;
        setSuccessMsg("Email de réinitialisation envoyé ! Vérifiez votre boîte mail.");
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
      setErrorMsg("Le mot de passe doit contenir au moins 6 caractères.");
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
          setSuccessMsg("Compte créé avec succès ! Connecté.");
          if (onAuthSuccess) onAuthSuccess(data.user);
        } else {
          setSuccessMsg("Compte créé ! Veuillez vérifier vos emails pour confirmer votre adresse.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Email ou mot de passe incorrect.");
          }
          throw error;
        }

        setSuccessMsg("Connexion réussie !");
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
      setErrorMsg("Erreur Google OAuth : " + (err.message || err));
    }
  };

  const inputStyle = {
    padding: "11px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    background: "rgba(255, 255, 255, 0.06)",
    color: "#ffffff",
    fontSize: "13px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
      {/* Mode selector (Connexion / Inscription) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: "rgba(0, 0, 0, 0.3)",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.06)"
        }}
      >
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          style={{
            padding: "8px 4px",
            borderRadius: "9px",
            border: "none",
            background: mode === "login" ? "rgba(59, 130, 246, 0.9)" : "transparent",
            color: mode === "login" ? "#ffffff" : "#9ca3af",
            fontWeight: mode === "login" ? "700" : "500",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          🔑 Se connecter
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          style={{
            padding: "8px 4px",
            borderRadius: "9px",
            border: "none",
            background: mode === "signup" ? "rgba(16, 185, 129, 0.9)" : "transparent",
            color: mode === "signup" ? "#ffffff" : "#9ca3af",
            fontWeight: mode === "signup" ? "700" : "500",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          ✨ Créer un compte
        </button>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", marginBottom: "4px", display: "block" }}>
            Adresse e-mail
          </label>
          <input
            type="email"
            placeholder="exemple@domaine.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {mode !== "reset" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af" }}>
                Mot de passe
              </label>
              {mode === "login" && (
                <span
                  onClick={() => {
                    setMode("reset");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  style={{ fontSize: "10px", color: "#60a5fa", cursor: "pointer", textDecoration: "underline" }}
                >
                  Mot de passe oublié ?
                </span>
              )}
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMsg && (
          <div
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              fontSize: "11px",
              lineHeight: "1.4"
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#86efac",
              fontSize: "11px",
              lineHeight: "1.4"
            }}
          >
            ✅ {successMsg}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background: mode === "signup"
              ? "linear-gradient(135deg, #10b981, #059669)"
              : "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "white",
            fontSize: "13px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            marginTop: "4px"
          }}
        >
          {loading
            ? "Chargement..."
            : mode === "signup"
            ? "Créer mon compte 🚀"
            : mode === "reset"
            ? "Envoyer l'email de réinitialisation ✉️"
            : "Se connecter ➔"}
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
              color: "#9ca3af",
              fontSize: "11px",
              cursor: "pointer",
              padding: "4px"
            }}
          >
            ← Retour à la connexion
          </button>
        )}
      </form>

      {/* Alternative: Google OAuth */}
      {showGoogleOption && (
        <div style={{ marginTop: "4px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "6px 0 10px 0"
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
            <span style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase" }}>ou</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "background 0.2s"
            }}
          >
            <span>🌐</span>
            <span>Continuer avec Google</span>
          </button>
        </div>
      )}
    </div>
  );
}
