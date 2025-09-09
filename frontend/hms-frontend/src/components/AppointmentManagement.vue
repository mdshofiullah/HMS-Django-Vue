<template>
  <div class="p-4">
    <h2>Appointments</h2>
    <div v-if="loading">Loading…</div>
    <table v-else class="table table-sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Patient</th>
          <th>Doctor</th>
          <th>Time</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in appointments" :key="a.id">
          <td>{{ a.id }}</td>
          <td>{{ a.patient_name ?? a.patient?.full_name }}</td>
          <td>{{ a.doctor_name ?? a.doctor?.name }}</td>
          <td>{{ a.scheduled_at ?? a.time }}</td>
          <td>{{ a.status }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="error" class="text-danger">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import type { Appointment } from '@/composables/useAuth'

const appointments = ref<Appointment[]>([])
const loading = ref(false)
const error = ref('')

async function fetchAppointments(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const resp = await api.get<Appointment[]>('/appointments/')
    appointments.value = resp.data ?? []
  } catch (err) {
    const e = err as any
    error.value = e?.response?.data?.detail ?? e?.message ?? 'Failed to load appointments'
  } finally {
    loading.value = false
  }
}

onMounted(() => void fetchAppointments())
</script>
