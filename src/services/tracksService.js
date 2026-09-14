import { supabase } from "../supabase";

const LOCAL_TRACKS_KEY = "geoprospect_saved_tracks_v2";

export function getLocalTracks() {
  try {
    const raw = localStorage.getItem(LOCAL_TRACKS_KEY) || localStorage.getItem("rdl_saved_tracks_v2");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("Error reading local tracks:", e);
  }
  return [];
}

export function saveLocalTrack(trackObject) {
  try {
    const existing = getLocalTracks();
    const updated = [trackObject, ...existing];
    localStorage.setItem(LOCAL_TRACKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Error saving local track:", e);
    return [];
  }
}

export async function loadTracks() {
  const localTracks = getLocalTracks();
  try {
    const { data, error } = await supabase
      .from("gps_tracks")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.warn("Supabase loadTracks warning, using local tracks:", error.message);
      return localTracks;
    }

    // Merge remote and local tracks without duplicates
    const remote = data || [];
    const merged = [...remote];
    for (const lt of localTracks) {
      if (!merged.some((r) => r.id === lt.id || (r.session_name === lt.session_name && r.created_at === lt.created_at))) {
        merged.push(lt);
      }
    }
    return merged;
  } catch (err) {
    console.warn("loadTracks exception, fallback to local:", err);
    return localTracks;
  }
}

export async function saveTrack(track, sessionName) {
  if (!track || track.length < 2) {
    alert("Pas assez de points GPS pour enregistrer un tracé.");
    return false;
  }

  const cleanName = (sessionName || "").trim() || `Sortie du ${new Date().toLocaleDateString("fr-FR")}`;
  const newTrack = {
    id: `local-track-${Date.now()}`,
    session_name: cleanName,
    positions: track,
    created_at: new Date().toISOString()
  };

  // Always save locally first for immediate 100% offline safety
  saveLocalTrack(newTrack);

  try {
    const { data, error } = await supabase
      .from("gps_tracks")
      .insert([
        {
          session_name: cleanName,
          positions: track
        }
      ])
      .select()
      .single();

    if (error) {
      console.warn("Supabase gps_tracks insert error, saved locally:", error.message);
    }
  } catch (err) {
    console.warn("Cloud sync error for track, saved locally:", err);
  }

  alert("Tracé de sortie enregistré avec succès ! 🗺️✅");
  return true;
}