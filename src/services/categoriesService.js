import { supabase } from "../supabase.js";
import {
  categoryEmojis as defaultCategoryEmojis,
  defaultCategoryColors,
  categoriesWithSub as defaultCategoriesWithSub,
  PRESET_CATEGORY_COLORS
} from "../subCategories.js";
import { resolveMarkerId } from "../constants/tacticalMarkers.js";

const STORAGE_CATEGORIES_KEY = "geoprospect_custom_categories";
const STORAGE_EMOJIS_KEY = "geoprospect_custom_emojis";
const STORAGE_COLORS_KEY = "geoprospect_custom_colors";

// All keys ever used across previous and current versions of the app
const LEGACY_CATEGORIES_KEYS = [
  "geoprospect_custom_categories",
  "rdl_custom_categories",
  "geoprospect_categories_v1",
  "geoprospect_categories"
];

const LEGACY_EMOJIS_KEYS = [
  "geoprospect_custom_emojis",
  "rdl_custom_emojis",
  "geoprospect_emojis_v1",
  "geoprospect_emojis"
];

const LEGACY_COLORS_KEYS = [
  "geoprospect_custom_colors",
  "rdl_custom_colors",
  "geoprospect_colors_v1",
  "geoprospect_colors"
];

function tryParseCategories(raw) {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!parsed) return null;

    // Format 1: Array of category names or objects: ["Monnaie", ...] or [{ name: "Monnaie", ... }]
    if (Array.isArray(parsed) && parsed.length > 0) {
      const obj = {};
      parsed.forEach((c) => {
        if (typeof c === "string" && c.trim()) {
          obj[c.trim()] = [];
        } else if (c && typeof c === "object" && c.name && typeof c.name === "string" && c.name.trim()) {
          obj[c.name.trim()] = Array.isArray(c.subCategories) ? c.subCategories : [];
        }
      });
      return Object.keys(obj).length > 0 ? obj : null;
    }

    // Format 2: Object map: { "Monnaie": [...], ... }
    if (typeof parsed === "object" && !Array.isArray(parsed)) {
      const keys = Object.keys(parsed);
      if (keys.length > 0) {
        const clean = {};
        keys.forEach((k) => {
          if (k && typeof k === "string" && k.trim()) {
            clean[k.trim()] = Array.isArray(parsed[k]) ? parsed[k] : [];
          }
        });
        return Object.keys(clean).length > 0 ? clean : null;
      }
    }
  } catch (e) {
    // Ignore invalid JSON
  }
  return null;
}

function tryParseDict(raw) {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && Object.keys(parsed).length > 0) {
      return parsed;
    }
  } catch {}
  return null;
}

export async function syncCategoriesToCloud() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { categories, emojis, colors } = loadCategoriesData();
    await supabase.auth.updateUser({
      data: {
        geoprospect_categories: categories,
        geoprospect_emojis: emojis,
        geoprospect_colors: colors,
        geoprospect_categories_synced_at: new Date().toISOString()
      }
    });
    return true;
  } catch (err) {
    console.warn("Cloud categories sync non-blocking error:", err);
    return false;
  }
}

export async function pullCategoriesFromCloud(user = null) {
  try {
    let currentUser = user;
    if (!currentUser) {
      const { data } = await supabase.auth.getUser();
      currentUser = data?.user;
    }
    if (!currentUser || !currentUser.user_metadata) return false;

    const cloudCats = currentUser.user_metadata.geoprospect_categories;
    const cloudEmojis = currentUser.user_metadata.geoprospect_emojis;
    const cloudColors = currentUser.user_metadata.geoprospect_colors;

    const parsedCloudCats = tryParseCategories(cloudCats);
    if (parsedCloudCats && Object.keys(parsedCloudCats).length > 0) {
      const local = loadCategoriesData();
      const mergedCats = { ...local.categories, ...parsedCloudCats };
      const mergedEmojis = { ...local.emojis, ...(cloudEmojis || {}) };
      const mergedColors = { ...local.colors, ...(cloudColors || {}) };

      saveCategoriesData(mergedCats, mergedEmojis, mergedColors);
      return true;
    }
  } catch (err) {
    console.warn("Cloud categories pull error:", err);
  }
  return false;
}

// Automatically sync on auth state changes
try {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
      pullCategoriesFromCloud(session.user);
    }
  });
} catch {
  // Ignored in non-browser env
}

export function loadCategoriesData() {
  try {
    let recoveredCats = null;
    let recoveredEmojis = {};
    let recoveredColors = {};

    // 1. Check current and all legacy localStorage keys in order of precedence
    for (const key of LEGACY_CATEGORIES_KEYS) {
      const val = localStorage.getItem(key);
      const parsed = tryParseCategories(val);
      if (parsed && Object.keys(parsed).length > 0) {
        recoveredCats = parsed;
        break;
      }
    }

    // 2. Recover emojis dictionary from all legacy keys
    for (const key of LEGACY_EMOJIS_KEYS) {
      const val = localStorage.getItem(key);
      const parsed = tryParseDict(val);
      if (parsed) {
        recoveredEmojis = { ...parsed, ...recoveredEmojis };
      }
    }

    // 3. Recover colors dictionary from all legacy keys
    for (const key of LEGACY_COLORS_KEYS) {
      const val = localStorage.getItem(key);
      const parsed = tryParseDict(val);
      if (parsed) {
        recoveredColors = { ...parsed, ...recoveredColors };
      }
    }

    // 4. Fallback guarantee: GeoProspect NEVER allows 0 categories
    const categories = (recoveredCats && Object.keys(recoveredCats).length > 0)
      ? recoveredCats
      : { ...defaultCategoriesWithSub };

    // 5. Ensure all categories have a valid tactical marker ID and valid hex color
    const emojis = {};
    const colors = {};

    Object.keys(categories).forEach((cat, idx) => {
      // Normalize emoji: legacy unicode (e.g. 🪙) or empty -> tactical marker ID
      const rawEmoji = recoveredEmojis[cat] || defaultCategoryEmojis[cat] || null;
      emojis[cat] = resolveMarkerId(rawEmoji, cat);

      // Normalize color: ensure valid hex color
      const rawColor = recoveredColors[cat] || defaultCategoryColors[cat] || null;
      if (rawColor && typeof rawColor === "string" && rawColor.startsWith("#")) {
        colors[cat] = rawColor;
      } else {
        colors[cat] = PRESET_CATEGORY_COLORS[idx % PRESET_CATEGORY_COLORS.length] || "#2c5e4c";
      }
    });

    // 6. Auto-heal: persist the consolidated data to the canonical keys
    try {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
      localStorage.setItem(STORAGE_EMOJIS_KEY, JSON.stringify(emojis));
      localStorage.setItem(STORAGE_COLORS_KEY, JSON.stringify(colors));
    } catch {}

    return { categories, emojis, colors };
  } catch (err) {
    console.error("Failed to load custom categories:", err);
    return {
      categories: { ...defaultCategoriesWithSub },
      emojis: { ...defaultCategoryEmojis },
      colors: { ...defaultCategoryColors }
    };
  }
}

export function saveCategoriesData(categories, emojis, colors) {
  try {
    const current = loadCategoriesData();
    let finalCategories = categories !== undefined ? categories : current.categories;
    let finalEmojis = emojis !== undefined ? emojis : current.emojis;
    let finalColors = colors !== undefined ? colors : current.colors;

    // Safety guard: NEVER allow saving an empty categories object!
    if (!finalCategories || typeof finalCategories !== "object" || Object.keys(finalCategories).length === 0) {
      finalCategories = { ...defaultCategoriesWithSub };
    }

    // Ensure all categories have an emoji marker and a color
    const safeEmojis = { ...(finalEmojis || {}) };
    const safeColors = { ...(finalColors || {}) };
    Object.keys(finalCategories).forEach((cat, idx) => {
      safeEmojis[cat] = resolveMarkerId(safeEmojis[cat] || defaultCategoryEmojis[cat], cat);
      if (!safeColors[cat] || !safeColors[cat].startsWith("#")) {
        safeColors[cat] = defaultCategoryColors[cat] || PRESET_CATEGORY_COLORS[idx % PRESET_CATEGORY_COLORS.length] || "#2c5e4c";
      }
    });

    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(finalCategories));
    localStorage.setItem(STORAGE_EMOJIS_KEY, JSON.stringify(safeEmojis));
    localStorage.setItem(STORAGE_COLORS_KEY, JSON.stringify(safeColors));
    window.dispatchEvent(new Event("categories-updated"));

    // Sync to Supabase cloud in background
    syncCategoriesToCloud();
  } catch (err) {
    console.error("Failed to save categories data:", err);
  }
}

export function addCategory(name, emoji = "monnaie", subCategories = [], color = "#2c5e4c") {
  const trimmedName = name.trim();
  if (!trimmedName) return false;
  
  const { categories, emojis, colors } = loadCategoriesData();
  categories[trimmedName] = Array.isArray(subCategories) ? subCategories : [];
  emojis[trimmedName] = resolveMarkerId(emoji, trimmedName);
  colors[trimmedName] = color && color.startsWith("#") ? color : "#2c5e4c";
  
  saveCategoriesData(categories, emojis, colors);
  return true;
}

export function updateCategoryColor(categoryName, newColor) {
  if (!categoryName || !newColor) return false;
  const { categories, emojis, colors } = loadCategoriesData();
  colors[categoryName] = newColor;
  saveCategoriesData(categories, emojis, colors);
  return true;
}

export function updateCategoryEmoji(categoryName, newEmoji) {
  if (!categoryName || !newEmoji) return false;
  const { categories, emojis, colors } = loadCategoriesData();
  emojis[categoryName] = resolveMarkerId(newEmoji, categoryName);
  saveCategoriesData(categories, emojis, colors);
  return true;
}

export function removeCategory(name) {
  const { categories, emojis, colors } = loadCategoriesData();
  delete categories[name];
  delete emojis[name];
  delete colors[name];
  saveCategoriesData(categories, emojis, colors);
  return true;
}

export function addSubCategory(categoryName, subCategoryName) {
  const trimmedSub = subCategoryName.trim();
  if (!trimmedSub) return false;

  const { categories, emojis, colors } = loadCategoriesData();
  if (!categories[categoryName]) {
    categories[categoryName] = [];
  }
  if (!categories[categoryName].includes(trimmedSub)) {
    categories[categoryName].push(trimmedSub);
    saveCategoriesData(categories, emojis, colors);
  }
  return true;
}

export function removeSubCategory(categoryName, subCategoryName) {
  const { categories, emojis, colors } = loadCategoriesData();
  if (categories[categoryName]) {
    categories[categoryName] = categories[categoryName].filter(s => s !== subCategoryName);
    saveCategoriesData(categories, emojis, colors);
  }
  return true;
}

/**
 * Automatically inspects finds to guarantee that all categories present in
 * historical finds are registered and preserved in categoriesData.
 */
export function ensureCategoriesFromFinds(finds = []) {
  if (!Array.isArray(finds) || finds.length === 0) return;
  try {
    const { categories, emojis, colors } = loadCategoriesData();
    let hasNew = false;
    const updatedCats = { ...categories };
    const updatedEmojis = { ...emojis };
    const updatedColors = { ...colors };

    finds.forEach((find) => {
      const rawCat = find?.category;
      if (rawCat && typeof rawCat === "string") {
        const catName = rawCat.trim();
        if (catName && !updatedCats[catName]) {
          updatedCats[catName] = [];
          updatedEmojis[catName] = resolveMarkerId(null, catName);
          updatedColors[catName] = defaultCategoryColors[catName] || PRESET_CATEGORY_COLORS[Object.keys(updatedCats).length % PRESET_CATEGORY_COLORS.length];
          hasNew = true;
        }
      }
    });

    if (hasNew) {
      saveCategoriesData(updatedCats, updatedEmojis, updatedColors);
    }
  } catch (err) {
    console.warn("Could not synchronize categories from finds:", err);
  }
}
