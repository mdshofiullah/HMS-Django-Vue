<template>
  <section class="p-4">
    <h1 class="mb-3">Admin Dashboard</h1>
    <div class="row">
      <div class="col-md-3" v-for="(v, k) in stats" :key="k">
        <div class="card p-3 mb-3">
          <div class="text-muted">{{ k }}</div>
          <div class="h4">{{ v }}</div>
        </div>
      </div>
    </div>
    <div v-if="error" class="text-danger mt-2">{{ error }}</div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import type { Stats } from '@/composables/useAuth'

const stats = ref<Stats>({})
const loading = ref(false)
const error = ref('')

async function fetchStats(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const resp = await api.get<Stats>('/dashboard/stats/')
    stats.value = resp.data ?? {}
  } catch (err) {
    const e = err as any
    error.value = e?.response?.data?.detail ?? e?.message ?? 'Failed to load stats'
  } finally {
    loading.value = false
  }
}

onMounted(() => void fetchStats())
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}
</style>
