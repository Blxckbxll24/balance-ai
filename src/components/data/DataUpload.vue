<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Gestión de Datos
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Cargar archivos Excel adicionales para mejorar las predicciones
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="loadDataInfo"
          :disabled="isLoading"
          class="btn-outline"
          title="Actualizar información"
        >
          <ArrowPathIcon 
            :class="['w-4 h-4', isLoadingInfo ? 'animate-spin' : '']" 
          />
        </button>
        <button
          @click="showResetConfirm = true"
          :disabled="isLoading"
          class="btn-outline text-red-600 border-red-300 hover:bg-red-50"
          title="Restablecer datos"
        >
          <ArrowUturnLeftIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Current Data Info -->
    <div v-if="hasDataInfo && dataSourceSummary" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div class="flex items-center">
            <ChartBarIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <div>
              <p class="text-sm font-medium text-blue-900 dark:text-blue-100">
                Total Registros
              </p>
              <p class="text-xl font-bold text-blue-600 dark:text-blue-400">
                {{ dataSourceSummary.totalRecords }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div class="flex items-center">
            <CalendarIcon class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <div>
              <p class="text-sm font-medium text-green-900 dark:text-green-100">
                Rango de Fechas
              </p>
              <p class="text-xs text-green-600 dark:text-green-400">
                {{ formatDate(dataSourceSummary.dateRange.start) }} - 
                {{ formatDate(dataSourceSummary.dateRange.end) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div class="flex items-center">
            <DocumentIcon class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
            <div>
              <p class="text-sm font-medium text-purple-900 dark:text-purple-100">
                Fuentes de Datos
              </p>
              <p class="text-xl font-bold text-purple-600 dark:text-purple-400">
                {{ dataSourceSummary.sourcesCount }}
                <span v-if="dataSourceSummary.isCombo" class="text-xs ml-1">
                  (Combinado)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- File Upload Area -->
    <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 mb-6">
      <div class="text-center">
        <CloudArrowUpIcon class="mx-auto h-12 w-12 text-gray-400" />
        <div class="mt-4">
          <label for="file-upload" class="cursor-pointer">
            <span class="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
              Arrastra un archivo aquí o 
              <span class="text-blue-600 hover:text-blue-500">selecciona uno</span>
            </span>
          </label>
          <input
            id="file-upload"
            ref="fileInput"
            type="file"
            class="sr-only"
            :accept="acceptedFiles"
            @change="handleFileSelect"
            :disabled="!canUpload"
          />
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Archivos Excel (.xlsx, .xls) hasta {{ maxFileSizeMB }}MB
        </p>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="isUploading" class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Subiendo archivo...
        </span>
        <span class="text-sm text-gray-500">{{ uploadProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
    </div>

    <!-- Sheet Name Input (when file is selected) -->
    <div v-if="selectedFile && !isUploading" class="mb-6">
      <label class="label">
        Nombre de la hoja (opcional)
      </label>
      <input
        v-model="sheetName"
        type="text"
        class="input-field"
        placeholder="Ej: INGRESOS_ISR_, Datos, Hoja1"
      />
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Si no se especifica, se usará la primera hoja del archivo
      </p>
    </div>

    <!-- Upload Button -->
    <div v-if="selectedFile && !isUploading" class="mb-6">
      <button
        @click="handleUpload"
        :disabled="!canUpload"
        class="btn-primary w-full"
      >
        <CloudArrowUpIcon class="w-4 h-4 mr-2" />
        Subir Archivo: {{ selectedFile.name }}
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="lastError" class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
      <div class="flex">
        <ExclamationCircleIcon class="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="text-sm font-medium text-red-800 dark:text-red-200">
            Error
          </h4>
          <p class="text-sm text-red-700 dark:text-red-300 mt-1">
            {{ lastError }}
          </p>
        </div>
      </div>
    </div>

    <!-- Data Sources List -->
    <div v-if="dataSources.length > 0" class="space-y-4">
      <h4 class="text-sm font-medium text-gray-900 dark:text-white">
        Fuentes de Datos Activas
      </h4>
      <div class="space-y-2">
        <div
          v-for="source in dataSources"
          :key="source.filename || source.type"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div class="flex items-center">
            <DocumentIcon 
              :class="[
                'w-4 h-4 mr-3',
                source.type === 'default' ? 'text-blue-500' : 'text-green-500'
              ]" 
            />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ source.filename || source.description }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ source.type === 'default' ? 'Datos base' : `Subido: ${formatDate(source.upload_date!)}` }}
                <span v-if="source.size_mb" class="ml-2">
                  ({{ source.size_mb }} MB)
                </span>
              </p>
            </div>
          </div>
          <div class="flex items-center">
            <span 
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                source.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              ]"
            >
              {{ source.status === 'active' ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Confirmation Modal -->
    <div v-if="showResetConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
        <div class="flex items-center mb-4">
          <ExclamationTriangleIcon class="w-6 h-6 text-red-500 mr-3" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Confirmar Restablecimiento
          </h3>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Esto eliminará todos los datos adicionales cargados y volverá a usar únicamente 
          los datos base del sistema. Los archivos físicos se mantendrán en el servidor.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showResetConfirm = false"
            class="btn-outline"
            :disabled="isResetting"
          >
            Cancelar
          </button>
          <button
            @click="handleReset"
            class="btn-primary bg-red-600 hover:bg-red-700"
            :disabled="isResetting"
          >
            <LoadingSpinner v-if="isResetting" size="sm" class="mr-2" />
            {{ isResetting ? 'Restableciendo...' : 'Restablecer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import {
  CloudArrowUpIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

import { useDataManagement } from '@/composables/useDataManagement'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { formatDate } from '@/utils/formatters'

const toast = useToast()

const {
  isUploading,
  isResetting,
  isLoadingInfo,
  isLoading,
  uploadProgress,
  lastError,
  hasDataInfo,
  dataSourceSummary,
  statistics,
  dataSources,
  canUpload,
  uploadFile,
  loadDataInfo,
  resetData,
  validateFile,
  clearError,
  allowedExtensions,
  maxFileSize
} = useDataManagement()

// Local state
const selectedFile = ref<File | null>(null)
const sheetName = ref('')
const showResetConfirm = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Computed
const acceptedFiles = computed(() => 
  allowedExtensions.map(ext => `.${ext}`).join(',')
)

const maxFileSizeMB = computed(() => 
  Math.round(maxFileSize / (1024 * 1024))
)

// Methods
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  clearError()
  
  // Validate file
  const validationError = validateFile(file)
  if (validationError) {
    toast.error(validationError)
    return
  }
  
  selectedFile.value = file
  sheetName.value = ''
}

const handleUpload = async () => {
  if (!selectedFile.value) return
  
  try {
    const result = await uploadFile(selectedFile.value, sheetName.value || undefined)
    
    if (result) {
      toast.success(`✅ Archivo subido exitosamente: ${result.file_info.records_added} registros agregados`)
      
      // Reset form
      selectedFile.value = null
      sheetName.value = ''
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  } catch (error) {
    console.error('Upload error:', error)
    toast.error('❌ Error al subir archivo')
  }
}

const handleReset = async () => {
  try {
    const result = await resetData()
    
    if (result) {
      toast.success('✅ Datos restablecidos exitosamente')
      showResetConfirm.value = false
      
      // Reset form
      selectedFile.value = null
      sheetName.value = ''
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  } catch (error) {
    console.error('Reset error:', error)
    toast.error('❌ Error al restablecer datos')
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await loadDataInfo()
  } catch (error) {
    console.warn('Could not load initial data info:', error)
  }
})

// Clear error when user interacts
const clearErrorOnInteraction = () => {
  if (lastError.value) {
    clearError()
  }
}
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}

.btn-outline {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}

.dark .btn-outline {
  @apply border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700;
}

.input-field {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
}

.dark .input-field {
  @apply border-gray-600 bg-gray-700 text-white placeholder-gray-400;
}

.label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}
</style>
