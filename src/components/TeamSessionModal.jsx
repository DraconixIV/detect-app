import React, { useState } from "react";
import {
  getMyUserCode,
  getMyDisplayName,
  setMyDisplayName,
  createTeamSession,
  joinTeamSession,
  leaveTeamSession,
  getActiveSession
} from "../services/sessionService";

export default function TeamSessionModal({
  isOpen,
  onClose,
  workspace,
  setWorkspace,
  theme = "dark"
}) {
  const [tab, setTab] = useState("my-code"); // "my-code" | "consult" | "session"
  const [myCode] = useState(() => getMyUserCode());
  const [displayName, setDisplayName] = useState(() => getMyDisplayName());
  const [nameSaved, setNameSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Consultation state
  const [consultCodeInput, setConsultCodeInput] = useState("");

  // Team session state
  const [newSessionName, setNewSessionName] = useState("");
  const [joinSessionCodeInput, setJoinSessionCodeInput] = useState("");
  const [activeSession, setActiveSessionState] = useState(() => getActiveSession());

  if (!isOpen) return null;

  const handleSaveName = (e) => {
    e.preventDefault();
    setMyDisplayName(displayName);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleCopyCode = (codeToCopy) => {
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleStartConsultation = (e) => {
    e.preventDefault();
    const clean = consultCodeInput.trim().toUpperCase();
    if (!clean) return;
    setWorkspace({
      mode: "consultation",
      targetCode: clean,
      sessionName: `Carte de ${clean}`
    });
    onClose();
  };

  const handleCreateSession = (e) => {
    e.preventDefault();
    const session = createTeamSession(newSessionName);
    setActiveSessionState(session);
    setWorkspace({
      mode: "session",
      targetCode: session.code,
      sessionName: session.name
    });
    onClose();
  };

  const handleJoinSession = (e) => {
    e.preventDefault();
    const clean = joinSessionCodeInput.trim().toUpperCase();
    if (!clean) return;
    const session = joinTeamSession(clean);
    setActiveSessionState(session);
    setWorkspace({
      mode: "session",
      targetCode: session.code,
      sessionName: session.name
    });
    onClose();
  };

  const handleLeaveSession = () => {
    leaveTeamSession();
    setActiveSessionState(null);
    setWorkspace({
      mode: "personal",
      targetCode: null,
      sessionName: null
    });
    onClose();
  };

  const isLight = theme === "light";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        background: "rgba(5, 8, 16, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: isLight ? "#ffffff" : "#0f172a",
          borderRadius: "20px",
          border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
          padding: "22px 20px",
          color: isLight ? "#0f172a" : "#f8fafc",
          boxSizing: "border-box"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h2 style={{ margin: "0 0 2px 0", fontSize: "18px", fontWeight: "800", letterSpacing: "-0.3px" }}>
              Partage & Sessions d'Équipe
            </h2>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
              Collaboration et consultation multi-détecteurs
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.08)",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isLight ? "#475569" : "#94a3b8",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            background: isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.05)",
            padding: "3px",
            borderRadius: "12px",
            border: isLight ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.08)",
            marginBottom: "18px"
          }}
        >
          <button
            type="button"
            onClick={() => setTab("my-code")}
            style={{
              padding: "8px 4px",
              borderRadius: "9px",
              border: "none",
              background: tab === "my-code" ? "#2563eb" : "transparent",
              color: tab === "my-code" ? "#ffffff" : (isLight ? "#64748b" : "#94a3b8"),
              fontWeight: tab === "my-code" ? "700" : "500",
              fontSize: "11px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Mon Code
          </button>

          <button
            type="button"
            onClick={() => setTab("consult")}
            style={{
              padding: "8px 4px",
              borderRadius: "9px",
              border: "none",
              background: tab === "consult" ? "#2563eb" : "transparent",
              color: tab === "consult" ? "#ffffff" : (isLight ? "#64748b" : "#94a3b8"),
              fontWeight: tab === "consult" ? "700" : "500",
              fontSize: "11px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Consulter
          </button>

          <button
            type="button"
            onClick={() => setTab("session")}
            style={{
              padding: "8px 4px",
              borderRadius: "9px",
              border: "none",
              background: tab === "session" ? "#2563eb" : "transparent",
              color: tab === "session" ? "#ffffff" : (isLight ? "#64748b" : "#94a3b8"),
              fontWeight: tab === "session" ? "700" : "500",
              fontSize: "11px",
              cursor: "pointer",
              transition: "all 0.2s",
              position: "relative"
            }}
          >
            <span>Session Live</span>
            {workspace.mode === "session" && (
              <span
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#10b981"
                }}
              />
            )}
          </button>
        </div>

        {/* TAB 1: MON CODE DETECTEUR */}
        {tab === "my-code" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.03)",
                border: isLight ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "16px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "700", color: "#64748b", letterSpacing: "0.5px" }}>
                Votre Code Détecteur Unique
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "900",
                  letterSpacing: "2px",
                  color: "#3b82f6",
                  margin: "8px 0 12px 0",
                  fontFamily: "ui-monospace, monospace"
                }}
              >
                {myCode}
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(myCode)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: copiedCode ? "#10b981" : "#2563eb",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "background 0.2s"
                }}
              >
                <span>{copiedCode ? "✓ Code copié dans le presse-papier !" : "Copier mon code"}</span>
              </button>
            </div>

            {/* Pseudonym field */}
            <form onSubmit={handleSaveName} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8" }}>
                Votre Pseudo / Prénom affiché en session d'équipe :
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ex: Thomas"
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)",
                    background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
                    color: isLight ? "#0f172a" : "#ffffff",
                    fontSize: "13px",
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "none",
                    background: nameSaved ? "#10b981" : "#3b82f6",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  {nameSaved ? "✓" : "Enregistrer"}
                </button>
              </div>
            </form>

            <div style={{ fontSize: "11px", color: "#64748b", lineHeight: "1.4" }}>
              💡 Donnez votre code à un ami pour qu'il puisse charger votre carte en lecture seule, ou utilisez une session live pour détecter à plusieurs en même temps.
            </div>
          </div>
        )}

        {/* TAB 2: CONSULTER UNE CARTE EN LECTURE SEULE */}
        {tab === "consult" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <form onSubmit={handleStartConsultation} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                  Saisir le Code Détecteur de votre ami (ex: RDL-XXXX) :
                </label>
                <input
                  type="text"
                  value={consultCodeInput}
                  onChange={(e) => setConsultCodeInput(e.target.value)}
                  placeholder="RDL-XXXX"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)",
                    background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
                    color: isLight ? "#0f172a" : "#ffffff",
                    fontSize: "14px",
                    fontWeight: "700",
                    fontFamily: "ui-monospace, monospace",
                    letterSpacing: "1px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Charger la carte en lecture seule ➔
              </button>
            </form>

            {workspace.mode === "consultation" && (
              <div
                style={{
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "12px",
                  padding: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#60a5fa" }}>
                    Mode Consultation Actif
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Carte de : {workspace.targetCode}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setWorkspace({ mode: "personal", targetCode: null, sessionName: null });
                    onClose();
                  }}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Revenir à ma carte
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SESSION D'EQUIPE EN DIRECT */}
        {tab === "session" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {workspace.mode === "session" ? (
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#10b981", textTransform: "uppercase" }}>
                      🟢 Session Live Active
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: "800", color: isLight ? "#0f172a" : "#f8fafc" }}>
                      {workspace.sessionName || "Session d'Équipe"}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: "14px",
                      fontWeight: "800",
                      background: "rgba(16, 185, 129, 0.2)",
                      color: "#4ade80",
                      padding: "4px 8px",
                      borderRadius: "6px"
                    }}
                  >
                    {workspace.targetCode}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(workspace.targetCode)}
                  style={{
                    width: "100%",
                    padding: "9px",
                    borderRadius: "8px",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: isLight ? "#065f46" : "#6ee7b7",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  {copiedCode ? "✓ Code copié !" : "Copier le code pour inviter un ami"}
                </button>

                <button
                  type="button"
                  onClick={handleLeaveSession}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  Quitter la session d'équipe
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* 1. Create a session */}
                <form
                  onSubmit={handleCreateSession}
                  style={{
                    background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.03)",
                    border: isLight ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#3b82f6" }}>
                    ✨ Créer une nouvelle session d'équipe
                  </div>
                  <input
                    type="text"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    placeholder="Nom (ex: Sortie Forêt Dimanche)"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.1)",
                      background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
                      color: isLight ? "#0f172a" : "#ffffff",
                      fontSize: "12px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#2563eb",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    Démarrer la session d'équipe ➔
                  </button>
                </form>

                {/* 2. Join a session */}
                <form
                  onSubmit={handleJoinSession}
                  style={{
                    background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.03)",
                    border: isLight ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#10b981" }}>
                    🔗 Rejoindre une session existante
                  </div>
                  <input
                    type="text"
                    value={joinSessionCodeInput}
                    onChange={(e) => setJoinSessionCodeInput(e.target.value)}
                    placeholder="TEAM-XXXX"
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.1)",
                      background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
                      color: isLight ? "#0f172a" : "#ffffff",
                      fontSize: "13px",
                      fontFamily: "ui-monospace, monospace",
                      letterSpacing: "1px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#10b981",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    Rejoindre l'équipe ➔
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
