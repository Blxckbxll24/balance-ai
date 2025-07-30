<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">
              🔮 Predicciones Inteligentes
            </h1>
            <p class="text-blue-100 mt-2">
              Análisis predictivo avanzado con IA para optimizar tu negocio
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="refreshAllPredictions"
              :disabled="isAnyLoading"
              class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
            >
              <ArrowPathIcon :class="['w-5 h-5', isAnyLoading ? 'animate-spin' : '']" />
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Control Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <CogIcon class="w-6 h-6 mr-2 text-blue-500" />
          Panel de Control
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Predicciones 2025 -->
          <button
            @click="loadPredictions2025"
            :disabled="predictionsStore.isLoading('predictions2025')"
            class="p-4 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
          >
            <ChartBarIcon class="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p class="text-sm font-medium text-gray-900 dark:text-white">Predicciones 2025</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Proyección anual completa</p>
          </button>

          <!-- Predicción por Año -->
          <div class="p-4 border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg">
            <CalendarIcon class="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div class="space-y-2">
              <input
                v-model="selectedYear"
                type="number"
                :min="2024"
                :max="2030"
                class="w-full px-2 py-1 text-sm border rounded text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Año"
              >
              <button
                @click="loadYearPrediction"
                :disabled="predictionsStore.isLoading('yearPrediction')"
                class="w-full text-xs bg-green-500 hover:bg-green-600 text-white py-1 rounded transition-colors"
              >
                Predecir Año
              </button>
            </div>
          </div>

          <!-- Predicción por Mes -->
          <div class="p-4 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg">
            <ClockIcon class="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div class="space-y-2">
              <div class="grid grid-cols-2 gap-1">
                <input
                  v-model="selectedMonthYear"
                  type="number"
                  :min="2024"
                  :max="2030"
                  class="px-2 py-1 text-xs border rounded text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Año"
                >
                <input
                  v-model="selectedMonth"
                  type="number"
                  :min="1"
                  :max="12"
                  class="px-2 py-1 text-xs border rounded text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Mes"
                >
              </div>
              <button
                @click="loadMonthPrediction"
                :disabled="predictionsStore.isLoading('monthPrediction')"
                class="w-full text-xs bg-purple-500 hover:bg-purple-600 text-white py-1 rounded transition-colors"
              >
                Predecir Mes
              </button>
            </div>
          </div>

          <!-- Predicción por Rango -->
          <div class="p-4 border-2 border-dashed border-orange-300 dark:border-orange-600 rounded-lg">
            <AdjustmentsHorizontalIcon class="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div class="space-y-2">
              <input
                v-model="rangeStartDate"
                type="date"
                class="w-full px-2 py-1 text-xs border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
              <input
                v-model="rangeEndDate"
                type="date"
                class="w-full px-2 py-1 text-xs border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
              <button
                @click="loadRangePrediction"
                :disabled="predictionsStore.isLoading('rangePrediction')"
                class="w-full text-xs bg-orange-500 hover:bg-orange-600 text-white py-1 rounded transition-colors"
              >
                Predecir Rango
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Predictions 2025 Section -->
      <div v-if="predictionsStore.predictions2025Data.length > 0" class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm">Total Predicho 2025</p>
                <p class="text-2xl font-bold">{{ formatCurrency(predictionsStore.predictions2025Insights?.predicted_year_total || 0) }}</p>
                <p class="text-blue-100 text-xs mt-1">Proyección anual</p>
              </div>
              <CurrencyDollarIcon class="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm">Promedio Mensual</p>
                <p class="text-2xl font-bold">{{ formatCurrency(predictionsStore.predictions2025Insights?.average_monthly_predicted || 0) }}</p>
                <p class="text-green-100 text-xs mt-1">Estimación mensual</p>
              </div>
              <ChartBarIcon class="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div class="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-yellow-100 text-sm">Crecimiento</p>
                <p class="text-2xl font-bold">{{ formatPercentage(predictionsStore.predictions2025Insights?.growth_percentage || 0) }}</p>
                <p class="text-yellow-100 text-xs mt-1">vs año anterior</p>
              </div>
              <ArrowTrendingUpIcon class="w-12 h-12 text-yellow-200" />
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm">Modelo IA</p>
                <p class="text-xl font-bold capitalize">{{ predictionsStore.predictions2025Insights?.best_model || 'N/A' }}</p>
                <p class="text-purple-100 text-xs mt-1">Algoritmo utilizado</p>
              </div>
              <CpuChipIcon class="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Line Chart - Predicciones 2025 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <ChartBarIcon class="w-5 h-5 mr-2 text-blue-500" />
                Tendencia Predicha 2025
              </h3>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Predicciones</span>
              </div>
            </div>
            <div class="h-80">
              <!-- Debug info -->
              <div v-if="!predictions2025ChartData" class="flex items-center justify-center h-full">
                <div class="text-center">
                  <p class="text-gray-500 mb-2">{{ 
                    predictionsStore.isLoading('predictions2025') 
                      ? 'Cargando datos...' 
                      : 'No hay datos disponibles' 
                  }}</p>
                  <button 
                    v-if="!predictionsStore.isLoading('predictions2025')"
                    @click="loadPredictions2025" 
                    class="btn-primary"
                  >
                    Cargar Predicciones
                  </button>
                </div>
              </div>
              <LineChart v-else :data="predictions2025ChartData" />
            </div>
          </div>

          <!-- Bar Chart - Comparación Mensual -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <ChartBarIcon class="w-5 h-5 mr-2 text-green-500" />
                Distribución Mensual
              </h3>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Por mes</span>
              </div>
            </div>
            <div class="h-80">
              <!-- Debug info -->
              <div v-if="!predictions2025BarData" class="flex items-center justify-center h-full">
                <div class="text-center">
                  <p class="text-gray-500 mb-2">{{ 
                    predictionsStore.isLoading('predictions2025') 
                      ? 'Cargando datos...' 
                      : 'No hay datos para gráfica de barras' 
                  }}</p>
                </div>
              </div>
              <BarChart v-else :data="predictions2025BarData" />
            </div>
          </div>
        </div>

        <!-- Monthly Breakdown Table -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <TableCellsIcon class="w-5 h-5 mr-2 text-indigo-500" />
            Desglose Mensual Detallado
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mes</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Predicción</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vs Promedio</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tendencia</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(prediction, index) in predictionsStore.predictions2025Data" :key="prediction.month">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatMonthName(prediction.month) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatCurrency(prediction.predicted_income) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span :class="getVariationClass(prediction.predicted_income, predictionsStore.predictions2025Insights?.average_monthly_predicted || 0)">
                      {{ formatVariation(prediction.predicted_income, predictionsStore.predictions2025Insights?.average_monthly_predicted || 0) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <TrendIcon :value="prediction.predicted_income" :previous="index > 0 ? predictionsStore.predictions2025Data[index-1].predicted_income : prediction.predicted_income" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Year Prediction Results -->
      <div v-if="predictionsStore.yearPredictionData" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <CalendarIcon class="w-5 h-5 mr-2 text-green-500" />
          Predicción para {{ selectedYear }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg p-6">
            <h4 class="text-emerald-700 dark:text-emerald-300 font-semibold mb-2">Total Anual</h4>
            <p class="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {{ formatCurrency(predictionsStore.yearPredictionData.total) }}
            </p>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-6">
            <h4 class="text-blue-700 dark:text-blue-300 font-semibold mb-2">Promedio Mensual</h4>
            <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {{ formatCurrency(predictionsStore.yearPredictionData.average_monthly) }}
            </p>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-6">
            <h4 class="text-purple-700 dark:text-purple-300 font-semibold mb-2">Proyección</h4>
            <p class="text-lg font-bold text-purple-900 dark:text-purple-100">
              {{ predictionsStore.yearPredictionData.growth_projection }}
            </p>
          </div>
        </div>

        <!-- Best and Challenging Months -->
        <div v-if="predictionsStore.yearPredictionData.best_months?.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
            <h4 class="text-green-700 dark:text-green-300 font-semibold mb-4 flex items-center">
              <StarIcon class="w-5 h-5 mr-2" />
              Mejores Meses
            </h4>
            <ul class="space-y-2">
              <li v-for="month in predictionsStore.yearPredictionData.best_months" :key="month" 
                  class="flex items-center text-green-800 dark:text-green-200">
                <CheckCircleIcon class="w-4 h-4 mr-2" />
                {{ month }}
              </li>
            </ul>
          </div>
          <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
            <h4 class="text-orange-700 dark:text-orange-300 font-semibold mb-4 flex items-center">
              <ExclamationTriangleIcon class="w-5 h-5 mr-2" />
              Meses Desafiantes
            </h4>
            <ul class="space-y-2">
              <li v-for="month in predictionsStore.yearPredictionData.challenging_months" :key="month" 
                  class="flex items-center text-orange-800 dark:text-orange-200">
                <ExclamationCircleIcon class="w-4 h-4 mr-2" />
                {{ month }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Recommendations -->
        <div v-if="predictionsStore.yearPredictionData.recommendations?.length > 0" class="mt-6">
          <h4 class="text-gray-700 dark:text-gray-300 font-semibold mb-4 flex items-center">
            <LightBulbIcon class="w-5 h-5 mr-2 text-yellow-500" />
            Recomendaciones Estratégicas
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(recommendation, index) in predictionsStore.yearPredictionData.recommendations" 
                 :key="index"
                 class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <p class="text-yellow-800 dark:text-yellow-200">{{ recommendation }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Month Prediction Results -->
      <div v-if="predictionsStore.monthPredictionData" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <ClockIcon class="w-5 h-5 mr-2 text-purple-500" />
          Predicción para {{ predictionsStore.monthPredictionData.month_name }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-6 text-center">
            <h4 class="text-purple-700 dark:text-purple-300 font-semibold mb-2">Ingreso Predicho</h4>
            <p class="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {{ formatCurrency(predictionsStore.monthPredictionData.predicted_income) }}
            </p>
          </div>
          <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg p-6 text-center">
            <h4 class="text-indigo-700 dark:text-indigo-300 font-semibold mb-2">Confianza</h4>
            <p class="text-2xl font-bold text-indigo-900 dark:text-indigo-100 capitalize">
              {{ predictionsStore.monthPredictionData.confidence_level }}
            </p>
          </div>
          <div class="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30 rounded-lg p-6 text-center">
            <h4 class="text-cyan-700 dark:text-cyan-300 font-semibold mb-2">Factor Estacional</h4>
            <p class="text-2xl font-bold text-cyan-900 dark:text-cyan-100">
              {{ (predictionsStore.monthPredictionData.seasonal_factor * 100).toFixed(1) }}%
            </p>
          </div>
          <div class="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 rounded-lg p-6 text-center">
            <h4 class="text-teal-700 dark:text-teal-300 font-semibold mb-2">vs Promedio</h4>
            <p class="text-lg font-bold text-teal-900 dark:text-teal-100 capitalize">
              {{ predictionsStore.monthPredictionData.comparison_to_average }}
            </p>
          </div>
        </div>
      </div>

      <!-- Range Prediction Results -->
      <div v-if="predictionsStore.rangePredictionData" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <AdjustmentsHorizontalIcon class="w-5 h-5 mr-2 text-orange-500" />
          Predicción de Rango
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-lg p-6">
            <h4 class="text-orange-700 dark:text-orange-300 font-semibold mb-2">Total Predicho</h4>
            <p class="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {{ formatCurrency(predictionsStore.rangePredictionData.total_predicted) }}
            </p>
            <p class="text-sm text-orange-600 dark:text-orange-400 mt-1">
              {{ predictionsStore.rangePredictionData.start_date }} a {{ predictionsStore.rangePredictionData.end_date }}
            </p>
          </div>
          <div class="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg p-6">
            <h4 class="text-amber-700 dark:text-amber-300 font-semibold mb-2">Promedio Mensual</h4>
            <p class="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {{ formatCurrency(predictionsStore.rangePredictionData.average_monthly) }}
            </p>
          </div>
          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-lg p-6">
            <h4 class="text-yellow-700 dark:text-yellow-300 font-semibold mb-2">Total Meses</h4>
            <p class="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {{ predictionsStore.rangePredictionData.total_months }}
            </p>
          </div>
        </div>
      </div>

      <!-- Loading States -->
      <div v-if="isAnyLoading && !hasAnyData" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
        <div class="text-center">
          <LoadingSpinner size="large" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mt-4">Generando Predicciones</h3>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Nuestros algoritmos de IA están analizando los datos...
          </p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!hasAnyData && !isAnyLoading" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
        <div class="text-center">
          <ChartBarIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            ¡Comienza a Predecir!
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Utiliza los controles de arriba para generar predicciones inteligentes para tu negocio
          </p>
          <button
            @click="loadPredictions2025"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Generar Predicciones 2025
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePredictionsStore } from '@/stores/predictions'
import { useToast } from 'vue-toastification'
import {
  ArrowPathIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  CogIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  CpuChipIcon,
  TableCellsIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  LightBulbIcon
} from '@heroicons/vue/24/outline'

import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import TrendIcon from '@/components/ui/TrendIcon.vue'

import { formatCurrency, formatPercentage } from '@/utils/formatters'

const predictionsStore = usePredictionsStore()
const toast = useToast()

// Form states
const selectedYear = ref(2025)
const selectedMonth = ref(12)
const selectedMonthYear = ref(2025)
const rangeStartDate = ref('2025-01-01')
const rangeEndDate = ref('2025-12-31')

// Computed properties
const isAnyLoading = computed(() => {
  return predictionsStore.isLoading('predictions2025') ||
         predictionsStore.isLoading('yearPrediction') ||
         predictionsStore.isLoading('monthPrediction') ||
         predictionsStore.isLoading('rangePrediction')
})

const hasAnyData = computed(() => {
  return predictionsStore.predictions2025Data.length > 0 ||
         predictionsStore.yearPredictionData ||
         predictionsStore.monthPredictionData ||
         predictionsStore.rangePredictionData
})

// Chart data con debug
const predictions2025ChartData = computed(() => {
  const chartData = predictionsStore.predictions2025ChartData
  console.log('🎨 Chart data in component:', chartData)
  return chartData
})

const predictions2025BarData = computed(() => {
  const barData = predictionsStore.predictions2025BarData
  console.log('📊 Bar data in component:', barData)
  return barData
})

// Helper functions
const formatMonthName = (monthStr: string) => {
  const [year, month] = monthStr.split('-')
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return `${monthNames[parseInt(month) - 1]} ${year}`
}

const formatVariation = (value: number, average: number) => {
  const variation = ((value - average) / average) * 100
  const sign = variation >= 0 ? '+' : ''
  return `${sign}${variation.toFixed(1)}%`
}

const getVariationClass = (value: number, average: number) => {
  const variation = ((value - average) / average) * 100
  if (variation > 5) return 'text-green-600 dark:text-green-400 font-semibold'
  if (variation < -5) return 'text-red-600 dark:text-red-400 font-semibold'
  return 'text-gray-600 dark:text-gray-400'
}

// Actions
const loadPredictions2025 = async () => {
  try {
    await predictionsStore.fetchPredictions2025(true)
    toast.success('🎉 Predicciones 2025 generadas exitosamente')
  } catch (error) {
    toast.error('❌ Error al generar predicciones 2025')
  }
}

const loadYearPrediction = async () => {
  try {
    await predictionsStore.fetchYearPrediction(selectedYear.value)
    toast.success(`🎯 Predicción para ${selectedYear.value} generada`)
  } catch (error) {
    toast.error('❌ Error al generar predicción anual')
  }
}

const loadMonthPrediction = async () => {
  try {
    await predictionsStore.fetchMonthPrediction(selectedMonthYear.value, selectedMonth.value)
    toast.success(`📅 Predicción mensual generada`)
  } catch (error) {
    toast.error('❌ Error al generar predicción mensual')
  }
}

const loadRangePrediction = async () => {
  try {
    await predictionsStore.fetchRangePrediction(rangeStartDate.value, rangeEndDate.value)
    toast.success('📊 Predicción de rango generada')
  } catch (error) {
    toast.error('❌ Error al generar predicción de rango')
  }
}

const refreshAllPredictions = async () => {
  try {
    await Promise.all([
      loadPredictions2025(),
      selectedYear.value ? loadYearPrediction() : Promise.resolve(),
      selectedMonth.value && selectedMonthYear.value ? loadMonthPrediction() : Promise.resolve()
    ])
    toast.success('🔄 Todas las predicciones actualizadas')
  } catch (error) {
    toast.error('❌ Error al actualizar predicciones')
  }
}

onMounted(() => {
  loadPredictions2025()
})
</script>