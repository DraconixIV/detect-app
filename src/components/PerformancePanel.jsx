import { useState, useEffect } from "react";

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
  "Forêt (Humus)",
  "Champs labourés (Terre meuble)",
  "Prairie (Terre tassée)",
  "Plage (Sable sec)",
  "Plage (Sable mouillé salé)",
  "Pollué / Minéralisé"
];

const SETTINGS_MATRIX = {
  "XP Deus II (Avec Télécommande)": {
    "Forêt (Humus)": {
      freq: "Multifréquence FMF (Max Profondeur)",
      reactivity: "1.5 à 2 (Sol propre, favorise la profondeur)",
      sensitivity: "93 à 95",
      ground: "Grab automatique (Stabiliser vers 85-88)",
      disc: "6.8 (Éliminer les petits ferreux)",
      tip: "Utilisez le programme 1 (DEUS MONO) ou 3 (SENSITIVE FT) pour une excellente pénétration."
    },
    "Champs labourés (Terre meuble)": {
      freq: "Multifréquence FMF (Polyvalence)",
      reactivity: "2.5 (Sol meuble, réactivité moyenne)",
      sensitivity: "90 à 92",
      ground: "Grab automatique",
      disc: "7.0",
      tip: "Balayez parallèlement aux sillons pour garder une hauteur constante du disque."
    },
    "Prairie (Terre tassée)": {
      freq: "Multifréquence FMF (Haute pénétration)",
      reactivity: "1.5 (Profondeur maximum sur cibles tassées)",
      sensitivity: "92 à 94",
      ground: "Tracking actif",
      disc: "6.5",
      tip: "Excellent sol pour le programme FMF DEEP HIGH. Balayez lentement."
    },
    "Plage (Sable sec)": {
      freq: "Multifréquence FMF (Spécial Or/Bijoux)",
      reactivity: "2.0",
      sensitivity: "93 à 95",
      ground: "Manuel (Ajuster vers 80)",
      disc: "5.5 (Pour chasser les très petits bijoux en or)",
      tip: "Utilisez le programme 9 (DIVING) ou 2 (SENSITIVE) pour accrocher l'or fin."
    },
    "Plage (Sable mouillé salé)": {
      freq: "Multifréquence FMF (Filtre Sel Actif)",
      reactivity: "2.5 (Réduction des faux signaux du sel)",
      sensitivity: "85 à 88 (Baisser si faux signaux)",
      ground: "Mode Plage/Sel actif (Balance vers 0-14)",
      disc: "8.0",
      tip: "Utilisez obligatoirement le programme 11 (BEACH) ou 12 (BEACH SENS). Évitez les chocs du disque sur le sable mouillé."
    },
    "Pollué / Minéralisé": {
      freq: "Multifréquence FMF (Haute Fréquence)",
      reactivity: "3 à 4 (Séparation ultra-rapide des cibles)",
      sensitivity: "88 à 90",
      ground: "Grab automatique fréquent",
      disc: "10.0 (Éliminer les ferreux denses)",
      tip: "Utilisez le programme 4 (FAST) ou le programme PITCH. Écoutez les signaux courts cachés sous les ferreux."
    }
  },
  "XP Deus II WS6 Master (Casque)": {
    "Forêt (Humus)": {
      freq: "FMF (Prog 1 - Deus Mono ou Prog 3 - Sensitive)",
      reactivity: "1.5 (Maximise la profondeur sur sol propre)",
      sensitivity: "92 à 94",
      ground: "Grab au sol (Menu SOL du WS6)",
      disc: "6.8",
      tip: "AUDIO : Utilisez le mode '5 Tons' ou 'Pitch' pour analyser la conductivité uniquement à l'oreille. Pas de télécommande = fiez-vous au son aigu."
    },
    "Champs labourés (Terre meuble)": {
      freq: "FMF (Prog 3 - Sensitive)",
      reactivity: "2.5 (Bonne coupure entre ferreux et bonne cible)",
      sensitivity: "90",
      ground: "Grab rapide au sol",
      disc: "7.0",
      tip: "AUDIO : Le mode 'Pitch' est idéal ici car il détache parfaitement la cible sonore des bruits de sol remué."
    },
    "Prairie (Terre tassée)": {
      freq: "FMF (Prog 5 - Deep High)",
      reactivity: "1.5 (Balayage lent obligatoire)",
      sensitivity: "92",
      ground: "Tracking actif",
      disc: "6.5",
      tip: "AUDIO : Le mode 'Full Tones' est conseillé. Il traduit la conductivité en fréquences de son (grave pour fer, très aigu pour argent)."
    },
    "Plage (Sable sec)": {
      freq: "FMF (Prog 2 - Sensitive)",
      reactivity: "2.0",
      sensitivity: "93",
      ground: "Manuel (Ajuster vers 80)",
      disc: "5.5",
      tip: "AUDIO : Mettez le volume des tons faibles à 3 ou 4 pour bien entendre les petits bijoux légers en or profonds."
    },
    "Plage (Sable mouillé salé)": {
      freq: "FMF (Prog 11 - Beach)",
      reactivity: "2.5 (Stabilité accrue)",
      sensitivity: "85 (Réduire si crépitements du sel)",
      ground: "Mode Beach/Sel actif sur le WS6",
      disc: "8.0",
      tip: "Prog 11 obligatoire. Si l'eau salée sature l'audio, passez l'option Sol en manuel sur le WS6 et réduisez la sensibilité."
    },
    "Pollué / Minéralisé": {
      freq: "FMF (Prog 4 - Fast)",
      reactivity: "3 à 4 (Tri ultra-rapide)",
      sensitivity: "88",
      ground: "Grab fréquent",
      disc: "10.0",
      tip: "AUDIO : Montez la réactivité à 3.5 via le bouton du module WS6. Le mode 'Pitch' vous fera entendre les bonnes cibles serrées contre les clous."
    }
  },
  "XP Deus Icon (Nouveau)": {
    "Forêt (Humus)": {
      freq: "FMF v2 (Prog Icon-Deep)",
      reactivity: "1.0 (Performances de profondeur maximale)",
      sensitivity: "96",
      ground: "Auto-Tracking Intelligent",
      disc: "5.0 (Discrimination chirurgicale)",
      tip: "Technologie Icon : Activez le mode audio spatialisé 3D (Audio 3D) sur votre casque pour mieux localiser la profondeur de la cible."
    },
    "Champs labourés (Terre meuble)": {
      freq: "FMF v2 (Prog Icon-General)",
      reactivity: "2.0",
      sensitivity: "92",
      ground: "Auto-Track",
      disc: "6.0",
      tip: "L'analyse spectrale du nouveau XP Icon élimine les faux signaux dus à l'effet de sol irrégulier du labour."
    },
    "Prairie (Terre tassée)": {
      freq: "FMF v2 (Prog Icon-Coins)",
      reactivity: "1.5",
      sensitivity: "94",
      ground: "Auto-Track",
      disc: "5.5",
      tip: "Utilisez le mode audio multiton HD pour entendre la pureté et la clarté des métaux nobles profonds."
    },
    "Plage (Sable sec)": {
      freq: "FMF v2 (Prog Icon-Gold)",
      reactivity: "2.0",
      sensitivity: "95",
      ground: "Manuel",
      disc: "4.0",
      tip: "Sensibilité maximale recommandée pour accrocher les micro-alliages et chaînettes fines."
    },
    "Plage (Sable mouillé salé)": {
      freq: "FMF v2 (Prog Icon-WetBeach)",
      reactivity: "2.5",
      sensitivity: "88",
      ground: "Auto-Plage (Calibrage Sel)",
      disc: "8.0",
      tip: "Activez le filtre de réduction du bruit salin numérique. Balayez lentement à 2 cm du sable."
    },
    "Pollué / Minéralisé": {
      freq: "FMF v2 (Prog Icon-Relics / Fast)",
      reactivity: "4.0 (Vitesse d'analyse instantanée)",
      sensitivity: "90",
      ground: "Grab fréquent",
      disc: "9.0",
      tip: "L'Icon sépare les métaux avec une résolution doublée. Rapprochez votre balayage pour ne rien rater."
    }
  },
  "XP Deus I / ORX": {
    "Forêt (Humus)": {
      freq: "14 kHz à 18 kHz (Polyvalence)",
      reactivity: "2 (Bon compromis profondeur/séparation)",
      sensitivity: "90 à 92",
      ground: "Manuel (Réglage à 87)",
      disc: "6.0",
      tip: "Disque haute fréquence (HF) recommandé. Le programme DEUS FAST est idéal si beaucoup de ferreux."
    },
    "Champs labourés (Terre meuble)": {
      freq: "12 kHz à 14 kHz",
      reactivity: "2.5",
      sensitivity: "88 à 90",
      ground: "Grab automatique",
      disc: "7.0",
      tip: "Un balayage régulier et lent compense les irrégularités de la terre labourée."
    },
    "Prairie (Terre tassée)": {
      freq: "8 kHz à 12 kHz (Favorise les cibles profondes)",
      reactivity: "1.5 (Profondeur accrue)",
      sensitivity: "92",
      ground: "Tracking",
      disc: "5.5",
      tip: "Utilisez une réactivité basse pour capter les monnaies installées depuis longtemps."
    },
    "Plage (Sable sec)": {
      freq: "15 kHz à 30 kHz (Sensibilité à l'or)",
      reactivity: "2",
      sensitivity: "90",
      ground: "Manuel (82)",
      disc: "4.5",
      tip: "Creusez sur tous les indices faibles et stables pour ne pas rater l'or fin."
    },
    "Plage (Sable mouillé salé)": {
      freq: "Mode Wet Beach requis (ORX) ou 14 kHz",
      reactivity: "3",
      sensitivity: "75 à 80 (Baisser fortement)",
      ground: "Mode Plage Actif (Balance 0-25)",
      disc: "8.5",
      tip: "Le Deus I souffre sur sable noir/salé. Diminuez la sensibilité pour calmer le détecteur."
    },
    "Pollué / Minéralisé": {
      freq: "28 kHz à 50 kHz (Disque HF Elliptique)",
      reactivity: "3 à 4",
      sensitivity: "85",
      ground: "Manuel fréquent",
      disc: "8.0",
      tip: "Utilisez un disque Double-D (DD) de petite taille pour trier au mieux les cibles."
    }
  },
  "Minelab Manticore": {
    "Forêt (Humus)": {
      freq: "Multi-IQ+ (Tout Terrain Général)",
      reactivity: "2 à 3 (Réactivité basse)",
      sensitivity: "22 à 24",
      ground: "Auto (Grab)",
      disc: "Filtres Ferreux désactivés",
      tip: "Utilisez le profil Tout Terrain Général et réglez la sensibilité au maximum stable."
    },
    "Champs labourés (Terre meuble)": {
      freq: "Multi-IQ+ (Tout Terrain Rapide)",
      reactivity: "4 (Réactivité moyenne-haute)",
      sensitivity: "20 à 22",
      ground: "Auto",
      disc: "Filtres Ferreux Basiques",
      tip: "Le profil Tout Terrain Rapide aide à isoler les signaux dans la terre remuée."
    },
    "Prairie (Terre tassée)": {
      freq: "Multi-IQ+ (Tout Terrain Profond)",
      reactivity: "2 (Maximise le champ magnétique vertical)",
      sensitivity: "23 à 25",
      ground: "Auto-Tracking",
      disc: "Aucun",
      tip: "Balayez au ras de l'herbe courte pour capter les signaux les plus profonds."
    },
    "Plage (Sable sec)": {
      freq: "Multi-IQ+ (Plage Sec)",
      reactivity: "3",
      sensitivity: "22 à 24",
      ground: "Auto",
      disc: "Minimal",
      tip: "Idéal pour localiser l'or et les bijoux modernes dans le sable sec."
    },
    "Plage (Sable mouillé salé)": {
      freq: "Multi-IQ+ (Plage Mouillé/Mer)",
      reactivity: "3",
      sensitivity: "18 à 20 (Sensibilité réduite)",
      ground: "Balance Plage Auto",
      disc: "Filtres Conductivité Sel Actifs",
      tip: "Utilisez obligatoirement le programme Plage pour filtrer le sel et la conductivité saline."
    },
    "Pollué / Minéralisé": {
      freq: "Multi-IQ+ (Tout Terrain Rapide)",
      reactivity: "5 à 6 (Réactivité maximale)",
      sensitivity: "18 à 21",
      ground: "Auto",
      disc: "Filtres Ferreux Complexes",
      tip: "Observez la carte 2D de la Manticore : si le point rouge est sous la ligne médiane, c'est du fer !"
    }
  },
  "Minelab Equinox": {
    "Forêt (Humus)": {
      freq: "Multi (Tout Terrain 1)",
      reactivity: "2 à 3 (Vitesse de récupération basse)",
      sensitivity: "21 à 23",
      ground: "Auto (Grab)",
      disc: "-9 à 0",
      tip: "Le mode Park 1 ou Field 1 convient parfaitement pour les bois propres."
    },
    "Champs labourés (Terre meuble)": {
      freq: "Multi (Tout Terrain 2)",
      reactivity: "4 à 5",
      sensitivity: "19 à 21",
      ground: "Auto",
      disc: "-5 à 0",
      tip: "Le mode Field 2 est plus sensible aux petites cibles à haute fréquence."
    },
    "Prairie (Terre tassée)": {
      freq: "Multi (Tout Terrain 1)",
      reactivity: "2",
      sensitivity: "22 à 24",
      ground: "Tracking",
      disc: "-9 à 0",
      tip: "Écoutez les signaux très profonds et peu audibles, la réactivité 2 aide à les lisser."
    },
    "Plage (Sable sec)": {
      freq: "Multi (Plage 1)",
      reactivity: "3",
      sensitivity: "22",
      ground: "Auto",
      disc: "0",
      tip: "Le profil Plage 1 est calibré pour le sable sec et maximise la recherche de bijoux."
    },
    "Plage (Sable mouillé salé)": {
      freq: "Multi (Plage 2)",
      reactivity: "4",
      sensitivity: "18 à 20",
      ground: "Auto-Tracking",
      disc: "2 (Élimine le bruit salin)",
      tip: "Plage 2 est obligatoire pour le sable gorgé d'eau de mer. Baissez la sensibilité si l'appareil crépite."
    },
    "Pollué / Minéralisé": {
      freq: "Multi (Tout Terrain 2)",
      reactivity: "6 à 7 (Vitesse de récupération élevée)",
      sensitivity: "18 à 20",
      ground: "Auto",
      disc: "0 (Accepter le fer en bruit sonore)",
      tip: "Utilisez le mode 5 ou 50 tons pour entendre les variations de conductivité dans les ferreux."
    }
  },
  "Garrett Apex / AT Pro": {
    "Forêt (Humus)": {
      freq: "Multi-Flex ou 15 kHz (Profondeur)",
      reactivity: "Standard / Vitesse de récupération moyenne",
      sensitivity: "6 à 7 barres",
      ground: "Grab automatique (Fast Grab)",
      disc: "Mode Custom (Zero Discrimination)",
      tip: "AT Pro : Mode Pro Zero recommandé pour avoir une réponse audio proportionnelle et profonde."
    },
    "Champs labourés (Terre meuble)": {
      freq: "Multi-Flex ou 20 kHz",
      reactivity: "Standard",
      sensitivity: "5 à 6 barres",
      ground: "Fast Grab",
      disc: "35 (Fer)",
      tip: "Balayez à plat pour éviter les signaux fantômes sur les mottes de terre."
    },
    "Prairie (Terre tassée)": {
      freq: "Multi-Flex ou 10 kHz (Grosses monnaies)",
      reactivity: "Standard",
      sensitivity: "7 barres",
      ground: "Fast Grab",
      disc: "30",
      tip: "Une fréquence plus basse est idéale pour dégoter de grosses pièces en profondeur."
    },
    "Plage (Sable sec)": {
      freq: "Multi-Salt ou 20 kHz",
      reactivity: "Standard",
      sensitivity: "6 barres",
      ground: "Fast Grab",
      disc: "30",
      tip: "L'Apex dispose d'une multifréquence Multi-Flex très utile sur le sable sec."
    },
    "Plage (Sable mouillé salé)": {
      freq: "Multi-Salt obligatoire (Apex) / AT Pro déconseillé",
      reactivity: "Standard",
      sensitivity: "4 à 5 barres (Faible)",
      ground: "Mode Salt Actif (Grab manuel obligatoire)",
      disc: "40",
      tip: "AT Pro : l'appareil est instable sur le sel. Baissez énormément la sensibilité pour pouvoir l'utiliser."
    },
    "Pollué / Minéralisé": {
      freq: "20 kHz ou Multi-Flex (Apex)",
      reactivity: "Standard (Vitesse fixe)",
      sensitivity: "5 barres",
      ground: "Fast Grab régulier",
      disc: "40 (Ferreux masqués)",
      tip: "Utilisez un disque Double-D (DD) de petite taille pour trier au mieux les cibles."
    }
  },
  "Standard / Autre": {
    "Forêt (Humus)": {
      freq: "12 kHz à 15 kHz",
      reactivity: "Moyenne / Standard",
      sensitivity: "90%",
      ground: "Pompage automatique",
      disc: "Basique (Éliminer ferreux)",
      tip: "Balayez régulièrement à 3 cm au-dessus de la litière de feuilles mortes."
    },
    "Champs labourés (Terre meuble)": {
      freq: "14 kHz",
      reactivity: "Moyenne-Haute",
      sensitivity: "85%",
      ground: "Automatique",
      disc: "Moyenne",
      tip: "Adaptez la hauteur du disque pour ne pas heurter le relief de la terre."
    },
    "Prairie (Terre tassée)": {
      freq: "8 kHz à 12 kHz",
      reactivity: "Moyenne-Basse",
      sensitivity: "90%",
      ground: "Automatique",
      disc: "Basse",
      tip: "Ralentissez le balayage pour laisser au détecteur le temps d'analyser les cibles profondes."
    },
    "Plage (Sable sec)": {
      freq: "15 kHz+",
      reactivity: "Moyenne",
      sensitivity: "90%",
      ground: "Manuel",
      disc: "Basse",
      tip: "Recherchez de préférence les zones de serviettes et de passage."
    },
    "Plage (Sable mouillé salé)": {
      freq: "Multifréquence requise ou mode Plage spécifique",
      reactivity: "Moyenne",
      sensitivity: "50% (Baisser si instable)",
      ground: "Mode Plage / Sable mouillé",
      disc: "Moyenne",
      tip: "Si le détecteur n'est pas étanche ou pas spécialisé plage, restez de préférence sur le sable sec."
    },
    "Pollué / Minéralisé": {
      freq: "18 kHz+",
      reactivity: "Haute",
      sensitivity: "80%",
      ground: "Automatique fréquent",
      disc: "Moyenne-Haute",
      tip: "Écoutez les sons nets et stables même s'ils sont accompagnés d'un grognement ferreux."
    }
  }
};

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

  // Manual moisture selection override
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
        estimatedHumidity += past24hRain * 4; // +4% par mm
      }
      if (currentRain > 0) {
        estimatedHumidity += 20; // Pluie active
      }
      if (currentTemp > 25) {
        estimatedHumidity -= (currentTemp - 25) * 1.2; // séchage chaud
      } else if (currentTemp < 10) {
        estimatedHumidity += 5; // froid
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

  // Compute depth gain index
  const getDepthGain = (moisture) => {
    if (moisture === null) return 0;
    if (moisture < 20) return 0;
    if (moisture < 40) return Math.round(((moisture - 20) / 20) * 5); // 0-5%
    if (moisture < 60) return Math.round(5 + ((moisture - 40) / 20) * 7); // 5-12%
    if (moisture < 80) return Math.round(12 + ((moisture - 60) / 20) * 6); // 12-18%
    return Math.round(18 + ((moisture - 80) / 20) * 7); // 18-25%
  };

  const depthGain = getDepthGain(soilMoisture);
  
  // Get color code for gauge
  const getMoistureColor = (moisture) => {
    if (moisture === null) return "#9ca3af";
    if (moisture < 25) return "#ef4444"; // Rouge (Très sec)
    if (moisture < 45) return "#f97316"; // Orange (Sec)
    if (moisture < 65) return "#84cc16"; // Vert clair (Humide)
    if (moisture < 85) return "#10b981"; // Vert émeraude (Humide/mouillé)
    return "#3b82f6"; // Bleu (Détrempé)
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

  const activeSettings = SETTINGS_MATRIX[selectedDetector]?.[selectedSoil] || {};

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
            Optimiseur de Réglages
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
              <span style={{ fontWeight: "800", color: "#60a5fa", textTransform: "uppercase", fontSize: "10px" }}>Configuration Conseillée</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Fréquence :</span>
              <span style={{ fontWeight: "700", textAlign: "right" }}>{activeSettings.freq}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Réactivité :</span>
              <span style={{ fontWeight: "700", textAlign: "right" }}>{activeSettings.reactivity}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Sensibilité :</span>
              <span style={{ fontWeight: "700", color: "#34d399", textAlign: "right" }}>{activeSettings.sensitivity}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Effets de Sol :</span>
              <span style={{ fontWeight: "700", textAlign: "right" }}>{activeSettings.ground}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.6 }}>Discrimination :</span>
              <span style={{ fontWeight: "700", textAlign: "right" }}>{activeSettings.disc}</span>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px", marginTop: "4px", fontSize: "10px", lineHeight: "1.4", fontStyle: "italic", opacity: 0.9, color: "#fbcfe8" }}>
              💡 <strong>Astuce :</strong> {activeSettings.tip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
