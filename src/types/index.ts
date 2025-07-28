// API Response Types
export interface PredictionData {
  date: string
  predicted_balance: number
  confidence_interval?: {
    lower: number
    upper: number
  }
}

export interface MonthPrediction {
  year: number
  month: number
  predicted_balance: number
  confidence_interval: {
    lower: number
    upper: number
  }
  details: {
    weekly_breakdown: Array<{
      week: number
      predicted_balance: number
    }>
    factors: string[]
  }
}

export interface YearPrediction {
  year: number
  total_predicted: number
  monthly_breakdown: Array<{
    month: number
    predicted_balance: number
    confidence_interval: {
      lower: number
      upper: number
    }
  }>
  summary: {
    average_monthly: number
    highest_month: number
    lowest_month: number
    growth_rate: number
  }
}

export interface RangePrediction {
  start_date: string
  end_date: string
  predictions: PredictionData[]
  summary: {
    total_predicted: number
    average_daily: number
    trend: 'increasing' | 'decreasing' | 'stable'
  }
}

export interface AIAnalysis {
  market_context?: string
  insights: {
    business_insights: string[]
    risk_factors: string[]
    recommendations: string[]
    market_trends: string[]
  }
  confidence_score: number
  generated_at: string
}

export interface DashboardData {
  historical_summary: {
    total_historical: number
    average_monthly: number
    last_update: string
  }
  predictions_summary: {
    total_predicted_2025: number
    average_monthly_2025: number
    growth_rate: number
  }
  recent_trends: Array<{
    month: string
    historical: number
    predicted: number
  }>
  key_metrics: {
    total_growth: number
    best_month: string
    worst_month: string
    volatility_index: number
  }
}

export interface APIInfo {
  name: string
  version: string
  description: string
  endpoints: string[]
  last_updated: string
}

// UI State Types
export interface LoadingState {
  [key: string]: boolean
}

export interface ErrorState {
  [key: string]: string | null
}

// Chart Data Types
export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string
  borderWidth?: number
  fill?: boolean
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

// Form Types
export interface DateRange {
  startDate: string
  endDate: string
}

export interface PredictionRequest {
  start_date: string
  end_date: string
  market_context?: string
}

export interface AIAnalysisRequest {
  market_context?: string
}

// Navigation Types
export interface MenuItem {
  name: string
  path: string
  icon: string
  active?: boolean
}

// Theme Types
export interface ThemeConfig {
  darkMode: boolean
}

// Stats Card Types
export interface StatCardData {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: string
  subtitle?: string
}