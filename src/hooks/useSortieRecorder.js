import { useState, useEffect, useRef, useCallback } from "react";
import { loadTracks, saveTrack, deleteTrack } from "../services/tracksService";
import { getMyUserCode } from "../services/sessionService";
import { startBackgroundKeepAlive, stopBackgroundKeepAlive } from "../services/backgroundKeepAlive";

function distanceBetween(point1, point2) {
  const R = 6371000;
  const lat1 = (point1[0] * Math.PI) / 180;
  const lat2 = (point2[0] * Math.PI) / 180;
  const deltaLat = ((point2[0] - point1[0]) * Math.PI) / 180;
  const deltaLng = ((point2[1] - point1[1]) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function useSortieRecorder(workspace = { mode: "personal", targetCode: null }) {
  const workspaceRef = useRef(workspace);
  useEffect(() => {
    workspaceRef.current = workspace;
  }, [workspace]);

  const [isRecordingSortie, setIsRecordingSortie] = useState(() => {
    try {
      return localStorage.getItem("isRecordingSortie") === "true";
    } catch {
      return false;
    }
  });

  const [isSortiePaused, setIsSortiePaused] = useState(() => {
    try {
      return localStorage.getItem("isSortiePaused") === "true";
    } catch {
      return false;
    }
  });

  const [sortieDistance, setSortieDistance] = useState(() => {
    try {
      const val = localStorage.getItem("sortieDistance");
      return val ? Number(val) : 0;
    } catch {
      return 0;
    }
  });

  const [sortieStartTime, setSortieStartTime] = useState(() => {
    try {
      const val = localStorage.getItem("sortieStartTime");
      return val ? Number(val) : null;
    } catch {
      return null;
    }
  });

  const [sortieTotalPausedMs, setSortieTotalPausedMs] = useState(() => {
    try {
      const val = localStorage.getItem("sortieTotalPausedMs");
      return val ? Number(val) : 0;
    } catch {
      return 0;
    }
  });

  const [sortiePauseStartTime, setSortiePauseStartTime] = useState(() => {
    try {
      const val = localStorage.getItem("sortiePauseStartTime");
      return val ? Number(val) : null;
    } catch {
      return null;
    }
  });

  const [sortieElapsedSeconds, setSortieElapsedSeconds] = useState(() => {
    try {
      const val = localStorage.getItem("sortieElapsedSeconds");
      return val ? Number(val) : 0;
    } catch {
      return 0;
    }
  });

  const [sortiePositions, setSortiePositions] = useState(() => {
    try {
      const val = localStorage.getItem("sortiePositions");
      if (val) {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Corrupted sortiePositions in storage:", e);
    }
    return [];
  });

  const [savedTracks, setSavedTracks] = useState([]);

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem("isRecordingSortie", isRecordingSortie);
  }, [isRecordingSortie]);

  useEffect(() => {
    localStorage.setItem("isSortiePaused", isSortiePaused);
  }, [isSortiePaused]);

  useEffect(() => {
    localStorage.setItem("sortieDistance", sortieDistance);
  }, [sortieDistance]);

  useEffect(() => {
    localStorage.setItem("sortieElapsedSeconds", sortieElapsedSeconds);
  }, [sortieElapsedSeconds]);

  useEffect(() => {
    localStorage.setItem("sortiePositions", JSON.stringify(sortiePositions));
  }, [sortiePositions]);

  useEffect(() => {
    if (sortieStartTime) {
      localStorage.setItem("sortieStartTime", String(sortieStartTime));
    } else {
      localStorage.removeItem("sortieStartTime");
    }
  }, [sortieStartTime]);

  useEffect(() => {
    localStorage.setItem("sortieTotalPausedMs", String(sortieTotalPausedMs));
  }, [sortieTotalPausedMs]);

  useEffect(() => {
    if (sortiePauseStartTime) {
      localStorage.setItem("sortiePauseStartTime", String(sortiePauseStartTime));
    } else {
      localStorage.removeItem("sortiePauseStartTime");
    }
  }, [sortiePauseStartTime]);

  // Wall-clock accurate elapsed seconds calculation
  const syncElapsedSeconds = useCallback(() => {
    if (!isRecordingSortie || !sortieStartTime) return;
    
    let totalPaused = sortieTotalPausedMs || 0;
    if (isSortiePaused && sortiePauseStartTime) {
      totalPaused += (Date.now() - sortiePauseStartTime);
    }
    
    const elapsed = Math.max(0, Math.floor((Date.now() - sortieStartTime - totalPaused) / 1000));
    setSortieElapsedSeconds(elapsed);
  }, [isRecordingSortie, isSortiePaused, sortieStartTime, sortieTotalPausedMs, sortiePauseStartTime]);

  // Synchronized timer with wall-clock auto-correction
  useEffect(() => {
    let timer = null;
    if (isRecordingSortie && !isSortiePaused) {
      syncElapsedSeconds();
      timer = setInterval(() => {
        syncElapsedSeconds();
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecordingSortie, isSortiePaused, syncElapsedSeconds]);

  // Auto-sync elapsed timer on visibility change / focus / wake
  useEffect(() => {
    const handleWake = () => {
      if (isRecordingSortie) {
        syncElapsedSeconds();
      }
    };
    document.addEventListener("visibilitychange", handleWake);
    window.addEventListener("focus", handleWake);
    window.addEventListener("pageshow", handleWake);
    return () => {
      document.removeEventListener("visibilitychange", handleWake);
      window.removeEventListener("focus", handleWake);
      window.removeEventListener("pageshow", handleWake);
    };
  }, [isRecordingSortie, syncElapsedSeconds]);

  // Manage Background Keep-Alive (Silent Audio + WakeLock + MediaSession)
  useEffect(() => {
    if (isRecordingSortie && !isSortiePaused) {
      startBackgroundKeepAlive();
    } else {
      stopBackgroundKeepAlive();
    }
    return () => {
      stopBackgroundKeepAlive();
    };
  }, [isRecordingSortie, isSortiePaused]);

  const loadTracksList = async () => {
    const curWs = workspaceRef.current || { mode: "personal", targetCode: null };
    const myCode = getMyUserCode();
    const tracks = await loadTracks({
      mode: curWs.mode,
      targetCode: curWs.targetCode,
      myUserCode: myCode
    });
    setSavedTracks(tracks || []);
  };

  useEffect(() => {
    loadTracksList();
    const handleUserSynced = () => loadTracksList();
    window.addEventListener("geoprospect-user-synced", handleUserSynced);
    return () => {
      window.removeEventListener("geoprospect-user-synced", handleUserSynced);
    };
  }, [workspace.mode, workspace.targetCode]);

  const startSortie = (initialPosition) => {
    const now = Date.now();
    setIsRecordingSortie(true);
    setIsSortiePaused(false);
    setSortieDistance(0);
    setSortieElapsedSeconds(0);
    setSortiePositions(initialPosition ? [initialPosition] : []);
    setSortieStartTime(now);
    setSortieTotalPausedMs(0);
    setSortiePauseStartTime(null);
    try {
      localStorage.setItem("sortieStartTime", String(now));
      localStorage.setItem("sortieTotalPausedMs", "0");
      localStorage.removeItem("sortiePauseStartTime");
    } catch {}
    startBackgroundKeepAlive();
  };

  const togglePauseSortie = () => {
    setIsSortiePaused((prev) => {
      const nextPaused = !prev;
      const now = Date.now();
      if (nextPaused) {
        // Just paused
        setSortiePauseStartTime(now);
        stopBackgroundKeepAlive();
      } else {
        // Resuming from pause
        if (sortiePauseStartTime) {
          const pausedDelta = now - sortiePauseStartTime;
          setSortieTotalPausedMs((acc) => acc + pausedDelta);
        }
        setSortiePauseStartTime(null);
        startBackgroundKeepAlive();
      }
      return nextPaused;
    });
  };

  const recordNewPosition = (newPosition, accuracy = null) => {
    if (isSortiePaused) return;
    if (!newPosition || typeof newPosition[0] !== "number" || typeof newPosition[1] !== "number") return;
    
    // Ignore updates with poor accuracy (> 35m) to avoid erratic GPS jitter
    if (accuracy && accuracy > 35) return;

    setSortiePositions((prev) => {
      if (!prev || prev.length === 0) {
        return [newPosition];
      }
      const last = prev[prev.length - 1];
      const d = distanceBetween(last, newPosition);
      
      // Filter out sub-meter stationary GPS drift (must move >= 1.5m)
      if (d < 1.5) {
        return prev;
      }

      // If distance is reasonable (< 5000m = 5km walking/moving), add to distance and append
      if (d < 5000) {
        setSortieDistance((dist) => dist + d);
        return [...prev, newPosition];
      } else {
        // Teleport or initial GPS fix after long gap (> 5km):
        // Append without adding 5km jump to distance to keep distance accurate
        return [...prev, newPosition];
      }
    });
  };

  const cancelSortie = () => {
    setIsRecordingSortie(false);
    setIsSortiePaused(false);
    setSortieDistance(0);
    setSortieElapsedSeconds(0);
    setSortiePositions([]);
    setSortieStartTime(null);
    setSortieTotalPausedMs(0);
    setSortiePauseStartTime(null);
    stopBackgroundKeepAlive();
    try {
      localStorage.removeItem("sortieElapsedSeconds");
      localStorage.removeItem("sortieStartTime");
      localStorage.removeItem("sortieTotalPausedMs");
      localStorage.removeItem("sortiePauseStartTime");
      localStorage.removeItem("sortiePositions");
      localStorage.removeItem("sortieDistance");
    } catch {}
  };

  const saveSortie = async (positions, name, sessionCode = null) => {
    const success = await saveTrack(positions, name, sessionCode);
    if (success) {
      await loadTracksList();
    }
    setIsRecordingSortie(false);
    setIsSortiePaused(false);
    setSortieDistance(0);
    setSortieElapsedSeconds(0);
    setSortiePositions([]);
    setSortieStartTime(null);
    setSortieTotalPausedMs(0);
    setSortiePauseStartTime(null);
    stopBackgroundKeepAlive();
    try {
      localStorage.removeItem("sortieElapsedSeconds");
      localStorage.removeItem("sortieStartTime");
      localStorage.removeItem("sortieTotalPausedMs");
      localStorage.removeItem("sortiePauseStartTime");
      localStorage.removeItem("sortiePositions");
      localStorage.removeItem("sortieDistance");
    } catch {}
    return success;
  };

  const deleteSortieTrack = async (trackId) => {
    const success = await deleteTrack(trackId);
    if (success) {
      await loadTracksList();
    }
    return success;
  };

  return {
    isRecordingSortie,
    isSortiePaused,
    sortieDistance,
    sortieElapsedSeconds,
    sortiePositions,
    sortieStartTime,
    savedTracks,
    startSortie,
    togglePauseSortie,
    recordNewPosition,
    cancelSortie,
    saveSortie,
    deleteSortieTrack,
    loadTracksList
  };
}
