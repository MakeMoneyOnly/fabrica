// Core API Client with Enterprise Features
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { appConfig } from '@/shared/config/app';

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Create axios instance with enterprise configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: appConfig.api.baseUrl,
    timeout: appConfig.api.timeout,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Version': appConfig.version,
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  // Request interceptor for authentication
  client.interceptors.request.use(
    (config) => {
      // Add correlation ID for tracing
      config.headers['X-Correlation-ID'] = generateCorrelationId();

      // Add authentication token if available
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add Ethiopian timezone header
      config.headers['X-Timezone'] = appConfig.ethiopian.timezone;

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log successful responses in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`API Response [${response.status}]:`, response.config.url);
      }
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized - Token refresh logic
      if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest?._retry) {
        originalRequest._retry = true;
        return handleTokenRefresh(client, originalRequest);
      }

      // Handle network errors
      if (!error.response) {
        return Promise.reject(createNetworkError());
      }

      // Transform error response
      const apiError = transformApiError(error);
      return Promise.reject(apiError);
    }
  );

  return client;
};

// Authentication token management
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('fabrica_auth_token');
};

const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fabrica_auth_token', token);
};

const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('fabrica_auth_token');
};

// Token refresh logic
const handleTokenRefresh = async (client: AxiosInstance, originalRequest: any) => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await client.post('/auth/refresh', { refreshToken });
    const { token: newToken } = response.data;

    setAuthToken(newToken);
    originalRequest.headers.Authorization = `Bearer ${newToken}`;

    return client(originalRequest);
  } catch (refreshError) {
    // Refresh failed - clear tokens and redirect to login
    removeAuthToken();
    removeRefreshToken();

    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login?session=expired';
    }

    return Promise.reject(refreshError);
  }
};

const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('fabrica_refresh_token');
};

const removeRefreshToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('fabrica_refresh_token');
};

// Error transformation
const transformApiError = (error: AxiosError): ApiError => {
  const status = error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const data = error.response?.data as any;

  return {
    code: data?.code || `HTTP_${status}`,
    message: data?.message || error.message || 'An unexpected error occurred',
    details: data?.details,
    timestamp: new Date().toISOString(),
  };
};

const createNetworkError = (): ApiError => ({
  code: 'NETWORK_ERROR',
  message: 'Unable to connect to the server. Please check your internet connection.',
  timestamp: new Date().toISOString(),
});

// Correlation ID generation
const generateCorrelationId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Export the configured API client
export const apiClient = createApiClient();

// Export utility functions
export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.code === 'string' && typeof error.message === 'string';
};

export default apiClient;
