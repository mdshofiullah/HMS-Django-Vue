<template>
  <div class="p-4">
    <h2>Profile</h2>
    <div v-if="loading">Loading…</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>
    <div v-else-if="user">
      <dl class="row">
        <dt class="col-sm-3">Username</dt>
        <dd class="col-sm-9">{{ user.username }}</dd>
        <dt class="col-sm-3">Name</dt>
        <dd class="col-sm-9">{{ user.first_name }} {{ user.last_name }}</dd>
        <dt class="col-sm-3">Email</dt>
        <dd class="col-sm-9">{{ user.email }}</dd>
        <dt class="col-sm-3">Role</dt>
        <dd class="col-sm-9">{{ user.role ?? (user.is_staff ? 'admin' : 'user') }}</dd>
      </dl>
    </div>
    <div v-else>No profile available</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import type { User } from '@/composables/useAuth'

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref('')

async function fetchProfile(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const resp = await api.get<User>('/profile/')
    user.value = resp.data
  } catch (err) {
    const e = err as any
    error.value = e?.response?.data?.detail ?? e?.message ?? 'Failed to load profile'
  } finally {
    loading.value = false
  }
}

onMounted(() => void fetchProfile())
</script>
