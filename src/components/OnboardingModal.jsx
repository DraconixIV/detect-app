import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { SUGGESTED_STARTER_CATEGORIES } from "../subCategories";
import { loadCategoriesData, saveCategoriesData } from "../services/categoriesService";
import { loadMaterialsData, saveMaterialsData } from "../services/materialsService";

import OnboardingStep1Welcome from "./onboarding/OnboardingStep1Welcome";
import OnboardingStep2Legal from "./onboarding/OnboardingStep2Legal";
import OnboardingStep3Auth from "./onboarding/OnboardingStep3Auth";
import OnboardingStep4Categories from "./onboarding/OnboardingStep4Categories";
import OnboardingStep5Theme from "./onboarding/OnboardingStep5Theme";
import OnboardingStep6Letter from "./onboarding/OnboardingStep6Letter";

export default function OnboardingModal({ isOpen, onComplete, onLiveThemeChange, currentTheme = "dark" }) {
  // Step 1: Découverte et Fonctionnalités clés
  // Step 2: Cadre Légal et Charte Éthique
  // Step 3: Espace Prospecteur (Authentification)
  // Step 4: Votre Classification (Catégories et Métaux)
  // Step 5: Configuration Initiale (Carte, Thème)
  // Step 6: Message Personnel du Créateur
  const [step, setStepState] = useState(() => {
    try {
      const saved = sessionStorage.getItem("geoprospect_onboarding_step");
      if (saved) {
        const num = parseInt(saved, 10);
        if (num >= 1 && num <= 6) return num;
      }
    } catch {}
    return 1;
  });

  const setStep = (newStep) => {
    setStepState(newStep);
    try {
      sessionStorage.setItem("geoprospect_onboarding_step", String(newStep));
    } catch {}
  };

  const [step4Tab, setStep4Tab] = useState("categories"); // 'categories' | 'metals'
  const [user, setUser] = useState(null);

  // Legal Checkboxes state (restored if previously accepted or returning from OAuth)
  const [checkOwner, setCheckOwner] = useState(() => {
    try {
      const s = parseInt(sessionStorage.getItem("geoprospect_onboarding_step") || "1", 10);
      return s >= 3 || localStorage.getItem("geoprospect_cgu_accepted") === "true";
    } catch { return false; }
  });
  const [checkHeritage, setCheckHeritage] = useState(() => {
    try {
      const s = parseInt(sessionStorage.getItem("geoprospect_onboarding_step") || "1", 10);
      return s >= 3 || localStorage.getItem("geoprospect_cgu_accepted") === "true";
    } catch { return false; }
  });
  const [checkDeclaration, setCheckDeclaration] = useState(() => {
    try {
      const s = parseInt(sessionStorage.getItem("geoprospect_onboarding_step") || "1", 10);
      return s >= 3 || localStorage.getItem("geoprospect_cgu_accepted") === "true";
    } catch { return false; }
  });
  const [checkNature, setCheckNature] = useState(() => {
    try {
      const s = parseInt(sessionStorage.getItem("geoprospect_onboarding_step") || "1", 10);
      return s >= 3 || localStorage.getItem("geoprospect_cgu_accepted") === "true";
    } catch { return false; }
  });
  const [checkCgu, setCheckCgu] = useState(() => {
    try {
      const s = parseInt(sessionStorage.getItem("geoprospect_onboarding_step") || "1", 10);
      return s >= 3 || localStorage.getItem("geoprospect_cgu_accepted") === "true";
    } catch { return false; }
  });

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
  const [targetCategoryForSub, setTargetCategoryForSub] = useState("");
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
      const u = data?.user || null;
      setUser(u);
      if (u) {
        const oauthPending = sessionStorage.getItem("geoprospect_onboarding_oauth_pending");
        if (oauthPending === "true") {
          sessionStorage.removeItem("geoprospect_onboarding_oauth_pending");
          setStep(4);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      setUser(u);
      if (u) {
        const oauthPending = sessionStorage.getItem("geoprospect_onboarding_oauth_pending");
        if (oauthPending === "true") {
          sessionStorage.removeItem("geoprospect_onboarding_oauth_pending");
          setStep(4);
        }
      }
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

    const finalSubs = parsedSubs;

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

  const handleAddCustomSubCategory = (e) => {
    e?.preventDefault();
    const subsToAdd = newSubText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (subsToAdd.length === 0) return;

    const catList = Object.keys(categories);
    if (catList.length === 0) return;

    let targetCat = "";
    const trimmedCatInput = newCatName.trim();
    if (trimmedCatInput && categories[trimmedCatInput]) {
      targetCat = trimmedCatInput;
    } else if (targetCategoryForSub && categories[targetCategoryForSub]) {
      targetCat = targetCategoryForSub;
    } else if (expandedCat && categories[expandedCat]) {
      targetCat = expandedCat;
    } else {
      targetCat = catList[0];
    }

    const currentSubs = Array.isArray(categories[targetCat]) ? [...categories[targetCat]] : [];
    subsToAdd.forEach((s) => {
      if (!currentSubs.includes(s)) {
        currentSubs.push(s);
      }
    });

    const updatedCats = { ...categories, [targetCat]: currentSubs };
    setCategories(updatedCats);
    saveCategoriesData(updatedCats, emojis, colors);
    setNewSubText("");
    setExpandedCat(targetCat);
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

  const handleToggleStarter = (name) => {
    if (categories[name]) {
      handleRemoveCategory(name);
    } else {
      const starter = SUGGESTED_STARTER_CATEGORIES[name];
      if (!starter) return;

      const updatedCats = { ...categories, [name]: [...starter.subCategories] };
      const updatedEmojis = { ...emojis, [name]: starter.emoji };
      const updatedColors = { ...colors, [name]: starter.color };

      setCategories(updatedCats);
      setEmojis(updatedEmojis);
      setColors(updatedColors);
      saveCategoriesData(updatedCats, updatedEmojis, updatedColors);
    }
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
    try {
      sessionStorage.removeItem("geoprospect_onboarding_step");
      sessionStorage.removeItem("geoprospect_onboarding_oauth_pending");
    } catch {}
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

        {/* Étape 1 */}
        {step === 1 && (
          <OnboardingStep1Welcome
            isDark={isDark}
            cardBg={cardBg}
            cardBorder={cardBorder}
            textMain={textMain}
            textSub={textSub}
            onNext={() => setStep(2)}
          />
        )}

        {/* Étape 2 */}
        {step === 2 && (
          <OnboardingStep2Legal
            isDark={isDark}
            cardBg={cardBg}
            cardBorder={cardBorder}
            textMain={textMain}
            textSub={textSub}
            checkOwner={checkOwner}
            setCheckOwner={setCheckOwner}
            checkHeritage={checkHeritage}
            setCheckHeritage={setCheckHeritage}
            checkDeclaration={checkDeclaration}
            setCheckDeclaration={setCheckDeclaration}
            checkNature={checkNature}
            setCheckNature={setCheckNature}
            checkCgu={checkCgu}
            setCheckCgu={setCheckCgu}
            allLegalChecked={allLegalChecked}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {/* Étape 3 */}
        {step === 3 && (
          <OnboardingStep3Auth
            isDark={isDark}
            cardBorder={cardBorder}
            textMain={textMain}
            textSub={textSub}
            selectedAppTheme={selectedAppTheme}
            user={user}
            setUser={setUser}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {/* Étape 4 */}
        {step === 4 && (
          <OnboardingStep4Categories
            isDark={isDark}
            cardBg={cardBg}
            cardBorder={cardBorder}
            inputBg={inputBg}
            inputBorder={inputBorder}
            textMain={textMain}
            textSub={textSub}
            step4Tab={step4Tab}
            setStep4Tab={setStep4Tab}
            categories={categories}
            emojis={emojis}
            colors={colors}
            materials={materials}
            materialEmojis={materialEmojis}
            newCatName={newCatName}
            setNewCatName={setNewCatName}
            newCatEmoji={newCatEmoji}
            setNewCatEmoji={setNewCatEmoji}
            newCatColor={newCatColor}
            setNewCatColor={setNewCatColor}
            newSubText={newSubText}
            setNewSubText={setNewSubText}
            targetCategoryForSub={targetCategoryForSub}
            setTargetCategoryForSub={setTargetCategoryForSub}
            expandedCat={expandedCat}
            setExpandedCat={setExpandedCat}
            inlineSubInput={inlineSubInput}
            setInlineSubInput={setInlineSubInput}
            newMetalName={newMetalName}
            setNewMetalName={setNewMetalName}
            newMetalEmoji={newMetalEmoji}
            setNewMetalEmoji={setNewMetalEmoji}
            handleToggleStarter={handleToggleStarter}
            handleAddCustomCategory={handleAddCustomCategory}
            handleAddCustomSubCategory={handleAddCustomSubCategory}
            handleRemoveCategory={handleRemoveCategory}
            handleAddSubInline={handleAddSubInline}
            handleRemoveSubInline={handleRemoveSubInline}
            handleToggleRecommendedMetal={handleToggleRecommendedMetal}
            handleAddCustomMetal={handleAddCustomMetal}
            handleRemoveMetal={handleRemoveMetal}
            onBack={() => setStep(3)}
            onNext={() => {
              saveCategoriesData(categories, emojis, colors);
              saveMaterialsData(materials, materialEmojis);
              setStep(5);
            }}
          />
        )}

        {/* Étape 5 */}
        {step === 5 && (
          <OnboardingStep5Theme
            isDark={isDark}
            cardBg={cardBg}
            cardBorder={cardBorder}
            textMain={textMain}
            textSub={textSub}
            selectedMapStyle={selectedMapStyle}
            setSelectedMapStyle={setSelectedMapStyle}
            selectedAppTheme={selectedAppTheme}
            handleSelectTheme={handleSelectTheme}
            onBack={() => setStep(4)}
            onNext={() => setStep(6)}
          />
        )}

        {/* Étape 6 */}
        {step === 6 && (
          <OnboardingStep6Letter
            isDark={isDark}
            cardBg={cardBg}
            cardBorder={cardBorder}
            textMain={textMain}
            textSub={textSub}
            onBack={() => setStep(5)}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
}
