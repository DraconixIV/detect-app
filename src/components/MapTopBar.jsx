import React, { useState, useEffect, useMemo, useRef } from "react";
import { THEMES } from "../styles/themes";
import { loadCategoriesData } from "../services/categoriesService";

export default function MapTopBar({
  currentThemeKey = "tactical",
  themeMode = "dark",
  workspace = { mode: "personal" },
  gpsAccuracy,
  isOnline,
  isRecordingSortie,
  onToggleRecording,
  onOpenTeamSession,
  onToggleSearch,
  showSearch,
  search,
  setSearch,
  filters,
  toggleFilter,
  finds = [],
  onSelectFind,
  onSelectPlace,
  zenMode = false
}) {
  const [categoriesData, setCategoriesData] = useState(() => loadCategoriesData());
  const [places, setPlaces] = useState([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleUpdate = () => setCategoriesData(loadCategoriesData());
    window.addEventListener("categories-updated", handleUpdate);
    return () => window.removeEventListener("categories-updated", handleUpdate);
  }, []);

  // Auto-focus input when search opens
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [showSearch]);

  // Geocoding place search (OpenStreetMap Nominatim)
  useEffect(() => {
    if (!search || search.trim().length < 3) {
      setPlaces([]);
      setIsSearchingPlaces(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setIsSearchingPlaces(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search.trim())}&limit=4&addressdetails=1`,
          {
            signal: controller.signal,
            headers: {
              "Accept-Language": "fr,en"
            }
          }
        );
        if (res.ok) {
          const data = await res.json();
          setPlaces(data || []);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          // non-blocking
        }
      } finally {
        setIsSearchingPlaces(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  // Matching finds filter
  const matchingFinds = useMemo(() => {
    if (!search || !search.trim()) return [];
    const q = search.trim().toLowerCase();
    return (finds || []).filter((f) => {
      const title = (f.title || "").toLowerCase();
      const desc = (f.description || "").toLowerCase();
      const cat = (f.category || "").toLowerCase();
      const subCat = (f.sub_category || "").toLowerCase();
      const date = (f.date || "").toLowerCase();
      return title.includes(q) || desc.includes(q) || cat.includes(q) || subCat.includes(q) || date.includes(q);
    }).slice(0, 8);
  }, [finds, search]);

  const isLight = themeMode === "light";
  const theme = THEMES[currentThemeKey] || THEMES.tactical;

  const bgBar = isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(11, 19, 41, 0.88)";
  const bgCard = isLight ? "#ffffff" : "rgba(11, 19, 41, 0.96)";
  const textMain = isLight ? "#000000" : "#ffffff";
  const textSub = isLight ? "#1e293b" : "#94a3b8";
  const borderCol = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.12)";
  const inputBg = isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.08)";

  const getGpsStatusColor = () => {
    if (gpsAccuracy === null) return "#9ca3af";
    if (gpsAccuracy < 5) return "#10b981";
    if (gpsAccuracy < 15) return "#f59e0b";
    return "#ef4444";
  };

  const handleSelectFindItem = (find) => {
    if (onSelectFind) {
      onSelectFind(find);
    }
    searchInputRef.current?.blur();
  };

  const handleSelectPlaceItem = (place) => {
    if (onSelectPlace) {
      onSelectPlace(place);
    }
    searchInputRef.current?.blur();
  };

  if (zenMode) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5000,
        padding: "env(safe-area-inset-top, 8px) 12px 8px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        pointerEvents: "none",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        userSelect: "none"
      }}
    >
      {/* Top Glassmorphism Navigation Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          background: bgBar,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${borderCol}`,
          borderRadius: "16px",
          padding: "6px 10px",
          boxShadow: isLight ? "0 4px 20px rgba(0,0,0,0.08)" : "0 8px 32px rgba(0, 0, 0, 0.45)",
          pointerEvents: "auto"
        }}
      >
        {/* LEFT: Branding with Official Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              background: "#ebe3d3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              border: "1.5px solid rgba(245, 158, 11, 0.4)"
            }}
          >
            <img
              src="/icon-192.png"
              alt="GeoProspect Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "900",
                letterSpacing: "-0.3px",
                color: textMain,
                display: "flex",
                alignItems: "center",
                gap: "2px"
              }}
            >
              <span>Geo</span>
              <span style={{ color: "#38bdf8" }}>Prospect</span>
            </span>
            <span
              style={{
                fontSize: "9px",
                fontWeight: "700",
                color: isOnline ? "#34d399" : "#fbbf24",
                letterSpacing: "0.2px"
              }}
            >
              {isOnline ? "● Connecté" : "○ Hors-ligne"}
            </span>
          </div>
        </div>

        {/* CENTER: GPS Precision / Session Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255, 255, 255, 0.06)",
            border: `1px solid ${workspace.mode === "session" ? "#10b981" : borderCol}`,
            padding: "3px 8px",
            borderRadius: "999px"
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: workspace.mode === "session" ? "#10b981" : getGpsStatusColor(),
              boxShadow: `0 0 6px ${workspace.mode === "session" ? "#10b981" : getGpsStatusColor()}`
            }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: "800",
              color: textMain,
              fontFamily: "monospace"
            }}
          >
            {workspace.mode === "session"
              ? "ÉQUIPE"
              : gpsAccuracy !== null
              ? `±${Math.round(gpsAccuracy)}m`
              : "--"}
          </span>
        </div>

        {/* RIGHT: Actions (Search, Team, Sortie) */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* Search Toggle Button */}
          <button
            type="button"
            onClick={onToggleSearch}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              border: `1px solid ${showSearch ? "#38bdf8" : borderCol}`,
              background: showSearch ? "rgba(56, 189, 248, 0.2)" : (isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.08)"),
              color: showSearch ? "#38bdf8" : textMain,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease"
            }}
            title={showSearch ? "Fermer la recherche" : "Rechercher une trouvaille"}
          >
            🔍
          </button>

          {/* Team Session Button */}
          {onOpenTeamSession && (
            <button
              type="button"
              onClick={onOpenTeamSession}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                border: `1px solid ${workspace.mode === "session" ? "#10b981" : borderCol}`,
                background: workspace.mode === "session" ? "rgba(16, 185, 129, 0.2)" : (isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.08)"),
                color: workspace.mode === "session" ? "#34d399" : textMain,
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease"
              }}
              title={workspace.mode === "session" ? "Session d'équipe en direct" : "Session d'équipe"}
            >
              👥
            </button>
          )}

          {/* Sortie REC / START Button */}
          <button
            type="button"
            onClick={onToggleRecording}
            style={{
              padding: "5px 9px",
              borderRadius: "10px",
              border: `1px solid ${isRecordingSortie ? "#ef4444" : borderCol}`,
              background: isRecordingSortie ? "rgba(239, 68, 68, 0.2)" : (isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.08)"),
              color: isRecordingSortie ? "#ef4444" : textMain,
              fontSize: "10px",
              fontWeight: "800",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.15s ease"
            }}
            title={isRecordingSortie ? "Arrêter la sortie" : "Démarrer une sortie"}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: isRecordingSortie ? "#ef4444" : textSub,
                boxShadow: isRecordingSortie ? "0 0 8px #ef4444" : "none",
                animation: isRecordingSortie ? "pulse 1.2s infinite" : "none"
              }}
            />
            <span>{isRecordingSortie ? "REC" : "SORTIE"}</span>
          </button>
        </div>
      </div>

      {/* Expandable Search & Filter Bar */}
      {showSearch && (
        <div
          style={{
            background: bgCard,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${borderCol}`,
            borderRadius: "16px",
            padding: "10px 12px",
            boxShadow: isLight ? "0 8px 30px rgba(0, 0, 0, 0.1)" : "0 12px 36px rgba(0, 0, 0, 0.6)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            pointerEvents: "auto",
            maxHeight: "70vh",
            overflow: "hidden",
            animation: "fadeIn 0.2s ease"
          }}
        >
          {/* Search Input Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px" }}>🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher une trouvaille, lieu, ville..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "10px",
                border: `1px solid ${borderCol}`,
                background: inputBg,
                color: textMain,
                fontSize: "13px",
                outline: "none"
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: `1px solid ${borderCol}`,
                  background: isLight ? "#e2e8f0" : "rgba(255,255,255,0.1)",
                  color: textMain,
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Category Chips */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              paddingBottom: "2px",
              scrollbarWidth: "none"
            }}
          >
            {Object.keys(categoriesData.categories || {}).map((cat) => {
              const active = filters.includes(cat);
              const emoji = categoriesData.emojis?.[cat] || "🏷️";
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleFilter(cat)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: `1px solid ${active ? "#38bdf8" : borderCol}`,
                    background: active ? (isLight ? "#eff6ff" : "rgba(56, 189, 248, 0.2)") : inputBg,
                    color: active ? (isLight ? "#0369a1" : "#38bdf8") : textSub,
                    fontSize: "11px",
                    fontWeight: active ? "700" : "500",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {emoji} {cat}
                </button>
              );
            })}
          </div>

          {/* Live Search Results Dropdown List */}
          {search && search.trim().length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                maxHeight: "45vh",
                overflowY: "auto",
                borderTop: `1px solid ${borderCol}`,
                paddingTop: "8px"
              }}
            >
              {/* SECTION: Matching Finds */}
              {matchingFinds.length > 0 && (
                <div>
                  <div style={{ fontSize: "10px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                    🪙 Trouvailles ({matchingFinds.length}) :
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {matchingFinds.map((f) => {
                      const em = categoriesData.emojis?.[f.category] || "🪙";
                      return (
                        <div
                          key={f.id}
                          onClick={() => handleSelectFindItem(f)}
                          style={{
                            padding: "8px 10px",
                            borderRadius: "10px",
                            background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.05)",
                            border: `1px solid ${borderCol}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "8px",
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = isLight ? "#eff6ff" : "rgba(56, 189, 248, 0.15)";
                            e.currentTarget.style.borderColor = "#38bdf8";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.05)";
                            e.currentTarget.style.borderColor = borderCol;
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                            <span style={{ fontSize: "18px", flexShrink: 0 }}>{em}</span>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: "12px", fontWeight: "800", color: textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {f.title || "Trouvaille sans titre"}
                              </div>
                              <div style={{ fontSize: "10px", color: textSub }}>
                                {f.category || "Indéterminé"} {f.sub_category ? `• ${f.sub_category}` : ""} {f.description ? `• ${f.description}` : ""}
                              </div>
                            </div>
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "#38bdf8", flexShrink: 0 }}>
                            Voir ➔
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION: Geocoding Places */}
              {places.length > 0 && (
                <div style={{ marginTop: matchingFinds.length > 0 ? "6px" : "0" }}>
                  <div style={{ fontSize: "10px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                    📍 Lieux et Villes ({places.length}) :
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {places.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectPlaceItem(p)}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "10px",
                          background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.05)",
                          border: `1px solid ${borderCol}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isLight ? "#eff6ff" : "rgba(56, 189, 248, 0.15)";
                          e.currentTarget.style.borderColor = "#38bdf8";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.05)";
                          e.currentTarget.style.borderColor = borderCol;
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                          <span style={{ fontSize: "16px", flexShrink: 0 }}>📍</span>
                          <div style={{ fontSize: "12px", fontWeight: "600", color: textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {p.display_name}
                          </div>
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#38bdf8", flexShrink: 0 }}>
                          Aller ➔
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Searching indicator */}
              {isSearchingPlaces && (
                <div style={{ fontSize: "11px", color: textSub, padding: "4px 8px", fontStyle: "italic" }}>
                  ⏳ Recherche géographique en cours...
                </div>
              )}

              {/* No results */}
              {matchingFinds.length === 0 && places.length === 0 && !isSearchingPlaces && (
                <div
                  style={{
                    padding: "16px 12px",
                    borderRadius: "10px",
                    background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.03)",
                    textAlign: "center",
                    color: textSub,
                    fontSize: "12px"
                  }}
                >
                  🔍 Aucune trouvaille ni lieu trouvé pour "{search}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
