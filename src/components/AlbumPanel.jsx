import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { categoryEmojis } from "../subCategories";

const CATEGORIES = [
  "Tous",
  "Monnaie",
  "Bijou",
  "Boucle",
  "Bouton",
  "Médaille",
  "Munition",
  "Outil",
  "Plomb",
  "Religieux",
  "Autre"
];

export default function AlbumPanel({
  finds = [],
  allPhotos = [],
  onClose,
  onOpenFindDetails
}) {
  const [albumFilter, setAlbumFilter] = useState("Tous");
  const [albumSearch, setAlbumSearch] = useState("");
  const [albumSort, setAlbumSort] = useState("recent");
  const [selectedAlbumPhoto, setSelectedAlbumPhoto] = useState(null);
  const [lightboxCoinFlipped, setLightboxCoinFlipped] = useState(false);

  const albumFilteredFinds = useMemo(() => {
    // 1. Filter by category & check that photo exists with a valid URL
    let list = finds.filter((f) => {
      // Category match (case-insensitive)
      const catMatch = albumFilter === "Tous" || 
        (f.category && f.category.toLowerCase() === albumFilter.toLowerCase());
      if (!catMatch) return false;

      // Photo match
      const photoUrl = f.isOfflinePending
        ? f.offlinePhoto
        : allPhotos.find((p) => p.find_id === f.id)?.image_url;

      return !!photoUrl;
    });

    // 2. Filter by search term
    if (albumSearch.trim() !== "") {
      const q = albumSearch.toLowerCase();
      list = list.filter((f) => 
        (f.title && f.title.toLowerCase().includes(q)) ||
        (f.description && f.description.toLowerCase().includes(q)) ||
        (f.sub_category && f.sub_category.toLowerCase().includes(q))
      );
    }

    // 3. Sort
    list.sort((a, b) => {
      if (albumSort === "fav") {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;
      }
      
      const parseDate = (dStr) => {
        if (!dStr) return new Date(0);
        const clean = dStr.split(",")[0].split(" ")[0].trim();
        const parts = clean.split("/");
        if (parts.length === 3) {
          return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        return new Date(dStr);
      };
      
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);

      if (albumSort === "old") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    return list;
  }, [finds, allPhotos, albumFilter, albumSearch, albumSort]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: "calc(100% - 40px)",
          maxWidth: "430px",
          height: "calc(100vh - 40px)",
          background: "rgba(17, 24, 39, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "24px",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
          zIndex: 6000,
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          boxSizing: "border-box",
          fontFamily: "system-ui, sans-serif",
          color: "white"
        }}
      >
        <style>{`
          .album-grid-card {
            position: relative;
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            border-radius: 14px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.08);
            cursor: pointer;
            transform: translateZ(0);
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s, box-shadow 0.25s;
          }
          .album-grid-card:hover {
            transform: scale(1.04) translateY(-2px);
            border-color: rgba(37, 99, 235, 0.4);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          }
          .album-grid-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .album-grid-card:hover .album-grid-img {
            transform: scale(1.08);
          }
          .album-grid-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(10, 15, 30, 0.9) 0%, rgba(10, 15, 30, 0.4) 60%, transparent 100%);
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 2px;
            opacity: 0;
            transform: translateY(8px);
            transition: opacity 0.25s, transform 0.25s;
            pointer-events: none;
          }
          .album-grid-card:hover .album-grid-overlay {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800" }}>🖼️ Album de Collection</h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold"
            }}
          >
            ✕
          </button>
        </div>

        {/* Search & Sort Panel */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="🔍 Rechercher titre, époque..."
            value={albumSearch}
            onChange={(e) => setAlbumSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "rgba(255, 255, 255, 0.06)",
              color: "white",
              fontSize: "12px",
              outline: "none"
            }}
          />
          <select
            value={albumSort}
            onChange={(e) => setAlbumSort(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "rgba(255, 255, 255, 0.06)",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="recent" style={{ background: "#1f2937" }}>📅 Récentes</option>
            <option value="old" style={{ background: "#1f2937" }}>📅 Anciennes</option>
            <option value="fav" style={{ background: "#1f2937" }}>⭐ Favoris</option>
          </select>
        </div>

        {/* Album Filter */}
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "10px", marginBottom: "15px" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setAlbumFilter(cat)}
              style={{
                background: albumFilter === cat ? "#2563eb" : "rgba(255,255,255,0.1)",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                cursor: "pointer"
              }}
            >
              {cat === "Tous" ? "📁 Tous" : `${categoryEmojis[cat] || ""} ${cat}`}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", paddingRight: "6px" }}>
          {albumFilteredFinds.map((find) => {
            const photoUrl = (find.isOfflinePending
              ? find.offlinePhoto
              : allPhotos.find((p) => p.find_id === find.id)?.image_url) || "";

            return (
              <div
                key={find.id}
                className="album-grid-card"
                onClick={() => {
                  setSelectedAlbumPhoto({ find, photoUrl });
                }}
              >
                <img
                  src={photoUrl}
                  alt={find.title}
                  className="album-grid-img"
                />
                
                {/* Category Badge */}
                <div style={{ position: "absolute", top: "6px", left: "6px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "3px 5px", borderRadius: "6px", fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {categoryEmojis[find.category] || categoryEmojis[find.category?.trim().charAt(0).toUpperCase() + find.category?.trim().slice(1).toLowerCase()] || "📍"}
                </div>

                {/* Favorite Badge */}
                {find.favorite && (
                  <div style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "3px 5px", borderRadius: "6px", fontSize: "9px", color: "#facc15" }}>
                    ⭐
                  </div>
                )}

                {/* Hover Details Overlay */}
                <div className="album-grid-overlay">
                  <div style={{ fontSize: "10px", fontWeight: "800", color: "white", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    {find.title || "Sans titre"}
                  </div>
                  {find.date && (
                    <div style={{ fontSize: "8px", color: "#9ca3af" }}>
                      {find.date.split(",")[0]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULLSCREEN ALBUM PHOTO LIGHTBOX */}
      {selectedAlbumPhoto && createPortal(
        (() => {
          const currentIndex = albumFilteredFinds.findIndex((f) => f.id === selectedAlbumPhoto.find.id);
          const prevFind = currentIndex > 0 ? albumFilteredFinds[currentIndex - 1] : null;
          const nextFind = currentIndex < albumFilteredFinds.length - 1 ? albumFilteredFinds[currentIndex + 1] : null;

          const navigatePhoto = (targetFind) => {
            if (!targetFind) return;
            const photoUrl = targetFind.isOfflinePending
              ? targetFind.offlinePhoto
              : allPhotos.find((p) => p.find_id === targetFind.id)?.image_url;
            setSelectedAlbumPhoto({ find: targetFind, photoUrl });
            setLightboxCoinFlipped(false);
          };

          const isCoin = selectedAlbumPhoto.find.category === "Monnaie";
          let avers = null;
          let revers = null;
          if (isCoin) {
            const coinPhotos = allPhotos.filter((p) => p.find_id === selectedAlbumPhoto.find.id);
            avers = coinPhotos.find((p) => p.type === "avers") || coinPhotos[0];
            revers = coinPhotos.find((p) => p.type === "revers") || (coinPhotos.length > 1 ? coinPhotos.find((p) => p.id !== avers?.id) : null);
          }

          return (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0, 0, 0, 0.95)",
                zIndex: 99999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "system-ui, sans-serif"
              }}
              onClick={() => setSelectedAlbumPhoto(null)}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedAlbumPhoto(null)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: "44px",
                  height: "44px",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10
                }}
              >
                ✕
              </button>

              {/* Navigation Left Arrow */}
              {prevFind && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePhoto(prevFind);
                  }}
                  style={{
                    position: "absolute",
                    left: "20px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
                >
                  ‹
                </button>
              )}

              {/* Navigation Right Arrow */}
              {nextFind && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePhoto(nextFind);
                  }}
                  style={{
                    position: "absolute",
                    right: "20px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
                >
                  ›
                </button>
              )}

              {/* Content Panel (image or 3D coin) */}
              <div 
                style={{
                  width: "100%",
                  maxHeight: "70%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 80px",
                  boxSizing: "border-box"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {isCoin ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <style>{`
                      .coin-lightbox-3d {
                        perspective: 1000px;
                        width: 240px;
                        height: 240px;
                        cursor: pointer;
                        margin: 10px auto;
                      }
                      .coin-lightbox-inner {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                        transform-style: preserve-3d;
                      }
                      .coin-lightbox-3d.flipped .coin-lightbox-inner {
                        transform: rotateY(180deg);
                      }
                      .coin-lightbox-front, .coin-lightbox-back {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        -webkit-backface-visibility: hidden;
                        backface-visibility: hidden;
                        border-radius: 50%;
                        overflow: hidden;
                        border: 3px solid rgba(255, 255, 255, 0.25);
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
                      }
                      .coin-lightbox-back {
                        transform: rotateY(180deg);
                      }
                      .coin-lightbox-front img, .coin-lightbox-back img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                      }
                      .coin-lightbox-revers-placeholder {
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #1e293b, #0f172a);
                        display: flex;
                        flex-direction: column;
                        alignItems: center;
                        justifyContent: center;
                        color: #fbbf24;
                        font-size: 11px;
                        font-weight: bold;
                        text-transform: uppercase;
                        border-radius: 50%;
                        border: 3px dashed rgba(251, 191, 36, 0.4);
                        box-sizing: border-box;
                        padding: 15px;
                        text-align: center;
                      }
                    `}</style>
                    <div
                      className={`coin-lightbox-3d ${lightboxCoinFlipped ? "flipped" : ""}`}
                      onClick={() => setLightboxCoinFlipped(!lightboxCoinFlipped)}
                    >
                      <div className="coin-lightbox-inner">
                        <div className="coin-lightbox-front">
                          {avers ? (
                            <img src={avers.image_url} alt="Avers" />
                          ) : (
                            <div className="coin-lightbox-revers-placeholder">Avers</div>
                          )}
                        </div>
                        <div className="coin-lightbox-back">
                          {revers ? (
                            <img src={revers.image_url} alt="Revers" />
                          ) : (
                            <div className="coin-lightbox-revers-placeholder">
                              <span style={{ fontSize: "36px", marginBottom: "6px", display: "block" }}>🪙</span>
                              <span>Revers non</span>
                              <span>photographié</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: "12px", color: "#a1a1aa", marginTop: "5px" }}>
                      👆 Tapez sur la pièce pour la retourner (3D)
                    </span>
                  </div>
                ) : (
                  <img
                    src={selectedAlbumPhoto.photoUrl}
                    alt={selectedAlbumPhoto.find.title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "65vh",
                      objectFit: "contain",
                      borderRadius: "16px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.1)"
                    }}
                  />
                )}
              </div>

              {/* Details / Action Button */}
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  color: "white",
                  textAlign: "center",
                  width: "90%",
                  maxWidth: "400px"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                  {selectedAlbumPhoto.find.title || "Sans titre"}
                </h3>
                <p style={{ margin: 0, opacity: 0.8, fontSize: "14px" }}>
                  {categoryEmojis[selectedAlbumPhoto.find.category] || categoryEmojis[selectedAlbumPhoto.find.category?.trim().charAt(0).toUpperCase() + selectedAlbumPhoto.find.category?.trim().slice(1).toLowerCase()] || "📍"} {selectedAlbumPhoto.find.category}
                  {selectedAlbumPhoto.find.sub_category ? ` • ${selectedAlbumPhoto.find.sub_category}` : ""}
                  {selectedAlbumPhoto.find.date ? ` • 📅 ${selectedAlbumPhoto.find.date.split(",")[0]}` : ""}
                </p>

                <button
                  onClick={() => {
                    onOpenFindDetails(selectedAlbumPhoto.find);
                    setSelectedAlbumPhoto(null);
                  }}
                  style={{
                    border: "none",
                    borderRadius: "14px",
                    padding: "12px 24px",
                    background: "#2563eb",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)",
                    transition: "transform 0.15s, background-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  🔗 Voir la trouvaille sur la carte
                </button>
              </div>
            </div>
          );
        })(),
        document.body
      )}
    </>
  );
}
