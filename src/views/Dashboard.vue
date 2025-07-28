<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Resumen ejecutivo de predicciones y métricas clave
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" text="Cargando dashboard..." />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="rounded-md bg-red-50 dark:bg-red-900 p-4">
      <div class="flex">
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
            Error al cargar el dashboard
          </h3>
          <div class="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{{ error }}</p>
          </div>
          <div class="mt-4">
            <button
              @click="retryLoad"
              class="btn-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard content -->
    <div v-else-if="dashboardData">
      <!-- Key metrics cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Histórico"
          :value="keyMetrics?.totalHistorical || 0"
          type="currency"
          icon="CurrencyEuroIcon"
          subtitle="Datos acumulados"
        />
        <StatsCard
          title="Total Predicho 2025"
          :value="keyMetrics?.totalPredicted || 0"
          type="currency"
          icon="ArrowTrendingUpIcon"
          :change="growthRateFormatted"
          :changeType="growthRateType"
          subtitle="Proyección anual"
        />
        <StatsCard
          title="Promedio Mensual"
          :value="keyMetrics?.averageMonthlyPredicted || 0"
          type="currency"
          icon="ChartBarIcon"
          subtitle="Predicción mensual"
        />
        <StatsCard
          title="Crecimiento Total"
          :value="keyMetrics?.totalGrowth || 0"
          type="percentage"
          icon="ArrowTrendingUpIcon"
          :changeType="keyMetrics && keyMetrics.totalGrowth > 0 ? 'increase' : 'decrease'"
          subtitle="Vs. histórico"
        />
      </div>

      <!-- Charts section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent trends -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Tendencias Recientes
          </h3>
          <div v-if="recentTrendsChart" class="h-80">
            <LineChart
              :data="trendsChartData"
              :isLoading="false"
              title="Histórico vs Predicciones"
            />
          </div>
          <div v-else class="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No hay datos de tendencias disponibles
          </div>
        </div>

        <!-- Performance indicators -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Indicadores de Rendimiento
          </h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Mejor Mes</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ performanceIndicators?.bestMonth || 'N/A' }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Peor Mes</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ performanceIndicators?.worstMonth || 'N/A' }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Índice de Volatilidad</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ formatNumber(performanceIndicators?.volatilityIndex || 0) }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Última Actualización</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ lastUpdatedFormatted }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Acciones Rápidas
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link
            to="/predicciones"
            class="btn-outline text-center"
          >
            Ver Predicciones
          </router-link>
          <router-link
            to="/analisis"
            class="btn-outline text-center"
          >
            Análisis IA
          </router-link>
          <router-link
            to="/reportes"
            class="btn-outline text-center"
          >
            Generar Reporte
          </router-link>
          <button
            @click="refreshDashboard"
            :disabled="isRefreshing"
            class="btn-primary"
          >
            {{ isRefreshing ? 'Actualizando...' : 'Actualizar Datos' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        No hay datos disponibles
      </p>
      <button
        @click="loadDashboard"
        class="btn-primary"
      >
        Cargar Dashboard
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useToast } from 'vue-toastification'
import StatsCard from '@/components/ui/StatsCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import LineChart from '@/components/charts/LineChart.vue'
import { formatNumber, formatPercentage, getChangeType } from '@/utils/formatters'
import { generateMonthlyChartData } from '@/utils/helpers'

const dashboardStore = useDashboardStore()
const toast = useToast()

const isRefreshing = ref(false)

// Computed properties
const dashboardData = computed(() => dashboardStore.dashboardData)
const isLoading = computed(() => dashboardStore.isLoading('dashboard'))
const error = computed(() => dashboardStore.getError('dashboard'))
const keyMetrics = computed(() => dashboardStore.keyMetrics)
const recentTrendsChart = computed(() => dashboardStore.recentTrendsChart)
const performanceIndicators = computed(() => dashboardStore.performanceIndicators)

const growthRateFormatted = computed(() => {
  if (keyMetrics.value?.growthRate) {
    return formatPercentage(keyMetrics.value.growthRate)
  }
  return null
})

const growthRateType = computed(() => {
  if (keyMetrics.value?.growthRate) {
    return getChangeType(keyMetrics.value.growthRate, 0)
  }
  return 'neutral'
})

const lastUpdatedFormatted = computed(() => {
  if (dashboardStore.lastUpdated) {
    return dashboardStore.lastUpdated.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return 'Nunca'
})

const trendsChartData = computed(() => {
  if (recentTrendsChart.value) {
    return generateMonthlyChartData(
      recentTrendsChart.value.historical,
      recentTrendsChart.value.predicted
    )
  }
  return { labels: [], datasets: [] }
})

// Methods
const loadDashboard = async () => {
  try {
    await dashboardStore.fetchDashboardData()
    toast.success('Dashboard cargado correctamente')
  } catch (error) {
    toast.error('Error al cargar el dashboard')
    console.error('Dashboard load error:', error)
  }
}

const refreshDashboard = async () => {
  isRefreshing.value = true
  try {
    await dashboardStore.refreshDashboard()
    toast.success('Dashboard actualizado')
  } catch (error) {
    toast.error('Error al actualizar el dashboard')
    console.error('Dashboard refresh error:', error)
  } finally {
    isRefreshing.value = false
  }
}

const retryLoad = () => {
  dashboardStore.clearError('dashboard')
  loadDashboard()
}

// Lifecycle
onMounted(() => {
  if (!dashboardData.value) {
    loadDashboard()
  }
  
  // Start auto-refresh
  dashboardStore.startAutoRefresh(5)
})
</script>