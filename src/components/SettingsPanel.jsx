import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { loadCategoriesData, addCategory, removeCategory, addSubCategory, removeSubCategory, resetCategories } from "../services/categoriesService";
import AuthForm from "./AuthForm";

export default function SettingsPanel({
  theme,
  setTheme,
  mapStyle,
  setMapStyle,
  onExportBackup,
  onImportBackup
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

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.04)",
    borderRadius: "18px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "16px",
    marginBottom: "16px"
  };

  const sectionTitleStyle = {
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "12px",
    color: "#60a5fa",
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
        background: theme === "light" ? "#f8fafc" : "#0b1329",
        color: theme === "light" ? "#1e293b" : "white",
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
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>Paramètres & Configuration</h1>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>Personnalisez votre carnet de détection</p>
          </div>
        </div>

        {/* 1. Apparence & Thème */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>
            <span>🎨</span> Apparence & Thème
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
                border: theme === "dark" ? "2px solid #facc15" : "1px solid rgba(255,255,255,0.1)",
                background: theme === "dark" ? "rgba(250, 204, 21, 0.12)" : "rgba(255,255,255,0.04)",
                color: theme === "light" ? "#1e293b" : "white",
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
                border: theme === "light" ? "2px solid #facc15" : "1px solid rgba(255,255,255,0.1)",
                background: theme === "light" ? "rgba(250, 204, 21, 0.12)" : "rgba(255,255,255,0.04)",
                color: theme === "light" ? "#1e293b" : "white",
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

        {/* 2. Fond de Carte par Défaut */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>
            <span>🗺️</span> Fond de Carte
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button
              onClick={() => {
                setMapStyle("satellite");
                localStorage.setItem("mapStyle", "satellite");
              }}
              style={{
                padding: "12px",
                borderRadius: "14px",
                border: mapStyle === "satellite" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                background: mapStyle === "satellite" ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.04)",
                color: theme === "light" ? "#1e293b" : "white",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <span style={{ fontSize: "20px" }}>🛰️</span>
              <span style={{ fontSize: "12px" }}>Satellite & Rues</span>
            </button>

            <button
              onClick={() => {
                setMapStyle("streets");
                localStorage.setItem("mapStyle", "streets");
              }}
              style={{
                padding: "12px",
                borderRadius: "14px",
                border: mapStyle === "streets" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                background: mapStyle === "streets" ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.04)",
                color: theme === "light" ? "#1e293b" : "white",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <span style={{ fontSize: "20px" }}>🏞️</span>
              <span style={{ fontSize: "12px" }}>Paysage / Relief</span>
            </button>
          </div>
        </div>

        {/* 3. Gestionnaire des Catégories Personnalisées */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={sectionTitleStyle}>
              <span>🏷️</span> Catégories Personnalisées
            </div>
            <button
              onClick={() => setShowCatManager(!showCatManager)}
              style={{
                padding: "6px 12px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.06)",
                color: "inherit",
                fontSize: "11px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {showCatManager ? "Masquer" : "Gérer les Catégories ▾"}
            </button>
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
                  style={{ width: "50px", textAlign: "center", padding: "8px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.2)", color: "white", fontSize: "16px" }}
                />
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Nouvelle catégorie (ex: Fossile)"
                  style={{ flex: 1, padding: "8px 12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.2)", color: "white", fontSize: "12px" }}
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
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                        {categoriesData.emojis[cat] || "📦"} {cat}
                      </span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => setSelectedCatForSub(selectedCatForSub === cat ? "" : cat)}
                          style={{ padding: "3px 8px", borderRadius: "8px", border: "none", background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}
                        >
                          + Sous-catégorie
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer la catégorie "${cat}" ?`)) {
                              removeCategory(cat);
                            }
                          }}
                          style={{ padding: "3px 8px", borderRadius: "8px", border: "none", background: "rgba(239, 68, 68, 0.2)", color: "#f87171", fontSize: "10px", cursor: "pointer" }}
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
                            background: "rgba(255,255,255,0.06)",
                            fontSize: "10px",
                            opacity: 0.8,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          {sub}
                          <span
                            onClick={() => removeSubCategory(cat, sub)}
                            style={{ cursor: "pointer", color: "#f87171", fontWeight: "bold" }}
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
                          style={{ flex: 1, padding: "6px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "white", fontSize: "11px" }}
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
                  if (confirm("Réinitialiser toutes les catégories par défaut ?")) {
                    resetCategories();
                  }
                }}
                style={{ padding: "8px", borderRadius: "10px", border: "none", background: "rgba(255,255,255,0.05)", color: "#9ca3af", fontSize: "10px", cursor: "pointer" }}
              >
                🔄 Réinitialiser les catégories par défaut
              </button>
            </div>
          )}
        </div>

        {/* 4. Compte & Synchronisation */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>
            <span>👤</span> Compte & Synchronisation
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showAuthBox ? "14px" : "12px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                {user ? user.email : "Mode 100% Local / Invité"}
              </div>
              <div style={{ fontSize: "10px", opacity: 0.6 }}>
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
                  background: showAuthBox ? "rgba(255,255,255,0.12)" : "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "white",
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
                background: "rgba(0,0,0,0.25)",
                borderRadius: "14px",
                padding: "14px",
                marginBottom: "14px",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <AuthForm onAuthSuccess={() => setShowAuthBox(false)} />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
            <button
              onClick={onExportBackup}
              style={{ padding: "10px", borderRadius: "12px", border: "none", background: "#3b82f6", color: "white", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}
            >
              📥 Exporter Sauvegarde
            </button>
            <button
              onClick={onImportBackup}
              style={{ padding: "10px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}
            >
              📤 Importer Sauvegarde
            </button>
          </div>
        </div>

        {/* 5. Espace aux Dons ("Soutenir le projet ☕") */}
        <div
          style={{
            ...cardStyle,
            background: "linear-gradient(135deg, rgba(250, 204, 21, 0.12), rgba(234, 179, 8, 0.05))",
            border: "1px solid rgba(250, 204, 21, 0.3)"
          }}
        >
          <div style={{ ...sectionTitleStyle, color: "#facc15" }}>
            <span>☕</span> Soutenir le Projet (Dons)
          </div>
          <p style={{ margin: "0 0 12px 0", fontSize: "12px", opacity: 0.85, lineHeight: "1.5" }}>
            Développé avec passion par un étudiant de 19 ans pour offrir un outil 100 % libre, sans publicité et respectueux de vos données. Si l'application vous plaît, un petit don encourage les futures améliorations !
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
                background: "rgba(255,255,255,0.1)",
                color: "white",
                fontWeight: "700",
                fontSize: "12px",
                textAlign: "center",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                border: "1px solid rgba(255,255,255,0.15)"
              }}
            >
              <span>💳</span> PayPal
            </a>
          </div>
        </div>

        {/* 6. Mentions Légales & CGU */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={sectionTitleStyle}>
              <span>⚖️</span> Mentions Légales & CGU
            </div>
            <button
              onClick={() => setShowLegal(!showLegal)}
              style={{ padding: "4px 8px", borderRadius: "8px", border: "none", background: "rgba(255,255,255,0.06)", color: "inherit", fontSize: "10px", cursor: "pointer" }}
            >
              {showLegal ? "Masquer" : "Lire"}
            </button>
          </div>

          {showLegal && (
            <div style={{ marginTop: "10px", fontSize: "11px", opacity: 0.8, lineHeight: "1.5", display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ margin: 0 }}>
                Cette application est un carnet de bord numérique d'enregistrement personnel pour la détection de loisir et la recherche d'objets métalliques.
              </p>
              <p style={{ margin: 0 }}>
                L'utilisateur est seul responsable de sa pratique et s'engage à respecter scrupuleusement l'article L. 542-1 du Code du patrimoine, à obtenir l'autorisation expresse des propriétaires des parcelles prospectées et à déclarer toute découverte fortuite.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
