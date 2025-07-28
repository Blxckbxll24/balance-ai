import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DashboardData, LoadingState, ErrorState } from '@/types'
import { apiService } from '@/services/api'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const dashboardData = ref<DashboardData | null>(null)
  const loading = ref<LoadingState>({})
  const errors = ref<ErrorState>({})
  const lastUpdated = ref<Date | null>(null)
  
  // Getters
  const isLoading = computed(() => (key: string) => loading.value[key] || false)
  const getError = computed(() => (key: string) => errors.value[key] || null)
  
  const keyMetrics = computed(() => {
    if (!dashboardData.value) return null
    
    const { historical_summary, predictions_summary } = dashboardData.value
    
    return {
      totalHistorical: historical_summary.total_historical,
      totalPredicted: predictions_summary.total_predicted_2025,
      growthRate: predictions_summary.growth_rate,
      averageMonthlyHistorical: historical_summary.average_monthly,
      averageMonthlyPredicted: predictions_summary.average_monthly_2025,
      totalGrowth: dashboardData.value.key_metrics.total_growth,
    }
  })
  
  const recentTrendsChart = computed(() => {
    if (!dashboardData.value?.recent_trends) return null
    
    return {
      labels: dashboardData.value.recent_trends.map(t => t.month),
      historical: dashboardData.value.recent_trends.map(t => t.historical),
      predicted: dashboardData.value.recent_trends.map(t => t.predicted),
    }
  })
  
  const performanceIndicators = computed(() => {
    if (!dashboardData.value) return null
    
    const { key_metrics } = dashboardData.value
    
    return {
      bestMonth: key_metrics.best_month,
      worstMonth: key_metrics.worst_month,
      volatilityIndex: key_metrics.volatility_index,
      totalGrowth: key_metrics.total_growth,
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
  
  const fetchDashboardData = async (forceRefresh: boolean = false) => {
    const key = 'dashboard'
    
    // Check if we have recent data and don't need to refresh
    if (!forceRefresh && dashboardData.value && lastUpdated.value) {
      const timeDiff = Date.now() - lastUpdated.value.getTime()
      const fiveMinutes = 5 * 60 * 1000
      if (timeDiff < fiveMinutes) {
        console.log('📊 Using cached dashboard data')
        return
      }
    }
    
    try {
      setLoading(key, true)
      clearError(key)
      
      const data = await apiService.getDashboardData()
      dashboardData.value = data
      lastUpdated.value = new Date()
      
      console.log('✅ Dashboard data loaded successfully')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading dashboard data'
      setError(key, message)
      console.error('❌ Error fetching dashboard data:', error)
      throw error
    } finally {
      setLoading(key, false)
    }
  }
  
  const refreshDashboard = async () => {
    await fetchDashboardData(true)
  }
  
  const resetDashboard = () => {
    dashboardData.value = null
    lastUpdated.value = null
    clearError('dashboard')
  }
  
  // Auto-refresh functionality
  let refreshInterval: NodeJS.Timeout | null = null
  
  const startAutoRefresh = (intervalMinutes: number = 5) => {
    if (refreshInterval) clearInterval(refreshInterval)
    
    refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard data...')
      fetchDashboardData(true).catch(error => {
        console.warn('⚠️ Auto-refresh failed:', error)
      })
    }, intervalMinutes * 60 * 1000)
    
    console.log(`⏰ Auto-refresh enabled (${intervalMinutes} minutes)`)
  }
  
  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
      console.log('⏹️ Auto-refresh disabled')
    }
  }
  
  return {
    // State
    dashboardData,
    loading,
    errors,
    lastUpdated,
    
    // Getters
    isLoading,
    getError,
    keyMetrics,
    recentTrendsChart,
    performanceIndicators,
    
    // Actions
    fetchDashboardData,
    refreshDashboard,
    resetDashboard,
    clearError,
    startAutoRefresh,
    stopAutoRefresh,
  }
})