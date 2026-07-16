import AddFindForm from "./AddFindForm";

export default function SidebarMenu({
  showMenu,
  setShowMenu,
  showForm,
  setShowForm,
  mapStyle,
  setMapStyle,
  followGps,
  setFollowGps,
  showHistoricalMap,
  setShowHistoricalMap,
  historicalMapOpacity,
  setHistoricalMapOpacity,
  useClustering,
  setUseClustering,
  gpsStyle,
  setGpsStyle,
  isRecordingSortie,
  sortieDistance,
  startSortie,
  stopSortie,
  onExport,
  onImport,
  onOpenAlbum,
  onOpenStats,
  onOpenPerformance,
  
  // AddFindForm Props
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  newCategory,
  setNewCategory,
  newSubCategory,
  setNewSubCategory,
  icons,
  addFind,
  newPhoto,
  setNewPhoto,
  addingFind,
  customDate,
  setCustomDate,
  customLat,
  setCustomLat,
  customLng,
  setCustomLng,
  activeSubCategory,
  setActiveSubCategory
}) {
  return (
    showMenu && (
      <div
        style={{
          position: "absolute",
          zIndex: 6000,
          top: 85,
          left: 75,
          background: "rgba(17, 24, 39, 0.95)",
          backdropFilter: "blur(16px)",
          padding: "18px",
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "stretch",
          width: "280px",
          maxHeight: "75vh",
          overflowY: "auto",
          color: "white",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          fontFamily: "system-ui, sans-serif"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800" }}>⚙️ Menu de Contrôle</h3>
          <button
            onClick={() => setShowMenu(false)}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            borderRadius: "12px",
            padding: "10px",
            border: "none",
            background: "#16a34a",
            color: "white",
            fontWeight: "bold",
            fontSize: "13px",
            cursor: "pointer"
          }}
        >
          ➕ Ajouter trouvaille
        </button>

        {/* 2x2 Toggle Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", margin: "5px 0" }}>
          {/* Map Style */}
          <button
            onClick={() => setMapStyle(mapStyle === "plan" ? "satellite" : "plan")}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "8px",
              color: "white",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {mapStyle === "plan" ? "🛰️ Satellite" : "🗺️ Plan"}
          </button>

          {/* Follow GPS */}
          <button
            onClick={() => setFollowGps(!followGps)}
            style={{
              background: followGps ? "rgba(37, 99, 235, 0.15)" : "rgba(255, 255, 255, 0.06)",
              border: followGps ? "1px solid #2563eb" : "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "8px",
              color: followGps ? "#60a5fa" : "white",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {followGps ? "🎯 Suivi : On" : "🎯 Suivi : Off"}
          </button>

          {/* Historical Map Toggle */}
          <button
            onClick={() => setShowHistoricalMap(!showHistoricalMap)}
            style={{
              background: showHistoricalMap ? "rgba(217, 119, 6, 0.15)" : "rgba(255, 255, 255, 0.06)",
              border: showHistoricalMap ? "1px solid #d97706" : "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "8px",
              color: showHistoricalMap ? "#fbbf24" : "white",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            📜 Carte 1866
          </button>

          {/* Clustering Toggle */}
          <button
            onClick={() => setUseClustering(!useClustering)}
            style={{
              background: useClustering ? "rgba(139, 92, 246, 0.15)" : "rgba(255, 255, 255, 0.06)",
              border: useClustering ? "1px solid #8b5cf6" : "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "8px",
              color: useClustering ? "#a78bfa" : "white",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            🗂️ Regrouper
          </button>
        </div>

        {/* GPS Style Selector */}
        <div style={{ margin: "5px 0", fontSize: "12px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "#9ca3af", fontWeight: "600" }}>
            Curseur GPS :
          </label>
          <select
            value={gpsStyle}
            onChange={(e) => {
              setGpsStyle(e.target.value);
              localStorage.setItem("gpsStyle", e.target.value);
            }}
            style={{
              width: "100%",
              padding: "6px 8px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              color: "white",
              outline: "none"
            }}
          >
            <option value="blue-dot" style={{ background: "#1f2937" }}>🔵 Point classique</option>
            <option value="crosshair" style={{ background: "#1f2937" }}>🎯 Réticule de visée</option>
          </select>
        </div>

        {/* Historical Map Opacity Slider */}
        {showHistoricalMap && (
          <div style={{ margin: "5px 0", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#9ca3af", marginBottom: "4px" }}>
              <span>Opacité 1866 :</span>
              <span>{Math.round(historicalMapOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={historicalMapOpacity}
              onChange={(e) => setHistoricalMapOpacity(parseFloat(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#d97706",
                cursor: "pointer"
              }}
            />
          </div>
        )}

        {/* Outing Recording Controller */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "14px",
          padding: "10px",
          marginTop: "5px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <div style={{ fontSize: "12px", fontWeight: "bold", color: "#9ca3af" }}>⏱️ Enregistreur de Sortie</div>
          {!isRecordingSortie ? (
            <button
              onClick={startSortie}
              style={{
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                border: "none",
                borderRadius: "10px",
                padding: "8px",
                color: "white",
                fontWeight: "bold",
                fontSize: "11px",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(239, 68, 68, 0.25)"
              }}
            >
              ⏺️ Démarrer la sortie
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ fontSize: "11px", color: "#fca5a5" }}>
                🔴 Enregistrement... ({(sortieDistance / 1000).toFixed(2)} km)
              </div>
              <button
                onClick={stopSortie}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "10px",
                  padding: "8px",
                  color: "#fecaca",
                  fontWeight: "bold",
                  fontSize: "11px",
                  cursor: "pointer"
                }}
              >
                ⏹️ Arrêter et Sauvegarder
              </button>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "5px 0" }}>
          <button
            onClick={onOpenAlbum}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "10px",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"}
          >
            🖼️ Ouvrir l'Album
          </button>

          <button
            onClick={onOpenStats}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "10px",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"}
          >
            🏛️ Musée & Journal
          </button>

          <button
            onClick={onOpenPerformance}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "10px",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"}
          >
            ⚡ Diagnostics & Logs
          </button>
        </div>

        {/* Backups Panel */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: "10px",
          marginTop: "5px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <div style={{ fontSize: "11px", color: "#9ca3af" }}>Sauvegardes de sécurité :</div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={onExport}
              style={{
                flex: 1,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "6px",
                color: "#9ca3af",
                fontSize: "10px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              📥 Exporter
            </button>
            <button
              onClick={onImport}
              style={{
                flex: 1,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "6px",
                color: "#9ca3af",
                fontSize: "10px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              📤 Importer
            </button>
          </div>
        </div>

        {/* Formulaire d'ajout intégré */}
        <AddFindForm
          showForm={showForm}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newDescription={newDescription}
          setNewDescription={setNewDescription}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          newSubCategory={newSubCategory}
          setNewSubCategory={setNewSubCategory}
          icons={icons}
          addFind={addFind}
          newPhoto={newPhoto}
          setNewPhoto={setNewPhoto}
          addingFind={addingFind}
          customDate={customDate}
          setCustomDate={setCustomDate}
          customLat={customLat}
          setCustomLat={setCustomLat}
          customLng={customLng}
          setCustomLng={setCustomLng}
        />
      </div>
    )
  );
}
