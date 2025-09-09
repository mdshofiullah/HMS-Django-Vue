import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import DashboardView from '@/components/DashboardView.vue'
import AdminDashboard from '@/components/AdminDashboard.vue'
import DoctorDashboard from '@/components/DoctorDashboard.vue'
import PatientDashboard from '@/components/PatientDashboard.vue'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
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
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'login', component: LoginForm, meta: { requiresAuth: false } },
  { path: '/register', name: 'register', component: RegisterForm, meta: { requiresAuth: false } },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
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
  { path: '/doctors', name: 'doctors', component: DoctorManagement, meta: { requiresAuth: true } },
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
  { path: '/billing', name: 'billing', component: BillingManagement, meta: { requiresAuth: true } },
  {
    path: '/reports',
    name: 'reports',
    component: ReportManagement,
    meta: { requiresAuth: true, requiresRole: 'admin' },
  },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    const { isAuthenticated, currentUser } = useAuth()
    // ensure auth initialized
    // initAuth is called in main.ts so store should be ready, but guard will redirect if not authenticated
    const isAuth = (isAuthenticated as any).value as boolean
    const user = (currentUser as any).value as { role?: string } | null

    if (to.meta.requiresAuth && !isAuth) {
      next({ name: 'login' })
      return
    }

    if (to.meta.requiresRole && user?.role !== to.meta.requiresRole) {
      // redirect to appropriate dashboard or login
      if (!isAuth) next({ name: 'login' })
      else if (user?.role === 'admin') next({ name: 'admin-dashboard' })
      else if (user?.role === 'doctor') next({ name: 'doctor-dashboard' })
      else if (user?.role === 'patient') next({ name: 'patient-dashboard' })
      else next({ name: 'dashboard' })
      return
    }

    if ((to.name === 'login' || to.name === 'register') && isAuth) {
      // already logged in -> redirect to role dashboard
      if (user?.role === 'admin') next({ name: 'admin-dashboard' })
      else if (user?.role === 'doctor') next({ name: 'doctor-dashboard' })
      else if (user?.role === 'patient') next({ name: 'patient-dashboard' })
      else next({ name: 'dashboard' })
      return
    }

    next()
  },
)

export default router
