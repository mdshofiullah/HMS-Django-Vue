import { createApp } from 'vue'
import App from './App.vue'
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
  faUser as faUserSolid
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import your CSS file
import './assets/dashboard.css'

// Add icons to the library
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
  faUserSolid
)

// Create the app and register the FontAwesomeIcon component globally
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')