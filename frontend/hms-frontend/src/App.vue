<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Sidebar from './components/Sidebar.vue'
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import DashboardView from './components/DashboardView.vue'
import PatientDashboard from './components/PatientDashboard.vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import PatientRegisterForm from './components/PatientRegisterForm.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUserDoctor,
  faUserInjured,
  faHospital,
  faCalendarCheck,
  faPrescriptionBottle,
  faChartLine,
  faSignOutAlt,
  faBars,
  faTimes,
  faUser,
  faLock,
  faExclamationCircle,
  faCheckCircle,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faPlus,
  faEdit,
  faTrash,
  faDownload,
  faUsers,
  faBuilding,
  faFlask,
  faCreditCard,
  faChartBar,
  faCalendar,
  faFileMedical,
  faCog,
  faUserCog,
  faNotesMedical,
  faFileInvoiceDollar,
} from '@fortawesome/free-solid-svg-icons'
import api from './services/api'
import './assets/dashboard.css'

library.add(
  faUserDoctor,
  faUserInjured,
  faHospital,
  faCalendarCheck,
  faPrescriptionBottle,
  faChartLine,
  faSignOutAlt,
  faBars,
  faTimes,
  faUser,
  faLock,
  faExclamationCircle,
  faCheckCircle,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faPlus,
  faEdit,
  faTrash,
  faDownload,
  faUsers,
  faBuilding,
  faFlask,
  faCreditCard,
  faChartBar,
  faCalendar,
  faFileMedical,
  faCog,
  faUserCog,
  faNotesMedical,
  faFileInvoiceDollar,
)

// Reactive variables
const doctors = ref([])
const patients = ref([])
const departments = ref([])
const appointments = ref([])
const prescriptions = ref([])
const labTests = ref([])
const bills = ref([])
const users = ref([])
const isAuthenticated = ref(false)
const currentUser = ref(null)
const isLoading = ref(true)
const activeSection = ref('dashboard')
const mobileMenuOpen = ref(false)
const dashboardStats = ref({})
const showPatientRegistration = ref(false)
const showAppointmentForm = ref(false)
const showPrescriptionForm = ref(false)
const showUserForm = ref(false)
const editingItem = ref(null)
const editingItemType = ref('')

// Check if user is logged in on app load
onMounted(() => {
  const token = localStorage.getItem('access_token')
  const userData = localStorage.getItem('user')

  if (token && userData) {
    isAuthenticated.value = true
    currentUser.value = JSON.parse(userData)
    fetchData()
  } else {
    isLoading.value = false
  }
})

// Fetch data from API with authentication
const fetchData = async () => {
  const token = localStorage.getItem('access_token')

  if (!token) {
    isLoading.value = false
    return
  }

  try {
    const endpoints = [
      '/doctors/',
      '/patients/',
      '/departments/',
      '/appointments/',
      '/prescriptions/',
      '/lab-tests/',
      '/bills/',
    ]

    // Add users endpoint for admin
    if (currentUser.value?.role === 'admin') {
      endpoints.push('/users/')
    }

    const responses = await Promise.all(endpoints.map((endpoint) => api.get(endpoint)))

    doctors.value = responses[0].data
    patients.value = responses[1].data
    departments.value = responses[2].data
    appointments.value = responses[3].data
    prescriptions.value = responses[4].data
    labTests.value = responses[5].data
    bills.value = responses[6].data

    // Set users if admin
    if (currentUser.value?.role === 'admin' && responses.length > 7) {
      users.value = responses[7].data
    }

    // Fetch dashboard stats
    await fetchDashboardStats()
  } catch (error) {
    console.error('Error fetching data:', error)
    if (error.response?.status === 401) {
      handleLogout()
    }
  } finally {
    isLoading.value = false
  }
}

// Fetch dashboard stats
const fetchDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats/')
    dashboardStats.value = response.data
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  }
}

// Handle login
const handleLogin = (userData: any, token: string) => {
  isAuthenticated.value = true
  currentUser.value = userData
  localStorage.setItem('access_token', token)
  localStorage.setItem('user', JSON.stringify(userData))
  fetchData()
}

// Handle logout
const handleLogout = () => {
  isAuthenticated.value = false
  currentUser.value = null
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  // Clear all data
  doctors.value = []
  patients.value = []
  departments.value = []
  appointments.value = []
  prescriptions.value = []
  labTests.value = []
  bills.value = []
  users.value = []
  mobileMenuOpen.value = false
}

// Set active section
const setActiveSection = (section: string) => {
  activeSection.value = section
  mobileMenuOpen.value = false
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Handle creating a new patient
const handleCreatePatient = () => {
  showPatientRegistration.value = true
}

// Handle creating a new appointment
const handleCreateAppointment = () => {
  showAppointmentForm.value = true
  editingItem.value = null
  editingItemType.value = 'appointment'
}

// Handle creating a new prescription
const handleCreatePrescription = () => {
  showPrescriptionForm.value = true
  editingItem.value = null
  editingItemType.value = 'prescription'
}

// Handle creating a new user (admin only)
const handleCreateUser = () => {
  showUserForm.value = true
  editingItem.value = null
  editingItemType.value = 'user'
}

// Handle editing an item
const handleEditItem = (item: any, type: string) => {
  if (type === 'appointment') {
    showAppointmentForm.value = true
    editingItem.value = item
    editingItemType.value = 'appointment'
  } else if (type === 'prescription') {
    showPrescriptionForm.value = true
    editingItem.value = item
    editingItemType.value = 'prescription'
  } else if (type === 'user') {
    showUserForm.value = true
    editingItem.value = item
    editingItemType.value = 'user'
  }
}

// Handle deleting an item
const handleDeleteItem = async (item: any, type: string) => {
  if (!confirm(`Are you sure you want to delete this ${type}?`)) return

  try {
    const response = await api.delete(`/${type}s/${item.id}/`)

    if (response.status === 204) {
      // Refresh data
      fetchData()
    } else {
      console.error('Failed to delete item')
    }
  } catch (error) {
    console.error('Error deleting item:', error)
  }
}

// Handle downloading a report
const handleDownloadReport = (item: any, type: string) => {
  // Implement download functionality
  console.log(`Downloading ${type}:`, item)
  // This would typically generate a PDF or other document
  alert(`Downloading ${type} report for ${item.patient?.user?.first_name || item.user?.first_name}`)
}

// Handle patient registration
const handlePatientRegistered = () => {
  showPatientRegistration.value = false
  fetchData() // Refresh data to show the new patient
}

// Handle user registration/update
const handleUserUpdated = () => {
  showUserForm.value = false
  fetchData() // Refresh data
}

// Handle appointment creation/update
const handleAppointmentUpdated = () => {
  showAppointmentForm.value = false
  fetchData() // Refresh data
}

// Handle prescription creation/update
const handlePrescriptionUpdated = () => {
  showPrescriptionForm.value = false
  fetchData() // Refresh data
}

// Format doctor information
const doctorItem = (doctor: any) => {
  const userName = doctor.user ? `${doctor.user.first_name} ${doctor.user.last_name}` : 'Unknown'
  return `<strong>Dr. ${userName}</strong><br>Specialization: ${doctor.specialization || 'N/A'}<br>Department: ${doctor.department?.name || 'N/A'}`
}

// Format patient information
const patientItem = (patient: any) => {
  const userName = patient.user ? `${patient.user.first_name} ${patient.user.last_name}` : 'Unknown'
  // Calculate age from date_of_birth if available
  let age = 'N/A'
  if (patient.date_of_birth) {
    const birthDate = new Date(patient.date_of_birth)
    const today = new Date()
    age = (today.getFullYear() - birthDate.getFullYear()).toString()
  }
  return `<strong>${userName}</strong><br>Age: ${age} | Blood Group: ${patient.blood_group || 'N/A'}<br>Address: ${patient.address || 'N/A'}`
}

// Format department information
const departmentItem = (dept: any) =>
  `<strong>${dept.name}</strong><br>${dept.description || 'No description available'}`

// Format appointment information
const appointmentItem = (appt: any) => {
  const patientName = appt.patient?.user
    ? `${appt.patient.user.first_name} ${appt.patient.user.last_name}`
    : 'Unknown'
  const doctorName = appt.doctor?.user
    ? `Dr. ${appt.doctor.user.first_name} ${appt.doctor.user.last_name}`
    : 'Unknown'
  return `<strong>${patientName}</strong> with <strong>${doctorName}</strong><br>Date: ${appt.date} at ${appt.time}<br>Status: ${appt.status}`
}

// Format prescription information
const prescriptionItem = (pres: any) => {
  const patientName = pres.patient?.user
    ? `${pres.patient.user.first_name} ${pres.patient.user.last_name}`
    : 'Unknown'
  const doctorName = pres.doctor?.user
    ? `Dr. ${pres.doctor.user.first_name} ${pres.doctor.user.last_name}`
    : 'Unknown'
  return `<strong>${pres.medication}</strong><br>Dosage: ${pres.dosage}<br>Instructions: ${pres.instructions || 'N/A'}<br>For: ${patientName} by ${doctorName}`
}

// Format user information
const userItem = (user: any) => {
  return `<strong>${user.first_name} ${user.last_name}</strong><br>Username: ${user.username}<br>Role: ${user.role}<br>Email: ${user.email}`
}

// Stats for dashboard
const stats = computed(() => {
  if (currentUser.value?.role === 'admin') {
    return [
      {
        title: 'Total Patients',
        value: dashboardStats.value.total_patients || patients.value.length,
        icon: 'user-injured',
        color: 'green',
      },
      {
        title: 'Total Doctors',
        value: dashboardStats.value.total_doctors || doctors.value.length,
        icon: 'user-doctor',
        color: 'blue',
      },
      {
        title: 'Total Appointments',
        value: dashboardStats.value.total_appointments || appointments.value.length,
        icon: 'calendar-check',
        color: 'purple',
      },
      {
        title: 'Departments',
        value: dashboardStats.value.total_departments || departments.value.length,
        icon: 'hospital',
        color: 'red',
      },
      {
        title: 'Recent Appointments',
        value: dashboardStats.value.recent_appointments || 0,
        icon: 'calendar',
        color: 'yellow',
      },
      {
        title: 'Pending Bills',
        value:
          dashboardStats.value.pending_bills ||
          bills.value.filter((b) => b.status === 'pending').length,
        icon: 'credit-card',
        color: 'indigo',
      },
    ]
  } else if (currentUser.value?.role === 'doctor') {
    return [
      {
        title: 'Total Patients',
        value: dashboardStats.value.total_patients || patients.value.length,
        icon: 'user-injured',
        color: 'green',
      },
      {
        title: 'My Appointments',
        value: dashboardStats.value.my_appointments || appointments.value.length,
        icon: 'calendar-check',
        color: 'blue',
      },
      {
        title: "Today's Appointments",
        value: dashboardStats.value.today_appointments || 0,
        icon: 'calendar',
        color: 'purple',
      },
      {
        title: 'My Prescriptions',
        value: dashboardStats.value.my_prescriptions || prescriptions.value.length,
        icon: 'prescription-bottle',
        color: 'red',
      },
    ]
  } else if (currentUser.value?.role === 'patient') {
    return [
      {
        title: 'My Appointments',
        value: dashboardStats.value.my_appointments || appointments.value.length,
        icon: 'calendar-check',
        color: 'blue',
      },
      {
        title: 'My Prescriptions',
        value: dashboardStats.value.my_prescriptions || prescriptions.value.length,
        icon: 'prescription-bottle',
        color: 'green',
      },
      {
        title: 'My Lab Tests',
        value: dashboardStats.value.my_lab_tests || labTests.value.length,
        icon: 'flask',
        color: 'purple',
      },
      {
        title: 'Pending Bills',
        value:
          dashboardStats.value.pending_bills ||
          bills.value.filter((b) => b.status === 'pending').length,
        icon: 'credit-card',
        color: 'red',
      },
    ]
  } else if (currentUser.value?.role === 'lab') {
    return [
      {
        title: 'Total Tests',
        value: dashboardStats.value.total_tests || labTests.value.length,
        icon: 'flask',
        color: 'blue',
      },
      {
        title: 'My Tests',
        value: dashboardStats.value.my_tests || labTests.value.length,
        icon: 'flask',
        color: 'green',
      },
      {
        title: 'Pending Tests',
        value:
          dashboardStats.value.pending_tests ||
          labTests.value.filter((t) => t.status === 'pending').length,
        icon: 'hourglass-half',
        color: 'yellow',
      },
      {
        title: 'Completed Tests',
        value:
          dashboardStats.value.completed_tests ||
          labTests.value.filter((t) => t.status === 'completed').length,
        icon: 'check-circle',
        color: 'purple',
      },
    ]
  }

  return []
})

// Component for rendering different sections based on role
const renderDashboard = () => {
  if (!currentUser.value) return DashboardView

  switch (currentUser.value.role) {
    case 'admin':
      return AdminDashboard
    case 'patient':
      return PatientDashboard
    default:
      return DashboardView
  }
}

// Component for rendering different sections
const renderSection = () => {
  switch (activeSection.value) {
    case 'dashboard':
      return renderDashboard()
    case 'users':
      return () => import('./components/UserManagement.vue')
    case 'departments':
      return () => import('./components/DepartmentManagement.vue')
    case 'doctors':
      return () => import('./components/DoctorManagement.vue')
    case 'patients':
      return () => import('./components/PatientManagement.vue')
    case 'appointments':
      return () => import('./components/AppointmentManagement.vue')
    case 'prescriptions':
      return () => import('./components/PrescriptionManagement.vue')
    case 'lab-tests':
      return () => import('./components/LabTestManagement.vue')
    case 'billing':
      return () => import('./components/BillingManagement.vue')
    case 'reports':
      return () => import('./components/ReportManagement.vue')
    case 'profile':
      return () => import('./components/ProfileView.vue')
    default:
      return renderDashboard()
  }
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <NavBar
      :isAuthenticated="isAuthenticated"
      :user="currentUser"
      @logout="handleLogout"
      :activeSection="activeSection"
      @setActiveSection="setActiveSection"
      :mobileMenuOpen="mobileMenuOpen"
      @toggleMobileMenu="toggleMobileMenu"
    />

    <div class="flex flex-1 overflow-hidden">
      <Sidebar
        :isAuthenticated="isAuthenticated"
        :user="currentUser"
        :activeSection="activeSection"
        @setActiveSection="setActiveSection"
        :mobileMenuOpen="mobileMenuOpen"
        @toggleMobileMenu="toggleMobileMenu"
      />

      <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
        <div v-if="isLoading" class="flex justify-center items-center h-64">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          ></div>
        </div>

        <div v-else-if="isAuthenticated">
          <!-- Dynamic section rendering based on activeSection -->
          <component
            :is="renderSection()"
            :stats="stats"
            :user="currentUser"
            :doctors="doctors"
            :patients="patients"
            :departments="departments"
            :appointments="appointments"
            :prescriptions="prescriptions"
            :labTests="labTests"
            :bills="bills"
            :users="users"
            @create-patient="handleCreatePatient"
            @create-appointment="handleCreateAppointment"
            @create-prescription="handleCreatePrescription"
            @create-user="handleCreateUser"
            @edit-item="handleEditItem"
            @delete-item="handleDeleteItem"
            @download-report="handleDownloadReport"
          />
        </div>

        <div v-else>
          <!-- Login/Register view -->
          <div
            class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-10"
          >
            <div class="p-8">
              <div class="flex justify-center mb-6">
                <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <font-awesome-icon icon="hospital" class="text-3xl text-blue-500" />
                </div>
              </div>
              <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">
                Hospital Management System
              </h2>
              <p class="text-center text-gray-600 mb-8">Please login or register to continue</p>

              <LoginForm @login="handleLogin" />
              <RegisterForm @registered="handleLogin" />
            </div>
          </div>
        </div>
      </main>
    </div>

    <FooterBar />
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
