import type { ChartData, PredictionData } from '@/types'
import { CHART_COLORS, MONTHS } from './constants'

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return start <= end
}

export const isDateInFuture = (date: string): boolean => {
  const inputDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return inputDate >= today
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const downloadFile = (data: string, filename: string, type: string = 'text/plain'): void => {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export const exportToCSV = (data: Array<Record<string, any>>, filename: string): void => {
  if (!data.length) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n')
  
  downloadFile(csvContent, `${filename}.csv`, 'text/csv')
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    return success
  }
}

export const generateChartData = (
  predictions: PredictionData[],
  label: string = 'Predicciones'
): ChartData => {
  return {
    labels: predictions.map(p => new Date(p.date).toLocaleDateString('es-ES')),
    datasets: [
      {
        label,
        data: predictions.map(p => p.predicted_balance),
        borderColor: CHART_COLORS.primary,
        backgroundColor: CHART_COLORS.primary + '20',
        borderWidth: 2,
        fill: true,
      }
    ]
  }
}

export const generateMonthlyChartData = (
  historical: number[],
  predicted: number[]
): ChartData => {
  return {
    labels: [...MONTHS],
    datasets: [
      {
        label: 'Histórico',
        data: historical,
        backgroundColor: CHART_COLORS.secondary + '80',
        borderColor: CHART_COLORS.secondary,
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Predicho',
        data: predicted,
        backgroundColor: CHART_COLORS.primary + '80',
        borderColor: CHART_COLORS.primary,
        borderWidth: 2,
        fill: false,
      }
    ]
  }
}

export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return 0
  return ((current - previous) / Math.abs(previous)) * 100
}

export const findMinMax = (data: number[]): { min: number; max: number } => {
  return {
    min: Math.min(...data),
    max: Math.max(...data)
  }
}

export const calculateAverage = (data: number[]): number => {
  if (data.length === 0) return 0
  return data.reduce((sum, value) => sum + value, 0) / data.length
}

export const roundToDecimals = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}