import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { ChartData, ChartDataset } from '@/types'
import { CHART_COLORS } from '@/utils/constants'

export function useChart() {
  const chartRef = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter',
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter',
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter',
          },
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
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  }

  const createLineChart = (data: ChartData, customOptions: any = {}) => {
    return {
      type: 'line',
      data: {
        ...data,
        datasets: data.datasets.map((dataset, index) => ({
          ...dataset,
          borderColor: dataset.borderColor || Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length],
          backgroundColor: dataset.backgroundColor || Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length] + '20',
          borderWidth: dataset.borderWidth || 2,
          fill: dataset.fill !== undefined ? dataset.fill : false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        })),
      },
      options: {
        ...defaultOptions,
        ...customOptions,
      },
    }
  }

  const createBarChart = (data: ChartData, customOptions: any = {}) => {
    return {
      type: 'bar',
      data: {
        ...data,
        datasets: data.datasets.map((dataset, index) => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length] + '80',
          borderColor: dataset.borderColor || Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length],
          borderWidth: dataset.borderWidth || 1,
          borderRadius: 4,
          borderSkipped: false,
        })),
      },
      options: {
        ...defaultOptions,
        ...customOptions,
      },
    }
  }

  const createPieChart = (data: ChartData, customOptions: any = {}) => {
    const colors = Object.values(CHART_COLORS)
    return {
      type: 'pie',
      data: {
        ...data,
        datasets: data.datasets.map(dataset => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || colors,
          borderColor: '#ffffff',
          borderWidth: 2,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          ...defaultOptions.plugins,
          legend: {
            ...defaultOptions.plugins.legend,
            position: 'bottom' as const,
          },
        },
        ...customOptions,
      },
    }
  }

  const createMixedChart = (data: ChartData, customOptions: any = {}) => {
    return {
      type: 'bar',
      data: {
        ...data,
        datasets: data.datasets.map((dataset, index) => ({
          ...dataset,
          type: dataset.type || (index === 0 ? 'bar' : 'line'),
          backgroundColor: dataset.backgroundColor || Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length] + '80',
          borderColor: dataset.borderColor || Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length],
          borderWidth: dataset.borderWidth || 2,
          fill: false,
          tension: 0.4,
        })),
      },
      options: {
        ...defaultOptions,
        ...customOptions,
      },
    }
  }

  const exportChart = (filename: string = 'chart') => {
    if (!chartRef.value) return

    try {
      const canvas = chartRef.value.ctx.canvas
      const url = canvas.toDataURL('image/png')
      
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = url
      link.click()
    } catch (err) {
      error.value = 'Error exporting chart'
      console.error('Chart export error:', err)
    }
  }

  const updateChart = (newData: ChartData) => {
    if (!chartRef.value) return

    try {
      isLoading.value = true
      chartRef.value.data = newData
      chartRef.value.update('active')
      error.value = null
    } catch (err) {
      error.value = 'Error updating chart'
      console.error('Chart update error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const resizeChart = () => {
    if (chartRef.value) {
      chartRef.value.resize()
    }
  }

  // Auto-resize on window resize
  onMounted(() => {
    window.addEventListener('resize', resizeChart)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resizeChart)
  })

  return {
    chartRef,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    createLineChart,
    createBarChart,
    createPieChart,
    createMixedChart,
    exportChart,
    updateChart,
    resizeChart,
  }
}