<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ appointments: any[]; prescriptions: any[] }>()
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Patient Dashboard</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded shadow">
        <h4 class="font-medium">My Appointments</h4>
        <ul class="mt-2 space-y-1">
          <li v-for="a in props.appointments" :key="a.id" class="text-sm">
            {{ a.date }} - {{ a.doctor?.user?.first_name || 'Doctor' }} ({{ a.status }})
          </li>
        </ul>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h4 class="font-medium">My Prescriptions</h4>
        <ul class="mt-2 space-y-1">
          <li v-for="p in props.prescriptions" :key="p.id" class="text-sm">
            {{ p.medication }} - {{ p.dosage }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
