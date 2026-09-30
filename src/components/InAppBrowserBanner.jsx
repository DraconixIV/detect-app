import React, { useState, useEffect } from "react";

export function detectInAppBrowser() {
  if (typeof window === "undefined" || !window.navigator) return { isInApp: false, appName: "" };
  const ua = navigator.userAgent || navigator.vendor || window.opera || "";

  if (/FBAN|FBAV/i.test(ua)) return { isInApp: true, appName: "Facebook" };
  if (/Instagram/i.test(ua)) return { isInApp: true, appName: "Instagram" };
  if (/TikTok|ByteDance/i.test(ua)) return { isInApp: true, appName: "TikTok" };
  if (/Snapchat/i.test(ua)) return { isInApp: true, appName: "Snapchat" };
  if (/Twitter|X\//i.test(ua)) return { isInApp: true, appName: "X (Twitter)" };
  if (/Line/i.test(ua)) return { isInApp: true, appName: "Line" };
  if (/LinkedIn/i.test(ua)) return { isInApp: true, appName: "LinkedIn" };
  if (/MicroMessenger/i.test(ua)) return { isInApp: true, appName: "WeChat" };

  return { isInApp: false, appName: "" };
}

export default function InAppBrowserBanner() {
  const [inAppInfo, setInAppInfo] = useState({ isInApp: false, appName: "" });
  const [isDismissed, setIsDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem("geoprospect_inapp_dismissed");
      if (dismissed === "true") {
        setIsDismissed(true);
      }
      const info = detectInAppBrowser();
      setInAppInfo(info);
    } catch {
      // Fallback
    }
  }, []);

  if (!inAppInfo.isInApp || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("geoprospect_inapp_dismissed", "true");
    } catch {}
  };

  const handleCopyLink = async () => {
    try {
      const url = window.location.href.split("?")[0];
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.warn("Copy failed", e);
    }
  };

  const isAndroid = /Android/i.test(navigator.userAgent || "");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        color: "#ffffff",
        borderBottom: "2px solid #f59e0b",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.6)",
        padding: "12px 14px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        animation: "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>🧭</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "900", color: "#fbbf24", letterSpacing: "-0.2px" }}>
                Navigateur {inAppInfo.appName || "interne"} détecté
              </div>
              <div style={{ fontSize: "11px", color: "#e2e8f0", marginTop: "2px", lineHeight: "1.35" }}>
                Le signal <strong>GPS</strong> et l'installation sont <strong>bloqués</strong> dans {inAppInfo.appName || "cette application"}.
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "#94a3b8",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              cursor: "pointer",
              flexShrink: 0
            }}
            title="Ignorer"
          >
            ✕
          </button>
        </div>

        {/* Action instructions */}
        <div
          style={{
            marginTop: "10px",
            padding: "8px 10px",
            borderRadius: "8px",
            background: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            fontSize: "11.5px",
            color: "#fef3c7",
            lineHeight: "1.4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px"
          }}
        >
          <div>
            👉 Appuyez sur les <strong>3 points (⋮)</strong> tout en haut à droite et choisissez <strong>« Ouvrir dans {isAndroid ? "Chrome" : "Safari / Navigateur"} »</strong>.
          </div>
          <span style={{ fontSize: "16px", flexShrink: 0 }}>↗️</span>
        </div>

        {/* Copy link button */}
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <button
            onClick={handleCopyLink}
            style={{
              flex: 1,
              padding: "7px 10px",
              borderRadius: "8px",
              background: copied ? "#059669" : "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s"
            }}
          >
            <span>{copied ? "✓" : "📋"}</span>
            {copied ? "Lien copié dans le presse-papier !" : "Copier le lien de l'appli"}
          </button>
        </div>
      </div>
    </div>
  );
}
