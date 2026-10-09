import { supabase } from "../supabase.js";
import { getMyUserCode, normalizeSessionCode } from "./sessionService.js";
import { detectInAppBrowser } from "../components/InAppBrowserBanner.jsx";

export const CURRENT_APP_VERSION = "1.4.0";
export const LAST_SEEN_VERSION_KEY = "geoprospect_last_seen_app_version";
export const FIRST_INSTALLED_KEY = "geoprospect_first_installed";

/**
 * Chronological release history (newest to oldest)
 */
export const APP_RELEASES = [
  {
    id: "1.4.0",
    version: "v1.4.0",
    date: "9 Octobre 2026",
    title: "Formulaire de retour",
    highlights: [
      "Formulaire de retour disponible dans le menu latéral pour signaler un bug ou une idée.",
      "Amélioration de la fluidité générale.",
      "Accès direct à toutes les fonctionnalités."
    ]
  },
  {
    id: "1.3.0",
    version: "v1.3.0",
    date: "7 Octobre 2026",
    title: "Cartographie et cadastre IGN",
    highlights: [
      "Superposition du cadastre officiel IGN avec réglage de l'opacité.",
      "Cartes anciennes de Cassini et de l'état-major en surcouche.",
      "Optimisation du mode hors-ligne sans connexion réseau."
    ]
  },
  {
    id: "1.2.0",
    version: "v1.2.0",
    date: "4 Octobre 2026",
    title: "Sessions d'équipe en direct",
    highlights: [
      "Partage de localisation en direct entre coéquipiers.",
      "Alertes instantanées des découvertes sur le terrain.",
      "Gestion d'équipe avec code de session sécurisé."
    ]
  },
  {
    id: "1.1.0",
    version: "v1.1.0",
    date: "1 Octobre 2026",
    title: "Carnet de détection GeoProspect",
    highlights: [
      "Enregistrement GPS précis de chaque trouvaille.",
      "Photos macro avant et après restauration.",
      "Classification personnalisée des monnaies et objets."
    ]
  }
];

/**
 * Returns the number of unread app updates.
 * - For a brand new user opening the app for the 1st time: returns 0 (initializes to CURRENT_APP_VERSION).
 * - For a returning user: counts the exact number of new updates released since their last seen version (1, 2, 3, etc.).
 */
export function getUnreadUpdatesCount() {
  if (typeof window === "undefined") return 0;
  try {
    const lastSeen = localStorage.getItem(LAST_SEEN_VERSION_KEY);
    const hasInstalledFlag = localStorage.getItem(FIRST_INSTALLED_KEY);

    // 1. First time opening the application
    if (!lastSeen && !hasInstalledFlag) {
      // Check if user has legacy app data to detect if they are an existing user from an earlier version
      const hasLegacyData =
        !!localStorage.getItem("geoprospect_finds") ||
        !!localStorage.getItem("geoprospect_onboarding_completed") ||
        !!localStorage.getItem("geoprospect_user_code") ||
        !!localStorage.getItem("geoprospect_saved_tracks");

      localStorage.setItem(FIRST_INSTALLED_KEY, "true");

      if (!hasLegacyData) {
        // Brand new user: initialize to current version so they do NOT see any red badge
        localStorage.setItem(LAST_SEEN_VERSION_KEY, CURRENT_APP_VERSION);
        return 0;
      } else {
        // Returning user who hadn't opened the updates tab yet: 1 update unread
        return 1;
      }
    }

    // 2. User has already seen the current version
    if (lastSeen === CURRENT_APP_VERSION || lastSeen === `v${CURRENT_APP_VERSION}`) {
      return 0;
    }

    if (!lastSeen) {
      return 0;
    }

    // 3. Find the index of the last seen version in APP_RELEASES
    const lastIndex = APP_RELEASES.findIndex(
      (r) => r.id === lastSeen || r.version === lastSeen || `v${r.id}` === lastSeen
    );

    if (lastIndex === -1) {
      // Older unlisted version -> all releases count as unread
      return APP_RELEASES.length;
    }

    // Number of unread updates is the count of releases newer than lastSeen
    return Math.max(0, lastIndex);
  } catch {
    return 0;
  }
}

/**
 * Boolean helper for unread update status
 */
export function checkHasUnreadUpdate() {
  return getUnreadUpdatesCount() > 0;
}

/**
 * Marks all app updates as seen / acknowledged
 */
export function markUpdateAsSeen() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FIRST_INSTALLED_KEY, "true");
    localStorage.setItem(LAST_SEEN_VERSION_KEY, CURRENT_APP_VERSION);
    window.dispatchEvent(new Event("geoprospect-version-seen"));
  } catch {}
}

function getDeviceInfo() {
  if (typeof window === "undefined" || !window.navigator) return { device: "Inconnu", browser: "Inconnu", screen: "0x0" };
  const ua = navigator.userAgent || "";
  let device = "Mobile / Autre";
  if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) device = "iPhone / iPad";
  else if (/Android/i.test(ua)) device = "Android";
  else if (/Windows/i.test(ua)) device = "Windows PC";
  else if (/Macintosh|Mac OS X/i.test(ua)) device = "Mac";
  else if (/Linux/i.test(ua)) device = "Linux";

  const inApp = detectInAppBrowser();
  let browser = inApp.isInApp ? `${inApp.appName} In-App` : "Autre";
  if (!inApp.isInApp) {
    if (/Edg/i.test(ua)) browser = "Edge";
    else if (/Chrome|CriOS/i.test(ua)) browser = "Chrome";
    else if (/Safari/i.test(ua)) browser = "Safari";
    else if (/Firefox|FxiOS/i.test(ua)) browser = "Firefox";
  }

  const screen = `${window.screen?.width || 0}x${window.screen?.height || 0}`;
  return { device, browser, screen };
}

/**
 * Submit user feedback to Supabase
 */
export async function submitUserFeedback({ category = "suggestion", message = "" }) {
  try {
    if (!message || !message.trim()) {
      throw new Error("Veuillez saisir un message.");
    }

    const { device, browser, screen } = getDeviceInfo();
    const userCode = normalizeSessionCode(getMyUserCode()) || "ANON";
    const cleanMsg = message.trim();
    const cleanCat = category || "suggestion";
    const nowIso = new Date().toISOString();

    // 1. Primary write into existing app_analytics table (event_type = 'feedback')
    const analyticsFeedbackPayload = {
      event_type: "feedback",
      user_code: userCode,
      source: `[${cleanCat}] ${cleanMsg}`,
      device: device,
      browser: browser,
      screen_size: screen,
      created_at: nowIso
    };

    let inserted = false;
    try {
      const { error: aErr } = await supabase
        .from("app_analytics")
        .insert([analyticsFeedbackPayload]);
      if (!aErr) {
        inserted = true;
      }
    } catch (e) {
      console.warn("Analytics feedback insert error:", e);
    }

    // 2. Also attempt write to dedicated app_feedback table if created
    const feedbackTablePayload = {
      user_code: userCode,
      category: cleanCat,
      message: cleanMsg,
      device: device,
      browser: browser,
      screen_size: screen,
      app_version: CURRENT_APP_VERSION,
      created_at: nowIso
    };

    try {
      const { error: fErr } = await supabase
        .from("app_feedback")
        .insert([feedbackTablePayload]);
      if (!fErr) {
        inserted = true;
      }
    } catch {}

    if (!inserted) {
      saveOfflineFeedback(feedbackTablePayload);
    }

    return { success: true };
  } catch (err) {
    console.error("submitUserFeedback exception:", err);
    throw err;
  }
}

/**
 * Fetch all user feedback for Developer Admin Console
 */
export async function fetchAllFeedbacks() {
  const feedbacksMap = new Map();

  try {
    // 1. Fetch from app_analytics where event_type = 'feedback'
    const { data: analyticsFb, error: aErr } = await supabase
      .from("app_analytics")
      .select("*")
      .eq("event_type", "feedback")
      .order("created_at", { ascending: false })
      .limit(500);

    if (!aErr && analyticsFb) {
      analyticsFb.forEach((row) => {
        let cat = "suggestion";
        let msg = row.source || "";
        const match = msg.match(/^\[([a-zA-Z0-9_-]+)\]\s*([\s\S]*)$/);
        if (match) {
          cat = match[1].toLowerCase();
          msg = match[2];
        }

        feedbacksMap.set(row.id, {
          id: row.id,
          user_code: row.user_code || "ANON",
          category: cat,
          message: msg,
          device: row.device || "Mobile",
          browser: row.browser || "Navigateur",
          screen_size: row.screen_size,
          app_version: CURRENT_APP_VERSION,
          created_at: row.created_at
        });
      });
    }

    // 2. Also try fetching from dedicated app_feedback table
    const { data: fbData, error: fErr } = await supabase
      .from("app_feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (!fErr && fbData) {
      fbData.forEach((row) => {
        feedbacksMap.set(row.id, {
          id: row.id,
          user_code: row.user_code || "ANON",
          category: row.category || "suggestion",
          message: row.message || "",
          device: row.device || "Mobile",
          browser: row.browser || "Navigateur",
          screen_size: row.screen_size,
          app_version: row.app_version || CURRENT_APP_VERSION,
          created_at: row.created_at
        });
      });
    }

    const result = Array.from(feedbacksMap.values());
    result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return result;
  } catch (err) {
    console.error("fetchAllFeedbacks exception:", err);
    return Array.from(feedbacksMap.values());
  }
}

/**
 * Delete an individual feedback item by ID
 */
export async function deleteFeedbackItem(feedbackId) {
  try {
    if (!feedbackId) return false;

    await Promise.allSettled([
      supabase.from("app_analytics").delete().eq("id", feedbackId),
      supabase.from("app_feedback").delete().eq("id", feedbackId)
    ]);

    return true;
  } catch (err) {
    console.error("deleteFeedbackItem exception:", err);
    return false;
  }
}

function saveOfflineFeedback(payload) {
  try {
    const raw = localStorage.getItem("geoprospect_offline_feedback_queue") || "[]";
    const list = JSON.parse(raw);
    list.push(payload);
    localStorage.setItem("geoprospect_offline_feedback_queue", JSON.stringify(list));
  } catch {}
}
