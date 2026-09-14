const FLIP_COINS_STORAGE_KEY = "geoprospect_flip_coins_v1";

export function getFlipCoins() {
  try {
    const raw = localStorage.getItem(FLIP_COINS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (e) {
    console.error("Error reading flip coins from storage:", e);
    return {};
  }
}

export function getFlipCoin(findId) {
  if (!findId) return null;
  const map = getFlipCoins();
  return map[String(findId)] || null;
}

export function saveFlipCoin(findId, aversUrl, reversUrl) {
  if (!findId) return;
  const map = getFlipCoins();
  map[String(findId)] = {
    aversUrl,
    reversUrl,
    updatedAt: new Date().toISOString()
  };
  try {
    localStorage.setItem(FLIP_COINS_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("flipcoins-updated", { detail: { findId } }));
  } catch (e) {
    console.error("Error saving flip coin to storage:", e);
  }
}

export function removeFlipCoin(findId) {
  if (!findId) return;
  const map = getFlipCoins();
  delete map[String(findId)];
  try {
    localStorage.setItem(FLIP_COINS_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("flipcoins-updated", { detail: { findId } }));
  } catch (e) {
    console.error("Error removing flip coin from storage:", e);
  }
}
