import { ref, readonly } from 'vue'
import { apiService } from '@/services/api'

export function useApi() {
  const isOnline = ref(true)
  const lastError = ref<string | null>(null)

  const checkConnection = async (): Promise<boolean> => {
    try {
      const isHealthy = await apiService.healthCheck()
      isOnline.value = isHealthy
      if (isHealthy) {
        lastError.value = null
      }
      return isHealthy
    } catch (error) {
      isOnline.value = false
      lastError.value = error instanceof Error ? error.message : 'Connection error'
      return false
    }
  }

  const withErrorHandling = async <T>(
    operation: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | null> => {
    try {
      lastError.value = null
      const result = await operation()
      return result
    } catch (error) {
      const message = errorMessage || (error instanceof Error ? error.message : 'Unknown error')
      lastError.value = message
      console.error('API Error:', error)
      throw error
    }
  }

  const clearError = () => {
    lastError.value = null
  }

  return {
    isOnline: readonly(isOnline),
    lastError: readonly(lastError),
    checkConnection,
    withErrorHandling,
    clearError,
  }
}