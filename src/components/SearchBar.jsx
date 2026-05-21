export default function SearchBar({
  search,
  setSearch
}) {
  return (
    <input
      type="text"
      placeholder="Recherche..."
      value={search}
      onChange={(e) =>
        setSearch(
          e.target.value
        )
      }
      style={{
        background: "#181818",

        color: "white",

        border:
          "1px solid #333",

        borderRadius: "12px",

        padding: "12px",

        fontSize: "14px",

        outline: "none"
      }}
    />
  );
}