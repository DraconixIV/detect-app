import { normalizeSessionCode } from "./sessionService";

const SAVED_FRIENDS_STORAGE_KEY = "geoprospect_saved_friends_v1";

/**
 * Load all saved friends from localStorage
 * @returns {Array<{ id: string, name: string, code: string, createdAt: string }>}
 */
export function getSavedFriends() {
  try {
    const raw = localStorage.getItem(SAVED_FRIENDS_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (Array.isArray(list)) {
      return list;
    }
  } catch (err) {
    console.warn("Failed to load saved friends:", err);
  }
  return [];
}

/**
 * Save / Add a new friend
 * @param {string} name
 * @param {string} code
 * @returns {Array} updated list
 */
export function addSavedFriend(name, code) {
  const cleanCode = normalizeSessionCode(code);
  const cleanName = (name || "").trim() || `Ami ${cleanCode.slice(-4)}`;
  if (!cleanCode) {
    throw new Error("Code détecteur invalide (format attendu : GEO-XXXXXX).");
  }

  const existing = getSavedFriends();
  // Check if code already saved
  const alreadyExists = existing.some(
    (f) => normalizeSessionCode(f.code) === cleanCode
  );
  if (alreadyExists) {
    throw new Error("Cet ami est déjà enregistré dans votre carnet.");
  }

  const newFriend = {
    id: `friend-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName,
    code: cleanCode,
    createdAt: new Date().toISOString()
  };

  const updated = [newFriend, ...existing];
  try {
    localStorage.setItem(SAVED_FRIENDS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to persist saved friend:", e);
  }
  return updated;
}

/**
 * Remove a friend from saved list
 * @param {string} friendId
 * @returns {Array} updated list
 */
export function removeSavedFriend(friendId) {
  const existing = getSavedFriends();
  const updated = existing.filter((f) => f.id !== friendId && f.code !== friendId);
  try {
    localStorage.setItem(SAVED_FRIENDS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to update saved friends:", e);
  }
  return updated;
}

/**
 * Update an existing friend (e.g. rename)
 * @param {string} friendId
 * @param {{ name?: string, code?: string }} updates
 * @returns {Array} updated list
 */
export function updateSavedFriend(friendId, updates = {}) {
  const existing = getSavedFriends();
  const updated = existing.map((f) => {
    if (f.id === friendId) {
      return {
        ...f,
        name: updates.name ? updates.name.trim() : f.name,
        code: updates.code ? normalizeSessionCode(updates.code) : f.code
      };
    }
    return f;
  });
  try {
    localStorage.setItem(SAVED_FRIENDS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to update saved friend:", e);
  }
  return updated;
}
