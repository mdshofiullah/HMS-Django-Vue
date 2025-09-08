<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ bills: any[] }>()
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-3">Billing</h2>
    <ul class="space-y-2">
      <li v-for="b in props.bills" :key="b.id" class="bg-white p-3 rounded shadow">
        Bill #{{ b.id }} — {{ b.amount }} — {{ b.status }}
      </li>
    </ul>
  </div>
</template>

