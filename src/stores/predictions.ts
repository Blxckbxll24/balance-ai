import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Predictions2025Response, MonthPrediction, YearPrediction, RangePrediction, LoadingState, ErrorState } from '@/types'
import { apiService } from '@/services/api'

export const usePredictionsStore = defineStore('predictions', () => {
  // State
  const predictions2025 = ref<Predictions2025Response | null>(null)
  const monthPrediction = ref<MonthPrediction | null>(null)
  const yearPrediction = ref<YearPrediction | null>(null)
  const rangePrediction = ref<RangePrediction | null>(null)
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

  // Actions
  const fetchPredictions2025 = async (forceRefresh: boolean = false) => {
    const key = 'predictions2025'
    
    try {
      setLoading(key, true)
      clearError(key)
      
      const data = await apiService.getPredictions2025()
      predictions2025.value = data
      
      console.log('✅ Predictions 2025 loaded:', data)
    } catch (error) {
      console.error('❌ Error loading predictions 2025:', error)
      const message = error instanceof Error ? error.message : 'Error loading predictions'
      setError(key, message)
      throw error
    } finally {
      setLoading(key, false)
    }
  }

  const fetchMonthPrediction = async (year: number, month: number) => {
    const key = 'monthPrediction'
    
    try {
      setLoading(key, true)
      clearError(key)
      
      const data = await apiService.getMonthPrediction(year, month)
      monthPrediction.value = data
      
      console.log('✅ Month prediction loaded:', data)
    } catch (error) {
      console.error('❌ Error loading month prediction:', error)
      const message = error instanceof Error ? error.message : 'Error loading month prediction'
      setError(key, message)
      throw error
    } finally {
      setLoading(key, false)
    }
  }

  const fetchYearPrediction = async (year: number) => {
    const key = 'yearPrediction'
    
    try {
      setLoading(key, true)
      clearError(key)
      
      const data = await apiService.getYearPrediction(year)
      yearPrediction.value = data
      
      console.log('✅ Year prediction loaded:', data)
    } catch (error) {
      console.error('❌ Error loading year prediction:', error)
      const message = error instanceof Error ? error.message : 'Error loading year prediction'
      setError(key, message)
      throw error
    } finally {
      setLoading(key, false)
    }
  }

  const fetchRangePrediction = async (startDate: string, endDate: string) => {
    const key = 'rangePrediction'
    
    try {
      setLoading(key, true)
      clearError(key)
      
      const data = await apiService.getRangePrediction({ start_date: startDate, end_date: endDate })
      rangePrediction.value = data
      
      console.log('✅ Range prediction loaded:', data)
    } catch (error) {
      console.error('❌ Error loading range prediction:', error)
      const message = error instanceof Error ? error.message : 'Error loading range prediction'
      setError(key, message)
      throw error
    } finally {
      setLoading(key, false)
    }
  }

  // Computed properties para usar en los componentes
  const predictions2025Data = computed(() => {
    if (!predictions2025.value?.predictions) return []
    return predictions2025.value.predictions
  })

  const predictions2025Insights = computed(() => {
    if (!predictions2025.value?.insights) return null
    return predictions2025.value.insights
  })

  // Chart data
  const predictions2025ChartData = computed(() => {
    console.log('🔍 Building chart data:', {
      hasPredictions: !!predictions2025.value?.predictions,
      predictionsLength: predictions2025.value?.predictions?.length || 0,
      sampleData: predictions2025.value?.predictions?.slice(0, 2)
    })
    
    if (!predictions2025.value?.predictions || predictions2025.value.predictions.length === 0) {
      console.log('❌ No predictions data available')
      return null
    }
    
    const data = predictions2025.value.predictions
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    
    const chartData = {
      labels: months,
      datasets: [{
        label: 'Predicciones 2025',
        data: data.map(pred => pred.predicted_income),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    }
    
    console.log('✅ Chart data generated:', chartData)
    return chartData
  })

  const predictions2025BarData = computed(() => {
    console.log('📊 Building bar chart data:', {
      hasPredictions: !!predictions2025.value?.predictions,
      predictionsLength: predictions2025.value?.predictions?.length || 0
    })
    
    if (!predictions2025.value?.predictions || predictions2025.value.predictions.length === 0) {
      console.log('❌ No predictions data for bar chart')
      return null
    }
    
    const data = predictions2025.value.predictions
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    
    const barData = {
      labels: months,
      datasets: [{
        label: 'Ingresos Predichos',
        data: data.map(pred => pred.predicted_income),
        backgroundColor: [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
          '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
          '#ec4899', '#6366f1', '#14b8a6', '#f43f5e'
        ],
        borderRadius: 8
      }]
    }
    
    console.log('✅ Bar chart data generated:', barData)
    return barData
  })

  const yearPredictionData = computed(() => {
    if (!yearPrediction.value) return null
    
    return {
      total: yearPrediction.value.total_predicted || 0,
      average_monthly: yearPrediction.value.average_monthly || 0,
      growth_projection: yearPrediction.value.growth_projection || '',
      best_months: yearPrediction.value.best_months || [],
      challenging_months: yearPrediction.value.challenging_months || [],
      recommendations: yearPrediction.value.recommendations || []
    }
  })

  const monthPredictionData = computed(() => {
    if (!monthPrediction.value) return null
    
    return {
      predicted_income: monthPrediction.value.predicted_income || 0,
      month_name: monthPrediction.value.month_name || '',
      confidence_level: monthPrediction.value.confidence_level || '',
      seasonal_factor: monthPrediction.value.seasonal_factor || 0,
      comparison_to_average: monthPrediction.value.comparison_to_average || ''
    }
  })

  const rangePredictionData = computed(() => {
    if (!rangePrediction.value) return null
    
    return {
      total_predicted: rangePrediction.value.total_predicted || 0,
      average_monthly: rangePrediction.value.average_monthly || 0,
      total_months: rangePrediction.value.total_months || 0,
      start_date: rangePrediction.value.start_date || '',
      end_date: rangePrediction.value.end_date || ''
    }
  })

  return {
    // State
    predictions2025,
    monthPrediction,
    yearPrediction,
    rangePrediction,
    loading,
    errors,
    
    // Getters
    isLoading,
    hasError,
    getError,
    predictions2025Data,
    predictions2025Insights,
    predictions2025ChartData,
    predictions2025BarData,
    yearPredictionData,
    monthPredictionData,
    rangePredictionData,
    
    // Actions
    fetchPredictions2025,
    fetchMonthPrediction,
    fetchYearPrediction,
    fetchRangePrediction,
    setLoading,
    setError,
    clearError
  }
})