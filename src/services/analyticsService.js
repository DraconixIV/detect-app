import { supabase } from "../supabase.js";
import { getMyUserCode, normalizeSessionCode } from "./sessionService.js";
import { detectInAppBrowser } from "../components/InAppBrowserBanner.jsx";

const ANALYTICS_SESSION_KEY = "geoprospect_analytics_session_v1";

function getDeviceType() {
  if (typeof window === "undefined" || !window.navigator) return "Inconnu";
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return "iPhone / iPad";
  if (/Android/i.test(ua)) return "Android";
  if (/Windows/i.test(ua)) return "Windows PC";
  if (/Macintosh|Mac OS X/i.test(ua)) return "Mac";
  if (/Linux/i.test(ua)) return "Linux";
  return "Mobile / Autre";
}

function getBrowserName() {
  if (typeof window === "undefined" || !window.navigator) return "Inconnu";
  const inApp = detectInAppBrowser();
  if (inApp.isInApp) return `${inApp.appName} In-App`;

  const ua = navigator.userAgent || "";
  if (/Edg/i.test(ua)) return "Edge";
  if (/Chrome|CriOS/i.test(ua)) return "Chrome";
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/Firefox|FxiOS/i.test(ua)) return "Firefox";
  return "Autre navigateur";
}

function getTrafficSource() {
  if (typeof window === "undefined") return "Direct";
  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get("ref") || urlParams.get("source") || urlParams.get("utm_source");
  if (refParam) {
    if (/facebook|fb/i.test(refParam)) return "Facebook";
    if (/instagram|insta/i.test(refParam)) return "Instagram";
    if (/tiktok/i.test(refParam)) return "TikTok";
    return refParam;
  }

  const inApp = detectInAppBrowser();
  if (inApp.isInApp) return inApp.appName || "Réseau Social";

  const referrer = document.referrer || "";
  if (/facebook\.com|fb\.me/i.test(referrer)) return "Facebook";
  if (/instagram\.com/i.test(referrer)) return "Instagram";
  if (/tiktok\.com/i.test(referrer)) return "TikTok";
  if (/t\.co|twitter\.com|x\.com/i.test(referrer)) return "X (Twitter)";
  if (/google\./i.test(referrer)) return "Google";
  if (/youtube\.com|youtu\.be/i.test(referrer)) return "YouTube";
  if (referrer) {
    try {
      const parsed = new URL(referrer);
      return parsed.hostname.replace("www.", "");
    } catch {
      return "Web Référent";
    }
  }

  return "Accès Direct / PWA";
}

export const DEV_DEVICE_STORAGE_KEY = "geoprospect_is_developer_device_v1";

export function isDeveloperDevice() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(DEV_DEVICE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setDeveloperDevice(enabled = true) {
  if (typeof window === "undefined") return;
  try {
    if (enabled) {
      localStorage.setItem(DEV_DEVICE_STORAGE_KEY, "true");
    } else {
      localStorage.removeItem(DEV_DEVICE_STORAGE_KEY);
    }
  } catch {}
}

/**
 * Purge / Reset all visits and analytics records from Supabase
 */
export async function purgeAnalyticsData() {
  try {
    // Delete all records from app_analytics table
    const { error } = await supabase
      .from("app_analytics")
      .delete()
      .neq("created_at", "1970-01-01T00:00:00Z");

    if (error) {
      console.warn("Purge error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Purge exception:", err);
    return false;
  }
}

/**
 * Delete an individual visit record by its ID or created_at timestamp
 */
export async function deleteAnalyticsVisit(visitId) {
  try {
    if (!visitId) return false;
    const { error } = await supabase
      .from("app_analytics")
      .delete()
      .eq("id", visitId);

    if (error) {
      console.warn("Delete visit error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Delete visit exception:", err);
    return false;
  }
}

/**
 * Tracks an anonymous page view / visit. Throttled to 1 call per 30 minutes per browser session.
 * Excludes developer devices automatically.
 */
export async function trackVisitEvent() {
  try {
    // 1. Immediately ignore developer's own devices (PC, smartphone)
    if (isDeveloperDevice()) {
      return;
    }

    const lastTrackTime = sessionStorage.getItem(ANALYTICS_SESSION_KEY);
    const now = Date.now();
    if (lastTrackTime && now - parseInt(lastTrackTime, 10) < 30 * 60 * 1000) {
      // Already tracked in this 30-min window
      return;
    }

    sessionStorage.setItem(ANALYTICS_SESSION_KEY, String(now));

    const myCode = normalizeSessionCode(getMyUserCode()) || "ANON";
    const source = getTrafficSource();
    const device = getDeviceType();
    const browser = getBrowserName();
    const screenSize = `${window.screen?.width || 0}x${window.screen?.height || 0}`;

    const payload = {
      event_type: "visit",
      user_code: myCode,
      source: source,
      device: device,
      browser: browser,
      screen_size: screenSize,
      created_at: new Date().toISOString()
    };

    // Attempt insert into Supabase analytics table
    await supabase.from("app_analytics").insert([payload]);
  } catch (err) {
    // Non-blocking telemetry
    console.debug("Telemetry notice:", err);
  }
}

/**
 * Fetch analytics data for Developer Admin Console
 */
export async function fetchAnalyticsReport() {
  const result = {
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    weekVisits: 0,
    sources: {},
    devices: {},
    browsers: {},
    recentVisits: [],
    totalFinds: 0,
    totalTracks: 0,
    uniqueFinders: 0,
    tableReady: true
  };

  try {
    // 1. Fetch from app_analytics
    const { data: analyticsData, error: analyticsErr } = await supabase
      .from("app_analytics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2000);

    if (analyticsErr) {
      result.tableReady = false;
    } else if (analyticsData && analyticsData.length > 0) {
      result.totalVisits = analyticsData.length;
      result.recentVisits = analyticsData.slice(0, 50);

      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const uniqueUsersSet = new Set();

      analyticsData.forEach((row) => {
        if (row.user_code) uniqueUsersSet.add(row.user_code);

        const rowDateStr = (row.created_at || "").slice(0, 10);
        if (rowDateStr === todayStr) {
          result.todayVisits++;
        }
        if (new Date(row.created_at) >= sevenDaysAgo) {
          result.weekVisits++;
        }

        const src = row.source || "Direct";
        result.sources[src] = (result.sources[src] || 0) + 1;

        const dev = row.device || "Autre";
        result.devices[dev] = (result.devices[dev] || 0) + 1;

        const brw = row.browser || "Autre";
        result.browsers[brw] = (result.browsers[brw] || 0) + 1;
      });

      result.uniqueVisitors = uniqueUsersSet.size;
    }

    // 2. Fetch finds stats
    try {
      const { data: allFinds } = await supabase.from("finds").select("id, created_at, description");
      if (allFinds) {
        result.totalFinds = allFinds.length;
        const finders = new Set();
        allFinds.forEach((f) => {
          if (f.description && f.description.includes("user_code")) {
            try {
              const parsed = JSON.parse(f.description);
              if (parsed.user_code) finders.add(parsed.user_code);
            } catch {}
          }
        });
        result.uniqueFinders = finders.size;
      }
    } catch {}

    // 3. Fetch tracks stats
    try {
      const { data: allTracks } = await supabase.from("gps_tracks").select("id, created_at, session_name");
      if (allTracks) {
        result.totalTracks = allTracks.length;
      }
    } catch {}

  } catch (e) {
    console.warn("Analytics fetch error:", e);
  }

  return result;
}
