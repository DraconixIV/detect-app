import { supabase } from "../supabase";

export async function exportData() {
  try {
    const { data: findsData } = await supabase
      .from("finds")
      .select("*");

    const { data: photosData } = await supabase
      .from("find_photos")
      .select("*");

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
      version: "2.0",
      findsCount: findsData?.length || 0,
      photosCount: photosData?.length || 0,
      tracksCount: tracksData?.length || 0,
      finds: findsData || [],
      photos: photosData || [],
      tracks: tracksData || []
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `geoprospect-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`✅ Sauvegarde exportée avec succès !\n• ${backup.findsCount} trouvailles\n• ${backup.photosCount} photos\n• ${backup.tracksCount} tracés GPS`);
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

      if (backup.finds && backup.finds.length > 0) {
        // Clean ids to avoid primary key conflict on insert, or upsert
        for (const find of backup.finds) {
          const { id, ...findWithoutId } = find;
          const { error } = await supabase.from("finds").insert([findWithoutId]);
          if (!error) importedFinds++;
        }
      }

      if (backup.photos && backup.photos.length > 0) {
        for (const photo of backup.photos) {
          const { id, ...photoWithoutId } = photo;
          const { error } = await supabase.from("find_photos").insert([photoWithoutId]);
          if (!error) importedPhotos++;
        }
      }

      if (backup.tracks && backup.tracks.length > 0) {
        try {
          await supabase.from("gps_tracks").insert(backup.tracks);
        } catch (te) {
          console.warn("Tracks import error:", te);
        }
      }

      alert(`✅ Sauvegarde restaurée avec succès !\n• ${importedFinds} trouvaille(s) importée(s)`);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Import failed:", err);
      alert("Erreur lors de l'importation du fichier JSON : " + (err.message || err));
    }
  };
}