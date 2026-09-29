import { supabase } from "../supabase";
import { getMyUserCode, normalizeSessionCode } from "./sessionService";
import { saveOfflineTrack, getOfflineTracks, deleteOfflineTrack, clearAllOfflineTracks } from "./offlineStore";

const LOCAL_TRACKS_KEY = "geoprospect_saved_tracks_v2";

export function decodeTrackMetadata(track) {
  if (!track) return track;
  let session_name = track.session_name || "";
  let user_code = track.user_code || null;
  let session_code = track.session_code || null;

  const match = session_name.match(/<!--GP_META:([\s\S]*?)-->/);
  if (match) {
    try {
      const meta = JSON.parse(match[1]);
      if (meta.u && !user_code) user_code = meta.u;
      if (meta.s && !session_code) session_code = meta.s;
      session_name = session_name.replace(/<!--GP_META:[\s\S]*?-->/g, "").trim();
    } catch {
      // Ignore parse errors
    }
  }

  return {
    ...track,
    session_name,
    user_code: user_code ? normalizeSessionCode(user_code) : null,
    session_code: session_code ? normalizeSessionCode(session_code) : null
  };
}

export function encodeTrackMetadata(sessionName, userCode, sessionCode) {
  const meta = {};
  if (userCode) meta.u = normalizeSessionCode(userCode);
  if (sessionCode) meta.s = normalizeSessionCode(sessionCode);
  
  const clean = (sessionName || "").replace(/<!--GP_META:[\s\S]*?-->/g, "").trim();
  if (Object.keys(meta).length === 0) return clean;
  return `${clean}\n<!--GP_META:${JSON.stringify(meta)}-->`;
}

export function getLocalTracks() {
  try {
    const raw = localStorage.getItem(LOCAL_TRACKS_KEY) || localStorage.getItem("rdl_saved_tracks_v2");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((t) => decodeTrackMetadata(t));
      }
    }
  } catch (e) {
    console.warn("Error reading local tracks:", e);
  }
  return [];
}

export async function getLocalTracksAsync() {
  try {
    const idbTracks = await getOfflineTracks();
    const localTracks = getLocalTracks();
    const merged = [...(idbTracks || []).map((t) => decodeTrackMetadata(t))];
    for (const lt of localTracks) {
      if (!merged.some((m) => m.id === lt.id)) {
        merged.push(lt);
      }
    }
    return merged;
  } catch (e) {
    return getLocalTracks();
  }
}

export async function clearAllLocalTracks() {
  try {
    localStorage.removeItem(LOCAL_TRACKS_KEY);
    localStorage.removeItem("rdl_saved_tracks_v2");
    await clearAllOfflineTracks();
  } catch (e) {
    console.warn("Error clearing local tracks:", e);
  }
}

export function saveLocalTrack(trackObject) {
  try {
    const existing = getLocalTracks();
    const updated = [trackObject, ...existing];
    localStorage.setItem(LOCAL_TRACKS_KEY, JSON.stringify(updated));
    saveOfflineTrack(trackObject).catch(() => {});
    return updated;
  } catch (e) {
    console.warn("Error saving local track:", e);
    saveOfflineTrack(trackObject).catch(() => {});
    return [];
  }
}

export async function loadTracks(options = {}) {
  const myCode = normalizeSessionCode(options.myUserCode || getMyUserCode());
  const mode = options.mode || "personal";
  const targetCode = options.targetCode ? normalizeSessionCode(options.targetCode) : null;

  // 1. Get filtered local tracks (with IndexedDB fallback)
  const allLocal = await getLocalTracksAsync();
  const localTracks = allLocal.filter((t) => {
    if (mode === "consultation" && targetCode) {
      return t.user_code === targetCode;
    }
    if (mode === "session" && targetCode) {
      return t.session_code === targetCode || t.user_code === myCode;
    }
    // Personal mode: strictly own tracks (or newly created offline track with matching or pending userCode)
    return t.user_code === myCode || (!t.user_code && myCode);
  });

  try {
    let query = supabase
      .from("gps_tracks")
      .select("*")
      .order("id", { ascending: false });

    if (mode === "consultation" && targetCode) {
      query = query.ilike("session_name", `%<!--GP_META:%"u":"${targetCode}"%-->%`);
    } else if (mode === "session" && targetCode) {
      if (myCode) {
        query = query.or(`session_name.ilike.%<!--GP_META:%"s":"${targetCode}"%-->%,session_name.ilike.%<!--GP_META:%"u":"${myCode}"%-->%`);
      } else {
        query = query.ilike("session_name", `%<!--GP_META:%"s":"${targetCode}"%-->%`);
      }
    } else if (myCode) {
      query = query.ilike("session_name", `%<!--GP_META:%"u":"${myCode}"%-->%`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("Supabase loadTracks warning, using local tracks:", error.message);
      return localTracks;
    }

    // 2. Decode and filter remote tracks strictly
    const remote = (data || []).map((row) => decodeTrackMetadata(row));
    const filteredRemote = remote.filter((t) => {
      if (mode === "consultation" && targetCode) {
        return t.user_code === targetCode;
      }
      if (mode === "session" && targetCode) {
        return t.session_code === targetCode || t.user_code === myCode;
      }
      // Personal mode: STRICT isolation to current user code
      return t.user_code && t.user_code === myCode;
    });

    // Merge remote and local tracks without duplicates
    const merged = [...filteredRemote];
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

export async function saveTrack(track, sessionName, sessionCode = null) {
  if (!track || track.length < 2) {
    return false;
  }

  const myCode = normalizeSessionCode(getMyUserCode());
  const cleanName = (sessionName || "").replace(/<!--GP_META:[\s\S]*?-->/g, "").trim() || `Sortie du ${new Date().toLocaleDateString("fr-FR")}`;
  const cleanSessionCode = sessionCode ? normalizeSessionCode(sessionCode) : null;
  const taggedSessionName = encodeTrackMetadata(cleanName, myCode, cleanSessionCode);

  const newTrack = {
    id: `local-track-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    session_name: cleanName,
    positions: track,
    user_code: myCode,
    session_code: cleanSessionCode,
    created_at: new Date().toISOString()
  };

  // Always save locally first for immediate 100% offline safety
  saveLocalTrack(newTrack);

  try {
    const { error } = await supabase
      .from("gps_tracks")
      .insert([
        {
          session_name: taggedSessionName,
          positions: track
        }
      ]);

    if (error) {
      console.warn("Supabase gps_tracks insert error, saved locally:", error.message);
    }
  } catch (err) {
    console.warn("Cloud sync error for track, saved locally:", err);
  }

  return true;
}

export async function deleteTrack(trackId) {
  if (!trackId) return false;

  // 1. Delete from local storage & IndexedDB
  try {
    const existing = getLocalTracks();
    const updated = existing.filter((t) => t.id !== trackId);
    localStorage.setItem(LOCAL_TRACKS_KEY, JSON.stringify(updated));
    deleteOfflineTrack(trackId).catch(() => {});
  } catch (e) {
    console.warn("Error deleting local track:", e);
  }

  // 2. Delete from Supabase
  try {
    if (typeof trackId === "number" || (!String(trackId).startsWith("local-track-") && !isNaN(Number(trackId)))) {
      const { error } = await supabase
        .from("gps_tracks")
        .delete()
        .eq("id", trackId);
      if (error) {
        console.warn("Supabase gps_tracks delete warning:", error.message);
      }
    }
  } catch (err) {
    console.warn("Cloud delete track error:", err);
  }

  return true;
}