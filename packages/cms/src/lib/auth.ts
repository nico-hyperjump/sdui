const TOKEN_KEY = "cms_jwt";

/**
 * Returns the stored JWT token for CMS auth, or null if none.
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

/**
 * Stores the JWT token in localStorage for CMS auth.
 * @param token - The JWT string to store
 */
export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Removes the stored JWT token from localStorage.
 */
export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}
