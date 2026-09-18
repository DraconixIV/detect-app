/**
 * Service d'enregistrement audio (Note vocale / Dictaphone)
 * Utilise l'API MediaRecorder standard des navigateurs.
 */

let mediaRecorder = null;
let audioChunks = [];
let audioStream = null;
let recordingTimer = null;

export function isAudioRecordingSupported() {
  return (
    typeof window !== "undefined" &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function" &&
    typeof window.MediaRecorder !== "undefined"
  );
}

/**
 * Démarre l'enregistrement audio
 * @param {Function} onTick Callback appelé chaque seconde avec la durée écoulée
 * @param {number} maxDuration Durée maximale en secondes (défaut 60s)
 * @returns {Promise<boolean>}
 */
export async function startAudioRecording(onTick, maxDuration = 60) {
  if (!isAudioRecordingSupported()) {
    throw new Error("L'enregistrement audio n'est pas supporté sur cet appareil.");
  }

  // Nettoyage préalable si un enregistrement était en cours
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  if (audioStream) {
    audioStream.getTracks().forEach((track) => track.stop());
  }

  audioChunks = [];

  // Demande d'accès au micro
  audioStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  });

  // Sélection du format le plus universel et léger
  let mimeType = "audio/webm;codecs=opus";
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    if (MediaRecorder.isTypeSupported("audio/mp4")) {
      mimeType = "audio/mp4";
    } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
      mimeType = "audio/ogg";
    } else {
      mimeType = ""; // Navigateur choisit le défaut
    }
  }

  const options = mimeType ? { mimeType } : {};
  mediaRecorder = new MediaRecorder(audioStream, options);

  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  mediaRecorder.start(200); // Découpage par 200ms

  let seconds = 0;
  if (onTick) onTick(seconds);

  recordingTimer = setInterval(() => {
    seconds += 1;
    if (onTick) onTick(seconds);
    if (seconds >= maxDuration) {
      stopAudioRecording().catch(() => {});
    }
  }, 1000);

  return true;
}

/**
 * Arrête l'enregistrement et retourne l'audio au format Blob et Base64
 * @returns {Promise<{ blob: Blob, base64: string, duration: number, url: string }>}
 */
export function stopAudioRecording() {
  return new Promise((resolve, reject) => {
    if (recordingTimer) {
      clearInterval(recordingTimer);
      recordingTimer = null;
    }

    if (!mediaRecorder || mediaRecorder.state === "inactive") {
      resolve(null);
      return;
    }

    mediaRecorder.onstop = async () => {
      try {
        const mime = mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunks, { type: mime });
        const url = URL.createObjectURL(blob);

        // Conversion en base64 pour persistance IndexedDB / localStorage
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result;
          // Arrêt du flux micro pour libérer la ressource
          if (audioStream) {
            audioStream.getTracks().forEach((track) => track.stop());
            audioStream = null;
          }
          resolve({ blob, base64, url, mimeType: mime });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      } catch (err) {
        reject(err);
      }
    };

    mediaRecorder.stop();
  });
}
