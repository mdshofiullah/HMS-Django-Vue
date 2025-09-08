import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initAuth } from '@/composables/useAuth'

// initialize auth (sets header and validates token) before app mount
void initAuth()

const app = createApp(App)
app.use(router)
app.mount('#app')
