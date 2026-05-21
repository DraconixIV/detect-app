import ModernButton from "./ModernButton";
import MapControls from "./MapControls";
import SearchBar from "./SearchBar";
import CategoryFilters from "./CategoryFilters";
import AddFindForm from "./AddFindForm";

export default function MainPanel({
  setShowForm,
  saveTrack,
  followGps,
  setFollowGps,
  mapStyle,
  setMapStyle,
  showHeatmap,
  setShowHeatmap,
  search,
  setSearch,
  icons,
  filters,
  toggleFilter,
  showForm,
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  newCategory,
  setNewCategory,
  addFind
}) {
  return (
    <div
      style={{
        position: "absolute",

        zIndex: 1000,

        top: 20,

        left: 20,

        display: "flex",

        flexDirection:
          "column",

        gap: "10px",

        background:
          "rgba(255,255,255,0.95)",

        padding: "12px",

        borderRadius:
          "12px",

        width: "320px",

        maxHeight: "90vh",

        overflowY: "auto"
      }}
    >
      <ModernButton
        onClick={() =>
          setShowForm(true)
        }
      >
        ➕ Ajouter une trouvaille
      </ModernButton>

      <ModernButton
        onClick={saveTrack}
      >
        💾 Sauvegarder sortie
      </ModernButton>

      <MapControls
        followGps={followGps}
        setFollowGps={
          setFollowGps
        }
        mapStyle={mapStyle}
        setMapStyle={
          setMapStyle
        }
        showHeatmap={
          showHeatmap
        }
        setShowHeatmap={
          setShowHeatmap
        }
      />

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <CategoryFilters
        icons={icons}
        filters={filters}
        toggleFilter={
          toggleFilter
        }
      />

      <AddFindForm
        showForm={showForm}
        newTitle={newTitle}
        setNewTitle={
          setNewTitle
        }
        newDescription={
          newDescription
        }
        setNewDescription={
          setNewDescription
        }
        newCategory={
          newCategory
        }
        setNewCategory={
          setNewCategory
        }
        icons={icons}
        addFind={addFind}
      />
    </div>
  );
}