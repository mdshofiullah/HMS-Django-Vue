import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import all your components
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import DashboardView from '@/components/DashboardView.vue'
import AdminDashboard from '@/components/AdminDashboard.vue'
import DoctorDashboard from '@/components/DoctorDashboard.vue'
import PatientDashboard from '@/components/PatientDashboard.vue'
import UserManagement from '@/components/UserManagement.vue'
import DepartmentManagement from '@/components/DepartmentManagement.vue'
import DoctorManagement from '@/components/DoctorManagement.vue'
import PatientManagement from '@/components/PatientManagement.vue'
import AppointmentManagement from '@/components/AppointmentManagement.vue'
import PrescriptionManagement from '@/components/PrescriptionManagement.vue'
import LabTestManagement from '@/components/LabTestManagement.vue'
import BillingManagement from '@/components/BillingManagement.vue'
import ReportManagement from '@/components/ReportManagement.vue'
import ProfileView from '@/components/ProfileView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginForm,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterForm,
    meta: { requiresAuth: false },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin-dashboard',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresRole: 'admin' },
  },
  {
    path: '/doctor-dashboard',
    name: 'doctor-dashboard',
    component: DoctorDashboard,
    meta: { requiresAuth: true, requiresRole: 'doctor' },
  },
  {
    path: '/patient-dashboard',
    name: 'patient-dashboard',
    component: PatientDashboard,
    meta: { requiresAuth: true, requiresRole: 'patient' },
  },
  {
    path: '/users',
    name: 'users',
    component: UserManagement,
    meta: { requiresAuth: true, requiresRole: 'admin' },
  },
  {
    path: '/departments',
    name: 'departments',
    component: DepartmentManagement,
    meta: { requiresAuth: true, requiresRole: 'admin' },
  },
  {
    path: '/doctors',
    name: 'doctors',
    component: DoctorManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/patients',
    name: 'patients',
    component: PatientManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/appointments',
    name: 'appointments',
    component: AppointmentManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/prescriptions',
    name: 'prescriptions',
    component: PrescriptionManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/lab-tests',
    name: 'lab-tests',
    component: LabTestManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/billing',
    name: 'billing',
    component: BillingManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'reports',
    component: ReportManagement,
    meta: { requiresAuth: true, requiresRole: 'admin' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  authStore.checkAuthStatus()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresRole && authStore.user?.role !== to.meta.requiresRole) {
    // Redirect to appropriate dashboard based on role
    if (authStore.user?.role === 'admin') {
      next({ name: 'admin-dashboard' })
    } else if (authStore.user?.role === 'doctor') {
      next({ name: 'doctor-dashboard' })
    } else if (authStore.user?.role === 'patient') {
      next({ name: 'patient-dashboard' })
    } else {
      next({ name: 'dashboard' })
    }
  } else if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    // Redirect to appropriate dashboard if already logged in
    if (authStore.user?.role === 'admin') {
      next({ name: 'admin-dashboard' })
    } else if (authStore.user?.role === 'doctor') {
      next({ name: 'doctor-dashboard' })
    } else if (authStore.user?.role === 'patient') {
      next({ name: 'patient-dashboard' })
    } else {
      next({ name: 'dashboard' })
    }
  } else {
    next()
  }
})

export default router

