<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ appointments?: any[]; prescriptions?: any[] }>()
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">My Dashboard</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded shadow">
        <h4 class="font-medium">Appointments</h4>
        <ul class="mt-2 space-y-1">
          <li v-for="a in props.appointments || []" :key="a.id">
            {{ a.date }} — {{ a.doctor?.user?.first_name || 'Doctor' }} ({{ a.status }})
          </li>
        </ul>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h4 class="font-medium">Prescriptions</h4>
        <ul class="mt-2 space-y-1">
          <li v-for="p in props.prescriptions || []" :key="p.id">
            {{ p.medication }} — {{ p.dosage }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
