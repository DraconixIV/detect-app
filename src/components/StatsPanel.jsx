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

<h3>🏆 Catégories</h3>

{Object.entries(
  finds.reduce(
    (acc, find) => {
      acc[find.category] =
        (acc[find.category] || 0) + 1;

      return acc;
    },
    {}
  )
)
  .sort((a, b) => b[1] - a[1])
  .map(([category, count]) => (
    <p key={category}>
      {category} : {count}
    </p>
  ))}

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