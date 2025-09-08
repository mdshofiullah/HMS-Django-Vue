<template>
  <div class="dashboard">
    <header class="dash-header">
      <h1>Welcome back, {{ user?.username ?? 'User' }}!</h1>
      <p class="muted">Overview of system activity</p>
    </header>

    <div class="stats-grid">
      <div class="card" v-for="(value, key) in stats" :key="key">
        <div class="card-icon"><i :class="icons[key]"></i></div>
        <div>
          <h3>{{ value }}</h3>
          <p class="muted">{{ labels[key] }}</p>
        </div>
      </div>
    </div>

    <section class="recent">
      <h2>Recent activity</h2>
      <ul class="list">
        <li v-for="a in recentActivities" :key="a.id" class="list-item">
          <div class="activity-icon"><i :class="a.icon"></i></div>
          <div>
            <p>{{ a.description }}</p>
            <small class="muted">{{ a.time }}</small>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import api from '@/services/api'

const { currentUser } = useAuth()
const user = computed(() => currentUser.value)

const stats = ref({ patients: 0, doctors: 0, appointments: 0, labTests: 0 })
const icons: Record<string, string> = {
  patients: 'fas fa-users',
  doctors: 'fas fa-user-md',
  appointments: 'fas fa-calendar-check',
  labTests: 'fas fa-flask',
}
const labels: Record<string, string> = {
  patients: 'Total Patients',
  doctors: 'Total Doctors',
  appointments: "Today's Appointments",
  labTests: 'Pending Lab Tests',
}

const recentActivities = ref([
  { id: 1, icon: 'fas fa-user-plus', description: 'New patient registered', time: '2 hours ago' },
  {
    id: 2,
    icon: 'fas fa-calendar-check',
    description: 'Appointment scheduled',
    time: '5 hours ago',
  },
])

onMounted(async () => {
  try {
    const resp = await api.get('/dashboard/stats/')
    stats.value = resp.data
  } catch (err) {
    console.warn('Dashboard stats fetch failed', err)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
.dash-header h1 {
  font-size: 1.6rem;
  margin-bottom: 2px;
}
.muted {
  color: #6b7280;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 18px;
}
.card {
  background: #fff;
  padding: 14px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
}
.card-icon {
  background: #eef2ff;
  padding: 10px;
  border-radius: 8px;
  color: #4f46e5;
}
.recent {
  margin-top: 20px;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.list-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
