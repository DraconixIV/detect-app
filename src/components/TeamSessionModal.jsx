import React, { useState, useEffect } from "react";
import {
  getMyUserCode,
  getMyDisplayName,
  setMyDisplayName,
  isDisplayNameLocked,
  createTeamSession,
  joinTeamSession,
  leaveTeamSession,
  getActiveSession,
  normalizeSessionCode,
  isSessionHost,
  isLocallyBannedFromSession,
  resetAndGenerateNewUserCode
} from "../services/sessionService";

export default function TeamSessionModal({
  isOpen,
  onClose,
  workspace,
  setWorkspace,
  theme = "dark",
  teammates = [],
  isHost = false,
  isLocked = false,
  bannedList = [],
  kickTeammate,
  banTeammate,
  unbanTeammate,
  toggleSessionLock,
  requestMapConsultation,
  activeViewers = [],
  revokeViewerAccess
}) {
  const [tab, setTab] = useState("session"); // "session" | "my-code" | "consult"
  const [myCode, setMyCode] = useState(() => getMyUserCode());
  const [displayName, setDisplayName] = useState(() => getMyDisplayName());
  const [nameSaved, setNameSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSessionCode, setCopiedSessionCode] = useState(false);
  const [pseudoRequiredError, setPseudoRequiredError] = useState("");

  // Consultation request flow state
  const [consultCodeInput, setConsultCodeInput] = useState("");
  const [consultStatus, setConsultStatus] = useState("idle"); // "idle" | "pending" | "approved" | "rejected" | "timeout"
  const [consultStatusMessage, setConsultStatusMessage] = useState("");

  // Team session state
  const [newSessionName, setNewSessionName] = useState("");
  const [joinSessionCodeInput, setJoinSessionCodeInput] = useState("");
  const [joinError, setJoinError] = useState("");
  const [activeSession, setActiveSessionState] = useState(() => getActiveSession());

  useEffect(() => {
    setMyCode(getMyUserCode());
    setActiveSessionState(getActiveSession());
  }, [workspace?.mode, workspace?.targetCode, isOpen]);

  const handleRegenerateCode = () => {
    if (window.confirm("Voulez-vous générer un nouveau code détecteur ? Votre profil repartira avec une carte 100% vierge.")) {
      const fresh = resetAndGenerateNewUserCode();
      setMyCode(fresh);
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  const isLockedName = isDisplayNameLocked();

  const handleSaveName = (e) => {
    e.preventDefault();
    if (isDisplayNameLocked()) return;
    if (!displayName || !displayName.trim()) {
      setPseudoRequiredError("Veuillez saisir un pseudo valide.");
      return;
    }
    setMyDisplayName(displayName, true);
    setPseudoRequiredError("");
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleCopyCode = (codeToCopy, type = "personal") => {
    if (!codeToCopy) return;
    navigator.clipboard.writeText(codeToCopy);
    if (type === "session") {
      setCopiedSessionCode(true);
      setTimeout(() => setCopiedSessionCode(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Live Consultation Request Handler
  const handleStartConsultation = async (e) => {
    e.preventDefault();
    const clean = normalizeSessionCode(consultCodeInput);
    if (!clean) return;

    if (clean === normalizeSessionCode(myCode)) {
      setConsultStatus("rejected");
      setConsultStatusMessage("Vous ne pouvez pas demander l'accès à votre propre code.");
      return;
    }

    if (!requestMapConsultation) {
      // Fallback if hook not passed
      setWorkspace({
        mode: "consultation",
        targetCode: clean,
        sessionName: `Carte de ${clean}`
      });
      onClose();
      return;
    }

    setConsultStatus("pending");
    setConsultStatusMessage(`Demande d'autorisation envoyée à ${clean}...`);

    try {
      const result = await requestMapConsultation(clean);
      if (result.approved) {
        setConsultStatus("approved");
        setConsultStatusMessage(`Accès autorisé par ${result.approverName || clean} !`);
        setTimeout(() => {
          setWorkspace({
            mode: "consultation",
            targetCode: clean,
            sessionName: `Carte de ${result.approverName || clean}`
          });
          setConsultStatus("idle");
          setConsultStatusMessage("");
          onClose();
        }, 1200);
      } else if (result.timeout) {
        setConsultStatus("timeout");
        setConsultStatusMessage(result.reason || "Délai d'attente dépassé.");
      } else {
        setConsultStatus("rejected");
        setConsultStatusMessage(result.reason || "Demande refusée par le propriétaire de la carte.");
      }
    } catch (err) {
      setConsultStatus("rejected");
      setConsultStatusMessage("Impossible d'envoyer la demande. Vérifiez votre connexion.");
    }
  };

  const handleCancelConsultationRequest = () => {
    setConsultStatus("idle");
    setConsultStatusMessage("");
  };

  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!displayName || !displayName.trim()) {
      setPseudoRequiredError("Un pseudo est obligatoire pour lancer une session d'équipe en ligne. Veuillez renseigner votre pseudo ci-dessous.");
      setTab("my-code");
      return;
    }
    setPseudoRequiredError("");
    setMyDisplayName(displayName, true);
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
    const clean = normalizeSessionCode(joinSessionCodeInput);
    if (!clean) return;

    if (isLocallyBannedFromSession(clean)) {
      setJoinError("❌ Vous avez été banni de cette session par l'administrateur.");
      return;
    }

    if (!displayName || !displayName.trim()) {
      setPseudoRequiredError("Un pseudo est obligatoire pour rejoindre une session d'équipe en ligne. Veuillez renseigner votre pseudo ci-dessous.");
      setTab("my-code");
      return;
    }

    setPseudoRequiredError("");
    setJoinError("");
    setMyDisplayName(displayName, true);

    try {
      const session = joinTeamSession(clean);
      setActiveSessionState(session);
      setWorkspace({
        mode: "session",
        targetCode: session.code,
        sessionName: session.name
      });
      onClose();
    } catch (err) {
      setJoinError(err.message || "Erreur lors de la connexion à la session.");
    }
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
  const userIsHost = isHost || (activeSession && isSessionHost(activeSession));

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
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: isLight ? "#ffffff" : "#0f172a",
          borderRadius: "20px",
          border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
          padding: "22px 20px",
          color: isLight ? "#000000" : "#ffffff",
          boxSizing: "border-box"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", letterSpacing: "-0.3px", color: isLight ? "#000000" : "#ffffff" }}>
              Sessions & Partages
            </h2>
          </div>
          <button
            type="button"
            aria-label="Fermer"
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
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 6px #10b981"
                }}
              />
            )}
          </button>
        </div>

        {/* =========================================================================
            TAB 1: MON CODE & PARTAGES ACTIFS
           ========================================================================= */}
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
              <div style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "700", color: isLight ? "#1e293b" : "#ffffff", letterSpacing: "0.5px" }}>
                Votre Code Détecteur Unique (6 Caractères)
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "900",
                  letterSpacing: "2px",
                  color: isLight ? "#000000" : "#ffffff",
                  margin: "8px 0 12px 0",
                  fontFamily: "ui-monospace, monospace"
                }}
              >
                {myCode}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => handleCopyCode(myCode, "personal")}
                  style={{
                    flex: 1,
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
                  <span>{copiedCode ? "✓ Code copié !" : "Copier mon code"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  title="Générer un nouveau code (démarre une carte 100% vierge)"
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.15)",
                    background: isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.08)",
                    color: isLight ? "#475569" : "#cbd5e1",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  🔄 Nouveau
                </button>
              </div>
            </div>

            {/* Error / Alert banner if pseudo required */}
            {pseudoRequiredError && (
              <div
                style={{
                  padding: "11px 14px",
                  borderRadius: "12px",
                  background: isLight ? "#fef2f2" : "rgba(239, 68, 68, 0.15)",
                  border: isLight ? "1px solid #fecaca" : "1px solid rgba(239, 68, 68, 0.35)",
                  color: isLight ? "#b91c1c" : "#fca5a5",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
                <span>{pseudoRequiredError}</span>
              </div>
            )}

            {/* Pseudonym field */}
            {isLockedName ? (
              <div
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "11px", fontWeight: "700", color: isLight ? "#000000" : "#ffffff" }}>
                    👤 Pseudonyme du compte :
                  </label>
                  <span style={{ fontSize: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "2px 7px", borderRadius: "6px", fontWeight: "800" }}>
                    🔒 Verrouillé
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="text"
                    value={displayName}
                    readOnly
                    disabled
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)",
                      background: isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.06)",
                      color: isLight ? "#000000" : "#ffffff",
                      fontSize: "13px",
                      fontWeight: "700",
                      outline: "none",
                      cursor: "not-allowed"
                    }}
                  />
                </div>
                <div style={{ fontSize: "11px", color: isLight ? "#475569" : "#94a3b8", lineHeight: "1.4" }}>
                  Ce pseudonyme est attribué à toutes vos trouvailles sur ce compte. Pour en changer, créez un nouveau compte avec le bouton <strong>« 🔄 Nouveau »</strong> ci-dessus.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveName} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "11px", fontWeight: "700", color: isLight ? "#000000" : "#ffffff" }}>
                    👤 Définir votre pseudonyme (Saisie unique) :
                  </label>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      if (pseudoRequiredError) setPseudoRequiredError("");
                    }}
                    placeholder="Votre pseudonyme (ex: Alex Détection)"
                    autoFocus={!!pseudoRequiredError}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: pseudoRequiredError
                        ? "1.5px solid #ef4444"
                        : (isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)"),
                      background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
                      color: isLight ? "#000000" : "#ffffff",
                      fontSize: "13px",
                      outline: "none"
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.16)",
                      background: nameSaved ? "#10b981" : (isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.12)"),
                      color: nameSaved ? "#ffffff" : (isLight ? "#0f172a" : "#ffffff"),
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {nameSaved ? "✓" : "Enregistrer"}
                  </button>
                </div>
                <div style={{ fontSize: "11px", color: isLight ? "#b45309" : "#fcd34d", lineHeight: "1.4" }}>
                  ⚠️ Ce pseudonyme sera définitivement associé à votre compte et attribué à toutes vos trouvailles.
                </div>
              </form>
            )}

            {/* Active Read-Only Permissions List */}
            <div
              style={{
                background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.03)",
                border: isLight ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: isLight ? "#000000" : "#ffffff" }}>
                  🛡️ Amis autorisés à consulter votre carte ({activeViewers.length})
                </div>
              </div>

              {activeViewers.length === 0 ? (
                <div style={{ fontSize: "11px", color: isLight ? "#64748b" : "#94a3b8", lineHeight: "1.4" }}>
                  Aucun ami n'a accès à votre carte actuellement. Personne ne peut voir vos trouvailles sans votre autorisation explicite.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {activeViewers.map((viewer) => (
                    <div
                      key={viewer.userCode}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.05)",
                        border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "8px"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: isLight ? "#0f172a" : "#f8fafc" }}>
                          {viewer.userName || "Ami"}
                        </div>
                        <div style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: isLight ? "#64748b" : "#94a3b8" }}>
                          {viewer.userCode}
                        </div>
                      </div>
                      {revokeViewerAccess && (
                        <button
                          type="button"
                          onClick={() => revokeViewerAccess(viewer.userCode, viewer.userName)}
                          style={{
                            background: "rgba(239, 68, 68, 0.12)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#ef4444",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            fontSize: "11px",
                            fontWeight: "700",
                            cursor: "pointer"
                          }}
                        >
                          Révoquer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ fontSize: "11px", color: isLight ? "#1e293b" : "#ffffff", opacity: 0.85, lineHeight: "1.4" }}>
              🔒 <strong>Sécurité Renforcée</strong> : Un code aléatoire à 6 caractères combiné à une demande d'autorisation en temps réel protège totalement vos coins de détection contre les tentatives d'accès non sollicitées.
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: CONSULTER UNE CARTE AVEC DEMANDE EN DIRECT
           ========================================================================= */}
        {tab === "consult" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

            {/* Pending Request Loading Box */}
            {consultStatus === "pending" && (
              <div
                style={{
                  background: "rgba(59, 130, 246, 0.12)",
                  border: "1.5px solid #3b82f6",
                  borderRadius: "14px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "12px"
                }}
              >
                <div style={{ fontSize: "28px", animation: "pulse 1.5s infinite" }}>
                  📡
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: "#60a5fa" }}>
                    Demande envoyée ! En attente d'autorisation...
                  </div>
                  <div style={{ fontSize: "11px", color: isLight ? "#475569" : "#cbd5e1", marginTop: "4px" }}>
                    Demandez à votre ami d'appuyer sur <strong>« Autoriser »</strong> sur son application GeoProspect.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCancelConsultationRequest}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: isLight ? "#0f172a" : "#ffffff",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  ✕ Annuler la demande
                </button>
              </div>
            )}

            {/* Approved status */}
            {consultStatus === "approved" && (
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1.5px solid #10b981",
                  borderRadius: "14px",
                  padding: "16px",
                  textAlign: "center",
                  color: "#10b981",
                  fontWeight: "800",
                  fontSize: "13px"
                }}
              >
                ✓ {consultStatusMessage || "Accès autorisé ! Chargement de la carte..."}
              </div>
            )}

            {/* Rejected or Timeout error status */}
            {(consultStatus === "rejected" || consultStatus === "timeout") && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1.5px solid #ef4444",
                  borderRadius: "14px",
                  padding: "14px",
                  color: "#f87171",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  fontWeight: "600",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                <div>
                  <strong>{consultStatus === "timeout" ? "⏱️ Délai Dépassé" : "❌ Accès Refusé"} :</strong>{" "}
                  {consultStatusMessage}
                </div>
                <button
                  type="button"
                  onClick={() => setConsultStatus("idle")}
                  style={{
                    alignSelf: "flex-start",
                    background: "rgba(239, 68, 68, 0.2)",
                    border: "none",
                    color: "#fca5a5",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  Réessayer
                </button>
              </div>
            )}

            {/* Request Form */}
            {consultStatus === "idle" && (
              <form onSubmit={handleStartConsultation} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: isLight ? "#000000" : "#ffffff", display: "block", marginBottom: "6px" }}>
                    Saisir le Code Détecteur de votre ami (ex: GEO-XXXXXX) :
                  </label>
                  <input
                    type="text"
                    value={consultCodeInput}
                    onChange={(e) => setConsultCodeInput(e.target.value)}
                    placeholder="GEO-XXXXXX"
                    required
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)",
                      background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
                      color: isLight ? "#000000" : "#ffffff",
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
                  Demander l'accès à la carte ➔
                </button>
              </form>
            )}

            <div style={{ fontSize: "11px", color: isLight ? "#64748b" : "#94a3b8", lineHeight: "1.4" }}>
              💡 <strong>Consultation Sécurisée</strong> : Entrer le code d'un ami envoie instantanément une demande d'autorisation sur son téléphone. La carte n'est déverrouillée que lorsqu'il accepte votre demande.
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: SESSION D'EQUIPE EN DIRECT & MODERATION HOTE
           ========================================================================= */}
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
                  gap: "14px"
                }}
              >
                {/* Session Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#10b981", textTransform: "uppercase" }}>
                        🟢 Session Live
                      </span>
                      {userIsHost && (
                        <span style={{ fontSize: "10px", fontWeight: "800", background: "#f59e0b", color: "#000000", padding: "1px 6px", borderRadius: "4px" }}>
                          👑 HÔTE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: "800", color: isLight ? "#0f172a" : "#f8fafc", marginTop: "2px" }}>
                      {workspace.sessionName || "Sortie d'Équipe"}
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

                {/* Session Code Copy */}
                <button
                  type="button"
                  onClick={() => handleCopyCode(workspace.targetCode, "session")}
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
                  {copiedSessionCode ? "✓ Code copié !" : "Copier le code pour inviter un ami"}
                </button>

                {/* HOST CONTROLS: LOCK SESSION */}
                {userIsHost && toggleSessionLock && (
                  <div
                    style={{
                      background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.04)",
                      border: isLight ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: isLight ? "#0f172a" : "#ffffff" }}>
                        {isLocked ? "🔒 Session Verrouillée" : "🔓 Session Ouverte"}
                      </div>
                      <div style={{ fontSize: "10px", color: isLight ? "#64748b" : "#94a3b8" }}>
                        {isLocked ? "Aucun nouveau membre ne peut rejoindre" : "Tout utilisateur avec le code peut rejoindre"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSessionLock(!isLocked)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "none",
                        background: isLocked ? "#f59e0b" : "rgba(255, 255, 255, 0.12)",
                        color: isLocked ? "#000000" : (isLight ? "#0f172a" : "#ffffff"),
                        fontSize: "11px",
                        fontWeight: "800",
                        cursor: "pointer"
                      }}
                    >
                      {isLocked ? "Déverrouiller" : "Verrouiller"}
                    </button>
                  </div>
                )}

                {/* TEAMMATES ROSTER & HOST MODERATION */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: isLight ? "#475569" : "#cbd5e1" }}>
                    👥 Participants Connectés ({teammates.length + 1})
                  </div>

                  {/* Current User */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.06)",
                      border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "800", color: isLight ? "#0f172a" : "#ffffff" }}>
                        {displayName || "Moi"} (Vous)
                      </div>
                      <div style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: isLight ? "#64748b" : "#94a3b8" }}>
                        {myCode} • {userIsHost ? "👑 Administrateur" : "Membre"}
                      </div>
                    </div>
                    <span style={{ fontSize: "10px", color: "#10b981", fontWeight: "700" }}>🟢 En ligne</span>
                  </div>

                  {/* Teammates */}
                  {teammates.map((member) => (
                    <div
                      key={member.userCode}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
                        border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "8px"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: isLight ? "#0f172a" : "#ffffff" }}>
                          {member.userName || `Détecteuriste ${member.userCode?.slice(-4)}`}
                        </div>
                        <div style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: isLight ? "#64748b" : "#94a3b8" }}>
                          {member.userCode}
                        </div>
                      </div>

                      {/* Host Actions: Kick & Ban */}
                      {userIsHost ? (
                        <div style={{ display: "flex", gap: "6px" }}>
                          {kickTeammate && (
                            <button
                              type="button"
                              onClick={() => kickTeammate(member.userCode, member.userName)}
                              title="Éjecter de la session"
                              style={{
                                background: "rgba(245, 158, 11, 0.15)",
                                border: "1px solid rgba(245, 158, 11, 0.4)",
                                color: "#f59e0b",
                                borderRadius: "6px",
                                padding: "4px 8px",
                                fontSize: "10px",
                                fontWeight: "800",
                                cursor: "pointer"
                              }}
                            >
                              Éjecter
                            </button>
                          )}
                          {banTeammate && (
                            <button
                              type="button"
                              onClick={() => banTeammate(member.userCode, member.userName)}
                              title="Bannir définitivement de la session"
                              style={{
                                background: "rgba(239, 68, 68, 0.15)",
                                border: "1px solid rgba(239, 68, 68, 0.4)",
                                color: "#ef4444",
                                borderRadius: "6px",
                                padding: "4px 8px",
                                fontSize: "10px",
                                fontWeight: "800",
                                cursor: "pointer"
                              }}
                            >
                              Bannir
                            </button>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: "10px", color: "#10b981", fontWeight: "700" }}>🟢 En direct</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* HOST BLACKLIST MANAGEMENT */}
                {userIsHost && bannedList.length > 0 && (
                  <div
                    style={{
                      background: "rgba(239, 68, 68, 0.08)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px"
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "#ef4444", textTransform: "uppercase" }}>
                      🚫 Liste Noire ({bannedList.length})
                    </div>
                    {bannedList.map((banned) => {
                      const code = typeof banned === "string" ? banned : banned.userCode;
                      const name = typeof banned === "string" ? banned : (banned.userName || banned.userCode);
                      return (
                        <div
                          key={code}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "11px"
                          }}
                        >
                          <span style={{ color: isLight ? "#0f172a" : "#fca5a5" }}>
                            {name} ({code})
                          </span>
                          {unbanTeammate && (
                            <button
                              type="button"
                              onClick={() => unbanTeammate(code)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#60a5fa",
                                fontSize: "10px",
                                fontWeight: "700",
                                cursor: "pointer",
                                textDecoration: "underline"
                              }}
                            >
                              Débannir
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

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
                    cursor: "pointer",
                    marginTop: "4px"
                  }}
                >
                  Quitter la session d'équipe
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* 0. Nickname / Pseudo Header */}
                <div
                  style={{
                    background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.03)",
                    border: isLight ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    padding: "12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: "11px", fontWeight: "700", color: isLight ? "#475569" : "#cbd5e1" }}>
                      👤 Votre pseudo pour la session :
                    </label>
                    {isLockedName && (
                      <span style={{ fontSize: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "1px 6px", borderRadius: "5px", fontWeight: "800" }}>
                        🔒 Verrouillé
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      value={displayName}
                      readOnly={isLockedName}
                      disabled={isLockedName}
                      onChange={(e) => {
                        if (!isLockedName) {
                          setDisplayName(e.target.value);
                        }
                      }}
                      placeholder="Ex: Marc Détection"
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)",
                        background: isLockedName ? (isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.08)") : (isLight ? "#ffffff" : "rgba(255, 255, 255, 0.05)"),
                        color: isLight ? "#000000" : "#ffffff",
                        fontSize: "12px",
                        fontWeight: "600",
                        outline: "none",
                        cursor: isLockedName ? "not-allowed" : "text"
                      }}
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {joinError && (
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "1px solid rgba(239, 68, 68, 0.35)",
                      color: "#fca5a5",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}
                  >
                    {joinError}
                  </div>
                )}

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
                  <div style={{ fontSize: "12px", fontWeight: "700", color: isLight ? "#000000" : "#ffffff" }}>
                    ✨ Créer une nouvelle session d'équipe (Vous serez l'Hôte)
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
                      color: isLight ? "#000000" : "#ffffff",
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
                  <div style={{ fontSize: "12px", fontWeight: "700", color: isLight ? "#000000" : "#ffffff" }}>
                    🔗 Rejoindre une session existante
                  </div>
                  <input
                    type="text"
                    value={joinSessionCodeInput}
                    onChange={(e) => {
                      setJoinSessionCodeInput(e.target.value);
                      if (joinError) setJoinError("");
                    }}
                    placeholder="GEO-XXXXXX"
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.1)",
                      background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
                      color: isLight ? "#000000" : "#ffffff",
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

            <div style={{ fontSize: "11px", color: isLight ? "#1e293b" : "#ffffff", opacity: 0.85, lineHeight: "1.4" }}>
              💡 <strong>Contrôle Administrateur</strong> : Le créateur de la session peut à tout moment éjecter ou bannir définitivement un membre indésirable et verrouiller la session.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
