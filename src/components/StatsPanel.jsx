import React, { useState } from "react";
import { categoriesWithSub, defaultCategoryColors, PRESET_CATEGORY_COLORS } from "../subCategories";
import { loadCategoriesData } from "../services/categoriesService";

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
  onClose,
  isFullTab = false,
  theme = "dark",
  onOpenCategoryManager
}) {
  const { emojis: categoryEmojis, categories: customCategories, colors: categoryColors = {} } = loadCategoriesData();
  const [chartType, setChartType] = useState("donut"); // 'donut' | 'bar' | 'treemap' | 'radar' | 'pyramid'
  const [expandedCats, setExpandedCats] = useState({});

  const isLight = theme === "light";
  const bgPanel = isFullTab ? "transparent" : (isLight ? "#ffffff" : "rgba(15, 23, 42, 0.95)");
  const textMain = isLight ? "#000000" : "#ffffff";
  const textSub = isLight ? "#1e293b" : "#ffffff";
  const cardBg = isLight ? "#ffffff" : "rgba(255, 255, 255, 0.05)";
  const cardBorder = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.12)";
  const cardShadow = isLight ? "0 2px 8px rgba(0, 0, 0, 0.06)" : "none";
  const subBg = isLight ? "#f1f5f9" : "rgba(0, 0, 0, 0.25)";

  // Group finds by date
  const findsByDate = finds.reduce((acc, find) => {
    if (!find.date) return acc;
    const datePart = find.date.split(",")[0].split(" ")[0].trim();
    if (!acc[datePart]) acc[datePart] = [];
    acc[datePart].push(find);
    return acc;
  }, {});

  // Group tracks by date
  const tracksByDate = savedTracks.reduce((acc, track) => {
    if (!track.created_at) return acc;
    const dateStr = new Date(track.created_at).toLocaleDateString("fr-FR");
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(track);
    return acc;
  }, {});

  const allDates = Array.from(
    new Set([...Object.keys(findsByDate), ...Object.keys(tracksByDate)])
  ).sort((a, b) => {
    const parseDate = (dStr) => {
      const parts = dStr.split("/");
      return new Date(parts[2], parts[1] - 1, parts[0]);
    };
    return parseDate(b) - parseDate(a);
  });

  // Calculate category stats
  const categoryData = Object.entries(
    finds.reduce((acc, find) => {
      const cat = find.category || "Autre";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const totalFinds = finds.length;
  const maxCount = categoryData.length > 0 ? Math.max(...categoryData.map((d) => d[1])) : 1;

  const getCategoryColor = (cat, idx) => {
    if (categoryColors && categoryColors[cat]) {
      return categoryColors[cat];
    }
    if (defaultCategoryColors && defaultCategoryColors[cat]) {
      return defaultCategoryColors[cat];
    }
    return PRESET_CATEGORY_COLORS[idx % PRESET_CATEGORY_COLORS.length] || "#3b82f6";
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

  // 1. Donut Segment Calculations
  const r = 38;
  const circ = 2 * Math.PI * r;
  const strokeWidth = 10;
  const donutSegments = [];
  let accumulatedLength = 0;

  categoryData.forEach(([category, count], idx) => {
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
        backdropFilter: isFullTab ? "none" : "blur(12px)",
        color: textMain,
        padding: "16px",
        borderRadius: "20px",
        border: isFullTab ? "none" : `1px solid ${cardBorder}`,
        width: isFullTab ? "100%" : "280px",
        maxHeight: isFullTab ? "none" : "75vh",
        overflowY: isFullTab ? "visible" : "auto",
        position: "relative",
        boxSizing: "border-box",
        boxShadow: isFullTab ? "none" : "0 10px 30px rgba(0,0,0,0.4)",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      {/* Close button for non-full tab modal */}
      {!isFullTab && onClose && (
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "none",
            background: "#ef4444",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ✕
        </button>
      )}

      {/* Top Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: textMain }}>
            📊 Statistiques
          </h2>
          <p style={{ margin: 0, fontSize: "11px", color: textSub }}>
            Vue globale de vos découvertes et sorties
          </p>
        </div>
        {onOpenCategoryManager && (
          <button
            onClick={onOpenCategoryManager}
            style={{
              padding: "6px 10px",
              borderRadius: "10px",
              border: `1px solid ${cardBorder}`,
              background: cardBg,
              color: textMain,
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            ⚙️ Catégories
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow, padding: "10px", borderRadius: "14px", textAlign: "center" }}>
          <div style={{ fontSize: "18px" }}>📍</div>
          <div style={{ fontSize: "9px", color: textSub, marginTop: "2px", fontWeight: "700", textTransform: "uppercase" }}>Trouvailles</div>
          <div style={{ fontSize: "16px", fontWeight: "800", marginTop: "2px", color: isLight ? "#000000" : "#facc15" }}>{totalFinds}</div>
        </div>
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow, padding: "10px", borderRadius: "14px", textAlign: "center" }}>
          <div style={{ fontSize: "18px" }}>⭐</div>
          <div style={{ fontSize: "9px", color: textSub, marginTop: "2px", fontWeight: "700", textTransform: "uppercase" }}>Favoris</div>
          <div style={{ fontSize: "16px", fontWeight: "800", marginTop: "2px", color: isLight ? "#000000" : "#ec4899" }}>{finds.filter(f => f.favorite).length}</div>
        </div>
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow, padding: "10px", borderRadius: "14px", textAlign: "center" }}>
          <div style={{ fontSize: "18px" }}>🚶</div>
          <div style={{ fontSize: "9px", color: textSub, marginTop: "2px", fontWeight: "700", textTransform: "uppercase" }}>Sorties</div>
          <div style={{ fontSize: "16px", fontWeight: "800", marginTop: "2px", color: isLight ? "#000000" : "#10b981" }}>{savedTracks.length}</div>
        </div>
      </div>

      {/* SECTION ORGANIGRAMMES */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          boxShadow: cardShadow,
          borderRadius: "16px",
          padding: "14px",
          marginBottom: "16px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", color: textMain }}>
            🏆 Organigrammes & Répartition
          </span>
        </div>

        {/* 5-Way Chart Selector */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "4px",
            background: isLight ? "#e2e8f0" : "rgba(0,0,0,0.3)",
            padding: "4px",
            borderRadius: "12px",
            marginBottom: "14px"
          }}
        >
          {[
            { id: "donut", label: "Donut", icon: "🍩" },
            { id: "bar", label: "Barres", icon: "📊" },
            { id: "treemap", label: "Mosaïque", icon: "🧱" },
            { id: "radar", label: "Radar", icon: "🕸️" },
            { id: "pyramid", label: "Pyramide", icon: "🏛️" }
          ].map((item) => {
            const isSel = chartType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setChartType(item.id)}
                style={{
                  padding: "6px 2px",
                  borderRadius: "8px",
                  border: "none",
                  background: isSel ? (isLight ? "#ffffff" : "#2563eb") : "transparent",
                  color: isSel ? (isLight ? "#1e293b" : "#ffffff") : textSub,
                  boxShadow: isSel && isLight ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
                  fontWeight: isSel ? "800" : "600",
                  fontSize: "10px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ fontSize: "14px" }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. DONUT CHART */}
        {chartType === "donut" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative", width: "120px", height: "120px", margin: "6px 0 14px 0" }}>
              <svg width="120" height="120" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r={r} fill="transparent" stroke={isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.08)"} strokeWidth={strokeWidth} />
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
                    strokeLinecap="round"
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
                <span style={{ fontSize: "16px", fontWeight: "900", color: isLight ? "#0f172a" : "#facc15" }}>{totalFinds}</span>
                <span style={{ fontSize: "8px", fontWeight: "700", color: textSub, textTransform: "uppercase" }}>Objets</span>
              </div>
            </div>

            {/* Legend pills */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px" }}>
              {donutSegments.map((seg) => (
                <div
                  key={seg.category}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 8px",
                    borderRadius: "10px",
                    background: isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.06)",
                    border: `1px solid ${cardBorder}`,
                    fontSize: "10px",
                    fontWeight: "600"
                  }}
                >
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: seg.color }} />
                  <span>{categoryEmojis[seg.category] || ""} {seg.category}</span>
                  <strong style={{ color: seg.color }}>({Math.round(seg.pct * 100)}%)</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. BAR CHART */}
        {chartType === "bar" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {categoryData.map(([category, count], idx) => {
              const pct = Math.round((count / (totalFinds || 1)) * 100);
              const barWidth = Math.max((count / maxCount) * 100, 8);
              const color = getCategoryColor(category, idx);

              return (
                <div key={category}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700", marginBottom: "3px" }}>
                    <span>{categoryEmojis[category] || "🏷️"} {category}</span>
                    <span style={{ color: textSub }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", borderRadius: "4px", background: isLight ? "#e2e8f0" : "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${barWidth}%`,
                        height: "100%",
                        borderRadius: "4px",
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

        {/* 3. TREEMAP / MOSAÏQUE PROPORTIONNELLE */}
        {chartType === "treemap" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
                gap: "6px"
              }}
            >
              {categoryData.map(([category, count], idx) => {
                const pct = Math.round((count / (totalFinds || 1)) * 100);
                const color = getCategoryColor(category, idx);
                const isLarge = count >= maxCount * 0.7;

                return (
                  <div
                    key={category}
                    style={{
                      background: isLight ? `${color}18` : `${color}25`,
                      border: `1.5px solid ${color}`,
                      borderRadius: "12px",
                      padding: isLarge ? "14px 10px" : "10px 8px",
                      gridColumn: isLarge ? "span 2" : "span 1",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: isLarge ? "70px" : "55px",
                      boxSizing: "border-box"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: isLarge ? "18px" : "14px" }}>{categoryEmojis[category] || "🏷️"}</span>
                      <span style={{ fontSize: "10px", fontWeight: "800", color }}>{pct}%</span>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "800", color: textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {category}
                      </div>
                      <div style={{ fontSize: "9px", color: textSub }}>
                        {count} objet{count > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. RADAR / TOILE D'ARAIGNÉE */}
        {chartType === "radar" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {(() => {
              const topCategories = categoryData.slice(0, 6);
              if (topCategories.length < 3) {
                return (
                  <div style={{ textAlign: "center", padding: "16px", fontSize: "11px", color: textSub }}>
                    Le radar nécessite au moins 3 catégories d'objets pour s'afficher.
                  </div>
                );
              }

              const size = 180;
              const center = size / 2;
              const maxR = size * 0.38;
              const totalAxes = topCategories.length;

              const getPoint = (val, idx) => {
                const angle = (Math.PI * 2 / totalAxes) * idx - Math.PI / 2;
                const distance = (val / maxCount) * maxR;
                return [center + Math.cos(angle) * distance, center + Math.sin(angle) * distance];
              };

              const polygonPoints = topCategories
                .map(([_, count], idx) => getPoint(count, idx).join(","))
                .join(" ");

              return (
                <div style={{ position: "relative", width: `${size}px`, height: `${size}px` }}>
                  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Concentric grid lines */}
                    {[0.25, 0.5, 0.75, 1].map((scale, i) => {
                      const gridPoints = topCategories
                        .map((_, idx) => {
                          const angle = (Math.PI * 2 / totalAxes) * idx - Math.PI / 2;
                          return `${center + Math.cos(angle) * maxR * scale},${center + Math.sin(angle) * maxR * scale}`;
                        })
                        .join(" ");
                      return (
                        <polygon
                          key={i}
                          points={gridPoints}
                          fill="transparent"
                          stroke={isLight ? "#cbd5e1" : "rgba(255,255,255,0.12)"}
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Axis rays */}
                    {topCategories.map((_, idx) => {
                      const angle = (Math.PI * 2 / totalAxes) * idx - Math.PI / 2;
                      const x2 = center + Math.cos(angle) * maxR;
                      const y2 = center + Math.sin(angle) * maxR;
                      return (
                        <line
                          key={idx}
                          x1={center}
                          y1={center}
                          x2={x2}
                          y2={y2}
                          stroke={isLight ? "#cbd5e1" : "rgba(255,255,255,0.15)"}
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Shaded radar area */}
                    <polygon
                      points={polygonPoints}
                      fill={isLight ? "rgba(37, 99, 235, 0.25)" : "rgba(250, 204, 21, 0.3)"}
                      stroke={isLight ? "#2563eb" : "#facc15"}
                      strokeWidth="2"
                    />

                    {/* Points nodes */}
                    {topCategories.map(([_, count], idx) => {
                      const [px, py] = getPoint(count, idx);
                      return (
                        <circle
                          key={idx}
                          cx={px}
                          cy={py}
                          r="4"
                          fill={isLight ? "#2563eb" : "#facc15"}
                          stroke={isLight ? "#ffffff" : "#0f172a"}
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </svg>
                </div>
              );
            })()}

            {/* Radar labels */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", marginTop: "8px" }}>
              {categoryData.slice(0, 6).map(([cat, count], idx) => (
                <span
                  key={cat}
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    padding: "2px 6px",
                    borderRadius: "8px",
                    background: isLight ? "#f1f5f9" : "rgba(255,255,255,0.06)",
                    color: textMain,
                    border: `1px solid ${cardBorder}`
                  }}
                >
                  {categoryEmojis[cat] || "🏷️"} {cat}: <strong>{count}</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 5. PYRAMID CHART */}
        {chartType === "pyramid" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
            {categoryData.map(([category, count], idx) => {
              const pct = Math.round((count / (totalFinds || 1)) * 100);
              const color = getCategoryColor(category, idx);
              // Pyramid sizing: wider at base
              const widthPct = 40 + ((idx + 1) / categoryData.length) * 60;

              return (
                <div
                  key={category}
                  style={{
                    width: `${widthPct}%`,
                    background: isLight ? `${color}20` : `${color}30`,
                    border: `1px solid ${color}`,
                    borderRadius: "10px",
                    padding: "6px 10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxSizing: "border-box"
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: "700", color: textMain }}>
                    #{idx + 1} {categoryEmojis[category] || ""} {category}
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: "800", color }}>
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION ACCORDÉON DÉTAILLÉ DES CATÉGORIES ET SOUS-SECTIONS */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          boxShadow: cardShadow,
          borderRadius: "16px",
          padding: "14px",
          marginBottom: "16px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", color: isLight ? "#0f172a" : "#ffffff" }}>
              📂 Détail par Familles & Sous-Sections
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "10px", color: textSub }}>
              Touchez une catégorie pour déplier ou replier ses sous-types
            </p>
          </div>
          <div>
            {(() => {
              const allExpanded = categoryData.length > 0 && categoryData.every(([cat]) => !!expandedCats[cat]);
              return (
                <button
                  onClick={() => toggleAllCategories(!allExpanded)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "8px",
                    border: `1px solid ${cardBorder}`,
                    background: isLight ? "#f1f5f9" : "rgba(255,255,255,0.08)",
                    color: textMain,
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.15s ease"
                  }}
                >
                  {allExpanded ? "▲ Replier tout" : "▼ Déplier tout"}
                </button>
              );
            })()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {categoryData.map(([category, count], idx) => {
            const isExpanded = !!expandedCats[category];
            const color = getCategoryColor(category, idx);
            const pct = Math.round((count / (totalFinds || 1)) * 100);

            // Sub-category counts for this category
            const subCatCounts = Object.entries(
              finds
                .filter((f) => f.category === category && f.sub_category)
                .reduce((acc, f) => {
                  const matchingSubCat =
                    ((customCategories && customCategories[category]) || []).find(
                      (sub) => sub.toLowerCase() === f.sub_category.toLowerCase()
                    ) || f.sub_category;
                  acc[matchingSubCat] = (acc[matchingSubCat] || 0) + 1;
                  return acc;
                }, {})
            ).sort((a, b) => b[1] - a[1]);

            return (
              <div
                key={category}
                style={{
                  borderRadius: "12px",
                  border: `1px solid ${cardBorder}`,
                  background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.03)",
                  overflow: "hidden",
                  transition: "all 0.2s"
                }}
              >
                {/* Category Accordion Header */}
                <div
                  onClick={() => toggleCategory(category)}
                  style={{
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    userSelect: "none",
                    background: isExpanded ? (isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.06)") : "transparent"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "18px" }}>{categoryEmojis[category] || "🏷️"}</span>
                    <div>
                      <span style={{ fontWeight: "700", fontSize: "13px", color: textMain }}>
                        {category}
                      </span>
                      <span style={{ marginLeft: "6px", fontSize: "11px", fontWeight: "800", color }}>
                        {count} ({pct}%)
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: "700",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        background: isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.1)",
                        color: textSub
                      }}
                    >
                      {subCatCounts.length} sous-types
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: textSub,
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease"
                      }}
                    >
                      ▼
                    </span>
                  </div>
                </div>

                {/* Sub-categories expandable content */}
                {isExpanded && (
                  <div
                    style={{
                      padding: "10px 12px 12px 12px",
                      borderTop: `1px solid ${cardBorder}`,
                      background: subBg,
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px"
                    }}
                  >
                    {subCatCounts.length === 0 ? (
                      <div style={{ fontSize: "11px", color: textSub, fontStyle: "italic", padding: "4px 0" }}>
                        Aucune sous-catégorie spécifiée pour cette famille.
                      </div>
                    ) : (
                      subCatCounts.map(([subCat, subCount]) => {
                        const subPct = Math.round((subCount / count) * 100);
                        const subBarWidth = Math.max((subCount / count) * 100, 10);

                        return (
                          <div key={subCat} style={{ padding: "4px 0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "600", marginBottom: "2px" }}>
                              <span style={{ color: textMain }}>↳ {subCat}</span>
                              <span style={{ color: textSub }}>{subCount} ({subPct}%)</span>
                            </div>
                            <div style={{ width: "100%", height: "5px", borderRadius: "3px", background: isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.1)", overflow: "hidden" }}>
                              <div
                                style={{
                                  width: `${subBarWidth}%`,
                                  height: "100%",
                                  borderRadius: "3px",
                                  background: color
                                }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION JOURNAL DES SORTIES */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          boxShadow: cardShadow,
          borderRadius: "16px",
          padding: "14px",
          marginBottom: "16px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", color: isLight ? "#0f172a" : "#ffffff" }}>
            📅 Journal des Sorties
          </h3>
          <button
            onClick={() => setSelectedDate(null)}
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
              border: `1px solid ${cardBorder}`,
              fontSize: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              background: isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.08)",
              color: textMain
            }}
          >
            ✕ Retirer filtre
          </button>
        </div>

        {allDates.length === 0 && (
          <p style={{ color: textSub, fontSize: "12px", fontStyle: "italic" }}>
            Aucune sortie ni trouvaille enregistrée
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto", paddingRight: "4px" }}>
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
                  background: isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.04)",
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "12px",
                  padding: "10px",
                  fontSize: "12px",
                  cursor: dayFinds.length > 0 ? "pointer" : "default"
                }}
              >
                <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                  <span style={{ color: textMain }}>📅 {dateStr}</span>
                  {dayFinds.length > 0 && (
                    <span style={{ color: isLight ? "#000000" : "#facc15", fontWeight: "bold" }}>
                      🪙 {dayFinds.length} trouvaille{dayFinds.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {dayTracks.length > 0 ? (
                  <div style={{ color: textSub, fontSize: "11px", display: "flex", flexDirection: "column", gap: "3px", borderTop: `1px solid ${cardBorder}`, paddingTop: "4px", marginTop: "4px" }}>
                    {dayTracks.map((t, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>🚶 {t.session_name || `Parcours ${i + 1}`}</span>
                        <span>📏 <strong>{getDistanceOfTrack(t.positions).toFixed(2)}</strong> km</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  dayFinds.length > 0 && (
                    <div style={{ color: textSub, fontSize: "10px", fontStyle: "italic", marginTop: "2px" }}>
                      Pas de tracé GPS enregistré
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* EXPORT / IMPORT ACTIONS */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={exportData}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            background: isLight ? "#ffffff" : "rgba(255,255,255,0.08)",
            border: `1px solid ${cardBorder}`,
            boxShadow: cardShadow,
            color: textMain
          }}
        >
          📤 Exporter (Sauvegarde)
        </button>

        <button
          onClick={importData}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            background: isLight ? "#ffffff" : "rgba(255,255,255,0.08)",
            border: `1px solid ${cardBorder}`,
            boxShadow: cardShadow,
            color: textMain
          }}
        >
          📥 Importer (Restauration)
        </button>
      </div>
    </div>
  );
}