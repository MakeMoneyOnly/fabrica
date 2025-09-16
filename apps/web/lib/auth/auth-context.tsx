'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  AuthState,
  AuthContextValue,
  User,
  RegisterData,
  EthVerificationData,
  AuthError
} from './types';

// Action types for authentication reducer
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User } }
  | { type: 'AUTH_FAILURE'; payload: { error: AuthError } }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'SESSION_EXPIRED' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_PROFILE'; payload: { user: User } };

// Authentication reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
        sessionExpired: false,
      };

    case 'AUTH_SUCCESS':
      return {
        user: action.payload.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
        sessionExpired: false,
      };

    case 'AUTH_FAILURE':
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload.error.message,
        sessionExpired: false,
      };

    case 'AUTH_LOGOUT':
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
        sessionExpired: false,
      };

    case 'SESSION_EXPIRED':
      return {
        ...state,
        isAuthenticated: false,
        sessionExpired: true,
        error: 'Your session has expired. Please log in again.',
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: action.payload.user,
        error: null,
      };

    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  sessionExpired: false,
};

// Create authentication context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// API endpoints (should be in environment variables)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Ethiopian-specific authentication provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Ethiopian JWT token management with secure storage
  const getStoredTokens = () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Failed to read tokens from storage:', error);
      return { accessToken: null, refreshToken: null };
    }
  };

  const setStoredTokens = (accessToken: string, refreshToken: string) => {
    try {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  };

  const clearStoredTokens = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  };

  // Ethiopian API request helper with authentication
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const { accessToken } = getStoredTokens();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Handle Ethiopian payment token expiration
    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry the request with new token
        const newAccessToken = getStoredTokens().accessToken;
        const retryHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(options.headers as Record<string, string>),
          'Authorization': `Bearer ${newAccessToken}`,
        };

        return fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers: retryHeaders,
        });
      } else {
        // Session expired, redirect to Ethiopian login
        dispatch({ type: 'SESSION_EXPIRED' });
        throw new Error('Session expired');
      }
    }

    return response;
  };

  // Authentication methods following Ethiopian creator platform standards
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userAgent: navigator.userAgent,
          platform: 'web',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }

      const { user, tokens } = await response.json();

      // Store Ethiopian JWT tokens securely
      setStoredTokens(tokens.accessToken, tokens.refreshToken);

      // Set session cookie for Ethiopian server-side authentication
      document.cookie = `sessionToken=${tokens.accessToken}; path=/; secure; samesite=strict`;

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user },
      });

    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: {
          error: {
            code: 'LOGIN_ERROR',
            message: error instanceof Error ? error.message : 'Login failed',
          },
        },
      });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          registrationSource: 'ethiopian-creator-platform',
          acceptedNewsletters: false, // Ethiopian privacy compliance
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const { user, tokens } = await response.json();

      setStoredTokens(tokens.accessToken, tokens.refreshToken);
      document.cookie = `sessionToken=${tokens.accessToken}; path=/; secure; samesite=strict`;

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user },
      });

    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: {
          error: {
            code: 'REGISTRATION_ERROR',
            message: error instanceof Error ? error.message : 'Registration failed',
          },
        },
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { accessToken } = getStoredTokens();

      // Logout from Ethiopian backend
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      // Even if server logout fails, clear local state
      console.error('Server logout failed:', error);
    } finally {
      // Clear Ethiopian authentication data
      clearStoredTokens();
      document.cookie = 'sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const { refreshToken: storedRefreshToken } = getStoredTokens();

      if (!storedRefreshToken) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: storedRefreshToken,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const tokens = await response.json();
      setStoredTokens(tokens.accessToken, tokens.refreshToken);

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await authenticatedFetch('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      const updatedUser = await response.json();

      dispatch({
        type: 'UPDATE_PROFILE',
        payload: { user: updatedUser },
      });

    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: {
          error: {
            code: 'PROFILE_UPDATE_ERROR',
            message: error instanceof Error ? error.message : 'Profile update failed',
          },
        },
      });
      throw error;
    }
  };

  const verifyEthiopianAccount = async (verificationData: EthVerificationData) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const formData = new FormData();

      formData.append('provider', verificationData.provider);

      if (verificationData.licenseNumber) {
        formData.append('licenseNumber', verificationData.licenseNumber);
      }

      if (verificationData.businessType) {
        formData.append('businessType', verificationData.businessType);
      }

      if (verificationData.documents) {
        verificationData.documents.forEach((doc, index) => {
          formData.append(`documents[${index}]`, doc);
        });
      }

      const response = await authenticatedFetch('/auth/verify-ethiopian', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ethiopian verification failed');
      }

      const { user, tokens: newTokens } = await response.json();

      // Update tokens if provided
      if (newTokens) {
        setStoredTokens(newTokens.accessToken, newTokens.refreshToken);
      }

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user },
      });

    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: {
          error: {
            code: 'ETHIOPIAN_VERIFICATION_ERROR',
            message: error instanceof Error ? error.message : 'Verification failed',
          },
        },
      });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Ethiopian initialization effect - check stored tokens on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { accessToken, refreshToken } = getStoredTokens();

        if (!accessToken) {
          dispatch({ type: 'AUTH_LOGOUT' });
          return;
        }

        // Verify Ethiopian token with backend
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user },
          });
        } else if (refreshToken) {
          // Try refreshing Ethiopian token
          const refreshed = await refreshToken();
          if (refreshed) {
            const newAccessToken = getStoredTokens().accessToken;
            const verifyResponse = await fetch(`${API_BASE_URL}/auth/verify`, {
              headers: {
                'Authorization': `Bearer ${newAccessToken}`,
              },
            });
            if (verifyResponse.ok) {
              const user = await verifyResponse.json();
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user },
              });
            } else {
              dispatch({ type: 'AUTH_LOGOUT' });
            }
          } else {
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  const contextValue: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    verifyEthiopianAccount,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Ethiopian authentication hook with secure error handling
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider - Ethiopian authentication context required'
    );
  }

  return context;
};

// Ethiopian-specific role checking hooks
export const useIsCreator = (): boolean => {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && (
    user?.userType === 'creator' ||
    user?.userType === 'both'
  );
};

export const useIsMerchant = (): boolean => {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && (
    user?.userType === 'merchant' ||
    user?.userType === 'both'
  );
};

export const useIsEthiopianUser = (): boolean => {
  const { user } = useAuth();
  return user?.isEthiopian === true;
};

export const useHasActiveStore = (): boolean => {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && user?.store?.isActive === true;
};

export default AuthContext;
