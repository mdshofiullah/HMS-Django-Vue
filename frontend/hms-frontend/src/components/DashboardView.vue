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
})

const emit = defineEmits([
  'create-patient',
  'create-appointment',
  'create-prescription',
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

const userRole = computed(() => props.user?.role || 'doctor')
const dashboardTitle = computed(() => {
  switch (userRole.value) {
    case 'doctor':
      return 'Doctor Dashboard'
    case 'lab':
      return 'Lab Staff Dashboard'
    default:
      return 'Dashboard'
  }
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{ dashboardTitle }}</h1>
      <div class="flex space-x-2">
        <button
          v-if="userRole === 'doctor'"
          @click="emit('create-appointment')"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <font-awesome-icon icon="calendar-plus" class="mr-2" />
          New Appointment
        </button>
        <button
          v-if="userRole === 'doctor'"
          @click="emit('create-prescription')"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <font-awesome-icon icon="prescription-bottle" class="mr-2" />
          New Prescription
        </button>
      </div>
    </div>

    <!-- Welcome message -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800">
        Welcome, {{ user.first_name }} {{ user.last_name }}!
      </h2>
      <p class="text-gray-600">Here's an overview of your account and activities.</p>
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

    <!-- Recent Activities -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Appointments -->
      <div class="bg-white rounded-lg shadow overflow-hidden" v-if="userRole === 'doctor'">
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
                    Date: {{ appointment.date }} at {{ appointment.time }}
                  </p>
                  <p class="text-sm text-gray-600">Reason: {{ appointment.reason || 'N/A' }}</p>
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

      <!-- Recent Lab Tests -->
      <div class="bg-white rounded-lg shadow overflow-hidden" v-if="userRole === 'lab'">
        <div class="p-4 border-b border-gray-200 flex items-center">
          <div class="p-2 rounded-full mr-3 bg-purple-100 text-purple-600">
            <font-awesome-icon icon="flask" />
          </div>
          <h3 class="text-lg font-medium text-gray-800">Recent Lab Tests</h3>
        </div>
        <div class="p-4">
          <ul class="space-y-3">
            <li
              v-for="test in labTests.slice(0, 5)"
              :key="test.id"
              class="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">
                    {{ test.patient.user.first_name }} {{ test.patient.user.last_name }}
                  </p>
                  <p class="text-sm text-gray-600">Test: {{ test.test_name }}</p>
                  <p class="text-sm text-gray-600">Date: {{ test.test_date }}</p>
                </div>
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800': test.status === 'pending',
                    'bg-blue-100 text-blue-800': test.status === 'in_progress',
                    'bg-green-100 text-green-800': test.status === 'completed',
                    'bg-red-100 text-red-800': test.status === 'cancelled',
                  }"
                >
                  {{ test.status }}
                </span>
              </div>
            </li>
            <li v-if="labTests.length === 0" class="text-center py-8 text-gray-500">
              No lab tests found
            </li>
          </ul>
        </div>
      </div>

      <!-- Recent Prescriptions -->
      <div class="bg-white rounded-lg shadow overflow-hidden" v-if="userRole === 'doctor'">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center">
            <div class="p-2 rounded-full mr-3 bg-green-100 text-green-600">
              <font-awesome-icon icon="prescription-bottle" />
            </div>
            <h3 class="text-lg font-medium text-gray-800">Recent Prescriptions</h3>
          </div>
          <button
            @click="emit('create-prescription')"
            class="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            + New
          </button>
        </div>
        <div class="p-4">
          <ul class="space-y-3">
            <li
              v-for="prescription in prescriptions.slice(0, 5)"
              :key="prescription.id"
              class="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <p class="font-medium">
                  {{ prescription.patient.user.first_name }}
                  {{ prescription.patient.user.last_name }}
                </p>
                <p class="text-sm text-gray-600">Medication: {{ prescription.medication }}</p>
                <p class="text-sm text-gray-600">Dosage: {{ prescription.dosage }}</p>
                <p class="text-sm text-gray-600">
                  {{ new Date(prescription.date_prescribed).toLocaleDateString() }}
                </p>
              </div>
            </li>
            <li v-if="prescriptions.length === 0" class="text-center py-8 text-gray-500">
              No prescriptions found
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
