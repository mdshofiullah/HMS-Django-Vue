<template>
  <div class="p-4">
    <h2>Billing</h2>
    <div v-if="loading">Loading…</div>
    <table v-else class="table table-sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Patient</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="b in bills" :key="b.id">
          <td>{{ b.id }}</td>
          <td>{{ b.patient_name ?? b.patient?.full_name }}</td>
          <td>{{ b.total ?? b.amount }}</td>
          <td>{{ b.status }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="error" class="text-danger">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import type { Bill } from '@/composables/useAuth'

const bills = ref<Bill[]>([])
const loading = ref(false)
const error = ref('')

async function fetchBills(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const resp = await api.get<Bill[]>('/billing/')
    bills.value = resp.data ?? []
  } catch (err) {
    const e = err as any
    error.value = e?.response?.data?.detail ?? e?.message ?? 'Failed to load bills'
  } finally {
    loading.value = false
  }
}

onMounted(() => void fetchBills())
</script>
