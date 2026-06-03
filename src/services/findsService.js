import imageCompression from "browser-image-compression";

import { supabase } from "../supabase";

export async function loadFinds() {
  try {
    const { data, error } =
      await supabase
        .from("finds")
        .select("*")
        .order("id", {
          ascending: false
        });

    if (error) {
      console.error(error);
      return [];
    }

    return (data || []).map(
      (find) => ({
        ...find,

        position: [
          find.latitude,
          find.longitude
        ],

        category:
          find.category ||
          "autre"
      })
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
  newPhoto,
  customDate = null,
  isOldFind = false


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
          latitude:
            position[0],
          longitude:
            position[1],
          date:
            customDate ||
            new Date().toLocaleString(),
          is_old_find:
            isOldFind
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