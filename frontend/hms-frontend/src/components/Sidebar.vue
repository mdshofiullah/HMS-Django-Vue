<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ activeSection?: string }>()
const emit = defineEmits(['set-section'])

const menu = computed(() => [
  { key: 'dashboard', label: 'Dashboard', icon: 'chart-bar' },
  { key: 'doctors', label: 'Doctors', icon: 'user' },
  { key: 'patients', label: 'Patients', icon: 'users' },
  { key: 'departments', label: 'Departments', icon: 'building' },
  { key: 'appointments', label: 'Appointments', icon: 'calendar-check' },
  { key: 'prescriptions', label: 'Prescriptions', icon: 'prescription-bottle' },
  { key: 'lab-tests', label: 'Lab Tests', icon: 'flask' },
  { key: 'billing', label: 'Billing', icon: 'credit-card' },
  { key: 'reports', label: 'Reports', icon: 'chart-bar' },
  { key: 'profile', label: 'Profile', icon: 'user' },
])
</script>

<template>
  <aside class="w-64 bg-white border-r hidden md:block">
    <div class="p-4">
      <ul class="space-y-2">
        <li
          v-for="item in menu"
          :key="item.key"
          @click="emit('set-section', item.key)"
          class="p-2 rounded hover:bg-blue-50 cursor-pointer"
          :class="{ 'bg-blue-50': props.activeSection === item.key }"
        >
          <div class="flex items-center gap-3">
            <font-awesome-icon :icon="item.icon" />
            <span>{{ item.label }}</span>
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>
