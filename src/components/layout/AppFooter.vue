<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Company info -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Balance AI
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Plataforma de predicciones financieras con inteligencia artificial.
            </p>
          </div>

          <!-- Quick links -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Enlaces rápidos
            </h3>
            <ul class="mt-2 space-y-1">
              <li v-for="item in menuItems" :key="item.path">
                <router-link
                  :to="item.path"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- API Status -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Estado del Sistema
            </h3>
            <div class="mt-2 space-y-2">
              <div class="flex items-center">
                <div
                  :class="[
                    'h-2 w-2 rounded-full mr-2',
                    isOnline ? 'bg-green-400' : 'bg-red-400'
                  ]"
                ></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  API {{ isOnline ? 'Online' : 'Offline' }}
                </span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-500">
                Versión: {{ version }}
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom section -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row justify-between items-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              © {{ currentYear }} Balance AI. Todos los derechos reservados.
            </p>
            <div class="mt-2 sm:mt-0 flex space-x-4">
              <button
                @click="exportData"
                class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Exportar Datos
              </button>
              <a
                href="#"
                class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Ayuda
              </a>
              <a
                href="#"
                class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Soporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MENU_ITEMS } from '@/utils/constants'
import { useApi } from '@/composables/useApi'
import { useDashboardStore } from '@/stores/dashboard'
import { exportToCSV } from '@/utils/helpers'

const { isOnline } = useApi()
const dashboardStore = useDashboardStore()

const menuItems = MENU_ITEMS

const currentYear = computed(() => new Date().getFullYear())
const version = computed(() => import.meta.env.VITE_APP_VERSION || '1.0.0')

const exportData = () => {
  if (dashboardStore.dashboardData) {
    const exportData = [
      {
        metric: 'Total Histórico',
        value: dashboardStore.dashboardData.historical_summary.total_historical,
        currency: 'EUR'
      },
      {
        metric: 'Promedio Mensual Histórico',
        value: dashboardStore.dashboardData.historical_summary.average_monthly,
        currency: 'EUR'
      },
      {
        metric: 'Total Predicho 2025',
        value: dashboardStore.dashboardData.predictions_summary.total_predicted_2025,
        currency: 'EUR'
      },
      {
        metric: 'Promedio Mensual Predicho',
        value: dashboardStore.dashboardData.predictions_summary.average_monthly_2025,
        currency: 'EUR'
      },
      {
        metric: 'Tasa de Crecimiento',
        value: dashboardStore.dashboardData.predictions_summary.growth_rate,
        currency: '%'
      }
    ]
    
    exportToCSV(exportData, `balance-ai-dashboard-${new Date().toISOString().split('T')[0]}`)
  }
}
</script>