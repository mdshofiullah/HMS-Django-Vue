<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ appointments: any[] }>()
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-3">Appointments</h2>
    <ul class="space-y-2">
      <li v-for="a in props.appointments" :key="a.id" class="bg-white p-3 rounded shadow">
        {{ a.date }} {{ a.time }} — {{ a.patient?.user?.first_name }} with
        {{ a.doctor?.user?.first_name }} ({{ a.status }})
      </li>
    </ul>
  </div>
</template>

