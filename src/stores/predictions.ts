import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  PredictionData,
  MonthPrediction,
  YearPrediction,
  RangePrediction,
  LoadingState,
  ErrorState,
} from '@/types'
import { apiService } from '@/services/api'

export const usePredictionsStore = defineStore('predictions', () => {
  // State
  const predictions2025 = ref<PredictionData[]>([])
  const monthPrediction = ref<MonthPrediction | null>(null)
  const yearPrediction = ref<YearPrediction | null>(null)
  const rangePrediction = ref<RangePrediction | null>(null)
  
  const loading = ref<LoadingState>({})
  const errors = ref<ErrorState>({})
  
  // Getters
  const isLoading = computed(() => (key: string) => loading.value[key] || false)
  const getError = computed(() => (key: string) => errors.value[key] || null)
  
  const predictions2025Summary = computed(() => {
    if (!predictions2025.value.length) return null
    
    const totalPredicted = predictions2025.value.reduce(
      (sum, pred) => sum + pred.predicted_balance, 0
    )
    const averageMonthly = totalPredicted / 12
    
    return {
      totalPredicted,
      averageMonthly,
      dataPoints: predictions2025.value.length,
    }
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
  
  const fetchPredictions2025 = async () => {
    const key = 'predictions2025'
    try {
      setLoading(key, true)
      clearError(key)
      
      const data = await apiService.getPredictions2025()
      predictions2025.value = data
      
      console.log('✅ Predictions 2025 loaded:', data.length, 'records')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading predictions'
      setError(key, message)
      console.error('❌ Error fetching predictions 2025:', error)
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
      
      console.log(`✅ Month prediction loaded: ${year}/${month}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading month prediction'
      setError(key, message)
      console.error('❌ Error fetching month prediction:', error)
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
      
      console.log(`✅ Year prediction loaded: ${year}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading year prediction'
      setError(key, message)
      console.error('❌ Error fetching year prediction:', error)
      throw error
    } finally {
      setLoading(key, false)
    }
  }
  
  const fetchRangePrediction = async (startDate: string, endDate: string, marketContext?: string) => {
    const key = 'rangePrediction'
    try {
      setLoading(key, true)
      clearError(key)
      
      const data = await apiService.getRangePrediction({
        start_date: startDate,
        end_date: endDate,
        market_context: marketContext,
      })
      rangePrediction.value = data
      
      console.log(`✅ Range prediction loaded: ${startDate} - ${endDate}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading range prediction'
      setError(key, message)
      console.error('❌ Error fetching range prediction:', error)
      throw error
    } finally {
      setLoading(key, false)
    }
  }
  
  // Reset functions
  const resetMonthPrediction = () => {
    monthPrediction.value = null
    clearError('monthPrediction')
  }
  
  const resetYearPrediction = () => {
    yearPrediction.value = null
    clearError('yearPrediction')
  }
  
  const resetRangePrediction = () => {
    rangePrediction.value = null
    clearError('rangePrediction')
  }
  
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
    getError,
    predictions2025Summary,
    
    // Actions
    fetchPredictions2025,
    fetchMonthPrediction,
    fetchYearPrediction,
    fetchRangePrediction,
    resetMonthPrediction,
    resetYearPrediction,
    resetRangePrediction,
    clearError,
  }
})