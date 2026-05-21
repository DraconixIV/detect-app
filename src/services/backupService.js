import { supabase } from "../supabase";

export async function exportData() {
  const { data: findsData } =
    await supabase
      .from("finds")
      .select("*");

  const { data: tracksData } =
    await supabase
      .from("gps_tracks")
      .select("*");

  const backup = {
    exportDate:
      new Date().toISOString(),

    finds: findsData || [],

    tracks: tracksData || []
  };

  const blob = new Blob(
    [
      JSON.stringify(
        backup,
        null,
        2
      )
    ],
    {
      type:
        "application/json"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    `backup-${Date.now()}.json`;

  a.click();

  URL.revokeObjectURL(url);

  alert(
    "Backup exporté ✅"
  );
}

export async function importData() {
  const input =
    document.createElement("input");

  input.type = "file";

  input.accept = ".json";

  input.click();

  input.onchange = async (e) => {
    const file =
      e.target.files[0];

    if (!file) return;

    const text =
      await file.text();

    const backup =
      JSON.parse(text);

    if (
      backup.finds?.length
    ) {
      await supabase
        .from("finds")
        .insert(
          backup.finds
        );
    }

    if (
      backup.tracks?.length
    ) {
      await supabase
        .from("gps_tracks")
        .insert(
          backup.tracks
        );
    }

    alert(
      "Backup restauré ✅"
    );
  };
}