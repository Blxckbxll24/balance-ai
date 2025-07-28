<template>
  <div class="chart-container">
    <LoadingSpinner
      v-if="isLoading"
      size="lg"
      text="Cargando gráfica..."
      class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-90"
    />
    
    <div v-else-if="error" class="absolute inset-0 flex items-center justify-center">
      <div class="text-center">
        <p class="text-red-600 dark:text-red-400 mb-2">{{ error }}</p>
        <button
          @click="$emit('retry')"
          class="btn-primary text-sm"
        >
          Reintentar
        </button>
      </div>
    </div>

    <canvas
      v-else
      ref="canvasRef"
      :id="chartId"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { ChartData } from '@/types'
import { useChart } from '@/composables/useChart'
import { useTheme } from '@/composables/useTheme'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { generateRandomId } from '@/utils/helpers'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  data: ChartData
  options?: any
  isLoading?: boolean
  error?: string | null
  title?: string
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: null,
  height: 400
})

defineEmits<{
  retry: []
}>()

const canvasRef = ref<HTMLCanvasElement>()
const chartInstance = ref<ChartJS | null>(null)
const chartId = ref(generateRandomId())

const { createLineChart } = useChart()
const { chartColors } = useTheme()

const initChart = async () => {
  if (!canvasRef.value || !props.data) return

  await nextTick()

  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  try {
    const ctx = canvasRef.value.getContext('2d')
    if (!ctx) return

    // Create chart with theme-aware colors
    const chartConfig = createLineChart(props.data, {
      ...props.options,
      plugins: {
        ...props.options?.plugins,
        title: {
          display: !!props.title,
          text: props.title,
          color: chartColors.value.text,
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        legend: {
          ...props.options?.plugins?.legend,
          labels: {
            color: chartColors.value.text,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: chartColors.value.background,
          titleColor: chartColors.value.text,
          bodyColor: chartColors.value.text,
          borderColor: chartColors.value.border,
        },
      },
      scales: {
        x: {
          grid: {
            color: chartColors.value.border,
          },
          ticks: {
            color: chartColors.value.textMuted,
          },
        },
        y: {
          grid: {
            color: chartColors.value.border,
          },
          ticks: {
            color: chartColors.value.textMuted,
            callback: function(value: any) {
              return new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
              }).format(value)
            },
          },
        },
      },
    })

    chartInstance.value = new ChartJS(ctx, chartConfig as any)
  } catch (error) {
    console.error('Error creating line chart:', error)
  }
}

const updateChart = () => {
  if (chartInstance.value && props.data) {
    chartInstance.value.data = props.data
    chartInstance.value.update('active')
  }
}

const resizeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}

// Watch for data changes
watch(() => props.data, updateChart, { deep: true })

// Watch for theme changes
watch(() => chartColors.value, initChart, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
  window.removeEventListener('resize', resizeChart)
})

// Expose chart instance for parent components
defineExpose({
  chart: chartInstance,
  updateChart,
  resizeChart,
})
</script>