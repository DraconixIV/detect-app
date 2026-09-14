import React, { useState, useEffect } from "react";

export default function SplashScreen({ onFinish, duration = 2200 }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out slightly before completion
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, Math.max(duration - 400, 500));

    const endTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [duration, onFinish]);

  return (
    <div
      onClick={() => {
        setIsFadingOut(true);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 300);
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "radial-gradient(circle at 50% 35%, #ffffff 0%, #f8fafc 60%, #f1f5f9 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#0f172a",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? "scale(1.04)" : "scale(1)",
        transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: isFadingOut ? "none" : "auto",
        cursor: "pointer",
        userSelect: "none"
      }}
    >
      <style>{`
        @keyframes radarPulse1 {
          0% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes radarPulse2 {
          0% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.8);
            opacity: 0;
          }
        }
        @keyframes logoPop {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          60% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes textSlideUp {
          0% {
            transform: translateY(18px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes shineSweep {
          0% {
            transform: translateX(-150%) skewX(-25deg);
          }
          100% {
            transform: translateX(250%) skewX(-25deg);
          }
        }
        @keyframes progressIndeterminate {
          0% {
            left: -30%;
            width: 30%;
          }
          50% {
            left: 20%;
            width: 60%;
          }
          100% {
            left: 100%;
            width: 30%;
          }
        }
      `}</style>

      {/* Main Animated Icon Container */}
      <div
        style={{
          position: "relative",
          width: "130px",
          height: "130px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "28px"
        }}
      >
        {/* Sonar Radar Wave 1 */}
        <div
          style={{
            position: "absolute",
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            border: "2px solid rgba(37, 99, 235, 0.4)",
            background: "rgba(37, 99, 235, 0.06)",
            animation: "radarPulse1 2.2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite",
            pointerEvents: "none"
          }}
        />

        {/* Sonar Radar Wave 2 */}
        <div
          style={{
            position: "absolute",
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            border: "2px solid rgba(59, 130, 246, 0.3)",
            animation: "radarPulse2 2.2s cubic-bezier(0.1, 0.8, 0.3, 1) 0.6s infinite",
            pointerEvents: "none"
          }}
        />

        {/* Central App Emblem Card */}
        <div
          style={{
            position: "relative",
            width: "92px",
            height: "92px",
            borderRadius: "24px",
            background: "#ebe3d3",
            boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.25), 0 0 0 1.5px rgba(245, 158, 11, 0.3) inset",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "logoPop 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            overflow: "hidden"
          }}
        >
          {/* Subtle Shine Reflection */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              animation: "shineSweep 2.2s infinite ease-in-out",
              pointerEvents: "none",
              zIndex: 2
            }}
          />

          {/* Official GeoProspect Icon */}
          <img
            src="/icon-192.png"
            alt="GeoProspect Emblem"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "24px"
            }}
          />
        </div>
      </div>

      {/* App Branding Typography */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          textAlign: "center",
          animation: "textSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both"
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "26px",
            fontWeight: "900",
            letterSpacing: "-0.6px",
            color: "#0f172a",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <span>Geo</span>
          <span style={{ color: "#2563eb" }}>Prospect</span>
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: "500",
            color: "#64748b",
            letterSpacing: "0.2px",
            maxWidth: "270px",
            lineHeight: "1.4"
          }}
        >
          L'application tout-en-un des passionnés de détection
        </p>
      </div>

      {/* Modern Indeterminate Progress Bar */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          width: "120px",
          height: "4px",
          borderRadius: "999px",
          background: "rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
          animation: "textSlideUp 0.8s ease 0.3s both"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            borderRadius: "999px",
            background: "linear-gradient(90deg, #2563eb, #60a5fa)",
            animation: "progressIndeterminate 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite"
          }}
        />
      </div>
    </div>
  );
}
