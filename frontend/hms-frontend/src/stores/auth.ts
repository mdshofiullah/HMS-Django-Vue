import { defineStore } from 'pinia'
import api from '@/services/api'
import router from '@/router'

export interface User {
  id?: number
  username?: string
  email?: string
  first_name?: string
  last_name?: string
  role?: string
  [k: string]: unknown
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: (localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null) as User | null,
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    isAuthenticated: !!localStorage.getItem('access_token'),
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    // sync store with localStorage (call on app start)
    checkAuthStatus() {
      const access = localStorage.getItem('access_token')
      const savedUser = localStorage.getItem('user')
      this.accessToken = access
      this.refreshToken = localStorage.getItem('refresh_token')
      this.user = savedUser ? JSON.parse(savedUser) : null
      this.isAuthenticated = !!access
      if (access) {
        ;(api.defaults.headers as unknown as Record<string, string>).Authorization =
          `Bearer ${access}`
      }
    },

    // login tries common token endpoint then falls back to legacy endpoints
    async login(credentials: { username: string; password: string }) {
      this.isLoading = true
      this.error = null
      try {
        // primary: SimpleJWT token endpoint
        let resp = null
        try {
          resp = await api.post('/token/', credentials)
        } catch (e) {
          // fallback: custom auth endpoint
          resp = await api.post('/auth/login/', credentials)
        }

        // normalize response
        const access = resp.data?.access ?? resp.data?.token ?? resp.data?.access_token
        const refresh = resp.data?.refresh ?? resp.data?.refresh_token
        const user = resp.data?.user ?? resp.data

        if (!access) throw new Error('No access token received')

        this.accessToken = access
        this.refreshToken = refresh ?? null
        this.user = user && typeof user === 'object' ? user : null
        this.isAuthenticated = true

        localStorage.setItem('access_token', access)
        if (refresh) localStorage.setItem('refresh_token', refresh)
        if (this.user) localStorage.setItem('user', JSON.stringify(this.user))
        ;(api.defaults.headers as unknown as Record<string, string>).Authorization =
          `Bearer ${access}`

        // redirect based on role
        if (this.user?.role === 'admin') {
          router.push({ name: 'admin-dashboard' })
        } else if (this.user?.role === 'doctor') {
          router.push({ name: 'doctor-dashboard' })
        } else if (this.user?.role === 'patient') {
          router.push({ name: 'patient-dashboard' })
        } else {
          router.push({ name: 'dashboard' })
        }

        return { success: true }
      } catch (err: any) {
        this.error = err?.response?.data?.detail ?? err?.message ?? 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // register tries common endpoints and preserves errors from server
    async register(userData: Record<string, unknown>) {
      this.isLoading = true
      this.error = null
      try {
        let resp = null
        try {
          resp = await api.post('/register/', userData)
        } catch (e) {
          resp = await api.post('/auth/register/', userData)
        }

        // typical 201 or 200 accepted
        if (resp.status === 201 || resp.status === 200) {
          return { success: true, data: resp.data }
        }
        this.error = 'Registration failed'
        return { success: false, error: this.error }
      } catch (err: any) {
        // try to extract server messages
        const data = err?.response?.data
        if (data && typeof data === 'object') {
          // join field errors
          const msgs = Object.values(data)
            .map((v: any) => (Array.isArray(v) ? v.join(' ') : String(v)))
            .filter(Boolean)
            .join(' — ')
          this.error = msgs || 'Registration failed'
        } else {
          this.error = err?.message ?? 'Registration failed'
        }
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.isLoading = true
      try {
        // call backend logout if exists (ignore failure)
        await api.post('/auth/logout/').catch(() => {})
      } finally {
        this.accessToken = null
        this.refreshToken = null
        this.user = null
        this.isAuthenticated = false
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        ;(api.defaults.headers as unknown as Record<string, string>).Authorization = ''
        router.push({ name: 'login' })
        this.isLoading = false
      }
    },
  },
})
