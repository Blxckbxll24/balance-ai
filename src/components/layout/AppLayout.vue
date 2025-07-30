<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <div 
      :class="[
        'sidebar',
        'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out',
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700',
        isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
      ]"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">AI</span>
          </div>
          <span class="text-lg font-semibold text-gray-900 dark:text-white">Balance AI</span>
        </div>
        <button 
          v-if="isMobile"
          @click="toggleSidebar"
          class="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          :class="[
            'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            isActiveRoute(item.href)
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200 border-r-2 border-blue-500'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
          ]"
          @click="isMobile && closeSidebar()"
        >
          <component 
            :is="item.icon" 
            :class="[
              'mr-3 flex-shrink-0 w-5 h-5',
              isActiveRoute(item.href)
                ? 'text-blue-500'
                : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
            ]"
          />
          {{ item.name }}
        </router-link>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <UserIcon class="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">Usuario</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">admin@balanceai.com</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile sidebar overlay -->
    <div 
      v-if="isMobile && sidebarOpen"
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
      @click="closeSidebar"
    ></div>

    <!-- Main content -->
    <div 
      :class="[
        'main-content flex-1 flex flex-col transition-all duration-300 ease-in-out',
        isMobile ? 'ml-0' : 'ml-64'
      ]"
    >
      <!-- Top bar -->
      <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              v-if="isMobile"
              @click="toggleSidebar"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bars3Icon class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ currentPageTitle }}
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Theme toggle -->
            <button
              @click="toggleTheme"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <SunIcon v-if="isDark" class="w-5 h-5" />
              <MoonIcon v-else class="w-5 h-5" />
            </button>

            <!-- Notifications -->
            <button class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
              <BellIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        <div class="max-w-full mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import {
  HomeIcon,
  ChartBarIcon,
  CpuChipIcon,
  ArrowTrendingUpIcon,
  CogIcon,
  XMarkIcon,
  Bars3Icon,
  UserIcon,
  SunIcon,
  MoonIcon,
  BellIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const { isDark, toggleTheme } = useTheme()

// Navigation items
const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Análisis IA', href: '/analisis', icon: CpuChipIcon },
  { name: 'Predicciones', href: '/predicciones', icon: ArrowTrendingUpIcon },
  { name: 'Reportes', href: '/reportes', icon: ChartBarIcon },
  { name: 'Configuración', href: '/configuracion', icon: CogIcon },
]

// Sidebar state
const sidebarOpen = ref(false)
const isMobile = ref(false)

// Computed
const currentPageTitle = computed(() => {
  const currentRoute = navigation.find(item => item.href === route.path)
  return currentRoute?.name || 'Balance AI'
})

// Methods
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const isActiveRoute = (href: string) => {
  return route.path === href
}

const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    sidebarOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>

<style scoped>
.app-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
}

.sidebar {
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

/* Asegurar que no haya overflow horizontal */
.main-content main {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
</style>