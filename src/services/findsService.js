import imageCompression from "browser-image-compression";

import { supabase, directUploadStorage } from "../supabase.js";
import { getMyUserCode, getMyDisplayName, getActiveSession, getMyJoinedSessions, normalizeSessionCode } from "./sessionService.js";
import { clearAllPendingFinds } from "./offlineStore.js";
import { clearAllLocalTracks, decodeTrackMetadata } from "./tracksService.js";

const LEGACY_CLAIMED_FLAG = "geoprospect_legacy_finds_claimed_v3";

export function encodeMetadata(description, userCode, finderName, sessionCode, thumbnailUrl = null, extra = {}) {
  const meta = {};
  if (userCode) meta.u = normalizeSessionCode(userCode);
  if (finderName) meta.f = String(finderName).slice(0, 50);
  if (sessionCode) meta.s = normalizeSessionCode(sessionCode);
  if (thumbnailUrl) meta.t = thumbnailUrl;
  if (extra.audio_url || extra.audio) meta.a = extra.audio_url || extra.audio;
  if (extra.audio_duration || extra.ad) meta.ad = Number(extra.audio_duration || extra.ad);
  if (extra.video_url || extra.video) meta.v = extra.video_url || extra.video;
  if (Object.keys(meta).length === 0) return (description || "").replace(/<!--GP_META:[\s\S]*?-->/g, "").trim();
  const metaTag = `\n<!--GP_META:${JSON.stringify(meta)}-->`;
  return ((description || "").replace(/<!--GP_META:[\s\S]*?-->/g, "").trim() + metaTag);
}

export function decodeMetadata(find) {
  if (!find) return find;
  let user_code = find.user_code || null;
  let finder_name = find.finder_name || null;
  let session_code = find.session_code || null;
  let thumbnail_url = find.thumbnail_url || null;
  let audio_url = find.audio_url || null;
  let audio_duration = find.audio_duration ? Number(find.audio_duration) : null;
  let video_url = find.video_url || null;
  let cleanDesc = find.description || "";

  const match = cleanDesc.match(/<!--GP_META:([\s\S]*?)-->/);
  if (match) {
    try {
      const meta = JSON.parse(match[1]);
      if (meta.u && !user_code) user_code = meta.u;
      if (meta.f && !finder_name) finder_name = meta.f;
      if (meta.s && !session_code) session_code = meta.s;
      if (meta.t && !thumbnail_url) thumbnail_url = meta.t;
      if (meta.a && !audio_url) audio_url = meta.a;
      if (meta.ad && !audio_duration) audio_duration = Number(meta.ad);
      if ((meta.v || meta.video_url) && !video_url) video_url = meta.v || meta.video_url;
      cleanDesc = cleanDesc.replace(/<!--GP_META:[\s\S]*?-->/g, "").trim();
    } catch {
      // Ignore
    }
  }

  // DYNAMIC PSEUDONYM HARMONIZATION:
  // If this find belongs to current user's detector code (or is untagged), always attribute it
  // consistently to the current active locked display name.
  try {
    const myCode = getMyUserCode();
    const myName = getMyDisplayName();
    const cleanMyCode = myCode ? normalizeSessionCode(myCode) : null;
    const cleanUserCode = user_code ? normalizeSessionCode(user_code) : null;
    if (myName && (!cleanUserCode || cleanUserCode === cleanMyCode)) {
      finder_name = myName;
      if (!user_code && cleanMyCode) {
        user_code = cleanMyCode;
      }
    }
  } catch {
    // fallback
  }

  const resolvedImg = find.image_url || thumbnail_url || null;

  return {
    ...find,
    description: cleanDesc,
    user_code,
    finder_name,
    session_code,
    image_url: resolvedImg,
    thumbnail_url: resolvedImg,
    audio_url,
    audio_duration,
    video_url
  };
}

export function normalizeCategoryAndSub(find) {
  if (!find) return find;

  const withMeta = decodeMetadata(find);
  let category = withMeta.category || "Autre";
  let subCategory = withMeta.sub_category || "";

  // Normalize casing and structural migrations
  let normalized = category.trim().toLowerCase();

  if (normalized === "militaire" || normalized === "munition") {
    category = "Munition";
  } else if (normalized === "dé à coudre") {
    category = "Outil";
    subCategory = "Dé à coudre";
  } else {
    const mapping = {
      "autre": "Autre",
      "bijou": "Bijou",
      "boucle": "Boucle",
      "bouton": "Bouton",
      "médaille": "Médaille",
      "monnaie": "Monnaie",
      "outil": "Outil",
      "plomb": "Plomb",
      "religieux": "Religieux",
      "munition": "Munition"
    };
    category = mapping[normalized] || (category.charAt(0).toUpperCase() + category.slice(1));
  }

  return {
    ...withMeta,
    category,
    sub_category: subCategory
  };
}

export function getRawMetadata(findOrDesc) {
  const desc = typeof findOrDesc === "string" ? findOrDesc : (findOrDesc?.description || "");
  const match = desc.match(/<!--GP_META:([\s\S]*?)-->/);
  if (match) {
    try {
      return JSON.parse(match[1]) || {};
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * Ensures user finds are strictly isolated.
 * (Deprecated legacy re-attribution disabled to prevent multi-user cross-contamination)
 */
export async function ensureLegacyFindsClaimed() {
  return;
}

/**
 * Permanently deletes all user data from Supabase (finds, storage images/videos/audio, photos records, tracks)
 * and completely purges all local storage and session data.
 */
export async function purgeAllUserDataAndAccount(myCode = null) {
  const targetCode = normalizeSessionCode(myCode || getMyUserCode());

  // 1. Fetch all finds from Supabase
  try {
    const { data: allFinds, error: fetchErr } = await supabase
      .from("finds")
      .select("id, description, image_url");

    if (!fetchErr && allFinds && allFinds.length > 0) {
      const userFinds = allFinds.filter((row) => {
        const rawMeta = getRawMetadata(row.description);
        const rawUser = rawMeta.u ? normalizeSessionCode(rawMeta.u) : null;
        return rawUser === targetCode;
      });

      for (const find of userFinds) {
        try {
          // Fetch photos associated with this find
          const { data: photos } = await supabase
            .from("find_photos")
            .select("image_url")
            .eq("find_id", find.id);

          const storageFiles = [];
          if (photos && photos.length > 0) {
            photos.forEach((p) => {
              if (p.image_url && p.image_url.includes("/find-photos/")) {
                const name = p.image_url.split("/").pop()?.split("?")[0];
                if (name) storageFiles.push(name);
              }
            });
          }
          if (find.image_url && find.image_url.includes("/find-photos/")) {
            const name = find.image_url.split("/").pop()?.split("?")[0];
            if (name && !storageFiles.includes(name)) storageFiles.push(name);
          }

          const rawMeta = getRawMetadata(find.description);
          if (rawMeta.v && rawMeta.v.includes("/find-photos/")) {
            const name = rawMeta.v.split("/").pop()?.split("?")[0];
            if (name && !storageFiles.includes(name)) storageFiles.push(name);
          }
          if (rawMeta.a && rawMeta.a.includes("/find-photos/")) {
            const name = rawMeta.a.split("/").pop()?.split("?")[0];
            if (name && !storageFiles.includes(name)) storageFiles.push(name);
          }

          // Delete files from storage
          if (storageFiles.length > 0) {
            await supabase.storage.from("find-photos").remove(storageFiles);
          }

          // Delete find_photos rows
          await supabase.from("find_photos").delete().eq("find_id", find.id);

          // Delete find row
          await supabase.from("finds").delete().eq("id", find.id);
        } catch (findErr) {
          console.warn(`Error deleting find ${find.id}:`, findErr);
        }
      }
    }
  } catch (err) {
    console.error("Error purging database finds:", err);
  }

  // 2. Purge user tracks from Supabase
  try {
    const { data: allTracks } = await supabase.from("gps_tracks").select("id, session_name");
    if (allTracks && allTracks.length > 0) {
      const userTracks = allTracks.filter((t) => {
        const decoded = decodeTrackMetadata(t);
        return decoded.user_code === targetCode;
      });
      for (const ut of userTracks) {
        await supabase.from("gps_tracks").delete().eq("id", ut.id);
      }
    }
  } catch (trackErr) {
    console.warn("Error purging user tracks:", trackErr);
  }

  // 3. Clear memory caches & local pending finds & local tracks
  if (typeof window !== "undefined" && window.findPhotosCache) {
    window.findPhotosCache = {};
  }
  try {
    await clearAllPendingFinds();
  } catch (e) {
    console.warn("Error clearing offline finds on purge:", e);
  }
  clearAllLocalTracks();

  // 4. Supabase Auth Sign Out
  try {
    await supabase.auth.signOut();
  } catch (authErr) {
    console.warn("Auth signout warning:", authErr);
  }

  // 5. Wipe all GeoProspect localStorage keys
  try {
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (key.startsWith("geoprospect_") || key.startsWith("rdl_") || key.startsWith("sortie") || key.startsWith("isRecordingSortie") || key.startsWith("isSortiePaused") || key === "metal_detector_offline_backup") {
        localStorage.removeItem(key);
      }
    });

    sessionStorage.clear();
  } catch (storageErr) {
    console.warn("Local storage wipe warning:", storageErr);
  }

  return true;
}

/**
 * Safely signs out of Supabase and resets local user state (user code, display name, tracks, offline finds, onboarding flag)
 * WITHOUT deleting cloud finds or cloud account data.
 * Redirects the app to the onboarding flow upon reload.
 */
export async function logoutAndResetSession() {
  // 1. Supabase Auth Sign Out
  try {
    await supabase.auth.signOut();
  } catch (authErr) {
    console.warn("Auth signout warning:", authErr);
  }

  // 2. Clear memory caches
  if (typeof window !== "undefined" && window.findPhotosCache) {
    window.findPhotosCache = {};
  }

  // 3. Clear offline store & local tracks
  try {
    await clearAllPendingFinds();
  } catch (e) {
    console.warn("Error clearing offline finds on logout:", e);
  }
  clearAllLocalTracks();

  // 4. Clear local storage session & personal data
  try {
    const sessionKeysToRemove = [
      "geoprospect_user_code_v1",
      "rdl_user_code_v1",
      "geoprospect_user_display_name_v1",
      "geoprospect_active_session_v1",
      "geoprospect_joined_sessions_history_v1",
      "geoprospect_session_blacklist_v1",
      "geoprospect_user_banned_sessions_v1",
      "geoprospect_session_locked_v1",
      "geoprospect_approved_viewers_v1",
      "geoprospect_onboarding_completed_v3",
      "rdl_onboarding_completed_v3",
      "geoprospect_cgu_accepted",
      "geoprospect_offline_pending_finds_v1",
      "metal_detector_offline_backup",
      "geoprospect_saved_tracks_v2",
      "rdl_saved_tracks_v2",
      "isRecordingSortie",
      "isSortiePaused",
      "sortieDistance",
      "sortieElapsedSeconds",
      "sortiePositions",
      "sortieHeartbeat",
      "geoprospect_custom_categories",
      "geoprospect_custom_emojis",
      "geoprospect_custom_colors",
      "geoprospect_categories_v1",
      "geoprospect_custom_materials",
      "geoprospect_custom_material_emojis",
      "geoprospect_materials_v1",
      "geoprospect_legacy_finds_claimed_v3"
    ];

    sessionKeysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    sessionStorage.clear();
  } catch (storageErr) {
    console.warn("Local storage reset warning:", storageErr);
  }

  return true;
}

/**
 * Load finds strictly according to the active workspace mode:
 * - personal: ONLY finds belonging to the current user (myCode). New users get 0 finds (blank map).
 * - session: finds from the current team session + current user's finds.
 * - consultation: ONLY finds from the target detector code (read-only).
 */
export function fileToDataUrl(fileOrBlob) {
  return new Promise((resolve, reject) => {
    if (!fileOrBlob) return resolve(null);
    if (typeof fileOrBlob === "string") return resolve(fileOrBlob);
    try {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(fileOrBlob);
    } catch (err) {
      reject(err);
    }
  });
}

export async function loadFinds(options = {}) {
  try {
    const { mode, targetCode } = options;
    const myCode = options.myUserCode || getMyUserCode();
    const activeSess = getActiveSession();
    const currentSessionCode = targetCode || activeSess?.code;

    // Fetch finds from Supabase
    const { data, error } = await supabase
      .from("finds")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("loadFinds error:", error);
      return [];
    }

    // Fetch photos and videos from find_photos to attach directly to finds
    let photoMap = {};
    let videoMap = {};
    try {
      const { data: allDbPhotos } = await supabase
        .from("find_photos")
        .select("find_id, image_url, type")
        .order("id", { ascending: true });

      if (allDbPhotos) {
        allDbPhotos.forEach((p) => {
          if (p.find_id && p.image_url) {
            if (p.type === "video" || typeof p.image_url === "string" && p.image_url.includes("/video-")) {
              videoMap[p.find_id] = p.image_url;
            } else if (!photoMap[p.find_id]) {
              photoMap[p.find_id] = p.image_url;
            }
          }
        });
      }
    } catch (pMapErr) {
      console.warn("Could not load photos/videos map:", pMapErr);
    }

    const allFinds = data || [];
    const cleanCurrentSess = currentSessionCode ? normalizeSessionCode(currentSessionCode) : null;
    const cleanMyCode = myCode ? normalizeSessionCode(myCode) : null;
    const cleanTargetCode = targetCode ? normalizeSessionCode(targetCode) : null;

    const filteredFinds = allFinds.filter((rawFind) => {
      const find = decodeMetadata(rawFind);
      const findSess = find.session_code ? normalizeSessionCode(find.session_code) : null;
      const findUser = find.user_code ? normalizeSessionCode(find.user_code) : null;

      if (mode === "consultation" && cleanTargetCode) {
        return findUser === cleanTargetCode;
      }
      if (mode === "session" && cleanCurrentSess) {
        return findSess === cleanCurrentSess || findUser === cleanMyCode;
      }
      // Mode personnel: STRICT FILTER to current user's private finds
      return findUser === cleanMyCode;
    });

    return filteredFinds.map((find) => {
      const normalizedFind = normalizeCategoryAndSub(find);
      const resolvedImg = normalizedFind.image_url || photoMap[normalizedFind.id] || null;
      const resolvedVideo = normalizedFind.video_url || videoMap[normalizedFind.id] || null;
      return {
        ...normalizedFind,
        image_url: resolvedImg,
        thumbnail_url: resolvedImg,
        video_url: resolvedVideo,
        position: [
          normalizedFind.latitude,
          normalizedFind.longitude
        ]
      };
    });

  } catch (error) {
    console.error("loadFinds exception:", error);
    return [];
  }
}

export async function convertBlobToJpegBlob(blobOrFile) {
  return new Promise((resolve) => {
    try {
      if (typeof window === "undefined" || !window.createImageBitmap && !window.Image) {
        return resolve(blobOrFile);
      }
      const img = new Image();
      const url = URL.createObjectURL(blobOrFile);
      img.onload = () => {
        try {
          URL.revokeObjectURL(url);
          const canvas = document.createElement("canvas");
          const maxDim = 1600;
          let width = img.naturalWidth || img.width || 800;
          let height = img.naturalHeight || img.height || 600;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                resolve(blobOrFile);
              }
            },
            "image/jpeg",
            0.85
          );
        } catch {
          resolve(blobOrFile);
        }
      };
      img.onerror = () => {
        try { URL.revokeObjectURL(url); } catch {}
        resolve(blobOrFile);
      };
      img.src = url;
    } catch {
      resolve(blobOrFile);
    }
  });
}

export function generateSafeFileName(fileOrBlob, prefix = "photo") {
  const rawName = fileOrBlob?.name || "";
  let ext = "jpg";
  if (rawName.includes(".")) {
    ext = rawName.split(".").pop().toLowerCase().replace(/[^a-z0-9]/gi, "") || "jpg";
  } else if (fileOrBlob?.type) {
    if (fileOrBlob.type.includes("png")) ext = "png";
    else if (fileOrBlob.type.includes("webp")) ext = "webp";
    else if (fileOrBlob.type.includes("gif")) ext = "gif";
  }
  if (ext === "jpeg" || ext === "heic" || ext === "heif") ext = "jpg";
  const uniqueId = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${Date.now()}-${uniqueId}.${ext}`;
}

export async function uploadPhotoFile(photo) {
  if (!photo) return null;
  if (typeof photo === "string" && photo.startsWith("http")) return photo;

  try {
    let photoBlob = photo;
    if (typeof photo === "string" && (photo.startsWith("data:") || photo.startsWith("blob:"))) {
      try {
        const res = await fetch(photo);
        if (res.ok) photoBlob = await res.blob();
        else photoBlob = null;
      } catch (fErr) {
        console.warn("fetch photo data failed:", fErr);
        photoBlob = null;
      }
    }

    if (!photoBlob || !(photoBlob instanceof Blob || photoBlob instanceof File)) {
      console.warn("uploadPhotoFile: invalid photoBlob", photoBlob);
      return null;
    }

    let safeFile = photoBlob;
    if (photoBlob instanceof Blob && !(photoBlob instanceof File)) {
      try {
        const ext = photoBlob.type?.includes("png") ? "png" : "jpg";
        safeFile = new File([photoBlob], `photo-${Date.now()}.${ext}`, {
          type: photoBlob.type || "image/jpeg"
        });
      } catch (fileWrapErr) {
        safeFile = photoBlob;
      }
    }

    let fileToUpload = safeFile;
    // 1. Try browser-image-compression with canvas fallback
    try {
      fileToUpload = await convertBlobToJpegBlob(safeFile);
    } catch (canvasErr) {
      try {
        fileToUpload = await imageCompression(safeFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1600,
          useWebWorker: false
        });
      } catch (compErr) {
        fileToUpload = safeFile;
      }
    }

    const fileName = generateSafeFileName(fileToUpload || safeFile, "photo");
    const rawType = fileToUpload?.type || "";
    const contentType = rawType.includes("image") ? rawType : "image/jpeg";

    try {
      const publicUrl = await directUploadStorage("find-photos", fileName, fileToUpload, contentType);
      return publicUrl;
    } catch (directErr) {
      console.warn("Direct upload 1st attempt failed, trying fallback blob:", directErr);
      const fallbackBlob = await convertBlobToJpegBlob(safeFile);
      const retryName = generateSafeFileName(safeFile, "photo");
      const fallbackUrl = await directUploadStorage("find-photos", retryName, fallbackBlob || safeFile, "image/jpeg");
      return fallbackUrl;
    }
  } catch (err) {
    console.error("uploadPhotoFile exception:", err);
    return null;
  }
}

export async function addFind({
  position,
  newTitle,
  newDescription,
  newCategory,
  newSubCategory,
  newPhoto,
  customDate = null,
  userCode = null,
  finderName = null,
  sessionCode = undefined,
  audio = null,
  audioDuration = null,
  video = null
}) {
  try {
    const rawUser = userCode || getMyUserCode();
    const finalUserCode = rawUser ? normalizeSessionCode(rawUser) : null;
    const finalFinderName = finderName || getMyDisplayName() || "Détecteuriste";
    const activeSess = getActiveSession();
    const rawSess = (sessionCode !== undefined && sessionCode !== null) ? sessionCode : (activeSess?.code || null);
    const finalSessionCode = rawSess ? normalizeSessionCode(rawSess) : null;

    // Normalize GPS Position safely
    let lat = 0;
    let lng = 0;
    if (Array.isArray(position) && position.length >= 2) {
      lat = Number(position[0]);
      lng = Number(position[1]);
    } else if (position && typeof position === "object") {
      lat = Number(position.lat ?? position.latitude);
      lng = Number(position.lng ?? position.longitude);
    }
    if (isNaN(lat) || lat === null) lat = 0;
    if (isNaN(lng) || lng === null) lng = 0;

    // 1. Process Photo, Video, and Audio IN PARALLEL for maximum speed
    const uploadTasks = [];

    // Task A: Photo upload
    let finalPhotoUrl = null;
    if (newPhoto) {
      uploadTasks.push(
        uploadPhotoFile(newPhoto).then((url) => {
          finalPhotoUrl = url;
        }).catch((err) => {
          console.warn("Parallel photo upload warning:", err);
        })
      );
    }

    // Task B: Video upload
    let finalVideoUrl = null;
    if (video) {
      if (typeof video === "string" && video.startsWith("http")) {
        finalVideoUrl = video;
      } else {
        uploadTasks.push(
          (async () => {
            try {
              let videoBlob = video;
              let ext = "mp4";
              if (typeof video === "string" && (video.startsWith("data:") || video.startsWith("blob:"))) {
                try {
                  const res = await fetch(video);
                  if (res.ok) videoBlob = await res.blob();
                  else videoBlob = null;
                } catch {
                  videoBlob = null;
                }
              }

              if (videoBlob && (videoBlob instanceof Blob || videoBlob instanceof File)) {
                if (videoBlob.type && videoBlob.type.includes("webm")) ext = "webm";
                else if (videoBlob.type && (videoBlob.type.includes("quicktime") || videoBlob.type.includes("mov"))) ext = "mov";
                else if (videoBlob.name) {
                  ext = (videoBlob.name.split(".").pop() || "mp4").toLowerCase().replace(/[^a-z0-9]/gi, "");
                  if (ext === "quicktime") ext = "mov";
                }

                const contentType = videoBlob.type || (ext === "mov" ? "video/quicktime" : (ext === "webm" ? "video/webm" : "video/mp4"));
                const videoFileName = `video-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext || "mp4"}`;
                finalVideoUrl = await directUploadStorage("find-photos", videoFileName, videoBlob, contentType);
              }
            } catch (vEx) {
              console.warn("Parallel video upload warning:", vEx);
            }
          })()
        );
      }
    }

    // Task C: Audio Note upload
    let finalAudioUrl = null;
    if (audio) {
      if (typeof audio === "string" && audio.startsWith("http")) {
        finalAudioUrl = audio;
      } else {
        uploadTasks.push(
          (async () => {
            try {
              let audioBlob = audio;
              if (typeof audio === "string" && (audio.startsWith("data:") || audio.startsWith("blob:"))) {
                try {
                  const res = await fetch(audio);
                  if (res.ok) audioBlob = await res.blob();
                } catch {}
              }
              if (audioBlob && (audioBlob instanceof Blob || audioBlob instanceof File)) {
                const audioFileName = `audio-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webm`;
                finalAudioUrl = await directUploadStorage("find-photos", audioFileName, audioBlob, audioBlob.type || "audio/webm");
              }
            } catch (aEx) {
              console.warn("Parallel audio upload warning:", aEx);
            }
          })()
        );
      }
    }

    // Await all media uploads simultaneously in parallel
    if (uploadTasks.length > 0) {
      await Promise.all(uploadTasks);
    }

    // 2. Encode description with metadata (including photo thumbnail and media URLs)
    const encodedDesc = encodeMetadata(
      newDescription,
      finalUserCode,
      finalFinderName,
      finalSessionCode,
      finalPhotoUrl,
      {
        audio_url: finalAudioUrl,
        audio_duration: audioDuration,
        video_url: finalVideoUrl
      }
    );

    const payload = {
      title: newTitle || "Sans titre",
      description: encodedDesc,
      category: newCategory || "Autre",
      sub_category: newSubCategory || null,
      latitude: lat,
      longitude: lng,
      image_url: finalPhotoUrl || null,
      date: customDate || new Date().toLocaleString()
    };

    let {
      data: insertedFind,
      error: insertError
    } = await supabase
      .from("finds")
      .insert([payload])
      .select()
      .single();

    if (insertError) {
      console.error("Insert find error:", insertError.message);
      throw insertError;
    }

    // 3. Batch Save Discovery Photo & Video into find_photos table in a single request
    const mediaToInsert = [];
    if (finalPhotoUrl && insertedFind && insertedFind.id) {
      mediaToInsert.push({
        find_id: insertedFind.id,
        image_url: finalPhotoUrl,
        type: "discovery"
      });
    }
    if (finalVideoUrl && insertedFind && insertedFind.id) {
      mediaToInsert.push({
        find_id: insertedFind.id,
        image_url: finalVideoUrl,
        type: "video"
      });
    }

    if (mediaToInsert.length > 0) {
      try {
        await supabase.from("find_photos").insert(mediaToInsert);
      } catch (photoDbErr) {
        console.warn("find_photos batch insert warning:", photoDbErr);
      }
    }

    return {
      ...insertedFind,
      image_url: finalPhotoUrl || insertedFind.image_url || null,
      thumbnail_url: finalPhotoUrl || insertedFind.thumbnail_url || null,
      video_url: finalVideoUrl,
      video: finalVideoUrl,
      audio_url: finalAudioUrl,
      audio_duration: audioDuration,
      user_code: finalUserCode,
      finder_name: finalFinderName,
      session_code: finalSessionCode,
      position: [lat, lng]
    };

  } catch (error) {
    console.error("Erreur addFind:", error);
    throw error;
  }
}

export async function deleteFind(
  findId
) {
  try {
    // =========================
    // RECUP PHOTOS
    // =========================
    const { data: photos } =
      await supabase
        .from("find_photos")
        .select("*")
        .eq("find_id", findId);

    // =========================
    // DELETE STORAGE
    // =========================
    if (photos?.length) {
      const fileNames =
        photos.map((photo) =>
          photo.image_url
            .split("/")
            .pop()
        );

      await supabase.storage
        .from("find-photos")
        .remove(fileNames);
    }

    // =========================
    // DELETE find_photos
    // =========================
    await supabase
      .from("find_photos")
      .delete()
      .eq("find_id", findId);

    // =========================
    // DELETE finds
    // =========================
    const { error } =
      await supabase
        .from("finds")
        .delete()
        .eq("id", findId);

    if (error) {
      console.error(error);

      alert(
        "Erreur suppression"
      );

      return false;
    }

    alert(
      "Trouvaille supprimée ✅"
    );

    return true;

  } catch (error) {
    console.error(error);

    alert(
      "Erreur suppression"
    );

    return false;
  }
}

export async function toggleFavorite(findId, targetOrCurrentValue) {
  const targetFavorite = typeof targetOrCurrentValue === "boolean"
    ? targetOrCurrentValue
    : !targetOrCurrentValue;

  const result = await supabase
    .from("finds")
    .update({
      favorite: targetFavorite
    })
    .eq("id", findId);

  if (result.error) {
    console.error("ERREUR SUPABASE TOGGLE FAVORITE:", result.error);
    return false;
  }

  return true;
}

export function normalizeDateStr(rawDate) {
  if (!rawDate) return "";
  const str = String(rawDate).trim();
  
  // 1. Check if DD/MM/YYYY
  const frMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (frMatch) {
    const d = frMatch[1].padStart(2, "0");
    const m = frMatch[2].padStart(2, "0");
    const y = frMatch[3];
    return `${d}/${m}/${y}`;
  }

  // 2. Check if ISO or YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, "0");
    const d = isoMatch[3].padStart(2, "0");
    return `${d}/${m}/${y}`;
  }

  // 3. Fallback standard Date parsing
  try {
    const dt = new Date(str);
    if (!isNaN(dt.getTime())) {
      const d = String(dt.getDate()).padStart(2, "0");
      const m = String(dt.getMonth() + 1).padStart(2, "0");
      const y = dt.getFullYear();
      return `${d}/${m}/${y}`;
    }
  } catch {
    // fallback
  }

  return str.split(" ")[0].split("T")[0];
}

export function isFindInSortie(find, targetDate) {
  if (!find || !targetDate) return false;
  const rawFindDate = find.date || find.customDate || find.created_at;
  const findNorm = normalizeDateStr(rawFindDate);
  const targetNorm = normalizeDateStr(targetDate);
  return findNorm === targetNorm && Boolean(findNorm);
}