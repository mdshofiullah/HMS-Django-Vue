<template>
  <div class="p-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>Patients</h2>
      <button @click="fetchPatients" class="btn btn-sm btn-light">Refresh</button>
    </div>

    <div v-if="loading">Loading patients…</div>
    <div v-else>
      <table class="table table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in patients" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.full_name ?? p.name }}</td>
            <td>{{ p.age ?? '-' }}</td>
            <td>{{ p.phone ?? '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="error" class="text-danger">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import type { Patient } from '@/composables/useAuth'

const patients = ref<Patient[]>([])
const loading = ref(false)
const error = ref('')

async function fetchPatients(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const resp = await api.get<Patient[]>('/patients/')
    patients.value = resp.data ?? []
  } catch (err) {
    const e = err as any
    error.value = e?.response?.data?.detail ?? e?.message ?? 'Failed to fetch patients'
  } finally {
    loading.value = false
  }
}

onMounted(() => void fetchPatients())
</script>
