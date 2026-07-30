import AddFindForm from "./AddFindForm";
import { categoryEmojis } from "../subCategories";

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
  favoritesOnly,
  setFavoritesOnly,
  hideAllFinds,
  setHideAllFinds,
  search,
  setSearch,
  filters,
  toggleFilter,
  
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
  setCustomLng,
  customLng,
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

        {/* 2x3 Toggle Grid */}
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
            🎯 Suivi : {followGps ? "On" : "Off"}
          </button>

          {/* Outing Recording (Marche/Stop) */}
          {!isRecordingSortie ? (
            <button
              onClick={startSortie}
              style={{
                background: "rgba(22, 163, 74, 0.15)",
                border: "1px solid #16a34a",
                borderRadius: "12px",
                padding: "8px",
                color: "#4ade80",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              ⏱️ Marche
            </button>
          ) : (
            <button
              onClick={stopSortie}
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid #ef4444",
                borderRadius: "12px",
                padding: "8px",
                color: "#f87171",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              🛑 Stop ({(sortieDistance / 1000).toFixed(2)}k)
            </button>
          )}

          {/* Favorites Toggle */}
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            style={{
              background: favoritesOnly ? "rgba(245, 158, 11, 0.15)" : "rgba(255, 255, 255, 0.06)",
              border: "1px solid #f59e0b",
              borderRadius: "12px",
              padding: "8px",
              color: "#facc15",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            ⭐ Favoris : {favoritesOnly ? "On" : "Off"}
          </button>

          {/* Clustering Toggle */}
          <button
            onClick={() => setUseClustering(!useClustering)}
            style={{
              background: useClustering ? "rgba(139, 92, 246, 0.15)" : "rgba(255, 255, 255, 0.06)",
              border: "1px solid #8b5cf6",
              borderRadius: "12px",
              padding: "8px",
              color: "#a78bfa",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            🧬 Clusters : {useClustering ? "On" : "Off"}
          </button>

          {/* Cassini (Historical Map) Toggle */}
          <button
            onClick={() => setShowHistoricalMap(!showHistoricalMap)}
            style={{
              background: showHistoricalMap ? "rgba(37, 99, 235, 0.15)" : "rgba(255, 255, 255, 0.06)",
              border: "1px solid #2563eb",
              borderRadius: "12px",
              padding: "8px",
              color: "#60a5fa",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            🗺️ Cassini : {showHistoricalMap ? "On" : "Off"}
          </button>
        </div>

        {/* Hide All Finds Toggle */}
        <button
          onClick={() => setHideAllFinds(!hideAllFinds)}
          style={{
            borderRadius: "12px",
            padding: "9px 12px",
            border: hideAllFinds ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(255, 255, 255, 0.12)",
            background: hideAllFinds ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.06)",
            color: hideAllFinds ? "#f87171" : "white",
            fontWeight: "bold",
            fontSize: "11px",
            cursor: "pointer",
            width: "100%",
            marginTop: "2px",
            marginBottom: "4px",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            if (hideAllFinds) {
              e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.25)";
            } else {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            if (hideAllFinds) {
              e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
            } else {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
            }
          }}
        >
          {hideAllFinds ? "👁️ Afficher toutes les trouvailles" : "👁️ Masquer toutes les trouvailles"}
        </button>

        {/* Historical Map Opacity Slider */}
        {showHistoricalMap && (
          <div style={{ background: "rgba(255,255,255,0.04)", padding: "8px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", margin: "5px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#d1d5db", fontWeight: "bold", marginBottom: "4px" }}>
              <span>Opacité Cassini</span>
              <span>{Math.round(historicalMapOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={historicalMapOpacity * 100}
              onChange={(e) => setHistoricalMapOpacity(Number(e.target.value) / 100)}
              style={{
                width: "100%",
                accentColor: "#d97706",
                cursor: "pointer"
              }}
            />
          </div>
        )}

        {/* GPS Style Selector */}
        <div style={{ background: "rgba(255,255,255,0.04)", padding: "8px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", margin: "5px 0" }}>
          <div style={{ fontSize: "10px", color: "#d1d5db", fontWeight: "bold", marginBottom: "6px" }}>
            🎨 Style de ma position GPS
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => {
                setGpsStyle("blue-dot");
                localStorage.setItem("gpsStyle", "blue-dot");
              }}
              style={{
                flex: 1,
                padding: "5px",
                borderRadius: "8px",
                border: "none",
                background: gpsStyle === "blue-dot" ? "#2563eb" : "rgba(255,255,255,0.06)",
                color: "white",
                fontSize: "9.5px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
            >
              🔵 Bleu
            </button>
            <button
              onClick={() => {
                setGpsStyle("radar");
                localStorage.setItem("gpsStyle", "radar");
              }}
              style={{
                flex: 1,
                padding: "5px",
                borderRadius: "8px",
                border: "none",
                background: gpsStyle === "radar" ? "#10b981" : "rgba(255,255,255,0.06)",
                color: "white",
                fontSize: "9.5px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
            >
              🟢 Radar
            </button>
            <button
              onClick={() => {
                setGpsStyle("royal-pointer");
                localStorage.setItem("gpsStyle", "royal-pointer");
              }}
              style={{
                flex: 1,
                padding: "5px",
                borderRadius: "8px",
                border: "none",
                background: gpsStyle === "royal-pointer" ? "#d97706" : "rgba(255,255,255,0.06)",
                color: "white",
                fontSize: "9.5px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
            >
              🟡 Or
            </button>
          </div>
        </div>

        {/* Search Bar (White background pill shape) */}
        <input
          type="text"
          placeholder="🔍 Rechercher titre, époque..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 16px",
            borderRadius: "50px",
            border: "none",
            background: "#ffffff",
            color: "#1f2937",
            fontSize: "12.5px",
            fontWeight: "500",
            outline: "none",
            boxSizing: "border-box",
            margin: "5px 0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        />

        {/* Categories filters (White rounded pills) */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginTop: "5px"
          }}
        >
          {Object.keys(icons).map((category) => (
            <button
              key={category}
              onClick={() => toggleFilter(category)}
              style={{
                background: "#ffffff",
                color: "#1f2937",
                border: filters.includes(category) ? "2px solid #2563eb" : "1px solid #d1d5db",
                borderRadius: "50px",
                padding: "5px 11px",
                fontSize: "11.5px",
                fontWeight: "600",
                cursor: "pointer",
                opacity: filters.includes(category) ? 1 : 0.35,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              {categoryEmojis[category] || ""} {category}
            </button>
          ))}
        </div>

        {/* Active sub-category filter badge */}
        {activeSubCategory && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(37, 99, 235, 0.15)",
            border: "1px solid rgba(37, 99, 235, 0.3)",
            borderRadius: "10px",
            padding: "6px 10px",
            marginTop: "8px",
            fontSize: "11px",
            color: "#93c5fd"
          }}>
            <span>🎯 Sous-catégorie : <strong>{activeSubCategory}</strong></span>
            <button
              onClick={() => setActiveSubCategory(null)}
              style={{
                background: "none",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                padding: "0 2px"
              }}
              title="Effacer le filtre de sous-catégorie"
            >
              ✕
            </button>
          </div>
        )}

        {/* Integrated form */}
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
