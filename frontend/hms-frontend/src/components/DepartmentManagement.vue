<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ departments: any[] }>()
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-3">Departments</h2>
    <ul class="space-y-2">
      <li v-for="d in props.departments" :key="d.id" class="bg-white p-3 rounded shadow">
        {{ d.name }} — {{ d.description }}
      </li>
    </ul>
  </div>
</template>
