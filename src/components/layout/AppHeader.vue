<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between items-center">
        <!-- Left side -->
        <div class="flex items-center">
          <!-- Mobile menu button -->
          <button
            @click="$emit('toggle-sidebar')"
            class="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span class="sr-only">Open sidebar</span>
            <Bars3Icon class="h-6 w-6" />
          </button>

          <!-- Logo and title -->
          <div class="flex items-center ml-4 lg:ml-0">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                Balance AI
              </h1>
            </div>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <!-- API Status -->
          <div class="flex items-center space-x-2">
            <div
              :class="[
                'h-2 w-2 rounded-full',
                isOnline ? 'bg-green-400' : 'bg-red-400'
              ]"
            ></div>
            <span class="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {{ isOnline ? 'API Online' : 'API Offline' }}
            </span>
          </div>

          <!-- Theme toggle -->
          <button
            @click="toggleTheme"
            class="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          >
            <SunIcon v-if="isDark" class="h-5 w-5" />
            <MoonIcon v-else class="h-5 w-5" />
          </button>

          <!-- Refresh button -->
          <button
            @click="refreshData"
            :disabled="isRefreshing"
            class="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md disabled:opacity-50"
            title="Actualizar datos"
          >
            <ArrowPathIcon 
              :class="[
                'h-5 w-5',
                { 'animate-spin': isRefreshing }
              ]" 
            />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Bars3Icon,
  SunIcon,
  MoonIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { useTheme } from '@/composables/useTheme'
import { useApi } from '@/composables/useApi'
import { useDashboardStore } from '@/stores/dashboard'

defineEmits<{
  'toggle-sidebar': []
}>()

const { isDark, toggleTheme } = useTheme()
const { isOnline } = useApi()
const dashboardStore = useDashboardStore()

const isRefreshing = ref(false)

const refreshData = async () => {
  isRefreshing.value = true
  try {
    await dashboardStore.refreshDashboard()
  } catch (error) {
    console.error('Error refreshing data:', error)
  } finally {
    isRefreshing.value = false
  }
}
</script>