import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../supabase";

export default function WikiPanel({ finds, photos, onOpenFindDetails, onUpdate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("Tous");
  const [selectedEpoch, setSelectedEpoch] = useState("Toutes");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [flippedCoins, setFlippedCoins] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");

  // Sync editedDescription when selectedCoin changes
  useEffect(() => {
    if (selectedCoin) {
      setEditedDescription(selectedCoin.clean_description || "");
      setIsEditing(false);
    }
  }, [selectedCoin]);

  // 1. Filter findings to only show Coins ("Monnaie")
  const coins = useMemo(() => {
    return finds.filter((f) => f.category === "Monnaie");
  }, [finds]);

  // Toggle flipping of a coin preview
  const toggleFlip = (coinId, e) => {
    e.stopPropagation();
    setFlippedCoins((prev) => ({
      ...prev,
      [coinId]: !prev[coinId]
    }));
  };

  const handleSaveDescription = async () => {
    try {
      const { error } = await supabase
        .from("finds")
        .update({ clean_description: editedDescription })
        .eq("id", selectedCoin.id);

      if (error) throw error;

      selectedCoin.clean_description = editedDescription;
      setIsEditing(false);
      alert("Notice numismatique enregistrée ! ✅");
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const handleGenerateSheetInsideMuseum = () => {
    const cleanTitleLower = (selectedCoin.title || "").toLowerCase();
    const matLower = (selectedCoin.description || "").toLowerCase();
    const subCatLower = (selectedCoin.sub_category || "").toLowerCase();

    let regime = "Indéterminé";
    let epoque = "Inconnue";
    let aversDesc = "Buste ou portrait du souverain / profil représenté avec légendes circulaires.";
    let reversDesc = "Armoiries, croix ou symbole de l'émetteur avec légendes et millésime.";
    let rarete = "Commune (C)";
    let contexte = "Cette monnaie a circulé durant une période de transition économique. Les frappes de l'époque servaient aux échanges quotidiens et locaux, reflétant la puissance de l'autorité émettrice.";

    if (cleanTitleLower.includes("romain") || cleanTitleLower.includes("denier") || cleanTitleLower.includes("hadrien") || cleanTitleLower.includes("sesterce") || subCatLower.includes("romaine")) {
      regime = "Empire Romain";
      epoque = "Antiquité (Ier - IVème siècle)";
      aversDesc = "Tête laurée ou buste de l'Empereur de profil à droite, entouré de ses titres impériaux (ex: IMP AVG...).";
      reversDesc = "Divinité debout ou assise (Pax, Providentia, Victoria) ou scène militaire, avec légende décrivant les vertus impériales.";
      contexte = "Le denier ou le sesterce constituait le pilier monétaire de l'Empire Romain, facilitant la solde des légions et le commerce florissant de la Pax Romana dans toute l'Europe méditerranéenne.";
    } else if (cleanTitleLower.includes("louis") || cleanTitleLower.includes("tournois") || cleanTitleLower.includes("royal") || subCatLower.includes("royale")) {
      regime = "Royaume de France (Ancien Régime)";
      epoque = "Médiévale / Moderne (Valois ou Bourbons)";
      aversDesc = "Buste du Roi couronné ou profil enfantin/adulte entouré de la légende de droit divin (FRANC.ET.NAV.REX).";
      reversDesc = "Écu aux trois fleurs de lys surmonté d'une couronne royale, ou trois fleurs de lys posées 2 et 1.";
      contexte = "Le double tournois, le liard ou l'écu royal étaient les témoins de la centralisation monétaire française. Frappés en masse sous Henri IV, Louis XIII et Louis XIV pour standardiser le commerce national.";
    } else if (cleanTitleLower.includes("napoleon") || cleanTitleLower.includes("empire") || cleanTitleLower.includes("franc")) {
      regime = "Empire Français / République";
      epoque = "Moderne (XIXème - XXème siècle)";
      aversDesc = "Buste ou effigie de profil (Napoléon Empereur lauré ou Cérès/Hercule pour la République).";
      reversDesc = "Valeur faciale (ex : 5 Francs) entourée d'une couronne de laurier et de chêne avec la devise républicaine ou impériale.";
      contexte = "Créé par la loi du 7 germinal an XI (1803), le système du Franc Germinal instaure une stabilité monétaire remarquable qui accompagnera la révolution industrielle française.";
    }

    let composition = selectedCoin.description || "Métal cuivreux ou alliage d'usage";
    if (matLower.includes("argent") || matLower.includes("silver")) {
      composition = "Argent (Ag)";
      rarete = "Peu commune (R1)";
    } else if (matLower.includes("or") || matLower.includes("gold")) {
      composition = "Or (Au)";
      rarete = "Très rare (R3)";
    } else if (matLower.includes("billon")) {
      composition = "Billon (alliage pauvre d'argent et de cuivre)";
    } else if (matLower.includes("bronze")) {
      composition = "Bronze (Cu-Sn)";
    }

    const generatedMarkdown = `### 🏛️ FICHE WIKI NUMISMATIQUE
**Monnaie** : ${selectedCoin.title || "Non renseignée"}
**Règne / Autorité** : ${regime}
**Époque** : ${epoque}
**Composition** : ${composition}

---

#### 🪙 DESCRIPTION DES FACES
*   **Avers (Face)** : ${aversDesc}
*   **Revers (Pile)** : ${reversDesc}

---

#### 📜 CONTEXTE HISTORIQUE
${contexte}

---

#### 🔍 RARETÉ & DÉTAILS
*   **Indice de rareté** : ${rarete}
*   **Notes additionnelles** : Fiche générée automatiquement pour enrichir la collection interne.`;

    setEditedDescription(generatedMarkdown);
    setIsEditing(true);
  };

  // 2. Fetch associated avers / revers photos for each coin
  const coinCards = useMemo(() => {
    return coins.map((coin) => {
      const coinPhotos = photos.filter((p) => p.find_id === coin.id && (p.type === "clean" || p.type === "avers" || p.type === "revers"));
      const aversPhoto = coinPhotos.find((p) => p.type === "avers") || coinPhotos.find((p) => p.type === "clean") || coinPhotos[0];
      const reversPhoto = coinPhotos.find((p) => p.type === "revers") || coinPhotos.find((p) => p.type === "clean" && p.id !== aversPhoto?.id) || coinPhotos[1] || aversPhoto;

      // Extract Epoch from Wiki markdown if present
      let epoch = "Indéterminée";
      const desc = coin.clean_description || "";
      if (desc.includes("**Époque** :")) {
        const parts = desc.split("**Époque** :");
        if (parts[1]) epoch = parts[1].split("\n")[0].trim();
      }

      return {
        ...coin,
        aversUrl: aversPhoto?.image_url || null,
        reversUrl: reversPhoto?.image_url || null,
        epoch
      };
    });
  }, [coins, photos]);

  // 3. Stats calculations
  const stats = useMemo(() => {
    const total = coinCards.length;
    let goldCount = 0;
    let silverCount = 0;
    let bronzeCount = 0;

    coinCards.forEach((c) => {
      const mat = (c.description || "").toLowerCase();
      if (mat.includes("or") || mat.includes("gold")) {
        goldCount++;
      } else if (mat.includes("argent") || mat.includes("silver")) {
        silverCount++;
      } else {
        bronzeCount++;
      }
    });

    return {
      total,
      goldCount,
      silverCount,
      bronzeCount
    };
  }, [coinCards]);

  // 4. Filtering logic
  const filteredCoins = useMemo(() => {
    return coinCards.filter((c) => {
      const matchSearch = (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.clean_description || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const mat = (c.description || "").toLowerCase();
      let matchMetal = true;
      if (selectedMetal === "Or") matchMetal = mat.includes("or") || mat.includes("gold");
      else if (selectedMetal === "Argent") matchMetal = mat.includes("argent") || mat.includes("silver");
      else if (selectedMetal === "Bronze/Cuivre") matchMetal = !mat.includes("or") && !mat.includes("gold") && !mat.includes("argent") && !mat.includes("silver");

      let matchEpoch = true;
      if (selectedEpoch !== "Toutes") {
        matchEpoch = c.epoch.toLowerCase().includes(selectedEpoch.toLowerCase()) || 
                     (c.clean_description || "").toLowerCase().includes(selectedEpoch.toLowerCase());
      }

      return matchSearch && matchMetal && matchEpoch;
    });
  }, [coinCards, searchTerm, selectedMetal, selectedEpoch]);

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.24)",
    backdropFilter: "blur(8px)",
    cursor: "pointer",
    transition: "transform 0.2s, border-color 0.2s",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "16px",
        color: "white",
        fontFamily: "system-ui, sans-serif",
        boxSizing: "border-box"
      }}
    >
      {/* CSS 3D Rotation Animation */}
      <style>{`
        .coin-3d-card {
          perspective: 1000px;
          width: 120px;
          height: 120px;
          cursor: pointer;
        }
        .coin-3d-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .coin-3d-card.flipped .coin-3d-inner {
          transform: rotateY(180deg);
        }
        .coin-front, .coin-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 14px rgba(0,0,0,0.6);
          background: rgba(255, 255, 255, 0.05);
        }
        .coin-back {
          transform: rotateY(180deg);
        }
        .coin-front img, .coin-back img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .placeholder-face {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justifyContent: center;
          background: rgba(255,255,255,0.05);
          font-size: 11px;
          font-weight: bold;
          color: #9ca3af;
          text-align: center;
          padding: 8px;
          box-sizing: border-box;
          text-transform: uppercase;
        }
      `}</style>

      {/* Header section with Museum Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "900", letterSpacing: "-0.5px" }}>
          🏛️ Musée Numismatique
        </h2>
        <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>
          Consultez et valorisez l'histoire de vos plus belles monnaies trouvées.
        </p>
      </div>

      {/* Synthesis Statistics Board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "12px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "16px",
          borderRadius: "20px"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "10px", opacity: 0.6, fontWeight: "bold", textTransform: "uppercase" }}>Total Monnaies</span>
          <span style={{ fontSize: "24px", fontWeight: "900" }}>{stats.total} 🪙</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "10px", opacity: 0.6, fontWeight: "bold", textTransform: "uppercase", color: "#fbbf24" }}>Or</span>
          <span style={{ fontSize: "24px", fontWeight: "900", color: "#fbbf24" }}>{stats.goldCount} ✨</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "10px", opacity: 0.6, fontWeight: "bold", textTransform: "uppercase", color: "#9ca3af" }}>Argent</span>
          <span style={{ fontSize: "24px", fontWeight: "900", color: "#e5e7eb" }}>{stats.silverCount} 🥈</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "10px", opacity: 0.6, fontWeight: "bold", textTransform: "uppercase", color: "#f97316" }}>Bronze / Cuivre</span>
          <span style={{ fontSize: "24px", fontWeight: "900", color: "#fdba74" }}>{stats.bronzeCount} 🥉</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Rechercher une monnaie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            fontSize: "13px",
            outline: "none"
          }}
        />

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {/* Metal Filter Selector */}
          <select
            value={selectedMetal}
            onChange={(e) => setSelectedMetal(e.target.value)}
            style={{
              flex: 1,
              minWidth: "120px",
              padding: "10px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "#111827",
              color: "white",
              fontSize: "12px",
              outline: "none"
            }}
          >
            <option value="Tous">Tous Métaux</option>
            <option value="Or">Or uniquement</option>
            <option value="Argent">Argent uniquement</option>
            <option value="Bronze/Cuivre">Bronze / Cuivre / Billon</option>
          </select>

          {/* Epoch Filter Selector */}
          <select
            value={selectedEpoch}
            onChange={(e) => setSelectedEpoch(e.target.value)}
            style={{
              flex: 1,
              minWidth: "120px",
              padding: "10px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "#111827",
              color: "white",
              fontSize: "12px",
              outline: "none"
            }}
          >
            <option value="Toutes">Toutes époques</option>
            <option value="Romaine">Romaine / Antique</option>
            <option value="Médiévale">Médiévale</option>
            <option value="Royale">Royale</option>
            <option value="Moderne">Moderne</option>
          </select>
        </div>
      </div>

      {/* Grid List of Coins */}
      {filteredCoins.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", opacity: 0.5, fontSize: "13px" }}>
          📭 Aucune monnaie ne correspond aux critères de recherche.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "16px" }}>
          {filteredCoins.map((coin) => {
            const isFlipped = !!flippedCoins[coin.id];
            return (
              <div
                key={coin.id}
                style={cardStyle}
                onClick={() => setSelectedCoin(coin)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* 3D Flip Card */}
                <div
                  className={`coin-3d-card ${isFlipped ? "flipped" : ""}`}
                  onClick={(e) => toggleFlip(coin.id, e)}
                >
                  <div className="coin-3d-inner">
                    {/* Front: Avers */}
                    <div className="coin-front">
                      {coin.aversUrl ? (
                        <img src={coin.aversUrl} alt="Avers" />
                      ) : (
                        <div className="placeholder-face">Avers</div>
                      )}
                    </div>
                    {/* Back: Revers */}
                    <div className="coin-back">
                      {coin.reversUrl ? (
                        <img src={coin.reversUrl} alt="Revers" />
                      ) : (
                        <div className="placeholder-face">Revers</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card description */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", width: "100%", textAlign: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: "bold", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {coin.title || "Monnaie sans titre"}
                  </span>
                  <span style={{ fontSize: "10px", color: "#fbbf24", fontWeight: "700", textTransform: "uppercase" }}>
                    {coin.description || "Inconnu"}
                  </span>
                  <span style={{ fontSize: "10px", opacity: 0.6 }}>
                    {coin.epoch}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN EXHIBITION PANEL (Museum Card Details) */}
      {selectedCoin && createPortal(
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(14px)",
            zIndex: 9999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            boxSizing: "border-box"
          }}
          onClick={() => setSelectedCoin(null)}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "28px",
              padding: "24px",
              width: "100%",
              maxWidth: "460px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.7)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", opacity: 0.6, fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                🏛️ Exposition Collection
              </span>
              <button
                onClick={() => setSelectedCoin(null)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                ✕
              </button>
            </div>

            {/* Giant Flappable 3D Coin */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", margin: "10px 0" }}>
              <div
                className={`coin-3d-card ${!!flippedCoins[selectedCoin.id] ? "flipped" : ""}`}
                onClick={(e) => toggleFlip(selectedCoin.id, e)}
                style={{ width: "160px", height: "160px" }}
              >
                <div className="coin-3d-inner">
                  <div className="coin-front">
                    {selectedCoin.aversUrl ? (
                      <img src={selectedCoin.aversUrl} alt="Avers" />
                    ) : (
                      <div className="placeholder-face" style={{ fontSize: "14px" }}>Avers</div>
                    )}
                  </div>
                  <div className="coin-back">
                    {selectedCoin.reversUrl ? (
                      <img src={selectedCoin.reversUrl} alt="Revers" />
                    ) : (
                      <div className="placeholder-face" style={{ fontSize: "14px" }}>Revers</div>
                    )}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: "10px", opacity: 0.5 }}>
                👆 Cliquez sur la pièce pour la retourner
              </span>
            </div>

            {/* Title & Metadata */}
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "4px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "900" }}>
                {selectedCoin.title || "Monnaie sans titre"}
              </h3>
              <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                <span style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(251, 191, 36, 0.15)", color: "#fbbf24", fontSize: "10px", fontWeight: "bold" }}>
                  {selectedCoin.description || "Métal Inconnu"}
                </span>
                <span style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.08)", color: "#e5e7eb", fontSize: "10px", fontWeight: "bold" }}>
                  {selectedCoin.epoch}
                </span>
              </div>
            </div>

            {/* Notice header block */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", opacity: 0.6, fontWeight: "700", textTransform: "uppercase" }}>
                📜 Notice Historique
              </span>
              {!isEditing && selectedCoin.clean_description && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#60a5fa",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  ✏️ Modifier
                </button>
              )}
            </div>

            {/* Historical / Wiki details rendering or inline editor */}
            {isEditing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "220px",
                    background: "#1e293b",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "12px",
                    color: "white",
                    padding: "12px",
                    fontSize: "12px",
                    fontFamily: "system-ui, sans-serif",
                    lineHeight: "1.5",
                    resize: "vertical",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleSaveDescription}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      fontWeight: "bold",
                      fontSize: "11px",
                      cursor: "pointer"
                    }}
                  >
                    💾 Enregistrer
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.08)",
                      color: "white",
                      border: "none",
                      fontSize: "11px",
                      cursor: "pointer"
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {!selectedCoin.clean_description && (
                  <button
                    onClick={handleGenerateSheetInsideMuseum}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "none",
                      background: "linear-gradient(135deg, #a855f7, #6b21a8)",
                      color: "white",
                      fontSize: "11.5px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    🪄 Générer la Fiche Historique
                  </button>
                )}
                
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    padding: "16px",
                    borderRadius: "16px",
                    fontSize: "12.5px",
                    lineHeight: "1.6",
                    color: "#d1d5db",
                    maxHeight: "260px",
                    overflowY: "auto"
                  }}
                >
                  {selectedCoin.clean_description ? (
                    <div style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                      {selectedCoin.clean_description.replace("### 🏛️ FICHE WIKI NUMISMATIQUE", "")}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", opacity: 0.5, padding: "10px 0" }}>
                      📝 Aucune description numismatique rédigée. Cliquez sur le bouton ci-dessus pour la générer !
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
              <button
                onClick={() => {
                  setSelectedCoin(null);
                  onOpenFindDetails(selectedCoin);
                }}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                ✏️ Éditer la trouvaille
              </button>

              {selectedCoin.identification_link && (
                <a
                  href={selectedCoin.identification_link.startsWith("http") ? selectedCoin.identification_link : `https://${selectedCoin.identification_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: "12px",
                    border: "1px solid rgba(59, 130, 246, 0.4)",
                    background: "rgba(59, 130, 246, 0.1)",
                    color: "#60a5fa",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textDecoration: "none",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  🌐 Catalogue Extérieur
                </a>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
