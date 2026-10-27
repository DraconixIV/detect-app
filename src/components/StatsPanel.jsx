import React, { useState } from "react";
import { categoriesWithSub as defaultCategoriesWithSub, defaultCategoryColors, PRESET_CATEGORY_COLORS } from "../subCategories";
import { loadCategoriesData } from "../services/categoriesService";
import { normalizeDateStr } from "../services/findsService";
import ConfirmModal from "./ConfirmModal";

function getDistance(p1, p2) {
  if (!p1 || !p2 || !Array.isArray(p1) || !Array.isArray(p2)) return 0;
  const R = 6371e3;
  const phi1 = (p1[0] * Math.PI) / 180;
  const phi2 = (p2[0] * Math.PI) / 180;
  const deltaPhi = ((p2[0] - p1[0]) * Math.PI) / 180;
  const deltaLambda = ((p2[1] - p1[1]) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function getDistanceOfTrack(positions) {
  if (!positions || !Array.isArray(positions) || positions.length < 2) return 0;
  let dist = 0;
  for (let i = 0; i < positions.length - 1; i++) {
    if (positions[i] && positions[i + 1]) {
      dist += getDistance(positions[i], positions[i + 1]);
    }
  }
  return dist / 1000;
}

export default function StatsPanel({
  finds = [],
  savedTracks = [],
  exportData,
  importData,
  groupedDates = {},
  setSelectedDate,
  onClose,
  isFullTab = false,
  theme = "dark",
  onOpenCategoryManager,
  onDeleteTrack,
  onDeleteFind
}) {
  const { categories: customCategories, colors: categoryColors = {} } = loadCategoriesData();
  const [chartType, setChartType] = useState("donut"); // 'donut' | 'bar' | 'radar'
  const [expandedCats, setExpandedCats] = useState({});
  const [confirmTrackToDelete, setConfirmTrackToDelete] = useState(null);
  const [confirmSortieToDelete, setConfirmSortieToDelete] = useState(null);

  const isLight = theme === "light";
  const bgPanel = isFullTab ? "transparent" : (isLight ? "#ffffff" : "#111915");
  const sheetBg = isLight ? "#ffffff" : "#19231e";
  const textMain = isLight ? "#1f2924" : "#f1f5f2";
  const textSub = isLight ? "#5c6b63" : "#9aa8a0";
  const dividerCol = isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.07)";
  const accentForest = "#2c5e4c";
  const accentMint = "#40916c";

  const sheetStyle = {
    background: sheetBg,
    borderRadius: "16px",
    padding: "18px",
    marginBottom: "14px",
    boxShadow: isLight ? "0 2px 10px rgba(0, 0, 0, 0.03)" : "0 4px 16px rgba(0, 0, 0, 0.25)"
  };

  // Group finds by clean normalized date
  const findsByDate = (finds || []).reduce((acc, find) => {
    if (!find) return acc;
    const raw = find.date || find.customDate || find.created_at;
    const datePart = raw ? normalizeDateStr(raw) : "Date non spécifiée";
    const cleanDate = datePart || "Date non spécifiée";
    if (!acc[cleanDate]) acc[cleanDate] = [];
    acc[cleanDate].push(find);
    return acc;
  }, {});

  // Group tracks by clean normalized date
  const tracksByDate = (savedTracks || []).reduce((acc, track) => {
    if (!track) return acc;
    const raw = track.created_at || track.date;
    const dateStr = raw ? normalizeDateStr(raw) : "Date non spécifiée";
    const cleanDate = dateStr || "Date non spécifiée";
    if (!acc[cleanDate]) acc[cleanDate] = [];
    acc[cleanDate].push(track);
    return acc;
  }, {});

  const allDates = Array.from(
    new Set([...Object.keys(findsByDate), ...Object.keys(tracksByDate)])
  ).sort((a, b) => {
    if (a === "Date non spécifiée") return 1;
    if (b === "Date non spécifiée") return -1;
    const parseDate = (dStr) => {
      try {
        const parts = String(dStr).split("/");
        if (parts.length === 3) {
          return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])).getTime() || 0;
        }
        return new Date(dStr).getTime() || 0;
      } catch {
        return 0;
      }
    };
    return parseDate(b) - parseDate(a);
  });

  // Group find counts by category
  const categoryCounts = finds.reduce((acc, find) => {
    const cat = find.category || "Autre";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const sourceCategories = (customCategories && Object.keys(customCategories).length > 0)
    ? customCategories
    : (defaultCategoriesWithSub || {});

  const allKnownCategoryNames = Array.from(
    new Set([...Object.keys(sourceCategories), ...Object.keys(categoryCounts)])
  );

  const categoryData = allKnownCategoryNames
    .map((cat) => [cat, categoryCounts[cat] || 0])
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0], "fr");
    });

  const activeCategoryData = categoryData.filter(([_, count]) => count > 0);
  const totalFinds = finds.length;
  const maxCount = categoryData.length > 0 ? Math.max(...categoryData.map((d) => d[1]), 1) : 1;

  const getCategoryColor = (cat, idx) => {
    if (categoryColors && categoryColors[cat]) return categoryColors[cat];
    if (defaultCategoryColors && defaultCategoryColors[cat]) return defaultCategoryColors[cat];
    return PRESET_CATEGORY_COLORS[idx % PRESET_CATEGORY_COLORS.length] || accentMint;
  };

  const toggleCategory = (cat) => {
    setExpandedCats((prev) => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const toggleAllCategories = (expand) => {
    const next = {};
    categoryData.forEach(([cat]) => {
      next[cat] = expand;
    });
    setExpandedCats(next);
  };

  // Donut Segment Calculations
  const r = 38;
  const circ = 2 * Math.PI * r;
  const strokeWidth = 9;
  const donutSegments = [];
  let accumulatedLength = 0;

  activeCategoryData.forEach(([category, count], idx) => {
    const pct = count / (totalFinds || 1);
    const len = circ * pct;
    const offset = -accumulatedLength;
    accumulatedLength += len;

    donutSegments.push({
      category,
      count,
      pct,
      strokeDasharray: `${len} ${circ}`,
      strokeDashoffset: offset,
      color: getCategoryColor(category, idx)
    });
  });

  return (
    <div
      style={{
        background: bgPanel,
        color: textMain,
        padding: isFullTab ? 0 : "16px",
        borderRadius: isFullTab ? 0 : "20px",
        width: isFullTab ? "100%" : "280px",
        maxHeight: isFullTab ? "none" : "75vh",
        overflowY: isFullTab ? "visible" : "auto",
        position: "relative",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      {!isFullTab && onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.1)",
            color: textMain,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ✕
        </button>
      )}

      {/* SHEET 1: SYNTHÈSE DES DÉCOUVERTES */}
      <div style={sheetStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            textAlign: "center"
          }}
        >
          <div style={{ borderRight: `1px solid ${dividerCol}`, padding: "4px 6px" }}>
            <div style={{ fontSize: "22px", color: textMain, lineHeight: "1.2" }}>{totalFinds}</div>
            <div style={{ fontSize: "11.5px", color: textSub, marginTop: "4px" }}>Trouvailles</div>
          </div>

          <div style={{ borderRight: `1px solid ${dividerCol}`, padding: "4px 6px" }}>
            <div style={{ fontSize: "22px", color: textMain, lineHeight: "1.2" }}>
              {finds.filter((f) => f.favorite).length}
            </div>
            <div style={{ fontSize: "11.5px", color: textSub, marginTop: "4px" }}>Favoris</div>
          </div>

          <div style={{ padding: "4px 6px" }}>
            <div style={{ fontSize: "22px", color: textMain, lineHeight: "1.2" }}>{savedTracks.length}</div>
            <div style={{ fontSize: "11.5px", color: textSub, marginTop: "4px" }}>Sorties</div>
          </div>
        </div>
      </div>

      {/* SHEET 2: RÉPARTITION & GRAPHIQUES */}
      <div style={sheetStyle}>
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", color: textMain, marginBottom: "12px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
            <span>Répartition des objets</span>
          </div>

          {/* Segmented Pill Selector (Forest Style) */}
          <div
            style={{
              display: "flex",
              background: isLight ? "#eef0ed" : "rgba(255, 255, 255, 0.06)",
              padding: "3px",
              borderRadius: "999px",
              gap: "4px"
            }}
          >
            {[
              { id: "donut", label: "Anneau" },
              { id: "bar", label: "Barres" },
              { id: "radar", label: "Radar" }
            ].map((item) => {
              const isSel = chartType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setChartType(item.id)}
                  style={{
                    flex: 1,
                    padding: "6px 12px",
                    borderRadius: "999px",
                    border: "none",
                    background: isSel ? accentForest : "transparent",
                    color: isSel ? "#ffffff" : textSub,
                    fontSize: "12px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease"
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. DONUT CHART */}
        {chartType === "donut" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative", width: "136px", height: "136px", margin: "8px 0 16px 0" }}>
              <svg width="136" height="136" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r={r} fill="transparent" stroke={dividerCol} strokeWidth={strokeWidth} />
                {donutSegments.map((seg, idx) => (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r={r}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                  />
                ))}
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none"
                }}
              >
                <span style={{ fontSize: "20px", color: textMain, lineHeight: "1.1" }}>{totalFinds}</span>
                <span style={{ fontSize: "10px", color: textSub, marginTop: "2px" }}>objets</span>
              </div>
            </div>

            {/* Clean Grid Legend */}
            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px 16px",
                borderTop: `1px solid ${dividerCol}`,
                paddingTop: "14px"
              }}
            >
              {donutSegments.map((seg) => (
                <div
                  key={seg.category}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "12.5px",
                    color: textMain
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{seg.category}</span>
                  </div>
                  <span style={{ color: textSub, fontSize: "12px", flexShrink: 0 }}>
                    {Math.round(seg.pct * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. BAR CHART */}
        {chartType === "bar" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "4px" }}>
            {categoryData.map(([category, count], idx) => {
              const pct = Math.round((count / (totalFinds || 1)) * 100);
              const barWidth = Math.max((count / maxCount) * 100, count > 0 ? 6 : 0);
              const color = getCategoryColor(category, idx);

              return (
                <div key={category}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "4px" }}>
                    <span style={{ color: textMain }}>{category}</span>
                    <span style={{ color: textSub }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", borderRadius: "999px", background: dividerCol, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${barWidth}%`,
                        height: "100%",
                        borderRadius: "999px",
                        background: color,
                        transition: "width 0.4s ease"
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. RADAR CHART */}
        {chartType === "radar" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "4px" }}>
            {(() => {
              const topCategories = categoryData.slice(0, 6);
              if (topCategories.length < 3) {
                return (
                  <div style={{ textAlign: "center", padding: "16px", fontSize: "12px", color: textSub }}>
                    Au moins 3 catégories sont nécessaires pour afficher ce graphique.
                  </div>
                );
              }

              const svgW = 310;
              const svgH = 250;
              const cx = svgW / 2;
              const cy = svgH / 2;
              const maxR = 72;
              const totalAxes = topCategories.length;

              const getPoint = (val, idx) => {
                const angle = (Math.PI * 2 / totalAxes) * idx - Math.PI / 2;
                const ratio = maxCount > 0 ? Math.max(val / maxCount, val > 0 ? 0.12 : 0) : 0;
                const distance = ratio * maxR;
                return [cx + Math.cos(angle) * distance, cy + Math.sin(angle) * distance];
              };

              const polygonPoints = topCategories
                .map(([_, count], idx) => getPoint(count, idx).join(","))
                .join(" ");

              return (
                <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: "320px", overflow: "visible" }}>
                  {[0.25, 0.5, 0.75, 1].map((scale, i) => {
                    const gridPoints = topCategories
                      .map((_, idx) => {
                        const angle = (Math.PI * 2 / totalAxes) * idx - Math.PI / 2;
                        return `${cx + Math.cos(angle) * maxR * scale},${cy + Math.sin(angle) * maxR * scale}`;
                      })
                      .join(" ");
                    return (
                      <polygon
                        key={i}
                        points={gridPoints}
                        fill="transparent"
                        stroke={dividerCol}
                        strokeWidth="1"
                      />
                    );
                  })}

                  {topCategories.map(([cat, count], idx) => {
                    const angle = (Math.PI * 2 / totalAxes) * idx - Math.PI / 2;
                    const x2 = cx + Math.cos(angle) * maxR;
                    const y2 = cy + Math.sin(angle) * maxR;
                    const labelR = maxR + 26;
                    const lx = cx + Math.cos(angle) * labelR;
                    const ly = cy + Math.sin(angle) * labelR;
                    const pct = Math.round((count / (totalFinds || 1)) * 100);

                    return (
                      <g key={cat}>
                        <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={dividerCol} strokeWidth="1" />
                        <text x={lx} y={ly - 5} textAnchor="middle" dominantBaseline="central" fill={textMain} fontSize="10.5">
                          {cat}
                        </text>
                        <text x={lx} y={ly + 8} textAnchor="middle" dominantBaseline="central" fill={textSub} fontSize="9.5">
                          {count} ({pct}%)
                        </text>
                      </g>
                    );
                  })}

                  <polygon
                    points={polygonPoints}
                    fill="rgba(44, 94, 76, 0.25)"
                    stroke={accentMint}
                    strokeWidth="1.8"
                  />

                  {topCategories.map(([_, count], idx) => {
                    const [px, py] = getPoint(count, idx);
                    return (
                      <circle key={idx} cx={px} cy={py} r="3.5" fill={accentMint} />
                    );
                  })}
                </svg>
              );
            })()}
          </div>
        )}
      </div>

      {/* SHEET 3: DÉTAILS PAR SOUS-CATÉGORIES (Forest Clean Rows) */}
      <div style={sheetStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: `1px solid ${dividerCol}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", color: textMain }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>Détails par sous-catégories</span>
          </div>

          {(() => {
            const allExpanded = categoryData.length > 0 && categoryData.every(([cat]) => !!expandedCats[cat]);
            return (
              <button
                type="button"
                onClick={() => toggleAllCategories(!allExpanded)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: accentMint,
                  fontSize: "12px",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                {allExpanded ? "Replier tout" : "Déplier tout"}
              </button>
            );
          })()}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {categoryData.map(([category, count], idx) => {
            const isExpanded = !!expandedCats[category];
            const color = getCategoryColor(category, idx);
            const pct = Math.round((count / (totalFinds || 1)) * 100);
            const isLast = idx === categoryData.length - 1;

            const definedSubCats = (customCategories && customCategories[category]) || defaultCategoriesWithSub[category] || [];
            const subCatCounts = Object.entries(
              finds
                .filter((f) => f.category === category && f.sub_category)
                .reduce((acc, f) => {
                  const matchingSubCat =
                    definedSubCats.find((sub) => sub.toLowerCase() === f.sub_category.toLowerCase()) || f.sub_category;
                  acc[matchingSubCat] = (acc[matchingSubCat] || 0) + 1;
                  return acc;
                }, {})
            ).sort((a, b) => b[1] - a[1]);

            return (
              <div key={category} style={{ borderBottom: isLast ? "none" : `1px solid ${dividerCol}` }}>
                <div
                  onClick={() => toggleCategory(category)}
                  style={{
                    padding: "13px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
                    <span style={{ fontSize: "14px", color: textMain }}>{category}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "13px", color: textSub }}>
                      {count} ({pct}%)
                    </span>
                    <span style={{ fontSize: "14px", color: textSub, transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>
                      ›
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: "0 0 12px 18px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {subCatCounts.length > 0 ? (
                      subCatCounts.map(([subCat, subCount]) => {
                        const subPct = Math.round((subCount / count) * 100);
                        return (
                          <div key={subCat} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", color: textSub }}>
                            <span>{subCat}</span>
                            <span>{subCount} ({subPct}%)</span>
                          </div>
                        );
                      })
                    ) : definedSubCats.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {definedSubCats.map((sub) => (
                          <span
                            key={sub}
                            style={{
                              fontSize: "11px",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              background: isLight ? "#f3f4f2" : "rgba(255,255,255,0.05)",
                              color: textSub
                            }}
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: "12px", color: textSub }}>Aucune sous-catégorie</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SHEET 4: JOURNAL DES SORTIES */}
      <div style={sheetStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: `1px solid ${dividerCol}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", color: textMain }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Journal des sorties</span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDate(null)}
            style={{
              border: "none",
              background: "transparent",
              color: accentMint,
              fontSize: "12px",
              cursor: "pointer",
              padding: 0
            }}
          >
            Tout afficher
          </button>
        </div>

        {allDates.length === 0 ? (
          <div style={{ padding: "16px 0", fontSize: "13px", color: textSub }}>
            Aucune sortie enregistrée
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {allDates.map((dateStr, idx) => {
              const dayFinds = findsByDate[dateStr] || [];
              const dayTracks = tracksByDate[dateStr] || [];
              const isLast = idx === allDates.length - 1;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    padding: "13px 0",
                    borderBottom: isLast ? "none" : `1px solid ${dividerCol}`,
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "14px", color: textMain }}>{dateStr}</span>
                      {dayFinds.length > 0 && (
                        <span style={{ fontSize: "12px", color: accentMint }}>
                          {dayFinds.length} trouvaille{dayFinds.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {(onDeleteTrack || onDeleteFind) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmSortieToDelete({ dateStr, dayFinds, dayTracks });
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: textSub,
                          fontSize: "12px",
                          cursor: "pointer",
                          padding: "2px 6px"
                        }}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>

                  {dayTracks.length > 0 && (
                    <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {dayTracks.map((t, i) => (
                        <div key={t.id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px", color: textSub }}>
                          <span>{t.session_name || `Parcours ${i + 1}`}</span>
                          <span>{getDistanceOfTrack(t.positions).toFixed(2)} km</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {confirmTrackToDelete && (
        <ConfirmModal
          message={`Voulez-vous vraiment supprimer la sortie "${confirmTrackToDelete.session_name || "cette sortie"}" du journal ?`}
          onConfirm={async () => {
            const trackId = confirmTrackToDelete.id;
            setConfirmTrackToDelete(null);
            if (onDeleteTrack) await onDeleteTrack(trackId);
          }}
          onCancel={() => setConfirmTrackToDelete(null)}
        />
      )}

      {confirmSortieToDelete && (
        <ConfirmModal
          message={`Voulez-vous vraiment supprimer la sortie du ${confirmSortieToDelete.dateStr} ?`}
          onConfirm={async () => {
            const { dayFinds = [], dayTracks = [] } = confirmSortieToDelete;
            setConfirmSortieToDelete(null);
            if (onDeleteTrack && dayTracks.length > 0) {
              for (const track of dayTracks) {
                if (track.id) await onDeleteTrack(track.id);
              }
            }
            if (onDeleteFind && dayFinds.length > 0) {
              for (const find of dayFinds) {
                if (find.id) await onDeleteFind(find.id);
              }
            }
          }}
          onCancel={() => setConfirmSortieToDelete(null)}
        />
      )}
    </div>
  );
}
