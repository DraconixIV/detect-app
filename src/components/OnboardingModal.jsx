import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { THEMES } from "../styles/themes";
import AuthForm from "./AuthForm";
import { PRESET_CATEGORY_COLORS, SUGGESTED_STARTER_CATEGORIES } from "../subCategories";
import { loadCategoriesData, saveCategoriesData } from "../services/categoriesService";
import { RECOMMENDED_METALS, loadMaterialsData, saveMaterialsData } from "../services/materialsService";

const DETECTORIST_EMOJIS = [
  // Monnaies, Trésors & Précieux
  "🪙", "💰", "🥇", "🥈", "🥉", "💎", "💍", "👑", "📿", "🏆", "🎖️", "🏅", "⚜️",
  // Antiquités, Objets Historiques & Archéologie
  "🏺", "🗿", "🏛️", "📜", "🗝️", "🔑", "🔒", "🪞", "🕯️", "⌛", "⏳", "🧱", "✝️",
  // Militaria, Armes & Boucles
  "🛡️", "⚔️", "🗡️", "🏹", "💣", "🪖", "🎯", "🔫", "🪓", "🪚", "⚙️", "🥨",
  // Quincaillerie, Outils, Fixations & Ferraille
  "🔔", "⚓", "🧲", "🔨", "⛏️", "🔧", "🔩", "🪛", "🖇️", "📎", "✂️", "🪡", "🧷", "🥄", "🍴", "👞", "👝", "🏷️", "📦", "🔘", "🥫", "🎣", "⛓️", "🪜", "🪤", "🪨",
  // Métaux, Matières, Éléments & Minéraux
  "🟫", "💿", "⚖️", "🧪", "🔬", "🪵", "🧭", "🔍", "⚡", "🌟", "✨",
  // Pastilles de repérage
  "🟡", "⚪", "🟤", "🔴", "🟢", "🔵", "🟣", "⚫"
];

const COMMON_EMOJIS = DETECTORIST_EMOJIS;
const METAL_EMOJIS = DETECTORIST_EMOJIS;

export default function OnboardingModal({ isOpen, onComplete, onLiveThemeChange, currentTheme = "dark" }) {
  // Step 1: Découverte & Fonctionnalités clés
  // Step 2: Cadre Légal & Charte Éthique
  // Step 3: Espace Prospecteur (Authentification)
  // Step 4: Votre Classification (Catégories & Métaux)
  // Step 5: Configuration Initiale (Carte, Thème)
  // Step 6: Message Personnel du Créateur
  const [step, setStep] = useState(1);
  const [step4Tab, setStep4Tab] = useState("categories"); // 'categories' | 'metals'
  const [user, setUser] = useState(null);

  // Legal Checkboxes state
  const [checkOwner, setCheckOwner] = useState(false);
  const [checkHeritage, setCheckHeritage] = useState(false);
  const [checkDeclaration, setCheckDeclaration] = useState(false);
  const [checkNature, setCheckNature] = useState(false);
  const [checkCgu, setCheckCgu] = useState(false);

  // Categories configuration state
  const [categories, setCategories] = useState(() => {
    const loaded = loadCategoriesData();
    return loaded.categories || {};
  });
  const [emojis, setEmojis] = useState(() => {
    const loaded = loadCategoriesData();
    return loaded.emojis || {};
  });
  const [colors, setColors] = useState(() => {
    const loaded = loadCategoriesData();
    return loaded.colors || {};
  });

  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("🪙");
  const [newCatColor, setNewCatColor] = useState("#facc15");
  const [newSubText, setNewSubText] = useState("");
  const [expandedCat, setExpandedCat] = useState(null);
  const [inlineSubInput, setInlineSubInput] = useState("");

  // Metals / Materials configuration state
  const [materials, setMaterials] = useState(() => {
    const loaded = loadMaterialsData();
    return loaded.materials || [];
  });
  const [materialEmojis, setMaterialEmojis] = useState(() => {
    const loaded = loadMaterialsData();
    return loaded.emojis || {};
  });
  const [newMetalName, setNewMetalName] = useState("");
  const [newMetalEmoji, setNewMetalEmoji] = useState("🪙");

  // Pre-customization choices
  const [selectedMapStyle, setSelectedMapStyle] = useState("satellite");
  const [selectedDesignTheme, setSelectedDesignTheme] = useState("tactical");
  const [selectedAppTheme, setSelectedAppTheme] = useState(() => currentTheme || "dark");
  const [selectedGpsStyle, setSelectedGpsStyle] = useState("blue-dot");

  const handleSelectTheme = (mode) => {
    setSelectedAppTheme(mode);
    if (onLiveThemeChange) {
      onLiveThemeChange(mode);
    }
  };

  const isDark = selectedAppTheme === "dark";
  const bgRoot = isDark ? "#0b1329" : "#ffffff";
  const textMain = isDark ? "#ffffff" : "#0f172a";
  const textSub = isDark ? "#94a3b8" : "#475569";
  const cardBg = isDark ? "#111c44" : "#f8fafc";
  const cardBorder = isDark ? "rgba(255, 255, 255, 0.12)" : "#e2e8f0";
  const inputBg = isDark ? "#0b1329" : "#ffffff";
  const inputBorder = isDark ? "rgba(255, 255, 255, 0.2)" : "#cbd5e1";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (!isOpen) return null;

  const allLegalChecked = checkOwner && checkHeritage && checkDeclaration && checkNature && checkCgu;

  const handleAddCustomCategory = (e) => {
    e?.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;

    const parsedSubs = newSubText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const finalSubs = parsedSubs.length > 0 ? parsedSubs : ["Indéterminé"];

    const updatedCats = { ...categories, [trimmed]: finalSubs };
    const updatedEmojis = { ...emojis, [trimmed]: newCatEmoji || "🏷️" };
    const updatedColors = { ...colors, [trimmed]: newCatColor || "#3b82f6" };

    setCategories(updatedCats);
    setEmojis(updatedEmojis);
    setColors(updatedColors);
    saveCategoriesData(updatedCats, updatedEmojis, updatedColors);

    setNewCatName("");
    setNewSubText("");
  };

  const handleAddStarter = (name) => {
    const starter = SUGGESTED_STARTER_CATEGORIES[name];
    if (!starter) return;

    const updatedCats = { ...categories, [name]: [...starter.subCategories] };
    const updatedEmojis = { ...emojis, [name]: starter.emoji };
    const updatedColors = { ...colors, [name]: starter.color };

    setCategories(updatedCats);
    setEmojis(updatedEmojis);
    setColors(updatedColors);
    saveCategoriesData(updatedCats, updatedEmojis, updatedColors);
  };

  const handleRemoveCategory = (name) => {
    const updatedCats = { ...categories };
    delete updatedCats[name];
    const updatedEmojis = { ...emojis };
    delete updatedEmojis[name];
    const updatedColors = { ...colors };
    delete updatedColors[name];

    setCategories(updatedCats);
    setEmojis(updatedEmojis);
    setColors(updatedColors);
    saveCategoriesData(updatedCats, updatedEmojis, updatedColors);
  };

  const handleAddSubInline = (catName) => {
    const trimmed = inlineSubInput.trim();
    if (!trimmed) return;
    const currentSubs = categories[catName] || [];
    if (!currentSubs.includes(trimmed)) {
      const updatedCats = { ...categories, [catName]: [...currentSubs, trimmed] };
      setCategories(updatedCats);
      saveCategoriesData(updatedCats, emojis, colors);
    }
    setInlineSubInput("");
  };

  const handleRemoveSubInline = (catName, subName) => {
    const currentSubs = categories[catName] || [];
    const updatedCats = { ...categories, [catName]: currentSubs.filter((s) => s !== subName) };
    setCategories(updatedCats);
    saveCategoriesData(updatedCats, emojis, colors);
  };

  const handleToggleRecommendedMetal = (metal) => {
    let updatedMaterials;
    const updatedEmojis = { ...materialEmojis, [metal.name]: metal.emoji };
    if (materials.includes(metal.name)) {
      updatedMaterials = materials.filter((m) => m !== metal.name);
    } else {
      updatedMaterials = [...materials, metal.name];
    }
    setMaterials(updatedMaterials);
    setMaterialEmojis(updatedEmojis);
    saveMaterialsData(updatedMaterials, updatedEmojis);
  };

  const handleAddCustomMetal = (e) => {
    e?.preventDefault();
    const trimmed = newMetalName.trim();
    if (!trimmed) return;
    let updatedMaterials = [...materials];
    if (!updatedMaterials.includes(trimmed)) {
      updatedMaterials.push(trimmed);
    }
    const updatedEmojis = { ...materialEmojis, [trimmed]: newMetalEmoji || "🪙" };
    setMaterials(updatedMaterials);
    setMaterialEmojis(updatedEmojis);
    saveMaterialsData(updatedMaterials, updatedEmojis);
    setNewMetalName("");
  };

  const handleRemoveMetal = (metalName) => {
    const updatedMaterials = materials.filter((m) => m !== metalName);
    const updatedEmojis = { ...materialEmojis };
    delete updatedEmojis[metalName];
    setMaterials(updatedMaterials);
    setMaterialEmojis(updatedEmojis);
    saveMaterialsData(updatedMaterials, updatedEmojis);
  };

  const handleFinish = () => {
    saveCategoriesData(categories, emojis, colors);
    saveMaterialsData(materials, materialEmojis);
    localStorage.setItem("geoprospect_onboarding_completed_v3", "true");
    localStorage.setItem("geoprospect_cgu_accepted", "true");
    localStorage.setItem("mapStyle", selectedMapStyle);
    localStorage.setItem("app_design_theme", selectedDesignTheme);
    localStorage.setItem("app_theme", selectedAppTheme);
    localStorage.setItem("gpsStyle", selectedGpsStyle);

    if (onComplete) {
      onComplete({
        defaultMapStyle: selectedMapStyle,
        designTheme: selectedDesignTheme,
        theme: selectedAppTheme,
        gpsStyle: selectedGpsStyle
      });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 100000,
        background: bgRoot,
        color: textMain,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "env(safe-area-inset-top, 24px) 16px env(safe-area-inset-bottom, 32px) 16px",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transition: "background 0.25s ease, color 0.25s ease"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          paddingTop: "12px",
          paddingBottom: "24px",
          boxSizing: "border-box"
        }}
      >
        {/* Header : Progress Stepper */}
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
          {/* Step Indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", gap: "5px" }}>
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <div
                  key={s}
                  style={{
                    width: step === s ? "24px" : "8px",
                    height: "6px",
                    borderRadius: "3px",
                    background: step === s ? "#2563eb" : (step > s ? "#10b981" : (isDark ? "rgba(255,255,255,0.15)" : "#e2e8f0")),
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: "12px", fontWeight: "700", color: textSub, marginLeft: "4px" }}>
              Étape {step} sur 6
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ÉTAPE 1 : PRÉSENTATION & FONCTIONNEMENT DE L'APP */}
        {/* ========================================================= */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <h1 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "900", color: textMain, letterSpacing: "-0.5px" }}>
                Bienvenue sur GeoProspect 🧭
              </h1>
              <p style={{ margin: 0, fontSize: "14px", color: textSub, lineHeight: "1.5" }}>
                Votre compagnon tout-en-un pour la détection de loisir, le repérage cartographique et l'inventaire de vos trouvailles.
              </p>
            </div>

            {/* 3 Key Feature Highlight Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Feature 1 */}
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  padding: "14px 16px",
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "16px",
                  alignItems: "flex-start"
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: isDark ? "rgba(37, 99, 235, 0.2)" : "#eff6ff",
                    border: isDark ? "1px solid rgba(37, 99, 235, 0.4)" : "1px solid #bfdbfe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    flexShrink: 0
                  }}
                >
                  🗺️
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "800", color: textMain, marginBottom: "3px" }}>
                    Cartes IGN & Tracé GPS en Direct
                  </div>
                  <div style={{ fontSize: "12px", color: textSub, lineHeight: "1.5" }}>
                    Superposez le <strong>Cadastre officiel IGN</strong>, la carte de <strong>Cassini</strong> et l'<strong>État-Major 1820</strong>. Visualisez votre parcours pour ne jamais repasser au même endroit.
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  padding: "14px 16px",
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "16px",
                  alignItems: "flex-start"
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: isDark ? "rgba(245, 158, 11, 0.2)" : "#fef3c7",
                    border: isDark ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid #fde68a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    flexShrink: 0
                  }}
                >
                  🪙
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "800", color: textMain, marginBottom: "3px" }}>
                    Journal de Trouvailles & Photos HD
                  </div>
                  <div style={{ fontSize: "12px", color: textSub, lineHeight: "1.5" }}>
                    Épinglez chaque découverte avec ses coordonnées exactes, photos macro, catégorie et exportez vos statistiques à tout moment.
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  padding: "14px 16px",
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "16px",
                  alignItems: "flex-start"
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: isDark ? "rgba(16, 185, 129, 0.2)" : "#ecfdf5",
                    border: isDark ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid #a7f3d0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    flexShrink: 0
                  }}
                >
                  👥
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "800", color: textMain, marginBottom: "3px" }}>
                    Sessions en Équipe & Sauvegarde
                  </div>
                  <div style={{ fontSize: "12px", color: textSub, lineHeight: "1.5" }}>
                    Rejoignez une session collective en direct avec vos amis ou prospectez en mode 100% hors-ligne sécurisé.
                  </div>
                </div>
              </div>
            </div>

            {/* Action Next Button */}
            <button
              type="button"
              onClick={() => setStep(2)}
              style={{
                marginTop: "6px",
                padding: "14px 20px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "white",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)")}
            >
              Continuer vers l'étape 2 →
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 2 : CADRE LÉGAL & CHARTE DÉONTOLOGIQUE */}
        {/* ========================================================= */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "900", color: textMain, letterSpacing: "-0.5px" }}>
                Cadre Légal & Charte Éthique ⚖️
              </h1>
              <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
                La détection de métaux en France est encadrée pour protéger le patrimoine et respecter la propriété privée.
              </p>
            </div>

            {/* Structured Legal Box */}
            <div
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "14px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "12px",
                lineHeight: "1.45",
                color: textMain
              }}
            >
              <div>
                <div style={{ fontWeight: "800", color: textMain, marginBottom: "3px" }}>
                  Article L. 542-1 du Code du patrimoine
                </div>
                <div style={{ color: textSub, fontStyle: "italic", fontSize: "11px" }}>
                  « Nul ne peut utiliser du matériel permettant la détection d'objets métalliques, à l'effet de recherches de monuments et d'objets pouvant intéresser la préhistoire, l'histoire, l'art ou l'archéologie, sans avoir, au préalable, obtenu une autorisation administrative. »
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${cardBorder}`, paddingTop: "8px" }}>
                <div style={{ fontWeight: "800", color: textMain, marginBottom: "3px" }}>
                  Découvertes fortuites (Art. L. 531-14)
                </div>
                <div style={{ color: textSub, fontSize: "11px" }}>
                  Toute découverte fortuite d'intérêt historique ou archéologique doit être immédiatement déclarée auprès de la mairie et du Service Régional de l'Archéologie (DRAC).
                </div>
              </div>
            </div>

            {/* 5 Legal Checkboxes */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: checkOwner ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
                  border: checkOwner ? "1px solid #3b82f6" : `1px solid ${cardBorder}`,
                  padding: "11px 13px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  color: checkOwner ? (isDark ? "#93c5fd" : "#1e3a8a") : textMain,
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="checkbox"
                  checked={checkOwner}
                  onChange={(e) => setCheckOwner(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <span>J'obtiens systématiquement l'<strong>accord préalable du propriétaire</strong> du terrain (Code civil).</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: checkHeritage ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
                  border: checkHeritage ? "1px solid #3b82f6" : `1px solid ${cardBorder}`,
                  padding: "11px 13px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  color: checkHeritage ? (isDark ? "#93c5fd" : "#1e3a8a") : textMain,
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="checkbox"
                  checked={checkHeritage}
                  onChange={(e) => setCheckHeritage(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <span>Je respecte l'interdiction de recherche archéologique sans <strong>autorisation préfectorale (Art. L. 542-1)</strong>.</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: checkDeclaration ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
                  border: checkDeclaration ? "1px solid #3b82f6" : `1px solid ${cardBorder}`,
                  padding: "11px 13px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  color: checkDeclaration ? (isDark ? "#93c5fd" : "#1e3a8a") : textMain,
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="checkbox"
                  checked={checkDeclaration}
                  onChange={(e) => setCheckDeclaration(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <span>Je m'engage à <strong>déclarer sans délai toute découverte fortuite</strong> en mairie et à la DRAC (Art. L. 531-14).</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: checkNature ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
                  border: checkNature ? "1px solid #3b82f6" : `1px solid ${cardBorder}`,
                  padding: "11px 13px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  color: checkNature ? (isDark ? "#93c5fd" : "#1e3a8a") : textMain,
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="checkbox"
                  checked={checkNature}
                  onChange={(e) => setCheckNature(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <span>Je m'engage à <strong>reboucher systématiquement mes trous</strong> et à ramasser les déchets métalliques.</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: checkCgu ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
                  border: checkCgu ? "1px solid #3b82f6" : `1px solid ${cardBorder}`,
                  padding: "11px 13px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  color: checkCgu ? (isDark ? "#93c5fd" : "#1e3a8a") : textMain,
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="checkbox"
                  checked={checkCgu}
                  onChange={(e) => setCheckCgu(e.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <span>J'accepte les <strong>Conditions Générales d'Utilisation</strong> et la charte éthique.</span>
              </label>
            </div>

            {/* Actions Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  padding: "13px 18px",
                  borderRadius: "12px",
                  border: `1px solid ${cardBorder}`,
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: textSub,
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Retour
              </button>

              <button
                type="button"
                disabled={!allLegalChecked}
                onClick={() => setStep(3)}
                style={{
                  flex: 1,
                  padding: "13px 18px",
                  borderRadius: "12px",
                  border: "none",
                  background: allLegalChecked ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : (isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"),
                  color: allLegalChecked ? "#ffffff" : (isDark ? "rgba(255,255,255,0.3)" : "#94a3b8"),
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: allLegalChecked ? "pointer" : "not-allowed",
                  boxShadow: allLegalChecked ? "0 2px 10px rgba(37, 99, 235, 0.25)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                Continuer vers l'étape 3 →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 3 : ESPACE COMPTE (AUTHENTIFICATION) */}
        {/* ========================================================= */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "900", color: textMain, letterSpacing: "-0.5px" }}>
                Votre Espace Prospecteur 👤
              </h1>
              <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
                Connectez-vous pour synchroniser vos trouvailles sur tous vos appareils, ou continuez en local.
              </p>
            </div>

            {user ? (
              <div
                style={{
                  background: isDark ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5",
                  border: isDark ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid #a7f3d0",
                  borderRadius: "16px",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "#10b981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "18px"
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "800", color: isDark ? "#34d399" : "#065f46" }}>
                      Connecté avec succès
                    </div>
                    <div style={{ fontSize: "13px", color: isDark ? "#a7f3d0" : "#047857" }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(4)}
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(37, 99, 235, 0.25)"
                  }}
                >
                  Continuer vers l'étape 4 →
                </button>
              </div>
            ) : (
              <div>
                <AuthForm
                  theme={selectedAppTheme}
                  onAuthSuccess={(u) => {
                    setUser(u);
                    setStep(4);
                  }}
                  showGoogleOption={true}
                />

                <div style={{ textAlign: "center", marginTop: "16px" }}>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    style={{
                      background: "none",
                      border: "none",
                      color: textSub,
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      padding: "6px 10px",
                      textDecoration: "underline",
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = textMain)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = textSub)}
                  >
                    Continuer vers l'étape 4 (Mode 100% hors-ligne) →
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  padding: "11px 16px",
                  borderRadius: "10px",
                  border: `1px solid ${cardBorder}`,
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: textSub,
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                ← Retour au cadre légal
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 4 : CONFIGURATION DES CATÉGORIES & MÉTAUX            */}
        {/* ========================================================= */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "900", color: textMain, letterSpacing: "-0.5px" }}>
                Votre classification :
              </h1>
              <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
                Définissez vos catégories d'objets, leurs repères visibles sur la carte et choisissez les métaux associés à vos futures trouvailles.
              </p>
            </div>

            {/* Sub-Tabs Switcher */}
            <div
              style={{
                display: "flex",
                background: isDark ? "#1e293b" : "#f1f5f9",
                borderRadius: "12px",
                padding: "4px",
                border: `1px solid ${cardBorder}`,
                gap: "4px"
              }}
            >
              <button
                type="button"
                onClick={() => setStep4Tab("categories")}
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: "none",
                  background: step4Tab === "categories" ? (isDark ? "#2563eb" : "#ffffff") : "transparent",
                  color: step4Tab === "categories" ? "#ffffff" : textSub,
                  fontWeight: step4Tab === "categories" ? "800" : "600",
                  fontSize: "12px",
                  cursor: "pointer",
                  boxShadow: step4Tab === "categories" ? "0 2px 4px rgba(0,0,0,0.15)" : "none",
                  transition: "all 0.15s ease"
                }}
              >
                Catégories d'objets ({Object.keys(categories).length})
              </button>
              <button
                type="button"
                onClick={() => setStep4Tab("metals")}
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: "none",
                  background: step4Tab === "metals" ? (isDark ? "#2563eb" : "#ffffff") : "transparent",
                  color: step4Tab === "metals" ? "#ffffff" : textSub,
                  fontWeight: step4Tab === "metals" ? "800" : "600",
                  fontSize: "12px",
                  cursor: "pointer",
                  boxShadow: step4Tab === "metals" ? "0 2px 4px rgba(0,0,0,0.15)" : "none",
                  transition: "all 0.15s ease"
                }}
              >
                Métaux ({materials.length})
              </button>
            </div>

            {/* TAB 1: FAMILLES D'OBJETS */}
            {step4Tab === "categories" && (
              <>
                {/* Quick 1-click Suggestion Chips */}
                <div
                  style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: "14px",
                    padding: "12px 14px"
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                    💡 Suggestions en 1 clic (optionnel) :
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {Object.keys(SUGGESTED_STARTER_CATEGORIES).map((starterName) => {
                      const item = SUGGESTED_STARTER_CATEGORIES[starterName];
                      const isAlreadyAdded = !!categories[starterName];
                      return (
                        <button
                          key={starterName}
                          type="button"
                          onClick={() => handleAddStarter(starterName)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "10px",
                            border: isAlreadyAdded ? `1.5px solid ${item.color}` : `1px solid ${cardBorder}`,
                            background: isAlreadyAdded ? (isDark ? "rgba(37,99,235,0.25)" : "#eff6ff") : (isDark ? "#1e293b" : "#ffffff"),
                            color: isAlreadyAdded ? (isDark ? "#93c5fd" : "#1e3a8a") : textMain,
                            fontSize: "12px",
                            fontWeight: isAlreadyAdded ? "700" : "500",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            transition: "all 0.15s ease",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                          }}
                          title={isAlreadyAdded ? "Catégorie déjà ajoutée" : `Ajouter la suggestion ${starterName}`}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: item.color,
                              display: "inline-block"
                            }}
                          />
                          <span>{item.emoji} {starterName}</span>
                          {isAlreadyAdded && <span style={{ color: "#10b981", fontWeight: "900", fontSize: "11px" }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Category Creation Form */}
                <form
                  onSubmit={handleAddCustomCategory}
                  style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: "16px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Créer une catégorie :
                  </div>

                  {/* Nom */}
                  <input
                    type="text"
                    placeholder="Nom"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${inputBorder}`,
                      background: inputBg,
                      color: textMain,
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />

                  {/* Grille complète d'émojis */}
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: textSub, marginBottom: "6px" }}>
                      Émoji associé :
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        maxHeight: "120px",
                        overflowY: "auto",
                        padding: "6px",
                        background: inputBg,
                        border: `1px solid ${inputBorder}`,
                        borderRadius: "10px"
                      }}
                    >
                      {COMMON_EMOJIS.map((em) => {
                        const isSelected = newCatEmoji === em;
                        return (
                          <button
                            key={em}
                            type="button"
                            onClick={() => setNewCatEmoji(em)}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              border: isSelected ? "2px solid #3b82f6" : `1px solid ${cardBorder}`,
                              background: isSelected ? (isDark ? "rgba(37,99,235,0.3)" : "#eff6ff") : (isDark ? "#1e293b" : "#f8fafc"),
                              fontSize: "18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              padding: 0,
                              transform: isSelected ? "scale(1.12)" : "scale(1)",
                              transition: "all 0.12s ease"
                            }}
                            title={em}
                          >
                            {em}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sous-catégories avec libellé et placeholder visible */}
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: textSub, marginBottom: "4px" }}>
                      Sous-catégories (séparées par des virgules) :
                    </div>
                    <input
                      type="text"
                      placeholder="Ex: Antique, Médiéval, Moderne..."
                      value={newSubText}
                      onChange={(e) => setNewSubText(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "10px",
                        border: `1px solid ${inputBorder}`,
                        background: inputBg,
                        color: textMain,
                        fontSize: "12px",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {/* Color Swatch Picker */}
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: textSub, marginBottom: "6px" }}>
                      🎨 Couleur du repère carte :
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                      {PRESET_CATEGORY_COLORS.map((colorHex) => {
                        const isSelected = newCatColor === colorHex;
                        return (
                          <button
                            key={colorHex}
                            type="button"
                            onClick={() => setNewCatColor(colorHex)}
                            style={{
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              background: colorHex,
                              border: isSelected ? (isDark ? "2.5px solid #ffffff" : "2.5px solid #0f172a") : "1.5px solid rgba(0,0,0,0.15)",
                              boxShadow: isSelected ? `0 0 6px ${colorHex}` : "none",
                              cursor: "pointer",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transform: isSelected ? "scale(1.2)" : "scale(1)",
                              transition: "all 0.15s ease"
                            }}
                            title={colorHex}
                          >
                            {isSelected && <span style={{ color: "#ffffff", fontSize: "10px", fontWeight: "900" }}>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!newCatName.trim()}
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      border: "none",
                      background: newCatName.trim() ? "linear-gradient(135deg, #10b981, #059669)" : (isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"),
                      color: newCatName.trim() ? "#ffffff" : (isDark ? "rgba(255,255,255,0.3)" : "#94a3b8"),
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: newCatName.trim() ? "pointer" : "not-allowed",
                      transition: "all 0.2s ease"
                    }}
                  >
                    + Ajouter cette catégorie
                  </button>
                </form>

                {/* Configured Categories List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Vos Catégories ({Object.keys(categories).length})
                    </span>
                    {Object.keys(categories).length > 0 && (
                      <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700" }}>
                        ✓ Prêt pour l'inventaire
                      </span>
                    )}
                  </div>

                  {Object.keys(categories).length === 0 ? (
                    <div
                      style={{
                        padding: "18px 14px",
                        borderRadius: "14px",
                        background: cardBg,
                        border: `1px dashed ${cardBorder}`,
                        textAlign: "center",
                        color: textSub,
                        fontSize: "12px"
                      }}
                    >
                      <div style={{ fontSize: "24px", marginBottom: "4px" }}>🏷️</div>
                      <div style={{ fontWeight: "700", color: textMain, marginBottom: "2px" }}>
                        0 catégorie pour le moment
                      </div>
                      <div>
                        Ajoutez vos catégories sur-mesure ci-dessus ou cliquez sur une suggestion rapide.
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "220px", overflowY: "auto" }}>
                      {Object.entries(categories).map(([catName, subCats]) => {
                        const em = emojis[catName] || "🏷️";
                        const col = colors[catName] || "#3b82f6";
                        const isExpanded = expandedCat === catName;

                        return (
                          <div
                            key={catName}
                            style={{
                              background: isDark ? "#1e293b" : "#f8fafc",
                              border: `1px solid ${cardBorder}`,
                              borderRadius: "12px",
                              overflow: "hidden"
                            }}
                          >
                            <div
                              onClick={() => setExpandedCat(isExpanded ? null : catName)}
                              style={{
                                padding: "10px 12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                userSelect: "none"
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span
                                  style={{
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "50%",
                                    background: col,
                                    boxShadow: `0 0 4px ${col}88`,
                                    display: "inline-block"
                                  }}
                                />
                                <span style={{ fontSize: "16px" }}>{em}</span>
                                <span style={{ fontSize: "13px", fontWeight: "700", color: textMain }}>
                                  {catName}
                                </span>
                                <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 6px", borderRadius: "8px", background: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0", color: textSub }}>
                                  {subCats.length} sous-types
                                </span>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveCategory(catName);
                                  }}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#ef4444",
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    padding: "2px"
                                  }}
                                  title="Supprimer la catégorie"
                                >
                                  🗑️
                                </button>
                                <span style={{ fontSize: "11px", color: textSub, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                                  ▼
                                </span>
                              </div>
                            </div>

                            {/* Expanded Subcategories view */}
                            {isExpanded && (
                              <div
                                style={{
                                  padding: "8px 12px 12px 12px",
                                  borderTop: `1px solid ${cardBorder}`,
                                  background: isDark ? "#0f172a" : "#f1f5f9"
                                }}
                              >
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
                                  {subCats.map((sub) => (
                                    <span
                                      key={sub}
                                      style={{
                                        padding: "3px 8px",
                                        borderRadius: "6px",
                                        background: isDark ? "#1e293b" : "#ffffff",
                                        border: `1px solid ${cardBorder}`,
                                        fontSize: "11px",
                                        color: textMain,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px"
                                      }}
                                    >
                                      {sub}
                                      <span
                                        onClick={() => handleRemoveSubInline(catName, sub)}
                                        style={{ cursor: "pointer", color: "#ef4444", fontWeight: "bold", fontSize: "10px" }}
                                      >
                                        ×
                                      </span>
                                    </span>
                                  ))}
                                </div>

                                {/* Add subcategory input */}
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <input
                                    type="text"
                                    placeholder={`Ajouter un sous-type à ${catName}...`}
                                    value={inlineSubInput}
                                    onChange={(e) => setInlineSubInput(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddSubInline(catName);
                                      }
                                    }}
                                    style={{
                                      flex: 1,
                                      padding: "6px 10px",
                                      borderRadius: "8px",
                                      border: `1px solid ${inputBorder}`,
                                      background: inputBg,
                                      color: textMain,
                                      fontSize: "11px",
                                      outline: "none"
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleAddSubInline(catName)}
                                    style={{
                                      padding: "6px 10px",
                                      borderRadius: "8px",
                                      border: "none",
                                      background: "#3b82f6",
                                      color: "white",
                                      fontSize: "11px",
                                      fontWeight: "bold",
                                      cursor: "pointer"
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB 2: MÉTAUX & ÉMOJIS */}
            {step4Tab === "metals" && (
              <>
                {/* Recommandations des 11 métaux */}
                <div
                  style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: "14px",
                    padding: "12px 14px"
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                    💡 Métaux recommandés par GeoProspect (Cliquez pour activer / désactiver) :
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {RECOMMENDED_METALS.map((rec) => {
                      const isActif = materials.includes(rec.name);
                      return (
                        <button
                          key={rec.name}
                          type="button"
                          onClick={() => handleToggleRecommendedMetal(rec)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "10px",
                            border: isActif ? "1.5px solid #3b82f6" : `1px solid ${cardBorder}`,
                            background: isActif ? (isDark ? "rgba(37,99,235,0.25)" : "#eff6ff") : (isDark ? "#1e293b" : "#ffffff"),
                            color: isActif ? (isDark ? "#93c5fd" : "#1e3a8a") : textMain,
                            fontSize: "12px",
                            fontWeight: isActif ? "700" : "500",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            transition: "all 0.15s ease",
                            boxShadow: isActif ? "0 1px 3px rgba(37,99,235,0.15)" : "0 1px 2px rgba(0,0,0,0.04)"
                          }}
                          title={isActif ? "Métal actif pour vos trouvailles" : `Cliquer pour activer ${rec.name}`}
                        >
                          <span style={{ fontSize: "14px" }}>{materialEmojis[rec.name] || rec.emoji}</span>
                          <span>{rec.name}</span>
                          {isActif ? (
                            <span style={{ color: "#10b981", fontWeight: "900", fontSize: "11px" }}>✓</span>
                          ) : (
                            <span style={{ color: textSub, fontSize: "10px" }}>+</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Formulaire d'ajout de métal sur-mesure */}
                <form
                  onSubmit={handleAddCustomMetal}
                  style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: "16px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Ajouter un métal et/ou un alliage :
                  </div>

                  {/* Nom du métal */}
                  <input
                    type="text"
                    placeholder="Nom du métal"
                    value={newMetalName}
                    onChange={(e) => setNewMetalName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${inputBorder}`,
                      background: inputBg,
                      color: textMain,
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />

                  {/* Grille complète d'émojis pour les métaux */}
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: textSub, marginBottom: "6px" }}>
                      Émoji associé :
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        maxHeight: "120px",
                        overflowY: "auto",
                        padding: "6px",
                        background: inputBg,
                        border: `1px solid ${inputBorder}`,
                        borderRadius: "10px"
                      }}
                    >
                      {METAL_EMOJIS.map((em) => {
                        const isSelected = newMetalEmoji === em;
                        return (
                          <button
                            key={em}
                            type="button"
                            onClick={() => setNewMetalEmoji(em)}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              border: isSelected ? "2px solid #3b82f6" : `1px solid ${cardBorder}`,
                              background: isSelected ? (isDark ? "rgba(37,99,235,0.3)" : "#eff6ff") : (isDark ? "#1e293b" : "#f8fafc"),
                              fontSize: "18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              padding: 0,
                              transform: isSelected ? "scale(1.12)" : "scale(1)",
                              transition: "all 0.12s ease"
                            }}
                            title={em}
                          >
                            {em}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!newMetalName.trim()}
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      border: "none",
                      background: newMetalName.trim() ? "linear-gradient(135deg, #10b981, #059669)" : (isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"),
                      color: newMetalName.trim() ? "#ffffff" : (isDark ? "rgba(255,255,255,0.3)" : "#94a3b8"),
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: newMetalName.trim() ? "pointer" : "not-allowed",
                      transition: "all 0.2s ease"
                    }}
                  >
                    + Ajouter ce métal à mes trouvailles
                  </button>
                </form>

                {/* Liste des métaux actifs */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: textSub, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Vos Métaux Actifs ({materials.length})
                    </span>
                    {materials.length > 0 && (
                      <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700" }}>
                        ✓ Enregistrement prêt
                      </span>
                    )}
                  </div>

                  {materials.length === 0 ? (
                    <div
                      style={{
                        padding: "18px 14px",
                        borderRadius: "14px",
                        background: cardBg,
                        border: `1px dashed ${cardBorder}`,
                        textAlign: "center",
                        color: textSub,
                        fontSize: "12px"
                      }}
                    >
                      <div style={{ fontSize: "24px", marginBottom: "4px" }}>🪙</div>
                      <div style={{ fontWeight: "700", color: textMain, marginBottom: "2px" }}>
                        Aucun métal sélectionné
                      </div>
                      <div>
                        Activez un des métaux recommandés ci-dessus ou créez vos propres alliages personnalisés.
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                        gap: "6px",
                        maxHeight: "220px",
                        overflowY: "auto"
                      }}
                    >
                      {materials.map((mat) => {
                        const em = materialEmojis[mat] || "🪙";
                        return (
                          <div
                            key={mat}
                            style={{
                              background: isDark ? "#1e293b" : "#f8fafc",
                              border: `1px solid ${cardBorder}`,
                              borderRadius: "10px",
                              padding: "8px 10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "6px"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
                              <span style={{ fontSize: "15px" }}>{em}</span>
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  color: textMain,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis"
                                }}
                              >
                                {mat}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveMetal(mat)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#ef4444",
                                fontSize: "12px",
                                cursor: "pointer",
                                padding: "2px"
                              }}
                              title={`Supprimer ${mat}`}
                            >
                              🗑️
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Actions Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
              <button
                type="button"
                onClick={() => setStep(3)}
                style={{
                  padding: "13px 18px",
                  borderRadius: "12px",
                  border: `1px solid ${cardBorder}`,
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: textSub,
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                ← Retour
              </button>

              <button
                type="button"
                onClick={() => {
                  saveCategoriesData(categories, emojis, colors);
                  saveMaterialsData(materials, materialEmojis);
                  setStep(5);
                }}
                style={{
                  flex: 1,
                  padding: "13px 18px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(37, 99, 235, 0.25)",
                  transition: "all 0.2s ease"
                }}
              >
                Continuer vers l'étape 5 →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 5 : PRÉ-PERSONNALISATION (CARTE & THÈME)            */}
        {/* ========================================================= */}
        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "900", color: textMain, letterSpacing: "-0.5px" }}>
                Configuration Initiale ⚙️
              </h1>
              <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
                Personnalisez votre affichage cartographique et l'interface de travail.
              </p>
            </div>

            {/* 1. Map Style */}
            <div>
              <label style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: textSub, letterSpacing: "0.5px", marginBottom: "8px", display: "block" }}>
                Fond de carte par défaut
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div
                  onClick={() => setSelectedMapStyle("satellite")}
                  style={{
                    padding: "14px",
                    borderRadius: "14px",
                    border: selectedMapStyle === "satellite" ? "2px solid #2563eb" : `1px solid ${cardBorder}`,
                    background: selectedMapStyle === "satellite" ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: "800", color: selectedMapStyle === "satellite" ? (isDark ? "#60a5fa" : "#1e3a8a") : textMain }}>
                    🛰️ Satellite HD
                  </div>
                  <div style={{ fontSize: "11px", color: textSub, marginTop: "2px" }}>
                    Imagerie aérienne
                  </div>
                </div>

                <div
                  onClick={() => setSelectedMapStyle("streets")}
                  style={{
                    padding: "14px",
                    borderRadius: "14px",
                    border: selectedMapStyle === "streets" ? "2px solid #2563eb" : `1px solid ${cardBorder}`,
                    background: selectedMapStyle === "streets" ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: "800", color: selectedMapStyle === "streets" ? (isDark ? "#60a5fa" : "#1e3a8a") : textMain }}>
                    🏔️ Relief & Topo
                  </div>
                  <div style={{ fontSize: "11px", color: textSub, marginTop: "2px" }}>
                    Courbes de niveau
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Dark / Light Mode with Live Preview */}
            <div>
              <label style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: textSub, letterSpacing: "0.5px", marginBottom: "8px", display: "block" }}>
                Mode d'Affichage
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => handleSelectTheme("dark")}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: selectedAppTheme === "dark" ? "2px solid #2563eb" : `1px solid ${cardBorder}`,
                    background: selectedAppTheme === "dark" ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
                    color: selectedAppTheme === "dark" ? (isDark ? "#60a5fa" : "#1e3a8a") : textSub,
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  🌙 Sombre {selectedAppTheme === "dark" && "✓"}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTheme("light")}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: selectedAppTheme === "light" ? "2px solid #2563eb" : `1px solid ${cardBorder}`,
                    background: selectedAppTheme === "light" ? (isDark ? "rgba(37, 99, 235, 0.25)" : "#eff6ff") : cardBg,
                    color: selectedAppTheme === "light" ? (isDark ? "#60a5fa" : "#1e3a8a") : textSub,
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  ☀️ Clair {selectedAppTheme === "light" && "✓"}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => setStep(4)}
                style={{
                  padding: "13px 18px",
                  borderRadius: "12px",
                  border: `1px solid ${cardBorder}`,
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: textSub,
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                ← Retour
              </button>

              <button
                type="button"
                onClick={() => setStep(6)}
                style={{
                  flex: 1,
                  padding: "13px 18px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(37, 99, 235, 0.25)",
                  transition: "all 0.2s ease"
                }}
              >
                Continuer vers l'étape 6 →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 6 : MESSAGE PERSONNEL DU CRÉATEUR                   */}
        {/* ========================================================= */}
        {step === 6 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h1 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "900", color: textMain, letterSpacing: "-0.5px" }}>
                Bienvenue dans l'aventure 🧭
              </h1>
              <p style={{ margin: 0, fontSize: "13px", color: textSub, lineHeight: "1.5" }}>
                Ceci est la dernière étape avant de faire vos premiers pas dans GeoProspect.
              </p>
            </div>

            {/* Letter / Personal Message Card */}
            <div
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "16px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                fontSize: "13px",
                lineHeight: "1.6",
                color: isDark ? "#e2e8f0" : "#334155",
                maxHeight: "52vh",
                overflowY: "auto"
              }}
            >
              <p style={{ margin: 0 }}>
                Cette application est 100 % gratuite et toujours en phase de test. Il se peut que vous rencontriez de nombreux bugs et failles de développement à mesure de son utilisation.
              </p>
              <p style={{ margin: 0 }}>
                On parle d'un projet développé seul par un étudiant de 19 ans qui cherche uniquement à partager cette merveilleuse activité qu'est la détection de métaux. Proposer un outil de poche est ma manière de contribuer à la communauté en offrant la possibilité de gérer son petit carnet de bord.
              </p>
              <p style={{ margin: 0 }}>
                Tous vos retours seront votre manière de remercier mon travail, un simple compte-rendu de votre expérience suffira amplement à contribuer à l'amélioration constante de GeoProspect.
              </p>
              <p style={{ margin: 0 }}>
                Je me suis ainsi permis d'ouvrir un espace aux dons pour permettre à tous les utilisateurs étant extrêmement satisfaits de soutenir le projet de manière plus directe. Ce fond pourra servir à investir dans ce dernier à plus long terme en allouant des ressources plus importantes et en continuant l'apport mensuel de nouveautés.
              </p>
              <p style={{ margin: 0 }}>
                Enfin, j'aimerais souligner que notre loisir est encadré par des lois. À ce titre, il demeure essentiel de se renseigner sur la législation française afin d'éviter de ternir notre réputation et d'amputer la communauté responsable qui ne souhaite que plus de visibilité. <em>Prospecter exige une déontologie.</em>
              </p>
              <div style={{ marginTop: "4px", padding: "12px 14px", borderRadius: "12px", background: isDark ? "rgba(59, 130, 246, 0.12)" : "#eff6ff", border: isDark ? "1px solid rgba(59, 130, 246, 0.25)" : "1px solid #dbeafe", fontWeight: "600", color: isDark ? "#93c5fd" : "#1e40af", fontSize: "13px", textAlign: "center", lineHeight: "1.5" }}>
                Allez, je vous laisse profiter ! Merci pour votre lecture, bonnes recherches :)
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
              <button
                type="button"
                onClick={() => setStep(5)}
                style={{
                  padding: "13px 18px",
                  borderRadius: "12px",
                  border: `1px solid ${cardBorder}`,
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: textSub,
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                ← Retour
              </button>

              <button
                type="button"
                onClick={handleFinish}
                style={{
                  flex: 1,
                  padding: "13px 18px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(37, 99, 235, 0.25)",
                  transition: "all 0.2s ease"
                }}
              >
                Accéder à l'application 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
