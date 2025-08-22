<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
import DashboardSection from './components/DashboardSection.vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
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
} from '@fortawesome/free-solid-svg-icons'
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
)

const doctors = ref([])
const patients = ref([])
const departments = ref([])
const appointments = ref([])
const prescriptions = ref([])
const isAuthenticated = ref(false)
const currentUser = ref(null)
const isLoading = ref(true)
const activeSection = ref('dashboard')
const mobileMenuOpen = ref(false)

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
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    const [doctorsRes, patientsRes, departmentsRes, appointmentsRes, prescriptionsRes] =
      await Promise.all([
        fetch('http://localhost:8000/api/doctors/', { headers }),
        fetch('http://localhost:8000/api/patients/', { headers }),
        fetch('http://localhost:8000/api/departments/', { headers }),
        fetch('http://localhost:8000/api/appointments/', { headers }),
        fetch('http://localhost:8000/api/prescriptions/', { headers }),
      ])

    if (doctorsRes.ok) doctors.value = await doctorsRes.json()
    if (patientsRes.ok) patients.value = await patientsRes.json()
    if (departmentsRes.ok) departments.value = await departmentsRes.json()
    if (appointmentsRes.ok) appointments.value = await appointmentsRes.json()
    if (prescriptionsRes.ok) prescriptions.value = await prescriptionsRes.json()
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
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

// Stats for dashboard
const stats = computed(() => [
  { title: 'Doctors', value: doctors.value.length, icon: 'user-doctor', color: 'blue' },
  { title: 'Patients', value: patients.value.length, icon: 'user-injured', color: 'green' },
  { title: 'Departments', value: departments.value.length, icon: 'hospital', color: 'purple' },
  {
    title: 'Appointments',
    value: appointments.value.length,
    icon: 'calendar-check',
    color: 'orange',
  },
  {
    title: 'Prescriptions',
    value: prescriptions.value.length,
    icon: 'prescription-bottle',
    color: 'red',
  },
])
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <NavBar
      :isAuthenticated="isAuthenticated"
      :user="currentUser"
      @logout="handleLogout"
      :activeSection="activeSection"
      @setActiveSection="setActiveSection"
      :mobileMenuOpen="mobileMenuOpen"
      @toggleMobileMenu="toggleMobileMenu"
    />

    <main class="flex-1 p-4 md:p-6">
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <div v-else-if="isAuthenticated">
        <div v-if="activeSection === 'dashboard'">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Hospital Management System Dashboard
          </h1>

          <!-- Stats Overview -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            <div
              v-for="stat in stats"
              :key="stat.title"
              class="bg-white rounded-lg shadow p-4 flex items-center"
              :class="`border-l-4 border-${stat.color}-500`"
            >
              <div class="mr-4 p-3 rounded-full bg-gray-100">
                <font-awesome-icon
                  :icon="stat.icon"
                  class="text-xl"
                  :class="`text-${stat.color}-500`"
                />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800">{{ stat.value }}</p>
                <p class="text-gray-600">{{ stat.title }}</p>
              </div>
            </div>
          </div>

          <!-- Main Dashboard Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardSection
              title="Doctors"
              :items="doctors"
              :renderItem="doctorItem"
              icon="user-doctor"
              color="blue"
            />
            <DashboardSection
              title="Patients"
              :items="patients"
              :renderItem="patientItem"
              icon="user-injured"
              color="green"
            />
            <DashboardSection
              title="Departments"
              :items="departments"
              :renderItem="departmentItem"
              icon="hospital"
              color="purple"
            />
            <DashboardSection
              title="Appointments"
              :items="appointments"
              :renderItem="appointmentItem"
              icon="calendar-check"
              color="orange"
            />
            <DashboardSection
              title="Prescriptions"
              :items="prescriptions"
              :renderItem="prescriptionItem"
              icon="prescription-bottle"
              color="red"
              class="lg:col-span-2"
            />
          </div>
        </div>

        <div v-else-if="activeSection === 'profile'" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-6">User Profile</h2>
          <div v-if="currentUser" class="space-y-4">
            <div class="flex items-center">
              <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <font-awesome-icon icon="user" class="text-3xl text-blue-500" />
              </div>
              <div>
                <h3 class="text-xl font-semibold">
                  {{ currentUser.first_name }} {{ currentUser.last_name }}
                </h3>
                <p class="text-gray-600 capitalize">{{ currentUser.role }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Username</label>
                <p class="mt-1 p-2 bg-gray-50 rounded-md">{{ currentUser.username }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="mt-1 p-2 bg-gray-50 rounded-md">{{ currentUser.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
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
    </main>

    <FooterBar />
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
