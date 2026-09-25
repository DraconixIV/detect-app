import imageCompression from "browser-image-compression";

import { supabase } from "../supabase.js";
import { getMyUserCode, getMyDisplayName, getActiveSession, getMyJoinedSessions, normalizeSessionCode } from "./sessionService.js";

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

  return {
    ...find,
    description: cleanDesc,
    user_code,
    finder_name,
    session_code,
    thumbnail_url: thumbnail_url || find.image_url,
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

/**
 * Ensures existing historical finds in Supabase (from the single-user era or previous sessions)
 * are permanently attributed to the primary creator's personal detector code and unified pseudonym.
 */
export async function ensureLegacyFindsClaimed(myCode) {
  try {
    if (!myCode) return;
    const cleanMyCode = normalizeSessionCode(myCode);
    const myName = getMyDisplayName();
    const claimKey = `geoprospect_claimed_${cleanMyCode}_${myName || "anon"}`;
    const alreadyClaimed = localStorage.getItem(claimKey);
    if (alreadyClaimed === "true") return;

    const { data: allFinds, error } = await supabase
      .from("finds")
      .select("id, description");

    if (error || !allFinds) return;

    let updatedCount = 0;
    for (const row of allFinds) {
      const decoded = decodeMetadata(row);
      const isMine = !decoded.user_code || normalizeSessionCode(decoded.user_code) === cleanMyCode;
      
      // Update if find is untagged or has outdated finder name
      if (isMine && (!decoded.user_code || (myName && decoded.finder_name !== myName))) {
        const updatedDesc = encodeMetadata(
          decoded.description,
          cleanMyCode,
          myName || decoded.finder_name || "Détecteuriste",
          decoded.session_code,
          decoded.thumbnail_url,
          {
            audio_url: decoded.audio_url,
            audio_duration: decoded.audio_duration,
            video_url: decoded.video_url
          }
        );
        await supabase
          .from("finds")
          .update({ description: updatedDesc })
          .eq("id", row.id);
        updatedCount++;
      }
    }

    localStorage.setItem(claimKey, "true");
    if (updatedCount > 0) {
      console.log(`[GeoProspect] Harmonized and secured ${updatedCount} finds for ${cleanMyCode} (${myName})`);
    }
  } catch (err) {
    console.warn("Legacy finds attribution error:", err);
  }
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

    // Run safe one-time legacy attribution on launch
    ensureLegacyFindsClaimed(myCode).catch(() => {});

    // Fetch finds from Supabase
    const { data, error } = await supabase
      .from("finds")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("loadFinds error:", error);
      return [];
    }

    // Fetch videos from find_photos to attach directly to finds
    let videoMap = {};
    try {
      const { data: videoPhotos } = await supabase
        .from("find_photos")
        .select("find_id, image_url, type")
        .eq("type", "video");

      if (videoPhotos) {
        videoPhotos.forEach((vp) => {
          if (vp.find_id && vp.image_url) {
            videoMap[vp.find_id] = vp.image_url;
          }
        });
      }
    } catch (vMapErr) {
      console.warn("Could not load video map:", vMapErr);
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
      const resolvedVideo = normalizedFind.video_url || videoMap[normalizedFind.id] || null;
      return {
        ...normalizedFind,
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

    // 1. Process Video if provided (Direct streaming storage upload)
    let finalVideoUrl = null;
    if (video) {
      if (typeof video === "string" && video.startsWith("http")) {
        finalVideoUrl = video;
      } else {
        try {
          let videoBlob = video;
          let ext = "mp4";
          if (typeof video === "string" && (video.startsWith("data:") || video.startsWith("blob:"))) {
            try {
              const res = await fetch(video);
              if (res.ok) {
                videoBlob = await res.blob();
              } else {
                videoBlob = null;
              }
            } catch (fetchErr) {
              console.warn("Could not fetch video blob/data URL:", fetchErr);
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

            let contentType = videoBlob.type || (ext === "mov" ? "video/quicktime" : (ext === "webm" ? "video/webm" : "video/mp4"));
            const videoFileName = `video-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext || "mp4"}`;

            const { error: vErr } = await supabase.storage
              .from("find-photos")
              .upload(videoFileName, videoBlob, {
                contentType: contentType,
                upsert: false
              });

            if (!vErr) {
              const { data: { publicUrl } } = supabase.storage
                .from("find-photos")
                .getPublicUrl(videoFileName);
              finalVideoUrl = publicUrl;
            } else {
              console.warn("Storage video upload warning:", vErr);
            }
          }
        } catch (vEx) {
          console.warn("Video upload exception:", vEx);
        }
      }
    }

    // 2. Process Audio Note if provided
    let finalAudioUrl = null;
    if (audio) {
      if (typeof audio === "string" && audio.startsWith("http")) {
        finalAudioUrl = audio;
      } else {
        try {
          let audioBlob = audio;
          if (typeof audio === "string" && (audio.startsWith("data:") || audio.startsWith("blob:"))) {
            try {
              const res = await fetch(audio);
              if (res.ok) audioBlob = await res.blob();
            } catch {
              // fallback
            }
          }
          if (audioBlob && (audioBlob instanceof Blob || audioBlob instanceof File)) {
            const audioFileName = `audio-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webm`;
            const { error: aErr } = await supabase.storage
              .from("find-photos")
              .upload(audioFileName, audioBlob, {
                contentType: audioBlob.type || "audio/webm",
                upsert: false
              });

            if (!aErr) {
              const { data: { publicUrl } } = supabase.storage
                .from("find-photos")
                .getPublicUrl(audioFileName);
              finalAudioUrl = publicUrl;
            } else {
              console.warn("Audio storage upload fallback:", aErr);
            }
          }
        } catch (aEx) {
          console.warn("Audio upload exception:", aEx);
        }
      }
    }

    const encodedDesc = encodeMetadata(
      newDescription,
      finalUserCode,
      finalFinderName,
      finalSessionCode,
      null,
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

    // 3. Process Photo if provided
    if (newPhoto) {
      let finalPhotoUrl = null;
      if (typeof newPhoto === "string" && newPhoto.startsWith("http")) {
        finalPhotoUrl = newPhoto;
        try {
          await supabase.from("finds").update({ image_url: finalPhotoUrl }).eq("id", insertedFind.id);
          await supabase.from("find_photos").insert([{ find_id: insertedFind.id, image_url: finalPhotoUrl, type: "discovery" }]);
        } catch (err) {
          console.warn("Photo record link error:", err);
        }
      } else {
        try {
          let photoBlob = newPhoto;
          if (typeof newPhoto === "string" && (newPhoto.startsWith("data:") || newPhoto.startsWith("blob:"))) {
            try {
              const res = await fetch(newPhoto);
              if (res.ok) photoBlob = await res.blob();
              else photoBlob = null;
            } catch {
              photoBlob = null;
            }
          }

          if (photoBlob && (photoBlob instanceof Blob || photoBlob instanceof File)) {
            let compressedFile = photoBlob;
            try {
              compressedFile = await imageCompression(photoBlob, {
                maxSizeMB: 0.3,
                maxWidthOrHeight: 1600,
                useWebWorker: true
              });
            } catch (compErr) {
              console.warn("Image compression warning, uploading raw:", compErr);
            }

            const rawName = photoBlob.name || `photo-${Date.now()}.jpg`;
            const cleanName = rawName
              .replaceAll(" ", "-")
              .replaceAll("é", "e")
              .replaceAll("è", "e")
              .replaceAll("à", "a");

            const fileName = `${Date.now()}-${cleanName}`;

            const { error: uploadError } = await supabase.storage
              .from("find-photos")
              .upload(fileName, compressedFile, { upsert: false });

            if (!uploadError) {
              const { data: { publicUrl } } = supabase.storage
                .from("find-photos")
                .getPublicUrl(fileName);
              finalPhotoUrl = publicUrl;

              await supabase
                .from("finds")
                .update({ image_url: finalPhotoUrl })
                .eq("id", insertedFind.id);

              await supabase.from("find_photos").insert([
                {
                  find_id: insertedFind.id,
                  image_url: finalPhotoUrl,
                  type: "discovery"
                }
              ]);
            } else {
              console.warn("Storage photo upload warning:", uploadError);
            }
          }
        } catch (photoErr) {
          console.warn("Photo upload warning:", photoErr);
        }
      }
    }

    // 4. Save Video into find_photos table (guaranteed persistence)
    if (finalVideoUrl && insertedFind && insertedFind.id) {
      try {
        await supabase.from("find_photos").insert([
          {
            find_id: insertedFind.id,
            image_url: finalVideoUrl,
            type: "video"
          }
        ]);
      } catch (videoDbErr) {
        console.warn("find_photos video insert error:", videoDbErr);
      }
    }

    return {
      ...insertedFind,
      video_url: finalVideoUrl,
      video: finalVideoUrl
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