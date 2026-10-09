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
 * Submit user feedback to Supabase table app_feedback
 */
export async function submitUserFeedback({ category, message, contact = "" }) {
  try {
    if (!message || !message.trim()) {
      throw new Error("Veuillez saisir un message.");
    }

    const { device, browser, screen } = getDeviceInfo();
    const userCode = normalizeSessionCode(getMyUserCode()) || "ANON";

    const payload = {
      user_code: userCode,
      category: category || "suggestion",
      message: message.trim(),
      contact: (contact || "").trim().slice(0, 150),
      device: device,
      browser: browser,
      screen_size: screen,
      app_version: CURRENT_APP_VERSION,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("app_feedback")
      .insert([payload])
      .select();

    if (error) {
      console.warn("Supabase feedback insert error:", error);
      // Fallback: save locally in localStorage queue if network/table error
      saveOfflineFeedback(payload);
      return { success: true, fallback: true };
    }

    return { success: true, data };
  } catch (err) {
    console.error("submitUserFeedback exception:", err);
    throw err;
  }
}

/**
 * Fetch all user feedback for Developer Admin Console
 */
export async function fetchAllFeedbacks() {
  try {
    const { data, error } = await supabase
      .from("app_feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.warn("Error fetching feedbacks:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("fetchAllFeedbacks exception:", err);
    return [];
  }
}

/**
 * Delete an individual feedback item by ID
 */
export async function deleteFeedbackItem(feedbackId) {
  try {
    if (!feedbackId) return false;
    const { error } = await supabase
      .from("app_feedback")
      .delete()
      .eq("id", feedbackId);

    if (error) {
      console.warn("Error deleting feedback:", error);
      return false;
    }
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
