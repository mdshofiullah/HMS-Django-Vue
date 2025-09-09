<template>
  <div class="p-4">
    <h2>Lab Tests</h2>
    <div v-if="loading">Loading…</div>
    <ul v-else class="list-group">
      <li v-for="t in tests" :key="t.id" class="list-group-item">
        <div class="d-flex justify-content-between">
          <div>
            <strong>{{ t.patient_name ?? t.patient?.full_name }}</strong>
            <div class="text-muted">{{ t.test_name }}</div>
          </div>
          <div>{{ t.status }}</div>
        </div>
      </li>
    </ul>
    <div v-if="error" class="text-danger mt-2">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import type { LabTest } from '@/composables/useAuth'

const tests = ref<LabTest[]>([])
const loading = ref(false)
const error = ref('')

async function fetchTests(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const resp = await api.get<LabTest[]>('/lab-tests/')
    tests.value = resp.data ?? []
  } catch (err) {
    const e = err as any
    error.value = e?.response?.data?.detail ?? e?.message ?? 'Failed to load lab tests'
  } finally {
    loading.value = false
  }
}

onMounted(() => void fetchTests())
</script>
