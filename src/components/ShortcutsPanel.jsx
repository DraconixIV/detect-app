import React from "react";

export default function ShortcutsPanel({
  showHistoricalMap,
  setShowHistoricalMap,
  historicalMapOpacity,
  setHistoricalMapOpacity,
  useClustering,
  setUseClustering,
  hideAllFinds,
  setHideAllFinds,
  followGps,
  setFollowGps,
  gpsStyle,
  setGpsStyle,
  isRecordingSortie,
  sortieDistance,
  startSortie,
  stopSortie,
  favoritesOnly,
  setFavoritesOnly,
  onOpenMap,
  theme = "dark",
  onOpenCategoryManager
}) {
  const isLight = theme === "light";
  const bgPanel = isLight ? "#f8fafc" : "#0b1329";
  const textMain = isLight ? "#0f172a" : "#f8fafc";
  const textSub = isLight ? "#475569" : "#94a3b8";
  const cardBorder = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.12)";
  const cardBg = isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)";
  const cardShadow = isLight ? "0 2px 8px rgba(0, 0, 0, 0.06)" : "none";

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
    color: isLight ? "#2563eb" : "#facc15",
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
          <div style={{ fontSize: "28px" }}>⚡</div>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: textMain }}>
              Raccourcis & Outils de Terrain
            </h1>
            <p style={{ margin: 0, fontSize: "12px", color: textSub }}>
              Contrôles instantanés pour votre session
            </p>
          </div>
        </div>

        {/* 1. Enregistrement de Session / Sortie */}
        <div
          style={{
            ...cardStyle,
            background: isRecordingSortie
              ? (isLight ? "rgba(16, 185, 129, 0.12)" : "rgba(16, 185, 129, 0.15)")
              : cardBg,
            border: isRecordingSortie
              ? "1.5px solid #10b981"
              : `1px solid ${cardBorder}`
          }}
        >
          <div style={{ ...sectionTitleStyle, color: isRecordingSortie ? "#10b981" : (isLight ? "#2563eb" : "#facc15") }}>
            <span>⏱️</span> Enregistrement de Sortie (GPS)
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "bold", color: textMain }}>
                {isRecordingSortie ? "🟢 Sortie en cours d'enregistrement..." : "⚪ Enregistrement inactif"}
              </div>
              <div style={{ fontSize: "11px", color: textSub }}>
                Distance : <strong>{(sortieDistance / 1000).toFixed(2)} km</strong>
              </div>
            </div>

            <button
              onClick={isRecordingSortie ? stopSortie : startSortie}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: "none",
                background: isRecordingSortie ? "#ef4444" : "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                boxShadow: isRecordingSortie ? "0 4px 12px rgba(239, 68, 68, 0.3)" : "0 4px 12px rgba(16, 185, 129, 0.3)"
              }}
            >
              {isRecordingSortie ? "🛑 Terminer & Sauvegarder" : "▶️ Démarrer la sortie"}
            </button>
          </div>
        </div>

        {/* 2. Raccourci Gestionnaire de Catégories */}
        {onOpenCategoryManager && (
          <div style={cardStyle}>
            <div style={sectionTitleStyle}>
              <span>🏷️</span> Gestion des Catégories & Sous-Types
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "12px", color: textSub }}>
                Ajoutez, renommez ou personnalisez vos familles d'objets.
              </div>
              <button
                onClick={onOpenCategoryManager}
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                ⚙️ Ouvrir le Gestionnaire
              </button>
            </div>
          </div>
        )}

        {/* 3. Outils d'Affichage Carte */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>
            <span>🗺️</span> Outils d'Affichage & Cartographie
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
            {/* Cassini Toggle */}
            <button
              onClick={() => setShowHistoricalMap(!showHistoricalMap)}
              style={{
                padding: "12px",
                borderRadius: "14px",
                border: showHistoricalMap ? "2px solid #3b82f6" : `1px solid ${cardBorder}`,
                background: showHistoricalMap ? (isLight ? "rgba(59, 130, 246, 0.12)" : "rgba(59, 130, 246, 0.2)") : (isLight ? "#f8fafc" : "rgba(255,255,255,0.04)"),
                color: textMain,
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>🗺️</div>
              <div>Carte Cassini (18e)</div>
              <div style={{ fontSize: "10px", color: textSub }}>{showHistoricalMap ? "Activée" : "Désactivée"}</div>
            </button>

            {/* Clustering */}
            <button
              onClick={() => setUseClustering(!useClustering)}
              style={{
                padding: "12px",
                borderRadius: "14px",
                border: useClustering ? "2px solid #3b82f6" : `1px solid ${cardBorder}`,
                background: useClustering ? (isLight ? "rgba(59, 130, 246, 0.12)" : "rgba(59, 130, 246, 0.2)") : (isLight ? "#f8fafc" : "rgba(255,255,255,0.04)"),
                color: textMain,
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>🔵</div>
              <div>Groupement</div>
              <div style={{ fontSize: "10px", color: textSub }}>{useClustering ? "Groupé (Optimisé)" : "Individuel"}</div>
            </button>

            {/* Suivi GPS */}
            <button
              onClick={() => setFollowGps(!followGps)}
              style={{
                padding: "12px",
                borderRadius: "14px",
                border: followGps ? "2px solid #10b981" : `1px solid ${cardBorder}`,
                background: followGps ? (isLight ? "rgba(16, 185, 129, 0.12)" : "rgba(16, 185, 129, 0.2)") : (isLight ? "#f8fafc" : "rgba(255,255,255,0.04)"),
                color: textMain,
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>🎯</div>
              <div>Centrage GPS</div>
              <div style={{ fontSize: "10px", color: textSub }}>{followGps ? "Suivi actif" : "Libre"}</div>
            </button>

            {/* Favoris Seuls */}
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              style={{
                padding: "12px",
                borderRadius: "14px",
                border: favoritesOnly ? "2px solid #ec4899" : `1px solid ${cardBorder}`,
                background: favoritesOnly ? (isLight ? "rgba(236, 72, 153, 0.12)" : "rgba(236, 72, 153, 0.2)") : (isLight ? "#f8fafc" : "rgba(255,255,255,0.04)"),
                color: textMain,
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>⭐</div>
              <div>Favoris seuls</div>
              <div style={{ fontSize: "10px", color: textSub }}>{favoritesOnly ? "Filtre actif" : "Toutes les trouvailles"}</div>
            </button>
          </div>

          {/* Cassini Opacity Slider */}
          {showHistoricalMap && (
            <div style={{ background: isLight ? "#f1f5f9" : "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "12px", marginTop: "10px", border: `1px solid ${cardBorder}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px", color: textMain }}>
                <span>Transparence Cassini</span>
                <strong>{Math.round(historicalMapOpacity * 100)}%</strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={historicalMapOpacity}
                onChange={(e) => setHistoricalMapOpacity(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "#3b82f6" }}
              />
            </div>
          )}

          {/* Hide All Finds Quick Toggle */}
          <button
            onClick={() => setHideAllFinds(!hideAllFinds)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "14px",
              border: hideAllFinds ? "1.5px solid #ef4444" : `1px solid ${cardBorder}`,
              background: hideAllFinds ? (isLight ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.2)") : (isLight ? "#f8fafc" : "rgba(255,255,255,0.06)"),
              color: hideAllFinds ? "#ef4444" : textMain,
              fontWeight: "bold",
              fontSize: "12px",
              cursor: "pointer",
              marginTop: "8px"
            }}
          >
            {hideAllFinds ? "👁️ Réafficher les trouvailles sur la carte" : "👁️ Masquer toutes les trouvailles (Mode Rapide)"}
          </button>
        </div>

        {/* 4. Style du Pointeur GPS */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>
            <span>📍</span> Style du Pointeur GPS
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button
              onClick={() => {
                setGpsStyle("blue-dot");
                localStorage.setItem("gpsStyle", "blue-dot");
              }}
              style={{
                padding: "10px",
                borderRadius: "12px",
                border: gpsStyle === "blue-dot" ? "2px solid #3b82f6" : `1px solid ${cardBorder}`,
                background: gpsStyle === "blue-dot" ? (isLight ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.2)") : (isLight ? "#f8fafc" : "rgba(255,255,255,0.04)"),
                color: textMain,
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              🔵 Point Bleu Pulse
            </button>

            <button
              onClick={() => {
                setGpsStyle("pin");
                localStorage.setItem("gpsStyle", "pin");
              }}
              style={{
                padding: "10px",
                borderRadius: "12px",
                border: gpsStyle === "pin" ? "2px solid #3b82f6" : `1px solid ${cardBorder}`,
                background: gpsStyle === "pin" ? (isLight ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.2)") : (isLight ? "#f8fafc" : "rgba(255,255,255,0.04)"),
                color: textMain,
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              📍 Épingle Classique
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
