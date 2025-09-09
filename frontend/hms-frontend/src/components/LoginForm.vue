<template>
  <div class="auth-card">
    <h2>Sign in</h2>
    <form @submit.prevent="onSubmit" class="form">
      <input v-model="username" placeholder="Username" required class="input" />
      <input
        v-model="password"
        type="password"
        autocomplete="current-password"
        placeholder="Password"
        required
        class="input"
      />
      <div v-if="error" class="alert error">{{ error }}</div>
      <button :disabled="loading" class="btn primary">
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    const res = await login(username.value, password.value)
    if (res.success) {
      // after successful login go to root/dashboard
      await router.replace({ path: '/' })
    } else {
      error.value = res.error ?? 'Login failed'
    }
  } catch (err) {
    console.error('Login error', err)
    error.value = 'Login failed. Check console/network for details.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card {
  max-width: 420px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input {
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  width: 100%;
}
.btn {
  padding: 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
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
@media (max-width: 640px) {
  .auth-card {
    margin: 12px;
  }
}
</style>
