<template>
  <div class="w-full h-full">
    <canvas ref="chartCanvas"></canvas>
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
  LineController,  // ← Agregar esto
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,  // ← Registrar el controlador de líneas
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      fill?: boolean
      tension?: number
    }>
  } | null
}

const props = defineProps<Props>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartJS | null = null

const createChart = async () => {
  if (!chartCanvas.value || !props.data) {
    console.log('❌ Cannot create chart: missing canvas or data')
    return
  }

  await nextTick()

  try {
    // Destruir gráfica existente
    if (chartInstance) {
      chartInstance.destroy()
    }

    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) {
      console.error('❌ Cannot get canvas context')
      return
    }

    console.log('🎨 Creating chart with data:', props.data)

    chartInstance = new ChartJS(ctx, {
      type: 'line',
      data: props.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                const value = context.parsed.y
                return `${context.dataset.label}: $${value.toLocaleString('es-ES')}`
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Meses'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Ingresos'
            },
            ticks: {
              callback: function(value) {
                return '$' + Number(value).toLocaleString('es-ES')
              }
            }
          }
        },
        elements: {
          point: {
            radius: 6,
            hoverRadius: 8
          }
        }
      }
    })

    console.log('✅ Chart created successfully')
  } catch (error) {
    console.error('❌ Error creating chart:', error)
  }
}

const destroyChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}

// Watchers
watch(() => props.data, () => {
  if (props.data) {
    createChart()
  } else {
    destroyChart()
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  if (props.data) {
    createChart()
  }
})

onUnmounted(() => {
  destroyChart()
})
</script>