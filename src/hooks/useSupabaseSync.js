import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { loadFinds as fetchFinds, addFind as createFind, normalizeCategoryAndSub } from "../services/findsService";
import { getPendingFinds, deletePendingFind } from "../services/offlineStore";

export default function useSupabaseSync(setToast) {
  const [finds, setFinds] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  const loadPhotosForAlbum = async () => {
    try {
      const { data: photoData } = await supabase
        .from("find_photos")
        .select("id, find_id, image_url, type")
        .order("id", { ascending: true });
      if (photoData) {
        setAllPhotos(photoData);
      }
    } catch (e) {
      console.error("Failed to load album photos:", e);
    }
  };

  const loadFinds = async () => {
    const data = await fetchFinds();

    if (allPhotos.length > 0) {
      await loadPhotosForAlbum();
    }

    try {
      const offlineFinds = await getPendingFinds();
      const formattedOffline = offlineFinds.map((f) => ({
        id: `offline-${f.id}`,
        title: f.newTitle,
        description: f.newDescription,
        category: f.newCategory,
        sub_category: f.newSubCategory,
        latitude: f.position[0],
        longitude: f.position[1],
        position: f.position,
        date: f.customDate || f.createdAt,
        isOfflinePending: true,
        offlinePhoto: f.photo ? URL.createObjectURL(f.photo) : null
      }));
      setFinds([...formattedOffline, ...(data || [])]);
    } catch (e) {
      console.error(e);
      setFinds(data || []);
    }
  };

  const syncOfflineFinds = async () => {
    try {
      const offlineFinds = await getPendingFinds();
      if (offlineFinds.length === 0) return;

      setSyncing(true);
      let syncedCount = 0;
      let failedCount = 0;

      for (const f of offlineFinds) {
        try {
          await createFind({
            position: f.position,
            newTitle: f.newTitle,
            newDescription: f.newDescription,
            newCategory: f.newCategory,
            newSubCategory: f.newSubCategory,
            newPhoto: f.photo,
            customDate: f.customDate
          });
          await deletePendingFind(f.id);
          syncedCount++;
        } catch (singleErr) {
          console.error(`Failed to sync find id ${f.id}:`, singleErr);
          failedCount++;
        }
      }

      if (syncedCount > 0) {
        if (setToast) {
          setToast({
            message: `🔄 Synchronisation : ${syncedCount} trouvaille(s) transférée(s) avec succès !`,
            type: "success"
          });
        }
        await loadFinds();
      } else if (failedCount > 0) {
        if (setToast) {
          setToast({
            message: `⚠️ Échec de la synchronisation pour ${failedCount} trouvaille(s).`,
            type: "error"
          });
        }
      }
    } catch (err) {
      console.error("Synchro error:", err);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadFinds();

    const channel = supabase
      .channel("realtime-finds-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "finds" },
        (payload) => {
          console.log("Realtime change received:", payload);
          const { eventType, new: newRow, old: oldRow } = payload;

          setFinds((currentFinds) => {
            if (eventType === "INSERT") {
              const normalized = normalizeCategoryAndSub(newRow);
              const formatted = {
                ...normalized,
                position: [normalized.latitude, normalized.longitude]
              };
              if (currentFinds.some((f) => f.id === formatted.id)) {
                return currentFinds;
              }
              const offlinePendings = currentFinds.filter((f) => f.isOfflinePending);
              const restFinds = currentFinds.filter((f) => !f.isOfflinePending);
              return [...offlinePendings, formatted, ...restFinds];
            }

            if (eventType === "UPDATE") {
              const normalized = normalizeCategoryAndSub(newRow);
              const formatted = {
                ...normalized,
                position: [normalized.latitude, normalized.longitude]
              };
              return currentFinds.map((f) => (f.id === formatted.id ? formatted : f));
            }

            if (eventType === "DELETE") {
              return currentFinds.filter((f) => f.id !== oldRow.id);
            }

            return currentFinds;
          });
        }
      )
      .subscribe();

    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineFinds();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (navigator.onLine) {
      syncOfflineFinds();
    }

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    finds,
    allPhotos,
    isOnline,
    syncing,
    loadFinds,
    syncOfflineFinds,
    loadPhotosForAlbum
  };
}
