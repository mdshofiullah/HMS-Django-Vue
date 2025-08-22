<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps({
  title: String,
  items: Array,
  renderItem: Function,
  icon: String,
  color: String,
  class: String
})

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  red: 'bg-red-100 text-red-600'
}
</script>

<template>
  <div :class="['bg-white rounded-lg shadow overflow-hidden', $props.class]">
    <div class="p-4 border-b border-gray-200 flex items-center">
      <div class="p-2 rounded-full mr-3" :class="colorClasses[color]">
        <font-awesome-icon :icon="icon" />
      </div>
      <h3 class="text-lg font-medium text-gray-800">{{ title }}</h3>
      <span class="ml-auto bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
        {{ items.length }}
      </span>
    </div>
    <div class="p-4 h-80 overflow-y-auto">
      <ul class="space-y-3">
        <li 
          v-for="(item, index) in items" 
          :key="index"
          class="p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div v-html="renderItem(item)"></div>
        </li>
        <li v-if="items.length === 0" class="text-center py-8 text-gray-500">
          No {{ title.toLowerCase() }} found
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>