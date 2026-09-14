const STORAGE_CATEGORIES_KEY = "geoprospect_custom_categories";
const STORAGE_EMOJIS_KEY = "geoprospect_custom_emojis";
const STORAGE_COLORS_KEY = "geoprospect_custom_colors";

export function loadCategoriesData() {
  try {
    const storedCats = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    const storedEmojis = localStorage.getItem(STORAGE_EMOJIS_KEY);
    const storedColors = localStorage.getItem(STORAGE_COLORS_KEY);

    const categories = storedCats ? JSON.parse(storedCats) : {};
    const emojis = storedEmojis ? JSON.parse(storedEmojis) : {};
    const colors = storedColors ? JSON.parse(storedColors) : {};

    return { categories, emojis, colors };
  } catch (err) {
    console.error("Failed to load custom categories:", err);
    return {
      categories: {},
      emojis: {},
      colors: {}
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
