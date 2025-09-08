<template>
  <div class="admin-dashboard">
    <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-indigo-100 text-indigo-500 mr-4">
            <i class="fas fa-users text-xl"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Users</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.users }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-500 mr-4">
            <i class="fas fa-user-md text-xl"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Doctors</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.doctors }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
            <i class="fas fa-procedures text-xl"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Patients</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.patients }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
            <i class="fas fa-calendar-check text-xl"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Appointments</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.appointments }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-medium mb-4">Recent Users</h2>
        <ul class="divide-y divide-gray-200">
          <li v-for="user in recentUsers" :key="user.id" class="py-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-700">{{
                    user.username.charAt(0).toUpperCase()
                  }}</span>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">{{ user.username }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : user.role === 'doctor'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                "
              >
                {{ user.role }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-medium mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 gap-4">
          <router-link
            to="/users"
            class="p-4 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition"
          >
            <i class="fas fa-users text-indigo-500 text-xl mb-2"></i>
            <p class="text-sm font-medium">Manage Users</p>
          </router-link>

          <router-link
            to="/departments"
            class="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition"
          >
            <i class="fas fa-building text-green-500 text-xl mb-2"></i>
            <p class="text-sm font-medium">Departments</p>
          </router-link>

          <router-link
            to="/reports"
            class="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition"
          >
            <i class="fas fa-chart-bar text-blue-500 text-xl mb-2"></i>
            <p class="text-sm font-medium">Reports</p>
          </router-link>

          <router-link
            to="/settings"
            class="p-4 bg-yellow-50 rounded-lg text-center hover:bg-yellow-100 transition"
          >
            <i class="fas fa-cog text-yellow-500 text-xl mb-2"></i>
            <p class="text-sm font-medium">Settings</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const stats = ref({
  users: 0,
  doctors: 0,
  patients: 0,
  appointments: 0,
})

const recentUsers = ref([])

onMounted(async () => {
  try {
    // Fetch admin dashboard data
    const [statsResponse, usersResponse] = await Promise.all([
      api.get('/admin/stats/'),
      api.get('/admin/users/recent/'),
    ])

    stats.value = statsResponse.data
    recentUsers.value = usersResponse.data
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error)
  }
})


</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}
</style>

