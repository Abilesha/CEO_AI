/**
 * api.ts
 * -------
 * Base API client for communicating with the CEO AI backend.
 * All backend HTTP calls should be made through this service.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

/** Standard shape of every API response */
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

/** HTTP method union */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Core fetch wrapper with automatic JSON handling,
 * auth token injection, and unified error response shape.
 */
async function request<T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  body?: unknown,
  headers: Record<string, string> = {},
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('access_token')

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config)
    const status = response.status

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
      return {
        data: null,
        error: errorData?.detail ?? `Request failed with status ${status}`,
        status,
      }
    }

    // 204 No Content — nothing to parse
    if (status === 204) {
      return { data: null, error: null, status }
    }

    const data: T = await response.json()
    return { data, error: null, status }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error'
    return { data: null, error: message, status: 0 }
  }
}

/* --- Convenience methods --- */

export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, 'GET', undefined, headers),

  post: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, 'POST', body, headers),

  put: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, 'PUT', body, headers),

  patch: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, 'PATCH', body, headers),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, 'DELETE', undefined, headers),
}

export default api
