<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  stats: Array,
  user: Object,
  appointments: Array,
  prescriptions: Array,
  labTests: Array,
  bills: Array,
})

const emit = defineEmits(['download-report'])

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 border-blue-500',
  green: 'bg-green-100 text-green-600 border-green-500',
  purple: 'bg-purple-100 text-purple-600 border-purple-500',
  red: 'bg-red-100 text-red-600 border-red-500',
}

// Filter data for current patient only
const patientAppointments = computed(() => {
  return props.appointments.filter((apt) => apt.patient.user.id === props.user.id)
})

const patientPrescriptions = computed(() => {
  return props.prescriptions.filter((pres) => pres.patient.user.id === props.user.id)
})

const patientLabTests = computed(() => {
  return props.labTests.filter((test) => test.patient.user.id === props.user.id)
})

const patientBills = computed(() => {
  return props.bills.filter((bill) => bill.patient.user.id === props.user.id)
})
</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Patient Dashboard</h1>

    <!-- Welcome message -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800">
        Welcome, {{ user.first_name }} {{ user.last_name }}!
      </h2>
      <p class="text-gray-600">Here's an overview of your medical records and appointments.</p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

    <!-- Medical Information -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Upcoming Appointments -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b border-gray-200 flex items-center">
          <div class="p-2 rounded-full mr-3 bg-blue-100 text-blue-600">
            <font-awesome-icon icon="calendar-check" />
          </div>
          <h3 class="text-lg font-medium text-gray-800">Upcoming Appointments</h3>
        </div>
        <div class="p-4">
          <ul class="space-y-3">
            <li
              v-for="appointment in patientAppointments
                .filter((a) => a.status === 'scheduled')
                .slice(0, 3)"
              :key="appointment.id"
              class="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">
                    Dr. {{ appointment.doctor.user.first_name }}
                    {{ appointment.doctor.user.last_name }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ appointment.date }} at {{ appointment.time }}
                  </p>
                  <p class="text-sm text-gray-600">Reason: {{ appointment.reason || 'N/A' }}</p>
                </div>
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  {{ appointment.status }}
                </span>
              </div>
            </li>
            <li
              v-if="patientAppointments.filter((a) => a.status === 'scheduled').length === 0"
              class="text-center py-8 text-gray-500"
            >
              No upcoming appointments
            </li>
          </ul>
        </div>
      </div>

      <!-- Recent Prescriptions -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b border-gray-200 flex items-center">
          <div class="p-2 rounded-full mr-3 bg-green-100 text-green-600">
            <font-awesome-icon icon="prescription-bottle" />
          </div>
          <h3 class="text-lg font-medium text-gray-800">Current Prescriptions</h3>
        </div>
        <div class="p-4">
          <ul class="space-y-3">
            <li
              v-for="prescription in patientPrescriptions.filter((p) => p.is_active).slice(0, 3)"
              :key="prescription.id"
              class="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <p class="font-medium">{{ prescription.medication }}</p>
                <p class="text-sm text-gray-600">Dosage: {{ prescription.dosage }}</p>
                <p class="text-sm text-gray-600">
                  Instructions: {{ prescription.instructions || 'N/A' }}
                </p>
                <p class="text-sm text-gray-600">
                  Prescribed by: Dr. {{ prescription.doctor.user.first_name }}
                  {{ prescription.doctor.user.last_name }}
                </p>
              </div>
            </li>
            <li
              v-if="patientPrescriptions.filter((p) => p.is_active).length === 0"
              class="text-center py-8 text-gray-500"
            >
              No active prescriptions
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Medical History -->
    <div class="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div class="p-4 border-b border-gray-200 flex items-center">
        <div class="p-2 rounded-full mr-3 bg-purple-100 text-purple-600">
          <font-awesome-icon icon="file-medical" />
        </div>
        <h3 class="text-lg font-medium text-gray-800">Medical History</h3>
      </div>
      <div class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Appointments History -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-800 mb-3 flex items-center">
              <font-awesome-icon icon="calendar-check" class="mr-2 text-blue-500" />
              Appointment History
            </h4>
            <p class="text-2xl font-bold text-gray-800">{{ patientAppointments.length }}</p>
            <p class="text-sm text-gray-600">Total appointments</p>
            <button
              @click="
                emit(
                  'download-report',
                  { type: 'appointments', data: patientAppointments },
                  'appointment-history',
                )
              "
              class="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <font-awesome-icon icon="download" class="mr-1" />
              Download History
            </button>
          </div>

          <!-- Lab Tests -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-800 mb-3 flex items-center">
              <font-awesome-icon icon="flask" class="mr-2 text-purple-500" />
              Lab Tests
            </h4>
            <p class="text-2xl font-bold text-gray-800">{{ patientLabTests.length }}</p>
            <p class="text-sm text-gray-600">Total tests</p>
            <button
              @click="
                emit('download-report', { type: 'lab-tests', data: patientLabTests }, 'lab-report')
              "
              class="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <font-awesome-icon icon="download" class="mr-1" />
              Download Reports
            </button>
          </div>

          <!-- Bills -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-800 mb-3 flex items-center">
              <font-awesome-icon icon="file-invoice-dollar" class="mr-2 text-green-500" />
              Billing
            </h4>
            <p class="text-2xl font-bold text-gray-800">{{ patientBills.length }}</p>
            <p class="text-sm text-gray-600">Total bills</p>
            <button
              @click="
                emit('download-report', { type: 'bills', data: patientBills }, 'billing-history')
              "
              class="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <font-awesome-icon icon="download" class="mr-1" />
              Download Statements
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
