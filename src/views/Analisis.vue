<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Análisis con IA
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Análisis inteligente y recomendaciones estratégicas automatizadas
      </p>
    </div>

    <!-- Analysis form -->
    <div class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Generar Nuevo Análisis
      </h3>
      
      <div class="mb-6">
        <label class="label">
          Contexto de Mercado (Opcional)
        </label>
        <textarea
          v-model="marketContext"
          class="input-field"
          rows="4"
          placeholder="Describe el contexto actual del mercado, eventos económicos relevantes, o cualquier información que pueda afectar las predicciones..."
        ></textarea>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Proporciona contexto adicional para obtener un análisis más preciso y personalizado
        </p>
      </div>

      <button
        @click="generateAnalysis"
        :disabled="isLoading"
        class="btn-primary"
      >
        {{ isLoading ? 'Generando Análisis...' : 'Generar Análisis IA' }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="card p-8">
      <div class="flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          Generando análisis inteligente...
        </p>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          Esto puede tomar unos momentos mientras procesamos los datos con IA
        </p>
      </div>
    </div>

    <!-- Analysis results -->
    <div v-else-if="hasAnalysis" class="space-y-6">
      <!-- Confidence score -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Puntuación de Confianza
          </h3>
          <div
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              confidenceLevel.bgColor,
              confidenceLevel.color
            ]"
          >
            {{ confidenceLevel.level }}
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: confidenceScore + '%' }"
              ></div>
            </div>
          </div>
          <span class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ confidenceScore }}%
          </span>
        </div>
        
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Nivel de confianza del análisis basado en la calidad y cantidad de datos disponibles
        </p>
      </div>

      <!-- Business insights -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <span class="h-2 w-2 bg-blue-500 rounded-full mr-3"></span>
          Insights de Negocio
        </h3>
        
        <div v-if="businessInsights.length > 0" class="space-y-3">
          <div
            v-for="(insight, index) in businessInsights"
            :key="index"
            class="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
          >
            <div class="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-300">
              {{ index + 1 }}
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300">{{ insight }}</p>
          </div>
        </div>
        
        <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
          No hay insights de negocio disponibles
        </div>
      </div>

      <!-- Risk factors -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <span class="h-2 w-2 bg-red-500 rounded-full mr-3"></span>
          Factores de Riesgo
        </h3>
        
        <div v-if="riskFactors.length > 0" class="space-y-3">
          <div
            v-for="(risk, index) in riskFactors"
            :key="index"
            class="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
          >
            <div class="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center text-xs font-medium text-red-600 dark:text-red-300">
              ⚠
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300">{{ risk }}</p>
          </div>
        </div>
        
        <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
          No se identificaron factores de riesgo significativos
        </div>
      </div>

      <!-- Recommendations -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <span class="h-2 w-2 bg-green-500 rounded-full mr-3"></span>
          Recomendaciones Estratégicas
        </h3>
        
        <div v-if="recommendations.length > 0" class="space-y-3">
          <div
            v-for="(recommendation, index) in recommendations"
            :key="index"
            class="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
          >
            <div class="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-xs font-medium text-green-600 dark:text-green-300">
              ✓
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300">{{ recommendation }}</p>
          </div>
        </div>
        
        <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
          No hay recomendaciones específicas disponibles
        </div>
      </div>

      <!-- Market trends -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <span class="h-2 w-2 bg-purple-500 rounded-full mr-3"></span>
          Tendencias de Mercado
        </h3>
        
        <div v-if="marketTrends.length > 0" class="space-y-3">
          <div
            v-for="(trend, index) in marketTrends"
            :key="index"
            class="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
          >
            <div class="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center text-xs font-medium text-purple-600 dark:text-purple-300">
              📈
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300">{{ trend }}</p>
          </div>
        </div>
        
        <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
          No se identificaron tendencias de mercado relevantes
        </div>
      </div>

      <!-- Analysis summary -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Resumen del Análisis
        </h3>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Insights"
            :value="analysisSummary?.totalInsights || 0"
            type="number"
            icon="ChartBarIcon"
          />
          <StatsCard
            title="Factores de Riesgo"
            :value="analysisSummary?.totalRisks || 0"
            type="number"
            icon="ArrowTrendingDownIcon"
            :changeType="(analysisSummary?.totalRisks || 0) > 0 ? 'decrease' : 'neutral'"
          />
          <StatsCard
            title="Recomendaciones"
            :value="analysisSummary?.totalRecommendations || 0"
            type="number"
            icon="ArrowTrendingUpIcon"
            :changeType="(analysisSummary?.totalRecommendations || 0) > 0 ? 'increase' : 'neutral'"
          />
          <StatsCard
            title="Tendencias"
            :value="analysisSummary?.totalTrends || 0"
            type="number"
            icon="CpuChipIcon"
          />
        </div>
        
        <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Análisis generado el {{ formattedGeneratedAt }}
          </p>
          <p v-if="aiAnalysis?.market_context" class="mt-1">
            <strong>Contexto aplicado:</strong> {{ aiAnalysis.market_context }}
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Acciones
        </h3>
        
        <div class="flex flex-wrap gap-4">
          <button
            @click="exportAnalysis"
            class="btn-outline"
          >
            Exportar Análisis
          </button>
          
          <button
            @click="generateAnalysis"
            class="btn-primary"
            :disabled="isLoading"
          >
            Generar Nuevo Análisis
          </button>
          
          <button
            @click="clearAnalysis"
            class="btn-secondary"
          >
            Limpiar Análisis
          </button>
        </div>
      </div>
    </div>

    <!-- Recent analyses -->
    <div v-if="recentAnalyses.length > 0" class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Análisis Recientes
      </h3>
      
      <div class="space-y-3">
        <div
          v-for="analysis in recentAnalyses"
          :key="analysis.id"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          @click="loadAnalysisFromHistory(analysis.id)"
        >
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ analysis.date }}
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              {{ analysis.insightsCount }} insights • Confianza: {{ analysis.confidence }}%
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500 truncate max-w-md">
              {{ analysis.marketContext }}
            </p>
          </div>
          <div class="text-right">
            <div
              :class="[
                'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                analysis.confidence >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                analysis.confidence >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              ]"
            >
              {{ analysis.confidence }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!hasAnalysis && !isLoading" class="card p-8">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 text-gray-400">
          <CpuChipIcon class="h-12 w-12" />
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          No hay análisis disponible
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Genera tu primer análisis con IA para obtener insights inteligentes
        </p>
        <div class="mt-6">
          <button
            @click="generateAnalysis"
            class="btn-primary"
          >
            Generar Análisis IA
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CpuChipIcon } from '@heroicons/vue/24/outline'
import { useAnalysisStore } from '@/stores/analysis'
import { useToast } from 'vue-toastification'
import StatsCard from '@/components/ui/StatsCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { formatDateLong } from '@/utils/formatters'
import { exportToCSV } from '@/utils/helpers'

const analysisStore = useAnalysisStore()
const toast = useToast()

// State
const marketContext = ref('')

// Computed
const aiAnalysis = computed(() => analysisStore.aiAnalysis)
const hasAnalysis = computed(() => analysisStore.hasAnalysis)
const businessInsights = computed(() => analysisStore.businessInsights)
const riskFactors = computed(() => analysisStore.riskFactors)
const recommendations = computed(() => analysisStore.recommendations)
const marketTrends = computed(() => analysisStore.marketTrends)
const confidenceScore = computed(() => analysisStore.confidenceScore)
const confidenceLevel = computed(() => analysisStore.confidenceLevel)
const recentAnalyses = computed(() => analysisStore.recentAnalyses)
const analysisSummary = computed(() => analysisStore.getAnalysisSummary())

const isLoading = computed(() => analysisStore.isLoading('aiAnalysis'))

const formattedGeneratedAt = computed(() => {
  if (aiAnalysis.value?.generated_at) {
    return formatDateLong(aiAnalysis.value.generated_at)
  }
  return ''
})

// Methods
const generateAnalysis = async () => {
  try {
    await analysisStore.generateNewAnalysis(marketContext.value || undefined)
    toast.success('Análisis IA generado correctamente')
  } catch (error) {
    toast.error('Error al generar análisis IA')
    console.error('Error generating AI analysis:', error)
  }
}

const exportAnalysis = () => {
  if (!aiAnalysis.value) return

  const exportData = analysisStore.exportAnalysis()
  if (exportData) {
    // Convert to CSV format
    const csvData = [
      { categoria: 'Confianza', valor: exportData.confidence_score + '%' },
      { categoria: 'Fecha Generación', valor: formatDateLong(exportData.generated_at) },
      { categoria: 'Contexto Mercado', valor: exportData.market_context || 'N/A' },
      ...exportData.insights.business_insights.map((insight, i) => ({
        categoria: `Insight ${i + 1}`,
        valor: insight
      })),
      ...exportData.insights.risk_factors.map((risk, i) => ({
        categoria: `Riesgo ${i + 1}`,
        valor: risk
      })),
      ...exportData.insights.recommendations.map((rec, i) => ({
        categoria: `Recomendación ${i + 1}`,
        valor: rec
      })),
      ...exportData.insights.market_trends.map((trend, i) => ({
        categoria: `Tendencia ${i + 1}`,
        valor: trend
      })),
    ]

    exportToCSV(
      csvData,
      `balance-ai-analisis-${new Date().toISOString().split('T')[0]}`
    )
    
    toast.success('Análisis exportado correctamente')
  }
}

const clearAnalysis = () => {
  analysisStore.clearCurrentAnalysis()
  marketContext.value = ''
  toast.info('Análisis limpiado')
}

const loadAnalysisFromHistory = (analysisId: string) => {
  analysisStore.loadAnalysisFromHistory(analysisId)
  toast.info('Análisis cargado desde el historial')
}
</script>