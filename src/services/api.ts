import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
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

  async getRangePrediction(request: { start_date: string; end_date: string }): Promise<RangePrediction> {
    console.log('🚀 API Request: POST /predict/range', request)
    try {
      const response = await this.api.post<RangePrediction>('/predict/range', request)
      console.log('✅ Range prediction data:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching range prediction:', error)
      throw error
    }
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

  // Data management endpoints
  async uploadDataFile(file: File, sheetName?: string): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (sheetName) {
      formData.append('sheet_name', sheetName)
    }

    console.log('🚀 API Request: POST /data/upload', { 
      filename: file.name, 
      size: file.size,
      type: file.type,
      sheetName 
    })

    try {
      const response = await this.api.post('/data/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 segundos para uploads
      })
      console.log('✅ Upload successful:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Upload failed:', error)
      throw error
    }
  }

  async getDataInfo(): Promise<any> {
    console.log('🚀 API Request: GET /data/info')
    try {
      const response = await this.api.get('/data/info')
      console.log('✅ Data info retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Failed to get data info:', error)
      throw error
    }
  }

  async resetData(): Promise<any> {
    console.log('🚀 API Request: POST /data/reset')
    try {
      const response = await this.api.post('/data/reset')
      console.log('✅ Data reset successful:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Data reset failed:', error)
      throw error
    }
  }
}

export const apiService = new ApiService()
export default apiService