/// <reference types="vite/client" />

import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE || '/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// attach token from localStorage on each request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig = {} as InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers = config.headers ?? {}
      ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
    }
    return config
  },
)

// simple refresh-on-401 once per request
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: unknown) => {
    const error = err as AxiosError
    const original =
      (error.config as InternalAxiosRequestConfig & { _retry?: boolean }) || undefined

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (!refresh) return Promise.reject(error)

      try {
        // use plain axios to avoid interceptor recursion
        const resp = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh })
        const access = (resp.data as Record<string, unknown>)?.access as string | undefined
        if (!access) return Promise.reject(error)

        localStorage.setItem('access_token', access)
        ;(api.defaults.headers as Record<string, string | undefined>).Authorization =
          `Bearer ${access}`
        if (original.headers)
          (original.headers as Record<string, string | undefined>).Authorization =
            `Bearer ${access}`
        return api(original)
      } catch (refreshErr) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default api
