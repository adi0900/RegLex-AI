'use server'

import { APP_CONFIG, isOfflineMode } from '@/lib/config'
import { MockComplianceService } from '@/lib/mock-services'
import type { 
  ComplianceVerificationRequest, 
  ComplianceVerificationResponse,
  ComplianceResult
} from '@/lib/api'

/**
 * Server Action for verifying compliance
 * This runs on the server side for enhanced security and performance
 */
export async function verifyCompliance(
  data: ComplianceVerificationRequest
): Promise<ComplianceVerificationResponse> {
  'use server'
  
  try {
    // In a real implementation, this would call your backend API
    // For now, we'll use the mock service
    if (APP_CONFIG.USE_MOCK_API || isOfflineMode()) {
      const mockResult = await MockComplianceService.verifyCompliance(data)
      // Ensure type compatibility
      return {
        ...mockResult,
        results: mockResult.results.map(result => ({
          ...result,
          risk_assessment: {
            ...result.risk_assessment,
            severity: result.risk_assessment.severity || 'None'
          }
        }))
      } as ComplianceVerificationResponse
    }

    // Real API call would go here
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/compliance/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Compliance verification failed:', error)
    // Fallback to mock service
    const mockResult = await MockComplianceService.verifyCompliance(data)
    return {
      ...mockResult,
      results: mockResult.results.map(result => ({
        ...result,
        risk_assessment: {
          ...result.risk_assessment,
          severity: result.risk_assessment.severity || 'None'
        }
      }))
    } as ComplianceVerificationResponse
  }
}

/**
 * Server Action for uploading documents
 */
export async function uploadDocument(formData: FormData): Promise<any> {
  'use server'
  
  try {
    const file = formData.get('file') as File
    if (!file) {
      throw new Error('No file provided')
    }

    if (APP_CONFIG.USE_MOCK_API || isOfflineMode()) {
      return await MockComplianceService.uploadDocument(file)
    }

    // Real API call would go here
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/compliance/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Document upload failed:', error)
    // Fallback to mock service for demo
    const file = formData.get('file') as File
    return await MockComplianceService.uploadDocument(file)
  }
}

/**
 * Server Action for getting analytics data
 */
export async function getAnalytics() {
  'use server'
  
  try {
    if (APP_CONFIG.USE_MOCK_API || isOfflineMode()) {
      return MockComplianceService.getAnalytics()
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Enable caching for analytics data
      next: { revalidate: 300 }, // 5 minutes
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Analytics fetch failed:', error)
    return MockComplianceService.getAnalytics()
  }
}

/**
 * Server Action for getting LLM providers
 */
export async function getLLMProviders() {
  'use server'
  
  try {
    if (APP_CONFIG.USE_MOCK_API || isOfflineMode()) {
      return MockComplianceService.getProviders()
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/compliance/providers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache provider data for longer since it changes infrequently
      next: { revalidate: 3600 }, // 1 hour
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Providers fetch failed:', error)
    return MockComplianceService.getProviders()
  }
}

export async function healthCheck() {
  // For demo purposes, always return healthy status
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    status: 'healthy' as const,
    service: 'SEBI Compliance API (Demo)',
    version: '1.0.0-demo',
    message: 'Demo service running normally'
  }
}