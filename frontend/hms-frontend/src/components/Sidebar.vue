<script setup lang="ts">
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  isAuthenticated: Boolean,
  user: Object,
  activeSection: String,
  mobileMenuOpen: Boolean,
})

const emit = defineEmits(['setActiveSection', 'toggleMobileMenu'])

// Navigation items based on user role
const navigationItems = computed(() => {
  const baseItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'chart-line',
      roles: ['admin', 'doctor', 'patient', 'lab'],
    },
  ]

  if (props.user?.role === 'admin') {
    return [
      ...baseItems,
      { id: 'users', label: 'User Management', icon: 'users', roles: ['admin'] },
      { id: 'departments', label: 'Departments', icon: 'building', roles: ['admin'] },
      { id: 'doctors', label: 'Doctors', icon: 'user-doctor', roles: ['admin'] },
      { id: 'patients', label: 'Patients', icon: 'user-injured', roles: ['admin'] },
      { id: 'appointments', label: 'Appointments', icon: 'calendar-check', roles: ['admin'] },
      {
        id: 'prescriptions',
        label: 'Prescriptions',
        icon: 'prescription-bottle',
        roles: ['admin'],
      },
      { id: 'lab-tests', label: 'Lab Tests', icon: 'flask', roles: ['admin'] },
      { id: 'billing', label: 'Billing', icon: 'credit-card', roles: ['admin'] },
      { id: 'reports', label: 'Reports', icon: 'chart-bar', roles: ['admin'] },
    ]
  } else if (props.user?.role === 'doctor') {
    return [
      ...baseItems,
      {
        id: 'my-appointments',
        label: 'My Appointments',
        icon: 'calendar-check',
        roles: ['doctor'],
      },
      {
        id: 'my-prescriptions',
        label: 'My Prescriptions',
        icon: 'prescription-bottle',
        roles: ['doctor'],
      },
      { id: 'my-patients', label: 'My Patients', icon: 'user-injured', roles: ['doctor'] },
      { id: 'schedule', label: 'Schedule', icon: 'calendar', roles: ['doctor'] },
    ]
  } else if (props.user?.role === 'patient') {
    return [
      ...baseItems,
      {
        id: 'my-appointments',
        label: 'My Appointments',
        icon: 'calendar-check',
        roles: ['patient'],
      },
      {
        id: 'my-prescriptions',
        label: 'My Prescriptions',
        icon: 'prescription-bottle',
        roles: ['patient'],
      },
      { id: 'my-lab-tests', label: 'My Lab Tests', icon: 'flask', roles: ['patient'] },
      { id: 'my-bills', label: 'My Bills', icon: 'credit-card', roles: ['patient'] },
      { id: 'medical-history', label: 'Medical History', icon: 'file-medical', roles: ['patient'] },
    ]
  } else if (props.user?.role === 'lab') {
    return [
      ...baseItems,
      { id: 'lab-tests', label: 'Lab Tests', icon: 'flask', roles: ['lab'] },
      { id: 'test-results', label: 'Test Results', icon: 'file-medical', roles: ['lab'] },
    ]
  }

  return baseItems
})

const filteredNavigation = computed(() => {
  return navigationItems.value.filter(
    (item) => item.roles.includes(props.user?.role) || item.roles.includes('all'),
  )
})
</script>

<template>
  <div>
    <!-- Mobile menu button -->
    <div class="md:hidden flex items-center justify-between p-4 bg-gray-800">
      <div class="flex items-center">
        <font-awesome-icon icon="hospital" class="h-6 w-6 text-blue-400 mr-2" />
        <span class="text-white font-bold">HMS</span>
      </div>
      <button
        @click="emit('toggleMobileMenu')"
        class="text-gray-400 hover:text-white focus:outline-none"
      >
        <font-awesome-icon v-if="!mobileMenuOpen" icon="bars" class="h-6 w-6" />
        <font-awesome-icon v-else icon="times" class="h-6 w-6" />
      </button>
    </div>

    <!-- Sidebar for desktop -->
    <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div class="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div class="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
          <font-awesome-icon icon="hospital" class="h-8 w-8 text-blue-400 mr-2" />
          <span class="text-white text-xl font-bold">HMS</span>
        </div>
        <div class="flex-1 flex flex-col overflow-y-auto">
          <nav class="flex-1 px-2 py-4 space-y-1">
            <button
              v-for="item in filteredNavigation"
              :key="item.id"
              @click="emit('setActiveSection', item.id)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left"
              :class="
                activeSection === item.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              "
            >
              <font-awesome-icon :icon="item.icon" class="mr-3 flex-shrink-0 h-6 w-6" />
              {{ item.label }}
            </button>
          </nav>
        </div>
        <div class="flex-shrink-0 flex bg-gray-700 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                <font-awesome-icon icon="user" class="text-white" />
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-white">
                {{ user.first_name }} {{ user.last_name }}
              </p>
              <p class="text-xs font-medium text-gray-300 capitalize">{{ user.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
        <button
          v-for="item in filteredNavigation"
          :key="item.id"
          @click="emit('setActiveSection', item.id)"
          class="group flex items-center px-2 py-2 text-base font-medium rounded-md w-full text-left"
          :class="
            activeSection === item.id
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          "
        >
          <font-awesome-icon :icon="item.icon" class="mr-3 flex-shrink-0 h-6 w-6" />
          {{ item.label }}
        </button>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-700">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <font-awesome-icon icon="user" class="text-white" />
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-white">
              {{ user.first_name }} {{ user.last_name }}
            </div>
            <div class="text-sm font-medium text-gray-300 capitalize">{{ user.role }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
