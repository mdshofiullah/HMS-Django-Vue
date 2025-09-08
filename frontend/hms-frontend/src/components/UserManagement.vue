<template>
  <div class="users">
    <div class="header">
      <h2>Users</h2>
      <div class="controls">
        <input v-model="search" placeholder="Search users" class="input" />
        <button @click="fetchUsers" class="btn">Refresh</button>
      </div>
    </div>

    <div v-if="loading" class="muted">Loading users…</div>

    <ul v-else class="user-list">
      <li v-for="u in filteredUsers" :key="u.id" class="user-item">
        <div>
          <div class="username">{{ u.username }}</div>
          <div class="muted">{{ u.email }}</div>
        </div>
        <div>
          <span class="badge" :class="roleClass(u.role)">{{ u.role ?? '—' }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const users = ref<Array<Record<string, any>>>([])
const loading = ref(false)
const search = ref('')

const fetchUsers = async () => {
  loading.value = true
  try {
    const resp = await api.get('/users/')
    users.value = resp.data
  } catch (err) {
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => void fetchUsers())

const filteredUsers = computed(() =>
  users.value.filter((u) =>
    search.value
      ? `${u.username} ${u.email}`.toLowerCase().includes(search.value.toLowerCase())
      : true,
  ),
)

function roleClass(role?: string) {
  return role === 'admin' ? 'badge-admin' : role === 'doctor' ? 'badge-doctor' : 'badge-staff'
}
</script>

<style scoped>
.users {
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input {
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.btn {
  padding: 8px 10px;
  border-radius: 6px;
  background: #efefef;
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 12px 0;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
}

.badge {
  padding: 6px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.badge-admin {
  background: #ede9fe;
  color: #6b21a8;
}

.badge-doctor {
  background: #ecfdf5;
  color: #065f46;
}

.badge-staff {
  background: #e0f2fe;
  color: #075985;
}
</style>
