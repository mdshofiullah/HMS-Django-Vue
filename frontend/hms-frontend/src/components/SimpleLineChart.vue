<template>
  <div class="chart-wrapper" role="img" :aria-label="`Chart with ${labels.length} points`">
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      preserveAspectRatio="none"
    >
      <path
        :d="path"
        fill="none"
        stroke="var(--stroke, #3c8dbc)"
        stroke-width="2"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
      <g v-for="(p, i) in points" :key="i">
        <circle
          :cx="xFor(i)"
          :cy="yFor(p)"
          r="3"
          fill="white"
          stroke="var(--stroke, #3c8dbc)"
          stroke-width="1.5"
        />
      </g>
    </svg>
    <div class="labels">
      <span v-for="(l, i) in labels" :key="i" class="label">{{ l }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'

const props = defineProps<{
  labels: string[]
  points: number[]
  width?: number
  height?: number
}>()

const labels = toRef(props, 'labels')
const points = toRef(props, 'points')
const width = props.width ?? 600
const height = props.height ?? 200
const padding = 12

const min = computed(() => (points.value.length ? Math.min(...points.value) : 0))
const max = computed(() => (points.value.length ? Math.max(...points.value) : 1))
const range = computed(() => max.value - min.value || 1)

function xFor(i: number) {
  const count = Math.max(1, points.value.length - 1)
  return padding + (i / count) * (width - padding * 2)
}
function yFor(v: number) {
  // invert y for SVG coordinate space
  const normalized = (v - min.value) / range.value
  return height - padding - normalized * (height - padding * 2)
}

const path = computed(() => {
  if (!points.value.length) return ''
  return points.value.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(v)}`).join(' ')
})
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
}
.labels {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  font-size: 0.85rem;
  color: #6b7280;
}
.label {
  flex: 1;
  text-align: center;
}
svg {
  width: 100%;
  height: 180px;
  display: block;
}
</style>
