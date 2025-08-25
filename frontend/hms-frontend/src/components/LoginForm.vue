<script setup lang="ts">
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import api from '../services/api'

const emit = defineEmits(['login'])

const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const isPatientLogin = ref(false)
const patientId = ref('')
const patientPhone = ref('')

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''

  try {
    let endpoint, data

    if (isPatientLogin.value) {
      endpoint = '/login/patient/'
      data = {
        patient_id: patientId.value,
        phone_number: patientPhone.value,
      }
    } else {
      endpoint = '/login/'
      data = {
        username: username.value,
        password: password.value,
      }
    }

    const response = await api.post(endpoint, data)

    if (response.status === 200) {
      const responseData = response.data
      localStorage.setItem('access_token', responseData.access)
      localStorage.setItem('refresh_token', responseData.refresh)
      localStorage.setItem('user', JSON.stringify(responseData.user))

      emit('login', responseData.user, responseData.access)
      error.value = ''
    }
  } catch (err) {
    if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else if (err.response?.data?.detail) {
      error.value = err.response.data.detail
    } else {
      error.value = 'Network error. Please try again.'
    }
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<!-- The rest of the component remains the same -->

<template>
  <div class="mb-6">
    <h3 class="text-lg font-medium text-gray-800 mb-4 text-center">Login to your account</h3>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <font-awesome-icon icon="user" class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your username"
          />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <font-awesome-icon icon="lock" class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <font-awesome-icon icon="exclamation-circle" class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <span v-if="isLoading" class="flex items-center">
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Logging in...
        </span>
        <span v-else>Sign in</span>
      </button>
    </form>

    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account?
        <button @click="toggleForm" class="font-medium text-blue-600 hover:text-blue-500">
          Register here
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
