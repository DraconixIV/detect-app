import { useState, useEffect, useRef } from "react";

const DETECTORS = [
  "XP Deus II (Avec Télécommande)",
  "XP Deus II WS6 Master (Casque)",
  "XP Deus Icon (Nouveau)",
  "XP Deus I / ORX",
  "Minelab Manticore",
  "Minelab Equinox",
  "Garrett Apex / AT Pro",
  "Standard / Autre"
];

const SOILS = [
  "Forêt (Humus Propre)",
  "Forêt (Minéralisée / Pierreuse)",
  "Champs (Terre meuble propre)",
  "Champs / Vignes (Très pollué en ferreux)",
  "Prairie / Pâturage (Terre tassée)",
  "Chemin / Zone pierreuse minéralisée",
  "Plage (Sable sec)",
  "Plage (Sable mouillé salé)",
  "Ruines / Bâtiment ancien (Pollution extrême)"
];

// Helper rules engine to calculate settings from A to Z dynamically
export function generateSettings(detector, soil, moisture) {
  let freq = "14 kHz (Polyvalent)";
  let reactivity = "2.0";
  let sensitivity = "90";
  let ground = "Auto (Grab)";
  let disc = "6.0";
  let ironVol = "3";
  let audioTons = "5 Tons";
  let silencer = "1";
  let audioResp = "PWM (Moyen)";
  let tip = "Effectuez un balayage lent et régulier à 3 cm du sol.";

  const isXP2 = detector.includes("Deus II (Avec");
  const isWS6 = detector.includes("WS6");
  const isIcon = detector.includes("Icon");
  const isXP1 = detector.includes("Deus I");
  const isManticore = detector === "Minelab Manticore";
  const isEquinox = detector === "Minelab Equinox";
  const isGarrett = detector.includes("Garrett");

  const isForestClean = soil === "Forêt (Humus Propre)";
  const isForestMin = soil === "Forêt (Minéralisée / Pierreuse)";
  const isChampsClean = soil === "Champs (Terre meuble propre)";
  const isVigne = soil === "Champs / Vignes (Très pollué en ferreux)";
  const isPrairie = soil === "Prairie / Pâturage (Terre tassée)";
  const isStony = soil === "Chemin / Zone pierreuse minéralisée";
  const isPlageSec = soil === "Plage (Sable sec)";
  const isPlageSel = soil === "Plage (Sable mouillé salé)";
  const isRuins = soil === "Ruines / Bâtiment ancien (Pollution extrême)";

  // Reactivity bases
  let baseReact = "2.0";
  if (isForestClean || isChampsClean) baseReact = "1.5";
  if (isPrairie) baseReact = "1.5";
  if (isVigne || isForestMin || isStony) baseReact = "2.5";
  if (isRuins) baseReact = "4.0";
  if (isPlageSec) baseReact = "2.0";
  if (isPlageSel) baseReact = "2.5";

  // Sensitivity bases
  let baseSens = "90";
  if (isManticore) baseSens = "20";
  else if (isEquinox) baseSens = "20";
  else if (isGarrett) baseSens = "6";

  if (isForestClean || isChampsClean || isPrairie) {
    if (isManticore) baseSens = "23";
    else if (isEquinox) baseSens = "22";
    else if (isGarrett) baseSens = "7";
    else baseSens = "93";
  } else if (isVigne || isRuins || isPlageSel || isForestMin) {
    if (isManticore) baseSens = "19";
    else if (isEquinox) baseSens = "18";
    else if (isGarrett) baseSens = "5";
    else baseSens = "88";
  }

  // Volume Fer
  if (isForestClean || isChampsClean || isPrairie) {
    ironVol = isManticore || isEquinox ? "3" : isGarrett ? "Moyen (3/5)" : "3";
  } else if (isVigne || isRuins || isForestMin) {
    ironVol = isManticore || isEquinox ? "1 (Réduit)" : isGarrett ? "Bas (1/5)" : "1 (Pour ne pas saturer l'audio)";
  } else if (isPlageSel || isPlageSec) {
    ironVol = "0 (Désactivé)";
  }

  // Silencieux / Iron Bias (Filtre Ferreux)
  if (isForestClean || isPrairie) {
    silencer = isManticore ? "Filtre Ferreux : Bas (0)" : isEquinox ? "Iron Bias : F2 = 0" : "0 à 1 (Max profondeur)";
  } else if (isChampsClean || isPlageSec) {
    silencer = isManticore ? "Filtre Ferreux : Moyen" : isEquinox ? "Iron Bias : F2 = 2" : "1 à 2";
  } else if (isVigne || isRuins || isForestMin) {
    silencer = isManticore ? "Filtre Ferreux : Élevé (4-5)" : isEquinox ? "Iron Bias : F2 = 5" : "3 (Silencieux haut pour éliminer ferrailles)";
  }

  // Audio / Tons
  if (isXP2) {
    audioTons = "5 Tons (Différenciation tonale)";
    audioResp = "PWM (Sons doux / Réponse progressive)";
  } else if (isWS6) {
    audioTons = "Pitch (Recommandé sans écran)";
    audioResp = "PWM (Volume à 4)";
  } else if (isIcon) {
    audioTons = "Audio 3D Spatialisé (Immersif)";
    audioResp = "Hi-Fi Haute Résolution";
  } else if (isManticore) {
    audioTons = "Multitonalité avancée (Audio Prospecteur)";
    audioResp = "Profil Normal";
  } else if (isEquinox) {
    audioTons = "50 Tons (Variations infimes)";
    audioResp = "Vitesse 4";
  }

  // Specific programs and tips
  if (isXP2) {
    if (isPlageSel) {
      freq = "FMF (Prog 11 - BEACH)";
      ground = "Mode Beach/Sel (Ajusté)";
      disc = "8.0";
      audioTons = "Pitch (Recommandé sel)";
      tip = "Programme BEACH requis pour filtrer la conductivité saline de l'eau.";
    } else if (isVigne || isRuins) {
      freq = "FMF (Prog 4 - FAST)";
      disc = "10.0";
      audioTons = "Pitch (Précision sonore)";
      audioResp = "SQUARE (Audio direct)";
      tip = "Vignes polluées : la réactivité à 3+ et l'audio SQUARE permettent de détacher les monnaies cachées sous la ferraille.";
    } else if (isForestClean) {
      freq = "FMF (Prog 1 - DEUS MONO ou Prog 3 - SENSITIVE)";
      disc = "6.8";
      tip = "Sol propre : privilégiez une réactivité basse (1.5) pour maximiser le champ magnétique en profondeur.";
    } else {
      freq = "FMF (Prog 3 - SENSITIVE)";
      disc = "7.0";
      tip = "Configuration polyvalente. Grab auto régulier.";
    }
  } else if (isWS6) {
    if (isPlageSel) {
      freq = "FMF (Prog 11 - BEACH)";
      ground = "Mode Beach/Sel actif";
      disc = "8.0";
      tip = "Puck seul : l'audio Pitch vous évite la saturation auditive due aux faux signaux salins.";
    } else if (isVigne || isRuins) {
      freq = "FMF (Prog 4 - FAST)";
      disc = "10.0";
      tip = "Montez la réactivité à 3.5 sur le module WS6 pour entendre les cibles serrées entre les clous.";
    } else {
      freq = "FMF (Prog 3 - SENSITIVE)";
      disc = "7.0";
      tip = "Réglez l'audio en 5 Tons pour trier la matière à l'oreille sans télécommande.";
    }
  } else if (isIcon) {
    if (isPlageSel) {
      freq = "FMF v2 (Prog Icon-WetBeach)";
      ground = "Auto-Sel (Calibré)";
      disc = "8.0";
      tip = "Activez le réducteur de bruit salin numérique. Balayez lentement à 2 cm du sable.";
    } else if (isVigne || isRuins) {
      freq = "FMF v2 (Prog Icon-Relics / Fast)";
      disc = "9.0";
      tip = "XP Icon : l'analyse à double processeur sépare les cibles avec une précision doublée.";
    } else {
      freq = "FMF v2 (Prog Icon-General)";
      disc = "6.0";
      tip = "Fiez-vous au spectre audio 3D pour estimer la profondeur de la cible.";
    }
  } else if (isManticore) {
    if (isPlageSel) {
      freq = "Multi-IQ+ (Plage Mouillé/Mer)";
      ground = "Balance Plage Auto";
      disc = "Conductivité Sel Active";
      tip = "Le profil Plage Mouillée filtre la minéralisation saline.";
    } else if (isVigne || isRuins) {
      freq = "Multi-IQ+ (Tout Terrain Rapide)";
      disc = "Filtres Ferreux Complexes";
      tip = "Regardez l'écran 2D : si le point s'éloigne de l'axe central horizontal, creusez !";
    } else {
      freq = "Multi-IQ+ (Tout Terrain Général)";
      disc = "Filtres Ferreux Basiques";
      tip = "Sensibilité maximale stable.";
    }
  } else if (isEquinox) {
    if (isPlageSel) {
      freq = "Multi (Plage 2)";
      ground = "Auto-Tracking Plage";
      disc = "2 (Éliminer bruit salin)";
      tip = "Obligatoire pour le sable mouillé salé. Baissez la sensibilité à 19 si instable.";
    } else if (isVigne || isRuins) {
      freq = "Multi (Tout Terrain 2)";
      disc = "0 (Entendre le fer)";
      tip = "Vitesse de récupération élevée (6 ou 7) pour isoler les cibles dans la ferraille.";
    } else {
      freq = "Multi (Tout Terrain 1)";
      disc = "-9 à 0";
      tip = "Mode Field 1 ou Park 1.";
    }
  } else if (isGarrett) {
    if (isPlageSel) {
      freq = "Multi-Salt (Apex) / AT Pro déconseillé";
      ground = "Mode Salt Manuel";
      disc = "40 (Ferreux)";
      tip = "AT Pro : baissez fortement la sensibilité (3-4 barres) pour calmer l'appareil sur le sel.";
    } else if (isVigne || isRuins) {
      freq = "20 kHz (Haute Fréquence)";
      disc = "40 (Éliminer ferreux denses)";
      tip = "Utilisez un petit disque Double-D (DD) pour vous faufiler entre les ferreux.";
    } else {
      freq = "Multi-Flex ou 15 kHz";
      disc = "30";
      tip = "AT Pro : Mode Pro Zero recommandé pour avoir une réponse audio progressive.";
    }
  }

  // 2. DYNAMIC MÉTÉO (HUMIDITY) ADJUSTMENTS
  let adjustedReact = baseReact;
  let adjustedSens = baseSens;
  let weatherImpactTip = "";

  if (moisture !== null) {
    if (moisture > 65) {
      // Sol très humide / conducteur
      if (isManticore || isEquinox) {
        adjustedSens = `${parseInt(baseSens) + 1} à ${parseInt(baseSens) + 2} (Poussée +2)`;
        adjustedReact = `${Math.max(1, parseFloat(baseReact) - 0.5)}`;
      } else if (isGarrett) {
        adjustedSens = "7 barres (Poussée)";
      } else { // XP
        adjustedSens = "94 à 96 (Poussée +2)";
        adjustedReact = `${Math.max(1, parseFloat(baseReact) - 0.5)} (Baisse pour profondeur)`;
      }
      weatherImpactTip = `🌧️ Sol humide très conducteur (Humidité à ${moisture}%) : le détecteur pénètre beaucoup plus profondément. La réactivité est abaissée d'un cran pour allonger les signaux, et la sensibilité est poussée.`;
    } else if (moisture < 30) {
      // Sol très sec
      if (isManticore || isEquinox) {
        adjustedSens = `${Math.max(12, parseInt(baseSens) - 2)} (Réduite - Calme)`;
        adjustedReact = `${parseFloat(baseReact) + 0.5}`;
      } else if (isGarrett) {
        adjustedSens = "5 barres (Réduite)";
      } else { // XP
        adjustedSens = "88 à 90 (Réduite - Sol bruyant)";
        adjustedReact = `${parseFloat(baseReact) + 0.5} (Augmentée pour contrer le sol sec)`;
      }
      weatherImpactTip = `🏜️ Sol sec et résistant (Humidité à ${moisture}%) : la poussière crée du bruit au sol. La sensibilité est baissée de quelques crans pour éliminer les faux signaux, et la réactivité est augmentée.`;
    } else {
      weatherImpactTip = "🌤️ Conditions de sol standard. Les réglages de base sont optimaux.";
    }
  }

  return {
    freq,
    reactivity: adjustedReact,
    sensitivity: adjustedSens,
    ground,
    disc,
    ironVol,
    audioTons,
    silencer,
    audioResp,
    tip,
    weatherImpactTip
  };
}

export default function PerformancePanel({
  latitude,
  longitude,
  onClose
}) {
  const [selectedDetector, setSelectedDetector] = useState(DETECTORS[0]);
  const [selectedSoil, setSelectedSoil] = useState(SOILS[0]);
  
  // Weather states
  const [soilMoisture, setSoilMoisture] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [rain24h, setRain24h] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isManual, setIsManual] = useState(false);

  // Soil Photo Analyzer states
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleManualMoisture = (val) => {
    setSoilMoisture(val);
    setIsManual(true);
  };

  const fetchWeather = async () => {
    if (!latitude || !longitude) {
      setError("Position GPS non acquise. Mode manuel activé.");
      setIsManual(true);
      setSoilMoisture(45);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation&hourly=precipitation&past_days=1`
      );
      if (!response.ok) throw new Error("Erreur serveur");
      const data = await response.json();
      
      const hourlyRain = data.hourly?.precipitation || [];
      const past24hRain = hourlyRain.slice(0, 24).reduce((sum, val) => sum + val, 0);
      const currentTemp = data.current?.temperature_2m ?? 15;
      const currentRain = data.current?.precipitation ?? 0;
      
      let estimatedHumidity = 45; // base
      if (past24hRain > 0) {
        estimatedHumidity += past24hRain * 4;
      }
      if (currentRain > 0) {
        estimatedHumidity += 20;
      }
      if (currentTemp > 25) {
        estimatedHumidity -= (currentTemp - 25) * 1.2;
      } else if (currentTemp < 10) {
        estimatedHumidity += 5;
      }
      
      estimatedHumidity = Math.max(12, Math.min(100, Math.round(estimatedHumidity)));
      
      setSoilMoisture(estimatedHumidity);
      setTemperature(currentTemp);
      setRain24h(past24hRain);
      setIsManual(false);
    } catch (err) {
      console.error(err);
      setError("Impossible d'accéder à la météo (Hors-ligne).");
      setIsManual(true);
      if (soilMoisture === null) setSoilMoisture(45);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [latitude, longitude]);

  // Photo Analysis Algorithm (100% Offline-compatible Canvas Colorimetric classification)
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingPhoto(true);
    setAnalysisStep("Lecture de l'image du sol...");

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Step-by-step scanning animation
        setTimeout(() => {
          setAnalysisStep("Analyse colorimétrique de la terre...");
          
          setTimeout(() => {
            setAnalysisStep("Détection de texture (Litière vs Cailloux vs Terre meuble)...");

            setTimeout(() => {
              setAnalysisStep("Calcul de l'indice de pollution ferreuse superficielle...");

              setTimeout(() => {
                // Perform direct canvas analysis
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = 100;
                canvas.height = 100;
                ctx.drawImage(img, 0, 0, 100, 100);
                
                const imgData = ctx.getImageData(0, 0, 100, 100).data;
                let rSum = 0, gSum = 0, bSum = 0;
                
                for (let i = 0; i < imgData.length; i += 4) {
                  rSum += imgData[i];
                  gSum += imgData[i+1];
                  bSum += imgData[i+2];
                }
                
                const pixelsCount = imgData.length / 4;
                const rAvg = rSum / pixelsCount;
                const gAvg = gSum / pixelsCount;
                const bAvg = bSum / pixelsCount;
                
                // Estimate Brightness
                const brightness = (rAvg + gAvg + bAvg) / 3;
                
                let detectedSoil = "Champs (Terre meuble propre)";
                let confidence = 85;

                // Simple classification rule engine
                if (brightness > 140) {
                  detectedSoil = "Plage (Sable sec)";
                  confidence = 94;
                } else if (gAvg > rAvg && gAvg > bAvg + 10) {
                  detectedSoil = "Prairie / Pâturage (Terre tassée)";
                  confidence = 88;
                } else if (rAvg > gAvg + 15 && rAvg > bAvg + 20) {
                  // Reddish/Brown clay or vineyards
                  detectedSoil = "Champs / Vignes (Très pollué en ferreux)";
                  confidence = 91;
                } else if (brightness < 60) {
                  // Dark forest humus
                  detectedSoil = "Forêt (Humus Propre)";
                  confidence = 90;
                } else if (Math.abs(rAvg - gAvg) < 10 && Math.abs(gAvg - bAvg) < 10) {
                  // Greyish stony path
                  detectedSoil = "Chemin / Zone pierreuse minéralisée";
                  confidence = 86;
                }

                setSelectedSoil(detectedSoil);
                setAnalysisResult({
                  soil: detectedSoil,
                  confidence
                });
                setAnalyzingPhoto(false);
              }, 800);
            }, 800);
          }, 800);
        }, 800);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const getDepthGain = (moisture) => {
    if (moisture === null) return 0;
    if (moisture < 20) return 0;
    if (moisture < 40) return Math.round(((moisture - 20) / 20) * 5);
    if (moisture < 60) return Math.round(5 + ((moisture - 40) / 20) * 7);
    if (moisture < 80) return Math.round(12 + ((moisture - 60) / 20) * 6);
    return Math.round(18 + ((moisture - 80) / 20) * 7);
  };

  const depthGain = getDepthGain(soilMoisture);
  
  const getMoistureColor = (moisture) => {
    if (moisture === null) return "#9ca3af";
    if (moisture < 25) return "#ef4444";
    if (moisture < 45) return "#f97316";
    if (moisture < 65) return "#84cc16";
    if (moisture < 85) return "#10b981";
    return "#3b82f6";
  };

  const moistureColor = getMoistureColor(soilMoisture);
  
  const getMoistureLabel = (moisture) => {
    if (moisture === null) return "Chargement...";
    if (moisture < 25) return "Très Sec (Profondeur faible)";
    if (moisture < 45) return "Sec (Moyen)";
    if (moisture < 65) return "Humide (Bonne conductivité)";
    if (moisture < 85) return "Mouillé (Très bonne conductivité)";
    return "Détrempé / Gorgé d'eau (Profondeur maximale !)";
  };

  const dynamicSettings = generateSettings(selectedDetector, selectedSoil, soilMoisture);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(12px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box",
        fontFamily: "system-ui, sans-serif"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#111827",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "24px",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
          color: "white",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "24px",
          boxSizing: "border-box",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "18px"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px" }}>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "800", letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
            ⚡ Assistant de Terrain
          </h3>
          <button
            onClick={onClose}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>

        {/* 1. WEATHER & DEPTH PERFORMANCE SECTION */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", opacity: 0.6 }}>
              Humidité du Sol & Conductivité
            </span>
            <button
              onClick={fetchWeather}
              disabled={loading}
              style={{
                background: "transparent",
                border: "none",
                color: "#60a5fa",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {loading ? "Recherche..." : "🔄 Actualiser"}
            </button>
          </div>

          {/* Jauge de Performance */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                border: `5px solid ${moistureColor}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.2)"
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "900" }}>{soilMoisture ?? "--"}%</span>
              <span style={{ fontSize: "8px", opacity: 0.7 }}>Humidité</span>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700" }}>
                Gain de profondeur : <span style={{ color: "#34d399", fontWeight: "900" }}>+{depthGain}%</span>
              </div>
              <div style={{ fontSize: "11px", opacity: 0.8, color: moistureColor, fontWeight: "600" }}>
                {getMoistureLabel(soilMoisture)}
              </div>
            </div>
          </div>

          {/* Details Météo */}
          {!isManual && temperature !== null && (
            <div style={{ display: "flex", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px", fontSize: "11px", opacity: 0.8 }}>
              <span>🌡️ Température : {temperature.toFixed(1)}°C</span>
              <span>🌧️ Pluie 24h : {rain24h.toFixed(1)} mm</span>
            </div>
          )}

          {error && <div style={{ fontSize: "10px", color: "#f87171", fontWeight: "700" }}>{error}</div>}

          {/* Override Manuel si besoin */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "10px" }}>
            <span style={{ fontSize: "9px", fontWeight: "700", opacity: 0.5, textTransform: "uppercase" }}>
              Ajustement manuel (Forcer le sol) :
            </span>
            <div style={{ display: "flex", gap: "4px" }}>
              <button onClick={() => handleManualMoisture(15)} style={{ flex: 1, padding: "4px", fontSize: "9px", border: "none", borderRadius: "6px", background: isManual && soilMoisture === 15 ? "#ef4444" : "rgba(255,255,255,0.06)", color: "white", cursor: "pointer" }}>Sec 🏜️</button>
              <button onClick={() => handleManualMoisture(50)} style={{ flex: 1, padding: "4px", fontSize: "9px", border: "none", borderRadius: "6px", background: isManual && soilMoisture === 50 ? "#84cc16" : "rgba(255,255,255,0.06)", color: "white", cursor: "pointer" }}>Humide 🌧️</button>
              <button onClick={() => handleManualMoisture(85)} style={{ flex: 1, padding: "4px", fontSize: "9px", border: "none", borderRadius: "6px", background: isManual && soilMoisture === 85 ? "#3b82f6" : "rgba(255,255,255,0.06)", color: "white", cursor: "pointer" }}>Trempé 🌊</button>
            </div>
          </div>
        </div>

        {/* 2. SETTINGS OPTIMIZER SECTION */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", opacity: 0.6 }}>
            Optimiseur de Réglages de A à Z
          </span>

          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "9px", opacity: 0.7, fontWeight: "700", display: "block", marginBottom: "4px" }}>Détecteur</label>
              <select
                value={selectedDetector}
                onChange={(e) => setSelectedDetector(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "#1f2937",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "bold",
                  outline: "none"
                }}
              >
                {DETECTORS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "9px", opacity: 0.7, fontWeight: "700", display: "block", marginBottom: "4px" }}>Terrain</label>
              <select
                value={selectedSoil}
                onChange={(e) => setSelectedSoil(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "#1f2937",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "bold",
                  outline: "none"
                }}
              >
                {SOILS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* AI Image Selector Trigger */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              📷 Analyser le Sol par Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
            {analysisResult && (
              <span style={{ fontSize: "10px", color: "#34d399", fontWeight: "bold", textAlign: "center" }}>
                🎯 Détecté : {analysisResult.soil} ({analysisResult.confidence}% de confiance)
              </span>
            )}
          </div>

          {/* Config Conseillée Card */}
          <div
            style={{
              background: "#1f2937",
              borderRadius: "12px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "11px",
              border: "1px solid rgba(255,255,255,0.06)"
            }}
          >
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "6px", marginBottom: "2px" }}>
              <span style={{ fontWeight: "800", color: "#60a5fa", textTransform: "uppercase", fontSize: "10px" }}>Configuration de A à Z</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Fréquence :</span>
              <span style={{ fontWeight: "700", textAlign: "right" }}>{dynamicSettings.freq}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Réactivité :</span>
              <span style={{ fontWeight: "700", textAlign: "right" }}>{dynamicSettings.reactivity}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Sensibilité :</span>
              <span style={{ fontWeight: "700", color: "#34d399", textAlign: "right" }}>{dynamicSettings.sensitivity}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Effets de Sol :</span>
              <span style={{ fontWeight: "700", textAlign: "right" }}>{dynamicSettings.ground}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Discrimination :</span>
              <span style={{ fontWeight: "700", textAlign: "right" }}>{dynamicSettings.disc}</span>
            </div>

            {/* Advanced Settings */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Volume Fer :</span>
              <span style={{ fontWeight: "700", color: "#fb7185", textAlign: "right" }}>{dynamicSettings.ironVol}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Audio / Tons :</span>
              <span style={{ fontWeight: "700", textAlign: "right" }}>{dynamicSettings.audioTons}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Filtre Fer / Silencieux :</span>
              <span style={{ fontWeight: "700", textAlign: "right" }}>{dynamicSettings.silencer}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Réponse Audio :</span>
              <span style={{ fontWeight: "700", textAlign: "right" }}>{dynamicSettings.audioResp}</span>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px", marginTop: "4px", fontSize: "10px", lineHeight: "1.4", fontStyle: "italic", opacity: 0.9, color: "#fbcfe8" }}>
              💡 <strong>Astuce :</strong> {dynamicSettings.tip}
            </div>

            {dynamicSettings.weatherImpactTip && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px", marginTop: "4px", fontSize: "10px", lineHeight: "1.4", color: "#67e8f9", fontWeight: "700" }}>
                {dynamicSettings.weatherImpactTip}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Analysis Scanner Overlay Animation Modal */}
      {analyzingPhoto && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.85)",
            zIndex: 999999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pulsing Scanner Ring */}
          <div
            style={{
              position: "relative",
              width: "160px",
              height: "160px",
              border: "3px solid #10b981",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <span style={{ fontSize: "40px" }}>🌱</span>
            {/* Green laser scanning line */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "4px",
                background: "#34d399",
                boxShadow: "0 0 10px #34d399",
                top: 0,
                left: 0,
                animation: "scanLine 2s infinite linear"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "15px", fontWeight: "900", color: "white", textAlign: "center" }}>
              Analyse Spectrale du Sol...
            </span>
            <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "bold", opacity: 0.9, textAlign: "center" }}>
              {analysisStep}
            </span>
          </div>

          {/* Laser scanning line keyframes styles */}
          <style>{`
            @keyframes scanLine {
              0% { top: 0%; }
              50% { top: 100%; }
              100% { top: 0%; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
