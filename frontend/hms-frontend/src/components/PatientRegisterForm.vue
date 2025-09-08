<script setup lang="ts">
import { ref } from 'vue'
import api from '../services/api'
const emit = defineEmits(['registered'])
const phone_number = ref('')
const patient_id = ref('') // if your backend requires patient id + phone login; otherwise use RegisterForm

async function registerPatient() {
  try {
    // Use main register endpoint with role=patient
    // For demo we use random username
    const username = `patient_${Date.now().toString().slice(-5)}`
    const password = 'password123'
    const res = await api.post('/register/', {
      username,
      password,
      role: 'patient',
      phone_number: phone_number.value,
    })
    const loginRes = await api.post('/login/', { username, password })
    emit('registered', loginRes.data.user, loginRes.data.access)
  } catch (err: any) {
    alert(err?.response?.data || 'Patient register failed')
  }
}
</script>

<template>
  <div class="mt-4">
    <input
      v-model="phone_number"
      class="w-full p-2 border rounded mb-2"
      placeholder="Phone number"
    />
    <button class="w-full bg-orange-500 text-white py-2 rounded" @click="registerPatient">
      Quick Patient Register
    </button>
  </div>
</template>
