<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>

<template>
  <footer class="bg-gray-800 text-white py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center">
            <font-awesome-icon icon="hospital" class="h-6 w-6 text-blue-400 mr-2" />
            <span class="text-xl font-bold">HMS</span>
          </div>
          <p class="mt-4 text-gray-300">
            A modern Hospital Management System designed to streamline healthcare operations and improve patient care.
          </p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-300 hover:text-white transition">Home</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition">Services</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition">Doctors</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition">Contact</a></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Contact Info</h3>
          <ul class="space-y-2">
            <li class="flex items-center">
              <font-awesome-icon icon="map-marker-alt" class="mr-2 text-blue-400" />
              <span class="text-gray-300">123 Medical Center Drive, Healthcare City</span>
            </li>
            <li class="flex items-center">
              <font-awesome-icon icon="phone" class="mr-2 text-blue-400" />
              <span class="text-gray-300">+1 (555) 123-4567</span>
            </li>
            <li class="flex items-center">
              <font-awesome-icon icon="envelope" class="mr-2 text-blue-400" />
              <span class="text-gray-300">info@hms.example</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
        <p>&copy; 2025 Hospital Management System. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Custom styles if needed */
</style>