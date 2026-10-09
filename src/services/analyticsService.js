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
      const host = parsed.hostname.replace("www.", "");
      if (host.includes("vercel.app") || host.includes("localhost") || (typeof window !== "undefined" && host === window.location.hostname)) {
        return "Accès Direct / PWA";
      }
      return host;
    } catch {
      return "Accès Direct / PWA";
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
    uniqueVisitorsToday: 0,
    uniqueVisitorsWeek: 0,
    todayVisits: 0,
    weekVisits: 0,
    sources: {},
    devices: {},
    browsers: {},
    recentVisits: [],
    totalFinds: 0,
    totalTracks: 0,
    uniqueFinders: 0,
    devFinds: 0,
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
      // Exclude feedback and track records from visits report
      const visitData = analyticsData.filter(
        (r) => r.event_type === "visit" || (!r.event_type && !r.source?.startsWith("[feedback]") && !r.source?.startsWith("[track]"))
      );

      result.totalVisits = visitData.length;
      result.recentVisits = visitData.slice(0, 50);

      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const uniqueUsersSet = new Set();
      const uniqueTodayUsersSet = new Set();
      const uniqueWeekUsersSet = new Set();

      visitData.forEach((row) => {
        const uCode = row.user_code;
        if (uCode) uniqueUsersSet.add(uCode);

        const rowDateStr = (row.created_at || "").slice(0, 10);
        if (rowDateStr === todayStr) {
          result.todayVisits++;
          if (uCode) uniqueTodayUsersSet.add(uCode);
        }
        if (new Date(row.created_at) >= sevenDaysAgo) {
          result.weekVisits++;
          if (uCode) uniqueWeekUsersSet.add(uCode);
        }

        let src = row.source || "Accès Direct / PWA";
        if (src.includes("vercel.app") || src.includes("localhost") || src === "Direct") {
          src = "Accès Direct / PWA";
        }
        result.sources[src] = (result.sources[src] || 0) + 1;

        const dev = row.device || "Autre";
        result.devices[dev] = (result.devices[dev] || 0) + 1;

        const brw = row.browser || "Autre";
        result.browsers[brw] = (result.browsers[brw] || 0) + 1;
      });

      result.uniqueVisitors = uniqueUsersSet.size;
      result.uniqueVisitorsToday = uniqueTodayUsersSet.size;
      result.uniqueVisitorsWeek = uniqueWeekUsersSet.size;

      // Unique user counts per source
      const userSourcesMap = {};
      visitData.forEach((row) => {
        if (!row.user_code) return;
        if (!userSourcesMap[row.user_code]) userSourcesMap[row.user_code] = new Set();
        let src = row.source || "Accès Direct / PWA";
        if (src.includes("vercel.app") || src === "Direct") src = "Accès Direct / PWA";
        userSourcesMap[row.user_code].add(src);
      });

      let uFb = 0;
      let uDirect = 0;
      Object.values(userSourcesMap).forEach((srcSet) => {
        if (srcSet.has("Facebook")) uFb++;
        if (srcSet.has("Accès Direct / PWA")) uDirect++;
      });
      result.uniqueFacebookUsers = uFb;
      result.uniqueDirectPWAUsers = uDirect;

      // 3. Count GPS tracks / sorties from app_analytics
      const trackEvents = analyticsData.filter(
        (r) => r.event_type === "track" || r.event_type === "sortie" || (r.source && r.source.startsWith("[track"))
      );
      result.totalTracks = trackEvents.length;
    }

    // 2. Fetch finds stats from database (strictly excluding creator test finds)
    try {
      const devCodes = new Set([
        "GEO-KE9Q88",
        "GEO-5BCQE7",
        "GEO-LOCAL",
        normalizeSessionCode(getMyUserCode())
      ]);

      const { data: allFinds } = await supabase.from("finds").select("id, description");
      if (allFinds) {
        let communityFindsCount = 0;
        const communityFinders = new Set();
        let devFindsCount = 0;

        allFinds.forEach((f) => {
          const desc = f.description || "";
          const match = desc.match(/<!--GP_META:([\s\S]*?)-->/);
          let userCode = "";
          if (match) {
            try {
              const meta = JSON.parse(match[1]);
              if (meta.u) userCode = normalizeSessionCode(meta.u);
            } catch {}
          }

          if (userCode && devCodes.has(userCode)) {
            devFindsCount++;
          } else {
            communityFindsCount++;
            if (userCode) communityFinders.add(userCode);
          }
        });

        result.totalFinds = communityFindsCount;
        result.uniqueFinders = communityFinders.size;
        result.devFinds = devFindsCount;
      }
    } catch {}

  } catch (e) {
    console.warn("Analytics fetch error:", e);
  }

  return result;
}
