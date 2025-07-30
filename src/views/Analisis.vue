<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-purple-700 dark:to-indigo-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">
              🤖 Análisis con IA
            </h1>
            <p class="text-purple-100 mt-2">
              Insights inteligentes y recomendaciones estratégicas para tu negocio
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="generateAnalysis"
              :disabled="analysisStore.isLoading('aiAnalysis')"
              class="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200"
            >
              <CpuChipIcon :class="['w-5 h-5', analysisStore.isLoading('aiAnalysis') ? 'animate-pulse' : '']" />
              <span>{{ analysisStore.isLoading('aiAnalysis') ? 'Analizando...' : 'Generar Análisis' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Summary Cards -->
      <div v-if="analysisSummary" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-100 text-sm">Factores de Riesgo</p>
              <p class="text-3xl font-bold">{{ analysisSummary.risks }}</p>
              <p class="text-red-100 text-xs mt-1">Identificados</p>
            </div>
            <ExclamationTriangleIcon class="w-12 h-12 text-red-200" />
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm">Recomendaciones</p>
              <p class="text-3xl font-bold">{{ analysisSummary.recommendations }}</p>
              <p class="text-green-100 text-xs mt-1">Estratégicas</p>
            </div>
            <LightBulbIcon class="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">Oportunidades</p>
              <p class="text-3xl font-bold">{{ analysisSummary.opportunities }}</p>
              <p class="text-blue-100 text-xs mt-1">De mejora</p>
            </div>
            <StarIcon class="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm">Meses Críticos</p>
              <p class="text-3xl font-bold">{{ analysisSummary.criticalMonths }}</p>
              <p class="text-orange-100 text-xs mt-1">Identificados</p>
            </div>
            <CalendarIcon class="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      <!-- AI Analysis Results -->
      <div v-if="analysisStore.aiAnalysisData" class="space-y-6">
        
        <!-- Overall Assessment -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <DocumentTextIcon class="w-6 h-6 mr-2 text-purple-500" />
            Evaluación General
          </h2>
          <div class="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400 p-6 rounded-r-lg">
            <p class="text-purple-900 dark:text-purple-100 leading-relaxed">
              {{ analysisStore.aiAnalysisData.overall_assessment }}
            </p>
          </div>
        </div>

        <!-- Trend Analysis -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ArrowTrendingUpIcon class="w-6 h-6 mr-2 text-blue-500" />
            Análisis de Tendencias
          </h2>
          <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-6 rounded-r-lg">
            <p class="text-blue-900 dark:text-blue-100 leading-relaxed">
              {{ analysisStore.aiAnalysisData.trend_analysis }}
            </p>
          </div>
        </div>

        <!-- Seasonal Patterns -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ClockIcon class="w-6 h-6 mr-2 text-green-500" />
            Patrones Estacionales
          </h2>
          <div class="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-6 rounded-r-lg">
            <p class="text-green-900 dark:text-green-100 leading-relaxed">
              {{ analysisStore.aiAnalysisData.seasonal_patterns }}
            </p>
          </div>
        </div>

        <!-- Risk Factors -->
        <div v-if="analysisStore.aiAnalysisData && analysisStore.aiAnalysisData.risk_factors.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ExclamationTriangleIcon class="w-6 h-6 mr-2 text-red-500" />
            Factores de Riesgo
          </h2>
          <div class="space-y-4">
            <div v-for="(risk, index) in analysisStore.aiAnalysisData.risk_factors" 
                 :key="index"
                 class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div class="flex items-start">
                <ExclamationCircleIcon class="w-5 h-5 text-red-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 class="font-medium text-red-900 dark:text-red-100 mb-1">Riesgo {{ index + 1 }}</h4>
                  <p class="text-red-800 dark:text-red-200 text-sm leading-relaxed">{{ formatAnalysisText(risk) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Strategic Recommendations -->
        <div v-if="analysisStore.aiAnalysisData && analysisStore.aiAnalysisData.strategic_recommendations.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <LightBulbIcon class="w-6 h-6 mr-2 text-yellow-500" />
            Recomendaciones Estratégicas
          </h2>
          <div class="space-y-4">
            <div v-for="(recommendation, index) in analysisStore.aiAnalysisData.strategic_recommendations" 
                 :key="index"
                 class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div class="flex items-start">
                <CheckCircleIcon class="w-5 h-5 text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 class="font-medium text-yellow-900 dark:text-yellow-100 mb-1">Recomendación {{ index + 1 }}</h4>
                  <p class="text-yellow-800 dark:text-yellow-200 text-sm leading-relaxed">{{ formatAnalysisText(recommendation) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Improvement Opportunities -->
        <div v-if="analysisStore.aiAnalysisData && analysisStore.aiAnalysisData.improvement_opportunities.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <StarIcon class="w-6 h-6 mr-2 text-blue-500" />
            Oportunidades de Mejora
          </h2>
          <div class="space-y-4">
            <div v-for="(opportunity, index) in analysisStore.aiAnalysisData.improvement_opportunities" 
                 :key="index"
                 class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div class="flex items-start">
                <ArrowUpIcon class="w-5 h-5 text-blue-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 class="font-medium text-blue-900 dark:text-blue-100 mb-1">Oportunidad {{ index + 1 }}</h4>
                  <p class="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">{{ formatAnalysisText(opportunity) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Critical Months -->
        <div v-if="analysisStore.aiAnalysisData && analysisStore.aiAnalysisData.critical_months.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <CalendarIcon class="w-6 h-6 mr-2 text-orange-500" />
            Análisis de Meses Críticos
          </h2>
          <div class="space-y-4">
            <div v-for="(monthInfo, index) in analysisStore.aiAnalysisData.critical_months" 
                 :key="index"
                 class="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-400 p-4 rounded-r-lg">
              <div class="flex items-start">
                <CalendarIcon class="w-5 h-5 text-orange-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 class="font-medium text-orange-900 dark:text-orange-100 mb-1">Período Crítico {{ index + 1 }}</h4>
                  <p class="text-orange-800 dark:text-orange-200 text-sm leading-relaxed">{{ formatAnalysisText(monthInfo) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Insights Summary -->
        <div v-if="analysisStore.analysisInsights" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ChartBarIcon class="w-6 h-6 mr-2 text-indigo-500" />
            Resumen de Insights
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Actual</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                {{ formatCurrency(analysisStore.analysisInsights.current_year_total) }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Predicho</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                {{ formatCurrency(analysisStore.analysisInsights.predicted_year_total) }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p class="text-sm text-gray-600 dark:text-gray-400">Crecimiento</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                {{ formatPercentage(analysisStore.analysisInsights.growth_percentage) }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p class="text-sm text-gray-600 dark:text-gray-400">Modelo</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {{ analysisStore.analysisInsights.best_model }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="analysisStore.isLoading('aiAnalysis') && !analysisStore.hasAnalysisData" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
        <div class="text-center">
          <LoadingSpinner size="large" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mt-4">Generando Análisis con IA</h3>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Procesando datos y generando insights inteligentes...
          </p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!analysisStore.hasAnalysisData && !analysisStore.isLoading('aiAnalysis')" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
        <div class="text-center">
          <CpuChipIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            ¡Genera tu Primer Análisis!
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Utiliza nuestra IA avanzada para obtener insights profundos sobre tu negocio
          </p>
          <button
            @click="generateAnalysis"
            class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Generar Análisis con IA
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="analysisStore.hasError('aiAnalysis')" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
        <div class="text-center">
          <ExclamationTriangleIcon class="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error al Generar Análisis
          </h3>
          <p class="text-red-600 dark:text-red-400 mb-6">
            {{ analysisStore.getError('aiAnalysis') }}
          </p>
          <button
            @click="generateAnalysis"
            class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnalysisStore } from '@/stores/analysis'
import { useToast } from 'vue-toastification'
import {
  CpuChipIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  StarIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { formatCurrency, formatPercentage, formatAnalysisText } from '@/utils/formatters'

const analysisStore = useAnalysisStore()
const toast = useToast()

// Computed properties
const analysisSummary = computed(() => {
  return analysisStore.getAnalysisSummary
})

// Actions
const generateAnalysis = async () => {
  try {
    await analysisStore.generateNewAnalysis()
    toast.success('🎉 Análisis generado exitosamente')
  } catch (error) {
    console.error('Error generating AI analysis:', error)
    toast.error('❌ Error al generar el análisis')
  }
}

onMounted(() => {
  // Cargar análisis automáticamente si no hay datos
  if (!analysisStore.hasAnalysisData) {
    generateAnalysis()
  }
})
</script>