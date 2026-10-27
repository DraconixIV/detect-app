import React, { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { loadCategoriesData } from "../services/categoriesService";
import { getFlipCoins, getFlipCoin, saveFlipCoin, removeFlipCoin } from "../services/flipCoinService";
import FlipCoinModal from "./FlipCoinModal";

function LazyImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={!loaded ? "album-grid-card-loading" : ""}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="album-grid-img"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out"
        }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function ZoomableImage({ src, alt, onReset }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const lastTouchDistRef = useRef(null);

  // Reset zoom when image source changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  const handleZoomIn = (e) => {
    e?.stopPropagation();
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = (e) => {
    e?.stopPropagation();
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleReset = (e) => {
    e?.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
    if (onReset) onReset();
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  };

  const handleWheel = (e) => {
    e.stopPropagation();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + 0.25, 4));
    } else {
      setScale((prev) => {
        const next = Math.max(prev - 0.25, 1);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    e.stopPropagation();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pinch & pan handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistRef.current = dist;
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastTouchDistRef.current) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist - lastTouchDistRef.current;
      setScale((prev) => Math.min(Math.max(prev + delta * 0.01, 1), 4));
      lastTouchDistRef.current = dist;
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchDistRef.current = null;
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        maxHeight: "65vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        touchAction: scale > 1 ? "none" : "auto"
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          maxWidth: "100%",
          maxHeight: "60vh",
          objectFit: "contain",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
          userSelect: "none",
          WebkitUserSelect: "none"
        }}
      />

      {/* Floating Zoom Controls Toolbar */}
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          padding: "4px 10px",
          borderRadius: "999px",
          zIndex: 20,
          boxShadow: "0 4px 14px rgba(0,0,0,0.5)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={scale <= 1}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            color: scale <= 1 ? "rgba(255,255,255,0.3)" : "#ffffff",
            fontSize: "14px",
            fontWeight: "400",
            cursor: scale <= 1 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          title="Zoom arrière (-)"
        >
          −
        </button>

        <span style={{ fontSize: "11px", fontWeight: "400", color: "#ffffff", minWidth: "42px", textAlign: "center" }}>
          {Math.round(scale * 100)}%
        </span>

        <button
          type="button"
          onClick={handleZoomIn}
          disabled={scale >= 4}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            color: scale >= 4 ? "rgba(255,255,255,0.3)" : "#ffffff",
            fontSize: "14px",
            fontWeight: "400",
            cursor: scale >= 4 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          title="Zoom avant (+)"
        >
          +
        </button>

        {scale > 1 && (
          <button
            type="button"
            onClick={handleReset}
            style={{
              background: "rgba(59, 130, 246, 0.35)",
              border: "1px solid rgba(59, 130, 246, 0.5)",
              borderRadius: "10px",
              padding: "2px 8px",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: "400",
              cursor: "pointer",
              marginLeft: "4px"
            }}
            title="Réinitialiser zoom"
          >
            ↺ 1x
          </button>
        )}
      </div>
    </div>
  );
}

export default function AlbumPanel({
  finds = [],
  allPhotos = [],
  loadPhotosForAlbum,
  onClose,
  onOpenFindDetails,
  isTab = false,
  theme = "dark",
  onOpenCategoryManager
}) {
  const [categoriesData, setCategoriesData] = useState(() => loadCategoriesData());
  const [flipCoins, setFlipCoins] = useState(() => getFlipCoins());
  const [editingFlipCoinFind, setEditingFlipCoinFind] = useState(null);
  const [forcePhotoView, setForcePhotoView] = useState(false);

  useEffect(() => {
    if (loadPhotosForAlbum) {
      loadPhotosForAlbum();
    }
  }, [loadPhotosForAlbum]);

  useEffect(() => {
    const handleCategoriesUpdate = () => {
      setCategoriesData(loadCategoriesData());
    };
    const handleFlipCoinsUpdate = () => {
      setFlipCoins(getFlipCoins());
    };
    window.addEventListener("categories-updated", handleCategoriesUpdate);
    window.addEventListener("flipcoins-updated", handleFlipCoinsUpdate);
    return () => {
      window.removeEventListener("categories-updated", handleCategoriesUpdate);
      window.removeEventListener("flipcoins-updated", handleFlipCoinsUpdate);
    };
  }, []);

  const categoryEmojis = categoriesData.emojis || {};
  const categoriesList = useMemo(() => ["Tous", ...Object.keys(categoriesData.categories || {})], [categoriesData]);

  const [albumFilter, setAlbumFilter] = useState("Tous");
  const [albumSearch, setAlbumSearch] = useState("");
  const [albumSort, setAlbumSort] = useState("recent");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedAlbumPhoto, setSelectedAlbumPhoto] = useState(null);
  const [lightboxCoinFlipped, setLightboxCoinFlipped] = useState(false);

  const isLight = theme === "light";
  const bgPage = isLight ? "#f3f4f2" : "#111915";
  const sheetBg = isLight ? "#ffffff" : "#19231e";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";
  const dividerCol = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.08)";
  const accentForest = "#2c5e4c";
  const accentMint = "#40916c";

  const getFindPhotoUrl = (f) => {
    if (!f) return null;
    if (f.isOfflinePending && f.offlinePhoto) return f.offlinePhoto;
    if (f.offlinePhoto) return f.offlinePhoto;
    if (f.image_url) return f.image_url;
    if (f.photo_url) return f.photo_url;
    if (f.photo && typeof f.photo === "string") return f.photo;
    const match = allPhotos.find(
      (p) => (String(p.find_id) === String(f.id) || p.find_id === f.id) && p.type !== "thumbnail"
    ) || allPhotos.find(
      (p) => String(p.find_id) === String(f.id) || p.find_id === f.id
    );
    if (match?.image_url) return match.image_url;
    if (f.thumbnail_url) return f.thumbnail_url;
    return null;
  };

  const getFindThumbUrl = (f) => {
    if (!f) return null;
    if (f.isOfflinePending && f.offlinePhoto) return f.offlinePhoto;
    if (f.offlinePhoto) return f.offlinePhoto;
    if (f.thumbnail_url) return f.thumbnail_url;
    const thumbMatch = allPhotos.find(
      (p) => (String(p.find_id) === String(f.id) || p.find_id === f.id) && p.type === "thumbnail"
    );
    if (thumbMatch?.image_url) return thumbMatch.image_url;
    return getFindPhotoUrl(f);
  };

  const albumFilteredFinds = useMemo(() => {
    // 1. Filter by category & check that photo exists with a valid URL
    let list = finds.filter((f) => {
      // Category match (case-insensitive)
      const catMatch = albumFilter === "Tous" || 
        (f.category && f.category.toLowerCase() === albumFilter.toLowerCase());
      if (!catMatch) return false;

      // Photo match
      const photoUrl = getFindPhotoUrl(f);
      if (!photoUrl) return false;

      // Favorites filter when "fav" is selected
      if (albumSort === "fav" && !f.favorite) return false;

      return true;
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
          position: isTab ? "fixed" : "absolute",
          top: isTab ? 0 : 20,
          right: isTab ? 0 : 20,
          bottom: isTab ? "60px" : "auto",
          left: isTab ? 0 : "auto",
          width: isTab ? "100%" : "calc(100% - 40px)",
          maxWidth: isTab ? "100%" : "430px",
          height: isTab ? "calc(100vh - 60px)" : "calc(100vh - 40px)",
          background: bgPage,
          borderRadius: isTab ? 0 : "20px",
          boxShadow: isTab ? "none" : "0 12px 40px rgba(0, 0, 0, 0.5)",
          zIndex: 6000,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: textMain
        }}
      >
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.25; }
          }
          .album-grid-card-loading {
            background: rgba(255, 255, 255, 0.05);
            animation: pulse 1.5s infinite ease-in-out;
          }
          .album-grid-card {
            position: relative;
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transform: translateZ(0);
            transition: transform 0.2s ease;
          }
          .album-grid-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .album-grid-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(13, 31, 24, 0.9) 0%, transparent 100%);
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 2px;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
          }
          .album-grid-card:hover .album-grid-overlay {
            opacity: 1;
          }
        `}</style>

        {/* Forest-Style Solid Top Header Bar */}
        <div
          style={{
            background: accentForest,
            color: "#ffffff",
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
          }}
        >
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>
            {albumFilteredFinds.length} objet{albumFilteredFinds.length > 1 ? "s" : ""}
          </span>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "400", color: "#ffffff", letterSpacing: "0.2px" }}>
            Galerie
          </h2>
          <div style={{ minWidth: "50px", display: "flex", justifyContent: "flex-end" }}>
            {!isTab && onClose && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Main Content Container */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            maxWidth: "640px",
            width: "100%",
            margin: "0 auto",
            padding: "14px 12px 16px 12px",
            boxSizing: "border-box",
            overflow: "hidden"
          }}
        >
          {/* Search & Sort Panel */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", position: "relative" }}>
            <input
              type="text"
              placeholder="Rechercher un objet, métal, lieu..."
              value={albumSearch}
              onChange={(e) => setAlbumSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "12px",
                border: `1px solid ${dividerCol}`,
                background: sheetBg,
                color: textMain,
                fontSize: "13px",
                outline: "none"
              }}
            />
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowSortDropdown((prev) => !prev)}
                style={{
                  height: "100%",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: `1px solid ${dividerCol}`,
                  background: sheetBg,
                  color: textMain,
                  fontSize: "13px",
                  fontWeight: "400",
                  outline: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  whiteSpace: "nowrap"
                }}
              >
                <span>
                  {albumSort === "recent" ? "Récentes" : albumSort === "old" ? "Anciennes" : "Favoris"}
                </span>
                <span style={{ fontSize: "10px", opacity: 0.7 }}>{showSortDropdown ? "▴" : "▾"}</span>
              </button>

              {showSortDropdown && (
                <>
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 7000 }}
                    onClick={() => setShowSortDropdown(false)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      right: 0,
                      minWidth: "150px",
                      background: sheetBg,
                      border: `1px solid ${dividerCol}`,
                      borderRadius: "14px",
                      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.45)",
                      padding: "6px",
                      zIndex: 7001,
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px"
                    }}
                  >
                    {[
                      { id: "recent", label: "Récentes" },
                      { id: "old", label: "Anciennes" },
                      { id: "fav", label: "Favoris" }
                    ].map((opt) => {
                      const isSelected = albumSort === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setAlbumSort(opt.id);
                            setShowSortDropdown(false);
                          }}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "10px",
                            border: "none",
                            background: isSelected ? accentForest : "transparent",
                            color: isSelected ? "#ffffff" : textMain,
                            fontSize: "13px",
                            fontWeight: "400",
                            textAlign: "left",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "8px"
                          }}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <span style={{ fontSize: "11px" }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Category Filters Carousel */}
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "10px", marginBottom: "8px", scrollbarWidth: "none" }}>
            {categoriesList.map((cat) => {
              const isSel = albumFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setAlbumFilter(cat)}
                  style={{
                    background: isSel ? accentForest : sheetBg,
                    color: isSel ? "#ffffff" : textSub,
                    border: isSel ? "none" : `1px solid ${dividerCol}`,
                    padding: "6px 14px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "400",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Grid or Empty State */}
          {albumFilteredFinds.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "20px",
                color: textSub
              }}
            >
              <div style={{ fontSize: "15px", color: textMain, marginBottom: "6px" }}>
                Aucun objet photographié
              </div>
              <div style={{ fontSize: "12.5px", color: textSub }}>
                Les trouvailles accompagnées d'une photo apparaîtront ici.
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", paddingRight: "2px" }}>
              {albumFilteredFinds.map((find) => {
                const photoUrl = getFindPhotoUrl(find) || "";
                const thumbUrl = getFindThumbUrl(find) || photoUrl;
                const hasFlipCoin = !!getFlipCoin(find.id);

                return (
                  <div
                    key={find.id}
                    className="album-grid-card"
                    onClick={() => {
                      setSelectedAlbumPhoto({ find, photoUrl });
                      setLightboxCoinFlipped(false);
                      setForcePhotoView(false);
                    }}
                  >
                    <LazyImage src={thumbUrl} alt={find.title} />

                    {/* 3D Coin Badge if configured */}
                    {hasFlipCoin && (
                      <div style={{ position: "absolute", bottom: "6px", right: "6px", background: "rgba(13, 31, 24, 0.8)", padding: "2px 6px", borderRadius: "6px", fontSize: "9px", color: "#ffffff" }}>
                        3D
                      </div>
                    )}

                    {/* Subtle Favorite Indicator */}
                    {find.favorite && (
                      <div style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(13, 31, 24, 0.7)", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#e9edc9", fontSize: "10px" }}>
                        ★
                      </div>
                    )}

                    {/* Hover Details Overlay */}
                    <div className="album-grid-overlay">
                      <div style={{ fontSize: "10.5px", color: "#ffffff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {find.title || "Sans titre"}
                      </div>
                      {find.date && (
                        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.75)" }}>
                          {find.date.split(",")[0]}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN ALBUM PHOTO LIGHTBOX WITH ZOOM & MANUAL FLIP COIN */}
      {selectedAlbumPhoto && createPortal(
        (() => {
          const currentIndex = albumFilteredFinds.findIndex((f) => f.id === selectedAlbumPhoto.find.id);
          const prevFind = currentIndex > 0 ? albumFilteredFinds[currentIndex - 1] : null;
          const nextFind = currentIndex < albumFilteredFinds.length - 1 ? albumFilteredFinds[currentIndex + 1] : null;

          const navigatePhoto = (targetFind) => {
            if (!targetFind) return;
            const photoUrl = getFindPhotoUrl(targetFind) || "";
            setSelectedAlbumPhoto({ find: targetFind, photoUrl });
            setLightboxCoinFlipped(false);
            setForcePhotoView(false);
          };

          const configuredFlipCoin = getFlipCoin(selectedAlbumPhoto.find.id);
          const show3DCoin = !!configuredFlipCoin && !forcePhotoView;

          return (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "#070a12",
                zIndex: 999999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 16px 24px 16px",
                boxSizing: "border-box",
                fontFamily: "system-ui, sans-serif"
              }}
              onClick={() => setSelectedAlbumPhoto(null)}
            >
              {/* Top Navigation & Close Bar */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  zIndex: 10
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {configuredFlipCoin && (
                    <button
                      type="button"
                      onClick={() => setForcePhotoView(!forcePhotoView)}
                      style={{
                        background: forcePhotoView ? "rgba(245, 158, 11, 0.25)" : "rgba(59, 130, 246, 0.25)",
                        border: `1px solid ${forcePhotoView ? "#facc15" : "#3b82f6"}`,
                        borderRadius: "12px",
                        padding: "6px 12px",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: "400",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <span>{forcePhotoView ? "🪙 Voir Flip Coin 3D" : "🔍 Voir Photo et Zoom"}</span>
                    </button>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedAlbumPhoto(null)}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    color: "white",
                    fontSize: "18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title="Fermer (Échap)"
                >
                  ✕
                </button>
              </div>

              {/* Navigation Left Arrow */}
              {prevFind && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePhoto(prevFind);
                  }}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "45%",
                    transform: "translateY(-50%)",
                    background: "rgba(255, 255, 255, 0.18)",
                    backdropFilter: "blur(8px)",
                    border: "none",
                    borderRadius: "50%",
                    width: "46px",
                    height: "46px",
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    zIndex: 25
                  }}
                  title="Photo précédente"
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
                    right: "14px",
                    top: "45%",
                    transform: "translateY(-50%)",
                    background: "rgba(255, 255, 255, 0.18)",
                    backdropFilter: "blur(8px)",
                    border: "none",
                    borderRadius: "50%",
                    width: "46px",
                    height: "46px",
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    zIndex: 25
                  }}
                  title="Photo suivante"
                >
                  ›
                </button>
              )}

              {/* Content Panel (3D Flip Coin or Interactive Zoomable Image) */}
              <div 
                style={{
                  width: "100%",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxSizing: "border-box"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {show3DCoin ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <style>{`
                      .coin-lightbox-3d {
                        perspective: 1200px;
                        width: 260px;
                        height: 260px;
                        cursor: pointer;
                        margin: 10px auto;
                      }
                      .coin-lightbox-inner {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
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
                        border: 3.5px solid #facc15;
                        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.75);
                      }
                      .coin-lightbox-back {
                        transform: rotateY(180deg);
                      }
                      .coin-lightbox-front img, .coin-lightbox-back img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                      }
                    `}</style>
                    <div
                      className={`coin-lightbox-3d ${lightboxCoinFlipped ? "flipped" : ""}`}
                      onClick={() => setLightboxCoinFlipped(!lightboxCoinFlipped)}
                    >
                      <div className="coin-lightbox-inner">
                        <div className="coin-lightbox-front">
                          <img src={configuredFlipCoin.aversUrl} alt="Avers" />
                        </div>
                        <div className="coin-lightbox-back">
                          <img src={configuredFlipCoin.reversUrl} alt="Revers" />
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: "12px", color: "#ffffff", fontWeight: "400", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span>👆</span>
                      <span>Tapez sur la pièce pour voir l'autre face ({lightboxCoinFlipped ? "Revers" : "Avers"})</span>
                    </div>
                  </div>
                ) : (
                  <ZoomableImage
                    src={selectedAlbumPhoto.photoUrl}
                    alt={selectedAlbumPhoto.find.title}
                  />
                )}
              </div>

              {/* Details & Action Buttons Panel */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  color: "#ffffff",
                  textAlign: "center",
                  zIndex: 10
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "400", color: "#ffffff" }}>
                  {selectedAlbumPhoto.find.title || "Sans titre"}
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#ffffff", opacity: 0.85 }}>
                  {selectedAlbumPhoto.find.category}
                  {selectedAlbumPhoto.find.sub_category ? ` • ${selectedAlbumPhoto.find.sub_category}` : ""}
                  {selectedAlbumPhoto.find.date ? ` • ${selectedAlbumPhoto.find.date.split(",")[0]}` : ""}
                  {selectedAlbumPhoto.find.finder_name ? ` • ${selectedAlbumPhoto.find.finder_name}` : ""}
                </p>

                {/* Primary Button: Voir sur la carte */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenFindDetails(selectedAlbumPhoto.find);
                    setSelectedAlbumPhoto(null);
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: "14px",
                    padding: "12px 20px",
                    background: "#2c5e4c",
                    color: "#ffffff",
                    fontWeight: "400",
                    fontSize: "13.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <span>Voir la trouvaille sur la carte</span>
                </button>

                {/* Secondary Button: Ajouter un Flip Coin / Modifier le Flip Coin */}
                <button
                  type="button"
                  onClick={() => setEditingFlipCoinFind(selectedAlbumPhoto.find)}
                  style={{
                    width: "100%",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "14px",
                    padding: "11px 16px",
                    background: "rgba(255, 255, 255, 0.08)",
                    color: "#ffffff",
                    fontWeight: "400",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <span>{configuredFlipCoin ? "Modifier la vue 3D" : "Ajouter une vue 3D (Avers / Revers)"}</span>
                </button>
              </div>
            </div>
          );
        })(),
        document.body
      )}

      {/* FLIP COIN CREATOR / EDITOR MODAL */}
      {editingFlipCoinFind && (
        <FlipCoinModal
          isOpen={!!editingFlipCoinFind}
          onClose={() => setEditingFlipCoinFind(null)}
          find={editingFlipCoinFind}
          existingPhotos={allPhotos.filter((p) => String(p.find_id) === String(editingFlipCoinFind.id) || p.find_id === editingFlipCoinFind.id)}
          currentFlipCoin={getFlipCoin(editingFlipCoinFind.id)}
          onSaveFlipCoin={(findId, aversUrl, reversUrl) => {
            saveFlipCoin(findId, aversUrl, reversUrl);
            setLightboxCoinFlipped(false);
            setForcePhotoView(false);
          }}
          onDeleteFlipCoin={(findId) => {
            removeFlipCoin(findId);
          }}
          theme={theme}
        />
      )}
    </>
  );
}
