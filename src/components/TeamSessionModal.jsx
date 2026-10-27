import React, { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
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
  revokeViewerAccess,
  onRedirectHome,
  onLeaveSession
}) {
  const [tab, setTab] = useState("session"); // "session" | "my-code" | "consult"
  const [myCode, setMyCode] = useState(() => getMyUserCode());
  const [displayName, setDisplayName] = useState(() => getMyDisplayName());
  const [nameSaved, setNameSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSessionCode, setCopiedSessionCode] = useState(false);
  const [pseudoRequiredError, setPseudoRequiredError] = useState("");
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  const [consultCodeInput, setConsultCodeInput] = useState("");
  const [consultStatus, setConsultStatus] = useState("idle"); // "idle" | "pending" | "approved" | "rejected" | "timeout"
  const [consultStatusMessage, setConsultStatusMessage] = useState("");

  const [newSessionName, setNewSessionName] = useState("");
  const [joinSessionCodeInput, setJoinSessionCodeInput] = useState("");
  const [joinError, setJoinError] = useState("");
  const [activeSession, setActiveSessionState] = useState(() => getActiveSession());

  useEffect(() => {
    setMyCode(getMyUserCode());
    setActiveSessionState(getActiveSession());
  }, [workspace?.mode, workspace?.targetCode, isOpen]);

  const handleRegenerateCode = () => {
    setShowRegenerateConfirm(true);
  };

  const handleConfirmRegenerate = () => {
    setShowRegenerateConfirm(false);
    const fresh = resetAndGenerateNewUserCode();
    setMyCode(fresh);
    window.location.reload();
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
        setConsultStatusMessage(`Accès autorisé par ${result.approverName || clean}.`);
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
    if (onRedirectHome) {
      onRedirectHome();
    }
    onClose();
  };

  const handleJoinSession = (e) => {
    e.preventDefault();
    const clean = normalizeSessionCode(joinSessionCodeInput);
    if (!clean) return;

    if (isLocallyBannedFromSession(clean)) {
      setJoinError("Vous avez été banni de cette session par l'administrateur.");
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
      if (onRedirectHome) {
        onRedirectHome();
      }
      onClose();
    } catch (err) {
      setJoinError(err.message || "Erreur lors de la connexion à la session.");
    }
  };

  const handleLeaveSession = () => {
    if (onLeaveSession) {
      onLeaveSession();
    } else {
      leaveTeamSession();
      setActiveSessionState(null);
      setWorkspace({
        mode: "personal",
        targetCode: null,
        sessionName: null
      });
    }
    onClose();
  };

  const isLight = theme === "light";
  const modalBg = isLight ? "#f3f4f2" : "#111915";
  const sheetBg = isLight ? "#ffffff" : "#19231e";
  const inputBg = isLight ? "#f3f4f2" : "#111915";
  const dividerColor = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.08)";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";

  const userIsHost = isHost || (activeSession && isSessionHost(activeSession));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        background: "rgba(8, 14, 11, 0.8)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
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
          background: modalBg,
          borderRadius: "20px",
          border: `1px solid ${dividerColor}`,
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.55)",
          color: textMain,
          boxSizing: "border-box",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Forest Top Header */}
        <div
          style={{
            background: "#2c5e4c",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "400", color: "#ffffff", letterSpacing: "0.2px" }}>
            Sessions
          </h2>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.14)",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "400"
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "18px 16px 20px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Segmented Pill Selector */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              background: sheetBg,
              padding: "4px",
              borderRadius: "999px",
              border: `1px solid ${dividerColor}`
            }}
          >
            <button
              type="button"
              onClick={() => setTab("my-code")}
              style={{
                padding: "8px 4px",
                borderRadius: "999px",
                border: "none",
                background: tab === "my-code" ? "#2c5e4c" : "transparent",
                color: tab === "my-code" ? "#ffffff" : textSub,
                fontWeight: "400",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Mon code
            </button>

            <button
              type="button"
              onClick={() => setTab("consult")}
              style={{
                padding: "8px 4px",
                borderRadius: "999px",
                border: "none",
                background: tab === "consult" ? "#2c5e4c" : "transparent",
                color: tab === "consult" ? "#ffffff" : textSub,
                fontWeight: "400",
                fontSize: "12px",
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
                borderRadius: "999px",
                border: "none",
                background: tab === "session" ? "#2c5e4c" : "transparent",
                color: tab === "session" ? "#ffffff" : textSub,
                fontWeight: "400",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s",
                position: "relative"
              }}
            >
              <span>Session live</span>
              {workspace.mode === "session" && (
                <span
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "6px",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#80b99c"
                  }}
                />
              )}
            </button>
          </div>

          {/* =========================================================================
              TAB 1: MON CODE & PARTAGES ACTIFS
             ========================================================================= */}
          {tab === "my-code" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Sheet 1: Code Détecteur */}
              <div
                style={{
                  background: sheetBg,
                  border: `1px solid ${dividerColor}`,
                  borderRadius: "16px",
                  padding: "16px",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "400", color: textSub, letterSpacing: "0.5px" }}>
                  Code détecteur personnel
                </div>
                <div
                  style={{
                    fontSize: "23px",
                    fontWeight: "400",
                    letterSpacing: "2px",
                    color: textMain,
                    margin: "8px 0 14px 0",
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
                      background: copiedCode ? "#40916c" : "#2c5e4c",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: "400",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                  >
                    {copiedCode ? "Code copié" : "Copier mon code"}
                  </button>

                  <button
                    type="button"
                    onClick={handleRegenerateCode}
                    title="Générer un nouveau code (démarre une carte 100% vierge)"
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${dividerColor}`,
                      background: inputBg,
                      color: textSub,
                      fontSize: "12px",
                      fontWeight: "400",
                      cursor: "pointer"
                    }}
                  >
                    Nouveau
                  </button>
                </div>
              </div>

              {pseudoRequiredError && (
                <div
                  style={{
                    padding: "11px 14px",
                    borderRadius: "12px",
                    background: isLight ? "#fef2f2" : "rgba(220, 38, 38, 0.14)",
                    border: isLight ? "1px solid #fecaca" : "1px solid rgba(220, 38, 38, 0.3)",
                    color: isLight ? "#b91c1c" : "#f87171",
                    fontSize: "12px",
                    lineHeight: "1.4",
                    fontWeight: "400"
                  }}
                >
                  {pseudoRequiredError}
                </div>
              )}

              {/* Sheet 2: Pseudonyme */}
              <div
                style={{
                  background: sheetBg,
                  border: `1px solid ${dividerColor}`,
                  borderRadius: "16px",
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                {isLockedName ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label style={{ fontSize: "12px", fontWeight: "400", color: textMain }}>
                        Pseudonyme du compte
                      </label>
                      <span style={{ fontSize: "10px", background: isLight ? "#eef2ee" : "rgba(44, 94, 76, 0.3)", color: isLight ? "#2c5e4c" : "#80b99c", padding: "2px 8px", borderRadius: "999px", fontWeight: "400" }}>
                        Verrouillé
                      </span>
                    </div>
                    <input
                      type="text"
                      value={displayName}
                      readOnly
                      disabled
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: `1px solid ${dividerColor}`,
                        background: inputBg,
                        color: textMain,
                        fontSize: "13px",
                        fontWeight: "400",
                        outline: "none",
                        cursor: "not-allowed",
                        boxSizing: "border-box"
                      }}
                    />
                    <div style={{ fontSize: "11px", color: textSub, lineHeight: "1.4" }}>
                      Ce pseudonyme est attribué à toutes vos trouvailles sur ce compte. Pour en changer, générez un nouveau code ci-dessus.
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSaveName} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "400", color: textMain }}>
                      Définir votre pseudonyme (saisie unique)
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => {
                          setDisplayName(e.target.value);
                          if (pseudoRequiredError) setPseudoRequiredError("");
                        }}
                        placeholder="Votre pseudonyme (ex : Alex Détection)"
                        autoFocus={!!pseudoRequiredError}
                        style={{
                          flex: 1,
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: pseudoRequiredError ? "1.5px solid #dc2626" : `1px solid ${dividerColor}`,
                          background: inputBg,
                          color: textMain,
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
                          background: nameSaved ? "#40916c" : "#2c5e4c",
                          color: "#ffffff",
                          fontSize: "12px",
                          fontWeight: "400",
                          cursor: "pointer"
                        }}
                      >
                        {nameSaved ? "Enregistré" : "Enregistrer"}
                      </button>
                    </div>
                    <div style={{ fontSize: "11px", color: textSub, lineHeight: "1.4" }}>
                      Ce pseudonyme sera définitivement associé à votre compte et attribué à toutes vos trouvailles.
                    </div>
                  </form>
                )}
              </div>

              {/* Sheet 3: Amis autorisés */}
              <div
                style={{
                  background: sheetBg,
                  border: `1px solid ${dividerColor}`,
                  borderRadius: "16px",
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: "400", color: textMain }}>
                  Amis autorisés à consulter votre carte ({activeViewers.length})
                </div>

                {activeViewers.length === 0 ? (
                  <div style={{ fontSize: "11px", color: textSub, lineHeight: "1.4" }}>
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
                          background: inputBg,
                          border: `1px solid ${dividerColor}`,
                          borderRadius: "10px"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: "400", color: textMain }}>
                            {viewer.userName || "Ami"}
                          </div>
                          <div style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: textSub }}>
                            {viewer.userCode}
                          </div>
                        </div>
                        {revokeViewerAccess && (
                          <button
                            type="button"
                            onClick={() => revokeViewerAccess(viewer.userCode, viewer.userName)}
                            style={{
                              background: "rgba(220, 38, 38, 0.12)",
                              border: "none",
                              color: "#dc2626",
                              borderRadius: "8px",
                              padding: "5px 10px",
                              fontSize: "11px",
                              fontWeight: "400",
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
            </div>
          )}

          {/* =========================================================================
              TAB 2: CONSULTER UNE CARTE
             ========================================================================= */}
          {tab === "consult" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {workspace.mode === "consultation" && (
                <div
                  style={{
                    background: sheetBg,
                    border: `1px solid #2c5e4c`,
                    borderRadius: "14px",
                    padding: "12px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "400", color: textMain }}>
                      Mode consultation actif
                    </div>
                    <div style={{ fontSize: "11px", color: textSub }}>
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
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#dc2626",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "400",
                      cursor: "pointer"
                    }}
                  >
                    Revenir à ma carte
                  </button>
                </div>
              )}

              {consultStatus === "pending" && (
                <div
                  style={{
                    background: sheetBg,
                    border: `1px solid #2c5e4c`,
                    borderRadius: "16px",
                    padding: "18px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "12px"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "400", color: textMain }}>
                      Demande envoyée, en attente d'autorisation...
                    </div>
                    <div style={{ fontSize: "11px", color: textSub, marginTop: "4px" }}>
                      Demandez à votre ami d'appuyer sur Autoriser sur son application GeoProspect.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCancelConsultationRequest}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "8px",
                      border: `1px solid ${dividerColor}`,
                      background: inputBg,
                      color: textMain,
                      fontSize: "11px",
                      fontWeight: "400",
                      cursor: "pointer"
                    }}
                  >
                    Annuler la demande
                  </button>
                </div>
              )}

              {consultStatus === "approved" && (
                <div
                  style={{
                    background: isLight ? "#eef2ee" : "rgba(44, 94, 76, 0.25)",
                    border: "1px solid #2c5e4c",
                    borderRadius: "14px",
                    padding: "16px",
                    textAlign: "center",
                    color: textMain,
                    fontWeight: "400",
                    fontSize: "13px"
                  }}
                >
                  {consultStatusMessage || "Accès autorisé, chargement de la carte..."}
                </div>
              )}

              {(consultStatus === "rejected" || consultStatus === "timeout") && (
                <div
                  style={{
                    background: isLight ? "#fef2f2" : "rgba(220, 38, 38, 0.14)",
                    border: isLight ? "1px solid #fecaca" : "1px solid rgba(220, 38, 38, 0.3)",
                    borderRadius: "14px",
                    padding: "14px",
                    color: isLight ? "#b91c1c" : "#f87171",
                    fontSize: "12px",
                    lineHeight: "1.4",
                    fontWeight: "400",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}
                >
                  <div>
                    {consultStatus === "timeout" ? "Délai dépassé : " : "Accès refusé : "}
                    {consultStatusMessage}
                  </div>
                  <button
                    type="button"
                    onClick={() => setConsultStatus("idle")}
                    style={{
                      alignSelf: "flex-start",
                      background: "rgba(220, 38, 38, 0.15)",
                      border: "none",
                      color: isLight ? "#b91c1c" : "#f87171",
                      borderRadius: "8px",
                      padding: "5px 10px",
                      fontSize: "11px",
                      fontWeight: "400",
                      cursor: "pointer"
                    }}
                  >
                    Réessayer
                  </button>
                </div>
              )}

              {consultStatus === "idle" && (
                <form
                  onSubmit={handleStartConsultation}
                  style={{
                    background: sheetBg,
                    border: `1px solid ${dividerColor}`,
                    borderRadius: "16px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                >
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "400", color: textMain, display: "block", marginBottom: "8px" }}>
                      Code détecteur de votre ami
                    </label>
                    <input
                      type="text"
                      value={consultCodeInput}
                      onChange={(e) => setConsultCodeInput(e.target.value)}
                      placeholder="Code détecteur"
                      required
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: `1px solid ${dividerColor}`,
                        background: inputBg,
                        color: textMain,
                        fontSize: "14px",
                        fontWeight: "400",
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
                      background: "#2c5e4c",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: "400",
                      cursor: "pointer"
                    }}
                  >
                    Demander l'accès à la carte
                  </button>
                </form>
              )}

              <div style={{ fontSize: "11px", color: textSub, lineHeight: "1.5", padding: "0 4px" }}>
                Entrer le code d'un ami envoie instantanément une demande d'autorisation sur son téléphone. La carte n'est déverrouillée que lorsqu'il accepte votre demande.
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: SESSION D'EQUIPE EN DIRECT
             ========================================================================= */}
          {tab === "session" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {workspace.mode === "session" ? (
                <div
                  style={{
                    background: sheetBg,
                    border: `1px solid ${dividerColor}`,
                    borderRadius: "16px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "400", color: isLight ? "#2c5e4c" : "#80b99c", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Session en direct
                        </span>
                        {userIsHost && (
                          <span style={{ fontSize: "10px", fontWeight: "400", background: "#e9edc9", color: "#1b4332", padding: "2px 7px", borderRadius: "999px" }}>
                            Hôte
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: "400", color: textMain, marginTop: "3px" }}>
                        {workspace.sessionName || "Sortie d'équipe"}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        fontSize: "13px",
                        fontWeight: "400",
                        background: inputBg,
                        border: `1px solid ${dividerColor}`,
                        color: textMain,
                        padding: "5px 10px",
                        borderRadius: "8px"
                      }}
                    >
                      {workspace.targetCode}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(workspace.targetCode, "session")}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "none",
                      background: copiedSessionCode ? "#40916c" : "#2c5e4c",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: "400",
                      cursor: "pointer"
                    }}
                  >
                    {copiedSessionCode ? "Code copié" : "Copier le code pour inviter un ami"}
                  </button>

                  {userIsHost && toggleSessionLock && (
                    <div
                      style={{
                        background: inputBg,
                        border: `1px solid ${dividerColor}`,
                        borderRadius: "12px",
                        padding: "10px 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "400", color: textMain }}>
                          {isLocked ? "Session verrouillée" : "Session ouverte"}
                        </div>
                        <div style={{ fontSize: "10px", color: textSub }}>
                          {isLocked ? "Aucun nouveau membre ne peut rejoindre" : "Tout utilisateur avec le code peut rejoindre"}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSessionLock(!isLocked)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: `1px solid ${dividerColor}`,
                          background: sheetBg,
                          color: textMain,
                          fontSize: "11px",
                          fontWeight: "400",
                          cursor: "pointer"
                        }}
                      >
                        {isLocked ? "Déverrouiller" : "Verrouiller"}
                      </button>
                    </div>
                  )}

                  {/* Participants */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "400", textTransform: "uppercase", color: textSub, letterSpacing: "0.4px" }}>
                      Participants connectés ({teammates.length + 1})
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "9px 12px",
                        background: inputBg,
                        border: `1px solid ${dividerColor}`,
                        borderRadius: "10px"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "400", color: textMain }}>
                          {displayName || "Moi"} (Vous)
                        </div>
                        <div style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: textSub }}>
                          {myCode} • {userIsHost ? "Administrateur" : "Membre"}
                        </div>
                      </div>
                      <span style={{ fontSize: "10px", color: isLight ? "#2c5e4c" : "#80b99c", fontWeight: "400" }}>En ligne</span>
                    </div>

                    {teammates.map((member) => (
                      <div
                        key={member.userCode}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "9px 12px",
                          background: inputBg,
                          border: `1px solid ${dividerColor}`,
                          borderRadius: "10px"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: "400", color: textMain }}>
                            {member.userName || `Prospecteur ${member.userCode?.slice(-4)}`}
                          </div>
                          <div style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: textSub }}>
                            {member.userCode}
                          </div>
                        </div>

                        {userIsHost ? (
                          <div style={{ display: "flex", gap: "6px" }}>
                            {kickTeammate && (
                              <button
                                type="button"
                                onClick={() => kickTeammate(member.userCode, member.userName)}
                                style={{
                                  background: sheetBg,
                                  border: `1px solid ${dividerColor}`,
                                  color: textMain,
                                  borderRadius: "6px",
                                  padding: "4px 8px",
                                  fontSize: "10px",
                                  fontWeight: "400",
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
                                style={{
                                  background: "rgba(220, 38, 38, 0.12)",
                                  border: "none",
                                  color: "#dc2626",
                                  borderRadius: "6px",
                                  padding: "4px 8px",
                                  fontSize: "10px",
                                  fontWeight: "400",
                                  cursor: "pointer"
                                }}
                              >
                                Bannir
                              </button>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: "10px", color: isLight ? "#2c5e4c" : "#80b99c", fontWeight: "400" }}>En direct</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {userIsHost && bannedList.length > 0 && (
                    <div
                      style={{
                        background: "rgba(220, 38, 38, 0.08)",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px"
                      }}
                    >
                      <div style={{ fontSize: "11px", fontWeight: "400", color: "#dc2626", textTransform: "uppercase" }}>
                        Membres bannis ({bannedList.length})
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
                            <span style={{ color: textMain }}>
                              {name} ({code})
                            </span>
                            {unbanTeammate && (
                              <button
                                type="button"
                                onClick={() => unbanTeammate(code)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: textSub,
                                  fontSize: "10px",
                                  fontWeight: "400",
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
                      background: "rgba(220, 38, 38, 0.14)",
                      color: isLight ? "#b91c1c" : "#f87171",
                      fontSize: "12px",
                      fontWeight: "400",
                      cursor: "pointer",
                      marginTop: "2px"
                    }}
                  >
                    Quitter la session d'équipe
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* 0. Pseudo */}
                  <div
                    style={{
                      background: sheetBg,
                      border: `1px solid ${dividerColor}`,
                      borderRadius: "16px",
                      padding: "14px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label style={{ fontSize: "12px", fontWeight: "400", color: textMain }}>
                        Votre pseudo pour la session
                      </label>
                      {isLockedName && (
                        <span style={{ fontSize: "10px", background: isLight ? "#eef2ee" : "rgba(44, 94, 76, 0.3)", color: isLight ? "#2c5e4c" : "#80b99c", padding: "2px 8px", borderRadius: "999px", fontWeight: "400" }}>
                          Verrouillé
                        </span>
                      )}
                    </div>
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
                      placeholder="Ex : Marc Détection"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: `1px solid ${dividerColor}`,
                        background: inputBg,
                        color: textMain,
                        fontSize: "13px",
                        fontWeight: "400",
                        outline: "none",
                        cursor: isLockedName ? "not-allowed" : "text",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {joinError && (
                    <div
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: isLight ? "#fef2f2" : "rgba(220, 38, 38, 0.14)",
                        border: isLight ? "1px solid #fecaca" : "1px solid rgba(220, 38, 38, 0.3)",
                        color: isLight ? "#b91c1c" : "#f87171",
                        fontSize: "12px",
                        fontWeight: "400"
                      }}
                    >
                      {joinError}
                    </div>
                  )}

                  {/* 1. Create a session */}
                  <form
                    onSubmit={handleCreateSession}
                    style={{
                      background: sheetBg,
                      border: `1px solid ${dividerColor}`,
                      borderRadius: "16px",
                      padding: "14px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px"
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: "400", color: textMain }}>
                      Créer une nouvelle session d'équipe
                    </div>
                    <input
                      type="text"
                      value={newSessionName}
                      onChange={(e) => setNewSessionName(e.target.value)}
                      placeholder="Nom (ex : Sortie Forêt Dimanche)"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: `1px solid ${dividerColor}`,
                        background: inputBg,
                        color: textMain,
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: "11px",
                        borderRadius: "10px",
                        border: "none",
                        background: "#2c5e4c",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: "400",
                        cursor: "pointer"
                      }}
                    >
                      Démarrer la session d'équipe
                    </button>
                  </form>

                  {/* 2. Join a session */}
                  <form
                    onSubmit={handleJoinSession}
                    style={{
                      background: sheetBg,
                      border: `1px solid ${dividerColor}`,
                      borderRadius: "16px",
                      padding: "14px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px"
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: "400", color: textMain }}>
                      Rejoindre une session existante
                    </div>
                    <input
                      type="text"
                      value={joinSessionCodeInput}
                      onChange={(e) => {
                        setJoinSessionCodeInput(e.target.value);
                        if (joinError) setJoinError("");
                      }}
                      placeholder="Code de session"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: `1px solid ${dividerColor}`,
                        background: inputBg,
                        color: textMain,
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
                        padding: "11px",
                        borderRadius: "10px",
                        border: "none",
                        background: "#40916c",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: "400",
                        cursor: "pointer"
                      }}
                    >
                      Rejoindre l'équipe
                    </button>
                  </form>
                </div>
              )}

              <div style={{ fontSize: "11px", color: textSub, lineHeight: "1.5", padding: "0 4px" }}>
                Le créateur de la session peut à tout moment éjecter ou bannir un membre et verrouiller l'accès à la session.
              </div>
            </div>
          )}
        </div>
      </div>

      {showRegenerateConfirm && (
        <ConfirmModal
          title="Nouveau code détecteur"
          confirmColor="#2c5e4c"
          message="Voulez-vous générer un nouveau code détecteur ? Votre profil repartira avec une carte 100% vierge."
          confirmText="Générer un code"
          cancelText="Annuler"
          onConfirm={handleConfirmRegenerate}
          onCancel={() => setShowRegenerateConfirm(false)}
        />
      )}
    </div>
  );
}
