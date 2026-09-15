import { supabase } from "../supabase.js";

export const RECOMMENDED_METALS = [
  { name: "Or", emoji: "🪙" },
  { name: "Argent", emoji: "🥈" },
  { name: "Bronze", emoji: "🥉" },
  { name: "Cuivre", emoji: "🟫" },
  { name: "Laiton", emoji: "🔔" },
  { name: "Cupronickel", emoji: "💿" },
  { name: "Billon", emoji: "🔘" },
  { name: "Étain", emoji: "⚖️" },
  { name: "Aluminium", emoji: "🥫" },
  { name: "Plomb", emoji: "⚓" },
  { name: "Fer", emoji: "⚙️" }
];

export const DEFAULT_MATERIALS = RECOMMENDED_METALS.map((m) => m.name);

export const DEFAULT_MATERIAL_EMOJIS = RECOMMENDED_METALS.reduce((acc, m) => {
  acc[m.name] = m.emoji;
  return acc;
}, {
  "Indéterminé": "❓",
  "Autre": "📦"
});

const STORAGE_MATERIALS_KEY = "geoprospect_custom_materials";
const STORAGE_MATERIAL_EMOJIS_KEY = "geoprospect_custom_material_emojis";

export async function syncMaterialsToCloud() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { materials, emojis } = loadMaterialsData();
    await supabase.auth.updateUser({
      data: {
        geoprospect_materials: materials,
        geoprospect_material_emojis: emojis,
        geoprospect_materials_synced_at: new Date().toISOString()
      }
    });
    return true;
  } catch (err) {
    console.warn("Cloud materials sync non-blocking error:", err);
    return false;
  }
}

export async function pullMaterialsFromCloud(user = null) {
  try {
    let currentUser = user;
    if (!currentUser) {
      const { data } = await supabase.auth.getUser();
      currentUser = data?.user;
    }
    if (!currentUser || !currentUser.user_metadata) return false;

    const cloudMaterials = currentUser.user_metadata.geoprospect_materials;
    const cloudEmojis = currentUser.user_metadata.geoprospect_material_emojis;

    if (Array.isArray(cloudMaterials) && cloudMaterials.length > 0) {
      const local = loadMaterialsData();
      const mergedMaterials = Array.from(new Set([...cloudMaterials, ...local.materials]));
      const mergedEmojis = { ...local.emojis, ...(cloudEmojis || {}) };

      localStorage.setItem(STORAGE_MATERIALS_KEY, JSON.stringify(mergedMaterials));
      localStorage.setItem(STORAGE_MATERIAL_EMOJIS_KEY, JSON.stringify(mergedEmojis));
      window.dispatchEvent(new Event("materials-updated"));
      return true;
    }
  } catch (err) {
    console.warn("Cloud materials pull error:", err);
  }
  return false;
}

// Automatically sync on auth state changes
try {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
      pullMaterialsFromCloud(session.user);
    }
  });
} catch {
  // Ignored in non-browser env
}

export function loadMaterialsData() {
  try {
    const storedMats = localStorage.getItem(STORAGE_MATERIALS_KEY);
    const storedEmojis = localStorage.getItem(STORAGE_MATERIAL_EMOJIS_KEY);

    const materials = storedMats ? JSON.parse(storedMats) : [...DEFAULT_MATERIALS];
    const emojis = storedEmojis ? JSON.parse(storedEmojis) : { ...DEFAULT_MATERIAL_EMOJIS };

    return { materials, emojis };
  } catch (err) {
    console.error("Failed to load materials data:", err);
    return {
      materials: [...DEFAULT_MATERIALS],
      emojis: { ...DEFAULT_MATERIAL_EMOJIS }
    };
  }
}

export function saveMaterialsData(materials, emojis) {
  try {
    const current = loadMaterialsData();
    const finalMaterials = Array.isArray(materials) ? materials : current.materials;
    const finalEmojis = emojis || current.emojis;

    localStorage.setItem(STORAGE_MATERIALS_KEY, JSON.stringify(finalMaterials));
    localStorage.setItem(STORAGE_MATERIAL_EMOJIS_KEY, JSON.stringify(finalEmojis));
    window.dispatchEvent(new Event("materials-updated"));

    // Sync to Supabase cloud in background
    syncMaterialsToCloud();
  } catch (err) {
    console.error("Failed to save materials data:", err);
  }
}

export function addMaterial(name, emoji = "🪙") {
  const trimmed = name.trim();
  if (!trimmed) return false;

  const { materials, emojis } = loadMaterialsData();
  if (!materials.includes(trimmed)) {
    materials.push(trimmed);
  }
  emojis[trimmed] = emoji || "🪙";

  saveMaterialsData(materials, emojis);
  return true;
}

export function removeMaterial(name) {
  const { materials, emojis } = loadMaterialsData();
  const filtered = materials.filter((m) => m !== name);
  delete emojis[name];
  saveMaterialsData(filtered, emojis);
  return true;
}

export function updateMaterialEmoji(name, emoji) {
  if (!name || !emoji) return false;
  const { materials, emojis } = loadMaterialsData();
  emojis[name] = emoji;
  saveMaterialsData(materials, emojis);
  return true;
}
