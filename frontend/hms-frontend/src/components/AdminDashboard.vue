<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  stats: Array,
  user: Object,
  doctors: Array,
  patients: Array,
  departments: Array,
  appointments: Array,
  prescriptions: Array,
  labTests: Array,
  bills: Array,
  users: Array,
})

const emit = defineEmits([
  'create-patient',
  'create-appointment',
  'create-prescription',
  'create-user',
  'edit-item',
  'delete-item',
  'download-report',
])

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 border-blue-500',
  green: 'bg-green-100 text-green-600 border-green-500',
  purple: 'bg-purple-100 text-purple-600 border-purple-500',
  red: 'bg-red-100 text-red-600 border-red-500',
  yellow: 'bg-yellow-100 text-yellow-600 border-yellow-500',
  indigo: 'bg-indigo-100 text-indigo-600 border-indigo-500',
  teal: 'bg-teal-100 text-teal-600 border-teal-500',
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <div class="flex space-x-2">
        <button
          @click="emit('create-user')"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <font-awesome-icon icon="user-plus" class="mr-2" />
          Add User
        </button>
        <button
          @click="emit('create-patient')"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <font-awesome-icon icon="user-injured" class="mr-2" />
          Add Patient
        </button>
        <button
          @click="emit('create-appointment')"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <font-awesome-icon icon="calendar-plus" class="mr-2" />
          New Appointment
        </button>
      </div>
    </div>

    <!-- Welcome message -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800">
        Welcome, {{ user.first_name }} {{ user.last_name }}!
      </h2>
      <p class="text-gray-600">
        You have full administrative access to the Hospital Management System.
      </p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="bg-white rounded-lg shadow p-4 flex items-center border-l-4"
        :class="colorClasses[stat.color]"
      >
        <div class="mr-4 p-3 rounded-full bg-opacity-20" :class="`bg-${stat.color}-100`">
          <font-awesome-icon :icon="stat.icon" class="text-xl" :class="`text-${stat.color}-500`" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-800">{{ stat.value }}</p>
          <p class="text-gray-600">{{ stat.title }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        class="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:bg-gray-50"
        @click="emit('create-user')"
      >
        <div
          class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3"
        >
          <font-awesome-icon icon="user-plus" class="text-2xl text-blue-500" />
        </div>
        <h3 class="font-medium text-gray-800">Add User</h3>
        <p class="text-sm text-gray-600">Create new system user</p>
      </div>

      <div
        class="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:bg-gray-50"
        @click="emit('create-patient')"
      >
        <div
          class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3"
        >
          <font-awesome-icon icon="user-injured" class="text-2xl text-green-500" />
        </div>
        <h3 class="font-medium text-gray-800">Add Patient</h3>
        <p class="text-sm text-gray-600">Register new patient</p>
      </div>

      <div
        class="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:bg-gray-50"
        @click="emit('create-appointment')"
      >
        <div
          class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3"
        >
          <font-awesome-icon icon="calendar-plus" class="text-2xl text-purple-500" />
        </div>
        <h3 class="font-medium text-gray-800">New Appointment</h3>
        <p class="text-sm text-gray-600">Schedule appointment</p>
      </div>

      <div
        class="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:bg-gray-50"
        @click="emit('create-prescription')"
      >
        <div
          class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3"
        >
          <font-awesome-icon icon="prescription-bottle" class="text-2xl text-red-500" />
        </div>
        <h3 class="font-medium text-gray-800">New Prescription</h3>
        <p class="text-sm text-gray-600">Create prescription</p>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Appointments -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center">
            <div class="p-2 rounded-full mr-3 bg-blue-100 text-blue-600">
              <font-awesome-icon icon="calendar-check" />
            </div>
            <h3 class="text-lg font-medium text-gray-800">Recent Appointments</h3>
          </div>
          <button
            @click="emit('create-appointment')"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + New
          </button>
        </div>
        <div class="p-4">
          <ul class="space-y-3">
            <li
              v-for="appointment in appointments.slice(0, 5)"
              :key="appointment.id"
              class="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">
                    {{ appointment.patient.user.first_name }}
                    {{ appointment.patient.user.last_name }}
                  </p>
                  <p class="text-sm text-gray-600">
                    Dr. {{ appointment.doctor.user.first_name }}
                    {{ appointment.doctor.user.last_name }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ appointment.date }} at {{ appointment.time }}
                  </p>
                </div>
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="{
                    'bg-blue-100 text-blue-800': appointment.status === 'scheduled',
                    'bg-green-100 text-green-800': appointment.status === 'completed',
                    'bg-red-100 text-red-800': appointment.status === 'cancelled',
                    'bg-yellow-100 text-yellow-800': appointment.status === 'no_show',
                  }"
                >
                  {{ appointment.status }}
                </span>
              </div>
            </li>
            <li v-if="appointments.length === 0" class="text-center py-8 text-gray-500">
              No appointments found
            </li>
          </ul>
        </div>
      </div>

      <!-- Recent Users -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center">
            <div class="p-2 rounded-full mr-3 bg-green-100 text-green-600">
              <font-awesome-icon icon="users" />
            </div>
            <h3 class="text-lg font-medium text-gray-800">Recent Users</h3>
          </div>
          <button
            @click="emit('create-user')"
            class="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            + New
          </button>
        </div>
        <div class="p-4">
          <ul class="space-y-3">
            <li
              v-for="user in users.slice(0, 5)"
              :key="user.id"
              class="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">{{ user.first_name }} {{ user.last_name }}</p>
                  <p class="text-sm text-gray-600">Username: {{ user.username }}</p>
                  <p class="text-sm text-gray-600 capitalize">Role: {{ user.role }}</p>
                </div>
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"
                >
                  {{ user.role }}
                </span>
              </div>
            </li>
            <li v-if="users.length === 0" class="text-center py-8 text-gray-500">No users found</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
