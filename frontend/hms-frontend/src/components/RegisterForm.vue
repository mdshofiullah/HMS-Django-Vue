<template>
  <div class="auth-page container mt-5">
    <div class="card mx-auto" style="max-width: 720px">
      <div class="card-header"><h3>Create account</h3></div>
      <div class="card-body">
        <form @submit.prevent="submit">
          <div class="form-row">
            <div class="form-group col-md-6">
              <label>Username</label>
              <input v-model="username" required class="form-control" />
            </div>
            <div class="form-group col-md-6">
              <label>Email</label>
              <input v-model="email" type="email" required class="form-control" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-md-6">
              <label>Password</label>
              <input
                v-model="password"
                type="password"
                autocomplete="new-password"
                required
                class="form-control"
              />
            </div>
            <div class="form-group col-md-6">
              <label>Confirm Password</label>
              <input
                v-model="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                class="form-control"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Role</label>
            <select v-model="role" class="form-control">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <div v-if="success" class="alert alert-success">{{ success }}</div>

          <div class="text-right">
            <button :disabled="loading" class="btn btn-primary">
              {{ loading ? 'Creating…' : 'Create account' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('patient')
const loading = ref(false)
const error = ref('')
const success = ref('')

function safeParse(text: string | null) {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

async function submit() {
  error.value = ''
  success.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  loading.value = true
  try {
    // prefer api.post; fallback to fetch so invalid JSON won't throw globally
    let resp, data
    try {
      resp = await api.post('/register/', {
        username: username.value,
        email: email.value,
        password: password.value,
        role: role.value,
      })
      data = resp.data
    } catch (e: any) {
      const r = await fetch('/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.value,
          email: email.value,
          password: password.value,
          role: role.value,
        }),
      })
      const txt = await r.text()
      data = safeParse(txt)
      if (!r.ok) throw { response: { data } }
    }

    success.value = 'Registration successful. Please login.'
    // optionally redirect to login
    router.push({ name: 'login' }).catch(() => {})
  } catch (err: any) {
    const d = err?.response?.data
    if (d && typeof d === 'object') {
      // join field errors
      error.value = Object.values(d)
        .map((v: any) => (Array.isArray(v) ? v.join(' ') : String(v)))
        .join(' — ')
    } else {
      error.value = err?.message ?? 'Registration failed'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  padding: 20px;
}
</style>
