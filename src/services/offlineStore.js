const DB_NAME = "metal_detector_offline";
const STORE_NAME = "pending_finds";

function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function addPendingFind(findData, photoFile) {
  try {
    const db = await getDB();
    
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

    try {
      // Attempt saving with the photo
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(record);
        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      });
      return true;
    } catch (primaryError) {
      console.warn("IndexedDB primary save failed (possibly due to photo size/cloning), retrying without photo:", primaryError);
      
      if (safePhoto !== null) {
        try {
          // Retry saving without the photo
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
          console.error("IndexedDB retry save without photo failed:", retryError);
          throw retryError;
        }
      }
      
      throw primaryError;
    }
  } catch (error) {
    console.error("IndexedDB addPendingFind error:", error);
    throw error; // Propagate the error so UI knows save failed
  }
}

export async function getPendingFinds() {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (error) {
    console.error("IndexedDB getPendingFinds error:", error);
    return [];
  }
}

export async function deletePendingFind(id) {
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
