<template>
  <Transition name="slide-left">
    <div
      v-if="open"
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform lg:transform-none lg:static lg:inset-0"
    >
      <!-- Sidebar content -->
      <div class="flex h-full flex-col">
        <!-- Logo section -->
        <div class="flex h-16 flex-shrink-0 items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">BA</span>
              </div>
            </div>
            <div class="ml-3">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Balance AI
              </h2>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 space-y-1 px-2 py-4">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="[
              $route.path === item.path
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
            ]"
            @click="$emit('close')"
          >
            <component
              :is="getIcon(item.icon)"
              class="mr-3 h-5 w-5 flex-shrink-0"
              :class="[
                $route.path === item.path
                  ? 'text-blue-500 dark:text-blue-300'
                  : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
              ]"
            />
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Footer info -->
        <div class="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
          <div class="text-xs text-gray-500 dark:text-gray-400">
            <div class="mb-1">
              <span class="font-medium">Version:</span> 1.0.0
            </div>
            <div>
              <span class="font-medium">Última actualización:</span>
              <br>
              {{ lastUpdated }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Overlay for mobile -->
  <div
    v-if="open"
    class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
    @click="$emit('close')"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  HomeIcon,
  ChartBarIcon,
  CpuChipIcon,
  DocumentChartBarIcon,
} from '@heroicons/vue/24/outline'
import { MENU_ITEMS } from '@/utils/constants'
import { useDashboardStore } from '@/stores/dashboard'

defineProps<{
  open: boolean
}>()

defineEmits<{
  close: []
}>()

const dashboardStore = useDashboardStore()

const menuItems = MENU_ITEMS

const iconComponents = {
  HomeIcon,
  ChartBarIcon,
  CpuChipIcon,
  DocumentChartBarIcon,
}

const getIcon = (iconName: string) => {
  return iconComponents[iconName as keyof typeof iconComponents] || HomeIcon
}

const lastUpdated = computed(() => {
  if (dashboardStore.lastUpdated) {
    return dashboardStore.lastUpdated.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return 'Nunca'
})
</script>