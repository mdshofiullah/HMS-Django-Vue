<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
const props = defineProps<{ user: any; isAuthenticated: boolean }>()
const emit = defineEmits(['logout'])
</script>

<template>
  <header class="bg-white shadow px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <button class="md:hidden p-2"><font-awesome-icon icon="bars" /></button>
      <div class="flex items-center gap-2">
        <font-awesome-icon icon="hospital" class="text-blue-600 text-xl" />
        <span class="font-bold">HMS</span>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div v-if="props.isAuthenticated" class="text-sm">
        <span class="mr-3">Hi, {{ props.user?.first_name || props.user?.username }}</span>
        <button @click="$emit('logout')" class="text-red-600 hover:underline">
          <font-awesome-icon icon="sign-out-alt" /> Logout
        </button>
      </div>
    </div>
  </header>
</template>
