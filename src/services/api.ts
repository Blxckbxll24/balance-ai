import axios, { AxiosInstance, AxiosResponse } from 'axios'
import type {
  PredictionData,
  MonthPrediction,
  YearPrediction,
  RangePrediction,
  AIAnalysis,
  DashboardData,
  APIInfo,
  PredictionRequest,
  AIAnalysisRequest,
} from '@/types'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('❌ Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        console.error('❌ Response Error:', error.response?.data || error.message)
        
        // Handle different error types
        if (error.response?.status === 404) {
          throw new Error('Resource not found')
        } else if (error.response?.status === 500) {
          throw new Error('Server error. Please try again later.')
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout. Please check your connection.')
        } else if (!error.response) {
          throw new Error('Network error. Please check your connection.')
        }
        
        throw error
      }
    )
  }

  // Predictions endpoints
  async getPredictions2025(): Promise<PredictionData[]> {
    const response = await this.api.get<PredictionData[]>('/predict/2025')
    return response.data
  }

  async getMonthPrediction(year: number, month: number): Promise<MonthPrediction> {
    const response = await this.api.get<MonthPrediction>(`/predict/month/${year}/${month}`)
    return response.data
  }

  async getYearPrediction(year: number): Promise<YearPrediction> {
    const response = await this.api.get<YearPrediction>(`/predict/year/${year}`)
    return response.data
  }

  async getRangePrediction(request: PredictionRequest): Promise<RangePrediction> {
    const response = await this.api.post<RangePrediction>('/predict/range', request)
    return response.data
  }

  // AI Analysis endpoint
  async getAIAnalysis(request?: AIAnalysisRequest): Promise<AIAnalysis> {
    const response = await this.api.post<AIAnalysis>('/analyze/ai', request || {})
    return response.data
  }

  // Dashboard endpoint
  async getDashboardData(): Promise<DashboardData> {
    const response = await this.api.get<DashboardData>('/dashboard')
    return response.data
  }

  // API Info endpoint
  async getAPIInfo(): Promise<APIInfo> {
    const response = await this.api.get<APIInfo>('/api/info')
    return response.data
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.api.get('/health', { timeout: 5000 })
      return true
    } catch {
      return false
    }
  }
}

export const apiService = new ApiService()
export default apiService