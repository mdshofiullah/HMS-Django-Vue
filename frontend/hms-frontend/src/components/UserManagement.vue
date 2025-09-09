<template>
  <div class="users p-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>Users</h2>
      <div>
        <input v-model="search" placeholder="Search users" class="form-control form-control-sm" />
        <button @click="fetchUsers" class="btn btn-sm btn-light ml-2">Refresh</button>
      </div>
    </div>

    <div v-if="loading">Loading users…</div>
    <div v-else>
      <table class="table table-sm table-striped w-100">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in filtered" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.username }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.role ?? (u.is_staff ? 'admin' : 'user') }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="error" class="text-danger mt-2">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import type { User } from '@/composables/useAuth'

const users = ref<User[]>([])
const loading = ref(false)
const error = ref<string>('')
const search = ref<string>('')

async function fetchUsers(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const resp = await api.get<User[]>('/users/')
    users.value = resp.data ?? []
  } catch (err) {
    const e = err as any
    error.value = e?.response?.data?.detail ?? e?.message ?? 'Failed to fetch users'
  } finally {
    loading.value = false
  }
}

onMounted(() => void fetchUsers())

const filtered = computed(() => {
  if (!search.value) return users.value
  const q = search.value.toLowerCase()
  return users.value.filter((u) => `${u.username ?? ''} ${u.email ?? ''}`.toLowerCase().includes(q))
})
</script>
