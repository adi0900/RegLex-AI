// Configuration for frontend independence with backend integration
export const APP_CONFIG = {
  // Toggle between mock and real API - now controlled by environment variable
  USE_MOCK_API: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true',
  
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '15000'),
  API_TIMEOUT_UPLOAD: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT_UPLOAD || '600000'), // 10 minutes for uploads
  API_RETRY_ATTEMPTS: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '2'),
  API_RETRY_DELAY: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '2000'),
  
  // Feature flags
  FEATURES: {
    OFFLINE_MODE: true,
    LOCAL_STORAGE: true,
    MOCK_COMPLIANCE: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true',
    ANALYTICS_TRACKING: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    EXPORT_FUNCTIONALITY: true,
    BATCH_UPLOAD: true,
    NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true'
  },
  
  // Mock service configuration
  MOCK_CONFIG: {
    SIMULATE_NETWORK_DELAY: true,
    MIN_DELAY_MS: 800,
    MAX_DELAY_MS: 2500,
    ENABLE_RANDOM_ERRORS: false,
    ERROR_RATE: 0.05 // 5% error rate for testing
  },
  
  // Local storage configuration
  STORAGE_CONFIG: {
    MAX_DOCUMENTS: 100,
    MAX_CLAUSES_PER_DOCUMENT: 50,
    AUTO_CLEANUP: true,
    RETENTION_DAYS: 30
  }
} as const

// Environment-based configuration for API client
export const getApiConfig = () => {
  return {
    baseURL: APP_CONFIG.USE_MOCK_API ? undefined : APP_CONFIG.API_URL,
    timeout: APP_CONFIG.API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
    retries: APP_CONFIG.API_RETRY_ATTEMPTS,
    retryDelay: APP_CONFIG.API_RETRY_DELAY
  }
}

// Specific configuration for upload operations with longer timeouts
export const getUploadApiConfig = () => {
  return {
    baseURL: APP_CONFIG.USE_MOCK_API ? undefined : APP_CONFIG.API_URL,
    timeout: APP_CONFIG.API_TIMEOUT_UPLOAD,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    retries: 1, // Fewer retries for uploads
    retryDelay: APP_CONFIG.API_RETRY_DELAY * 2
  }
}

export const isOfflineMode = () => {
  return APP_CONFIG.USE_MOCK_API || !navigator.onLine
}