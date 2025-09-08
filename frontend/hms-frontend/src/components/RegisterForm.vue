<template>
  <div class="auth-card">
    <h2>Create account</h2>
    <form @submit.prevent="onSubmit" class="form">
      <input v-model="username" placeholder="Username" required class="input" />
      <input v-model="email" type="email" placeholder="Email" required class="input" />
      <input
        v-model="password"
        type="password"
        autocomplete="new-password"
        placeholder="Password"
        required
        class="input"
      />
      <input
        v-model="confirmPassword"
        type="password"
        autocomplete="new-password"
        placeholder="Confirm Password"
        required
        class="input"
      />
      <label class="label">Role</label>
      <select v-model="role" class="input">
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
        <option value="nurse">Nurse</option>
        <option value="staff">Staff</option>
        <option value="admin">Admin</option>
      </select>

      <div v-if="error" class="alert error">{{ error }}</div>
      <div v-if="success" class="alert success">{{ success }}</div>

      <button :disabled="loading" class="btn primary">
        {{ loading ? 'Creating…' : 'Create account' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
const { register } = useAuth()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('patient')
const loading = ref(false)
const error = ref('')
const success = ref('')

async function onSubmit() {
  error.value = ''
  success.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }
  loading.value = true
  try {
    const res = await register({
      username: username.value,
      email: email.value,
      password: password.value,
      role: role.value,
    })
    if (res.success) {
      success.value = 'Registration successful — please sign in'
    } else {
      error.value = res.error ?? 'Registration failed'
    }
  } catch (err) {
    console.error('Register error', err)
    error.value = 'Registration failed. See server logs for details.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card {
  max-width: 780px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}
.form {
  display: grid;
  gap: 12px;
}
.input {
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}
.btn {
  padding: 10px;
  border-radius: 6px;
  border: none;
}
.primary {
  background: #1a75bc;
  color: #fff;
}
.alert {
  padding: 8px;
  border-radius: 6px;
}
.error {
  background: #fff1f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}
.success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #bbf7d0;
}
.label {
  font-weight: 600;
}
@media (max-width: 640px) {
  .auth-card {
    margin: 12px;
  }
}
</style>
