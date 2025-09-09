<script setup lang="ts">
import { computed } from 'vue'
defineOptions({ name: 'AppSidebar' })

const props = defineProps<{ activeSection?: string }>()
const emit = defineEmits(['navigate'])

const menu = computed(() => [
  { key: 'dashboard', label: 'Dashboard', icon: 'tachometer-alt' },
  { key: 'patients', label: 'Patients', icon: 'user-injured' },
  { key: 'doctors', label: 'Doctors', icon: 'stethoscope' },
  { key: 'appointments', label: 'Appointments', icon: 'calendar-check' },
  { key: 'departments', label: 'Departments', icon: 'building' },
  { key: 'billing', label: 'Billing', icon: 'money-bill-wave' },
  { key: 'reports', label: 'Reports', icon: 'chart-bar' },
  { key: 'profile', label: 'Profile', icon: 'user' },
])
</script>

<template>
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <a href="#" class="brand-link text-center"
      ><span class="brand-text font-weight-light">HMS Admin</span></a
    >
    <div class="sidebar">
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
          <li v-for="item in menu" :key="item.key" class="nav-item">
            <a
              href="#"
              class="nav-link"
              :class="{ active: props.activeSection === item.key }"
              @click.prevent="emit('navigate', item.key)"
            >
              <i :class="`nav-icon fas fa-${item.icon}`"></i>
              <p>{{ item.label }}</p>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.brand-link {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.nav-link.active {
  background: rgba(255, 255, 255, 0.04);
  border-left: 3px solid #3c8dbc;
}
</style>
