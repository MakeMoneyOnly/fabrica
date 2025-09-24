// Authentication Business Logic Hooks
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, LoginCredentials, RegisterData, OtpVerification } from './api';
import { useRouter } from 'next/navigation';

// Query Keys
export const authQueryKeys = {
  currentUser: ['auth', 'currentUser'] as const,
};

// Custom hooks for authentication
export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get current user
  const {
    data: user,
    isLoading,
    error,
    refetch: refetchUser,
  } = useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: () => authApi.getCurrentUser().then(res => res.data),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authApi.login(credentials).then(res => res.data),
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('fabrica_auth_token', data.tokens.accessToken);
      localStorage.setItem('fabrica_refresh_token', data.tokens.refreshToken);

      // Update user cache
      queryClient.setQueryData(authQueryKeys.currentUser, data.user);

      // Redirect based on user type
      if (data.user.userType === 'merchant') {
        router.push('/merchant/dashboard');
      } else {
        router.push('/app/dashboard');
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) =>
      authApi.register(userData).then(res => res.data),
    onSuccess: (data) => {
      // Store phone number for OTP verification
      sessionStorage.setItem('pending_verification', data.user.phoneNumber);
      router.push('/auth/verify');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });

  // OTP verification mutation
  const verifyOtpMutation = useMutation({
    mutationFn: (verification: OtpVerification) =>
      authApi.verifyOtp(verification).then(res => res.data),
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('fabrica_auth_token', data.tokens.accessToken);
      localStorage.setItem('fabrica_refresh_token', data.tokens.refreshToken);

      // Clear pending verification
      sessionStorage.removeItem('pending_verification');

      // Update user cache
      queryClient.setQueryData(authQueryKeys.currentUser, data.user);

      // Redirect based on user type
      if (data.user.userType === 'merchant') {
        router.push('/merchant/onboarding');
      } else {
        router.push('/app/welcome');
      }
    },
    onError: (error) => {
      console.error('OTP verification failed:', error);
    },
  });

  // Resend OTP mutation
  const resendOtpMutation = useMutation({
    mutationFn: (phoneNumber: string) =>
      authApi.resendOtp(phoneNumber).then(res => res.data),
    onSuccess: () => {
      // Show success message
      console.log('OTP resent successfully');
    },
    onError: (error) => {
      console.error('Resend OTP failed:', error);
    },
  });

  // Logout function
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('fabrica_auth_token');
      localStorage.removeItem('fabrica_refresh_token');

      // Clear user cache
      queryClient.removeQueries({ queryKey: authQueryKeys.currentUser });

      // Redirect to login
      router.push('/auth/login');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user && !!localStorage.getItem('fabrica_auth_token');

  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    error,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    resendOtp: resendOtpMutation.mutate,
    logout,
    refetchUser,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isVerifyingOtp: verifyOtpMutation.isPending,
    isResendingOtp: resendOtpMutation.isPending,

    // Errors
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    verifyOtpError: verifyOtpMutation.error,
    resendOtpError: resendOtpMutation.error,
  };
};

// Hook for checking authentication status
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
};
