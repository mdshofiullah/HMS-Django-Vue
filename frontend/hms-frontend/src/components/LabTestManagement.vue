<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ labTests: any[] }>()
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-3">Lab Tests</h2>
    <ul class="space-y-2">
      <li v-for="t in props.labTests" :key="t.id" class="bg-white p-3 rounded shadow">
        {{ t.test_name }} — {{ t.status }} ({{ t.patient?.user?.first_name }})
      </li>
    </ul>
  </div>
</template>


