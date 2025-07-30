import { ref, computed, readonly } from 'vue'
import { apiService } from '@/services/api'
import type { DataUploadResponse, DataInfoResponse, DataResetResponse } from '@/types'

export function useDataManagement() {
  // State
  const isUploading = ref(false)
  const isResetting = ref(false)
  const isLoadingInfo = ref(false)
  const uploadProgress = ref(0)
  const lastError = ref<string | null>(null)
  const dataInfo = ref<DataInfoResponse | null>(null)
  
  // File validation
  const allowedExtensions = ['xlsx', 'xls']
  const maxFileSize = 16 * 1024 * 1024 // 16MB

  const validateFile = (file: File): string | null => {
    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !allowedExtensions.includes(extension)) {
      return `Tipo de archivo no permitido. Use: ${allowedExtensions.join(', ')}`
    }

    // Check file size
    if (file.size > maxFileSize) {
      return `Archivo demasiado grande. Máximo: ${Math.round(maxFileSize / (1024 * 1024))}MB`
    }

    return null
  }

  const clearError = () => {
    lastError.value = null
  }

  // Upload file
  const uploadFile = async (file: File, sheetName?: string): Promise<DataUploadResponse | null> => {
    try {
      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        lastError.value = validationError
        throw new Error(validationError)
      }

      isUploading.value = true
      uploadProgress.value = 0
      clearError()

      // Simulate upload progress (since we can't track real progress with this API)
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 90) {
          uploadProgress.value += 10
        }
      }, 200)

      const result = await apiService.uploadDataFile(file, sheetName)
      
      clearInterval(progressInterval)
      uploadProgress.value = 100

      // Refresh data info after successful upload
      await loadDataInfo()

      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al subir archivo'
      lastError.value = message
      throw error
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }

  // Get data info
  const loadDataInfo = async (): Promise<DataInfoResponse | null> => {
    try {
      isLoadingInfo.value = true
      clearError()

      const result = await apiService.getDataInfo()
      dataInfo.value = result

      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al obtener información de datos'
      lastError.value = message
      throw error
    } finally {
      isLoadingInfo.value = false
    }
  }

  // Reset data
  const resetData = async (): Promise<DataResetResponse | null> => {
    try {
      isResetting.value = true
      clearError()

      const result = await apiService.resetData()
      
      // Refresh data info after reset
      await loadDataInfo()

      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al restablecer datos'
      lastError.value = message
      throw error
    } finally {
      isResetting.value = false
    }
  }

  // Computed properties
  const hasDataInfo = computed(() => dataInfo.value !== null)
  
  const dataSourceSummary = computed(() => {
    if (!dataInfo.value) return null
    
    return {
      totalRecords: dataInfo.value.current_data.total_records,
      dateRange: dataInfo.value.current_data.date_range,
      dataSource: dataInfo.value.current_data.data_source,
      sourcesCount: dataInfo.value.data_sources.length,
      isCombo: dataInfo.value.current_data.data_source === 'combined'
    }
  })

  const statistics = computed(() => {
    if (!dataInfo.value) return null
    return dataInfo.value.statistics
  })

  const dataSources = computed(() => {
    if (!dataInfo.value) return []
    return dataInfo.value.data_sources
  })

  const isLoading = computed(() => 
    isUploading.value || isResetting.value || isLoadingInfo.value
  )

  const canUpload = computed(() => !isUploading.value)

  return {
    // State
    isUploading: readonly(isUploading),
    isResetting: readonly(isResetting),
    isLoadingInfo: readonly(isLoadingInfo),
    isLoading,
    uploadProgress: readonly(uploadProgress),
    lastError: readonly(lastError),
    dataInfo: readonly(dataInfo),
    
    // Computed
    hasDataInfo,
    dataSourceSummary,
    statistics,
    dataSources,
    canUpload,
    
    // Methods
    uploadFile,
    loadDataInfo,
    resetData,
    validateFile,
    clearError,
    
    // Constants
    allowedExtensions,
    maxFileSize
  }
}
