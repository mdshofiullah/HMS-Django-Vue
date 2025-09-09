import { ref, readonly } from 'vue'
import api from '@/services/api'
import type { AxiosResponse } from 'axios'

export interface User {
  id?: number
  username?: string
  email?: string
  first_name?: string
  last_name?: string
  role?: 'admin' | 'doctor' | 'patient' | 'staff' | string
  [k: string]: unknown
}

export interface Patient {
  id: number
  full_name?: string
  age?: number
  phone?: string
  [k: string]: unknown
}

export interface Doctor {
  id: number
  name?: string
  specialty?: string
  status?: string
  [k: string]: unknown
}

export interface Appointment {
  id: number
  patient_name?: string
  doctor_name?: string
  scheduled_at?: string
  status?: string
  [k: string]: unknown
}

export interface LabTest {
  id: number
  patient_name?: string
  test_name?: string
  status?: string
  [k: string]: unknown
}

export interface Bill {
  id: number
  patient_name?: string
  total?: number
  status?: string
  [k: string]: unknown
}

export interface Stats {
  [k: string]: number | string
}

const currentUser = ref<User | null>(
  localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
)
const isAuthenticated = ref<boolean>(!!localStorage.getItem('access_token'))
const loading = ref(false)
const authError = ref<string | null>(null)

export async function initAuth(): Promise<void> {
  const access = localStorage.getItem('access_token')
  if (!access) {
    isAuthenticated.value = false
    currentUser.value = null
    return
  }
  ;(api.defaults.headers as Record<string, string | undefined>).Authorization = `Bearer ${access}`
  try {
    const resp: AxiosResponse<User> = await api.get('/profile/')
    currentUser.value = resp.data
    isAuthenticated.value = true
    localStorage.setItem('user', JSON.stringify(resp.data))
  } catch {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    isAuthenticated.value = false
    currentUser.value = null
  }
}

export function useAuth() {
  async function login(username: string, password: string) {
    loading.value = true
    authError.value = null
    try {
      const resp = await api.post('/token/', { username, password })
      const data = resp.data as Record<string, unknown>
      const access = (data.access ?? data.token) as string | undefined
      const refresh = data.refresh as string | undefined
      if (!access) throw new Error('No access token returned')

      localStorage.setItem('access_token', access)
      if (refresh) localStorage.setItem('refresh_token', refresh)
      ;(api.defaults.headers as Record<string, string | undefined>).Authorization =
        `Bearer ${access}`

      const profileResp = await api.get<User>('/profile/')
      currentUser.value = profileResp.data
      localStorage.setItem('user', JSON.stringify(profileResp.data))
      isAuthenticated.value = true
      return { success: true }
    } catch (err) {
      const e = err as unknown as { response?: { data?: unknown }; message?: string }
      authError.value = (e.response?.data as any)?.detail ?? e.message ?? 'Login failed'
      return { success: false, error: authError.value }
    } finally {
      loading.value = false
    }
  }

  async function register(payload: Record<string, unknown>) {
    loading.value = true
    authError.value = null
    try {
      const resp = await api.post('/register/', payload)
      return { success: true, data: resp.data as unknown }
    } catch (err) {
      const e = err as unknown as { response?: { data?: unknown }; message?: string }
      authError.value = (e.response?.data as any) ?? e.message ?? 'Registration failed'
      return { success: false, error: authError.value }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await api.post('/auth/logout/').catch(() => {})
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      currentUser.value = null
      isAuthenticated.value = false
      ;(api.defaults.headers as Record<string, string | undefined>).Authorization = ''
      loading.value = false
    }
  }

  return {
    currentUser: readonly(currentUser),
    isAuthenticated: readonly(isAuthenticated),
    loading: readonly(loading),
    authError: readonly(authError),
    login,
    register,
    logout,
  }
}
