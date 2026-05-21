<template>
  <FrappeUIProvider>
    <div class="sm:w-96">
      <div v-show="!showCamera">
        <Header></Header>
        <router-view />
      </div>
      <div v-if="showCamera">
        <Camera
          :mode="cameraMode"
          @close-event="showCamera = false"
          @capture-event="imageFile = $event"
        ></Camera>
      </div>
    </div>
  </FrappeUIProvider>
</template>
<script setup>
import { watch, inject } from 'vue'
import Header from './components/Header.vue'
import { FrappeUIProvider } from 'frappe-ui'
import Camera from './components/Camera.vue'

import { showCamera, cameraMode, imageFile } from './data/camera_context'

const employeeId = inject('employee_id')

watch(employeeId, () => {
  localStorage.setItem('employee_id', JSON.stringify(employeeId))
})
</script>
