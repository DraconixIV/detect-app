import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { loadCategoriesData, addCategory, removeCategory, addSubCategory, removeSubCategory, resetCategories } from "../services/categoriesService";
import { getMyUserCode, getMyDisplayName } from "../services/sessionService";
import AuthForm from "./AuthForm";

export default function SettingsPanel({
  theme,
  setTheme,
  baseMap = "satellite",
  setBaseMap,
  mapStyle,
  setMapStyle,
  onOpenMapLayers,
  onExportBackup,
  onImportBackup,
  onOpenCategoryManager,
  onRestartOnboarding,
  workspace = { mode: "personal" },
  setWorkspace,
  onOpenTeamSession
}) {
  const [categoriesData, setCategoriesData] = useState(loadCategoriesData());
  const [user, setUser] = useState(null);
  const [showAuthBox, setShowAuthBox] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("🪙");
  const [selectedCatForSub, setSelectedCatForSub] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [showCatManager, setShowCatManager] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const myCode = getMyUserCode();
  const myName = getMyDisplayName();

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
    await supabase.auth.signOut();
    setUser(null);
    alert("Déconnexion réussie.");
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    addCategory(newCatName, newCatEmoji);
    setNewCatName("");
    setNewCatEmoji("🪙");
  };

  const handleAddSub = (catName) => {
    if (!newSubName.trim()) return;
    addSubCategory(catName, newSubName);
    setNewSubName("");
    setSelectedCatForSub("");
  };

  const isLight = theme === "light";
  const bgPanel = isLight ? "#f8fafc" : "#0b1329";
  const textMain = isLight ? "#0f172a" : "#f8fafc";
  const textSub = isLight ? "#475569" : "#94a3b8";
  const cardBorder = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.12)";
  const cardBg = isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)";
  const cardShadow = isLight ? "0 2px 8px rgba(0, 0, 0, 0.06)" : "none";
  const inputBg = isLight ? "#ffffff" : "rgba(0, 0, 0, 0.25)";
  const inputBorder = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.16)";

  const cardStyle = {
    background: cardBg,
    borderRadius: "18px",
    border: `1px solid ${cardBorder}`,
    boxShadow: cardShadow,
    padding: "16px",
    marginBottom: "16px"
  };

  const sectionTitleStyle = {
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "12px",
    color: isLight ? "#2563eb" : "#60a5fa",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: "0 0 60px 0",
        zIndex: 5500,
        background: bgPanel,
        color: textMain,
        overflowY: "auto",
        padding: "20px 16px 80px 16px",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ fontSize: "28px" }}>⚙️</div>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: textMain }}>
              Paramètres & Configuration
            </h1>
            <p style={{ margin: 0, fontSize: "12px", color: textSub }}>
              Personnalisez votre carnet de détection
            </p>
          </div>
        </div>

        {/* 0. Code Détecteur & Partage d'Équipe */}
        <div
          style={{
            ...cardStyle,
            background: isLight ? "#eff6ff" : "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(15, 23, 42, 0.6))",
            border: isLight ? "1px solid #bfdbfe" : "1px solid rgba(59, 130, 246, 0.4)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={sectionTitleStyle}>
              <span>👥</span> Code Détecteur & Partage d'Équipe
            </div>
            {workspace.mode !== "personal" && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: workspace.mode === "session" ? "#10b981" : "#3b82f6",
                  color: "#ffffff"
                }}
              >
                {workspace.mode === "session" ? "SESSION LIVE" : "CONSULTATION"}
              </span>
            )}
          </div>

          <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: textSub, lineHeight: "1.4" }}>
            Votre code unique identifie vos trouvailles. Partagez-le pour permettre à vos amis de consulter votre carte, ou rejoignez une session en direct à plusieurs !
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: isLight ? "#ffffff" : "rgba(0, 0, 0, 0.35)",
              border: `1px solid ${inputBorder}`,
              borderRadius: "14px",
              padding: "10px 14px",
              marginBottom: "12px"
            }}
          >
            <div>
              <div style={{ fontSize: "10px", color: textSub, fontWeight: "700", textTransform: "uppercase" }}>
                Mon Code Unique
              </div>
              <div style={{ fontSize: "18px", fontWeight: "900", letterSpacing: "1.5px", color: isLight ? "#1d4ed8" : "#60a5fa" }}>
                {myCode}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(myCode);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              style={{
                background: copiedCode ? "#10b981" : (isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.1)"),
                color: copiedCode ? "#ffffff" : textMain,
                border: "none",
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {copiedCode ? "Copié ✅" : "Copier"}
            </button>
          </div>

          {onOpenTeamSession && (
            <button
              type="button"
              onClick={onOpenTeamSession}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "800",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <span>👥</span>
              <span>Rejoindre une session ou consulter une carte</span>
            </button>
          )}
        </div>

        {/* Apparence & Thème Clair/Sombre */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>
            <span>🌓</span> Mode Nuit / Jour
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button
              onClick={() => {
                setTheme("dark");
                localStorage.setItem("app_theme", "dark");
              }}
              style={{
                padding: "12px",
                borderRadius: "14px",
                border: theme === "dark" ? "2px solid #facc15" : `1px solid ${cardBorder}`,
                background: theme === "dark" ? (isLight ? "rgba(250, 204, 21, 0.15)" : "rgba(250, 204, 21, 0.15)") : (isLight ? "#f8fafc" : "rgba(255,255,255,0.04)"),
                color: textMain,
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <span>🌙</span> Sombre (Nuit)
            </button>

            <button
              onClick={() => {
                setTheme("light");
                localStorage.setItem("app_theme", "light");
              }}
              style={{
                padding: "12px",
                borderRadius: "14px",
                border: theme === "light" ? "2px solid #2563eb" : `1px solid ${cardBorder}`,
                background: theme === "light" ? "rgba(37, 99, 235, 0.12)" : "rgba(255,255,255,0.04)",
                color: textMain,
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <span>☀️</span> Clair (Jour)
            </button>
          </div>
        </div>

        {/* 3. Fond de Carte par Défaut */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={sectionTitleStyle}>
              <span>🗺️</span> Fonds de Carte & Surcouches IGN
            </div>
            {onOpenMapLayers && (
              <button
                onClick={onOpenMapLayers}
                style={{
                  padding: "4px 10px",
                  borderRadius: "8px",
                  border: "none",
                  background: isLight ? "#2563eb" : "#3b82f6",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Gérer les calques ↗
              </button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px" }}>
            {[
              { id: "satellite", name: "Satellite HD (Esri)", icon: "🛰️" },
              { id: "ign_ortho", name: "Ortho IGN France", icon: "🇫🇷" },
              { id: "ign_plan", name: "Plan IGN v2 Topo", icon: "🌲" },
              { id: "osm", name: "OpenStreetMap", icon: "🧭" },
              { id: "opentopo", name: "OpenTopoMap", icon: "⛰️" }
            ].map((bm) => {
              const isSelected = (baseMap === bm.id) || (!baseMap && bm.id === "satellite");
              return (
                <button
                  key={bm.id}
                  onClick={() => {
                    if (setBaseMap) setBaseMap(bm.id);
                    localStorage.setItem("baseMap", bm.id);
                    if (setMapStyle) setMapStyle(bm.id === "satellite" ? "satellite" : "plan");
                  }}
                  style={{
                    padding: "10px 8px",
                    borderRadius: "12px",
                    border: isSelected ? "2px solid #3b82f6" : `1px solid ${cardBorder}`,
                    background: isSelected ? (isLight ? "rgba(59, 130, 246, 0.12)" : "rgba(59, 130, 246, 0.18)") : (isLight ? "#f8fafc" : "rgba(255,255,255,0.04)"),
                    color: textMain,
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    textAlign: "center"
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{bm.icon}</span>
                  <span style={{ fontSize: "11px" }}>{bm.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Gestionnaire des Catégories Personnalisées */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={sectionTitleStyle}>
              <span>🏷️</span> Catégories Personnalisées
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {onOpenCategoryManager && (
                <button
                  onClick={onOpenCategoryManager}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    color: "white",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  ⚙️ Gestionnaire
                </button>
              )}
              <button
                onClick={() => setShowCatManager(!showCatManager)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "10px",
                  border: `1px solid ${cardBorder}`,
                  background: isLight ? "#f1f5f9" : "rgba(255,255,255,0.06)",
                  color: textMain,
                  fontSize: "11px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                {showCatManager ? "Masquer" : "Édition Rapide ▾"}
              </button>
            </div>
          </div>

          {showCatManager && (
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Add category form */}
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={newCatEmoji}
                  onChange={(e) => setNewCatEmoji(e.target.value)}
                  placeholder="Emoji"
                  style={{ width: "50px", textAlign: "center", padding: "8px", borderRadius: "10px", border: `1px solid ${inputBorder}`, background: inputBg, color: textMain, fontSize: "16px" }}
                />
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Nouvelle catégorie (ex: Fossile)"
                  style={{ flex: 1, padding: "8px 12px", borderRadius: "10px", border: `1px solid ${inputBorder}`, background: inputBg, color: textMain, fontSize: "12px", outline: "none" }}
                />
                <button
                  onClick={handleAddCategory}
                  style={{ padding: "8px 14px", borderRadius: "10px", border: "none", background: "#10b981", color: "white", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}
                >
                  ➕ Ajouter
                </button>
              </div>

              {/* Categories list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto", paddingRight: "4px" }}>
                {Object.keys(categoriesData.categories).map((cat) => (
                  <div
                    key={cat}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "12px",
                      background: isLight ? "#f8fafc" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${cardBorder}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: "bold", color: textMain }}>
                        {categoriesData.emojis[cat] || "📦"} {cat}
                      </span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => setSelectedCatForSub(selectedCatForSub === cat ? "" : cat)}
                          style={{ padding: "3px 8px", borderRadius: "8px", border: "none", background: isLight ? "rgba(37, 99, 235, 0.15)" : "rgba(59, 130, 246, 0.2)", color: isLight ? "#1d4ed8" : "#60a5fa", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}
                        >
                          + Sous-catégorie
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer la catégorie "${cat}" ?`)) {
                              removeCategory(cat);
                            }
                          }}
                          style={{ padding: "3px 8px", borderRadius: "8px", border: "none", background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", fontSize: "10px", cursor: "pointer" }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", paddingLeft: "10px" }}>
                      {categoriesData.categories[cat]?.map((sub) => (
                        <span
                          key={sub}
                          style={{
                            padding: "2px 8px",
                            borderRadius: "6px",
                            background: isLight ? "#e2e8f0" : "rgba(255,255,255,0.06)",
                            fontSize: "10px",
                            color: textMain,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          {sub}
                          <span
                            onClick={() => removeSubCategory(cat, sub)}
                            style={{ cursor: "pointer", color: "#ef4444", fontWeight: "bold" }}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                    </div>

                    {/* Add subcategory input */}
                    {selectedCatForSub === cat && (
                      <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                        <input
                          type="text"
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          placeholder={`Sous-catégorie pour ${cat}...`}
                          style={{ flex: 1, padding: "6px 10px", borderRadius: "8px", border: `1px solid ${inputBorder}`, background: inputBg, color: textMain, fontSize: "11px", outline: "none" }}
                        />
                        <button
                          onClick={() => handleAddSub(cat)}
                          style={{ padding: "6px 10px", borderRadius: "8px", border: "none", background: "#3b82f6", color: "white", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}
                        >
                          OK
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (window.confirm("Réinitialiser toutes les catégories par défaut ?")) {
                    resetCategories();
                  }
                }}
                style={{ padding: "8px", borderRadius: "10px", border: "none", background: isLight ? "#f1f5f9" : "rgba(255,255,255,0.05)", color: textSub, fontSize: "10px", cursor: "pointer" }}
              >
                🔄 Réinitialiser les catégories par défaut
              </button>
            </div>
          )}
        </div>

        {/* 5. Compte & Synchronisation */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>
            <span>👤</span> Compte & Synchronisation
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showAuthBox ? "14px" : "12px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "bold", color: textMain }}>
                {user ? user.email : "Mode 100% Local / Invité"}
              </div>
              <div style={{ fontSize: "10px", color: textSub }}>
                {user ? "Synchronisation Cloud activée ✅" : "Données stockées uniquement sur votre appareil"}
              </div>
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                style={{ padding: "6px 12px", borderRadius: "10px", border: "none", background: "#ef4444", color: "white", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}
              >
                Déconnexion
              </button>
            ) : (
              <button
                onClick={() => setShowAuthBox(!showAuthBox)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: "none",
                  background: showAuthBox ? (isLight ? "#e2e8f0" : "rgba(255,255,255,0.12)") : "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: showAuthBox && isLight ? "#0f172a" : "white",
                  fontSize: "11px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                {showAuthBox ? "Fermer ✕" : "🔑 Connexion / Inscription"}
              </button>
            )}
          </div>

          {/* Collapsible Auth Form */}
          {!user && showAuthBox && (
            <div
              style={{
                background: isLight ? "#f1f5f9" : "rgba(0,0,0,0.25)",
                borderRadius: "14px",
                padding: "14px",
                marginBottom: "14px",
                border: `1px solid ${cardBorder}`
              }}
            >
              <AuthForm onAuthSuccess={() => setShowAuthBox(false)} />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", borderTop: `1px solid ${cardBorder}`, paddingTop: "12px" }}>
            <button
              onClick={onExportBackup}
              style={{ padding: "10px", borderRadius: "12px", border: "none", background: "#3b82f6", color: "white", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}
            >
              📥 Exporter Sauvegarde
            </button>
            <button
              onClick={onImportBackup}
              style={{ padding: "10px", borderRadius: "12px", border: `1px solid ${cardBorder}`, background: isLight ? "#f8fafc" : "rgba(255,255,255,0.06)", color: textMain, fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}
            >
              📤 Importer Sauvegarde
            </button>
          </div>
        </div>

        {/* 6. Espace aux Dons ("Soutenir le projet ☕") */}
        <div
          style={{
            ...cardStyle,
            background: isLight
              ? "linear-gradient(135deg, rgba(254, 240, 138, 0.3), rgba(253, 230, 138, 0.15))"
              : "linear-gradient(135deg, rgba(250, 204, 21, 0.12), rgba(234, 179, 8, 0.05))",
            border: isLight ? "1.5px solid #facc15" : "1px solid rgba(250, 204, 21, 0.3)"
          }}
        >
          <div style={{ ...sectionTitleStyle, color: isLight ? "#b45309" : "#facc15" }}>
            <span>☕</span> Soutenir le Projet (Dons)
          </div>
          <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: textMain, opacity: 0.9, lineHeight: "1.5" }}>
            Développé avec passion pour offrir un outil 100 % libre, sans publicité et respectueux de vos données. Si l'application vous plaît, un petit don encourage les futures améliorations !
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <a
              href="https://ko-fi.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "12px",
                background: "#facc15",
                color: "#1e293b",
                fontWeight: "800",
                fontSize: "12px",
                textAlign: "center",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <span>☕</span> Offrir un café (Ko-fi)
            </a>

            <a
              href="https://paypal.me"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "12px",
                background: isLight ? "#ffffff" : "rgba(255,255,255,0.1)",
                color: textMain,
                fontWeight: "700",
                fontSize: "12px",
                textAlign: "center",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                border: `1px solid ${cardBorder}`
              }}
            >
              <span>💳</span> PayPal
            </a>
          </div>
        </div>

        {/* 7. Mentions Légales & CGU */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={sectionTitleStyle}>
              <span>⚖️</span> Mentions Légales & CGU
            </div>
            <button
              onClick={() => setShowLegal(!showLegal)}
              style={{ padding: "4px 8px", borderRadius: "8px", border: `1px solid ${cardBorder}`, background: isLight ? "#f1f5f9" : "rgba(255,255,255,0.06)", color: textMain, fontSize: "10px", cursor: "pointer" }}
            >
              {showLegal ? "Masquer" : "Lire"}
            </button>
          </div>

          {showLegal && (
            <div style={{ marginTop: "10px", fontSize: "11px", color: textSub, lineHeight: "1.5", display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ margin: 0 }}>
                Cette application est un carnet de bord numérique d'enregistrement personnel pour la détection de loisir et la recherche d'objets métalliques.
              </p>
              <p style={{ margin: 0 }}>
                L'utilisateur est seul responsable de sa pratique et s'engage à respecter scrupuleusement l'article L. 542-1 du Code du patrimoine, à obtenir l'autorisation expresse des propriétaires des parcelles prospectées et à déclarer toute découverte fortuite.
              </p>
              {onRestartOnboarding && (
                <button
                  type="button"
                  onClick={onRestartOnboarding}
                  style={{
                    marginTop: "8px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  🔄 Relancer l'Onboarding & Charte Légale
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
