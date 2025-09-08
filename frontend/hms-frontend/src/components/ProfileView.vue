<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ user: any }>()
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-3">Profile</h2>
    <div class="bg-white p-4 rounded shadow">
      <div><strong>Name:</strong> {{ props.user?.first_name }} {{ props.user?.last_name }}</div>
      <div><strong>Username:</strong> {{ props.user?.username }}</div>
      <div><strong>Email:</strong> {{ props.user?.email }}</div>
      <div><strong>Role:</strong> {{ props.user?.role }}</div>
    </div>
  </div>
</template>
