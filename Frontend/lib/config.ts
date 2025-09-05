// Configuration for different deployment environments
export const getApiUrl = (): string => {
  // Check for explicit API URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Auto-detect Vercel preview/production URLs
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // If on Vercel, construct backend URL
    if (hostname.includes('vercel.app')) {
      // Replace frontend subdomain with backend
      const backendUrl = hostname.replace('sebi-compliance-frontend', 'sebi-compliance-backend');
      return `https://${backendUrl}`;
    }
  }

  // Fallback to localhost for development
  return 'http://127.0.0.1:8000';
};

export const config = {
  apiUrl: getApiUrl(),
  useMockApi: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false',
  enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
  apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '300000'),
  environment: process.env.NODE_ENV || 'development',
};