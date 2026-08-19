import { useState, useEffect } from "react";
import { loadTracks, saveTrack } from "../services/tracksService";

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

export default function useSortieRecorder() {
  const [isRecordingSortie, setIsRecordingSortie] = useState(() => {
    return localStorage.getItem("isRecordingSortie") === "true";
  });
  const [sortieDistance, setSortieDistance] = useState(() => {
    const val = localStorage.getItem("sortieDistance");
    return val ? Number(val) : 0;
  });
  const [sortiePositions, setSortiePositions] = useState(() => {
    const val = localStorage.getItem("sortiePositions");
    return val ? JSON.parse(val) : [];
  });
  const [savedTracks, setSavedTracks] = useState([]);

  useEffect(() => {
    localStorage.setItem("isRecordingSortie", isRecordingSortie);
  }, [isRecordingSortie]);

  useEffect(() => {
    localStorage.setItem("sortieDistance", sortieDistance);
  }, [sortieDistance]);

  useEffect(() => {
    localStorage.setItem("sortiePositions", JSON.stringify(sortiePositions));
  }, [sortiePositions]);

  // Keep screen awake using W3C Wake Lock API when recording is active
  useEffect(() => {
    let wakeLock = null;

    const requestWakeLock = async () => {
      if (isRecordingSortie && "wakeLock" in navigator) {
        try {
          wakeLock = await navigator.wakeLock.request("screen");
          console.log("Wake Lock acquired successfully");
        } catch (err) {
          console.warn("Wake Lock request failed:", err);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === "visible") {
        requestWakeLock();
      }
    };

    if (isRecordingSortie) {
      requestWakeLock();
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      if (wakeLock) {
        wakeLock.release().then(() => {
          wakeLock = null;
        }).catch(err => console.error("Wake Lock release err:", err));
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRecordingSortie]);

  const loadTracksList = async () => {
    const tracks = await loadTracks();
    setSavedTracks(tracks || []);
  };

  useEffect(() => {
    loadTracksList();
  }, []);

  const startSortie = (initialPosition) => {
    setIsRecordingSortie(true);
    setSortieDistance(0);
    setSortiePositions(initialPosition ? [initialPosition] : []);
  };

  const recordNewPosition = (newPosition) => {
    setSortiePositions((prev) => {
      const next = [...prev, newPosition];
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        const d = distanceBetween(last, newPosition);
        setSortieDistance((dist) => dist + d);
      }
      return next;
    });
  };

  const cancelSortie = () => {
    setIsRecordingSortie(false);
    setSortieDistance(0);
    setSortiePositions([]);
  };

  const saveSortie = async (positions, name) => {
    const success = await saveTrack(positions, name);
    if (success) {
      await loadTracksList();
    }
    setIsRecordingSortie(false);
    setSortieDistance(0);
    setSortiePositions([]);
    return success;
  };

  return {
    isRecordingSortie,
    sortieDistance,
    sortiePositions,
    savedTracks,
    startSortie,
    recordNewPosition,
    cancelSortie,
    saveSortie,
    loadTracksList
  };
}
