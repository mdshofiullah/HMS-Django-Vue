/// <reference types="vite/client" />

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL =
  (import.meta as unknown as { env?: { VITE_API_BASE?: string } }).env?.VITE_API_BASE ||
  'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach access token if present
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig = {} as InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    // debug
    console.debug('[api] request', config.method, config.url, 'hasToken=', !!token)
    if (token) {
      config.headers = config.headers ?? {}
      ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
    }
    return config
  },
)

// Try refresh on 401 once per request
api.interceptors.response.use(
  (res) => res,
  async (err: unknown) => {
    const error = err as AxiosError & { config?: InternalAxiosRequestConfig & { _retry?: boolean } }
    const originalRequest = error.config

    console.error('[api] response error', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      data: error.response?.data,
    })

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        if (!refresh) throw error
        const resp = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh })
        const access = (resp.data as { access?: string }).access
        if (!access) throw error
        localStorage.setItem('access_token', access)
        ;(api.defaults.headers as unknown as Record<string, string>).Authorization =
          `Bearer ${access}`
        if (originalRequest.headers)
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshErr) {
        console.warn('[api] refresh failed', refreshErr)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        throw error
      }
    }

    throw error
  },
)

export default api
