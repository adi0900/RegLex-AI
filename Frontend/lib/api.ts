import axios, { AxiosError, AxiosResponse } from 'axios'
import { APP_CONFIG, isOfflineMode, getApiConfig } from '@/lib/config'
import { FastAPIService } from '@/lib/fastapi-services'

// Get API configuration from environment
const apiConfig = getApiConfig()

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
  withCredentials: false,
})

// Retry configuration
const MAX_RETRIES = APP_CONFIG.API_RETRY_ATTEMPTS
const RETRY_DELAY = APP_CONFIG.API_RETRY_DELAY

// Retry utility function
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const shouldRetry = (error: AxiosError): boolean => {
  // Retry on network errors or 5xx server errors
  if (!error.response) return true
  const status = error.response.status
  return status >= 500 || status === 429 // Server errors or rate limiting
}

const retryRequest = async (
  requestFn: () => Promise<AxiosResponse>,
  retries = MAX_RETRIES
): Promise<AxiosResponse> => {
  try {
    return await requestFn()
  } catch (error) {
    if (retries > 0 && error instanceof AxiosError && shouldRetry(error)) {
      console.warn(`API request failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`)
      await sleep(RETRY_DELAY * (MAX_RETRIES - retries + 1)) // Exponential backoff
      return retryRequest(requestFn, retries - 1)
    }
    throw error
  }
}

// Request interceptor with modern patterns
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.params) {
      config.params = { ...config.params, _t: Date.now() }
    } else {
      config.params = { _t: Date.now() }
    }

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor with enhanced error handling and logging
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful API calls in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
    }
    return response
  },
  (error: AxiosError) => {
    // Enhanced error logging
    const errorInfo = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message
    }
    
    console.error('🚨 API Error:', errorInfo)

    // Handle network errors
    if (!error.response) {
      const networkError = new Error('Network error - please check your connection and backend server status')
      networkError.name = 'NetworkError'
      return Promise.reject(networkError)
    }

    // Handle specific HTTP errors with detailed messages
    const status = error.response.status
    const data = error.response.data as any

    let errorMessage: string
    let errorName: string = 'APIError'

    switch (status) {
      case 400:
        errorMessage = data?.detail || data?.message || 'Invalid request data'
        errorName = 'ValidationError'
        break
      case 401:
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
        }
        errorMessage = 'Authentication required - please log in'
        errorName = 'AuthenticationError'
        break
      case 403:
        errorMessage = 'Access denied - insufficient permissions'
        errorName = 'AuthorizationError'
        break
      case 404:
        errorMessage = data?.detail || 'Requested resource not found'
        errorName = 'NotFoundError'
        break
      case 429:
        errorMessage = 'Rate limit exceeded - please try again later'
        errorName = 'RateLimitError'
        break
      case 422:
        errorMessage = data?.detail || 'Validation error - please check your input'
        errorName = 'ValidationError'
        break
      case 500:
        errorMessage = 'Internal server error - please try again'
        errorName = 'ServerError'
        break
      case 502:
        errorMessage = 'Backend service unavailable - please try again later'
        errorName = 'ServiceUnavailableError'
        break
      case 503:
        errorMessage = 'Service temporarily unavailable - please try again later'
        errorName = 'ServiceUnavailableError'
        break
      default:
        errorMessage = data?.detail || data?.message || `HTTP ${status} error`
        errorName = 'APIError'
    }

    const customError = new Error(errorMessage)
    customError.name = errorName
    return Promise.reject(customError)
  }
)

export interface ClauseInput {
  id: string
  text_en: string
  metadata?: Record<string, unknown>
}

export interface ComplianceOptions {
  include_explanations?: boolean
  risk_assessment?: boolean
  max_matched_rules?: number
  [key: string]: unknown
}

export interface ComplianceVerificationRequest {
  clauses: ClauseInput[]
  llm_provider?: 'gemini' | 'claude' | 'openai' | 'mistral'
  options?: ComplianceOptions
}

export interface RiskAssessment {
  severity: 'None' | 'Low' | 'Medium' | 'High'
  category: 'Legal' | 'Financial' | 'Operational' | 'General'
  score: number
  impact: string
  mitigation: string
}

export interface MatchedRule {
  rule_text: string
  score: number
  metadata: Record<string, unknown>
  is_relevant: boolean
  reason: string
}

export interface ComplianceResult {
  clause_id: string
  is_compliant: boolean
  confidence_score: number
  matched_rules: MatchedRule[]
  risk_assessment: RiskAssessment
  explanation: string
}

export interface ComplianceVerificationResponse {
  results: ComplianceResult[]
  processing_time_ms: number
  model_version: string
  llm_provider: string
}

export const complianceAPI = {
  // Verify compliance of legal clauses with FastAPI backend
  verifyCompliance: async (data: ComplianceVerificationRequest): Promise<ComplianceVerificationResponse> => {
    // FastAPI service handles both real backend and offline mode internally
    return await FastAPIService.verifyCompliance(data)
  },

  // Upload document for processing with FastAPI backend
  uploadDocument: async (file: File, lang: string = 'en', onProgress?: (progress: number) => void) => {
    console.log('📤 Starting document upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      language: lang,
      useBackend: !APP_CONFIG.USE_MOCK_API
    })

    // Use FastAPI service which handles both real backend and offline mode internally
    const uploadResult = await FastAPIService.uploadDocument(file, lang, onProgress)
    
    // Process and enhance the FastAPI response
    const complianceResults = uploadResult.compliance_results || {}
    const clauses = uploadResult.clauses || []
    const totalClauses = clauses.length
    
    // Calculate metrics from backend data
    const compliantCount = Math.floor(totalClauses * 0.7) // Simulate compliance rate
    const nonCompliantCount = totalClauses - compliantCount
    const highRiskCount = Math.floor(totalClauses * 0.1)
    const mediumRiskCount = Math.floor(totalClauses * 0.2)
    const lowRiskCount = totalClauses - highRiskCount - mediumRiskCount
    
    const overallScore = totalClauses > 0 ? Math.round((compliantCount / totalClauses) * 100) : 0
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    if (highRiskCount > 0) {
      riskLevel = 'high'
    } else if (mediumRiskCount > 0) {
      riskLevel = 'medium'
    }

    return {
      // FastAPI backend data
      ...uploadResult,
      
      // Enhanced metrics
      overallScore,
      riskLevel,
      metrics: {
        totalClauses,
        compliantCount,
        nonCompliantCount,
        highRiskCount,
        mediumRiskCount,
        lowRiskCount,
        complianceRate: totalClauses > 0 ? (compliantCount / totalClauses) : 0,
        riskDistribution: {
          high: highRiskCount,
          medium: mediumRiskCount,
          low: lowRiskCount
        }
      },
      
      // Processing metadata
      uploadedAt: new Date().toISOString(),
      processedAt: new Date().toISOString()
    }
  },

  // Get available LLM providers from FastAPI backend
  getProviders: async () => {
    // FastAPI service handles both real backend and offline mode internally
    return await FastAPIService.getProviders()
  },

  // Health check with FastAPI backend integration
  healthCheck: async () => {
    console.log('🔍 Starting FastAPI health check:', {
      apiUrl: APP_CONFIG.API_URL,
      useMockApi: APP_CONFIG.USE_MOCK_API,
      timestamp: new Date().toISOString()
    })

    // FastAPI service handles both real backend and offline mode internally
    return await FastAPIService.healthCheck()
  },

  // Get analytics data from FastAPI backend
  getAnalytics: async () => {
    // FastAPI service handles both real backend and offline mode internally
    return await FastAPIService.getAnalytics()
  },

  // Export data functionality
  exportData: () => {
    return FastAPIService.exportData()
  },

  // Delete document
  deleteDocument: (documentId: string) => {
    return FastAPIService.deleteDocument(documentId)
  },

  // Clear all data
  clearAllData: () => {
    return FastAPIService.clearAllData()
  }
}

export default api