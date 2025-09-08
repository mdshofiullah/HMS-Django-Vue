<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ doctors?: any[] }>()
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Doctors</h2>
    <ul class="space-y-2">
      <li v-for="d in props.doctors || []" :key="d.id" class="bg-white p-3 rounded shadow">
        <div class="font-medium">{{ d.user?.first_name }} {{ d.user?.last_name }}</div>
        <div class="text-sm text-gray-500">{{ d.specialization || '—' }}</div>
      </li>
    </ul>
  </div>
</template>


