import { supabase } from "../supabase";
import { getMyUserCode, getMyDisplayName, normalizeSessionCode } from "./sessionService";
import { decodeMetadata, encodeMetadata } from "./findsService";

export async function exportData() {
  try {
    const myCode = normalizeSessionCode(getMyUserCode());

    const { data: allFinds, error: findsErr } = await supabase
      .from("finds")
      .select("*");

    if (findsErr) throw findsErr;

    // Filter to export current user's personal finds
    const findsData = (allFinds || []).filter((f) => {
      const decoded = decodeMetadata(f);
      const userCodeClean = decoded.user_code ? normalizeSessionCode(decoded.user_code) : null;
      return userCodeClean === myCode || !userCodeClean;
    });

    const userFindIds = new Set(findsData.map((f) => f.id));

    const { data: allPhotos, error: photosErr } = await supabase
      .from("find_photos")
      .select("*");

    if (photosErr) throw photosErr;

    const photosData = (allPhotos || []).filter((p) => userFindIds.has(p.find_id));

    let tracksData = [];
    try {
      const { data: td } = await supabase
        .from("gps_tracks")
        .select("*");
      tracksData = td || [];
    } catch (e) {
      console.warn("No gps_tracks table found:", e);
    }

    const backup = {
      exportDate: new Date().toISOString(),
      userCode: myCode,
      version: "3.0",
      findsCount: findsData.length,
      photosCount: photosData.length,
      tracksCount: tracksData.length,
      finds: findsData,
      photos: photosData,
      tracks: tracksData
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `geoprospect-backup-${myCode}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`✅ Sauvegarde exportée avec succès !\n• ${backup.findsCount} trouvailles personnelles\n• ${backup.photosCount} photos\n• ${backup.tracksCount} tracés GPS`);
    return backup;
  } catch (err) {
    console.error("Export error:", err);
    alert("Erreur lors de l'exportation : " + (err.message || err));
  }
}

export async function importData(onSuccess) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.click();

  input.onchange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      let importedFinds = 0;
      let importedPhotos = 0;
      const myCode = normalizeSessionCode(getMyUserCode());
      const myName = getMyDisplayName() || "Détecteuriste";

      if (backup.finds && backup.finds.length > 0) {
        for (const find of backup.finds) {
          const { id: originalId, ...findWithoutId } = find;
          const decoded = decodeMetadata(findWithoutId);

          // Stamp imported find with current user's code
          const stampedDesc = encodeMetadata(
            decoded.description,
            myCode,
            decoded.finder_name || myName,
            null,
            decoded.thumbnail_url,
            {
              audio_url: decoded.audio_url,
              audio_duration: decoded.audio_duration,
              video_url: decoded.video_url
            }
          );

          const { data: insertedRow, error: insertErr } = await supabase
            .from("finds")
            .insert([{ ...findWithoutId, description: stampedDesc }])
            .select()
            .single();

          if (!insertErr && insertedRow) {
            importedFinds++;

            // Re-link photos to the newly generated find ID
            if (backup.photos && backup.photos.length > 0) {
              const matchedPhotos = backup.photos.filter((p) => p.find_id === originalId);
              for (const photo of matchedPhotos) {
                const { id: pId, ...photoWithoutId } = photo;
                const { error: photoErr } = await supabase.from("find_photos").insert([{
                  ...photoWithoutId,
                  find_id: insertedRow.id
                }]);
                if (!photoErr) importedPhotos++;
              }
            }
          }
        }
      }

      if (backup.tracks && backup.tracks.length > 0) {
        try {
          await supabase.from("gps_tracks").insert(backup.tracks);
        } catch (te) {
          console.warn("Tracks import error:", te);
        }
      }

      alert(`✅ Sauvegarde restaurée avec succès !\n• ${importedFinds} trouvaille(s) importée(s) et attribuée(s) à votre code (${myCode})`);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Import failed:", err);
      alert("Erreur lors de l'importation du fichier JSON : " + (err.message || err));
    }
  };
}