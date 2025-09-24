// Authentication API Service
import { apiClient, ApiResponse } from '@/shared/api/client';

// Types
export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface RegisterData {
  phoneNumber: string;
  email?: string;
  firstName: string;
  lastName: string;
  password: string;
  userType: 'customer' | 'merchant';
}

export interface OtpVerification {
  phoneNumber: string;
  otp: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  firstName: string;
  lastName: string;
  userType: 'customer' | 'merchant';
  isVerified: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// API Functions
export const authApi = {
  /**
   * Login with phone number and password
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; otpSent: boolean }>> {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Verify OTP for registration/login
   */
  async verifyOtp(verification: OtpVerification): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await apiClient.post('/auth/verify-otp', verification);
    return response.data;
  },

  /**
   * Resend OTP
   */
  async resendOtp(phoneNumber: string): Promise<ApiResponse<{ otpSent: boolean }>> {
    const response = await apiClient.post('/auth/resend-otp', { phoneNumber });
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
