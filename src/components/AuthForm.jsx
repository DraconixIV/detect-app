import { useState } from "react";
import { supabase } from "../supabase";

export default function AuthForm({ onAuthSuccess, showGoogleOption = true, theme = "dark" }) {
  const [mode, setMode] = useState("signup"); // "signup" | "login" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isLight = theme === "light";
  const inputBg = isLight ? "#f3f4f2" : "#111915";
  const inputBorder = isLight ? "#e2e6e3" : "rgba(255, 255, 255, 0.12)";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";

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
        const currentRedirectUrl = typeof window !== "undefined"
          ? window.location.origin.replace(/\/+$/, "")
          : "https://detect-app-iota.vercel.app";

        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: currentRedirectUrl
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
      try {
        sessionStorage.setItem("geoprospect_onboarding_oauth_pending", "true");
        sessionStorage.setItem("geoprospect_onboarding_step", "4");
      } catch (storageErr) {
        console.warn("Session storage error before Google auth:", storageErr);
      }

      const currentRedirectUrl = typeof window !== "undefined"
        ? window.location.origin.replace(/\/+$/, "")
        : "https://detect-app-iota.vercel.app";

      const { error } = await supabase.auth.signInWithOAuth({
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
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", boxSizing: "border-box" }}>
      {/* Segmented Pill Control : Créer un compte / Se connecter */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: inputBg,
          padding: "4px",
          borderRadius: "999px",
          border: `1px solid ${inputBorder}`
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
            padding: "8px",
            borderRadius: "999px",
            border: "none",
            background: mode === "signup" ? "#2c5e4c" : "transparent",
            color: mode === "signup" ? "#ffffff" : textSub,
            fontWeight: "400",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease"
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
            padding: "8px",
            borderRadius: "999px",
            border: "none",
            background: mode === "login" ? "#2c5e4c" : "transparent",
            color: mode === "login" ? "#ffffff" : textSub,
            fontWeight: "400",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease"
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
              borderRadius: "10px",
              border: `1px solid ${inputBorder}`,
              background: inputBg,
              color: textMain,
              fontSize: "13px",
              fontWeight: "400",
              cursor: googleLoading ? "wait" : "pointer",
              opacity: googleLoading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s ease",
              boxSizing: "border-box"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
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
            <div style={{ flex: 1, height: "1px", background: inputBorder }} />
            <span style={{ fontSize: "11px", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "400" }}>
              ou par email
            </span>
            <div style={{ flex: 1, height: "1px", background: inputBorder }} />
          </div>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ fontSize: "12px", fontWeight: "400", color: textMain, marginBottom: "6px", display: "block" }}>
            Adresse e-mail
          </label>
          <input
            type="email"
            placeholder="adresse@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "11px 14px",
              borderRadius: "10px",
              border: `1px solid ${inputBorder}`,
              background: inputBg,
              color: textMain,
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        {mode !== "reset" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: "400", color: textMain }}>
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
                    color: isLight ? "#2c5e4c" : "#80b99c",
                    fontWeight: "400",
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
                border: `1px solid ${inputBorder}`,
                background: inputBg,
                color: textMain,
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box"
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
              background: isLight ? "#fef2f2" : "rgba(220, 38, 38, 0.14)",
              border: isLight ? "1px solid #fecaca" : "1px solid rgba(220, 38, 38, 0.3)",
              color: isLight ? "#b91c1c" : "#f87171",
              fontSize: "12px",
              lineHeight: "1.4",
              fontWeight: "400"
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
              background: isLight ? "#eef2ee" : "rgba(44, 94, 76, 0.25)",
              border: isLight ? "1px solid #c8d6ce" : "1px solid rgba(64, 145, 108, 0.4)",
              color: isLight ? "#2c5e4c" : "#80b99c",
              fontSize: "12px",
              lineHeight: "1.4",
              fontWeight: "400"
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
            borderRadius: "10px",
            border: "none",
            background: "#2c5e4c",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "400",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.2s ease"
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
              color: textSub,
              fontSize: "12px",
              cursor: "pointer",
              padding: "4px"
            }}
          >
            Retour à la connexion
          </button>
        )}
      </form>
    </div>
  );
}
