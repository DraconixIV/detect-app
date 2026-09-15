import imageCompression from "browser-image-compression";

import { supabase } from "../supabase.js";
import { getMyUserCode, getMyDisplayName, getActiveSession, getMyJoinedSessions } from "./sessionService.js";

export function encodeMetadata(description, userCode, finderName, sessionCode, thumbnailUrl = null) {
  const meta = {};
  if (userCode) meta.u = userCode;
  if (finderName) meta.f = finderName;
  if (sessionCode) meta.s = sessionCode;
  if (thumbnailUrl) meta.t = thumbnailUrl;
  if (Object.keys(meta).length === 0) return description || "";
  const metaTag = `\n<!--GP_META:${JSON.stringify(meta)}-->`;
  return ((description || "").replace(/<!--GP_META:.*?-->/g, "").trim() + metaTag);
}

export function decodeMetadata(find) {
  if (!find) return find;
  let user_code = find.user_code || null;
  let finder_name = find.finder_name || null;
  let session_code = find.session_code || null;
  let thumbnail_url = find.thumbnail_url || null;
  let cleanDesc = find.description || "";

  const match = cleanDesc.match(/<!--GP_META:(.*?)-->/);
  if (match) {
    try {
      const meta = JSON.parse(match[1]);
      if (meta.u && !user_code) user_code = meta.u;
      if (meta.f && !finder_name) finder_name = meta.f;
      if (meta.s && !session_code) session_code = meta.s;
      if (meta.t && !thumbnail_url) thumbnail_url = meta.t;
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
    thumbnail_url: thumbnail_url || find.image_url
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

export async function loadFinds(options = {}) {
  try {
    const { mode, targetCode } = options;
    const myCode = options.myUserCode || getMyUserCode();
    const joinedSessions = getMyJoinedSessions().map((s) => s.code).filter(Boolean);

    // Fetch all finds reliably from Supabase
    const { data, error } = await supabase
      .from("finds")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("loadFinds error:", error);
      return [];
    }

    const allFinds = data || [];

    // Filter in JS gracefully so legacy finds (without user_code) are ALWAYS visible to the user!
    const filteredFinds = allFinds.filter((find) => {
      if (mode === "consultation" && targetCode) {
        return find.user_code === targetCode;
      }
      if (mode === "session" && targetCode) {
        return find.session_code === targetCode || find.user_code === myCode;
      }
      // Mode personnel : mes trouvailles + toutes les trouvailles de mes sessions passées + trouvailles legacy
      if (!find.user_code) {
        // Trouvaille historique : TOUJOURS visible
        return true;
      }
      if (find.user_code === myCode) {
        return true;
      }
      if (find.session_code && joinedSessions.includes(find.session_code)) {
        return true;
      }
      // If user has not attached a code yet or it's existing data, show it
      return false;
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
  sessionCode = null
}) {
  try {
    const finalUserCode = userCode || getMyUserCode();
    const finalFinderName = finderName || getMyDisplayName();
    const finalSessionCode = sessionCode !== undefined ? sessionCode : (getActiveSession()?.code || null);
    const encodedDesc = encodeMetadata(newDescription, finalUserCode, finalFinderName, finalSessionCode);

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
        thumbnailUrl
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