<script setup lang="ts">
import { ref, onMounted } from 'vue'

const patients = ref([])

onMounted(async () => {
  const res = await fetch('http://localhost:8000/api/patients/')
  patients.value = await res.json()
})
</script>

<template>
  <div>
    <h1>Patients</h1>
    <ul>
      <li v-for="patient in patients" :key="patient.id">
        {{ patient.name }} ({{ patient.age }}) - {{ patient.diagnosis }}
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
