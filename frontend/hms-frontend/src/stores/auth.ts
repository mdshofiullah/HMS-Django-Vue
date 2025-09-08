import { defineStore } from 'pinia'
import api from '../services/api'
import router from '../router'

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  phone_number?: string
  profile_picture?: string
  is_active: boolean
  created_at: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),

  actions: {
    checkAuthStatus() {
      const accessToken = localStorage.getItem('accessToken')
      const savedUser = localStorage.getItem('user')

      if (accessToken && savedUser) {
        this.accessToken = accessToken
        this.user = JSON.parse(savedUser)
        this.isAuthenticated = true
      }
    },

    async login(credentials: { username: string; password: string }) {
      this.isLoading = true
      this.error = null

      try {
        const response = await api.post('/auth/login/', credentials)

        if (response.data.access && response.data.refresh) {
          this.accessToken = response.data.access
          this.refreshToken = response.data.refresh
          this.user = response.data.user

          localStorage.setItem('accessToken', response.data.access)
          localStorage.setItem('refreshToken', response.data.refresh)
          localStorage.setItem('user', JSON.stringify(response.data.user))

          this.isAuthenticated = true

          // Redirect based on user role - with null check
          if (this.user && this.user.role) {
            if (this.user.role === 'admin') {
              router.push('/admin-dashboard')
            } else if (this.user.role === 'doctor') {
              router.push('/doctor-dashboard')
            } else if (this.user.role === 'patient') {
              router.push('/patient-dashboard')
            } else {
              router.push('/dashboard')
            }
          } else {
            router.push('/dashboard')
          }

          return { success: true }
        } else {
          this.error = 'Invalid response from server'
          return { success: false, error: this.error }
        }
      } catch (err: any) {
        this.error = err.response?.data?.detail || 'Login failed. Please check your credentials.'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async register(userData: any) {
      this.isLoading = true
      this.error = null

      try {
        const response = await api.post('/auth/register/', userData)

        if (response.status === 201) {
          // Registration successful, redirect to login
          this.error = null
          return { success: true, message: 'Registration successful. Please login.' }
        } else {
          this.error = 'Registration failed. Please try again.'
          return { success: false, error: this.error }
        }
      } catch (err: any) {
        this.error =
          err.response?.data?.username?.[0] ||
          err.response?.data?.email?.[0] ||
          err.response?.data?.password?.[0] ||
          'Registration failed. Please try again.'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout/')
      } catch (err) {
        console.error('Logout error:', err)
      } finally {
        this.accessToken = null
        this.refreshToken = null
        this.user = null
        this.isAuthenticated = false
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        router.push('/login')
      }
    },
  },
})
