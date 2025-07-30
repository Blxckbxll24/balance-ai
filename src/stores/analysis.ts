import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AIAnalysis, LoadingState, ErrorState } from '@/types'
import { apiService } from '@/services/api'
import { normalizeText } from '@/utils/formatters'

export const useAnalysisStore = defineStore('analysis', () => {
  // State
  const aiAnalysis = ref<AIAnalysis | null>(null)
  const analysisHistory = ref<AIAnalysis[]>([])
  const loading = ref<LoadingState>({})
  const errors = ref<ErrorState>({})

  // Getters
  const isLoading = computed(() => (key: string) => loading.value[key] || false)
  const hasError = computed(() => (key: string) => !!errors.value[key])
  const getError = computed(() => (key: string) => errors.value[key])

  // Utility functions
  const setLoading = (key: string, value: boolean) => {
    loading.value[key] = value
  }

  const setError = (key: string, message: string) => {
    errors.value[key] = message
  }

  const clearError = (key: string) => {
    errors.value[key] = null
  }

  // Helper function to convert string to array if needed
  const processTextToArray = (data: any): string[] => {
    if (!data) return []
    
    // Si ya es un array, procesarlo
    if (Array.isArray(data)) {
      return data.map(item => normalizeText(String(item)))
    }
    
    // Si es un string, convertirlo a array
    if (typeof data === 'string') {
      const normalized = normalizeText(data)
      
      // Intentar dividir por puntos, saltos de línea o numeración
      const sentences = normalized
        .split(/[.!?]\s*|\n|\d+\.?\s*/)
        .filter(sentence => sentence.trim().length > 10) // Filtrar oraciones muy cortas
        .map(sentence => sentence.trim())
      
      return sentences.length > 0 ? sentences : [normalized]
    }
    
    return []
  }

  // Actions
  const fetchAIAnalysis = async () => {
    const key = 'aiAnalysis'
    
    try {
      setLoading(key, true)
      clearError(key)
      
      console.log('🤖 Fetching AI analysis...')
      const data = await apiService.getAIAnalysis()
      aiAnalysis.value = data
      
      // Add to history if it's a new analysis
      if (data && data.ai_analysis) {
        analysisHistory.value.unshift(data)
        // Keep only last 10 analyses
        if (analysisHistory.value.length > 10) {
          analysisHistory.value = analysisHistory.value.slice(0, 10)
        }
      }
      
      console.log('✅ AI Analysis loaded successfully:', data)
    } catch (error) {
      console.error('❌ Error loading AI analysis:', error)
      const message = error instanceof Error ? error.message : 'Error loading AI analysis'
      setError(key, message)
      throw error
    } finally {
      setLoading(key, false)
    }
  }

  const generateNewAnalysis = async () => {
    await fetchAIAnalysis()
  }

  // Computed properties (getters)
  const getAnalysisSummary = computed(() => {
    if (!aiAnalysis.value?.ai_analysis) return null
    
    const analysis = aiAnalysis.value.ai_analysis
    
    // Debug: ver la estructura real
    console.log('🔍 Analysis structure:', analysis)
    
    return {
      risks: processTextToArray(analysis.risk_factors).length,
      recommendations: processTextToArray(analysis.strategic_recommendations).length,
      opportunities: processTextToArray(analysis.improvement_opportunities).length,
      criticalMonths: processTextToArray(analysis.critical_months).length
    }
  })

  const aiAnalysisData = computed(() => {
    if (!aiAnalysis.value?.ai_analysis) return null
    
    const analysis = aiAnalysis.value.ai_analysis
    
    return {
      trend_analysis: normalizeText(analysis.trend_analysis || ''),
      seasonal_patterns: normalizeText(analysis.seasonal_patterns || ''),
      risk_factors: processTextToArray(analysis.risk_factors),
      strategic_recommendations: processTextToArray(analysis.strategic_recommendations),
      improvement_opportunities: processTextToArray(analysis.improvement_opportunities),
      critical_months: processTextToArray(analysis.critical_months),
      overall_assessment: normalizeText(analysis.overall_assessment || '')
    }
  })

  const hasAnalysisData = computed(() => {
    return aiAnalysis.value && 
           aiAnalysis.value.status === 'success' &&
           aiAnalysis.value.ai_analysis
  })

  const analysisInsights = computed(() => {
    if (!aiAnalysis.value?.insights) return null
    return aiAnalysis.value.insights
  })

  const businessInsights = computed(() => {
    if (!aiAnalysis.value?.business_insights) return null
    return aiAnalysis.value.business_insights
  })

  return {
    // State
    aiAnalysis,
    analysisHistory,
    loading,
    errors,
    
    // Getters (computed properties)
    isLoading,
    hasError,
    getError,
    getAnalysisSummary,
    aiAnalysisData,
    hasAnalysisData,
    analysisInsights,
    businessInsights,
    
    // Actions
    fetchAIAnalysis,
    generateNewAnalysis,
    setLoading,
    setError,
    clearError
  }
})