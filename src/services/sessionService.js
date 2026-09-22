import { supabase } from "../supabase.js";

const USER_CODE_STORAGE_KEY = "geoprospect_user_code_v1";
const USER_DISPLAY_NAME_KEY = "geoprospect_user_display_name_v1";
const ACTIVE_SESSION_STORAGE_KEY = "geoprospect_active_session_v1";
const JOINED_SESSIONS_HISTORY_KEY = "geoprospect_joined_sessions_history_v1";
const SESSION_BLACKLIST_STORAGE_KEY = "geoprospect_session_blacklist_v1";
const USER_BANNED_SESSIONS_STORAGE_KEY = "geoprospect_user_banned_sessions_v1";
const SESSION_LOCK_STORAGE_KEY = "geoprospect_session_locked_v1";
const APPROVED_CONSULTATION_VIEWERS_KEY = "geoprospect_approved_viewers_v1";

/**
 * Normalizes any entered code format (e.g. "7k3p", "geo-7k3p", "GEO 7K3P", "8X2M9P") -> "GEO-8X2M9P"
 */
export function normalizeSessionCode(code) {
  if (!code) return "";
  let clean = String(code).trim().toUpperCase().replace(/[\s_]+/g, "-").replace(/-+/g, "-");
  if (!clean.startsWith("GEO-") && !clean.startsWith("GEO")) {
    clean = `GEO-${clean.replace(/^-+/, "")}`;
  } else if (clean.startsWith("GEO") && !clean.startsWith("GEO-")) {
    clean = `GEO-${clean.slice(3).replace(/^-+/, "")}`;
  }
  return clean.replace(/-+/g, "-");
}

/**
 * Generate a random, readable 6-character alphanumeric code (e.g. "GEO-8X2M9P")
 * Over 1.07 billion possible combinations without ambiguous chars (0, O, 1, I).
 */
export function generateRandomCode(prefix = "GEO", length = 6) {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // without ambiguous 0/O, 1/I
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
}

/**
 * Get or generate the current user's personal detector code (always prefixed with "GEO-")
 */
export function getMyUserCode() {
  try {
    let code = localStorage.getItem(USER_CODE_STORAGE_KEY);
    if (!code) {
      const legacy = localStorage.getItem("rdl_user_code_v1");
      if (legacy) {
        code = legacy.replace(/^RDL-/i, "GEO-");
        localStorage.removeItem("rdl_user_code_v1");
      }
    }
    if (code && code.toUpperCase().startsWith("RDL-")) {
      code = code.replace(/^RDL-/i, "GEO-");
    }

    // Auto-migrate previous codes (GEO-ESBD, GEO-ESBD77) to the primary detector code GEO-KE9Q88
    if (code) {
      const pureCode = code.replace(/^GEO-/i, "").trim().toUpperCase();
      if (pureCode === "ESBD" || pureCode === "ESBD77" || pureCode === "ESBD88") {
        code = "GEO-KE9Q88";
      } else if (pureCode.length < 6) {
        code = `GEO-${pureCode}88`;
      }
    }

    if (!code) {
      code = generateRandomCode("GEO", 6);
    }
    code = normalizeSessionCode(code);
    localStorage.setItem(USER_CODE_STORAGE_KEY, code);
    return code;
  } catch (e) {
    console.warn("Storage error in getMyUserCode:", e);
    return "GEO-LOCAL";
  }
}

/**
 * Reset and generate a completely fresh, random 6-character user detector code (blank map)
 */
export function resetAndGenerateNewUserCode() {
  try {
    const newCode = generateRandomCode("GEO", 6);
    localStorage.setItem(USER_CODE_STORAGE_KEY, newCode);
    return newCode;
  } catch (e) {
    return generateRandomCode("GEO", 6);
  }
}

/**
 * Get the current user's display name or nickname
 */
export function getMyDisplayName() {
  try {
    const saved = localStorage.getItem(USER_DISPLAY_NAME_KEY);
    if (saved && saved.trim()) return saved.trim();
    return "";
  } catch (e) {
    return "";
  }
}

/**
 * Save user's display name
 */
export function setMyDisplayName(name) {
  try {
    const clean = (name || "").trim();
    if (clean) {
      localStorage.setItem(USER_DISPLAY_NAME_KEY, clean);
    } else {
      localStorage.removeItem(USER_DISPLAY_NAME_KEY);
    }
    return clean;
  } catch (e) {
    console.warn("Storage error in setMyDisplayName:", e);
    return name;
  }
}

/**
 * Get the list of all team sessions the user has ever participated in
 */
export function getMyJoinedSessions() {
  try {
    const raw = localStorage.getItem(JOINED_SESSIONS_HISTORY_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch (e) {
    console.warn("Error reading joined sessions history:", e);
  }
  return [];
}

/**
 * Add or update a session in the user's permanent sessions history
 */
export function recordJoinedSession(code, name = "") {
  try {
    const cleanCode = normalizeSessionCode(code);
    if (!cleanCode) return;

    const existing = getMyJoinedSessions();
    const filtered = existing.filter((s) => normalizeSessionCode(s.code) !== cleanCode);
    const updated = [
      {
        code: cleanCode,
        name: name.trim() || `Session ${cleanCode}`,
        lastActive: new Date().toISOString()
      },
      ...filtered
    ];
    localStorage.setItem(JOINED_SESSIONS_HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Error recording joined session:", e);
  }
}

/**
 * Get active team session from storage (if any)
 */
export function getActiveSession() {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (raw) {
      const sess = JSON.parse(raw);
      if (sess && sess.code) {
        sess.code = normalizeSessionCode(sess.code);
        return sess;
      }
    }
  } catch (e) {
    console.warn("Error reading active session:", e);
  }
  return null;
}

/**
 * Save or clear active team session
 */
export function setActiveSession(session) {
  try {
    if (session && session.code) {
      session.code = normalizeSessionCode(session.code);
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(session));
      recordJoinedSession(session.code, session.name);
    } else {
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.warn("Error setting active session:", e);
  }
}

/**
 * Create a new team detection session with 6-character unique code
 */
export function createTeamSession(name = "") {
  const sessionCode = generateRandomCode("GEO", 6);
  const myCode = getMyUserCode();
  const session = {
    code: sessionCode,
    name: name.trim() || `Sortie d'équipe ${sessionCode}`,
    createdAt: new Date().toISOString(),
    creatorCode: myCode,
    creatorName: getMyDisplayName() || "Détecteuriste"
  };
  setActiveSession(session);
  return session;
}

/**
 * Check if the current user (or specified userCode) is the Host / Creator of the session
 */
export function isSessionHost(session, userCode = null) {
  if (!session || !session.creatorCode) return false;
  const myCode = normalizeSessionCode(userCode || getMyUserCode());
  return normalizeSessionCode(session.creatorCode) === myCode;
}

/**
 * Join an existing team session with a given code
 */
export function joinTeamSession(code, name = "") {
  const cleanCode = normalizeSessionCode(code);
  if (!cleanCode) return null;

  if (isLocallyBannedFromSession(cleanCode)) {
    throw new Error("Vous avez été banni de cette session par l'administrateur.");
  }

  const existing = getActiveSession();
  const creatorCode = (existing && existing.code === cleanCode) ? existing.creatorCode : null;

  const session = {
    code: cleanCode,
    name: name.trim() || `Session ${cleanCode}`,
    joinedAt: new Date().toISOString(),
    userCode: getMyUserCode(),
    userName: getMyDisplayName() || "Détecteuriste",
    creatorCode: creatorCode
  };
  setActiveSession(session);
  return session;
}

/**
 * Leave the current team session
 */
export function leaveTeamSession() {
  setActiveSession(null);
}

/* =========================================================================
   HOST MODERATION & BLACKLIST SYSTEM
   ========================================================================= */

/**
 * Get the blacklist of banned user codes for a given sessionCode
 */
export function getSessionBlacklist(sessionCode) {
  try {
    const clean = normalizeSessionCode(sessionCode);
    if (!clean) return [];
    const raw = localStorage.getItem(SESSION_BLACKLIST_STORAGE_KEY);
    if (raw) {
      const map = JSON.parse(raw);
      if (map && Array.isArray(map[clean])) {
        return map[clean];
      }
    }
  } catch (e) {
    console.warn("Error reading session blacklist:", e);
  }
  return [];
}

/**
 * Add a user to the blacklist for a specific session
 */
export function banUserFromSession(sessionCode, targetUserCode, targetUserName = "") {
  try {
    const cleanSess = normalizeSessionCode(sessionCode);
    const cleanUser = normalizeSessionCode(targetUserCode);
    if (!cleanSess || !cleanUser) return;

    const raw = localStorage.getItem(SESSION_BLACKLIST_STORAGE_KEY);
    let map = raw ? JSON.parse(raw) : {};
    if (!map || typeof map !== "object") map = {};

    const list = Array.isArray(map[cleanSess]) ? map[cleanSess] : [];
    if (!list.some((item) => (typeof item === "string" ? item === cleanUser : item.userCode === cleanUser))) {
      list.push({
        userCode: cleanUser,
        userName: targetUserName || cleanUser,
        bannedAt: new Date().toISOString()
      });
      map[cleanSess] = list;
      localStorage.setItem(SESSION_BLACKLIST_STORAGE_KEY, JSON.stringify(map));
    }
    return list;
  } catch (e) {
    console.warn("Error banning user from session:", e);
  }
}

/**
 * Unban / remove a user from the blacklist for a specific session
 */
export function unbanUserFromSession(sessionCode, targetUserCode) {
  try {
    const cleanSess = normalizeSessionCode(sessionCode);
    const cleanUser = normalizeSessionCode(targetUserCode);
    if (!cleanSess || !cleanUser) return;

    const raw = localStorage.getItem(SESSION_BLACKLIST_STORAGE_KEY);
    let map = raw ? JSON.parse(raw) : {};
    if (!map || typeof map !== "object") return [];

    let list = Array.isArray(map[cleanSess]) ? map[cleanSess] : [];
    list = list.filter((item) => (typeof item === "string" ? item !== cleanUser : item.userCode !== cleanUser));
    map[cleanSess] = list;
    localStorage.setItem(SESSION_BLACKLIST_STORAGE_KEY, JSON.stringify(map));
    return list;
  } catch (e) {
    console.warn("Error unbanning user from session:", e);
    return [];
  }
}

/**
 * Check if a user is banned from a session
 */
export function isUserBannedFromSession(sessionCode, targetUserCode) {
  const list = getSessionBlacklist(sessionCode);
  const cleanUser = normalizeSessionCode(targetUserCode);
  return list.some((item) => (typeof item === "string" ? item === cleanUser : item.userCode === cleanUser));
}

/**
 * Record that current user has been banned from a session
 */
export function recordLocallyBannedSession(sessionCode) {
  try {
    const clean = normalizeSessionCode(sessionCode);
    if (!clean) return;
    const raw = localStorage.getItem(USER_BANNED_SESSIONS_STORAGE_KEY);
    let list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
    if (!list.includes(clean)) {
      list.push(clean);
      localStorage.setItem(USER_BANNED_SESSIONS_STORAGE_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.warn("Error recording locally banned session:", e);
  }
}

/**
 * Check if current user is locally banned from a session
 */
export function isLocallyBannedFromSession(sessionCode) {
  try {
    const clean = normalizeSessionCode(sessionCode);
    if (!clean) return false;
    const raw = localStorage.getItem(USER_BANNED_SESSIONS_STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.includes(clean)) return true;
    }
  } catch (e) {
    console.warn("Error reading locally banned sessions:", e);
  }
  return false;
}

/**
 * Set lock status of a session (Host only)
 */
export function setSessionLockedState(sessionCode, isLocked) {
  try {
    const clean = normalizeSessionCode(sessionCode);
    if (!clean) return;
    const raw = localStorage.getItem(SESSION_LOCK_STORAGE_KEY);
    let map = raw ? JSON.parse(raw) : {};
    if (!map || typeof map !== "object") map = {};
    map[clean] = !!isLocked;
    localStorage.setItem(SESSION_LOCK_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.warn("Error setting session lock state:", e);
  }
}

/**
 * Get lock status of a session
 */
export function isSessionLockedState(sessionCode) {
  try {
    const clean = normalizeSessionCode(sessionCode);
    if (!clean) return false;
    const raw = localStorage.getItem(SESSION_LOCK_STORAGE_KEY);
    if (raw) {
      const map = JSON.parse(raw);
      if (map && typeof map === "object") {
        return !!map[clean];
      }
    }
  } catch (e) {
    console.warn("Error reading session lock state:", e);
  }
  return false;
}

/* =========================================================================
   ON-DEMAND MAP CONSULTATION APPROVAL SYSTEM
   ========================================================================= */

/**
 * Get list of currently approved viewers who can consult my map
 */
export function getApprovedConsultationViewers() {
  try {
    const raw = localStorage.getItem(APPROVED_CONSULTATION_VIEWERS_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch (e) {
    console.warn("Error reading approved viewers:", e);
  }
  return [];
}

/**
 * Add a user to approved consultation viewers
 */
export function addApprovedConsultationViewer(userCode, userName = "") {
  try {
    const clean = normalizeSessionCode(userCode);
    if (!clean) return;
    const list = getApprovedConsultationViewers();
    const filtered = list.filter((v) => normalizeSessionCode(v.userCode) !== clean);
    const updated = [
      {
        userCode: clean,
        userName: userName || clean,
        approvedAt: new Date().toISOString()
      },
      ...filtered
    ];
    localStorage.setItem(APPROVED_CONSULTATION_VIEWERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Error adding approved viewer:", e);
  }
}

/**
 * Remove / Revoke a viewer from approved consultation list
 */
export function removeApprovedConsultationViewer(userCode) {
  try {
    const clean = normalizeSessionCode(userCode);
    if (!clean) return [];
    const list = getApprovedConsultationViewers();
    const updated = list.filter((v) => normalizeSessionCode(v.userCode) !== clean);
    localStorage.setItem(APPROVED_CONSULTATION_VIEWERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Error removing approved viewer:", e);
    return [];
  }
}
