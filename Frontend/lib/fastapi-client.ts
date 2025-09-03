// FastAPI Backend Integration Client
// Handles direct communication with the local FastAPI backend at http://127.0.0.1:8000

import axios, { AxiosError, AxiosProgressEvent } from 'axios'
import { ErrorHandler } from './error-handler'

// FastAPI Backend Configuration with auto-detection
const FASTAPI_CONFIG = {
  baseURL: 'http://127.0.0.1:8000',
  timeout: 300000, // 5 minutes for document processing
  headers: {
    'Accept': 'application/json',
  }
}

// Connection retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // Start with 1 second
  backoffMultiplier: 2, // Exponential backoff
  healthCheckTimeout: 5000 // 5 seconds for health checks
}

// Create FastAPI client instance
const fastAPIClient = axios.create(FASTAPI_CONFIG)

// Request interceptor
fastAPIClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 FastAPI Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error: AxiosError) => {
    console.error('❌ FastAPI Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
fastAPIClient.interceptors.response.use(
  (response) => {
    console.log(`✅ FastAPI Response: ${response.status} - ${response.config.url}`)
    return response
  },
  (error: AxiosError) => {
    console.error('❌ FastAPI Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })
    
    if (!error.response) {
      throw new Error('FastAPI backend is not running. Please start the server at http://127.0.0.1:8000')
    }
    
    throw error
  }
)

// Types for FastAPI backend communication
export interface FastAPIUploadRequest {
  file: File
  lang?: string
}

export interface FastAPIClause {
  id?: string
  text?: string
  text_en?: string
  [key: string]: any
}

export interface FastAPITimeline {
  start?: string
  end?: string
  description?: string
  [key: string]: any
}

export interface FastAPIComplianceResult {
  clause_id?: string
  is_compliant: boolean
  confidence_score: number
  matched_rules?: Array<{
    rule_text: string
    score: number
    metadata: Record<string, any>
    is_relevant: boolean
    reason: string
  }>
  risk_assessment?: {
    severity: 'None' | 'Low' | 'Medium' | 'High'
    category: 'Legal' | 'Financial' | 'Operational' | 'General'
    score: number
    impact: string
    mitigation: string
  }
  explanation?: string
  [key: string]: any
}

export interface FastAPIResponse {
  summary: string
  timelines: Record<string, FastAPITimeline>
  clauses: FastAPIClause[]
  compliance_results: FastAPIComplianceResult[]
  [key: string]: any
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

// Connection state management
class ConnectionManager {
  private static lastConnectionCheck: number = 0
  private static connectionStatus: 'unknown' | 'online' | 'offline' = 'unknown'
  private static checkInterval = 60000 // Check every minute

  static async isBackendAvailable(): Promise<boolean> {
    const now = Date.now()
    
    // Use cached result if recent
    if (now - this.lastConnectionCheck < this.checkInterval && this.connectionStatus !== 'unknown') {
      return this.connectionStatus === 'online'
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.healthCheckTimeout)

      const response = await fetch(`${FASTAPI_CONFIG.baseURL}/health`, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      clearTimeout(timeoutId)
      
      if (response.ok) {
        this.connectionStatus = 'online'
        this.lastConnectionCheck = now
        return true
      }
      
      throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      this.connectionStatus = 'offline'
      this.lastConnectionCheck = now
      return false
    }
  }

  static resetConnectionCache(): void {
    this.lastConnectionCheck = 0
    this.connectionStatus = 'unknown'
  }
}

// Retry utility with exponential backoff
const retryOperation = async <T>(
  operation: () => Promise<T>,
  context: string,
  retries: number = RETRY_CONFIG.maxRetries
): Promise<T> => {
  let lastError: Error = new Error('Unknown error')

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Check connection before each attempt
      const isAvailable = await ConnectionManager.isBackendAvailable()
      if (!isAvailable && attempt === 1) {
        throw new Error('FastAPI backend is not reachable')
      }

      const result = await operation()
      
      // If successful and it wasn't the first attempt, log recovery
      if (attempt > 1) {
        console.log(`✅ ${context} succeeded on attempt ${attempt}`)
      }
      
      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt === retries) {
        console.error(`❌ ${context} failed after ${retries} attempts:`, lastError.message)
        break
      }

      const delay = RETRY_CONFIG.retryDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1)
      console.warn(`⚠️ ${context} failed on attempt ${attempt}/${retries}, retrying in ${delay}ms:`, lastError.message)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

// FastAPI Service Class with enhanced connection handling
export class FastAPIService {
  
  /**
   * Check if backend is available before operations
   */
  static async checkBackendAvailability(): Promise<boolean> {
    return ConnectionManager.isBackendAvailable()
  }

  /**
   * Reset connection cache (useful after backend restart)
   */
  static resetConnection(): void {
    ConnectionManager.resetConnectionCache()
  }

  /**
   * Upload document to FastAPI backend for processing with retry logic
   */
  static async uploadDocument(
    request: FastAPIUploadRequest,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FastAPIResponse> {
    const uploadOperation = async (): Promise<FastAPIResponse> => {
      const formData = new FormData()
      formData.append('file', request.file)
      formData.append('lang', request.lang || 'en')

      console.log(`📄 Uploading document: ${request.file.name} (${request.file.size} bytes)`)

      const response = await fastAPIClient.post<FastAPIResponse>('/upload-pdf/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: FASTAPI_CONFIG.timeout,
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
            }
            onProgress(progress)
          }
        },
      })

      console.log('✅ Document processed successfully:', {
        summary_length: response.data.summary?.length || 0,
        clauses_count: response.data.clauses?.length || 0,
        compliance_results_count: response.data.compliance_results?.length || 0,
        timelines_count: Object.keys(response.data.timelines || {}).length
      })

      return response.data
    }

    try {
      // Use retry logic for upload operation
      return await retryOperation(
        uploadOperation,
        `Document upload for ${request.file.name}`,
        RETRY_CONFIG.maxRetries
      )
    } catch (error) {
      console.error('❌ Document upload failed after all retries:', error)
      
      // Use enhanced error handling
      const appError = ErrorHandler.handleUploadError(error, request.file.name)
      throw new Error(ErrorHandler.getUserMessage(appError))
    }
  }

  /**
   * Check FastAPI backend health status with retry
   */
  static async healthCheck(): Promise<{ status: string; message: string }> {
    const healthCheckOperation = async () => {
      const response = await fastAPIClient.get('/health', {
        timeout: RETRY_CONFIG.healthCheckTimeout
      })
      console.log('💚 FastAPI backend is healthy')
      return response.data
    }

    try {
      return await retryOperation(
        healthCheckOperation,
        'Health check',
        2 // Fewer retries for health checks
      )
    } catch (error) {
      console.error('💔 FastAPI backend health check failed after retries:', error)
      const appError = ErrorHandler.handleFastAPIError(error, { operation: 'health_check' })
      throw new Error(ErrorHandler.getUserMessage(appError))
    }
  }

  /**
   * Test backend connectivity with caching
   */
  static async testConnection(): Promise<boolean> {
    return ConnectionManager.isBackendAvailable()
  }

  /**
   * Get processing status for uploaded document
   */
  static async getProcessingStatus(documentId: string): Promise<any> {
    try {
      // This would be implemented if the backend supports status checking
      const response = await fastAPIClient.get(`/status/${documentId}`)
      return response.data
    } catch (error) {
      console.warn('Status endpoint not available, using direct processing')
      return { status: 'completed' }
    }
  }
}

// Utility functions for data transformation
export class FastAPIDataTransformer {
  
  /**
   * Transform FastAPI response to frontend format
   */
  static transformToFrontend(backendData: FastAPIResponse, fileName: string) {
    const complianceResults = backendData.compliance_results || []
    const clauses = backendData.clauses || []
    
    // Calculate metrics
    const compliantCount = complianceResults.filter(r => r.is_compliant).length
    const nonCompliantCount = complianceResults.filter(r => !r.is_compliant).length
    const totalClauses = complianceResults.length || clauses.length || 0
    
    // Calculate overall score
    const overallScore = totalClauses > 0 
      ? Math.round((compliantCount / totalClauses) * 100) 
      : 0

    // Determine risk level
    const highRiskCount = complianceResults.filter(r => r.risk_assessment?.severity === 'High').length
    const mediumRiskCount = complianceResults.filter(r => r.risk_assessment?.severity === 'Medium').length
    
    let riskLevel = 'low'
    if (highRiskCount > 0) riskLevel = 'high'
    else if (mediumRiskCount > 0) riskLevel = 'medium'

    return {
      // Document metadata
      fileName,
      uploadedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      
      // Analysis results
      summary: backendData.summary || '',
      overallScore,
      riskLevel,
      totalClauses,
      compliantCount,
      nonCompliantCount,
      highRiskCount,
      mediumRiskCount,
      
      // Raw data for detailed analysis
      timelines: backendData.timelines || {},
      clauses: clauses,
      complianceResults: complianceResults,
      
      // Full backend response for reference
      rawBackendData: backendData
    }
  }

  /**
   * Format timeline data for display
   */
  static formatTimelines(timelines: Record<string, FastAPITimeline>) {
    return Object.entries(timelines).map(([key, timeline]) => ({
      id: key,
      title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      start: timeline.start || '',
      end: timeline.end || '',
      description: timeline.description || '',
      type: 'timeline'
    }))
  }

  /**
   * Format compliance results for analysis view
   */
  static formatComplianceResults(results: FastAPIComplianceResult[], clauses: FastAPIClause[]) {
    return results.map((result, index) => {
      const clause = clauses.find(c => c.id === result.clause_id) || clauses[index]
      
      return {
        id: result.clause_id || `clause_${index + 1}`,
        clauseText: clause?.text_en || clause?.text || `Clause ${index + 1}`,
        isCompliant: result.is_compliant,
        confidence: Math.round((result.confidence_score || 0) * 100),
        riskLevel: result.risk_assessment?.severity?.toLowerCase() || 'low',
        category: result.risk_assessment?.category || 'General',
        impact: result.risk_assessment?.impact || '',
        mitigation: result.risk_assessment?.mitigation || '',
        explanation: result.explanation || '',
        matchedRules: result.matched_rules || []
      }
    })
  }
}

export default FastAPIService