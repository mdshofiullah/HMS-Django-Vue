<script setup lang="ts">
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emit = defineEmits(['registered'])

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  role: 'patient'
})
const error = ref('')
const success = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  // Basic validation
  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (formData.value.password.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.value.username,
        password: formData.value.password,
        email: formData.value.email,
        role: formData.value.role,
        first_name: formData.value.firstName,
        last_name: formData.value.lastName
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      success.value = 'Registration successful! Please login with your credentials.'
      // Clear form
      formData.value = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'patient'
      }
    } else {
      error.value = data.error || 'Registration failed. Please try again.'
    }
  } catch (err) {
    error.value = 'Network error. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <h3 class="text-lg font-medium text-gray-800 mb-4 text-center">Create a new account</h3>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
          <input 
            type="text" 
            id="firstName" 
            v-model="formData.firstName" 
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
        
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
          <input 
            type="text" 
            id="lastName" 
            v-model="formData.lastName" 
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
      </div>
      
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <input 
          type="text" 
          id="username" 
          v-model="formData.username" 
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
      </div>
      
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
      </div>
      
      <div>
        <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
        <select 
          id="role" 
          v-model="formData.role" 
          required
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="lab">Lab</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="formData.password" 
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
        
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="formData.confirmPassword" 
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
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
      
      <div v-if="success" class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <font-awesome-icon icon="check-circle" class="h-5 w-5 text-green-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">{{ success }}</p>
          </div>
        </div>
      </div>
      
      <button 
        type="submit" 
        :disabled="isLoading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        <span v-if="isLoading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Registering...
        </span>
        <span v-else>Register</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>