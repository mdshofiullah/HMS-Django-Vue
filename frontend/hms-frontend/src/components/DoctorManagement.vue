<template>
  <div class="p-4">
    <h2>Doctors</h2>
    <div v-if="loading">Loading…</div>
    <ul v-else class="list-group">
      <li
        v-for="d in doctors"
        :key="d.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <div class="fw-bold">{{ d.name ?? d.username }}</div>
          <div class="text-muted">{{ d.specialty ?? '' }}</div>
        </div>
        <span class="badge badge-primary">{{ d.status ?? '—' }}</span>
      </li>
    </ul>
    <div v-if="error" class="text-danger mt-2">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import type { Doctor } from '@/composables/useAuth'

const doctors = ref<Doctor[]>([])
const loading = ref(false)
const error = ref('')

async function fetchDoctors(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const resp = await api.get<Doctor[]>('/doctors/')
    doctors.value = resp.data ?? []
  } catch (err) {
    const e = err as any
    error.value = e?.response?.data?.detail ?? e?.message ?? 'Failed to load doctors'
  } finally {
    loading.value = false
  }
}

onMounted(() => void fetchDoctors())
</script>
