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
  onOpenMap
}) {
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
    color: "#facc15",
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
        background: "#0b1329",
        color: "white",
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
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>Raccourcis & Outils de Terrain</h1>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>Contrôles instantanés pour votre session</p>
          </div>
        </div>

        {/* 1. Enregistrement de Session / Sortie */}
        <div style={{ ...cardStyle, background: isRecordingSortie ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 255, 255, 0.04)", border: isRecordingSortie ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div style={{ ...sectionTitleStyle, color: isRecordingSortie ? "#34d399" : "#facc15" }}>
            <span>⏱️</span> Enregistrement de Sortie (GPS)
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                {isRecordingSortie ? "🟢 Sortie en cours..." : "⚪ Enregistrement inactif"}
              </div>
              <div style={{ fontSize: "11px", opacity: 0.7 }}>
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
                cursor: "pointer"
              }}
            >
              {isRecordingSortie ? "🛑 Terminer & Sauvegarder" : "▶️ Démarrer la sortie"}
            </button>
          </div>
        </div>

        {/* 2. Outils d'Affichage Carte */}
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
                border: showHistoricalMap ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                background: showHistoricalMap ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.04)",
                color: "white",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>🗺️</div>
              <div>Carte Cassini (18e)</div>
              <div style={{ fontSize: "10px", opacity: 0.6 }}>{showHistoricalMap ? "Activée" : "Désactivée"}</div>
            </button>

            {/* Clustering */}
            <button
              onClick={() => setUseClustering(!useClustering)}
              style={{
                padding: "12px",
                borderRadius: "14px",
                border: useClustering ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                background: useClustering ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.04)",
                color: "white",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>🔵</div>
              <div>Groupement</div>
              <div style={{ fontSize: "10px", opacity: 0.6 }}>{useClustering ? "Groupé (Optimisé)" : "Individuel"}</div>
            </button>

            {/* Suivi GPS */}
            <button
              onClick={() => setFollowGps(!followGps)}
              style={{
                padding: "12px",
                borderRadius: "14px",
                border: followGps ? "2px solid #10b981" : "1px solid rgba(255,255,255,0.1)",
                background: followGps ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.04)",
                color: "white",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>🎯</div>
              <div>Centrage GPS</div>
              <div style={{ fontSize: "10px", opacity: 0.6 }}>{followGps ? "Suivi actif" : "Libre"}</div>
            </button>

            {/* Favoris Seuls */}
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              style={{
                padding: "12px",
                borderRadius: "14px",
                border: favoritesOnly ? "2px solid #ec4899" : "1px solid rgba(255,255,255,0.1)",
                background: favoritesOnly ? "rgba(236, 72, 153, 0.2)" : "rgba(255,255,255,0.04)",
                color: "white",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>⭐</div>
              <div>Favoris seuls</div>
              <div style={{ fontSize: "10px", opacity: 0.6 }}>{favoritesOnly ? "Filtre actif" : "Toutes les trouvailles"}</div>
            </button>
          </div>

          {/* Cassini Opacity Slider */}
          {showHistoricalMap && (
            <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "12px", marginTop: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px" }}>
                <span>Transparence Cassini</span>
                <span>{Math.round(historicalMapOpacity * 100)}%</span>
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
              border: hideAllFinds ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(255,255,255,0.1)",
              background: hideAllFinds ? "rgba(239, 68, 68, 0.2)" : "rgba(255,255,255,0.06)",
              color: hideAllFinds ? "#f87171" : "white",
              fontWeight: "bold",
              fontSize: "12px",
              cursor: "pointer",
              marginTop: "8px"
            }}
          >
            {hideAllFinds ? "👁️ Réafficher les trouvailles sur la carte" : "👁️ Masquer toutes les trouvailles (Mode Navigation Rapide)"}
          </button>
        </div>

        {/* 3. Style du Pointeur GPS */}
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
                border: gpsStyle === "blue-dot" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                background: gpsStyle === "blue-dot" ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.04)",
                color: "white",
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
                border: gpsStyle === "pin" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                background: gpsStyle === "pin" ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.04)",
                color: "white",
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
