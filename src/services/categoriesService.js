import { supabase } from "../supabase.js";
import { PRESET_CATEGORY_COLORS } from "../subCategories.js";
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

const LEGACY_DEVELOPER_CATEGORIES = new Set([
  "monnaie",
  "bijou",
  "boucle",
  "bouton",
  "médaille",
  "medaille",
  "militaria",
  "munition",
  "outil",
  "plomb",
  "religieux",
  "autre"
]);

export function isLegacyDeveloperCategorySet(cats) {
  if (!cats || typeof cats !== "object") return false;
  const keys = Object.keys(cats);
  if (keys.length === 0) return false;
  // If every single category is in the developer's legacy starter list, it is contaminated
  return keys.every((k) => LEGACY_DEVELOPER_CATEGORIES.has(k.trim().toLowerCase()));
}

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
    if (!currentUser) return false;

    const cloudCatsRaw = currentUser.user_metadata?.geoprospect_categories;
    const cloudEmojisRaw = currentUser.user_metadata?.geoprospect_emojis;
    const cloudColorsRaw = currentUser.user_metadata?.geoprospect_colors;

    const parsedCloudCats = tryParseCategories(cloudCatsRaw);

    // If cloud has categories, check if they are the contaminated developer starter set
    if (parsedCloudCats && Object.keys(parsedCloudCats).length > 0) {
      if (isLegacyDeveloperCategorySet(parsedCloudCats)) {
        // Purge contaminated developer categories from this user
        saveCategoriesData({}, {}, {});
        await supabase.auth.updateUser({
          data: {
            geoprospect_categories: {},
            geoprospect_emojis: {},
            geoprospect_colors: {},
            geoprospect_categories_synced_at: new Date().toISOString()
          }
        });
        return true;
      }
      // Legitimate user categories from cloud
      saveCategoriesData(parsedCloudCats, cloudEmojisRaw || {}, cloudColorsRaw || {});
      return true;
    } else {
      // Cloud has NO categories: THIS IS A NEW USER (or user with 0 categories).
      // Every user must start with 0 categories!
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
      try {
        localStorage.removeItem(STORAGE_CATEGORIES_KEY);
        localStorage.removeItem(STORAGE_EMOJIS_KEY);
        localStorage.removeItem(STORAGE_COLORS_KEY);
      } catch {}
      window.dispatchEvent(new Event("categories-updated"));
    }
  });
} catch {
  // Ignored in non-browser env
}

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

export function loadCategoriesData(forceRefresh = false) {
  if (!forceRefresh && categoriesDataCache) {
    return categoriesDataCache;
  }

  try {
    let recoveredCats = null;
    let recoveredEmojis = {};
    let recoveredColors = {};

    // 1. Check primary key first
    const primaryCatsRaw = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    const parsedPrimary = tryParseCategories(primaryCatsRaw);
    if (parsedPrimary && Object.keys(parsedPrimary).length > 0) {
      recoveredCats = parsedPrimary;
    } else {
      // 2. If primary key is empty or null, check all legacy keys to recover user-created categories
      for (const key of LEGACY_CATEGORIES_KEYS) {
        if (key === STORAGE_CATEGORIES_KEY) continue;
        const val = localStorage.getItem(key);
        const parsed = tryParseCategories(val);
        if (parsed && Object.keys(parsed).length > 0) {
          recoveredCats = parsed;
          break;
        }
      }
    }

    // 3. Recover emojis dictionary from all legacy keys
    for (const key of LEGACY_EMOJIS_KEYS) {
      const val = localStorage.getItem(key);
      const parsed = tryParseDict(val);
      if (parsed) {
        recoveredEmojis = { ...parsed, ...recoveredEmojis };
      }
    }

    // 4. Recover colors dictionary from all legacy keys
    for (const key of LEGACY_COLORS_KEYS) {
      const val = localStorage.getItem(key);
      const parsed = tryParseDict(val);
      if (parsed) {
        recoveredColors = { ...parsed, ...recoveredColors };
      }
    }

    // Purge contaminated developer starter set if present
    if (isLegacyDeveloperCategorySet(recoveredCats)) {
      try {
        localStorage.removeItem(STORAGE_CATEGORIES_KEY);
        localStorage.removeItem(STORAGE_EMOJIS_KEY);
        localStorage.removeItem(STORAGE_COLORS_KEY);
        for (const key of LEGACY_CATEGORIES_KEYS) {
          localStorage.removeItem(key);
        }
        for (const key of LEGACY_EMOJIS_KEYS) {
          localStorage.removeItem(key);
        }
        for (const key of LEGACY_COLORS_KEYS) {
          localStorage.removeItem(key);
        }
      } catch {}
      recoveredCats = null;
      recoveredEmojis = {};
      recoveredColors = {};

      // Also clean up Supabase user_metadata if user is logged in
      try {
        supabase.auth.getUser().then(({ data }) => {
          const user = data?.user;
          if (user) {
            supabase.auth.updateUser({
              data: {
                geoprospect_categories: {},
                geoprospect_emojis: {},
                geoprospect_colors: {},
                geoprospect_categories_synced_at: new Date().toISOString()
              }
            }).catch(() => {});
          }
        }).catch(() => {});
      } catch {}
    }

    // Pure user data: no forced injection of default categories
    const categories = recoveredCats || {};

    // Ensure all categories have a valid tactical marker ID and valid hex color
    const emojis = {};
    const colors = {};

    Object.keys(categories).forEach((cat, idx) => {
      // Normalize emoji: legacy unicode (e.g. 🪙) or empty -> tactical marker ID
      const rawEmoji = recoveredEmojis[cat] || null;
      emojis[cat] = resolveMarkerId(rawEmoji, cat);

      // Normalize color: ensure valid hex color
      const rawColor = recoveredColors[cat] || null;
      if (rawColor && typeof rawColor === "string" && rawColor.startsWith("#")) {
        colors[cat] = rawColor;
      } else {
        colors[cat] = PRESET_CATEGORY_COLORS[idx % PRESET_CATEGORY_COLORS.length] || "#2c5e4c";
      }
    });

    // If categories were recovered from a legacy key, migrate them into the canonical key
    if (recoveredCats && (!parsedPrimary || Object.keys(parsedPrimary).length === 0)) {
      try {
        localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
        localStorage.setItem(STORAGE_EMOJIS_KEY, JSON.stringify(emojis));
        localStorage.setItem(STORAGE_COLORS_KEY, JSON.stringify(colors));
      } catch {}
    }

    categoriesDataCache = { categories, emojis, colors };
    return categoriesDataCache;
  } catch (err) {
    console.error("Failed to load custom categories:", err);
    return { categories: {}, emojis: {}, colors: {} };
  }
}

export function saveCategoriesData(categories, emojis, colors) {
  categoriesDataCache = null;
  try {
    const current = loadCategoriesData();
    let finalCategories = categories !== undefined ? categories : current.categories;
    let finalEmojis = emojis !== undefined ? emojis : current.emojis;
    let finalColors = colors !== undefined ? colors : current.colors;

    if (!finalCategories || typeof finalCategories !== "object") {
      finalCategories = {};
    }

    // Ensure all categories present in finalCategories have an emoji marker and a color
    const safeEmojis = { ...(finalEmojis || {}) };
    const safeColors = { ...(finalColors || {}) };
    Object.keys(finalCategories).forEach((cat, idx) => {
      safeEmojis[cat] = resolveMarkerId(safeEmojis[cat], cat);
      if (!safeColors[cat] || !safeColors[cat].startsWith("#")) {
        safeColors[cat] = PRESET_CATEGORY_COLORS[idx % PRESET_CATEGORY_COLORS.length] || "#2c5e4c";
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
          updatedColors[catName] = PRESET_CATEGORY_COLORS[Object.keys(updatedCats).length % PRESET_CATEGORY_COLORS.length];
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

export function resetCategoriesToZero() {
  saveCategoriesData({}, {}, {});
  try {
    localStorage.removeItem(STORAGE_CATEGORIES_KEY);
    localStorage.removeItem(STORAGE_EMOJIS_KEY);
    localStorage.removeItem(STORAGE_COLORS_KEY);
    for (const key of LEGACY_CATEGORIES_KEYS) {
      localStorage.removeItem(key);
    }
    for (const key of LEGACY_EMOJIS_KEYS) {
      localStorage.removeItem(key);
    }
    for (const key of LEGACY_COLORS_KEYS) {
      localStorage.removeItem(key);
    }
  } catch {}
  syncCategoriesToCloud();
}
