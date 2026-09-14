import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import { loadFinds as fetchFinds, addFind as createFind, normalizeCategoryAndSub } from "../services/findsService";
import { getPendingFinds, deletePendingFind } from "../services/offlineStore";
import { getMyUserCode } from "../services/sessionService";

export default function useSupabaseSync(setToast, workspace = { mode: "personal", targetCode: null }) {
  const [finds, setFinds] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  const workspaceRef = useRef(workspace);
  useEffect(() => {
    workspaceRef.current = workspace;
  }, [workspace]);

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
    const currentWs = workspaceRef.current || { mode: "personal", targetCode: null };
    const myCode = getMyUserCode();
    
    // Always fetch photos in parallel to populate album
    loadPhotosForAlbum();

    const data = await fetchFinds({
      mode: currentWs.mode,
      targetCode: currentWs.targetCode,
      myUserCode: myCode
    });

    try {
      // In personal mode, also display offline pending finds
      if (currentWs.mode === "personal") {
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
          offlinePhoto: f.photo ? URL.createObjectURL(f.photo) : null,
          finder_name: f.finderName || "Moi (Hors-ligne)"
        }));
        setFinds([...formattedOffline, ...(data || [])]);
      } else {
        setFinds(data || []);
      }
    } catch (e) {
      console.error("Error merging offline finds:", e);
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
            customDate: f.customDate,
            userCode: f.userCode,
            finderName: f.finderName,
            sessionCode: f.sessionCode
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

  // Reload when workspace mode or target changes
  useEffect(() => {
    loadFinds();
  }, [workspace.mode, workspace.targetCode]);

  // Dynamic channel lifecycle & smart ping-pong polling for zero server saturation
  useEffect(() => {
    let findsChannel = null;
    let photosChannel = null;
    let pingPongInterval = null;

    const isCollaborative =
      workspace.mode === "session" || workspace.mode === "consultation";

    // Only open persistent WebSockets when in active team / consultation mode
    if (isCollaborative && isOnline) {
      findsChannel = supabase
        .channel(`sync-finds-${workspace.targetCode || "shared"}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "finds" },
          (payload) => {
            const { eventType, new: newRow, old: oldRow } = payload;
            const currentWs = workspaceRef.current || { mode: "personal" };

            // Workspace relevance check
            if (eventType === "INSERT" || eventType === "UPDATE") {
              if (currentWs.mode === "consultation" && newRow.user_code !== currentWs.targetCode) {
                return;
              }
              if (currentWs.mode === "session" && newRow.session_code !== currentWs.targetCode) {
                return;
              }
            }

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

                if (currentWs.mode === "session" && newRow.finder_name && setToast) {
                  setToast({
                    message: `✨ ${newRow.finder_name} vient d'ajouter une trouvaille (${newRow.title || newRow.category}) !`,
                    type: "success"
                  });
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

      photosChannel = supabase
        .channel(`sync-photos-${workspace.targetCode || "shared"}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "find_photos" },
          () => {
            loadPhotosForAlbum();
          }
        )
        .subscribe();

      // Smart Ping-Pong polling every 10s as a resilient lightweight heartbeat
      pingPongInterval = setInterval(() => {
        if (document.visibilityState === "visible" && navigator.onLine) {
          loadFinds();
        }
      }, 10000);
    }

    // Auto-sleep / Wakeup on visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        // Instant ping-pong refresh on screen unlock
        loadFinds();
        loadPhotosForAlbum();
      }
    };

    const handleOnline = async () => {
      setIsOnline(true);
      await syncOfflineFinds();
      await loadFinds();
      await loadPhotosForAlbum();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (navigator.onLine) {
      syncOfflineFinds();
    }

    return () => {
      if (findsChannel) supabase.removeChannel(findsChannel);
      if (photosChannel) supabase.removeChannel(photosChannel);
      if (pingPongInterval) clearInterval(pingPongInterval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [workspace.mode, workspace.targetCode, isOnline]);

  return {
    finds,
    setFinds,
    allPhotos,
    isOnline,
    syncing,
    loadFinds,
    syncOfflineFinds,
    loadPhotosForAlbum
  };
}

