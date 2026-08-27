/**
 * Centralized API client and URL helpers for ONE MUSTARD SEED
 */

export function getApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "");
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }
  if (typeof window !== "undefined" && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:5001/api`;
    }
  }
  return envUrl || "http://localhost:5000/api";
}

export const API_URL = getApiBaseUrl();

export function getBackendBaseUrl(): string {
  return API_URL.replace(/\/api\/?$/, "");
}

export const BACKEND_URL = getBackendBaseUrl();

/**
 * Builds a clean full API URL from any path, preventing double `/api/api` issues.
 */
export function apiUrl(path: string): string {
  if (!path) return API_URL;
  let clean = path;
  if (clean.includes("localhost:5000") || clean.includes("127.0.0.1:5000") || clean.includes("localhost:5001") || clean.includes("127.0.0.1:5001")) {
    clean = clean.replace(/^https?:\/\/(localhost|127\.0\.0\.1):(5000|5001)\/?/, "/");
  }
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }
  const cleanPath = clean.startsWith("/") ? clean : `/${clean}`;
  if (cleanPath.startsWith("/api/")) {
    return `${BACKEND_URL}${cleanPath}`;
  }
  return `${API_URL}${cleanPath}`;
}

/**
 * Resolves static media/asset URLs (e.g. /uploads/... or external URLs),
 * cleanly rewriting any legacy localhost/127.0.0.1 references to the active backend.
 */
export function mediaUrl(path?: string | null): string {
  if (!path) return "";
  let clean = path;
  if (clean.includes("localhost:5000") || clean.includes("127.0.0.1:5000") || clean.includes("localhost:5001") || clean.includes("127.0.0.1:5001")) {
    clean = clean.replace(/^https?:\/\/(localhost|127\.0\.0\.1):(5000|5001)\/?/, "/");
  }
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("data:")) {
    return clean;
  }
  const cleanPath = clean.startsWith("/") ? clean : `/${clean}`;
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
