import { ref } from 'vue'
import type { Ref } from 'vue'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const state: Ref<AuthState> = ref({
  user: null,
  token: null,
  isAuthenticated: false,
})

export function useAuth() {
  const init = () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      state.value.token = token
      state.value.user = JSON.parse(user)
      state.value.isAuthenticated = true
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        state.value.token = data.access
        state.value.user = data.user
        state.value.isAuthenticated = true

        // Store in localStorage
        localStorage.setItem('token', data.access)
        localStorage.setItem('user', JSON.stringify(data.user))

        return { success: true, data }
      } else {
        return { success: false, error: data.error || 'Login failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        // Auto login after registration
        return await login(userData.username, userData.password)
      } else {
        return { success: false, error: data.error || 'Registration failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    state.value.token = null
    state.value.user = null
    state.value.isAuthenticated = false

    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = state.value.token

    if (!token) {
      throw new Error('No authentication token found')
    }

    const defaultOptions: RequestInit = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    return fetch(url, { ...defaultOptions, ...options })
  }

  return {
    state,
    init,
    login,
    register,
    logout,
    fetchWithAuth,
  }
}
