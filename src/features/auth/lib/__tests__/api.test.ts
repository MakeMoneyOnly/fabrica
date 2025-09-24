// Auth API Unit Tests
import { authApi } from '../api';
import { mockApiClient, createMockResponse, createMockError, mockAuthTokens, mockUser } from '@/shared/__mocks__/api-client';

// Mock the API client
jest.mock('@/shared/api/client', () => ({
  apiClient: mockApiClient,
}));

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginCredentials = {
      phoneNumber: '+251911123456',
      password: 'password123',
    };

    it('should login successfully', async () => {
      const mockResponse = createMockResponse({
        user: mockUser,
        tokens: mockAuthTokens,
      });

      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authApi.login(loginCredentials);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', loginCredentials);
      expect(result.data).toEqual({
        user: mockUser,
        tokens: mockAuthTokens,
      });
    });

    it('should handle login failure', async () => {
      const errorMessage = 'Invalid credentials';
      const mockError = createMockError(errorMessage, 401);

      mockApiClient.post.mockRejectedValueOnce(mockError);

      await expect(authApi.login(loginCredentials)).rejects.toThrow();
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', loginCredentials);
    });
  });

  describe('register', () => {
    const registerData = {
      phoneNumber: '+251911123456',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      userType: 'customer' as const,
    };

    it('should register successfully', async () => {
      const mockResponse = createMockResponse({
        user: { ...mockUser, isVerified: false },
        otpSent: true,
      });

      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authApi.register(registerData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(result.data.user.isVerified).toBe(false);
      expect(result.data.otpSent).toBe(true);
    });

    it('should handle registration failure', async () => {
      const errorMessage = 'User already exists';
      const mockError = createMockError(errorMessage, 409);

      mockApiClient.post.mockRejectedValueOnce(mockError);

      await expect(authApi.register(registerData)).rejects.toThrow();
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', registerData);
    });
  });

  describe('verifyOtp', () => {
    const otpVerification = {
      phoneNumber: '+251911123456',
      otp: '123456',
    };

    it('should verify OTP successfully', async () => {
      const mockResponse = createMockResponse({
        user: { ...mockUser, isVerified: true },
        tokens: mockAuthTokens,
      });

      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authApi.verifyOtp(otpVerification);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/verify-otp', otpVerification);
      expect(result.data.user.isVerified).toBe(true);
      expect(result.data.tokens).toEqual(mockAuthTokens);
    });

    it('should handle OTP verification failure', async () => {
      const errorMessage = 'Invalid OTP';
      const mockError = createMockError(errorMessage, 400);

      mockApiClient.post.mockRejectedValueOnce(mockError);

      await expect(authApi.verifyOtp(otpVerification)).rejects.toThrow();
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/verify-otp', otpVerification);
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockResponse = createMockResponse(mockUser);

      mockApiClient.get.mockResolvedValueOnce(mockResponse);

      const result = await authApi.getCurrentUser();

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result.data).toEqual(mockUser);
    });

    it('should handle get current user failure', async () => {
      const errorMessage = 'Unauthorized';
      const mockError = createMockError(errorMessage, 401);

      mockApiClient.get.mockRejectedValueOnce(mockError);

      await expect(authApi.getCurrentUser()).rejects.toThrow();
      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/me');
    });
  });
});
