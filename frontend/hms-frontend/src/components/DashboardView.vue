<template>
  <section class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-3 col-6" v-for="w in widgets" :key="w.key">
          <div class="small-box dashboard-widget" :class="w.bg">
            <div class="inner">
              <h3>{{ w.value }}</h3>
              <p>{{ w.title }}</p>
            </div>
            <div class="icon"><i :class="`fas fa-${w.icon} widget-icon`"></i></div>
            <a href="#" class="small-box-footer"
              >More info <i class="fas fa-arrow-circle-right"></i
            ></a>
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-lg-7">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title"><i class="fas fa-chart-line mr-1"></i> Patient Admissions</h3>
            </div>
            <div class="card-body">
              <!-- use the lightweight SVG chart component -->
              <SimpleLineChart :labels="labels" :points="points" />
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Doctor Availability</h3>
            </div>
            <div class="card-body p-0">
              <ul class="products-list product-list-in-card pl-2 pr-2">
                <li class="item" v-for="d in doctors" :key="d.id">
                  <div class="product-img">
                    <img :src="d.avatar" class="img-size-50 rounded-circle" />
                  </div>
                  <div class="product-info">
                    <a href="#" class="product-title">
                      {{ d.name }}
                      <span class="badge badge-info float-right">{{ d.status }}</span>
                    </a>
                    <span class="product-description">{{ d.specialty }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SimpleLineChart from '@/components/SimpleLineChart.vue'

const widgets = ref([
  { key: 'patients', title: 'New Patients', value: 150, icon: 'user-injured', bg: 'bg-info' },
  { key: 'doctors', title: 'Doctors Available', value: 53, icon: 'stethoscope', bg: 'bg-success' },
  {
    key: 'appointments',
    title: 'Appointments Today',
    value: 44,
    icon: 'calendar-check',
    bg: 'bg-warning',
  },
  {
    key: 'revenue',
    title: 'Revenue This Month',
    value: '$7,250',
    icon: 'dollar-sign',
    bg: 'bg-danger',
  },
])

const doctors = ref([
  {
    id: 1,
    name: 'Dr. Emily Parker',
    specialty: 'Cardiology',
    status: 'Available',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: 2,
    name: 'Dr. Robert Chen',
    specialty: 'Neurology',
    status: 'Busy',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: 3,
    name: 'Dr. Maria Rodriguez',
    specialty: 'Pediatrics',
    status: 'Available',
    avatar: 'https://via.placeholder.com/50',
  },
])

// sample labels/points used by SimpleLineChart
const labels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'])
const points = ref([65, 59, 80, 81, 56, 75])
</script>

<style scoped>
.small-box .inner h3 {
  font-size: 1.6rem;
}
.dashboard-widget {
  padding: 1rem;
  color: #fff;
  border-radius: 8px;
}
.bg-info {
  background: linear-gradient(45deg, #3c8dbc, #4da0db);
}
.bg-success {
  background: linear-gradient(45deg, #00a65a, #3dd06a);
}
.bg-warning {
  background: linear-gradient(45deg, #f39c12, #f6b04f);
}
.bg-danger {
  background: linear-gradient(45deg, #dd4b39, #f46a5a);
}
</style>
