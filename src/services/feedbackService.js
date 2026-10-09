import { supabase } from "../supabase.js";
import { getMyUserCode, normalizeSessionCode } from "./sessionService.js";
import { detectInAppBrowser } from "../components/InAppBrowserBanner.jsx";

export const CURRENT_APP_VERSION = "1.4.0";
export const LAST_SEEN_VERSION_KEY = "geoprospect_last_seen_app_version";

/**
 * Checks if the user has an unread app update notification
 */
export function checkHasUnreadUpdate() {
  if (typeof window === "undefined") return false;
  try {
    const lastSeen = localStorage.getItem(LAST_SEEN_VERSION_KEY);
    return lastSeen !== CURRENT_APP_VERSION;
  } catch {
    return false;
  }
}

/**
 * Marks the current app update as seen / acknowledged
 */
export function markUpdateAsSeen() {
  if (typeof window === "undefined") return;
  try {
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
