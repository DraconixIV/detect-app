import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import { loadFinds as fetchFinds, addFind as createFind, normalizeCategoryAndSub, decodeMetadata } from "../services/findsService";
import { getPendingFinds, deletePendingFind } from "../services/offlineStore";
import { getMyUserCode, normalizeSessionCode } from "../services/sessionService";

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

  // Dynamic channel lifecycle & smart ping-pong polling for team sessions
  useEffect(() => {
    let findsChannel = null;
    let photosChannel = null;
    let broadcastChannel = null;
    let pingPongInterval = null;

    const isCollaborative =
      workspace.mode === "session" || workspace.mode === "consultation";

    // Open persistent WebSockets when online
    if (isOnline) {
      findsChannel = supabase
        .channel(`sync-finds-${workspace.targetCode || "global"}-${Date.now()}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "finds" },
          (payload) => {
            const { eventType, new: newRow, old: oldRow } = payload;
            const currentWs = workspaceRef.current || { mode: "personal" };
            const myCode = getMyUserCode();
            const decodedRow = newRow ? decodeMetadata(newRow) : null;

            // Workspace relevance check
            if (eventType === "INSERT" || eventType === "UPDATE") {
              const myCodeClean = normalizeSessionCode(myCode);
              const rowUserClean = decodedRow?.user_code ? normalizeSessionCode(decodedRow.user_code) : null;
              const rowSessionClean = decodedRow?.session_code ? normalizeSessionCode(decodedRow.session_code) : null;

              if (currentWs.mode === "personal") {
                if (rowUserClean !== myCodeClean) {
                  return; // Strictly ignore finds from other users in personal mode
                }
              } else if (currentWs.mode === "consultation" && currentWs.targetCode) {
                const targetClean = normalizeSessionCode(currentWs.targetCode);
                if (rowUserClean !== targetClean) {
                  return;
                }
              } else if (currentWs.mode === "session" && currentWs.targetCode) {
                const targetSessClean = normalizeSessionCode(currentWs.targetCode);
                const isSessionFind = rowSessionClean && rowSessionClean === targetSessClean;
                const isMyFind = rowUserClean && rowUserClean === myCodeClean;
                if (!isSessionFind && !isMyFind) {
                  return;
                }
              }
            }

            setFinds((currentFinds) => {
              if (eventType === "INSERT") {
                const normalized = normalizeCategoryAndSub(decodedRow);
                const formatted = {
                  ...normalized,
                  position: [normalized.latitude, normalized.longitude]
                };
                if (currentFinds.some((f) => f.id === formatted.id)) {
                  return currentFinds;
                }

                if (currentWs.mode === "session" && decodedRow.user_code !== myCode && setToast) {
                  setToast({
                    message: `✨ ${decodedRow.finder_name || "Un coéquipier"} vient de trouver : ${decodedRow.title || decodedRow.category} !`,
                    type: "success"
                  });
                }

                const offlinePendings = currentFinds.filter((f) => f.isOfflinePending);
                const restFinds = currentFinds.filter((f) => !f.isOfflinePending);
                return [...offlinePendings, formatted, ...restFinds];
              }

              if (eventType === "UPDATE") {
                const normalized = normalizeCategoryAndSub(decodedRow);
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
        .channel(`sync-photos-${workspace.targetCode || "global"}-${Date.now()}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "find_photos" },
          () => {
            loadPhotosForAlbum();
          }
        )
        .subscribe();

      // Instant find broadcast listener for team session
      if (workspace.mode === "session" && workspace.targetCode) {
        broadcastChannel = supabase
          .channel(`team-broadcast-${workspace.targetCode.trim().toUpperCase()}`)
          .on("broadcast", { event: "new_team_find" }, ({ payload }) => {
            if (!payload) return;
            const myCode = getMyUserCode();
            if (payload.user_code === myCode) return;

            const normalized = normalizeCategoryAndSub(payload);
            const lat = Number(normalized.latitude ?? (Array.isArray(normalized.position) ? normalized.position[0] : null));
            const lng = Number(normalized.longitude ?? (Array.isArray(normalized.position) ? normalized.position[1] : null));

            if (!isNaN(lat) && !isNaN(lng)) {
              const formatted = {
                ...normalized,
                latitude: lat,
                longitude: lng,
                position: [lat, lng]
              };

              setFinds((currentFinds) => {
                if (currentFinds.some((f) => f.id === formatted.id || (f.title === formatted.title && f.date === formatted.date))) {
                  return currentFinds;
                }
                if (setToast) {
                  setToast({
                    message: `✨ ${payload.finder_name || "Un coéquipier"} vient de trouver : ${payload.title || payload.category} !`,
                    type: "success"
                  });
                }
                return [formatted, ...currentFinds];
              });
            }
            loadFinds();
          })
          .subscribe();
      }

      // Polling every 4s during collaborative session, every 15s in personal mode
      const pollRate = isCollaborative ? 4000 : 15000;
      pingPongInterval = setInterval(() => {
        if (document.visibilityState === "visible" && navigator.onLine) {
          loadFinds();
        }
      }, pollRate);
    }

    // Auto-sleep / Wakeup on visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
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

    const handleTeamFindAdded = (e) => {
      const payload = e.detail;
      if (!payload) return;
      const normalized = normalizeCategoryAndSub(payload);
      const lat = Number(normalized.latitude ?? (Array.isArray(normalized.position) ? normalized.position[0] : null));
      const lng = Number(normalized.longitude ?? (Array.isArray(normalized.position) ? normalized.position[1] : null));

      if (!isNaN(lat) && !isNaN(lng)) {
        const formatted = {
          ...normalized,
          id: normalized.id || `temp-${Date.now()}`,
          latitude: lat,
          longitude: lng,
          position: [lat, lng]
        };

        setFinds((currentFinds) => {
          if (currentFinds.some((f) => f.id === formatted.id || (f.title === formatted.title && f.date === formatted.date))) {
            return currentFinds;
          }
          return [formatted, ...currentFinds];
        });
      }
      setTimeout(() => loadFinds(), 800);
    };

    const handleTeamFindDeleted = (e) => {
      const deletedId = e.detail;
      if (!deletedId) return;
      setFinds((currentFinds) => currentFinds.filter((f) => f.id !== deletedId));
    };

    window.addEventListener("geoprospect-team-find-added", handleTeamFindAdded);
    window.addEventListener("geoprospect-team-find-deleted", handleTeamFindDeleted);

    return () => {
      if (findsChannel) supabase.removeChannel(findsChannel);
      if (photosChannel) supabase.removeChannel(photosChannel);
      if (broadcastChannel) supabase.removeChannel(broadcastChannel);
      if (pingPongInterval) clearInterval(pingPongInterval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("geoprospect-team-find-added", handleTeamFindAdded);
      window.removeEventListener("geoprospect-team-find-deleted", handleTeamFindDeleted);
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
