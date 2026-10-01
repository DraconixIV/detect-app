import React, { useState, useEffect } from "react";
import { fetchAnalyticsReport } from "../services/analyticsService.js";

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
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const report = await fetchAnalyticsReport();
    setData(report);
    setLastRefreshed(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(loadData, 20000); // Auto-refresh every 20s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e) => {
    e?.preventDefault();
    if (pinInput === MASTER_PIN) {
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      } catch {}
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
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
CREATE POLICY "Allow public insert and read" ON public.app_analytics FOR ALL USING (true) WITH CHECK (true);`;

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
          minHeight: "100vh",
          background: "radial-gradient(circle at top, #1e293b 0%, #0b1329 100%)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
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
        minHeight: "100vh",
        background: "#0b1329",
        color: "#ffffff",
        padding: "20px 16px 60px 16px",
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
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Trouvailles Globales</span>
              <span style={{ fontSize: "16px" }}>🪙</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.5px" }}>
              {data?.totalFinds ?? 0}
            </div>
            <div style={{ fontSize: "11px", color: "#facc15", marginTop: "4px", fontWeight: "700" }}>
              par {data?.uniqueFinders ?? 0} prospecteur(s)
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
            <div style={{ fontSize: "11px", color: "#a855f7", marginTop: "4px", fontWeight: "700" }}>
              tracés enregistrés
            </div>
          </div>
        </div>

        {/* Detailed Breakdown: Sources & Devices */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "20px" }}>
          {/* Sources breakdown */}
          <div style={sectionCardStyle}>
            <div style={{ fontSize: "13px", fontWeight: "900", color: "#ffffff", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🌐</span> Provenance du Trafic
            </div>

            {data && Object.keys(data.sources).length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {Object.entries(data.sources).map(([src, count]) => {
                  const pct = Math.round((count / (data.totalVisits || 1)) * 100);
                  return (
                    <div key={src}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "4px" }}>
                        <span style={{ fontWeight: "700", color: "#e2e8f0" }}>{src}</span>
                        <span style={{ color: "#94a3b8", fontWeight: "800" }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255, 255, 255, 0.08)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #2563eb, #38bdf8)", borderRadius: "3px" }} />
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
              <span>📱</span> Appareils & Navigateurs
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

        {/* Live Visitor Feed */}
        <div style={sectionCardStyle}>
          <div style={{ fontSize: "13px", fontWeight: "900", color: "#ffffff", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>⚡</span> Dernières Visites en Direct
          </div>

          {data && data.recentVisits && data.recentVisits.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", textAlign: "left", color: "#64748b" }}>
                    <th style={{ padding: "8px 6px" }}>Heure</th>
                    <th style={{ padding: "8px 6px" }}>Source</th>
                    <th style={{ padding: "8px 6px" }}>Appareil</th>
                    <th style={{ padding: "8px 6px" }}>Navigateur</th>
                    <th style={{ padding: "8px 6px" }}>Code Utilisateur</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentVisits.map((v, i) => (
                    <tr key={v.id || i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <td style={{ padding: "8px 6px", color: "#94a3b8" }}>
                        {new Date(v.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td style={{ padding: "8px 6px", fontWeight: "700", color: "#38bdf8" }}>
                        {v.source || "Direct"}
                      </td>
                      <td style={{ padding: "8px 6px", color: "#e2e8f0" }}>
                        {v.device || "Mobile"}
                      </td>
                      <td style={{ padding: "8px 6px", color: "#94a3b8" }}>
                        {v.browser || "Inconnu"}
                      </td>
                      <td style={{ padding: "8px 6px", color: "#64748b", fontFamily: "monospace" }}>
                        {v.user_code || "ANON"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ fontSize: "12px", color: "#64748b", textAlign: "center", padding: "20px 0" }}>
              Aucune visite récente enregistrée pour le moment.
            </div>
          )}
        </div>
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
