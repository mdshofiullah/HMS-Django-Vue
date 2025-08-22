<script setup lang="ts">
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps({
  isAuthenticated: Boolean,
  user: Object,
  activeSection: String,
  mobileMenuOpen: Boolean
})

const emit = defineEmits(['logout', 'setActiveSection', 'toggleMobileMenu'])

const navigationItems = computed(() => [
  { id: 'dashboard', label: 'Dashboard', icon: 'chart-line' },
  { id: 'profile', label: 'Profile', icon: 'user' }
])
</script>

<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <font-awesome-icon icon="hospital" class="h-8 w-8 text-blue-600" />
            <span class="ml-2 text-xl font-bold text-gray-800">HMS</span>
          </div>
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <button
              v-for="item in navigationItems"
              :key="item.id"
              @click="emit('setActiveSection', item.id)"
              class="inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium"
              :class="activeSection === item.id 
                ? 'border-blue-500 text-gray-900' 
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
            >
              <font-awesome-icon :icon="item.icon" class="mr-2" />
              {{ item.label }}
            </button>
          </div>
        </div>
        
        <div class="hidden md:flex items-center">
          <div v-if="isAuthenticated && user" class="flex items-center">
            <span class="mr-4 text-gray-700">Welcome, {{ user.first_name }} {{ user.last_name }}</span>
            <button 
              @click="emit('logout')" 
              class="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <font-awesome-icon icon="sign-out-alt" class="mr-2" />
              Logout
            </button>
          </div>
        </div>
        
        <div class="flex items-center md:hidden">
          <button
            @click="emit('toggleMobileMenu')"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <font-awesome-icon v-if="!mobileMenuOpen" icon="bars" class="h-6 w-6" />
            <font-awesome-icon v-else icon="times" class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <button
          v-for="item in navigationItems"
          :key="item.id"
          @click="emit('setActiveSection', item.id)"
          class="block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="activeSection === item.id 
            ? 'border-blue-500 bg-blue-50 text-blue-700' 
            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
        >
          <font-awesome-icon :icon="item.icon" class="mr-3" />
          {{ item.label }}
        </button>
      </div>
      <div v-if="isAuthenticated && user" class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <font-awesome-icon icon="user" class="text-blue-500" />
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ user.first_name }} {{ user.last_name }}</div>
            <div class="text-sm font-medium text-gray-500 capitalize">{{ user.role }}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <button
            @click="emit('logout')"
            class="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          >
            <font-awesome-icon icon="sign-out-alt" class="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Custom styles if needed */
</style>