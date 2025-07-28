<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Predicciones
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Análisis y visualización de predicciones financieras
      </p>
    </div>

    <!-- Tabs navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab content -->
    <div class="mt-6">
      <!-- 2025 Complete Tab -->
      <div v-if="activeTab === '2025'" class="space-y-6">
        <div class="card p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Predicciones 2025 Completo
            </h3>
            <button
              @click="loadPredictions2025"
              :disabled="isLoading2025"
              class="btn-primary"
            >
              {{ isLoading2025 ? 'Cargando...' : 'Actualizar' }}
            </button>
          </div>

          <div v-if="isLoading2025" class="flex justify-center py-8">
            <LoadingSpinner size="lg" text="Cargando predicciones 2025..." />
          </div>

          <div v-else-if="predictions2025.length > 0">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <StatsCard
                v-if="predictions2025Summary"
                title="Total Predicho"
                :value="predictions2025Summary.totalPredicted"
                type="currency"
                icon="CurrencyEuroIcon"
              />
              <StatsCard
                v-if="predictions2025Summary"
                title="Promedio Mensual"
                :value="predictions2025Summary.averageMonthly"
                type="currency"
                icon="ChartBarIcon"
              />
              <StatsCard
                v-if="predictions2025Summary"
                title="Puntos de Datos"
                :value="predictions2025Summary.dataPoints"
                type="number"
                icon="ArrowTrendingUpIcon"
              />
            </div>
            
            <div class="h-96">
              <LineChart
                :data="chartData2025"
                title="Predicciones Balance 2025"
                :isLoading="isLoading2025"
              />
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            No hay predicciones disponibles para 2025
          </div>
        </div>
      </div>

      <!-- Month Specific Tab -->
      <div v-else-if="activeTab === 'month'" class="space-y-6">
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Predicción Mes Específico
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="label">Año</label>
              <select v-model="selectedYear" class="input-field">
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
            <div>
              <label class="label">Mes</label>
              <select v-model="selectedMonth" class="input-field">
                <option v-for="(month, index) in months" :key="index" :value="index + 1">
                  {{ month }}
                </option>
              </select>
            </div>
          </div>

          <button
            @click="loadMonthPrediction"
            :disabled="isLoadingMonth"
            class="btn-primary mb-6"
          >
            {{ isLoadingMonth ? 'Cargando...' : 'Obtener Predicción' }}
          </button>

          <div v-if="isLoadingMonth" class="flex justify-center py-8">
            <LoadingSpinner size="lg" text="Cargando predicción mensual..." />
          </div>

          <div v-else-if="monthPrediction" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <StatsCard
                title="Balance Predicho"
                :value="monthPrediction.predicted_balance"
                type="currency"
                icon="CurrencyEuroIcon"
              />
              <StatsCard
                title="Límite Inferior"
                :value="monthPrediction.confidence_interval.lower"
                type="currency"
                icon="ArrowTrendingDownIcon"
              />
              <StatsCard
                title="Límite Superior"
                :value="monthPrediction.confidence_interval.upper"
                type="currency"
                icon="ArrowTrendingUpIcon"
              />
            </div>
            
            <div class="card p-4">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                Desglose Semanal
              </h4>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Semana
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Balance Predicho
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="week in monthPrediction.details.weekly_breakdown" :key="week.week">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        Semana {{ week.week }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {{ formatCurrency(week.predicted_balance) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Year Specific Tab -->
      <div v-else-if="activeTab === 'year'" class="space-y-6">
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Predicción Año Específico
          </h3>
          
          <div class="mb-6">
            <label class="label">Año</label>
            <select v-model="selectedYearForAnalysis" class="input-field max-w-xs">
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <button
            @click="loadYearPrediction"
            :disabled="isLoadingYear"
            class="btn-primary mb-6"
          >
            {{ isLoadingYear ? 'Cargando...' : 'Obtener Predicción' }}
          </button>

          <div v-if="isLoadingYear" class="flex justify-center py-8">
            <LoadingSpinner size="lg" text="Cargando predicción anual..." />
          </div>

          <div v-else-if="yearPrediction" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Predicho"
                :value="yearPrediction.total_predicted"
                type="currency"
                icon="CurrencyEuroIcon"
              />
              <StatsCard
                title="Promedio Mensual"
                :value="yearPrediction.summary.average_monthly"
                type="currency"
                icon="ChartBarIcon"
              />
              <StatsCard
                title="Mes Más Alto"
                :value="getMonthName(yearPrediction.summary.highest_month)"
                type="text"
                icon="ArrowTrendingUpIcon"
              />
              <StatsCard
                title="Tasa de Crecimiento"
                :value="yearPrediction.summary.growth_rate"
                type="percentage"
                icon="ArrowTrendingUpIcon"
                :changeType="yearPrediction.summary.growth_rate > 0 ? 'increase' : 'decrease'"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Range Specific Tab -->
      <div v-else-if="activeTab === 'range'" class="space-y-6">
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Predicción Rango Personalizado
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="label">Fecha Inicio</label>
              <input
                v-model="startDate"
                type="date"
                class="input-field"
                :min="minDate"
                :max="maxDate"
              />
            </div>
            <div>
              <label class="label">Fecha Fin</label>
              <input
                v-model="endDate"
                type="date"
                class="input-field"
                :min="startDate"
                :max="maxDate"
              />
            </div>
          </div>

          <div class="mb-6">
            <label class="label">Contexto de Mercado (Opcional)</label>
            <textarea
              v-model="marketContext"
              class="input-field"
              rows="3"
              placeholder="Describe el contexto del mercado para mejorar las predicciones..."
            ></textarea>
          </div>

          <button
            @click="loadRangePrediction"
            :disabled="isLoadingRange || !isValidDateRange"
            class="btn-primary mb-6"
          >
            {{ isLoadingRange ? 'Cargando...' : 'Obtener Predicción' }}
          </button>

          <div v-if="isLoadingRange" class="flex justify-center py-8">
            <LoadingSpinner size="lg" text="Cargando predicción de rango..." />
          </div>

          <div v-else-if="rangePrediction" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <StatsCard
                title="Total Predicho"
                :value="rangePrediction.summary.total_predicted"
                type="currency"
                icon="CurrencyEuroIcon"
              />
              <StatsCard
                title="Promedio Diario"
                :value="rangePrediction.summary.average_daily"
                type="currency"
                icon="ChartBarIcon"
              />
              <StatsCard
                title="Tendencia"
                :value="getTrendText(rangePrediction.summary.trend)"
                type="text"
                icon="ArrowTrendingUpIcon"
                :changeType="getTrendType(rangePrediction.summary.trend)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePredictionsStore } from '@/stores/predictions'
import { useToast } from 'vue-toastification'
import StatsCard from '@/components/ui/StatsCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import LineChart from '@/components/charts/LineChart.vue'
import { formatCurrency } from '@/utils/formatters'
import { generateChartData } from '@/utils/helpers'
import { MONTHS, PREDICTION_TABS } from '@/utils/constants'

const predictionsStore = usePredictionsStore()
const toast = useToast()

// State
const activeTab = ref('2025')
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)
const selectedYearForAnalysis = ref(new Date().getFullYear())
const startDate = ref('')
const endDate = ref('')
const marketContext = ref('')

// Constants
const tabs = PREDICTION_TABS
const months = MONTHS
const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i)
const minDate = new Date().toISOString().split('T')[0]
const maxDate = new Date(new Date().getFullYear() + 5, 11, 31).toISOString().split('T')[0]

// Computed
const predictions2025 = computed(() => predictionsStore.predictions2025)
const monthPrediction = computed(() => predictionsStore.monthPrediction)
const yearPrediction = computed(() => predictionsStore.yearPrediction)
const rangePrediction = computed(() => predictionsStore.rangePrediction)
const predictions2025Summary = computed(() => predictionsStore.predictions2025Summary)

const isLoading2025 = computed(() => predictionsStore.isLoading('predictions2025'))
const isLoadingMonth = computed(() => predictionsStore.isLoading('monthPrediction'))
const isLoadingYear = computed(() => predictionsStore.isLoading('yearPrediction'))
const isLoadingRange = computed(() => predictionsStore.isLoading('rangePrediction'))

const isValidDateRange = computed(() => {
  return startDate.value && endDate.value && startDate.value <= endDate.value
})

const chartData2025 = computed(() => {
  if (predictions2025.value.length > 0) {
    return generateChartData(predictions2025.value, 'Predicciones 2025')
  }
  return { labels: [], datasets: [] }
})

// Methods
const loadPredictions2025 = async () => {
  try {
    await predictionsStore.fetchPredictions2025()
    toast.success('Predicciones 2025 cargadas correctamente')
  } catch (error) {
    toast.error('Error al cargar predicciones 2025')
    console.error('Error loading 2025 predictions:', error)
  }
}

const loadMonthPrediction = async () => {
  try {
    await predictionsStore.fetchMonthPrediction(selectedYear.value, selectedMonth.value)
    toast.success(`Predicción para ${months[selectedMonth.value - 1]} ${selectedYear.value} cargada`)
  } catch (error) {
    toast.error('Error al cargar predicción mensual')
    console.error('Error loading month prediction:', error)
  }
}

const loadYearPrediction = async () => {
  try {
    await predictionsStore.fetchYearPrediction(selectedYearForAnalysis.value)
    toast.success(`Predicción para ${selectedYearForAnalysis.value} cargada`)
  } catch (error) {
    toast.error('Error al cargar predicción anual')
    console.error('Error loading year prediction:', error)
  }
}

const loadRangePrediction = async () => {
  if (!isValidDateRange.value) return
  
  try {
    await predictionsStore.fetchRangePrediction(
      startDate.value,
      endDate.value,
      marketContext.value || undefined
    )
    toast.success('Predicción de rango cargada correctamente')
  } catch (error) {
    toast.error('Error al cargar predicción de rango')
    console.error('Error loading range prediction:', error)
  }
}

const getMonthName = (monthNumber: number) => {
  return months[monthNumber - 1] || 'N/A'
}

const getTrendText = (trend: string) => {
  switch (trend) {
    case 'increasing':
      return 'Creciente'
    case 'decreasing':
      return 'Decreciente'
    default:
      return 'Estable'
  }
}

const getTrendType = (trend: string) => {
  switch (trend) {
    case 'increasing':
      return 'increase'
    case 'decreasing':
      return 'decrease'
    default:
      return 'neutral'
  }
}

// Lifecycle
onMounted(() => {
  // Set default dates
  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0)
  
  startDate.value = nextMonth.toISOString().split('T')[0]
  endDate.value = nextMonthEnd.toISOString().split('T')[0]
  
  // Load initial data
  if (predictions2025.value.length === 0) {
    loadPredictions2025()
  }
})
</script>