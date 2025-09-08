<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ prescriptions: any[] }>()
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-3">Prescriptions</h2>
    <ul class="space-y-2">
      <li v-for="p in props.prescriptions" :key="p.id" class="bg-white p-3 rounded shadow">
        {{ p.medication }} — {{ p.dosage }} ({{ p.patient?.user?.first_name }})
      </li>
    </ul>
  </div>
</template>
