import { categoryEmojis as defaultEmojis, categoriesWithSub as defaultCategories } from "../subCategories";

const STORAGE_CATEGORIES_KEY = "geoprospect_custom_categories";
const STORAGE_EMOJIS_KEY = "geoprospect_custom_emojis";

export function loadCategoriesData() {
  try {
    const storedCats = localStorage.getItem(STORAGE_CATEGORIES_KEY) || localStorage.getItem("rdl_custom_categories");
    const storedEmojis = localStorage.getItem(STORAGE_EMOJIS_KEY) || localStorage.getItem("rdl_custom_emojis");

    const categories = storedCats ? JSON.parse(storedCats) : { ...defaultCategories };
    const emojis = storedEmojis ? JSON.parse(storedEmojis) : { ...defaultEmojis };

    // Ensure all default categories exist if not present
    Object.keys(defaultCategories).forEach(cat => {
      if (!categories[cat]) {
        categories[cat] = [...defaultCategories[cat]];
      }
    });
    Object.keys(defaultEmojis).forEach(cat => {
      if (!emojis[cat]) {
        emojis[cat] = defaultEmojis[cat];
      }
    });

    return { categories, emojis };
  } catch (err) {
    console.error("Failed to load custom categories:", err);
    return { categories: { ...defaultCategories }, emojis: { ...defaultEmojis } };
  }
}

export function saveCategoriesData(categories, emojis) {
  try {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    localStorage.setItem(STORAGE_EMOJIS_KEY, JSON.stringify(emojis));
    window.dispatchEvent(new Event("categories-updated"));
  } catch (err) {
    console.error("Failed to save categories data:", err);
  }
}

export function addCategory(name, emoji = "📦", subCategories = ["Indéterminé"]) {
  const trimmedName = name.trim();
  if (!trimmedName) return false;
  
  const { categories, emojis } = loadCategoriesData();
  categories[trimmedName] = subCategories.length > 0 ? subCategories : ["Indéterminé"];
  emojis[trimmedName] = emoji || "📦";
  
  saveCategoriesData(categories, emojis);
  return true;
}

export function removeCategory(name) {
  const { categories, emojis } = loadCategoriesData();
  delete categories[name];
  delete emojis[name];
  saveCategoriesData(categories, emojis);
  return true;
}

export function addSubCategory(categoryName, subCategoryName) {
  const trimmedSub = subCategoryName.trim();
  if (!trimmedSub) return false;

  const { categories, emojis } = loadCategoriesData();
  if (!categories[categoryName]) {
    categories[categoryName] = [];
  }
  if (!categories[categoryName].includes(trimmedSub)) {
    categories[categoryName].push(trimmedSub);
    saveCategoriesData(categories, emojis);
  }
  return true;
}

export function removeSubCategory(categoryName, subCategoryName) {
  const { categories, emojis } = loadCategoriesData();
  if (categories[categoryName]) {
    categories[categoryName] = categories[categoryName].filter(s => s !== subCategoryName);
    saveCategoriesData(categories, emojis);
  }
  return true;
}

export function resetCategories() {
  saveCategoriesData({ ...defaultCategories }, { ...defaultEmojis });
}
