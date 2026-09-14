import { supabase } from "../supabase";

const USER_CODE_STORAGE_KEY = "rdl_user_code_v1";
const USER_DISPLAY_NAME_KEY = "rdl_user_display_name_v1";
const ACTIVE_SESSION_STORAGE_KEY = "rdl_active_session_v1";

/**
 * Generate a random, readable 6-character alphanumeric code (e.g. "RDL-7K3P")
 */
export function generateRandomCode(prefix = "RDL") {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // without ambiguous 0/O, 1/I
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
}

/**
 * Get or generate the current user's personal detector code
 */
export function getMyUserCode() {
  try {
    let code = localStorage.getItem(USER_CODE_STORAGE_KEY);
    if (!code) {
      code = generateRandomCode("RDL");
      localStorage.setItem(USER_CODE_STORAGE_KEY, code);
    }
    return code;
  } catch (e) {
    console.warn("Storage error in getMyUserCode:", e);
    return "RDL-LOCAL";
  }
}

/**
 * Get the current user's display name or nickname
 */
export function getMyDisplayName() {
  try {
    const saved = localStorage.getItem(USER_DISPLAY_NAME_KEY);
    if (saved && saved.trim()) return saved.trim();
    return "Détectoriste";
  } catch (e) {
    return "Détectoriste";
  }
}

/**
 * Save user's display name
 */
export function setMyDisplayName(name) {
  try {
    const clean = (name || "").trim() || "Détectoriste";
    localStorage.setItem(USER_DISPLAY_NAME_KEY, clean);
    return clean;
  } catch (e) {
    console.warn("Storage error in setMyDisplayName:", e);
    return name;
  }
}

/**
 * Get active team session from storage (if any)
 */
export function getActiveSession() {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
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
    if (session) {
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.warn("Error setting active session:", e);
  }
}

/**
 * Create a new team detection session
 */
export function createTeamSession(name = "") {
  const sessionCode = generateRandomCode("TEAM");
  const session = {
    code: sessionCode,
    name: name.trim() || `Sortie d'équipe ${sessionCode}`,
    createdAt: new Date().toISOString(),
    creatorCode: getMyUserCode(),
    creatorName: getMyDisplayName()
  };
  setActiveSession(session);
  return session;
}

/**
 * Join an existing team session with a given code
 */
export function joinTeamSession(code, name = "") {
  const cleanCode = (code || "").trim().toUpperCase();
  if (!cleanCode) return null;

  const session = {
    code: cleanCode,
    name: name.trim() || `Session ${cleanCode}`,
    joinedAt: new Date().toISOString(),
    userCode: getMyUserCode(),
    userName: getMyDisplayName()
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
