import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        
        const { token } = response.data;
        
        // Save new token
        localStorage.setItem('token', token);
        
        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          // Clear tokens
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          
          // Redirect to login
          window.location.href = '/app?session=expired';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (phoneNumber: string, password: string) => 
    api.post('/auth/login', { phoneNumber, password }),
  
  register: (userData: any) => 
    api.post('/auth/register', userData),
  
  verifyOtp: (phoneNumber: string, otp: string) => 
    api.post('/auth/verify', { phoneNumber, otp }),
  
  refreshToken: (refreshToken: string) => 
    api.post('/auth/refresh', { refreshToken }),
};

// User API
export const userApi = {
  getProfile: () => 
    api.get('/users/profile'),
  
  updateProfile: (profileData: any) => 
    api.put('/users/profile', profileData),
  
  getKycStatus: () => 
    api.get('/kyc/status'),
  
  submitKyc: (kycData: any) => 
    api.post('/kyc/submit', kycData),
};

// Credit API
export const creditApi = {
  getCreditLimit: () => 
    api.get('/credit/limit'),
  
  getPaymentSchedule: () => 
    api.get('/credit/payment-schedule'),
  
  getTransactions: () => 
    api.get('/transactions'),
  
  getTransaction: (id: string) => 
    api.get(`/transactions/${id}`),
};

// Merchant API
export const merchantApi = {
  register: (merchantData: any) => 
    api.post('/merchants', merchantData),
  
  getProfile: () => 
    api.get('/merchants/profile'),
  
  updateProfile: (profileData: any) => 
    api.put('/merchants/profile', profileData),
  
  generateApiKey: (name: string) => 
    api.post('/merchants/api-keys', { name }),
  
  getApiKeys: () => 
    api.get('/merchants/api-keys'),
  
  revokeApiKey: (id: string) => 
    api.delete(`/merchants/api-keys/${id}`),
  
  getTransactions: (params?: any) => 
    api.get('/merchants/transactions', { params }),
  
  createTransaction: (transactionData: any) => 
    api.post('/merchants/transactions', transactionData),
};

export default api;
