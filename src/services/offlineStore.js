const DB_NAME = "metal_detector_offline";
const STORE_NAME = "pending_finds";
const BACKUP_KEY = "metal_detector_offline_backup";

function getDB() {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window === "undefined" || !window.indexedDB) {
        reject(new Error("IndexedDB not supported"));
        return;
      }
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error || new Error("Failed to open IndexedDB"));
    } catch (err) {
      reject(err);
    }
  });
}

function saveToLocalStorage(record) {
  try {
    const cleanRecord = {
      ...record,
      id: "local-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      photo: null,
      isLocalStorage: true
    };
    const existingStr = localStorage.getItem(BACKUP_KEY);
    const existing = existingStr ? JSON.parse(existingStr) : [];
    existing.push(cleanRecord);
    localStorage.setItem(BACKUP_KEY, JSON.stringify(existing));

    if (window.__showToast) {
      window.__showToast("💾 Sauvegardé en mémoire locale de secours (sans photo).", "success");
    }
    return true;
  } catch (err) {
    console.error("LocalStorage backup save failed:", err);
    throw new Error("Toutes les méthodes de stockage local ont échoué. Votre mémoire est peut-être saturée.");
  }
}

export async function addPendingFind(findData, photoFile) {
  let dbOpenFailed = false;
  let db = null;

  try {
    db = await getDB();
  } catch (dbErr) {
    console.warn("IndexedDB not available, falling back to LocalStorage:", dbErr);
    dbOpenFailed = true;
  }

  // 1. Prepare clean Blob from File to remove non-serializable properties (handles, system locks)
  let safePhoto = null;
  if (photoFile) {
    try {
      safePhoto = new Blob([photoFile], { type: photoFile.type });
    } catch (blobErr) {
      console.error("IndexedDB failed to clean photo File into Blob, using raw file:", blobErr);
      safePhoto = photoFile;
    }
  }

  const record = {
    position: findData.position,
    newTitle: findData.newTitle,
    newDescription: findData.newDescription,
    newCategory: findData.newCategory,
    newSubCategory: findData.newSubCategory,
    customDate: findData.customDate || null,
    photo: safePhoto,
    createdAt: new Date().toISOString()
  };

  if (dbOpenFailed) {
    return saveToLocalStorage(record);
  }

  try {
    // Attempt saving with the photo in IndexedDB
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(record);
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
    return true;
  } catch (primaryError) {
    console.warn("IndexedDB primary save failed (possibly due to photo size/cloning), retrying without photo in IndexedDB:", primaryError);

    if (safePhoto !== null) {
      try {
        // Retry saving without the photo in IndexedDB
        await new Promise((resolve, reject) => {
          const transaction = db.transaction(STORE_NAME, "readwrite");
          const store = transaction.objectStore(STORE_NAME);
          const cleanRecord = { ...record, photo: null };
          const request = store.add(cleanRecord);
          request.onsuccess = () => resolve(true);
          request.onerror = (e) => reject(e.target.error);
        });

        // Trigger a toast notification to warn the user that the photo was omitted
        if (window.__showToast) {
          window.__showToast("⚠️ Enregistré hors-ligne, mais la photo a été ignorée (trop lourde ou incompatible).", "warning");
        }
        return true;
      } catch (retryError) {
        console.warn("IndexedDB retry save failed too, falling back to LocalStorage:", retryError);
        return saveToLocalStorage(record);
      }
    }

    return saveToLocalStorage(record);
  }
}

export async function getPendingFinds() {
  let list = [];

  // 1. Try to load from IndexedDB
  try {
    const db = await getDB();
    const indexedDBFinds = await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
    list = [...indexedDBFinds];
  } catch (error) {
    console.warn("IndexedDB getPendingFinds failed, checking LocalStorage:", error);
  }

  // 2. Load from LocalStorage
  try {
    const backupStr = localStorage.getItem(BACKUP_KEY);
    if (backupStr) {
      const backupFinds = JSON.parse(backupStr);
      list = [...list, ...backupFinds];
    }
  } catch (err) {
    console.error("LocalStorage getPendingFinds failed:", err);
  }

  return list;
}

export async function deletePendingFind(id) {
  // If the ID starts with "local-" or is string-based, check LocalStorage
  if (typeof id === "string" && id.startsWith("local-")) {
    try {
      const backupStr = localStorage.getItem(BACKUP_KEY);
      if (backupStr) {
        let backupFinds = JSON.parse(backupStr);
        backupFinds = backupFinds.filter(f => f.id !== id);
        localStorage.setItem(BACKUP_KEY, JSON.stringify(backupFinds));
        return true;
      }
    } catch (err) {
      console.error("LocalStorage deletePendingFind failed:", err);
      return false;
    }
  }

  // Otherwise, delete from IndexedDB
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (error) {
    console.error("IndexedDB deletePendingFind error:", error);
    return false;
  }
}
