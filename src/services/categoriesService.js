import { supabase } from "../supabase.js";
import { PRESET_CATEGORY_COLORS } from "../subCategories.js";
import { resolveMarkerId } from "../constants/tacticalMarkers.js";
import { getMyUserCode } from "./sessionService.js";

let categoriesDataCache = null;

export function invalidateCategoriesCache() {
  categoriesDataCache = null;
}

try {
  if (typeof window !== "undefined") {
    window.addEventListener("categories-updated", () => {
      categoriesDataCache = null;
    });
  }
} catch {}

function getStorageKeys() {
  let userCode = "ANON";
  try {
    const raw = getMyUserCode();
    if (raw && typeof raw === "string") {
      userCode = raw.replace(/[^A-Za-z0-9_-]/g, "").toUpperCase();
    }
  } catch {}
  return {
    categoriesKey: `geoprospect_categories_${userCode}`,
    emojisKey: `geoprospect_emojis_${userCode}`,
    colorsKey: `geoprospect_colors_${userCode}`,
    isDeveloper: userCode === "GEO-KE9Q88"
  };
}

const LEGACY_GLOBAL_KEYS = [
  "geoprospect_categories_v1",
  "geoprospect_categories",
  "rdl_custom_categories",
  "geoprospect_custom_categories",
  "rdl_custom_emojis",
  "geoprospect_emojis_v1",
  "geoprospect_emojis",
  "geoprospect_custom_emojis",
  "rdl_custom_colors",
  "geoprospect_colors_v1",
  "geoprospect_colors",
  "geoprospect_custom_colors"
];

function ensureCleanStorage() {
  if (typeof localStorage === "undefined") return;

  const { categoriesKey, emojisKey, colorsKey, isDeveloper } = getStorageKeys();

  // One-time migration for developer on their verified device:
  // If user-scoped key does not exist yet, migrate categories from old global key once
  if (isDeveloper) {
    const existing = localStorage.getItem(categoriesKey);
    if (!existing) {
      const oldCatsRaw = localStorage.getItem("geoprospect_custom_categories");
      const parsedOld = tryParseCategories(oldCatsRaw);
      if (parsedOld && Object.keys(parsedOld).length > 0) {
        localStorage.setItem(categoriesKey, JSON.stringify(parsedOld));
        const oldEmojis = localStorage.getItem("geoprospect_custom_emojis");
        if (oldEmojis) localStorage.setItem(emojisKey, oldEmojis);
        const oldColors = localStorage.getItem("geoprospect_custom_colors");
        if (oldColors) localStorage.setItem(colorsKey, oldColors);
      }
    }
  }

  // Purge all old legacy global keys permanently so they can never resurrect
  LEGACY_GLOBAL_KEYS.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  });
}

function tryParseCategories(raw) {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!parsed) return null;

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
  } catch {}
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

export function isLegacyDeveloperCategorySet(_cats) {
  return false;
}

export function cleanDeveloperCategories(cats, emojis = {}, colors = {}) {
  return { cats: cats || {}, emojis: emojis || {}, colors: colors || {} };
}

export function loadCategoriesData(forceRefresh = false) {
  if (!forceRefresh && categoriesDataCache) {
    return categoriesDataCache;
  }

  ensureCleanStorage();
  const { categoriesKey, emojisKey, colorsKey } = getStorageKeys();

  try {
    let parsedCats = {};
    let parsedEmojis = {};
    let parsedColors = {};

    if (typeof localStorage !== "undefined") {
      const rawCats = localStorage.getItem(categoriesKey);
      parsedCats = tryParseCategories(rawCats) || {};

      const rawEmojis = localStorage.getItem(emojisKey);
      parsedEmojis = tryParseDict(rawEmojis) || {};

      const rawColors = localStorage.getItem(colorsKey);
      parsedColors = tryParseDict(rawColors) || {};
    }

    const emojis = {};
    const colors = {};
    Object.keys(parsedCats).forEach((cat, idx) => {
      emojis[cat] = resolveMarkerId(parsedEmojis[cat], cat);
      const c = parsedColors[cat];
      colors[cat] = (c && typeof c === "string" && c.startsWith("#"))
        ? c
        : (PRESET_CATEGORY_COLORS[idx % PRESET_CATEGORY_COLORS.length] || "#2c5e4c");
    });

    categoriesDataCache = {
      categories: parsedCats,
      emojis,
      colors
    };

    return categoriesDataCache;
  } catch (err) {
    console.error("Failed to load custom categories:", err);
    return { categories: {}, emojis: {}, colors: {} };
  }
}

export function saveCategoriesData(categories, emojis, colors) {
  categoriesDataCache = null;
  const { categoriesKey, emojisKey, colorsKey } = getStorageKeys();

  try {
    const finalCategories = (categories && typeof categories === "object" && !Array.isArray(categories))
      ? categories
      : {};
    const finalEmojis = (emojis && typeof emojis === "object" && !Array.isArray(emojis))
      ? emojis
      : {};
    const finalColors = (colors && typeof colors === "object" && !Array.isArray(colors))
      ? colors
      : {};

    const safeEmojis = {};
    const safeColors = {};
    Object.keys(finalCategories).forEach((cat, idx) => {
      safeEmojis[cat] = resolveMarkerId(finalEmojis[cat], cat);
      const c = finalColors[cat];
      safeColors[cat] = (c && typeof c === "string" && c.startsWith("#"))
        ? c
        : (PRESET_CATEGORY_COLORS[idx % PRESET_CATEGORY_COLORS.length] || "#2c5e4c");
    });

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(categoriesKey, JSON.stringify(finalCategories));
      localStorage.setItem(emojisKey, JSON.stringify(safeEmojis));
      localStorage.setItem(colorsKey, JSON.stringify(safeColors));
    }

    categoriesDataCache = {
      categories: finalCategories,
      emojis: safeEmojis,
      colors: safeColors
    };

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("categories-updated"));
    }

    syncCategoriesToCloud();
  } catch (err) {
    console.error("Failed to save categories data:", err);
  }
}

export function addCategory(name, emoji = "autre", subCategories = [], color = "#2c5e4c") {
  const trimmedName = name.trim();
  if (!trimmedName) return false;

  const { categories, emojis, colors } = loadCategoriesData();
  const nextCategories = { ...categories, [trimmedName]: Array.isArray(subCategories) ? subCategories : [] };
  const nextEmojis = { ...emojis, [trimmedName]: resolveMarkerId(emoji, trimmedName) };
  const nextColors = { ...colors, [trimmedName]: (color && color.startsWith("#")) ? color : "#2c5e4c" };

  saveCategoriesData(nextCategories, nextEmojis, nextColors);
  return true;
}

export function updateCategoryColor(categoryName, newColor) {
  if (!categoryName || !newColor) return false;
  const { categories, emojis, colors } = loadCategoriesData();
  const nextColors = { ...colors, [categoryName]: newColor };
  saveCategoriesData(categories, emojis, nextColors);
  return true;
}

export function updateCategoryEmoji(categoryName, newEmoji) {
  if (!categoryName || !newEmoji) return false;
  const { categories, emojis, colors } = loadCategoriesData();
  const nextEmojis = { ...emojis, [categoryName]: resolveMarkerId(newEmoji, categoryName) };
  saveCategoriesData(categories, nextEmojis, colors);
  return true;
}

export function removeCategory(name) {
  const { categories, emojis, colors } = loadCategoriesData();
  const nextCategories = { ...categories };
  delete nextCategories[name];
  const nextEmojis = { ...emojis };
  delete nextEmojis[name];
  const nextColors = { ...colors };
  delete nextColors[name];

  saveCategoriesData(nextCategories, nextEmojis, nextColors);
  return true;
}

export function addSubCategory(categoryName, subCategoryName) {
  const trimmedSub = subCategoryName.trim();
  if (!trimmedSub) return false;

  const { categories, emojis, colors } = loadCategoriesData();
  const nextCategories = { ...categories };
  if (!nextCategories[categoryName]) {
    nextCategories[categoryName] = [];
  }
  if (!nextCategories[categoryName].includes(trimmedSub)) {
    nextCategories[categoryName] = [...nextCategories[categoryName], trimmedSub];
    saveCategoriesData(nextCategories, emojis, colors);
  }
  return true;
}

export function removeSubCategory(categoryName, subCategoryName) {
  const { categories, emojis, colors } = loadCategoriesData();
  if (categories[categoryName]) {
    const nextCategories = {
      ...categories,
      [categoryName]: categories[categoryName].filter((s) => s !== subCategoryName)
    };
    saveCategoriesData(nextCategories, emojis, colors);
  }
  return true;
}

export function ensureCategoriesFromFinds(_finds = []) {
  // Permanently disabled: categories must never be resurrected from finds
  return;
}

export function resetCategoriesToZero() {
  saveCategoriesData({}, {}, {});
  const { categoriesKey, emojisKey, colorsKey } = getStorageKeys();
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(categoriesKey);
      localStorage.removeItem(emojisKey);
      localStorage.removeItem(colorsKey);
    }
  } catch {}
  syncCategoriesToCloud();
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
    if (!currentUser) return false;

    const cloudCatsRaw = currentUser.user_metadata?.geoprospect_categories;
    const cloudEmojisRaw = currentUser.user_metadata?.geoprospect_emojis;
    const cloudColorsRaw = currentUser.user_metadata?.geoprospect_colors;

    const parsedCloudCats = tryParseCategories(cloudCatsRaw);
    if (parsedCloudCats && Object.keys(parsedCloudCats).length > 0) {
      saveCategoriesData(parsedCloudCats, cloudEmojisRaw || {}, cloudColorsRaw || {});
      return true;
    } else {
      // Cloud has NO categories: new user or 0 categories
      saveCategoriesData({}, {}, {});
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
    } else if (event === "SIGNED_OUT") {
      invalidateCategoriesCache();
      const { categoriesKey, emojisKey, colorsKey } = getStorageKeys();
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem(categoriesKey);
          localStorage.removeItem(emojisKey);
          localStorage.removeItem(colorsKey);
        }
      } catch {}
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("categories-updated"));
      }
    }
  });
} catch {}
