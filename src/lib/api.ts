/**
 * Centralized API client and URL helpers for ONE MUSTARD SEED
 */

// Normalized API base URL (e.g. http://localhost:5000/api or https://api.yourdomain.com/api)
const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:5000/api";
export const API_URL = rawApiUrl.replace(/\/+$/, "");

// Backend base URL for static assets (e.g. http://localhost:5000)
export const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

/**
 * Builds a clean full API URL from any path, preventing double `/api/api` issues.
 * Examples:
 *   apiUrl('/films') -> 'http://localhost:5000/api/films'
 *   apiUrl('/api/films') -> 'http://localhost:5000/api/films'
 *   apiUrl('films') -> 'http://localhost:5000/api/films'
 */
export function apiUrl(path: string): string {
  if (!path) return API_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath.startsWith("/api/")) {
    return `${BACKEND_URL}${cleanPath}`;
  }
  return `${API_URL}${cleanPath}`;
}

/**
 * Resolves static media/asset URLs (e.g. /uploads/... or external URLs)
 */
export function mediaUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_URL}${cleanPath}`;
}

/**
 * Gets current auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user_token");
}

/**
 * Core API request wrapper
 */
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<{ ok: boolean; status: number; data: T }> {
  const url = apiUrl(path);
  const headers = new Headers(options.headers || {});

  const token = options.token || getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Set Content-Type only if body is not FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data: any;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export const api = {
  get: <T = any>(path: string, options?: RequestInit) =>
    apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T = any>(path: string, body?: any, options?: RequestInit) =>
    apiFetch<T>(path, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T = any>(path: string, body?: any, options?: RequestInit) =>
    apiFetch<T>(path, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T = any>(path: string, options?: RequestInit) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};
