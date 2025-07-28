<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <Transition name="slide-left">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-40 lg:hidden"
        @click="closeSidebar"
      >
        <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
      </div>
    </Transition>

    <AppSidebar
      :open="sidebarOpen"
      @close="closeSidebar"
    />

    <!-- Main content -->
    <div class="lg:pl-64">
      <AppHeader @toggle-sidebar="toggleSidebar" />
      
      <main class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Transition name="fade" mode="out-in">
            <slot />
          </Transition>
        </div>
      </main>
      
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppFooter from './AppFooter.vue'

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

// Close sidebar on larger screens
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>