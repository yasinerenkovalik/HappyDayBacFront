/**
 * Centralized configuration for API endpoints and environment settings
 * This file manages all API URLs from a single location
 */

// Environment-based API configuration
const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isClient = typeof window !== 'undefined';

  // Base API URL from environment variables
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:8080/api';

  return {
    // Base API URL
    baseUrl,
    
    // Internal proxy URL (for client-side requests)
    proxyUrl: '/api/proxy',
    
    // Development mode flag
    isDevelopment,
    
    // Client/Server side detection
    isClient,
    
    // Specific endpoint configurations
    endpoints: {
      // Organization endpoints
      organizations: {
        getAll: '/Organization/OrganizationGetAll',
        getFeatured: '/Organization/GetFeatured',
        getDetail: '/Organization/GetOrganizationWithImages',
        filter: '/Organization/Filter'
      },
      
      // Category endpoints
      categories: {
        getAll: '/Category/CategoryGetAll'
      },
      
      // City endpoints
      cities: {
        getAll: '/City/CityGetAll',
        getDistricts: '/District/GetAllDisctrictByCity'
      },
      
      // Contact endpoints
      contact: {
        send: '/ContactMessage/add',
        sendForm: '/Concat/add',
        getAll: '/Concat/ContactGetAll',
        getById: '/Concat/getbyid',
        getCompanyMessages: '/ContactMessage/CompanyContactMessage'
      },
      
      // Auth endpoints
      auth: {
        login: '/auth/login',
        checkVerification: '/auth/check-verification-status',
        confirmEmail: '/auth/confirm-email',
        resendVerification: '/auth/resend-verification'
      },
      
      // Admin endpoints
      admin: {
        invitations: {
          create: '/admin/invitations/create',
          getAll: '/admin/invitations'
        }
      },
      
      // Company endpoints
      company: {
        registerByInvite: '/company/register-by-invite',
        requestPasswordReset: '/company/request-password-reset',
        resetPassword: '/company/reset-password'
      },
      
      // Health check
      health: '/health'
    }
  };
};

// Export configuration
export const apiConfig = getApiConfig();

/**
 * Get full URL for an endpoint
 * @param endpoint - The endpoint path
 * @param useProxy - Whether to use internal proxy (default: true for client-side)
 * @returns Full URL for the endpoint
 */
export const getEndpointUrl = (endpoint: string, useProxy: boolean = apiConfig.isClient): string => {
  if (useProxy && apiConfig.isClient) {
    return `${apiConfig.proxyUrl}${endpoint}`;
  }
  return `${apiConfig.baseUrl}${endpoint}`;
};

/**
 * Development helper to switch between local and remote APIs
 */
export const switchToLocal = () => {
  console.log('🔧 API Configuration switched to LOCAL');
  console.log('📍 Base URL:', 'http://localhost:8080/api');
  console.log('💡 To switch back to remote, update .env.local file');
};

export const switchToRemote = () => {
  console.log('🔧 API Configuration switched to REMOTE');
  console.log('📍 Base URL:', 'http://0.0.0.0/api');
  console.log('💡 To switch back to local, update .env.local file');
};

// Log current configuration in development
if (apiConfig.isDevelopment) {
  console.log('🔧 API Configuration loaded:');
  console.log('📍 Base URL:', apiConfig.baseUrl);
  console.log('🔄 Proxy URL:', apiConfig.proxyUrl);
  console.log('🌍 Environment:', process.env.NODE_ENV);
  console.log('🖥️ Client Side:', apiConfig.isClient);
}