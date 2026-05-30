/** localStorage keys for the Smart Recruitment demo */
export const USER_ROLE_KEY = "userRole";
export const USER_INTERESTS_KEY = "userInterests";

export const ROLE_CANDIDATE = "candidate";
export const ROLE_COMPANY = "company";

export function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("wuzzuf-auth-changed"));
  }
}

export function notifyInterestsChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("wuzzuf-interests-changed"));
  }
}

export function getUserRole() {
  try {
    const v = localStorage.getItem(USER_ROLE_KEY);
    if (v === ROLE_COMPANY || v === ROLE_CANDIDATE) return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function setUserRole(role) {
  try {
    localStorage.setItem(USER_ROLE_KEY, role);
    notifyAuthChange();
  } catch {
    /* ignore */
  }
}

export function clearUserRole() {
  try {
    localStorage.removeItem(USER_ROLE_KEY);
    notifyAuthChange();
  } catch {
    /* ignore */
  }
}

/** Parsed career interests from /career-interests (same shape as CareerInterests.jsx payload). */
export function getUserInterests() {
  try {
    const raw = localStorage.getItem(USER_INTERESTS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}
