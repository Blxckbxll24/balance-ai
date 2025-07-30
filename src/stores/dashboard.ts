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
    
    const { insights, summary } = dashboardData.value
    
    return {
      totalHistorical: summary?.total_historical || 0,
      totalPredicted: insights?.predicted_year_total || 0,
      growthRate: insights?.growth_percentage || 0,
      averageMonthlyHistorical: insights?.average_monthly_current || 0,
      averageMonthlyPredicted: insights?.average_monthly_predicted || 0,
      totalGrowth: summary?.growth_projection || 0,
    }
  })
  
  const recentTrendsChart = computed(() => {
    if (!dashboardData.value?.historical_data || !dashboardData.value?.predictions) return null
    
    // Crear datos de comparación mensual
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    
    return {
      labels: months,
      historical: dashboardData.value.historical_data.map(item => item.actual_income),
      predicted: dashboardData.value.predictions.map(item => item.predicted_income),
    }
  })
  
  const performanceIndicators = computed(() => {
    if (!dashboardData.value?.historical_data) return null
    
    const historicalData = dashboardData.value.historical_data
    const sorted = [...historicalData].sort((a, b) => b.actual_income - a.actual_income)
    
    const best = sorted[0]
    const worst = sorted[sorted.length - 1]
    
    // Calcular volatilidad (desviación estándar)
    const values = historicalData.map(d => d.actual_income)
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
    const volatilityIndex = Math.sqrt(variance) / avg * 100
    
    return {
      bestMonth: formatMonthName(best.month),
      worstMonth: formatMonthName(worst.month),
      volatilityIndex: volatilityIndex,
      totalGrowth: dashboardData.value.summary?.growth_projection || 0,
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
  
  // Función helper para formatear nombres de meses
  const formatMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return `${monthNames[parseInt(month) - 1]} ${year}`
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