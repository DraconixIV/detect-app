/**
 * GeoProspect Background Keep-Alive Service
 * Keeps the browser JavaScript execution loop and Geolocation API active on mobile devices (Android & iOS)
 * while the screen is locked or the app is running in the background during an active sortie.
 */

// Minimal 1-second silent WAV audio (PCM, 8kHz, 8-bit mono)
const SILENT_WAV_BASE64 =
  "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

let silentAudio = null;
let wakeLock = null;
let isKeepAliveRunning = false;
let keepAliveHeartbeat = null;

function getOrCreateAudioElement() {
  if (!silentAudio && typeof document !== "undefined") {
    silentAudio = new Audio();
    silentAudio.src = SILENT_WAV_BASE64;
    silentAudio.loop = true;
    silentAudio.volume = 0.001; // Ultra-low / inaudible
    silentAudio.setAttribute("playsinline", "true");
    silentAudio.setAttribute("webkit-playsinline", "true");
    silentAudio.preload = "auto";
  }
  return silentAudio;
}

/**
 * Acquire Screen Wake Lock API
 */
async function acquireWakeLock() {
  if (typeof navigator !== "undefined" && "wakeLock" in navigator && isKeepAliveRunning) {
    if (document.visibilityState !== "visible") return;
    try {
      if (!wakeLock) {
        wakeLock = await navigator.wakeLock.request("screen");
        wakeLock.addEventListener("release", () => {
          wakeLock = null;
          // Re-acquire if sortie is still active and app is visible
          if (isKeepAliveRunning && document.visibilityState === "visible") {
            acquireWakeLock();
          }
        });
      }
    } catch (err) {
      console.debug("WakeLock request warning:", err.message);
    }
  }
}

/**
 * Release Screen Wake Lock
 */
async function releaseWakeLock() {
  if (wakeLock) {
    try {
      await wakeLock.release();
    } catch {}
    wakeLock = null;
  }
}

/**
 * Setup MediaSession API so mobile OS doesn't kill the background process
 */
function setupMediaSession() {
  if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: "GeoProspect - Sortie GPS en cours",
        artist: "Tracé GPS actif en arrière-plan",
        album: "GeoProspect Détection"
      });
      navigator.mediaSession.playbackState = "playing";

      // Dummy handlers to satisfy mobile background media requirements
      navigator.mediaSession.setActionHandler("play", () => {
        if (silentAudio && isKeepAliveRunning) {
          silentAudio.play().catch(() => {});
        }
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        // Prevent accidental pause from notification bar while recording
        if (silentAudio && isKeepAliveRunning) {
          silentAudio.play().catch(() => {});
        }
      });
    } catch (e) {
      console.debug("MediaSession setup warning:", e);
    }
  }
}

/**
 * Clear MediaSession
 */
function clearMediaSession() {
  if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
    try {
      navigator.mediaSession.playbackState = "none";
    } catch {}
  }
}

/**
 * Handle visibility / focus change events
 */
function handleResume() {
  if (!isKeepAliveRunning) return;

  // Re-acquire wake lock if visible
  if (document.visibilityState === "visible") {
    acquireWakeLock();
  }

  // Ensure audio is playing
  if (silentAudio && silentAudio.paused) {
    silentAudio.play().catch(() => {});
  }
}

/**
 * Start the background keep-alive engine
 */
export function startBackgroundKeepAlive() {
  if (isKeepAliveRunning) return;
  isKeepAliveRunning = true;

  try {
    const audio = getOrCreateAudioElement();
    if (audio) {
      audio.play().catch((err) => {
        console.debug("Audio keep-alive auto-play deferred:", err.message);
      });
    }

    setupMediaSession();
    acquireWakeLock();

    // Attach visibility/focus listeners
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleResume);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleResume);
      window.addEventListener("pageshow", handleResume);
    }

    // Secondary lightweight heartbeat
    if (keepAliveHeartbeat) clearInterval(keepAliveHeartbeat);
    keepAliveHeartbeat = setInterval(() => {
      if (isKeepAliveRunning) {
        try {
          localStorage.setItem("geoprospect_keepalive_pulse", Date.now().toString());
        } catch {}
      }
    }, 10000);
  } catch (e) {
    console.warn("Could not start background keep-alive:", e);
  }
}

/**
 * Stop the background keep-alive engine
 */
export function stopBackgroundKeepAlive() {
  isKeepAliveRunning = false;

  if (keepAliveHeartbeat) {
    clearInterval(keepAliveHeartbeat);
    keepAliveHeartbeat = null;
  }

  if (silentAudio) {
    try {
      silentAudio.pause();
      silentAudio.currentTime = 0;
    } catch {}
  }

  releaseWakeLock();
  clearMediaSession();

  if (typeof document !== "undefined") {
    document.removeEventListener("visibilitychange", handleResume);
  }
  if (typeof window !== "undefined") {
    window.removeEventListener("focus", handleResume);
    window.removeEventListener("pageshow", handleResume);
  }
}

export function isKeepAliveActive() {
  return isKeepAliveRunning;
}
