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
  const [isRecordingSortie, setIsRecordingSortie] = useState(false);
  const [sortieDistance, setSortieDistance] = useState(0);
  const [sortiePositions, setSortiePositions] = useState([]);
  const [savedTracks, setSavedTracks] = useState([]);

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
