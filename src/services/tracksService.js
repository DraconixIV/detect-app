import { supabase } from "../supabase";

export async function loadTracks() {
  const { data, error } =
    await supabase
      .from("gps_tracks")
      .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export async function saveTrack(
  track
) {
  if (track.length < 2) {
    alert(
      "Pas assez de points GPS"
    );

    return false;
  }

  const sessionName =
    prompt(
      "Nom de la sortie ?"
    );

  if (!sessionName)
    return false;

  const { error } =
    await supabase
      .from("gps_tracks")
      .insert([
        {
          session_name:
            sessionName,

          positions: track
        }
      ]);

  if (error) {
    console.error(error);

    alert(
      "Erreur sauvegarde"
    );

    return false;
  }

  alert(
    "Trajet sauvegardé ✅"
  );

  return true;
}