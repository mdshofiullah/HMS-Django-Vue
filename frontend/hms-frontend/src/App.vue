<template>
  <div class="wrapper">
    <NavBar @logout="onLogout" :user="user" />
    <Sidebar @navigate="onNavigate" :active-section="activeSection" />

    <div class="content-wrapper">
      <router-view />
    </div>

    <FooterBar />

    <!-- Login modal (used when user not authenticated) -->
    <LoginForm v-if="!isAuthenticated" @logged-in="onLoggedIn" class="auth-modal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import NavBar from '@/components/NavBar.vue'
import Sidebar from '@/components/Sidebar.vue'
import FooterBar from '@/components/FooterBar.vue'
import LoginForm from '@/components/LoginForm.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { currentUser, isAuthenticated } = useAuth()

const user = computed(() => currentUser.value)
const activeSection = ref('dashboard')

function onNavigate(key: string) {
  activeSection.value = key
  // map keys to routes (basic)
  if (key === 'dashboard') router.push({ name: 'dashboard' }).catch(() => {})
  else router.push({ path: `/${key}` }).catch(() => {})
}

function onLogout() {
  // use composable logout if available
  const auth = useAuth()
  auth.logout().then(() => router.push({ name: 'login' }).catch(() => {}))
}

function onLoggedIn() {
  // Hide modal automatically when LoginForm emits logged-in
  router.push({ name: 'dashboard' }).catch(() => {})
}

// ensure we check stored token on app mount (initAuth in composable)
import { initAuth } from '@/composables/useAuth'
void initAuth()
</script>

<style>
#app {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container {
  display: flex;
  flex: 1;
}

.with-sidebar {
  margin-left: 250px;
  width: calc(100% - 250px);
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
}

/* few global tweaks to match AdminLTE layout */
.content-wrapper {
  min-height: 80vh;
  padding: 1.25rem;
  background: #f4f6f9;
}
</style>
