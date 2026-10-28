import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { loadCategoriesData, addCategory, removeCategory, addSubCategory, removeSubCategory } from "../services/categoriesService";
import { defaultCategoryColors } from "../subCategories";
import { getMyUserCode, getMyDisplayName, setMyUserCode } from "../services/sessionService";
import { purgeAllUserDataAndAccount, logoutAndResetSession } from "../services/findsService";
import AuthForm from "./AuthForm";
import ConfirmModal from "./ConfirmModal";
import TacticalPinIcon from "./TacticalPinIcon";

const DONATION_LINKS = {
  kofi: "https://ko-fi.com/geoprospect",
  paypal: "https://paypal.me/geoprospect"
};

export default function SettingsPanel({
  theme,
  setTheme,
  onExportBackup,
  onImportBackup,
  onOpenCategoryManager,
  onRestartOnboarding,
  onOpenCgu,
  workspace = { mode: "personal" },
  setWorkspace,
  onOpenTeamSession,
  markerSize = "medium",
  setMarkerSize,
  onClose = null
}) {
  const [categoriesData, setCategoriesData] = useState(loadCategoriesData());
  const [user, setUser] = useState(null);
  const [showAuthBox, setShowAuthBox] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [confirmCatToDelete, setConfirmCatToDelete] = useState(null);
  const [newCatEmoji, setNewCatEmoji] = useState("monnaie");
  const [selectedCatForSub, setSelectedCatForSub] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [showCatManager, setShowCatManager] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [activeCode, setActiveCode] = useState(() => getMyUserCode());
  const [showRestoreCode, setShowRestoreCode] = useState(false);
  const [restoreCodeInput, setRestoreCodeInput] = useState("");
  const [restoreSuccessMsg, setRestoreSuccessMsg] = useState("");
  const [restoreErrorMsg, setRestoreErrorMsg] = useState("");
  const myCode = activeCode;
  const myName = getMyDisplayName();

  useEffect(() => {
    const handleSync = () => setActiveCode(getMyUserCode());
    window.addEventListener("geoprospect-user-synced", handleSync);
    return () => window.removeEventListener("geoprospect-user-synced", handleSync);
  }, []);

  const handleRestoreExistingCode = (e) => {
    if (e) e.preventDefault();
    setRestoreErrorMsg("");
    setRestoreSuccessMsg("");
    const clean = (restoreCodeInput || "").trim().toUpperCase();
    if (!clean || clean.length < 3) {
      setRestoreErrorMsg("Veuillez saisir un code valide.");
      return;
    }
    const updated = setMyUserCode(clean, "GeoProspect");
    if (updated) {
      setActiveCode(updated);
      setRestoreSuccessMsg(`Code ${updated} activé avec succès. Vos trouvailles sont rechargées.`);
      setShowRestoreCode(false);
      setRestoreCodeInput("");
      setTimeout(() => setRestoreSuccessMsg(""), 5000);
    } else {
      setRestoreErrorMsg("Code invalide.");
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setShowAuthBox(false);
      }
    });

    const refresh = () => setCategoriesData(loadCategoriesData());
    window.addEventListener("categories-updated", refresh);
    return () => {
      subscription?.unsubscribe();
      window.removeEventListener("categories-updated", refresh);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAndResetSession();
      setUser(null);
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
      window.location.reload();
    }
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    addCategory(newCatName, newCatEmoji);
    setNewCatName("");
    setNewCatEmoji("monnaie");
  };

  const handleAddSub = (catName) => {
    if (!newSubName.trim()) return;
    addSubCategory(catName, newSubName);
    setNewSubName("");
    setSelectedCatForSub("");
  };

  const isLight = theme === "light";
  // Forest-inspired palette: Deep Forest Header (#2c5e4c), Soft Sage/Stone background in light mode (#f3f4f2), Matte Forest/Anthracite in dark mode (#111915)
  const bgPage = isLight ? "#f3f4f2" : "#111915";
  const sheetBg = isLight ? "#ffffff" : "#19231e";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";
  const dividerCol = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.07)";
  const accentForest = "#2c5e4c";
  const accentMint = "#40916c";

  const sheetStyle = {
    background: sheetBg,
    borderRadius: "16px",
    padding: "18px 18px 6px 18px",
    marginBottom: "14px",
    boxShadow: isLight ? "0 2px 10px rgba(0, 0, 0, 0.03)" : "0 4px 16px rgba(0, 0, 0, 0.25)"
  };

  const rowStyle = (isLast = false) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: isLast ? "none" : `1px solid ${dividerCol}`,
    fontSize: "14px",
    color: textMain,
    gap: "12px"
  });

  const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    color: textMain,
    paddingBottom: "8px"
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: "0 0 60px 0",
        zIndex: 5500,
        background: bgPage,
        color: textMain,
        overflowY: "auto",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Tactical Forest Header Bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "linear-gradient(180deg, #1e4536 0%, #153227 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.09)",
          color: "#ffffff",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "11px",
              background: "rgba(52, 211, 153, 0.14)",
              border: "1px solid rgba(52, 211, 153, 0.28)",
              color: "#34d399",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
              flexShrink: 0
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "17px", fontWeight: "400", color: "#ffffff", letterSpacing: "0.2px", lineHeight: "1.2" }}>
              Paramètres
            </h1>
            <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.55)", marginTop: "2px" }}>
              Configuration & compte
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease"
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "14px 12px 80px 12px" }}>
        {/* SHEET 1: PROFILE & DETECTOR CODE (Forest Profile Card Style) */}
        <div style={sheetStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              paddingBottom: "16px",
              borderBottom: `1px solid ${dividerCol}`
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#ebe3d3",
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${dividerCol}`
              }}
            >
              <img src="/icon-192.png" alt="GeoProspect" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "inline-block",
                  background: "#1b4332",
                  color: "#ffffff",
                  fontSize: "10.5px",
                  padding: "2px 9px",
                  borderRadius: "999px",
                  marginBottom: "4px"
                }}
              >
                {workspace.mode === "session" ? "Session en direct" : "Carnet personnel"}
              </div>
              <div style={{ fontSize: "16px", color: textMain, lineHeight: "1.25" }}>
                {myName || "Prospecteur"}
              </div>
              <div style={{ fontSize: "13px", color: accentMint, marginTop: "2px" }}>
                {user ? user.email : `Code détecteur : ${myCode}`}
              </div>
            </div>
          </div>

          {/* Row 1: Copy unique code */}
          <div
            style={{ ...rowStyle(false), cursor: "pointer" }}
            onClick={() => {
              navigator.clipboard.writeText(myCode);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2000);
            }}
          >
            <span>Mon code détecteur ({myCode})</span>
            <span style={{ fontSize: "12px", color: copiedCode ? accentMint : textSub }}>
              {copiedCode ? "Copié" : "Copier"}
            </span>
          </div>

          {/* Row 2: Team Session */}
          {onOpenTeamSession && (
            <div
              style={{ ...rowStyle(false), cursor: "pointer" }}
              onClick={onOpenTeamSession}
            >
              <span>Sessions d'équipe et partage en direct</span>
              <span style={{ fontSize: "16px", color: textSub }}>›</span>
            </div>
          )}

          {/* Row 3: Restore detector code */}
          <div
            style={{ ...rowStyle(!showRestoreCode && !showAuthBox), cursor: "pointer" }}
            onClick={() => setShowRestoreCode(!showRestoreCode)}
          >
            <span>Restaurer un code détecteur existant</span>
            <span style={{ fontSize: "12px", color: textSub }}>{showRestoreCode ? "Fermer" : "Modifier"}</span>
          </div>

          {showRestoreCode && (
            <form
              onSubmit={handleRestoreExistingCode}
              style={{
                padding: "12px 0 14px 0",
                borderBottom: `1px solid ${dividerCol}`,
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              {restoreErrorMsg && (
                <div style={{ color: "#dc2626", fontSize: "12px" }}>{restoreErrorMsg}</div>
              )}
              {restoreSuccessMsg && (
                <div style={{ color: accentMint, fontSize: "12px" }}>{restoreSuccessMsg}</div>
              )}
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={restoreCodeInput}
                  onChange={(e) => setRestoreCodeInput(e.target.value)}
                  placeholder="Code détecteur"
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: `1px solid ${dividerCol}`,
                    background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.05)",
                    color: textMain,
                    fontSize: "13px",
                    textTransform: "uppercase",
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: accentForest,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "9px 16px",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  Activer
                </button>
              </div>
            </form>
          )}

          {/* Row 4: Synchronisation state */}
          <div
            style={{ ...rowStyle(!showAuthBox), cursor: "pointer" }}
            onClick={() => {
              if (user) {
                setShowLogoutConfirm(true);
              } else {
                setShowAuthBox(!showAuthBox);
              }
            }}
          >
            <span>Synchronisation</span>
            <span style={{ fontSize: "12.5px", color: textSub, display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
              <span>{user ? "Synchronisé" : "Mode local (Se connecter)"}</span>
            </span>
          </div>

          {!user && showAuthBox && (
            <div style={{ padding: "12px 0 16px 0" }}>
              <AuthForm theme={theme} onAuthSuccess={() => setShowAuthBox(false)} />
            </div>
          )}
        </div>

        {/* SHEET 2: CARTOGRAPHIE & AFFICHAGE (Forest "Plantation et Minuterie" Style) */}
        <div style={sheetStyle}>
          <div style={sectionHeaderStyle}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            <span>Cartographie et Affichage</span>
          </div>

          {/* Apparence Clair / Sombre */}
          <div style={rowStyle(false)}>
            <span>Apparence de l'application</span>
            <div style={{ display: "flex", background: isLight ? "#eef0ed" : "rgba(255,255,255,0.08)", borderRadius: "999px", padding: "3px" }}>
              {[
                { id: "light", label: "Clair" },
                { id: "dark", label: "Sombre" }
              ].map((opt) => {
                const active = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setTheme(opt.id);
                      localStorage.setItem("app_theme", opt.id);
                    }}
                    style={{
                      border: "none",
                      borderRadius: "999px",
                      padding: "4px 12px",
                      fontSize: "12px",
                      background: active ? accentForest : "transparent",
                      color: active ? "#ffffff" : textSub,
                      cursor: "pointer"
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Taille des marqueurs */}
          <div style={rowStyle(false)}>
            <span>Taille des marqueurs sur la carte</span>
            <div style={{ display: "flex", background: isLight ? "#eef0ed" : "rgba(255,255,255,0.08)", borderRadius: "999px", padding: "3px" }}>
              {[
                { id: "small", label: "Petit" },
                { id: "medium", label: "Normal" },
                { id: "large", label: "Grand" }
              ].map((s) => {
                const active = (markerSize || "medium") === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (setMarkerSize) {
                        setMarkerSize(s.id);
                        localStorage.setItem("marker_size", s.id);
                      }
                    }}
                    style={{
                      border: "none",
                      borderRadius: "999px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      background: active ? accentForest : "transparent",
                      color: active ? "#ffffff" : textSub,
                      cursor: "pointer"
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gestionnaire de catégories */}
          {onOpenCategoryManager && (
            <div
              style={{ ...rowStyle(false), cursor: "pointer" }}
              onClick={onOpenCategoryManager}
            >
              <span>Catégories et métaux personnalisés</span>
              <span style={{ fontSize: "12.5px", color: textSub }}>Configurer ›</span>
            </div>
          )}

          {/* Édition rapide des catégories */}
          <div
            style={{ ...rowStyle(!showCatManager), cursor: "pointer" }}
            onClick={() => setShowCatManager(!showCatManager)}
          >
            <span>Liste des sous-catégories</span>
            <span style={{ fontSize: "12.5px", color: textSub }}>{showCatManager ? "Masquer" : "Afficher"}</span>
          </div>

          {showCatManager && (
            <div style={{ padding: "12px 0 16px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Nouvelle catégorie"
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: `1px solid ${dividerCol}`,
                    background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.05)",
                    color: textMain,
                    fontSize: "12px",
                    outline: "none"
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  style={{ padding: "8px 14px", borderRadius: "10px", border: "none", background: accentForest, color: "#ffffff", fontSize: "12px", cursor: "pointer" }}
                >
                  Ajouter
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "240px", overflowY: "auto" }}>
                {Object.keys(categoriesData.categories || {})
                  .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }))
                  .map((cat) => (
                  <div
                    key={cat}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "10px",
                      border: `1px solid ${dividerCol}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <TacticalPinIcon
                          markerId={categoriesData.emojis?.[cat] || "autre"}
                          color={categoriesData.colors?.[cat] || defaultCategoryColors[cat] || "#2c5e4c"}
                          size={24}
                          categoryName={cat}
                        />
                        <span style={{ fontSize: "13.5px", color: textMain }}>{cat}</span>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedCatForSub(selectedCatForSub === cat ? "" : cat)}
                          style={{ padding: "3px 8px", borderRadius: "6px", border: `1px solid ${dividerCol}`, background: "transparent", color: textSub, fontSize: "11px", cursor: "pointer" }}
                        >
                          + Sous-catégorie
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmCatToDelete(cat)}
                          style={{ padding: "3px 8px", borderRadius: "6px", border: "none", background: "rgba(220, 38, 38, 0.1)", color: "#dc2626", fontSize: "11px", cursor: "pointer" }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>

                    {(categoriesData.categories[cat]?.length || 0) > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {[...categoriesData.categories[cat]]
                          .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }))
                          .map((sub) => (
                          <span
                            key={sub}
                            style={{
                              padding: "3px 8px",
                              borderRadius: "6px",
                              background: isLight ? "#f3f4f2" : "rgba(255,255,255,0.06)",
                              border: `1px solid ${dividerCol}`,
                              fontSize: "11px",
                              color: textSub,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            {sub}
                            <span onClick={() => removeSubCategory(cat, sub)} style={{ cursor: "pointer", color: "#dc2626" }}>×</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {selectedCatForSub === cat && (
                      <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                        <input
                          type="text"
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          placeholder={`Sous-catégorie pour ${cat}...`}
                          style={{
                            flex: 1,
                            padding: "7px 10px",
                            borderRadius: "8px",
                            border: `1px solid ${dividerCol}`,
                            background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.05)",
                            color: textMain,
                            fontSize: "12px",
                            outline: "none"
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSub(cat)}
                          style={{ padding: "6px 12px", borderRadius: "8px", border: "none", background: accentForest, color: "#ffffff", fontSize: "12px", cursor: "pointer" }}
                        >
                          OK
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SHEET 3: SAUVEGARDES & DONNÉES */}
        <div style={sheetStyle}>
          <div style={sectionHeaderStyle}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Sauvegardes et Données</span>
          </div>

          <div
            style={{ ...rowStyle(false), cursor: "pointer" }}
            onClick={onExportBackup}
          >
            <span>Exporter une sauvegarde locale (.json)</span>
            <span style={{ fontSize: "12.5px", color: textSub }}>Télécharger ›</span>
          </div>

          <div
            style={{ ...rowStyle(true), cursor: "pointer" }}
            onClick={onImportBackup}
          >
            <span>Importer un fichier de sauvegarde</span>
            <span style={{ fontSize: "12.5px", color: textSub }}>Parcourir ›</span>
          </div>
        </div>

        {/* SHEET 4: À PROPOS, SOUTIEN & LÉGAL */}
        <div style={sheetStyle}>
          <div style={sectionHeaderStyle}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Projet et Cadre légal</span>
          </div>

          <a
            href={DONATION_LINKS.kofi}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...rowStyle(false), textDecoration: "none" }}
          >
            <span>Soutenir le projet sur Ko-fi</span>
            <span style={{ fontSize: "12.5px", color: textSub }}>Ouvrir ↗</span>
          </a>

          <a
            href={DONATION_LINKS.paypal}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...rowStyle(false), textDecoration: "none" }}
          >
            <span>Faire un don via PayPal</span>
            <span style={{ fontSize: "12.5px", color: textSub }}>Ouvrir ↗</span>
          </a>

          {onOpenCgu && (
            <div
              style={{ ...rowStyle(false), cursor: "pointer" }}
              onClick={onOpenCgu}
            >
              <span>Conditions d'utilisation et législation</span>
              <span style={{ fontSize: "16px", color: textSub }}>›</span>
            </div>
          )}

          {onRestartOnboarding && (
            <div
              style={{ ...rowStyle(false), cursor: "pointer" }}
              onClick={onRestartOnboarding}
            >
              <span>Relancer le guide de présentation</span>
              <span style={{ fontSize: "16px", color: textSub }}>›</span>
            </div>
          )}

          <div
            style={{ ...rowStyle(false), cursor: "pointer" }}
            onClick={() => setShowLogoutConfirm(true)}
          >
            <span>{user ? `Se déconnecter (${user.email})` : "Réinitialiser la session locale"}</span>
            <span style={{ fontSize: "16px", color: textSub }}>›</span>
          </div>

          <div
            style={{ ...rowStyle(true), cursor: "pointer", color: "#dc2626" }}
            onClick={() => setShowDeleteConfirm(true)}
          >
            <span>Supprimer mon compte et mes données</span>
            <span style={{ fontSize: "16px", color: "#dc2626" }}>›</span>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMATION DE SUPPRESSION DE COMPTE */}
      {showDeleteConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000000,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            boxSizing: "border-box",
            fontFamily: "system-ui, -apple-system, sans-serif"
          }}
          onClick={() => {
            if (!isDeleting && !deleteSuccess) setShowDeleteConfirm(false);
          }}
        >
          <div
            style={{
              background: sheetBg,
              borderRadius: "20px",
              width: "100%",
              maxWidth: "420px",
              padding: "24px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              color: textMain,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {deleteSuccess ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "17px", color: accentMint }}>
                  Compte et données supprimés
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: textSub }}>
                  Toutes vos données ont été effacées. Réinitialisation...
                </p>
              </div>
            ) : isDeleting ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
                  Suppression en cours...
                </h3>
                <p style={{ margin: 0, fontSize: "12px", color: textSub }}>
                  Purge des trouvailles et médias en cours. Veuillez patienter.
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ margin: 0, fontSize: "16px", color: "#dc2626" }}>
                  Supprimer définitivement votre compte ?
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
                  Cette opération effacera irréversiblement toutes vos trouvailles, photos, vidéos, notes vocales ainsi que votre code détecteur ({myCode}).
                </p>
                <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{
                      flex: 1,
                      padding: "11px",
                      borderRadius: "10px",
                      border: `1px solid ${dividerCol}`,
                      background: "transparent",
                      color: textMain,
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsDeleting(true);
                      try {
                        await purgeAllUserDataAndAccount(myCode);
                        setIsDeleting(false);
                        setDeleteSuccess(true);
                        setTimeout(() => {
                          window.location.reload();
                        }, 1200);
                      } catch (err) {
                        console.error("Account deletion error:", err);
                        setIsDeleting(false);
                        alert("Erreur lors de la suppression du compte.");
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: "11px",
                      borderRadius: "10px",
                      border: "none",
                      background: "#dc2626",
                      color: "#ffffff",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    Tout supprimer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {confirmCatToDelete && (
        <ConfirmModal
          title="Supprimer la catégorie"
          confirmColor="#dc2626"
          message={`Voulez-vous vraiment supprimer la catégorie "${confirmCatToDelete}" ?`}
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={() => {
            removeCategory(confirmCatToDelete);
            setConfirmCatToDelete(null);
          }}
          onCancel={() => setConfirmCatToDelete(null)}
        />
      )}

      {showLogoutConfirm && (
        <ConfirmModal
          title={user ? "Déconnexion" : "Réinitialiser la session"}
          confirmColor={accentForest}
          message={
            user
              ? `Voulez-vous vous déconnecter du compte ${user.email} ? Vos données synchronisées restent conservées sur votre compte.`
              : "Voulez-vous réinitialiser la session actuelle ? Vos données synchronisées restent intactes."
          }
          confirmText="Confirmer"
          cancelText="Annuler"
          onConfirm={() => {
            setShowLogoutConfirm(false);
            handleLogout();
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
}
