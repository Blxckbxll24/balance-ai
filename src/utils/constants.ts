export const API_ENDPOINTS = {
  PREDICTIONS_2025: '/predict/2025',
  MONTH_PREDICTION: '/predict/month',
  YEAR_PREDICTION: '/predict/year',
  RANGE_PREDICTION: '/predict/range',
  AI_ANALYSIS: '/analyze/ai',
  DASHBOARD: '/dashboard',
  API_INFO: '/api/info',
} as const

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  light: '#f8fafc',
  dark: '#0f172a',
} as const

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
] as const

export const MENU_ITEMS = [
  { name: 'Dashboard', path: '/', icon: 'HomeIcon' },
  { name: 'Predicciones', path: '/predicciones', icon: 'ChartBarIcon' },
  { name: 'Análisis IA', path: '/analisis', icon: 'CpuChipIcon' },
  { name: 'Reportes', path: '/reportes', icon: 'DocumentChartBarIcon' },
] as const

export const PREDICTION_TABS = [
  { id: '2025', name: '2025 Completo', icon: 'CalendarDaysIcon' },
  { id: 'month', name: 'Mes Específico', icon: 'CalendarIcon' },
  { id: 'year', name: 'Año Específico', icon: 'CalendarDaysIcon' },
  { id: 'range', name: 'Rango Personalizado', icon: 'AdjustmentsHorizontalIcon' },
] as const