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
  // Grouper les trouvailles par date (DD/MM/YYYY)
  const findsByDate = finds.reduce((acc, find) => {
    if (!find.date) return acc;
    const datePart = find.date.split(",")[0].split(" ")[0].trim();
    if (!acc[datePart]) acc[datePart] = [];
    acc[datePart].push(find);
    return acc;
  }, {});

  // Grouper les sorties (traces GPS) par date (DD/MM/YYYY)
  const tracksByDate = savedTracks.reduce((acc, track) => {
    if (!track.created_at) return acc;
    const dateStr = new Date(track.created_at).toLocaleDateString("fr-FR");
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(track);
    return acc;
  }, {});

  // Union triée de toutes les dates (de la plus récente à la plus ancienne)
  const allDates = Array.from(new Set([
    ...Object.keys(findsByDate),
    ...Object.keys(tracksByDate)
  ])).sort((a, b) => {
    const parseDate = (dStr) => {
      const parts = dStr.split("/");
      return new Date(parts[2], parts[1] - 1, parts[0]);
    };
    return parseDate(b) - parseDate(a);
  });

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
          "0 0 20px rgba(0,0,0,0.4)",
        fontFamily: "system-ui, sans-serif"
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
          marginBottom: "15px",
          fontWeight: "800",
          letterSpacing: "-0.5px"
        }}
      >
        📊 Statistiques
      </h3>

      <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
        <div style={{ flex: 1, background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "10px", borderRadius: "14px", textAlign: "center" }}>
          <div style={{ fontSize: "16px" }}>📍</div>
          <div style={{ fontSize: "9px", opacity: 0.7, marginTop: "2px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.2px" }}>Trouvailles</div>
          <div style={{ fontSize: "15px", fontWeight: "800", marginTop: "4px", color: "#facc15" }}>{finds.length}</div>
        </div>
        <div style={{ flex: 1, background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "10px", borderRadius: "14px", textAlign: "center" }}>
          <div style={{ fontSize: "16px" }}>⭐</div>
          <div style={{ fontSize: "9px", opacity: 0.7, marginTop: "2px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.2px" }}>Favoris</div>
          <div style={{ fontSize: "15px", fontWeight: "800", marginTop: "4px", color: "#ec4899" }}>{finds.filter(find => find.favorite).length}</div>
        </div>
      </div>

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

      <h3>📅 Journal des Sorties</h3>

      <button
        onClick={() => setSelectedDate(null)}
        style={{
          width: "100%",
          marginBottom: "10px",
          padding: "10px",
          borderRadius: "12px",
          border: "none",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          background: "rgba(255, 255, 255, 0.15)",
          color: "white"
        }}
      >
        ✕ Retirer le filtre de date
      </button>

      {allDates.length === 0 && (
        <p style={{ opacity: 0.7, fontSize: "13px", fontStyle: "italic" }}>Aucune sortie ni trouvaille enregistrée</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto", paddingRight: "4px" }}>
        {allDates.map((dateStr) => {
          const dayFinds = findsByDate[dateStr] || [];
          const dayTracks = tracksByDate[dateStr] || [];

          return (
            <div
              key={dateStr}
              onClick={() => {
                if (dayFinds.length > 0) {
                  setSelectedDate(dateStr);
                }
              }}
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "12px",
                fontSize: "12px",
                cursor: dayFinds.length > 0 ? "pointer" : "default",
                transition: "background 0.2s, transform 0.1s"
              }}
              onMouseEnter={(e) => {
                if (dayFinds.length > 0) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                  e.currentTarget.style.transform = "scale(1.01)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {/* Header with Date */}
              <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span>📅 {dateStr}</span>
                {dayFinds.length > 0 && (
                  <span style={{ color: "#facc15", fontWeight: "bold" }}>
                    🪙 {dayFinds.length} trouvaille{dayFinds.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Outings Details */}
              {dayTracks.length > 0 ? (
                <div style={{ opacity: 0.8, fontSize: "11px", display: "flex", flexDirection: "column", gap: "4px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "6px", marginTop: "6px" }}>
                  {dayTracks.map((t, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>🚶 {t.session_name || `Parcours ${i+1}`}</span>
                      <span>📏 <strong>{getDistanceOfTrack(t.positions).toFixed(2)}</strong> km</span>
                    </div>
                  ))}
                </div>
              ) : (
                dayFinds.length > 0 && (
                  <div style={{ opacity: 0.6, fontSize: "10px", fontStyle: "italic", marginTop: "4px" }}>
                    Pas de tracé GPS enregistré
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>

      <hr style={{ margin: "15px 0", border: "none", borderBottom: "1px solid rgba(255, 255, 255, 0.15)" }} />

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={exportData}
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white"
          }}
        >
          📤 Export
        </button>

        <button
          onClick={importData}
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white"
          }}
        >
          📥 Import
        </button>
      </div>
    </div>
  );
}