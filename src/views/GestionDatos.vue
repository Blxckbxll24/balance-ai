<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-700 dark:to-purple-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">
              Gestión de Datos
            </h1>
            <p class="text-indigo-100 mt-2">
              Administra los datos históricos para mejorar las predicciones de IA
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <div class="flex items-center text-white">
                <ServerIcon class="w-5 h-5 mr-2" />
                <span class="text-sm">
                  Estado: 
                  <span :class="isOnline ? 'text-green-300' : 'text-red-300'">
                    {{ isOnline ? 'Conectado' : 'Desconectado' }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Stats Overview -->
      <div v-if="statistics" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Registros"
          :value="statistics.months_with_data"
          icon="ChartBarIcon"
          type="number"
          change="0"
          change-type="neutral"
        />
        <StatsCard
          title="Promedio Mensual"
          :value="statistics.average_monthly"
          icon="CurrencyEuroIcon"
          type="currency"
          change="0"
          change-type="neutral"
        />
        <StatsCard
          title="Total Ingresos"
          :value="statistics.total_income"
          icon="ArrowTrendingUpIcon"
          type="currency"
          change="0"
          change-type="neutral"
        />
        <StatsCard
          title="Desviación Estándar"
          :value="statistics.std_deviation"
          icon="ChartBarIcon"
          type="currency"
          change="0"
          change-type="neutral"
        />
      </div>

      <!-- Main Upload Component -->
      <DataUpload />

      <!-- Additional Statistics -->
      <div v-if="statistics" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Data Quality Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center mb-4">
            <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Calidad de Datos
            </h3>
          </div>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-300">Mínimo mensual:</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(statistics.min_monthly) }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-300">Máximo mensual:</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(statistics.max_monthly) }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-300">Mediana mensual:</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(statistics.median_monthly) }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-300">Variabilidad:</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatPercentage(calculateVariability()) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Data Tips Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center mb-4">
            <LightBulbIcon class="w-5 h-5 text-yellow-500 mr-2" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Consejos para Mejores Predicciones
            </h3>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-start">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Agrega datos de al menos 12 meses para mejorar la precisión
              </p>
            </div>
            <div class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Incluye datos de años anteriores para capturar tendencias estacionales
              </p>
            </div>
            <div class="flex items-start">
              <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Asegúrate de que las columnas tengan nombres descriptivos
              </p>
            </div>
            <div class="flex items-start">
              <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Los datos más recientes tienen mayor peso en las predicciones
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Instructions Card -->
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-6">
        <div class="flex items-start">
          <InformationCircleIcon class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              ¿Cómo usar la gestión de datos?
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
              <div>
                <h4 class="font-medium mb-2">Formatos soportados:</h4>
                <ul class="space-y-1 list-disc list-inside ml-2">
                  <li>Archivos Excel (.xlsx, .xls)</li>
                  <li>Tamaño máximo: 16MB</li>
                  <li>Columnas de fecha y total requeridas</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-2">Nombres de columnas detectados:</h4>
                <ul class="space-y-1 list-disc list-inside ml-2">
                  <li><strong>Fecha:</strong> periodo, fecha, date, month, mes</li>
                  <li><strong>Total:</strong> total, monto, ingreso, amount, income</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  ServerIcon,
  CheckCircleIcon,
  LightBulbIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

import { useApi } from '@/composables/useApi'
import { useDataManagement } from '@/composables/useDataManagement'
import StatsCard from '@/components/ui/StatsCard.vue'
import DataUpload from '@/components/data/DataUpload.vue'
import { formatCurrency, formatPercentage } from '@/utils/formatters'

const { isOnline } = useApi()
const { statistics, loadDataInfo } = useDataManagement()

const calculateVariability = () => {
  if (!statistics.value) return 0
  
  const coefficient = (statistics.value.std_deviation / statistics.value.average_monthly) * 100
  return coefficient
}

onMounted(async () => {
  try {
    await loadDataInfo()
  } catch (error) {
    console.warn('Could not load data info on mount:', error)
  }
})
</script>
