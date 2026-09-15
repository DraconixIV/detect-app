import { supabase } from "../supabase.js";
import {
  categoryEmojis as defaultCategoryEmojis,
  defaultCategoryColors,
  categoriesWithSub as defaultCategoriesWithSub
} from "../subCategories.js";

const STORAGE_CATEGORIES_KEY = "geoprospect_custom_categories";
const STORAGE_EMOJIS_KEY = "geoprospect_custom_emojis";
const STORAGE_COLORS_KEY = "geoprospect_custom_colors";

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

    if (cloudCats && Object.keys(cloudCats).length > 0) {
      const local = loadCategoriesData();
      // Merge cloud over local
      const mergedCats = { ...local.categories, ...cloudCats };
      const mergedEmojis = { ...local.emojis, ...cloudEmojis };
      const mergedColors = { ...local.colors, ...cloudColors };

      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(mergedCats));
      localStorage.setItem(STORAGE_EMOJIS_KEY, JSON.stringify(mergedEmojis));
      localStorage.setItem(STORAGE_COLORS_KEY, JSON.stringify(mergedColors));
      window.dispatchEvent(new Event("categories-updated"));
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
    const storedCats = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    const storedEmojis = localStorage.getItem(STORAGE_EMOJIS_KEY);
    const storedColors = localStorage.getItem(STORAGE_COLORS_KEY);

    const userCats = storedCats ? JSON.parse(storedCats) : null;
    const userEmojis = storedEmojis ? JSON.parse(storedEmojis) : null;
    const userColors = storedColors ? JSON.parse(storedColors) : null;

    const categories = { ...defaultCategoriesWithSub, ...(userCats || {}) };
    const emojis = { ...defaultCategoryEmojis, ...(userEmojis || {}) };
    const colors = { ...defaultCategoryColors, ...(userColors || {}) };

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
    const finalCategories = categories || current.categories;
    const finalEmojis = emojis || current.emojis;
    const finalColors = colors || current.colors;

    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(finalCategories));
    localStorage.setItem(STORAGE_EMOJIS_KEY, JSON.stringify(finalEmojis));
    localStorage.setItem(STORAGE_COLORS_KEY, JSON.stringify(finalColors));
    window.dispatchEvent(new Event("categories-updated"));

    // Sync to Supabase cloud in background
    syncCategoriesToCloud();
  } catch (err) {
    console.error("Failed to save categories data:", err);
  }
}

export function addCategory(name, emoji = "📦", subCategories = ["Indéterminé"], color = "#3b82f6") {
  const trimmedName = name.trim();
  if (!trimmedName) return false;
  
  const { categories, emojis, colors } = loadCategoriesData();
  categories[trimmedName] = subCategories && subCategories.length > 0 ? subCategories : ["Indéterminé"];
  emojis[trimmedName] = emoji || "📦";
  colors[trimmedName] = color || "#3b82f6";
  
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
  emojis[categoryName] = newEmoji;
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
