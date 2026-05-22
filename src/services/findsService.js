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
  photoFile
}) {
  try {
    let imageUrl = null;

    // =========================
    // UPLOAD PHOTO
    // =========================
    if (photoFile) {
      const compressedFile =
        await imageCompression(
          photoFile,
          {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1600,
            useWebWorker: true
          }
        );

      const cleanName =
        photoFile.name
          .replaceAll(" ", "-")
          .replaceAll("é", "e")
          .replaceAll("è", "e")
          .replaceAll("ê", "e")
          .replaceAll("à", "a")
          .replaceAll("ù", "u");

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
          uploadError
        );

        alert(
          "Erreur upload photo"
        );

        return null;
      }

      const {
        data: { publicUrl }
      } = supabase.storage
        .from("find-photos")
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    // =========================
    // INSERT TROUVAILLE
    // =========================
    const {
      data: insertedFind,
      error: insertError
    } = await supabase
      .from("finds")
      .insert([
        {
          title:
            newTitle || "",

          description:
            newDescription ||
            "",

          category:
            newCategory ||
            "autre",

          latitude:
            position[0],

          longitude:
            position[1],

          date:
            new Date().toLocaleString(),

          image_url:
            imageUrl
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error(
        insertError
      );

      alert(
        "Erreur création trouvaille"
      );

      return null;
    }

    // =========================
    // TABLE find_photos
    // =========================
    if (imageUrl) {
      const {
        error: photoError
      } = await supabase
        .from("find_photos")
        .insert([
          {
            find_id:
              insertedFind.id,

            image_url:
              imageUrl,

            type:
              "discovery"
          }
        ]);

      if (photoError) {
        console.error(
          photoError
        );
      }
    }

    alert(
      "Trouvaille ajoutée ✅"
    );

    return insertedFind;

  } catch (error) {
    console.error(error);

    alert(
      "Erreur ajout trouvaille"
    );

    return null;
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