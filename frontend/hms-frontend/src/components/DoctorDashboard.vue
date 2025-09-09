<template>
  <div class="doctor-dashboard p-4">
    <h1 class="text-2xl font-bold mb-4">Doctor Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-white p-4 rounded shadow">
        <p class="text-sm text-gray-600">Today's Appointments</p>
        <h3 class="text-xl font-semibold">{{ appointments.length }}</h3>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <p class="text-sm text-gray-600">Pending Lab Results</p>
        <h3 class="text-xl font-semibold">{{ pendingLabs }}</h3>
      </div>
    </div>

    <div class="bg-white rounded shadow p-4">
      <h2 class="text-lg mb-3">Upcoming Appointments</h2>
      <ul class="divide-y">
        <li v-for="a in appointments" :key="a.id" class="py-3">
          <div class="flex justify-between items-center">
            <div>
              <div class="font-medium">{{ a.patient_name }}</div>
              <div class="text-sm text-gray-500">{{ a.date }} — {{ a.time }}</div>
            </div>
            <div class="text-sm">
              <span class="px-2 py-1 rounded bg-yellow-50 text-yellow-700">{{ a.status }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

type Appointment = { id: number; patient_name: string; date: string; time: string; status: string }

const appointments = ref<Appointment[]>([])
const pendingLabs = ref<number>(0)

onMounted(async () => {
  // try to fetch doctor data if backend exposes endpoints; fall back to placeholder
  try {
    const resp = await api.get('/doctor/dashboard/')
    // expected shape: { appointments: [...], pending_labs: number }
    appointments.value = resp.data.appointments ?? []
    pendingLabs.value = resp.data.pending_labs ?? 0
  } catch (err) {
    // fallback demo data
    appointments.value = [
      { id: 1, patient_name: 'John Doe', date: '2025-09-10', time: '09:00', status: 'Confirmed' },
      { id: 2, patient_name: 'Jane Smith', date: '2025-09-10', time: '09:45', status: 'Pending' },
      {
        id: 3,
        patient_name: 'Alice Johnson',
        date: '2025-09-10',
        time: '10:30',
        status: 'Confirmed',
      },
    ]
    pendingLabs.value = 2
  }
})
</script>

<style scoped>
.doctor-dashboard {
  padding: 12px;
}
</style>
