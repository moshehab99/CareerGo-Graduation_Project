/** localStorage keys for the Smart Recruitment demo */
export const USER_ROLE_KEY = "userRole";
export const USER_INTERESTS_KEY = "userInterests";
export const AUTH_TOKEN_KEY = "authToken";
export const AUTH_USER_KEY = "authUser";

export const ROLE_CANDIDATE = "candidate";
export const ROLE_COMPANY = "company";

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthSession(response) {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data));
    const role = response.data?.role;
    if (role === ROLE_COMPANY || role === ROLE_CANDIDATE) {
      localStorage.setItem(USER_ROLE_KEY, role);
    }
    notifyAuthChange();
  } catch {
    /* ignore */
  }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    notifyAuthChange();
  } catch {
    /* ignore */
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("careergo-auth-changed"));
  }
}

export function notifyInterestsChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("careergo-interests-changed"));
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
