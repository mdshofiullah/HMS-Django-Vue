import { ref, onMounted } from 'vue'
import api from '@/services/api'

export type User = {
  id?: number
  username?: string
  first_name?: string
  last_name?: string
  email?: string
  role?: string
  [key: string]: unknown
}

const isAuthenticated = ref<boolean>(false)
const currentUser = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// safe localStorage get/parse
function getJSON(key: string) {
  try {
    const v = localStorage.getItem(key)
    if (!v) return null
    return JSON.parse(v)
  } catch {
    return null
  }
}

export async function initAuth() {
  const access = localStorage.getItem('access_token')
  const user = getJSON('user') as User | null

  if (access) {
    // set header for api instance
    ;(api.defaults.headers as unknown as Record<string, string>).Authorization = `Bearer ${access}`
    // try to fetch profile to confirm token
    try {
      const resp = await api.get('/profile/')
      currentUser.value = resp.data as User
      localStorage.setItem('user', JSON.stringify(currentUser.value))
      isAuthenticated.value = true
      return
    } catch (err) {
      // token invalid or expired — clear stored auth
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      currentUser.value = null
      isAuthenticated.value = false
    }
  } else if (user) {
    // no token but user present (unlikely) — clear to avoid inconsistent state
    localStorage.removeItem('user')
    currentUser.value = null
    isAuthenticated.value = false
  }
}

function extractMessage(err: unknown): string {
  const maybe = err as { response?: { data?: unknown }; message?: string }
  const data = maybe.response?.data
  if (data && typeof data === 'object') {
    try {
      // prefer detail / message keys
      const detail =
        (data as Record<string, unknown>).detail ?? (data as Record<string, unknown>).message
      if (typeof detail === 'string') return detail
      // flatten other field messages
      const values = Object.values(data)
      const flat = values
        .map((v) => {
          if (Array.isArray(v)) return v.join(' ')
          if (typeof v === 'string') return v
          return ''
        })
        .filter(Boolean)
      if (flat.length) return flat.join(' — ')
    } catch {
      // fallthrough
    }
  }
  return maybe.message ?? 'Request failed'
}

export function useAuth() {
  async function login(username: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const tokenResp = await api.post('/token/', { username, password })
      const access = tokenResp.data?.access ?? tokenResp.data?.token
      const refresh = tokenResp.data?.refresh

      if (!access) throw new Error('No access token returned')

      localStorage.setItem('access_token', access)
      if (refresh) localStorage.setItem('refresh_token', refresh)
      ;(api.defaults.headers as unknown as Record<string, string>).Authorization =
        `Bearer ${access}`

      const profileResp = await api.get('/profile/')
      const user = profileResp.data as User
      localStorage.setItem('user', JSON.stringify(user))
      currentUser.value = user
      isAuthenticated.value = true

      return { success: true, user }
    } catch (err: unknown) {
      const msg = extractMessage(err)
      error.value = msg
      return { success: false, error: msg }
    } finally {
      loading.value = false
    }
  }

  async function register(payload: {
    username: string
    email?: string
    password: string
    role?: string
  }) {
    loading.value = true
    error.value = null
    try {
      // If role === 'admin' set is_staff (backend may expect that)
      const body: Record<string, unknown> = { ...payload }
      if (payload.role === 'admin') body.is_staff = true
      const resp = await api.post('/register/', body)
      return { success: true, data: resp.data }
    } catch (err: unknown) {
      const msg = extractMessage(err)
      error.value = msg
      return { success: false, error: msg }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/logout/').catch(() => {})
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      isAuthenticated.value = false
      currentUser.value = null
    }
  }

  return {
    isAuthenticated,
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
  }
}
