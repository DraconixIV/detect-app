import React, { useState, useEffect, useRef } from "react";
import { PRESET_CATEGORY_COLORS, materials, materialEmojis } from "../subCategories";
import { addPendingFind, getPendingFinds, deletePendingFind } from "../services/offlineStore";
import { loadCategoriesData, addCategory } from "../services/categoriesService";

export default function ChaosBenchmarkModal({
  isOpen,
  onClose,
  currentPosition,
  finds = [],
  setFinds,
  theme = "dark"
}) {
  const [fps, setFps] = useState(60);
  const [memoryMB, setMemoryMB] = useState(null);
  const [activeBotsCount, setActiveBotsCount] = useState(0);
  const [injectedFindsCount, setInjectedFindsCount] = useState(0);
  const [offlinePendingCount, setOfflinePendingCount] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [logMessages, setLogMessages] = useState([]);

  const botsIntervalRef = useRef(null);
  const fpsFrameRef = useRef({ count: 0, lastTime: performance.now() });

  const addLog = (msg) => {
    setLogMessages((prev) => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 19)
    ]);
  };

  // 1. Live FPS & Memory loop
  useEffect(() => {
    if (!isOpen) return;

    let animId;
    const calcFps = (now) => {
      fpsFrameRef.current.count++;
      if (now - fpsFrameRef.current.lastTime >= 1000) {
        const currentFps = Math.round(
          (fpsFrameRef.current.count * 1000) / (now - fpsFrameRef.current.lastTime)
        );
        setFps(currentFps);
        fpsFrameRef.current.count = 0;
        fpsFrameRef.current.lastTime = now;

        if (performance && performance.memory) {
          setMemoryMB(Math.round(performance.memory.usedJSHeapSize / (1024 * 1024)));
        }
      }
      animId = requestAnimationFrame(calcFps);
    };

    animId = requestAnimationFrame(calcFps);
    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  // Refresh offline queue count
  const refreshOfflineCount = async () => {
    try {
      const pending = await getPendingFinds();
      setOfflinePendingCount(pending.length);
    } catch (e) {
      // Ignored
    }
  };

  useEffect(() => {
    if (isOpen) refreshOfflineCount();
  }, [isOpen]);

  if (!isOpen) return null;

  // 2. Action: Spawn Virtual Bots in App (15, 50, 500)
  const handleStartBots = (count = 15) => {
    if (isSimulating) {
      clearInterval(botsIntervalRef.current);
      setIsSimulating(false);
      setActiveBotsCount(0);
      addLog("🛑 Arrêt de la simulation des bots.");
      return;
    }

    setIsSimulating(true);
    setActiveBotsCount(count);
    addLog(`🚀 Démarrage de ${count} prospecteurs virtuels simultanés sur la carte !`);

    const centerLat = currentPosition?.[0] || 48.8566;
    const centerLng = currentPosition?.[1] || 2.3522;

    const bots = Array.from({ length: count }).map((_, i) => ({
      id: `bot-${i + 1}`,
      name: `Prospecteur Bot #${i + 1}`,
      lat: centerLat + (Math.random() - 0.5) * (count > 50 ? 0.05 : 0.008),
      lng: centerLng + (Math.random() - 0.5) * (count > 50 ? 0.05 : 0.008),
      color: PRESET_CATEGORY_COLORS[i % PRESET_CATEGORY_COLORS.length]
    }));

    window.simulatedBots = bots;
    window.dispatchEvent(new CustomEvent("simulated-bots-updated", { detail: bots }));

    botsIntervalRef.current = setInterval(() => {
      bots.forEach((b) => {
        b.lat += (Math.random() - 0.49) * 0.00012;
        b.lng += (Math.random() - 0.49) * 0.00012;
      });
      window.simulatedBots = [...bots];
      window.dispatchEvent(new CustomEvent("simulated-bots-updated", { detail: [...bots] }));
    }, 1000);
  };

  // 3. Action: Bulk Inject Test Finds
  const handleInjectFinds = (count) => {
    const centerLat = currentPosition?.[0] || 48.8566;
    const centerLng = currentPosition?.[1] || 2.3522;
    const { categories } = loadCategoriesData();
    const catKeys = Object.keys(categories).length > 0 ? Object.keys(categories) : ["Monnaie", "Bijou", "Boucle", "Militaria", "Outil"];

    const newTestFinds = [];
    for (let i = 0; i < count; i++) {
      const cat = catKeys[i % catKeys.length];
      const mat = materials[i % materials.length];
      const fLat = centerLat + (Math.random() - 0.5) * 0.015;
      const fLng = centerLng + (Math.random() - 0.5) * 0.015;

      newTestFinds.push({
        id: `chaos-test-${Date.now()}-${i}`,
        title: `[BENCHMARK] ${cat} ${mat} #${i + 1}`,
        description: mat,
        category: cat,
        sub_category: "Benchmark Load Test",
        latitude: fLat,
        longitude: fLng,
        position: [fLat, fLng],
        date: new Date().toLocaleDateString("fr-FR"),
        isChaosBenchmark: true,
        finder_name: `Bot_Runner_${(i % 15) + 1}`
      });
    }

    if (setFinds) {
      setFinds((prev) => [...newTestFinds, ...prev]);
    }
    setInjectedFindsCount((prev) => prev + count);
    addLog(`✨ ${count} trouvailles de test injectées sur la carte.`);
  };

  // 4. Action: Test Offline Queue with 10 Finds
  const handleTestOfflineQueue = async () => {
    const centerLat = currentPosition?.[0] || 48.8566;
    const centerLng = currentPosition?.[1] || 2.3522;

    for (let i = 0; i < 5; i++) {
      await addPendingFind({
        position: [centerLat + (Math.random() - 0.5) * 0.005, centerLng + (Math.random() - 0.5) * 0.005],
        newTitle: `[OFFLINE-QUEUE] Trouvaille #${i + 1}`,
        newDescription: "Bronze",
        newCategory: "Monnaie",
        newSubCategory: "Gauloise",
        customDate: new Date().toLocaleDateString("fr-FR")
      }, null);
    }

    await refreshOfflineCount();
    addLog("💾 5 trouvailles ajoutées dans la file hors-ligne locale (IndexedDB).");
  };

  // 5. Action: 1-Click Total Cleanup
  const handleTotalCleanup = async () => {
    if (botsIntervalRef.current) {
      clearInterval(botsIntervalRef.current);
    }
    setIsSimulating(false);
    setActiveBotsCount(0);
    window.simulatedBots = [];
    window.dispatchEvent(new CustomEvent("simulated-bots-updated", { detail: [] }));

    if (setFinds) {
      setFinds((prev) => prev.filter((f) => !f.isChaosBenchmark && !String(f.id).startsWith("chaos-test-")));
    }
    setInjectedFindsCount(0);

    // Clear test offline queue
    try {
      const pending = await getPendingFinds();
      for (const p of pending) {
        if (p.newTitle && p.newTitle.includes("[OFFLINE-QUEUE]")) {
          await deletePendingFind(p.id);
        }
      }
      await refreshOfflineCount();
    } catch (e) {
      // Ignored
    }

    addLog("🧹 Nettoyage total effectué : base, carte et bots réinitialisés !");
  };

  const isLight = theme === "light";
  const bgModal = isLight ? "#ffffff" : "#0f172a";
  const textMain = isLight ? "#000000" : "#ffffff";
  const textSub = isLight ? "#1e293b" : "#ffffff";
  const cardBg = isLight ? "#f8fafc" : "#1e293b";
  const cardBorder = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.12)";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: bgModal,
          color: textMain,
          borderRadius: "24px",
          border: `1.5px solid ${cardBorder}`,
          width: "100%",
          maxWidth: "520px",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${cardBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>⚡</span>
            <div>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "900", color: textMain }}>
                Banc de Test et Chaos Simulator
              </h2>
              <p style={{ margin: 0, fontSize: "11px", color: textSub }}>
                Stress test 15 bots, charge Leaflet et audit de fluidité
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: `1px solid ${cardBorder}`,
              background: cardBg,
              color: textMain,
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Live Performance HUD */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "8px",
              padding: "12px",
              background: isLight ? "#eff6ff" : "rgba(37, 99, 235, 0.12)",
              borderRadius: "16px",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              textAlign: "center"
            }}
          >
            <div>
              <div style={{ fontSize: "10px", fontWeight: "800", color: textSub, textTransform: "uppercase" }}>
                Fluidité (FPS)
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "900",
                  color: fps >= 55 ? "#10b981" : fps >= 30 ? "#f59e0b" : "#ef4444"
                }}
              >
                {fps} FPS
              </div>
            </div>

            <div>
              <div style={{ fontSize: "10px", fontWeight: "800", color: textSub, textTransform: "uppercase" }}>
                Bots Actifs
              </div>
              <div style={{ fontSize: "20px", fontWeight: "900", color: activeBotsCount > 0 ? "#3b82f6" : textMain }}>
                {activeBotsCount}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "10px", fontWeight: "800", color: textSub, textTransform: "uppercase" }}>
                Mémoire JS
              </div>
              <div style={{ fontSize: "20px", fontWeight: "900", color: textMain }}>
                {memoryMB ? `${memoryMB} MB` : "N/A"}
              </div>
            </div>
          </div>

          {/* Action 1 : Bots Simulation */}
          <div
            style={{
              padding: "14px",
              background: cardBg,
              borderRadius: "16px",
              border: `1px solid ${cardBorder}`,
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "800", color: textMain }}>
                  🤖 Simulation de Prospecteurs ({activeBotsCount} actifs)
                </div>
                <div style={{ fontSize: "11px", color: textSub }}>
                  Déplacements GPS en direct à 1 Hz
                </div>
              </div>
              {isSimulating && (
                <button
                  onClick={() => handleStartBots(0)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#ef4444",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  Arrêter 🛑
                </button>
              )}
            </div>

            {!isSimulating && (
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => handleStartBots(15)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "8px",
                    border: `1px solid ${cardBorder}`,
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  15 Bots
                </button>
                <button
                  onClick={() => handleStartBots(50)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "8px",
                    border: `1px solid ${cardBorder}`,
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  50 Bots
                </button>
                <button
                  onClick={() => handleStartBots(500)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "8px",
                    border: `1px solid ${cardBorder}`,
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "800",
                    cursor: "pointer"
                  }}
                >
                  500 Bots 🔥
                </button>
              </div>
            )}
          </div>

          {/* Action 2 : Bulk Injection */}
          <div
            style={{
              padding: "14px",
              background: cardBg,
              borderRadius: "16px",
              border: `1px solid ${cardBorder}`,
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "800", color: textMain }}>
                  🗺️ Charge Massive de Repères ({injectedFindsCount} injectés)
                </div>
                <div style={{ fontSize: "11px", color: textSub }}>
                  Teste le rendu Leaflet, le clustering et le lag graphique
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => handleInjectFinds(50)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: `1px solid ${cardBorder}`,
                  background: isLight ? "#ffffff" : "rgba(255,255,255,0.06)",
                  color: textMain,
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                +50
              </button>
              <button
                onClick={() => handleInjectFinds(150)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: `1px solid ${cardBorder}`,
                  background: isLight ? "#ffffff" : "rgba(255,255,255,0.06)",
                  color: textMain,
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                +150
              </button>
              <button
                onClick={() => handleInjectFinds(500)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: `1px solid ${cardBorder}`,
                  background: isLight ? "#ffffff" : "rgba(255,255,255,0.06)",
                  color: textMain,
                  fontSize: "11px",
                  fontWeight: "800",
                  cursor: "pointer"
                }}
              >
                +500 Repères 🔥
              </button>
            </div>
          </div>

          {/* Action 3 : Offline Queue Simulator */}
          <div
            style={{
              padding: "14px",
              background: cardBg,
              borderRadius: "16px",
              border: `1px solid ${cardBorder}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontSize: "13px", fontWeight: "800", color: textMain }}>
                💾 File d'Attente Hors-Ligne ({offlinePendingCount} en attente)
              </div>
              <div style={{ fontSize: "11px", color: textSub }}>
                Simule l'enregistrement de trouvailles sans connexion
              </div>
            </div>
            <button
              onClick={handleTestOfflineQueue}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: "none",
                background: "#f59e0b",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              +5 Hors-ligne 💾
            </button>
          </div>

          {/* Action 4 : 1-Click Total Cleanup */}
          <div
            style={{
              padding: "14px",
              background: isLight ? "#fef2f2" : "rgba(239, 68, 68, 0.12)",
              borderRadius: "16px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontSize: "13px", fontWeight: "800", color: "#ef4444" }}>
                🧹 Nettoyage Total (1-Clic)
              </div>
              <div style={{ fontSize: "11px", color: textSub }}>
                Supprime immédiatement tous les bots et trouvailles de test
              </div>
            </div>
            <button
              onClick={handleTotalCleanup}
              style={{
                padding: "9px 14px",
                borderRadius: "10px",
                border: "none",
                background: "#ef4444",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "800",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)"
              }}
            >
              Purger Tout 🧹
            </button>
          </div>

          {/* Console Log Window */}
          <div
            style={{
              padding: "10px 12px",
              background: isLight ? "#0f172a" : "#020617",
              borderRadius: "12px",
              color: "#38bdf8",
              fontFamily: "monospace",
              fontSize: "11px",
              maxHeight: "120px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}
          >
            <div style={{ color: "#94a3b8", fontWeight: "bold" }}>Console d'événements :</div>
            {logMessages.length === 0 ? (
              <div style={{ color: "#64748b" }}>Prêt. Lancez une action pour observer les logs.</div>
            ) : (
              logMessages.map((msg, i) => <div key={i}>{msg}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
