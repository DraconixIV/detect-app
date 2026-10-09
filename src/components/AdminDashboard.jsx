import React, { useState, useEffect } from "react";
import {
  fetchAnalyticsReport,
  setDeveloperDevice,
  isDeveloperDevice,
  purgeAnalyticsData,
  deleteAnalyticsVisit
} from "../services/analyticsService.js";
import {
  fetchAllFeedbacks,
  deleteFeedbackItem
} from "../services/feedbackService.js";

const MASTER_PIN = "25802580";
const AUTH_STORAGE_KEY = "geoprospect_admin_auth_token_v1";

export default function AdminDashboard({ onExit }) {
  const [pinInput, setPinInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [pinError, setPinError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [deletingFeedbackId, setDeletingFeedbackId] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [devDeviceActive, setDevDeviceActive] = useState(() => isDeveloperDevice());
  const [deletingId, setDeletingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const [report, fbList] = await Promise.all([
      fetchAnalyticsReport(),
      fetchAllFeedbacks()
    ]);
    setData(report);
    setFeedbacks(fbList || []);
    setLastRefreshed(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    setLoading(false);
  };

  const handleDeleteVisit = async (visitId) => {
    if (!visitId) return;
    setDeletingId(visitId);
    // Optimistic UI update
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        totalVisits: Math.max(0, prev.totalVisits - 1),
        recentVisits: (prev.recentVisits || []).filter((v) => v.id !== visitId)
      };
    });

    const success = await deleteAnalyticsVisit(visitId);
    setDeletingId(null);
    if (!success) {
      await loadData();
      alert("Erreur lors de la suppression de la visite.");
    } else {
      const report = await fetchAnalyticsReport();
      setData(report);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!feedbackId) return;
    setDeletingFeedbackId(feedbackId);
    setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackId));
    const ok = await deleteFeedbackItem(feedbackId);
    setDeletingFeedbackId(null);
    if (!ok) {
      const fbList = await fetchAllFeedbacks();
      setFeedbacks(fbList || []);
      alert("Erreur lors de la suppression du retour.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Automatically flag this browser/device as developer device
      setDeveloperDevice(true);
      setDevDeviceActive(true);
      loadData();
      const interval = setInterval(loadData, 20000); // Auto-refresh every 20s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e) => {
    e?.preventDefault();
    if (pinInput.trim() === MASTER_PIN) {
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      } catch {}
      setDeveloperDevice(true);
      setDevDeviceActive(true);
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const handlePurge = async () => {
    setIsPurging(true);
    const success = await purgeAnalyticsData();
    setIsPurging(false);
    setShowPurgeModal(false);
    if (success) {
      await loadData();
    } else {
      alert("Erreur lors de la réinitialisation des statistiques.");
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
    setIsAuthenticated(false);
    setPinInput("");
  };

  const sqlSetupCode = `CREATE TABLE IF NOT EXISTS public.app_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_code TEXT,
    source TEXT,
    device TEXT,
    browser TEXT,
    screen_size TEXT,
    event_type TEXT DEFAULT 'visit',
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.app_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert and read" ON public.app_analytics FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.app_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_code TEXT,
    category TEXT DEFAULT 'suggestion',
    message TEXT NOT NULL,
    contact TEXT,
    device TEXT,
    browser TEXT,
    screen_size TEXT,
    app_version TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.app_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public feedback insert and read" ON public.app_feedback FOR ALL USING (true) WITH CHECK (true);`;

  const copySql = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sqlSetupCode);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    }
  };

  // 1. PIN Lock Screen
  if (!isAuthenticated) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          background: "radial-gradient(circle at top, #1e293b 0%, #0b1329 100%)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "360px",
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            borderRadius: "24px",
            padding: "32px 24px",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.1)",
            textAlign: "center",
            backdropFilter: "blur(20px)"
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #2563eb, #38bdf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              margin: "0 auto 16px auto",
              boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)"
            }}
          >
            🔒
          </div>

          <h2 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: "900", letterSpacing: "-0.3px" }}>
            Console Développeur
          </h2>
          <p style={{ margin: "0 0 24px 0", fontSize: "12px", color: "#94a3b8" }}>
            Espace confidentiel GeoProspect
          </p>

          <form onSubmit={handlePinSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                placeholder="Code PIN"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                autoFocus
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background: "rgba(255, 255, 255, 0.06)",
                  border: pinError ? "2px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  fontSize: "20px",
                  fontWeight: "900",
                  textAlign: "center",
                  letterSpacing: "6px",
                  outline: "none"
                }}
              />
              {pinError && (
                <div style={{ color: "#ef4444", fontSize: "11px", fontWeight: "700", marginTop: "6px" }}>
                  Code PIN invalide
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                border: "none",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "800",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
                transition: "all 0.2s"
              }}
            >
              Déverrouiller
            </button>
          </form>

          <button
            type="button"
            onClick={onExit || (() => { window.location.href = "/"; })}
            style={{
              marginTop: "16px",
              background: "transparent",
              border: "none",
              color: "#64748b",
              fontSize: "12px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            ← Retour à l'application
          </button>
        </div>
      </div>
    );
  }

  // 2. Full Admin Console
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#0b1329",
        color: "#ffffff",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        padding: "20px 16px 120px 16px",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Top Navbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
            paddingBottom: "16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #2563eb, #38bdf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px"
              }}
            >
              🧭
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "900", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                GeoProspect Analytics
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                    color: "#10b981"
                  }}
                >
                  LIVE
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                Actualisé à {lastRefreshed || "--:--"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={loadData}
              disabled={loading}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>🔄</span> {loading ? "..." : "Actualiser"}
            </button>

            <button
              onClick={onExit || (() => { window.location.href = "/"; })}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                background: "rgba(37, 99, 235, 0.2)",
                border: "1px solid rgba(37, 99, 235, 0.4)",
                color: "#93c5fd",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              🧭 Aller sur l'App
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: "8px 10px",
                borderRadius: "10px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer"
              }}
              title="Verrouiller"
            >
              🔒
            </button>
          </div>
        </div>

        {/* DEVELOPER DEVICE EXCLUSION & PURGE BAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            padding: "12px 16px",
            borderRadius: "16px",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px" }}>
            <span style={{ fontSize: "20px" }}>🛡️</span>
            <div>
              <div style={{ fontWeight: "900", color: "#38bdf8", letterSpacing: "-0.2px" }}>
                Mode Développeur Actif sur cet appareil
              </div>
              <div style={{ fontSize: "11px", color: "#cbd5e1", marginTop: "2px" }}>
                Vos visites et tests depuis ce {/iPhone|iPad|Android/i.test(navigator.userAgent || "") ? "smartphone" : "PC"} ne sont <strong>plus comptabilisés</strong>.
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowPurgeModal(true)}
            style={{
              padding: "7px 12px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.16)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#fca5a5",
              fontSize: "11px",
              fontWeight: "800",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s"
            }}
          >
            <span>🗑️</span> Remettre les clics à zéro
          </button>
        </div>

        {/* Database notice if table needs creating */}
        {data && !data.tableReady && (
          <div
            style={{
              padding: "16px",
              borderRadius: "16px",
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              marginBottom: "20px"
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "900", color: "#fbbf24", marginBottom: "6px" }}>
              ⚡ Configuration Supabase (Optionnel en 1 clic)
            </div>
            <p style={{ margin: "0 0 10px 0", fontSize: "11.5px", color: "#fef3c7", lineHeight: "1.4" }}>
              Pour enregistrer automatiquement l'historique détaillé des clics et des visiteurs, exécutez ce script SQL dans votre console Supabase (SQL Editor) :
            </p>
            <button
              onClick={copySql}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                background: copiedSql ? "#059669" : "#f59e0b",
                border: "none",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "800",
                cursor: "pointer"
              }}
            >
              {copiedSql ? "✓ Script SQL copié dans le presse-papier !" : "📋 Copier le script SQL Supabase"}
            </button>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          {/* Card 1: Total Visits */}
          <div style={metricCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Ouvertures / Clics</span>
              <span style={{ fontSize: "16px" }}>📈</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.5px" }}>
              {data?.totalVisits ?? 0}
            </div>
            <div style={{ fontSize: "11px", color: "#38bdf8", marginTop: "4px", fontWeight: "700" }}>
              +{data?.todayVisits ?? 0} aujourd'hui
            </div>
          </div>

          {/* Card 2: Unique Visitors */}
          <div style={metricCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Visiteurs Uniques</span>
              <span style={{ fontSize: "16px" }}>👥</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.5px" }}>
              {data?.uniqueVisitors ?? 0}
            </div>
            <div style={{ fontSize: "11px", color: "#10b981", marginTop: "4px", fontWeight: "700" }}>
              {data?.weekVisits ?? 0} sur 7 jours
            </div>
          </div>

          {/* Card 3: Total Finds */}
          <div style={metricCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Trouvailles Utilisateurs</span>
              <span style={{ fontSize: "16px" }}>🪙</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.5px" }}>
              {data?.totalFinds ?? 0}
            </div>
            <div style={{ fontSize: "10.5px", color: data?.totalFinds > 0 ? "#facc15" : "#64748b", marginTop: "4px", fontWeight: "700" }}>
              {data?.totalFinds > 0 ? `par ${data?.uniqueFinders ?? 0} prospecteur(s)` : "(Vos 53 trouvailles créateur sont exclues)"}
            </div>
          </div>

          {/* Card 4: Total Tracks */}
          <div style={metricCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Sorties GPS</span>
              <span style={{ fontSize: "16px" }}>📍</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.5px" }}>
              {data?.totalTracks ?? 0}
            </div>
            <div style={{ fontSize: "10.5px", color: "#a855f7", marginTop: "4px", fontWeight: "700" }}>
              tracés enregistrés (Terrain)
            </div>
          </div>
        </div>

        {/* Detailed Breakdown: Sources & Devices */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "20px" }}>
          {/* Sources breakdown */}
          <div style={sectionCardStyle}>
            <div style={{ fontSize: "13px", fontWeight: "900", color: "#ffffff", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🌐</span> Détail de la Provenance du Trafic
            </div>

            {data && Object.keys(data.sources).length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {Object.entries(data.sources).map(([src, count]) => {
                  const pct = Math.round((count / (data.totalVisits || 1)) * 100);
                  let displayLabel = src;
                  let icon = "🔗";
                  if (src === "Facebook") {
                    displayLabel = "Facebook (Publication et Groupes)";
                    icon = "📘";
                  } else if (src === "Accès Direct / PWA") {
                    displayLabel = "Accès Direct / PWA (Navigateur et App)";
                    icon = "⚡";
                  } else if (src === "Google") {
                    displayLabel = "Google (Recherche, Discover, Gmail)";
                    icon = "🔍";
                  } else if (src.includes("Twitter") || src.includes("X")) {
                    displayLabel = "X / Twitter (Lien partagé)";
                    icon = "🐦";
                  }

                  return (
                    <div key={src}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "4px" }}>
                        <span style={{ fontWeight: "700", color: "#e2e8f0" }}>
                          {icon} {displayLabel}
                        </span>
                        <span style={{ color: "#94a3b8", fontWeight: "800" }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255, 255, 255, 0.08)", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: src === "Facebook"
                              ? "linear-gradient(90deg, #2563eb, #3b82f6)"
                              : src.includes("Direct")
                              ? "linear-gradient(90deg, #10b981, #34d399)"
                              : "linear-gradient(90deg, #8b5cf6, #a855f7)",
                            borderRadius: "3px"
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: "11.5px", color: "#64748b", textAlign: "center", padding: "16px 0" }}>
                En attente des premiers clics enregistrés...
              </div>
            )}
          </div>

          {/* Devices breakdown */}
          <div style={sectionCardStyle}>
            <div style={{ fontSize: "13px", fontWeight: "900", color: "#ffffff", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📱</span> Appareils et Navigateurs
            </div>

            {data && Object.keys(data.devices).length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {Object.entries(data.devices).map(([dev, count]) => {
                  const pct = Math.round((count / (data.totalVisits || 1)) * 100);
                  return (
                    <div key={dev}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "4px" }}>
                        <span style={{ fontWeight: "700", color: "#e2e8f0" }}>{dev}</span>
                        <span style={{ color: "#94a3b8", fontWeight: "800" }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255, 255, 255, 0.08)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #10b981, #34d399)", borderRadius: "3px" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: "11.5px", color: "#64748b", textAlign: "center", padding: "16px 0" }}>
                En attente des premiers clics enregistrés...
              </div>
            )}
          </div>
        </div>

        {/* User Feedbacks Section */}
        <div style={{ ...sectionCardStyle, marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ fontSize: "13.5px", fontWeight: "900", color: "#38bdf8", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>💬</span> Messages et Retours Utilisateurs (Formulaire de retour)
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: "800",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  background: feedbacks.length > 0 ? "rgba(56, 189, 248, 0.2)" : "rgba(255, 255, 255, 0.08)",
                  color: feedbacks.length > 0 ? "#38bdf8" : "#94a3b8"
                }}
              >
                {feedbacks.length} message(s)
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
              Bugs, idées et avis soumis depuis l'application
            </div>
          </div>

          {feedbacks.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {feedbacks.map((fb, idx) => {
                const dateStr = fb.created_at ? new Date(fb.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";
                let catBadge = { label: "Avis", icon: "💬", bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.4)", text: "#10b981" };
                if (fb.category === "bug") {
                  catBadge = { label: "Bug", icon: "🐛", bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.4)", text: "#f87171" };
                } else if (fb.category === "suggestion") {
                  catBadge = { label: "Idée", icon: "💡", bg: "rgba(56, 189, 248, 0.15)", border: "rgba(56, 189, 248, 0.4)", text: "#38bdf8" };
                } else if (fb.category === "question") {
                  catBadge = { label: "Question", icon: "❓", bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)", text: "#fbbf24" };
                }

                return (
                  <div
                    key={fb.id || idx}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "14px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            background: catBadge.bg,
                            border: `1px solid ${catBadge.border}`,
                            color: catBadge.text,
                            fontSize: "11px",
                            fontWeight: "800",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <span>{catBadge.icon}</span>
                          <span>{catBadge.label}</span>
                        </span>
                        <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>
                          {fb.user_code || "ANON"}
                        </span>
                        {fb.contact && (
                          <span style={{ fontSize: "11px", color: "#e2e8f0", fontWeight: "700", background: "rgba(255, 255, 255, 0.08)", padding: "2px 8px", borderRadius: "6px" }}>
                            👤 {fb.contact}
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "11px", color: "#64748b" }}>
                          ⏱️ {dateStr}
                        </span>
                        <button
                          onClick={() => handleDeleteFeedback(fb.id)}
                          disabled={deletingFeedbackId === fb.id}
                          title="Supprimer ce message"
                          style={{
                            padding: "4px 8px",
                            borderRadius: "8px",
                            background: "rgba(239, 68, 68, 0.12)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#f87171",
                            fontSize: "11px",
                            fontWeight: "700",
                            cursor: "pointer"
                          }}
                        >
                          {deletingFeedbackId === fb.id ? "..." : "🗑️"}
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: "13px", color: "#ffffff", lineHeight: "1.5", whiteSpace: "pre-wrap", background: "rgba(0, 0, 0, 0.2)", padding: "10px 12px", borderRadius: "10px" }}>
                      {fb.message}
                    </div>

                    <div style={{ fontSize: "10.5px", color: "#64748b", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <span>📱 {fb.device || "Appareil inconnu"}</span>
                      <span>🌐 {fb.browser || "Navigateur inconnu"}</span>
                      {fb.screen_size && <span>📐 {fb.screen_size}</span>}
                      {fb.app_version && <span>🏷️ v{fb.app_version}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: "12px", color: "#64748b", textAlign: "center", padding: "20px 0" }}>
              Aucun retour utilisateur reçu pour le moment. Dès qu'un prospecteur soumet un message, il apparaîtra ici.
            </div>
          )}
        </div>

        {/* Live Visitor Feed */}
        <div style={sectionCardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ fontSize: "13.5px", fontWeight: "900", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>⚡</span> Journal des Clics et Visites en Direct
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
              Heure exacte au format seconde (Paris)
            </div>
          </div>

          {data && data.recentVisits && data.recentVisits.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", textAlign: "left", color: "#64748b" }}>
                    <th style={{ padding: "10px 8px" }}>Heure exacte</th>
                    <th style={{ padding: "10px 8px" }}>Appareil</th>
                    <th style={{ padding: "10px 8px" }}>Navigateur</th>
                    <th style={{ padding: "10px 8px" }}>Source du Clic</th>
                    <th style={{ padding: "10px 8px" }}>Code Utilisateur</th>
                    <th style={{ padding: "10px 8px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentVisits.map((v, i) => {
                    const rawDate = v.created_at ? new Date(v.created_at) : null;
                    const isValidDate = rawDate && !isNaN(rawDate.getTime());
                    
                    const timeStr = isValidDate
                      ? rawDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                      : "-";
                    const dateStr = isValidDate
                      ? rawDate.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
                      : "-";
                    
                    const isToday = isValidDate && rawDate.toDateString() === new Date().toDateString();
                    
                    const diffSec = isValidDate ? Math.floor((Date.now() - rawDate.getTime()) / 1000) : 999999;
                    const diffMin = Math.floor(diffSec / 60);
                    const diffHours = Math.floor(diffMin / 60);

                    let relativeBadge = "";
                    if (diffSec < 60) {
                      relativeBadge = "À l'instant";
                    } else if (diffMin < 60) {
                      relativeBadge = `Il y a ${diffMin} min`;
                    } else if (diffHours < 24 && isToday) {
                      relativeBadge = `Il y a ${diffHours}h`;
                    }

                    return (
                      <tr key={v.id || i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: i % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.015)" }}>
                        {/* Heure exacte */}
                        <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontWeight: "800", color: "#ffffff", fontSize: "12px" }}>
                              ⏱️ {timeStr}
                            </span>
                            {relativeBadge && (
                              <span style={{ fontSize: "9.5px", fontWeight: "700", padding: "1px 5px", borderRadius: "4px", background: relativeBadge.includes("instant") || relativeBadge.includes("min") ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.08)", color: relativeBadge.includes("instant") || relativeBadge.includes("min") ? "#10b981" : "#94a3b8" }}>
                                {relativeBadge}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>
                            {isToday ? "Aujourd'hui" : dateStr}
                          </div>
                        </td>

                        {/* Appareil & Écran */}
                        <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>
                          <div style={{ fontWeight: "700", color: "#e2e8f0" }}>
                            {v.device?.includes("iPhone") ? "📱 iPhone (iOS)" : v.device?.includes("Android") ? "🤖 Android" : v.device?.includes("Windows") ? "💻 PC Windows" : v.device?.includes("Mac") ? "🍎 Mac" : v.device || "Mobile"}
                          </div>
                          {v.screen_size && v.screen_size !== "0x0" && (
                            <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>
                              Écran: {v.screen_size}
                            </div>
                          )}
                        </td>

                        {/* Navigateur */}
                        <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>
                          <span style={{ color: "#cbd5e1", fontWeight: "600" }}>
                            {v.browser || "Inconnu"}
                          </span>
                        </td>

                        {/* Source */}
                        <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "800",
                              background: v.source?.toLowerCase().includes("facebook") ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.08)",
                              color: v.source?.toLowerCase().includes("facebook") ? "#60a5fa" : "#e2e8f0",
                              border: v.source?.toLowerCase().includes("facebook") ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)"
                            }}
                          >
                            {v.source?.toLowerCase().includes("facebook") ? "📘 Facebook" : v.source || "🔗 Direct / PWA"}
                          </span>
                        </td>

                        {/* Code Utilisateur */}
                        <td style={{ padding: "10px 8px", color: "#94a3b8", fontFamily: "monospace", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {v.user_code || "ANON"}
                        </td>

                        {/* Action - Suppression individuelle */}
                        <td style={{ padding: "10px 8px", textAlign: "center", whiteSpace: "nowrap" }}>
                          <button
                            onClick={() => handleDeleteVisit(v.id)}
                            disabled={deletingId === v.id}
                            title="Supprimer ce clic de la liste"
                            style={{
                              padding: "4px 8px",
                              borderRadius: "8px",
                              background: "rgba(239, 68, 68, 0.12)",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              color: "#f87171",
                              fontSize: "11px",
                              fontWeight: "700",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              transition: "all 0.15s ease"
                            }}
                          >
                            {deletingId === v.id ? "..." : "🗑️"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ fontSize: "12px", color: "#64748b", textAlign: "center", padding: "24px 0" }}>
              Aucune visite récente enregistrée pour le moment.
            </div>
          )}
        </div>

        {/* PURGE CONFIRMATION MODAL */}
        {showPurgeModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}
            onClick={() => !isPurging && setShowPurgeModal(false)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                background: "#0f172a",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.8)",
                color: "#ffffff"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: "28px", textAlign: "center", marginBottom: "12px" }}>🗑️</div>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "900", textAlign: "center" }}>
                Remettre les clics à zéro ?
              </h3>
              <p style={{ margin: "0 0 20px 0", fontSize: "12px", color: "#94a3b8", lineHeight: "1.5", textAlign: "center" }}>
                Cette action va effacer l'historique des visites de test enregistrées jusqu'ici dans la table analytique. Vos trouvailles et sorties ne seront pas affectées.
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setShowPurgeModal(false)}
                  disabled={isPurging}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handlePurge}
                  disabled={isPurging}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background: "#ef4444",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "800",
                    cursor: "pointer"
                  }}
                >
                  {isPurging ? "Effacement..." : "Confirmer l'effacement"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const metricCardStyle = {
  background: "rgba(15, 23, 42, 0.7)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "18px",
  padding: "16px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
};

const sectionCardStyle = {
  background: "rgba(15, 23, 42, 0.7)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "18px",
  padding: "18px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
};
