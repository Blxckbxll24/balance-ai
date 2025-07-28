<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Reportes
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Análisis comparativo y exportación de datos
      </p>
    </div>

    <!-- Report generation -->
    <div class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Generar Reporte
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div class="space-y-2">
          <label class="label">Tipo de Reporte</label>
          <select v-model="selectedReportType" class="input-field">
            <option value="dashboard">Dashboard Completo</option>
            <option value="predictions">Predicciones 2025</option>
            <option value="analysis">Último Análisis IA</option>
            <option value="comparative">Comparativo Histórico</option>
          </select>
        </div>
        
        <div class="space-y-2">
          <label class="label">Formato</label>
          <select v-model="selectedFormat" class="input-field">
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </div>
        
        <div class="space-y-2">
          <label class="label">Período</label>
          <select v-model="selectedPeriod" class="input-field">
            <option value="current">Actual</option>
            <option value="monthly">Mensual</option>
            <option value="yearly">Anual</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
      </div>

      <div v-if="selectedPeriod === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="label">Fecha Inicio</label>
          <input
            v-model="customStartDate"
            type="date"
            class="input-field"
          />
        </div>
        <div>
          <label class="label">Fecha Fin</label>
          <input
            v-model="customEndDate"
            type="date"
            class="input-field"
            :min="customStartDate"
          />
        </div>
      </div>

      <div class="flex space-x-4">
        <button
          @click="generateReport"
          :disabled="isGeneratingReport"
          class="btn-primary"
        >
          {{ isGeneratingReport ? 'Generando...' : 'Generar Reporte' }}
        </button>
        
        <button
          @click="exportAllData"
          :disabled="isExporting"
          class="btn-outline"
        >
          {{ isExporting ? 'Exportando...' : 'Exportar Todo' }}
        </button>
      </div>
    </div>

    <!-- Quick stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Reportes Generados"
        :value="reportsGenerated"
        type="number"
        icon="DocumentChartBarIcon"
      />
      <StatsCard
        title="Datos Disponibles"
        :value="dataPointsAvailable"
        type="number"
        icon="ChartBarIcon"
      />
      <StatsCard
        title="Última Exportación"
        :value="lastExportDate"
        type="text"
        icon="CalendarIcon"
      />
      <StatsCard
        title="Tamaño Total"
        :value="totalDataSize"
        type="text"
        icon="CurrencyEuroIcon"
      />
    </div>

    <!-- Available reports -->
    <div class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Reportes Disponibles
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Dashboard Report -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div class="flex items-center mb-3">
            <div class="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <DocumentChartBarIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                Reporte Dashboard
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Métricas principales
              </p>
            </div>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Incluye métricas clave, tendencias y indicadores de rendimiento
          </p>
          <button
            @click="exportDashboardReport"
            :disabled="!dashboardData"
            class="btn-outline w-full text-sm"
          >
            Exportar Dashboard
          </button>
        </div>

        <!-- Predictions Report -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div class="flex items-center mb-3">
            <div class="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                Reporte Predicciones
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Datos de predicciones
              </p>
            </div>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Todas las predicciones generadas con intervalos de confianza
          </p>
          <button
            @click="exportPredictionsReport"
            :disabled="predictions2025.length === 0"
            class="btn-outline w-full text-sm"
          >
            Exportar Predicciones
          </button>
        </div>

        <!-- AI Analysis Report -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div class="flex items-center mb-3">
            <div class="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <CpuChipIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                Reporte Análisis IA
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Insights inteligentes
              </p>
            </div>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Análisis generados por IA con recomendaciones y factores de riesgo
          </p>
          <button
            @click="exportAnalysisReport"
            :disabled="!hasAnalysis"
            class="btn-outline w-full text-sm"
          >
            Exportar Análisis IA
          </button>
        </div>
      </div>
    </div>

    <!-- Recent exports -->
    <div class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Exportaciones Recientes
      </h3>
      
      <div v-if="recentExports.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Formato
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tamaño
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="exportItem in recentExports" :key="exportItem.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ exportItem.type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ exportItem.format.toUpperCase() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ exportItem.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ exportItem.size }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                    exportItem.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  ]"
                >
                  {{ exportItem.status === 'completed' ? 'Completado' : 'Procesando' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        No hay exportaciones recientes
      </div>
    </div>

    <!-- Data visualization -->
    <div class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Visualización Comparativa
      </h3>
      
      <div class="mb-4">
        <div class="flex space-x-4">
          <button
            @click="chartType = 'line'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md',
              chartType === 'line' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            Líneas
          </button>
          <button
            @click="chartType = 'bar'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md',
              chartType === 'bar' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            Barras
          </button>
        </div>
      </div>
      
      <div v-if="comparativeChartData.labels.length > 0" class="h-96">
        <LineChart
          v-if="chartType === 'line'"
          :data="comparativeChartData"
          title="Comparativo Histórico vs Predicciones"
        />
        <!-- BarChart would go here if implemented -->
      </div>
      
      <div v-else class="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div class="text-center">
          <ChartBarIcon class="mx-auto h-12 w-12 mb-4" />
          <p>No hay datos suficientes para mostrar comparación</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  DocumentChartBarIcon,
  ArrowTrendingUpIcon,
  CpuChipIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline'
import { useDashboardStore } from '@/stores/dashboard'
import { usePredictionsStore } from '@/stores/predictions'
import { useAnalysisStore } from '@/stores/analysis'
import { useToast } from 'vue-toastification'
import StatsCard from '@/components/ui/StatsCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import { exportToCSV, generateMonthlyChartData } from '@/utils/helpers'
import { formatDate } from '@/utils/formatters'

const dashboardStore = useDashboardStore()
const predictionsStore = usePredictionsStore()
const analysisStore = useAnalysisStore()
const toast = useToast()

// State
const selectedReportType = ref('dashboard')
const selectedFormat = ref('csv')
const selectedPeriod = ref('current')
const customStartDate = ref('')
const customEndDate = ref('')
const chartType = ref('line')
const isGeneratingReport = ref(false)
const isExporting = ref(false)
const reportsGenerated = ref(0)

// Mock data for recent exports
const recentExports = ref([
  {
    id: 1,
    type: 'Dashboard',
    format: 'csv',
    date: '28/07/2024 10:30',
    size: '2.5 KB',
    status: 'completed'
  },
  {
    id: 2,
    type: 'Predicciones',
    format: 'json',
    date: '27/07/2024 15:45',
    size: '15.2 KB',
    status: 'completed'
  },
])

// Computed
const dashboardData = computed(() => dashboardStore.dashboardData)
const predictions2025 = computed(() => predictionsStore.predictions2025)
const hasAnalysis = computed(() => analysisStore.hasAnalysis)
const recentTrendsChart = computed(() => dashboardStore.recentTrendsChart)

const dataPointsAvailable = computed(() => {
  let total = 0
  if (dashboardData.value?.recent_trends) {
    total += dashboardData.value.recent_trends.length
  }
  total += predictions2025.value.length
  if (hasAnalysis.value) total += 1
  return total
})

const lastExportDate = computed(() => {
  if (recentExports.value.length > 0) {
    return recentExports.value[0].date
  }
  return 'Nunca'
})

const totalDataSize = computed(() => {
  const totalKB = recentExports.value.reduce((sum, exp) => {
    const size = parseFloat(exp.size.replace(' KB', ''))
    return sum + size
  }, 0)
  return `${totalKB.toFixed(1)} KB`
})

const comparativeChartData = computed(() => {
  if (recentTrendsChart.value) {
    return generateMonthlyChartData(
      recentTrendsChart.value.historical,
      recentTrendsChart.value.predicted
    )
  }
  return { labels: [], datasets: [] }
})

// Methods
const generateReport = async () => {
  isGeneratingReport.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate processing
    
    switch (selectedReportType.value) {
      case 'dashboard':
        exportDashboardReport()
        break
      case 'predictions':
        exportPredictionsReport()
        break
      case 'analysis':
        exportAnalysisReport()
        break
      case 'comparative':
        exportComparativeReport()
        break
    }
    
    reportsGenerated.value++
    toast.success('Reporte generado correctamente')
  } catch (error) {
    toast.error('Error al generar reporte')
    console.error('Error generating report:', error)
  } finally {
    isGeneratingReport.value = false
  }
}

const exportDashboardReport = () => {
  if (!dashboardData.value) {
    toast.warning('No hay datos de dashboard disponibles')
    return
  }

  const data = [
    {
      metric: 'Total Histórico',
      value: dashboardData.value.historical_summary.total_historical,
      type: 'EUR'
    },
    {
      metric: 'Promedio Mensual Histórico',
      value: dashboardData.value.historical_summary.average_monthly,
      type: 'EUR'
    },
    {
      metric: 'Total Predicho 2025',
      value: dashboardData.value.predictions_summary.total_predicted_2025,
      type: 'EUR'
    },
    {
      metric: 'Tasa de Crecimiento',
      value: dashboardData.value.predictions_summary.growth_rate,
      type: '%'
    },
    {
      metric: 'Mejor Mes',
      value: dashboardData.value.key_metrics.best_month,
      type: 'text'
    },
    {
      metric: 'Índice de Volatilidad',
      value: dashboardData.value.key_metrics.volatility_index,
      type: 'number'
    }
  ]

  exportToCSV(data, `balance-ai-dashboard-${getCurrentDateString()}`)
  addToExportHistory('Dashboard', selectedFormat.value)
}

const exportPredictionsReport = () => {
  if (predictions2025.value.length === 0) {
    toast.warning('No hay predicciones disponibles')
    return
  }

  const data = predictions2025.value.map((pred, index) => ({
    fecha: pred.date,
    balance_predicho: pred.predicted_balance,
    intervalo_inferior: pred.confidence_interval?.lower || '',
    intervalo_superior: pred.confidence_interval?.upper || '',
    indice: index + 1
  }))

  exportToCSV(data, `balance-ai-predicciones-${getCurrentDateString()}`)
  addToExportHistory('Predicciones', selectedFormat.value)
}

const exportAnalysisReport = () => {
  if (!hasAnalysis.value) {
    toast.warning('No hay análisis IA disponible')
    return
  }

  const analysis = analysisStore.exportAnalysis()
  if (!analysis) return

  const data = [
    { categoria: 'Confianza', valor: analysis.confidence_score + '%' },
    { categoria: 'Fecha Generación', valor: analysis.generated_at },
    { categoria: 'Contexto', valor: analysis.market_context || 'N/A' },
    ...analysis.insights.business_insights.map((insight, i) => ({
      categoria: `Insight ${i + 1}`,
      valor: insight
    })),
    ...analysis.insights.risk_factors.map((risk, i) => ({
      categoria: `Riesgo ${i + 1}`,
      valor: risk
    })),
    ...analysis.insights.recommendations.map((rec, i) => ({
      categoria: `Recomendación ${i + 1}`,
      valor: rec
    })),
  ]

  exportToCSV(data, `balance-ai-analisis-${getCurrentDateString()}`)
  addToExportHistory('Análisis IA', selectedFormat.value)
}

const exportComparativeReport = () => {
  if (!recentTrendsChart.value) {
    toast.warning('No hay datos comparativos disponibles')
    return
  }

  const data = recentTrendsChart.value.labels.map((label, index) => ({
    periodo: label,
    historico: recentTrendsChart.value!.historical[index] || 0,
    predicho: recentTrendsChart.value!.predicted[index] || 0,
    diferencia: (recentTrendsChart.value!.predicted[index] || 0) - (recentTrendsChart.value!.historical[index] || 0)
  }))

  exportToCSV(data, `balance-ai-comparativo-${getCurrentDateString()}`)
  addToExportHistory('Comparativo', selectedFormat.value)
}

const exportAllData = async () => {
  isExporting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing
    
    // Export all available data
    if (dashboardData.value) exportDashboardReport()
    if (predictions2025.value.length > 0) exportPredictionsReport()
    if (hasAnalysis.value) exportAnalysisReport()
    if (recentTrendsChart.value) exportComparativeReport()
    
    toast.success('Todos los datos exportados correctamente')
  } catch (error) {
    toast.error('Error al exportar todos los datos')
    console.error('Error exporting all data:', error)
  } finally {
    isExporting.value = false
  }
}

const getCurrentDateString = () => {
  return new Date().toISOString().split('T')[0]
}

const addToExportHistory = (type: string, format: string) => {
  const newExport = {
    id: Date.now(),
    type,
    format,
    date: new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    size: `${(Math.random() * 50 + 1).toFixed(1)} KB`,
    status: 'completed' as const
  }
  
  recentExports.value.unshift(newExport)
  if (recentExports.value.length > 10) {
    recentExports.value = recentExports.value.slice(0, 10)
  }
}

// Lifecycle
onMounted(() => {
  // Set default custom dates
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
  
  customStartDate.value = lastMonth.toISOString().split('T')[0]
  customEndDate.value = lastMonthEnd.toISOString().split('T')[0]
})
</script>