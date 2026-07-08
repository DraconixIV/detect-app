import { categoriesWithSub, categoryEmojis } from "../subCategories";

function getDistance(p1, p2) {
  const R = 6371e3; // metres
  const phi1 = (p1[0] * Math.PI) / 180;
  const phi2 = (p2[0] * Math.PI) / 180;
  const deltaPhi = ((p2[0] - p1[0]) * Math.PI) / 180;
  const deltaLambda = ((p2[1] - p1[1]) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
}

function getDistanceOfTrack(positions) {
  if (!positions || positions.length < 2) return 0;
  let dist = 0;
  for (let i = 0; i < positions.length - 1; i++) {
    dist += getDistance(positions[i], positions[i + 1]);
  }
  return dist / 1000; // in km
}

export default function StatsPanel({
  finds = [],
  savedTracks = [],
  exportData,
  importData,
  groupedDates = {},
  setSelectedDate,
  onClose
}) {
  const validDates = Object.entries(
    groupedDates || {}
  ).filter(
    ([_, findsForDate]) =>
      Array.isArray(findsForDate) &&
      findsForDate.length > 0
  );

  return (
    <div
      style={{
        background:
          "rgba(20,20,20,0.72)",
        backdropFilter:
          "blur(10px)",
        color: "white",
        padding: "15px",
        borderRadius: "18px",
        width: "250px",
        maxHeight: "70vh",
        overflowY: "auto",
        position: "relative",
        boxSizing: "border-box",
        boxShadow:
          "0 0 20px rgba(0,0,0,0.4)"
      }}
    >
      {/* CROIX */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "none",
          background: "#ef4444",
          color: "white",
          fontSize: "18px",
          cursor: "pointer"
        }}
      >
        ✕
      </button>

      <h3
        style={{
          marginTop: 0,
          marginBottom: "15px"
        }}
      >
        📊 Statistiques
      </h3>

      <p>
        📍 Trouvailles : {finds.length}
      </p>

      <p>
  ⭐ Favoris : {
    finds.filter(
      (find) => find.favorite
    ).length
  }
</p>

      <p>
        🛰️ Sorties GPS : {savedTracks.length}
      </p>

      <hr
  style={{
    margin: "15px 0"
  }}
/>

<h3>🏆 Catégories & Détails</h3>

{(() => {
  const categoryData = Object.entries(
    finds.reduce(
      (acc, find) => {
        acc[find.category] = (acc[find.category] || 0) + 1;
        return acc;
      },
      {}
    )
  ).sort((a, b) => b[1] - a[1]);

  const maxCount = categoryData.length > 0 ? Math.max(...categoryData.map(d => d[1])) : 1;

  return (
    <>
      {categoryData.length > 0 && (
        <div style={{ margin: "10px 0 15px 0", background: "rgba(255,255,255,0.06)", padding: "10px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "11px", opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            📊 Répartition
          </h4>
          <svg width="100%" height={categoryData.slice(0, 5).length * 28 + 5} style={{ overflow: "visible" }}>
            {categoryData.slice(0, 5).map(([category, count], idx) => {
              const barWidth = (count / maxCount) * 110; // max width 110px
              const y = idx * 28 + 12;
              return (
                <g key={category}>
                  <text x="0" y={y} fill="white" fontSize="9px" fontWeight="bold">
                    {categoryEmojis[category] || ""} {category.substring(0, 7)} ({count})
                  </text>
                  <rect x="75" y={y - 8} width="110" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
                  <rect
                    x="75"
                    y={y - 8}
                    width={barWidth}
                    height="6"
                    rx="3"
                    fill={
                      category === "Monnaie" ? "#facc15" :
                      category === "Bijou" ? "#ec4899" :
                      category === "Boucle" ? "#8b5cf6" :
                      category === "Bouton" ? "#10b981" :
                      category === "Médaille" ? "#3b82f6" :
                      category === "Munition" ? "#ef4444" :
                      category === "Outil" ? "#f97316" :
                      category === "Plomb" ? "#6b7280" :
                      category === "Religieux" ? "#d97706" : "#4b5563"
                    }
                  />
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </>
  );
})()}

{Object.entries(
  finds.reduce(
    (acc, find) => {
      acc[find.category] = (acc[find.category] || 0) + 1;
      return acc;
    },
    {}
  )
)
  .sort((a, b) => b[1] - a[1])
  .map(([category, count]) => {
    // Obtenir le décompte des sous-catégories pour cette catégorie
    const subCatCounts = Object.entries(
      finds
        .filter((find) => find.category === category && find.sub_category)
        .reduce((acc, find) => {
          const matchingSubCat = (categoriesWithSub[category] || []).find(
            (sub) => sub.toLowerCase() === find.sub_category.toLowerCase()
          ) || find.sub_category;

          acc[matchingSubCat] = (acc[matchingSubCat] || 0) + 1;
          return acc;
        }, {})
    ).sort((a, b) => b[1] - a[1]);

    return (
      <div key={category} style={{ marginBottom: "12px" }}>
        <p style={{ fontWeight: "bold", margin: "4px 0", fontSize: "14px" }}>
          {categoryEmojis[category] || "📍"} {category} : {count}
        </p>
        
        {subCatCounts.length > 0 && (
          <div style={{ paddingLeft: "15px", fontSize: "12px", color: "#d1d5db" }}>
            {subCatCounts.map(([subCat, subCount]) => (
              <div key={subCat} style={{ margin: "2px 0" }}>
                ↳ {subCat} : {subCount}
              </div>
            ))}
          </div>
        )}
        <hr style={{ margin: "10px 0", border: "none", borderBottom: "1px solid rgba(255, 255, 255, 0.15)" }} />
      </div>
    );
  })}

      <button
        onClick={exportData}
        style={{
          width: "100%",
          marginTop: "10px",
          padding: "10px",
          borderRadius: "12px",
          border: "none",
          fontSize: "15px",
          cursor: "pointer"
        }}
      >
        📤 Export backup
      </button>

      <button
        onClick={importData}
        style={{
          width: "100%",
          marginTop: "10px",
          padding: "10px",
          borderRadius: "12px",
          border: "none",
          fontSize: "15px",
          cursor: "pointer"
        }}
      >
        📥 Import backup
      </button>

      <hr
        style={{
          margin: "15px 0"
        }}
      />

      <h3>🛰️ Historique Sorties</h3>
      {savedTracks.length === 0 && (
        <p style={{ opacity: 0.7, fontSize: "13px", fontStyle: "italic" }}>Aucune sortie enregistrée</p>
      )}
      {savedTracks.map((track) => {
        const dist = getDistanceOfTrack(track.positions);
        const dateStr = track.created_at ? new Date(track.created_at).toLocaleDateString() : "";
        return (
          <div key={track.id} style={{ margin: "8px 0", padding: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", fontSize: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
              <span>🚶 {track.session_name}</span>
              <span style={{ fontSize: "10px", opacity: 0.6 }}>{dateStr}</span>
            </div>
            <div style={{ opacity: 0.8, fontSize: "11px", marginTop: "4px", display: "flex", gap: "10px" }}>
              <span>📏 <strong>{dist.toFixed(2)}</strong> km</span>
              <span>📍 <strong>{track.positions?.length || 0}</strong> points</span>
            </div>
          </div>
        );
      })}

      <hr
        style={{
          margin: "15px 0"
        }}
      />

      <h3>
        📅 Dates
      </h3>

      <button
        onClick={() =>
          setSelectedDate(null)
        }
        style={{
          width: "100%",
          marginBottom: "10px",
          padding: "10px",
          borderRadius: "12px",
          border: "none",
          fontSize: "15px",
          cursor: "pointer"
        }}
      >
        ❌ Retirer filtre
      </button>

      {validDates.length === 0 && (
        <p
          style={{
            opacity: 0.7,
            fontSize: "14px"
          }}
        >
          Aucune date disponible
        </p>
      )}

      {validDates.map(
  ([date, findsForDate]) => (
    <button
      key={date}
      onClick={() =>
        setSelectedDate(date)
      }
      style={{
        width: "100%",
        marginBottom: "8px",
        padding: "10px",
        borderRadius: "12px",
        border: "none",
        fontSize: "14px",
        cursor: "pointer"
      }}
    >
      📅 {date}
      <br />
      <strong>
        {findsForDate.length} trouvaille
        {findsForDate.length > 1
          ? "s"
          : ""}
      </strong>
    </button>
  )
)}
    </div>
  );
}