export default function CategoryFilters({
  icons,
  filters,
  toggleFilter
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px"
      }}
    >
      {Object.keys(icons).map(
        (category) => (
          <button
            key={category}
            onClick={() =>
              toggleFilter(
                category
              )
            }
            style={{
              opacity:
                filters.includes(
                  category
                )
                  ? 1
                  : 0.3,

              padding:
                "8px 12px",

              borderRadius:
                "10px",

              border:
                "1px solid #333",

              background:
                "#1f1f1f",

              color: "white",

              cursor: "pointer"
            }}
          >
            {category}
          </button>
        )
      )}
    </div>
  );
}