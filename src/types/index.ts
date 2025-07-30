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
  status: string
  start_date: string
  end_date: string
  total_months: number
  total_predicted: number
  average_monthly: number
  monthly_data: Record<string, any>
  summary: Record<string, any>
}

export interface AIAnalysis {
  status: string
  ai_analysis: {
    trend_analysis: string
    seasonal_patterns: string
    risk_factors: string[] | string  // Puede ser array o string
    strategic_recommendations: string[] | string  // Puede ser array o string
    improvement_opportunities: string[] | string  // Puede ser array o string
    critical_months: string[] | string  // Puede ser array o string
    overall_assessment: string
  }
  business_insights?: Record<string, any>
  insights?: {
    current_year_total: number
    predicted_year_total: number
    growth_percentage: number
    average_monthly_current: number
    average_monthly_predicted: number
    best_model: string
    months_with_data: number
  }
}

export interface DashboardData {
  status: string
  historical_data: HistoricalData[]
  predictions: PredictionData[]
  insights: {
    current_year_total: number
    predicted_year_total: number
    growth_percentage: number
    average_monthly_current: number
    average_monthly_predicted: number
    best_model: string
    months_with_data: number
  }
  summary: {
    total_historical: number
    total_predicted: number
    months_with_data: number
    growth_projection: number
  }
}

export interface APIInfo {
  name: string
  version: string
  description: string
  endpoints: string[]
  last_updated: string
}

// Data management types
export interface DataUploadResponse {
  status: string
  message: string
  file_info: {
    filename: string
    size_mb: number
    records_added: number
    sheet_name: string
    upload_time: string
  }
  data_summary: {
    total_records: number
    date_range: {
      start: string
      end: string
    }
    total_income: number
    average_monthly: number
    records_from_existing: number
    records_from_new_file: number
  }
  total_records: number
}

export interface DataInfoResponse {
  status: string
  current_data: {
    total_records: number
    date_range: {
      start: string
      end: string
    }
    data_source: string
    last_updated: string
  }
  data_sources: Array<{
    type: string
    description?: string
    filename?: string
    size_mb?: number
    upload_date?: string
    status: string
  }>
  statistics: {
    total_income: number
    average_monthly: number
    median_monthly: number
    min_monthly: number
    max_monthly: number
    std_deviation: number
    months_with_data: number
  }
}

export interface DataResetResponse {
  status: string
  message: string
  data_info: {
    total_records: number
    date_range: {
      start: string
      end: string
    }
    data_source: string
    reset_time: string
  }
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
  backgroundColor: string
  borderColor: string
  borderWidth?: number
  fill?: boolean
  tension?: number
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