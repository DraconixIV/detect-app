import imageCompression from "browser-image-compression";

import { supabase } from "../supabase";

export function normalizeCategoryAndSub(find) {
  if (!find) return find;

  let category = find.category || "Autre";
  let subCategory = find.sub_category || "";

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
    ...find,
    category,
    sub_category: subCategory
  };
}

export async function loadFinds() {
  try {
    const { data, error } =
      await supabase
        .from("finds")
        .select("*, find_photos(*)")
        .order("id", {
          ascending: false
        });

    if (error) {
      console.error(error);
      return [];
    }

    return (data || []).map(
      (find) => {
        const normalizedFind = normalizeCategoryAndSub(find);
        return {
          ...normalizedFind,
          position: [
            normalizedFind.latitude,
            normalizedFind.longitude
          ]
        };
      }
    );

  } catch (error) {
    console.error(error);
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


}) {
  try {
    const {
      data: insertedFind,
      error: insertError
    } = await supabase
      .from("finds")
      .insert([
        {
          title: newTitle,
          description:
            newDescription,
          category:
            newCategory,
          sub_category:
            newSubCategory || null,
          latitude:
            position[0],
          longitude:
            position[1],
          date:
            customDate ||
            new Date().toLocaleString(),
          
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error(
        "Erreur insert:",
        insertError
      );

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

      const cleanName =
        newPhoto.name
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
          }
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

export async function toggleFavorite(
  findId,
  currentValue
) {

  const result =
    await supabase
      .from("finds")
      .update({
        favorite: !currentValue
      })
      .eq("id", findId);

  if (result.error) {
    console.error(
      "ERREUR SUPABASE",
      result.error
    );
    return false;
  }

  return true;
}