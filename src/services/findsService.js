import imageCompression from "browser-image-compression";

import { supabase } from "../supabase";

export async function loadFinds() {
  const { data, error } =
    await supabase
      .from("finds")
      .select("*");

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
}

export async function addFind({
  position,
  newTitle,
  newDescription,
  newCategory,
  newPhoto
}) {
  try {
    // 1. création trouvaille
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
            new Date().toLocaleString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error(insertError);

      alert(
        "Erreur création trouvaille"
      );

      return null;
    }

    // 2. upload photo si présente
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

      if (!uploadError) {
        const {
          data: { publicUrl }
        } = supabase.storage
          .from("find-photos")
          .getPublicUrl(fileName);

        // 3. liaison photo ↔ trouvaille
        await supabase
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

export async function deleteFind(findId) {
  try {
    // récupérer photos liées
    const { data: photos } =
      await supabase
        .from("find_photos")
        .select("*")
        .eq("find_id", findId);

    // supprimer fichiers storage
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

    // supprimer photos DB
    await supabase
      .from("find_photos")
      .delete()
      .eq("find_id", findId);

    // supprimer trouvaille
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