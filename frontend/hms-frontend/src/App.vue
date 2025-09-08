<template>
  <div id="app">
    <NavBar v-if="isAuthenticated" :user="user" @logout="logout" />
    <div class="app-container" :class="{ 'with-sidebar': isAuthenticated }">
      <Sidebar v-if="isAuthenticated" :activeSection="activeSection" @navigate="navigateTo" />
      <main class="main-content">
        <router-view />
      </main>
    </div>
    <FooterBar v-if="isAuthenticated" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import NavBar from './components/NavBar.vue'
import Sidebar from './components/Sidebar.vue'
import FooterBar from './components/FooterBar.vue'

const router = useRouter()
const authStore = useAuthStore()

const activeSection = ref('dashboard')
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

onMounted(() => {
  // Check if user is logged in on app start
  authStore.checkAuthStatus()
})

const navigateTo = (section) => {
  activeSection.value = section
  router.push({ name: section })
}

const logout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}
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
</style>
