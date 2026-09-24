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

  const match = cleanDesc.match(/<!--GP_META:(.*?)-->/);
  if (match) {
    try {
      const meta = JSON.parse(match[1]);
      if (meta.u && !user_code) user_code = meta.u;
      if (meta.f && !finder_name) finder_name = meta.f;
      if (meta.s && !session_code) session_code = meta.s;
      if (meta.t && !thumbnail_url) thumbnail_url = meta.t;
      if (meta.a && !audio_url) audio_url = meta.a;
      if (meta.ad && !audio_duration) audio_duration = Number(meta.ad);
      if (meta.v && !video_url) video_url = meta.v;
      cleanDesc = cleanDesc.replace(/<!--GP_META:.*?-->/g, "").trim();
    } catch {
      // Ignore
    }
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
 * Ensures existing historical finds in Supabase (from the single-user era) are permanently
 * attributed to the primary creator's personal detector code so they are never lost.
 */
export async function ensureLegacyFindsClaimed(myCode) {
  try {
    if (!myCode) return;
    const cleanMyCode = normalizeSessionCode(myCode);
    const alreadyClaimed = localStorage.getItem(LEGACY_CLAIMED_FLAG);
    if (alreadyClaimed === "true") return;

    const { data: allFinds, error } = await supabase
      .from("finds")
      .select("id, description");

    if (error || !allFinds) return;

    let claimedCount = 0;
    for (const row of allFinds) {
      const decoded = decodeMetadata(row);
      if (!decoded.user_code) {
        const updatedDesc = encodeMetadata(
          decoded.description,
          cleanMyCode,
          decoded.finder_name || getMyDisplayName() || "Détecteuriste",
          decoded.session_code,
          decoded.thumbnail_url,
          { audio_url: decoded.audio_url, video_url: decoded.video_url }
        );
        await supabase
          .from("finds")
          .update({ description: updatedDesc })
          .eq("id", row.id);
        claimedCount++;
      }
    }

    localStorage.setItem(LEGACY_CLAIMED_FLAG, "true");
    if (claimedCount > 0) {
      console.log(`[GeoProspect] Successfully claimed and secured ${claimedCount} historical finds for ${cleanMyCode}`);
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
      return {
        ...normalizedFind,
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

    // 1. Upload Video if provided (File, Blob, or DataURL)
    let finalVideoUrl = null;
    if (video) {
      if (typeof video === "string" && video.startsWith("http")) {
        finalVideoUrl = video;
      } else {
        try {
          let videoBlob = video;
          let ext = "mp4";
          if (typeof video === "string" && video.startsWith("data:")) {
            const res = await fetch(video);
            videoBlob = await res.blob();
            if (videoBlob.type.includes("webm")) ext = "webm";
            else if (videoBlob.type.includes("quicktime")) ext = "mov";
          } else if (video.name) {
            ext = video.name.split(".").pop() || "mp4";
          }

          const videoFileName = `video-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
          const { error: vErr } = await supabase.storage
            .from("find-photos")
            .upload(videoFileName, videoBlob, {
              contentType: videoBlob.type || "video/mp4",
              upsert: false
            });

          if (!vErr) {
            const { data: { publicUrl } } = supabase.storage
              .from("find-photos")
              .getPublicUrl(videoFileName);
            finalVideoUrl = publicUrl;
          } else {
            console.error("Video storage upload error:", vErr);
            if (typeof video === "string" && video.length < 500000) {
              finalVideoUrl = video; // Fallback to inline only if very small
            }
          }
        } catch (vEx) {
          console.error("Video upload exception:", vEx);
        }
      }
    }

    // 2. Upload Audio Note if provided
    let finalAudioUrl = null;
    if (audio) {
      if (typeof audio === "string" && audio.startsWith("http")) {
        finalAudioUrl = audio;
      } else {
        try {
          let audioBlob = audio;
          if (typeof audio === "string" && audio.startsWith("data:")) {
            const res = await fetch(audio);
            audioBlob = await res.blob();
          }
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
            console.warn("Audio storage upload fallback to inline:", aErr);
            finalAudioUrl = audio;
          }
        } catch (aEx) {
          console.warn("Audio upload exception:", aEx);
          finalAudioUrl = audio;
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
      title: newTitle,
      description: encodedDesc,
      category: newCategory,
      sub_category: newSubCategory || null,
      latitude: position[0],
      longitude: position[1],
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

    if (newPhoto) {
      const compressedFile =
        await imageCompression(
          newPhoto,
          {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1600,
            useWebWorker: true
          }
        );

      const rawName = newPhoto.name || `photo-${Date.now()}.jpg`;
      const cleanName = rawName
        .replaceAll(" ", "-")
        .replaceAll("é", "e")
        .replaceAll("è", "e")
        .replaceAll("à", "a");

      const fileName =
        `${Date.now()}-${cleanName}`;

      const {
        error: uploadError
      } = await supabase.storage
        .from("find-photos")
        .upload(
          fileName,
          compressedFile
        );

      if (uploadError) {
        console.error(
          "Erreur upload:",
          uploadError
        );

        throw uploadError;
      }

      const {
        data: { publicUrl }
      } = supabase.storage
        .from("find-photos")
        .getPublicUrl(fileName);

      // Lightweight Thumbnail Generation (~20KB, 220px) for ultra-fast album loading
      let thumbnailUrl = publicUrl;
      try {
        const thumbFile = await imageCompression(newPhoto, {
          maxSizeMB: 0.03,
          maxWidthOrHeight: 220,
          useWebWorker: true
        });
        const thumbName = `thumb-${fileName}`;
        const { error: thumbErr } = await supabase.storage
          .from("find-photos")
          .upload(thumbName, thumbFile);

        if (!thumbErr) {
          const { data: { publicUrl: thumbUrl } } = supabase.storage
            .from("find-photos")
            .getPublicUrl(thumbName);
          thumbnailUrl = thumbUrl;
        }
      } catch (thumbErr) {
        console.warn("Thumbnail generation non-blocking fallback:", thumbErr);
      }

      // Update Find description with thumbnail metadata
      const finalEncodedDesc = encodeMetadata(
        newDescription,
        finalUserCode,
        finalFinderName,
        finalSessionCode,
        thumbnailUrl,
        {
          audio_url: finalAudioUrl,
          audio_duration: audioDuration,
          video_url: finalVideoUrl
        }
      );
      await supabase
        .from("finds")
        .update({ description: finalEncodedDesc, image_url: publicUrl })
        .eq("id", insertedFind.id);

      const {
        error: photoError
      } = await supabase
        .from("find_photos")
        .insert([
          {
            find_id:
              insertedFind.id,
            image_url:
              publicUrl,
            type:
              "discovery"
          },
          ...(thumbnailUrl && thumbnailUrl !== publicUrl
            ? [
                {
                  find_id: insertedFind.id,
                  image_url: thumbnailUrl,
                  type: "thumbnail"
                }
              ]
            : [])
        ]);

      if (photoError) {
        console.error(
          "Erreur photo DB:",
          photoError
        );
        throw photoError;
      }
    }

    return insertedFind;

  } catch (error) {
    console.error(
      "Erreur addFind:",
      error
    );

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