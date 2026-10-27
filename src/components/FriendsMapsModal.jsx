import React, { useState, useEffect } from "react";
import {
  getSavedFriends,
  addSavedFriend,
  removeSavedFriend
} from "../services/friendsService";
import { normalizeSessionCode, getMyUserCode } from "../services/sessionService";

export default function FriendsMapsModal({
  isOpen,
  onClose,
  workspace,
  setWorkspace,
  requestMapConsultation,
  setToast,
  theme = "dark"
}) {
  const [friends, setFriends] = useState(() => getSavedFriends());
  const [showAddForm, setShowAddForm] = useState(false);
  const [friendNameInput, setFriendNameInput] = useState("");
  const [friendCodeInput, setFriendCodeInput] = useState("");
  const [formError, setFormError] = useState("");

  // Consultation state
  const [consultingFriendId, setConsultingFriendId] = useState(null);
  const [consultStatus, setConsultStatus] = useState("idle"); // 'idle' | 'pending' | 'approved' | 'rejected' | 'timeout'
  const [consultMessage, setConsultMessage] = useState("");

  const myCode = normalizeSessionCode(getMyUserCode());

  const isLight = theme === "light";
  const bgModal = isLight ? "#f3f4f2" : "#111915";
  const sheetBg = isLight ? "#ffffff" : "#19231e";
  const cardBorder = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.08)";
  const inputBg = isLight ? "#f8faf9" : "#111915";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";

  useEffect(() => {
    if (isOpen) {
      setFriends(getSavedFriends());
      setFormError("");
      setConsultStatus("idle");
      setConsultMessage("");
      setConsultingFriendId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentConsultedCode =
    workspace?.mode === "consultation"
      ? normalizeSessionCode(workspace?.targetCode)
      : null;

  const handleAddFriend = (e) => {
    e.preventDefault();
    setFormError("");

    const cleanCode = normalizeSessionCode(friendCodeInput);
    if (!cleanCode) {
      setFormError("Code détecteur invalide.");
      return;
    }

    if (cleanCode === myCode) {
      setFormError("Vous ne pouvez pas vous ajouter vous-même comme ami.");
      return;
    }

    try {
      const updated = addSavedFriend(friendNameInput, cleanCode);
      setFriends(updated);
      setFriendNameInput("");
      setFriendCodeInput("");
      setShowAddForm(false);
      if (setToast) {
        setToast({
          message: "Ami ajouté à votre carnet.",
          type: "success"
        });
      }
    } catch (err) {
      setFormError(err.message || "Erreur lors de l'ajout de l'ami.");
    }
  };

  const handleDeleteFriend = (id, name) => {
    const updated = removeSavedFriend(id);
    setFriends(updated);
    if (setToast) {
      setToast({
        message: `${name} retiré de votre carnet.`,
        type: "info"
      });
    }
  };

  const handleConsultFriend = async (friend) => {
    const clean = normalizeSessionCode(friend.code);
    if (!clean) return;

    if (clean === myCode) {
      setConsultStatus("rejected");
      setConsultMessage("Vous ne pouvez pas consulter votre propre code.");
      return;
    }

    // If already consulting this friend, just close
    if (currentConsultedCode === clean) {
      onClose();
      return;
    }

    setConsultingFriendId(friend.id);
    setConsultStatus("pending");
    setConsultMessage(`Demande envoyée à ${friend.name}, en attente d'acceptation sur son téléphone...`);

    if (!requestMapConsultation) {
      // Fallback
      if (setWorkspace) {
        setWorkspace({
          mode: "consultation",
          targetCode: clean,
          sessionName: friend.name
        });
      }
      onClose();
      return;
    }

    try {
      const result = await requestMapConsultation(clean);
      if (result.approved) {
        setConsultStatus("approved");
        setConsultMessage(`Accès autorisé par ${friend.name}.`);
        if (setWorkspace) {
          setWorkspace({
            mode: "consultation",
            targetCode: clean,
            sessionName: friend.name
          });
        }
        if (setToast) {
          setToast({
            message: `Carte de ${friend.name} chargée.`,
            type: "success"
          });
        }
        setTimeout(() => {
          onClose();
        }, 600);
      } else if (result.timeout) {
        setConsultStatus("timeout");
        setConsultMessage(
          result.reason ||
            `Délai dépassé. Vérifiez que ${friend.name} a l'application GeoProspect ouverte.`
        );
      } else {
        setConsultStatus("rejected");
        setConsultMessage(
          result.reason || `Demande refusée par ${friend.name}.`
        );
      }
    } catch (err) {
      setConsultStatus("rejected");
      setConsultMessage("Impossible de joindre le serveur. Vérifiez votre connexion.");
    }
  };

  const handleReturnToMyMap = () => {
    if (setWorkspace) {
      setWorkspace({ mode: "personal", targetCode: null, sessionName: null });
    }
    if (setToast) {
      setToast({
        message: "Retour à votre carte personnelle.",
        type: "info"
      });
    }
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(8, 14, 11, 0.8)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          maxHeight: "85vh",
          background: bgModal,
          borderRadius: "20px",
          border: `1px solid ${cardBorder}`,
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: "#2c5e4c",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "400", color: "#ffffff" }}>
              Carte de vos amis
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "rgba(255,255,255,0.75)" }}>
              Accédez aux cartes de vos coéquipiers de confiance
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.14)",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              color: "#ffffff",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "18px 20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          {/* Active consultation status card */}
          {workspace?.mode === "consultation" && (
            <div
              style={{
                background: sheetBg,
                border: "1px solid #2c5e4c",
                borderRadius: "14px",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px"
              }}
            >
              <div>
                <div style={{ fontSize: "12px", color: textMain, fontWeight: "400" }}>
                  Carte actuellement affichée : {workspace.sessionName || workspace.targetCode}
                </div>
                <div style={{ fontSize: "10.5px", color: textSub }}>
                  Mode lecture seule actif
                </div>
              </div>

              <button
                type="button"
                onClick={handleReturnToMyMap}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(220, 38, 38, 0.15)",
                  color: "#f87171",
                  fontSize: "11px",
                  fontWeight: "400",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                Ma carte
              </button>
            </div>
          )}

          {/* Pending consultation waiting alert */}
          {consultStatus === "pending" && (
            <div
              style={{
                background: sheetBg,
                border: "1px solid #2c5e4c",
                borderRadius: "14px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "10px"
              }}
            >
              <div style={{ fontSize: "13px", color: textMain, fontWeight: "400" }}>
                Demande en cours d'autorisation...
              </div>
              <div style={{ fontSize: "11px", color: textSub }}>
                {consultMessage}
              </div>
              <button
                type="button"
                onClick={() => {
                  setConsultStatus("idle");
                  setConsultingFriendId(null);
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${cardBorder}`,
                  background: inputBg,
                  color: textMain,
                  fontSize: "11px",
                  fontWeight: "400",
                  cursor: "pointer"
                }}
              >
                Annuler
              </button>
            </div>
          )}

          {/* Rejected / Timeout alert */}
          {(consultStatus === "rejected" || consultStatus === "timeout") && (
            <div
              style={{
                background: isLight ? "#fef2f2" : "rgba(220, 38, 38, 0.12)",
                border: isLight ? "1px solid #fecaca" : "1px solid rgba(220, 38, 38, 0.3)",
                borderRadius: "12px",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "12px",
                color: isLight ? "#b91c1c" : "#f87171",
                fontWeight: "400"
              }}
            >
              <div>{consultMessage}</div>
              <button
                type="button"
                onClick={() => {
                  setConsultStatus("idle");
                  setConsultingFriendId(null);
                }}
                style={{
                  alignSelf: "flex-start",
                  background: "transparent",
                  border: "none",
                  color: isLight ? "#b91c1c" : "#f87171",
                  fontSize: "11px",
                  textDecoration: "underline",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                Fermer
              </button>
            </div>
          )}

          {/* Friends list */}
          {friends.length === 0 ? (
            <div
              style={{
                background: sheetBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "16px",
                padding: "24px 16px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: isLight ? "#eef2ee" : "rgba(44, 94, 76, 0.2)",
                  color: isLight ? "#2c5e4c" : "#80b99c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>

              <div style={{ fontSize: "13px", color: textMain, fontWeight: "400" }}>
                Aucun ami enregistré
              </div>
              <div style={{ fontSize: "11px", color: textSub, maxWidth: "280px", lineHeight: "1.4" }}>
                Enregistrez les codes détecteurs de vos coéquipiers de confiance pour charger leur carte d'un simple clic.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {friends.map((friend) => {
                const isCurrent = currentConsultedCode === normalizeSessionCode(friend.code);
                const isBusy = consultStatus === "pending" && consultingFriendId === friend.id;

                return (
                  <div
                    key={friend.id}
                    style={{
                      background: sheetBg,
                      border: isCurrent ? "1px solid #40916c" : `1px solid ${cardBorder}`,
                      borderRadius: "14px",
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px"
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "13px", color: textMain, fontWeight: "400", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {friend.name}
                        </span>
                        {isCurrent && (
                          <span
                            style={{
                              fontSize: "9.5px",
                              padding: "1px 6px",
                              borderRadius: "4px",
                              background: "#2c5e4c",
                              color: "#ffffff"
                            }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: textSub,
                          fontFamily: "ui-monospace, monospace",
                          letterSpacing: "0.5px",
                          marginTop: "2px"
                        }}
                      >
                        {friend.code}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleConsultFriend(friend)}
                        style={{
                          padding: "7px 12px",
                          borderRadius: "8px",
                          border: "none",
                          background: isCurrent ? "#19231e" : "#2c5e4c",
                          color: isCurrent ? textSub : "#ffffff",
                          fontSize: "11px",
                          fontWeight: "400",
                          cursor: isBusy ? "not-allowed" : "pointer",
                          whiteSpace: "nowrap",
                          transition: "background 0.15s ease"
                        }}
                      >
                        {isBusy ? "Demande..." : (isCurrent ? "Affichée" : "Voir sa carte")}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteFriend(friend.id, friend.name)}
                        title="Retirer cet ami"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "8px",
                          border: `1px solid ${cardBorder}`,
                          background: "transparent",
                          color: textSub,
                          fontSize: "13px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add friend button or form */}
          {!showAddForm ? (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              style={{
                padding: "12px",
                borderRadius: "12px",
                border: `1px dashed ${cardBorder}`,
                background: "transparent",
                color: textMain,
                fontSize: "12px",
                fontWeight: "400",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.15s ease"
              }}
            >
              + Ajouter un ami
            </button>
          ) : (
            <form
              onSubmit={handleAddFriend}
              style={{
                background: sheetBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "14px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div style={{ fontSize: "12px", color: textMain, fontWeight: "400" }}>
                Nouvel ami de confiance
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Prénom ou pseudo"
                  value={friendNameInput}
                  onChange={(e) => setFriendNameInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: `1px solid ${cardBorder}`,
                    background: inputBg,
                    color: textMain,
                    fontSize: "12px",
                    fontWeight: "400",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Code détecteur"
                  value={friendCodeInput}
                  onChange={(e) => setFriendCodeInput(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: `1px solid ${cardBorder}`,
                    background: inputBg,
                    color: textMain,
                    fontSize: "12px",
                    fontWeight: "400",
                    fontFamily: "ui-monospace, monospace",
                    letterSpacing: "0.5px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {formError && (
                <div style={{ fontSize: "11px", color: "#f87171", fontWeight: "400" }}>
                  {formError}
                </div>
              )}

              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "2px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormError("");
                  }}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "8px",
                    border: `1px solid ${cardBorder}`,
                    background: "transparent",
                    color: textSub,
                    fontSize: "11px",
                    fontWeight: "400",
                    cursor: "pointer"
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "7px 14px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#2c5e4c",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "400",
                    cursor: "pointer"
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
