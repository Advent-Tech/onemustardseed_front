/**
 * Centralized API client and URL helpers for ONE MUSTARD SEED
 */

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined" && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      const port = window.location.protocol === "https:" ? "" : ":5001";
      return `${window.location.protocol}//${host}${port}/api`;
    }
  }
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "");
  return envUrl || "http://localhost:5000/api";
}

export const API_URL = getApiBaseUrl();

export function getBackendBaseUrl(): string {
  return API_URL.replace(/\/api\/?$/, "");
}

export const BACKEND_URL = getBackendBaseUrl();

/**
 * Builds a clean full API URL from any path, preventing double `/api/api` issues
 * and cleanly rewriting legacy hosts (e.g. Vercel, localhost).
 */
export function apiUrl(path: string): string {
  if (!path) return API_URL;
  let clean = path.trim();

  // If path is already a full API URL targeting any old host (e.g. vercel, localhost)
  const apiMatch = clean.match(/^https?:\/\/[^\/]+(\/api\/.*)$/i);
  if (apiMatch) {
    return `${BACKEND_URL}${apiMatch[1]}`;
  }

  // Strip localhost / 127.0.0.1
  if (clean.includes("localhost:") || clean.includes("127.0.0.1:")) {
    clean = clean.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?/, "/");
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
 * cleanly rewriting any legacy host (Vercel, Render, Railway, localhost, old IPs) to the active backend.
 */
export function mediaUrl(path?: string | null): string {
  if (!path) return "";
  let clean = path.trim().replace(/\/api\/api\//g, "/api/");

  // If it's a data URI or blob URL, return as is
  if (clean.startsWith("data:") || clean.startsWith("blob:")) {
    return clean;
  }

  // Files bundled with the site itself (public/ or imported assets) are not on the backend
  if (/^\/(assets|media|downloads|src|@fs)\//.test(clean)) {
    return clean;
  }

  // If it points to an upload endpoint on ANY host (Vercel, localhost, old IP, etc.)
  // e.g. https://movie-backend-drab.vercel.app/api/upload/file/xyz.jpg
  // or http://localhost:5000/uploads/xyz.jpg
  const uploadMatch = clean.match(/(?:https?:\/\/[^\/]+)?(\/(?:api\/upload\/file|uploads|api\/uploads|api\/resources\/files)\/[^?#\s]+)/i);
  if (uploadMatch) {
    const relativePath = uploadMatch[1];
    return `${BACKEND_URL}${relativePath}`;
  }

  // Strip localhost/127.0.0.1 origins
  if (clean.includes("localhost:") || clean.includes("127.0.0.1:")) {
    clean = clean.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?/, "/");
  }

  // If it's an external URL (e.g. Unsplash, Vimeo, YouTube, AWS S3, etc.)
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  const cleanPath = clean.startsWith("/") ? clean : `/${clean}`;
  return `${BACKEND_URL}${cleanPath}`;
}


/**
 * Transforms any Vimeo URL (standard, unlisted with privacy hash, or embed) into a valid player embed URL.
 * Handles:
 * - https://vimeo.com/861733736/0bb606118e -> https://player.vimeo.com/video/861733736?h=0bb606118e
 * - https://vimeo.com/861733736 -> https://player.vimeo.com/video/861733736
 * - https://player.vimeo.com/video/861733736?h=...
 */
export function getVimeoEmbedUrl(url?: string | null, params: Record<string, string | number | boolean> = {}): string {
  if (!url) return "";
  const clean = url.trim();
  try {
    if (clean.includes("player.vimeo.com/video/")) {
      const urlObj = new URL(clean);
      for (const [k, v] of Object.entries(params)) {
        if (!urlObj.searchParams.has(k)) {
          urlObj.searchParams.set(k, String(v));
        }
      }
      return urlObj.toString();
    }

    const match = clean.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/)?(\d+)(?:\/([a-zA-Z0-9_-]+))?/i);
    if (match) {
      const videoId = match[3];
      const hash = match[4];
      const sp = new URLSearchParams();
      if (hash) {
        sp.set("h", hash);
      }
      for (const [k, v] of Object.entries(params)) {
        sp.set(k, String(v));
      }
      const query = sp.toString();
      return `https://player.vimeo.com/video/${videoId}${query ? `?${query}` : ""}`;
    }
  } catch (e) {
    console.error("Error parsing Vimeo URL:", e);
  }
  return clean;
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
