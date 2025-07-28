import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AIAnalysis, LoadingState, ErrorState } from '@/types'
import { apiService } from '@/services/api'

export const useAnalysisStore = defineStore('analysis', () => {
  // State
  const aiAnalysis = ref<AIAnalysis | null>(null)
  const analysisHistory = ref<AIAnalysis[]>([])
  const loading = ref<LoadingState>({})
  const errors = ref<ErrorState>({})
  
  // Getters
  const isLoading = computed(() => (key: string) => loading.value[key] || false)
  const getError = computed(() => (key: string) => errors.value[key] || null)
  
  const hasAnalysis = computed(() => aiAnalysis.value !== null)
  
  const businessInsights = computed(() => {
    return aiAnalysis.value?.insights.business_insights || []
  })
  
  const riskFactors = computed(() => {
    return aiAnalysis.value?.insights.risk_factors || []
  })
  
  const recommendations = computed(() => {
    return aiAnalysis.value?.insights.recommendations || []
  })
  
  const marketTrends = computed(() => {
    return aiAnalysis.value?.insights.market_trends || []
  })
  
  const confidenceScore = computed(() => {
    return aiAnalysis.value?.confidence_score || 0
  })
  
  const confidenceLevel = computed(() => {
    const score = confidenceScore.value
    if (score >= 80) return { level: 'Alta', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 60) return { level: 'Media', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { level: 'Baja', color: 'text-red-600', bgColor: 'bg-red-100' }
  })
  
  const recentAnalyses = computed(() => {
    return analysisHistory.value
      .slice(-5)
      .reverse()
      .map(analysis => ({
        id: analysis.generated_at,
        date: new Date(analysis.generated_at).toLocaleDateString('es-ES'),
        confidence: analysis.confidence_score,
        marketContext: analysis.market_context || 'Sin contexto específico',
        insightsCount: analysis.insights.business_insights.length,
      }))
  })
  
  // Actions
  const setLoading = (key: string, value: boolean) => {
    loading.value[key] = value
  }
  
  const setError = (key: string, error: string | null) => {
    errors.value[key] = error
  }
  
  const clearError = (key: string) => {
    errors.value[key] = null
  }
  
  const fetchAIAnalysis = async (marketContext?: string) => {
    const key = 'aiAnalysis'
    try {
      setLoading(key, true)
      clearError(key)
      
      const data = await apiService.getAIAnalysis({ market_context: marketContext })
      aiAnalysis.value = data
      
      // Add to history if it's not already there
      const existsInHistory = analysisHistory.value.some(
        analysis => analysis.generated_at === data.generated_at
      )
      
      if (!existsInHistory) {
        analysisHistory.value.push(data)
        
        // Keep only the last 20 analyses in history
        if (analysisHistory.value.length > 20) {
          analysisHistory.value = analysisHistory.value.slice(-20)
        }
      }
      
      console.log('✅ AI Analysis generated successfully')
      console.log('📊 Confidence Score:', data.confidence_score)
      console.log('💡 Business Insights:', data.insights.business_insights.length)
      console.log('⚠️ Risk Factors:', data.insights.risk_factors.length)
      console.log('🎯 Recommendations:', data.insights.recommendations.length)
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error generating AI analysis'
      setError(key, message)
      console.error('❌ Error fetching AI analysis:', error)
      throw error
    } finally {
      setLoading(key, false)
    }
  }
  
  const generateNewAnalysis = async (marketContext?: string) => {
    await fetchAIAnalysis(marketContext)
  }
  
  const loadAnalysisFromHistory = (analysisId: string) => {
    const analysis = analysisHistory.value.find(a => a.generated_at === analysisId)
    if (analysis) {
      aiAnalysis.value = analysis
      console.log('📄 Loaded analysis from history:', analysisId)
    }
  }
  
  const clearCurrentAnalysis = () => {
    aiAnalysis.value = null
    clearError('aiAnalysis')
  }
  
  const clearAnalysisHistory = () => {
    analysisHistory.value = []
    console.log('🗑️ Analysis history cleared')
  }
  
  const exportAnalysis = (analysis: AIAnalysis = aiAnalysis.value!) => {
    if (!analysis) return null
    
    return {
      generated_at: analysis.generated_at,
      market_context: analysis.market_context,
      confidence_score: analysis.confidence_score,
      insights: {
        business_insights: analysis.insights.business_insights,
        risk_factors: analysis.insights.risk_factors,
        recommendations: analysis.insights.recommendations,
        market_trends: analysis.insights.market_trends,
      },
    }
  }
  
  const getAnalysisSummary = () => {
    if (!aiAnalysis.value) return null
    
    const insights = aiAnalysis.value.insights
    return {
      totalInsights: insights.business_insights.length,
      totalRisks: insights.risk_factors.length,
      totalRecommendations: insights.recommendations.length,
      totalTrends: insights.market_trends.length,
      confidence: aiAnalysis.value.confidence_score,
      generatedAt: aiAnalysis.value.generated_at,
    }
  }
  
  return {
    // State
    aiAnalysis,
    analysisHistory,
    loading,
    errors,
    
    // Getters
    isLoading,
    getError,
    hasAnalysis,
    businessInsights,
    riskFactors,
    recommendations,
    marketTrends,
    confidenceScore,
    confidenceLevel,
    recentAnalyses,
    
    // Actions
    fetchAIAnalysis,
    generateNewAnalysis,
    loadAnalysisFromHistory,
    clearCurrentAnalysis,
    clearAnalysisHistory,
    clearError,
    exportAnalysis,
    getAnalysisSummary,
  }
})